#!/usr/bin/env python3
"""Replace Imagine speech on a Friends concat with TTS. One line per 6s beat.

Duck-10% leaked the old line (R still said Rainbow). STT also lied.

This mutes Imagine audio and lays down TTS only:

  python3 scripts/friends-lock-lines.py FILE.mp4 --letter R --friends Rainbow Robot Rocket

Needs XAI_API_KEY. Writes --out or in place. Then run friends-stt-check.py.
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


def run(cmd: list[str]) -> None:
    p = subprocess.run(cmd, capture_output=True, text=True)
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
        raise RuntimeError(f"TTS empty for {text!r}")


def lock_beat(video: Path, speech: Path, dest: Path, delay_ms: int) -> None:
    fc = (
        f"[1:a]adelay={delay_ms}|{delay_ms},"
        f"apad=whole_dur=6,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[a]"
    )
    run([
        FF, "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(video), "-i", str(speech),
        "-filter_complex", fc,
        "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "128k",
        "-t", "6",
        str(dest),
    ])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("mp4")
    ap.add_argument("--letter", required=True)
    ap.add_argument("--friends", nargs=3, required=True)
    ap.add_argument("--little", action="store_true")
    ap.add_argument("--out")
    ap.add_argument("--delay-ms", type=int, default=350)
    args = ap.parse_args()

    key = os.environ.get("XAI_API_KEY")
    if not key:
        print("FAIL: XAI_API_KEY missing", file=sys.stderr)
        return 2

    src = Path(args.mp4)
    letter = args.letter.strip()
    lines = [
        f"I'm little {letter}!" if args.little else f"I'm Big {letter.upper()}!",
        f"I'm {args.friends[0]}!",
        f"I'm {args.friends[1]}!",
        f"I'm {args.friends[2]}!",
    ]
    out = Path(args.out) if args.out else src
    enc = [
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "24",
        "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "128k",
        "-movflags", "+faststart",
    ]

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        beats = []
        for i, start in enumerate((0, 6, 12, 18)):
            raw = tmp / f"v{i}.mp4"
            mp3 = tmp / f"t{i}.mp3"
            locked = tmp / f"l{i}.mp4"
            run([
                FF, "-y", "-hide_banner", "-loglevel", "error",
                "-i", str(src), "-ss", str(start), "-t", "6",
                "-vf", "scale=480:720", *enc, str(raw),
            ])
            tts(lines[i], mp3, key)
            lock_beat(raw, mp3, locked, args.delay_ms)
            beats.append(locked)
        lst = tmp / "list.txt"
        lst.write_text("".join(f"file '{p}'\n" for p in beats))
        mixed = tmp / "out.mp4"
        run([
            FF, "-y", "-hide_banner", "-loglevel", "error",
            "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", str(mixed),
        ])
        out.write_bytes(mixed.read_bytes())

    print(json.dumps({"ok": True, "lines": lines, "voice": VOICE, "out": str(out)}))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(2)
