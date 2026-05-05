import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignJWT } from "jose";

type Membership = {
  organizationId: string;
  role: string;
  organization: { id: string; name: string; slug: string };
};

type AuthorizedUser = {
  id: string;
  authUserId: string;
  email: string;
  name: string;
  memberships: Membership[];
};

function normalizeApiUrl(value: string) {
  const trimmed = value.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const apiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "JurisFlow",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!response.ok) {
          return null;
        }

        const user = (await response.json()) as {
          id: string;
          authUserId: string;
          email: string;
          name?: string | null;
          memberships: {
            organizationId: string;
            role: string;
            organization: { id: string; name: string; slug: string };
          }[];
        };

        return {
          id: user.id,
          authUserId: user.authUserId,
          email: user.email,
          name: user.name ?? user.email,
          memberships: user.memberships
        } satisfies AuthorizedUser;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authorizedUser = user as typeof user & AuthorizedUser;
        token.userId = user.id;
        token.authUserId = authorizedUser.authUserId;
        token.memberships = authorizedUser.memberships;
        token.name = user.name;
        token.email = user.email;

        if (process.env.AUTH_SECRET) {
          token.apiAccessToken = await new SignJWT({ email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuer("jurisflow-web")
            .setAudience("jurisflow-api")
            .setSubject(authorizedUser.authUserId)
            .setExpirationTime("12h")
            .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: (token.userId as string | undefined) ?? "",
        name: (token.name as string | undefined) ?? session.user?.name ?? "",
        email: (token.email as string | undefined) ?? session.user?.email ?? ""
      };
      session.accessToken = token.apiAccessToken as string | undefined;
      session.memberships = token.memberships as
        | {
            organizationId: string;
            role: string;
            organization: { id: string; name: string; slug: string };
          }[]
        | undefined;
      return session;
    }
  }
});
