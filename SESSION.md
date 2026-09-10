# Session compact — ABC Adventure

**Version:** v0.108  
**GitHub:** sh4gu4dummy-arch/abc-adventure `main`  
**User tests in Grok live preview**, not APK, unless they ask.

## App
Kids alphabet. Word lessons: `public/videos/{letter}-{slug}.mp4` (10s, 540×720, h264).
Word overlay captions sit **under** the video (v0.101), not on top of the picture.
**New remakes:** keep I2V foley. Player unmutes clip (~0.55) under overlay TTS (word ×3 + sentence). Overlap OK. Set `nativeAudio: true` so the generic music bed stays off. Do not batch-remake.

## Sound mix (v0.098)
I2V **has** AAC audio. Old encode used ffmpeg `-an` (stripped it). New encode keeps AAC (falls back to silent if the source has none). Overlay teacher/buddy voice still plays on top. No talking mouths in the picture. Do not bake narration into the MP4.

## 3-word intro
Was missing on autoplay, present on Replay (tap). Fixed: shared `HTMLAudioElement`, `primeAudioFromGesture(word)` on poster tap / prev / next, speak starts on that tap. User was on **preview**, not APK.

## Tracing (v0.104)
Color-in the letter, not a handwriting test. Crayon clips to the glyph. ~26% of the letter is enough — then the letter **snap-fills**, bar goes to 100%, “You traced A!”. No “keep filling”, no A-bar / connector grader. That’s why old traces felt broken at 80%.

## Recent remakes
| Clip | Issue | Fix |
|---|---|---|
| L leaf | I2V morphed into a baby | Object-only leaf twirl |
| L lollipop | Candy bigger than the kid | Fist-sized swirl |
| M monkey | Two tails | One tail, rump → branch |
| M mountain | “Mia hikes the mountain” | **Mia hikes up the mountain.** (same clip) |
| N noodle | Label singular | **Noodles** (slug still `noodle`) |
| H horse | Treadmill gallop (legs pump, body stays) | Horse travels up the hill; no loop; nativeAudio |
| H heart | Crayon with two points | One-tip crayon; look-at-the-clip QA (not a tip-count law) |

A–Z word videos exist. J–Z remade to locked sentences; A–I older unless later patched (G, H, fish, frog, etc.).

## Archive videos (v0.108)
Old take `.mp4`s removed from `public/art-archive` so Publish doesn’t pack them.
**Restore from GitHub:** commit `685dc79` (v0.107) still has all 174 clips.
Stills stay for Settings → Art archive. `public/review` not touched.

## Meet A / B (v0.107)
6s dance. **One voice** — theirs, in the clip. Teacher overlay off. Don’t stack extra TTS. Face on the front only. C–Z still bounce puppets until named. Don’t batch 26.
`scripts/ship-letter-videos.py` PACKS → t2i → i2v (mouths closed + foley, no speech) → encode **keep audio** → `nativeAudio: true` → **5-frame QA** (`scripts/qa-word-frames.py`) → poster=frame1 → TTS append-only `speech-map.ts`.  
Stop on Imagine fail; don’t kneejerk. Look at the clip. If it’s obviously wrong, redo — don’t write a crayon-tip law.

## Taste rules (full list: AGENTS.project.md)
Sentence = screen. Thumbnail = frame 1. Snappy not creepy. Real anatomy, one of each limb. Food no face. No gag reuse. Object stays object (never morph into a person). Props kid-scale. **No talking mouths** unless eating/yawn/blow. **State-change is one-way** (peel/unwrap/zip/light). Remakes keep native clip sound under overlay voice. Archive then overwrite. Push every commit. Version bump every change. Portable/APK only when asked.

## Don’t
- Don’t remake all clips unless user names them
- Don’t rebuild APK unless asked
- Don’t overwrite `speech-map.ts` wholesale — append
- Don’t use GH token in remote URL after push
- Don’t strip I2V audio on new remakes

## Open
User may name clips to remake (those get native sound). Chat delivery was dropping (“No response”) — keep replies short.
