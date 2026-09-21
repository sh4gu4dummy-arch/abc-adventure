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

## Play in the scene (Ash v0.384)

A tiny hop-in-place is **not** play. Each 6s beat names **one real action
with the scenery or another friend**:

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
PLACE: [clearing / tracks / shore — name the set].
Wide. Keep four visible: [letter], [f1], [f2], [f3]. Count 1.
ONLY [speaker — color + place] talks. They say: "I'm [Name]!"
Slow USA cartoon kid. One line. Others' mouths sealed.
PLAY: [concrete action with a prop — rolls on the tracks / walks under
the canopy / pads through the grass]. Not hop-at-camera. Not idle bounce.
Sound: that one voice + [matching foley]. No second speaker. No beeps.
Letter stays a LETTER. No morph into a friend.
```


## Metrics

- STT on the **kept Imagine audio** matches the beat’s line
- One name per 6s
- Mouth of the named speaker moves; others don’t (frames)
- Remake count is whatever Ash asked for
