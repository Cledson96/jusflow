import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CaseStatus } from "@prisma/client";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantAccess: TenantAccessService,
    private readonly audit: AuditService
  ) {}

  async meta(organizationId: string, user: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const [stages, caseTypes] = await Promise.all([
      this.prisma.pipelineStage.findMany({ where: { organizationId }, orderBy: { order: "asc" } }),
      this.prisma.caseType.findMany({ where: { organizationId }, orderBy: { name: "asc" } })
    ]);
    return { stages, caseTypes };
  }

  async dashboard(organizationId: string, user: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const [cases, documentsPending, aiRuns] = await Promise.all([
      this.prisma.case.findMany({
        where: { organizationId },
        include: { client: true, caseType: true },
        orderBy: { updatedAt: "desc" },
        take: 8
      }),
      this.prisma.caseDocument.count({
        where: { case: { organizationId }, status: "PENDING" }
      }),
      this.prisma.aiRun.count({ where: { organizationId } })
    ]);

    const byStatus = await this.prisma.case.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: { status: true }
    });

    return { cases, documentsPending, aiRuns, byStatus };
  }

  list(organizationId: string, user: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    return this.prisma.case.findMany({
      where: { organizationId },
      include: { client: true, caseType: true, pipelineStage: true, documents: true },
      orderBy: { updatedAt: "desc" }
    });
  }

  async get(organizationId: string, user: any, id: string) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const item = await this.prisma.case.findFirst({
      where: { id, organizationId },
      include: {
        client: true,
        caseType: true,
        pipelineStage: true,
        triageAnswers: { include: { question: true }, orderBy: { question: { order: "asc" } } },
        documents: { include: { documentItem: true }, orderBy: { documentItem: { order: "asc" } } },
        aiRuns: { orderBy: { createdAt: "desc" }, take: 3 },
        whatsappMessages: { orderBy: { createdAt: "desc" }, take: 3 }
      }
    });
    if (!item) throw new NotFoundException("Case not found");
    return item;
  }

  async create(organizationId: string, user: any, input: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    if (!input.clientId || !input.caseTypeId || !input.title) {
      throw new BadRequestException("clientId, caseTypeId and title are required");
    }

    const stage = await this.prisma.pipelineStage.findFirst({
      where: { organizationId, key: "NEW_CONTACT" }
    });

    const created = await this.prisma.case.create({
      data: {
        organizationId,
        clientId: input.clientId,
        leadId: input.leadId,
        caseTypeId: input.caseTypeId,
        title: input.title,
        status: "NEW_CONTACT",
        pipelineStageId: stage?.id
      },
      include: { client: true, caseType: true }
    });

    await this.createDocumentPlaceholders(created.id, created.caseTypeId);
    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "case.created",
      entityType: "case",
      entityId: created.id
    });
    return created;
  }

  async move(organizationId: string, user: any, id: string, status: string) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    if (!Object.values(CaseStatus).includes(status as CaseStatus)) {
      throw new BadRequestException("Invalid status");
    }
    const stage = await this.prisma.pipelineStage.findFirst({
      where: { organizationId, key: status as CaseStatus }
    });
    const updated = await this.prisma.case.update({
      where: { id },
      data: { status: status as CaseStatus, pipelineStageId: stage?.id }
    });
    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "case.stage_updated",
      entityType: "case",
      entityId: id,
      metadata: { status }
    });
    return updated;
  }

  private async createDocumentPlaceholders(caseId: string, caseTypeId: string) {
    const checklist = await this.prisma.documentChecklist.findFirst({
      where: { caseTypeId },
      include: { items: true }
    });
    if (!checklist) return;
    for (const item of checklist.items) {
      await this.prisma.caseDocument.upsert({
        where: { caseId_documentItemId: { caseId, documentItemId: item.id } },
        update: {},
        create: { caseId, documentItemId: item.id, status: "PENDING" }
      });
    }
  }
}
