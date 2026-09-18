# QA — Meet A play-1 (ABC-Adventure-Bot1)

**Clip:** `public/videos/imagine/a-play-1.mp4`  
**Stills:** this folder (`00-source-still` … `05-end`)  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2  
**Plan:** `docs/meet-a-play-plan.md`  
**Procedure:** `docs/qa-howto.md`  
**Date:** 2026-09-18 · repo **v0.301**

Tried to fail. Opened all stills. Re-probed loudness. Did **not** rubber-stamp builder self-audit.

## A. Tech

| Check | Value | Gate |
|---|---|---|
| Duration | 10.04 s | ~10s OK |
| Size | **480×720** | pass |
| fps | 24 | OK |
| Audio | AAC stereo | pass (track present) |
| mean_volume | **−55.2 dB** | **soft** — board-quiet for a play clip; kid may hear almost nothing |
| max_volume | **−30.8 dB** | OK (not hot) |

## B–C. Visual (try to fail)

| Check | Verdict | Evidence |
|---|---|---|
| Hero = shipped Meet A (red clay, crossbar face, nub feet) | **pass** | 00–05 |
| Twin / second A | **pass** | 00–05 |
| Extra human arms | **pass** | 00–05 |
| Apple has a face | **pass** | 01, 05 |
| Ant readable | **pass** | ant visible on path in 01–05 |
| Plane reverse | **pass** | plane lifts / sits forward-ish (04–05) |
| Humans / crowds | **pass** | yard only |
| Hero left frame | **soft** | **05-end:** A heavily cropped on the right (mostly one eye + one foot) |
| Beat timing (thirds) | **soft** | Plan wants apple→ant→plane by thirds. **01–04:** all three props on screen together; no clear handoff. **03-mid** is not an “ant beat.” |
| Play with props | **soft** | Agree with builder: apple barely plays; ant not clearly played-with; more “group photo” than chase/hop/run-alongside |
| Travel vs treadmill | **soft** | Some pose shift by 05, but mostly hop-in-place in the same yard patch |
| Quiet mix | **soft** | mean −55.2 dB |

## D. Vs plan

- Look lock: **honored** (not a tiny-dot redesign).
- 480×720: **honored**.
- Sequential playground beats: **not honored** (props stacked).
- Audible foley: **weak**.

## E. Verdict

**PASS (trial) with softs — do not treat as a clean ship.**

No hard twin / apple-face / wrong-size fail. Soft column is real: quiet audio, stacked props, weak play beats, end crop.

**Do not shoot play-2 / little-a** until the teacher says go after this review.

## F. Executor mistakes → next plan / remake gates

Add to `docs/meet-a-play-plan.md` if remaking play-1 or shooting play-2:

1. **One hero prop large in mid still** for the active beat; other props off-screen or tiny background — not a three-prop group photo.
2. **Proof loudness** before READY: mean should sit in a hearable band (target roughly **−22…−18 dB** unless teacher sets another number). mean &lt; **−40 dB** = soft fail minimum; do not ship “silent play.”
3. **End still:** full letter in frame (both feet / full glyph), not a half crop.
4. Keep builder’s honesty rule: soft column required (they did this right).

## Vs builder self-audit

| Builder claim | QA |
|---|---|
| Soft: apple/ant play, treadmill, quiet | **Agree** |
| Hard-fail proposals | **Agree** (extra A/arms/apple face/plane reverse/wrong size/no audio) |
| Shipped as trial, not “all pass” | **Agree — good process** |
