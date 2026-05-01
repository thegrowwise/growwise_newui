#!/usr/bin/env bash
# Headless smoke load (CI / terminal). Primary target: localhost (see LOCUST_HOST).
# Locust exits non-zero when failed requests are recorded.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

PYTHON="${PYTHON:-python3}"
HOST="${LOCUST_HOST:-http://127.0.0.1:3000}"
USERS="${LOCUST_USERS:-10}"
SPAWN="${LOCUST_SPAWN_RATE:-2}"
DURATION="${LOCUST_RUN_TIME:-60s}"

if [[ "${CI:-}" == "true" ]] && command -v locust >/dev/null 2>&1; then
  echo "Locust headless (CI): users=${USERS} spawn_rate=${SPAWN} duration=${DURATION} host=${HOST}"
  exec locust -f locustfile.py \
    --host="${HOST}" \
    --headless \
    -u "${USERS}" \
    -r "${SPAWN}" \
    -t "${DURATION}"
fi

if [[ ! -d .venv ]]; then
  "$PYTHON" -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

echo "Locust headless: users=${USERS} spawn_rate=${SPAWN} duration=${DURATION} host=${HOST}"

exec locust -f locustfile.py \
  --host="${HOST}" \
  --headless \
  -u "${USERS}" \
  -r "${SPAWN}" \
  -t "${DURATION}"
