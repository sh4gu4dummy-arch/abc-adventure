#!/usr/bin/env python3
"""Clip-1 speech lock for Friends concats.

Imagine keeps making the letter say a friend's name (R→Rainbow, M→Moon,
H→House). STT often still hears "I'm Big X" so it cannot catch it.

This replaces seconds 0–6 audio with:
  ducked original foley + TTS "I'm Big X!" / "I'm little x!"

  python3 scripts/friends-lock-letter-line.py FILE.mp4 --letter R
  python3 scripts/friends-lock-letter-line.py FILE.mp4 --letter r --little

Needs XAI_API_KEY. Writes FILE in place unless --out is set.
Run friends-stt-check.py after.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

FF = (
    os.environ.get("FFMPEG")
    or ("/usr/local/bin/ffmpeg" if Path("/usr/local/bin/ffmpeg").exists() else "ffmpeg")
)
TTS_URL = "https://api.x.ai/v1/tts"
VOICE = os.environ.get("FRIENDS_TTS_VOICE", "eve")


def run(args: list[str]) -> None:
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(p.stderr or "command failed")


def tts(text: str, dest: Path, key: str) -> None:
    body = json.dumps({"text": text, "voice_id": VOICE, "language": "en"}).encode()
    req = urllib.request.Request(
        TTS_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())
    if dest.stat().st_size < 200:
        raise RuntimeError("TTS returned empty audio")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4")
    ap.add_argument("--letter", required=True)
    ap.add_argument("--little", action="store_true")
    ap.add_argument("--out")
    ap.add_argument("--delay-ms", type=int, default=400)
    args = ap.parse_args()

    key = os.environ.get("XAI_API_KEY")
    if not key:
        print("FAIL: XAI_API_KEY missing", file=sys.stderr)
        return 2

    src = Path(args.mp4)
    letter = args.letter.strip()
    line = (
        f"I'm little {letter}!"
        if args.little
        else f"I'm Big {letter.upper()}!"
    )
    out = Path(args.out) if args.out else src

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        clip1 = tmp / "c1.mp4"
        rest = tmp / "rest.mp4"
        tts_mp3 = tmp / "line.mp3"
        locked = tmp / "c1-locked.mp4"
        enc = [
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "24",
            "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "128k",
            "-movflags", "+faststart",
        ]
        run([FF, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src),
             "-t", "6", "-vf", "scale=480:720", *enc, str(clip1)])
        run([FF, "-y", "-hide_banner", "-loglevel", "error", "-i", str(src),
             "-ss", "6", "-vf", "scale=480:720", *enc, str(rest)])
        tts(line, tts_mp3, key)
        delay = args.delay_ms
        fc = (
            f"[0:a]volume=0.10[a0];"
            f"[1:a]adelay={delay}|{delay},volume=2.2[a1];"
            f"[a0][a1]amix=inputs=2:duration=first:dropout_transition=0[a]"
        )
        run([
            FF, "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(clip1), "-i", str(tts_mp3),
            "-filter_complex", fc,
            "-map", "0:v", "-map", "[a]",
            "-c:v", "copy", "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "128k",
            "-t", "6",
            str(locked),
        ])
        lst = tmp / "list.txt"
        lst.write_text(f"file '{locked}'\nfile '{rest}'\n")
        mixed = tmp / "out.mp4"
        run([FF, "-y", "-hide_banner", "-loglevel", "error",
             "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(mixed)])
        dest = out
        dest.write_bytes(mixed.read_bytes())

    print(json.dumps({"ok": True, "line": line, "voice": VOICE, "out": str(out)}))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(2)
