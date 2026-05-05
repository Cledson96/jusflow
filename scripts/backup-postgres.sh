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

pg_dump "$DATABASE_URL" --format=custom > "$BACKUP_DIR/jurisflow-$TIMESTAMP.dump"

find "$BACKUP_DIR" -type f -name '*.dump' -mtime +7 -delete

echo "Backup created at $BACKUP_DIR/jurisflow-$TIMESTAMP.dump"
