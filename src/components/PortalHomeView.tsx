import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

interface PortalHomeViewProps {
  onSelectHotel: (hotelId: 'diamond' | 'olivina' | 'proximamente') => void;
}

export const PortalHomeView: React.FC<PortalHomeViewProps> = ({ onSelectHotel }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-28 animate-fadeIn">
      {/* 1. CABECERA LIMPIA Y COMPACTA */}
      <div className="text-center space-y-1.5 pt-2 sm:pt-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-md mb-0.5">
          <span className="font-display font-bold text-xl tracking-wider">K</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 tracking-tight">
          KLAYMAN APARTHOTELS
        </h1>

        <p className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
          Portal Interno de Operaciones
        </p>

        <p className="text-xs text-stone-400 max-w-md mx-auto pt-0.5">
          Selecciona tu establecimiento para acceder a sus procedimientos y cartas:
        </p>
      </div>

      {/* 2. LAS 3 OPCIONES PRINCIPALES:
          MOBILE-FIRST: ENCAJAN PERFECTAMENTE EN LA PANTALLA DEL MÓVIL SIN SCROLL VERTICAL */}
      <div className="space-y-2.5 sm:space-y-3 max-w-xl mx-auto">
        {/* TARJETA 1: HOTEL DIAMOND */}
        <button
          onClick={() => onSelectHotel('diamond')}
          className="w-full p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex items-center justify-between gap-3 group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0 font-display font-bold text-base">
              💎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">
                  ★★★★ 4 ESTRELLAS
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Activo
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-tight mt-0.5">
                HOTEL DIAMOND
              </h2>
              <p className="text-[11px] font-mono text-stone-400">
                Los Gigantes, Tenerife
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* TARJETA 2: HOTEL OLIVINA */}
        <button
          onClick={() => onSelectHotel('olivina')}
          className="w-full p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex items-center justify-between gap-3 group shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-center text-stone-300 group-hover:scale-105 transition-transform shrink-0 font-display font-bold text-base">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-stone-400 font-bold tracking-wider uppercase">
                  ★★★ 3 ESTRELLAS
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-tight mt-0.5">
                HOTEL OLIVINA
              </h2>
              <p className="text-[11px] font-mono text-stone-400">
                Los Cristianos, Tenerife
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>

        {/* TARJETA 3: HOTEL ? / PRÓXIMAMENTE */}
        <button
          onClick={() => onSelectHotel('proximamente')}
          className="w-full p-4 sm:p-5 rounded-2xl bg-stone-900/50 border border-stone-850 hover:border-stone-700 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex items-center justify-between gap-3 group shadow-sm opacity-80 hover:opacity-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-center text-stone-500 shrink-0 font-display font-bold text-base">
              🏨
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-500 tracking-wider uppercase block">
                NUEVA INCORPORACIÓN
              </span>
              <h2 className="text-lg sm:text-xl font-display font-bold text-stone-300 uppercase leading-tight mt-0.5">
                HOTEL ? (PRÓXIMAMENTE)
              </h2>
              <p className="text-[11px] font-mono text-stone-500">
                Tercer establecimiento
              </p>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-stone-600 group-hover:text-stone-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};
