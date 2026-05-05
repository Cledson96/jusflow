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

Crie as tabelas e o bucket privado no banco configurado:

```bash
pnpm db:migrate
pnpm db:seed
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

## Deploy na VPS

O repositorio inclui a base para deploy em uma VPS Ubuntu com Docker Compose:

- [docker-compose.yml](C:/projetos/jusflow/docker-compose.yml)
- [apps/api/Dockerfile](C:/projetos/jusflow/apps/api/Dockerfile)
- [apps/web/Dockerfile](C:/projetos/jusflow/apps/web/Dockerfile)
- [infra/nginx/nginx.conf](C:/projetos/jusflow/infra/nginx/nginx.conf)
- [scripts/deploy.sh](C:/projetos/jusflow/scripts/deploy.sh)
- [scripts/backup-postgres.sh](C:/projetos/jusflow/scripts/backup-postgres.sh)

Fluxo recomendado na VPS:

```bash
mkdir -p /opt/jurisflow/backups
cd /opt/jurisflow
cp .env.example .env
```

Preencha no `.env`:

- `DATABASE_URL=postgresql://jurisflow:...@db:5432/jurisflow`
- `DIRECT_URL=postgresql://jurisflow:...@db:5432/jurisflow`
- `POSTGRES_DB=jurisflow`
- `POSTGRES_USER=jurisflow`
- `POSTGRES_PASSWORD=...`
- `WEB_ORIGIN=https://app.seudominio.com`
- `NEXT_PUBLIC_API_URL=https://api.seudominio.com`
- `CLERK_SECRET_KEY=...`
- `CLERK_JWT_ISSUER=...`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Primeira subida:

```bash
docker compose build
docker compose up -d
docker compose exec api pnpm db:migrate:deploy
docker compose exec api pnpm db:seed
```

Atualizacoes seguintes:

```bash
RUN_SEED=false ./scripts/deploy.sh
```

Bootstrap inicial com seed:

```bash
RUN_SEED=true ./scripts/deploy.sh
```

Backup manual:

```bash
./scripts/backup-postgres.sh
```

## Status

O repositorio contem a base inicial do MVP:

- schema Prisma multi-tenant;
- seeds para trabalhista, pipeline, triagem e checklists;
- API NestJS para organizacoes, clientes, leads, casos, triagem, documentos e IA;
- UI inicial do painel operacional;
- testes de dominio, IA e renderizacao do workspace.
