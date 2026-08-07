import { useEffect, useState } from "react";
import { Download, Check, Loader2, HardDrive, Code2, AppWindow } from "lucide-react";

type PackageMeta = {
  name: string;
  mb: number;
  bytes: number;
  sha256_12?: string;
};

type MetaFile = {
  builtAt?: string;
  portableApp?: PackageMeta & { files?: number };
  sourceCode?: PackageMeta;
  // legacy shape
  name?: string;
  mb?: number;
};

const APP_ZIP = "/portable/ABC-Adventure-Portable.zip";
const SOURCE_ZIP = "/portable/ABC-Adventure-Source.zip";

function DownloadCard({
  href,
  filename,
  title,
  blurb,
  icon: Icon,
  mb,
  accent,
}: {
  href: string;
  filename: string;
  title: string;
  blurb: string;
  icon: typeof Download;
  mb?: number;
  accent: string;
}) {
  const [state, setState] = useState<"idle" | "starting" | "done">("idle");

  function onClick() {
    setState("starting");
    window.setTimeout(() => setState("done"), 1200);
    window.setTimeout(() => setState("idle"), 4500);
  }

  return (
    <div className="card-surface flex flex-col rounded-[var(--radius-xl)] p-4 sm:p-5">
      <div className="mb-3 flex items-start gap-3">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl text-white"
          style={{ background: accent }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm font-medium leading-snug text-ink-soft">{blurb}</p>
          {typeof mb === "number" && (
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">
              ~{mb} MB ZIP
            </p>
          )}
        </div>
      </div>
      <a
        href={href}
        download={filename}
        onClick={onClick}
        className="pressable inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] px-4 py-3 text-sm font-bold text-white sm:text-base"
        style={{ background: accent }}
      >
        {state === "starting" ? (
          <Loader2 className="size-5 animate-spin" />
        ) : state === "done" ? (
          <Check className="size-5" />
        ) : (
          <Download className="size-5" />
        )}
        {state === "done" ? "Download started!" : `Download ${title}`}
      </a>
    </div>
  );
}

/**
 * Offline downloads: playable HTML app + full source codebase.
 */
export function DownloadPortable({ className }: { className?: string }) {
  const [meta, setMeta] = useState<MetaFile | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/portable/meta.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!cancelled && j) setMeta(j as MetaFile);
      })
      .catch(() => {
        /* optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const appMb = meta?.portableApp?.mb ?? meta?.mb;
  const srcMb = meta?.sourceCode?.mb;
  const built = meta?.builtAt
    ? new Date(meta.builtAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <section
      className={className}
      aria-label="Offline downloads"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Take it offline
          </h2>
          <p className="mt-1 max-w-xl text-sm font-medium text-ink-soft">
            Download a ready-to-play offline app, or the full project source to edit and rebuild.
            Both work without an internet connection after download.
          </p>
        </div>
        {built && (
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Packages built {built}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DownloadCard
          href={APP_ZIP}
          filename="ABC-Adventure-Portable.zip"
          title="Portable app"
          blurb="Unzip and open index.html — posters, videos, voice, games. Perfect for USB sticks and classroom laptops."
          icon={AppWindow}
          mb={appMb}
          accent="var(--color-ink)"
        />
        <DownloadCard
          href={SOURCE_ZIP}
          filename="ABC-Adventure-Source.zip"
          title="Full source code"
          blurb="Complete codebase (no node_modules). Unzip, run npm install, then npm run dev or rebuild the portable app."
          icon={Code2}
          mb={srcMb}
          accent="var(--color-accent)"
        />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-ink-soft sm:text-sm">
        <HardDrive className="mt-0.5 size-3.5 shrink-0 text-muted" />
        <span>
          Keep each ZIP’s files together after unzipping. Progress saves only on the device
          that opens the portable app. Source package is for developers / backups.
        </span>
      </p>
    </section>
  );
}
