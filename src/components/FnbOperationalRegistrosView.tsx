import React, { useState } from 'react';
import { 
  Thermometer, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  FileCheck, 
  Camera, 
  Send, 
  Check, 
  Filter, 
  ShieldCheck, 
  Download, 
  Plus, 
  AlertCircle,
  HelpCircle,
  History,
  Lock
} from 'lucide-react';
import { 
  UserRole, 
  ShiftType, 
  StationType, 
  TemperatureEquipmentDef, 
  TemperatureLogEntry, 
  CleaningTaskDef, 
  CleaningLogEntry,
  ChecklistTaskItem
} from '../types/fnbOperationsMaster';
import { 
  DEFAULT_APPCC_EQUIPMENTS, 
  DEFAULT_CLEANING_CATALOG, 
  DEFAULT_OPENING_CHECKLIST, 
  DEFAULT_CLOSING_CHECKLIST,
  fnbStorage 
} from '../data/fnbOperationsService';

interface FnbOperationalRegistrosViewProps {
  currentRole: UserRole;
  currentShift: ShiftType;
  currentStation: StationType;
  userName: string;
  hotelName: string;
  initialSubTab?: 'temperaturas' | 'limpieza' | 'checklists' | 'historico';
  onRecordCreated: () => void;
}

export const FnbOperationalRegistrosView: React.FC<FnbOperationalRegistrosViewProps> = ({
  currentRole,
  currentShift,
  currentStation,
  userName,
  hotelName,
  initialSubTab = 'temperaturas',
  onRecordCreated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'temperaturas' | 'limpieza' | 'checklists' | 'historico'>(initialSubTab);

  // =========================================================================
  // ESTADO: REGISTRO DE TEMPERATURAS
  // =========================================================================
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(DEFAULT_APPCC_EQUIPMENTS[0].id);
  const selectedEquipment = DEFAULT_APPCC_EQUIPMENTS.find(e => e.id === selectedEquipmentId) || DEFAULT_APPCC_EQUIPMENTS[0];
  
  // Valor inicial sugerido en rango
  const [currentTempInput, setCurrentTempInput] = useState<number>(() => {
    return Number(((selectedEquipment.tempMin + selectedEquipment.tempMax) / 2).toFixed(1));
  });

  const [correctiveAction, setCorrectiveAction] = useState<string>('');
  const [assignedFollowUpMinutes, setAssignedFollowUpMinutes] = useState<number>(60);
  const [personNotified, setPersonNotified] = useState<string>('Supervisor de Turno F&B');
  const [tempNotes, setTempNotes] = useState<string>('');
  const [isTempSubmittedSuccess, setIsTempSubmittedSuccess] = useState<boolean>(false);
  const [lastSubmittedTempId, setLastSubmittedTempId] = useState<string | null>(null);

  // Detección automática de fuera de rango
  const isOutOfRange = currentTempInput < selectedEquipment.tempMin || currentTempInput > selectedEquipment.tempMax;

  // Actualizar temperatura por defecto al cambiar de equipo
  const handleSelectEquipment = (eqId: string) => {
    setSelectedEquipmentId(eqId);
    const eq = DEFAULT_APPCC_EQUIPMENTS.find(e => e.id === eqId) || DEFAULT_APPCC_EQUIPMENTS[0];
    const defaultMid = Number(((eq.tempMin + eq.tempMax) / 2).toFixed(1));
    setCurrentTempInput(defaultMid);
    setCorrectiveAction('');
    setIsTempSubmittedSuccess(false);
  };

  const handleSubmitTemperature = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOutOfRange && !correctiveAction.trim()) {
      alert('Alerta Sanitaria: Se requiere registrar obligatoriamente la Acción Correctiva Inmediata.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newEntry: TemperatureLogEntry = {
      id: `temp-${Date.now()}`,
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      location: selectedEquipment.location,
      recordedTemp: currentTempInput,
      tempMin: selectedEquipment.tempMin,
      tempMax: selectedEquipment.tempMax,
      isOutOfRange,
      correctiveAction: isOutOfRange ? correctiveAction : undefined,
      assignedFollowUpMinutes: isOutOfRange ? assignedFollowUpMinutes : undefined,
      followUpStatus: isOutOfRange ? 'pendiente' : undefined,
      recordedBy: userName,
      workerRole: currentRole,
      timestamp: new Date().toISOString(),
      dateStr: todayStr,
      timeStr,
      shift: currentShift,
      notes: tempNotes.trim() ? `${tempNotes} | Comunicado a: ${personNotified}` : `Comunicado a: ${personNotified}`
    };

    fnbStorage.saveTemperature(newEntry);
    setLastSubmittedTempId(newEntry.id);
    setIsTempSubmittedSuccess(true);
    setCorrectiveAction('');
    setTempNotes('');
    onRecordCreated();

    setTimeout(() => setIsTempSubmittedSuccess(false), 3500);
  };

  // =========================================================================
  // ESTADO: LIMPIEZA Y DESINFECCIÓN
  // =========================================================================
  const [cleaningFrequencyFilter, setCleaningFrequencyFilter] = useState<'todas' | 'diaria' | 'semanal' | 'quincenal'>('todas');
  const [completedCleaningTasks, setCompletedCleaningTasks] = useState<Record<string, boolean>>(() => {
    const existing = fnbStorage.getCleaningLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    const map: Record<string, boolean> = {};
    existing.filter(l => l.dateStr === todayStr).forEach(l => {
      map[l.taskId] = l.completed;
    });
    return map;
  });

  const handleToggleCleaningTask = (task: CleaningTaskDef) => {
    const isCurrentlyDone = !!completedCleaningTasks[task.id];
    const newStatus = !isCurrentlyDone;

    setCompletedCleaningTasks(prev => ({
      ...prev,
      [task.id]: newStatus
    }));

    if (newStatus) {
      const todayStr = new Date().toISOString().split('T')[0];
      const entry: CleaningLogEntry = {
        id: `cl-log-${Date.now()}`,
        taskId: task.id,
        surfaceOrEquipment: task.surfaceOrEquipment,
        area: currentStation,
        frequency: task.frequency,
        approvedChemical: task.approvedChemical,
        completed: true,
        completedBy: userName,
        completedAt: new Date().toISOString(),
        dateStr: todayStr,
        shift: currentShift,
        observations: `Dosificación y tiempo de contacto de ${task.contactTimeMinutes} min respetados.`,
        verifiedBySupervisor: currentRole === 'supervisor' || currentRole === 'responsable_fnb' || currentRole === 'direccion',
        supervisorName: currentRole !== 'trabajador' ? userName : undefined
      };
      fnbStorage.saveCleaningLog(entry);
      onRecordCreated();
    }
  };

  // =========================================================================
  // ESTADO: CHECKLISTS DE APERTURA / CIERRE
  // =========================================================================
  const [checklistType, setChecklistType] = useState<'apertura' | 'cierre'>('apertura');
  const [activeChecklistItems, setActiveChecklistItems] = useState<ChecklistTaskItem[]>(() => {
    return DEFAULT_OPENING_CHECKLIST.map(i => ({ ...i }));
  });
  const [ticketZInput, setTicketZInput] = useState<string>('');
  const [cashDifferenceInput, setCashDifferenceInput] = useState<string>('0.00');
  const [checklistSubmitted, setChecklistSubmitted] = useState<boolean>(false);

  const handleSwitchChecklistType = (type: 'apertura' | 'cierre') => {
    setChecklistType(type);
    setChecklistSubmitted(false);
    if (type === 'apertura') {
      setActiveChecklistItems(DEFAULT_OPENING_CHECKLIST.map(i => ({ ...i })));
    } else {
      setActiveChecklistItems(DEFAULT_CLOSING_CHECKLIST.map(i => ({ ...i })));
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    setActiveChecklistItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    }));
  };

  const handleSubmitChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    const allRequiredChecked = activeChecklistItems.filter(i => i.required).every(i => i.checked);
    if (!allRequiredChecked) {
      alert('Debes completar todas las comprobaciones obligatorias marcadas con asterisco (*).');
      return;
    }

    setChecklistSubmitted(true);
    onRecordCreated();
  };

  // =========================================================================
  // ESTADO: HISTORIAL DE AUDITORÍA INMUTABLE
  // =========================================================================
  const tempLogs = fnbStorage.getTemperatures();
  const cleanLogs = fnbStorage.getCleaningLogs();

  const handleSupervisorVerifyTemp = (id: string) => {
    fnbStorage.verifyTemperature(id, userName);
    onRecordCreated();
  };

  const handleSupervisorVerifyClean = (id: string) => {
    fnbStorage.verifyCleaningLog(id, userName);
    onRecordCreated();
  };

  const handleExportAuditJSON = () => {
    const reportData = {
      establecimiento: hotelName,
      fechaExportacion: new Date().toISOString(),
      responsableExportacion: userName,
      rol: currentRole,
      registrosTemperatura: tempLogs,
      registrosLimpieza: cleanLogs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_fnb_${hotelName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCleaningTasks = DEFAULT_CLEANING_CATALOG.filter(task => {
    if (cleaningFrequencyFilter === 'todas') return true;
    return task.frequency === cleaningFrequencyFilter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. CABECERA & SELECTOR DE PESTAÑAS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#C5A880]" />
              <span>Registros Operativos de F&B</span>
            </h2>
            <p className="text-xs text-gray-500">
              Formularios oficiales con validación térmica APPCC y trazabilidad legal
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#F8F9FA] px-3 py-1.5 rounded-lg border border-[#E2E8F0] shrink-0">
            <User className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Firma activa: <strong>{userName}</strong></span>
          </div>
        </div>

        {/* Subpestañas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveSubTab('temperaturas')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'temperaturas'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Thermometer className="w-4 h-4 text-[#C5A880]" />
            <span>Temperaturas APPCC</span>
          </button>

          <button
            onClick={() => setActiveSubTab('limpieza')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'limpieza'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Limpieza y Químicos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklists')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'checklists'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <FileCheck className="w-4 h-4 text-[#C5A880]" />
            <span>Apertura / Cierre</span>
          </button>

          <button
            onClick={() => setActiveSubTab('historico')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'historico'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <History className="w-4 h-4 text-[#C5A880]" />
            <span>Histórico de Auditoría</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUBTAB 1: CONTROL DE TEMPERATURAS APPCC
         ========================================================================= */}
      {activeSubTab === 'temperaturas' && (
        <div className="space-y-5">
          
          {/* Mensaje de éxito al enviar */}
          {isTempSubmittedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Registro de temperatura guardado exitosamente.</span>
                <p className="text-emerald-700 text-xs mt-0.5">
                  Identificador legal asignado. Los datos han quedado fijados en el registro inmutable de auditoría.
                </p>
              </div>
            </div>
          )}

          {/* Selector de Equipo de Frío */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              1. Selecciona el Equipo de Frío o Punto Crítico:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {DEFAULT_APPCC_EQUIPMENTS.map(eq => {
                const isSelected = eq.id === selectedEquipmentId;
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
                      <div className="text-[11px] text-gray-500 mt-0.5">{eq.location}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-mono">
                        Límite: {eq.tempMin} a {eq.tempMax} {eq.unit}
                      </span>
                      {isSelected && <span className="font-bold text-[#C5A880] text-xs">Activo</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario de Toma de Temperatura */}
          <form onSubmit={handleSubmitTemperature} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm sm:text-base text-[#1A2530]">
                  2. Valor Registrado en Termómetro / Sonda
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  Rango reglamentario: <strong className="text-[#1A2530]">{selectedEquipment.tempMin} ºC a {selectedEquipment.tempMax} ºC</strong>
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Introduce la lectura exacta mostrada por el visor digital del equipo o la sonda de inserción.
              </p>

              {/* Selector interactivo de temperatura con botones de incremento rápido */}
              <div className="flex items-center justify-center gap-3 py-4 px-3 bg-[#F8F9FA] rounded-xl border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setCurrentTempInput(prev => Number((prev - 0.5).toFixed(1)))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] text-lg font-bold hover:bg-gray-100 text-[#1A2530] transition-colors shadow-sm active:scale-95"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTempInput(prev => Number((prev - 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold hover:bg-gray-100 text-[#1A2530] transition-colors shadow-sm active:scale-95"
                >
                  -0.1
                </button>

                {/* Display Central */}
                <div className={`px-6 py-2.5 rounded-xl border text-center transition-all ${
                  isOutOfRange 
                    ? 'bg-red-50 border-red-300 text-red-700' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
                    {currentTempInput > 0 ? `+${currentTempInput.toFixed(1)}` : currentTempInput.toFixed(1)} ºC
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                    {isOutOfRange ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>¡FUERA DE LÍMITE REGLAMENTARIO!</span>
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
                  onClick={() => setCurrentTempInput(prev => Number((prev + 0.1).toFixed(1)))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-sm font-bold hover:bg-gray-100 text-[#1A2530] transition-colors shadow-sm active:scale-95"
                >
                  +0.1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTempInput(prev => Number((prev + 0.5).toFixed(1)))}
                  className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] text-lg font-bold hover:bg-gray-100 text-[#1A2530] transition-colors shadow-sm active:scale-95"
                >
                  +0.5
                </button>
              </div>
            </div>

            {/* SECCIÓN OBLIGATORIA: ALERTA SANITARIA Y ACCIÓN CORRECTIVA CUANDO FUERA DE RANGO */}
            {isOutOfRange && (
              <div className="bg-red-50/90 border border-red-300 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-red-900">
                      DESVIACIÓN TÉRMICA DETECTADA: Registro Sanitario Obligatorio
                    </h4>
                    <p className="text-xs text-red-700 mt-0.5">
                      <strong>Aviso del procedimiento APPCC:</strong> No se considera resuelta la incidencia simplemente enviando este formulario. Debes ejecutar y documentar la actuación correctora y programar una verificación.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="block text-xs font-bold text-red-900">
                    Acción Correctiva Inmediata Realizada (*):
                  </label>
                  <textarea
                    required
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Ejemplo: Reubicado género sensible a cámara 2. Comprobado cierre hermético de puertas. Reajustado termostato digital a +2.5ºC. Avisado mantenimiento."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-lg border border-red-300 bg-white focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-red-900 mb-1">
                      Programar Segunda Lectura en:
                    </label>
                    <select
                      value={assignedFollowUpMinutes}
                      onChange={(e) => setAssignedFollowUpMinutes(Number(e.target.value))}
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

            {/* Observaciones Generales */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Observaciones adicionales (Opcional):
              </label>
              <input
                type="text"
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Ej. Sonda calibrada / Condensador limpio / Carga completa de mercancía"
                className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
              />
            </div>

            {/* Botón de Envío con Firma Electrónica */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  Firma digital vinculada: <strong>{userName}</strong> ({currentRole})
                </span>
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
          SUBTAB 2: LIMPIEZA Y DESINFECCIÓN (PRODUCTOS HOMOLOGADOS)
         ========================================================================= */}
      {activeSubTab === 'limpieza' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A2530]">
                  Plan Oficial de Limpieza y Desinfección (L+D)
                </h3>
                <p className="text-xs text-gray-500">
                  Usa únicamente los productos químicos homologados y respeta estrictamente las dosificaciones autorizadas.
                </p>
              </div>

              {/* Filtro por Frecuencia */}
              <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-lg border border-[#E2E8F0]">
                {(['todas', 'diaria', 'semanal', 'quincenal'] as const).map(freq => (
                  <button
                    key={freq}
                    onClick={() => setCleaningFrequencyFilter(freq)}
                    className={`px-2.5 py-1 rounded text-xs capitalize transition-colors font-medium ${
                      cleaningFrequencyFilter === freq 
                        ? 'bg-[#1A2530] text-white' 
                        : 'text-gray-600 hover:text-[#1A2530]'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de Tareas */}
            <div className="space-y-3 mt-4">
              {filteredCleaningTasks.map(task => {
                const isDone = !!completedCleaningTasks[task.id];
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#1A2530]">
                            {task.surfaceOrEquipment}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                            {task.frequency}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {task.area}
                          </span>
                        </div>

                        {/* Producto químico autorizado y dosificación */}
                        <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0] space-y-1 text-xs">
                          <div className="font-semibold text-[#1A2530] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                            <span>Producto Homologado: <strong>{task.approvedChemical}</strong></span>
                          </div>
                          <div className="text-gray-600">
                            <strong>Dosificación exacta:</strong> {task.dosageInstructions}
                          </div>
                          <div className="text-gray-500 text-[11px] flex items-center gap-3 pt-0.5">
                            <span>⏱️ Tiempo contacto: <strong>{task.contactTimeMinutes} min</strong></span>
                            <span>🛡️ EPIs: <strong>{task.safetyEquipment.join(', ')}</strong></span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 italic">
                          Procedimiento: {task.procedureSummary}
                        </p>
                      </div>

                      {/* Botón de Marcar Tarea */}
                      <div className="sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCleaningTask(task)}
                          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            isDone 
                              ? 'bg-emerald-600 text-white shadow-sm' 
                              : 'bg-white border border-[#E2E8F0] text-[#2C3E50] hover:bg-gray-50'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isDone ? 'Completada por ' + userName : 'Marcar Completada'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: CHECKLISTS DE APERTURA Y CIERRE
         ========================================================================= */}
      {activeSubTab === 'checklists' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A2530]">
                  Checklist de Puesto: {checklistType === 'apertura' ? 'Apertura y Puesta a Punto' : 'Cierre Nocturno y Arqueo'}
                </h3>
                <p className="text-xs text-gray-500">
                  Comprobaciones obligatorias del turno en {currentStation}
                </p>
              </div>

              {/* Toggle Apertura vs Cierre */}
              <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-lg border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => handleSwitchChecklistType('apertura')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    checklistType === 'apertura' 
                      ? 'bg-[#1A2530] text-white' 
                      : 'text-gray-600 hover:text-[#1A2530]'
                  }`}
                >
                  Apertura
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchChecklistType('cierre')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                    checklistType === 'cierre' 
                      ? 'bg-[#1A2530] text-white' 
                      : 'text-gray-600 hover:text-[#1A2530]'
                  }`}
                >
                  Cierre de Turno
                </button>
              </div>
            </div>

            {/* Formulario Checklist */}
            <form onSubmit={handleSubmitChecklist} className="space-y-4">
              <div className="space-y-2">
                {activeChecklistItems.map(item => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      item.checked 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-white border-[#E2E8F0] hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="mt-0.5 rounded text-[#C5A880] focus:ring-[#C5A880] w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <span className={`font-medium ${item.checked ? 'text-emerald-950 font-semibold' : 'text-[#2C3E50]'}`}>
                        {item.label}
                      </span>
                      {item.required && (
                        <span className="text-red-500 ml-1 font-bold" title="Obligatorio">*</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                      {item.category}
                    </span>
                  </label>
                ))}
              </div>

              {/* Si es Cierre, añadir campos de Ticket Z y Arqueo */}
              {checklistType === 'cierre' && (
                <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
                  <h4 className="font-bold text-xs text-[#1A2530] uppercase tracking-wider">
                    Datos Obligatorios de Arqueo Fiscal (TPV Ágora)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Número de Ticket Z (*):
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketZInput}
                        onChange={(e) => setTicketZInput(e.target.value)}
                        placeholder="Ej. Z-20261023-01"
                        className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Diferencia de Caja (€):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={cashDifferenceInput}
                        onChange={(e) => setCashDifferenceInput(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmación y Envío */}
              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {activeChecklistItems.filter(i => i.checked).length} de {activeChecklistItems.length} comprobadas
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Confirmar y Firmar Checklist
                </button>
              </div>

              {checklistSubmitted && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Checklist de {checklistType} archivado correctamente con firma de {userName}.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: HISTORIAL DE AUDITORÍA INMUTABLE
         ========================================================================= */}
      {activeSubTab === 'historico' && (
        <div className="space-y-5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#1A2530] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C5A880]" />
                  <span>Libro Oficial de Registros y Auditoría</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Registros inmutables con trazabilidad horaria, operario responsable y verificación
                </p>
              </div>

              <button
                onClick={handleExportAuditJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A2530] hover:bg-[#2C3E50] text-white text-xs font-semibold transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Exportar Informe JSON</span>
              </button>
            </div>

            {/* Listado de Registros de Temperatura */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Últimos Controles de Temperatura Guardados:
              </h4>

              {tempLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  No hay registros de temperatura almacenados todavía.
                </div>
              ) : (
                tempLogs.map(entry => (
                  <div
                    key={entry.id}
                    className={`p-3.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      entry.isOutOfRange 
                        ? 'bg-red-50/40 border-red-200' 
                        : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A2530]">{entry.equipmentName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          entry.isOutOfRange ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {entry.recordedTemp > 0 ? `+${entry.recordedTemp}` : entry.recordedTemp} ºC
                        </span>
                        <span className="text-gray-400 font-mono text-[11px]">{entry.dateStr} {entry.timeStr}</span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        Registrado por: <strong>{entry.recordedBy}</strong> ({entry.workerRole}) · {entry.location}
                      </div>
                      {entry.correctiveAction && (
                        <div className="mt-1 text-red-700 font-medium">
                          Acción correctiva: {entry.correctiveAction}
                        </div>
                      )}
                    </div>

                    {/* Verificación por supervisor */}
                    <div className="shrink-0 flex items-center gap-2">
                      {entry.supervisorSignature ? (
                        <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verificado por {entry.supervisorSignature}</span>
                        </div>
                      ) : (
                        currentRole !== 'trabajador' ? (
                          <button
                            onClick={() => handleSupervisorVerifyTemp(entry.id)}
                            className="px-2.5 py-1 rounded bg-[#1A2530] text-white hover:bg-[#2C3E50] text-[11px] font-semibold transition-colors"
                          >
                            Firmar como Supervisor
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Pendiente de firma supervisor</span>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Listado de Registros de Limpieza */}
            <div className="space-y-2.5 mt-6 pt-4 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Últimas Tareas de Limpieza Completadas:
              </h4>

              {cleanLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  No hay registros de limpieza guardados todavía.
                </div>
              ) : (
                cleanLogs.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A2530]">{entry.surfaceOrEquipment}</span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-mono">
                          {entry.frequency}
                        </span>
                        <span className="text-gray-400 font-mono text-[11px]">{entry.dateStr}</span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        Químico: <strong>{entry.approvedChemical}</strong> · Ejecutado por: <strong>{entry.completedBy}</strong>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {entry.verifiedBySupervisor ? (
                        <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verificado por {entry.supervisorName || 'Supervisor'}</span>
                        </div>
                      ) : (
                        currentRole !== 'trabajador' ? (
                          <button
                            onClick={() => handleSupervisorVerifyClean(entry.id)}
                            className="px-2.5 py-1 rounded bg-[#1A2530] text-white hover:bg-[#2C3E50] text-[11px] font-semibold transition-colors"
                          >
                            Firmar Verificación
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Pendiente de verificación</span>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
