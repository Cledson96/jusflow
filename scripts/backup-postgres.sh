#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/jurisflow"
BACKUP_DIR="/opt/jurisflow/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"

set -a
source "$APP_DIR/.env"
set +a

docker compose exec -T db pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --format=custom \
  > "$BACKUP_DIR/jurisflow-$TIMESTAMP.dump"

find "$BACKUP_DIR" -type f -name '*.dump' -mtime +7 -delete

echo "Backup created at $BACKUP_DIR/jurisflow-$TIMESTAMP.dump"
