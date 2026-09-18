#!/usr/bin/env python3
"""Image edit / I2I via xAI Imagine — product look-lock.

POST https://api.x.ai/v1/images/edits
Auth: XAI_API_KEY → $HOME/.grok/auth.json → /root/.grok/auth.json

Official docs allow up to 5 source images per edit. We cap --ref at 5
(Friends look-lock often needs letter + 3 posters = 4).

  python3 scripts/imagine-api-i2i.py \\
      --ref public/posters/b-bear.webp \\
      --ref public/posters/b-ball.webp \\
      --ref public/letters/b.webp \\
      --prompt "Wide yard Friends still: same characters as refs…" \\
      docs/audit/b-play-2/00-source-still.jpg --aspect 9:16

Do NOT run product gens until Ash go + XAI_API_KEY (via QAsupervisor).
"""
from __future__ import annotations

import argparse
import base64
import json
import ssl
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

from imagine_auth import bearer_token

API = "https://api.x.ai/v1"
# Official Imagine multi-edit max is 5 source images.
MAX_REFS = 5


def mime(path: Path) -> str:
    return {
        ".webp": "image/webp",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }.get(path.suffix.lower(), "image/png")


def data_url(path: Path) -> str:
    raw = path.read_bytes()
    return f"data:{mime(path)};base64,{base64.b64encode(raw).decode()}"


def req(method: str, url: str, token: str, body=None, timeout=180):
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
        # Log body snippet only — never the Authorization header / token.
        raise SystemExit(f"HTTP {e.code} {e.read()[:500]!r}") from e


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


def post_edit(token: str, body: dict) -> dict:
    return req("POST", f"{API}/images/edits", token, body)


def main() -> None:
    ap = argparse.ArgumentParser(description="Imagine I2I / images/edits")
    ap.add_argument(
        "--ref",
        action="append",
        default=[],
        help=f"Source image path (max {MAX_REFS}; official docs max)",
    )
    ap.add_argument("--prompt", required=True)
    ap.add_argument("out")
    ap.add_argument("--aspect", default="9:16")
    ap.add_argument("--model", default="grok-imagine-image-2.0")
    args = ap.parse_args()

    refs = [Path(p) for p in args.ref]
    if not refs:
        raise SystemExit("need at least one --ref")
    if len(refs) > MAX_REFS:
        raise SystemExit(f"max {MAX_REFS} --ref (official Imagine multi-edit max)")
    for p in refs:
        if not p.is_file():
            raise SystemExit(f"missing ref: {p}")

    token = bearer_token()
    images = [{"url": data_url(p), "type": "image_url"} for p in refs]

    base = {
        "model": args.model,
        "prompt": args.prompt,
        "n": 1,
        "aspect_ratio": args.aspect,
    }

    # Prefer docs shape: single → "image"; multi → try "images" then fallback "image" as list.
    attempts: list[dict] = []
    if len(images) == 1:
        attempts.append({**base, "image": images[0]})
    else:
        attempts.append({**base, "images": images})
        attempts.append({**base, "image": images})

    last_err: Exception | None = None
    created = None
    for body in attempts:
        try:
            created = post_edit(token, body)
            break
        except SystemExit as e:
            last_err = e
            print(f"edit attempt failed ({list(body.keys())}): {e}", flush=True)
            continue
    if created is None:
        raise SystemExit(f"all edit body shapes failed: {last_err}")

    item = (created.get("data") or [None])[0]
    if not item or not item.get("url"):
        raise SystemExit(f"no image url: {created}")
    dest = Path(args.out)
    download(item["url"], dest)
    print(f"saved {dest} {dest.stat().st_size} refs={len(refs)}")


if __name__ == "__main__":
    main()
