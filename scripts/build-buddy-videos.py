#!/usr/bin/env python3
"""Build 10s 480p 'meet the buddy' videos from letter mascots + a word prop.

Does not overwrite original artwork. Writes public/videos/buddies/{a-z}.mp4
"""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path("/workspace")
OUT = ROOT / "public" / "videos" / "buddies"
LETTERS_DIR = ROOT / "public" / "letters"
CUTOUTS = ROOT / "public" / "videos" / "cutouts"

# letter, hue, first-word slug (prop)
LETTERS = [
    ("a", "#FF6B6B", "apple"),
    ("b", "#4DABF7", "ball"),
    ("c", "#FF922B", "cat"),
    ("d", "#69DB7C", "dog"),
    ("e", "#9775FA", "elephant"),
    ("f", "#FFA8A8", "fish"),
    ("g", "#63E6BE", "giraffe"),
    ("h", "#FFD43B", "hat"),
    ("i", "#74C0FC", "ice-cream"),
    ("j", "#B197FC", "juice"),
    ("k", "#FF8787", "kite"),
    ("l", "#8CE99A", "lion"),
    ("m", "#66D9E8", "moon"),
    ("n", "#FFA94D", "nest"),
    ("o", "#FF6B6B", "orange"),
    ("p", "#DA77F2", "pizza"),
    ("q", "#748FFC", "queen"),
    ("r", "#FF8787", "rainbow"),
    ("s", "#FFD43B", "sun"),
    ("t", "#69DB7C", "tree"),
    ("u", "#91A7FF", "umbrella"),
    ("v", "#E599F7", "violin"),
    ("w", "#4DABF7", "whale"),
    ("x", "#FFA8A8", "xray"),
    ("y", "#FFE066", "yoyo"),
    ("z", "#63E6BE", "zebra"),
]

W, H = 480, 720
FPS = 20
SECS = 10


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def make_stage(hue: str, dest: Path) -> None:
    r, g, b = hex_rgb(hue)
    img = Image.new("RGB", (W, H))
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        rr = int(r + (255 - r) * (0.15 + 0.7 * t))
        gg = int(g + (255 - g) * (0.18 + 0.65 * t))
        bb = int(b + (255 - b) * (0.22 + 0.6 * t))
        for x in range(W):
            px[x, y] = (min(255, rr), min(255, gg), min(255, bb))
    draw = ImageDraw.Draw(img, "RGBA")
    draw.ellipse((40, 80, 200, 240), fill=(255, 255, 255, 55))
    draw.ellipse((280, 420, 460, 640), fill=(255, 255, 255, 40))
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    img.save(dest, "PNG")


def fit_rgba(src: Path, max_w: int, max_h: int, dest: Path) -> None:
    im = Image.open(src).convert("RGBA")
    im.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    # rounded card so the still doesn't look like a raw rectangle
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, im.size[0] - 1, im.size[1] - 1),
        radius=min(im.size) // 8,
        fill=255,
    )
    im.putalpha(mask)
    canvas = Image.new("RGBA", im.size, (0, 0, 0, 0))
    canvas.paste(im, (0, 0), im)
    canvas.save(dest, "PNG")


def find_prop(letter: str, slug: str) -> Path | None:
    for name in (f"{letter}-{slug}.png", f"{letter}-{slug}.webp"):
        p = CUTOUTS / name
        if p.exists():
            return p
    poster = ROOT / "public" / "posters" / f"{letter}-{slug}.webp"
    if poster.exists():
        return poster
    alt = ROOT / "public" / "videos" / "apple-cutout.png"
    if letter == "a" and alt.exists():
        return alt
    return None


def encode(letter: str, hue: str, slug: str, tmp: Path) -> Path:
    stage = tmp / f"{letter}-stage.png"
    buddy = tmp / f"{letter}-buddy.png"
    prop = tmp / f"{letter}-prop.png"
    make_stage(hue, stage)
    fit_rgba(LETTERS_DIR / f"{letter}.webp", 300, 420, buddy)
    prop_src = find_prop(letter, slug)
    has_prop = False
    if prop_src:
        fit_rgba(prop_src, 150, 180, prop)
        has_prop = True

    out = OUT / f"{letter}.mp4"
    # Dance: bounce + sway. Prop tosses in an arc.
    if has_prop:
        filt = (
            f"[0:v]scale={W}:{H},setsar=1,format=rgba[bg];"
            f"[1:v]format=rgba[bud];"
            f"[2:v]format=rgba[pr];"
            f"[bg][bud]overlay=x='(W-w)/2+16*sin(2*PI*t/0.65)':"
            f"y='(H-h)/2+8+22*abs(sin(2*PI*t/0.42))':shortest=1[s1];"
            f"[s1][pr]overlay=x='W-w-18+14*sin(2*PI*t/1.1)':"
            f"y='36+90*abs(sin(2*PI*t/0.85))':shortest=1,format=yuv420p"
        )
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(stage),
            "-loop", "1", "-i", str(buddy),
            "-loop", "1", "-i", str(prop),
            "-filter_complex", filt,
            "-t", str(SECS),
            "-r", str(FPS),
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "28",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-an",
            str(out),
        ]
    else:
        filt = (
            f"[0:v]scale={W}:{H},setsar=1,format=rgba[bg];"
            f"[1:v]format=rgba[bud];"
            f"[bg][bud]overlay=x='(W-w)/2+16*sin(2*PI*t/0.65)':"
            f"y='(H-h)/2+8+22*abs(sin(2*PI*t/0.42))':shortest=1,format=yuv420p"
        )
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(stage),
            "-loop", "1", "-i", str(buddy),
            "-filter_complex", filt,
            "-t", str(SECS),
            "-r", str(FPS),
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-crf", "28",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            "-an",
            str(out),
        ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        for letter, hue, slug in LETTERS:
            path = encode(letter, hue, slug, tmp)
            print(f"wrote {path.name} {path.stat().st_size}")


if __name__ == "__main__":
    main()
