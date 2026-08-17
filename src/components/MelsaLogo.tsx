import React from 'react';

interface MelsaLogoProps {
  variant?: 'full' | 'emblem' | 'light';
  className?: string;
  height?: number;
}

export const MelsaLogo: React.FC<MelsaLogoProps> = ({
  variant = 'full',
  className = '',
  height = 48
}) => {
  // Brand colors from exact prompt logo analysis
  const navyColor = variant === 'light' ? '#FFFFFF' : '#0F2042';
  const goldColor = '#C5A059';

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg
          height={height}
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Double Mountain / Roof Pyramid structure */}
          {/* Outer Left Triangle */}
          <polygon
            points="10,130 50,60 85,130"
            stroke={navyColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinejoin="miter"
          />
          {/* Outer Right Triangle */}
          <polygon
            points="115,130 150,60 190,130"
            stroke={navyColor}
            strokeWidth="3.5"
            fill="none"
            strokeLinejoin="miter"
          />
          {/* Center Main Gold Pyramid / Roof */}
          <polyline
            points="35,130 100,20 165,130"
            stroke={goldColor}
            strokeWidth="4"
            fill="none"
            strokeLinecap="square"
          />
          {/* Inner Inner Roof framing */}
          <polyline
            points="55,130 100,55 145,130"
            stroke={goldColor}
            strokeWidth="2.5"
            fill="none"
          />
          {/* Central House Door & Window */}
          <rect
            x="85"
            y="90"
            width="30"
            height="40"
            stroke={goldColor}
            strokeWidth="2.5"
            fill="none"
          />
          <rect
            x="102"
            y="98"
            width="8"
            height="12"
            stroke={goldColor}
            strokeWidth="2"
            fill="none"
          />
          {/* Horizontal Ground Line */}
          <line x1="10" y1="130" x2="190" y2="130" stroke={navyColor} strokeWidth="3.5" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Roof / Pyramid Architectural Icon */}
      <svg
        height={height}
        viewBox="0 0 200 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Left Pyramid Line (Navy) */}
        <polyline
          points="15,115 52,50 82,115"
          stroke={navyColor}
          strokeWidth="3"
          fill="none"
        />
        {/* Outer Right Pyramid Line (Navy) */}
        <polyline
          points="118,115 148,50 185,115"
          stroke={navyColor}
          strokeWidth="3"
          fill="none"
        />
        {/* Main Central High Peak (Gold) */}
        <polyline
          points="38,115 100,15 162,115"
          stroke={goldColor}
          strokeWidth="3.5"
          fill="none"
        />
        {/* Inner Apex Roof Line (Gold) */}
        <polyline
          points="58,115 100,48 142,115"
          stroke={goldColor}
          strokeWidth="2"
          fill="none"
        />
        {/* House Frame Center (Gold) */}
        <rect
          x="86"
          y="78"
          width="28"
          height="37"
          stroke={goldColor}
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="101"
          y="85"
          width="8"
          height="10"
          stroke={goldColor}
          strokeWidth="1.5"
          fill="none"
        />
        {/* Ground Line */}
        <line x1="10" y1="115" x2="190" y2="115" stroke={navyColor} strokeWidth="2.5" />
      </svg>

      {/* Typography: MELSA + GESTIÓN INMOBILIARIA */}
      <div className="flex flex-col justify-center">
        <span
          className="font-serif text-2xl md:text-3xl tracking-[0.18em] font-medium leading-none"
          style={{ color: navyColor, fontFamily: "'Playfair Display', serif" }}
        >
          MELSA
        </span>
        <span
          className="text-[9px] md:text-[10.5px] tracking-[0.32em] font-semibold uppercase mt-1 leading-none"
          style={{ color: goldColor }}
        >
          GESTIÓN INMOBILIARIA
        </span>
      </div>
    </div>
  );
};
