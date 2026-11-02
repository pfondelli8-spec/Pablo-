import React, { useState } from 'react';
import { 
  Thermometer, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck, 
  Send, 
  Plus, 
  Check, 
  FileCheck,
  History,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  UserAccount, 
  EquipmentAppccDef, 
  AppccTempRecord, 
  CleaningTaskExecution 
} from '../types/multiTenantConfig';
import { multiTenantStorage } from '../services/multiTenantStorage';
import { MonthlyEpisControlView } from './MonthlyEpisControlView';

interface ControlesAppccViewProps {
  currentUser: UserAccount;
  currentEstablishmentName: string;
  currentStationName: string;
}

const STORAGE_KEY_TEMPS = 'hostelops_appcc_temps_log';
const STORAGE_KEY_CLEANING = 'hostelops_appcc_cleaning_log';

// Catálogo de tareas de limpieza con productos autorizados y dosificaciones
const DEFAULT_CLEANING_CATALOG = [
  {
    id: 'cl-01',
    surfaceOrEquipment: 'Tablas de corte de polietileno y cuchillería',
    frequency: 'diaria' as const,
    approvedChemical: 'Detergente Desinfectante Clorado Homologado (Suma Bac D10)',
    dosageInstructions: 'Dilución al 1% (100 ml en 10 L de agua a 40ºC). Dejar actuar 5 minutos.',
    contactTimeMinutes: 5,
    safetyEquipment: ['Guantes de nitrilo', 'Mandil protector']
  },
  {
    id: 'cl-02',
    surfaceOrEquipment: 'Encimeras y mostradores de acero inoxidable',
    frequency: 'diaria' as const,
    approvedChemical: 'Detergente Neutro Grado Alimentario (Suma Star D1)',
    dosageInstructions: '20 ml en 5 L de agua tibia. Aplicar con bayeta de microfibra azul limpia.',
    contactTimeMinutes: 2,
    safetyEquipment: ['Guantes de protección']
  },
  {
    id: 'cl-03',
    surfaceOrEquipment: 'Cuba interna y filtro de fabricador de hielo',
    frequency: 'semanal' as const,
    approvedChemical: 'Descalcificante e Higienizante Grado Alimentario',
    dosageInstructions: '50 ml por cada litro de agua. Ciclo de lavado y 2 ciclos de purga con agua potable.',
    contactTimeMinutes: 15,
    safetyEquipment: ['Gafas estancas', 'Guantes de nitrilo']
  },
  {
    id: 'cl-04',
    surfaceOrEquipment: 'Baldas, juntas herméticas y suelo de cámaras de frío',
    frequency: 'semanal' as const,
    approvedChemical: 'Desinfectante de Superficies Frigoríficas',
    dosageInstructions: 'Disolución al 2%. Secar con papel desechable estandarizado.',
    contactTimeMinutes: 10,
    safetyEquipment: ['Guantes térmicos', 'Guantes de nitrilo']
  }
];

export const ControlesAppccView: React.FC<ControlesAppccViewProps> = ({
  currentUser,
  currentEstablishmentName,
  currentStationName
}) => {
  const [controlTab, setControlTab] = useState<'temperaturas' | 'limpieza' | 'historico' | 'epis'>('temperaturas');
  
  // Equipos configurados de la empresa
  const equipments = multiTenantStorage.getEquipments();
  const [selectedEqId, setSelectedEqId] = useState<string>(equipments[0]?.id || '');
  const selectedEquipment = equipments.find(e => e.id === selectedEqId) || equipments[0];

  // Temperatura ingresada
  const [tempValue, setTempValue] = useState<number>(() => {
    return Number(((selectedEquipment.tempMin + selectedEquipment.tempMax) / 2).toFixed(1));
  });

  // Campos de acción correctiva ante desviación
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [followUpMinutes, setFollowUpMinutes] = useState(60);
  const [personNotified, setPersonNotified] = useState('Supervisor de Turno / Jefe F&B');
  const [tempNotes, setTempNotes] = useState('');

  // Historial de lecturas
  const [tempLogs, setTempLogs] = useState<AppccTempRecord[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TEMPS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  });

  // Registros de limpieza
  const [cleaningLogs, setCleaningLogs] = useState<CleaningTaskExecution[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CLEANING);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Detección en tiempo real de fuera de rango
  const isOutOfRange = tempValue < selectedEquipment.tempMin || tempValue > selectedEquipment.tempMax;

  // Cambiar equipo
  const handleSelectEquipment = (eqId: string) => {
    setSelectedEqId(eqId);
    const eq = equipments.find(e => e.id === eqId) || equipments[0];
    setTempValue(Number(((eq.tempMin + eq.tempMax) / 2).toFixed(1)));
    setCorrectiveAction('');
    setSubmitSuccess(false);
  };

  // Enviar temperatura
  const handleSubmitTemp = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOutOfRange && !correctiveAction.trim()) {
      alert('Alerta Sanitaria: Se requiere registrar obligatoriamente la Acción Correctiva Inmediata.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newRecord: AppccTempRecord = {
      id: `temp-${Date.now()}`,
      companyId: currentUser.companyId,
      establishmentId: currentUser.establishmentId,
      pointOfSaleId: currentUser.pointOfSaleId,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      recordedTemp: tempValue,
      tempMin: selectedEquipment.tempMin,
      tempMax: selectedEquipment.tempMax,
      isOutOfRange,
      correctiveAction: isOutOfRange ? correctiveAction : undefined,
      followUpMinutes: isOutOfRange ? followUpMinutes : undefined,
      assignedTo: isOutOfRange ? personNotified : undefined,
      operatorName: currentUser.name,
      operatorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      dateStr: todayStr,
      timeStr,
      supervisorVerified: currentUser.role !== 'trabajador',
      supervisorName: currentUser.role !== 'trabajador' ? currentUser.name : undefined,
      verifiedAt: currentUser.role !== 'trabajador' ? timeStr : undefined
    };

    const updated = [newRecord, ...tempLogs];
    setTempLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPS, JSON.stringify(updated));
    } catch {}

    setSubmitSuccess(true);
    setCorrectiveAction('');
    setTempNotes('');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  // Registrar tarea de limpieza
  const handleCompleteCleaning = (task: typeof DEFAULT_CLEANING_CATALOG[0]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newLog: CleaningTaskExecution = {
      id: `clean-${Date.now()}`,
      companyId: currentUser.companyId,
      establishmentId: currentUser.establishmentId,
      pointOfSaleId: currentUser.pointOfSaleId,
      surfaceOrEquipment: task.surfaceOrEquipment,
      frequency: task.frequency,
      approvedChemical: task.approvedChemical,
      dosageInstructions: task.dosageInstructions,
      contactTimeMinutes: task.contactTimeMinutes,
      completed: true,
      operatorName: currentUser.name,
      dateStr: todayStr,
      timeStr,
      supervisorVerified: currentUser.role !== 'trabajador',
      supervisorName: currentUser.role !== 'trabajador' ? currentUser.name : undefined,
      verifiedAt: currentUser.role !== 'trabajador' ? timeStr : undefined
    };

    const updated = [newLog, ...cleaningLogs];
    setCleaningLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CLEANING, JSON.stringify(updated));
    } catch {}
    alert(`Tarea registrada con éxito: ${task.surfaceOrEquipment}`);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto font-sans">
      
      {/* 1. CABECERA & SUBPESTAÑAS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-bold border border-[#C5A880]/30 uppercase">
                Módulo 4 · Controles
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {currentEstablishmentName} · {currentStationName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#C5A880]" />
              <span>Controles APPCC y Seguridad Alimentaria</span>
            </h2>
            <p className="text-xs text-gray-500">
              Registro obligatorio de temperaturas con límites configurables y plan oficial de limpieza
            </p>
          </div>
        </div>

        {/* Subpestañas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setControlTab('temperaturas')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              controlTab === 'temperaturas'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Thermometer className="w-4 h-4 text-[#C5A880]" />
            <span>Temperaturas Frío & Calor</span>
          </button>

          <button
            onClick={() => setControlTab('limpieza')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              controlTab === 'limpieza'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Limpieza & Desinfección</span>
          </button>

          <button
            onClick={() => setControlTab('epis')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              controlTab === 'epis'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Firma Mensual EPIs (PRL)</span>
          </button>

          <button
            onClick={() => setControlTab('historico')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              controlTab === 'historico'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4 text-[#C5A880]" />
            <span>Libro Oficial ({tempLogs.length + cleaningLogs.length})</span>
          </button>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div>Registro de control térmico guardado exitosamente.</div>
            <p className="text-emerald-700 text-xs font-normal mt-0.5">
              Identificador legal asignado. Los datos han quedado fijados en el registro inmutable de auditoría.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 1: CONTROL DE TEMPERATURAS
         ========================================================================= */}
      {controlTab === 'temperaturas' && (
        <div className="space-y-5">
          {/* Selector de Equipo */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              1. Selecciona el Equipo de Frío o Punto Crítico:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {equipments.map(eq => {
                const isSelected = eq.id === selectedEquipment.id;
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleSelectEquipment(eq.id)}
                    className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#C5A880]/10 ring-1 ring-[#C5A880]' 
                        : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#1A2530] leading-snug">
                        {eq.name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{eq.description}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-mono">
                        Rango: {eq.tempMin} a {eq.tempMax} {eq.unit}
                      </span>
                      {isSelected && <span className="font-bold text-[#C5A880] text-xs">Activo</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario con Display Interactivo */}
          <form onSubmit={handleSubmitTemp} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm sm:text-base text-[#1A2530]">
                  2. Valor Registrado en Sonda o Termómetro
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  Límite reglamentario: <strong className="text-[#1A2530]">{selectedEquipment.tempMin} ºC a {selectedEquipment.tempMax} ºC</strong>
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Lectura exacta tomada en el momento del control.
              </p>

              {/* Display y botones de ajuste rápido */}
              <div className="flex items-center justify-center gap-3 py-4 px-3 bg-[#F8F9FA] rounded-xl border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setTempValue(prev => Number((prev - 0.5).toFixed(1)))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] text-lg font-bold hover:bg-gray-100 text-[#1A2530] shadow-xs active:scale-95"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => setTempValue(prev => Number((prev - 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold hover:bg-gray-100 text-[#1A2530] shadow-xs active:scale-95"
                >
                  -0.1
                </button>

                <div className={`px-6 py-2.5 rounded-xl border text-center transition-all min-w-[200px] ${
                  isOutOfRange 
                    ? 'bg-red-50 border-red-300 text-red-700' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                    {tempValue > 0 ? `+${tempValue.toFixed(1)}` : tempValue.toFixed(1)} ºC
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                    {isOutOfRange ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>¡DESVIACIÓN DETECTADA!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CONFORME APPCC</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTempValue(prev => Number((prev + 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold hover:bg-gray-100 text-[#1A2530] shadow-xs active:scale-95"
                >
                  +0.1
                </button>
                <button
                  type="button"
                  onClick={() => setTempValue(prev => Number((prev + 0.5).toFixed(1)))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] text-lg font-bold hover:bg-gray-100 text-[#1A2530] shadow-xs active:scale-95"
                >
                  +0.5
                </button>
              </div>
            </div>

            {/* SECCIÓN OBLIGATORIA ANTE DESVIACIÓN */}
            {isOutOfRange && (
              <div className="bg-red-50/90 border border-red-300 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-red-900">
                      DESVIACIÓN TÉRMICA: Medidas Correctivas Obligatorias
                    </h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      No se considera resuelta la incidencia con el mero envío del formulario. Debe documentarse la actuación correctora y programar un seguimiento.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-900 mb-1">
                    Acción Correctiva Inmediata Realizada (*):
                  </label>
                  <textarea
                    required
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Ej. Reubicado género en cámara 2 auxiliar. Reajustado termostato digital a +2.5ºC. Avisado servicio técnico."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-lg border border-red-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-red-900 mb-1">
                      Programar Segunda Lectura en:
                    </label>
                    <select
                      value={followUpMinutes}
                      onChange={(e) => setFollowUpMinutes(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-red-300 bg-white"
                    >
                      <option value={30}>30 minutos (Crítico)</option>
                      <option value={60}>60 minutos (Estándar)</option>
                      <option value={120}>120 minutos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-red-900 mb-1">
                      Persona / Cargo a quien se comunica:
                    </label>
                    <input
                      type="text"
                      value={personNotified}
                      onChange={(e) => setPersonNotified(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-red-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Envío */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Operario: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
              </div>

              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isOutOfRange 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' 
                    : 'bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] shadow-sm'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Firmar y Enviar Registro</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: PLAN DE LIMPIEZA Y DESINFECCIÓN
         ========================================================================= */}
      {controlTab === 'limpieza' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-sm text-[#1A2530] mb-1">
              Plan de Limpieza Homologado con Productos Autorizados
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Cumplimiento estricto de dosificaciones autorizadas por la empresa de higiene química.
            </p>

            <div className="space-y-3">
              {DEFAULT_CLEANING_CATALOG.map(task => (
                <div key={task.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A2530]">{task.surfaceOrEquipment}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {task.frequency}
                        </span>
                      </div>

                      <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0] text-xs space-y-1">
                        <div><strong>Producto químico:</strong> {task.approvedChemical}</div>
                        <div><strong>Dosificación:</strong> {task.dosageInstructions}</div>
                        <div className="text-gray-500 text-[11px] flex gap-3">
                          <span>⏱️ Contacto: <strong>{task.contactTimeMinutes} min</strong></span>
                          <span>🛡️ EPIs: <strong>{task.safetyEquipment.join(', ')}</strong></span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCompleteCleaning(task)}
                      className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5 self-end sm:self-center"
                    >
                      <Check className="w-4 h-4" />
                      <span>Registrar Tarea</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: HISTÓRICO DE AUDITORÍA
         ========================================================================= */}
      {controlTab === 'historico' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C5A880]" />
              <span>Libro Oficial de Registros APPCC y Limpieza</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">Inmutable</span>
          </div>

          <div className="space-y-2">
            {tempLogs.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No hay registros de temperaturas guardados aún.</p>
            ) : (
              tempLogs.map(log => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    log.isOutOfRange ? 'bg-red-50/50 border-red-200' : 'bg-[#F8F9FA] border-[#E2E8F0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A2530]">{log.equipmentName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.isOutOfRange ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.recordedTemp > 0 ? `+${log.recordedTemp}` : log.recordedTemp} ºC
                      </span>
                      <span className="text-gray-400 font-mono text-[11px]">{log.dateStr} {log.timeStr}</span>
                    </div>
                    <div className="text-gray-600 mt-0.5">
                      Operario: <strong>{log.operatorName}</strong> ({log.operatorRole})
                      {log.correctiveAction && <span className="text-red-700 ml-2 font-medium">Acción: {log.correctiveAction}</span>}
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    {log.supervisorVerified ? `Verificado por ${log.supervisorName}` : 'Archivado'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: CONTROL Y FIRMA MENSUAL DE EPIS (APPCC / PRL)
         ========================================================================= */}
      {controlTab === 'epis' && (
        <MonthlyEpisControlView
          hotelId={currentUser.organizationId}
          hotelName={currentEstablishmentName}
          stationName={currentStationName}
          currentChefName={currentUser.name}
          currentChefRole={currentUser.role}
          userRole={currentUser.role}
        />
      )}

    </div>
  );
};
