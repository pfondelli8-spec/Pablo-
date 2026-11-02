import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Layers,
  Search,
  Filter,
  Printer,
  ChevronRight,
  Sun,
  Flame,
  Moon,
  Sparkles,
  Edit2,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  DayGastronomicMatrix,
  gastronomicMatrixService,
  BREAKFAST_SHOW_COOKING_LIBRARY,
  LUNCH_PROTEIN_LIBRARY,
  DINNER_THEMATIC_CORNER_LIBRARY
} from '../services/gastronomicMatrixService';

interface GastronomicMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
}

export const GastronomicMatrixModal: React.FC<GastronomicMatrixModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName
}) => {
  // Bloque activo: 'bloque_1' (Días 1-15) | 'bloque_2' (Días 16-30) | 'todos' (30 Días)
  const [activeBlock, setActiveBlock] = useState<'bloque_1' | 'bloque_2' | 'todos'>('bloque_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayToEdit, setSelectedDayToEdit] = useState<DayGastronomicMatrix | null>(null);

  // Cargar matriz mensual
  const [matrix, setMatrix] = useState<DayGastronomicMatrix[]>(() => {
    return gastronomicMatrixService.getMonthlyMatrix(hotelId);
  });

  // Filtrado de días
  const displayedDays = useMemo(() => {
    return matrix.filter(day => {
      if (activeBlock === 'bloque_1' && day.block !== 'bloque_1') return false;
      if (activeBlock === 'bloque_2' && day.block !== 'bloque_2') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchDay = `día ${day.dayNumber}`.includes(q) || day.weekDayLabel.toLowerCase().includes(q);
      const matchDes = day.desayunoShowCooking.name.toLowerCase().includes(q);
      const matchAlm = day.almuerzoProteina.name.toLowerCase().includes(q);
      const matchCen = day.cenaRinconTematico.themeName.toLowerCase().includes(q) ||
        day.cenaRinconTematico.items.some(i => i.name.toLowerCase().includes(q));

      return matchDay || matchDes || matchAlm || matchCen;
    });
  }, [matrix, activeBlock, searchQuery]);

  if (!isOpen) return null;

  const handleUpdateItem = (type: 'desayuno' | 'almuerzo' | 'cena_tema', newItemName: string) => {
    if (!selectedDayToEdit) return;

    let updatedDay: Partial<DayGastronomicMatrix> = {};

    if (type === 'desayuno') {
      updatedDay = {
        desayunoShowCooking: {
          ...selectedDayToEdit.desayunoShowCooking,
          name: newItemName
        }
      };
    } else if (type === 'almuerzo') {
      updatedDay = {
        almuerzoProteina: {
          ...selectedDayToEdit.almuerzoProteina,
          name: newItemName
        }
      };
    } else if (type === 'cena_tema') {
      updatedDay = {
        cenaRinconTematico: {
          ...selectedDayToEdit.cenaRinconTematico,
          themeName: newItemName
        }
      };
    }

    const updated = gastronomicMatrixService.updateDayMatrix(hotelId, selectedDayToEdit.dayNumber, updatedDay);
    setMatrix(updated);
    setSelectedDayToEdit(prev => (prev ? { ...prev, ...updatedDay } : null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera Corporativa (#1A2530) */}
        <div className="bg-[#1A2530] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880]">
                  PLANIFICACIÓN MENSUAL (30 DÍAS)
                </span>
                <span className="text-xs text-white/60">{hotelName}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Ruedas de Menú · Matriz Gastronómica
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10 print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Imprimir Planificación</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Selector de Bloques (Días 1-15 y Días 16-30) */}
        <div className="bg-[#F8F9FA] px-6 py-3.5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 print:hidden">
          {/* Selector de los Dos Bloques Requeridos */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveBlock('bloque_1')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBlock === 'bloque_1'
                  ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                  : 'text-slate-600 hover:text-[#1A2530] hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bloque 1 · Días 1 - 15</span>
            </button>

            <button
              onClick={() => setActiveBlock('bloque_2')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeBlock === 'bloque_2'
                  ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                  : 'text-slate-600 hover:text-[#1A2530] hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Bloque 2 · Días 16 - 30</span>
            </button>

            <button
              onClick={() => setActiveBlock('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeBlock === 'todos'
                  ? 'bg-slate-200 text-[#1A2530] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mes Completo (30d)
            </button>
          </div>

          {/* Buscador Rápido y Métricas de Base de Datos */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-bold border border-amber-200">
                60 ítems Desayuno
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold border border-blue-200">
                60 ítems Almuerzo
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-mono font-bold border border-indigo-200">
                90 ítems Cena
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar plato, ingrediente, temática..."
                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A880] w-64 text-[#2C3E50]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLA PRINCIPAL: 4 COLUMNAS OPERATIVAS OBLIGATORIAS */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F8F9FA]">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              {/* Encabezado con las 4 Columnas */}
              <thead>
                <tr className="bg-[#1A2530] text-white uppercase text-[11px] font-bold tracking-wider border-b border-[#2C3E50]">
                  <th className="py-3.5 px-4 w-28 text-center shrink-0">
                    Columna 1<br />
                    <span className="text-[#C5A880] text-sm font-extrabold normal-case">Día</span>
                  </th>
                  <th className="py-3.5 px-4 w-1/3 border-l border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <div>
                        Columna 2<br />
                        <span className="text-white text-sm font-extrabold normal-case">
                          Especial Desayuno
                        </span>
                        <span className="block text-[10px] text-[#C5A880] normal-case font-normal">
                          Show Cooking (base 60 ítems)
                        </span>
                      </div>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-1/3 border-l border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <div>
                        Columna 3<br />
                        <span className="text-white text-sm font-extrabold normal-case">
                          Proteína Principal Almuerzo
                        </span>
                        <span className="block text-[10px] text-amber-300 normal-case font-normal">
                          Buffet & Plancha (base 60 ítems)
                        </span>
                      </div>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-1/3 border-l border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <div>
                        Columna 4<br />
                        <span className="text-white text-sm font-extrabold normal-case">
                          Rincón Temático Cena
                        </span>
                        <span className="block text-[10px] text-indigo-300 normal-case font-normal">
                          Temática & Show Cooking (base 90 ítems)
                        </span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Cuerpo de la Tabla */}
              <tbody className="divide-y divide-slate-100 font-sans">
                {displayedDays.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No se encontraron resultados para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  displayedDays.map(day => (
                    <tr
                      key={day.dayNumber}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Columna 1: Día */}
                      <td className="py-3.5 px-4 align-top text-center bg-slate-50/50 group-hover:bg-slate-100/50 transition-colors border-r border-slate-100">
                        <div className="inline-flex flex-col items-center justify-center">
                          <span className="text-base font-black text-[#1A2530]">
                            Día {day.dayNumber}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {day.weekDayLabel}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 border ${
                            day.block === 'bloque_1'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          }`}>
                            {day.block === 'bloque_1' ? 'B1 (1-15)' : 'B2 (16-30)'}
                          </span>
                        </div>
                      </td>

                      {/* Columna 2: Especial Desayuno (Show Cooking - base 60 ítems) */}
                      <td className="py-3.5 px-4 align-top border-r border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#1A2530] text-[13px] leading-snug">
                              {day.desayunoShowCooking.name}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-900 font-medium">
                              Show Cooking
                            </span>
                            {day.desayunoShowCooking.serviceTemp && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                {day.desayunoShowCooking.serviceTemp}
                              </span>
                            )}
                            {day.desayunoShowCooking.allergens?.map(a => (
                              <span key={a} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Columna 3: Proteína Principal Almuerzo (base 60 ítems) */}
                      <td className="py-3.5 px-4 align-top border-r border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#2C3E50] text-[13px] leading-snug">
                              {day.almuerzoProteina.name}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-900 font-medium">
                              Proteína Principal
                            </span>
                            {day.almuerzoProteina.serviceTemp && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                {day.almuerzoProteina.serviceTemp}
                              </span>
                            )}
                            {day.almuerzoProteina.allergens?.map(a => (
                              <span key={a} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Columna 4: Rincón Temático Cena (base 90 ítems) */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                              {day.cenaRinconTematico.themeName}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {day.cenaRinconTematico.items.slice(0, 3).map((item, idx) => (
                              <div key={item.id} className="text-xs flex items-start gap-1.5 text-slate-800">
                                <span className="text-[#C5A880] font-bold font-mono">
                                  {idx === 0 ? '★' : '•'}
                                </span>
                                <span className={idx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'}>
                                  {item.name}
                                </span>
                              </div>
                            ))}
                            {day.cenaRinconTematico.items.length > 3 && (
                              <div className="text-[11px] text-indigo-700 font-medium pl-3">
                                + {day.cenaRinconTematico.items.length - 3} elaboraciones temáticas más en buffet
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie con Resumen Informativo */}
        <div className="bg-white px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Planificación mensual estandarizada para <strong>{hotelName}</strong> · 30 días sincronizados.
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Mostrando {displayedDays.length} de {matrix.length} jornadas
          </div>
        </div>

      </div>
    </div>
  );
};
