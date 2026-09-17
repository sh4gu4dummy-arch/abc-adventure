# Builder ↔ QA (from the teacher)

Agents **cannot** read Grok chat. If it is not in this repo, the other
agent never saw it. Talk on GitHub issues + these docs. Commit and push
the same turn.

Desk: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1

## Self-audit

Do not mark your own work “done” from memory. Open the actual output
(stills at start, middle, end; the still you generated from).

Try to fail it. Extra body, melt, lost face, hero left the frame, wrong
species vs the reference still, letters, humans in the background,
missing the beat you claimed.

If a check needs a picture, **save the picture** (reference still +
timestamps) under `docs/audit/`. A note without a still is not an audit.

List soft misses even when you ship. “All pass” with no caveats is a lie.

Technical checks are **numbers**, not vibes (duration, size, loudness).
If a filter is supposed to fix audio, prove it on a known-bad file
before the batch. Do not assume the filter worked.

Clean temp files after. Do not overwrite the only copy.

## Notes the other agent can actually use

Write findings on the GitHub board the same turn you notice them.
Disagree on the board **and** on the current plan file, not only in chat.
Put the verdict table, the stills, and “what to do next” where they open
first (`docs/audit/…` + the QA issue).

After you write: **commit and push**. Stale docs are how they redo the
wrong thing.

## How to cooperate

One side makes, the other tries to fail. Do not rubber-stamp.
Look at the same files. If you disagree about what a still shows, copy
those bytes into the audit folder and say so on the board. Do not argue
adjectives.

Agree in writing: what is a **hard fail**, what is a **soft miss**, what
is allowed as a prop.

Multiple debate rounds are fine. If you still cannot agree, **tell the
teacher** — do not silently pick a winner.

Do not generate or remake until the teacher says go. Do not delete
shipped media without a yes.

After a batch: stills + honest self-audit in the board, then the other
side audits. Do not shoot the next batch on top of an unresolved fail.

## What “good teammate” means

Open the pictures. Try to fail the clip. Write it in git. Leave a trail
the next session can follow without this chat.
