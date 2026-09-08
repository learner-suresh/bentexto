import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check, Clock, RefreshCw, X, Award } from 'lucide-react';
import { BengaliWord, GuessRecord } from '../types';
import { getTimeUntilMidnight, toBengaliDigits } from '../utils/dateAndStreak';
import { AdBanner } from './AdBanner';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  secretWord: BengaliWord;
  guesses: GuessRecord[];
  dayNumber: number;
  isPractice: boolean;
  hintsUsed: number;
  onPlayAnother: () => void;
  adsEnabled?: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  secretWord,
  guesses,
  dayNumber,
  isPractice,
  hintsUsed,
  onPlayAnother,
  adsEnabled = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(getTimeUntilMidnight());

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilNext(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const totalGuesses = guesses.length;
  const greenCount = guesses.filter(g => g.rank <= 300).length;
  const yellowCount = guesses.filter(g => g.rank > 300 && g.rank <= 1500).length;
  const coldCount = guesses.filter(g => g.rank > 1500).length;

  const handleShare = () => {
    const shareText = `BENTEXTO ${isPractice ? 'Unlimited' : `#${dayNumber}`} 🏆\nগোপন শব্দ: ${secretWord.word}\nআমি ${totalGuesses}টি অনুমানে সমাধান করেছি!\n🟩 ${greenCount}\n🟨 ${yellowCount}\n🟥 ${coldCount}\n\n#Bentexto #BanglaWordGame`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#253556] bg-[#15213B] p-4 sm:p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Trophy Icon */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]/40 shadow-lg animate-bounce">
          <Trophy className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-black text-white uppercase tracking-wide">
          অভিনন্দন! (You Won!)
        </h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {isPractice ? 'Unlimited Practice Puzzle Solved' : `Daily Puzzle #${dayNumber} Completed`}
        </p>

        {/* Secret Word Showcase */}
        <div className="my-5 rounded-xl border border-[#4FD1C5]/50 bg-[#4FD1C5]/10 p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#4FD1C5]">
            গোপন শব্দ (The Secret Word)
          </div>
          <div className="font-['Noto_Serif_Bengali'] text-3xl font-black text-[#4FD1C5] my-1">
            {secretWord.word}
          </div>
          <div className="text-sm font-semibold text-gray-200">
            {secretWord.meaningEn} • <span className="font-mono text-xs text-gray-400">{secretWord.translit}</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            বিভাগ: {secretWord.category}
          </div>
        </div>

        {/* Performance Breakdown across 3 proximity tiers */}
        <div className="grid grid-cols-4 gap-2 mb-5 text-center">
          <div className="rounded-xl border border-[#253556] bg-[#0D1527] p-2.5">
            <div className="text-lg font-black text-white font-mono">
              {totalGuesses}
            </div>
            <div className="text-[10px] uppercase font-semibold text-gray-400">
              Guesses
            </div>
          </div>
          <div className="rounded-xl border border-[#4FD1C5]/30 bg-[#4FD1C5]/10 p-2.5">
            <div className="text-lg font-black text-[#4FD1C5] font-mono">
              {greenCount}
            </div>
            <div className="text-[10px] uppercase font-semibold text-[#4FD1C5]">
              1-300
            </div>
          </div>
          <div className="rounded-xl border border-[#FDE047]/30 bg-[#FDE047]/10 p-2.5">
            <div className="text-lg font-black text-[#FDE047] font-mono">
              {yellowCount}
            </div>
            <div className="text-[10px] uppercase font-semibold text-[#FDE047]">
              301-1500
            </div>
          </div>
          <div className="rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-2.5">
            <div className="text-lg font-black text-[#FB7185] font-mono">
              {coldCount}
            </div>
            <div className="text-[10px] uppercase font-semibold text-[#FB7185]">
              1501+
            </div>
          </div>
        </div>

        {/* Next Daily Word Countdown */}
        {!isPractice && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-[#253556] bg-[#0D1527] px-4 py-2.5">
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
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0095FF] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#0082E6] transition active:scale-98 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'ক্লিপবোর্ডে কপি হয়েছে!' : 'Share Results (শেয়ার করুন)'}</span>
          </button>

          <button
            onClick={onPlayAnother}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#253556] bg-[#0D1527] py-3 text-xs font-bold uppercase tracking-wider text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition active:scale-98 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-[#10B981]" />
            <span>Play Unlimited (আরেকটি নতুন শব্দ)</span>
          </button>
        </div>

        {/* Victory Screen Google Ad Placement */}
        {adsEnabled && (
          <div className="mt-4">
            <AdBanner
              slotType="in-content"
              slotId="1122334455"
              showDismiss={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
