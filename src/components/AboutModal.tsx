import React from 'react';
import { X, Info, ShieldCheck, Heart, Sparkles, Brain, BookOpen, Mail, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
  onOpenFeedback?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenLegal,
  onOpenFeedback,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#253556] bg-[#121E36] shadow-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#253556]">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[#0095FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              About Bentexto (আমাদের সম্পর্কে)
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-[#253556] p-1.5 text-gray-400 hover:bg-[#1E2C4A] hover:text-white transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
          {/* Hero Branding */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#15213B] border border-[#253556]">
            <Logo size="lg" showWordmark={false} />
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Bentexto — The Premier Bengali Contexto Word Game
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                বাংলা ভাষার প্রথম আধুনিক সিম্যান্টিক শব্দ অনুমান খেলা। An AI-powered educational and recreational linguistic puzzle designed for Bengali speakers and learners worldwide.
              </p>
            </div>
          </div>

          {/* Mission & Purpose */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-rose-400" /> Our Mission & Editorial Values
            </h4>
            <p>
              Bentexto was created with a heartfelt mission: to celebrate the richness of the Bengali language (বাংলা ভাষা) through engaging, daily cognitive vocabulary challenges. By fusing natural language processing (NLP) semantics with intuitive game mechanics, we help people of all ages enrich their Bangla vocabulary, exercise critical deduction, and connect with their cultural roots.
            </p>
          </section>

          {/* How It Works Behind the Scenes */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-[#38BDF8]" /> Linguistic & Semantic Technology
            </h4>
            <p>
              Unlike traditional letter-guessing games like Wordle, Bentexto evaluates words based on <strong>semantic context and conceptual proximity</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 ml-2">
              <li>Our linguistic engine models thousands of curated Bengali vocabulary words across domains: nature, culture, family, science, and everyday life.</li>
              <li>When you guess a word, our algorithm analyzes relational closeness, contextual co-occurrence, and thematic synonymy to deliver a precise distance rank.</li>
              <li>Rank <strong>#1</strong> represents the secret word of the day!</li>
            </ul>
          </section>

          {/* Accessibility & Phonetic Typing */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#10B981]" /> Barrier-Free Accessibility
            </h4>
            <p>
              We believe everyone should be able to play, regardless of whether their device has a Bengali keyboard installed. Bentexto features an instant, smart phonetic English-to-Bangla transliteration engine and an on-screen virtual keyboard with full ligature (যুক্তাক্ষর) support.
            </p>
          </section>

          {/* Google AdSense & Funding Transparency */}
          <section className="space-y-2 p-4 rounded-xl bg-[#0F182A] border border-[#253556]">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#FDE047]" /> Advertising & Editorial Independence
            </h4>
            <p className="text-xs text-gray-300">
              Bentexto is 100% free for all players. To fund server bandwidth, vocabulary development, and ongoing maintenance, we display non-intrusive advertisements in compliance with Google AdSense Publisher Policies. We strictly maintain editorial independence: advertisements never influence game solutions, word selections, or educational rankings.
            </p>
          </section>

          {/* Contact & Feedback */}
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-[#0095FF]" /> Contact & Editorial Inquiries
            </h4>
            <p>
              We welcome vocabulary suggestions, corrections, and feedback from linguists, educators, and players.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFeedback?.();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2C4A] border border-[#253556] px-3 py-1.5 text-xs font-semibold text-white hover:border-[#0095FF] transition cursor-pointer"
              >
                Send In-App Feedback
              </button>
              <a
                href="mailto:contact.bentexto@gmail.com"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2C4A] border border-[#253556] px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:border-[#0095FF] transition"
              >
                contact.bentexto@gmail.com
              </a>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#253556] bg-[#0B1324] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLegal?.('privacy');
              }}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLegal?.('terms');
              }}
              className="hover:text-white underline cursor-pointer"
            >
              Terms of Service
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0095FF] hover:bg-[#0082E6] px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
