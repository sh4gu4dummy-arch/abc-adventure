# QA — Meet A play-1 (ABC-Adventure-Bot1)

**Clip:** `public/videos/imagine/a-play-1.mp4`  
**Stills:** this folder (`00-source-still` … `05-end`)  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2  
**Plan:** `docs/meet-a-play-plan.md`  
**Procedure:** `docs/qa-howto.md`  
**Date:** 2026-09-18 · patched **v0.303** (supervisor debate closure)

Tried to fail. Opened all stills. Re-probed loudness. Did **not** rubber-stamp builder self-audit. Debate reply: `QA-REPLY.md`.

## Verdict

**FAIL (brief) / PASS (anatomy)** — this file is not play-1 evidence for ship.

## A. Tech

| Check | Value | Gate |
|---|---|---|
| Duration | 10.04 s | ~10s OK |
| Size | **480×720** | pass |
| fps | 24 | OK |
| Audio | AAC stereo | pass (track present) |
| mean_volume | **−55.2 dB** | **hard quiet** — standing mean &lt; −40 dB = do not ship |
| max_volume | **−30.8 dB** | OK (≤ −3) |

## B–C. Visual (try to fail)

| Check | Verdict | Evidence |
|---|---|---|
| Hero = shipped Meet A (oval eyes on legs, smile in fork, blank crossbar, nub feet) | **pass** | 00–05 |
| Twin / second A | **pass** | 00–05 |
| Extra human arms | **pass** | 00–05 |
| Apple has a face | **pass** | 01, 05 |
| Ant readable | **pass** | ant visible on path in 01–05 |
| Plane reverse | **pass** | plane lifts / sits forward-ish (04–05) |
| Humans / crowds | **pass** | yard only |
| End crop (composition) | **soft** | **05-end:** A cropped on the right but still in shot — not “hero left frame” |
| Active play at mid | **fail (brief)** | **03-mid:** props present without clear contact/chase/hop/push — group photo |
| Play with props | **fail (brief)** | apple barely plays; ant not clearly played-with |
| Travel vs treadmill | **soft** | mostly hop-in-place in the same yard patch |

## D. Vs plan

- Look lock: **honored** (intro video lock, not home tile).
- 480×720: **honored**.
- Active play at mid: **failed**.
- Audible foley: **failed** (hard quiet).

## F. Next plan gates (standing)

1. Mid still = **active play** (contact/chase/hop/push). Props without contact = FAIL brief. Stacked toys in yard OK.
2. Loudness: mean **−32…−20 dB**, max **≤ −3 dB**, mean **&lt; −40 dB** = hard do-not-ship.
3. Look lock language only — no “crossbar face.”
4. Soft column required (builder did this right).

**Do not shoot play-2 / little-a** until the teacher says go.
