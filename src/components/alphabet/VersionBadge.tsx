import { APP_VERSION_LABEL } from "@/lib/version";
import { cn } from "@/lib/utils";

/** Always-visible build number (v0.023 …). Use on menu / chrome screens. */
export function VersionBadge({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "on-dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[var(--radius-pill)] border-2 px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums tracking-wide",
        tone === "on-dark"
          ? "border-white/45 bg-black/25 text-white"
          : "border-border bg-surface text-ink",
        className,
      )}
      title={`ABC Adventure ${APP_VERSION_LABEL}`}
    >
      {APP_VERSION_LABEL}
    </span>
  );
}
