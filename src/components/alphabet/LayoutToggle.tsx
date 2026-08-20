import { useEffect, useState } from "react";
import { RectangleHorizontal, Smartphone, Sparkles } from "lucide-react";
import {
  useLayoutMode,
  type LayoutPreference,
} from "@/lib/layout-mode";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: LayoutPreference;
  label: string;
  short: string;
  icon: typeof Smartphone;
}[] = [
  { id: "auto", label: "Auto", short: "Auto", icon: Sparkles },
  { id: "portrait", label: "Portrait", short: "Port.", icon: Smartphone },
  { id: "landscape", label: "Landscape", short: "Land.", icon: RectangleHorizontal },
];

/**
 * Portrait / Landscape / Auto.
 * Auto follows how you hold the device. Locked modes keep that layout
 * and try to lock screen orientation on phones (installed app / APK).
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

  const preference: LayoutPreference = ready ? live.preference : "auto";
  const view = ready
    ? live.resolved === "phone"
      ? "Portrait"
      : "Landscape"
    : "…";

  return (
    <div
      className={cn("inline-flex flex-col items-stretch gap-1", className)}
      role="group"
      aria-label="Portrait or landscape"
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
                "pressable inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 text-xs font-bold transition-colors sm:px-3 sm:text-sm",
                active
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-surface-soft",
              )}
              aria-pressed={active}
              title={
                opt.id === "auto"
                  ? "Follow how you hold the device"
                  : opt.id === "portrait"
                    ? "Portrait — stacked phone layout"
                    : "Landscape — wide layout"
              }
            >
              <Icon className="size-4" aria-hidden />
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
            ? `View: ${view}${preference === "auto" ? " · auto" : " · locked"}`
            : "View: …"}
        </p>
      )}
    </div>
  );
}
