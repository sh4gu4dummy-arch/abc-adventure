# ABC Adventure — project rules (user taste)

Read this every turn before making word videos, posters, or sentences.
When the user corrects a clip, **add the lesson here** (and in
`src/data/word-lessons.ts` RULES) in the same change. Do not only remember it
in chat.

## Chat: “lmk”

If they say **lmk** (let me know): **answer in chat only**. Do not edit,
remake, commit, or ship until they ask. Info, not action.

## Chat: pick before ship

If you generate **2+ options** (stills, Meet clips, posters, anything
visual): **show them and ask which to keep**. Do not pick a winner and
ship it. Wait for their pick. Same if two takes look usable.

After every GitHub push, **tell them the version** in chat (v0.112, etc.).

## GitHub: always push

Every product change this turn: **commit and `git push origin main`**. Do
not leave ABC updates only in the sandbox. Do not ask. Same as before, but
**all** app updates, not “when we remember.” Version in the chat after.

**Never** commit or push Grok sandbox internals. Not `.grok/`, not
`attachments/`, not `__pycache__`, not `.project_id`, not platform
`AGENTS.md` / skill dumps, not preview-host-bridge scaffolding unless it
is real ABC app code. GitHub is the kids app only.
**Trace:** must cover the **whole letter**, not one stroke (K spine ≠ done).
Do not drop the cover bar back to ~26%. Spatial cells + ~50% of the glyph.

## Trace rewrite plan (remind on ask)

If they ask for the tracing plan, **remind them of this — don’t start
building unless they say to**. Saved 2026-09-10.

Why it keeps failing: we swing between a picky stroke-grader and “paint N%
of pixels.” Pixel % lies (K’s spine is a huge share of the ink).

- **A (recommended):** numbered workbook strokes. Dotted letter, 1–2–3.
  Done when each stroke gets a pass. Snap-fill is the reward. Capitals
  first; lowercase later.
- **B:** keep coloring, but check letter *parts* (K = spine + upper leg +
  lower leg). I = one stick. O = around the ring.
- **C:** tiny gate — ink must exist on both sides (or top and bottom).
  Would have caught spine-only K. Won’t catch every cheat.

Do **not** retune the % again (26 vs 80 vs 50). Each **guide stroke** must
be inked (v0.199) — Q is not done from the O, K not from the spine.
Letter **names** use USA pronunciation. H is **aitch** (AY-ch), never haitch / hey-ch.
Hyphenated words (Yo-yo): use `sayWord` so TTS is not “yo-oh”.
Meet little **a** says **A** (rhymes with day/hay). Never **I/eye** or **why**.
Meet I2V spoken line is only **“little X”** (or **“Big X”**). Never paste
phonetic spellings (ELL, AY, KAY, CUE) or sound-cues (“says lll like lion”)
into the prompt as dialogue — the model reads them out (lell, yay, why).
Meet little **l** has a small tail curling **right** at the bottom.
**A** still: the triangle hole is the **same color as the background** (opaque,
not transparent — transparent reads as a black hole). Never scanline-fill
across the glyph (that painted a scribble on the face). No extra black ovals
on the inner rim. Mouth on the crossbar.
Meet clips from **J onward**: the letter says **“Hi I’m Big J, Big J, Big J”**
(that letter). Slow: **“Big… A… Big… A…”**. Still missing that Big line: **B C D E F G H I**.
Meet letters are **the glyph only** — no extra arms, legs, or stubs. q has **one**
tail on the right, nothing growing off the left of the bowl.

## Lowercase / small-letter plan (remind on ask)

If they ask for the lowercase plan, **remind them of this — don’t start
building unless they say to**. Saved 2026-09-10. **Started v0.131:** home
Big/little toggle, 3+3 word split, trace follows the mode. Meet little
**a** trial (v0.137). Rest of Meet little later.
**v0.139:** Big ABC = all UI uppercase; little abc = all UI lowercase.
**v0.174:** little abc uses **Fredoka** (same as Big, lowercase glyphs). Round
single-story a, not Comic Neue (too thin/tall) and not Sniglet ExtraBold.

- **Default:** one **Big / little toggle for the whole letter page**, not a
  new switch on every tab. Home stays 26 uppercase tiles. Optional later: a
  global “show little” that swaps the tile glyph (`a` not `A`) — still 26,
  not 52.
- **Don’t** put both mascots in the same Meet clip. Don’t 52-tile home.
- **Meet:** little is a **second clip**, same recipe: “Hi I’m little a,
  little a, little a.” Don’t morph the Big clip. Don’t overlay two voices.
- **Trace:** already has Big / little. Wire it to the **page** toggle so
  Trace and Meet stay in sync. Either case still counts as traced.
- **Words / videos:** stay as they are (pizza is pizza). Optional later: a
  tiny `P p` chip, not a second word-video set.
- **Ship order:** prototype **little a / b / c** Meet + the page toggle.
  Don’t dump 26 little Meets. Same as Big: a few, they watch, then more.

## Video QA plan (remind on ask)

If they ask for the video QA / quality plan, **remind them of this**. Saved
2026-09-17 after A-story scene 2 flew the plane backward. Broadened the
same day: not motion-only — **think**.

**Bar:** cartoon is fine (talking letters, waving alligators). **Stupid is
not.** If a grown-up or a kid would immediately go “that’s dumb,” do not
ship. Pause and ask: is this *logical* in this cartoon world?

Do not ship a clip that fails any of these. Not “looks mostly ok.”

0. **QA the prompt before you generate.** The 5-frame dump is audit #2.
   Audit #1 is the prompt. Write the *bans that match this beat* into
   Imagine: count (“ONE key”), place (“in the paw, not in a mouth”),
   extras (“never a second key on a knob”). Read it back. If the last
   failure mode isn’t named, don’t generate. Don’t hope the model infers
   “lost” or “hold.”
   I2V prompt = **motion + camera + sound + bans**. Do not re-describe
   the still (that drifts the subject). One action. Locked camera unless
   the shot needs a move. Mouths may move; only ban *eating the prop*.
1. **Dump 5 frames** (start / 25 / mid / 75 / end) and **look at all five**.
   Thumbnail-only QA is how reverse motion ships.
2. **Motion vs prompt.** If it should fly/walk/roll one way, compare start
   vs end. Backward, moonwalk, or a snap-reverse at the end = redo. Plane
   going left-to-right must still face and travel that way in the last
   frames.
3. **Logic / realism pass** (the one they keep having to ask for). Think
   before ship, don’t wait for them:
   - Direction and physics in-world: planes don’t fly backward; horses
     don’t run in place; mouths stay on the body; holes are holes.
   - The thing is the thing: a sun has rays, a volcano is a cone, a Q has
     a tail, an x-ray is not a bedroom skeleton of a teddy.
   - Scale and place: props kid-sized; actions happen where they belong.
   - One of each limb. Face on the front only. No extra crayon tips, extra
     legs, faces on food a kid then eats. Peeling/opening a thing does
     **not** clone it (one banana stays one banana).
   Glaring and obvious only — not nitpicks. **You** catch it. Shipping
   junk for them to find is the failure.
4. **Sound.** Prompt Imagine for a **full diegetic mix as if there will be
   no narration**: engines, splashes, animal noises, wind — whatever that
   scene would actually sound like. Do not skimp because a voiceover exists.
   Do **not** overlay random beeps/pings/UI blips after the fact. Narration
   mode mutes the clip; Video-sound mode plays this native mix.
5. **New story/word clips** go in a folder the preview actually serves
   (`public/story-clips/`, not a *new* file under ignored `public/videos/`).

## Story lines (remind on ask)

**Continuity is a plot, not a mascot.** Same character doing three jobs is
not a story. One thing carries through (the egg, the guitar, the ice
cream, the juice). Beat 2 is a problem/turn; beat 3 is the payoff.
Characters act. Objects don’t zip/pour/sit themselves.

**Chain the clips.** Beat 2’s first frame **is** beat 1’s last frame.
Beat 3 starts from beat 2’s last frame. Same character model, same
room/props, same through-line object. Extract the last frame, then
I2V (or a tiny I2I then I2V) from that still — don’t generate three
unrelated hero stills. If I2V clones extra animals/objects mid-clip,
**redo**. Do not ship a 3-second trim as the story beat.

**Lost means gone.** If a kitten “lost a key,” the key is not sitting
in front of its face. It slides out of reach (under a cabinet). Animals
**hold** the through-line object — they do not eat it. One object: if
the key is in the lock, there is not a second key hanging off the door.
Do **not** freeze every mouth shut. Closed-mouth is only for “don’t eat
the prop.” Licking, talking, surprise still need a mouth that moves.

Look at all 5 QA frames and ask those questions out loud. Shipping the
K clip where the kangaroo ate the key was the failure.

Three beats. One verb each. A story that **follows**, not a word dump
and not a slogan last line. Toddler-safe (no smash, no scary). Logical
(no flying cars).

**Two letter-words when it’s obvious.** If a second same-letter word
fits the beat without stretching, use it (elf found an **egg**; fish
splashed near the **fairy**). Don’t force leftovers (no firetruck in a
pond story).

## Word videos

1. Sentence = what is on screen. Write sentence + clip together. Approve
   new letter sentences with the user before filming.
2. If it still sounds like a kid, pack that letter’s sound **2–3 times**.
   Never tongue-twister. Prefer a named subject (a boy, a kid, Ben, the
   puppy) over lazy “they + singular body part.” Body parts as *words* are
   fine. “They blink their eye” is not.
3. Thumbnail = **frame 1** of the video (not the payoff).
4. Action keeps going through the spoken line. Autoplay on open. Prev/next
   arrows stay on that letter’s words.
5. Kid language: “plays” not “strums”; no “sits / rests / waits / is ready”
   unless that is really the clip. No office words (envelope → elbow).
6. **Snappy, not creepy.** Fast cartoon beats. Frog = ninja tongue, insta
   eat — not slow chewing. Hatch = closed egg, then poke, then chick out.
7. Anatomy stays real for that animal: fish fins are fins, not hands.
   Clouds are puffs, not tails. No movie-lookalikes (no McQueen car).
   One of each limb — one tail, two arms, two legs. Extra ends = redo.
   Letter-buddy eyes sit ON the letter body, not in a hole or gap.
   Letter-buddy has a **mouth** (eyes + smile). Face is complete in
   **frame 1** — do not fade the eyes in later.
   Letter-buddy face is on the **front only**. A turn shows a blank back —
   never a second face. Letter-buddy **matches the home-tile color** — don’t
   recolor (home B is blue, not orange). Holes in the letter are empty holes
   — not extra eyes. The letter **must read as that letter** even in a small
   square crop (K is two open legs, never an R-bowl).
   Letter-buddy stills must **fill the tile like the neighbors**: letter-color
   wash to the edges, character large. Never a small figure on white/gray
   studio. After any remake, compare fill vs D/H before shipping. Do not
   wait for the user to catch a thumbnail mismatch.
8. Food is food. Do not put a face on something a kid then eats.
9. Friendly, not scary: dinosaurs smile, no snarl/teeth; fires stay small.
10. **Don’t repeat the same action across word videos.** Each clip needs its
    own gag. Check the whole alphabet, not just the current letter.
    An object stays that object for the whole clip — never morph into a
    person. Check every frame, not just the thumbnail.
    Handheld props stay kid-scale: smaller than the child's head, not
    giant objects that dwarf them.
11. **Word-video sound:** Settings / lesson toggle **Narration** vs
    **Video sound**. Narration = overlay TTS only (clip muted). Video
    sound = MP4 audio only (no overlay). Never mix both. Mouth motion is OK.
    **Always generate remakes WITH sound** (I2V foley / ambient / cartoon
    SFX) so Video sound has something to play. Do not strip with ffmpeg
    `-an`. Do not bake the teacher voice or a song into the file.
    Meet buddy remakes: **one voice** — the letter's. Do not stack extra TTS
    on top of the clip's speech.
    Set `nativeAudio: true` on remakes so the generic music bed stays off.
    Old silent clips keep the bed until remade — don't batch-remake.
    Prompt for diegetic sound (whoosh, splash, footsteps, animal noise)
    and no speech. State-change gags are one-way: peel stays off, wrapper
    stays off, lamp stays lit. No ping-pong reverse.
    **Locomotion must travel:** the body changes place in the frame. No
    treadmill / running-in-place cycles. Travel clips do not loop.
    **Video resolution going forward: 480p.** Generate I2V at 480p. Encode
    word clips 540×720. Do not generate 720p/1080p unless they ask. Do not
    batch-reencode old clips.
12. Archive old art; never overwrite originals. Use Imagine API download
    into `public/` (locker may fail). Copy stills into the repo immediately.
    **Videos are not in git.** They live on disk (`public/videos`) and in
    the user's backup. Do not `git add` `*.mp4`. Do not rewrite history
    to put them back. Restore from the user's backup if a file is missing.
    Stills for the Settings art page can stay in git.
13. **GitHub:** after every commit, **push origin main**. Do not ask. Do
    not leave app updates uncommitted. Tell them the version after.
    **Never** push Grok sandbox internals (`.grok/`, attachments, skill
    dumps, platform AGENTS). Kids app only.
14. **Ship QA — every remake, before replacing `public/videos`.** Look at
    the clip, not just the thumbnail (dump start / mid / end with
    `python3 scripts/qa-word-frames.py VIDEO.mp4`). If anything is
    **obviously wrong** — broken object, extra animal, nonsense anatomy,
    gag that doesn't match the sentence — redo. Do not invent a new
    hyper-specific law from one miss.

## How to write rules

Keep them **general**. Do not turn one incident into a hyper-specific law
(“two animals both eating leaves”). The lesson is “don’t reuse the gag,”
not the leaves.

## When they correct a video

- Fix that clip.
- Write a **general** one-line rule here (not a play-by-play of that one clip).
- Bump version + git commit.
