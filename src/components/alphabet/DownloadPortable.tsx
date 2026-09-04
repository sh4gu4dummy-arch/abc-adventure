import { useEffect, useState, type MouseEvent } from "react";
import {
  Download,
  Check,
  Loader2,
  HardDrive,
  Code2,
  AppWindow,
  FolderArchive,
  Smartphone,
  Images,
} from "lucide-react";
import {
  APP_VERSION,
  APP_VERSION_LABEL,
  formatPackageUpdated,
  packageFileName,
} from "@/lib/version";

type PackageMeta = {
  name: string;
  mb: number;
  bytes: number;
  sha256_12?: string;
  path?: string;
  kind?: string;
  note?: string;
  version?: string;
  builtAt?: string;
};

type MetaFile = {
  version?: string;
  versionLabel?: string;
  builtAt?: string;
  codeBuiltAt?: string;
  mediaBuiltAt?: string;
  portableApp?: PackageMeta & { files?: number };
  codeOnly?: PackageMeta;
  sourceCode?: PackageMeta;
  apk?: PackageMeta;
  mediaOnly?: PackageMeta;
  packages?: {
    portable?: PackageMeta;
    code?: PackageMeta;
    codebase?: PackageMeta;
    media?: PackageMeta;
    apk?: PackageMeta;
  };
};

function dlHref(filename: string): string {
  return `/dl/${encodeURIComponent(filename)}`;
}

function DownloadCard({
  href,
  filename,
  title,
  blurb,
  icon: Icon,
  mb,
  accent,
  stamp,
}: {
  href: string;
  filename: string;
  title: string;
  blurb: string;
  icon: typeof Download;
  mb?: number;
  accent: string;
  stamp?: string;
}) {
  const [state, setState] = useState<"idle" | "starting" | "done" | "error">("idle");

  async function onClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    e.stopPropagation();
    setState("starting");
    const large = (mb ?? 0) > 8;
    try {
      if (large) {
        const a = document.createElement("a");
        a.href = href;
        a.download = filename;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setState("done");
      } else {
        const res = await fetch(href, { credentials: "same-origin" });
        if (!res.ok) throw new Error(`missing ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 2000);
        setState("done");
      }
    } catch {
      setState("error");
    }
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
          {stamp && (
            <p className="mt-1 text-xs font-bold text-ink">
              {stamp}
            </p>
          )}
          {typeof mb === "number" && (
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted">
              ~{mb} MB
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
        {state === "done" ? "Download started!" : state === "error" ? "Not found — retry" : `Download ${title}`}
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
  const mediaName =
    meta?.packages?.media?.name ??
    meta?.mediaOnly?.name ??
    packageFileName("media");

  const portableHref = dlHref(portableName);
  const codeHref = dlHref(codeName);
  const codebaseHref = dlHref(codebaseName);
  const apkHref = dlHref(apkName);
  const mediaHref = dlHref(mediaName);

  const appMb = meta?.packages?.portable?.mb ?? meta?.portableApp?.mb;
  const codeMb = meta?.packages?.code?.mb ?? meta?.codeOnly?.mb;
  const codebaseMb = meta?.packages?.codebase?.mb ?? meta?.sourceCode?.mb;
  const apkMb = meta?.packages?.apk?.mb ?? meta?.apk?.mb;
  const mediaMb = meta?.packages?.media?.mb ?? meta?.mediaOnly?.mb;

  const stampFor = (
    pkg?: PackageMeta,
    fallbackVersion?: string,
    fallbackIso?: string,
  ) =>
    formatPackageUpdated(
      pkg?.builtAt ?? fallbackIso,
      pkg?.version ?? fallbackVersion,
    );

  const codeStamp = stampFor(
    meta?.packages?.code ?? meta?.codeOnly,
    APP_VERSION,
    meta?.codeBuiltAt ?? meta?.builtAt,
  );
  const portableStamp = stampFor(
    meta?.packages?.portable ?? meta?.portableApp,
    meta?.packages?.portable?.name?.match(/v[\d.]+/)?.[0] ?? meta?.version,
    meta?.builtAt,
  );
  const codebaseStamp = stampFor(
    meta?.packages?.codebase ?? meta?.sourceCode,
    meta?.packages?.codebase?.name?.match(/v[\d.]+/)?.[0] ?? meta?.version,
    meta?.builtAt,
  );
  const apkStamp = stampFor(
    meta?.packages?.apk ?? meta?.apk,
    meta?.packages?.apk?.name?.match(/v[\d.]+/)?.[0] ?? meta?.version,
    meta?.builtAt,
  );
  const mediaStamp = stampFor(
    meta?.packages?.media ?? meta?.mediaOnly,
    APP_VERSION,
    meta?.mediaBuiltAt ?? meta?.builtAt,
  );

  const built = meta?.builtAt
    ? formatPackageUpdated(meta.builtAt, meta.versionLabel ?? meta.version)
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
            <p className="mt-1 text-[11px] font-bold text-muted">
              Last package refresh
              <br />
              {built}
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
          stamp={apkStamp}
        />
        <DownloadCard
          href={portableHref}
          filename={portableName}
          title="Portable app"
          blurb="Ready to play offline. Unzip and open index.html — posters, videos, voice, games."
          icon={AppWindow}
          mb={appMb}
          accent="var(--color-ink)"
          stamp={portableStamp}
        />
        <DownloadCard
          href={mediaHref}
          filename={mediaName}
          title="Media only"
          blurb="Letter characters, word pictures, videos, and voice. No code — just the art."
          icon={Images}
          mb={mediaMb}
          accent="#0CA678"
          stamp={mediaStamp}
        />
        <DownloadCard
          href={codeHref}
          filename={codeName}
          title="Code only"
          blurb="Essential source to view and build — no heavy media. Small, fast ZIP."
          icon={Code2}
          mb={codeMb}
          accent="var(--color-primary)"
          stamp={codeStamp}
        />
        <DownloadCard
          href={codebaseHref}
          filename={codebaseName}
          title="Code + assets"
          blurb="Full project source including all posters, videos, and audio. No node_modules."
          icon={FolderArchive}
          mb={codebaseMb}
          accent="var(--color-accent)"
          stamp={codebaseStamp}
        />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-ink-soft sm:text-sm">
        <HardDrive className="mt-0.5 size-3.5 shrink-0 text-muted" />
        <span>
          <strong className="text-ink">Android APK</strong> installs on phones/tablets.
          <strong className="text-ink"> Portable app</strong> is the offline HTML package for computers.
          <strong className="text-ink"> Media only</strong> is pictures, videos, and voice (no app).
          <strong className="text-ink"> Code</strong> / <strong className="text-ink">Code + assets</strong>{" "}
          are source archives (download only). Progress saves on the device that opens the app.
          Current app version: {appLabel}. Each file lists its version and the
          date and time it was last built.
        </span>
      </p>
    </section>
  );
}
