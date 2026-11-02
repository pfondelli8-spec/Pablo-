import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  UtensilsCrossed, 
  Clock, 
  ShieldCheck, 
  ListChecks, 
  UserCheck, 
  FileText, 
  ChevronRight, 
  Layers, 
  ArrowRight,
  ClipboardList,
  Sun,
  Check
} from 'lucide-react';
import { 
  HotelDepartment, 
  ProcedureType, 
  HotelProperty, 
  OperatingProcedure, 
  ShiftChecklistLog 
} from '../types/operations';
import { HOTEL_PROPERTIES, OPERATING_PROCEDURES } from '../data/operationsData';
import { ProcedureDetailModal } from './ProcedureDetailModal';

export const ProcedimientosOperativosView: React.FC = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<HotelDepartment | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ProcedureType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedProcedure, setSelectedProcedure] = useState<OperatingProcedure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [shiftLogs, setShiftLogs] = useState<ShiftChecklistLog[]>(() => {
    try {
      const saved = localStorage.getItem('operations_shift_logs_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [showLogsDrawer, setShowLogsDrawer] = useState(false);

  const filteredProcedures = useMemo(() => {
    return OPERATING_PROCEDURES.filter(proc => {
      if (selectedHotelId !== 'all' && proc.propertyId !== 'all' && proc.propertyId !== selectedHotelId) {
        return false;
      }
      if (selectedType !== 'all' && proc.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = proc.title.toLowerCase().includes(query);
        const matchesCode = proc.code.toLowerCase().includes(query);
        const matchesObj = proc.objective.toLowerCase().includes(query);
        return matchesTitle || matchesCode || matchesObj;
      }
      return true;
    });
  }, [selectedHotelId, selectedType, searchQuery]);

  const handleOpenProcedure = (procedure: OperatingProcedure) => {
    setSelectedProcedure(procedure);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Cabecera del Módulo */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-mono text-emerald-400">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>SOP & PROTOCOLOS OPERATIVOS ESTANDARIZADOS</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              Procedimientos Operativos de Operaciones F&B
            </h1>
            <p className="text-sm text-stone-400 max-w-2xl leading-relaxed">
              Manuales de trabajo estandarizados (SOP), directrices APPCC, normas de apertura y cierre de barra y checklists operativos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowLogsDrawer(!showLogsDrawer)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Libro de Turnos ({shiftLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Métricas Operativas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-800/80 text-xs">
          <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl">
            <span className="text-stone-500 uppercase font-mono block text-[10px]">Procedimientos Homologados</span>
            <span className="font-display text-xl font-bold text-stone-100 mt-1 block">
              {OPERATING_PROCEDURES.length} SOP Oficiales
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">100% Homologados</span>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl">
            <span className="text-stone-500 uppercase font-mono block text-[10px]">Unidades Operativas</span>
            <span className="font-display text-xl font-bold text-stone-100 mt-1 block">
              {HOTEL_PROPERTIES.length} Centros F&B
            </span>
            <span className="text-[11px] text-stone-400 font-mono">Estructura Modular</span>
          </div>

          <div className="bg-stone-950/50 border border-stone-800 p-3.5 rounded-xl">
            <span className="text-stone-500 uppercase font-mono block text-[10px]">Trazabilidad Sanitaria</span>
            <span className="font-display text-xl font-bold text-emerald-400 mt-1 block">
              Reglamento UE
            </span>
            <span className="text-[11px] text-stone-400 font-mono">APPCC & Alérgenos</span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE UNIDAD OPERATIVA */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400">
          <span className="uppercase">Filtrar por Unidad Operativa:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedHotelId('all')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              selectedHotelId === 'all'
                ? 'bg-emerald-950/50 border-emerald-600 text-stone-100 ring-1 ring-emerald-500'
                : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-stone-100">Transversales</span>
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[11px] text-stone-400 font-mono">Todas las Unidades</div>
          </button>

          {HOTEL_PROPERTIES.map(unit => {
            const isSelected = selectedHotelId === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedHotelId(unit.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-600 text-stone-100 ring-1 ring-emerald-500'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-stone-100 truncate pr-1">
                    {unit.shortName}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">{unit.code}</span>
                </div>
                <div className="text-[11px] text-stone-400 truncate">{unit.type}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Búsqueda de SOPs */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar SOP por título, código o pasos..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Listado de Procedimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProcedures.map(proc => (
          <div
            key={proc.id}
            onClick={() => handleOpenProcedure(proc)}
            className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-emerald-700/60 transition-all cursor-pointer space-y-3 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {proc.code}
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  ⏱ ~{proc.estimatedDurationMinutes} min
                </span>
              </div>

              <h3 className="font-display font-bold text-stone-100 text-base group-hover:text-emerald-300 transition-colors">
                {proc.title}
              </h3>

              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {proc.objective}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
              <span>{proc.steps.length} pasos detallados</span>
              <span className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Ver Procedimiento</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalle de Procedimiento */}
      <ProcedureDetailModal
        procedure={selectedProcedure}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
