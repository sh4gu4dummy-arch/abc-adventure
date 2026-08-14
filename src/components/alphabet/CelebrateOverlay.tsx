import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getLetter, letterHeroPath } from "@/data/alphabet";
import { ConfettiBurst } from "./ConfettiBurst";
import { speak } from "@/lib/speak";

/**
 * Listens for abc-letter-complete and shows confetti + sticker + rhyme.
 */
export function CelebrateOverlay() {
  const [letter, setLetter] = useState<string | null>(null);

  useEffect(() => {
    function onComplete(e: Event) {
      const L = (e as CustomEvent<{ letter: string }>).detail?.letter;
      if (!L) return;
      setLetter(L);
      const rhyme = getLetter(L)?.rhyme;
      void (async () => {
        await speak(`Amazing! You finished the letter ${L}! You earned a sticker!`);
        if (rhyme) await speak(rhyme);
      })();
    }
    window.addEventListener("abc-letter-complete", onComplete);
    return () => window.removeEventListener("abc-letter-complete", onComplete);
  }, []);

  if (!letter) return null;
  const rhyme = getLetter(letter)?.rhyme;

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
          <div className="mx-auto mt-4 size-28 overflow-hidden rounded-[2rem] border-4 border-star/50 shadow-inner">
            <img
              src={letterHeroPath(letter)}
              alt=""
              className="size-full object-cover"
            />
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">
            You finished {letter}!
          </h2>
          {rhyme && (
            <p className="mt-3 rounded-[var(--radius-md)] bg-surface-soft px-3 py-2 text-sm font-bold leading-snug text-ink">
              {rhyme}
            </p>
          )}
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
