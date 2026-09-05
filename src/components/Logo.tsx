import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  // Dimension mappings for the logo emblem
  const dimensions = {
    sm: { box: 32, icon: 20, text: 'text-base', subText: 'text-[9px]' },
    md: { box: 42, icon: 26, text: 'text-xl', subText: 'text-[11px]' },
    lg: { box: 56, icon: 34, text: 'text-2xl sm:text-3xl', subText: 'text-xs' },
    xl: { box: 72, icon: 46, text: 'text-3xl sm:text-4xl', subText: 'text-sm' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Bentexto - Bengali Word Game"
    >
      {/* Dynamic Emblem with Bengali 'ব' and 3-tier semantic radar rings */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-[#18274A] via-[#121D38] to-[#0A1020] border border-[#2B3E68] shadow-lg shadow-[#0095FF]/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#0095FF]/60"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow */}
          <circle cx="50" cy="50" r="42" fill="url(#blue-glow)" opacity="0.15" />

          {/* Semantic Radar Ring 3 (Outer - Coral Pink #FB7185 - Rank 1501+) */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#FB7185"
            strokeWidth="3.5"
            strokeDasharray="4 8"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Semantic Radar Ring 2 (Middle - Amber Yellow #FDE047 - Rank 301-1500) */}
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke="#FDE047"
            strokeWidth="4"
            strokeDasharray="16 10"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Semantic Radar Ring 1 (Inner Target - Mint Teal #4FD1C5 - Rank 1-300 Close) */}
          <circle
            cx="50"
            cy="50"
            r="22"
            stroke="#4FD1C5"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Center Victory Core Glow (Secret Word Hub) */}
          <circle cx="50" cy="50" r="13" fill="#0095FF" opacity="0.25" />
          <circle cx="50" cy="50" r="6" fill="#4FD1C5" />

          {/* Stylized Modern Bengali Letter 'ব' (Bo) embedded seamlessly */}
          <path
            d="M 32 30 L 68 30 M 50 30 L 36 68 L 64 68 L 50 42"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          />

          {/* Radial gradient defs */}
          <defs>
            <radialGradient id="blue-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0095FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#0D1527" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Small live pulse dot for semantic energy */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FD1C5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4FD1C5]"></span>
        </span>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-widest text-white uppercase font-sans ${dimensions.text} transition-colors group-hover:text-white`}
            >
              BENTEXTO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#0095FF] shrink-0"></span>
          </div>

          {showSubtitle ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`font-['Noto_Serif_Bengali'] font-semibold text-gray-400 ${dimensions.subText}`}>
                বাংলা শব্দ মেলানোর খেলা
              </span>
              <span className="text-[10px] text-gray-500 font-mono">• শব্দ ধাঁধা</span>
            </div>
          ) : (
            <span className="text-[10px] font-bold text-[#38BDF8] tracking-normal font-sans">
              Bengali Word Game
            </span>
          )}
        </div>
      )}
    </div>
  );
};
