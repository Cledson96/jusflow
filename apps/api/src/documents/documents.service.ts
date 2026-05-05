import { Injectable, NotFoundException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantAccess: TenantAccessService,
    private readonly audit: AuditService
  ) {}

  async list(organizationId: string, user: any, caseId: string) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    await this.assertCase(organizationId, caseId);
    const documents = await this.prisma.caseDocument.findMany({
      where: { caseId },
      include: { documentItem: true },
      orderBy: { documentItem: { order: "asc" } }
    });
    return Promise.all(
      documents.map(async (document) => ({
        ...document,
        signedUrl: document.storagePath ? await this.getSignedUrl(document.storagePath) : null
      }))
    );
  }

  async update(organizationId: string, user: any, caseId: string, documentId: string, input: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    await this.assertCase(organizationId, caseId);
    const existing = await this.prisma.caseDocument.findFirst({
      where: { id: documentId, caseId, case: { organizationId } }
    });
    if (!existing) throw new NotFoundException("Document not found");

    const storagePath =
      input.fileName && input.base64
        ? `${organizationId}/${caseId}/${documentId}/${input.fileName}`
        : input.storagePath;

    if (input.fileName && input.base64) {
      await this.upload(storagePath, input.base64, input.contentType);
    }

    const updated = await this.prisma.caseDocument.update({
      where: { id: documentId },
      data: {
        status: input.status,
        fileName: input.fileName,
        storagePath,
        contentType: input.contentType,
        sizeBytes: input.sizeBytes
      },
      include: { documentItem: true }
    });
    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "document.updated",
      entityType: "case_document",
      entityId: documentId,
      metadata: { status: input.status }
    });
    return updated;
  }

  private async assertCase(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({ where: { id: caseId, organizationId } });
    if (!caseRecord) throw new NotFoundException("Case not found");
  }

  private client() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
  }

  private async upload(path: string, base64: string, contentType?: string) {
    const client = this.client();
    if (!client) return;
    const buffer = Buffer.from(base64, "base64");
    await client.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET ?? "case-documents")
      .upload(path, buffer, { contentType, upsert: true });
  }

  private async getSignedUrl(path: string) {
    const client = this.client();
    if (!client) return null;
    const { data } = await client.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET ?? "case-documents")
      .createSignedUrl(path, 60 * 10);
    return data?.signedUrl ?? null;
  }
}
