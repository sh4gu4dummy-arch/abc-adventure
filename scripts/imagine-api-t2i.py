#!/usr/bin/env python3
"""Text-to-image via official xAI Imagine API.

Auth: XAI_API_KEY → $HOME/.grok/auth.json → /root/.grok/auth.json
(see scripts/imagine_auth.py). Downloads imgen URL immediately.

  python3 scripts/imagine-api-t2i.py "prompt" /tmp/out.jpg --aspect 2:3
"""
from __future__ import annotations

import argparse
import json
import ssl
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

from imagine_auth import bearer_token

API = "https://api.x.ai/v1"


def req(method: str, url: str, token: str, body=None, timeout=120):
    data = None if body is None else json.dumps(body).encode()
    r = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(r, context=ctx, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} {e.read()[:400]!r}") from e


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(r, context=ctx, timeout=120) as resp:
            dest.write_bytes(resp.read())
            return
    except Exception:
        pass
    subprocess.check_call(["curl", "-fL", "--retry", "3", url, "-o", str(dest)])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("prompt")
    ap.add_argument("out")
    ap.add_argument("--aspect", default="2:3")
    ap.add_argument("--model", default="grok-imagine-image")
    args = ap.parse_args()
    token = bearer_token()
    created = req(
        "POST",
        f"{API}/images/generations",
        token,
        {
            "model": args.model,
            "prompt": args.prompt,
            "n": 1,
            "aspect_ratio": args.aspect,
        },
    )
    item = (created.get("data") or [None])[0]
    if not item or not item.get("url"):
        raise SystemExit(f"no image url: {created}")
    dest = Path(args.out)
    download(item["url"], dest)
    print(f"saved {dest} {dest.stat().st_size}")


if __name__ == "__main__":
    main()
