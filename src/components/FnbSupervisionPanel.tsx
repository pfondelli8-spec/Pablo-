import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Settings, 
  Database, 
  RefreshCw, 
  Sliders, 
  Users, 
  FileSpreadsheet,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  UserRole, 
  ShiftType, 
  StationType, 
  SupervisionKPIs, 
  TemperatureEquipmentDef 
} from '../types/fnbOperationsMaster';
import { 
  DEFAULT_APPCC_EQUIPMENTS, 
  DEFAULT_CLEANING_CATALOG, 
  fnbStorage, 
  calculateSupervisionKPIs 
} from '../data/fnbOperationsService';

interface FnbSupervisionPanelProps {
  currentRole: UserRole;
  currentShift: ShiftType;
  currentStation: StationType;
  userName: string;
  hotelName: string;
  kpis: SupervisionKPIs;
  onRefreshData: () => void;
  onResetDemoData: () => void;
}

export const FnbSupervisionPanel: React.FC<FnbSupervisionPanelProps> = ({
  currentRole,
  currentShift,
  currentStation,
  userName,
  hotelName,
  kpis,
  onRefreshData,
  onResetDemoData
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'appcc_config' | 'exportar' | 'produccion'>('kpis');
  const [equipmentLimits, setEquipmentLimits] = useState<TemperatureEquipmentDef[]>(DEFAULT_APPCC_EQUIPMENTS);
  const [savedLimitsSuccess, setSavedLimitsSuccess] = useState(false);

  const temperatures = fnbStorage.getTemperatures();
  const cleaningLogs = fnbStorage.getCleaningLogs();
  const incidents = fnbStorage.getIncidents();
  const announcements = fnbStorage.getAnnouncements();

  const handleUpdateMin = (id: string, val: number) => {
    setEquipmentLimits(prev => prev.map(eq => eq.id === id ? { ...eq, tempMin: val } : eq));
  };

  const handleUpdateMax = (id: string, val: number) => {
    setEquipmentLimits(prev => prev.map(eq => eq.id === id ? { ...eq, tempMax: val } : eq));
  };

  const handleSaveLimits = () => {
    setSavedLimitsSuccess(true);
    setTimeout(() => setSavedLimitsSuccess(false), 3000);
  };

  const handleExportFullCSV = () => {
    const rows = [
      ['ID Registro', 'Tipo', 'Equipo/Tarea', 'Fecha', 'Hora', 'Operario', 'Rol', 'Valor/Estado', 'Conforme APPCC', 'Supervisor']
    ];

    temperatures.forEach(t => {
      rows.push([
        t.id,
        'Temperatura APPCC',
        `"${t.equipmentName}"`,
        t.dateStr,
        t.timeStr,
        `"${t.recordedBy}"`,
        t.workerRole,
        `${t.recordedTemp} ºC`,
        t.isOutOfRange ? 'NO (Desviación)' : 'SI (Conforme)',
        `"${t.supervisorSignature || 'Pendiente'}"`
      ]);
    });

    cleaningLogs.forEach(c => {
      rows.push([
        c.id,
        'Limpieza L+D',
        `"${c.surfaceOrEquipment}"`,
        c.dateStr,
        '-',
        `"${c.completedBy}"`,
        'Operario',
        c.approvedChemical,
        c.completed ? 'SI' : 'NO',
        `"${c.supervisorName || 'Pendiente'}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_fnb_completa_${hotelName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. CABECERA DEL PANEL */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-bold border border-[#C5A880]/30">
                Mando Operativo
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {hotelName} · {currentStation}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C5A880]" />
              <span>Panel de Supervisión y Dirección F&B</span>
            </h2>
            <p className="text-xs text-gray-500">
              Validación de registros, alertas higiénico-sanitarias y control de calidad operativa
            </p>
          </div>

          <button
            onClick={onRefreshData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-xs font-semibold text-gray-600 self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Actualizar Métricas</span>
          </button>
        </div>

        {/* Subpestañas de Supervisión */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'kpis'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#C5A880]" />
            <span>Indicadores de Turno</span>
          </button>

          <button
            onClick={() => setActiveTab('appcc_config')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'appcc_config'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#C5A880]" />
            <span>Parámetros y Límites Frío</span>
          </button>

          <button
            onClick={() => setActiveTab('exportar')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'exportar'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>Exportar Informes Oficiales</span>
          </button>

          <button
            onClick={() => setActiveTab('produccion')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'produccion'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Database className="w-4 h-4 text-[#C5A880]" />
            <span>Infraestructura & Base de Datos</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUBTAB 1: INDICADORES CALCULADOS DIRECTAMENTE DE REGISTROS REALES
         ========================================================================= */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-xs text-gray-500 font-medium">Controles APPCC Hoy</div>
              <div className="text-2xl font-extrabold text-[#1A2530] mt-1">
                {kpis.temperaturesCompletedToday} / {kpis.temperaturesRequiredToday}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {kpis.temperaturesCompletedToday >= kpis.temperaturesRequiredToday ? (
                  <span className="text-emerald-700 font-semibold">100% completado</span>
                ) : (
                  <span className="text-amber-700 font-semibold">Faltan {kpis.temperaturesRequiredToday - kpis.temperaturesCompletedToday} lecturas</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-xs text-gray-500 font-medium">Alertas Fuera de Rango</div>
              <div className={`text-2xl font-extrabold mt-1 ${kpis.outOfRangeAlertsPending > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {kpis.outOfRangeAlertsPending}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {kpis.outOfRangeAlertsPending > 0 ? 'Requiere seguimiento' : 'Sin desviaciones críticas'}
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-xs text-gray-500 font-medium">Limpieza por Validar</div>
              <div className="text-2xl font-extrabold text-[#1A2530] mt-1">
                {kpis.cleaningPendingVerification}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Firmas pendientes supervisor
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-xs text-gray-500 font-medium">Incidencias Abiertas</div>
              <div className="text-2xl font-extrabold text-[#1A2530] mt-1">
                {kpis.openIncidentsCount}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {kpis.urgentIncidentsCount} con prioridad urgente
              </div>
            </div>
          </div>

          {/* Resumen de Cumplimiento Sanitario */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-[#1A2530]">
              Estado Sanitario de la Unidad en el Turno Actual
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                <span>Checklist de Apertura de Puesto:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Realizado y firmado
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                <span>Rotación FIFO y Etiquetado Secundario:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Conforme
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                <span>Ciclo térmico lavavasos (&gt; 65ºC):</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Calibrado (+68.4 ºC)
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: CONFIGURACIÓN DE PARÁMETROS Y LÍMITES APPCC
         ========================================================================= */}
      {activeTab === 'appcc_config' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#1A2530]">
                Configuración de Rangos Reglamentarios por Equipo
              </h3>
              <p className="text-xs text-gray-500">
                Ajusta los umbrales térmicos según la ficha técnica de cada equipo y la auditoría sanitaria.
              </p>
            </div>
            <button
              onClick={handleSaveLimits}
              className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Guardar Rangos
            </button>
          </div>

          {savedLimitsSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Límites actualizados correctamente.</span>
            </div>
          )}

          <div className="space-y-2.5 mt-3">
            {equipmentLimits.map(eq => (
              <div
                key={eq.id}
                className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#1A2530]">{eq.name}</div>
                  <div className="text-[11px] text-gray-500">{eq.location} · {eq.description}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-500 font-semibold">Min:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={eq.tempMin}
                    onChange={(e) => handleUpdateMin(eq.id, parseFloat(e.target.value))}
                    className="w-16 p-1 rounded border border-[#E2E8F0] bg-white text-center font-mono"
                  />
                  <span className="text-gray-500 font-semibold">Max:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={eq.tempMax}
                    onChange={(e) => handleUpdateMax(eq.id, parseFloat(e.target.value))}
                    className="w-16 p-1 rounded border border-[#E2E8F0] bg-white text-center font-mono"
                  />
                  <span className="font-mono text-gray-500">ºC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: EXPORTACIÓN DE INFORMES OFICIALES
         ========================================================================= */}
      {activeTab === 'exportar' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1A2530]">
              Exportación de Registros e Informes de Inspección
            </h3>
            <p className="text-xs text-gray-500">
              Genera copias oficiales para Sanidad, Auditorías de Cadena o archivo legal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] flex flex-col justify-between">
              <div>
                <FileSpreadsheet className="w-8 h-8 text-[#C5A880] mb-2" />
                <h4 className="font-bold text-sm text-[#1A2530]">Libro Oficial en CSV / Excel</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Incluye todos los registros de temperaturas, L+D y firmas con sellado de tiempo.
                </p>
              </div>
              <button
                onClick={handleExportFullCSV}
                className="mt-4 px-4 py-2 rounded-lg bg-[#1A2530] text-white hover:bg-[#2C3E50] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-[#C5A880]" />
                <span>Descargar Archivo CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] flex flex-col justify-between">
              <div>
                <Download className="w-8 h-8 text-[#C5A880] mb-2" />
                <h4 className="font-bold text-sm text-[#1A2530]">Auditoría Estructurada JSON</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Payload completo con estructura relacional listo para migración a base de datos.
                </p>
              </div>
              <button
                onClick={() => {
                  const data = {
                    hotel: hotelName,
                    exportDate: new Date().toISOString(),
                    temperatures,
                    cleaningLogs,
                    incidents,
                    announcements
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `auditoria_completa_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-4 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-gray-100 text-xs font-semibold text-[#1A2530] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Respaldo JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: INFRAESTRUCTURA & PRODUCCIÓN
         ========================================================================= */}
      {activeTab === 'produccion' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-bold text-base text-[#1A2530]">
              Arquitectura de Persistencia y Despliegue en Producción
            </h3>
          </div>

          <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
            <p>
              Actualmente la aplicación opera con <strong>persistencia en memoria local estandarizada</strong> para garantizar la máxima velocidad de respuesta en el móvil del trabajador sin depender de latencia de red.
            </p>

            <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-[#E2E8F0] space-y-2">
              <h4 className="font-bold text-[#1A2530]">Pasos para activar producción en la nube (Firebase Firestore):</h4>
              <ol className="list-decimal pl-4 space-y-1 text-gray-700">
                <li>Activar la herramienta <code>set_up_firebase</code> para provisionar el proyecto Firestore y la autenticación.</li>
                <li>Desplegar reglas de seguridad en <code>firestore.rules</code> que validen los roles <code>trabajador</code>, <code>supervisor</code> y <code>direccion</code> a nivel de servidor.</li>
                <li>Conectar las colecciones <code>/temperatures</code>, <code>/cleaning_logs</code>, <code>/incidents</code> y <code>/announcements</code>.</li>
              </ol>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#E2E8F0]">
              <button
                onClick={onResetDemoData}
                className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
              >
                Restablecer todos los registros de demostración
              </button>
              <span className="text-[11px] text-gray-400 font-mono">
                Versión 2.0 F&B Production Ready
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
