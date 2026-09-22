import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ResponsiveSideAdsProps {
  leftSlotId?: string;
  rightSlotId?: string;
  adClient?: string;
  adsEnabled?: boolean;
  className?: string;
}

export const ResponsiveSideAds: React.FC<ResponsiveSideAdsProps> = ({
  leftSlotId = '1002003004',
  rightSlotId = '5006007008',
  adClient = 'ca-pub-3199860809392813',
  adsEnabled = true,
  className = '',
}) => {
  const leftAdRef = useRef<HTMLModElement>(null);
  const rightAdRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        if (leftAdRef.current && !leftAdRef.current.getAttribute('data-adsbygoogle-status')) {
          window.adsbygoogle.push({});
        }
        if (rightAdRef.current && !rightAdRef.current.getAttribute('data-adsbygoogle-status')) {
          window.adsbygoogle.push({});
        }
      }
    } catch (err) {
      console.log('AdSense mobile side ads init info:', err);
    }
  }, []);

  if (!adsEnabled) return null;

  return (
    <div
      className={`lg:hidden w-full max-w-xl mx-auto my-3 grid grid-cols-1 sm:grid-cols-2 gap-3 transition-all ${className}`}
      aria-label="Sponsored Content"
    >
      {/* Mobile/Tablet Left Ad Unit */}
      <div className="rounded-xl border border-[#253556] bg-[#10192E]/90 p-2.5 flex flex-col items-center justify-between text-center">
        <div className="w-full flex items-center justify-between pb-1 border-b border-[#1E2D4C] text-[10px] uppercase font-bold tracking-wider text-gray-400">
          <span>Left Sponsor • বাম বিজ্ঞাপন</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0095FF] animate-pulse"></span>
        </div>
        <div className="w-full py-2">
          <ins
            ref={leftAdRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px' }}
            data-ad-client={adClient}
            data-ad-slot={leftSlotId}
            data-ad-format="rectangle, horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>

      {/* Mobile/Tablet Right Ad Unit */}
      <div className="rounded-xl border border-[#253556] bg-[#10192E]/90 p-2.5 flex flex-col items-center justify-between text-center">
        <div className="w-full flex items-center justify-between pb-1 border-b border-[#1E2D4C] text-[10px] uppercase font-bold tracking-wider text-gray-400">
          <span>Right Sponsor • ডান বিজ্ঞাপন</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
        </div>
        <div className="w-full py-2">
          <ins
            ref={rightAdRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '60px' }}
            data-ad-client={adClient}
            data-ad-slot={rightSlotId}
            data-ad-format="rectangle, horizontal"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};
