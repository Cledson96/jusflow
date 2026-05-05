import { UnauthorizedException } from "@nestjs/common";
import { hash } from "bcryptjs";
import { AuthService } from "../src/auth/auth.service";

describe("AuthService", () => {
  it("returns the public user profile when credentials are valid", async () => {
    const passwordHash = await hash("segredo123", 10);
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: "user_1",
          authUserId: "auth_user_1",
          email: "advogado@jurisflow.local",
          name: "Advogado",
          passwordHash,
          memberships: []
        }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: "user_1",
          authUserId: "auth_user_1",
          email: "advogado@jurisflow.local",
          name: "Advogado",
          memberships: []
        })
      }
    };
    const organizations = {
      createOrganization: jest.fn()
    };
    const service = new AuthService(prisma as any, organizations as any);

    const result = await service.login({
      email: "advogado@jurisflow.local",
      password: "segredo123"
    });

    expect(result.authUserId).toBe("auth_user_1");
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalled();
  });

  it("rejects invalid passwords", async () => {
    const passwordHash = await hash("segredo123", 10);
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: "user_1",
          authUserId: "auth_user_1",
          email: "advogado@jurisflow.local",
          name: "Advogado",
          passwordHash,
          memberships: []
        })
      }
    };
    const organizations = {
      createOrganization: jest.fn()
    };
    const service = new AuthService(prisma as any, organizations as any);

    await expect(
      service.login({
        email: "advogado@jurisflow.local",
        password: "senha-errada"
      })
    ).rejects.toThrow(UnauthorizedException);
  });
});
