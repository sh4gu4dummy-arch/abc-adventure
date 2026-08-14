import { useMemo, useState } from "react";
import type { LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type CaseKind = "upper" | "lower";

type Tile = {
  id: string;
  ch: string;
  kind: CaseKind | "other";
};

const LOOKALIKES: Record<string, string[]> = {
  A: ["O", "H", "V"],
  B: ["D", "P", "R"],
  C: ["O", "G", "Q"],
  D: ["B", "O", "P"],
  E: ["F", "B", "H"],
  F: ["E", "P", "T"],
  G: ["C", "O", "Q"],
  H: ["N", "M", "K"],
  I: ["L", "J", "T"],
  J: ["I", "L", "U"],
  K: ["H", "X", "R"],
  L: ["I", "T", "J"],
  M: ["N", "W", "H"],
  N: ["M", "H", "U"],
  O: ["C", "Q", "D"],
  P: ["B", "R", "F"],
  Q: ["O", "G", "C"],
  R: ["P", "B", "K"],
  S: ["C", "G", "Z"],
  T: ["I", "L", "F"],
  U: ["V", "J", "N"],
  V: ["U", "Y", "W"],
  W: ["M", "V", "U"],
  X: ["K", "Y", "Z"],
  Y: ["V", "X", "T"],
  Z: ["S", "X", "N"],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function buildTiles(entry: LetterEntry): Tile[] {
  const L = entry.letter.toUpperCase();
  const l = L.toLowerCase();
  const look = LOOKALIKES[L] ?? ["O", "X"];
  const d1 = look[0]!;
  const d2 = look[1] ?? look[0]!;
  const tiles: Tile[] = [
    { id: "U1", ch: L, kind: "upper" },
    { id: "U2", ch: L, kind: "upper" },
    { id: "L1", ch: l, kind: "lower" },
    { id: "L2", ch: l, kind: "lower" },
    { id: "D1", ch: d1, kind: "other" },
    { id: "D2", ch: d2.toLowerCase(), kind: "other" },
  ];
  return shuffle(tiles);
}

export function CaseHunt({ entry }: { entry: LetterEntry }) {
  const [seed, setSeed] = useState(0);
  const tiles = useMemo(() => buildTiles(entry), [entry, seed]);
  const [selected, setSelected] = useState<string | null>(null);
  const [binned, setBinned] = useState<Record<string, CaseKind>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const upperNeed = 2;
  const lowerNeed = 2;
  const upperGot = Object.values(binned).filter((k) => k === "upper").length;
  const lowerGot = Object.values(binned).filter((k) => k === "lower").length;

  function tapTile(tile: Tile) {
    if (done || binned[tile.id]) return;
    if (tile.kind === "other") {
      setWrong(tile.id);
      void speak("Try again!");
      setTimeout(() => setWrong(null), 500);
      setSelected(null);
      return;
    }
    setSelected(tile.id);
  }

  async function tapBin(bin: CaseKind) {
    if (done || !selected) return;
    const tile = tiles.find((t) => t.id === selected);
    if (!tile || tile.kind === "other") return;
    if (tile.kind !== bin) {
      setWrong(selected);
      void speak("Try again!");
      setTimeout(() => setWrong(null), 500);
      return;
    }
    const next = { ...binned, [tile.id]: bin };
    setBinned(next);
    setSelected(null);
    const u = Object.values(next).filter((k) => k === "upper").length;
    const lo = Object.values(next).filter((k) => k === "lower").length;
    if (u >= upperNeed && lo >= lowerNeed) {
      setDone(true);
      markSection(entry.letter, "cases");
      await speak(`You found big and little ${entry.letter}! Awesome!`);
    }
  }

  function reset() {
    setSeed((s) => s + 1);
    setSelected(null);
    setBinned({});
    setWrong(null);
    setDone(false);
  }

  const leftover = tiles.filter((t) => !binned[t.id]);

  return (
    <div className="mx-auto max-w-lg space-y-4 text-center">
      <div>
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">
          Sort big and little {entry.letter}
        </p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Tap a letter, then tap the matching box
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => void tapBin("upper")}
          className="pressable min-h-20 rounded-[var(--radius-lg)] border-2 border-border bg-surface px-2 py-3"
        >
          <span className="block font-display text-4xl font-black" style={{ color: entry.accent }}>
            {entry.letter}
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Big · {upperGot}/{upperNeed}
          </span>
        </button>
        <button
          type="button"
          onClick={() => void tapBin("lower")}
          className="pressable min-h-20 rounded-[var(--radius-lg)] border-2 border-border bg-surface px-2 py-3"
        >
          <span className="block font-display text-4xl font-black" style={{ color: entry.accent }}>
            {entry.letter.toLowerCase()}
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            Little · {lowerGot}/{lowerNeed}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {leftover.map((tile) => {
          const isSel = selected === tile.id;
          const isWrong = wrong === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => tapTile(tile)}
              className={cn(
                "pressable flex aspect-square items-center justify-center rounded-[1.1rem] border-2 font-display text-3xl font-bold shadow-sm sm:text-4xl",
                isSel && "border-transparent text-white",
                isWrong && "border-danger bg-danger/10 text-danger",
                !isSel && !isWrong && "border-border bg-surface text-ink",
              )}
              style={isSel ? { background: entry.accent } : undefined}
            >
              {tile.ch}
            </button>
          );
        })}
      </div>

      {done && (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-success/15 px-4 py-2 font-bold text-success">
            <Check className="size-4" /> You know big and little {entry.letter}!
          </p>
          <button
            type="button"
            onClick={reset}
            className="pressable mx-auto flex min-h-12 items-center rounded-[var(--radius-pill)] px-6 py-3 font-bold text-white"
            style={{ background: entry.accent }}
          >
            Sort again
          </button>
        </div>
      )}
    </div>
  );
}
