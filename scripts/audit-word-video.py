#!/usr/bin/env python3
"""Frame-level audit for word-lesson videos.

Checks across the timeline:
  - subject stays visible (never disappears at start/end)
  - no large pale poster-card residue near the character

Usage:
  python3 scripts/audit-word-video.py public/videos/a-apple.mp4
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image


def extract(video: Path, t: float, out: Path) -> Image.Image:
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-ss",
            str(t),
            "-i",
            str(video),
            "-frames:v",
            "1",
            str(out),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return Image.open(out).convert("RGB")


def apple_mask(a: np.ndarray) -> np.ndarray:
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    return (r > g + 30) & (r > b + 35) & (r > 100)


def pale_near_subject(a: np.ndarray) -> tuple[float, int]:
    m = apple_mask(a)
    apples = int(m.sum())
    if apples < 500:
        return 1.0, apples
    ys, xs = np.where(m)
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    pad = 40
    y0, y1 = max(0, y0 - pad), min(a.shape[0] - 1, y1 + pad)
    x0, x1 = max(0, x0 - pad), min(a.shape[1] - 1, x1 + pad)
    roi = a[y0 : y1 + 1, x0 : x1 + 1].astype(np.float32)
    r, g, b = roi[:, :, 0], roi[:, :, 1], roi[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = (mx - mn) / (mx + 1e-5)
    pale = (sat < 0.14) & (mx > 210) & (r > 200) & (g > 190) & (b > 180)
    return float(pale.mean()), apples


def audit(video: Path, times: list[float] | None = None) -> dict:
    times = times or [0.0, 0.5, 1.0, 1.5, 2.5, 3.5, 4.5, 5.0, 5.5, 5.95]
    rows = []
    fail = False
    with tempfile.TemporaryDirectory() as td:
        td_path = Path(td)
        for t in times:
            im = extract(video, t, td_path / f"{t}.png")
            pale, apples = pale_near_subject(np.array(im))
            apple_ok = apples > 8000
            pale_ok = pale < 0.08
            if not apple_ok or not pale_ok:
                fail = True
            rows.append(
                {
                    "t": t,
                    "apple_px": apples,
                    "pale_near": round(pale, 4),
                    "apple_ok": apple_ok,
                    "pale_ok": pale_ok,
                }
            )
    return {"ok": not fail, "frames": rows, "video": str(video)}


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: audit-word-video.py <video.mp4>", file=sys.stderr)
        sys.exit(2)
    video = Path(sys.argv[1])
    result = audit(video)
    print(json.dumps(result, indent=2))
    for row in result["frames"]:
        flag = "OK" if row["apple_ok"] and row["pale_ok"] else "FAIL"
        print(
            f"  [{flag}] t={row['t']:.2f}s apple={row['apple_px']} pale={row['pale_near']}"
        )
    print("PASSED" if result["ok"] else "FAILED")
    sys.exit(0 if result["ok"] else 1)


if __name__ == "__main__":
    main()
