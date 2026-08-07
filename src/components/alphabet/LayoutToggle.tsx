import { useEffect, useState } from "react";
import { Monitor, Smartphone, Sparkles } from "lucide-react";
import {
  useLayoutMode,
  type LayoutPreference,
} from "@/lib/layout-mode";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: LayoutPreference;
  label: string;
  short: string;
  icon: typeof Monitor;
}[] = [
  { id: "auto", label: "Auto", short: "Auto", icon: Sparkles },
  { id: "phone", label: "Phone", short: "Phone", icon: Smartphone },
  { id: "desktop", label: "Desktop", short: "Desk", icon: Monitor },
];

/**
 * Phone / Desktop / Auto layout switcher.
 * Saved on this device; Auto follows screen width.
 * Defers reading localStorage until after mount to avoid SSR hydration mismatch.
 */
export function LayoutToggle({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const live = useLayoutMode();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // SSR + first client paint: stable defaults (matches server HTML)
  const preference: LayoutPreference = ready ? live.preference : "auto";
  const resolved = ready ? live.resolved : "phone";

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Layout mode"
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
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={
                opt.id === "auto"
                  ? "Follow screen size"
                  : opt.id === "phone"
                    ? "Phone layout (portrait stack)"
                    : "Desktop layout (wide landscape)"
              }
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
            ? `View: ${resolved === "phone" ? "Phone" : "Desktop"}${preference === "auto" ? " · auto" : " · locked"}`
            : "View: …"}
        </p>
      )}
    </div>
  );
}
