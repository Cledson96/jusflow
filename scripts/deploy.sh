#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/jurisflow}"
APP_ENV_FILE="${APP_ENV_FILE:-.env.production}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
DEPLOY_TARGET="${DEPLOY_TARGET:-all}"
API_IMAGE_TAG="${API_IMAGE_TAG:-latest}"
WEB_IMAGE_TAG="${WEB_IMAGE_TAG:-latest}"
RUN_SEED="${RUN_SEED:-false}"

if [[ ! -f "$APP_DIR/$APP_ENV_FILE" ]]; then
  echo "Env file not found at $APP_DIR/$APP_ENV_FILE"
  exit 1
fi

cd "$APP_DIR"

git fetch origin "$DEPLOY_BRANCH"
git checkout "$DEPLOY_BRANCH"
git pull --ff-only origin "$DEPLOY_BRANCH"

export API_IMAGE_TAG
export WEB_IMAGE_TAG
export APP_ENV_FILE

compose_cmd=(docker compose -f docker-compose.yml --env-file "$APP_ENV_FILE")

echo "Deploying JurisFlow from $APP_DIR"
echo "Target: $DEPLOY_TARGET"
echo "Env file: $APP_ENV_FILE"
echo "Available compose services:"
"${compose_cmd[@]}" config --services

case "$DEPLOY_TARGET" in
  web)
    "${compose_cmd[@]}" pull web
    "${compose_cmd[@]}" up -d --remove-orphans --no-deps web
    ;;
  api)
    "${compose_cmd[@]}" pull api
    "${compose_cmd[@]}" run --rm api pnpm db:migrate:deploy
    "${compose_cmd[@]}" up -d --remove-orphans api
    ;;
  all)
    "${compose_cmd[@]}" pull api web
    "${compose_cmd[@]}" run --rm api pnpm db:migrate:deploy
    "${compose_cmd[@]}" up -d --remove-orphans
    ;;
  *)
    echo "Unsupported DEPLOY_TARGET: $DEPLOY_TARGET"
    exit 1
    ;;
esac

if [[ "$RUN_SEED" == "true" ]]; then
  "${compose_cmd[@]}" run --rm api pnpm db:seed
fi

echo "JurisFlow deployed successfully target=$DEPLOY_TARGET api=$API_IMAGE_TAG web=$WEB_IMAGE_TAG"
