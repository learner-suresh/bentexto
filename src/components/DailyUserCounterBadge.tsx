import React, { useState } from 'react';
import { Users, Calendar, Activity, Info, X } from 'lucide-react';
import { useDailyUserCounter } from '../utils/dailyUserCounter';

interface DailyUserCounterBadgeProps {
  variant?: 'compact' | 'card' | 'inline' | 'header';
  className?: string;
  showModalOnClick?: boolean;
}

export const DailyUserCounterBadge: React.FC<DailyUserCounterBadgeProps> = ({
  variant = 'compact',
  className = '',
  showModalOnClick = false,
}) => {
  const {
    activeFormattedBn,
    activeFormattedEn,
    dailyFormattedBn,
    dailyFormattedEn,
    monthlyFormattedBn,
    monthlyFormattedEn,
    hasRecentlyUpdated,
    isLive,
  } = useDailyUserCounter();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleBadgeClick = (e: React.MouseEvent) => {
    if (showModalOnClick) {
      e.stopPropagation();
      setIsDetailModalOpen(true);
    }
  };

  // 1. INLINE VARIANT (Landing page & Above Game Board)
  if (variant === 'inline') {
    return (
      <>
        <div
          onClick={handleBadgeClick}
          className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-[#15213B] border border-[#253556] text-xs text-gray-300 shadow-xs transition-all ${
            hasRecentlyUpdated ? 'border-emerald-500/60 shadow-emerald-500/10' : 'hover:border-[#0095FF]/40'
          } ${showModalOnClick ? 'cursor-pointer' : ''} ${className}`}
          title={`Real-Time Live Counter — Active Now: ${activeFormattedEn} | Today: ${dailyFormattedEn} | This Month: ${monthlyFormattedEn}`}
        >
          {/* Live Online Now */}
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/30 uppercase tracking-wider">
              LIVE
            </span>
            <span className={`transition-transform duration-300 ${hasRecentlyUpdated ? 'scale-105 text-emerald-300' : ''}`}>
              <strong className="text-emerald-400 font-mono font-bold">{activeFormattedBn}</strong> জন খেলছেন
            </span>
          </span>

          <span className="text-gray-600">|</span>

          {/* Today's Total */}
          <span className="flex items-center gap-1.5 text-gray-300">
            <Users className="h-3 w-3 text-[#38BDF8]" />
            <span>
              আজ: <strong className="text-white font-mono font-bold">{dailyFormattedBn}</strong> জন
            </span>
          </span>

          <span className="text-gray-600">|</span>

          {/* Monthly Total */}
          <span className="flex items-center gap-1.5 text-gray-400">
            <Calendar className="h-3 w-3 text-[#A78BFA]" />
            <span>
              মাসে: <strong className="text-white font-mono font-bold">{monthlyFormattedBn}</strong> জন
            </span>
          </span>
        </div>

        {/* Optional Detail Modal */}
        {isDetailModalOpen && (
          <RealtimeCounterModal
            onClose={() => setIsDetailModalOpen(false)}
            activeFormattedBn={activeFormattedBn}
            activeFormattedEn={activeFormattedEn}
            dailyFormattedBn={dailyFormattedBn}
            dailyFormattedEn={dailyFormattedEn}
            monthlyFormattedBn={monthlyFormattedBn}
            monthlyFormattedEn={monthlyFormattedEn}
            isLive={isLive}
          />
        )}
      </>
    );
  }

  // 2. HEADER VARIANT (Navbar Header Desktop / Tablet)
  if (variant === 'header') {
    return (
      <div
        onClick={handleBadgeClick}
        className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-[11px] text-gray-300 hover:border-[#0095FF]/40 transition shadow-xs ${className}`}
        title={`Live Players: ${activeFormattedEn} | Today's Players: ${dailyFormattedEn} | This Month: ${monthlyFormattedEn}`}
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-mono font-bold">{activeFormattedBn}</span>
          <span className="text-gray-300">লাইভ</span>
        </div>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-1 text-gray-300">
          <Users className="h-3 w-3 text-[#38BDF8]" />
          <span>আজ: <strong className="text-white font-mono">{dailyFormattedBn}</strong></span>
        </div>
      </div>
    );
  }

  // 3. CARD VARIANT (Stats Modal Grid)
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
            <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>Real-Time Live Counter</span>
              <span className="text-gray-400 font-normal text-[11px]">(রিয়েল-টাইম লাইভ কাউন্টার)</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Real-Time Active Now */}
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-emerald-400 mb-1 font-semibold">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-400" />
                <span>Live Active (এখন খেলছেন)</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className={`text-xl font-black text-white font-mono transition-transform duration-200 ${hasRecentlyUpdated ? 'scale-105 text-emerald-300' : ''}`}>
              {activeFormattedBn} <span className="text-xs font-normal text-emerald-400/80">জন</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {activeFormattedEn} active players
            </div>
          </div>

          {/* 2. Today's Total Count */}
          <div className="rounded-lg border border-[#1E2C48] bg-[#15213B]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
              <Users className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Today (আজকে মোট)</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {dailyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {dailyFormattedEn} visitors
            </div>
          </div>

          {/* 3. Monthly Total Count */}
          <div className="rounded-lg border border-[#1E2C48] bg-[#15213B]/60 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1">
              <Calendar className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>This Month (এই মাসে)</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {monthlyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
              {monthlyFormattedEn} visitors
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-[#1E2C48]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            সক্রিয় খেলোয়াড়দের রিয়েল-টাইম হিসাব কয়েক সেকেন্ড পর পর স্বয়ংক্রিয়ভাবে আপডেট হয়।
          </span>
        </div>
      </div>
    );
  }

  // 4. DEFAULT: COMPACT PILL (Header & Floating Badges)
  return (
    <>
      <div
        onClick={handleBadgeClick}
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-xs text-gray-300 hover:border-[#0095FF]/50 transition shadow-xs ${
          hasRecentlyUpdated ? 'border-emerald-500/60' : ''
        } ${showModalOnClick ? 'cursor-pointer' : ''} ${className}`}
        title={`রিয়েল-টাইম লাইভ: ${activeFormattedBn} জন খেলছেন (${activeFormattedEn} online now) • আজকের মোট: ${dailyFormattedBn} • এই মাসে: ${monthlyFormattedBn}`}
      >
        {/* Live Radar Beacon */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        {/* Real-Time Live Players Count */}
        <span className="flex items-center gap-1 text-[11px] sm:text-xs">
          <strong className="text-emerald-400 font-mono font-bold">{activeFormattedBn}</strong>
          <span className="text-gray-300 font-medium">লাইভ</span>
        </span>

        <span className="text-gray-600">|</span>

        {/* Today's Count */}
        <span className="text-[11px] sm:text-xs text-gray-300">
          আজ: <strong className="text-white font-mono font-bold">{dailyFormattedBn}</strong>
        </span>
      </div>

      {isDetailModalOpen && (
        <RealtimeCounterModal
          onClose={() => setIsDetailModalOpen(false)}
          activeFormattedBn={activeFormattedBn}
          activeFormattedEn={activeFormattedEn}
          dailyFormattedBn={dailyFormattedBn}
          dailyFormattedEn={dailyFormattedEn}
          monthlyFormattedBn={monthlyFormattedBn}
          monthlyFormattedEn={monthlyFormattedEn}
          isLive={isLive}
        />
      )}
    </>
  );
};

interface ModalProps {
  onClose: () => void;
  activeFormattedBn: string;
  activeFormattedEn: string;
  dailyFormattedBn: string;
  dailyFormattedEn: string;
  monthlyFormattedBn: string;
  monthlyFormattedEn: string;
  isLive: boolean;
}

function RealtimeCounterModal({
  onClose,
  activeFormattedBn,
  activeFormattedEn,
  dailyFormattedBn,
  dailyFormattedEn,
  monthlyFormattedBn,
  monthlyFormattedEn,
  isLive,
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#253556] bg-[#15213B] p-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2C4A] transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-white text-base">Real-Time Live Counter</h3>
        </div>

        <p className="text-xs text-gray-300 mb-4 leading-relaxed">
          Bentexto-তে এই মুহূর্তে সক্রিয়ভাবে শব্দ অনুমান করছেন এমন খেলোয়াড় এবং প্রতিদিনের ভিজিটরদের রিয়েল-টাইম হিসাব:
        </p>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <Activity className="h-4 w-4" />
              <span>অনলাইনে এখন (Playing Now)</span>
            </div>
            <div className="font-mono font-bold text-white text-base">
              {activeFormattedBn} <span className="text-xs font-normal text-emerald-400">জন</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[#253556] bg-[#0D1527]">
            <div className="flex items-center gap-2 text-gray-300 text-xs font-semibold">
              <Users className="h-4 w-4 text-[#38BDF8]" />
              <span>আজকের খেলোয়াড় (Today)</span>
            </div>
            <div className="font-mono font-bold text-white text-base">
              {dailyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[#253556] bg-[#0D1527]">
            <div className="flex items-center gap-2 text-gray-300 text-xs font-semibold">
              <Calendar className="h-4 w-4 text-[#A78BFA]" />
              <span>এই মাসে (This Month)</span>
            </div>
            <div className="font-mono font-bold text-white text-base">
              {monthlyFormattedBn} <span className="text-xs font-normal text-gray-400">জন</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-2 border-t border-[#253556]">
          <Info className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
          <span>
            ক্রস-ট্যাব এবং লাইভ নেটওয়ার্ক সিঙ্ক সক্রিয় ({isLive ? 'Online ●' : 'Connecting...'})
          </span>
        </div>
      </div>
    </div>
  );
}
