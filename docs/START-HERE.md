# START HERE — ABC Adventure

Kids alphabet app (ages ~3–6). **Read this first** if you are the builder
or the **QA agent**. Then `AGENTS.project.md` for the full taste list.

**Keep this file current on every push.** When the user corrects a clip,
thumb, or workflow, add the lesson here (short) *and* in
`AGENTS.project.md` **and** `docs/self-audit.md` / `docs/qa-howto.md`.
Both bots **recursively improve** the SOPs — a miss that only lives in
chat will happen again.

## Who does what

| Role | Job |
|---|---|
| **Builder** | Hands-on product adult. Knows Big vs little, Meet vs Friends, which 3 words belong to which case. Does not ship junk for Ash to notice. Does not wait for QA to know the product. |
| **QA agent** | Looks at the actual frames (not the prompt). Pass / fail with *why*. Does not generate replacements unless asked. Does not pick a winner when there are 2+ options — show the user. They are **not** a second product owner. |
| **User** | Final taste. **lmk** = talk only. **start** = fetch QA, shoot if you agree, debate if you don’t. |

**Talk on GitHub, not only chat.** Standing desk: [issue #1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1).
Coop rules: `docs/agent-coop.md`. **Full QA playbook:** `docs/qa-howto.md`.
Builder self-audit: `docs/self-audit.md`. Audits: `docs/audit/` (stills required).
Each new clip/thumb gets its own QA issue (play-1 is [#2](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2)). Builder posts path + version + self-audit with pictures. QA comments PASS/FAIL + frame (see `docs/audit/a-play-1/QA.md`). Fetch `origin/main` and read open issues every turn.
Do not shoot the next batch on top of an unresolved fail. Do not remake or delete shipped media until the teacher says go.

**Builder owns obvious product sense.** Ash should not have to check: right
Meet glyph, right Friends trio, not a copy of the other case. If those are
wrong, it is a **builder fail** even if QA never spoke.

**Friend look lock.** Friends stills are I2I/edit from **product art**, not
invented cousins. Letter = that case’s Meet frame. Each friend =
`public/posters/{letter}-{slug}.webp` (the word card). Same ball, same bear,
same butterfly — every letter, every future still.

**One still to Ash.** After you pick, send **one** still + the exact path
(`docs/audit/<id>/00-source-still.jpg`). Rejects stay in the folder as
`*REJECT*`. Do not drop two unlabeled images in chat.

**Stills before I2V.** Post that one still on GitHub. QA PASS before film.

## Never

- Restart the preview / vite. They refresh when they want.
- Paint-out / clone-stamp / mask-cut a letter thumb. **Remake the still.**
- Restore a rejected thumb from git history, chat, or an old path.
- Concat story/Meet files into one mp4. Files stay split; the app chains them.
- Batch B–Z (or 26 Meet plays) until they approve the trial.
- Push `.grok/`, `attachments/`, platform `AGENTS.md`. GitHub is the kids app.
- Invent a hyper-specific law from one miss. General lesson only.
- Drop **new** playable mp4s in `public/videos/**`. Vite `watch.ignored` that glob, so **new files 404** until a restart we must not do. Stories → `public/story-clips/`. Friends → `public/friends-clips/`. After write: `curl -sI` that URL; not 200 = not shipped.

## Always

- `lmk` = talk only. **`start`** = check git/QA, shoot if you agree, lmk if you disagree.
- 2+ usable takes = show them, ask which to keep.
- Product change → bump `VERSION` + `src/lib/version.ts` + `package.json`, commit, `git push origin main`, tell them the version.
- Videos **are in git**. Restore old takes with git. No local `art-archive`.
- New Meet / play videos **480×720**, native diegetic sound in the MP4 (no teacher baked in).
- After a miss: patch **START-HERE + self-audit + qa-howto + the plan** the same turn.

## How QA a video

```
python3 scripts/qa-word-frames.py VIDEO.mp4
```

Look at **all 5** (start / 25 / mid / 75 / end). Fail if any frame is
obviously stupid. Cartoon is fine. Dumb is not.

Checklist (glaring only):

- **Talking mouth:** any friend with a line needs a **visible toy mouth on the source still**. Inanimate + no face = FAIL still (astronaut said “I'm Anchor” because the anchor was blank).
- **Color lock:** letter same hue in 01 and 05. Darkening over the video = fail.
- **Cast lock (Friends):** letter + each named friend **identifiable** in all 5 frames (silhouette OK). Missing at **05-end** = fail. Hide-then-clone = fail. Count every still. Plane majority-in-frame. Apple smile OK, **no limbs**. Method B: cast-lock source still + each clip end before concat.
- Motion matches the beat (plane **forward**, not reverse; feet **travel**, not treadmill; zigzag **on the path**)
- The thing is the thing (sun has rays, Q has a tail + hole, cloud is a puff not a ball)
- Count: ONE of each prop/limb. Extra crayon tip, extra banana, extra gator = fail
- Letter: hole = **background color** (not black); face on **front only**; eyes on the body, not in a hole; glyph still reads as that letter in a small crop
- little letters: Comic-sans **single-story a** (no upper tail); smaller stature; q = one right stem, no extra lumps
- Food: no human body. **Friends speech:** tiny toy smile OK so it can talk; no arms/legs/human head. Word-lesson eat clips: no face if a kid eats it. State-change is one-way (peel stays off)
- Thumb for a word card = **frame 1** written to `public/posters-scene/{letter}-{slug}.webp` *and* `public/posters/`

**Pass:** “ship” + one line why. **Fail:** what’s wrong + which frame. Do not
nitpick. Do not ship junk for the user to find.

## How QA a letter thumb

Compare to a neighbor that already looks right (P/O for Q, D/H for fill).

Fail: extra lumps, huge googly eyes vs tiny black dots, missing hole, hole
not matching the bg, little z / q “surgery” ghosts, letter cut off, extra
blocky background unlike the set.

## Meet A play / Friends

Big A take 2 **PASS for now** (color-drift noted — don’t darken next rounds).

**little a take 1 FAIL** (inventory kept).
**little a take 2** listen: **anchor line failed** (no face on the anchor →
astronaut said “I'm Anchor”). Keep take 2 in the player; **do not remake A**
this round (take 2 FAIL talking-mouth — blank anchor). Notes: color drift + talking-mouth rule. B plans: `docs/b-meets-friends-plan.md` (#5).

**Next:** little b Friends plan still waiting (banana / boat / bird). No shoot until go.

**Big B take 2 stills FAIL** (generic friends, not product posters). Rebuild
from `public/posters/b-ball.webp` + bear + butterfly + Meet B. One still,
one path. No I2V. Issue #5. SOP: friend look lock.

## Plans (remind, don’t start unless they say)

| Ask | File / section |
|---|---|
| Big B Friends take 2 (still + prompts) | `docs/b-meets-friends-take2-plan.md` |
| little a meets friends take 2 | `docs/a-meets-friends-little-a-take2-plan.md` |
| little a take 1 FAIL | `docs/a-meets-friends-little-a-plan.md` |
| A Meets Friends take 2 (speech) | `docs/a-meets-friends-play-1-take2-plan.md` |
| A Meets Friends play-1 remake | `docs/a-meets-friends-play-1-remake.md` |
| Meet A plays with words (old) | `docs/meet-a-play-plan.md` |
| Lowercase / little letters | `AGENTS.project.md` → Lowercase plan |
| Tracing rewrite | `AGENTS.project.md` → Trace rewrite plan |
| Story / video quality | `AGENTS.project.md` → Video QA + Story lines |

## Product map (short)

- Home: Big / little toggle. Tiles = letter thumbs only.
- Letter page: Words, Sound, Trace, Games, Story, Meet, Friends (when a play clip exists).
- Words: 3 Big + 3 little per letter (same clips).
- Story: 3 files, auto-play as one.
- Meet: letter speaks in the clip (no teacher stack). J+ “Hi I’m Big J…”. Slow “Big… A…”.
- Trace: whole letter, dotted guides, solid outline. Comic Neue for little.
- Sound toggle: Narration **or** Video sound, never both.

## Key paths

| What | Where |
|---|---|
| Letter thumbs | `public/letters/{a}.webp`, `{a}-little.webp` |
| Word clips | `public/videos/{a}-{slug}.mp4` |
| Meet | `public/videos/imagine/{a}.mp4`, `{a}-little.mp4` |
| Story | `public/story-clips/{a}-1.mp4` … `-3.mp4` |
| Word thumbs | `public/posters-scene/` + `public/posters/` |
| Taste | `AGENTS.project.md`, `src/data/word-lessons.ts` RULES |
