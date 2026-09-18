# Builder self-audit SOP

Read this **before** you call a take done. Then dump stills. Then try to
fail them. Memory is not an audit.

After every teacher miss: **patch this file, START-HERE, qa-howto, and
the current plan** the same turn. Recursive improvement is the job, not
a nicety.

## Ash requirements that keep biting us (Friends)

Keep these even when scenery looks pretty:

1. **Cast lock** — letter + every named friend **identifiable** in all 5 frames
   (silhouette / majority-visible OK). Complete cover = fail. Not the same as
   “zero overlap.”
2. **05-end** still has the hero (no walk-off, no crop-out).
3. **Count** — ONE of each. Hide behind the letter then spawn a replacement
   (apple eclipsed → new apple) = fail. Count letter/apple/ant/plane in **every** still.
4. **Flying friend** — if a plane (etc.) flies, **majority stays in 480×720**
   (not only a tip exiting the frame).
5. **Speech** — the **right mouth** says the **right line**. Same kid voice
   on everyone / letter mouths `I'm Apple!` = fail. Words-on-the-track is not enough.
6. **True job** — ant crawls, plane flies **forward**, apple is fruit that rolls.
   Apple: tiny toy smile OK; **no feet / legs / arms**.
7. **Sound** — interesting play foley (hops, roll, crawl, whoosh). Not silent,
   not beep-spam. Voices on top of music (bury-speech = fail).
8. **Keep scenery quality** Ash already liked. Don’t cheapen the yard to
   “fix” a miss.

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

Do not overwrite the only copy. Do not claim PASS because QA hasn’t
replied yet.

## After teacher / QA speaks

Their words go in the plan **quoted**. Then a one-line gate. Then push.
Next take must be able to catch that miss from docs alone.
