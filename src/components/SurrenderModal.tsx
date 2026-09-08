import React from 'react';
import { AlertCircle, Eye, RefreshCw, X } from 'lucide-react';
import { BengaliWord } from '../types';
import { AdBanner } from './AdBanner';

interface SurrenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSurrender: () => void;
  secretWord?: BengaliWord;
  hasSurrendered: boolean;
  onPlayAnother: () => void;
  adsEnabled?: boolean;
}

export const SurrenderModal: React.FC<SurrenderModalProps> = ({
  isOpen,
  onClose,
  onConfirmSurrender,
  secretWord,
  hasSurrendered,
  onPlayAnother,
  adsEnabled = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#253556] bg-[#15213B] p-4 sm:p-6 shadow-2xl text-center text-white">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {!hasSurrendered ? (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-white">
              Give up? (শব্দটি প্রকাশ করবেন?)
            </h3>
            <p className="text-xs text-gray-400 mt-2 mb-6 leading-relaxed">
              শব্দটি প্রকাশ করলে আজকের স্ট্রিক বৃদ্ধি পাবে না। আপনি কি নিশ্চিত যে শব্দটি দেখতে চান?
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#253556] bg-[#0D1527] py-2.5 text-xs font-bold uppercase tracking-wider text-gray-200 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
              >
                Keep trying
              </button>
              <button
                onClick={onConfirmSurrender}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition cursor-pointer"
              >
                Reveal word
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDE047]/20 text-[#FDE047] border border-[#FDE047]/30">
              <Eye className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-white">
              গোপন শব্দটি ছিল (The Secret Word):
            </h3>

            {secretWord && (
              <div className="my-4 rounded-xl border border-[#FDE047]/40 bg-[#FDE047]/10 p-4">
                <div className="font-['Noto_Serif_Bengali'] text-3xl font-black text-[#FDE047] my-1">
                  {secretWord.word}
                </div>
                <div className="text-sm font-semibold text-gray-200">
                  {secretWord.meaningEn} ({secretWord.translit})
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  বিভাগ: {secretWord.category}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mt-5">
              <button
                onClick={onPlayAnother}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0095FF] hover:bg-[#0082E6] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Play Unlimited (আরেকটি শব্দ খেলুন)</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-[#253556] bg-[#0D1527] py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition cursor-pointer"
              >
                Close (বন্ধ করুন)
              </button>
            </div>

            {adsEnabled && (
              <div className="mt-4">
                <AdBanner
                  slotType="in-content"
                  slotId="2233445566"
                  showDismiss={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
