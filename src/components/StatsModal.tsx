import React from 'react';
import { X, Flame, Clock } from 'lucide-react';
import { GameStats } from '../types';
import { getTimeUntilMidnight, toBengaliDigits } from '../utils/dateAndStreak';
import { DailyUserCounterBadge } from './DailyUserCounterBadge';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
  isOpen: boolean;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, isOpen }) => {
  if (!isOpen) return null;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const timeUntilNext = getTimeUntilMidnight();

  const distributionValues = Object.values(stats.guessDistribution) as number[];
  const maxDistributionVal = Math.max(1, ...distributionValues);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-[#253556] bg-[#15213B] p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-white tracking-wide">
            STATISTICS (পরিসংখ্যান)
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Daily Game Progress & Guess Breakdown
          </p>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          <div className="rounded-xl border border-[#253556] bg-[#0D1527] p-2.5">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.gamesPlayed}
            </div>
            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Played
            </div>
          </div>

          <div className="rounded-xl border border-[#253556] bg-[#0D1527] p-2.5">
            <div className="text-xl sm:text-2xl font-black text-[#4FD1C5] font-mono">
              {winRate}%
            </div>
            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Win %
            </div>
          </div>

          <div className="rounded-xl border border-[#FDE047]/30 bg-[#FDE047]/10 p-2.5">
            <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-black text-[#FDE047] font-mono">
              <Flame className="h-4 w-4 fill-[#FDE047] text-[#FDE047]" />
              <span>{stats.currentStreak}</span>
            </div>
            <div className="text-[10px] uppercase font-semibold text-[#FDE047] tracking-wider">
              Streak
            </div>
          </div>

          <div className="rounded-xl border border-[#253556] bg-[#0D1527] p-2.5">
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {stats.maxStreak}
            </div>
            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Max
            </div>
          </div>
        </div>

        {/* Guess Count Distribution */}
        <div className="mb-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            GUESS DISTRIBUTION (অনুমান সংখ্যা বিন্যাস)
          </h4>
          <div className="space-y-1.5">
            {Object.entries(stats.guessDistribution).map(([range, count]) => {
              const numCount = Number(count);
              const widthPct = Math.max(8, Math.round((numCount / maxDistributionVal) * 100));
              return (
                <div key={range} className="flex items-center gap-2 text-xs">
                  <span className="w-14 font-mono text-[11px] font-medium text-gray-400 text-right shrink-0">
                    {range}
                  </span>
                  <div className="flex-1 bg-[#0D1527] border border-[#253556] rounded-md h-5 overflow-hidden">
                    <div
                      className="h-full bg-[#0095FF] flex items-center justify-end px-2 text-white font-bold text-[11px] rounded transition-all duration-500 font-mono"
                      style={{ width: `${widthPct}%` }}
                    >
                      {numCount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Active Players Counter */}
        <div className="mb-4">
          <DailyUserCounterBadge variant="card" />
        </div>

        {/* Countdown to Next Day's Word */}
        <div className="flex items-center justify-between rounded-xl border border-[#253556] bg-[#0D1527] p-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-300">
              Next game in:
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-[#0095FF]">
            {timeUntilNext.formatted}
          </span>
        </div>
      </div>
    </div>
  );
};
