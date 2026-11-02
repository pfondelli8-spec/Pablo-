import React, { useState } from 'react';
import { Compass, Sparkles, X, ArrowRight, Eye, Wine } from 'lucide-react';
import { TechnicalSheet } from '../types/hotelPortal';
import { COCKTAILS_MASTER_TECHNICAL_SHEETS } from '../data/cocktailMasterTable';

interface FlavorCompassInteractiveProps {
  onSelectCocktail?: (sheet: TechnicalSheet) => void;
  isOpenModal?: boolean;
  onClose?: () => void;
}

interface PlottedCocktail {
  id: string;
  name: string;
  code: string;
  price: number;
  x: number; // -100 (Cítrico) to +100 (Dulce y Cremoso)
  y: number; // -100 (Ligero/Sin Alcohol) to +100 (Fuerte/Intenso)
  tag: string;
  isOfficialHighlighted?: boolean;
  flavorDesc: string;
  color: string;
}

export const FlavorCompassInteractive: React.FC<FlavorCompassInteractiveProps> = ({
  onSelectCocktail,
  isOpenModal = false,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'official' | 'all'>('official');
  const [selectedItem, setSelectedItem] = useState<PlottedCocktail | null>(null);

  // Exact positions based on the official "La Brújula de Sabores" infographic
  const compassCocktails: PlottedCocktail[] = [
    // 8 Oficiales destacados en la imagen:
    {
      id: 'ft-dia-ckt-06',
      name: 'Margarita',
      code: 'FT CKT 06',
      price: 8.50,
      x: -60,
      y: 65,
      tag: 'Cítrico & Intenso',
      isOfficialHighlighted: true,
      flavorDesc: 'Tequila 100% agave, Triple Sec y zumo de lima fresco.',
      color: 'from-amber-400 to-lime-500'
    },
    {
      id: 'ft-dia-ckt-10',
      name: 'Negroni',
      code: 'FT CKT 10',
      price: 8.50,
      x: -25,
      y: 45,
      tag: 'Amargo & Robusto',
      isOfficialHighlighted: true,
      flavorDesc: 'Ginebra, Campari Bitter y Martini Rosso en rigurosa proporción 1:1:1.',
      color: 'from-rose-500 to-red-600'
    },
    {
      id: 'ft-dia-ckt-16',
      name: 'Long Island Ice Tea',
      code: 'FT CKT 16',
      price: 9.00,
      x: 35,
      y: 75,
      tag: 'Fuerte & Intenso',
      isOfficialHighlighted: true,
      flavorDesc: '5 destilados blancos equilibrados con limón y un toque de Coca-Cola.',
      color: 'from-amber-600 to-amber-800'
    },
    {
      id: 'ft-dia-ckt-32',
      name: 'Perfect Continuous',
      code: 'FT CKT 32',
      price: 9.00,
      x: 75,
      y: 65,
      tag: 'Dulce, Cremoso & Fuerte',
      isOfficialHighlighted: true,
      flavorDesc: 'Ron, licor de fresa, Baileys Irish Cream y fresa fresca.',
      color: 'from-pink-500 to-rose-700'
    },
    {
      id: 'ft-dia-ckt-26',
      name: 'Virgin Mojito',
      code: 'FT CKT 26',
      price: 6.50,
      x: -70,
      y: -65,
      tag: 'Sin Alcohol · Refrescante',
      isOfficialHighlighted: true,
      flavorDesc: 'Soda, hierbabuena fresca palmeada, azúcar moreno y zumo de lima natural.',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'ft-dia-ckt-20',
      name: 'Aperol Spritz',
      code: 'FT CKT 20',
      price: 8.50,
      x: -30,
      y: -35,
      tag: 'Ligero & Cítrico',
      isOfficialHighlighted: true,
      flavorDesc: 'Aperol, cava y soda en proporción 3:2:1 con hielo y naranja.',
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'ft-dia-ckt-18',
      name: 'Piña Colada',
      code: 'FT CKT 18',
      price: 8.50,
      x: 45,
      y: -40,
      tag: 'Dulce, Tropical & Cremoso',
      isOfficialHighlighted: true,
      flavorDesc: 'Ron blanco, zumo de piña y concentrado de coco batido.',
      color: 'from-amber-200 to-yellow-500'
    },
    {
      id: 'ft-dia-ckt-09',
      name: 'Dreamland',
      code: 'FT CKT 09',
      price: 8.50,
      x: 75,
      y: -60,
      tag: 'Dulce & Afrutado',
      isOfficialHighlighted: true,
      flavorDesc: 'Amaretto, vodka, granadina y zumo de piña con efecto degradado.',
      color: 'from-purple-400 to-rose-500'
    },

    // Otros cócteles oficiales de la carta diamond (para vista completa):
    {
      id: 'ft-dia-ckt-01',
      name: 'Sex on the Beach',
      code: 'FT CKT 01',
      price: 8.50,
      x: 20,
      y: 10,
      tag: 'Afrutado & Equilibrado',
      isOfficialHighlighted: false,
      flavorDesc: 'Vodka, licor de melocotón, zumo de naranja y granadina.',
      color: 'from-orange-500 to-rose-500'
    },
    {
      id: 'ft-dia-ckt-02',
      name: 'Blue Diamond',
      code: 'FT CKT 02',
      price: 8.50,
      x: 35,
      y: 15,
      tag: 'Tropical Insignia',
      isOfficialHighlighted: false,
      flavorDesc: 'Ron blanco, licor de coco, zumo de piña y Blue Curaçao.',
      color: 'from-cyan-400 to-blue-600'
    },
    {
      id: 'ft-dia-ckt-03',
      name: 'Mojito Tradicional',
      code: 'FT CKT 03',
      price: 8.50,
      x: -55,
      y: -15,
      tag: 'Refrescante & Herbal',
      isOfficialHighlighted: false,
      flavorDesc: 'Ron blanco, zumo de lima, hierbabuena fresca y soda.',
      color: 'from-emerald-400 to-green-600'
    },
    {
      id: 'ft-dia-ckt-23',
      name: 'Espresso Martini',
      code: 'FT CKT 23',
      price: 8.50,
      x: 50,
      y: 35,
      tag: 'Intenso & Tostado',
      isOfficialHighlighted: false,
      flavorDesc: 'Vodka, licor de café y café espresso fuerte recién tirado.',
      color: 'from-amber-700 to-stone-900'
    },
    {
      id: 'ft-dia-ckt-22',
      name: 'Classic Martini',
      code: 'FT CKT 22',
      price: 8.50,
      x: -45,
      y: 80,
      tag: 'Seco & Potente',
      isOfficialHighlighted: false,
      flavorDesc: 'Ginebra London Dry y vermut seco helado con aceituna o limón.',
      color: 'from-stone-300 to-slate-600'
    },
    {
      id: 'ft-dia-ckt-27',
      name: 'San Francisco',
      code: 'FT CKT 27',
      price: 6.50,
      x: 10,
      y: -80,
      tag: 'Sin Alcohol · Frutal',
      isOfficialHighlighted: false,
      flavorDesc: 'Zumo de naranja y piña con granadina bifásica 0.0%.',
      color: 'from-amber-400 to-rose-500'
    },
    {
      id: 'ft-dia-ckt-28',
      name: 'Virgin Colada',
      code: 'FT CKT 28',
      price: 6.50,
      x: 55,
      y: -75,
      tag: 'Sin Alcohol · Cremoso',
      isOfficialHighlighted: false,
      flavorDesc: 'Crema de coco espesa y zumo de piña frozen 0.0%.',
      color: 'from-amber-100 to-yellow-400'
    },
    {
      id: 'ft-dia-ckt-29',
      name: 'Mai Thai',
      code: 'FT CKT 29',
      price: 9.00,
      x: -15,
      y: 70,
      tag: 'Tiki & Especiado',
      isOfficialHighlighted: false,
      flavorDesc: 'Ron, Triple Seco, Amaretto, zumos tropicales y granadina.',
      color: 'from-orange-500 to-amber-700'
    }
  ];

  const displayedCocktails = viewMode === 'official' 
    ? compassCocktails.filter(c => c.isOfficialHighlighted)
    : compassCocktails;

  const content = (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              GUÍA SENSORIAL DE SERVICIO
            </span>
            <span className="text-xs font-mono text-stone-400">
              PVP Oficial Carta 2026
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 mt-1 flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-amber-400 shrink-0" />
            <span>La Brújula de Sabores</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-sans mt-0.5">
            Encuentra tu cóctel ideal según tu estado de ánimo y perfil de sabor preferido.
          </p>
        </div>

        {/* Toggle Modo Vista */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-stone-900 border border-stone-800 p-1 rounded-2xl flex items-center text-xs font-mono">
            <button
              onClick={() => setViewMode('official')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'official'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              8 Destacados Oficiales
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                viewMode === 'all'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Ver Todos ({compassCocktails.length})
            </button>
          </div>

          {isOpenModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-900 border border-stone-800 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* PLANO DE LA BRÚJULA */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[560px] bg-gradient-to-br from-stone-950 via-[#141210] to-stone-950 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-8 flex items-center justify-center">
        {/* Rosa de los vientos / Brújula de fondo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <div className="w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-amber-500/40 flex items-center justify-center">
            <div className="w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-full border border-amber-500/30 flex items-center justify-center">
              <Compass className="w-48 h-48 sm:w-72 sm:h-72 text-amber-400 stroke-[0.5]" />
            </div>
          </div>
        </div>

        {/* Ejes cartesianos */}
        {/* Eje Vertical (Y) */}
        <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-amber-500/60 via-stone-700/50 to-emerald-500/60 pointer-events-none" />
        {/* Eje Horizontal (X) */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-lime-500/60 via-stone-700/50 to-pink-500/60 pointer-events-none" />

        {/* ETIQUETAS DE LOS 4 EJES CARDINALES */}
        {/* Arriba: Fuerte / Intenso */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-stone-900/90 border border-rose-500/40 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Fuerte / Intenso</span>
        </div>

        {/* Abajo: Ligero / Sin Alcohol */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stone-900/90 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Ligero / Sin Alcohol</span>
        </div>

        {/* Izquierda: Cítrico y Refrescante */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-stone-900/90 border border-lime-500/40 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold text-lime-300 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-lime-400" />
          <span>Cítrico & Refrescante</span>
        </div>

        {/* Derecha: Dulce y Cremoso */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-stone-900/90 border border-pink-500/40 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-pink-400" />
          <span>Dulce & Cremoso</span>
        </div>

        {/* PUNTOS DE LOS CÓCTELES PLOTEADOS */}
        {displayedCocktails.map((cocktail) => {
          // Convert [-100, 100] to percentage [12%, 88%] to avoid edges
          const leftPercent = 50 + (cocktail.x / 100) * 36;
          const topPercent = 50 - (cocktail.y / 100) * 36;
          const isSelected = selectedItem?.id === cocktail.id;

          return (
            <div
              key={cocktail.id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              onClick={() => setSelectedItem(cocktail)}
            >
              {/* Pin del cóctel */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${cocktail.color} p-0.5 shadow-lg transform transition-all duration-200 group-hover:scale-125 ${
                    isSelected ? 'ring-4 ring-amber-400 scale-125' : 'hover:shadow-amber-500/20'
                  }`}
                >
                  <div className="w-full h-full bg-stone-950/80 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                    <Wine className="w-4 h-4 sm:w-5 sm:h-5 text-stone-100 group-hover:text-amber-300 transition-colors" />
                  </div>
                </div>

                {/* Etiqueta flotante con nombre y precio */}
                <div className="mt-1.5 px-2 py-0.5 rounded-lg bg-stone-950/90 border border-stone-700/80 backdrop-blur-md shadow-md text-center whitespace-nowrap transition-transform group-hover:scale-105">
                  <span className="text-[10px] sm:text-[11px] font-display font-bold text-stone-100 block">
                    {cocktail.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 block">
                    {cocktail.price.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TARJETA DE DETALLE DEL CÓCTEL SELECCIONADO EN LA BRÚJULA */}
      {selectedItem ? (
        <div className="p-5 rounded-2xl bg-stone-900 border border-amber-500/50 space-y-3 animate-fadeIn shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {selectedItem.code}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedItem.tag}
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  PVP Carta: {selectedItem.price.toFixed(2)} €
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-stone-100">
                {selectedItem.name}
              </h3>
              <p className="text-xs text-stone-300 font-sans">
                {selectedItem.flavorDesc}
              </p>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="text-stone-400 hover:text-stone-200 p-1.5 rounded-xl hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400">
              Ubicación en Brújula: {selectedItem.x < 0 ? 'Cítrico' : 'Dulce'} · {selectedItem.y > 0 ? 'Fuerte' : 'Ligero'}
            </span>

            {onSelectCocktail && (
              <button
                onClick={() => {
                  const sheet = COCKTAILS_MASTER_TECHNICAL_SHEETS.find(s => s.id === selectedItem.id || s.code === selectedItem.code);
                  if (sheet) {
                    onSelectCocktail(sheet);
                    if (onClose) onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono text-xs font-bold transition-colors shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Ficha Técnica Completa ({selectedItem.code})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800/80 text-xs font-mono text-stone-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Modo Interactivo:</strong> Haz clic en cualquier cóctel de la brújula para consultar su perfil sensorial, ingredientes y abrir su ficha técnica oficial con escandallo y receta milimetrada.
            </span>
          </div>
          <span className="text-[11px] text-amber-300 shrink-0 hidden sm:inline">
            Carta Terraza Diamond 2026
          </span>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 my-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
