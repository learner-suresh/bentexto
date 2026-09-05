import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface SideAdBannerProps {
  side: 'left' | 'right';
  slotId: string;
  adClient?: string;
  adsEnabled?: boolean;
  className?: string;
}

export const SideAdBanner: React.FC<SideAdBannerProps> = ({
  side,
  slotId,
  adClient = 'ca-pub-3199860809392813',
  adsEnabled = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.adsbygoogle &&
        adRef.current &&
        !adRef.current.getAttribute('data-adsbygoogle-status')
      ) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.log(`AdSense ${side} sidebar init info:`, err);
    }
  }, [side]);

  if (!adsEnabled) return null;

  const sideLabel = side === 'left' ? 'Left Sponsor (বাম বিজ্ঞাপন)' : 'Right Sponsor (ডান বিজ্ঞাপন)';

  return (
    <aside
      className={`hidden lg:flex flex-col w-[140px] xl:w-[180px] 2xl:w-[220px] shrink-0 sticky top-20 self-start p-2.5 rounded-2xl border border-[#253556]/80 bg-[#121E36]/50 backdrop-blur-xs transition-all ${
        side === 'left' ? 'order-first' : 'order-last'
      } ${className}`}
      aria-label={`${side} advertisement`}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 pb-1.5 border-b border-[#1E2D4C] flex items-center justify-between">
        <span className="truncate">{sideLabel}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] animate-pulse shrink-0 ml-1"></span>
      </div>

      <div className="w-full flex flex-col items-center gap-3">
        {/* Real AdSense Vertical / Skyscraper */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '450px' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />

        {/* Fallback Display if Google Ads are in staging/preview or blocked */}
        <div className="w-full min-h-[480px] rounded-xl bg-[#0B1324] border border-dashed border-[#253556] p-3 flex flex-col items-center justify-between text-center">
          <div className="w-full text-center">
            <span className="text-[9px] text-gray-500 uppercase font-mono tracking-widest block">
              {side === 'left' ? 'Left Skyscraper' : 'Right Skyscraper'}
            </span>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0095FF]/10 text-[#38BDF8] border border-[#0095FF]/30 text-[9px] font-bold uppercase">
              <Sparkles className="h-2.5 w-2.5" /> Ad #{slotId.slice(-4)}
            </div>
          </div>

          <div className="my-auto px-1 py-4 flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-[#0095FF]/10 border border-[#0095FF]/30 flex items-center justify-center mb-3">
              <div className="w-4 h-4 rounded-full bg-[#0095FF] animate-ping" />
            </div>
            <p className="text-xs font-bold text-gray-200">
              Bengali Puzzles Partner
            </p>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
              বিনামূল্যে বাংলা শব্দ ধাঁধা ও সিম্যান্টিক এআই সাপোর্ট করুন
            </p>
            <div className="mt-4 px-2.5 py-1 rounded-lg bg-[#15213B] border border-[#253556] text-[10px] text-gray-400 font-mono">
              160x600 • 300x600
            </div>
          </div>

          <span className="text-[9px] text-gray-600 font-mono">
            Responsive Display
          </span>
        </div>
      </div>
    </aside>
  );
};
