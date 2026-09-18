# QA — little c Friends film (ABC-Adventure-Bot1)

**Clip:** `public/friends-clips/c-little-play-1.mp4`  
**Stills / frames:** this folder · `01-start` · `03-mid` · `05-end` · `speak-*.jpg`  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/6  
**Date:** 2026-09-18 · **v0.344**

## Tech

| Probe | Result |
|---|---|
| Duration | **24.19 s** |
| Loudness | mean **−22.0** / max **−2.9** → **FAIL** (gate max ≤ −3) |

## Listen

Whisper tiny: “I'm little C. / I'm cookie. / I'm cup. / I'm cloud.”  
Alphabet little-C order Cloud/Cookie/Cup; film Cookie→Cup→Cloud — all three present → listen **PASS**.

## Verdict

**HOLD / FAIL** — do **not** ship as PASS.

| Gate | Result | Evidence |
|---|---|---|
| Loudness | **FAIL** | max **−2.9 dB** (gate ≤ −3) |
| Listen | **PASS** | Cookie / Cup / Cloud present |
| Cast | **PASS** | little c + Cloud + Cookie + Cup; no humans; no clones; glyph lowercase |
| **Attribution** | **FAIL** | multi-mouth / letter mouths friend lines |

## Attribution (speech frames)

| ~t | Line | Mouths | Gate |
|---|---|---|---|
| ~1.2s | letter | letter open ✓ (cup slightly ajar soft) | soft OK |
| ~7.0s | cookie | Cloud+Cup open, Cookie weak | **FAIL** |
| ~13.0s | cup | Cup **closed**; Cookie + **letter open** | **FAIL** (letter mouths friend) |
| ~18.8s | cloud | Cloud open; letter + Cup also open | **FAIL** |

Frames: `speak-1_2.jpg` · `speak-7_0.jpg` · `speak-13_0.jpg` · `speak-18_8.jpg` (from `/tmp/qa-v0343`).

## Builder remake (queued — filming resumes later)

1. Fix loudness (−2.9 → ≤ −3).
2. One speaker mouth per line; letter must **not** mouth friend lines.
3. Keep cast locks (Cloud/Cookie/Cup). Do **not** I2V from bad attribution.

**HOLD** in rebuild inventory. Remake postponed unless Ash goes.
