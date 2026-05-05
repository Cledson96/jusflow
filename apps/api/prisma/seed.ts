import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultPipeline, laborCaseTypes } from "@jurisflow/shared";

const prisma = new PrismaClient();

async function main() {
  const demoPasswordHash = await hash("demo123456", 10);

  const organization = await prisma.organization.upsert({
    where: { slug: "demo-jurisflow" },
    update: {},
    create: { name: "Escritorio Demo JurisFlow", slug: "demo-jurisflow" }
  });

  const user = await prisma.user.upsert({
    where: { authUserId: "dev-user" },
    update: { passwordHash: demoPasswordHash },
    create: {
      authUserId: "dev-user",
      email: "demo@jurisflow.local",
      name: "Advogado Demo",
      passwordHash: demoPasswordHash
    }
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id
      }
    },
    update: {},
    create: { organizationId: organization.id, userId: user.id, role: "OWNER" }
  });

  for (const stage of defaultPipeline) {
    await prisma.pipelineStage.upsert({
      where: { organizationId_key: { organizationId: organization.id, key: stage.key } },
      update: { name: stage.name, order: stage.order },
      create: {
        organizationId: organization.id,
        key: stage.key,
        name: stage.name,
        order: stage.order
      }
    });
  }

  const laborArea = await prisma.legalArea.upsert({
    where: { organizationId_name: { organizationId: organization.id, name: "Trabalhista" } },
    update: {},
    create: { organizationId: organization.id, name: "Trabalhista" }
  });

  for (const name of laborCaseTypes) {
    const caseType = await prisma.caseType.upsert({
      where: { organizationId_name: { organizationId: organization.id, name } },
      update: {},
      create: { organizationId: organization.id, legalAreaId: laborArea.id, name }
    });

    await seedTriageQuestions(organization.id, caseType.id);
    await seedChecklist(organization.id, caseType.id, name);
  }
}

async function seedTriageQuestions(organizationId: string, caseTypeId: string) {
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
    await prisma.triageQuestion.upsert({
      where: {
        organizationId_caseTypeId_fieldKey: {
          organizationId,
          caseTypeId,
          fieldKey: question[0]
        }
      },
      update: { label: question[1], required: question[2], order: index + 1 },
      create: {
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

async function seedChecklist(organizationId: string, caseTypeId: string, caseTypeName: string) {
  const checklist = await prisma.documentChecklist.upsert({
    where: {
      organizationId_caseTypeId_name: {
        organizationId,
        caseTypeId,
        name: "Checklist inicial"
      }
    },
    update: {},
    create: { organizationId, caseTypeId, name: "Checklist inicial" }
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
    await prisma.documentItem.upsert({
      where: { id: `${checklist.id}-${index}` },
      update: { name, order: index + 1 },
      create: {
        id: `${checklist.id}-${index}`,
        checklistId: checklist.id,
        name,
        order: index + 1
      }
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
