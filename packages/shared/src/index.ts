export const caseStatuses = [
  "NEW_CONTACT",
  "TRIAGE_PENDING",
  "WAITING_DOCUMENTS",
  "LAWYER_REVIEW",
  "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT",
  "CLIENT_CONTRACTED",
  "LOST",
  "CLOSED"
] as const;

export const memberRoles = ["OWNER", "LAWYER", "ASSISTANT"] as const;
export const documentStatuses = ["PENDING", "RECEIVED", "REJECTED"] as const;
export const urgencyLevels = ["LOW", "MEDIUM", "HIGH"] as const;

export type CaseStatus = (typeof caseStatuses)[number];
export type MemberRole = (typeof memberRoles)[number];
export type DocumentStatus = (typeof documentStatuses)[number];
export type UrgencyLevel = (typeof urgencyLevels)[number];

export interface AiTriageSummary {
  summary: string;
  relevantPoints: string[];
  missingDocuments: string[];
  suggestedQuestions: string[];
  urgency: UrgencyLevel;
  whatsappMessage: string;
}

export const defaultPipeline = [
  { key: "NEW_CONTACT", name: "Novo contato", order: 1 },
  { key: "TRIAGE_PENDING", name: "Triagem pendente", order: 2 },
  { key: "WAITING_DOCUMENTS", name: "Aguardando documentos", order: 3 },
  { key: "LAWYER_REVIEW", name: "Analise do advogado", order: 4 },
  { key: "CONSULTATION_SCHEDULED", name: "Consulta marcada", order: 5 },
  { key: "PROPOSAL_SENT", name: "Proposta enviada", order: 6 },
  { key: "CLIENT_CONTRACTED", name: "Cliente contratado", order: 7 },
  { key: "LOST", name: "Perdido", order: 8 },
  { key: "CLOSED", name: "Encerrado", order: 9 }
] as const;

export const laborCaseTypes = [
  "Vinculo PJ/CLT",
  "Rescisao",
  "Horas extras",
  "Verbas trabalhistas",
  "Assedio moral",
  "Demissao irregular"
] as const;
