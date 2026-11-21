#!/bin/sh
set -eu

BACKUP_DIR=/backups
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_FILE="$BACKUP_DIR/postgres-$TIMESTAMP.sql.gz"
TEMP_SQL="$BACKUP_DIR/.postgres-$TIMESTAMP.sql.tmp"
TEMP_GZIP="$BACKUP_FILE.tmp"

umask 077
mkdir -p "$BACKUP_DIR"

trap 'rm -f "$TEMP_SQL" "$TEMP_GZIP"' EXIT

echo "[POSTGRES BACKUP] Starting $TIMESTAMP"

pg_dumpall --no-password --file="$TEMP_SQL"

gzip -c "$TEMP_SQL" > "$TEMP_GZIP"
gzip -t "$TEMP_GZIP"

mv "$TEMP_GZIP" "$BACKUP_FILE"
rm -f "$TEMP_SQL"

# Retain backups for approximately 7 days.
find "$BACKUP_DIR" -type f -name 'postgres-*.sql.gz' -mtime +6 -delete

echo "[POSTGRES BACKUP] Success: $BACKUP_FILE"
