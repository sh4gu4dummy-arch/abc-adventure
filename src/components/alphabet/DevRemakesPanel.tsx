import { useMemo, useState } from "react";
import { Check, Copy, RotateCcw, X } from "lucide-react";
import { PENDING_REMAKES, type PendingRemake } from "@/data/pending-remakes";
import { assetUrl } from "@/lib/assets";
import { setCaseMode } from "@/lib/case-mode";
import { useDevPanel, type DevVote } from "@/lib/dev-panel";
import { APP_VERSION_LABEL } from "@/lib/version";
import { cn } from "@/lib/utils";

function openLetter(letter: string, caseKind: "upper" | "lower") {
  setCaseMode(caseKind);
  const path = `/letter/${letter.toLowerCase()}`;
  if (typeof window !== "undefined" && window.__ABC_ASSET_BASE__) {
    window.location.hash = path;
    return;
  }
  window.location.assign(path);
}

function pasteBlock(
  item: PendingRemake,
  decision: "CONFIRM" | "REJECT" | "INFO",
  extraNotes: string,
) {
  const notes = extraNotes.trim() || item.notes;
  return [
    `${decision} ${item.id}`,
    `title: ${item.title}`,
    `letter: ${item.caseKind === "upper" ? "Big" : "little"} ${item.letter}`,
    `clips: ${item.clips}`,
    `file: ${item.file}`,
    `app: ${APP_VERSION_LABEL}`,
    `notes: ${notes}`,
  ].join("\n");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export function DevRemakesPanel({ focusLetter }: { focusLetter?: string }) {
  const { votes, setVote, clearVote } = useDevPanel();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [showDecided, setShowDecided] = useState(false);
  const [paste, setPaste] = useState("");

  const { openItems, decidedItems } = useMemo(() => {
    const open: PendingRemake[] = [];
    const decided: PendingRemake[] = [];
    for (const item of PENDING_REMAKES) {
      (votes[item.id] ? decided : open).push(item);
    }
    const rank = (list: PendingRemake[]) => {
      if (!focusLetter) return list;
      const L = focusLetter.toLowerCase();
      return [
        ...list.filter((i) => i.letter === L),
        ...list.filter((i) => i.letter !== L),
      ];
    };
    return { openItems: rank(open), decidedItems: rank(decided) };
  }, [focusLetter, votes]);

  const visible = showDecided ? [...openItems, ...decidedItems] : openItems;

  async function runCopy(
    item: PendingRemake,
    decision: "CONFIRM" | "REJECT" | "INFO",
    vote?: DevVote,
  ) {
    const extra = notes[item.id] ?? "";
    const block = pasteBlock(item, decision, extra);
    setPaste(block);
    const ok = await copyText(block);
    setCopied(ok ? item.id : `fail-${item.id}`);
    if (vote) setVote(item.id, vote, extra.trim() || item.notes);
  }

  async function copyAllOpen() {
    const block = openItems
      .map((item) => pasteBlock(item, "INFO", notes[item.id] ?? ""))
      .join("\n\n");
    if (!block) return;
    setPaste(block);
    const ok = await copyText(block);
    setCopied(ok ? "all" : "fail-all");
  }

  return (
    <section
      className="mb-6 rounded-[var(--radius-lg)] border-2 border-dashed border-ink/25 bg-surface p-3 sm:p-4"
      data-case-lock
      aria-label="Dev remake queue"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Dev</h2>
          <p className="text-xs font-semibold text-muted">
            {openItems.length} waiting · paste Confirm/Reject in chat
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => void copyAllOpen()}
            className="pressable inline-flex min-h-9 items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-xs font-bold text-ink"
          >
            <Copy className="size-3.5" /> Copy all open
          </button>
          <button
            type="button"
            onClick={() => setShowDecided((v) => !v)}
            className="pressable inline-flex min-h-9 items-center rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-xs font-bold text-ink-soft"
          >
            {showDecided ? "Hide decided" : `Show decided (${decidedItems.length})`}
          </button>
        </div>
      </div>

      {visible.length === 0 && (
        <p className="text-sm font-semibold text-ink-soft">
          No pending remakes. Builder adds them here when a clip is local-only.
        </p>
      )}

      <ul className="grid gap-3">
        {visible.map((item) => {
          const vote = votes[item.id];
          const src = `${assetUrl(item.file)}?v=${item.id}`;
          return (
            <li
              key={item.id}
              className="rounded-[var(--radius-md)] border-2 border-border bg-bg p-2.5"
            >
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-1">
                <p className="font-display text-sm font-bold text-ink">
                  {item.title}
                </p>
                {vote && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      vote.vote === "confirm"
                        ? "bg-success/20 text-success"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    {vote.vote}
                  </span>
                )}
              </div>
              <p className="mb-2 text-[11px] font-semibold leading-snug text-ink-soft">
                {item.clips} · {item.since}
                <br />
                {item.notes}
              </p>
              <video
                className="mb-2 w-full max-h-64 rounded-[var(--radius-sm)] bg-black object-contain"
                src={src}
                controls
                playsInline
                preload="metadata"
              />
              <textarea
                data-case-lock
                rows={2}
                value={notes[item.id] ?? ""}
                onChange={(e) =>
                  setNotes((m) => ({ ...m, [item.id]: e.target.value }))
                }
                placeholder="Notes for chat (optional)"
                className="mb-2 w-full rounded-[var(--radius-sm)] border-2 border-border bg-surface px-2 py-1.5 text-xs font-semibold text-ink"
              />
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => void runCopy(item, "CONFIRM", "confirm")}
                  className="pressable inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-[var(--radius-pill)] bg-success px-3 text-xs font-bold text-white"
                >
                  <Check className="size-3.5" /> Confirm
                </button>
                <button
                  type="button"
                  onClick={() => void runCopy(item, "REJECT", "reject")}
                  className="pressable inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-[var(--radius-pill)] bg-primary px-3 text-xs font-bold text-white"
                >
                  <X className="size-3.5" /> Reject
                </button>
                <button
                  type="button"
                  onClick={() => void runCopy(item, "INFO")}
                  className="pressable inline-flex min-h-9 items-center justify-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-xs font-bold text-ink"
                >
                  <Copy className="size-3.5" /> Copy
                </button>
                <button
                  type="button"
                  onClick={() => openLetter(item.letter, item.caseKind)}
                  className="pressable inline-flex min-h-9 items-center justify-center rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-xs font-bold text-ink"
                >
                  Open letter
                </button>
                {vote && (
                  <button
                    type="button"
                    onClick={() => clearVote(item.id)}
                    className="pressable inline-flex min-h-9 items-center justify-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-xs font-bold text-ink-soft"
                  >
                    <RotateCcw className="size-3.5" /> Undo
                  </button>
                )}
              </div>
              {copied === item.id && (
                <p className="mt-1.5 text-[11px] font-bold text-success">
                  Copied. Paste in chat.
                </p>
              )}
              {copied === `fail-${item.id}` && (
                <p className="mt-1.5 text-[11px] font-bold text-primary">
                  Select the box below and copy.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <label className="mt-3 block text-[11px] font-bold uppercase tracking-wide text-muted">
        Paste box
        <textarea
          data-case-lock
          readOnly
          rows={6}
          value={paste}
          onFocus={(e) => e.currentTarget.select()}
          placeholder="Confirm / Reject fills this. Select and copy if the button fails."
          className="mt-1 w-full rounded-[var(--radius-sm)] border-2 border-border bg-surface px-2 py-1.5 font-mono text-[11px] text-ink"
        />
      </label>
    </section>
  );
}
