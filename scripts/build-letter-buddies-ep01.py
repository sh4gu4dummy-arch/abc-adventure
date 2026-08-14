#!/usr/bin/env python3
"""Letter Buddies Ep.01 — CAT.

Builds 16:9 storyboard stills from our letter mascots (consistent characters),
10s dance clips, voice bed from existing neural speech, then a 60s 420p film.
"""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace")
OUT_DIR = ROOT / "public" / "videos" / "series"
STILLS = OUT_DIR / "ep01-stills"
CLIPS = Path("/tmp/lb-ep01-clips")
W, H = 746, 420  # 420p 16:9
FPS = 20
AUDIO = ROOT / "public" / "audio"

# speech-map hashes
VOICES = {
    "letter_c": "db7214e116629b78.mp3",
    "c_sound": "51064855bf75325d.mp3",
    "letter_a": "d0344b1086a3541a.mp3",
    "a_sound": "fe3a2af81fb6f2e7.mp3",
    "letter_t": "6cbc131a32cdbbdc.mp3",
    "t_sound": "t-sound",  # filled below if missing
    "cat": "cebe54c7626cb1ce.mp3",
    "yes_cat": "1c2ce7f77fc9ea6a.mp3",
    "rhyme": None,
}


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for p in (
        ROOT / "public/fonts/Nunito-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ):
        if Path(p).exists():
            try:
                return ImageFont.truetype(str(p), size)
            except Exception:
                pass
    return ImageFont.load_default()


def paint_stage() -> Image.Image:
    img = Image.new("RGB", (W, H))
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        if t < 0.62:
            u = t / 0.62
            r = int(120 + 80 * u)
            g = int(190 + 40 * u)
            b = int(230 + 10 * u)
        else:
            u = (t - 0.62) / 0.38
            r = int(90 + 40 * u)
            g = int(170 - 20 * u)
            b = int(80 - 10 * u)
        for x in range(W):
            px[x, y] = (r, g, b)
    draw = ImageDraw.Draw(img, "RGBA")
    draw.ellipse((520, 18, 640, 130), fill=(255, 250, 180, 230))
    draw.ellipse((-40, 300, 220, 520), fill=(110, 190, 90, 255))
    draw.ellipse((500, 310, 800, 540), fill=(100, 180, 85, 255))
    return img.filter(ImageFilter.SMOOTH)


def load_buddy(letter: str, max_h: int) -> Image.Image:
    im = Image.open(ROOT / "public" / "letters" / f"{letter}.webp").convert("RGBA")
    im.thumbnail((int(max_h * 0.72), max_h), Image.Resampling.LANCZOS)
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, im.size[0] - 1, im.size[1] - 1),
        radius=min(im.size) // 7,
        fill=255,
    )
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), im)
    out.putalpha(mask)
    return out


def paste_c(base: Image.Image, buddy: Image.Image, xy: tuple[int, int]) -> None:
    base.paste(buddy, xy, buddy)


def caption(img: Image.Image, text: str, y: int = 18) -> None:
    draw = ImageDraw.Draw(img, "RGBA")
    f = font(36)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2
    draw.rounded_rectangle(
        (x - 16, y - 6, x + tw + 16, y + 44),
        radius=18,
        fill=(255, 255, 255, 210),
    )
    draw.text((x, y), text, font=f, fill=(40, 42, 70, 255))


def stills() -> dict[str, Path]:
    STILLS.mkdir(parents=True, exist_ok=True)
    c = load_buddy("c", 250)
    a = load_buddy("a", 250)
    t = load_buddy("t", 250)
    paths: dict[str, Path] = {}

    # 1 title — all three
    s = paint_stage()
    paste_c(s, c, (70, 130))
    paste_c(s, a, (290, 118))
    paste_c(s, t, (510, 128))
    caption(s, "Letter Buddies")
    p = STILLS / "01-title.png"
    s.save(p)
    paths["title"] = p

    # 2 C close
    s = paint_stage()
    big = load_buddy("c", 340)
    paste_c(s, big, ((W - big.size[0]) // 2, 70))
    caption(s, "C")
    p = STILLS / "02-c.png"
    s.save(p)
    paths["c"] = p

    # 3 A close
    s = paint_stage()
    big = load_buddy("a", 340)
    paste_c(s, big, ((W - big.size[0]) // 2, 70))
    caption(s, "A")
    p = STILLS / "03-a.png"
    s.save(p)
    paths["a"] = p

    # 4 T close
    s = paint_stage()
    big = load_buddy("t", 340)
    paste_c(s, big, ((W - big.size[0]) // 2, 70))
    caption(s, "T")
    p = STILLS / "04-t.png"
    s.save(p)
    paths["t"] = p

    # 5 join C-A-T
    s = paint_stage()
    paste_c(s, c, (80, 125))
    paste_c(s, a, (290, 118))
    paste_c(s, t, (500, 125))
    caption(s, "C  ·  A  ·  T")
    p = STILLS / "05-join.png"
    s.save(p)
    paths["join"] = p

    # 6 CAT reveal — buddies + cat scene
    s = paint_stage()
    cat = Image.open(ROOT / "public" / "posters" / "c-cat.webp").convert("RGBA")
    cat.thumbnail((240, 300), Image.Resampling.LANCZOS)
    mask = Image.new("L", cat.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, cat.size[0] - 1, cat.size[1] - 1), radius=28, fill=255
    )
    cat.putalpha(mask)
    paste_c(s, c, (30, 160))
    paste_c(s, a, (200, 155))
    paste_c(s, cat, (370, 90))
    paste_c(s, t, (560, 160))
    caption(s, "CAT!")
    p = STILLS / "06-cat.png"
    s.save(p)
    paths["cat"] = p

    return paths


def clip_from_still(src: Path, dest: Path, seconds: float, bounce: bool = True) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if bounce:
        filt = (
            f"scale={W}:{H},setsar=1,"
            f"zoompan=z='1.04+0.03*sin(2*PI*on/{FPS*1.2})':"
            f"x='iw/2-(iw/zoom/2)+8*sin(2*PI*on/{FPS*0.7})':"
            f"y='ih/2-(ih/zoom/2)+6*abs(sin(2*PI*on/{FPS*0.45}))':"
            f"d={int(seconds * FPS)}:s={W}x{H}:fps={FPS},format=yuv420p"
        )
    else:
        filt = f"scale={W}:{H},setsar=1,format=yuv420p"
    subprocess.run(
        [
            "ffmpeg", "-y", "-loop", "1", "-i", str(src),
            "-vf", filt, "-t", str(seconds), "-r", str(FPS),
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
            "-pix_fmt", "yuv420p", "-an", str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def audio_len(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffmpeg", "-i", str(path),
        ],
        stderr=subprocess.STDOUT,
        text=True,
    )
    # Duration: 00:00:02.45
    import re

    m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", out)
    if not m:
        return 2.0
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))


def find_t_sound() -> Path | None:
    # T says tuh, like tiger! — look up if present
    import re

    text = (ROOT / "src/data/speech-map.ts").read_text()
    m = re.search(r'"T says[^"]+": "([a-f0-9]+)\.mp3"', text)
    if m:
        p = AUDIO / f"{m.group(1)}.mp3"
        return p if p.exists() else None
    return None


def mix_audio(dest: Path) -> None:
    """Lay speech on a 60s timeline."""
    letter_c = AUDIO / VOICES["letter_c"]
    c_sound = AUDIO / VOICES["c_sound"]
    letter_a = AUDIO / VOICES["letter_a"]
    a_sound = AUDIO / VOICES["a_sound"]
    letter_t = AUDIO / VOICES["letter_t"]
    t_sound = find_t_sound()
    cat = AUDIO / VOICES["cat"]
    yes = AUDIO / VOICES["yes_cat"]

    # timeline (seconds):
    # 0-6 title (silence)
    # 6 letter C, ~8.2 C sound
    # 16 letter A, ~18.2 A sound
    # 26 letter T, ~28.2 T sound
    # 36-46 join quiet then Cat at 40
    # 46 Yes! Cat starts with C!
    parts = []
    delays = []

    def add(path: Path | None, at: float) -> None:
        if not path or not path.exists():
            return
        idx = len(parts)
        parts.append(path)
        delays.append((idx, int(at * 1000)))

    add(letter_c, 6.1)
    add(c_sound, 8.3)
    add(letter_a, 16.1)
    add(a_sound, 18.3)
    add(letter_t, 26.1)
    add(t_sound, 28.3)
    add(cat, 40.0)
    add(yes, 47.0)

    if not parts:
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                "-t", "60", "-c:a", "aac", str(dest),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return

    cmd = ["ffmpeg", "-y"]
    for p in parts:
        cmd += ["-i", str(p)]
    filters = []
    mix = []
    for idx, ms in delays:
        filters.append(f"[{idx}:a]adelay={ms}|{ms},apad=pad_dur=60,atrim=0:60[a{idx}]")
        mix.append(f"[a{idx}]")
    filters.append(
        f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,alimiter=limit=0.95[aout]"
    )
    cmd += [
        "-filter_complex",
        ";".join(filters),
        "-map",
        "[aout]",
        "-t",
        "60",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        str(dest),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def concat(clips: list[Path], audio: Path, dest: Path) -> None:
    lst = CLIPS / "list.txt"
    lst.write_text("".join(f"file '{p}'\n" for p in clips))
    raw = CLIPS / "video.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
            "-pix_fmt", "yuv420p", "-r", str(FPS), "-an", str(raw),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(raw), "-i", str(audio),
            "-c:v", "copy", "-c:a", "aac", "-b:a", "128k",
            "-shortest", "-movflags", "+faststart", str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    CLIPS.mkdir(parents=True, exist_ok=True)
    frames = stills()
    # 6 + 10 + 10 + 10 + 10 + 10 + 4 = 60
    plan = [
        (frames["title"], CLIPS / "01.mp4", 6, False),
        (frames["c"], CLIPS / "02.mp4", 10, True),
        (frames["a"], CLIPS / "03.mp4", 10, True),
        (frames["t"], CLIPS / "04.mp4", 10, True),
        (frames["join"], CLIPS / "05.mp4", 10, True),
        (frames["cat"], CLIPS / "06.mp4", 14, True),
    ]
    made = []
    for src, dest, sec, bounce in plan:
        clip_from_still(src, dest, sec, bounce)
        print("clip", dest.name, sec)
        made.append(dest)
    audio = CLIPS / "voice.m4a"
    mix_audio(audio)
    dest = OUT_DIR / "letter-buddies-ep01-cat.mp4"
    concat(made, audio, dest)
    print("wrote", dest, dest.stat().st_size)


if __name__ == "__main__":
    main()
