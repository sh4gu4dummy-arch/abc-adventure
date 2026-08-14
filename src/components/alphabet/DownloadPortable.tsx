import { useEffect, useState } from "react";
import {
  Download,
  Check,
  Loader2,
  HardDrive,
  Code2,
  AppWindow,
  FolderArchive,
  Smartphone,
} from "lucide-react";
import {
  APP_VERSION,
  APP_VERSION_LABEL,
  packageFileName,
  packagePublicPath,
} from "@/lib/version";

type PackageMeta = {
  name: string;
  mb: number;
  bytes: number;
  sha256_12?: string;
  path?: string;
  kind?: string;
  note?: string;
};

type MetaFile = {
  version?: string;
  versionLabel?: string;
  builtAt?: string;
  portableApp?: PackageMeta & { files?: number };
  codeOnly?: PackageMeta;
  sourceCode?: PackageMeta;
  apk?: PackageMeta;
  packages?: {
    portable?: PackageMeta;
    code?: PackageMeta;
    codebase?: PackageMeta;
    apk?: PackageMeta;
  };
};

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
          <p className="mt-1.5 break-all font-mono text-[10px] font-semibold text-muted">
            {filename}
          </p>
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
 * Versioned offline downloads:
 *  - Portable app (playable)
 *  - Code only (essential source, small)
 *  - Codebase (source + all assets)
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
        /* optional until packages are built */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const appLabel = APP_VERSION_LABEL;
  const codeName =
    meta?.packages?.code?.name ??
    meta?.codeOnly?.name ??
    packageFileName("code", APP_VERSION);
  const portableName =
    meta?.packages?.portable?.name ??
    meta?.portableApp?.name ??
    packageFileName("portable");
  const codebaseName =
    meta?.packages?.codebase?.name ??
    meta?.sourceCode?.name ??
    packageFileName("codebase");
  const apkName =
    meta?.packages?.apk?.name ?? meta?.apk?.name ?? packageFileName("apk");

  const portableHref =
    meta?.packages?.portable?.path ??
    meta?.portableApp?.path ??
    packagePublicPath("portable");
  const codeHref =
    meta?.packages?.code?.path ??
    meta?.codeOnly?.path ??
    packagePublicPath("code", APP_VERSION);
  const codebaseHref =
    meta?.packages?.codebase?.path ??
    meta?.sourceCode?.path ??
    packagePublicPath("codebase");
  const apkHref =
    meta?.packages?.apk?.path ??
    meta?.apk?.path ??
    packagePublicPath("apk");

  const appMb = meta?.packages?.portable?.mb ?? meta?.portableApp?.mb;
  const codeMb = meta?.packages?.code?.mb ?? meta?.codeOnly?.mb;
  const codebaseMb = meta?.packages?.codebase?.mb ?? meta?.sourceCode?.mb;
  const apkMb = meta?.packages?.apk?.mb ?? meta?.apk?.mb;

  const built = meta?.builtAt
    ? new Date(meta.builtAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <section className={className} aria-label="Offline downloads">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Take it offline
          </h2>
          <p className="mt-1 max-w-xl text-sm font-medium text-ink-soft">
            Every file name includes the version so you always know what you
            downloaded. Packages are archives — they download, they never open
            the app in a new tab.
          </p>
        </div>
        <div className="text-right">
          <p className="rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
            {appLabel}
          </p>
          {built && (
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-muted">
              Packages built {built}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DownloadCard
          href={apkHref}
          filename={apkName}
          title="Android APK"
          blurb="Install on Android (sideload). Full offline Letter World with posters, videos, and voice."
          icon={Smartphone}
          mb={apkMb}
          accent="#1B5E20"
        />
        <DownloadCard
          href={portableHref}
          filename={portableName}
          title="Portable app"
          blurb="Ready to play offline. Unzip and open index.html — posters, videos, voice, games."
          icon={AppWindow}
          mb={appMb}
          accent="var(--color-ink)"
        />
        <DownloadCard
          href={codeHref}
          filename={codeName}
          title="Code only"
          blurb="Essential source to view and build — no heavy media. Small, fast ZIP."
          icon={Code2}
          mb={codeMb}
          accent="var(--color-primary)"
        />
        <DownloadCard
          href={codebaseHref}
          filename={codebaseName}
          title="Code + assets"
          blurb="Full project source including all posters, videos, and audio. No node_modules."
          icon={FolderArchive}
          mb={codebaseMb}
          accent="var(--color-accent)"
        />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-ink-soft sm:text-sm">
        <HardDrive className="mt-0.5 size-3.5 shrink-0 text-muted" />
        <span>
          <strong className="text-ink">Android APK</strong> installs on phones/tablets.
          <strong className="text-ink"> Portable app</strong> is the offline HTML package for computers.
          <strong className="text-ink"> Code</strong> / <strong className="text-ink">Code + assets</strong>{" "}
          are source archives (download only). Progress saves on the device that opens the app.
          Current app version: {appLabel}. Code-only ZIP tracks this version.
          Portable / APK / full codebase stay on their last-built file until you
          ask to refresh them.
        </span>
      </p>
    </section>
  );
}
