import { NotFoundException } from "@nestjs/common";
import { CasesService } from "../src/cases/cases.service";

describe("CasesService", () => {
  it("does not move a case that is outside the requested organization", async () => {
    const prisma = {
      case: {
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn()
      },
      pipelineStage: {
        findFirst: jest.fn()
      }
    };
    const tenantAccess = {
      assertMembership: jest.fn().mockReturnValue({ role: "LAWYER" })
    };
    const audit = {
      record: jest.fn()
    };
    const service = new CasesService(prisma as any, tenantAccess as any, audit as any);

    await expect(
      service.move(
        "org_a",
        { id: "user_a", memberships: [{ organizationId: "org_a", role: "LAWYER" }] },
        "case_from_org_b",
        "LAWYER_REVIEW"
      )
    ).rejects.toThrow(NotFoundException);

    expect(prisma.case.update).not.toHaveBeenCalled();
  });
});
