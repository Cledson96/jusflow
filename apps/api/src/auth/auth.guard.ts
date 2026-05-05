import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clerkId = request.headers["x-user-id"]?.toString() ?? "dev-user";
    const email = request.headers["x-user-email"]?.toString() ?? "demo@jurisflow.local";

    const user = await this.prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email, name: email.split("@")[0] },
      include: { memberships: true }
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    request.organizationId = request.headers["x-organization-id"]?.toString();
    return true;
  }
}
