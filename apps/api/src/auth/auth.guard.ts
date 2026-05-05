import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { jwtVerify } from "jose";
import { PrismaService } from "../prisma/prisma.service";

type AuthTokenPayload = {
  sub?: string;
  email?: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authUserId, email } = await this.resolveIdentity(request);

    const user = await this.prisma.user.upsert({
      where: { authUserId },
      update: { email },
      create: { authUserId, email, name: email.split("@")[0] },
      include: { memberships: true }
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    request.organizationId = request.headers["x-organization-id"]?.toString();
    return true;
  }

  private async resolveIdentity(
    request: { headers: Record<string, string | string[] | undefined> }
  ): Promise<{ authUserId: string; email: string }> {
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      return {
        authUserId: request.headers["x-user-id"]?.toString() ?? "dev-user",
        email: request.headers["x-user-email"]?.toString() ?? "demo@jurisflow.local"
      };
    }

    const authorization = request.headers.authorization?.toString();
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing auth bearer token.");
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw new UnauthorizedException("Missing auth bearer token.");
    }

    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(secret), {
        issuer: "jurisflow-web",
        audience: "jurisflow-api"
      });
      const payload = verified.payload as AuthTokenPayload;

      if (!payload.sub) {
        throw new UnauthorizedException("Invalid auth token subject.");
      }

      return {
        authUserId: payload.sub,
        email: typeof payload.email === "string" ? payload.email : `${payload.sub}@jurisflow.local`
      };
    } catch {
      throw new UnauthorizedException("Invalid auth token.");
    }
  }
}
