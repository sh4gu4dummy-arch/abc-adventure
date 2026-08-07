import { useEffect, useState } from "react";
import { Gauge, Sparkles, Zap } from "lucide-react";
import { useGfxMode, type GfxPreference } from "@/lib/gfx-pref";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: GfxPreference;
  label: string;
  short: string;
  icon: typeof Sparkles;
  title: string;
}[] = [
  {
    id: "auto",
    label: "Auto",
    short: "Auto",
    icon: Sparkles,
    title: "Pick High or Lite from this device",
  },
  {
    id: "high",
    label: "High",
    short: "High",
    icon: Gauge,
    title: "Story videos + richer glow",
  },
  {
    id: "lite",
    label: "Lite",
    short: "Lite",
    icon: Zap,
    title: "Sharp posters, faster on phones",
  },
];

/** High / Lite / Auto graphics switcher — saved on this device. */
export function GfxToggle({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const live = useGfxMode();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const preference: GfxPreference = ready ? live.preference : "auto";
  const resolved = ready ? live.resolved : "high";

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Graphics quality"
    >
      <div className="inline-flex overflow-hidden rounded-[var(--radius-pill)] border-2 border-border bg-surface p-0.5 shadow-[var(--shadow-card)]">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = preference === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => live.setPreference(opt.id)}
              className={cn(
                "pressable inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                active
                  ? "bg-primary text-primary-fg"
                  : "text-ink-soft hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={opt.title}
            >
              <Icon className="size-3.5 sm:size-4" aria-hidden />
              <span>{compact ? opt.short : opt.label}</span>
            </button>
          );
        })}
      </div>
      {!compact && (
        <p
          className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted"
          suppressHydrationWarning
        >
          {ready
            ? `Gfx: ${resolved === "high" ? "High" : "Lite"}${
                preference === "auto"
                  ? live.demoted
                    ? " · auto→lite"
                    : " · auto"
                  : " · locked"
              }`
            : "Gfx: …"}
        </p>
      )}
    </div>
  );
}
