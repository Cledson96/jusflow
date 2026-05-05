import { BadRequestException, Injectable } from "@nestjs/common";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantAccess: TenantAccessService,
    private readonly audit: AuditService
  ) {}

  list(organizationId: string, user: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    return this.prisma.lead.findMany({
      where: { organizationId },
      include: { client: true, cases: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async create(organizationId: string, user: any, input: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    if (!input.origin) {
      throw new BadRequestException("Lead origin is required");
    }

    const lead = await this.prisma.lead.create({
      data: {
        organizationId,
        clientId: input.clientId,
        origin: input.origin,
        notes: input.notes
      },
      include: { client: true }
    });

    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "lead.created",
      entityType: "lead",
      entityId: lead.id
    });

    return lead;
  }
}
