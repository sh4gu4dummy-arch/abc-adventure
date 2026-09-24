# START HERE — ABC Adventure

Kids alphabet app (ages ~3–6). **Read this first** if you are the builder
or the **QA agent**. Then `AGENTS.project.md` for the full taste list.

**Keep this file current on every push.** When the user corrects a clip,
thumb, or workflow, add the lesson here (short) *and* in
`AGENTS.project.md` **and** `docs/self-audit.md` / `docs/qa-howto.md`.
Both bots **recursively improve** the SOPs — a miss that only lives in
chat will happen again.

**QA supervisor / meta-QA (handoff + Ash-direct routing):** [`docs/QA-SUPERVISOR.md`](QA-SUPERVISOR.md).

## Who does what

| Role | Job |
|---|---|
| **Builder** | Hands-on product adult. Knows Big vs little, Meet vs Friends, which 3 words belong to which case. Does not ship junk for Ash to notice. Does not wait for QA to know the product. |
| **QA agent** | Looks at the actual frames (not the prompt). Pass / fail with *why*. Does not generate replacements unless asked. Does not pick a winner when there are 2+ options — show the user. They are **not** a second product owner. |
| **User** | Final taste. **lmk** = talk only. **start** = fetch QA, shoot if you agree, debate if you don’t. |

**Remake scope (hard):** pin the fail to **clip number + speaker + line**
before proposing a remake. Default = that clip only. Keep list vs remake
list. Do not remake all 4 because one line swapped. If Ash says a line is
fine, keep that clip. Ambiguous report → one question, not a 4-clip plan.
Full: [`docs/remake-scope.md`](remake-scope.md).

**Glyph lock (hard):** Friends letter = `public/letters/{l}.webp` (or `-little`).
The first still is an edit of that file plus the friend posters. Never invent a new letter.
Q is **purple**, small black-dot eyes, hole. Orange huge-eye Q is a killed cousin.
U is **uniform-width**, **no legs**, **no fat base**, **no square bottom bar**, **black-dot eyes**, **no white eyes**, **no pink cheeks**. That square toy U is a killed cousin. If the still or clip 1 does not match the home tile, FAIL. Do not film. Do not chain the next clip off a new face.

**Friends play (future clips):** speaker uses the scene — splash, crawl, roll, fly a loop, sit in the nest — not only jump toward camera and talk. True-job still applies (ocean stays water, etc.). Camera can be close or the high wide Big Y shot. Keep the shot the clip already has. Do not make the wide shot the only look.

**Friends stills:** I2I from **product posters**. Two abstract cases: a person already in the poster talks (the girl says `"I'm under the table!"`); a place does not talk (Z says `"This is the Zoo."`, the gate has no mouth). Big Z’s friend is the zipper poster, not a bag. Unique spots **inside a real place** — do not nuke the background into empty lawn. **Scatter + zoom on full remakes** — not an even 2×2; left-pair/right-pair talking is a fail.
If one friend says every remaining line, full remake and shrink that face.
Don’t smash another friend’s patch; letter never merges; no chorus.
**No subtitles.** Do not print the line on the picture. A caption is a fail. Named miss: Big T clip 3, left as-is.

**Speaker lock (standing — Ash should not have to repeat it):** on a friend
clip the letter’s mouth stays frozen shut all 6 seconds. Open the speech
frame. If the letter’s mouth is open, reshoot before concat. Count 1,
quoted line, other mouths sealed, forbidden names, no clones.
**Letter face lock:** clip-1 vs clip-2 of the letter — same hole/eyes/cheeks
(little-d white-eyes + pink-cheeks = FAIL). If the chain drifted the face,
re-I2V from the locked still. Every Ash correction gets written here the
same turn. Delete the old line if it disagrees.

`docs/friends-dialogue.md`.

**Friends spots:** each friend has a **unique patch** (tracks, yellow grass, leaf pile, path) so they don’t share a voice. Crowded huddle = double-talk. `docs/friends-dialogue.md`.

**Friends play:** each clip names a **real action with the set** (train on
tracks, shade of the tree, walk the path). Idle hop is not enough.
`docs/friends-dialogue.md`.

**Friends remakes:** do **not** commit/push a remade Friends mp4 until Ash
approves it. Keep the take local (or in chat) until they say ship.

**Friends dialogue:** Imagine lips+audio are one pass. **TTS over mute does
not lip-sync** — don’t sell it as the default. Keep native audio when STT
on that 6s is the right line. Wrong line → tell Ash; remakes are **Ash’s
call**. Quoted one-speaker prompt: `docs/friends-dialogue.md`.

**Friends STT:** check each 6s. Keep Imagine audio if the line is right.
`friends-lock-lines.py` is optional (hearing patch; lips won’t match).

**Talk on GitHub, not only chat.** Standing desk: [issue #1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1).
Coop rules: `docs/agent-coop.md`. **Full QA playbook:** `docs/qa-howto.md`.
Builder self-audit: `docs/self-audit.md`. Old check frames moved to `docs/library/old/audit-frames/` (nothing deleted). New video browsing: `docs/library/README.md`.
Each new clip/thumb gets its own QA issue (play-1 is [#2](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2)). Builder posts path + version + self-audit with pictures. QA comments PASS/FAIL + frame (see `docs/audit/a-play-1/QA.md`). Fetch `origin/main` and read open issues every turn.
Do not shoot the next batch on top of an unresolved fail. Do not remake or delete shipped media until the teacher says go.

**Builder owns obvious product sense.** Ash should not have to check: right
Meet glyph, right Friends trio, not a copy of the other case. If those are
wrong, it is a **builder fail** even if QA never spoke.

**QA-box Imagine:** stills/I2V need env `XAI_API_KEY` (installed via secure secret (historically QAsup) — **never paste in chat**). JWT `/root/.grok/auth.json` remains the Builder-machine path. See `scripts/README-imagine.md` + `scripts/imagine_auth.py`.

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
this round (take 2 FAIL talking-mouth — blank anchor). Notes: color drift + talking-mouth rule.

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

### O–Z stills · `#9`

| Verdict | Cases |
|---|---|
| **PASS / PASS soft** | o, o-little (soft), p, p-little (soft), **q**, q-little (soft), r, r-little (soft), **s**, t, t-little, **u** (home-tile lock), **u-little**, **v-little**, w, w-little (soft), x (soft), x-little (soft), **y**, **y-little**, z (soft), **z-little** |
| **FAIL** (rebuild queued) | **v-play** / **s-little** — remade again v0.356 (violin face punched; Smile on dock, no sun). Re-QA. |

Quality + creativity > rigid adherence (**all projects**, v0.347): if a rule hurts the product, flag Ash (or QAsup when awake) — do not blind-enforce. Not limited to King/people softs. Standing ban (v0.345): no ring of kids / classroom audience on Friends stills, and no cookie-eater bleed into Friends. King/Queen/Question may be a stylized person / crown figure when natural and readable; do not force toy-only. Random kid stand-ins, dual-letter mess, blank talkers, wrong trio, and eat-poster humans as Friends cast still FAIL.

### Rebuild inventory **QUEUED** (not shoot-now)
- **v-play-1 still** — remade v0.356: poster-lock violin face (unmissable). Re-QA.
- **s-little-play-1 still** — remade v0.356: Smile on dock (no sun/rays). Re-QA.
- **E film cast remake later** — letter E missing end; Earth missing mid; keep still; clean letter intro mouths
- **Film HOLDs (unchanged):** little-c (loudness + attribution); Big D / little-d attribution; B films still FAIL
- Remakes postponed unless Ash goes.
- **No I2V on FAILs.**

### Meet-asset debt · queued
Little Meets that are Big-shaped (product bug — Friends cannot lock a lying Meet glyph): **p, s, v, w, x, z** (and review). See [`docs/meet-asset-debt.md`](meet-asset-debt.md). Queued Meet remakes — not shoot-now.

**Dev tab** (home, next to Big/little): pending remakes Ash has not
confirmed. Confirm/Reject copies a paste block for chat. Source:
`src/data/pending-remakes.ts`. Add a row when a remake is local-only.
Remove the row after CONFIRM (commit) or REJECT (revert).

**v0.463** Big W's floating second pair of eyes is now a hard fail in the dialogue rules. Look above the letter, not only at the mouth.

**v0.462** Big V clip 3 redone. Only the volcano talks.

**v0.461** Friends and Meet video URLs include the version so the phone cannot keep an old file. Big U's split eyes were that old file.

**v0.460** Big U clip 1 confirmed. It stays in the game. Clip 2 is still waiting.

**v0.459** Big T clip 1 redone in the real home-tile yellow-green. Clips 2–4 are still orange.

**v0.458** Retired the one-shot A/B/D–Z plans. Rules stay in the living docs.

**v0.457** Big U clip 2 redone. Eyes stay on the left upright. Clip 1 kept.

**v0.456** Big T clip 2 reshot with the stricter prompt. Only the tree talks.

**v0.455** Big T clip 2 reshot with Ash's short prompt. Only the top-left tree talks.

**v0.454** Little b clip 3 redone. Only the boat's mouth moves. The others stay speechless.

**v0.453** Big Z confirmed. All 4 clips are on GitHub. Off the pending list.

**v0.452** Big Z clips 1–2 kept. Clip 3 is the zipper. Clip 4 they say Let's go to the zoo and run to the gate.

**v0.451** Big Z all 4 redone. Gate has no face. Zebra is bare. Zipper is a zipper. Full-redo checklist is in the prompt file.

**v0.450** Big Y clip 4 redone. Clip 3 kept. Only the yak talks. Y stays shut.

**v0.449** Big W all 4 redone wider. Same blue W. Whale, water, window. Clips are in docs/library/pending.

**v0.448** Big V clip 3 redone. The words on the grass are gone. V stays shut. Only the volcano talks.

**v0.447** Big U girl-picnic clip redone. Same U as clip 1. Eyes stay on the left. No new person. Later stills now have to match the home tile before filming.

**v0.446** Big T all 4 redone. The letter stays the home-tile red-orange. Clip 2 alone had not fixed the color.

**v0.445** Little c clip 2 redone. Only the cloud talks. Little d all 4 redone so the letter stays light blue. The duck says quack, I'm a duck.

**v0.444** Little b clip 3 redone. Only the boat talks. The prompt now names every silent friend, not just the letter.

**v0.443** Big Z clip 4 redone. No sweater. The zipper says the line. The zebra stays shut. Clip 3 still has the sweater.

**v0.442** Big Z clip 3 redone. They walk toward the gate, then Z says the line. Clip 4 can jump.

**v0.441** Big Y clip 4 redone. The yak says the line. Y stays shut. The prompt guide now says the letter is a silent prop, and a clean transcript is not a pass.

**v0.440** Big Y clip 3 redone from the new clip 2 ending. Only the crayon talks. Clip 4 can still jump.

**v0.439** Big Y clip 2 redone. One yo-yo, the one by the tree. Later clips were left, so the cut can jump.

**v0.438** Big W clip 4 redone. The window's mouth stays small. No teeth.

**v0.437** Big W clip 3 redone. Only the pond drop talks. No glass.

**v0.436** Big V clip 3 redone. Only the volcano talks. V stays shut.

**v0.435** Big U clip 1 redone. Two eyes on the left stem. The extra pair is gone.

**v0.434** Big T clip 2 redone. Only the tree talks. T and the tiger stay shut.

**v0.433** Big Z clip 3 redone. They step toward the gate instead of sliding. Clip 4 follows.

**v0.432** Big Z clips 1 and 2 kept. Clip 3 walks to the zoo, then Z says the line. Clip 4 redone from that end.

**v0.431** Big Y clips 2–4 redone. The yo-yo by the tree is the only yo-yo.

**v0.430** Big X clip 4 confirmed. It is in the game and on GitHub.

**v0.429** Big W clips 3 and 4 redone. The water stays the pond drop. No glass.

**v0.428** Big V clip 2 kept. Clip 3 redone so only the volcano talks.

**v0.427** Big U redone from the home tile. Both eyes stay on the left upright. The old clip had one eye on each side.

**v0.426** Big T clip 2 rejected and redone. Leaves fall while the tree talks. New rule: action, I2I from the locked frame, save the end frame.

**v0.425** Video library: `docs/library/live` (shortcuts to the game), `pending` (copies, not committed), `old` (the dump, nothing deleted).

**v0.424** Unconfirmed clips copied as separate files in `docs/audit-clips/` (local only). The game still plays the full videos.

**v0.423** Note only. Big U eyes vanish at 0.3s. The still is fine.

**v0.422** Note only. Big U still is fine. Dot eyes, thin base. Arms are not a fail.

**v0.421** Big T clip 2 redone locally. Tree only. Clip 3 subtitles left. Not on GitHub until confirm.

**v0.420** Little b clip 3 redone locally. Boat says "I'm a boat." Others stay shut. Not on GitHub until confirm.

**v0.419** Big Z full redo, local only. Zipper instead of a bag. Zoo is a place. Z says "This is the Zoo." Not on GitHub until confirm.

**v0.418** Big Y clips 2–4 redone locally. Same wide shot. Y does not say the friends' lines. Not on GitHub until confirm.

**v0.417** Big X clip 4 redone locally. The box already beside X talks. No second box. Not on GitHub until confirm.

**v0.416** Big W clips 3 and 4 redone locally. Pond stays full. Whale does not slap the water. Not on GitHub until confirm.

**v0.415** Big U full redo, local only. Started from the home-tile U (thin even stroke, black-dot eyes). The square-base U is banned. Not on GitHub.

**v0.414** Big T clips 2 and 3 redone locally. Tree says "I'm a tree." Tiger says "I'm Tiger." Other mouths shut during the words. Clips 1 and 4 kept. Not on GitHub.

**v0.413** Little d: clips 1 and 3 redone locally, clip 2 kept. Clip 4 still heard as "I'm Doc," not Duck. Not on GitHub.

**v0.412** Little c clip 2 reshot locally (cloud only says "I'm Cloud"). Not on GitHub until Ash confirms. Clips 1, 3, 4 kept.

**v0.411** Confirmed little a Friends (clip 4). Little c is not confirmed — clip 2 still has more than one voice.

**v0.410** Dev Show decided is its own box at the top. Confirm no longer hides the card in the waiting list with no place to see it.

**v0.409** Dev tab loads a remake only when you press Play on that card.

**v0.408** Meet and Friends keep the still until you tap play. Arrows do not download the next letter.

**v0.407** Story videos wait for play. Next scene downloads only while the current one is playing.

**v0.406** Dev tab: pending remake queue + copy Confirm/Reject for chat.

**v0.405** Letter face lock SOP. Little d Friends remake in preview.

**v0.404** Little c clip 2 (Cloud) remake in preview; 1,3,4 kept.

**v0.403** Little b clip 3 (Boat) chorus remake in preview — pond kept.

**v0.402** Clip-isolate relocate named FAIL (little-b boat on grass) in SOP + QA.

**v0.401** Clip-isolate: never I2I a new still. Little b 3–4 boat stays in pond.

**v0.400** Little b clips 3–4 (Boat, Bird) remake in preview.

**v0.399** Little a clip 4 (Anchor) remake in preview — no extra astronauts.

**v0.398** Little c/d/f/m/t/y thumbs extra zoom.

**v0.397** Little home thumbs: zoom a–o/r–y toward p/q/z fill; p, q, z stay.

**v0.396** Biggest-face thief = full remake (don’t chain 2–4). Big Z scatter remake in preview. Zebra stays small/far.

**v0.395** Scatter + zoom on full remakes (not even 2×2). Big Y full remake in preview.

**v0.394** Speaker lock: count 1 + quoted line + sealed others + forbidden names + no speaker-clones. Big X 3–4 remake in preview.

**v0.393** Big U full redo from home glyph (no legs / no fat-base). Preview only.

**v0.392** Place-first: spots inside a real place, don’t nuke to empty lawn. Big T clips 2–3 remake in preview.

**Killed:** fat-base U, lump Z, hole-less Q, **orange big-eye Q**.
   Q home = purple, black-dot eyes, hole. Orange Q still = FAIL, don't I2V.
   Fat-base U = FAIL. Home tile `letters/u.webp` is the only Big U glyph.

**v0.391** Big Z Friends from-scratch with SOP. Preview only.

**v0.390** Big Y Friends from-scratch with SOP (spots, product posters, no clones). Preview only.

**v0.389** No extra clones (second xylophone/box). Big X clips 3–4 remake in preview.

**v0.388** Don’t smash a friend’s spot; letter never merges; no chorus. Clip-isolate. Big W 3–4 remake in preview.

**v0.387** Friends SOP: product-poster stills; abstract words (Under) = letter says `"I'm under the table!"`. Big U remake #2 in preview.

**v0.386** Friends SOP: unique SPOTS so two friends don’t say the same line. Big T remake #2 in preview (not committed).

**v0.385** Big V + little s Friends filmed (were missing). V: violin has a face, no boy. little s: Ship/Smile/Sock, not Sun. STT pass. T/U remakes still local until Ash approves.

**v0.384** Friends play SOP: each clip names a real action with the set (tracks, canopy, path). Big T remake is in preview only until Ash approves.

**v0.383** Big S Friends (Ash approved): S stayed a letter (holes), snake separate. Old still was already a snake-S. STT: I'm Big S / Sun / Star / Snake.

**v0.382** Git: purged leftover `a-little-play-1` / `b-play-1` + old remake blobs (C/F/G/H/I/M/N/O/P/R). Live 50 Friends files unchanged. Do not commit remade Friends until Ash approves.

**v0.381** Dialogue: TTS ≠ lip-sync (Ash). Remakes are Ash’s call — dropped “never remake names.” Keep Imagine audio when the 6s STT is right.

**v0.380** Dialogue protocol: stop burning Imagine on wrong names. I2V = silent play; TTS = lines. Research: Imagine lip-sync is one talking head, not 4-wide. `docs/friends-dialogue.md`.

**v0.379** Big R: mute Imagine audio, TTS all 4 lines (I'm Big R / Rainbow / Robot / Rocket). Duck-10% was the leak. Metric: one TTS name per 6s, STT must match. Picture mouths may still move — audio cannot double-talk.

**v0.378** Why Q mixed: Friends still I2I'd an orange big-eye cousin instead of home purple Q. SOP already said home-tile lock; we didn't do it. Named kill + still-vs-`letters/q.webp` FAIL before I2V.

**v0.377** Big R: letter said Rainbow. Did **not** remake all 4. TTS-locked clip 1 to "I'm Big R!" (`scripts/friends-lock-letter-line.py`). Rainbow/Robot/Rocket kept. This is now the ship gate for every Friends letter clip.

**v0.376** Big P Friends: remade clips 2–3 only (Pizza was saying Penguin; Penguin was saying Pig). P and Pig kept. Full STT: I'm Big P / I'm Pizza / I'm Penguin / I'm Pig. Hard-refresh `p-play-1.mp4`.

**v0.375** Future Friends: play in the environment (true job in the scene). Do not plan clips as only hop-forward + talk. Camera stays wide. Don't remake old letters unless Ash asks.

**v0.374** Big O Friends: Ocean clip only (clip 4). Was saying I'm Big O and turning into a whale. Now STT: I'm Ocean. Water blob, no leap. Orange/Owl/O kept. Hard-refresh `o-play-1.mp4`.

**v0.373** Big N Friends: objects don't talk. N says "This is a nest." / "This is a nose." (~12s, same path `n-play-1.mp4`). Night stays in the picture, silent. Hard-refresh.

**v0.372** Big M: M said I'm Moon. Remade **clip 1 only**. Moon/Monkey/Mouse kept. Ship gate: `scripts/friends-stt-check.py` (STT; clip 1 must not say a friend name). Hard-refresh `m-play-1.mp4`.

**v0.371** Big I Friends: Island said I'm Big I. Remade **clip 4 only**. Ice cream/Igloo/I kept. Hard-refresh `i-play-1.mp4`.

**v0.370** Big H Friends: H said I'm House. Remade **clip 1 only** (I'm Big H). Hat/House/Horse kept. Hard-refresh `h-play-1.mp4`.

**v0.369** Big G Friends: extra eyes = clips 1–2; grape juice = clip 3. Remade 1–3, kept Guitar. Grapes take 3 (first two still sprayed). STT: I'm Big G / Giraffe / Grapes / Guitar.

**v0.368** Big F Friends: remade **clip 2 only** (Fish). STT: I'm fish, not I'm Big F. Same filename — hard-refresh. If ears still hear Big F, line needs to change (F vs fish too close), same lesson as Cat/Cake.

**v0.367** `OPEN-OFFLINE.md`: if git is already up to date, just `npm install` (first time) then `npm run dev`. Clone is a footnote.

**v0.366** Offline run on Ash's machine: repo root `OPEN-OFFLINE.md` (+ `start-offline.cmd` / `.sh`). Node 22 + npm. No Python. `npm install` then `npm run dev` → http://localhost:8080

**v0.365** Big C Friends: Cat said Cake's line. Remade **clip 2 only** (I'm Cat). Cake/Car/C kept. `friends-clips/c-play-1.mp4`. Hard-refresh if you still hear the old line (same filename).

**v0.364** Clone cleanup: removed unused leftover mp4s from the tree only (`friends-clips/a-little-play-1`, `b-play-1`, duplicate `videos/imagine/a-play-1` + `a-little-play-1`). Still restorable from git history. App still uses `a-little-play-2` / `b-play-2`.

**v0.363** Remake-scope SOP (Ash): diagnose the *moment* not the *character*. Default remake = one clip. `docs/remake-scope.md`. Big B still waiting go — clip 4 only.

**v0.362** Ash: Big B Bear said "I'm Butterfly." Same-letter names swap. Still kept; remake plan `docs/audit/b-play-3-plan.md`. No I2V until go. SOP: listen every clip; ban the other names in the prompt.

**v0.361** Filmed remaining PASS Friends: R/r, S, T/t, U/u, little v, W/w, X/x, Y/y, Z/z. Still skipped: Big V + little s (re-QA). Listen not passed.

**v0.358** Filmed O/o/P/p/Q/q Friends (listen not passed). Remaining PASS: R–Z except V + little s. v0.357 Imagine auth pulled. No new QA on V/s-little.

**v0.356** Remade FAIL stills: Big V violin face punched from `v-violin.webp`; little s Smile on dock from `s-smile.webp` (no sun). Re-QA. No I2V.

**v0.355** H–N Friends films complete (little m, N, n). O–Z PASS still remaining (skip V + little s).

**v0.354** Also filmed L, l, M.

**v0.353** Also filmed little j, K, k.

**v0.352** Ash: film all PASS. Shipped little g, H, h, I, i, J. Still going: j–Z (skip V + little s until re-QA).

**v0.351** Filmed little e + Big F + little f + Big G (listen not passed). Agree QA: remade v-play Violin mouth + s-little Smile (no Sun). Big E film HOLD.

**v0.350** QA ship (docs only): remake stills **PASS** — k-little (soft adult King), q, s, u (+home-tile), u-little, v-little, y, y-little, z-little. **FAIL** — v-play blank Violin; s-little Sun≠Smile. Big E film **HOLD/FAIL cast**. SOP: home-tile glyph lock hard; real-language signs soft. No I2V. No Ash.

**v0.349** Fat-base Big U was still in Meet `u.mp4` (Sep 10) after home tile was fixed (v0.219). Friends I2I from Meet → killed glyph came back. Purged Meet U + remade Friends still from home tile. SOP: home tile = glyph of record.

**v0.348** Ash start: remade O–Z FAIL stills (q/s/s-little/u/u-little/v/v-little/y/y-little/z-little) + little-k stylized king. Filmed Big E (`friends-clips/e-play-1.mp4`). Re-QA those stills. Next F–N films + B remakes + film HOLDs.

**v0.347** quality>rigid = all projects. **v0.346** quality>rigid flag-to-Ash. **v0.345** QA follow-up: soften the King/person-word rule; ban is kid rings/classroom audience, not all person-shaped Friends.

## What to read

Living rules only. Do not write a new letter plan.

| Doc | Use |
|---|---|
| `docs/friends-dialogue.md` | Mouths, face lock, color, speech |
| `docs/self-audit.md` | Check before you call a take done |
| `docs/remake-scope.md` | Which clip to redo |
| `docs/qa-howto.md` | How QA looks at frames |
| `docs/meet-asset-debt.md` | Little Meets that are still Big-shaped |
| `src/data/alphabet.ts` | Which three friends belong to the letter |

Retired in v0.458: the A/B take plans, D–Z still sheets, and the Meet-A play plan. Those shoots already happened.

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
