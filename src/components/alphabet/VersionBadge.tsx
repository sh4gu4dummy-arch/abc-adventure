import { APP_VERSION_LABEL } from "@/lib/version";
import { cn } from "@/lib/utils";

/** Always-visible build number. Use on menu / chrome screens. */
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
        "inline-flex shrink-0 items-center rounded-[var(--radius-pill)] border-2 px-3 py-1 font-display text-sm font-black tabular-nums tracking-wide shadow-md",
        tone === "on-dark"
          ? "border-white/70 bg-black/55 text-white"
          : "border-primary/40 bg-primary text-white",
        className,
      )}
      title={`ABC Adventure ${APP_VERSION_LABEL}`}
      aria-label={`App version ${APP_VERSION_LABEL}`}
    >
      App {APP_VERSION_LABEL}
    </span>
  );
}

/** Fixed corner so the version is findable on every screen. */
export function VersionCorner() {
  return (
    <div
      className="pointer-events-none fixed bottom-[max(0.7rem,env(safe-area-inset-bottom))] left-[max(0.7rem,env(safe-area-inset-left))] z-40"
    >
      <VersionBadge className="pointer-events-auto" />
    </div>
  );
}
