import { describe, expect, it } from "vitest";
import { defaultPipeline, laborCaseTypes } from "./index";

describe("JurisFlow shared defaults", () => {
  it("defines the MVP pipeline in the order lawyers work leads", () => {
    expect(defaultPipeline.map((stage) => stage.key)).toEqual([
      "NEW_CONTACT",
      "TRIAGE_PENDING",
      "WAITING_DOCUMENTS",
      "LAWYER_REVIEW",
      "CONSULTATION_SCHEDULED",
      "PROPOSAL_SENT",
      "CLIENT_CONTRACTED",
      "LOST",
      "CLOSED"
    ]);
  });

  it("starts with labor case types only", () => {
    expect(laborCaseTypes).toContain("Vinculo PJ/CLT");
    expect(laborCaseTypes).not.toContain("Previdenciario");
  });
});
