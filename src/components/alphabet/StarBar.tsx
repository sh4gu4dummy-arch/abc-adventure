import { Star, Sticker } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function StarBar({ compact }: { compact?: boolean }) {
  const { stars, visited, stickers, completed } = useProgress();
  const stickerCount = stickers.length || completed.length;
  return (
    <div
      className={cn(
        "flex items-center rounded-[var(--radius-pill)] border-2 border-border bg-surface px-2.5 py-1.5",
        compact ? "gap-1.5" : "gap-2 sm:gap-3 sm:px-3",
      )}
    >
      <div className="flex items-center gap-1">
        <Star className="size-4 fill-star text-star sm:size-5" aria-hidden />
        <span className="font-display text-base font-bold tabular-nums text-ink sm:text-lg">
          {stars}
        </span>
      </div>
      {!compact && (
        <>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 text-xs font-semibold text-ink-soft sm:text-sm">
            <Sticker className="size-4 text-accent" aria-hidden />
            <span className="tabular-nums">{stickerCount}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-semibold text-ink-soft sm:text-sm">
            {visited.length}
            <span className="text-muted">/26</span>
          </span>
        </>
      )}
    </div>
  );
}
