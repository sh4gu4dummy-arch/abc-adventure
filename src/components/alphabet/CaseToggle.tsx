import { useCaseMode, type CaseKind } from "@/lib/case-mode";
import { cn } from "@/lib/utils";

export function CaseToggle({
  letter,
  accent,
  className,
  compact,
}: {
  letter?: string;
  accent?: string;
  className?: string;
  compact?: boolean;
}) {
  const { mode, setMode } = useCaseMode();
  const L = letter?.toUpperCase() ?? "ABC";
  const l = letter?.toLowerCase() ?? "abc";

  const options: { id: CaseKind; label: string }[] = [
    { id: "upper", label: `Big ${L}` },
    { id: "lower", label: `little ${l}` },
  ];

  return (
    <div
      className={cn("flex gap-1", compact ? "w-auto shrink-0" : "gap-1.5", className)}
      role="tablist"
      aria-label="Big or little letters"
    >
      {options.map((opt) => {
        const on = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setMode(opt.id)}
            className={cn(
              "pressable rounded-[var(--radius-pill)] border-2 font-bold",
              compact
                ? "min-h-8 px-2.5 text-[11px]"
                : "min-h-11 flex-1 px-3 text-sm",
              on
                ? "border-transparent text-white"
                : "border-border bg-surface text-ink",
            )}
            style={
              on
                ? { background: accent ?? "var(--color-primary)" }
                : undefined
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
