#!/usr/bin/env bash
set -Eeuo pipefail

: "${COMPANY_DB_USER:?Missing COMPANY_DB_USER}"
: "${COMPANY_DB_PASSWORD:?Missing COMPANY_DB_PASSWORD}"
: "${COMPANY_DB:?Missing COMPANY_DB}"

psql \
  -v ON_ERROR_STOP=1 \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -v app_user="$COMPANY_DB_USER" \
  -v app_password="$COMPANY_DB_PASSWORD" \
  -v app_db="$COMPANY_DB" <<'SQL'

-- Create a restricted application account.
SELECT format(
    'CREATE ROLE %I LOGIN PASSWORD %L',
    :'app_user',
    :'app_password'
)
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_roles
    WHERE rolname = :'app_user'
)
\gexec

-- Create the application database.
-- Its owner can run Prisma migrations.
SELECT format(
    'CREATE DATABASE %I OWNER %I',
    :'app_db',
    :'app_user'
)
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = :'app_db'
)
\gexec

SQL

echo "Company database initialization completed."