import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Gamepad2,
  Pencil,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  LETTERS,
  getLetter,
  letterHeroPath,
  posterPath,
  type WordEntry,
} from "@/data/alphabet";
import { getWordLesson, wordRequiresVideo } from "@/data/word-lessons";
import { CaseHunt } from "@/components/alphabet/CaseHunt";
import { GfxToggle } from "@/components/alphabet/GfxToggle";
import { ThemeToggle } from "@/components/alphabet/ThemeToggle";
import { ISpy } from "@/components/alphabet/ISpy";
import { LayoutToggle } from "@/components/alphabet/LayoutToggle";
import { LetterCompleteBanner } from "@/components/alphabet/LetterCompleteBanner";
import { MatchGame } from "@/components/alphabet/MatchGame";
import { MemoryMatch } from "@/components/alphabet/MemoryMatch";
import { PosterCard } from "@/components/alphabet/PosterCard";
import { PosterLightbox } from "@/components/alphabet/PosterLightbox";
import { PlayerChip } from "@/components/alphabet/ProfileGate";
import { StarBar } from "@/components/alphabet/StarBar";
import { StoryMode } from "@/components/alphabet/StoryMode";
import { TracePad } from "@/components/alphabet/TracePad";
import { VoiceToggle } from "@/components/alphabet/VoiceToggle";
import { WordLessonModal } from "@/components/alphabet/WordLessonModal";
import {
  getLetterChecklist,
  markSection,
  markVisited,
  tryCompleteLetter,
  useProgress,
} from "@/lib/progress";
import { speak, speakLetter } from "@/lib/speak";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/letter/$letter")({
  component: LetterPage,
});

type TabId = "words" | "sound" | "trace" | "games";
type GameId = "match" | "memory" | "ispy" | "story" | "cases";

const TABS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: "words", label: "Words", icon: BookOpen },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "trace", label: "Trace", icon: Pencil },
  { id: "games", label: "Games", icon: Gamepad2 },
];

const GAMES: { id: GameId; label: string; blurb: string }[] = [
  { id: "match", label: "Match", blurb: "Which poster starts with this letter?" },
  { id: "memory", label: "Pairs", blurb: "Match word to picture" },
  { id: "ispy", label: "I Spy", blurb: "Find the picture I say" },
  { id: "story", label: "Story", blurb: "Watch the words in action" },
  { id: "cases", label: "Aa hunt", blurb: "Find upper & lower case" },
];

function LetterPage() {
  const { letter: raw } = Route.useParams();
  const navigate = useNavigate();
  const entry = getLetter(raw);
  const progress = useProgress();
  const [tab, setTab] = useState<TabId>("words");
  const [game, setGame] = useState<GameId>("match");
  const [switching, setSwitching] = useState(false);
  const [lightbox, setLightbox] = useState<WordEntry | null>(null);
  const [lessonWord, setLessonWord] = useState<WordEntry | null>(null);

  useEffect(() => {
    if (!entry) return;
    markVisited(entry.letter);
  }, [entry?.letter]);

  useEffect(() => {
    if (!entry) return;
    tryCompleteLetter(entry.letter);
  }, [entry?.letter, progress.wordsSeen, progress.sections, progress.completed]);

  const idx = useMemo(
    () => LETTERS.findIndex((L) => L.letter === entry?.letter),
    [entry?.letter],
  );
  const prev = idx > 0 ? LETTERS[idx - 1] : null;
  const next = idx >= 0 && idx < LETTERS.length - 1 ? LETTERS[idx + 1] : null;

  if (!entry) {
    return (
      <main className="app-shell-letter">
        <p className="font-display text-xl font-bold">Letter not found</p>
        <Link to="/" className="text-accent underline">
          Back home
        </Link>
      </main>
    );
  }

  const check = getLetterChecklist(entry.letter, progress);
  const isToday = progress.daily.letter === entry.letter;
  const displayLetter = entry.letter;
  const seenSet = new Set(progress.wordsSeen);

  function openWord(w: WordEntry) {
    const lesson = getWordLesson(entry!.letter, w.slug);
    const key = `${entry!.letter.toLowerCase()}-${w.slug}`;
    const seen = seenSet.has(key);
    if (lesson && !seen) {
      setLessonWord(w);
      return;
    }
    if (lesson) {
      // Already unlocked — open lesson modal for replay, or lightbox
      setLessonWord(w);
      return;
    }
    setLightbox(w);
  }

  return (
    <main className="app-shell-letter">
      {switching && (
        // lazy import avoided — ProfileGate switch is on home; keep chip only
        null
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="pressable inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold text-ink"
          >
            <ArrowLeft className="size-4" /> Home
          </Link>
          <PlayerChip onSwitch={() => setSwitching(false)} />
          {isToday && (
            <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
              <Flame className="size-3.5" /> Today's letter
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <VoiceToggle />
          <LayoutToggle compact />
          <GfxToggle compact />
          <ThemeToggle compact />
          <StarBar />
        </div>
      </div>

      <section
        className="relative mb-5 overflow-hidden rounded-[var(--radius-xl)] border-2 border-white/50 p-5 shadow-[var(--shadow-float)] sm:p-7"
        style={{
          background: `linear-gradient(135deg, ${entry.hue} 0%, ${entry.accent} 100%)`,
        }}
      >
        <img
          src={letterHeroPath(entry.letter)}
          alt=""
          className="poster-art pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-3xl object-cover opacity-40 sm:h-52 sm:w-52"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex size-20 items-center justify-center rounded-[1.5rem] bg-white/95 font-display text-5xl font-bold shadow-lg sm:size-24 sm:text-6xl"
              style={{ color: entry.accent }}
            >
              {displayLetter}
            </div>
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-white/80">
                Letter {entry.letter}
              </p>
              <h1 className="font-display text-3xl font-bold drop-shadow sm:text-4xl">
                {entry.name}
              </h1>
              <p className="mt-1 max-w-md text-sm font-semibold text-white/90 sm:text-base">
                {entry.soundHint ?? `Says “${entry.letter.toLowerCase()}”`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                markSection(entry.letter, "sound");
                void speakLetter(entry.letter);
              }}
              className="pressable inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-white/95 px-4 py-2.5 text-sm font-bold shadow"
              style={{ color: entry.accent }}
            >
              <Volume2 className="size-4" /> Hear letter
            </button>
            {prev && (
              <Link
                to="/letter/$letter"
                params={{ letter: prev.letter.toLowerCase() }}
                className="pressable inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-white/20 px-3 py-2.5 text-sm font-bold text-white"
              >
                <ChevronLeft className="size-4" /> {prev.letter}
              </Link>
            )}
            {next && (
              <Link
                to="/letter/$letter"
                params={{ letter: next.letter.toLowerCase() }}
                className="pressable inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-white/20 px-3 py-2.5 text-sm font-bold text-white"
              >
                {next.letter} <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mb-4">
        <LetterCompleteBanner letter={entry.letter} accent={entry.accent} />
      </div>

      <nav
        className="mb-4 flex flex-wrap gap-1.5"
        aria-label="Letter sections"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "letter-tab pressable inline-flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-pill)] border-2 px-3 py-2 text-sm font-bold sm:flex-none",
                active
                  ? "border-transparent text-white"
                  : "border-border bg-surface text-ink-soft",
              )}
              style={active ? { background: entry.accent } : undefined}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === "words" && (
        <section aria-label="Word posters">
          <p className="mb-3 text-sm font-semibold text-ink-soft">
            Tap a poster to watch its story video and unlock the word (
            {check.words}/{check.wordsTotal}).
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {entry.words.map((w) => {
              const key = `${entry.letter.toLowerCase()}-${w.slug}`;
              const seen = seenSet.has(key);
              const needsVideo = wordRequiresVideo(entry.letter, w.slug);
              return (
                <PosterCard
                  key={w.slug}
                  letter={entry.letter}
                  accent={entry.accent}
                  hue={entry.hue}
                  word={w}
                  imageSrc={posterPath(entry.letter, w.slug)}
                  seen={seen}
                  requiresVideo={needsVideo}
                  onOpen={() => openWord(w)}
                />
              );
            })}
          </div>
        </section>
      )}

      {tab === "sound" && (
        <section className="card-surface space-y-4 rounded-[var(--radius-xl)] p-5">
          <h2 className="font-display text-xl font-bold text-ink">Letter sound</h2>
          <p className="text-base font-semibold text-ink-soft">
            {entry.soundHint ?? `The letter ${entry.letter} makes a friendly sound.`}
          </p>
          {entry.rhyme && (
            <p className="rounded-[var(--radius-lg)] bg-surface-soft p-3 text-sm font-bold text-ink">
              Rhyme: {entry.rhyme}
            </p>
          )}
          {entry.funFact && (
            <p className="text-sm font-medium text-ink-soft">
              <Sparkles className="mr-1 inline size-4 text-star" />
              {entry.funFact}
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              markSection(entry.letter, "sound");
              void speak(
                entry.soundHint ??
                  `Letter ${entry.letter}. ${entry.words[0]?.word ?? ""}`,
              );
            }}
            className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] px-5 font-bold text-white"
            style={{ background: entry.accent }}
          >
            <Volume2 className="size-5" /> Play sound lesson
          </button>
          {check.sound && (
            <p className="text-sm font-bold text-success">Sound heard — checklist check!</p>
          )}
        </section>
      )}

      {tab === "trace" && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">Trace {entry.letter}</h2>
          <p className="text-sm font-semibold text-ink-soft">
            Draw over the big letter with your finger or mouse, then tap “I traced it!”
          </p>
          <TracePad
            letter={entry.letter}
            accent={entry.accent}
            onDone={() => tryCompleteLetter(entry.letter)}
          />
        </section>
      )}

      {tab === "games" && (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGame(g.id)}
                className={cn(
                  "pressable rounded-[var(--radius-pill)] border-2 px-3 py-1.5 text-xs font-bold sm:text-sm",
                  game === g.id
                    ? "border-transparent text-white"
                    : "border-border bg-surface text-ink-soft",
                )}
                style={game === g.id ? { background: entry.accent } : undefined}
              >
                {g.label}
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-ink-soft">
            {GAMES.find((g) => g.id === game)?.blurb}
          </p>
          {game === "match" && <MatchGame entry={entry} />}
          {game === "memory" && <MemoryMatch entry={entry} />}
          {game === "ispy" && <ISpy entry={entry} />}
          {game === "story" && <StoryMode entry={entry} />}
          {game === "cases" && <CaseHunt entry={entry} />}
        </section>
      )}

      {lightbox && (
        <PosterLightbox
          letter={entry.letter}
          accent={entry.accent}
          hue={entry.hue}
          word={lightbox}
          imageSrc={posterPath(entry.letter, lightbox.slug)}
          onClose={() => setLightbox(null)}
        />
      )}

      {lessonWord && (() => {
        const lesson = getWordLesson(entry.letter, lessonWord.slug);
        if (!lesson) return null;
        const key = `${entry.letter.toLowerCase()}-${lessonWord.slug}`;
        return (
          <WordLessonModal
            letter={entry.letter}
            accent={entry.accent}
            hue={entry.hue}
            word={lessonWord}
            imageSrc={posterPath(entry.letter, lessonWord.slug)}
            lesson={lesson}
            alreadySeen={seenSet.has(key)}
            onClose={() => setLessonWord(null)}
            onUnlocked={() => tryCompleteLetter(entry.letter)}
          />
        );
      })()}
    </main>
  );
}
