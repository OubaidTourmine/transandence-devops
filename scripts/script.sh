#!/usr/bin/env bash

set -Eeuo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

missing=0

require_command() {
  local command_name="$1"
  local install_hint="$2"

  if command -v "$command_name" >/dev/null 2>&1; then
    echo "[ok] $command_name"
  else
    echo "[missing] $command_name — $install_hint" >&2
    missing=1
  fi
}

require_command "git" "install Git for your operating system"
require_command "docker" "install Docker Desktop or Docker Engine"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  echo "[ok] Docker Compose"
else
  echo "[missing] Docker Compose — install the Docker Compose plugin" >&2
  missing=1
fi

if (( missing != 0 )); then
  echo "Install the missing prerequisite(s), then run this script again." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker is installed, but the Docker daemon is not running." >&2
  echo "Start Docker Desktop or the Docker service, then run this script again." >&2
  exit 1
fi

docker compose config >/dev/null
echo "[ok] compose.yaml"
echo "Dependencies are ready. Build the project with: docker compose build"
