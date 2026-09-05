import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#253556] bg-[#15213B] p-6 shadow-2xl text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0095FF]/20 text-[#0095FF] border border-[#0095FF]/40">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-black text-white tracking-wide">
            HOW TO PLAY (কীভাবে খেলবেন?)
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Find the secret word with unlimited guesses
          </p>
        </div>

        {/* Content steps */}
        <div className="space-y-4 text-xs sm:text-sm text-gray-300">
          {/* Step 1 */}
          <div className="flex gap-3 items-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0095FF] text-white font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-bold text-white">
                Find the secret word (গোপন শব্দটি খুঁজুন)
              </p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                You have unlimited guesses. An artificial intelligence algorithm calculated the similarity of words to the secret word.
              </p>
            </div>
          </div>

          {/* Step 2: Phonetic Typing */}
          <div className="flex gap-3 items-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0095FF] text-white font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-bold text-white">
                Type phonetically in English or directly in Bengali
              </p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                No Bengali keyboard needed! Type phonetically in normal English letters:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs">
                <span className="rounded-lg border border-[#253556] bg-[#0D1527] px-2.5 py-1">
                  <span className="text-gray-400">bristi</span> → <strong className="text-[#4FD1C5]">বৃষ্টি</strong>
                </span>
                <span className="rounded-lg border border-[#253556] bg-[#0D1527] px-2.5 py-1">
                  <span className="text-gray-400">jol</span> → <strong className="text-[#4FD1C5]">জল</strong>
                </span>
                <span className="rounded-lg border border-[#253556] bg-[#0D1527] px-2.5 py-1">
                  <span className="text-gray-400">onubhob</span> → <strong className="text-[#4FD1C5]">অনুভব</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Proximity Ranking */}
          <div className="flex gap-3 items-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0095FF] text-white font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-bold text-white">
                Word Proximity Colors (রঙ ও দূরত্বের অর্থ)
              </p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                The words were sorted by how similar they are to the secret word:
              </p>
              <div className="mt-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-[#4FD1C5]/50 bg-[#4FD1C5]/10 px-3 py-2">
                  <span className="font-bold text-[#4FD1C5]">Rank 1 (র‍্যাংক ১)</span>
                  <span className="text-xs text-[#4FD1C5] font-semibold">The secret word!</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#253556] bg-[#0D1527] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4FD1C5]"></div>
                    <span className="font-semibold text-white">1 - 300</span>
                  </div>
                  <span className="text-xs text-[#4FD1C5] font-semibold">Very close (কাছাকাছি)</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#253556] bg-[#0D1527] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FDE047]"></div>
                    <span className="font-semibold text-white">301 - 1500</span>
                  </div>
                  <span className="text-xs text-[#FDE047] font-semibold">Warm / Related (মাঝারি)</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#253556] bg-[#0D1527] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FB7185]"></div>
                    <span className="font-semibold text-white">1501+</span>
                  </div>
                  <span className="text-xs text-[#FB7185] font-semibold">Cold / Distant (দূরে)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Daily Midnight Reset */}
          <div className="flex gap-3 items-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0095FF] text-white font-bold text-xs">
              4
            </div>
            <div>
              <p className="font-bold text-white">
                New word every midnight
              </p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                A new secret Bengali word is released every day at midnight. Maintain your daily streak or enjoy unlimited practice anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#0095FF] hover:bg-[#0082E6] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition active:scale-98 cursor-pointer"
          >
            Play Bentexto (খেলা শুরু করুন)
          </button>
        </div>
      </div>
    </div>
  );
};
