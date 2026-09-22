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

      <div className="w-full flex flex-col items-center">
        {/* Real AdSense Vertical / Skyscraper */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '300px' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
