import React from 'react';
import { GuessRecord } from '../types';
import { Trophy } from 'lucide-react';
import { toBengaliDigits } from '../utils/dateAndStreak';

interface GuessCardProps {
  guess: GuessRecord;
  isLatest?: boolean;
}

export const GuessCard: React.FC<GuessCardProps> = ({ guess, isLatest = false }) => {
  const { word, meaningEn, rank, guessNumber } = guess;

  // 3-Tier Semantic Proximity Color System:
  // Rank 1: Full Green Gold Glow (The secret word!)
  // 1 - 300: Mint / Teal Emerald (#4FD1C5 / #10B981) - Close
  // 301 - 1500: Warm Amber Yellow (#FDE047 / #F59E0B) - Medium
  // 1501+: Coral / Salmon Red (#FB7185 / #EF4444) - Far
  const isWin = rank === 1;
  const isClose = rank > 1 && rank <= 300;
  const isMedium = rank > 300 && rank <= 1500;

  let barBg = 'bg-[#FB7185]';
  let badgeStyle = 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30';
  let cardBorder = 'border-[#253556]';

  if (isWin) {
    barBg = 'bg-[#4FD1C5]';
    badgeStyle = 'bg-[#4FD1C5] text-[#0D1527] font-black border border-[#4FD1C5] shadow-sm';
    cardBorder = 'border-[#4FD1C5] ring-1 ring-[#4FD1C5]/40';
  } else if (isClose) {
    barBg = 'bg-[#4FD1C5]';
    badgeStyle = 'bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]/40';
    cardBorder = 'border-[#4FD1C5]/40';
  } else if (isMedium) {
    barBg = 'bg-[#FDE047]';
    badgeStyle = 'bg-[#FDE047]/20 text-[#FDE047] border border-[#FDE047]/40';
    cardBorder = 'border-[#FDE047]/30';
  }

  // Visual proximity percentage
  let barWidth = 10;
  if (isWin) {
    barWidth = 100;
  } else if (isClose) {
    barWidth = Math.round(70 + ((300 - rank) / 300) * 28);
  } else if (isMedium) {
    barWidth = Math.round(35 + ((1500 - rank) / 1200) * 33);
  } else {
    barWidth = Math.max(8, Math.round(32 - (Math.min(rank, 6000) / 6000) * 24));
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-[#15213B] p-3 shadow-sm transition-all duration-300 ${cardBorder} ${
        isLatest ? 'animate-pulse-once ring-1 ring-[#0095FF]' : ''
      }`}
    >
      {/* Background Proximity Bar Fill */}
      <div
        className={`absolute inset-y-0 left-0 opacity-[0.14] transition-all duration-700 ease-out pointer-events-none ${barBg}`}
        style={{ width: `${barWidth}%` }}
      />

      <div className="relative flex items-center justify-between gap-3">
        {/* Left: Guess Number + Word in Bengali + English phonetic/meaning */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs font-semibold text-gray-400 w-5 sm:w-6 shrink-0 text-right">
            {guessNumber}
          </span>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-['Noto_Serif_Bengali'] text-base sm:text-lg font-bold text-white tracking-wide">
                {word}
              </span>
              {isWin && <Trophy className="h-4 w-4 text-[#4FD1C5] shrink-0 animate-bounce" />}
            </div>
            {meaningEn && (
              <span className="block text-[11px] text-gray-400 truncate -mt-0.5">
                {meaningEn}
              </span>
            )}
          </div>
        </div>

        {/* Right: Mini Visual Progress Bar & Rank Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Visual Mini Progress Bar */}
          <div className="hidden sm:block w-24 sm:w-32 h-2.5 rounded-full bg-[#0D1527] border border-[#253556] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barBg}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>

          {/* Rank Pill */}
          <div
            className={`flex min-w-[65px] sm:min-w-[76px] items-center justify-center rounded-lg px-2.5 py-1 text-xs font-mono font-bold ${badgeStyle}`}
          >
            {isWin ? '১ (Win!)' : rank.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
