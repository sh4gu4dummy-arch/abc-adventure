import { useState } from "react";
import { Download, Check, Loader2, HardDrive } from "lucide-react";

const ZIP_HREF = "/portable/ABC-Adventure-Portable.zip";

/**
 * Download button for the offline portable ZIP package.
 * Uses a real <a download> so it works even without JS gymnastics,
 * with a friendly status for large files.
 */
export function DownloadPortable({ className }: { className?: string }) {
  const [state, setState] = useState<"idle" | "starting" | "done">("idle");

  function onClick() {
    setState("starting");
    // Allow the native download to begin; flash "starting" for feedback
    window.setTimeout(() => setState("done"), 1200);
    window.setTimeout(() => setState("idle"), 4000);
  }

  return (
    <div className={className}>
      <a
        href={ZIP_HREF}
        download="ABC-Adventure-Portable.zip"
        onClick={onClick}
        className="pressable inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 border-ink/10 bg-ink px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] sm:w-auto sm:text-base"
      >
        {state === "starting" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : state === "done" ? (
          <Check className="size-5 text-success" />
        ) : (
          <Download className="size-5" />
        )}
        {state === "done" ? "Download started!" : "Download portable app"}
      </a>
      <p className="mt-2 flex items-start gap-1.5 text-xs font-medium leading-snug text-ink-soft sm:text-sm">
        <HardDrive className="mt-0.5 size-3.5 shrink-0 text-muted" />
        <span>
          ZIP folder with everything inside — posters, AI voice, games. Unzip and open{" "}
          <strong>index.html</strong>. Works offline on a USB drive or classroom laptop.
        </span>
      </p>
    </div>
  );
}
