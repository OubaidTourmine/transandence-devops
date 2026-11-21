#!/bin/sh
set -eu

BACKUP_DIR=/backups
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_FILE="$BACKUP_DIR/redis-$TIMESTAMP.rdb"
TEMP_FILE="$BACKUP_FILE.tmp"

umask 077
mkdir -p "$BACKUP_DIR"

trap 'rm -f "$TEMP_FILE"' EXIT

echo "[REDIS BACKUP] Starting $TIMESTAMP"

redis-cli -h redis -p 6379 --rdb "$TEMP_FILE"

redis-check-rdb "$TEMP_FILE"

mv "$TEMP_FILE" "$BACKUP_FILE"

# Keep approximately 7 days of backups.
find "$BACKUP_DIR" -type f -name 'redis-*.rdb' -mtime +6 -delete

echo "[REDIS BACKUP] Success: $BACKUP_FILE"
