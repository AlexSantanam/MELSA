import React from 'react';

interface MelsaLogoProps {
  variant?: 'full' | 'emblem' | 'light' | 'stacked' | 'image';
  className?: string;
  height?: number;
}

export const MelsaLogo: React.FC<MelsaLogoProps> = ({
  variant = 'full',
  className = '',
  height = 48
}) => {
  const isLight = variant === 'light';
  const blackColor = isLight ? '#FFFFFF' : '#111111';
  const redColor = '#D02126';

  // Master emblem transparent assets generated directly from official reference drawing
  const emblemSrc = isLight 
    ? '/asset/melsa-emblem-light.png' 
    : '/asset/melsa-emblem.png';

  const fullLogoSrc = isLight 
    ? '/asset/melsa-full-logo-light.png' 
    : '/asset/melsa-full-logo.png';

  // Variant: Stacked or Image (Exact master logo)
  if (variant === 'stacked' || variant === 'image') {
    return (
      <img
        src={fullLogoSrc}
        alt="MELSA Gestión Inmobiliaria"
        style={{ height: `${height}px`, width: 'auto' }}
        className={`object-contain select-none ${className}`}
      />
    );
  }

  // Variant: Emblem only (The architectural chalet & mountains)
  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={emblemSrc}
          alt="Emblema MELSA"
          style={{ height: `${height}px`, width: 'auto' }}
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  // Variant: Full Horizontal Lockup (Emblem + Typography) - Ideal for Header & Navbars
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Exact Architectural Emblem */}
      <img
        src={emblemSrc}
        alt="MELSA Emblema"
        style={{ height: `${height}px`, width: 'auto' }}
        className="object-contain shrink-0"
      />

      {/* Typography: MEL in Black/White + SA in Brand Red */}
      <div className="flex flex-col justify-center">
        <div 
          className="font-serif tracking-[0.18em] font-medium leading-none flex items-center"
          style={{ fontSize: `${Math.round(height * 0.52)}px` }}
        >
          <span style={{ color: blackColor, fontFamily: "'Playfair Display', Georgia, serif" }}>
            MEL
          </span>
          <span style={{ color: redColor, fontFamily: "'Playfair Display', Georgia, serif" }}>
            SA
          </span>
        </div>
        <span
          className="tracking-[0.32em] font-semibold uppercase mt-1 leading-none"
          style={{ 
            color: isLight ? 'rgba(255, 255, 255, 0.85)' : '#111111',
            fontSize: `${Math.max(9, Math.round(height * 0.21))}px`
          }}
        >
          GESTIÓN INMOBILIARIA
        </span>
      </div>
    </div>
  );
};
