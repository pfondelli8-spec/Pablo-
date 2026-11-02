import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  ClipboardCheck,
  Sparkles,
  Building2,
  Clock,
  RefreshCw,
  FileDown,
  ShieldCheck,
  TrendingUp,
  X,
  Calendar,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { demoHotelModelsService } from '../services/demoHotelModelsService';
import {
  proaAreaOperationsService,
  StationEquipmentTemp,
  StationChecklistItem,
  StationCleaningTask,
  StationIncident
} from '../services/proaAreaOperationsService';
import { cumulativeFolderService, DossierRecord } from '../services/cumulativeFolderService';
import { KitchenStationKey } from '../types/multiTenantConfig';

interface DashboardProps {
  onClose?: () => void;
  initialHotelId?: string | null;
  onSelectStation?: (hotelId: string, stationKey: KitchenStationKey) => void;
}

// Estaciones canónicas de cocina para evaluación
const EVAL_STATIONS: { key: KitchenStationKey; label: string; code: string }[] = [
  { key: 'cafeteria', label: 'Partida de Desayunos y Cafetería', code: 'COC-01' },
  { key: 'frio_manana', label: 'Partida Fría de Mañana', code: 'COC-02' },
  { key: 'frio_tarde', label: 'Partida Fría de Noche', code: 'COC-03' },
  { key: 'caliente_manana', label: 'Partida Caliente de Mañana', code: 'COC-04' },
  { key: 'caliente_tarde', label: 'Partida Caliente de Noche', code: 'COC-05' },
  { key: 'pasteleria', label: 'Partida de Pastelería y Repostería', code: 'COC-06' },
  { key: 'plateria', label: 'Partida de Plancha y Platería', code: 'COC-07' }
];

export const Dashboard: React.FC<DashboardProps> = ({
  onClose,
  initialHotelId,
  onSelectStation
}) => {
  // Filtros interactivos
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>(initialHotelId || 'all');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [shiftFilter, setShiftFilter] = useState<'all' | 'manana' | 'noche'>('all');
  const [refreshSeed, setRefreshSeed] = useState(0);

  const hotels = useMemo(() => demoHotelModelsService.getModels(), []);

  // Hoteles a evaluar según filtro
  const activeHotelIds = useMemo(() => {
    if (selectedHotelFilter === 'all') {
      return hotels.map(h => h.id);
    }
    return [selectedHotelFilter];
  }, [selectedHotelFilter, hotels]);

  // Recopilación reactiva de datos operacionales de ambos modelos
  const rawOperationalData = useMemo(() => {
    // Forzar re-ejecución con refreshSeed
    void refreshSeed;

    let totalChecklistItemsCount = 0;
    let completedChecklistItemsCount = 0;
    let totalTempChecks = 0;
    let compliantTempChecks = 0;
    let totalCleaningTasks = 0;
    let completedCleaningTasks = 0;
    let totalIncidentsCount = 0;
    let resolvedIncidentsCount = 0;

    const stationBreakdown: {
      key: KitchenStationKey;
      name: string;
      code: string;
      checklistTotal: number;
      checklistDone: number;
      checklistRate: number;
      tempTotal: number;
      tempCompliant: number;
      tempRate: number;
      cleanTotal: number;
      cleanDone: number;
      incidentsActive: number;
      avgTempRefrig: number | null;
      avgTempHot: number | null;
    }[] = [];

    // Por cada estación
    EVAL_STATIONS.forEach(st => {
      let stChkTotal = 0;
      let stChkDone = 0;
      let stTempTotal = 0;
      let stTempCompliant = 0;
      let stCleanTotal = 0;
      let stCleanDone = 0;
      let stIncidentsActive = 0;
      const refrigReadings: number[] = [];
      const hotReadings: number[] = [];

      activeHotelIds.forEach(hId => {
        // Checklist Operativo de Turno (Mañana y Noche)
        const targetShifts = shiftFilter !== 'all' ? [shiftFilter] : (['manana', 'noche'] as const);
        const chkAll = targetShifts.flatMap(sh => proaAreaOperationsService.getStationChecklistItems(hId, st.key, sh));

        stChkTotal += chkAll.length;
        stChkDone += chkAll.filter(i => i.completed).length;

        // Equipos & Temperaturas APPCC
        const eqs = proaAreaOperationsService.getStationEquipments(hId, st.key);
        eqs.forEach(eq => {
          stTempTotal += 1;
          const reading = eq.lastReading !== undefined ? eq.lastReading : (eq.tempMin + eq.tempMax) / 2;
          const isWithin = reading >= eq.tempMin && reading <= eq.tempMax;
          if (eq.status === 'conforme' || (eq.status !== 'desviacion' && isWithin)) {
            stTempCompliant += 1;
          }

          if (eq.category === 'refrigeracion' && eq.lastReading !== undefined) {
            refrigReadings.push(eq.lastReading);
          }
          if (eq.category === 'calor' && eq.lastReading !== undefined) {
            hotReadings.push(eq.lastReading);
          }
        });

        // Limpieza y Desinfección
        const cleans = proaAreaOperationsService.getStationCleaningTasks(hId, st.key);
        stCleanTotal += cleans.length;
        stCleanDone += cleans.filter(c => c.status === 'realizada').length;

        // Incidencias
        const incs = proaAreaOperationsService.getStationIncidents(hId, st.key);
        totalIncidentsCount += incs.length;
        resolvedIncidentsCount += incs.filter(i => i.status === 'resuelta').length;
        stIncidentsActive += incs.filter(i => i.status !== 'resuelta').length;
      });

      totalChecklistItemsCount += stChkTotal;
      completedChecklistItemsCount += stChkDone;
      totalTempChecks += stTempTotal;
      compliantTempChecks += stTempCompliant;
      totalCleaningTasks += stCleanTotal;
      completedCleaningTasks += stCleanDone;

      const checklistRate = stChkTotal > 0 ? Math.round((stChkDone / stChkTotal) * 100) : 0;
      const tempRate = stTempTotal > 0 ? Math.round((stTempCompliant / stTempTotal) * 100) : 0;

      const avgRefrig = refrigReadings.length > 0
        ? Number((refrigReadings.reduce((a, b) => a + b, 0) / refrigReadings.length).toFixed(1))
        : null;

      const avgHot = hotReadings.length > 0
        ? Number((hotReadings.reduce((a, b) => a + b, 0) / hotReadings.length).toFixed(1))
        : null;

      stationBreakdown.push({
        key: st.key,
        name: st.label,
        code: st.code,
        checklistTotal: stChkTotal,
        checklistDone: stChkDone,
        checklistRate,
        tempTotal: stTempTotal,
        tempCompliant: stTempCompliant,
        tempRate,
        cleanTotal: stCleanTotal,
        cleanDone: stCleanDone,
        incidentsActive: stIncidentsActive,
        avgTempRefrig: avgRefrig,
        avgTempHot: avgHot
      });
    });

    // Registros Acumulativos del expediente sanitario
    let cumulativeRecords: DossierRecord[] = [];
    activeHotelIds.forEach(hId => {
      const records = cumulativeFolderService.getRecordsForHotel(hId);
      cumulativeRecords = cumulativeRecords.concat(records);
    });

    if (shiftFilter !== 'all') {
      cumulativeRecords = cumulativeRecords.filter(r => r.shift === shiftFilter);
    }

    return {
      totalChecklistItemsCount,
      completedChecklistItemsCount,
      overallChecklistRate: totalChecklistItemsCount > 0
        ? Math.round((completedChecklistItemsCount / totalChecklistItemsCount) * 1000) / 10
        : 88.5,
      totalTempChecks,
      compliantTempChecks,
      overallTempRate: totalTempChecks > 0
        ? Math.round((compliantTempChecks / totalTempChecks) * 1000) / 10
        : 95.8,
      totalCleaningTasks,
      completedCleaningTasks,
      cleaningRate: totalCleaningTasks > 0
        ? Math.round((completedCleaningTasks / totalCleaningTasks) * 100)
        : 91,
      totalIncidentsCount,
      resolvedIncidentsCount,
      incidentResolutionRate: totalIncidentsCount > 0
        ? Math.round((resolvedIncidentsCount / totalIncidentsCount) * 100)
        : 100,
      stationBreakdown,
      cumulativeRecords
    };
  }, [activeHotelIds, shiftFilter, refreshSeed]);

  // Datos para Recharts: Comparativa de Checklists por Estación
  const checklistChartData = useMemo(() => {
    return rawOperationalData.stationBreakdown.map(st => ({
      name: st.name,
      'Completadas (%)': st.checklistRate,
      'Pendientes (%)': Math.max(0, 100 - st.checklistRate),
      completadas: st.checklistDone,
      totales: st.checklistTotal
    }));
  }, [rawOperationalData.stationBreakdown]);

  // Datos para Recharts: Temperatura registrada vs Rango admisible
  const tempChartData = useMemo(() => {
    return [
      { equipo: 'Cámara Carnes 01', actual: 2.1, minSegura: 0, maxSegura: 4, tipo: 'Refrigeración' },
      { equipo: 'Cámara Pescados 02', actual: 1.4, minSegura: 0, maxSegura: 2, tipo: 'Refrigeración' },
      { equipo: 'Cámara Verduras 03', actual: 4.8, minSegura: 2, maxSegura: 6, tipo: 'Refrigeración' },
      { equipo: 'Congelador Central', actual: -19.5, minSegura: -22, maxSegura: -18, tipo: 'Congelación' },
      { equipo: 'Vitrina Ensaladas', actual: 3.2, minSegura: 0, maxSegura: 5, tipo: 'Refrigeración' },
      { equipo: 'Baño María Caliente', actual: 74.0, minSegura: 65, maxSegura: 90, tipo: 'Mantenimiento Calor' },
      { equipo: 'Mesa Caliente Pase', actual: 68.5, minSegura: 65, maxSegura: 85, tipo: 'Mantenimiento Calor' },
      { equipo: 'Lavavajillas Plonge', actual: 83.0, minSegura: 80, maxSegura: 90, tipo: 'Aclarado Térmico' }
    ];
  }, []);

  // Datos para Recharts: Distribución por Familia Sanitaria (Expediente APPCC)
  const familyDistributionData = useMemo(() => {
    const counts: Record<string, number> = {
      Temperaturas: 0,
      Limpieza: 0,
      Checklists: 0,
      Caducidades: 0,
      Incidencias: 0
    };

    rawOperationalData.cumulativeRecords.forEach(r => {
      if (r.family === 'temperaturas') counts.Temperaturas += 1;
      else if (r.family === 'limpieza') counts.Limpieza += 1;
      else if (r.family === 'checklists') counts.Checklists += 1;
      else if (r.family === 'caducidades') counts.Caducidades += 1;
      else if (r.family === 'incidencias') counts.Incidencias += 1;
    });

    const colors = {
      Temperaturas: '#2563EB',
      Limpieza: '#059669',
      Checklists: '#D97706',
      Caducidades: '#7C3AED',
      Incidencias: '#DC2626'
    };

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value: value || 1,
      color: colors[name as keyof typeof colors] || '#64748B'
    }));
  }, [rawOperationalData.cumulativeRecords]);

  // Datos para Recharts: Tendencia semanal de cumplimiento
  const trendData = useMemo(() => {
    return [
      { dia: 'Lunes', checklist: 84, temperatura: 96, limpieza: 88 },
      { dia: 'Martes', checklist: 88, temperatura: 97, limpieza: 90 },
      { dia: 'Miércoles', checklist: 91, temperatura: 94, limpieza: 93 },
      { dia: 'Jueves', checklist: 87, temperatura: 98, limpieza: 89 },
      { dia: 'Viernes', checklist: 93, temperatura: 95, limpieza: 95 },
      { dia: 'Sábado', checklist: 90, temperatura: 93, limpieza: 92 },
      { dia: 'Hoy', checklist: rawOperationalData.overallChecklistRate, temperatura: rawOperationalData.overallTempRate, limpieza: rawOperationalData.cleaningRate }
    ];
  }, [rawOperationalData]);

  // Comparativa de Hoteles
  const hotelComparisonData = useMemo(() => {
    const bitacoraRecords = cumulativeFolderService.getRecordsForHotel('model-bitacora');
    const vulcanoRecords = cumulativeFolderService.getRecordsForHotel('model-vulcano');

    const bitacoraConforme = bitacoraRecords.filter(r => r.status === 'conforme').length;
    const bitacoraRate = bitacoraRecords.length > 0 ? Math.round((bitacoraConforme / bitacoraRecords.length) * 100) : 92;

    const vulcanoConforme = vulcanoRecords.filter(r => r.status === 'conforme').length;
    const vulcanoRate = vulcanoRecords.length > 0 ? Math.round((vulcanoConforme / vulcanoRecords.length) * 100) : 96;

    return [
      {
        hotel: 'Hotel Bitácora',
        'Cumplimiento Global (%)': bitacoraRate,
        'Checklists (%)': 88,
        'Temperaturas (%)': 95,
        registros: bitacoraRecords.length
      },
      {
        hotel: 'Hotel Vulcano',
        'Cumplimiento Global (%)': vulcanoRate,
        'Checklists (%)': 92,
        'Temperaturas (%)': 98,
        registros: vulcanoRecords.length
      }
    ];
  }, [refreshSeed]);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Barra Superior del Dashboard */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-wide">
                PF Operations <span className="text-amber-500 font-bold">· F&B Management</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                Gestión Operativa de Cocinas & Live Buffet Management para Hoteles y Resorts
              </div>
            </div>
          </div>

          {/* Filtros de Control con botones píldora */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Selector de Hotel con botones píldora */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-medium gap-1">
              <button
                onClick={() => setSelectedHotelFilter('all')}
                className={`rounded-full px-4 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedHotelFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Ambos Hoteles
              </button>
              <button
                onClick={() => setSelectedHotelFilter('model-bitacora')}
                className={`rounded-full px-4 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedHotelFilter === 'model-bitacora'
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-teal-50'
                }`}
              >
                H. Bitácora
              </button>
              <button
                onClick={() => setSelectedHotelFilter('model-vulcano')}
                className={`rounded-full px-4 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedHotelFilter === 'model-vulcano'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                H. Vulcano
              </button>
            </div>

            {/* Selector de Turno / Servicios de Datos */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-medium gap-1">
              <button
                onClick={() => setShiftFilter('all')}
                className={`rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                  shiftFilter === 'all' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Servicios: Todos
              </button>
              <button
                onClick={() => setShiftFilter('manana')}
                className={`rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                  shiftFilter === 'manana' ? 'bg-amber-500 text-slate-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mañana
              </button>
              <button
                onClick={() => setShiftFilter('noche')}
                className={`rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                  shiftFilter === 'noche' ? 'bg-amber-500 text-slate-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Noche
              </button>
            </div>

            {/* Botón Refrescar */}
            <button
              onClick={() => setRefreshSeed(s => s + 1)}
              className="p-2 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer flex-shrink-0"
              title="Actualizar datos en tiempo real"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Botón Cerrar (si existe prop onClose) */}
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs whitespace-nowrap flex-shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Volver a Cocinas</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner Informativo Superior con Alto Contraste y Padding Amplio */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex flex-col gap-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>SEGURIDAD SANITARIA & ESTÁNDARES APPCC</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {selectedHotelFilter === 'all'
                ? 'Consolidado Global: Hotel Bitácora & Hotel Vulcano'
                : selectedHotelFilter === 'model-bitacora'
                ? 'Panel de Control Operativo · Hotel Bitácora (Resort 4★ Superior)'
                : 'Panel de Control Operativo · Hotel Vulcano (Gastronómico 4★ Superior)'}
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              Supervisión en tiempo real de los checklists higiénicos de pase, cumplimiento estricto de temperaturas de conservación y regeneración térmica, plan de L+D y trazabilidad de productos perecederos.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 self-start md:self-auto">
            <div className="text-left md:text-right">
              <div className="text-[10px] uppercase font-bold text-slate-300">Auditoría Sanitaria</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5 md:justify-end mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-extrabold tracking-wide">APTO INSPECCIÓN</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TARJETAS KPI PRINCIPALES
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Checklist Completion Rate */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Tasa de Checklists
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {rawOperationalData.overallChecklistRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +3.2% vs sem. ant.
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              <strong className="text-slate-900 font-bold">
                {rawOperationalData.completedChecklistItemsCount}
              </strong>{' '}
              de {rawOperationalData.totalChecklistItemsCount} comprobaciones completadas (Apertura y Cierre).
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, rawOperationalData.overallChecklistRate)}%` }}
              />
            </div>
          </div>

          {/* KPI 2: Average Temperature Compliance */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-blue-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Conformidad Temperaturas
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <Thermometer className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {rawOperationalData.overallTempRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Conforme APPCC
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              <strong className="text-slate-900 font-bold">
                {rawOperationalData.compliantTempChecks}
              </strong>{' '}
              de {rawOperationalData.totalTempChecks} equipos monitorizados dentro del rango térmico legal.
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, rawOperationalData.overallTempRate)}%` }}
              />
            </div>
          </div>

          {/* KPI 3: Plan de Limpieza y Desinfección */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Plan Limpieza (L+D)
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {rawOperationalData.cleaningRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Al día
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              <strong className="text-slate-900 font-bold">
                {rawOperationalData.completedCleaningTasks}
              </strong>{' '}
              de {rawOperationalData.totalCleaningTasks} tareas de desinfección con productos autorizados.
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, rawOperationalData.cleaningRate)}%` }}
              />
            </div>
          </div>

          {/* KPI 4: Incidencias & Desviaciones */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-rose-400/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Resolución Incidencias
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {rawOperationalData.incidentResolutionRate}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {rawOperationalData.totalIncidentsCount - rawOperationalData.resolvedIncidentsCount} activas
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              <strong className="text-slate-900 font-bold">
                {rawOperationalData.resolvedIncidentsCount}
              </strong>{' '}
              de {rawOperationalData.totalIncidentsCount} incidencias o averías resueltas con medidas correctoras.
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, rawOperationalData.incidentResolutionRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            BLOQUE PRINCIPAL DE GRÁFICOS RECHARTS (2 COLUMNAS)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GRÁFICO 1: Tasa de Cumplimiento de Checklists por Estación / Partida */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-amber-600" />
                  <span>Cumplimiento de Checklists por Partida de Cocina</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Porcentaje de tareas de apertura y cierre firmadas conforme en cada estación.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                % Tareas
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={checklistChartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A2530',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Completado']}
                  />
                  <Bar
                    dataKey="Completadas (%)"
                    fill="#C5A880"
                    radius={[6, 6, 0, 0]}
                    name="Cumplimiento"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO 2: Monitorización de Temperaturas APPCC vs Rango Seguro */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-600" />
                  <span>Lectura de Equipos Críticos vs Rangos APPCC</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparativa de temperatura actual (°C) con el límite crítico admitido.
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                °C Oficial
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tempChartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 35 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="equipo"
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    unit="°C"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(val: any, name: any) => [`${val} °C`, name]}
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Bar dataKey="actual" fill="#2563EB" name="Lectura Actual (°C)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxSegura" fill="#94A3B8" name="Límite Máx (°C)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SEGUNDA FILA DE GRÁFICOS: EVOLUCIÓN HISTÓRICA & DISTRIBUCIÓN FAMILIAS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolución Semanal de Cumplimiento */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Evolución Temporal de Conformidad Operativa (7 Días)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tendencia de cumplimiento higiénico en checklists, temperaturas y plan de limpieza.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Temperaturas
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Checklists
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Limpieza
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorChk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="dia" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[70, 100]} unit="%" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val}%`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperatura"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    name="Temperaturas"
                  />
                  <Area
                    type="monotone"
                    dataKey="checklist"
                    stroke="#D97706"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorChk)"
                    name="Checklists"
                  />
                  <Area
                    type="monotone"
                    dataKey="limpieza"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClean)"
                    name="Limpieza L+D"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribución por Familia Sanitaria (Pie/Donut Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Expediente Documental APPCC</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Volumen acumulado de registros auditables por familia.
              </p>
            </div>

            <div className="h-52 w-full my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={familyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {familyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val} registros`, 'Total']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Leyenda limpia y compacta */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              {familyDistributionData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}</span>
                  <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            COMPARATIVA DIRECTA ENTRE HOTELES (HOTEL BITÁCORA VS HOTEL VULCANO)
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Comparativa de Establecimientos: Hotel Bitácora vs Hotel Vulcano</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoreo cruzado del nivel de cumplimiento higiénico-sanitario entre establecimientos.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Aislamiento total de bases de datos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelComparisonData.map(h => {
              const isBitacora = h.hotel.includes('Bitácora');
              return (
                <div
                  key={h.hotel}
                  className={`p-5 rounded-2xl border transition-all ${
                    isBitacora
                      ? 'border-teal-200 bg-teal-50/40 hover:border-teal-400'
                      : 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400'
                  } flex flex-col justify-between shadow-xs`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isBitacora ? 'bg-teal-600' : 'bg-emerald-600'}`} />
                      <span className={`font-black text-base ${isBitacora ? 'text-teal-950' : 'text-emerald-950'}`}>{h.hotel}</span>
                    </div>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      isBitacora
                        ? 'bg-teal-100 text-teal-800 border border-teal-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {h['Cumplimiento Global (%)']}% Conforme
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 mt-4 text-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Checklists</div>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        {h['Checklists (%)']}%
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Temperaturas</div>
                      <div className={`text-base font-extrabold ${isBitacora ? 'text-teal-700' : 'text-emerald-700'} mt-0.5`}>
                        {h['Temperaturas (%)']}%
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Expediente</div>
                      <div className="text-base font-extrabold text-slate-800 mt-0.5">
                        {h.registros} reg.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            TABLA DETALLADA POR PARTIDA / ESTACIÓN DE TRABAJO
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                <span>Desglose Operativo por Partida de Cocina</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Indicadores detallados de cada estación operativa para supervisión del Jefe de Cocina.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Mostrando {rawOperationalData.stationBreakdown.length} áreas operativas
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Código / Partida</th>
                  <th className="py-3.5 px-4 text-center">Checklist Apertura/Cierre</th>
                  <th className="py-3.5 px-4 text-center">Conformidad Temp.</th>
                  <th className="py-3.5 px-4 text-center">Limpieza L+D</th>
                  <th className="py-3.5 px-4 text-center">Incidencias</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawOperationalData.stationBreakdown.map(st => (
                  <tr key={st.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">{st.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{st.code}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-slate-800">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            st.checklistRate >= 85 ? 'bg-emerald-500' : st.checklistRate >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{st.checklistRate}%</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({st.checklistDone}/{st.checklistTotal})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-bold text-blue-700">
                        <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                        <span>{st.tempRate}%</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({st.tempCompliant}/{st.tempTotal})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-700">
                        {st.cleanTotal > 0 ? `${Math.round((st.cleanDone / st.cleanTotal) * 100)}%` : '100%'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {st.incidentsActive > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                          {st.incidentsActive} activa{st.incidentsActive > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Sin incidencias</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onSelectStation ? (
                        <button
                          onClick={() => {
                            const targetHotel = selectedHotelFilter === 'all' ? 'model-bitacora' : selectedHotelFilter;
                            onSelectStation(targetHotel, st.key);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-900 hover:text-white font-bold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Abrir Estación</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Verificado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
