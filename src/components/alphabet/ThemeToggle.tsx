import { useEffect, useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useThemeMode, type ThemePreference } from "@/lib/theme-pref";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: ThemePreference;
  label: string;
  short: string;
  icon: typeof Sun;
  title: string;
}[] = [
  {
    id: "auto",
    label: "Auto",
    short: "Auto",
    icon: Sparkles,
    title: "Match this device’s light or dark setting",
  },
  {
    id: "light",
    label: "Light",
    short: "Day",
    icon: Sun,
    title: "Bright daytime colors",
  },
  {
    id: "dark",
    label: "Dark",
    short: "Night",
    icon: Moon,
    title: "Soft night colors — easier on eyes",
  },
];

/** Light / Dark / Auto theme switcher — saved on this device. */
export function ThemeToggle({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const live = useThemeMode();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const preference: ThemePreference = ready ? live.preference : "auto";
  const resolved = ready ? live.resolved : "light";

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Color theme"
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
            ? `Theme: ${resolved === "dark" ? "Dark" : "Light"}${preference === "auto" ? " · auto" : " · locked"}`
            : "Theme: …"}
        </p>
      )}
    </div>
  );
}
