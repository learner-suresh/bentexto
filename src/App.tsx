import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BengaliWord, GuessRecord, GameStats, SortMode } from './types';
import { getPrecomputedRankings, evaluateWordGuess, getSemanticHintWord } from './utils/semanticEngine';
import {
  getTodayDayNumber,
  getTodayDateKey,
  getDailySecretWord,
  getPracticeSecretWord,
  loadUserStats,
  recordGameWin,
  recordGameSurrender,
  getTimeUntilMidnight,
  toBengaliDigits,
} from './utils/dateAndStreak';
import { Header } from './components/Header';
import { BengaliInput } from './components/BengaliInput';
import { GuessCard } from './components/GuessCard';
import { StatsModal } from './components/StatsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { VictoryModal } from './components/VictoryModal';
import { SurrenderModal } from './components/SurrenderModal';
import { PreviousGamesModal } from './components/PreviousGamesModal';
import { LanguageModal } from './components/LanguageModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LandingPage } from './components/LandingPage';
import { AdBanner } from './components/AdBanner';
import { SideAdBanner } from './components/SideAdBanner';
import { ResponsiveSideAds } from './components/ResponsiveSideAds';
import { LegalModal } from './components/LegalModal';
import { AboutModal } from './components/AboutModal';
import { ConsentBanner } from './components/ConsentBanner';
import { DailyUserCounterBadge } from './components/DailyUserCounterBadge';
import {
  Sparkles,
  Lightbulb,
  HelpCircle,
  Trophy,
  RotateCcw,
  EyeOff,
  Clock,
  ArrowUpDown,
  Keyboard,
} from 'lucide-react';

export default function App() {
  // Navigation view: 'landing' vs 'game'
  const [currentView, setCurrentView] = useState<'landing' | 'game'>('landing');

  // Day and Date tracking
  const [dayNumber, setDayNumber] = useState<number>(getTodayDayNumber());
  const [dateKey, setDateKey] = useState<string>(getTodayDateKey());
  const [isPractice, setIsPractice] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bentexto_active_mode') === 'practice';
    } catch {
      return false;
    }
  });

  // Secret Word & Precomputed Ranking Map
  const [secretWord, setSecretWord] = useState<BengaliWord>(() => {
    try {
      const isSavedPractice = localStorage.getItem('bentexto_active_mode') === 'practice';
      if (isSavedPractice) {
        return getPracticeSecretWord();
      }
    } catch {}
    return getDailySecretWord(getTodayDayNumber());
  });
  const [rankMap, setRankMap] = useState(() => getPrecomputedRankings(secretWord));

  // Game state
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [surrendered, setSurrendered] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Sorting & Display
  const [sortMode, setSortMode] = useState<SortMode>('rank');

  // Ads state
  const [adsEnabled, setAdsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('bentexto_ads_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Modals state
  const [stats, setStats] = useState<GameStats>(loadUserStats);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isSurrenderOpen, setIsSurrenderOpen] = useState<boolean>(false);
  const [isPreviousGamesOpen, setIsPreviousGamesOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'contact'>('privacy');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Global keyboard shortcuts for user friendliness (Esc to close, / to focus input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStatsOpen(false);
        setIsHelpOpen(false);
        setIsVictoryOpen(false);
        setIsSurrenderOpen(false);
        setIsPreviousGamesOpen(false);
        setIsLanguageOpen(false);
        setIsFeedbackOpen(false);
        setIsLegalOpen(false);
      } else if (e.key === '/' && currentView === 'game') {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          const inputEl = document.getElementById('word-guess-input');
          if (inputEl) {
            inputEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Countdown timer for footer
  const [countdown, setCountdown] = useState<string>(() => getTimeUntilMidnight().formatted);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recompute rankings whenever the secret word changes
  useEffect(() => {
    const computed = getPrecomputedRankings(secretWord);
    setRankMap(computed);
  }, [secretWord]);

  // Load saved daily game state
  useEffect(() => {
    if (isPractice) {
      // In practice/unlimited mode, ensure daily completion modals are closed
      setIsVictoryOpen(false);
      setIsSurrenderOpen(false);
      return;
    }

    try {
      const storageKey = `bentexto_day_${dateKey}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.guesses && Array.isArray(parsed.guesses)) {
          setGuesses(parsed.guesses);
          setIsSolved(parsed.isSolved || false);
          setSurrendered(parsed.surrendered || false);
          setHintsUsed(parsed.hintsUsed || 0);

          if (parsed.isSolved) {
            setIsVictoryOpen(true);
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore saved daily state', e);
    }
  }, [dateKey, isPractice]);

  // Save daily game state on changes
  useEffect(() => {
    if (isPractice) return;

    try {
      const storageKey = `bentexto_day_${dateKey}`;
      const stateToSave = {
        dateKey,
        dayNumber,
        guesses,
        isSolved,
        surrendered,
        hintsUsed,
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save daily state', e);
    }
  }, [guesses, isSolved, surrendered, hintsUsed, dateKey, dayNumber, isPractice]);

  // Auto-check for midnight transition
  useEffect(() => {
    const checkMidnight = () => {
      const currentToday = getTodayDateKey();
      if (currentToday !== dateKey && !isPractice) {
        setDateKey(currentToday);
        const newDayNumber = getTodayDayNumber();
        setDayNumber(newDayNumber);
        setSecretWord(getDailySecretWord(newDayNumber));
        setGuesses([]);
        setIsSolved(false);
        setSurrendered(false);
        setHintsUsed(0);
      }
    };

    const interval = setInterval(checkMidnight, 10000);
    return () => clearInterval(interval);
  }, [dateKey, isPractice]);

  // Set of words already guessed
  const alreadyGuessedWords = useMemo(() => {
    return new Set(guesses.map((g) => g.word));
  }, [guesses]);

  // Best guess so far
  const bestGuess = useMemo(() => {
    if (guesses.length === 0) return null;
    return [...guesses].sort((a, b) => a.rank - b.rank)[0];
  }, [guesses]);

  // Sorted guesses for list display
  const sortedGuesses = useMemo(() => {
    const list = [...guesses];
    if (sortMode === 'rank') {
      return list.sort((a, b) => a.rank - b.rank);
    }
    // 'recent' order
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [guesses, sortMode]);

  // Handle user guess
  const handleGuess = useCallback(
    (word: string) => {
      if (isSolved || surrendered) return;

      const guessNumber = guesses.length + 1;
      const evaluated = evaluateWordGuess(word, secretWord, rankMap, guessNumber);

      const updated = [evaluated, ...guesses];
      setGuesses(updated);

      if (evaluated.rank === 1) {
        setIsSolved(true);
        const updatedStats = recordGameWin(dayNumber, guessNumber, isPractice);
        setStats(updatedStats);
        setIsVictoryOpen(true);
      }
    },
    [guesses, secretWord, rankMap, isSolved, surrendered, dayNumber, isPractice]
  );

  // Switch to Practice Mode / Next Practice Word
  const handleTogglePractice = () => {
    setIsVictoryOpen(false);
    setIsSurrenderOpen(false);
    setIsPractice(true);
    try {
      localStorage.setItem('bentexto_active_mode', 'practice');
    } catch {}

    const newSecret = getPracticeSecretWord(secretWord.id);
    setSecretWord(newSecret);
    setGuesses([]);
    setIsSolved(false);
    setSurrendered(false);
    setHintsUsed(0);
    setHintMessage(null);
  };

  // Switch back to Daily mode
  const handleReturnToDaily = () => {
    setIsVictoryOpen(false);
    setIsSurrenderOpen(false);
    setIsPractice(false);
    try {
      localStorage.setItem('bentexto_active_mode', 'daily');
    } catch {}

    const dailyWord = getDailySecretWord(dayNumber);
    setSecretWord(dailyWord);

    // Restore daily state
    try {
      const storageKey = `bentexto_day_${dateKey}`;
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setGuesses(parsed.guesses || []);
        setIsSolved(parsed.isSolved || false);
        setSurrendered(parsed.surrendered || false);
        setHintsUsed(parsed.hintsUsed || 0);
      } else {
        setGuesses([]);
        setIsSolved(false);
        setSurrendered(false);
        setHintsUsed(0);
      }
    } catch {
      setGuesses([]);
      setIsSolved(false);
      setSurrendered(false);
      setHintsUsed(0);
    }
    setHintMessage(null);
  };

  // Hint Request: provides a clue or an intelligent closer word
  const handleRequestHint = () => {
    if (isSolved || surrendered) return;

    setHintsUsed((prev) => prev + 1);

    // Reveal a closer related Bengali word
    const hintWord = getSemanticHintWord(
      secretWord,
      rankMap,
      alreadyGuessedWords,
      hintsUsed % 2 === 0 ? 'close' : 'medium'
    );

    if (hintWord) {
      // Auto-submit hint word as a guess
      handleGuess(hintWord.word);
      setHintMessage(
        `ইঙ্গিত (Hint Word): "${hintWord.word}" (${hintWord.meaningEn}) — র‍্যাংক #${hintWord.rank}`
      );
    } else if (secretWord.hints && secretWord.hints.length > 0) {
      const clueIndex = Math.min(hintsUsed, secretWord.hints.length - 1);
      setHintMessage(`ইঙ্গিত (Clue): ${secretWord.hints[clueIndex]}`);
    } else {
      setHintMessage(`শব্দটির বিভাগ: ${secretWord.category} (${secretWord.meaningEn})`);
    }
  };

  // Surrender Confirmation
  const handleConfirmSurrender = () => {
    setSurrendered(true);
    const updatedStats = recordGameSurrender(dayNumber, isPractice);
    setStats(updatedStats);
  };

  // Launch Daily game from landing page or day picker
  const handlePlayDaily = (selectedDayNum?: number, selectedDate?: string) => {
    setIsVictoryOpen(false);
    setIsSurrenderOpen(false);
    const targetDay = selectedDayNum || getTodayDayNumber();
    const targetDateKey = selectedDate || getTodayDateKey();

    setIsPractice(false);
    try {
      localStorage.setItem('bentexto_active_mode', 'daily');
    } catch {}

    setDayNumber(targetDay);
    setDateKey(targetDateKey);
    setSecretWord(getDailySecretWord(targetDay));

    // Check if there is saved data for this day
    try {
      const saved = localStorage.getItem(`bentexto_day_${targetDateKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setGuesses(parsed.guesses || []);
        setIsSolved(!!parsed.isSolved);
        setSurrendered(!!parsed.surrendered);
        setHintsUsed(parsed.hintsUsed || 0);
      } else {
        setGuesses([]);
        setIsSolved(false);
        setSurrendered(false);
        setHintsUsed(0);
      }
    } catch {
      setGuesses([]);
      setIsSolved(false);
      setSurrendered(false);
      setHintsUsed(0);
    }

    setHintMessage(null);
    setCurrentView('game');
  };

  // Launch Unlimited / Practice mode from landing page
  const handlePlayUnlimited = () => {
    setIsVictoryOpen(false);
    setIsSurrenderOpen(false);
    setIsPractice(true);
    try {
      localStorage.setItem('bentexto_active_mode', 'practice');
    } catch {}

    const newWord = getPracticeSecretWord(secretWord.id);
    setSecretWord(newWord);
    setGuesses([]);
    setIsSolved(false);
    setSurrendered(false);
    setHintsUsed(0);
    setHintMessage(null);
    setCurrentView('game');
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  // If in landing page view, render LandingPage
  if (currentView === 'landing') {
    return (
      <LandingPage
        onPlayDaily={handlePlayDaily}
        onPlayUnlimited={handlePlayUnlimited}
        stats={stats}
        currentDayNumber={dayNumber}
        currentDateKey={dateKey}
        adsEnabled={adsEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1527] text-white transition-colors select-none font-['Hind_Siliguri',sans-serif]">
      {/* Top Header */}
      <Header
        dayNumber={dayNumber}
        isPractice={isPractice}
        currentStreak={stats.currentStreak}
        onTogglePractice={handleTogglePractice}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onSurrender={() => setIsSurrenderOpen(true)}
        isSolved={isSolved}
        surrendered={surrendered}
        onGoHome={handleGoHome}
        onOpenPreviousGames={() => setIsPreviousGamesOpen(true)}
        onOpenLanguage={() => setIsLanguageOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onRequestHint={handleRequestHint}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenLegal={() => {
          setLegalTab('privacy');
          setIsLegalOpen(true);
        }}
      />

      {/* Responsive Game Shell with Left & Right Sidebar Ads */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 flex items-start justify-center gap-4 lg:gap-8">
        {/* Left Side Ad - Desktop & Landscape */}
        <SideAdBanner
          side="left"
          slotId="1002003004"
          adsEnabled={adsEnabled}
        />

        {/* Main Game Board Container */}
        <main className="flex-1 max-w-xl w-full mx-auto py-4 sm:py-6 flex flex-col gap-4">
        {/* Game Title & Prompt */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15213B] border border-[#253556] text-xs font-mono text-[#0095FF] font-bold uppercase tracking-wider">
              {isPractice ? 'Unlimited Practice' : `Game #${dayNumber}`}
            </div>
            <DailyUserCounterBadge variant="inline" showModalOnClick={true} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Find the secret word (গোপন শব্দটি খুঁজুন)
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto leading-relaxed">
            You have unlimited guesses. An artificial intelligence algorithm calculated the similarity of words to find the secret word.
          </p>
        </div>

        {/* Practice Mode Alert if active */}
        {isPractice && (
          <div className="flex items-center justify-between rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-2 text-xs text-[#10B981]">
            <div className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Unlimited Practice Mode</span>
            </div>
            <button
              onClick={handleReturnToDaily}
              className="font-bold underline underline-offset-2 hover:opacity-80 transition cursor-pointer"
            >
              Play Daily #{dayNumber}
            </button>
          </div>
        )}

        {/* Bengali & Phonetic Input Box */}
        <BengaliInput
          onGuess={handleGuess}
          disabled={isSolved || surrendered}
          alreadyGuessedWords={alreadyGuessedWords}
        />

        {/* Controls and Stats Bar below input */}
        <div className="flex items-center justify-between gap-2 text-xs border-b border-[#253556] pb-3">
          {/* Guesses Counter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-semibold uppercase text-[11px] tracking-wider">
              Guesses:
            </span>
            <span className="rounded-lg bg-[#15213B] border border-[#253556] px-2.5 py-0.5 font-mono font-bold text-white text-xs">
              {guesses.length}
            </span>
          </div>

          {/* Best Guess Snapshot if available */}
          {bestGuess && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs truncate">
              <span className="text-gray-400 text-[11px]">Best:</span>
              <span className="font-['Noto_Serif_Bengali'] font-bold text-white">
                {bestGuess.word}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                  bestGuess.rank <= 300
                    ? 'bg-[#4FD1C5]/20 text-[#4FD1C5]'
                    : bestGuess.rank <= 1500
                    ? 'bg-[#FDE047]/20 text-[#FDE047]'
                    : 'bg-[#FB7185]/20 text-[#FB7185]'
                }`}
              >
                #{bestGuess.rank}
              </span>
            </div>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isSolved && !surrendered && (
              <button
                type="button"
                onClick={handleRequestHint}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-[#FDE047] hover:border-[#FDE047] transition text-xs font-semibold cursor-pointer"
                title="Get a closer clue"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Hint</span>
              </button>
            )}

            {!isSolved && !surrendered && (
              <button
                type="button"
                onClick={() => setIsSurrenderOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-rose-400 hover:border-rose-400 transition text-xs font-semibold cursor-pointer"
                title="Give up and reveal word"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Give up</span>
              </button>
            )}

            {/* Sort Toggle */}
            {guesses.length > 1 && (
              <div className="flex items-center rounded-lg border border-[#253556] bg-[#15213B] p-0.5">
                <button
                  type="button"
                  onClick={() => setSortMode('rank')}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase transition cursor-pointer ${
                    sortMode === 'rank'
                      ? 'bg-[#0095FF] text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Rank
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode('recent')}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase transition cursor-pointer ${
                    sortMode === 'recent'
                      ? 'bg-[#0095FF] text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Recent
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hint banner if active */}
        {hintMessage && (
          <div className="rounded-xl border border-[#FDE047]/40 bg-[#FDE047]/10 p-3 text-xs text-[#FDE047] flex items-start justify-between gap-2 animate-fade-in shadow-md">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-[#FDE047] mt-0.5" />
              <span className="leading-relaxed">{hintMessage}</span>
            </div>
            <button
              onClick={() => setHintMessage(null)}
              className="text-[#FDE047] hover:text-white font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Solved Banner */}
        {isSolved && (
          <div className="rounded-2xl border border-[#4FD1C5] bg-[#4FD1C5]/10 p-4 text-center animate-fade-in shadow-lg">
            <div className="flex items-center justify-center gap-2 text-[#4FD1C5] font-bold text-sm">
              <Trophy className="h-5 w-5" />
              <span>You found the secret word! (আপনি গোপন শব্দটি খুঁজে পেয়েছেন!)</span>
            </div>
            <div className="font-['Noto_Serif_Bengali'] text-3xl font-black text-[#4FD1C5] my-2">
              {secretWord.word}
            </div>
            <p className="text-xs text-gray-300">
              {secretWord.meaningEn} ({secretWord.translit}) • {guesses.length} guesses
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => setIsVictoryOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0095FF] hover:bg-[#0082E6] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition cursor-pointer"
              >
                View Result & Share
              </button>
              <button
                onClick={handleTogglePractice}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#253556] bg-[#15213B] hover:bg-[#1E2C4A] px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-200 transition cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Play Unlimited</span>
              </button>
            </div>
          </div>
        )}

        {/* Surrendered Banner */}
        {surrendered && !isSolved && (
          <div className="rounded-2xl border border-[#FDE047]/50 bg-[#FDE047]/10 p-4 text-center animate-fade-in shadow-lg">
            <div className="text-xs font-bold text-[#FDE047] uppercase tracking-wider">
              The secret word was (গোপন শব্দটি ছিল):
            </div>
            <div className="font-['Noto_Serif_Bengali'] text-3xl font-black text-[#FDE047] my-2">
              {secretWord.word}
            </div>
            <p className="text-xs text-gray-300">
              {secretWord.meaningEn} ({secretWord.translit})
            </p>
            <button
              onClick={handleTogglePractice}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#0095FF] hover:bg-[#0082E6] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try another word (Unlimited)</span>
            </button>
          </div>
        )}

        {/* Guesses List */}
        <div className="space-y-2 w-full">
          {sortedGuesses.map((guess, index) => (
            <GuessCard
              key={`${guess.word}-${guess.timestamp}`}
              guess={guess}
              isLatest={index === 0 && sortMode === 'recent'}
            />
          ))}
        </div>

        {/* Empty State / Starter Prompt */}
        {guesses.length === 0 && !isSolved && (
          <div className="mt-2 rounded-2xl border border-dashed border-[#253556] p-8 text-center bg-[#15213B]/50">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0D1527] border border-[#253556] text-[#0095FF]">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">
              No guesses yet
            </h4>
            <p className="mt-1.5 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Type any Bengali word or write phonetically in English (e.g. <code className="font-mono text-[#0095FF] font-bold">bristi</code>, <code className="font-mono text-[#0095FF] font-bold">pani</code>, <code className="font-mono text-[#0095FF] font-bold">nodi</code>).
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleGuess('মেঘ')}
                className="rounded-xl border border-[#253556] bg-[#0D1527] px-3.5 py-1.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-200 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
              >
                "মেঘ" (Cloud)
              </button>
              <button
                onClick={() => handleGuess('জল')}
                className="rounded-xl border border-[#253556] bg-[#0D1527] px-3.5 py-1.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-200 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
              >
                "জল" (Water)
              </button>
              <button
                onClick={() => handleGuess('সূর্য')}
                className="rounded-xl border border-[#253556] bg-[#0D1527] px-3.5 py-1.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-200 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
              >
                "সূর্য" (Sun)
              </button>
              <button
                onClick={() => handleGuess('নদী')}
                className="rounded-xl border border-[#253556] bg-[#0D1527] px-3.5 py-1.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-200 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
              >
                "নদী" (River)
              </button>
              <button
                onClick={() => handleGuess('পাখি')}
                className="rounded-xl border border-[#253556] bg-[#0D1527] px-3.5 py-1.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-200 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
              >
                "পাখি" (Bird)
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-mono">
              <Keyboard className="h-3.5 w-3.5 text-[#0095FF]" />
              <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#0D1527] border border-[#253556] text-white font-bold">/</kbd> to quick-focus input anytime</span>
            </div>
          </div>
        )}

        {/* Mobile / Tablet Responsive Left & Right Ad Units */}
        <ResponsiveSideAds
          adsEnabled={adsEnabled}
          leftSlotId="1002003004"
          rightSlotId="5006007008"
        />
      </main>

        {/* Right Side Ad - Desktop & Landscape */}
        <SideAdBanner
          side="right"
          slotId="5006007008"
          adsEnabled={adsEnabled}
        />
      </div>

      {/* Bottom Responsive Ad Section across all devices */}
      {adsEnabled && (
        <div className="w-full max-w-4xl mx-auto px-2 pb-2">
          <AdBanner
            slotType="bottom"
            slotId="9988776655"
            showDismiss={false}
            className="w-full"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="h-12 border-t border-[#253556] bg-[#0D1527] flex items-center justify-between px-4 sm:px-8 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span>NEXT WORD IN:</span>
          <span className="font-bold text-[#0095FF]">{countdown}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-widest text-gray-400">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="hover:text-white transition cursor-pointer"
          >
            How to play
          </button>
          <span>•</span>
          <button
            onClick={() => setIsAboutOpen(true)}
            className="hover:text-white transition cursor-pointer"
          >
            About
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setLegalTab('privacy');
              setIsLegalOpen(true);
            }}
            className="hover:text-white transition cursor-pointer"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setLegalTab('terms');
              setIsLegalOpen(true);
            }}
            className="hover:text-white transition cursor-pointer"
          >
            Terms
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setLegalTab('contact');
              setIsLegalOpen(true);
            }}
            className="hover:text-white transition cursor-pointer"
          >
            Contact
          </button>
          <span>•</span>
          <span>BENTEXTO • BENGALI WORD GAME</span>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenLegal={(tab) => {
          setLegalTab(tab);
          setIsLegalOpen(true);
        }}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <VictoryModal
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
        secretWord={secretWord}
        guesses={guesses}
        dayNumber={dayNumber}
        isPractice={isPractice}
        hintsUsed={hintsUsed}
        onPlayAnother={handleTogglePractice}
        adsEnabled={adsEnabled}
      />

      <SurrenderModal
        isOpen={isSurrenderOpen}
        onClose={() => setIsSurrenderOpen(false)}
        onConfirmSurrender={handleConfirmSurrender}
        secretWord={secretWord}
        hasSurrendered={surrendered}
        onPlayAnother={handleTogglePractice}
        adsEnabled={adsEnabled}
      />

      <PreviousGamesModal
        isOpen={isPreviousGamesOpen}
        onClose={() => setIsPreviousGamesOpen(false)}
        onSelectGame={handlePlayDaily}
        currentDayNumber={dayNumber}
      />

      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Cookie & Privacy Consent Banner (GDPR / CCPA / AdSense) */}
      <ConsentBanner
        onOpenPrivacy={() => {
          setLegalTab('privacy');
          setIsLegalOpen(true);
        }}
      />
    </div>
  );
}
