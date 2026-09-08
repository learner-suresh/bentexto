import { GameStats, BengaliWord } from '../types';
import { DAILY_WORDS } from '../data/words';

const EPOCH_DATE = new Date('2026-01-01T00:00:00Z').getTime();
const STATS_STORAGE_KEY = 'bentexto_stats_v1';

export function getTodayDayNumber(): number {
  const now = new Date();
  // Use UTC or local midnight for day calculation
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffTime = startOfToday - EPOCH_DATE;
  const dayNumber = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
  return dayNumber;
}

export function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailySecretWord(dayNumber: number): BengaliWord {
  // Deterministic seed based on day number
  const index = Math.abs((dayNumber * 7 + 13) % DAILY_WORDS.length);
  return DAILY_WORDS[index];
}

export function getPracticeSecretWord(excludeId?: string): BengaliWord {
  const pool = DAILY_WORDS.filter(w => w.id !== excludeId);
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || DAILY_WORDS[0];
}

export function toBengaliDigits(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[Number(digit)]);
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return { hours, minutes, seconds, formatted };
}

export function getInitialStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDay: 0,
    lastWonDay: 0,
    guessDistribution: {
      '1-15': 0,
      '16-30': 0,
      '31-50': 0,
      '51-100': 0,
      '100+': 0
    },
    streakHistory: []
  };
}

export function loadUserStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.streakHistory) {
        parsed.streakHistory = [];
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load stats from localStorage', e);
  }
  return getInitialStats();
}

export function saveUserStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function recordGameWin(currentDay: number, totalGuesses: number, isPractice: boolean = false): GameStats {
  const stats = loadUserStats();

  if (isPractice) {
    // Practice games don't count towards daily streak
    stats.gamesPlayed += 1;
    stats.gamesWon += 1;
    saveUserStats(stats);
    return stats;
  }

  // Check if already recorded today's win
  if (stats.lastWonDay === currentDay) {
    return stats;
  }

  stats.gamesPlayed += 1;
  stats.gamesWon += 1;

  // Streak logic: check if consecutive day
  if (stats.lastWonDay === currentDay - 1) {
    stats.currentStreak += 1;
  } else if (stats.lastWonDay < currentDay - 1) {
    stats.currentStreak = 1;
  } else {
    stats.currentStreak = Math.max(1, stats.currentStreak);
  }

  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  stats.lastPlayedDay = currentDay;
  stats.lastWonDay = currentDay;

  // Guess distribution bucket
  if (totalGuesses <= 15) {
    stats.guessDistribution['1-15'] += 1;
  } else if (totalGuesses <= 30) {
    stats.guessDistribution['16-30'] += 1;
  } else if (totalGuesses <= 50) {
    stats.guessDistribution['31-50'] += 1;
  } else if (totalGuesses <= 100) {
    stats.guessDistribution['51-100'] += 1;
  } else {
    stats.guessDistribution['100+'] += 1;
  }

  // Record into streakHistory
  if (!stats.streakHistory) {
    stats.streakHistory = [];
  }
  const todayKey = getTodayDateKey();
  const existingIdx = stats.streakHistory.findIndex(h => h.dateKey === todayKey || h.dayNumber === currentDay);
  const entry = {
    dateKey: todayKey,
    dayNumber: currentDay,
    status: 'won' as const,
    guessesCount: totalGuesses,
    streak: stats.currentStreak
  };
  if (existingIdx >= 0) {
    stats.streakHistory[existingIdx] = entry;
  } else {
    stats.streakHistory.push(entry);
  }

  // Keep last 60 days of history
  if (stats.streakHistory.length > 60) {
    stats.streakHistory = stats.streakHistory.slice(-60);
  }

  saveUserStats(stats);
  return stats;
}

export function getFormattedDate(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const y = d.getFullYear();
  return `${m}/${day}/${y}`;
}

export interface WeekDayInfo {
  dayName: string;
  dayOfMonth: number;
  dateKey: string;
  formattedDate: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isSolved: boolean;
}

export function getCurrentWeekDays(): WeekDayInfo[] {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday
  const todayKey = getTodayDateKey();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: WeekDayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - currentDayOfWeek + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    // Calculate dayNumber relative to epoch
    const diffTime = d.getTime() - EPOCH_DATE;
    const dayNum = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const isToday = dateKey === todayKey;
    const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isFuture = d > new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let isSolved = false;
    try {
      const saved = localStorage.getItem(`bentexto_day_${dateKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        isSolved = !!parsed.isSolved;
      }
    } catch {
      isSolved = false;
    }

    days.push({
      dayName: dayNames[i],
      dayOfMonth: d.getDate(),
      dateKey,
      formattedDate: `${m}/${day}/${y}`,
      dayNumber: dayNum,
      isToday,
      isPast,
      isFuture,
      isSolved,
    });
  }

  return days;
}

export function getPastDaysList(count: number = 20): WeekDayInfo[] {
  const now = new Date();
  const todayKey = getTodayDateKey();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const list: WeekDayInfo[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const diffTime = d.getTime() - EPOCH_DATE;
    const dayNum = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

    let isSolved = false;
    try {
      const saved = localStorage.getItem(`bentexto_day_${dateKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        isSolved = !!parsed.isSolved;
      }
    } catch {
      isSolved = false;
    }

    list.push({
      dayName: dayNames[d.getDay()],
      dayOfMonth: d.getDate(),
      dateKey,
      formattedDate: `${m}/${day}/${y}`,
      dayNumber: dayNum,
      isToday: dateKey === todayKey,
      isPast: i > 0,
      isFuture: false,
      isSolved,
    });
  }

  return list;
}

export function getDailyStreakHistory(daysCount: number = 14): {
  dayName: string;
  dayOfMonth: number;
  dateKey: string;
  dayNumber: number;
  isToday: boolean;
  status: 'won' | 'lost' | 'missed' | 'pending';
  guessesCount?: number;
  streak?: number;
}[] {
  const stats = loadUserStats();
  const now = new Date();
  const todayKey = getTodayDateKey();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = [];

  // Generate for past daysCount days in chronological order (oldest to newest)
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;

    const diffTime = d.getTime() - EPOCH_DATE;
    const dayNum = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const isToday = dateKey === todayKey;

    // Check stats history first
    const historyEntry = stats.streakHistory?.find(h => h.dateKey === dateKey || h.dayNumber === dayNum);

    // Also check localStorage daily save
    let isSavedSolved = false;
    let savedGuessCount: number | undefined = undefined;
    try {
      const saved = localStorage.getItem(`bentexto_day_${dateKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        isSavedSolved = !!parsed.isSolved;
        if (parsed.guesses && Array.isArray(parsed.guesses)) {
          savedGuessCount = parsed.guesses.length;
        }
      }
    } catch {
      // ignore
    }

    let status: 'won' | 'lost' | 'missed' | 'pending' = 'missed';
    if (historyEntry) {
      status = historyEntry.status === 'won' ? 'won' : 'lost';
    } else if (isSavedSolved) {
      status = 'won';
    } else if (isToday) {
      status = 'pending';
    }

    result.push({
      dayName: dayNames[d.getDay()],
      dayOfMonth: d.getDate(),
      dateKey,
      dayNumber: dayNum,
      isToday,
      status,
      guessesCount: historyEntry?.guessesCount || savedGuessCount,
      streak: historyEntry?.streak,
    });
  }

  return result;
}

export function recordGameSurrender(currentDay: number, isPractice: boolean = false): GameStats {
  const stats = loadUserStats();
  if (isPractice) return stats;

  if (stats.lastPlayedDay !== currentDay) {
    stats.gamesPlayed += 1;
    stats.currentStreak = 0; // streak resets on give up
    stats.lastPlayedDay = currentDay;

    if (!stats.streakHistory) {
      stats.streakHistory = [];
    }
    const todayKey = getTodayDateKey();
    const existingIdx = stats.streakHistory.findIndex(h => h.dateKey === todayKey || h.dayNumber === currentDay);
    const entry = {
      dateKey: todayKey,
      dayNumber: currentDay,
      status: 'lost' as const,
      streak: 0
    };
    if (existingIdx >= 0) {
      stats.streakHistory[existingIdx] = entry;
    } else {
      stats.streakHistory.push(entry);
    }

    saveUserStats(stats);
  }
  return stats;
}
