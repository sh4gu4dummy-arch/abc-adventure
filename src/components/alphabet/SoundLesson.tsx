import { useRef, useState } from "react";
import { Check, Volume2 } from "lucide-react";
import type { LetterEntry } from "@/data/alphabet";
import { posterPath, wordBuddyPath } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak, speakWord } from "@/lib/speak";
import { cn } from "@/lib/utils";

type StepId = "name" | "sound" | "word";

/**
 * Hear the name, the sound, then a sample word.
 * All three heard → sound section completes (no self-check).
 */
export function SoundLesson({ entry }: { entry: LetterEntry }) {
  const [heard, setHeard] = useState<Record<StepId, boolean>>({
    name: false,
    sound: false,
    word: false,
  });
  const heardRef = useRef(heard);
  heardRef.current = heard;
  const [playing, setPlaying] = useState<StepId | null>(null);
  const finished = useRef(false);
  const sample = entry.words[0]!;

  const allHeard = heard.name && heard.sound && heard.word;

  async function play(id: StepId) {
    if (playing) return;
    setPlaying(id);
    if (id === "name") {
      await speak(`The letter ${entry.letter}`);
    } else if (id === "sound") {
      await speak(entry.soundCue);
    } else {
      await speakWord(sample.word);
    }
    const next = { ...heardRef.current, [id]: true };
    heardRef.current = next;
    setHeard(next);
    setPlaying(null);
    if (next.name && next.sound && next.word && !finished.current) {
      finished.current = true;
      markSection(entry.letter, "sound");
      void speak(entry.rhyme);
    }
  }

  const steps: { id: StepId; title: string; hint: string }[] = [
    { id: "name", title: "Letter name", hint: `This is ${entry.letter}` },
    { id: "sound", title: "Letter sound", hint: entry.sound },
    { id: "word", title: "A word", hint: "Listen, then look" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">Letter sound</h2>
        <p className="mt-1 text-sm font-semibold text-ink-soft">
          Tap each one and listen. After all three, you’re done — no extra button.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {steps.map((s) => {
          const ok = heard[s.id];
          const isWord = s.id === "word";
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => void play(s.id)}
              disabled={playing !== null}
              className={cn(
                "pressable flex min-h-24 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] border-2 p-3 text-center",
                ok ? "border-success bg-success/10" : "border-border bg-surface",
              )}
            >
              {isWord ? (
                <img
                  src={posterPath(entry.letter, sample.slug)}
                  alt=""
                  className="mb-1 size-14 rounded-xl object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = wordBuddyPath(
                      entry.letter,
                      sample.slug,
                    );
                  }}
                />
              ) : (
                <span
                  className="font-display text-3xl font-black leading-none"
                  style={{ color: entry.accent }}
                >
                  {s.id === "name" ? entry.letter : entry.letter.toLowerCase()}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-sm font-bold text-ink">
                {ok ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Volume2 className="size-4" />
                )}
                {s.title}
              </span>
              <span className="text-[11px] font-semibold text-muted">{s.hint}</span>
            </button>
          );
        })}
      </div>

      {allHeard && (
        <p className="rounded-[var(--radius-lg)] bg-surface-soft p-3 text-sm font-bold text-ink">
          {entry.rhyme}
        </p>
      )}
    </div>
  );
}
