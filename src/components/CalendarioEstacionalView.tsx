import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CloudSun, 
  Droplets, 
  Flame, 
  Leaf, 
  Moon, 
  Sun, 
  Utensils 
} from 'lucide-react';
import { MonthPhenology } from '../types/clima';

interface CalendarioEstacionalViewProps {
  months: MonthPhenology[];
}

export const CalendarioEstacionalView: React.FC<CalendarioEstacionalViewProps> = ({
  months
}) => {
  // Default to September (index 8) or current month
  const currentMonthIdx = new Date().getMonth();
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(currentMonthIdx);

  const activeMonth = months[activeMonthIndex] || months[8];

  const handlePrev = () => {
    setActiveMonthIndex(prev => (prev === 0 ? 11 : prev - 1));
  };

  const handleNext = () => {
    setActiveMonthIndex(prev => (prev === 11 ? 0 : prev + 1));
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'primavera': return 'text-emerald-400 border-emerald-800 bg-emerald-950/40';
      case 'verano': return 'text-amber-400 border-amber-800 bg-amber-950/40';
      case 'otono': return 'text-orange-400 border-orange-800 bg-orange-950/40';
      case 'invierno': return 'text-sky-400 border-sky-800 bg-sky-950/40';
      default: return 'text-stone-300 border-stone-800 bg-stone-900';
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Rueda de la Vida</span>
          <span aria-hidden="true">·</span>
          <span>Fenología Agraria & Ciclos Solares</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Calendario Fenológico de las 4 Estaciones
        </h1>
        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          La naturaleza no produce lo mismo en enero que en julio. Conoce el estado térmico del suelo, las horas de insolación y los alimentos en su punto de máxima vitalidad biológica mes a mes.
        </p>
      </section>

      {/* Selector de Meses en Carrusel / Botonera */}
      <section className="space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 bg-stone-900/60 p-2 rounded-2xl border border-stone-800">
          {months.map((m) => {
            const isSelected = m.monthIndex === activeMonthIndex;
            return (
              <button
                key={m.monthIndex}
                onClick={() => setActiveMonthIndex(m.monthIndex)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? 'bg-stone-100 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/80'
                }`}
              >
                <span>{m.name.slice(0, 3)}</span>
                <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">
                  {m.season.slice(0, 4)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Ficha Editorial del Mes Seleccionado */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 sm:p-10 space-y-8">
        {/* Cabecera del Mes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${getSeasonColor(activeMonth.season)}`}>
                {activeMonth.season}
              </span>
              <span className="text-xs text-stone-500 font-mono">Mes {activeMonth.monthIndex + 1} de 12</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-100">
              {activeMonth.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Bloques Fenológicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Insolación y Atmósfera */}
          <div className="bg-stone-950/70 border border-stone-800/80 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sun className="w-4 h-4" />
              <span>Radiación Solar & Fotoperiodo</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeMonth.solarCharacteristics}
            </p>
          </div>

          {/* 2. Suelo y Microbioma */}
          <div className="bg-stone-950/70 border border-stone-800/80 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Leaf className="w-4 h-4" />
              <span>Estado del Suelo & Raíces</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeMonth.soilCondition}
            </p>
          </div>

          {/* 3. Necesidad Metabólica Humana */}
          <div className="bg-stone-950/70 border border-stone-800/80 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <Flame className="w-4 h-4" />
              <span>Fisiología & Respuesta Metabólica</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeMonth.metabolicNeed}
            </p>
          </div>

          {/* 4. Conservación Ancestral Cero Desperdicio */}
          <div className="bg-stone-950/70 border border-stone-800/80 p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Utensils className="w-4 h-4" />
              <span>Conservación Ancestral del Excedente</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeMonth.conservationTask}
            </p>
          </div>
        </div>

        {/* Cosecha Óptima del Mes */}
        <div className="pt-4 border-t border-stone-800/80 space-y-3">
          <div className="text-xs font-mono text-stone-400">
            Alimentos en Pico de Cosecha & Máxima Concentración Fitoquímica:
          </div>
          <div className="flex flex-wrap gap-2">
            {activeMonth.peakHarvestFoods.map((foodName, idx) => (
              <span
                key={idx}
                className="bg-emerald-950/60 border border-emerald-800/70 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{foodName}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
