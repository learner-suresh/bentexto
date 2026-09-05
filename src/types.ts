export interface BengaliWord {
  id: string;
  word: string; // e.g. "বৃষ্টি"
  translit: string; // e.g. "bristi" or "brishti"
  meaningEn: string; // e.g. "Rain"
  category: string; // e.g. "Nature / Weather"
  tags: string[]; // e.g. ["weather", "water", "sky", "monsoon", "cloud", "nature"]
  hints?: string[]; // contextual hints
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GuessRecord {
  word: string;
  translit?: string;
  meaningEn?: string;
  rank: number; // 1 is exact match, 2-300 close (green), 301-1500 warm (yellow), 1501+ cold (red)
  similarity: number; // 0 to 100
  guessNumber: number;
  timestamp: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDay: number;
  lastWonDay: number;
  guessDistribution: {
    '1-15': number;
    '16-30': number;
    '31-50': number;
    '51-100': number;
    '100+': number;
  };
}

export interface DailyGameState {
  dayNumber: number;
  dateKey: string;
  guesses: GuessRecord[];
  isSolved: boolean;
  surrendered: boolean;
  hintsUsed: number;
  secretWord: BengaliWord;
}

export type InputMode = 'phonetic' | 'direct';
export type SortMode = 'rank' | 'recent';

