# JurisFlow

Planejamento e inicio da construcao de um SaaS juridico voltado a advogados autonomos e escritorios pequenos.

O foco inicial do JurisFlow e organizar o pre-atendimento trabalhista: transformar contatos vindos de WhatsApp, indicacoes ou formularios em casos estruturados com triagem, checklist documental, resumo por IA e proximos passos claros.

## Aplicacao

O MVP foi estruturado como monorepo:

- `apps/web`: Next.js App Router, Tailwind CSS e componentes no estilo shadcn/ui.
- `apps/api`: NestJS REST API, Prisma, PostgreSQL/Supabase e Swagger.
- `packages/shared`: enums, tipos e defaults compartilhados.

## Documentacao

- [Planejamento de Produto](docs/planejamento-produto-jurisflow.md)

## Supabase

Projeto criado para o MVP:

- Nome: `jurisflow`
- Project ref: `pmlffujdgdimrmfirxhf`
- Regiao: `sa-east-1`
- URL: `https://pmlffujdgdimrmfirxhf.supabase.co`
- Bucket privado: `case-documents`
- Organizacao demo seedada: `org_demo_jurisflow`

Segredos como `DATABASE_URL`, `DIRECT_URL` e `SUPABASE_SERVICE_ROLE_KEY` devem ser copiados do painel do Supabase e colocados apenas no `.env` local ou no provedor de deploy.

## Desenvolvimento local

Instale as dependencias:

```bash
pnpm install
```

Copie as variaveis de ambiente:

```bash
cp .env.example .env
```

Gere o Prisma Client:

```bash
pnpm --filter @jurisflow/api prisma:generate
```

Rode os checks:

```bash
pnpm test
pnpm lint
pnpm build
```

Inicie os apps:

```bash
pnpm dev
```

## Status

O repositorio contem a base inicial do MVP:

- schema Prisma multi-tenant;
- seeds para trabalhista, pipeline, triagem e checklists;
- API NestJS para organizacoes, clientes, leads, casos, triagem, documentos e IA;
- UI inicial do painel operacional;
- testes de dominio, IA e renderizacao do workspace.
