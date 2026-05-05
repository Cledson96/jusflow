#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/jurisflow}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
API_IMAGE_TAG="${API_IMAGE_TAG:-main}"
WEB_IMAGE_TAG="${WEB_IMAGE_TAG:-main}"
RUN_SEED="${RUN_SEED:-false}"

if [[ ! -f "$APP_DIR/.env" ]]; then
  echo ".env not found at $APP_DIR/.env"
  exit 1
fi

if [[ -z "${GHCR_USERNAME:-}" || -z "${GHCR_TOKEN:-}" ]]; then
  echo "GHCR_USERNAME and GHCR_TOKEN must be set."
  exit 1
fi

cd "$APP_DIR"

git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git pull --ff-only origin "$DEPLOY_BRANCH"

echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

export API_IMAGE_TAG
export WEB_IMAGE_TAG

docker compose pull api web nginx
docker compose up -d --remove-orphans
docker compose exec api pnpm db:migrate:deploy

if [[ "$RUN_SEED" == "true" ]]; then
  docker compose exec api pnpm db:seed
fi

echo "JurisFlow deployed successfully with tags api=$API_IMAGE_TAG web=$WEB_IMAGE_TAG"
