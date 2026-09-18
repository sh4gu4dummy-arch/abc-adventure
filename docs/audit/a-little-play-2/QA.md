# QA — little a meets friends take 2 (ABC-Adventure-Bot1)

**Clip:** `public/friends-clips/a-little-play-2.mp4`  
**Stills:** this folder · builder `README.md`  
**Issue:** https://github.com/sh4gu4dummy-arch/abc-adventure/issues/4  
**Plan:** `docs/a-meets-friends-little-a-take2-plan.md`  
**Date:** 2026-09-18 · **v0.326**

Take 1 FAIL inventory kept: `friends-clips/a-little-play-1.mp4`.

## Ash (do not paraphrase away)

> anchor fails listen (probably because no face).
> I want to move on but note down 2 things: color keeps drifting both big A and small A the A gets darker throughout the video
> also, we need to catch if inanimate objects we give them a face or think of a plan. astronaut said "I'm anchor" probably because anchor no face (why is this obvious issue not QA's beforehand?)
> anyway, proceed with plans for little/Big B

**Do not remake A this round.**

## Verdict

**FAIL (listen / talking-mouth).** Keep as inventory. No A remake.

| Gate | Result | Evidence |
|---|---|---|
| Product trio | **pass** | alligator / astronaut / anchor; no apple/ant/plane |
| Meet single-story a | **pass** (soft rounder by late clips) | vs `meet-a-little-01.jpg` |
| Loudness | **pass** | mean **−20.3 dB** / max **−3.3 dB** |
| Cast / 05-end / anchor stays | **pass** (pixels) | counts 1; hero in end |
| **Talking mouth** | **FAIL** | `00-source-still.jpg`: **anchor has no mouth**; listen: astronaut said `I'm Anchor!` |
| Astronaut = toy | **soft→hard** | clear helmet shows kid face (live-kid risk vs toy suit) |
| Color lock | **soft** | Ash: letter darkens through concat — standing gate for B+ |

## Process miss

Blank inanimate + spoken line should have **failed the source still before I2V**. Talking-mouth is now standing law (START / qa-howto / self-audit). This take is the proof case.

## Next

B Friends plans: `docs/b-meets-friends-plan.md` · issue #5. No A remake.
