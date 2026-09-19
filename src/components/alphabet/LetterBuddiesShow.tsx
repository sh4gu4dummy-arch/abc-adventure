import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { letterHeroPath, posterPath } from "@/data/alphabet";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";

type Beat =
  | "idle"
  | "title"
  | "c"
  | "a"
  | "t"
  | "together"
  | "join"
  | "word"
  | "done";

/**
 * Episode 1 — CAT.
 * Real letter-buddy portraits on a stage. Gentle motion only. One voice line at a time.
 */
export function LetterBuddiesShow({ autoPlay = false }: { autoPlay?: boolean }) {
  const [beat, setBeat] = useState<Beat>(autoPlay ? "title" : "idle");
  const [caption, setCaption] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  function later(ms: number, fn: () => void) {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }

  async function run() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];

    setBeat("title");
    setCaption("Letter Buddies");

    later(2000, () => {
      setBeat("c");
      setCaption("C");
      void speak("The letter C");
    });
    later(4200, () => {
      void speak("C says kuh, like cat!");
    });

    later(12000, () => {
      setBeat("a");
      setCaption("A");
      void speak("The letter A");
    });
    later(14200, () => {
      void speak("The letter A says ah, like apple!");
    });

    later(22000, () => {
      setBeat("t");
      setCaption("T");
      void speak("The letter T");
    });
    later(24200, () => {
      void speak("T says tuh, like tree!");
    });

    later(32000, () => {
      setBeat("together");
      setCaption("C  ·  A  ·  T");
    });

    later(42000, () => {
      setBeat("join");
      setCaption("CAT");
      void speak("Cat");
    });

    later(50000, () => {
      setBeat("word");
      setCaption("CAT!");
      void speak("Yes! Cat starts with C!");
    });

    later(60000, () => {
      setBeat("done");
      setCaption("CAT!");
    });
  }

  useEffect(() => {
    if (autoPlay) void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const showC = beat === "c" || beat === "together" || beat === "join" || beat === "word" || beat === "done";
  const showA = beat === "a" || beat === "together" || beat === "join" || beat === "word" || beat === "done";
  const showT = beat === "t" || beat === "together" || beat === "join" || beat === "word" || beat === "done";
  const tight = beat === "join" || beat === "word" || beat === "done";
  const showCat = beat === "word" || beat === "done";
  const playing = beat !== "idle" && beat !== "done";

  return (
    <div className="lb-stage relative overflow-hidden rounded-[var(--radius-xl)] border-2 border-border">
      <div className="lb-sky" />
      <div className="lb-hill" />

      {beat === "idle" && (
        <button
          type="button"
          onClick={() => void run()}
          className="absolute inset-0 z-20 grid place-items-center"
          aria-label="Play Letter Buddies episode 1"
        >
          <span className="grid size-16 place-items-center rounded-full bg-white text-ink shadow-lg">
            <Play className="size-7 fill-current" />
          </span>
        </button>
      )}

      <p className="lb-caption" aria-live="polite">
        {caption}
      </p>

      <div className={cn("lb-cast", tight && "lb-cast-tight")}>
        {showC && <BuddySlot letter="c" pose="jig" />}
        {showA && <BuddySlot letter="a" pose="hop" />}
        {showCat && (
          <img src={posterPath("c", "cat")} alt="" className="lb-cat-reveal" />
        )}
        {showT && <BuddySlot letter="t" pose="march" />}
      </div>

      {playing && (
        <span className="sr-only">Playing episode</span>
      )}
    </div>
  );
}

function BuddySlot({
  letter,
  pose,
}: {
  letter: string;
  pose: "jig" | "hop" | "march";
}) {
  return (
    <div className={cn("lb-slot", `lb-pose-${pose}`)}>
      <img src={letterHeroPath(letter)} alt="" className="lb-buddy" />
    </div>
  );
}
