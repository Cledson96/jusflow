import { AiService } from "../src/ai/ai.service";

describe("AiService", () => {
  it("creates a triage summary draft with relevant labor points and WhatsApp text", async () => {
    const service = new AiService({
      generateTriageSummary: async () => ({
        summary: "Cliente trabalhou como PJ com horario fixo e gestor direto.",
        relevantPoints: ["possivel subordinação", "possivel habitualidade"],
        missingDocuments: ["contrato PJ", "notas fiscais"],
        suggestedQuestions: ["Havia controle de horario?"],
        urgency: "HIGH",
        whatsappMessage: "Ola, envie contrato PJ e notas fiscais para avancarmos."
      })
    });

    const result = await service.generateTriageSummary({
      clientName: "Joao Silva",
      caseType: "Vinculo PJ/CLT",
      answers: {
        periodo: "2 anos",
        horarioFixo: "sim",
        gestorDireto: "sim"
      },
      documents: []
    });

    expect(result.promptVersion).toBe("triage_summary_v1");
    expect(result.output.urgency).toBe("HIGH");
    expect(result.output.whatsappMessage).toContain("contrato PJ");
  });
});
