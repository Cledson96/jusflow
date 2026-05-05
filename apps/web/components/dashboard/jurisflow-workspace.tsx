"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardList,
  FileCheck2,
  Loader2,
  Sparkles
} from "lucide-react";
import { defaultPipeline } from "@jurisflow/shared";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PipelineStage = {
  id: string;
  key: string;
  name: string;
  order: number;
};

type CaseType = {
  id: string;
  name: string;
};

type Client = {
  id: string;
  name: string;
  phone?: string | null;
};

type CaseDocument = {
  id: string;
  status: string;
  fileName?: string | null;
  signedUrl?: string | null;
  documentItem?: { name: string };
};

type TriageQuestion = {
  id: string;
  fieldKey: string;
  label: string;
  required: boolean;
  value: string;
};

type AiRun = {
  id: string;
  output: {
    summary?: string;
    relevantPoints?: string[];
    missingDocuments?: string[];
    suggestedQuestions?: string[];
    whatsappMessage?: string;
  };
};

type JurisCase = {
  id: string;
  title: string;
  status: string;
  triageToken?: string;
  client: Client;
  caseType: CaseType;
  documents?: CaseDocument[];
  triageAnswers?: { value: string; question: { fieldKey: string; label: string } }[];
  aiRuns?: AiRun[];
  whatsappMessages?: { id: string; body: string }[];
};

type DashboardData = {
  documentsPending: number;
  aiRuns: number;
  byStatus: { status: string; _count: { status: number } }[];
};

const fallbackCases: JurisCase[] = [
  {
    id: "fallback-1",
    title: "Reconhecimento de vinculo",
    status: "WAITING_DOCUMENTS",
    client: { id: "client-1", name: "Joao Silva" },
    caseType: { id: "type-1", name: "Vinculo PJ/CLT" },
    documents: [
      { id: "doc-1", status: "PENDING", documentItem: { name: "Contrato PJ" } },
      { id: "doc-2", status: "PENDING", documentItem: { name: "Notas fiscais" } },
      { id: "doc-3", status: "RECEIVED", documentItem: { name: "Documentos pessoais" } }
    ],
    aiRuns: [
      {
        id: "ai-1",
        output: {
          summary: "Cliente relata atuacao como PJ com horario fixo e gestor direto.",
          missingDocuments: ["Contrato PJ", "Notas fiscais"],
          whatsappMessage:
            "Ola, Joao Silva. Para avancarmos na analise inicial, preciso que envie Contrato PJ e Notas fiscais."
        }
      }
    ],
    whatsappMessages: [
      {
        id: "msg-1",
        body: "Ola, Joao Silva. Para avancarmos na analise inicial, preciso que envie Contrato PJ e Notas fiscais."
      }
    ]
  },
  {
    id: "fallback-2",
    title: "Verbas rescisorias",
    status: "LAWYER_REVIEW",
    client: { id: "client-2", name: "Marina Costa" },
    caseType: { id: "type-2", name: "Verbas trabalhistas" },
    documents: [
      { id: "doc-4", status: "RECEIVED", documentItem: { name: "Carteira de trabalho" } },
      { id: "doc-5", status: "PENDING", documentItem: { name: "Holerites" } }
    ]
  }
];

export function JurisflowWorkspace() {
  const [cases, setCases] = useState<JurisCase[]>(fallbackCases);
  const [stages, setStages] = useState<PipelineStage[]>(
    defaultPipeline.map((stage) => ({
      id: stage.key,
      key: stage.key,
      name: stage.name,
      order: stage.order
    }))
  );
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([
    { id: "case_type_vinculo_pj_clt", name: "Vinculo PJ/CLT" }
  ]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [apiState, setApiState] = useState<"demo" | "connected">("demo");
  const [selectedCaseId, setSelectedCaseId] = useState(fallbackCases[0]?.id ?? "");
  const [caseDetail, setCaseDetail] = useState<JurisCase | null>(fallbackCases[0] ?? null);
  const [triageDraft, setTriageDraft] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    caseTypeId: "case_type_vinculo_pj_clt",
    title: "Pre-analise trabalhista"
  });

  const metrics = useMemo(() => {
    const waitingDocs =
      dashboard?.documentsPending ??
      cases.reduce((total, item) => total + (item.documents ?? []).filter((doc) => doc.status === "PENDING").length, 0);
    const lawyerReview =
      dashboard?.byStatus.find((item) => item.status === "LAWYER_REVIEW")?._count.status ??
      cases.filter((item) => item.status === "LAWYER_REVIEW").length;

    return [
      ["Leads ativos", cases.length.toString(), BriefcaseBusiness],
      ["Aguardando docs", waitingDocs.toString(), ClipboardList],
      ["Para analise", lawyerReview.toString(), FileCheck2],
      ["Resumos IA", (dashboard?.aiRuns ?? 0).toString(), Sparkles]
    ];
  }, [cases, dashboard]);

  async function loadWorkspace() {
    setLoading(true);
    try {
      const [loadedCases, meta, loadedDashboard] = await Promise.all([
        apiFetch<JurisCase[]>("/cases"),
        apiFetch<{ stages: PipelineStage[]; caseTypes: CaseType[] }>("/cases/meta"),
        apiFetch<DashboardData>("/cases/dashboard")
      ]);
      setCases(loadedCases);
      setStages(meta.stages);
      setCaseTypes(meta.caseTypes);
      setDashboard(loadedDashboard);
      setForm((current) => ({
        ...current,
        caseTypeId: meta.caseTypes[0]?.id ?? current.caseTypeId
      }));
      setApiState("connected");
      if (loadedCases[0] && !loadedCases.some((item) => item.id === selectedCaseId)) {
        setSelectedCaseId(loadedCases[0].id);
      }
    } catch {
      setApiState("demo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspace();
  }, []);

  useEffect(() => {
    if (!selectedCaseId) return;
    void loadCaseDetail(selectedCaseId);
  }, [selectedCaseId, apiState]);

  async function loadCaseDetail(caseId: string) {
    const fallback = cases.find((item) => item.id === caseId) ?? fallbackCases[0] ?? null;
    if (caseId.startsWith("fallback") || apiState === "demo") {
      setCaseDetail(fallback);
      setTriageDraft({});
      return;
    }
    try {
      const loaded = await apiFetch<JurisCase>(`/cases/${caseId}`);
      setCaseDetail(loaded);
      setTriageDraft(
        Object.fromEntries(
          (loaded.triageAnswers ?? []).map((answer) => [answer.question.fieldKey, answer.value])
        )
      );
    } catch {
      setCaseDetail(fallback);
    }
  }

  async function createCase(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.clientName.trim()) return;
    setSaving(true);
    try {
      const client = await apiFetch<Client>("/clients", {
        method: "POST",
        body: JSON.stringify({
          name: form.clientName,
          phone: form.phone
        })
      });
      const lead = await apiFetch<{ id: string }>("/leads", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          origin: "WhatsApp"
        })
      });
      await apiFetch("/cases", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          leadId: lead.id,
          caseTypeId: form.caseTypeId,
          title: form.title || "Pre-analise trabalhista"
        })
      });
      setForm((current) => ({ ...current, clientName: "", phone: "" }));
      await loadWorkspace();
    } finally {
      setSaving(false);
    }
  }

  async function moveCase(caseId: string, status: string) {
    if (caseId.startsWith("fallback")) return;
    await apiFetch(`/cases/${caseId}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await loadWorkspace();
  }

  async function saveTriage() {
    if (!caseDetail || caseDetail.id.startsWith("fallback")) return;
    await apiFetch(`/cases/${caseDetail.id}/triage`, {
      method: "POST",
      body: JSON.stringify({ answers: triageDraft })
    });
    await loadCaseDetail(caseDetail.id);
    await loadWorkspace();
  }

  async function updateDocumentStatus(documentId: string, status: string) {
    if (!caseDetail || caseDetail.id.startsWith("fallback")) return;
    await apiFetch(`/cases/${caseDetail.id}/documents/${documentId}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await loadCaseDetail(caseDetail.id);
    await loadWorkspace();
  }

  async function generateAiSummary() {
    if (!caseDetail || caseDetail.id.startsWith("fallback")) return;
    setAiBusy(true);
    try {
      await apiFetch(`/cases/${caseDetail.id}/ai/triage-summary`, { method: "POST" });
      await loadCaseDetail(caseDetail.id);
      await loadWorkspace();
    } finally {
      setAiBusy(false);
    }
  }

  async function copyWhatsappMessage() {
    const message = getWhatsappMessage(caseDetail);
    if (!message) return;
    await navigator.clipboard?.writeText(message);
  }

  function getWhatsappMessage(item: JurisCase | null) {
    return (
      item?.whatsappMessages?.[0]?.body ??
      item?.aiRuns?.[0]?.output?.whatsappMessage ??
      "Ola. Para avancarmos na analise inicial, preciso que envie os documentos pendentes listados no atendimento."
    );
  }

  const triageFields = [
    ["nomeEmpresa", "Nome da empresa"],
    ["cargo", "Cargo ou funcao"],
    ["periodoTrabalhado", "Periodo trabalhado"],
    ["formaContratacao", "Forma de contratacao"],
    ["horarioFixo", "Havia horario fixo?"],
    ["gestorDireto", "Havia chefe direto?"],
    ["resumoLivre", "Resumo livre do ocorrido"]
  ];

  const selectedSummary = caseDetail?.aiRuns?.[0]?.output;

  return (
    <main className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-[#10352f] px-5 py-6 text-white lg:block">
        <div className="text-2xl font-semibold tracking-tight">JurisFlow</div>
        <nav className="mt-10 space-y-1 text-sm">
          {["Dashboard", "Casos", "Triagem", "Documentos", "IA", "Configuracoes"].map((item) => (
            <a
              key={item}
              className="block rounded-md px-3 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              href="#"
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <section className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white px-5 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Pre-atendimento trabalhista
            </p>
            <h1 className="text-lg font-semibold">Painel operacional</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {apiState === "connected" ? "API conectada" : "Modo demo"}
            </span>
            <Button type="button" onClick={() => void loadWorkspace()} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
              Atualizar
            </Button>
          </div>
        </header>

        <div className="space-y-8 px-5 py-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-4">
            {metrics.map(([label, value, Icon]) => (
              <div key={label as string} className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label as string}</span>
                  <Icon className="text-primary" size={18} />
                </div>
                <strong className="mt-4 block text-3xl">{value as string}</strong>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Kanban de atendimento</h2>
                <span className="text-sm text-muted-foreground">Fluxo padrao do MVP</span>
              </div>
              <div className="grid gap-3 overflow-x-auto pb-3 md:grid-cols-3 xl:grid-cols-4">
                {stages.slice(0, 8).map((stage) => (
                  <div key={stage.key} className="min-h-48 rounded-lg border border-border bg-white p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{stage.name}</h3>
                      <span className="rounded bg-muted px-2 py-1 text-xs">
                        {cases.filter((item) => item.status === stage.key).length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {cases
                        .filter((item) => item.status === stage.key)
                        .map((item) => (
                          <article
                            key={item.id}
                            className={`rounded-md border p-3 transition ${
                              selectedCaseId === item.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <button
                              className="block w-full text-left"
                              type="button"
                              onClick={() => setSelectedCaseId(item.id)}
                            >
                              <p className="font-medium">{item.client.name}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{item.caseType.name}</p>
                            </button>
                            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                              <span>
                                {(item.documents ?? []).filter((doc) => doc.status === "PENDING").length} docs pendentes
                              </span>
                              <select
                                aria-label={`Mover caso ${item.client.name}`}
                                className="rounded border border-border bg-white px-2 py-1"
                                value={item.status}
                                onChange={(event) => void moveCase(item.id, event.target.value)}
                              >
                                {stages.map((option) => (
                                  <option key={option.key} value={option.key}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </article>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-lg border border-border bg-white p-4">
                <h2 className="text-base font-semibold">Cadastro rapido</h2>
                <form className="mt-4 space-y-3" onSubmit={(event) => void createCase(event)}>
                  <Input
                    placeholder="Nome do cliente"
                    value={form.clientName}
                    onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))}
                  />
                  <Input
                    placeholder="Telefone / WhatsApp"
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  />
                  <select
                    className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none transition focus:border-primary"
                    value={form.caseTypeId}
                    onChange={(event) => setForm((current) => ({ ...current, caseTypeId: event.target.value }))}
                  >
                    {caseTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Titulo do caso"
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  />
                  <Button className="w-full" disabled={saving || apiState !== "connected"}>
                    {saving ? "Criando..." : "Criar lead e caso"}
                  </Button>
                </form>
              </section>

              <section className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">Caso selecionado</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {caseDetail?.client.name ?? "Selecione um caso"}
                    </p>
                  </div>
                  <span className="rounded bg-muted px-2 py-1 text-xs">{caseDetail?.caseType.name}</span>
                </div>

                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Triagem</h3>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3"
                        onClick={() => void saveTriage()}
                        disabled={apiState !== "connected" || !caseDetail || caseDetail.id.startsWith("fallback")}
                      >
                        Salvar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {triageFields.map(([fieldKey, label]) => (
                        <label key={fieldKey} className="block text-xs font-medium text-muted-foreground">
                          {label}
                          <Input
                            className="mt-1"
                            value={triageDraft[fieldKey] ?? ""}
                            onChange={(event) =>
                              setTriageDraft((current) => ({
                                ...current,
                                [fieldKey]: event.target.value
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Documentos</h3>
                    <div className="space-y-2">
                      {(caseDetail?.documents ?? []).map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-border p-2 text-sm"
                        >
                          <span>{document.documentItem?.name ?? "Documento"}</span>
                          <select
                            className="rounded border border-border bg-white px-2 py-1 text-xs"
                            value={document.status}
                            disabled={apiState !== "connected" || caseDetail?.id.startsWith("fallback")}
                            onChange={(event) => void updateDocumentStatus(document.id, event.target.value)}
                          >
                            <option value="PENDING">Pendente</option>
                            <option value="RECEIVED">Recebido</option>
                            <option value="REJECTED">Recusado</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Resumo IA</h3>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-8 px-3"
                        onClick={() => void generateAiSummary()}
                        disabled={aiBusy || apiState !== "connected" || !caseDetail || caseDetail.id.startsWith("fallback")}
                      >
                        {aiBusy ? "Gerando..." : "Gerar resumo IA"}
                      </Button>
                    </div>
                    <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                      {selectedSummary?.summary ??
                        "A IA gera um rascunho com resumo, pontos relevantes, documentos faltantes e mensagem para WhatsApp."}
                    </p>
                    {Boolean(selectedSummary?.missingDocuments?.length) && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {selectedSummary?.missingDocuments?.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={() => void copyWhatsappMessage()}
                    >
                      Copiar mensagem WhatsApp
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
