# Locust load tests (HTTP)

**Primary:** **`next build` + `next start`** on **`http://127.0.0.1:<PORT>`** (default port **3000**), then Locust with default **`LOCUST_HOST`**. **Localhost is the most important surface** — fast, repeatable regression signal; CI uses the same.

Preview, staging, or production URLs are optional follow-ups — only after localhost passes, and production needs explicit approval and rate discipline.

**Not** Lighthouse: Locust measures **throughput, latency, failure rate** under concurrency.

## Prerequisite

- Python **3.11+** (`python3`)
- Next app running the build you want to stress: **`npm run build && npm run start`** (not `next dev` for prod-like numbers).

## Configuration

- URL list: shared with Lighthouse smoke — [`../config/smoke-paths.json`](../config/smoke-paths.json).
- Locust file: [`locustfile.py`](./locustfile.py).

## Commands (from `performance-testing/load/`)

| Script | Use |
|--------|-----|
| [`run-locust-web.sh`](./run-locust-web.sh) | Open **http://localhost:8089**, set shape in UI. `LOCUST_HOST` = site under test (default `http://127.0.0.1:3000`). |
| [`run-locust-headless.sh`](./run-locust-headless.sh) | No UI; fixed duration. Env: `LOCUST_USERS`, `LOCUST_SPAWN_RATE`, `LOCUST_RUN_TIME`, `LOCUST_HOST`. |

From repo root (after `chmod +x performance-testing/load/*.sh` once):

```bash
export LOCUST_HOST=http://127.0.0.1:3000
./performance-testing/load/run-locust-web.sh
# or headless example:
LOCUST_USERS=30 LOCUST_SPAWN_RATE=3 LOCUST_RUN_TIME=120s ./performance-testing/load/run-locust-headless.sh
```

Or **`npm run perf:locust`** / **`npm run perf:locust:headless`** (thin wrappers).

## CI

Runs **`http://127.0.0.1:3000`** on the Actions runner (**localhost-first** — same stance as Lighthouse). Workflow: [`.github/workflows/performance-load-locust.yml`](../../.github/workflows/performance-load-locust.yml) (`workflow_dispatch`).

## Behaviour

- **`GrowWiseVisitor`**: mixes **homepage** (~23% vs ~77% smoke paths via task weights).
- **`catch_response`** marks 4xx/5xx / connection failures; Locust **headless** exits **non-zero** when failures are recorded (standard behaviour).

## Ads / tracking

Load tests hit **anonymous GET** pages only; no change to Meta / GTM. Third-party domains are not scripted.
