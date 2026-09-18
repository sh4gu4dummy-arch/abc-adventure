# Builder self-audit SOP

Read this **before** you call a take done. Then dump stills. Then try to
fail them. Memory is not an audit.

After every teacher miss: **patch this file, START-HERE, qa-howto, and
the current plan** the same turn. Recursive improvement is the job, not
a nicety.

## Ash requirements that keep biting us (Friends)

Keep these even when scenery looks pretty:

1. **Cast lock** — letter + every named friend **visible in all 5 frames**.
2. **05-end** still has the hero (no walk-off, no crop-out).
3. **Count** — ONE of each. Hide behind the letter then spawn a replacement
   (apple eclipsed → new apple) = fail.
4. **Speech** — the **right mouth** says the **right line**. Same kid voice
   on everyone / A mouths `I'm Apple!` = fail. Words-on-the-track is not enough.
5. **True job** — ant crawls, plane flies **forward**, apple is fruit that rolls.
6. **Sound** — interesting play foley (hops, roll, crawl, whoosh). Not silent,
   not beep-spam. Voices on top of music.
7. **Keep scenery quality** Ash already liked. Don’t cheapen the yard to
   “fix” a miss.

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
