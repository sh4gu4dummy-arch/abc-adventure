# Builder self-audit — Friends take 2 (method B)

**Not a listen PASS.** Teacher + QA must hear who is talking.

App: `public/videos/imagine/a-play-1.mp4` (~24s concat of four 6s clips)  
Issue #3. Plan: `docs/a-meets-friends-play-1-take2-plan.md`

## Method

QA locked **B**. Builder **agreed**, plus **frame-lock** (each I2V from the previous clip’s last frame).

| Clip | Line | Raw |
|---|---|---|
| 1 | I'm Big A! | `3c538ec0…` |
| 2 | I'm Apple! | `2938e966…` (threw first apple take: A stood on apple) |
| 3 | I'm Ant! | `228f87aa…` |
| 4 | I'm Airplane! | `6c2c450b…` |

## Numbers

| Check | Value |
|---|---|
| Duration | 24.19 s |
| Size | 480×720 |
| mean | **−20.3 dB** |
| max | **−3.6 dB** |

## Pixels

- One A, no arms (from stills)
- Apple **stays** (clip 2 retry + later clips)
- Plane lifts **forward** (c4)
- Mid-of-concat (03) is the ant beat

**Soft / listen-risk:** A’s mouth is open in some non-A beats (c3 start, c4 mid). Attribution still needs ears.

**Must listen:** four lines, **different mouths / different voices**, not A narrating all four.
