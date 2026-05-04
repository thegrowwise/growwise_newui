#!/usr/bin/env bash
# Start Locust web UI. Primary target is localhost (`LOCUST_HOST` defaults to http://127.0.0.1:3000).
# Start the Next app first: npm run build && npm run start
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

PYTHON="${PYTHON:-python3}"
HOST="${LOCUST_HOST:-http://127.0.0.1:3000}"

if [[ ! -d .venv ]]; then
  "$PYTHON" -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
pip install -q -r requirements.txt

echo "Locust web UI → http://localhost:8089"
echo "Host under test   → ${HOST}"
exec locust -f locustfile.py --host="${HOST}"
