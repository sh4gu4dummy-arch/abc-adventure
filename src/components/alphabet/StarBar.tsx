import { Star, Sticker } from "lucide-react";
import { useProgress } from "@/lib/progress";

export function StarBar() {
  const { stars, visited, stickers, completed } = useProgress();
  const stickerCount = stickers.length || completed.length;
  return (
    <div className="flex items-center gap-2.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-1.5 shadow-[var(--shadow-card)] sm:gap-3">
      <div className="flex items-center gap-1.5">
        <Star className="size-5 fill-star text-star" aria-hidden />
        <span className="font-display text-lg font-bold tabular-nums text-ink">{stars}</span>
      </div>
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
    </div>
  );
}
