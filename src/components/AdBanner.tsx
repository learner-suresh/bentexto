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
  adClient = 'ca-pub-3199860809392813',
  className = '',
  showDismiss = true,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.adsbygoogle &&
        adRef.current &&
        !adRef.current.getAttribute('data-adsbygoogle-status')
      ) {
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
      className={`my-2 mx-auto flex flex-col items-center justify-center relative overflow-hidden rounded-xl border border-[#253556]/50 bg-[#10192E]/40 p-1 text-center transition-all ${slotStyles} ${className}`}
      aria-label="Advertisement"
    >
      {/* Actual Google AdSense Tag Container */}
      <div className="w-full flex-1 flex items-center justify-center min-h-[50px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '50px' }}
          data-ad-client={adClient}
          data-ad-slot={slotId}
          data-ad-format={slotType === 'rectangle' ? 'rectangle' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
