import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clapperboard, Flame, Gamepad2, Pencil, Settings2, Volume2 } from "lucide-react";
import {
  LETTERS,
  getLetter,
  letterHeroPath,
  posterPath,
  wordsForCase,
  displayGlyph,
  caseTitle,
  type WordEntry,
} from "@/data/alphabet";
import { getWordLesson, wordRequiresVideo } from "@/data/word-lessons";
import { CaseHunt } from "@/components/alphabet/CaseHunt";
import { ISpy } from "@/components/alphabet/ISpy";
import { LetterCompleteBanner } from "@/components/alphabet/LetterCompleteBanner";
import { MatchGame } from "@/components/alphabet/MatchGame";
import { MemoryMatch } from "@/components/alphabet/MemoryMatch";
import { PosterCard } from "@/components/alphabet/PosterCard";
import { PosterLightbox } from "@/components/alphabet/PosterLightbox";
import { PlayerChip, ProfileGate } from "@/components/alphabet/ProfileGate";
import { StarBar } from "@/components/alphabet/StarBar";
import { StoryMode } from "@/components/alphabet/StoryMode";
import { SoundLesson } from "@/components/alphabet/SoundLesson";
import { TracePad } from "@/components/alphabet/TracePad";
import { MeetBuddyButton, MeetBuddyModal } from "@/components/alphabet/MeetBuddy";
import { WordFriends } from "@/components/alphabet/WordFriends";
import { episodesForLetter } from "@/data/letter-buddies";
import { WordLessonModal } from "@/components/alphabet/WordLessonModal";
import {
  getLetterChecklist,
  markVisited,
  tryCompleteLetter,
  useProgress,
} from "@/lib/progress";
import { speak, speakLetter, primeAudioFromGesture } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { VersionBadge } from "@/components/alphabet/VersionBadge";
import { CaseToggle } from "@/components/alphabet/CaseToggle";
import { useCaseMode } from "@/lib/case-mode";

export const Route = createFileRoute("/letter/$letter")({
  component: LetterPage,
  validateSearch: (s: Record<string, unknown>) => {
    const raw = String(s.tab ?? "");
    const tab =
      raw === "words" || raw === "sound" || raw === "trace" || raw === "games"
        ? raw
        : undefined;
    return tab ? { tab } : {};
  },
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
  { id: "match", label: "Match", blurb: "Hear the sound — tap the picture" },
  { id: "memory", label: "Pairs", blurb: "Find two pictures that match. Tap to hear the word." },
  { id: "ispy", label: "I Hear", blurb: "Listen, then tap that picture" },
  { id: "story", label: "Story", blurb: "Watch the words in action" },
  { id: "cases", label: "Aa sort", blurb: "Sort big and little letters" },
];

function LetterPage() {
  const { letter: raw } = Route.useParams();
  const search = Route.useSearch();
  const entry = getLetter(raw);
  const progress = useProgress();
  const initialTab: TabId =
    search.tab === "words" ||
    search.tab === "sound" ||
    search.tab === "trace" ||
    search.tab === "games"
      ? search.tab
      : "words";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [game, setGame] = useState<GameId>("match");
  const [switching, setSwitching] = useState(false);
  const [lightbox, setLightbox] = useState<WordEntry | null>(null);
  const [lessonWord, setLessonWord] = useState<WordEntry | null>(null);
  const [meetOpen, setMeetOpen] = useState(false);
  const { mode: caseKind } = useCaseMode();

  useEffect(() => {
    if (
      search.tab === "words" ||
      search.tab === "sound" ||
      search.tab === "trace" ||
      search.tab === "games"
    ) {
      setTab(search.tab);
    }
  }, [search.tab]);

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
  const displayLetter = displayGlyph(entry.letter, caseKind);
  const modeTitle = caseTitle(entry.letter, caseKind);
  const modeWords = wordsForCase(entry, caseKind);
  const seenSet = new Set(progress.wordsSeen);
  const modeSeen = modeWords.filter((w) =>
    seenSet.has(`${entry.letter.toLowerCase()}-${w.slug}`),
  ).length;

  function openWord(w: WordEntry) {
    const lesson = getWordLesson(entry!.letter, w.slug);
    if (lesson) {
      primeAudioFromGesture(lesson.word);
      setLessonWord(w);
      return;
    }
    setLightbox(w);
  }

  return (
    <main className="app-shell-letter">
      {switching && (
        <ProfileGate mode="switch" onDone={() => setSwitching(false)} />
      )}

      <div className="letter-toolbar">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/"
            className="pressable inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold text-ink"
          >
            <ArrowLeft className="size-4" /> Home
          </Link>
          <PlayerChip onSwitch={() => setSwitching(true)} />
          {isToday && (
            <span className="hidden items-center gap-1 rounded-[var(--radius-pill)] bg-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary sm:inline-flex">
              <Flame className="size-3.5" /> Today
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <VersionBadge />
          <StarBar compact />
          <Link
            to="/settings"
            className="pressable inline-flex size-10 items-center justify-center rounded-full border-2 border-border bg-surface text-ink"
            aria-label="Settings"
          >
            <Settings2 className="size-5" />
          </Link>
        </div>
      </div>

      <section
        className="relative mb-5 overflow-hidden rounded-[var(--radius-xl)] border-2 border-white/50 p-5 shadow-[var(--shadow-float)] sm:p-7"
        style={{
          background: `linear-gradient(135deg, ${entry.hue} 0%, ${entry.accent} 100%)`,
        }}
      >
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="size-[5.5rem] shrink-0 overflow-hidden rounded-[1.4rem] border-4 border-white/85 shadow-lg sm:size-28">
              <img
                src={letterHeroPath(entry.letter, caseKind)}
                alt=""
                className={`size-full cursor-pointer object-cover object-center ${caseKind === "lower" ? "scale-[1.7]" : ""}`}
                decoding="async"
                onClick={() => setMeetOpen(true)}
              />
            </div>
            <div className="min-w-[4.5rem] text-center text-white">
              <h1 className="font-display font-bold leading-[0.95] drop-shadow">
                <span className="block text-lg font-bold opacity-95 sm:text-xl">
                  {caseKind === "upper" ? "Big" : "small"}
                </span>
                <span className="block text-5xl sm:text-6xl">{displayLetter}</span>
              </h1>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[12.5rem]">
            <button
              type="button"
              onClick={() => {
                void speakLetter(entry.letter);
              }}
              className="pressable inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white/95 px-4 py-2.5 text-sm font-bold shadow"
              style={{ color: entry.accent }}
            >
              <Volume2 className="size-4" /> Hear letter
            </button>
            <MeetBuddyButton entry={entry} onOpen={() => setMeetOpen(true)} />
            {episodesForLetter(entry.letter).length > 0 && (
              <Link
                to="/buddies"
                className="pressable inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white/20 px-4 py-2.5 text-sm font-bold text-white"
              >
                <Clapperboard className="size-4" /> Letter Buddies
              </Link>
            )}
            <div className="flex gap-2">
              {prev ? (
                <Link
                  to="/letter/$letter"
                  params={{ letter: prev.letter.toLowerCase() }}
                  className="pressable inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-[var(--radius-pill)] bg-white/20 px-3 py-2.5 text-sm font-bold text-white"
                >
                  <ChevronLeft className="size-4" /> {displayGlyph(prev.letter, caseKind)}
                </Link>
              ) : (
                <span className="flex-1" />
              )}
              {next ? (
                <Link
                  to="/letter/$letter"
                  params={{ letter: next.letter.toLowerCase() }}
                  className="pressable inline-flex min-h-11 flex-1 items-center justify-center gap-1 rounded-[var(--radius-pill)] bg-white/20 px-3 py-2.5 text-sm font-bold text-white"
                >
                  {displayGlyph(next.letter, caseKind)} <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="flex-1" />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4">
        <CaseToggle letter={entry.letter} accent={entry.accent} className="mb-3" />
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
                "letter-tab pressable inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 px-3 py-3 text-base font-bold sm:flex-none sm:px-5",
                active
                  ? "border-transparent text-white"
                  : "border-border bg-surface text-ink-soft",
              )}
              style={active ? { background: entry.accent } : undefined}
            >
              <Icon className="size-5" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {tab === "words" && (
        <section aria-label="Word posters">
          <p className="mb-3 text-sm font-semibold text-ink-soft">
            {modeTitle} words ({modeSeen}/{modeWords.length}). Tap a poster to
            watch. Switch to {caseKind === "upper" ? "little" : "Big"} for 3
            more ({check.words}/{check.wordsTotal} for the sticker).
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {modeWords.map((w) => {
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
                  caseKind={caseKind}
                  onOpen={() => openWord(w)}
                />
              );
            })}
          </div>
          <WordFriends entry={entry} words={modeWords} />
        </section>
      )}

      {tab === "sound" && (
        <section className="card-surface space-y-4 rounded-[var(--radius-xl)] p-5">
          <SoundLesson entry={entry} caseKind={caseKind} />
        </section>
      )}

      {tab === "trace" && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">Trace {modeTitle}</h2>
          <p className="text-sm font-semibold text-ink-soft">
            Color the whole {caseKind === "upper" ? "big" : "little"} letter
            with your finger — not just one line. A little outside is OK.
          </p>
          <TracePad
            letter={entry.letter}
            accent={entry.accent}
            caseKind={caseKind}
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
          {game === "match" && <MatchGame entry={entry} caseKind={caseKind} />}
          {game === "memory" && <MemoryMatch entry={entry} caseKind={caseKind} />}
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
        const lessonWords = modeWords.filter((w) => getWordLesson(entry.letter, w.slug));
        const i = lessonWords.findIndex((w) => w.slug === lessonWord.slug);
        const prevW = i >= 0 ? lessonWords[(i - 1 + lessonWords.length) % lessonWords.length] : undefined;
        const nextW = i >= 0 ? lessonWords[(i + 1) % lessonWords.length] : undefined;
        const canHop = lessonWords.length > 1;
        return (
          <WordLessonModal
            key={`${entry.letter}-${lessonWord.slug}`}
            letter={entry.letter}
            accent={entry.accent}
            hue={entry.hue}
            word={lessonWord}
            imageSrc={posterPath(entry.letter, lessonWord.slug)}
            lesson={lesson}
            alreadySeen={seenSet.has(key)}
            onClose={() => setLessonWord(null)}
            onUnlocked={() => tryCompleteLetter(entry.letter)}
            onPrev={canHop && prevW ? () => { primeAudioFromGesture(prevW.word); setLessonWord(prevW); } : undefined}
            onNext={canHop && nextW ? () => { primeAudioFromGesture(nextW.word); setLessonWord(nextW); } : undefined}
            caseKind={caseKind}
            prevLabel={prevW?.word}
            nextLabel={nextW?.word}
          />
        );
      })()}

      {meetOpen && (
        <MeetBuddyModal entry={entry} onClose={() => setMeetOpen(false)} />
      )}
    </main>
  );
}
