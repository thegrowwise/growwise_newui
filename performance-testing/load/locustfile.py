"""Locust load test for GrowWise Next.js site.

Reads URLs from sibling config: performance-testing/config/smoke-paths.json.

Run (from repo root, with app up: npm run build && npm run start):
  cd performance-testing/load && bash run-locust-web.sh
  LOCUST_HOST=http://127.0.0.1:3000 LOCUST_USERS=20 bash run-locust-headless.sh

Primary host: localhost (http://127.0.0.1) after `npm run build && npm run start`.
Only aim at staging/production deliberately — never overwhelm live traffic.
"""

from __future__ import annotations

import json
import random
from pathlib import Path

from locust import HttpUser, between, task

_CONFIG = Path(__file__).resolve().parent.parent / "config" / "smoke-paths.json"


def load_paths() -> list[str]:
    raw = json.loads(_CONFIG.read_text(encoding="utf-8"))
    paths = raw.get("paths") if isinstance(raw, dict) else None
    if not isinstance(paths, list) or not all(isinstance(p, str) and p for p in paths):
        raise SystemExit(f"Invalid or missing non-empty paths[] in {_CONFIG}")
    return paths


PATHS = load_paths()


class GrowWiseVisitor(HttpUser):
    """Synthetic user: GET landing + spread across smoke paths."""

    wait_time = between(1, 4)

    @task(3)
    def home(self) -> None:
        self._get("/", name="/")

    @task(10)
    def smoke_paths(self) -> None:
        p = random.choice(PATHS)
        if p == "/":
            self._get("/", name="/")
            return
        self._get(p, name=p)

    def _get(self, path: str, name: str) -> None:
        with self.client.get(path, catch_response=True, name=name) as resp:
            if resp.status_code == 0:
                resp.failure("connection error")
            elif resp.status_code >= 400:
                resp.failure(f"HTTP {resp.status_code}")
