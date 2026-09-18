# QA — A Meets Friends play-1 remake take 1 (ABC-Adventure-Bot1)

**Clip:** `public/videos/imagine/a-play-1.mp4` (remake take 1; replaced quiet trial in tree)  
**Stills:** this folder (`00-source-still` … `05-end`) + builder `README.md`  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/3  
**Plans:** `docs/a-meets-friends-play-1-remake.md` · take 2: `docs/a-meets-friends-play-1-take2-plan.md`  
**Procedure:** `docs/qa-howto.md`  
**Date:** 2026-09-18 · **v0.311** (supervisor-locked)

Tried to fail. Opened stills. Re-probed loudness. Expert listen. Did **not** rubber-stamp builder self-audit. Teacher Ash already **FAIL** — not reopened.

## Verdict

**FAIL (brief)** — speaker attribution + apple vanish (+ mid contact). Loudness **PASS**. Do **not** ship as Friends PASS. Inventory only until a listen-sane take.

## A. Tech

| Check | Value | Gate |
|---|---|---|
| Duration | 15.04 s | ~15s OK |
| Size | **480×720** | pass |
| Audio | AAC stereo | pass |
| mean_volume | **−19.3 dB** | **PASS** (standing −32…−18) |
| max_volume | **−3.5 dB** | **PASS** (≤ −3) |
| Speech-band vs bass | speech ~−20.1 / bass ~−34.3 | not an obvious music-bury by numbers |
| Energy shape | four bursts ~0.9–2 / 3–4 / 5–6 / 7.8–8.9s then ~6s near-dead | **soft brief** — wasted ending |

## B. Listen (brief)

| Check | Gate | Evidence |
|---|---|---|
| Exact four lines, order | words present | ~0:01 `I'm Big A!` · ~0:03 `I'm Apple!` · ~0:04 `I'm Ant!` · ~0:07 `I'm Airplane!` |
| Overlap / bury / missing words | pass (words) | clear, one-at-a-time on track |
| **Speaker attribution** | **FAIL brief** | same child voice for all four; Big A mouths `I'm Big A!` **and** `I'm Apple!`; apple / ant / plane do **not** mouth their lines |
| Machine ASR | **not a PASS** | Whisper-tiny heard the four lines — ASR ≠ kid-ear PASS |

**Listen = brief.** Clear words with wrong mouth / one narrator voice = FAIL.

## C. Visual (try to fail)

| Check | Verdict | Evidence |
|---|---|---|
| One A / no arms / nub feet | **pass** | 01–05 |
| Plane flies **forward** | **pass** | 04–05; takeoff ~0:09 |
| Ant flying / extra A / humans | **pass** | not seen |
| Mid contact — A foot **on** apple | **FAIL** true-nature / contact | ~02-25 / ~t3.4 — nub-foot **bump** only; no standing on apple |
| Apple **vanishes** ~0:06 | **FAIL** true-nature | prop must stay for its beat and after |
| Apple face drift | **soft → hard** if face eats the fruit | tiny toy smile OK; eyes + big mouth growing = soft; person-face = hard |
| Mid still group photo | **soft** | 03-mid hop + props |
| Look (crossbar face vs legs) | **soft** | note only — do not fight Ash art-OK into redesign |
| Dead air after lines | **soft brief** | ~6s silence after ~9s |

**Would not fail from stills alone:** extra A, arms, plane reverse, ant flying — not seen.

## D. Vs remake plan

- Talking intros / listen attribution: **failed**
- Loudness: **passed**
- True-nature apple (stay + roll, no vanish, no stand-on): **failed**
- Plane forward: **passed**
- No arms: **passed**

## F. Next plan gates (standing)

1. **Listen = attribution.** Same voice + wrong mouth = FAIL. ASR alone never PASSes.
2. **Method: Option B primary** (four short one-line clips, concat). C optional. A (one 15s) = fallback only if Ash overrides.
3. A contact = **nub foot / body bump only** — no standing on the apple.
4. Apple **must not vanish**; tiny toy smile OK; fail human body / face eating the fruit.
5. Spread lines / play across full duration — no four-lines-then-~6s dead air.
6. Do **not** overwrite app `a-play-1.mp4` until teacher + QA listen PASS.
7. Soften mouth wording: only the speaker’s mouth moves; others keep a closed smile, no lip flap (not frozen statues).

**Do not generate** until teacher **go**. No play-2.
