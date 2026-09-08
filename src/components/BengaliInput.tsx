import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Languages, ArrowRight, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { transliterateEnglishToBengali, getPhoneticSuggestions } from '../utils/transliterate';
import { VirtualKeyboard } from './VirtualKeyboard';

interface BengaliInputProps {
  onGuess: (word: string) => void;
  disabled?: boolean;
  alreadyGuessedWords: Set<string>;
}

export const BengaliInput: React.FC<BengaliInputProps> = ({
  onGuess,
  disabled = false,
  alreadyGuessedWords,
}) => {
  const [rawInput, setRawInput] = useState('');
  const [bengaliOutput, setBengaliOutput] = useState('');
  const [inputMode, setInputMode] = useState<'phonetic' | 'direct'>('phonetic');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle live transliteration when in phonetic mode
  useEffect(() => {
    if (inputMode === 'phonetic') {
      if (!rawInput) {
        setBengaliOutput('');
        setSuggestions([]);
        return;
      }
      // Check if input is already Bengali
      if (/[\u0980-\u09FF]/.test(rawInput)) {
        setBengaliOutput(rawInput);
        setSuggestions([]);
      } else {
        const converted = transliterateEnglishToBengali(rawInput);
        setBengaliOutput(converted);
        const suggs = getPhoneticSuggestions(rawInput);
        setSuggestions(suggs);
      }
    } else {
      setBengaliOutput(rawInput);
      setSuggestions([]);
    }
    setErrorMsg(null);
  }, [rawInput, inputMode]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled) return;

    const wordToSubmit = (inputMode === 'phonetic' ? bengaliOutput || rawInput : rawInput).trim();

    if (!wordToSubmit) {
      setErrorMsg('অনুগ্রহ করে একটি শব্দ লিখুন (Please type a word)');
      return;
    }

    if (alreadyGuessedWords.has(wordToSubmit)) {
      setErrorMsg(`"${wordToSubmit}" আগেই অনুমান করা হয়েছে (Already guessed)`);
      return;
    }

    onGuess(wordToSubmit);
    setRawInput('');
    setBengaliOutput('');
    setSuggestions([]);
    setErrorMsg(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (suggestedWord: string) => {
    if (disabled) return;
    if (alreadyGuessedWords.has(suggestedWord)) {
      setErrorMsg(`"${suggestedWord}" আগেই অনুমান করা হয়েছে`);
      return;
    }
    onGuess(suggestedWord);
    setRawInput('');
    setBengaliOutput('');
    setSuggestions([]);
    setErrorMsg(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVirtualCharInsert = (char: string) => {
    setRawInput((prev) => prev + char);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVirtualBackspace = () => {
    setRawInput((prev) => prev.slice(0, -1));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-2">
      {/* Live Phonetic Transliteration Preview Card */}
      {inputMode === 'phonetic' && rawInput && (
        <div className="w-full bg-[#15213B] border border-[#0095FF]/40 rounded-xl p-2.5 mb-2 flex items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono text-gray-400 truncate max-w-[120px] sm:max-w-[180px]">
              {rawInput}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[#0095FF] shrink-0" />
            <span className="text-lg font-bold text-white font-['Noto_Serif_Bengali'] truncate">
              {bengaliOutput || rawInput}
            </span>
          </div>

          {/* Quick Alternative Suggestions */}
          {suggestions.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto shrink-0">
              {suggestions.slice(1, 4).map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => handleSuggestionClick(sugg)}
                  className="rounded-md border border-[#253556] bg-[#0D1527] px-2 py-0.5 font-['Noto_Serif_Bengali'] text-xs font-semibold text-gray-300 hover:border-[#0095FF] hover:text-white transition cursor-pointer"
                >
                  {sugg}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setRawInput('')}
            className="p-1 text-gray-400 hover:text-white cursor-pointer"
            title="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Input Form Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#253556] bg-[#15213B] p-1.5 sm:p-2 shadow-md transition focus-within:border-[#0095FF] focus-within:ring-2 focus-within:ring-[#0095FF]/20">
          {/* Main Text Input */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              id="word-guess-input"
              type="text"
              value={rawInput}
              disabled={disabled}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={
                inputMode === 'phonetic'
                  ? "Type word (e.g. bristi, pani)..."
                  : "সরাসরি বাংলায় লিখুন..."
              }
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full bg-transparent px-2 sm:px-2.5 py-1.5 text-sm sm:text-base font-medium text-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          {/* Virtual Keyboard Toggle */}
          <button
            type="button"
            id="virtual-keyboard-toggle"
            onClick={() => setShowVirtualKeyboard((prev) => !prev)}
            title="অন-স্ক্রিন বাংলা কিবোর্ড"
            aria-label="Virtual keyboard"
            className={`rounded-lg p-1.5 sm:p-2 transition cursor-pointer border shrink-0 ${
              showVirtualKeyboard
                ? 'bg-[#0095FF]/20 text-[#38BDF8] border-[#0095FF]/40'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1E2C4A]'
            }`}
          >
            <Keyboard className="h-4 w-4" />
          </button>

          {/* Input Mode Switcher (Phonetic vs Direct) */}
          <button
            type="button"
            id="input-mode-toggle"
            onClick={() => setInputMode((prev) => (prev === 'phonetic' ? 'direct' : 'phonetic'))}
            title={inputMode === 'phonetic' ? 'Switch to Direct Bengali' : 'Switch to Phonetic Typing'}
            className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-[#253556] bg-[#0D1527] px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-500 transition cursor-pointer shrink-0"
          >
            <Languages className="h-3.5 w-3.5 text-[#0095FF]" />
            <span className="hidden xs:inline sm:inline">
              {inputMode === 'phonetic' ? 'Phonetic' : 'বাংলা'}
            </span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            id="submit-guess-btn"
            disabled={disabled || !rawInput.trim()}
            className="flex h-9 sm:h-10 items-center justify-center gap-1 sm:gap-1.5 rounded-lg bg-[#0095FF] px-2.5 sm:px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#0082E6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shrink-0"
          >
            <span>Guess</span>
            <CornerDownLeft className="h-3.5 w-3.5 hidden xs:inline" />
          </button>
        </div>
      </form>

      {/* Error / Validation Message */}
      {errorMsg && (
        <p className="mt-2 text-center text-xs font-semibold text-rose-400 animate-fade-in">
          {errorMsg}
        </p>
      )}

      {/* Quick Starter Chips */}
      {!rawInput && !errorMsg && (
        <div className="mt-2 flex items-center justify-center flex-wrap gap-1.5 text-xs text-gray-400">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">Starter words:</span>
          {['bristi', 'nodi', 'shurjo', 'ful', 'pani'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setRawInput(sample)}
              className="rounded-md bg-[#15213B] border border-[#253556] px-2 py-0.5 font-mono text-[11px] text-gray-300 hover:text-white hover:border-[#0095FF] transition cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      )}

      {/* Virtual Keyboard Component */}
      {showVirtualKeyboard && (
        <VirtualKeyboard
          onInsertChar={handleVirtualCharInsert}
          onBackspace={handleVirtualBackspace}
          onSubmit={handleSubmit}
          onClose={() => setShowVirtualKeyboard(false)}
        />
      )}
    </div>
  );
};
