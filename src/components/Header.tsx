import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle,
  BarChart2,
  Flame,
  RefreshCw,
  ArrowLeft,
  MoreVertical,
  Calendar,
  EyeOff,
  Globe,
  Palette,
  MessageSquare,
  Lightbulb,
  Shield,
} from 'lucide-react';
import { toBengaliDigits } from '../utils/dateAndStreak';
import { Logo } from './Logo';
import { DailyUserCounterBadge } from './DailyUserCounterBadge';

interface HeaderProps {
  dayNumber: number;
  isPractice: boolean;
  currentStreak: number;
  onTogglePractice: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onSurrender: () => void;
  isSolved: boolean;
  surrendered: boolean;
  onGoHome?: () => void;
  onOpenPreviousGames?: () => void;
  onOpenLanguage?: () => void;
  onOpenFeedback?: () => void;
  onRequestHint?: () => void;
  onOpenLegal?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dayNumber,
  isPractice,
  currentStreak,
  onTogglePractice,
  onOpenStats,
  onOpenHelp,
  onSurrender,
  isSolved,
  surrendered,
  onGoHome,
  onOpenPreviousGames,
  onOpenLanguage,
  onOpenFeedback,
  onRequestHint,
  onOpenLegal,
  onOpenAbout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleToggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('light')) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    setMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-[#253556] bg-[#0D1527] sticky top-0 z-40 flex items-center justify-between px-3 sm:px-6 transition-colors">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onGoHome && (
          <button
            type="button"
            id="back-home-btn"
            onClick={onGoHome}
            title="হোম পেজে ফিরুন (Return to Menu)"
            aria-label="Back to home"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#253556] bg-[#15213B] text-gray-300 hover:text-white hover:border-[#0095FF] transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-4 w-4 text-[#0095FF]" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        )}

        {/* Brand New Modern Logo */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer hover:opacity-95 transition"
        >
          <Logo
            size="sm"
            showWordmark={true}
            showSubtitle={false}
          />
          <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#0095FF]/20 text-[#38BDF8] border border-[#0095FF]/30 tracking-tight">
            {isPractice ? 'Practice' : `#${dayNumber}`}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Real-Time Live Players Counter */}
        <div className="hidden xs:block">
          <DailyUserCounterBadge variant="compact" showModalOnClick={true} />
        </div>

        {/* Streak Indicator */}
        {!isPractice && (
          <button
            type="button"
            id="streak-header-btn"
            onClick={onOpenStats}
            title="দৈনিক স্ট্রিক (Daily streak)"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] hover:border-[#F59E0B]/50 transition cursor-pointer text-xs font-bold text-[#F59E0B]"
          >
            <Flame className="h-3.5 w-3.5 fill-[#F59E0B]" />
            <span>{toBengaliDigits(currentStreak)}</span>
          </button>
        )}

        {/* Hint button */}
        {!isSolved && !surrendered && onRequestHint && (
          <button
            type="button"
            id="header-hint-btn"
            onClick={onRequestHint}
            title="ইঙ্গিত নিন (Get a hint)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#15213B] border border-[#253556] hover:border-[#F59E0B] text-gray-200 hover:text-[#FDE047] transition text-xs font-semibold cursor-pointer"
          >
            <Lightbulb className="h-3.5 w-3.5 text-[#FDE047]" />
            <span className="hidden sm:inline">Hint</span>
          </button>
        )}

        {/* Stats Button */}
        <button
          type="button"
          id="header-stats-btn"
          onClick={onOpenStats}
          title="পরিসংখ্যান (Statistics)"
          aria-label="View Game Statistics"
          className="p-1.5 sm:p-2 rounded-lg bg-[#15213B] border border-[#253556] text-gray-300 hover:text-white hover:border-[#0095FF] transition cursor-pointer"
        >
          <BarChart2 className="h-4 w-4" />
        </button>

        {/* How to play Button */}
        <button
          type="button"
          id="header-help-btn"
          onClick={onOpenHelp}
          title="কীভাবে খেলবেন? (How to play)"
          aria-label="How to play instructions"
          className="p-1.5 sm:p-2 rounded-lg bg-[#15213B] border border-[#253556] text-gray-300 hover:text-white hover:border-[#0095FF] transition cursor-pointer hidden xs:inline-flex"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Game 3-Dots Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            id="header-menu-dropdown-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="More options"
            className={`p-1.5 sm:p-2 rounded-lg bg-[#15213B] border transition cursor-pointer ${
              menuOpen
                ? 'border-[#0095FF] text-white'
                : 'border-[#253556] text-gray-300 hover:text-white hover:border-gray-500'
            }`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#15213B] border border-[#253556] shadow-2xl p-1.5 z-50 animate-fade-in text-xs font-medium">
              {/* Real-time live counter status in menu for mobile */}
              <div className="xs:hidden px-2.5 py-2 mb-1.5 rounded-lg bg-[#0D1527] border border-[#253556]/80 flex justify-center">
                <DailyUserCounterBadge variant="compact" showModalOnClick={true} />
              </div>

              {/* Previous Games */}
              {onOpenPreviousGames && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPreviousGames();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-[#0095FF]" />
                  <span>Previous games (অতীত খেলা)</span>
                </button>
              )}

              {/* How to Play */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenHelp();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
              >
                <HelpCircle className="h-4 w-4 text-[#0095FF]" />
                <span>How to play (কীভাবে খেলবেন)</span>
              </button>

              {/* Mode Toggle (Daily / Unlimited) */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onTogglePractice();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 text-[#10B981]" />
                <span>{isPractice ? 'Play Daily game' : 'Play Unlimited ∞'}</span>
              </button>

              {/* Give Up / Reveal Secret Word */}
              {!isSolved && !surrendered && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSurrender();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left cursor-pointer"
                >
                  <EyeOff className="h-4 w-4 text-rose-400" />
                  <span>Give up (শব্দ প্রকাশ করুন)</span>
                </button>
              )}

              <div className="my-1 border-t border-[#253556]"></div>

              {/* Language / Typing guide */}
              {onOpenLanguage && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLanguage();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-[#38BDF8]" />
                  <span>Language & Typing</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={handleToggleTheme}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
              >
                <Palette className="h-4 w-4 text-[#FDE047]" />
                <span>Theme (ডার্ক / লাইট)</span>
              </button>

              {/* Feedback */}
              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenFeedback();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition text-left cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-[#A78BFA]" />
                  <span>Feedback (মতামত)</span>
                </button>
              )}

              {/* About Us */}
              {onOpenAbout && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#1E2C4A] hover:text-gray-200 transition text-left cursor-pointer text-[11px]"
                >
                  <Shield className="h-3.5 w-3.5 text-gray-400" />
                  <span>About Bentexto</span>
                </button>
              )}

              {/* Privacy Policy & Terms */}
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLegal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#1E2C4A] hover:text-gray-200 transition text-left cursor-pointer text-[11px]"
                >
                  <Shield className="h-3.5 w-3.5 text-gray-400" />
                  <span>Privacy Policy & Terms</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
