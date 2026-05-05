import { Injectable, NotFoundException } from "@nestjs/common";
import { Inject, Optional } from "@nestjs/common";
import type { AiTriageSummary } from "@jurisflow/shared";
import { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

export interface TriageSummaryInput {
  clientName: string;
  caseType: string;
  answers: Record<string, string>;
  documents: string[];
}

export interface AiProvider {
  generateTriageSummary(input: TriageSummaryInput): Promise<AiTriageSummary>;
}

export const TRIAGE_PROMPT_VERSION = "triage_summary_v1";

@Injectable()
export class AiService {
  private readonly provider: AiProvider;

  constructor(
    @Optional() @Inject("AI_PROVIDER") provider?: AiProvider,
    private readonly prisma?: PrismaService,
    private readonly tenantAccess?: TenantAccessService,
    private readonly audit?: AuditService
  ) {
    this.provider = provider ?? (process.env.OPENAI_API_KEY ? new OpenAiProvider() : new RuleBasedAiProvider());
  }

  async generateTriageSummary(input: TriageSummaryInput) {
    const output = await this.provider.generateTriageSummary(input);
    return {
      promptVersion: TRIAGE_PROMPT_VERSION,
      model: process.env.OPENAI_MODEL ?? "rule-based",
      output
    };
  }

  async generateForCase(organizationId: string, user: any, caseId: string) {
    if (!this.prisma || !this.tenantAccess || !this.audit) {
      throw new Error("AiService persistence dependencies were not configured");
    }
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId },
      include: {
        client: true,
        caseType: true,
        triageAnswers: { include: { question: true } },
        documents: { include: { documentItem: true } }
      }
    });
    if (!caseRecord) throw new NotFoundException("Case not found");

    const answers = Object.fromEntries(
      caseRecord.triageAnswers.map((answer) => [answer.question.fieldKey, answer.value])
    );
    const documents = caseRecord.documents
      .filter((document) => document.status === "RECEIVED")
      .map((document) => document.documentItem.name);
    const result = await this.generateTriageSummary({
      clientName: caseRecord.client.name,
      caseType: caseRecord.caseType.name,
      answers,
      documents
    });

    const aiRun = await this.prisma.aiRun.create({
      data: {
        organizationId,
        caseId,
        promptVersion: result.promptVersion,
        model: result.model,
        output: result.output as unknown as Prisma.InputJsonValue
      }
    });
    await this.prisma.whatsappMessage.create({
      data: { caseId, body: result.output.whatsappMessage }
    });
    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "ai.triage_summary.generated",
      entityType: "case",
      entityId: caseId
    });
    return aiRun;
  }
}

class RuleBasedAiProvider implements AiProvider {
  async generateTriageSummary(input: TriageSummaryInput): Promise<AiTriageSummary> {
    const text = Object.values(input.answers).join(" ").toLowerCase();
    const relevantPoints = [
      text.includes("horario") || text.includes("fixo") ? "possivel habitualidade" : null,
      text.includes("gestor") || text.includes("chefe") || text.includes("ordens")
        ? "possivel subordinação"
        : null,
      input.caseType.includes("PJ") ? "avaliar elementos de vinculo empregaticio" : null
    ].filter(Boolean) as string[];

    const expectedDocs = input.caseType.includes("PJ")
      ? ["Contrato PJ", "Notas fiscais", "Comprovantes de pagamento", "Conversas com gestor"]
      : ["Carteira de trabalho", "Termo de rescisao", "Holerites", "Extrato do FGTS"];
    const missingDocuments = expectedDocs.filter((doc) => !input.documents.includes(doc));

    return {
      summary: `${input.clientName} relata demanda de ${input.caseType}. Informacoes iniciais indicam necessidade de revisar documentos e confirmar fatos durante a consulta.`,
      relevantPoints: relevantPoints.length ? relevantPoints : ["informacoes iniciais ainda incompletas"],
      missingDocuments,
      suggestedQuestions: [
        "Qual foi o periodo exato de trabalho?",
        "Havia controle de horario ou ordens diretas?",
        "Quais documentos o cliente ja possui?"
      ],
      urgency: missingDocuments.length > 3 ? "MEDIUM" : "HIGH",
      whatsappMessage: `Ola, ${input.clientName}. Para avancarmos na analise inicial do seu caso de ${input.caseType}, preciso que envie: ${missingDocuments.join(", ")}.`
    };
  }
}

class OpenAiProvider implements AiProvider {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generateTriageSummary(input: TriageSummaryInput): Promise<AiTriageSummary> {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Voce e um assistente operacional juridico. Gere apenas rascunhos revisaveis pelo advogado. Responda JSON com summary, relevantPoints, missingDocuments, suggestedQuestions, urgency e whatsappMessage."
        },
        { role: "user", content: JSON.stringify(input) }
      ]
    });
    return JSON.parse(response.choices[0]?.message.content ?? "{}") as AiTriageSummary;
  }
}
