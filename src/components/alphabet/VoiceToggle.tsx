import { useEffect, useState } from "react";
import { User, UserRound } from "lucide-react";
import { useVoicePref, type VoicePref } from "@/lib/voice-pref";
import { speak, stopSpeech } from "@/lib/speak";
import { cn } from "@/lib/utils";

const OPTIONS: { id: VoicePref; label: string; short: string; icon: typeof User }[] = [
  { id: "female", label: "Teacher", short: "Her", icon: UserRound },
  { id: "male", label: "Buddy", short: "Him", icon: User },
];

/**
 * App-wide warm voice toggle.
 * Teacher = Ava (female). Buddy = warm friendly male (lightly bright, not deep).
 * Switching always hard-stops the previous voice first (no double-talk).
 */
export function VoiceToggle({
  compact,
  className,
  preview = true,
}: {
  compact?: boolean;
  className?: string;
  /** Speak a short sample when changing voice */
  preview?: boolean;
}) {
  const live = useVoicePref();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const voice: VoicePref = ready ? live.voice : "female";

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Voice"
    >
      <div className="inline-flex overflow-hidden rounded-[var(--radius-pill)] border-2 border-border bg-surface p-0.5 shadow-[var(--shadow-card)]">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = voice === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                // Hard-stop any current speech before switching
                stopSpeech();
                live.setVoice(opt.id);
                if (preview) {
                  // Explicit voice override so we never race the store write
                  void speak(
                    opt.id === "male"
                      ? "Hi friend! I am your buddy voice."
                      : "Hi friend! I am your teacher voice.",
                    { voice: opt.id },
                  );
                }
              }}
              className={cn(
                "pressable inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                active ? "bg-ink text-white" : "text-ink-soft hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={
                opt.id === "female"
                  ? "Warm teacher voice"
                  : "Friendly buddy voice (warm male, not deep)"
              }
            >
              <Icon className="size-3.5 sm:size-4" aria-hidden />
              <span>{compact ? opt.short : opt.label}</span>
            </button>
          );
        })}
      </div>
      {!compact && (
        <p className="text-center text-[10px] font-bold uppercase tracking-wide text-muted">
          Voice · {voice === "male" ? "Buddy" : "Teacher"}
        </p>
      )}
    </div>
  );
}
