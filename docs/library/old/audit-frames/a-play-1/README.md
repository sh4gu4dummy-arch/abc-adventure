# Self-audit — Meet A play-1 (v0.298)

Clip: `public/videos/imagine/a-play-1.mp4`  
Source still: `00-source-still.jpg`  
Frames: `01-start` … `05-end.jpg`  
QA issue: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2

Do not shoot play-2 / little a until QA comments and the teacher says go.

## Numbers (v0.303 gain pass)

| Check | Before | After |
|---|---|---|
| Picture | same | same |
| mean_volume | −55.2 dB | **−17.8 dB** |
| max_volume | −30.8 dB | **−1.0 dB** |

Teacher could not hear it. Audio-only loudnorm. Do not treat this as a picture remake.

| Check | Value |
|---|---|
| Duration | 10.04 s |
| Size | 480×720 |
| File | 1.86 MB |
| Audio | AAC stereo 48 kHz, 127 kb/s |
| mean_volume | **−55.2 dB** (quiet) |
| max_volume | **−30.8 dB** |

## Try to fail

| Check | Verdict | Still |
|---|---|---|
| Extra body / human arms | **PASS** (killed take 1 for this) | 01–05 |
| Cloned second A | **PASS** (killed take 3 for this) | 01–05 |
| Apple has a face | **PASS** | 01, 05 |
| Face on crossbar vs intro (eyes on legs) | **PASS** vs intro; source still matches | 00, 01 |
| Hero left the frame | PASS | 01–05 |
| Plane flies backward | PASS (goes up-right) | 04, 05 |
| Ant readable | PASS | 01–05 |
| Extra humans in bg | PASS (flowers only) | 01 |
| Beat 1 apple rolls / chase | **SOFT MISS** — apple barely moves | 01 vs 05 |
| Beat 2 hop beside ant | **SOFT MISS** — ant stays, A does not clearly play with it | 03 |
| Beat 3 plane takeoff | PASS-ish — plane lifts forward | 04, 05 |
| Travel, not treadmill | **SOFT MISS** — A hops; end pose near start | 01 vs 05 |
| Loud enough for a kid | **SOFT MISS** — mean −55 dB | (numbers) |

## Hard fail vs soft miss (proposal for QA)

- **Hard fail:** extra A, extra arms, apple face, plane reverse, wrong letter, hero gone,  not 480×720, no audio track.
- **Soft miss:** quiet mix, hop-in-place, weak apple/ant play, all three props on screen the whole time.
- **Allowed props:** one apple, one ant, one toy plane, yard flowers without faces.

I shipped take 2 as a **trial**, with these soft misses listed. Not “all pass.”

## What to do next

1. QA dumps the same clip, looks at **these** stills, comments PASS/FAIL on issue #2.
2. If FAIL: wait for the teacher before a remake.
3. If PASS with warns: wait for the teacher before play-2.
4. Do not delete `a-play-1.mp4` without a yes.
