#!/usr/bin/env bash
set -Eeuo pipefail

: "${POSTGRES_USER:?Missing POSTGRES_USER}"
: "${POSTGRES_DB:?Missing POSTGRES_DB}"

: "${COMPANY_DB_USER:?Missing COMPANY_DB_USER}"
: "${COMPANY_DB_PASSWORD:?Missing COMPANY_DB_PASSWORD}"
: "${COMPANY_DB:?Missing COMPANY_DB}"

: "${COMMUNICATION_DB_USER:?Missing COMMUNICATION_DB_USER}"
: "${COMMUNICATION_DB_PASSWORD:?Missing COMMUNICATION_DB_PASSWORD}"
: "${COMMUNICATION_DB:?Missing COMMUNICATION_DB}"

: "${POSTGRES_MONITOR_PASSWORD:?Missing POSTGRES_MONITOR_PASSWORD}"

create_app_database() {
    local db_user="$1"
    local db_password="$2"
    local db_name="$3"

    psql -X -v ON_ERROR_STOP=1 \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        -v app_user="$db_user" \
        -v app_password="$db_password" \
        -v app_db="$db_name" <<'SQL'

SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    :'app_user',
    :'app_password'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles
    WHERE rolname = :'app_user'
)
\gexec

SELECT format(
    'CREATE DATABASE %I OWNER %I',
    :'app_db',
    :'app_user'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_database
    WHERE datname = :'app_db'
)
\gexec
SQL
}

create_app_database \
    "$COMPANY_DB_USER" \
    "$COMPANY_DB_PASSWORD" \
    "$COMPANY_DB"

create_app_database \
    "$COMMUNICATION_DB_USER" \
    "$COMMUNICATION_DB_PASSWORD" \
    "$COMMUNICATION_DB"

psql -X -v ON_ERROR_STOP=1 \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -v monitor_password="$POSTGRES_MONITOR_PASSWORD" <<'SQL'

SELECT format(
    'CREATE ROLE telegraf_monitor LOGIN PASSWORD %L',
    :'monitor_password'
)
WHERE NOT EXISTS (
    SELECT 1 FROM pg_roles
    WHERE rolname = 'telegraf_monitor'
)
\gexec

GRANT pg_read_all_stats TO telegraf_monitor;
SQL

echo "PostgreSQL initialization completed."