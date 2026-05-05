import React from "react";
import { ArrowRight, BriefcaseBusiness, ClipboardList, FileCheck2, Sparkles } from "lucide-react";
import { defaultPipeline } from "@jurisflow/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cases = [
  {
    id: "1",
    client: "Joao Silva",
    type: "Vinculo PJ/CLT",
    status: "WAITING_DOCUMENTS",
    missing: 4,
    urgency: "Alta"
  },
  {
    id: "2",
    client: "Marina Costa",
    type: "Verbas trabalhistas",
    status: "LAWYER_REVIEW",
    missing: 1,
    urgency: "Media"
  },
  {
    id: "3",
    client: "Rafael Lima",
    type: "Horas extras",
    status: "TRIAGE_PENDING",
    missing: 6,
    urgency: "Media"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-[#10352f] px-5 py-6 text-white lg:block">
        <div className="text-2xl font-semibold tracking-tight">JurisFlow</div>
        <nav className="mt-10 space-y-1 text-sm">
          {["Dashboard", "Casos", "Triagem", "Documentos", "IA", "Configurações"].map((item) => (
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
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pre-atendimento trabalhista</p>
            <h1 className="text-lg font-semibold">Painel operacional</h1>
          </div>
          <Button>
            Novo caso <ArrowRight size={16} />
          </Button>
        </header>

        <div className="space-y-8 px-5 py-6 lg:px-8">
          <section className="grid gap-4 md:grid-cols-4">
            {[
              ["Leads ativos", "38", BriefcaseBusiness],
              ["Aguardando docs", "14", ClipboardList],
              ["Para análise", "7", FileCheck2],
              ["Resumos IA", "22", Sparkles]
            ].map(([label, value, Icon]) => (
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
                <span className="text-sm text-muted-foreground">Fluxo padrão do MVP</span>
              </div>
              <div className="grid gap-3 overflow-x-auto pb-3 md:grid-cols-3 xl:grid-cols-4">
                {defaultPipeline.slice(0, 8).map((stage) => (
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
                          <article key={item.id} className="rounded-md border border-border p-3">
                            <p className="font-medium">{item.client}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{item.type}</p>
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <span>{item.missing} docs pendentes</span>
                              <span className="font-medium text-primary">{item.urgency}</span>
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
                <h2 className="text-base font-semibold">Cadastro rápido</h2>
                <div className="mt-4 space-y-3">
                  <Input placeholder="Nome do cliente" />
                  <Input placeholder="Telefone / WhatsApp" />
                  <Input placeholder="Tipo de caso trabalhista" />
                  <Button className="w-full">Criar lead e caso</Button>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-white p-4">
                <h2 className="text-base font-semibold">Resumo IA</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cliente relata atuação como PJ com horário fixo, gestor direto e pagamento mensal.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>Contrato PJ pendente</li>
                  <li>Notas fiscais pendentes</li>
                  <li>Conversas com gestor pendentes</li>
                </ul>
                <Button variant="secondary" className="mt-4 w-full">
                  Copiar mensagem WhatsApp
                </Button>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
