import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { useDailyUserCounter } from '../utils/dailyUserCounter';

interface DailyUserCounterBadgeProps {
  variant?: 'compact' | 'card' | 'inline' | 'header';
  className?: string;
}

export const DailyUserCounterBadge: React.FC<DailyUserCounterBadgeProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const {
    dailyFormattedBn,
    dailyFormattedEn,
    monthlyFormattedBn,
    monthlyFormattedEn,
  } = useDailyUserCounter();

  if (variant === 'inline') {
    return (
      <div
        className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-[#15213B] border border-[#253556] text-xs text-gray-300 shadow-xs ${className}`}
        title={`Live Visitors — Today: ${dailyFormattedEn} | This Month: ${monthlyFormattedEn}`}
      >
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="h-3 w-3 text-[#38BDF8]" />
          <span>
            আজ: <strong className="text-white font-mono font-bold">{dailyFormattedBn}</strong> জন
          </span>
        </span>

        <span className="text-gray-600">|</span>

        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-[#A78BFA]" />
          <span>
            এই মাসে: <strong className="text-white font-mono font-bold">{monthlyFormattedBn}</strong> জন
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div
        className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-[11px] text-gray-300 hover:border-[#0095FF]/40 transition shadow-xs ${className}`}
        title={`Today's Players: ${dailyFormattedEn} | This Month: ${monthlyFormattedEn}`}
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="h-3 w-3 text-[#38BDF8]" />
          <span>আজ: <strong className="text-white font-mono">{dailyFormattedBn}</strong></span>
        </div>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-1 text-gray-400">
          <Calendar className="h-3 w-3 text-[#A78BFA]" />
          <span>মাসিক: <strong className="text-white font-mono">{monthlyFormattedBn}</strong></span>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`rounded-xl border border-[#253556] bg-[#0D1527] p-3.5 flex flex-col gap-3 shadow-inner ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              Live Visitors Counter (লাইভ ভিজিটর ট্র্যাকার)
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Today's Count */}
          <div className="rounded-lg border border-[#1E2C48] bg-[#15213B]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
              <Users className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Today (আজকে)</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {dailyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {dailyFormattedEn} visitors
            </div>
          </div>

          {/* Monthly Count */}
          <div className="rounded-lg border border-[#1E2C48] bg-[#15213B]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
              <Calendar className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>This Month (এই মাসে)</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {monthlyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {monthlyFormattedEn} visitors
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: compact pill
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-xs text-gray-300 hover:border-[#0095FF]/50 transition shadow-xs ${className}`}
      title={`Live Visitors — Today: ${dailyFormattedEn} | This Month: ${monthlyFormattedEn}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Users className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
      <span className="text-[11px] sm:text-xs">
        আজ: <strong className="text-white font-mono font-bold">{dailyFormattedBn}</strong>
      </span>
      <span className="text-gray-600">|</span>
      <span className="text-[11px] sm:text-xs text-gray-400">
        মাসিক: <strong className="text-white font-mono">{monthlyFormattedBn}</strong>
      </span>
    </div>
  );
};
