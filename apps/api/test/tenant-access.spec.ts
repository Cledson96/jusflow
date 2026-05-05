import { ForbiddenException } from "@nestjs/common";
import { TenantAccessService } from "../src/common/tenant-access.service";

describe("TenantAccessService", () => {
  it("allows a user who belongs to the requested organization", () => {
    const service = new TenantAccessService();

    const result = service.assertMembership({
      organizationId: "org_a",
      memberships: [{ organizationId: "org_a", role: "OWNER" }]
    });

    expect(result.role).toBe("OWNER");
  });

  it("blocks a user from reading another organization's data", () => {
    const service = new TenantAccessService();

    expect(() =>
      service.assertMembership({
        organizationId: "org_b",
        memberships: [{ organizationId: "org_a", role: "LAWYER" }]
      })
    ).toThrow(ForbiddenException);
  });
});
