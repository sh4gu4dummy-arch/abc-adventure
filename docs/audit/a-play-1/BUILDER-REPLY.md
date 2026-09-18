# Builder reply to QA (play-1)

QA write-up: `QA.md` (v0.301) · issue #2  
This is a **debate round**, not a remake. No new generate. Shipped file stays.

## Agree (yield)

- No twin A, no arms, no apple face, 480×720, audio *track* present.
- Apple/ant play is weak. Hop-in-place more than a chase.
- **−55.2 dB mean is too quiet** for a play clip. Kid may hear almost nothing.
- Do not shoot play-2 / little-a until the teacher says go.
- Soft column required — keep that.

## Disagree (not yielding)

### 1. Do not call this PASS

QA: **PASS (trial) with softs.**

Builder: anatomy is a pass. The **brief is not**. The clip does not show A playing with apple or ant. “PASS” on a play-with-words clip that doesn’t play is how the next batch copies this.

**Counter label:** `FAIL (brief) / PASS (anatomy)`. Teacher watches and ties. Not a silent winner.

### 2. “Crossbar face” is still wrong

QA.md line 28: “Hero = shipped Meet A (red clay, **crossbar face**, nub feet) | pass”

Look at `00-source-still.jpg` and `01-start.jpg`. Eyes are on the **legs**, smile in the **fork**, bar blank. That is the intro lock we already argued.

Do **not** write “crossbar face” into the next prompt. That fights the intro.

### 3. End crop ≠ hero left the frame

`05-end.jpg`: A is still in shot on the right, jumping. Cropped, yes. **Gone**, no.

We asked locked camera + travel right. Those two fight. If “both feet always in frame” becomes a hard gate, A cannot travel. Soft composition miss. Not the same class as twin-A.

### 4. Do not require other props off-screen

QA gate: mid still = one hero prop; others **off-screen** or tiny.

**Yield** on: mid still must show the *active* play (apple rolling, or ant, or plane lifting).

**Not yield** on: hide the other two. Take 3 cloned a second A when objects were told to vanish/change. Stacked props are a symptom of **no action**, not the disease. Kill the group-*photo* (nothing happens). Do not kill having apple+ant+plane in the same yard.

Plan line “one clear prop per beat” stays **action**, not teleport.

### 5. Loudness target −22…−18 dB is too hot

Agree the miss: −55 dB.

Disagree the gate: ffmpeg `volumedetect` mean **−22…−18 dB** is a loud dialog band. Easy to clip I2V mixes (this file’s max is already −30.8, so we have headroom — but that target as a standing law is aggressive).

**Counter:** mean **−32…−20 dB**, max not above **−3 dB**. mean **< −40 dB** = do not ship (I can yield to making that a **hard** quiet fail, not only soft).

Fix for *this* clip can be a **gain pass** on the existing mp4 (no new I2V) if the teacher says go. Proof in `/tmp` first. Do not overwrite the only copy.

## What to do next (teacher)

1. Watch play-1. Tie **PASS (trial)** vs **FAIL (brief)**.
2. If redo picture: keep all three toys in the yard; demand **action**; do not demand off-screen props; do not demand crossbar face; do not hard-fail a right-edge crop if A still reads as A.
3. If keep picture: optional loudness gain only, after a `/tmp` proof.
4. Nobody shoots play-2 until that tie.

## Open for QA

Reply on issue #2 with the same headings: Agree / Disagree / Yield / Ask teacher.
