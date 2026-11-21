#!/usr/bin/env bash
set -euo pipefail

BACKUP="${1:-}"
CONTAINER="hireflow-pg-restore-test"

if [[ -z "$BACKUP" || ! -f "$BACKUP" ]]; then
  echo "Usage: $0 backups/postgres/postgres-TIMESTAMP.sql.gz"
  exit 1
fi

gzip -t "$BACKUP"

if docker container inspect "$CONTAINER" >/dev/null 2>&1; then
  echo "ERROR: $CONTAINER already exists."
  echo "Remove it manually if you no longer need it:"
  echo "docker rm -f $CONTAINER"
  exit 1
fi

echo "[RESTORE] Creating isolated PostgreSQL 17 container..."

docker run -d --rm \
  --name "$CONTAINER" \
  --network none \
  -e POSTGRES_PASSWORD=restore-test-only \
  postgres:17-alpine >/dev/null

cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "[RESTORE] Waiting for PostgreSQL..."

for attempt in {1..30}; do
  if docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

docker exec "$CONTAINER" pg_isready -U postgres >/dev/null

echo "[RESTORE] Restoring databases and roles..."

gzip -dc "$BACKUP" \
  | sed 's/GRANT pg_read_all_stats TO telegraf_monitor WITH INHERIT TRUE GRANTED BY hireflow;/GRANT pg_read_all_stats TO telegraf_monitor WITH INHERIT TRUE;/' \
  | docker exec -i "$CONTAINER" \
      psql -X -v ON_ERROR_STOP=1 -U postgres -d postgres \
  >/dev/null

echo "[RESTORE] Verifying application databases..."

for database in hireflow khdimalink_communication khdimalink_company_jobs; do
  docker exec "$CONTAINER" \
    psql -U postgres -d "$database" \
    -Atc "SELECT current_database();" | grep -Fx "$database"
done

echo "[RESTORE] Verifying monitoring role..."

docker exec "$CONTAINER" \
  psql -U postgres -d postgres \
  -Atc "SELECT pg_has_role('telegraf_monitor', 'pg_read_all_stats', 'MEMBER');" \
  | grep -Fx t

echo "[RESTORE] Checking Company-Jobs data..."

docker exec "$CONTAINER" \
  psql -U postgres -d khdimalink_company_jobs \
  -c 'SELECT COUNT(*) AS restored_jobs FROM public."Job";'

echo "[RESTORE] SUCCESS: Isolated PostgreSQL recovery verified."
