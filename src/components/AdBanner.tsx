import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Info, X } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export type AdSlotType = 'leaderboard' | 'bottom' | 'in-content' | 'rectangle' | 'anchor';

interface AdBannerProps {
  slotType?: AdSlotType;
  slotId?: string;
  adClient?: string;
  className?: string;
  showDismiss?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType = 'in-content',
  slotId = '1234567890',
  adClient = 'ca-pub-0000000000000000',
  className = '',
  showDismiss = true,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (err) {
      // Ad blocker active or script blocked
      console.log('AdSense init info:', err);
    }
  }, []);

  if (isDismissed) return null;

  // Visual dimension styling depending on slot type
  const slotStyles = {
    leaderboard: 'w-full min-h-[50px] sm:min-h-[70px] lg:min-h-[90px] max-w-4xl',
    bottom: 'w-full min-h-[50px] sm:min-h-[65px] lg:min-h-[80px] max-w-4xl',
    'in-content': 'w-full min-h-[60px] sm:min-h-[85px] max-w-xl',
    rectangle: 'w-full max-w-[320px] sm:max-w-[336px] min-h-[250px] mx-auto',
    anchor: 'w-full min-h-[50px] max-w-3xl',
  }[slotType];

  return (
    <div
      className={`my-2 mx-auto flex flex-col items-center justify-center relative overflow-hidden rounded-xl border border-[#253556] bg-[#10192E]/90 p-2 text-center transition-all ${slotStyles} ${className}`}
      aria-label="Advertisement"
    >
      {/* Google AdSense Compliant Label */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-[#1E2D4C] text-[10px] uppercase font-bold tracking-widest text-gray-400 select-none">
        <span className="flex items-center gap-1.5">
          <span>SPONSORED</span>
          <span className="text-gray-400 font-['Noto_Serif_Bengali']">• বিজ্ঞাপন</span>
        </span>

        <div className="flex items-center gap-2">
          {showDismiss && (
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              title="Dismiss ad"
              className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Actual Google AdSense Tag Container */}
      <div className="w-full flex-1 flex items-center justify-center p-2 min-h-[50px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '50px' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format={slotType === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />

        {/* Fallback Display if Google Ads are in staging/preview or blocked */}
        <div className="w-full py-2 px-3 rounded-lg bg-[#0D1527]/70 border border-dashed border-[#253556] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0095FF] animate-pulse"></div>
            <div className="text-left">
              <span className="font-semibold text-gray-300 block text-xs">
                Google Ads Placement
              </span>
              <span className="text-[10px] text-gray-400 block">
                Responsive slot #{slotId} • Support free Bengali education & puzzles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 rounded bg-[#0095FF]/10 text-[#38BDF8] border border-[#0095FF]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> AdSense
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
