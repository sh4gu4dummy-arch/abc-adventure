import { posterPath, type WordEntry } from "@/data/alphabet";
import type { StoryAction, StoryScene } from "@/data/stories";
import { LetterWord } from "./LetterWord";
import { cn } from "@/lib/utils";

const SCENE_STYLE: Record<
  StoryScene,
  { gradient: string; ground: string; decor: string }
> = {
  sky: {
    gradient: "linear-gradient(180deg, #7ec8ff 0%, #c8e9ff 45%, #ffe8b8 100%)",
    ground: "from-sky-300/0 via-transparent to-amber-200/40",
    decor: "clouds",
  },
  beach: {
    gradient: "linear-gradient(180deg, #87ceeb 0%, #b8e0f0 40%, #f5d78e 70%, #e8c068 100%)",
    ground: "from-transparent to-amber-300/50",
    decor: "waves",
  },
  garden: {
    gradient: "linear-gradient(180deg, #9ad4ff 0%, #c8f0c8 50%, #7dce7a 100%)",
    ground: "from-transparent to-green-500/30",
    decor: "leaves",
  },
  kitchen: {
    gradient: "linear-gradient(180deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)",
    ground: "from-transparent to-orange-200/40",
    decor: "dots",
  },
  night: {
    gradient: "linear-gradient(180deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
    ground: "from-transparent to-indigo-900/40",
    decor: "stars",
  },
  ocean: {
    gradient: "linear-gradient(180deg, #4fc3f7 0%, #29b6f6 40%, #0288d1 100%)",
    ground: "from-transparent to-blue-700/30",
    decor: "waves",
  },
  home: {
    gradient: "linear-gradient(180deg, #ffe0e8 0%, #ffd1dc 50%, #f8bbd0 100%)",
    ground: "from-transparent to-pink-300/30",
    decor: "dots",
  },
  space: {
    gradient: "linear-gradient(180deg, #0d1b2a 0%, #1b3a5f 50%, #415a77 100%)",
    ground: "from-transparent to-slate-900/50",
    decor: "stars",
  },
  party: {
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 40%, #a18cd1 100%)",
    ground: "from-transparent to-fuchsia-300/30",
    decor: "confetti",
  },
  forest: {
    gradient: "linear-gradient(180deg, #81c784 0%, #a5d6a7 40%, #66bb6a 100%)",
    ground: "from-transparent to-green-800/25",
    decor: "leaves",
  },
};

function actorClass(action: StoryAction, index: number, total: number): string {
  const delay = `story-delay-${Math.min(index, 5)}`;
  switch (action) {
    case "fly":
      return cn("story-actor story-fly", delay, index === 0 && "story-fly-lead");
    case "bounce":
      return cn("story-actor story-bounce", delay);
    case "find":
      return cn("story-actor story-find", delay, index === 0 && "story-finder");
    case "share":
      return cn("story-actor story-share", delay);
    case "wave":
      return cn("story-actor story-wave", delay);
    case "zoom":
      return cn("story-actor story-zoom", delay, index === total - 1 && "story-zoom-fast");
    case "climb":
      return cn("story-actor story-climb", delay);
    case "splash":
      return cn("story-actor story-splash", delay);
    case "dance":
      return cn("story-actor story-dance", delay);
    case "celebrate":
      return cn("story-actor story-celebrate", delay);
    default:
      return cn("story-actor story-pop", delay);
  }
}

function layoutFor(action: StoryAction, count: number): string {
  if (action === "fly" || action === "zoom") {
    return "story-layout-flight";
  }
  if (action === "climb") {
    return "story-layout-climb";
  }
  if (action === "celebrate" || count >= 5) {
    return "story-layout-crowd";
  }
  if (count <= 2) return "story-layout-duo";
  if (count === 3) return "story-layout-trio";
  return "story-layout-row";
}

function SceneDecor({ kind }: { kind: string }) {
  if (kind === "clouds") {
    return (
      <>
        <span className="story-cloud story-cloud-1" aria-hidden />
        <span className="story-cloud story-cloud-2" aria-hidden />
        <span className="story-cloud story-cloud-3" aria-hidden />
      </>
    );
  }
  if (kind === "waves") {
    return (
      <>
        <span className="story-wave-band story-wave-1" aria-hidden />
        <span className="story-wave-band story-wave-2" aria-hidden />
      </>
    );
  }
  if (kind === "stars") {
    return (
      <>
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="story-star"
            style={{
              left: `${8 + ((i * 17) % 84)}%`,
              top: `${10 + ((i * 23) % 50)}%`,
              animationDelay: `${i * 0.15}s`,
            }}
            aria-hidden
          />
        ))}
      </>
    );
  }
  if (kind === "leaves") {
    return (
      <>
        <span className="story-leaf story-leaf-1" aria-hidden />
        <span className="story-leaf story-leaf-2" aria-hidden />
        <span className="story-leaf story-leaf-3" aria-hidden />
      </>
    );
  }
  if (kind === "confetti") {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="story-confetti-dot"
            style={{
              left: `${10 + i * 8}%`,
              background: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff"][i % 5],
              animationDelay: `${i * 0.12}s`,
            }}
            aria-hidden
          />
        ))}
      </>
    );
  }
  return (
    <>
      <span className="story-dot story-dot-1" aria-hidden />
      <span className="story-dot story-dot-2" aria-hidden />
      <span className="story-dot story-dot-3" aria-hidden />
    </>
  );
}

export function StoryStage({
  letter,
  accent,
  action,
  scene,
  words,
  stageKey,
}: {
  letter: string;
  accent: string;
  action: StoryAction;
  scene: StoryScene;
  words: WordEntry[];
  /** Change to re-trigger enter animations */
  stageKey: string | number;
}) {
  const theme = SCENE_STYLE[scene];
  const cast = words.slice(0, 6);

  return (
    <div
      key={stageKey}
      className="story-stage relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border shadow-[var(--shadow-card)]"
      style={{ background: theme.gradient }}
      role="img"
      aria-label={`Story scene: ${cast.map((w) => w.word).join(", ")}`}
    >
      <SceneDecor kind={theme.decor} />

      {/* soft ground fade */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b",
          theme.ground,
        )}
      />

      {/* action badge */}
      <div className="absolute left-3 top-3 z-10">
        <span
          className="rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm"
          style={{ background: accent }}
        >
          {actionLabel(action)}
        </span>
      </div>

      {/* actors */}
      <div className={cn("story-cast relative z-[1]", layoutFor(action, cast.length))}>
        {cast.map((w, i) => (
          <div
            key={`${stageKey}-${w.slug}`}
            className={actorClass(action, i, cast.length)}
            style={{ ["--actor-i" as string]: i }}
          >
            <div className="story-actor-frame">
              <img
                src={posterPath(letter, w.slug)}
                alt={w.word}
                className="story-actor-img"
                draggable={false}
              />
            </div>
            <div className="story-actor-label">
              <LetterWord word={w.word} accent={accent} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* action fx overlay */}
      {action === "splash" && <span className="story-fx-splash" aria-hidden />}
      {action === "find" && <span className="story-fx-sparkle" aria-hidden />}
    </div>
  );
}

function actionLabel(action: StoryAction): string {
  switch (action) {
    case "find":
      return "Discover";
    case "fly":
      return "Soaring";
    case "bounce":
      return "Bouncy";
    case "share":
      return "Sharing";
    case "wave":
      return "Hello!";
    case "zoom":
      return "Zoom!";
    case "climb":
      return "Climbing";
    case "splash":
      return "Splash!";
    case "dance":
      return "Dancing";
    case "celebrate":
      return "Yay!";
    default:
      return "Story";
  }
}
