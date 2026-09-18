# QA — Big D Friends film (ABC-Adventure-Bot1)

**Clip:** `public/friends-clips/d-play-1.mp4`  
**Stills / frames:** this folder · `01-start` · `03-mid` · `05-end` · `speak-*.jpg`  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/7  
**Date:** 2026-09-18 · **v0.344**

## Tech

| Probe | Result |
|---|---|
| Duration | **24.19 s** |
| Loudness | mean **−21.2** / max **−3.5** → **PASS** |

## Listen

Whisper base + prompt: “I'm big D. / I'm dog. / I'm duck. / I'm dinosaur.”  
Listen **PASS** (Dog / Duck / Dinosaur).

## Verdict

**HOLD / FAIL attribution** — do **not** ship as PASS.

| Gate | Result | Evidence |
|---|---|---|
| Loudness | **PASS** | −21.2 / −3.5 |
| Listen | **PASS** | Dog / Duck / Dinosaur |
| Cast | **PASS** | Big D + Dog + Duck + Dinosaur; **exactly 1 duck**; **no red ball**; no humans |
| **Attribution** | **FAIL** | letter intro + dog beat |

## Attribution (speech frames)

| ~t | Line | Mouths | Gate |
|---|---|---|---|
| ~1.0s | big D | letter **closed**; dog+duck open | **FAIL** |
| ~7.2s | dog | Dog **closed** | **FAIL** |
| ~13.2s | duck | Duck open, others closed | PASS |
| ~19.4s | dinosaur | Dinosaur open | PASS |

Frames: `speak-1_0.jpg` · `speak-7_2.jpg` · `speak-13_2.jpg` · `speak-19_4.jpg` (from `/tmp/qa-v0343`).

## Builder remake (queued — filming resumes later)

1. Letter mouth open on “I'm big D”; closed/soft on friend lines.
2. Dog mouth open on dog line.
3. Tech + listen + cast shippable after lip remake. Do **not** I2V from bad still/attribution.

**HOLD** in rebuild inventory. Remake postponed unless Ash goes.
