# QA — Big E Friends film (ABC-Adventure-Bot1)

**Clip:** `public/friends-clips/e-play-1.mp4`  
**Still (prior PASS soft):** `docs/audit/e-play-1/00-source-still.jpg` · `STILL-QA.md`  
**Stills:** this folder · `01-start` … `05-end` · speak / end-frame crops  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/7  
**Date:** 2026-09-18 · **v0.350**

## Tech

| Probe | Result |
|---|---|
| Duration | **24.19 s** · 480×720 |
| Loudness | mean **−21.3 dB** / max **−3.3 dB** → **PASS** (gate mean −32…−18; max ≤ −3) |

## Listen (whisper base + prompt)

> I'm Big E. / I'm Elephant. / I'm Earth. / I'm Eagle.

Word stamps: E ~1.0–1.9s · Elephant ~5.9–8.2s · Earth ~12.0–13.8s · Eagle ~18.1–19.8s.  
Alphabet first-3: Elephant / Earth / Eagle → listen **PASS**.

## Attribution + cast

| ~t | Line | Mouths | Gate |
|---|---|---|---|
| ~1.5s | Big E | letter **open** ✓; **Earth + Eagle also open** | **soft FAIL** multi-mouth |
| ~7.0s | Elephant | Elephant open; letter soft-closed | PASS |
| ~13.5s | Earth | Earth open; others closed | PASS |
| ~19.0s | Eagle | Eagle beak open; Earth closed; **letter off-frame** | friend PASS / cast soft |
| 03-mid | — | Elephant + E + Eagle; **Earth gone** | **FAIL cast** |
| 05-end | — | Elephant + Earth + Eagle; **letter E gone** | **FAIL cast** |

| Gate | Result |
|---|---|
| Loudness | **PASS** |
| Listen | **PASS** |
| Attribution | **soft FAIL** (multi-mouth on letter intro) |
| Cast @ mid/end | **FAIL** — E gone end (`04-75`/`05-end`/`t23–t24`); Earth gone mid (`03-mid`) |

## Frames

`01-start.jpg` · `02-25.jpg` · `03-mid.jpg` · `04-75.jpg` · `05-end.jpg`  
Speak: `speak-1_5.jpg` · `speak-7_0.jpg` · `speak-13_5.jpg` · `speak-19_0.jpg`  
Cast end: `t23.0.jpg` · `t23.8.jpg`

## Verdict

**HOLD / FAIL cast** — do **not** ship as PASS.

Still remains **PASS soft**. Remake film later (keep still; fix cast lock through end + clean letter-only mouth on intro). No I2V until teacher **go**.
