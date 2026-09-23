# Friends dialogue

Ash (v0.381): TTS-over-muted **does not** match mouths. Remakes are **Ash’s
call** — do not invent a “never remake names” rule.

## Lip-sync (honest)

Imagine makes **lips and audio in the same pass**. If we mute that audio and
lay TTS on top, the mouth is still saying whatever Imagine invented (Rainbow)
while the ear hears “I'm Big R.” That is a mismatch. Do not ship that as the
default “fix.”

TTS is only a **hearing patch** when Ash says “I just need the right words
and we’ll remake picture later” — or as a temp. It is not lip-sync.

To match mouth + voice we have to **keep Imagine’s audio** on takes where
the line is right.

## What the model needs (when we want native speech)

One talking head, not a 4-way argument:

1. **Speaker** — who, where in the frame (left / the pizza, not “someone”)
2. **Quoted line** — `says "I'm Pizza!"` (not “introduces itself”)
3. **Others** — mouths **sealed shut**, no voice
4. **Play** — true job in the scene, wide enough to keep the other three
5. **Sound** — that one voice + foley, no second talker

Wide four faces still biases speech to the biggest object. If a take sticks
to Rainbow, **tell Ash** and remake if they want — don’t quietly TTS over it
and call it done.

## Remakes

Ash decides. Builder may **recommend** (this take is picture-only vs line
vs both). Do not refuse a remake because of quota. Do not remake all 4 when
one beat is wrong unless Ash says so.

## Pipeline

1. I2V with the **quoted line** for that beat (lip-sync attempt) + play.
2. STT that 6s **before** concat. Keep native audio if the line is right
   and only one name is in the window.
3. If the line is wrong or two talkers: **report to Ash**. Remake that clip
   if they want. TTS-lock is optional and **lips will not match**.
4. Glyph / whale / extra eyes = picture remake (same: Ash can still say go).

## Letter face lock (Ash v0.405)

The **letter’s face** is look-lock, not just the body.

Named miss (little d): `01-start` had round hole + black-dot eyes.
`02-25` grew white sclera, pink cheeks, a new hole. Open mouth is OK.
A **new face** is FAIL.

Named miss (Big U, v0.414): the home tile is a thin even U with black-dot
eyes. The film started from a **different** U — thick square base, white
eyes, pink cheeks. Later clips kept redrawing that face. The square base
was not in the home tile. It was baked into `u-play-4/00-source-still.jpg`
because that still was a new drawing, not an edit of `public/letters/u.webp`.

Before any Friends still:

1. Edit from `public/letters/{letter}.webp` plus the friend posters.
2. Put the home tile beside the still. Stroke, eyes, and base must match.
3. White eyes, pink cheeks, or a fatter base = a different character. Delete
   the still. Do not film it.

Before concat: put clip-1 t0.3 next to clip-2 t3 and next to the home tile.
Same hole, same eyes, same stroke. If they disagree, FAIL even if STT is
right.

If chaining the last frame **already drifted** the letter, do **not**
keep chaining that face. Re-I2V that beat from the **locked still**
(`01-start` / home tile). Wrong face > a small cut.

## Clip-isolate (Ash v0.401)

**Do not I2I a “clean still”** that moves friends. Chain **I2V from the
previous clip’s last frame** as-is.

Named miss (little b, v0.400): I2I “delete extras” **beached the boat
onto the grass**. Clip 2 had the boat **in the pond**. That I2I is a FAIL
even if STT says “I'm Boat.”

Trap: “tiny I2I then I2V” to kill clones. Clones ≠ license to relocate.
If extras appear, I2V again from the **same last frame** — do not invent
a new layout still.

Boat in water stays in water. Bird on a branch stays on the branch.
Grass I2I = FAIL.

## Scatter + zoom (Ash v0.395)

Even spacing is a **speech bug**. A 2×2 grid / four corners / “left pair vs
right pair” makes two mouths on the same side talk together.

For **full remakes** (not clip-isolates):

1. **Scatter** — different depths AND heights. Not a rectangle. Not lined up.
   One on a branch, one on a rock, one far on a hill, letter closer on a path.
2. **Zoom out** — more sky/ground, smaller toys, room between them. Tight
   huddle = chorus.
3. **Don’t pair sides** — no two friends sharing the left half at the same
   size; same for the right.
4. **Surfaces differ** — grass vs wood vs stone vs water so the model can
   name the speaker by *spot*, not by “the left ones.”
5. **Far friend is smaller** (perspective). Biggest face steals the line.
   If one friend (zebra, whale, …) says **every remaining clip**, that still
   is the bug. **Full remake** — do not chain 2–4 off it. Shrink the thief.

Still FAIL if it looks like four toys at the corners of a lawn.

## Speaker lock (Ash v0.394)


STT spelling the right word is **not** a pass if two mouths move.
A **clone of the speaker** (second xylophone, second box) is a second
voice. Count 1 or the line is a lie.

Prompt order (do not skip):

1. **COUNT 1** — name all four, “no second [speaker]”
2. **SPEAKER** — object + spot (`the xylophone on the floor, front-right`)
3. **EXACT LINE** — `says "I'm Xylophone!"`
4. **SEALED** — name the other three; mouths are thin sealed lines; no voice
5. **FORBIDDEN words** — the other three names must not be spoken
6. **Letter does not borrow** the friend’s name (X never says Box)

If that clip’s STT is empty, has two names, or the letter’s name leaked:
reshoot **that clip** before concat.

**Mouth check (Ash v0.414):** STT of one line is not a pass. Open the frame
at the word’s timestamp. If any other mouth is open then, the take is a
fail. “Thin sealed line” was not enough on Big T — the tiger talked under
“I'm Tree.” The prompt that held: **“Freeze its mouth shut for all 6
seconds. No teeth.”** Name the animal. Check that frame before the next clip.

**Homophone (same miss):** “I'm Tree!” was heard as “I'm three.” Say
**“I'm a tree!”** when the name is Tree. Do not ship the number.

## Place first (Ash v0.392)


Spots are **patches inside a real place**, not a replacement for scenery.
Do **not** nuke the world into empty lawn + four toys. Distant trees,
buildings, sky, tracks, water stay. A full-redo that looks like a green
void = fail the still. Adjust each friend’s patch **on top of** the
place.

## Don't wreck the set (Ash v0.388)


- **Do not smash / empty / delete** another friend’s spot. Whale does not
  slap the water away. Water **stays in frame** the whole clip.
- **Gate, not a slogan (Ash v0.416).** The sentence above was already
  written and the whale still emptied the pond. Before concat, open the
  clip’s **first frame and last frame** side by side. The pond, tracks,
  table, or nest from frame 1 must still be there on the last frame, same
  place, not a splash cloud and not bare grass. If the water is gone, the
  take is a fail even when the line is right. Do not chain the next clip
  off a smashed set. Prompt that must be in the whale/water beat: the pond
  stays calm, the whale floats, it does not raise its tail, it does not
  splash the water out.
- Letter **never merges** with a friend (W ≠ water, S ≠ snake).
- **No chorus.** If everyone says the last name (`I'm Window`), that clip
  failed. Only the named speaker talks; others sealed.
- **No extra clones.** A second xylophone or second box mid-clip is a
  fail. Count stays 1 the whole 6s.
- **Clone gate (Ash v0.417).** Big X clip 4 grew a new box in the center
  and let that new box talk. The box already on the right, next to X, was
  the friend. Before keeping the clip, count that object on the **start
  frame** and again on the **speech frame**. If a second one appeared, the
  take is a fail. The speaker is the object already in the start frame,
  named by its spot. Do not chain the next clip off a clone.
- **Clip isolation:** if Ash says 1–2 are OK, remake **only** 3–4 from
  clip-2’s last frame. Do not reshoot the good beats.

## Product friends (Ash v0.387) — stop inventing


Still **must** I2I from the **product posters** for that letter
(`public/posters/u-unicorn.webp`, not a random white horse). If the
unicorn on the still is not the app’s unicorn, **scrap the still**. Same
for every friend. Home tile is the letter glyph.

## Abstract words (Ash v0.387)

**Under, Up, Over, …** are not characters. Do **not** make a talking table
say `"I'm Under!"`.

The **letter** (or an existing friend) **does the action** and says a
real sentence:

- Under → U crawls under the picnic table and says `"I'm under the table!"`
- Not a mascot named Under.

Clip 4 is still one speaker. Table stays a table.

## Spots (Ash v0.386) — stop double-talk


Four friends in one pile of grass share a voice. Give **each one a
personalized patch** so the model can tell them apart:

- **Train** on **tracks**
- **Tiger** in a **yellow grass pile** (not the same green as the lawn)
- **Tree** with **fallen leaves** around the trunk
- Letter on its **own path / patch**

Still: they sit in **corners**, not a huddle. Prompt names **spot +
speaker** (`ONLY the tiger in the yellow grass talks`). Other three stay
in their patches and mouths sealed.

If two names leak (Tiger + Tree both “I'm Tree”), the still was too
crowded — remake the still, don't just yell at I2V.

## Play in the scene (Ash v0.384)

A tiny hop-in-place is **not** play. Each 6s beat names **one real action
with the scenery or another friend**, **inside that friend’s spot**.

- sit in the tree’s shade / rustle leaves
- train **rolls on tracks** (not floating)
- tiger **walks through grass**
- letter **walks along the path**, peeks under, waves at the train

Prompt must say the **prop** (tracks, canopy, grass, path). Camera stays
**wide** so the place is visible. Still should be a *place* (clearing,
tracks, shore), not four toys on empty lawn.

Keep: count 1, glyph = home tile, no morph, one speaker, quoted line.

## Prompt shape (one speaker)

```
PLACE: [clearing] with FOUR SEPARATE SPOTS (not a huddle).
SPOTS: [tree + leaf pile | tiger + yellow grass | train on tracks | letter on path].
Wide. Keep four visible. Count 1.
ONLY [speaker] in [their spot] talks. They say: "I'm [Name]!"
The other three stay in their own spots. Mouths sealed. No second voice.
Slow USA cartoon kid. One line.
PLAY: [action in that spot]. Not hop-at-camera.
Sound: that one voice + [foley]. No beeps.
Letter stays a LETTER.
```



## Metrics

- STT on the **kept Imagine audio** matches the beat’s line
- One name per 6s
- Mouth of the named speaker moves; others don’t (frames)
- Remake count is whatever Ash asked for
