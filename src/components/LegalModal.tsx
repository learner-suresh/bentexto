import React, { useState } from 'react';
import { X, Shield, FileText, CheckCircle2, Lock, Eye, Globe } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#253556] bg-[#121E36] shadow-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#253556]">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0095FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Legal & Policies (নীতিমালা ও শর্তাবলী)
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

        {/* Tab Switcher */}
        <div className="flex border-b border-[#253556] bg-[#0B1324] px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#0095FF] text-[#0095FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Privacy Policy (গোপনীয়তা নীতি)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#0095FF] text-[#0095FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Terms of Service (ব্যবহারের শর্তাবলী)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
          {activeTab === 'privacy' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#0095FF]/30 bg-[#0095FF]/10 p-3 text-xs text-gray-200">
                <span className="font-bold text-[#38BDF8]">Privacy Commitment:</span> Bentexto is designed to promote the Bengali language and cognitive puzzles. We respect your privacy and never sell or misuse your personal data.
              </div>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  1. Information We Collect
                </h3>
                <p>
                  Bentexto collects minimal data required to provide and improve the gameplay experience:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li><strong>Gameplay Data:</strong> Your guesses, win records, streaks, and timestamps are stored in your browser’s local storage (`localStorage`) on your own device.</li>
                  <li><strong>Advertising & Analytics:</strong> Third-party advertising partners like Google AdSense may collect standard device and cookie information in accordance with their privacy policies to deliver relevant ads.</li>
                  <li><strong>Feedback:</strong> Any suggestions, comments, or bug reports submitted voluntarily through our Feedback form.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  2. Cookies & Third-Party Advertising
                </h3>
                <p>
                  Google and certified third-party ad networks use cookies to serve ads based on user visits to this and other websites on the internet. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-[#0095FF] underline">Google Ads Settings</a> or by choosing our Ad-Free Bentexto Pro subscription.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  3. Data Storage & Security
                </h3>
                <p>
                  All your game progress, streaks, and preferences reside on your local client device. You can clear your stats or reset your records anytime simply by clearing your browser cache.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  4. Children’s Privacy
                </h3>
                <p>
                  Bentexto is safe for learners of all ages, including students learning Bengali vocabulary. We do not knowingly collect personally identifiable information from children under 13.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  5. Contact Us
                </h3>
                <p>
                  If you have questions regarding this Privacy Policy, you can reach out through our in-game Feedback modal.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#4FD1C5]/30 bg-[#4FD1C5]/10 p-3 text-xs text-gray-200">
                <span className="font-bold text-[#4FD1C5]">Terms Overview:</span> By accessing or playing Bentexto, you agree to these Terms of Service.
              </div>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  1. Acceptance of Terms
                </h3>
                <p>
                  Bentexto is provided as a free and subscription-supported educational and recreational word puzzle web application. By accessing the site, you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  2. Game Rules & Fair Play
                </h3>
                <p>
                  The goal of Bentexto is to deduce the secret Bengali word through semantic distance rankings. Users agree not to:
                </p>
                <ul className="list-disc list-inside mt-1.5 space-y-1 text-gray-400 ml-2">
                  <li>Use automated bots, web scrapers, or DDoS tools against the server or APIs.</li>
                  <li>Distribute malicious exploits or disrupt the experience of other players.</li>
                  <li>Reverse engineer vocabulary dictionaries for unauthorized commercial resale.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  3. Intellectual Property
                </h3>
                <p>
                  The Bentexto name, logo, custom semantic similarity algorithms, Bengali dictionary embeddings, and game mechanics are the intellectual property of Bentexto.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  4. Subscriptions & Ad-Free Pro
                </h3>
                <p>
                  Bentexto Pro gives users an ad-free experience and bonus perks. Subscriptions are billed per the selected plan (Monthly, Yearly, or Lifetime) and can be toggled or canceled at any time.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  5. Disclaimer & Limitation of Liability
                </h3>
                <p>
                  The game is provided on an "as-is" and "as-available" basis without warranties of any kind. We do not guarantee that the game will be uninterrupted or error-free at all times.
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  6. Changes to Terms
                </h3>
                <p>
                  We may periodically revise these Terms of Service. Continued use of the service following modifications constitutes acceptance of the updated terms.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#253556] bg-[#0B1324] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#0095FF] hover:bg-[#0082E6] px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
          >
            Understood (বুঝেছি)
          </button>
        </div>
      </div>
    </div>
  );
};
