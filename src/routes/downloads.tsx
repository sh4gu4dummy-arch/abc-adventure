import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { DownloadPortable } from "@/components/alphabet/DownloadPortable";
import { APP_VERSION_LABEL } from "@/lib/version";

export const Route = createFileRoute("/downloads")({ component: DownloadsPage });

function DownloadsPage() {
  return (
    <main className="app-shell">
      <Link
        to="/"
        className="pressable mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Home
      </Link>

      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Download className="size-3.5" /> Offline
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="font-display text-3xl font-bold text-ink">Downloads</h1>
          <span className="rounded-[var(--radius-pill)] border-2 border-border bg-surface px-2.5 py-0.5 text-xs font-bold text-ink">
            {APP_VERSION_LABEL}
          </span>
        </div>
        <p className="mt-1 max-w-md text-sm font-medium text-ink-soft">
          Portable app and full source ZIP for offline use. Progress still saves
          on each device.
        </p>
      </header>

      <DownloadPortable />

      <p className="mt-6 text-center text-xs font-medium text-muted">
        <Link to="/settings" className="font-bold text-primary underline-offset-2 hover:underline">
          Settings
        </Link>
        {" · "}
        <Link to="/" className="font-bold text-primary underline-offset-2 hover:underline">
          Back to Letter World
        </Link>
      </p>
    </main>
  );
}
