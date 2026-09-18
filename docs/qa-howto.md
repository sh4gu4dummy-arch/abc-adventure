# How QA works — videos, project files, and GitHub cooperation

Teacher playbook adapted for **ABC Adventure** (`sh4gu4dummy-arch/abc-adventure`).
If it is not in this repo, the other bot never saw it.

## Still QA (before I2V)

Builder posts the **source still** on the issue. You PASS/FAIL the still
**before** they film.

### Product-art look-lock (hard)

- Open **product** art side-by-side with the candidate **before** any PASS.
- Friends: `public/posters/{letter}-{slug}.webp`. If `posters-scene/` exists for
  that slug and is what the word card shows (`posterPath`), lock **that** and
  paste which set you used in the audit.
- Letter: Meet intro of **that case** + `public/letters/…` as needed.
- Fail if same *word* but wrong *character* (generic teddy ≠ product bear).
- Cast-name match alone is **not** a PASS. **Glyph/crease-only PASS is banned.**
- Pipeline: I2I/edit from product images first.

### Eat posters → Friends stills (hard)

Word-lesson **eat** posters may show a **human eater** + **face-blank food**.

Friends I2I from those posters:
1. **Drop the human** — not Friends cast (same class as cake-poster oven-mitt arms).
2. **Add a toy face/mouth on the food** so it can speak.

Face-blank food + spoken line = **FAIL still** (same class as blank Anchor).
Product-scene people/arms are props for the word card, not Friends cast.


### Evidence (required in STILL-QA / README)

Paste the Meet/letter path + each friend poster path that was opened. Checklist
without paths = incomplete audit.

### Checklist before still PASS

```
[ ] Meet/letter side-by-side
[ ] Friend1 poster | still
[ ] Friend2 poster | still
[ ] Friend3 poster | still
[ ] Paths pasted in audit
[ ] One confirmed path named
[ ] Mouths / glyph / cast count / color (existing)
```

### One-still rule

Builder sends **one** still + path. Two unlabeled = process FAIL.

### Supervisor + QA gate

After Builder posts the confirmed still: **both** re-open posters | still crops
before PASS. Soft rubber-stamp = process miss.

Fail the still also if: talker with no mouth, wrong trio, letter already darker
than Meet, extra friends, photoreal kid in a helmet.

**Ash product fails go on the issue quoted, then into START-HERE + the plan
the same turn.** Do not wait for a supervisor paraphrase.

Builder self-audit SOP: [`docs/self-audit.md`](self-audit.md).


## 1. Roles

| Role | Job |
|---|---|
| **Teacher / owner** | Product decisions. Says **go** before generate. Breaks ties. **`lmk`** = talk only (no edit / push / generate). |
| **QA bot** (this agent) | Find mistakes. Fail bad clips on purpose. Improve the next-round plan. Own AUDIT replies + board. Do **not** rubber-stamp the builder’s self-QA. |
| **Builder / executor** | Generates and encodes when allowed. Honest self-QA into `docs/audit/` + the GitHub issue. Often **not** visible in the QA bot’s teammate list. |

**Critical:** if QA cannot see or message the builder, cooperation happens **only through this git repo** (docs + issues + stills). Chat with the teacher is not the handoff.

## 2. Communicate through GitHub (not agent chat)

Stable set on `main`:

| Doc | Role |
|---|---|
| `docs/START-HERE.md` | Orientation: what shipped, hard stops, read order, whose job |
| `AGENTS.project.md` | Standing taste / invariants |
| `docs/agent-coop.md` | Builder ↔ QA coop rules (short) |
| **`docs/qa-howto.md`** | **This file** — full QA procedure |
| Round plan e.g. `docs/meet-a-play-plan.md` | PLAN until go; prompts, gates, encode |
| `docs/audit/<clip>/` | Still dumps + AUDIT README / QA reply |
| GitHub issues | Desk [#1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1); per-clip QA issues (play-1 = [#2](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/2)) |

Typical loop:

1. Builder pulls `main`, follows the plan, ships assets, fills `docs/audit/…` + issue self-audit.
2. QA pulls `main`, re-audits (opens stills + probes), pushes fails / softs / plan fixes + issue comment.
3. Disagreements stay on the issue / in docs until agreement or teacher tie.
4. Meaningful doc/gate changes → version bump + push.

Do not paste a long handoff blurb in chat as the source of truth. Update START. Chat points at the file.

## 3. How to QA videos (procedure)

For each clip / id:

### A. Tech probe (before arguing about art)

- Duration, resolution, fps, has audio (if required).
- Loudness: `mean_volume` and `max_volume` (`ffmpeg -af volumedetect`).
- Fail / soft per standing product gates (Meet play: audible foley expected; board-silent mean is at least a **soft miss**).
- If the recipe changed after a hot/quiet batch, proof-encode one known-bad clip to `/tmp` and pass the gate **before** shooting the next batch.
- Never soft-pass a standing **number** gate.

### B. Frame stills (open the pixels)

```
python3 scripts/qa-word-frames.py VIDEO.mp4
```

Save under `docs/audit/<clip>/`:

- `00-source-still.jpg` (stage / character source)
- `01-start` … `05-end` (or start / 25 / mid / 75 / end)

A note without stills is not an audit.

### C. Visual checklist (fail on purpose)

ABC-flavored (also see START-HERE):

- Correct letter / face lock vs Meet intro (or the plan’s locked look).
- Exactly **one** hero letter. No twin A, extra arms, extra legs beyond nub feet.
- Props are the thing. Friends speech: **tiny toy smile OK** on apple so it
  can talk; human body / extra apple = fail. Word-lesson eat clips: no face.

- **Case word trio (Friends):** before LOCK, verify Meet path + friends list
  from `wordsForCase` / `alphabet.ts` (first 3 Big, last 3 little). Big and
  little never share the same three. Cast-lock does not replace this.
- **Cast lock:** named letter + friends **identifiable** in **01 through 05**
  (silhouette / majority-visible OK; complete cover = fail). Hero gone at
  **05-end** = fail. Eclipse then clone (apple behind A, then a new apple) =
  fail. Count letter + each friend in **every** still. Flying friend (plane):
  **majority stays in frame**. Apple: tiny smile OK; **no limbs**.
- **Method B:** source still cast-locks before I2V; each clip **05-end**
  cast+count==1 before concat (no frame-lock poison).
- Beat / virtue readable by **mid** still when the plan says so — not only at the end.
- No humans, silhouettes, crowds, readable letters, logos (unless the plan allows a specific prop).
- Face readable through the last second; hero does not exit / crop out.
- Motion: travel not treadmill; plane **forward**; state-change one-way.
- Size: Meet clips **480×720** unless the plan says otherwise.
- little letters: single-story **a**, no upper tail; not a tiny Big A.

### D. Compare to the written plan

- Did the prompt / shot list ask for the beat that must show by mid?
- Did encode match the current recipe?
- Did the builder list soft misses, or only write “all PASS”?

### E. Write the AUDIT

- `pass` / `soft` / `fail` with evidence: which file, what you saw, probe numbers.
- Soft column is required. Hiding soft misses is a process fail.
- Separately list “executor mistakes to fix in the next plan.”
- Comment the same verdict on the clip’s GitHub issue.

### F. Feed the next plan

Every miss becomes a hard gate, a trap note, or a prompt phrase in the plan file — not a chat reminder.

## 4. How to QA other project files

**Plans** — gates match the last AUDIT’s real fails; negatives match fail rules; encode matches loudness gate; “do not generate until go” explicit; roles correct.

**Board / issues** — specific (paths, frame names, agree/disagree); open questions say who answers; newest-first honesty.

**START** — matches disk; points at current plan + last AUDIT; hard stops still true.

**Code / ready sets** — Meet playlist only lists files that exist; versions consistent (`VERSION`, `src/lib/version.ts`, `package.json`).

**Cross-bot scope** — other project bots do not rewrite ABC plans unless the teacher asked.

## 5. Tips for a critical eye

- Assume self-QA is optimistic. Your job is to find the miss.
- Filename claims lose to pixels.
- Soft fails matter; ignored softs become the next hard fails.
- Common traps: second body / ghost twin; **eclipse-clone**; **hero gone at
  end**; frame-lock poison; plane tip-only exit; apple limbs; crowd bleed; late virtue; exit crop; portrait≠stage; hot or quiet
  audio; same-voice narrator on A; letters/logos; morph; rubber-stamp AUDIT.
- After a miss: **upgrade the checklist** here. Do not only scold the take.
- Disagree with file + pixels. Yield to evidence. Escalate to teacher if stuck — do not silently win.
- Batch OK while clean; after twin/human/exit fail, one-id until fixed.

## 5b. What the builder needs from QA (do these)

Do not only say FAIL. The other agent cannot see your head.

1. **Frame + count.** “05-end, A gone” or “03-mid, apple count 0 then 2.”
2. **Listen vs pixels** as separate columns. Clear words + wrong mouth = FAIL.
3. **One next-plan gate** per miss (general, not a 40-word ban).
4. **Patch the SOP** (this file / START-HERE / self-audit) when the miss is
   new. Recursive. Ash asked you to get better too.
5. Debate on the issue. Do not rubber-stamp builder README. Do not silently
   rewrite the product. Teacher breaks ties.

Builder will pull `main` and **start** (shoot if they agree). If your
amendment is only in Grok chat, they never saw it.

## 6. Working practices (short)

- **go** before any generate.
- **lmk** = talk only.
- Never delete or overwrite shipped media without a yes.
- Debate in issues/docs; teacher breaks ties.
- QA improves the plan; builder executes the plan.
- Pixel truth beats filenames and chat.
- Version bump + push after meaningful gate/doc changes.

## 7. What “done” looks like for a round

Plan gates clear → teacher **go** → builder ships + honest AUDIT → QA recheck (try to fail) → next plan updated from real misses → push to `main`.

If QA and builder still disagree after a documented round, ask the teacher.

## 8. Templates

### AUDIT row

```
Id / clip | Verdict | Evidence
a-play-1  | soft    | 03-mid: all three props on screen; mean −55 dB (quiet)
```

### Issue reply

```
Agree: …
Disagree: … (file + pixels)
Yield: …
Ask teacher only if: …
```

### Next-plan gate (example)

```
After encode, open 03-mid.jpg — if the current word’s prop beat is not readable yet, redo that id. Do not ship.
```
