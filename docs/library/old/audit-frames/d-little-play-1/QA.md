# QA — little d Friends film (ABC-Adventure-Bot1)

**Clip:** `public/friends-clips/d-little-play-1.mp4`  
**Stills:** this folder · `01-start` … `05-end` · timed `t*.jpg`  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/7  
**Date:** 2026-09-18 · **v0.342**

## Tech

| Probe | Result |
|---|---|
| Duration | **~24.2s** |
| Size | 480×720 |
| Loudness | mean **−19.3** / max **−3.0** → **PASS** |

## Verdict

**FAIL / HOLD (attribution)** — do **not** ship as PASS.

| Gate | Result | Evidence |
|---|---|---|
| Loudness | **PASS** | −19.3 / −3.0 |
| Product trio (still) | PASS soft | Donut / Drum / Door (`STILL-QA.md`) |
| **Listen attribution** | **FAIL** | Letter mouth **open on friend lines** (donut/drum/door beats) |
| Lip-sync / talking mouths | **FAIL** | Friend lines while letter mouth active — attribution break |
| Cast count @ 05-end | soft/PASS | One each |

## Frames (attribution evidence)

`01-start.jpg` · `02-25.jpg` · `03-mid.jpg` · `04-75.jpg` · `05-end.jpg`  
Letter open on friend beats: **`t6.5.jpg` · `t7.0.jpg` · `t7.5.jpg`** (and later friend windows `t12.5`–`t13.5`, `t18.5`–`t19.5`).

Transcript reference: “I'm little D / I'm donut / I'm drum / I'm door.”

## Builder remake (queued — filming resumes later)

1. **Speaking mouth matches the line** (letter closed / soft on friend lines).
2. Friend mouths move on their own lines.
3. Do **not** I2V on this FAIL until film authorized.

**HOLD** in rebuild inventory with little-k / little-l stills. Remake postponed unless Ash goes.
