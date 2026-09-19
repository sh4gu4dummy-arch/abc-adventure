# QA supervisor (meta-QA) — handoff

**Keywords:** QA supervisor, QAsup, meta-QA, top manager, feedback-on-feedback, Ash-direct.

Search this file when you need the **manager-over-QA** protocol, not the pixel playbook (`docs/qa-howto.md`).

---

## Status now (2026-09-19)

- **QAsupervisor is sleeping** (not deleted). Ash may wake or replace one later.
- **Ash is the hard gate and primary contact** for ABC-Adventure-Bot1 (QA).
- **Ash-direct is the default:** send Ash results, asks, and drafts in this chat as he prefers. Still **minimize mid-task spam** unless he asks for live updates.
- If a **QAsupervisor returns:** resume **draft → Round-1 markup → counter → align → ship only on Ash (or Ash→sup) explicit go**. Markup ≠ ship. **Ash’s word still wins.** Do **not** spam Ash’s other chats from a sleeping/returned QAsup path — keep QA noise in the working thread Ash chose. **FYI-to-Builder = hold** until the plan hits the desk (git), not chat-only.
- Ship rule remains: **no git push of QA plans/scripts on QAsup say-so alone** when Ash has not given go for that item — except when Ash already authorized a named handoff (this file).

---

## Protocol snapshot (how we worked)

Loop:

1. QA drafts verdict / plan (in git docs when Builder must act).
2. QAsup Round 1 markup (stern, specific).
3. QA counters or agrees → align.
4. **Ship only on Ash explicit go** (or Ash→sup relay of that go). **Markup ≠ ship.**
5. After ship: status + **who holds the ball**.

Other standing habits from this supervisor era:

- **Stern but flexible.** Quality + creativity over rigid rules. If a rule hurts the product, **flag it to Ash** (or to QAsup when one is awake to escalate). Do not blind-enforce a worse outcome.
- If **blocked on an Ash approval card**, ping Ash **immediately** — do not sit on a silent gate.
- **Git is source of truth for Builder.** Chat alone is not enough; teammate bots cannot read Grok chat. Put findings in `docs/`, audits, issues — commit/push the same turn when ship is allowed.
- **Product-first:** open real assets/data (posters, stills, mp3s) **before** PASS. Do not rubber-stamp cast-name match or prompt text.

Primary playbook for pixel QA: [`docs/qa-howto.md`](qa-howto.md). Coop: [`docs/agent-coop.md`](agent-coop.md). Desk: [issue #1](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1).

---

## Shared lessons this QAsup learned from Ash

- **Friends / Meet look-lock:** product poster side-by-side before PASS; **one** confirmed still path to Ash; inanimate + dialogue ⇒ need a face/mouth; eat-poster remakes: **drop the human eater** + add a **toy face on the food**.
- **Don’t ship without Ash go.** Don’t invent API-credit “fixes” when Ash has **Imagine quota** only (session JWT vs API credits are different doors).
- **Exact Ash quotes → git → trickle up.** Don’t over-distill his words into mush.
- Prefer **trial-first** for new methods; on future shoots **commit videos one-by-one**; research multi-still I2V locks for longer films.

---

## ABC-specific snapshot (this supervisor’s watch)

Achievements / scars worth remembering:

| Item | Lesson |
|---|---|
| **little-a** catastrophic wrong friends / look (sup miss) | Case-specific cast + product gates; glyph-only PASS banned |
| **Anchor** no-face listen fail | Inanimate + dialogue ⇒ face/mouth gate |
| **Big B** still look-lock vs posters fail | I2I from **product** friends SOP (`public/posters/`) |
| Friends remake **cookie / boy** | Drop human eater + toy face on food |
| **Sound lesson A** TTS trial **v0.359** | Cue `The letter A says ah, like apple!` — **listen vehicle, not final phonics lock** (SHA `1374c31549f39c371b227db366057c786d03b0a1`) |
| Imagine auth research | Session JWT ≠ API credits; QA-box needs `XAI_API_KEY` |
| **v0.357** Imagine scripts key-first | Useful tooling; Ash later: **don’t overstep ship without go** (QAsup-alone push is not enough) |

---

## Routing cheat-sheet (2026-09-19+)

| Situation | Who |
|---|---|
| QA results, drafts, asks, blockers | **Ash-direct** (this bot’s chat) |
| Mid-task progress | Quiet unless Ash asks |
| QAsupervisor awake again | Draft → markup → Ash go → ship |
| Builder needs a fix | Git docs + issue board (always) |

When Ash says **lmk** = talk only. When Ash says **start** / **go** / **ship** for a named item = act.
