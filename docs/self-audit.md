# Builder self-audit SOP

Read this **before** you call a take done. Then dump stills. Then try to
fail them. Memory is not an audit.

After every teacher miss: **patch this file, START-HERE, qa-howto, and
the current plan** the same turn. Recursive improvement is the job, not
a nicety.


## Friends cast = case-specific (standing)

You are the **grown-up on the product**. QA does not know it like you.
Ash does not exist to catch “wrong letter” or “same friends as Big.”
That class of miss is **negligence**, not a QA gap.

Before any Friends **plan LOCK** (and again before I2V):

1. Paste/verify **Meet path** for that case (`…/a.mp4` vs `…/a-little.mp4`).
2. Paste/verify **word trio** from product: `wordsForCase` / `alphabet.ts`
   (first 3 = Big, last 3 = little). Example A: Big = apple/ant/airplane;
   little = alligator/astronaut/anchor.
3. Big and little **never share the same three friends**.
5. **Talking mouth on the source still.** If a friend will say a line, it
   has a toy mouth **before** I2V. Blank anchor/ball/boat = process FAIL.
   That miss is obvious; Ash should not catch it on listen.
6. **Color lock.** Compare letter paint 01 vs 05. Darker / muddier = fail.

## Ash requirements that keep biting us (Friends)

Keep these even when scenery looks pretty:

1. **Cast lock** — letter + every named friend **identifiable** in all 5 frames
   (silhouette / majority-visible OK). Complete cover = fail. Not the same as
   “zero overlap.”
2. **05-end** still has the hero (no walk-off, no crop-out).
3. **Count** — ONE of each. Hide behind the letter then spawn a replacement
   (apple eclipsed → new apple) = fail. Count the **named friends for this case** (and the letter) in **every** still — e.g. little a: a/alligator/astronaut/anchor; Big A: A/apple/ant/airplane.
4. **Flying friend** — if a plane (etc.) flies, **majority stays in 480×720**
   (not only a tip exiting the frame).
5. **Speech** — the **right mouth** says the **right line**. Same kid voice
   on everyone / letter mouths `I'm Apple!` = fail. Words-on-the-track is not enough.
6. **True job** — each friend does its real job (see the round plan table).
   Toy smiles OK; no human bodies on props unless the plan allows.
7. **Sound** — interesting play foley (hops, roll, crawl, whoosh). Not silent,
   not beep-spam. Voices on top of music (bury-speech = fail).
9. **Look lock** — still + every frame must match the **Meet intro** of that
   case (Meet little a, not a lumpy cousin, not the home tile).
10. **Big Friends ≠ little Friends.** Do not copy the other case’s three
    words. A: Big = apple/ant/airplane; little = alligator/astronaut/anchor.

### Method B (multi-clip concat)

- **Source still** must pass cast lock + count==1 **before** any I2V (Ash OK).
- **Each clip’s 05-end** must pass cast + count==1 **before** you chain the
  next I2V or concat. Broken end → re-shoot that clip (frame-lock poison).

Little letters: half stature, single-story **a**, match Meet intro not the
home tile.

## Procedure (every take)

1. `python3 scripts/qa-word-frames.py VIDEO.mp4` → `docs/audit/<id>/`
2. Open **all five**. Count heroes and props **in each**.
3. Probe duration, 480×720, `volumedetect`.
4. **Listen** (or say you could not). Attribution is a listen gate.
5. Write `docs/audit/<id>/README.md`: hard fails, softs, numbers.
   “All pass” with no caveats is a process fail.
6. Post the same on the GitHub issue (stills in git, not only chat).
7. If you found a new miss: add a **general** gate to START-HERE + this
   file + qa-howto. Do not invent a one-off law from one pixel.

8. **HTTP 200** on the URL the app will request (from this sandbox):
   `curl -sI --max-time 5 http://127.0.0.1:8080/<path>`. SPA HTML 404 =
   file is on disk but **not served**. Move it to `public/friends-clips/`
   or `public/story-clips/`. Do **not** restart vite. Do **not** tell the
   teacher it plays.

Encode: concat four 6s → ~24s, 480×720, AAC. Friends files:
`public/friends-clips/` (not `public/videos/`).

Do not overwrite the only copy. Do not claim PASS because QA hasn’t
replied yet.

## After teacher / QA speaks

Their words go in the plan **quoted**. Then a one-line gate. Then push.
Next take must be able to catch that miss from docs alone.
