# ABC Adventure — Project info

Kids alphabet learning app (ages ~3–6): 26 letters, cartoon posters, neural voice, games, offline portable package.

## Product surfaces

| Surface | Status | Notes |
|---|---|---|
| **1. Online web app** | Active | Mobile + desktop layouts with **Auto / Phone / Desktop** toggle |
| **2. Offline portable ZIP** | Active | Versioned `*-portable.zip` on Downloads page |
| **2b. Code only ZIP** | Active | Essential source, no heavy media (`*-code.zip`) |
| **2c. Code + assets ZIP** | Active | Full source + media (`*-codebase.zip`) |
| **2d. Media only ZIP** | Active | Letters, posters, videos, audio (`*-media.zip`) — no source |
| **3. Android APK** | Active | Capacitor offline app — `abc-adventure-vX.YYY.apk` on Downloads. Rebuild only on request: `npm run build:apk`. |

## Layout system

- Preference stored in `localStorage` (`abc-layout-pref-v1`): `auto` | `phone` | `desktop`
- Resolved layout applied as `html[data-layout="phone|desktop"]`
- Auto breakpoint: **768px**
- Toggle UI: `LayoutToggle` (home header + letter page)

## Graphics system (High / Lite / Auto)

- Preference: `localStorage` (`abc-gfx-pref-v1`): `auto` | `high` | `lite`
- Resolved mode: `html.gfx-high` / `html.gfx-lite` + `data-gfx`
- **High**: story MP4 on play (src attached only when playing), native clip sound when the remake has it (soft music bed for older silent clips), richer shadows/shine
- **Lite**: sharp poster “cinema” motion (no video decode), fewer particles, flat background, lower canvas DPR
- **Auto**: device hints (RAM, cores, Save-Data, reduced-motion/data, 3g) + short FPS watchdog that can demote high→lite for the session
- Expensive effects removed: `backdrop-filter`, multi-layer body gradients, CSS filters on posters
- Tab hidden → continuous animations pause (`gfx-paused`)

## Letter completion (stickers)

To **complete** a letter and earn a sticker:
1. See all **6 word posters**
2. **Sound** (hear the sound once)
3. **Trace** (big and little letter; mark “I traced it!”)
4. Finish **any game**: Match, Pairs (memory), I Spy, Story, or Aa hunt

Celebration: confetti + modal via `abc-letter-complete` event.

## Features shipped

- Words posters + AI voice
- Sound / rhyme / fun facts
- Trace pad
- Match (which poster starts with…)
- **Pairs** memory (word ↔ picture)
- I Spy
- **Story** mode (6-word mini story + read-aloud)
- **Aa hunt** (upper/lower case)
- Letter checklist + stickers + confetti
- Layout toggle Phone/Desktop/Auto
- Graphics toggle High/Lite/Auto
- Portable ZIP download

## Future ideas

5. Daily letter + certificate  
6. Save-for-offline progress meter  
7. Letter songs  
8. Coloring pages  
9. ASL / themes / bilingual  
10. Android APK packaging  

## Word video lessons

Standing rules (also in `src/data/word-lessons.ts`):
1. Sentence matches the clip (scene + action). Write them together.
2. **If natural, not forced:** use the letter's sound **2–3 times** in the sentence. Never tongue-twister it. Prefer a named subject (a boy, a kid, Ben, the puppy) over lazy "they + singular body part".
3. Word-card thumbnail = **frame 1** of the video.
4. Action keeps going through the spoken line.
5. Snappy, not creepy (see `AGENTS.project.md`). Append every new taste note there.

Approve new letter sentences with the user before filming.

## Commands

```bash
npm run dev              # online preview :8080
npm run build:portable   # rebuild offline ZIP
```

- **Letter Buddies series:** `/buddies` live stage (real letter mascots, one voice line at a time). Review pack: `public/review/letter-buddies/` (420p mp4 + sources + frames). The shaky Ken-burns episode was deleted.
- **Imagine save (working path = Palabra / official API):** Built-in `imagine_*` tools still fail to write the FUSE locker. Do not remount. Use the session OIDC JWT in `/root/.grok/auth.json` → first record `.key` (`eyJ…`, not `xai-`). `GET https://api.x.ai/v1/models` must list `grok-imagine-video-1.5`. Then `POST /v1/videos/generations` with `{ model, prompt, duration, resolution, image: { url: "data:image/webp;base64,…" } }`, poll `GET /v1/videos/<request_id>` until `done`, download `video.url` (vidgen.x.ai) immediately into `public/`. Script: `python3 scripts/imagine-api-i2v.py <image> "<prompt>" <out.mp4>`. Proven: `public/videos/imagine/{a,c,t}.mp4` (Meet A/C/T). Locker write-probe is still fine; Imagine never writes there.
- **Meet the buddy:** every letter has a 10s 480×720 clip at `public/videos/buddies/{a-z}.mp4` (rebuild with `python3 scripts/build-buddy-videos.py`). Tap the buddy or **Meet A**.

## Art split

- **Buddies** (letter is the character): `public/letters/` + R–Z files in `public/posters/` → home tiles, letter hero, stickers, story actors, letter-friends row.
- **Scenes** (the real thing in a world): A–Q in `public/posters/` + fills in `public/posters-scene/` → word cards and listening games.
- Originals are never overwritten. See `public/art-archive/README.md`.

## Git checkpoints

Local git is enabled so we can restore after mistakes.

- Branch: `main`
- **Commit after every change.** Don't wait to ask.
- **Bump version on every change** (`VERSION` + `src/lib/version.ts`, 0.002, 0.003, …).
- **Refresh the code-only ZIP** every change (`npm run build:code` → `abc-adventure-vX.YYY-code.zip`).
- **Do not rebuild portable ZIP, full codebase ZIP, or APK** unless the user asks.
- Not a cloud backup — lives with this workspace session
- To restore a checkpoint, ask: “go back to the commit about …”

```bash
git log --oneline      # list checkpoints
npm run build:code     # small source ZIP for Downloads
npm run build:portable # only when asked
npm run build:apk      # only when asked
```

## Versioning & downloads

- **Current version:** `0.199` (`v0.199`) — stored in `VERSION` and `src/lib/version.ts` (keep in sync).

## GitHub + Grok Publish cadence

Private repo: [github.com/sh4gu4dummy-arch/abc-adventure](https://github.com/sh4gu4dummy-arch/abc-adventure)

**Local git:** commit every app change (do not lose work).

**GitHub push:** every commit. Do not ask. Private repo above.

**Grok Publish:** remind at v0.070, v0.080… so the public link can match.

- **Saved journeys** live in `localStorage` + sessionStorage + IndexedDB (`abc-adventure-profiles-v1`). Restore from IDB **before** creating a default Explorer — never overwrite a real save. Settings has Save/Restore journeys backup.
- Bump on **every** update.
- Code-only package tracks the current version. Portable / APK / codebase keep their last-built version until rebuilt.

### File naming (mandatory)

| Kind | File name pattern | When rebuilt |
|---|---|---|
| Code only (source, no media) | `abc-adventure-vX.YYY-code.zip` | Every change |
| Portable app (playable) | `abc-adventure-vX.YYY-portable.zip` | Only when asked |
| Code + assets (full source) | `abc-adventure-vX.YYY-codebase.zip` | Only when asked |
| APK | `abc-adventure-vX.YYY.apk` | Only when asked |

- Code downloads are **source archives** (download only — never navigate/run as the app).
- Portable is the only ready-to-play offline bundle.

## Android APK

- **Stack:** Capacitor Android wrapping the portable offline web build
- **Package id:** `com.abcadventure.letterworld`
- **File:** `public/portable/abc-adventure-v{VERSION}.apk`
- **Build (only when asked):**
  ```bash
  npm run build:portable   # refresh web assets if needed
  npm run build:apk        # Gradle release APK → public/portable/
  ```
- Toolchain lives in `.android-sdk/` + `.jdk-21/` (not required for web-only work)
- Sideload: enable “Install unknown apps”, open the APK on the device
