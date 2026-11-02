import React, { useState, useMemo } from 'react';
import { 
  Coffee, 
  UtensilsCrossed, 
  Wine, 
  Search, 
  Sun, 
  Layers 
} from 'lucide-react';
import { BAR_SOL_MENU } from '../data/operationsData';
import { BarSolMenuItem, BarSolCategory } from '../types/operations';

interface BarSolMenuViewProps {
  onBackToOperations?: () => void;
}

export function BarSolMenuView({ onBackToOperations }: BarSolMenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<BarSolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: BarSolCategory | 'all'; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'Toda la Carta', icon: <Layers className="w-4 h-4" />, count: BAR_SOL_MENU.length },
    { id: 'cocteleria', label: 'Coctelería de Barra', icon: <Wine className="w-4 h-4" />, count: BAR_SOL_MENU.filter(m => m.category === 'cocteleria').length },
    { id: 'cafeteria_bebidas', label: 'Cafetería & Bebidas', icon: <Coffee className="w-4 h-4" />, count: BAR_SOL_MENU.filter(m => m.category === 'cafeteria_bebidas').length },
    { id: 'platos_principales', label: 'Platos & Cocina', icon: <UtensilsCrossed className="w-4 h-4" />, count: BAR_SOL_MENU.filter(m => m.category === 'platos_principales').length }
  ];

  const filteredItems = useMemo(() => {
    return BAR_SOL_MENU.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query) || (item.nameEn && item.nameEn.toLowerCase().includes(query));
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[#2C3E50]">
      {/* Banner de Cabecera */}
      <div className="rounded-xl bg-white border border-[#E2E8F0] p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono text-[#2C3E50]">
                <Sun className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>PUNTO DE VENTA F&B · CARTA OFICIAL</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#2C3E50]">
              Carta Operativa & Fichas Gastronómicas
            </h1>
            <p className="text-xs sm:text-sm text-[#2C3E50]/80 leading-relaxed">
              Consulta operativa de bebidas, combinados estandarizados, cafés especiales y cocina rápida con tabla oficial de alérgenos (Reglamento UE 1169/2011).
            </p>
          </div>

          {onBackToOperations && (
            <button
              onClick={onBackToOperations}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-[#2C3E50] bg-transparent border border-[#E2E8F0] hover:bg-[#F8F9FA] transition-colors self-start"
            >
              ← Volver
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-[#C5A880] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por plato, ingrediente o receta..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#1A2530] text-white font-bold'
                  : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-75">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos o Estado Vacío */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white border border-[#E2E8F0] space-y-3 max-w-xl mx-auto">
          <UtensilsCrossed className="w-10 h-10 text-[#C5A880] mx-auto" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#2C3E50]">
              La carta de este punto de venta está limpia
            </h4>
            <p className="text-xs text-[#2C3E50]/70 font-mono">
              Lista para estructurar e incorporar la oferta gastronómica y de coctelería de su empresa.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] font-bold">
                    {item.categoryLabel}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#C5A880]">
                    {item.price.toFixed(2)} €
                  </span>
                </div>

                <h3 className="font-bold text-[#2C3E50] text-base">
                  {item.name}
                </h3>
                {item.nameEn && (
                  <p className="text-[11px] text-[#2C3E50]/60 italic font-sans">{item.nameEn}</p>
                )}

                <p className="text-xs text-[#2C3E50]/80 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-[#2C3E50]/70">
                  <span>Alérgenos:</span>
                  <span className="text-[#2C3E50]">
                    {item.allergens.length > 0 ? item.allergens.join(', ') : 'Sin alérgenos declarables'}
                  </span>
                </div>
                {item.technicalRecipeRef && (
                  <div className="flex justify-between text-[#2C3E50]/60">
                    <span>Ficha Técnica:</span>
                    <span className="text-[#C5A880] font-bold">{item.technicalRecipeRef}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
