import { MessageSquareText, Film } from "lucide-react";
import { useLessonSound, type LessonSound } from "@/lib/lesson-sound";
import { stopSpeech } from "@/lib/speak";
import { cn } from "@/lib/utils";

const OPTIONS: { id: LessonSound; label: string; short: string; icon: typeof Film }[] = [
  { id: "narration", label: "Narration", short: "Voice", icon: MessageSquareText },
  { id: "clip", label: "Video sound", short: "Video", icon: Film },
];

export function LessonSoundToggle({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const live = useLessonSound();

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Story sound"
    >
      <div className="inline-flex overflow-hidden rounded-[var(--radius-pill)] border-2 border-border bg-surface p-0.5 shadow-[var(--shadow-card)]">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = live.mode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                stopSpeech();
                live.setMode(opt.id);
              }}
              className={cn(
                "pressable inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                active ? "bg-ink text-white" : "text-ink-soft hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={
                opt.id === "narration"
                  ? "Teacher or buddy says the word"
                  : "Play the video's own sound"
              }
            >
              <Icon className="size-3.5 sm:size-4" aria-hidden />
              <span>{compact ? opt.short : opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
