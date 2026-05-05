import { Injectable } from "@nestjs/common";
import { defaultPipeline, laborCaseTypes } from "@jurisflow/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
  }

  async createOrganization(userId: string, input: { name: string; slug?: string }) {
    const slug = input.slug ?? input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const organization = await this.prisma.organization.create({
      data: {
        name: input.name,
        slug,
        members: {
          create: { userId, role: "OWNER" }
        }
      }
    });

    await this.seedDefaults(organization.id);
    return organization;
  }

  private async seedDefaults(organizationId: string) {
    for (const stage of defaultPipeline) {
      await this.prisma.pipelineStage.create({
        data: { organizationId, key: stage.key, name: stage.name, order: stage.order }
      });
    }

    const laborArea = await this.prisma.legalArea.create({
      data: { organizationId, name: "Trabalhista" }
    });

    for (const name of laborCaseTypes) {
      const caseType = await this.prisma.caseType.create({
        data: { organizationId, legalAreaId: laborArea.id, name }
      });
      await this.seedTriageQuestions(organizationId, caseType.id);
      await this.seedChecklist(organizationId, caseType.id, name);
    }
  }

  private async seedTriageQuestions(organizationId: string, caseTypeId: string) {
    const questions = [
      ["nomeEmpresa", "Nome da empresa", true],
      ["cargo", "Cargo ou funcao exercida", true],
      ["periodoTrabalhado", "Periodo trabalhado", true],
      ["formaContratacao", "Forma de contratacao", true],
      ["remuneracao", "Salario ou remuneracao", false],
      ["horarioFixo", "Havia horario fixo?", false],
      ["gestorDireto", "Havia chefe direto?", false],
      ["ordensDiretas", "Havia obrigacao de cumprir ordens?", false],
      ["motivoSaida", "Motivo da saida", false],
      ["resumoLivre", "Resumo livre do ocorrido", true]
    ] as const;

    for (const [index, question] of questions.entries()) {
      await this.prisma.triageQuestion.create({
        data: {
          organizationId,
          caseTypeId,
          fieldKey: question[0],
          label: question[1],
          required: question[2],
          order: index + 1
        }
      });
    }
  }

  private async seedChecklist(organizationId: string, caseTypeId: string, caseTypeName: string) {
    const checklist = await this.prisma.documentChecklist.create({
      data: { organizationId, caseTypeId, name: "Checklist inicial" }
    });
    const pjItems = [
      "Contrato PJ",
      "Notas fiscais",
      "Comprovantes de pagamento",
      "Conversas com gestor",
      "Prints de horarios",
      "E-mails corporativos",
      "Documentos pessoais"
    ];
    const rescisionItems = [
      "Carteira de trabalho",
      "Termo de rescisao",
      "Holerites",
      "Extrato do FGTS",
      "Controle de ponto",
      "Conversas relevantes",
      "Documentos pessoais"
    ];
    const items = caseTypeName === "Vinculo PJ/CLT" ? pjItems : rescisionItems;
    for (const [index, name] of items.entries()) {
      await this.prisma.documentItem.create({
        data: { checklistId: checklist.id, name, order: index + 1 }
      });
    }
  }
}
