import React, { useState } from 'react';
import { 
  CloudSun, 
  Droplet, 
  Filter, 
  Leaf, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Wind, 
  X, 
  ExternalLink 
} from 'lucide-react';
import { FoodItem, ClimateZone, FoodCategory } from '../types/clima';

interface AtlasBioclimaticoViewProps {
  foods: FoodItem[];
  onSelectForCalculator?: (food: FoodItem) => void;
}

export const AtlasBioclimaticoView: React.FC<AtlasBioclimaticoViewProps> = ({
  foods,
  onSelectForCalculator
}) => {
  const [selectedClimate, setSelectedClimate] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailFood, setDetailFood] = useState<FoodItem | null>(null);

  const filteredFoods = foods.filter(item => {
    if (selectedClimate !== 'todos' && item.primaryClimate !== selectedClimate) return false;
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q) || item.scientificName.toLowerCase().includes(q);
      const matchNutrient = item.keyNutrients.some(n => n.toLowerCase().includes(q));
      const matchBenefit = item.climateBenefit.toLowerCase().includes(q);
      if (!matchName && !matchNutrient && !matchBenefit) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Atlas Bioclimático</span>
          <span aria-hidden="true">·</span>
          <span>Despensa Terrestre y Resiliencia Nutricional</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Grupos de Alimentos y Ecosistemas de la Vida
        </h1>
        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Catálogo riguroso de especies vegetales, legumbres fijadoras, granos ancestrales y proteínas marinas de impacto cero. Analiza la huella de carbono, agua y el beneficio directo para la salud del suelo y del ser humano.
        </p>
      </section>

      {/* Controles de Búsqueda y Filtros */}
      <section className="bg-stone-900/60 border border-stone-800 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por alimento, nombre botánico, nutriente (ej. magnesio, omega-3, silicio) o beneficio..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros por Clima y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-stone-400 block mb-1.5 font-medium">Zona Bioclimática:</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'todos', label: 'Todos los climas' },
                { id: 'mediterraneo', label: 'Mediterráneo' },
                { id: 'templado', label: 'Templado / Costero' },
                { id: 'arido', label: 'Árido / C4' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClimate(c.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedClimate === c.id
                      ? 'bg-emerald-400 text-stone-950 font-semibold'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-stone-400 block mb-1.5 font-medium">Grupo Agroalimentario:</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'todos', label: 'Todas las familias' },
                { id: 'leguminosas_fijadoras', label: 'Legumbres fijadoras' },
                { id: 'cereales_ancestrales', label: 'Cereales ancestrales' },
                { id: 'hortalizas_raiz_hoja', label: 'Hortalizas' },
                { id: 'frutas_polinizacion', label: 'Frutas bioclimáticas' },
                { id: 'acuicultura_regenerativa', label: 'Acuicultura marina' },
                { id: 'frutos_secos_semillas', label: 'Semillas & Frutos secos' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-400 text-stone-950 font-semibold'
                      : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Especies y Alimentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map(food => (
          <div
            key={food.id}
            className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 flex flex-col justify-between hover:border-emerald-700/60 hover:bg-stone-900/80 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="text-emerald-400 font-medium">{food.categoryLabel}</span>
                <span className="font-mono text-stone-400">{food.climateZoneLabel}</span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                  {food.name}
                </h3>
                <div className="text-xs italic text-stone-400 font-serif">
                  {food.scientificName}
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                {food.climateBenefit}
              </p>

              {/* Indicadores Cuantitativos Bioclimáticos */}
              <div className="grid grid-cols-2 gap-2 bg-stone-950/80 p-3 rounded-xl border border-stone-800 font-mono text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Huella de Carbono</span>
                  <span className="text-stone-200 font-semibold">{food.carbonFootprintKgCO2e} kg CO₂e/kg</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Huella Hídrica Total</span>
                  <span className="text-stone-200 font-semibold">
                    {food.waterFootprintLiters === 0 ? '0 L (Mar)' : `${food.waterFootprintLiters} L/kg`}
                  </span>
                </div>
              </div>

              {/* Nutrientes Clave */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-400">Nutrientes Vitales:</div>
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-300">
                  {food.keyNutrients.slice(0, 3).map((nutr, idx) => (
                    <span key={idx} className="bg-stone-800/80 px-2 py-0.5 rounded text-stone-300">
                      {nutr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-stone-800/80 mt-4 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Densidad: <strong className="text-emerald-400 font-mono">{food.nutrientDensityScore}/100</strong>
              </span>

              <button
                onClick={() => setDetailFood(food)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              >
                Ficha Completa
              </button>
            </div>
          </div>
        ))}

        {filteredFoods.length === 0 && (
          <div className="col-span-full text-center py-12 bg-stone-900/30 rounded-2xl border border-stone-800 p-8 space-y-3">
            <Leaf className="w-8 h-8 text-stone-600 mx-auto" />
            <h4 className="font-display text-lg font-bold text-stone-300">
              No se han encontrado alimentos para este criterio
            </h4>
            <p className="text-xs text-stone-500">
              Prueba a restablecer los filtros de clima o borrar el término de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Ficha Técnica Detallada */}
      {detailFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-100">
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <div className="text-xs font-mono text-emerald-400">
                  {detailFood.categoryLabel} · {detailFood.climateZoneLabel}
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-100 mt-0.5">
                  {detailFood.name}
                </h3>
                <div className="text-xs italic text-stone-400 font-serif">
                  {detailFood.scientificName}
                </div>
              </div>
              <button
                onClick={() => setDetailFood(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Métricas destacadas */}
            <div className="grid grid-cols-3 gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800 text-center font-mono">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Huella CO₂e</span>
                <span className="text-stone-100 font-bold text-sm sm:text-base">
                  {detailFood.carbonFootprintKgCO2e} kg
                </span>
                <span className="text-[10px] text-stone-500 block">por kg alimento</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Agua Consumida</span>
                <span className="text-stone-100 font-bold text-sm sm:text-base">
                  {detailFood.waterFootprintLiters === 0 ? '0 L' : `${detailFood.waterFootprintLiters} L`}
                </span>
                <span className="text-[10px] text-stone-500 block">mayoría agua verde</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Densidad Vital</span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">
                  {detailFood.nutrientDensityScore} / 100
                </span>
                <span className="text-[10px] text-stone-500 block">índice fitoquímico</span>
              </div>
            </div>

            {/* Desglose científico */}
            <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <div className="space-y-1">
                <h5 className="font-display font-semibold text-stone-100">
                  Resiliencia Climática & Papel en el Ecosistema:
                </h5>
                <p>{detailFood.climateBenefit}</p>
              </div>

              <div className="space-y-1">
                <h5 className="font-display font-semibold text-stone-100">
                  Función Biológica en la Fisiología Humana:
                </h5>
                <p>{detailFood.vitalRole}</p>
              </div>

              <div className="space-y-1">
                <h5 className="font-display font-semibold text-stone-100">
                  Conservación Ancestral (Cero Desperdicio):
                </h5>
                <p>{detailFood.traditionalConservation}</p>
              </div>

              <div className="space-y-1">
                <h5 className="font-display font-semibold text-stone-100">
                  Pauta de Consumo Recomendada:
                </h5>
                <p>{detailFood.recommendedIntake}</p>
              </div>
            </div>

            {/* Nutrientes */}
            <div className="pt-2">
              <div className="text-xs font-mono text-stone-400 mb-2">Composición Nutricional Notoria:</div>
              <div className="flex flex-wrap gap-1.5">
                {detailFood.keyNutrients.map((n, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-end">
              <button
                onClick={() => setDetailFood(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
