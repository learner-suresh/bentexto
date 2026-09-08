import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface ConsentBannerProps {
  onOpenPrivacy: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onOpenPrivacy }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('bentexto_cookie_consent');
      if (!consent) {
        // slight delay so it doesn't jarringly jump on load
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('bentexto_cookie_consent', 'accepted');
    } catch {}
    setShow(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('bentexto_cookie_consent', 'declined');
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-[#0F182A]/95 border-t border-[#253556] backdrop-blur-md shadow-2xl animate-fade-in"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-xs text-gray-300">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0095FF]/20 text-[#0095FF] shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="leading-relaxed">
            We use cookies and Google AdSense technologies to analyze traffic, personalize your word game experience, and serve relevant educational advertisements in accordance with Google Publisher Policies.{' '}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-[#38BDF8] underline hover:text-white transition font-medium cursor-pointer"
            >
              Read our Privacy Policy &amp; Cookie choices
            </button>.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDecline}
            className="px-3 py-1.5 rounded-lg border border-[#253556] text-gray-400 hover:text-white hover:bg-[#1E2C4A] text-xs font-semibold transition cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg bg-[#0095FF] hover:bg-[#0082E6] text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Accept All (সম্মত)
          </button>
        </div>
      </div>
    </aside>
  );
};
