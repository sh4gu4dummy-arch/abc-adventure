# Builder self-audit SOP

Read this **before** you call a take done. Then dump stills. Then try to
fail them. Memory is not an audit.

After every teacher miss: **patch this file, START-HERE, qa-howto, and
the current plan** the same turn. Recursive improvement is the job, not
a nicety.


## Friends cast = case-specific (standing)

## Friends still procedure (every letter)

**Eat posters → Friends:** If the word card shows a human eating face-blank food,
I2I **drops the human** and **adds a toy smile** on the food. Blank food + line = FAIL still.
Oven-mitt arms / cookie eater = product-scene only, not Friends cast.


**Quality + creativity > rigid rule (all projects):** if a gate forces worse product, flag QAsupervisor instead of blind enforce. Not ABC-only. Still hard: wrong trio, blank talkers, cookie-eater bleed, kid rings.

**Standing ban — kids audience / person-word flexibility:** no ring of kids /
classroom audience on Friends stills, and no cookie-eater bleed into Friends.
**King / Queen / Question** (and similar person-words) may use a **stylized
person / crown figure** when natural and readable; do not force weird toy-only
treatment. Still FAIL a random kid as stand-in, dual-letter mess, blank talkers,
wrong trio, or eat-poster humans as Friends cast.

**Real-language signs (soft):** prefer no English shop/street signs on Friends
stills (Ash cinema). Soft only — do not FAIL King for “KIM'S KITCHEN”; flag soft.



Do this **before** I2V. Skipping it is how we shipped a random orange ball.

1. Trio = `wordsForCase` (Big first-3 / little last-3).
2. Glyph of record = **home tile** `public/letters/{l}.webp` (or `-little`) — **hard**.
   Then Meet 01 of this case. **If Meet ≠ home tile, remake Meet first.**
   Friends I2I locks **home** when Meet drifted — do not I2I from a stale Meet
   (fat-U / lump-Z / hole-Q came back that way).
   Then the **three product posters**
   `public/posters/{l}-{slug}.webp` (or `posters-scene/` if that is the word
   card — document which set).
3. Make a ref board (Meet + 3 posters) if you need more than 3 image inputs.
4. **I2I / reference-edit** from those files. Prompt: same characters as the
   refs, wide shot, air between, toy mouths if they talk.
5. Side-by-side vs posters. Fail if the ball/bear/etc. is a generic cousin
   (orange ball vs product ball = fail).
5b. Paste Meet/letter + each poster path in the audit README / STILL-QA.
   No paths pasted = you did not still-QA.
8. **Place, not a default lawn.** Vary the set (water, street, table, sky).
   Empty grass every letter = lazy.
9. **One still in chat.** Repo markdown links are blocked for Ash. The
   generated image in the thread + a plain git path.

**Stills before I2V.** Glyph + friend look lock + mouths + count. Film
cannot fix a wrong toy.

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
   **Same-letter names** (Ball / Bear / Butterfly) swap lines. Ban the other
   names in the prompt. **Listen every clip before concat.** Frame stills cannot catch a wrong name.

6. **True job + play** — each friend does its real job **in the scene**
   (crawl, fly, splash, roll, sniff, sit in the nest). Not only hop toward
   the camera and talk. Wide shot so the environment is used. Hop-at-camera
   as the *only* action = weak; don't ship that as the plan for new clips.
   Toy smiles OK; no human bodies on props unless the plan allows.
7. **Sound** — interesting play foley (hops, roll, crawl, whoosh). Not silent,
   not beep-spam. Voices on top of music (bury-speech = fail).
8. **Ocean / water friends** — stay water. Becoming a whale/fish/animal = fail that clip.
9. **Helmet / clear-face props** — photoreal kid face through a clear helmet = fail the still (toy face / opaque visor).
10. **Look lock** — still + every frame must match the **home tile**
   `public/letters/{l}.webp` (then Meet of that case). Color, eyes, hole.
   **Killed:** fat-base U, lump Z, hole-less Q, **orange big-eye Q**.
   Q home = purple, black-dot eyes, hole. Orange Q still = FAIL, don't I2V.
11. **Big Friends ≠ little Friends.** Do not copy the other case’s three
    words. A: Big = apple/ant/airplane; little = alligator/astronaut/anchor.

### Method B (multi-clip concat)

- **Source still** must pass cast lock + count==1 **before** any I2V (Ash OK).
- **Each clip’s 05-end** must pass cast + count==1 **before** you chain the
  next I2V or concat. Broken end → re-shoot that clip (frame-lock poison).
- **Remake scope (hard):** pin clip number + speaker + line. Remake **that
  clip only** unless Ash says otherwise or the next join actually jumps.
  Do not remake clips whose lines Ash said are fine. See `docs/remake-scope.md`.

Little letters: half stature, single-story **a**, match Meet intro not the
home tile.


## Standing gates — Friends listen / cast / boat (v0.340)

- **Listen attribution:** speaking mouth matches the line. Same-voice-all = **FAIL**.
  Same-letter names (Bear vs Butterfly) = extra listen. Wrong name = FAIL even if the right mouth moves.

- **Cast count every end frame** (butterfly/duck clones = FAIL).
- **Inanimate product-shape lock** through the whole clip (boat must stay sailboat).

## Procedure (every take)

1. `python3 scripts/qa-word-frames.py VIDEO.mp4` → `docs/audit/<id>/`
2. Open **all five**. Count heroes and props **in each**.
3. Probe duration, 480×720, `volumedetect`.
4. **Listen with STT** before replacing a Friends mp4:
   First lock clip 1: `python3 scripts/friends-lock-letter-line.py FILE --letter X`
   Then `python3 scripts/friends-stt-check.py FILE --letter X --friends A B C`
   `"ok": false` = do not ship. Clip 1 saying a friend name = remake or re-lock clip 1.
   Frames cannot catch a wrong spoken name. Do not trust Imagine for the letter line.
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
