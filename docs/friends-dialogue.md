# Friends dialogue — quota-first

Ash: too many Imagine takes burned on “who said the line.”

## What the model actually is

Grok Imagine video (native audio) is built for **one talking head**:

- named speaker
- **quoted** line (`says "I'm Pizza!"`)
- emotion / pace
- shot size (usually **medium, face in frame**)
- sound bed

Skip a slot and it invents. A **wide shot of four faces** is the failure mode:
speech sticks to the **biggest / center** object (Rainbow, House, Moon, Cake).
Bans in the prompt do not beat that. STT often still hears the *intended* line.

Sources we used: Imagine dialogue needs speaker + quoted line + shot + audio;
lip-sync guides assume a **front-facing single subject**, not a 4-cast wide.

## Quota rule (hard)

Video is expensive (~seconds of Imagine per take). **Do not remake an I2V
because the spoken name was wrong.**

| Fail | Spend Imagine? |
|---|---|
| Wrong / extra / mixed **picture** (glyph, whale, extra eyes) | Yes — **one** retry, then ask Ash |
| Wrong **spoken name**, two talkers, letter says friend | **No.** Mute + TTS |
| Hop-only / boring motion | Ask Ash before a remake |

Default pipeline for **new** Friends clips:

1. I2V prompt = **silent play** (foley + true job). **No dialogue. No quoted names.**
2. Concat pictures.
3. `python3 scripts/friends-lock-lines.py FILE --letter X --friends A B C`  
   Imagine audio **muted**; TTS one line per 6s.
4. `friends-stt-check.py` — must be those four names, one per beat.

## Silent I2V prompt (copy)

```
Wide shot. Keep EXACTLY these four visible, count 1 each: [letter], [f1], [f2], [f3].
PLAY: [true job in the scene — crawl / splash / waddle / sit]. Not hop-at-camera.
NO SPEECH. Nobody talks. No words. No "I'm …". Mouths closed or a tiny frozen smile.
Sound: [foley only]. No voices. No beeps. No extra characters.
```

Do **not** put the line in the Imagine prompt. That is what caused Rainbow/Moon/House.

## If we ever need native lip-sync (don't, unless Ash asks)

Then it is a **separate medium shot of ONE speaker**, quoted line, others not
in close-up. That is a new take + join risk. It is not the default. Do not
spend 4 talking-head takes to replace TTS.

## Metrics that count

- Imagine takes per letter (target: **4 silent clips, 0 speech remakes**)
- STT after TTS: exactly the 4 lines
- Visual audit: glyph = home tile, no morph, count=1

Metrics that **don't** count: “prompt said only X talks.”
