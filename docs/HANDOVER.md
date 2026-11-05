# HANDOVER — ABC Adventure (for new / replacement agents)

Written 2026-11-05 by the outgoing **ABC-Adventure-Bot1** (QA / audit + docs/ship for ABC only),
at Ash's request via QAsupervisor. Format follows Meta-AI `handover-guide-standard.md`
(sh4gu4dummy-arch/Meta-AI).

This file is **memory + current state**. It does **not** replace the SOPs. For the how-to,
follow the links in [§8 Key doc map](#8-key-doc-map). When this file and a living SOP disagree
on a product rule, the SOP that was edited more recently wins. Fix the stale one in the same push.

---

## 1. Who / what

- **ABC Adventure** is a kids alphabet app for ages ~3–6. Letters, words, sound, trace, games,
  story, Meet (the letter talks), and Friends (the letter plus three word-friends).
- **How it ships:**
  - Web app via **Vite** (React/TS).
  - **Portable offline ZIPs** (`npm run build:portable`).
  - **Android via Capacitor** (`npm run cap:sync`, `npm run build:apk`). It is **not Expo**.
- **Owner:** Ash (GitHub `sh4gu4dummy-arch`). Ash has final taste and is the hard gate.
- **Repo:** https://github.com/sh4gu4dummy-arch/abc-adventure. It is private, the branch is `main`, and the slug is lowercase.
- **Local clone on the shared box:** `/workspace/abc-adventure`.
- **Version at handover:** **v0.493** (this commit). The previous ship was v0.492, the offline local viewer.
- **Outgoing bot role:** QA and audit of frames, stills, and audio against product art, plus
  writing and shipping the docs and plans the Builder must act on. QA is **not** a second
  product owner. See the roles table in `docs/START-HERE.md`.

## 2. How to talk to Ash

- **Minimize chat spam.** Message Ash only when a task is **done** or when **Ash must act**.
  Don't send progress updates mid-task unless Ash asks for live updates.
- **"lmk" = talk only.** Give a text explanation. Do **not** implement, edit, push, or act.
  (Example: on 2026-10-04 Ash re-asked a disk-cleanup question with "don't delete yet just lmk".
  The right reply was a list with zero deletions.)
- **"start"** (from START-HERE) means fetch QA, shoot if you agree, and debate if you don't.
- **Routing history:**
  - **2026-09-19:** the default became **Ash-direct**. Results, asks, and drafts go to Ash in the
    chat he chose. QAsupervisor was asleep then. `docs/QA-SUPERVISOR.md` still says "sleeping";
    that status line is **stale**.
  - **Now (2026-11):** QAsupervisor is **active again**. It relays Ash's cross-project requests
    (status checks, local-preview survey, this handover) and audits handovers. When QAsup is in
    the loop on a QA plan, the flow is: draft → QAsup markup → counter/align → Ash go → ship.
    **Ash's word always wins.**
- **Ship / push gate history:**
  - **2026-09-18 (old rule):** hold drafts until QAsup says ship **and** Ash gives explicit go per
    item. Never push on QAsup's say-so alone.
  - **2026-10-15 (Ash standing rule, all bots, supersedes the above for git):** bots **may commit
    and push to Ash's hobby repos on their own** without per-item approval.
  - **Hard limit that never changed:** no destructive repo actions without asking Ash first.
    That covers force-pushing over history, deleting repos or branches, `reset --hard`/`clean`
    over others' work, and history rewrites (see §10).
  - **Product gates are separate from git permission.** START-HERE still says: do **not**
    commit/push a remade **Friends mp4** until Ash approves the take, and do not remake or delete
    shipped media until the teacher (Ash) says go. Push freedom covers docs, code, and plans. It
    does not cover replacing approved kid-facing media on your own judgment.
- **Version labels are in thousandths:** v0.001, v0.002 … v0.492, v0.493. This is **not semver**.
  Bump on every change (see §5 for the exact files).
- If you are **blocked on an Ash approval card**, tell Ash right away. Don't sit on a silent gate.
- **Keep Ash's exact words.** When Ash states a rule, quote it into the repo. Don't
  over-summarize it.

## 3. Standing Ash rules (still in force)

1. **Quality and creativity beat rigid rule-following** (v0.346/v0.347, all projects). If a rule
   would force a worse product or creative result, don't enforce it blindly. **Flag the
   conflict to Ash** (or to QAsup for escalation). Details: `docs/qa-howto.md` → "Quality +
   creativity over rigid adherence".
2. **Scope is ABC Adventure only.** Do not audit, edit, or push other projects. This applies
   especially to **ClassNest** (`sh4gu4dummy-arch/classnest`): Ash ordered it left untouched after
   a scope mistake (see §9).
3. **Coordinate with teammates through git only.** Builder and other bots **cannot read the ABC
   chat**. Every QA finding, counter, and plan fix goes into repo docs (or GitHub issues) and is
   pushed **the same turn**. Never rely on chat alone. The desk is
   [issue #1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1). Each new clip or thumb
   gets its own QA issue.
4. **Never push `.grok/`**, `attachments/`, or platform `AGENTS.md` internals. GitHub holds the
   kids app.
5. **No real-language text** on signs, plaques, plates, or props in films and stills. Use only
   imaginary rune-type marks, so no real-language speaker is favored or left out. (`qa-howto`
   files the Friends-still check as "soft". Treat new films and UI as no-real-text.)
6. **Mobile-first viewport (~390×844)** for judging UI. This is a gold-hanzi rule from Ash and
   applies across projects. It is reasonable to apply here too.
7. From START-HERE "Never" (summary; read the full list there): never restart preview/Vite,
   never paint out or mask-cut a letter thumb (remake the still), never restore a rejected thumb
   from history, never concat story/Meet files, never drop **new** mp4s under `public/videos/**`
   (Vite ignores that glob, so new files 404). Stories go in `public/story-clips/`, Friends in
   `public/friends-clips/`. After writing a file, `curl -sI` it: anything but 200 means not shipped.
8. **Remake scope:** pin the failure to clip number + speaker + line. The default is to redo that
   clip only. See `docs/remake-scope.md`.
9. **Recursive improvement (Ash):** every correction from Ash goes into START-HERE **and** the
   right SOP (`AGENTS.project.md`, `docs/self-audit.md`, `docs/qa-howto.md`) in the same turn.
   A lesson that only lives in chat will be missed again.

## 4. QA gates and memory (product)

Full procedure: `docs/qa-howto.md`. Below is the memory a stranger would not get from it alone.

- **I2I from product posters.** Friends/Meet stills are edits of product art (`public/posters/`,
  or `public/posters-scene/` if that's what the word card shows; lock which set). They are not
  invented cousins.
  > Ash: "you need to use i2i or edit image first using our product character/friends images
  > already in the product make sure it's the same bear, same butterfly, same ball etc, not only
  > for this letter but for every future still. … next time send me the one confirmed still or
  > lmk where I can find it, confusing to send 2 idk which one you plan on using. do better next
  > time."
- **The home tile is the glyph of record** (`public/letters/{l}.webp`, `{l}-little.webp`). If a still
  or clip 1 doesn't match the home tile, it FAILS. Killed cousins: fat-base U, lump Z, hole-less Q,
  orange big-eye Q.
- **A still must PASS before I2V.** Send **one** still to Ash with its exact path.
- Also gated: attribution/cast, eat-poster (drop the human eater, put a toy face on the food),
  kid rings/classroom audience ban, inanimate + dialogue ⇒ needs a face/mouth. All are in
  `docs/qa-howto.md` (Still QA, Standing gates v0.340).
- **Outgoing bot's self-rule:** I would not still-PASS a Friends/Meet source still unless the audit
  **pastes the product poster paths** (and the Meet/letter path) that were opened side by side.
  **A matching cast name alone is never a PASS.**
- **Meet A video plan locks** (agreed with Ash): the shipped intro look (crossbar face, nub feet),
  480×720, toy-only astronaut, a readable ant, and a beat clock. The plan file
  `docs/meet-a-play-plan.md` was **retired in v0.458** (`ca136aa`, "shoots already happened"). Read it
  from history with `git show ca136aa^:docs/meet-a-play-plan.md`.
- **Meet A remake take-2 plan** (agreed with Ash, not yet shot as a new method):
  - Cut identity padding and lock the speech.
  - Prefer **four short one-line clips** (or speech-first with per-speaker open-mouth stills) over
    another single 15 s I2V.
  - Soften "mouths stay still" so Imagine doesn't freeze the whole yard.
- **Dialogue/audio:** Imagine lips and audio come from one pass, and TTS over muted video does
  **not** lip-sync. STT-check every 6 s clip (`scripts/friends-stt-check.py`). See
  `docs/friends-dialogue.md`.
- **QAsup-era lessons** (from `docs/QA-SUPERVISOR.md`): open the real assets (posters, stills, mp3s)
  before PASS. A session JWT and API credits are different things: Ash has **Imagine quota**, so
  don't invent API-credit "fixes". Trial new methods first. Commit future shoot videos one by one.

## 5. Current status (at handover, 2026-11-05)

- **Idle.** Nothing is in progress.
- **Working tree is clean.** Nothing is dirty or unpushed. After this push, local `main` =
  `origin/main` at v0.493. Re-check with `git fetch && git status -sb`.
- **Last product ship:** v0.491 (Big T clip 2 redone). **Last tooling ship:** v0.492, the offline
  viewer (`6fbb25f`).
- **Videos (verified 2026-11-05):**
  - **363** `.mp4` files on disk (~408 MiB), **all tracked**.
  - **332** tracked symlink aliases under `docs/library/live/`, adding no bytes.
  - **4** retired clips in `docs/library/old/not-used-by-app/`.
  - No untracked or ignored videos.
  - **~341** old video paths exist **only in history**: purged `public/art-archive/*-old-kenburns.mp4`
    (dropped v0.294 `15dd14b`), old `public/review/` dumps (v0.109 `617923f`), and
    `imagine/a-play-1` (dropped v0.364).
- `docs/library/pending/` is for local-only clips awaiting Ash's yes/no and is **never committed**.
  It is currently empty apart from its README.
- **Size:** `.git` ~906 MB, `public/` ~510 MB, repo ~1.5 GB. The box disk has ~96 GB free of 128 GB.
- **Disk-junk scan (2026-10-04, re-checked 2026-11-05):** nothing regenerable to remove. There
  are no `node_modules`, `dist`, portable build, Android build output, or zips in the clone.
- **Version bump convention** (mirror `git show --stat HEAD`): `VERSION`, `src/lib/version.ts`
  (`APP_VERSION`), `package.json` `"version"`, and the version line in `PROJECT.md` → "Git
  checkpoints", plus a START-HERE/SESSION note when it's a product change.
- **Stale docs to know about:** `SESSION.md` header lagged behind; it says v0.491 until this commit.
  `docs/QA-SUPERVISOR.md` says QAsup is sleeping, which is no longer true.

## 6. Waiting on Ash

1. **Sound lesson A: final phonics line (OPEN).**
   - Ash said the sound cue collapsed ("ah says ah like apple").
   - Preferred locked line from planning: **"The sound is ah. Like apple!"** (not "Ay says ah…").
   - Ash authorized a **temporary listen trial**, which is live now: **"The letter A says ah, like
     apple!"** (`src/data/alphabet.ts` `soundCue`, `LetterBuddiesShow.tsx`, mp3 `f6b30e3c87fa64e4`).
     Shipped as **v0.359**. On `main` the fixing commit is **`dd52897`**. The SHA quoted in
     QA-SUPERVISOR.md, `1374c31549f39c371b227db366057c786d03b0a1`, is the same change before a
     rebase and is not on `main`.
   - This is **not the final lock.** Ash needs to listen and choose. Then update `alphabet.ts`,
     `speech-map.ts` and the mp3, START-HERE, and the qa-howto/QA-SUPERVISOR rows.
2. No other open votes or go-aheads were pending from the outgoing bot at handover.

## 7. Desk / preview / local run

| What | Command | Where |
|---|---|---|
| Live dev preview | `npm run dev` | Vite on **:8080** (`--host 0.0.0.0`). **Do not move or restart it.** It is the live-preview contract. |
| Built preview | `npm run preview` | also :8080 |
| Offline viewer (ABC-unique) | `npm run build:portable` once (or `npm run view:build`), then `npm run view` | http://127.0.0.1:**26233**/. Serves the newest `public/portable/abc-adventure-v*-portable/`. Override with `ABC_VIEWER_PORT` (8080/8081 are rejected). If there's no portable build, it exits with instructions. Shipped v0.492 (`scripts/local-viewer.mjs`). |
| Ash's own machine | `OPEN-OFFLINE.md`, `start-offline.cmd` / `.sh` | Node 22 + npm, `npm install` then `npm run dev` → http://localhost:8080 |
| Android | `npm run cap:sync`, `npm run build:apk` | Capacitor (`capacitor.config.ts`, `android/`). |
| Code-only ZIP | `npm run build:code` | PROJECT.md asks for a refresh on every change. The ZIP is not tracked. |

Don't rebuild the portable ZIP, full ZIP, or APK unless Ash asks (PROJECT.md).

## 8. Key doc map

| Doc | Use |
|---|---|
| `docs/START-HERE.md` | First read: roles, hard locks, Never list, version notes |
| `AGENTS.project.md` | Full taste list |
| `PROJECT.md` | Project rules, git checkpoints, version bump |
| `SESSION.md` | Compact version log |
| `docs/qa-howto.md` | QA playbook (frames, stills, gates, templates) |
| `docs/QA-SUPERVISOR.md` | Meta-QA protocol + QAsup lessons (v0.360, `b84a52f` on main; `e5fa7be` is the pre-rebase copy). Status line is stale (§2). |
| `docs/agent-coop.md` | Builder ↔ QA via git/issues, self-audit habits |
| `docs/self-audit.md` | Builder checklist before calling a take done |
| `docs/remake-scope.md` | Which clip to redo |
| `docs/friends-dialogue.md` | Mouths, face lock, speech, STT |
| `docs/meet-asset-debt.md` | Little Meets that are still Big-shaped |
| `docs/library/README.md` | `live/` (symlinks; don't delete), `pending/` (local only), `old/` (retired + `old/audit-frames/`, formerly `docs/audit/`) |
| `docs/meet-a-play-plan.md` | **Retired v0.458.** Read from history (`ca136aa^`) |
| `scripts/local-viewer.mjs`, `scripts/build-portable.mjs` | Offline viewer + portable build |
| `scripts/README-imagine.md`, `scripts/imagine_auth.py` | Imagine stills/I2V auth notes |
| `src/data/alphabet.ts` | Letter data, three friends per letter, sound cues |
| Issue [#1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1) | Standing desk |

## 9. Scars / lessons ("never again")

- **2026-09-17: ClassNest scope mistake.** The outgoing bot audited and rewrote ClassNest QA and
  pushed it. Ash ordered **ABC-only scope** and said to leave ClassNest untouched.
- **Repo access:** the slug is lowercase `abc-adventure`. Early on, the generic GH token in box
  secrets did **not** see this private repo. The **workflow PAT** (repo + workflow scopes) did.
  If a push gets 404/403, suspect the token's repo visibility before you suspect the repo.
- **2026-09-26: stale clone.** The local clone sat at ~v0.360 while the remote was at v0.491. Always
  `git fetch` and `git pull --ff-only` **before** editing, and re-apply your work on top. Never force-push.
- **Bad v0.359 (`6279147`, 2026-09-19):** a commit replaced `src/data/alphabet.ts` with a
  `PLACEHOLDER` stub (667 lines deleted). The real v0.359 push (`dd52897`) restored it. If
  `alphabet.ts` is ever tiny or says PLACEHOLDER, restore it from the last good commit and tell Ash.
- **Box shell hangs:** a full `git status -uall` or a huge filesystem scan can hang the shell
  (~840 s timeout). Use targeted `du`, `git ls-files`, and `git check-ignore`, and run long commands
  in the background.
- **A matching cast name is not a still PASS** (self-rule in §4).
- **Stale Meet source:** Friends I2I'd from a stale Meet `u.mp4` brought back the killed fat-base U
  (v0.349). The home tile is the only glyph of record.
- **Milestones:** v0.296 Meet A plan audit fixes · v0.301 qa-howto · v0.311 / v0.340–0.350 remake
  QA batches · v0.359 Sound A trial · v0.360 QA-SUPERVISOR.md · v0.361–0.385 Friends films ·
  v0.425 library sort live/pending/old (`fcc21c5`) · v0.458 one-shot plans retired · v0.492 viewer ·
  v0.493 this handover.

## 10. Git-history cleanup suggestions (do NOT do without Ash)

**These are suggestions only, from a quick read-only dry run on 2026-11-05.** Nothing has been
rewritten, force-pushed, filter-repo'd, or deleted. Any history change needs Ash's explicit
approval. A rewrite also forces every clone (box, Ash's machine, other bots) to re-sync.

1. **Secrets scan:** I ran `git log --all -G` for GitHub PAT / OpenAI-style key / AWS key / JWT
   pair / private-key header patterns and got **no hits**. No `.env`, keystore/`.jks`, or
   credential files have ever been tracked. Nothing to purge on that front.
2. **Big history-only blobs:** about **234 MiB** of blobs are in history but not in HEAD (4,341 blobs).
   - `public/art-archive/*` accounts for ~110 MiB in 523 blobs (dropped v0.294 `15dd14b`).
   - `public/review/*` accounts for ~15 MiB in 28 blobs (dropped v0.109 `617923f`).
   - The single largest history-only blobs are superseded Friends takes, each 2–5 MiB:
     `friends-clips/a-little-play-2.mp4` (5.1 MiB, old take), `u-play-1` (4.9), `y-play-1` (4.9, plus
     takes at 3.5 and 3.3), `w-play-1` (4.8), `b-little-play-1` (3.5), `z-play-1` (3.4),
     `t-play-1` (3.4), `c-little-play-1` (2.8), `v-play-1` (2.7).
   - No zips or APKs were ever committed.
   - The **art-archive** set is the cheapest win. But START-HERE says "git is the backup", so
     the old remakes are deliberately restorable. Ash decides.
3. **Mistaken / noise commits** (on `main`):
   - `6279147` — v0.359 PLACEHOLDER `alphabet.ts` wipe (fixed by `dd52897`). It's harmless to
     keep; only rewrite if Ash wants a clean log.
   - `35e7eac` (baseline) added `.grok/status`, and `3688bff` (v0.007) removed it. It's a tiny
     platform file that breaks the "never push `.grok/`" rule. It's in history only and contains
     no secret.
   - I found no ClassNest commits in this repo and no revert/WIP commits.

Recommendation: **leave history alone** unless Ash wants the ~110 MiB art-archive purge. If he
does, plan it as one coordinated `git filter-repo` with every agent told to re-clone.

## 11. Secrets & hygiene (where, never what)

- **GitHub push credential:**
  - The box has a `gh` credential helper in `~/.gitconfig` (fetch/push to github.com work through it).
  - A workflow PAT (repo + workflow scopes) has also lived in a file in the box agent secrets folder.
    Ask Ash for the current path. Use it only through a temporary credential, and never write it
    into a file, commit, or `.git/config`.
- **Imagine (stills/I2V):** needs env `XAI_API_KEY`, installed through the secure secret path
  (historically held/installed by QAsupervisor). **Ask Ash.** Never paste it in chat. The Builder
  machine's session JWT path is documented in `scripts/README-imagine.md`, which records no value.
- **Never commit:** PATs, tokens, passwords, API keys, JWTs, cookies, `.env` bodies, vault or card
  details, `.grok/`, `attachments/`.
- **Before every push:** grep the diff for GitHub token prefixes (classic and fine-grained),
  JWT headers, OpenAI-style and AWS key prefixes, and `password` / `token` assignments. Abort if anything matches.
