import { Volume2 } from "lucide-react";
import { useLessonSound, type LessonSound } from "@/lib/lesson-sound";
import { stopSpeech } from "@/lib/speak";
import { cn } from "@/lib/utils";

const OPTIONS: { id: LessonSound; label: string; short: string }[] = [
  { id: "narration", label: "Narration", short: "Voice" },
  { id: "clip", label: "Video sound", short: "Video" },
];

export function LessonSoundToggle({
  compact,
  className,
  onMode,
}: {
  compact?: boolean;
  className?: string;
  onMode?: (mode: LessonSound) => void;
}) {
  const live = useLessonSound();

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="group"
      aria-label="Story sound"
    >
      <Volume2 className="size-4 shrink-0 text-ink-soft" aria-hidden />
      <div className="inline-flex overflow-hidden rounded-[var(--radius-pill)] border-2 border-border bg-surface p-0.5 shadow-[var(--shadow-card)]">
        {OPTIONS.map((opt) => {
          const active = live.mode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                if (opt.id === "clip") stopSpeech();
                live.setMode(opt.id);
                onMode?.(opt.id);
              }}
              className={cn(
                "pressable inline-flex min-h-10 items-center justify-center rounded-[var(--radius-pill)] px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                active ? "bg-on-light text-white" : "text-ink hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={
                opt.id === "narration"
                  ? "Teacher or buddy says the word"
                  : "Play the video's own sound"
              }
            >
              {compact ? opt.short : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
