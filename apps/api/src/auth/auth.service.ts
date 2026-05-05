import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { hash, compare } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { OrganizationsService } from "../organizations/organizations.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizations: OrganizationsService
  ) {}

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException("Email ou senha invalidos.");
    }

    const matches = await compare(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException("Email ou senha invalidos.");
    }

    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        id: true,
        authUserId: true,
        email: true,
        name: true,
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
    organizationName: string;
  }) {
    const email = input.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Ja existe um usuario com este email.");
    }

    const passwordHash = await hash(input.password, 10);
    const user = await this.prisma.user.create({
      data: {
        authUserId: `auth_${randomUUID()}`,
        email,
        name: input.name.trim(),
        passwordHash
      }
    });

    await this.organizations.createOrganization(user.id, {
      name: input.organizationName.trim()
    });

    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: {
        id: true,
        authUserId: true,
        email: true,
        name: true,
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
  }
}
