import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Droplet, 
  Flame, 
  Leaf, 
  Plus, 
  RotateCcw, 
  Scale, 
  Sparkles, 
  Trash2, 
  Zap 
} from 'lucide-react';
import { FoodItem } from '../types/clima';

interface CalculadoraBioclimaticaViewProps {
  foods: FoodItem[];
}

interface SelectedPlateItem {
  id: string;
  foodId: string;
  grams: number;
}

const PRESET_MENUS = [
  {
    name: 'Menú Tradicional Mediterráneo de Secano',
    description: 'Garbanzos castellanos, aceite de oliva virgen extra de secano y almendra marcona.',
    items: [
      { foodId: 'garbanzo-pedrosillano', grams: 200 },
      { foodId: 'aceite-oliva-virgen-extra', grams: 30 },
      { foodId: 'almendra-marcona', grams: 30 },
      { foodId: 'espinaca-invierno', grams: 150 }
    ]
  },
  {
    name: 'Menú Otoño Resiliente (C4 & Raíces)',
    description: 'Mijo dorado ancestral, lentejas pardinas de secano y zanahorias moradas con granada.',
    items: [
      { foodId: 'mijo-dorado', grams: 100 },
      { foodId: 'lenteja-pardina', grams: 180 },
      { foodId: 'zanahoria-morada', grams: 150 },
      { foodId: 'granada-mollar', grams: 120 }
    ]
  },
  {
    name: 'Menú Marino Regenerativo & Bateas',
    description: 'Mejillón atlántico de batea, alga wakame atlántica y centeno integral con AOVE.',
    items: [
      { foodId: 'mejillon-atlantico', grams: 200 },
      { foodId: 'alga-wakame-atlantica', grams: 15 },
      { foodId: 'centeno-integral', grams: 80 },
      { foodId: 'aceite-oliva-virgen-extra', grams: 25 }
    ]
  }
];

export const CalculadoraBioclimaticaView: React.FC<CalculadoraBioclimaticaViewProps> = ({
  foods
}) => {
  const [selectedItems, setSelectedItems] = useState<SelectedPlateItem[]>([
    { id: 'item-1', foodId: 'garbanzo-pedrosillano', grams: 200 },
    { id: 'item-2', foodId: 'aceite-oliva-virgen-extra', grams: 30 },
    { id: 'item-3', foodId: 'espinaca-invierno', grams: 150 }
  ]);

  const [addFoodId, setAddFoodId] = useState<string>(foods[0]?.id || '');
  const [addGrams, setAddGrams] = useState<number>(100);

  const handleAddItem = () => {
    if (!addFoodId) return;
    const newItem: SelectedPlateItem = {
      id: `item-${Date.now()}`,
      foodId: addFoodId,
      grams: addGrams > 0 ? addGrams : 100
    };
    setSelectedItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateGrams = (id: string, grams: number) => {
    setSelectedItems(prev => prev.map(i => i.id === id ? { ...i, grams: Math.max(10, grams) } : i));
  };

  const handleLoadPreset = (presetIndex: number) => {
    const preset = PRESET_MENUS[presetIndex];
    setSelectedItems(
      preset.items.map((it, idx) => ({
        id: `preset-${idx}-${Date.now()}`,
        foodId: it.foodId,
        grams: it.grams
      }))
    );
  };

  const handleReset = () => {
    setSelectedItems([]);
  };

  // Cálculos de Huella en Tiempo Real
  let totalCarbonKg = 0;
  let totalWaterLiters = 0;
  let weightedNutrientScoreSum = 0;
  let totalWeightGrams = 0;

  selectedItems.forEach(item => {
    const food = foods.find(f => f.id === item.foodId);
    if (food) {
      const factor = item.grams / 1000;
      totalCarbonKg += food.carbonFootprintKgCO2e * factor;
      totalWaterLiters += food.waterFootprintLiters * factor;
      weightedNutrientScoreSum += food.nutrientDensityScore * item.grams;
      totalWeightGrams += item.grams;
    }
  });

  const avgNutrientScore = totalWeightGrams > 0 ? Math.round(weightedNutrientScoreSum / totalWeightGrams) : 0;

  // Límite Planetario EAT-Lancet: max 2.1 kg CO2e / persona / día
  const PLANETARY_CARBON_LIMIT = 2.1;
  const isWithinPlanetaryLimit = totalCarbonKg <= PLANETARY_CARBON_LIMIT;
  const carbonPercentageOfLimit = Math.round((totalCarbonKg / PLANETARY_CARBON_LIMIT) * 100);

  // Equivalente convencional (ej. si este plato incluyera carne de vacuno convencional de 200g: +14 kg CO2e y +3.000 L de agua)
  const conventionalCarbonEquiv = (totalCarbonKg + 7.5).toFixed(1);
  const carbonSavingsPercentage = totalCarbonKg > 0 ? Math.round(((parseFloat(conventionalCarbonEquiv) - totalCarbonKg) / parseFloat(conventionalCarbonEquiv)) * 100) : 0;

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Simulador & Calculadora</span>
          <span aria-hidden="true">·</span>
          <span>Modelo de Salud Planetaria EAT-Lancet</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Calculadora de Dieta Bioclimática & Vida
        </h1>
        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Diseña una comida o menú diario combinando especies agrícolas y evalúa en tiempo real su huella de carbono e hídrica frente a los límites biofísicos de la Tierra.
        </p>
      </section>

      {/* Menús Preconfigurados */}
      <section className="space-y-3">
        <div className="text-xs font-mono text-stone-400">
          Cargar Menús Bioclimáticos de Referencia:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_MENUS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadPreset(idx)}
              className="text-left bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-emerald-600/60 p-4 rounded-xl transition-all space-y-1 group"
            >
              <div className="text-xs font-semibold text-stone-200 group-hover:text-emerald-300 transition-colors">
                {preset.name}
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Panel Principal: Selector + Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Configuración del Plato (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/40 border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-stone-100">
                Composición de la Dieta
              </h2>
              <span className="text-xs text-stone-400">
                {selectedItems.length} ingredientes agregados · {totalWeightGrams}g peso total
              </span>
            </div>

            {selectedItems.length > 0 && (
              <button
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-stone-200 inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          {/* Formulario para agregar ingrediente */}
          <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-3">
            <span className="text-xs font-semibold text-stone-300 block">
              Añadir Especie al Menú:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <select
                value={addFoodId}
                onChange={(e) => setAddFoodId(e.target.value)}
                className="sm:col-span-7 bg-stone-900 border border-stone-800 text-xs text-stone-100 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                {foods.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.carbonFootprintKgCO2e} kg CO₂e/kg)
                  </option>
                ))}
              </select>

              <div className="sm:col-span-3 flex items-center bg-stone-900 border border-stone-800 rounded-lg px-2">
                <input
                  type="number"
                  min="10"
                  max="2000"
                  step="10"
                  value={addGrams}
                  onChange={(e) => setAddGrams(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-xs text-stone-100 py-2 focus:outline-none text-right pr-1 font-mono"
                />
                <span className="text-xs text-stone-500 font-mono">g</span>
              </div>

              <button
                onClick={handleAddItem}
                className="sm:col-span-2 px-3 py-2 bg-emerald-400 hover:bg-emerald-300 text-stone-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* Lista de Alimentos en el Plato */}
          <div className="space-y-2.5">
            {selectedItems.map(item => {
              const food = foods.find(f => f.id === item.foodId);
              if (!food) return null;
              const factor = item.grams / 1000;
              const itemCarbon = (food.carbonFootprintKgCO2e * factor).toFixed(2);
              const itemWater = Math.round(food.waterFootprintLiters * factor);

              return (
                <div
                  key={item.id}
                  className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-stone-200 truncate">
                      {food.name}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono flex items-center gap-2">
                      <span>{itemCarbon} kg CO₂e</span>
                      <span aria-hidden="true">·</span>
                      <span>{itemWater === 0 ? '0 L (Mar)' : `${itemWater} L`}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center bg-stone-900 border border-stone-800 rounded px-2 py-1">
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        step="10"
                        value={item.grams}
                        onChange={(e) => handleUpdateGrams(item.id, parseInt(e.target.value) || 0)}
                        className="w-14 bg-transparent text-xs text-stone-200 font-mono text-right focus:outline-none"
                      />
                      <span className="text-[11px] text-stone-500 font-mono ml-1">g</span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-stone-500 hover:text-rose-400 transition-colors"
                      title="Eliminar del plato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {selectedItems.length === 0 && (
              <div className="text-center py-8 text-stone-500 text-xs">
                No hay alimentos en el menú actual. Añade ingredientes arriba o carga un menú de referencia.
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Indicadores Científicos & Umbrales (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tarjeta de Huella de Carbono */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-stone-400">
                Huella de Carbono Total
              </span>
              <span className="text-xs font-mono text-emerald-400">
                EAT-Lancet 2026
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-display text-4xl font-bold text-stone-100 font-mono">
                {totalCarbonKg.toFixed(2)}{' '}
                <span className="text-lg font-normal text-stone-400 font-sans">kg CO₂e</span>
              </div>
              <div className="text-xs text-stone-400">
                Límite bioclimático diario: <strong>{PLANETARY_CARBON_LIMIT} kg CO₂e / persona</strong>
              </div>
            </div>

            {/* Barra de umbral planetario */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    isWithinPlanetaryLimit ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(carbonPercentageOfLimit, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={isWithinPlanetaryLimit ? 'text-emerald-400' : 'text-rose-400'}>
                  {carbonPercentageOfLimit}% del límite planetario
                </span>
                <span className="text-stone-500">2.1 kg límite</span>
              </div>
            </div>

            {isWithinPlanetaryLimit ? (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dieta en sintonía con el planeta:</strong> Cumple holgadamente el umbral de emisiones para frenar el calentamiento global.
                </span>
              </div>
            ) : (
              <div className="bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl flex items-start gap-2 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Supera el umbral planetario:</strong> Reduce la cantidad o sustituye productos por leguminosas fijadoras de secano.
                </span>
              </div>
            )}
          </div>

          {/* Tarjeta de Huella Hídrica y Densidad */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center text-stone-400">
              <span>HUELLA HÍDRICA ESTIMADA</span>
              <Droplet className="w-4 h-4 text-sky-400" />
            </div>

            <div className="font-display text-3xl font-bold text-stone-100">
              {Math.round(totalWaterLiters).toLocaleString()}{' '}
              <span className="text-sm font-sans font-normal text-stone-400">Litros</span>
            </div>

            <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
              En este menú, más del 80% corresponde a <strong>Agua Verde</strong> (lluvia absorbida naturalmente por el suelo) sin sobreexplotación de acuíferos subterráneos.
            </p>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-stone-400 font-sans">Densidad Fitoquímica Media:</span>
              <span className="font-bold text-emerald-400 text-sm">{avgNutrientScore}/100</span>
            </div>
          </div>

          {/* Comparativa con Dieta Convencional Industrial */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5 space-y-2 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Ahorro Climático frente a Dieta Convencional:</span>
            </div>
            <p className="leading-relaxed">
              Un menú estándar con carne de engorde estabulado e ingredientes ultraprocesados generaría en torno a <strong>{conventionalCarbonEquiv} kg CO₂e</strong>. Tu configuración actual reduce las emisiones un <strong>{carbonSavingsPercentage}%</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
