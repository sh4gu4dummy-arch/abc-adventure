#!/usr/bin/env python3
"""Image-to-video via official xAI API + the session OIDC JWT.

No pasted API key. Reads /root/.grok/auth.json (eyJ… JWT, not xai-).
Downloads video.url immediately (vidgen.x.ai). Does not use the artifacts locker.

  python3 scripts/imagine-api-i2v.py public/letters/c.webp \\
      "Camera locked. This exact character waves a paw." \\
      public/videos/imagine/c.mp4 --duration 6 --resolution 480p
"""
from __future__ import annotations

import argparse
import base64
import json
import ssl
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

AUTH = Path("/root/.grok/auth.json")
API = "https://api.x.ai/v1"


def session_jwt() -> str:
    rec = next(iter(json.loads(AUTH.read_text()).values()))
    key = rec["key"]
    if not str(key).startswith("eyJ"):
        raise SystemExit("auth.json key is not an OIDC JWT")
    return key


def mime(path: Path) -> str:
    return {
        ".webp": "image/webp",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }.get(path.suffix.lower(), "image/png")


def req(method: str, url: str, jwt: str, body=None, timeout=60):
    data = None if body is None else json.dumps(body).encode()
    r = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {jwt}",
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
    # DNS hole fallback
    import subprocess

    subprocess.check_call(
        [
            "curl",
            "-fL",
            "--retry",
            "3",
            "--resolve",
            "vidgen.x.ai:443:104.18.18.80",
            url,
            "-o",
            str(dest),
        ]
    )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("prompt")
    ap.add_argument("out")
    ap.add_argument("--duration", type=int, default=6)
    ap.add_argument("--resolution", default="480p")
    args = ap.parse_args()
    img = Path(args.image)
    raw = img.read_bytes()
    data_url = f"data:{mime(img)};base64,{base64.b64encode(raw).decode()}"
    jwt = session_jwt()
    created = req(
        "POST",
        f"{API}/videos/generations",
        jwt,
        {
            "model": "grok-imagine-video-1.5",
            "prompt": args.prompt,
            "duration": args.duration,
            "resolution": args.resolution,
            "image": {"url": data_url},
        },
    )
    rid = created.get("request_id")
    if not rid:
        raise SystemExit(f"no request_id: {created}")
    print(f"request_id {rid}", flush=True)
    for i in range(48):
        time.sleep(5)
        rec = req("GET", f"{API}/videos/{rid}", jwt)
        status = rec.get("status")
        print(f"poll {i} {status}", flush=True)
        if status == "done":
            url = (rec.get("video") or {}).get("url")
            if not url:
                raise SystemExit(f"done but no url: {rec}")
            dest = Path(args.out)
            download(url, dest)
            print(f"saved {dest} {dest.stat().st_size}", flush=True)
            return
        if status in ("failed", "expired"):
            raise SystemExit(f"{status}: {rec}")
    raise SystemExit("timeout")


if __name__ == "__main__":
    main()
