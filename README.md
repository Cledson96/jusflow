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

O repositorio inclui a base para deploy em uma VPS Ubuntu com Docker Compose, GHCR e GitHub Actions:

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
cp .env.production.example .env.production
```

Preencha no `.env.production`:

- `DATABASE_URL=postgresql://jurisflow:...@db.seudominio.com:5432/jurisflow`
- `DIRECT_URL=postgresql://jurisflow:...@db.seudominio.com:5432/jurisflow`
- `API_IMAGE=ghcr.io/cledson96/jurisflow-api`
- `API_IMAGE_TAG=main`
- `WEB_IMAGE=ghcr.io/cledson96/jurisflow-web`
- `WEB_IMAGE_TAG=main`
- `WEB_ORIGIN=https://app.seudominio.com`
- `NEXT_PUBLIC_API_URL=https://api.seudominio.com`
- `AUTH_SECRET=...`
- `AUTH_URL=https://app.seudominio.com`
- `NEXT_PUBLIC_AUTH_MODE=authjs`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Tambem copie os certificados SSL para:

```bash
/opt/jurisflow/infra/nginx/certs/fullchain.pem
/opt/jurisflow/infra/nginx/certs/privkey.pem
```

Primeira subida manual:

```bash
docker login ghcr.io
docker compose --env-file .env.production pull
docker compose --env-file .env.production up -d
docker compose --env-file .env.production run --rm api pnpm db:migrate:deploy
docker compose --env-file .env.production run --rm api pnpm db:seed
```

Atualizacoes seguintes:

```bash
APP_ENV_FILE=.env.production
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

## Branches e CI/CD

Fluxo esperado:

- `development`: integracao continua
- `main`: producao

Workflows:

- [ci.yml](C:/projetos/jusflow/.github/workflows/ci.yml): roda `lint`, `test` e builds de validacao
- [deploy-web.yml](C:/projetos/jusflow/.github/workflows/deploy-web.yml): publica e faz deploy do frontend quando houver mudancas relevantes no `web`
- [deploy-api.yml](C:/projetos/jusflow/.github/workflows/deploy-api.yml): publica e faz deploy da API quando houver mudancas relevantes no `api`

Secrets necessarios no GitHub:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_DIR`

Se a imagem do GHCR estiver privada, faca login uma vez direto na VPS:

```bash
docker login ghcr.io
```

## Status

O repositorio contem a base inicial do MVP:

- schema Prisma multi-tenant;
- autenticacao com Auth.js v5 e login por email/senha;
- seeds para trabalhista, pipeline, triagem e checklists;
- API NestJS para organizacoes, clientes, leads, casos, triagem, documentos e IA;
- UI inicial do painel operacional;
- testes de dominio, IA e renderizacao do workspace.
