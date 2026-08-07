# ABC Adventure — Project info

Kids alphabet learning app (ages ~3–6): 26 letters, cartoon posters, neural voice, games, offline portable package.

## Product surfaces

| Surface | Status | Notes |
|---|---|---|
| **1. Online web app** | Active | Mobile + desktop layouts with **Auto / Phone / Desktop** toggle |
| **2. Offline portable ZIP** | Active | Download from home: playable HTML app (posters+videos+voice) |
| **2b. Full source ZIP** | Active | Download codebase (no node_modules) for backup/edit |
| **3. Android APK** | **Backburner** | Planned — Capacitor wrapper of the portable package for true offline Android installs without revisiting the site. Do **not** rebuild APK on every content tweak until packaging is automated. |

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

## Git checkpoints

Local git is enabled so we can restore after big mistakes.

- Branch: `main`
- After major features/fixes, we commit a checkpoint
- Not a cloud backup — lives with this workspace session
- To restore a checkpoint, ask: “go back to the commit about …”

```bash
git log --oneline      # list checkpoints
# restore is done by the builder when you ask
```

## Offline packages

```bash
npm run build:portable   # rebuild both ZIPs under public/portable/
```

| Package | Path | Use |
|---|---|---|
| Portable app | `ABC-Adventure-Portable.zip` | Unzip → open `index.html` (or Open helper) |
| Full source | `ABC-Adventure-Source.zip` | Unzip → `npm install` → `npm run dev` |

Both are linked from the home screen **Take it offline** section.

