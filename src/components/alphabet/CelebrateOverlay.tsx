import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { ConfettiBurst } from "./ConfettiBurst";
import { stickerFor } from "./LetterCompleteBanner";
import { speak } from "@/lib/speak";

/**
 * Listens for abc-letter-complete and shows confetti + sticker modal.
 */
export function CelebrateOverlay() {
  const [letter, setLetter] = useState<string | null>(null);

  useEffect(() => {
    function onComplete(e: Event) {
      const L = (e as CustomEvent<{ letter: string }>).detail?.letter;
      if (!L) return;
      setLetter(L);
      void speak(`Amazing! You finished the letter ${L}! You earned a sticker!`);
    }
    window.addEventListener("abc-letter-complete", onComplete);
    return () => window.removeEventListener("abc-letter-complete", onComplete);
  }, []);

  if (!letter) return null;

  return (
    <>
      <ConfettiBurst active />
      <div
        className="modal-scrim fixed inset-0 z-[90] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Letter ${letter} complete`}
      >
        <div className="pop-in card-surface w-full max-w-sm rounded-[var(--radius-xl)] p-6 text-center shadow-[var(--shadow-float)]">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" /> Letter complete
          </p>
          <div className="mx-auto mt-4 flex size-24 items-center justify-center rounded-[2rem] bg-star/30 text-5xl shadow-inner">
            {stickerFor(letter)}
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">
            You finished {letter}!
          </h2>
          <p className="mt-2 text-sm font-medium text-ink-soft">
            Sticker unlocked. Keep going — every letter has a prize!
          </p>
          <button
            type="button"
            onClick={() => setLetter(null)}
            className="pressable mt-5 min-h-12 w-full rounded-[var(--radius-pill)] bg-ink px-5 py-3 font-bold text-white"
          >
            Yay!
          </button>
        </div>
      </div>
    </>
  );
}
