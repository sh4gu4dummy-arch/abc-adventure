#!/usr/bin/env python3
"""Listen-gate for Friends 4-clip concats. Do not ship if names swap.

  python3 scripts/friends-stt-check.py public/friends-clips/m-play-1.mp4 \\
      --letter M --friends Moon Monkey Mouse

Needs XAI_API_KEY. Exit 1 = FAIL (do not push that mp4).

Catches:
  - letter clip saying a friend name (M saying Moon)
  - same friend name in two clips
  - a later clip missing its friend name
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

FF = os.environ.get("FFMPEG") or (
    "/usr/local/bin/ffmpeg" if Path("/usr/local/bin/ffmpeg").exists() else "ffmpeg"
)
STT_URL = "https://api.x.ai/v1/stt"
MODEL = "grok-voice-transcribe-2.0"


def ffmpeg(*args: str) -> None:
    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error", *args]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr or "ffmpeg failed")


def stt(mp3: Path, key: str) -> dict:
    boundary = "----friendsstt"
    data = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="model"\r\n\r\n{MODEL}\r\n'
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="{mp3.name}"\r\n'
        f"Content-Type: audio/mpeg\r\n\r\n"
    ).encode() + mp3.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        STT_URL,
        data=data,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read().decode())


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", s.lower()).strip()


def has_word(text: str, word: str) -> bool:
    t, w = norm(text), norm(word)
    if not w:
        return False
    return re.search(rf"\b{re.escape(w)}\b", t) is not None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4")
    ap.add_argument("--letter", required=True, help="M or m")
    ap.add_argument("--friends", nargs=3, required=True, metavar="NAME")
    ap.add_argument("--little", action="store_true")
    args = ap.parse_args()

    key = os.environ.get("XAI_API_KEY")
    if not key:
        print("FAIL: XAI_API_KEY missing — cannot listen", file=sys.stderr)
        return 2

    src = Path(args.mp4)
    letter = args.letter.strip()
    friends = [f.strip() for f in args.friends]
    letter_line = f"little {letter}" if args.little else f"big {letter}"
    fails: list[str] = []
    clips: list[dict] = []
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        for i, start in enumerate((0, 6, 12, 18)):
            mp3 = tmp / f"c{i+1}.mp3"
            ffmpeg(
                "-i", str(src),
                "-ss", str(start),
                "-t", "6",
                "-vn",
                "-c:a", "libmp3lame",
                "-q:a", "4",
                str(mp3),
            )
            rec = stt(mp3, key)
            text = rec.get("text") or ""
            clips.append({"clip": i + 1, "start": start, "text": text})

    c1 = clips[0]["text"]
    for name in friends:
        if has_word(c1, name):
            fails.append(f"clip 1 (letter) says friend name {name!r}: {c1!r}")

    seen: dict[str, int] = {}
    for name, clip in zip(friends, clips[1:]):
        t = clip["text"]
        n = clip["clip"]
        if not has_word(t, name):
            fails.append(f"clip {n} missing {name!r}: {t!r}")
        others = [x for x in friends if x.lower() != name.lower()]
        spoken_friends = [x for x in friends if has_word(t, x)]
        if len(spoken_friends) > 1:
            fails.append(f"clip {n} has two friend names {spoken_friends}: {t!r}")
        for other in others:
            if has_word(t, other):
                fails.append(f"clip {n} ({name}) also says {other!r}: {t!r}")
        for other in friends:
            if has_word(t, other):
                if other.lower() in seen:
                    fails.append(
                        f"{other!r} spoken in clip {seen[other.lower()]} and clip {n}"
                    )
                else:
                    seen[other.lower()] = n

    out = {
        "ok": not fails,
        "letter": letter,
        "expect": [letter_line, *friends],
        "clips": clips,
        "fails": fails,
    }
    print(json.dumps(out, indent=2))
    return 0 if not fails else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(2)
