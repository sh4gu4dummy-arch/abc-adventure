#!/usr/bin/env python3
"""Shared Imagine auth for ABC Adventure scripts (DRAFT — not shipped).

Prefer:
  1) env XAI_API_KEY  (console.x.ai — QA box / platform inject)
  2) $HOME/.grok/auth.json  (OIDC JWT — portable)
  3) /root/.grok/auth.json  (OIDC JWT — Builder machine)

Never prints the token. Accepts xai-… API keys or eyJ… JWTs.
"""
from __future__ import annotations

import json
import os
from pathlib import Path


def bearer_token() -> str:
    env = (os.environ.get("XAI_API_KEY") or "").strip()
    if env:
        return env

    homes = [
        Path.home() / ".grok" / "auth.json",
        Path("/root/.grok/auth.json"),
    ]
    for path in homes:
        try:
            if not path.is_file():
                continue
        except PermissionError:
            continue
        try:
            raw = json.loads(path.read_text())
        except (OSError, json.JSONDecodeError):
            continue
        objs: list[dict] = []
        if isinstance(raw, list):
            objs = [x for x in raw if isinstance(x, dict)]
        elif isinstance(raw, dict):
            if "key" in raw or "token" in raw or "access_token" in raw:
                objs = [raw]
            else:
                objs = [v for v in raw.values() if isinstance(v, dict)]
        for obj in objs:
            key = obj.get("key") or obj.get("token") or obj.get("access_token")
            if key:
                return str(key)

    raise SystemExit(
        "No Imagine auth. Set XAI_API_KEY, or provide "
        "$HOME/.grok/auth.json or /root/.grok/auth.json (OIDC JWT)."
    )
