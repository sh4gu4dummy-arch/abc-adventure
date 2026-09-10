#!/usr/bin/env python3
"""Dump 5 timeline frames for visual word-video QA.

  python3 scripts/qa-word-frames.py public/videos/h-heart.mp4

Inspect EVERY frame before replacing public/videos. Fail and redo if any
frame has extra limbs/animals, a prop with two working ends, lip-flap,
morphing, treadmill locomotion, food-with-a-face, or a giant handheld prop.
Thumbnail-only review is not QA.
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

CHECKLIST = """
QA {stem}  ({n} frames → {out})
Look at each file. Fail the clip if ANY frame has:
  [ ] extra limbs, extra animals, extra people
  [ ] a tool with two working ends (two tips, two heads, two handles)
  [ ] talking / lip-flap (unless eating, yawning, or blowing)
  [ ] the subject morphing into something else
  [ ] locomotion that does not travel (treadmill)
  [ ] food with a face (if a kid eats it)
  [ ] a handheld prop bigger than the kid's head
"""


def duration_sec(video: Path) -> float:
    p = subprocess.run(
        [
            "ffmpeg", "-i", str(video),
        ],
        capture_output=True,
        text=True,
    )
    err = p.stderr or ""
    for token in err.replace(",", " ").split():
        if token.count(":") == 2 and token[:1].isdigit():
            h, m, s = token.split(":")
            try:
                return int(h) * 3600 + int(m) * 60 + float(s)
            except ValueError:
                continue
    return 10.0


def dump(video: Path, dest: Path) -> list[Path]:
    dest.mkdir(parents=True, exist_ok=True)
    d = max(duration_sec(video), 1.0)
    stamps = [0.0, d * 0.25, d * 0.5, d * 0.75, max(0.0, d - 0.12)]
    names = ["01-start", "02-25", "03-mid", "04-75", "05-end"]
    out: list[Path] = []
    for name, t in zip(names, stamps):
        path = dest / f"{name}.jpg"
        subprocess.check_call(
            [
                "ffmpeg", "-y", "-ss", f"{t:.2f}", "-i", str(video),
                "-frames:v", "1", "-q:v", "3", str(path),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        out.append(path)
    return out


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("usage: qa-word-frames.py VIDEO.mp4 [OUTDIR]")
    video = Path(sys.argv[1])
    if not video.exists():
        raise SystemExit(f"missing {video}")
    dest = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("/tmp/qa-frames") / video.stem
    frames = dump(video, dest)
    print(CHECKLIST.format(stem=video.stem, n=len(frames), out=dest))
    for f in frames:
        print(f"  {f}")


if __name__ == "__main__":
    main()
