# ABC Adventure — Project info

Kids alphabet learning app (ages ~3–6): 26 letters, cartoon posters, neural voice, games, offline portable package.

## Product surfaces

| Surface | Status | Notes |
|---|---|---|
| **1. Online web app** | Active | Mobile + desktop layouts with **Auto / Phone / Desktop** toggle |
| **2. Offline portable ZIP** | Active | Versioned `*-portable.zip` on Downloads page |
| **2b. Code only ZIP** | Active | Essential source, no heavy media (`*-code.zip`) |
| **2c. Code + assets ZIP** | Active | Full source + media (`*-codebase.zip`) |
| **3. Android APK** | Active | Capacitor offline app — `abc-adventure-vX.YYY.apk` on Downloads. Rebuild only on request: `npm run build:apk`. |

## Layout system

- Preference stored in `localStorage` (`abc-layout-pref-v1`): `auto` | `phone` | `desktop`
- Resolved layout applied as `html[data-layout="phone|desktop"]`
- Auto breakpoint: **768px**
- Toggle UI: `LayoutToggle` (home header + letter page)

## Graphics system (High / Lite / Auto)

- Preference: `localStorage` (`abc-gfx-pref-v1`): `auto` | `high` | `lite`
- Resolved mode: `html.gfx-high` / `html.gfx-lite` + `data-gfx`
- **High**: story MP4 on play (src attached only when playing), soft music, richer shadows/shine
- **Lite**: sharp poster “cinema” motion (no video decode), fewer particles, flat background, lower canvas DPR
- **Auto**: device hints (RAM, cores, Save-Data, reduced-motion/data, 3g) + short FPS watchdog that can demote high→lite for the session
- Expensive effects removed: `backdrop-filter`, multi-layer body gradients, CSS filters on posters
- Tab hidden → continuous animations pause (`gfx-paused`)

## Letter completion (stickers)

To **complete** a letter and earn a sticker:
1. See all **6 word posters**
2. **Sound** (hear the sound once)
3. **Trace** (mark “I traced it!”)
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

## Commands

```bash
npm run dev              # online preview :8080
npm run build:portable   # rebuild offline ZIP
```

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

- **Current version:** `0.005` (`v0.005`) — stored in `VERSION` and `src/lib/version.ts` (keep in sync).
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
