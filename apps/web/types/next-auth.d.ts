import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    memberships?: {
      organizationId: string;
      role: string;
      organization: { id: string; name: string; slug: string };
    }[];
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    authUserId?: string;
    apiAccessToken?: string;
    memberships?: {
      organizationId: string;
      role: string;
      organization: { id: string; name: string; slug: string };
    }[];
  }
}
