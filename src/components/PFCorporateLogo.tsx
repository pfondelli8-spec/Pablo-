import React from 'react';

export interface PabloFondenLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'slate' | 'sky' | 'white' | 'carbon' | 'marfil';
  className?: string;
  showText?: boolean;
}

export const PabloFondelliLogo: React.FC<PabloFondenLogoProps> = ({
  size = 'md',
  variant = 'slate',
  className = '',
  showText = false
}) => {
  const sizeMap = {
    xs: { icon: 'w-5 h-5', text: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', text: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
    hero: { icon: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28', text: 'text-2xl sm:text-3xl', sub: 'text-xs' }
  };

  const isLight = variant === 'white' || variant === 'marfil';
  const borderTone = isLight ? '#0284C7' : '#38BDF8';
  const fillBg = isLight ? '#FFFFFF' : '#2C3E4C';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Isotipo Vectorial Pablo Fondelli: Campana, Copa de Bar, Llama y Estrella de Dirección */}
      <svg
        viewBox="0 0 200 200"
        className={`${sizeMap[size].icon} shrink-0 transition-transform duration-300 drop-shadow-sm`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pExecSlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A5064" />
            <stop offset="100%" stopColor="#1E2B37" />
          </linearGradient>

          <linearGradient id="pWarmSky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* Marco Exterior Achaflanado / Medallón Octogonal */}
        <polygon
          points="32,10 168,10 190,32 190,168 168,190 32,190 10,168 10,32"
          fill={fillBg}
          stroke={borderTone}
          strokeWidth="2.5"
        />

        {/* Marco Interior Fino */}
        <polygon
          points="37,17 163,17 183,37 183,163 163,183 37,183 17,163 17,37"
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Acentos en las 4 esquinas */}
        <line x1="28" y1="28" x2="38" y2="38" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
        <line x1="172" y1="28" x2="162" y2="38" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
        <line x1="172" y1="172" x2="162" y2="162" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />
        <line x1="28" y1="172" x2="38" y2="162" stroke="#38BDF8" strokeWidth="1.2" opacity="0.8" />

        {/* Círculo Guía Orbital de Calidad */}
        <circle cx="100" cy="100" r="54" fill="none" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="3,3" opacity="0.3" />

        {/* 1. Llama Superior de Cocina */}
        <g fill="url(#pWarmSky)" stroke="#38BDF8">
          <path d="M 100,28 C 96,36 93,42 93,48 C 93,54 96,58 100,60 C 104,58 107,54 107,48 C 107,42 104,36 100,28 Z" strokeWidth="0.5" />
          <path d="M 100,38 C 98,43 97,46 97,49 C 97,52 98.5,54 100,55 C 101.5,54 103,52 103,49 C 103,46 102,43 100,38 Z" fill="#BAE6FD" stroke="#BAE6FD" strokeWidth="0.3" />
        </g>

        {/* Asa de la Campana Gastronómica */}
        <ellipse cx="100" cy="62" rx="6" ry="3" fill="none" stroke="#38BDF8" strokeWidth="1.5" />

        {/* 2. Campana Gastronómica / Cloche */}
        <path
          d="M 50,118 C 50,82 72,66 100,66 C 128,66 150,82 150,118 Z"
          fill="none"
          stroke="url(#pWarmSky)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 44,120 C 44,118 46,117 50,117 L 150,117 C 154,117 156,118 156,120 L 152,123 L 48,123 Z"
          fill="#38BDF8"
          opacity="0.85"
        />

        {/* 3. Copa de Bar / Coctelería */}
        <path
          d="M 72,126 L 100,154 L 128,126 Z"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <line x1="75" y1="129" x2="125" y2="129" stroke="#7DD3FC" strokeWidth="1" opacity="0.6" />
        <line x1="100" y1="154" x2="100" y2="172" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <path d="M 84,172 L 116,172" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        {/* 4. Estrella de Dirección / Rosa de los Vientos */}
        <g>
          <line x1="82" y1="82" x2="118" y2="118" stroke="#38BDF8" strokeWidth="0.8" opacity="0.5" />
          <line x1="118" y1="82" x2="82" y2="118" stroke="#38BDF8" strokeWidth="0.8" opacity="0.5" />

          {/* Puntas cardinales */}
          <polygon points="100,74 103,97 100,100" fill="#38BDF8" />
          <polygon points="100,74 97,97 100,100" fill="#0284C7" />
          <polygon points="100,126 103,103 100,100" fill="#38BDF8" />
          <polygon points="100,126 97,103 100,100" fill="#0284C7" />
          <polygon points="126,100 103,97 100,100" fill="#38BDF8" />
          <polygon points="126,100 103,103 100,100" fill="#0284C7" />
          <polygon points="74,100 97,97 100,100" fill="#38BDF8" />
          <polygon points="74,100 97,103 100,100" fill="#0284C7" />

          <circle cx="100" cy="100" r="3" fill="#BAE6FD" stroke="#1E2B37" strokeWidth="0.8" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-black tracking-tight text-slate-800 leading-tight">
            Pablo Fondelli
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Hospitality & F&B Operations
          </span>
        </div>
      )}
    </div>
  );
};

// Aliases para compatibilidad con código existente
export const PFCorporateLogo = PabloFondelliLogo;
export const PabloFondenLogo = PabloFondelliLogo;
export default PabloFondelliLogo;
