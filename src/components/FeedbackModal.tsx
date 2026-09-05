import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [suggestedWord, setSuggestedWord] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() && !suggestedWord.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('bentexto_user_feedback') || '[]');
      existing.push({
        rating,
        feedback: feedbackText,
        suggestedWord,
        date: new Date().toISOString(),
      });
      localStorage.setItem('bentexto_user_feedback', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText('');
      setSuggestedWord('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#15213B] border border-[#253556] p-6 text-white shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-[#0095FF]/20 text-[#0095FF]">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">মতামত ও পরামর্শ (Feedback)</h3>
            <p className="text-xs text-gray-400">Bentexto আরও সুন্দর করতে আপনার মতামত দিন</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-[#10B981] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">ধন্যবাদ!</h4>
            <p className="text-xs text-gray-300">আপনার মূল্যবান মতামত সফলভাবে সংরক্ষিত হয়েছে।</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                আপনার অভিজ্ঞতা কেমন লেগেছে?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-xl transition-transform hover:scale-110 ${
                      star <= rating ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                নতুন বাংলা শব্দ প্রস্তাব করুন (Word Suggestion)
              </label>
              <input
                type="text"
                value={suggestedWord}
                onChange={(e) => setSuggestedWord(e.target.value)}
                placeholder="যেমন: কুয়াশা, জোছনা, পাহাড়..."
                className="w-full rounded-lg bg-[#1E2C4A] border border-[#2B3E68] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                আপনার মন্তব্য বা অভিযোগ
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
                placeholder="Bentexto সম্পর্কে আপনার মতামত লিখুন..."
                className="w-full rounded-lg bg-[#1E2C4A] border border-[#2B3E68] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0095FF] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] px-4 py-2.5 text-sm font-bold text-white transition active:scale-98 shadow-md"
            >
              <Send className="h-4 w-4" />
              <span>মতামত পাঠান (Send Feedback)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
