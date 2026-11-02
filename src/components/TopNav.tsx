import React from 'react';
import { 
  Layers, 
  ShieldCheck, 
  ArrowLeftRight, 
  Search, 
  Lock,
  Building2,
  UtensilsCrossed
} from 'lucide-react';
import { KLAYMAN_HOTELS } from '../data/hotelPortalData';
import { HotelEntity } from '../types/hotelPortal';

interface TopNavProps {
  selectedHotelId: string | null;
  hotelsList?: HotelEntity[];
  onSelectHotel: (hotelId: string | null) => void;
  onSelectCorporate: () => void;
  onOpenGlobalSearch: () => void;
  onOpenAdminPanel: () => void;
  companyName?: string;
  companySubtitle?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  selectedHotelId,
  hotelsList = KLAYMAN_HOTELS,
  onSelectHotel,
  onSelectCorporate,
  onOpenGlobalSearch,
  onOpenAdminPanel,
  companyName = 'OPERATIONS HUB',
  companySubtitle = 'Dirección de operaciones, fichas técnicas estandarizadas y gestión F&B'
}) => {
  const currentHotel = hotelsList.find(h => h.id === selectedHotelId);
  const isCorporate = selectedHotelId === 'corporate';

  return (
    <header className="sticky top-0 z-40 bg-[#1A2530] text-white border-b border-[#2C3E50]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo / Wordmark Oficial: Adaptable a la Empresa */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectHotel(null)}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] rounded"
          >
            <div className="w-8 h-8 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880]/25 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#C5A880] transition-colors truncate max-w-[200px] sm:max-w-xs font-sans">
                  {companyName}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C5A880] text-[#1A2530] font-bold uppercase">
                  F&B
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-300 font-sans tracking-wide truncate max-w-sm">
                {companySubtitle}
              </p>
            </div>
          </button>

          {/* Badge de la Unidad Actual */}
          {currentHotel && (
            <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-700/60 text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#243342] border border-slate-700 flex items-center justify-center text-[#C5A880]">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[10px] font-mono text-[#C5A880] font-bold bg-[#C5A880]/15 border border-[#C5A880]/30 px-1.5 py-0.2 rounded">
                    {currentHotel.categoryLabel || currentHotel.code}
                  </span>
                </div>
                <span className="font-bold text-white block text-xs">
                  {currentHotel.name}
                </span>
              </div>
              <button
                onClick={() => onSelectHotel(null)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-transparent hover:bg-[#243342] border border-slate-700 px-2 py-0.5 rounded-lg ml-1 transition-colors"
                title="Cambiar de unidad operativa"
              >
                <ArrowLeftRight className="w-3 h-3 text-[#C5A880]" />
                <span>Cambiar</span>
              </button>
            </div>
          )}

          {isCorporate && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-700/60 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span className="font-bold text-white font-mono">
                DIRECCIÓN CENTRAL
              </span>
              <button
                onClick={() => onSelectHotel(null)}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-white bg-transparent hover:bg-[#243342] border border-slate-700 px-2 py-0.5 rounded-lg ml-1"
              >
                <ArrowLeftRight className="w-3 h-3 text-[#C5A880]" />
                <span>Cambiar</span>
              </button>
            </div>
          )}
        </div>

        {/* Buscador Global Rápido en Header */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs mx-2">
          <button
            onClick={onOpenGlobalSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#243342] hover:bg-[#2c3d4f] border border-slate-700 hover:border-[#C5A880]/60 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Buscar fichas, recetas, SOPs...</span>
            </div>
            <kbd className="hidden lg:inline text-[10px] bg-[#1A2530] px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
              Buscar
            </kbd>
          </button>
        </div>

        {/* Navegación Principal por Unidad Operativa */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-300 font-mono">
          <button
            onClick={() => onSelectHotel(null)}
            className={`transition-colors hover:text-white pb-1 border-b-2 ${
              selectedHotelId === null
                ? 'text-[#C5A880] border-[#C5A880] font-bold'
                : 'border-transparent text-slate-300'
            }`}
          >
            Unidades Operativas
          </button>

          <button
            onClick={() => onSelectHotel('klayman-diamond')}
            className={`transition-colors hover:text-white pb-1 border-b-2 flex items-center gap-1.5 ${
              selectedHotelId === 'klayman-diamond'
                ? 'text-[#C5A880] border-[#C5A880] font-bold'
                : 'border-transparent text-slate-300'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Unidad Principal (F&B)</span>
          </button>

          <button
            onClick={() => onSelectHotel('klayman-olivina')}
            className={`transition-colors hover:text-white pb-1 border-b-2 ${
              selectedHotelId === 'klayman-olivina'
                ? 'text-[#C5A880] border-[#C5A880] font-bold'
                : 'border-transparent text-slate-300'
            }`}
          >
            Unidad Satélite 2
          </button>

          <button
            onClick={onSelectCorporate}
            className={`transition-colors hover:text-white pb-1 border-b-2 flex items-center gap-1 ${
              isCorporate
                ? 'text-[#C5A880] border-[#C5A880] font-bold'
                : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dirección Central</span>
          </button>
        </nav>

        {/* Botones de Acción: Buscador Móvil + Admin Panel */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGlobalSearch}
            className="sm:hidden p-2 rounded-xl bg-[#243342] border border-slate-700 text-slate-200 hover:text-white"
            title="Abrir buscador global"
          >
            <Search className="w-4 h-4 text-[#C5A880]" />
          </button>

          <button
            onClick={onOpenAdminPanel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-transparent hover:bg-[#243342] border border-slate-700 hover:border-[#C5A880]/60 text-xs font-mono text-slate-200 hover:text-white transition-colors"
            title="Panel de Configuración Central"
          >
            <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden sm:inline">Configuración</span>
          </button>

          {/* Menú Select para móviles */}
          <div className="xl:hidden">
            <select
              value={selectedHotelId || 'selector'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'selector') onSelectHotel(null);
                else if (val === 'corporate') onSelectCorporate();
                else onSelectHotel(val);
              }}
              className="bg-[#243342] border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C5A880] font-mono"
            >
              <option value="selector">Seleccionar Unidad Operativa</option>
              <option value="klayman-diamond">Unidad Principal (F&B / Central)</option>
              <option value="klayman-olivina">Unidad Satélite 2 (Punto de Venta)</option>
              <option value="corporate">Dirección Central / Corporativa</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
