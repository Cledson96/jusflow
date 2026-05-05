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

O repositorio inclui a base para deploy em uma VPS Ubuntu com Docker Compose, GHCR e GitHub Actions. O proxy HTTPS fica no Nginx do host da VPS, no mesmo modelo do `lanchonete`.

- [docker-compose.yml](C:/projetos/jusflow/docker-compose.yml)
- [apps/api/Dockerfile](C:/projetos/jusflow/apps/api/Dockerfile)
- [apps/web/Dockerfile](C:/projetos/jusflow/apps/web/Dockerfile)
- [scripts/deploy.sh](C:/projetos/jusflow/scripts/deploy.sh)
- [scripts/backup-postgres.sh](C:/projetos/jusflow/scripts/backup-postgres.sh)

Fluxo recomendado na VPS:

```bash
mkdir -p /opt/jurisflow/backups
cd /opt/jurisflow
cp .env.production.example .env.production
```

Preencha no `.env.production`:

- `DATABASE_URL=postgresql://jurisflow:...@host.docker.internal:5432/jurisflow`
- `DIRECT_URL=postgresql://jurisflow:...@host.docker.internal:5432/jurisflow`
- `API_IMAGE=ghcr.io/cledson96/jurisflow-api`
- `API_IMAGE_TAG=latest`
- `WEB_IMAGE=ghcr.io/cledson96/jurisflow-web`
- `WEB_IMAGE_TAG=latest`
- `WEB_ORIGIN=https://jurisflow.cledson.com.br`
- `NEXT_PUBLIC_API_URL=https://api.jurisflow.cledson.com.br`
- `AUTH_SECRET=...`
- `AUTH_URL=https://jurisflow.cledson.com.br`
- `NEXT_PUBLIC_AUTH_MODE=authjs`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Primeira subida manual:

```bash
docker login ghcr.io
docker compose --env-file .env.production pull
docker compose --env-file .env.production up -d
docker compose --env-file .env.production run --rm api pnpm db:migrate:deploy
docker compose --env-file .env.production run --rm api pnpm db:seed
```

Nginx do host da VPS:

- `jurisflow.cledson.com.br` -> `127.0.0.1:3002`
- `api.jurisflow.cledson.com.br` -> `127.0.0.1:4002`

Exemplo de `/etc/nginx/sites-available/jurisflow`:

```nginx
server {
    server_name jurisflow.cledson.com.br;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen 80;
}

server {
    server_name api.jurisflow.cledson.com.br;

    location / {
        proxy_pass http://127.0.0.1:4002;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 80;
}
```

Depois:

```bash
sudo ln -s /etc/nginx/sites-available/jurisflow /etc/nginx/sites-enabled/jurisflow
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d jurisflow.cledson.com.br -d api.jurisflow.cledson.com.br
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
