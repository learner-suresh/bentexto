import React, { useState } from 'react';
import { Delete, CornerDownLeft, Sparkles, X } from 'lucide-react';

interface VirtualKeyboardProps {
  onInsertChar: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onInsertChar,
  onBackspace,
  onSubmit,
  onClose,
}) => {
  const [tab, setTab] = useState<'consonants' | 'vowels' | 'signs' | 'juktakkhor'>('consonants');

  const vowels = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'];
  const signs = ['া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ', '্', 'ং', 'ঃ', 'ঁ', 'ৎ'];
  const consonants = [
    'ক', 'খ', 'গ', 'ঘ', 'ঙ',
    'চ', 'ছ', 'জ', 'ঝ', 'ঞ',
    'ট', 'ঠ', 'ড', 'ঢ', 'ণ',
    'ত', 'থ', 'দ', 'ধ', 'ন',
    'প', 'ফ', 'ব', 'ভ', 'ম',
    'য', 'র', 'ল', 'শ', 'ষ',
    'স', 'হ', 'ড়', 'ঢ়', 'য়'
  ];

  // Most frequent Bengali conjuncts & special ligatures (যুক্তাক্ষর / Ligatures)
  const juktakkhor = [
    'কৃ', 'ক্ষ', 'জ্ঞ', 'ত্র', 'শ্র', 'দ্ব', 'দ্ধ', 'ন্ত', 'ন্দ',
    'গৃহ', 'তৃ', 'দৃ', 'পৃ', 'বৃ', 'মৃ', 'সৃ', 'হৃ', 'স্মৃতি',
    'ঞ্চ', 'ঞ্ছ', 'ঞ্জ', 'স্ত', 'স্থ', 'স্প', 'স্ক', 'স্খ', 'স্ম',
    'স্ন', 'স্ল', 'স্ব', 'ষ্ট', 'ষ্ঠ', 'ষ্ণ', 'ষ্প', 'ষ্ক', 'ষ্ম',
    'ক্ট', 'ক্ত', 'ক্ক', 'ক্ল', 'ক্র', 'গ্ধ', 'গ্ন', 'গ্র', 'গ্ল',
    'চ্চ', 'চ্ছ', 'জ্জ', 'জ্ঞ', 'ট্ট', 'ড্ড', 'ত্ত', 'ত্থ', 'ত্ন',
    'ত্ম', 'ত্ব', 'ত্য', 'দ্দ', 'দ্ধ', 'দ্ম', 'দ্র', 'ন্ধ', 'ন্থ',
    'ন্ন', 'ন্ম', 'প্ট', 'প্ন', 'প্প', 'প্ল', 'প্র', 'প্স', 'ফ্র',
    'ব্দ', 'ব্ধ', 'ব্ব', 'ব্র', 'ব্ল', 'ভ্র', 'ম্ন', 'ম্প', 'ম্ফ',
    'ম্ব', 'ম্ভ', 'ম্ম', 'ম্র', 'ম্ল', 'ল্ক', 'ল্ট', 'ল্ড', 'ল্প',
    'ল্ল', 'হ্ণ', 'হ্ন', 'হ্ম', 'হ্য', 'হ্র', 'হ্ল', 'হ্ব'
  ];

  const quickShortcuts = ['কৃ', 'ক্ষ', 'জ্ঞ', 'ত্র', 'শ্র', 'বৃষ্টি', 'সৃষ্টি', 'দৃষ্টি', 'হৃদয়'];

  return (
    <div className="mt-3 rounded-2xl border border-[#253556] bg-[#15213B] p-2 sm:p-3 shadow-xl text-white">
      {/* Tab Switcher & Close */}
      <div className="mb-2 flex items-center justify-between border-b border-[#253556] pb-2">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setTab('consonants')}
            className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              tab === 'consonants'
                ? 'bg-[#0095FF] text-white shadow-md'
                : 'bg-[#0D1527] text-gray-300 hover:bg-[#1E2C4A] hover:text-white border border-[#253556]'
            }`}
          >
            ব্যঞ্জনবর্ণ
          </button>
          <button
            type="button"
            onClick={() => setTab('juktakkhor')}
            className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              tab === 'juktakkhor'
                ? 'bg-[#10B981] text-white shadow-md'
                : 'bg-[#0D1527] text-gray-300 hover:bg-[#1E2C4A] hover:text-white border border-[#253556]'
            }`}
          >
            যুক্তাক্ষর (Juktakkhor)
          </button>
          <button
            type="button"
            onClick={() => setTab('vowels')}
            className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              tab === 'vowels'
                ? 'bg-[#0095FF] text-white shadow-md'
                : 'bg-[#0D1527] text-gray-300 hover:bg-[#1E2C4A] hover:text-white border border-[#253556]'
            }`}
          >
            স্বরবর্ণ
          </button>
          <button
            type="button"
            onClick={() => setTab('signs')}
            className={`rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition cursor-pointer ${
              tab === 'signs'
                ? 'bg-[#0095FF] text-white shadow-md'
                : 'bg-[#0D1527] text-gray-300 hover:bg-[#1E2C4A] hover:text-white border border-[#253556]'
            }`}
          >
            কার ও চিহ্ন
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Ligature & Ri-kar bar */}
      <div className="mb-2 flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-bold text-emerald-400 shrink-0 flex items-center gap-0.5">
          <Sparkles className="h-3 w-3 inline" /> দ্রুত:
        </span>
        {quickShortcuts.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onInsertChar(s)}
            className="rounded-md border border-[#10B981]/30 bg-[#0D1527] px-2 py-0.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-[#6EE7B7] hover:bg-[#10B981]/20 hover:border-[#10B981] transition cursor-pointer shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Keys Grid */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1 sm:gap-1.5 py-1 max-h-48 overflow-y-auto">
        {tab === 'consonants' &&
          consonants.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl border border-[#253556] bg-[#0D1527] font-['Noto_Serif_Bengali'] text-base sm:text-lg font-semibold text-white shadow-xs transition hover:bg-[#1E2C4A] hover:border-[#0095FF] active:scale-95 cursor-pointer"
            >
              {char}
            </button>
          ))}

        {tab === 'juktakkhor' &&
          juktakkhor.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl border border-[#10B981]/40 bg-[#0D1527] font-['Noto_Serif_Bengali'] text-base sm:text-lg font-semibold text-[#6EE7B7] shadow-xs transition hover:bg-[#10B981]/20 hover:border-[#10B981] active:scale-95 cursor-pointer"
            >
              {char}
            </button>
          ))}

        {tab === 'vowels' &&
          vowels.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl border border-[#253556] bg-[#0D1527] font-['Noto_Serif_Bengali'] text-base sm:text-lg font-semibold text-white shadow-xs transition hover:bg-[#1E2C4A] hover:border-[#0095FF] active:scale-95 cursor-pointer"
            >
              {char}
            </button>
          ))}

        {tab === 'signs' &&
          signs.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="flex h-9 sm:h-10 items-center justify-center rounded-lg sm:rounded-xl border border-[#253556] bg-[#0D1527] font-['Noto_Serif_Bengali'] text-base sm:text-lg font-semibold text-[#38BDF8] shadow-xs transition hover:bg-[#1E2C4A] hover:border-[#0095FF] active:scale-95 cursor-pointer"
            >
              {char}
            </button>
          ))}
      </div>

      {/* Bottom Utility Keys */}
      <div className="mt-2 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-[#253556] pt-2">
        <button
          type="button"
          onClick={() => onInsertChar(' ')}
          className="flex-1 rounded-lg sm:rounded-xl border border-[#253556] bg-[#0D1527] py-2 text-xs font-semibold text-gray-300 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          স্পেস (Space)
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-[#253556] bg-[#1E2C4A] px-3 sm:px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition active:scale-95 cursor-pointer"
        >
          <Delete className="h-4 w-4" />
          <span>মুছুন</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-[#0095FF] px-3.5 sm:px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#0082E6] active:scale-95 transition cursor-pointer"
        >
          <CornerDownLeft className="h-4 w-4" />
          <span>জমা দিন</span>
        </button>
      </div>
    </div>
  );
};
