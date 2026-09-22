import React, { useState } from 'react';
import { BookOpen, HelpCircle, Sparkles, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const EducationalSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="w-full max-w-4xl mx-auto my-6 px-3" aria-label="About Bentexto and Game Guide">
      <div className="rounded-2xl border border-[#253556] bg-[#111C33]/80 backdrop-blur-xs p-4 sm:p-6 shadow-xl text-left">
        {/* Header Toggle */}
        <div className="flex items-center justify-between border-b border-[#1E2D4C] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0095FF]/10 border border-[#0095FF]/30 text-[#38BDF8]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>About Bentexto</span>
                <span className="text-xs font-normal text-[#38BDF8] font-['Noto_Serif_Bengali']">
                  (বাংলা কনটেক্সটো ও শব্দ সহায়িকা)
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                The authentic Bengali semantic word puzzle & daily vocabulary explorer
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#253556] bg-[#0D1527] text-xs font-semibold text-gray-300 hover:text-white hover:border-[#0095FF] transition cursor-pointer"
            aria-expanded={isOpen}
          >
            <span>{isOpen ? 'Collapse' : 'Read Guide'}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1 */}
              <div className="rounded-xl border border-[#1E2D4C] bg-[#0D1527]/80 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xs mb-1.5 uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Semantic Meaning</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">অর্থ ও প্রাসঙ্গিকতার খেলা</h3>
                  <p className="text-gray-400 text-xs">
                    Bentexto does not judge spelling or letters. It computes semantic proximity using AI word embeddings trained on rich Bengali literature.
                  </p>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                  Rank #1 = Secret Target Word
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="rounded-xl border border-[#1E2D4C] bg-[#0D1527]/80 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1.5 uppercase tracking-wider">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Color Proximity</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">রঙিন দূরত্বের সংকেত</h3>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-emerald-400">Green (1–300):</strong> Very close concept.<br />
                    <strong className="text-amber-400">Yellow (301–1000):</strong> Warm context.<br />
                    <strong className="text-rose-400">Red (1001+):</strong> Distant category.
                  </p>
                </div>
                <div className="mt-2 text-[11px] text-amber-300 font-mono">
                  Unlimited Guesses Everyday
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="rounded-xl border border-[#1E2D4C] bg-[#0D1527]/80 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs mb-1.5 uppercase tracking-wider">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Free & Educational</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">বাংলা ভাষা চর্চা</h3>
                  <p className="text-gray-400 text-xs">
                    Completely free with zero account sign-up required. Features built-in phonetic transliteration (e.g. typing <em>bristi</em> produces <em>বৃষ্টি</em>).
                  </p>
                </div>
                <div className="mt-2 text-[11px] text-indigo-300 font-mono">
                  Preserving Bengali Heritage
                </div>
              </div>
            </div>

            {/* In-depth Educational Summary */}
            <div className="p-3.5 rounded-xl bg-[#0D1527] border border-[#1E2D4C] text-xs text-gray-300 space-y-2">
              <h4 className="font-bold text-white text-sm">How to Play Bengali Contexto (খেলার নিয়ম ও কৌশল)</h4>
              <p>
                1. <strong>Start with broad categories:</strong> Guess words from nature (<em>প্রকৃতি, নদী, আকাশ</em>), living beings (<em>মানুষ, পাখি, ফুল</em>), or daily life (<em>ঘর, বই, খাদ্য</em>).
              </p>
              <p>
                2. <strong>Follow the lowest number:</strong> The lower the rank number, the closer you are to the secret word. If <em>জল</em> is rank #150, explore liquids, weather, rain, or rivers.
              </p>
              <p>
                3. <strong>Educational Mission:</strong> Bentexto is designed to promote vocabulary development, linguistic exploration, and cognitive agility for native speakers and Bengali learners worldwide.
              </p>
            </div>

            {/* Crawlable Resource Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2D4C] text-xs">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Heart className="h-3.5 w-3.5 text-rose-400" />
                <span>Dedicated to Bengali language lovers worldwide</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/guide.html"
                  className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Complete Game Guide</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/vocabulary.html"
                  className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Bengali Vocabulary</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/faq.html"
                  className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>FAQ & Help</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/about.html"
                  className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>About Our Mission</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/privacy.html"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy
                </a>
                <span className="text-gray-600">•</span>
                <a
                  href="/terms.html"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
