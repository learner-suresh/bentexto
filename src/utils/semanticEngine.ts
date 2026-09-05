import { BengaliWord, GuessRecord } from '../types';
import { VOCABULARY, VocabularyEntry } from '../data/words';

/**
 * Calculates Jaccard & weighted tag similarity between two sets of tags
 */
function calculateTagSimilarity(tagsA: string[], tagsB: string[]): number {
  if (!tagsA || !tagsB || tagsA.length === 0 || tagsB.length === 0) return 0.05;

  const setA = new Set(tagsA.map(t => t.toLowerCase()));
  const setB = new Set(tagsB.map(t => t.toLowerCase()));

  let intersectionCount = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersectionCount++;
  });

  const unionSize = new Set([...tagsA, ...tagsB]).size;
  return intersectionCount / unionSize;
}

/**
 * Levenshtein distance for string / morphological proximity
 */
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Pre-rank all vocabulary words against the target secret word.
 * This generates an authentic semantic ranking spectrum from Rank 1 to N.
 */
export function getPrecomputedRankings(secretWord: BengaliWord): Map<string, { rank: number; similarity: number; entry: VocabularyEntry }> {
  const results: { word: string; score: number; entry: VocabularyEntry }[] = [];

  VOCABULARY.forEach(entry => {
    if (entry.word === secretWord.word) {
      results.push({ word: entry.word, score: 1.0, entry });
      return;
    }

    // Category match score
    const categoryMatch = entry.category === secretWord.category ? 0.35 : 0.0;

    // Tag intersection
    const tagSim = calculateTagSimilarity(entry.tags, secretWord.tags); // 0.0 to 1.0

    // Morphological / root match bonus (e.g. if one contains the other)
    let rootBonus = 0;
    if (entry.word.includes(secretWord.word) || secretWord.word.includes(entry.word)) {
      rootBonus = 0.25;
    }

    // Specific thematic associations for top secret words
    let thematicAffinity = 0;
    const sWord = secretWord.word;
    const eWord = entry.word;

    // Rain / Weather connections
    if (sWord === 'বৃষ্টি') {
      if (['মেঘ', 'জল', 'ছাতা', 'ঝড়', 'বজ্রপাত', 'ইলিশ', 'আকাশ', 'বাতাস', 'নদী'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'নদী') {
      if (['জল', 'সাগর', 'সমুদ্র', 'নৌকা', 'মাছ', 'ইলিশ', 'বৃষ্টি', 'গ্রাম'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'সূর্য') {
      if (['আলো', 'দিন', 'সকাল', 'আকাশ', 'আগুন', 'গরম', 'চাঁদ', 'তারা', 'অন্ধকার'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'বই') {
      if (['কলম', 'খাতা', 'কাগজ', 'কবিতা', 'কবি', 'ছবি', 'গান', 'বন্ধু', 'মন'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'ফুল') {
      if (['গোলাপ', 'শাপলা', 'গাছ', 'পাতা', 'ফল', 'ভালোবাসা', 'উপহার', 'বাগান'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'পাখি') {
      if (['দোয়েল', 'ডানা', 'গাছ', 'আকাশ', 'গান', 'বন', 'বাতাস', 'ডিম'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'চাঁদ') {
      if (['রাত', 'তারা', 'আকাশ', 'আলো', 'সূর্য', 'অন্ধকার', 'সন্ধ্যা', 'রূপ'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'ভালোবাসা') {
      if (['প্রেম', 'মন', 'হৃদয়', 'মা', 'বাবা', 'বন্ধু', 'আনন্দ', 'সুখ', 'হাসি'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    } else if (sWord === 'চা') {
      if (['দুধ', 'মিষ্টি', 'সকাল', 'খাবার', 'ভাত', 'রুটি', 'বন্ধু', 'আড্ডা'].includes(eWord)) {
        thematicAffinity = 0.45;
      }
    }

    const totalRawScore = (tagSim * 0.45) + categoryMatch + thematicAffinity + rootBonus;
    results.push({ word: entry.word, score: totalRawScore, entry });
  });

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  const rankMap = new Map<string, { rank: number; similarity: number; entry: VocabularyEntry }>();

  // Map to distinct rankings
  results.forEach((item, index) => {
    let rank = index + 1; // 1, 2, 3...
    // If exact match
    if (item.word === secretWord.word) {
      rank = 1;
    } else {
      // Curve ranks to mirror semantic distribution (1 to ~5,000)
      if (index > 0 && index <= 15) {
        // High cluster: ranks 2 - 120
        rank = Math.round(2 + (index - 1) * 8);
      } else if (index > 15 && index <= 35) {
        // Warm cluster: ranks 130 - 350
        rank = Math.round(130 + (index - 16) * 11);
      } else if (index > 35 && index <= 55) {
        // Moderate cluster: ranks 360 - 1200
        rank = Math.round(360 + (index - 36) * 42);
      } else {
        // Distant cluster: ranks 1250 - 5500
        rank = Math.round(1250 + (index - 56) * 110);
      }
    }

    // Similarity percentage between 0 and 100
    let similarity = 0;
    if (rank === 1) {
      similarity = 100;
    } else if (rank <= 300) {
      similarity = Math.round(75 + ((300 - rank) / 300) * 24);
    } else if (rank <= 1500) {
      similarity = Math.round(40 + ((1500 - rank) / 1200) * 34);
    } else {
      similarity = Math.max(5, Math.round(39 - (rank / 5000) * 34));
    }

    rankMap.set(item.word, { rank, similarity, entry: item.entry });
  });

  return rankMap;
}

/**
 * Evaluates any user input word against the secret word.
 */
export function evaluateWordGuess(
  guessedWord: string,
  secretWord: BengaliWord,
  rankMap: Map<string, { rank: number; similarity: number; entry: VocabularyEntry }>,
  guessNumber: number
): GuessRecord {
  const cleanGuess = guessedWord.trim();

  // 1. Exact match
  if (cleanGuess === secretWord.word) {
    return {
      word: cleanGuess,
      translit: secretWord.translit,
      meaningEn: secretWord.meaningEn,
      rank: 1,
      similarity: 100,
      guessNumber,
      timestamp: Date.now()
    };
  }

  // 2. Found in precomputed vocabulary map
  if (rankMap.has(cleanGuess)) {
    const data = rankMap.get(cleanGuess)!;
    return {
      word: cleanGuess,
      translit: data.entry.translit,
      meaningEn: data.entry.meaningEn,
      rank: data.rank,
      similarity: data.similarity,
      guessNumber,
      timestamp: Date.now()
    };
  }

  // 3. Fallback for unlisted Bengali words
  // Calculate morphological/character closeness and phonetic heuristics
  const dist = levenshteinDistance(cleanGuess, secretWord.word);
  const maxLen = Math.max(cleanGuess.length, secretWord.word.length);
  const charRatio = Math.max(0, 1 - dist / maxLen);

  // Approximate rank for unknown word
  let rank = Math.round(2500 + (1 - charRatio) * 3500);
  if (charRatio > 0.6) {
    rank = Math.round(400 + (1 - charRatio) * 600);
  }

  const similarity = Math.max(8, Math.round(charRatio * 60 + 15));

  return {
    word: cleanGuess,
    rank,
    similarity,
    guessNumber,
    timestamp: Date.now()
  };
}

/**
 * Returns a hint word or contextual clue
 */
export function getSemanticHintWord(
  secretWord: BengaliWord,
  rankMap: Map<string, { rank: number; similarity: number; entry: VocabularyEntry }>,
  alreadyGuessedWords: Set<string>,
  targetTier: 'close' | 'medium'
): { word: string; rank: number; meaningEn: string } | null {
  const entries = Array.from(rankMap.values())
    .filter(item => item.rank > 1 && !alreadyGuessedWords.has(item.entry.word));

  if (targetTier === 'close') {
    // Look for rank 15 to 150
    const closeMatches = entries.filter(e => e.rank <= 250);
    if (closeMatches.length > 0) {
      const pick = closeMatches[Math.floor(Math.random() * closeMatches.length)];
      return { word: pick.entry.word, rank: pick.rank, meaningEn: pick.entry.meaningEn };
    }
  }

  // Look for rank 250 to 800
  const warmMatches = entries.filter(e => e.rank > 200 && e.rank <= 900);
  if (warmMatches.length > 0) {
    const pick = warmMatches[Math.floor(Math.random() * warmMatches.length)];
    return { word: pick.entry.word, rank: pick.rank, meaningEn: pick.entry.meaningEn };
  }

  return null;
}
