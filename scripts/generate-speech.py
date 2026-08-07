#!/usr/bin/env python3
"""Generate natural neural TTS clips for the alphabet app (Microsoft Edge voices)."""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("edge-tts not installed; run: pip install edge-tts", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
# Default female pack; set PHRASES_FILE + SPEECH_VOICE for male
PHRASES = Path(
    os.environ.get("SPEECH_PHRASES", str(ROOT / "scripts" / ".speech-phrases.json"))
)
VOICE = os.environ.get("SPEECH_VOICE", "en-US-AvaNeural")
# Slightly slower for young listeners
RATE = os.environ.get("SPEECH_RATE", "-8%")
# Pitch shift (e.g. +28Hz) — used to brighten Buddy for toddlers
PITCH = os.environ.get("SPEECH_PITCH", "+0Hz")
FORCE = os.environ.get("SPEECH_FORCE", "0") in ("1", "true", "yes")
CONCURRENCY = int(os.environ.get("SPEECH_CONCURRENCY", "6"))


async def synthesize(sem: asyncio.Semaphore, text: str, out: Path) -> None:
    if not FORCE and out.exists() and out.stat().st_size > 500:
        return
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(".tmp.mp3")
    async with sem:
        for attempt in range(3):
            try:
                kwargs = {"rate": RATE}
                if PITCH and PITCH not in ("+0Hz", "0Hz", "0"):
                    kwargs["pitch"] = PITCH
                communicate = edge_tts.Communicate(text, VOICE, **kwargs)
                await communicate.save(str(tmp))
                if tmp.stat().st_size < 200:
                    raise RuntimeError("empty audio")
                tmp.replace(out)
                return
            except Exception as e:
                if tmp.exists():
                    tmp.unlink(missing_ok=True)
                if attempt == 2:
                    raise
                await asyncio.sleep(0.8 * (attempt + 1))
                print(f"  retry {attempt + 1}: {e}", file=sys.stderr)


async def main() -> None:
    data = json.loads(PHRASES.read_text())
    print(f"Generating {len(data)} clips with {VOICE} (rate {RATE}, pitch {PITCH}, force={FORCE})…")
    print(f"  phrases file: {PHRASES}")
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = [synthesize(sem, item["text"], ROOT / item["out"]) for item in data]
    done = 0
    total = len(tasks)

    async def tracked(coro):
        nonlocal done
        await coro
        done += 1
        if done % 25 == 0 or done == total:
            print(f"  {done}/{total}")

    await asyncio.gather(*(tracked(t) for t in tasks))
    missing = [item for item in data if not (ROOT / item["out"]).exists()]
    if missing:
        print(f"FAILED: {len(missing)} missing", file=sys.stderr)
        sys.exit(1)
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
