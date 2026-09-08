import React from 'react';
import { Flame, CheckCircle2, XCircle, MinusCircle, Clock } from 'lucide-react';
import { getDailyStreakHistory } from '../utils/dateAndStreak';
import { GameStats } from '../types';

interface DailyStreakGraphProps {
  stats: GameStats;
}

export const DailyStreakGraph: React.FC<DailyStreakGraphProps> = ({ stats }) => {
  const history = getDailyStreakHistory(14); // 14 days activity graph

  const solvedDaysCount = history.filter(d => d.status === 'won').length;

  return (
    <div className="mb-6 rounded-xl border border-[#253556] bg-[#0D1527] p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-amber-400" />
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
            Daily Streak Graph (দৈনিক স্ট্রিক চিত্র)
          </h4>
        </div>
        <div className="text-[11px] font-mono text-amber-400 font-bold">
          {stats.currentStreak} day{stats.currentStreak === 1 ? '' : 's'} streak 🔥
        </div>
      </div>

      {/* 14-day timeline columns */}
      <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 pt-1">
        {history.map((day) => {
          let bgClass = 'bg-[#15213B] border-[#253556] text-gray-400';
          let indicatorIcon = <MinusCircle className="h-3.5 w-3.5 text-gray-400" />;
          let labelText = 'Missed';

          if (day.status === 'won') {
            bgClass = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
            indicatorIcon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
            labelText = day.guessesCount ? `${day.guessesCount}g` : 'Won';
          } else if (day.status === 'lost') {
            bgClass = 'bg-rose-500/15 border-rose-500/40 text-rose-400';
            indicatorIcon = <XCircle className="h-3.5 w-3.5 text-rose-400" />;
            labelText = 'Given up';
          } else if (day.status === 'pending') {
            bgClass = 'bg-[#0095FF]/15 border-[#0095FF]/50 text-[#38BDF8]';
            indicatorIcon = <Clock className="h-3.5 w-3.5 text-[#0095FF] animate-pulse" />;
            labelText = 'Today';
          }

          return (
            <div
              key={day.dateKey}
              className={`flex flex-col items-center justify-between rounded-lg border p-1 sm:p-1.5 transition ${bgClass} ${
                day.isToday ? 'ring-1 ring-[#0095FF]' : ''
              }`}
              title={`${day.dateKey} (${day.dayName}): ${day.status === 'won' ? `Solved in ${day.guessesCount || 'several'} guesses` : day.status}`}
            >
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                {day.dayName}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-200 my-0.5">
                {day.dayOfMonth}
              </span>
              <div className="my-0.5 flex items-center justify-center">
                {indicatorIcon}
              </div>
              <span className="text-[8px] font-medium truncate max-w-full font-mono">
                {labelText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Stats footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[#253556] pt-2 text-[10px] text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Won ({solvedDaysCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" /> Lost
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-600 inline-block" /> Missed
          </span>
        </div>
        <span className="text-gray-400">Past 14 days</span>
      </div>
    </div>
  );
};
