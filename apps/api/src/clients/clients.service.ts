import { BadRequestException, Injectable } from "@nestjs/common";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantAccess: TenantAccessService,
    private readonly audit: AuditService
  ) {}

  list(organizationId: string, user: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    return this.prisma.client.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" }
    });
  }

  async create(organizationId: string, user: any, input: any) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    if (!input.name) {
      throw new BadRequestException("Client name is required");
    }

    const client = await this.prisma.client.create({
      data: {
        organizationId,
        name: input.name,
        phone: input.phone,
        email: input.email,
        cpf: input.cpf,
        city: input.city,
        state: input.state
      }
    });

    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "client.created",
      entityType: "client",
      entityId: client.id
    });

    return client;
  }
}
