# Session compact — ABC Adventure

**Version:** v0.097 (`5315b60`)  
**GitHub:** sh4gu4dummy-arch/abc-adventure `main` (pushed)  
**User tests in Grok live preview**, not APK, unless they ask.

## App
Kids alphabet. Word lessons: `public/videos/{letter}-{slug}.mp4` (10s, 540×720, h264, **no audio track**). Player mutes video. Hear: sfx + looping music + TTS (Teacher Ava / Buddy Andrew). Autoplay on open; 3-word intro then sentence.

## Sound verdict (user asked; do not “fix” unless they say)
Imagine I2V **has** AAC audio. Encode uses ffmpeg `-an` so shipped clips are silent. Player `video.muted = true`. Mouth-flap ≠ hidden voice — model talking-head, we dump its soundtrack.

## 3-word intro
Was missing on autoplay, present on Replay (tap). Fixed: shared `HTMLAudioElement`, `primeAudioFromGesture(word)` on poster tap / prev / next, speak starts on that tap. User was on **preview**, not APK.

## Recent remakes
| Clip | Issue | Fix |
|---|---|---|
| L leaf | I2V morphed into a baby | Object-only leaf twirl |
| L lollipop | Candy bigger than the kid | Fist-sized swirl |
| M monkey | Two tails | One tail, rump → branch |
| M mountain | “Mia hikes the mountain” | **Mia hikes up the mountain.** (same clip) |
| N noodle | Label singular | **Noodles** (slug still `noodle`) |
| O orange | Peel ping-ponged back on | One-way peel, stays off |

A–Z word videos exist. J–Z remade to locked sentences; A–I older unless later patched (G, H, fish, frog, etc.).

## Pipeline
`scripts/ship-letter-videos.py` PACKS → t2i → i2v → encode `-an` → poster=frame1 → TTS append-only `speech-map.ts`.  
STYLE includes closed-mouth. `SILENT` auto-appended to i2v. Stop on Imagine fail; don’t kneejerk.

## Taste rules (full list: AGENTS.project.md)
Sentence = screen. Thumbnail = frame 1. Snappy not creepy. Real anatomy, one of each limb. Food no face. No gag reuse. Object stays object (never morph into a person). Props kid-scale. **No talking mouths** unless eating/yawn/blow. **State-change is one-way** (peel/unwrap/zip/light). Archive then overwrite. Push every commit. Version bump every change. Portable/APK only when asked.

## Don’t
- Don’t remake all lip-flap clips unless user names them
- Don’t rebuild APK unless asked
- Don’t overwrite `speech-map.ts` wholesale — append
- Don’t use GH token in remote URL after push

## Open
User may name more clips to remake. Chat delivery was dropping (“No response”) — keep replies short.
