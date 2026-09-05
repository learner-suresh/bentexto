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
  adClient = 'ca-pub-0000000000000000',
  adsEnabled = true,
  className = '',
}) => {
  const leftAdRef = useRef<HTMLModElement>(null);
  const rightAdRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
        window.adsbygoogle.push({});
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
          <div className="rounded-lg bg-[#0B1324] border border-dashed border-[#253556] p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="text-left">
              <span className="font-semibold text-gray-300 block text-[11px]">
                Bengali Partner (Left)
              </span>
              <span className="text-[10px] text-gray-500 block">
                বাংলা শব্দভাণ্ডার বিকাশ
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-[#0095FF]/10 text-[#38BDF8] border border-[#0095FF]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase">
              <Sparkles className="h-2.5 w-2.5" /> Ad
            </span>
          </div>
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
          <div className="rounded-lg bg-[#0B1324] border border-dashed border-[#253556] p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="text-left">
              <span className="font-semibold text-gray-300 block text-[11px]">
                Bengali Partner (Right)
              </span>
              <span className="text-[10px] text-gray-500 block">
                সিম্যান্টিক এআই ইঞ্জিন
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase">
              <Sparkles className="h-2.5 w-2.5" /> Ad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
