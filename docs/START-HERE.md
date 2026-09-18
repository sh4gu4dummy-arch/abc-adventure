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

## Ash — product friends stills (exact)

> you need to use i2i or edit image first using our product character/friends images already in the product make sure it's the same bear, same butterfly, same ball etc, not only for this letter but for every future still. make the updated plan, SOP, procedure, etc make sure this doesn't happen again. and next time send me the one confirmed still or lmk where I can find it, confusing to send 2 idk which one you plan on using. do better next time.

SOP fold: I2I/edit from product posters first (every letter); one confirmed still path; QA+supervisor open posters|still before PASS (glyph-only PASS banned). Prefer `public/posters/`; if `posters-scene/` is what the word card shows, lock that and document which set.


## Never

- Restart the preview / vite. They refresh when they want.
- Paint-out / clone-stamp / mask-cut a letter thumb. **Remake the still.**
- Restore a rejected thumb from git history, chat, or an old path.
- I2I a Friends still from a **stale Meet** whose glyph does not match the home tile. That is how fat-U / blob-Z / hole-Q came back.
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
- **Home tile is the glyph of record (hard).** `public/letters/{l}.webp` (or `-little`). Before any Friends I2I, open home tile **and** Meet 01. If they disagree, remake Meet from the home tile first; Friends I2I locks home when Meet drifted. Never lock a killed shape (fat-base U, lump Z, hole-less Q).
- **Real-language signs (soft):** prefer no English shop signs on Friends stills. Soft only — do not FAIL King for “KIM'S KITCHEN”.

## How QA a video

```
python3 scripts/qa-word-frames.py VIDEO.mp4
```

Look at **all 5** (start / 25 / mid / 75 / end). Fail if any frame is
obviously stupid. Cartoon is fine. Dumb is not.

Checklist (glaring only):

- - **Eat poster → Friends:** drop human eater; add toy mouth on the food. Blank food + line = FAIL still (cookie boy / cake oven arms are word-card props, not Friends cast).
**Talking mouth:** any friend with a line needs a **visible toy mouth on the source still**. Inanimate + no face = FAIL still (astronaut said “I'm Anchor” because the anchor was blank).
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

**Locations vary.** Friends stills are not always a grass field. Boat/lake,
street, picnic, etc. Match the friends.

**Chat stills:** Grok blocks repo file links. The image in the thread is
what Ash sees. Also print the git path as plain text for QA.

**Big B Friends take 2** (`friends-clips/b-play-2.mp4`) — film **FAIL** attribution+cast (`docs/audit/b-play-2/QA.md`).
**little b Friends take 1** (`friends-clips/b-little-play-1.mp4`) — film **FAIL** attribution+boat drift (`docs/audit/b-little-play-1/QA.md`).
Take 1 crease inventory kept (`b-play-1.mp4`).

**D–G + H–N Friends stills (no I2V):** tables in Friends status below · [#7](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/7) · [#8](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/8).


## Friends stills / film status (v0.350)

### B · `#5`
- **Big B take 2 film** — still **FAIL** attribution+cast (`docs/audit/b-play-2/QA.md`).
- **little b film** — still **FAIL** attribution+tug drift (`docs/audit/b-little-play-1/QA.md`).
- **little b still** — **PASS** sailboat lock (`docs/audit/b-little-play-1/STILL-QA.md`). Film FAIL separate.

### C · `#6`
- **Big C still** — **PASS soft location** · `docs/audit/c-play-1/STILL-QA.md`.
- **little c still remake** — **PASS** glyph+cookie+cup+cloud, no boy · `docs/audit/c-little-play-1/STILL-QA.md`.
- **Big C film** (`friends-clips/c-play-1.mp4`) — **PASS soft** · `docs/audit/c-play-1/QA.md`.
- **little c film** (`friends-clips/c-little-play-1.mp4`) — **HOLD/FAIL** max −2.9 + attribution · `docs/audit/c-little-play-1/QA.md`.

### D–G · `#7`
| Case | Verdict | Path |
|---|---|---|
| Big D still remake | **PASS** 1 duck, no ball | `docs/audit/d-play-1/STILL-QA.md` |
| **Big D film** | **HOLD/FAIL attribution** (cast 1 duck OK; tech PASS) | `docs/audit/d-play-1/QA.md` |
| little d still | **PASS soft** donut/drum/door | `docs/audit/d-little-play-1/STILL-QA.md` |
| **little d film** | **FAIL/HOLD attribution** | `docs/audit/d-little-play-1/QA.md` |
| Big E still | **PASS soft** | `docs/audit/e-play-1/STILL-QA.md` |
| **Big E film** | **HOLD/FAIL cast** (E gone end; Earth gone mid; tech+listen PASS) | `docs/audit/e-play-1/QA.md` |
| little e still remake | **PASS** toy elbow | `docs/audit/e-little-play-1/STILL-QA.md` |
| Big F / little f / Big G / little g | **PASS soft** | matching `STILL-QA.md` |

### H–N stills · `#8`
| Case | Verdict | Path |
|---|---|---|
| Big H / little h | **PASS** | `h-play-1` / `h-little-play-1` |
| Big I / little i | **PASS** | `i-play-1` / `i-little-play-1` |
| Big J | **PASS** | `j-play-1` |
| little j | **PASS soft jungle** | `j-little-play-1` |
| Big K | **PASS** | `k-play-1` |
| **little k remake** | **PASS soft** adult King; Kitchen English soft | `k-little-play-1` |
| Big L | **PASS** | `l-play-1` |
| **little l remake** | **PASS** lamp 1 face / lollipop / ladder mouth | `l-little-play-1` |
| Big M | **PASS** | `m-play-1` |
| little m | **PASS soft dual milk** | `m-little-play-1` |
| Big N | **PASS soft nose/bubble** | `n-play-1` |
| **little n** | **PASS soft** (Meet little-n locked — NOT rebuild) | `n-little-play-1` |

Plan ref: `docs/hn-friends-stills.md`.

### O–Z stills · `#9`
Plan: `docs/oz-friends-stills.md`.

| Verdict | Cases |
|---|---|
| **PASS / PASS soft** | o, o-little (soft), p, p-little (soft), **q**, q-little (soft), r, r-little (soft), **s**, t, t-little, **u** (home-tile lock), **u-little**, **v-little**, w, w-little (soft), x (soft), x-little (soft), **y**, **y-little**, z (soft), **z-little** |
| **FAIL** (rebuild queued) | **v-play** (blank Violin); **s-little** (Sun≠Smile) |

Quality + creativity > rigid adherence (**all projects**, v0.347): if a rule hurts the product, flag QAsupervisor — do not blind-enforce. Not limited to King/people softs. Standing ban (v0.345): no ring of kids / classroom audience on Friends stills, and no cookie-eater bleed into Friends. King/Queen/Question may be a stylized person / crown figure when natural and readable; do not force toy-only. Random kid stand-ins, dual-letter mess, blank talkers, wrong trio, and eat-poster humans as Friends cast still FAIL.

### Rebuild inventory **QUEUED** (not shoot-now)
- **v-play-1 still** — mouthed toy Violin (blank-talker FAIL) + Volcano + Van; no human
- **s-little-play-1 still** — Ship / **Smile** / Sock (no Sun); flag Meet-little-s debt when remaking
- **E film cast remake later** — letter E missing end; Earth missing mid; keep still; clean letter intro mouths
- **Film HOLDs (unchanged):** little-c (loudness + attribution); Big D / little-d attribution; B films still FAIL
- Remakes postponed unless Ash goes.
- **No I2V on FAILs.**

### Meet-asset debt · queued
Little Meets that are Big-shaped (product bug — Friends cannot lock a lying Meet glyph): **p, s, v, w, x, z** (and review). See [`docs/meet-asset-debt.md`](meet-asset-debt.md). Queued Meet remakes — not shoot-now.

**v0.354** Also filmed L, l, M.

**v0.353** Also filmed little j, K, k.

**v0.352** Ash: film all PASS. Shipped little g, H, h, I, i, J. Still going: j–Z (skip V + little s until re-QA).

**v0.351** Filmed little e + Big F + little f + Big G (listen not passed). Agree QA: remade v-play Violin mouth + s-little Smile (no Sun). Big E film HOLD.

**v0.350** QA ship (docs only): remake stills **PASS** — k-little (soft adult King), q, s, u (+home-tile), u-little, v-little, y, y-little, z-little. **FAIL** — v-play blank Violin; s-little Sun≠Smile. Big E film **HOLD/FAIL cast**. SOP: home-tile glyph lock hard; real-language signs soft. No I2V. No Ash.

**v0.349** Fat-base Big U was still in Meet `u.mp4` (Sep 10) after home tile was fixed (v0.219). Friends I2I from Meet → killed glyph came back. Purged Meet U + remade Friends still from home tile. SOP: home tile = glyph of record.

**v0.348** Ash start: remade O–Z FAIL stills (q/s/s-little/u/u-little/v/v-little/y/y-little/z-little) + little-k stylized king. Filmed Big E (`friends-clips/e-play-1.mp4`). Re-QA those stills. Next F–N films + B remakes + film HOLDs.

**v0.347** quality>rigid = all projects. **v0.346** quality>rigid flag-to-QAsup. **v0.345** QA follow-up: soften the King/person-word rule; ban is kid rings/classroom audience, not all person-shaped Friends.

## Plans (remind, don’t start unless they say)

| Ask | File / section |
|---|---|
| little b Friends still | `docs/audit/b-little-play-1/00-source-still.jpg` |
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
