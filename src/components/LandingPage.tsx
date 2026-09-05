import React, { useState } from 'react';
import {
  Calendar,
  MessageSquare,
  Globe,
  Palette,
  HelpCircle,
  Play,
  Sparkles,
  Keyboard,
} from 'lucide-react';
import {
  getCurrentWeekDays,
  getFormattedDate,
  WeekDayInfo,
} from '../utils/dateAndStreak';
import { FeedbackModal } from './FeedbackModal';
import { PreviousGamesModal } from './PreviousGamesModal';
import { LanguageModal } from './LanguageModal';
import { HowToPlayModal } from './HowToPlayModal';
import { LegalModal } from './LegalModal';
import { Logo } from './Logo';
import { AdBanner } from './AdBanner';
import { SideAdBanner } from './SideAdBanner';
import { ResponsiveSideAds } from './ResponsiveSideAds';
import { DailyUserCounterBadge } from './DailyUserCounterBadge';
import { GameStats } from '../types';

interface LandingPageProps {
  onPlayDaily: (dayNumber?: number, dateKey?: string) => void;
  onPlayUnlimited: () => void;
  stats: GameStats;
  currentDayNumber: number;
  currentDateKey: string;
  adsEnabled: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPlayDaily,
  onPlayUnlimited,
  currentDayNumber,
  currentDateKey,
  adsEnabled,
}) => {
  const [weekDays] = useState<WeekDayInfo[]>(() => getCurrentWeekDays());
  const [selectedDayKey, setSelectedDayKey] = useState<string>(currentDateKey);

  // Modals
  const [isPreviousGamesOpen, setIsPreviousGamesOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  const handleToggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  // Find currently selected day from weekDays
  const selectedDay = weekDays.find((d) => d.dateKey === selectedDayKey) || weekDays[weekDays.length - 1];
  const todayFormatted = getFormattedDate();

  const handleSelectDay = (day: WeekDayInfo) => {
    if (day.isFuture) return; // cannot play future days
    setSelectedDayKey(day.dateKey);
    onPlayDaily(day.dayNumber, day.dateKey);
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1527] text-white flex flex-col items-center justify-between p-3 sm:p-6 transition-colors select-none font-sans">
      {/* Responsive Shell with Left & Right Ad sections on Desktop */}
      <div className="w-full max-w-7xl mx-auto flex items-start justify-center gap-4 xl:gap-8 my-auto py-2 sm:py-6">
        {/* Left Side Ad Section (Desktop & Landscape) */}
        <SideAdBanner
          side="left"
          slotId="1002003004"
          adsEnabled={adsEnabled}
        />

        {/* Central Content Column */}
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Brand New Modern Bentexto Logo */}
          <div className="mb-4 flex flex-col items-center text-center">
            <Logo
              size="xl"
              showWordmark={true}
              showSubtitle={true}
              className="justify-center"
            />
            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-2 max-w-xs text-center leading-relaxed">
              Find the secret word by semantic proximity with AI (কৃত্রিম বুদ্ধিমত্তা চালিত বাংলা শব্দ ধাঁধা)
            </p>
          </div>

          {/* User-Friendly Quick Feature Pills & Live Daily Counter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 text-[11px] text-gray-300">
            <DailyUserCounterBadge variant="inline" />
            <span className="inline-flex items-center gap-1 rounded-full bg-[#15213B] border border-[#253556] px-2.5 py-1">
              <Keyboard className="h-3 w-3 text-[#0095FF]" /> Type "bristi" → "বৃষ্টি"
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#15213B] border border-[#253556] px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-[#10B981]" /> Unlimited Guesses
            </span>
          </div>

          {/* Main Section 1: Daily Game Card */}
          <div className="w-full rounded-2xl bg-[#15213B] border border-[#253556] p-4 sm:p-5 mb-4 shadow-xl">
            {/* Header Row: Daily game date + Play button */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-base sm:text-lg text-white">Daily game</span>
                <span className="font-mono text-sm sm:text-base text-gray-300 font-semibold">
                  {todayFormatted}
                </span>
              </div>

              <button
                type="button"
                id="play-daily-btn"
                onClick={() => onPlayDaily(selectedDay.dayNumber, selectedDay.dateKey)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] text-white font-bold px-6 py-2 text-sm transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play</span>
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-[#223150] mb-4"></div>

            {/* 7-Day Mini Calendar Strip (Sun - Sat) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-4">
              {weekDays.map((day) => {
                const isSelected = day.dateKey === selectedDayKey;
                const isCurrentDay = day.isToday;

                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    disabled={day.isFuture}
                    onClick={() => handleSelectDay(day)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all cursor-pointer ${
                      day.isFuture
                        ? 'bg-[#18243E]/50 border-transparent text-gray-600 cursor-not-allowed opacity-40'
                        : isSelected
                        ? 'bg-[#0095FF] border-[#0095FF] text-white shadow-md scale-[1.02]'
                        : isCurrentDay
                        ? 'bg-[#1F2C4C] border-[#0095FF]/60 text-white hover:border-[#0095FF]'
                        : 'bg-[#1B2745] border-[#293A60] text-gray-300 hover:border-gray-400 hover:bg-[#202F52]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold tracking-tight">
                      {day.dayName}
                    </span>
                    <div className="relative mt-0.5">
                      <span className="text-sm sm:text-base font-bold">
                        {day.dayOfMonth}
                      </span>
                      {day.isSolved && (
                        <span className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-[#10B981]"></span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Previous Games Full-width Button */}
            <button
              type="button"
              id="previous-games-btn"
              onClick={() => setIsPreviousGamesOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] text-white font-bold py-2.5 px-4 text-sm transition-all active:scale-98 shadow-md cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Previous games (পূর্ববর্তী খেলা)</span>
            </button>
          </div>

          {/* Main Section 2: Unlimited Card */}
          <div className="w-full rounded-2xl bg-[#15213B] border border-[#253556] p-4 sm:p-5 mb-3 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-base sm:text-lg font-bold text-white">Unlimited Practice</span>
              <span className="text-xl font-bold text-[#4FD1C5] leading-none">∞</span>
            </div>

            <button
              type="button"
              id="play-unlimited-btn"
              onClick={onPlayUnlimited}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] text-white font-bold px-6 py-2 text-sm transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Play</span>
            </button>
          </div>

          {/* Mobile/Tablet Left & Right Responsive Ad Section */}
          <ResponsiveSideAds
            adsEnabled={adsEnabled}
            leftSlotId="1002003004"
            rightSlotId="5006007008"
          />

          {/* Bottom Navigation Links */}
          <div className="flex flex-col items-center gap-3.5 w-full text-sm font-semibold text-gray-300 mt-3">
            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="flex items-center gap-2 hover:text-[#0095FF] transition cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-[#0095FF]" />
              <span>How to Play & FAQ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsLanguageOpen(true)}
              className="flex items-center gap-2 hover:text-[#0095FF] transition cursor-pointer"
            >
              <Globe className="h-4 w-4 text-gray-400" />
              <span>Language & Typing Guide</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTheme}
              className="flex items-center gap-2 hover:text-[#0095FF] transition cursor-pointer"
            >
              <Palette className="h-4 w-4 text-gray-400" />
              <span>Theme (ডার্ক / লাইট)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center gap-2 hover:text-[#0095FF] transition cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <span>Feedback (মতামত)</span>
            </button>

            {/* Legal Links Footer */}
            <div className="flex items-center gap-4 pt-2 text-xs text-gray-400 font-normal">
              <button
                type="button"
                onClick={() => {
                  setLegalTab('privacy');
                  setIsLegalOpen(true);
                }}
                className="hover:text-gray-300 hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('terms');
                  setIsLegalOpen(true);
                }}
                className="hover:text-gray-300 hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Ad Section (Desktop & Landscape) */}
        <SideAdBanner
          side="right"
          slotId="5006007008"
          adsEnabled={adsEnabled}
        />
      </div>

      {/* Bottom Responsive Ad Section across ALL devices */}
      {adsEnabled && (
        <footer className="w-full max-w-4xl mx-auto px-2 pt-2 pb-1">
          <AdBanner
            slotType="bottom"
            slotId="9988776655"
            showDismiss={false}
            className="w-full"
          />
        </footer>
      )}

      {/* Modals */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />

      <PreviousGamesModal
        isOpen={isPreviousGamesOpen}
        onClose={() => setIsPreviousGamesOpen(false)}
        onSelectGame={(dayNum, dayKey) => {
          onPlayDaily(dayNum, dayKey);
        }}
        currentDayNumber={currentDayNumber}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
      />

      <HowToPlayModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </div>
  );
};
