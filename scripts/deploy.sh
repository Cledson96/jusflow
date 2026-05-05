#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/jurisflow"
RUN_SEED="${RUN_SEED:-false}"

if [[ ! -f "$APP_DIR/.env" ]]; then
  echo ".env not found at $APP_DIR/.env"
  exit 1
fi

cd "$APP_DIR"
git pull --ff-only
docker compose build
docker compose up -d
docker compose exec api pnpm db:migrate:deploy

if [[ "$RUN_SEED" == "true" ]]; then
  docker compose exec api pnpm db:seed
fi

echo "JurisFlow updated successfully."
