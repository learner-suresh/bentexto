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
  const [tab, setTab] = useState<'consonants' | 'vowels' | 'signs'>('consonants');

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

  return (
    <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50/95 p-3 shadow-lg dark:border-stone-800 dark:bg-stone-900/95">
      {/* Tab Switcher & Close */}
      <div className="mb-2 flex items-center justify-between border-b border-stone-200/80 pb-2 dark:border-stone-800">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setTab('consonants')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              tab === 'consonants'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            ব্যঞ্জনবর্ণ (ক-য়)
          </button>
          <button
            type="button"
            onClick={() => setTab('vowels')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              tab === 'vowels'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            স্বরবর্ণ (অ-ঔ)
          </button>
          <button
            type="button"
            onClick={() => setTab('signs')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              tab === 'signs'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-stone-700 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            কার ও চিহ্ন (া-ৌ)
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Keys Grid */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 py-1">
        {tab === 'consonants' &&
          consonants.map((char) => (
            <button
              key={char}
              type="button"
              onClick={() => onInsertChar(char)}
              className="flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-white font-['Noto_Serif_Bengali'] text-base font-semibold text-stone-800 shadow-xs transition hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
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
              className="flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-white font-['Noto_Serif_Bengali'] text-base font-semibold text-stone-800 shadow-xs transition hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700"
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
              className="flex h-10 items-center justify-center rounded-xl border border-stone-200 bg-white font-['Noto_Serif_Bengali'] text-base font-semibold text-emerald-700 shadow-xs transition hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-emerald-400 dark:hover:bg-stone-700"
            >
              {char}
            </button>
          ))}
      </div>

      {/* Bottom Utility Keys */}
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-stone-200/80 pt-2 dark:border-stone-800">
        <button
          type="button"
          onClick={() => onInsertChar(' ')}
          className="flex-1 rounded-xl border border-stone-200 bg-white py-2 text-xs font-semibold text-stone-600 shadow-xs hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          স্পেস (Space)
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className="flex items-center justify-center gap-1 rounded-xl border border-stone-200 bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-300 active:scale-95 dark:border-stone-700 dark:bg-stone-700 dark:text-stone-200"
        >
          <Delete className="h-4 w-4" />
          <span>মুছুন</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 active:scale-95"
        >
          <CornerDownLeft className="h-4 w-4" />
          <span>জমা দিন</span>
        </button>
      </div>
    </div>
  );
};
