import { useCaseMode, type CaseKind } from "@/lib/case-mode";
import { useDevPanel } from "@/lib/dev-panel";
import { PENDING_REMAKES } from "@/data/pending-remakes";
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
  const { open: devOpen, setOpen: setDevOpen, votes } = useDevPanel();
  const L = letter?.toUpperCase() ?? "ABC";
  const l = letter?.toLowerCase() ?? "abc";
  const pendingN = PENDING_REMAKES.filter((item) => !votes[item.id]).length;

  const options: { id: CaseKind; label: string }[] = [
    { id: "upper", label: `Big ${L}` },
    { id: "lower", label: `little ${l}` },
  ];

  return (
    <div
      className={cn("flex flex-wrap gap-1", compact ? "w-auto shrink-0" : "gap-1.5", className)}
      role="tablist"
      aria-label="Big, little, or Dev"
    >
      {options.map((opt) => {
        const on = !devOpen && mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => {
              setDevOpen(false);
              setMode(opt.id);
            }}
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
      <button
        type="button"
        role="tab"
        aria-selected={devOpen}
        data-case-lock
        onClick={() => setDevOpen(true)}
        className={cn(
          "pressable rounded-[var(--radius-pill)] border-2 font-bold",
          compact
            ? "min-h-8 px-2.5 text-[11px]"
            : "min-h-11 px-3 text-sm",
          devOpen
            ? "border-transparent bg-ink text-white"
            : "border-border bg-surface text-ink",
        )}
      >
        Dev{pendingN > 0 ? ` ${pendingN}` : ""}
      </button>
    </div>
  );
}
