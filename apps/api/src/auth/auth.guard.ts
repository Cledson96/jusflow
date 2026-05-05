import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { PrismaService } from "../prisma/prisma.service";

type ClerkJwtPayload = {
  iss?: string;
  sub?: string;
  email?: string;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { clerkId, email } = await this.resolveIdentity(request);

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

  private async resolveIdentity(
    request: { headers: Record<string, string | string[] | undefined> }
  ): Promise<{ clerkId: string; email: string }> {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const issuer = process.env.CLERK_JWT_ISSUER;

    if (!secretKey || !issuer) {
      return {
        clerkId: request.headers["x-user-id"]?.toString() ?? "dev-user",
        email: request.headers["x-user-email"]?.toString() ?? "demo@jurisflow.local"
      };
    }

    const authorization = request.headers.authorization?.toString();
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing Clerk bearer token.");
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw new UnauthorizedException("Missing Clerk bearer token.");
    }

    try {
      const verified = await verifyToken(token, { secretKey });
      if (!verified.data) {
        throw new UnauthorizedException("Invalid Clerk token.");
      }

      const payload = verified.data as ClerkJwtPayload;
      if (payload.iss !== issuer) {
        throw new UnauthorizedException("Invalid Clerk token issuer.");
      }

      const clerkId = payload.sub;

      if (!clerkId) {
        throw new UnauthorizedException("Invalid Clerk token subject.");
      }

      const email =
        request.headers["x-user-email"]?.toString() ??
        (typeof payload.email === "string" ? payload.email : `${clerkId}@clerk.local`);

      return { clerkId, email };
    } catch {
      throw new UnauthorizedException("Invalid Clerk token.");
    }
  }
}
