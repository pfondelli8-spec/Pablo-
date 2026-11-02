import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Check, 
  X, 
  AlertCircle,
  HelpCircle,
  Receipt,
  User,
  History,
  Lock,
  ChevronRight
} from 'lucide-react';
import { 
  ChecklistTaskStatus, 
  ShiftChecklistTaskItem, 
  ShiftChecklistExecution,
  UserAccount 
} from '../types/multiTenantConfig';

interface MisTareasChecklistsViewProps {
  currentUser: UserAccount;
  currentEstablishmentName: string;
  currentStationName: string;
}

// Plantillas de tareas iniciales
const DEFAULT_TASKS_APERTURA: ShiftChecklistTaskItem[] = [
  { id: 'ap-1', label: 'Encendido de terminales TPV y verificación de enlace con impresoras', required: true, status: 'pendiente', category: 'Sistemas' },
  { id: 'ap-2', label: 'Recepción y cuadre de fondo de caja y cambio fraccionario', required: true, status: 'pendiente', category: 'Caja' },
  { id: 'ap-3', label: 'Comprobación de temperaturas de cámaras de conservación (0-4ºC)', required: true, status: 'pendiente', category: 'APPCC' },
  { id: 'ap-4', label: 'Ciclo térmico y arranque de lavavasos a temperatura >65ºC', required: true, status: 'pendiente', category: 'Higiene' },
  { id: 'ap-5', label: 'Mise en place de frutas, siropes y reposición de hielo macizo', required: true, status: 'pendiente', category: 'Producción' },
  { id: 'ap-6', label: 'Montaje de terraza, comprobación de sombrillas y cartas QR', required: true, status: 'pendiente', category: 'Sala' },
  { id: 'ap-7', label: 'Inspección de uniformidad y acreditación de manipulador de alimentos', required: false, status: 'pendiente', category: 'Personal' }
];

const DEFAULT_TASKS_CIERRE: ShiftChecklistTaskItem[] = [
  { id: 'ci-1', label: 'Limpieza y desinfección de superficies de trabajo con químico homologado', required: true, status: 'pendiente', category: 'Higiene' },
  { id: 'ci-2', label: 'Vaciado, purga y limpieza de bandejas de goteo de tiradores y cafetera', required: true, status: 'pendiente', category: 'Maquinaria' },
  { id: 'ci-3', label: 'Guardado de perecederos en cámara refrigerada con etiquetado FIFO', required: true, status: 'pendiente', category: 'APPCC' },
  { id: 'ci-4', label: 'Cierre de puertas frigoríficas y arcones con cerrojo de seguridad', required: true, status: 'pendiente', category: 'Seguridad' },
  { id: 'ci-5', label: 'Arqueo de TPV y emisión obligatoria de Ticket Z de cierre', required: true, status: 'pendiente', category: 'Fiscal' },
  { id: 'ci-6', label: 'Recogida y aseguramiento de mobiliario de terraza exterior', required: true, status: 'pendiente', category: 'Instalaciones' },
  { id: 'ci-7', label: 'Retirada de residuos orgánicos al cuarto refrigerado y cambio de bolsas', required: true, status: 'pendiente', category: 'Higiene' }
];

const STORAGE_KEY = 'hostelops_shift_executions_history';

export const MisTareasChecklistsView: React.FC<MisTareasChecklistsViewProps> = ({
  currentUser,
  currentEstablishmentName,
  currentStationName
}) => {
  const [checklistType, setChecklistType] = useState<'apertura' | 'cambio_turno' | 'cierre'>('apertura');
  const [shift, setShift] = useState<'manana' | 'tarde' | 'noche'>('manana');

  // Tareas activas del turno
  const [activeTasks, setActiveTasks] = useState<ShiftChecklistTaskItem[]>(() => {
    return DEFAULT_TASKS_APERTURA.map(t => ({ ...t }));
  });

  // Campos de cierre
  const [ticketZ, setTicketZ] = useState('');
  const [cashDifference, setCashDifference] = useState('0.00');
  const [closureNotes, setClosureNotes] = useState('');

  // Mensajes y confirmación
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [nonCompliantWarning, setNonCompliantWarning] = useState<string | null>(null);

  // Historial de ejecuciones acumulables
  const [executionHistory, setExecutionHistory] = useState<ShiftChecklistExecution[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  });

  const [showHistory, setShowHistory] = useState(false);

  // Cambiar tipo de checklist
  const handleSwitchType = (type: 'apertura' | 'cambio_turno' | 'cierre') => {
    setChecklistType(type);
    setSubmitSuccess(false);
    setNonCompliantWarning(null);
    if (type === 'apertura') {
      setActiveTasks(DEFAULT_TASKS_APERTURA.map(t => ({ ...t })));
    } else {
      setActiveTasks(DEFAULT_TASKS_CIERRE.map(t => ({ ...t })));
    }
  };

  // Actualizar estado de tarea individual
  const handleUpdateTaskStatus = (taskId: string, newStatus: ChecklistTaskStatus) => {
    setActiveTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // Enviar checklist completado
  const handleSubmitChecklist = (e: React.FormEvent) => {
    e.preventDefault();

    const pendingRequired = activeTasks.filter(t => t.required && t.status === 'pendiente');
    const nonCompliant = activeTasks.filter(t => t.status === 'no_conforme');

    if (pendingRequired.length > 0) {
      setNonCompliantWarning(`Hay ${pendingRequired.length} tarea(s) obligatoria(s) sin cumplimentar. Debes indicar su estado.`);
      return;
    }

    if (checklistType === 'cierre' && !ticketZ.trim()) {
      setNonCompliantWarning('El número de Ticket Z es obligatorio para el cierre fiscal de turno.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newExecution: ShiftChecklistExecution = {
      id: `exec-${Date.now()}`,
      companyId: currentUser.companyId,
      establishmentId: currentUser.establishmentId,
      departmentId: currentUser.departmentId,
      pointOfSaleId: currentUser.pointOfSaleId,
      type: checklistType,
      shift,
      dateStr: todayStr,
      timeStr,
      operatorId: currentUser.id,
      operatorName: currentUser.name,
      operatorRole: currentUser.role,
      items: [...activeTasks],
      allRequiredCompleted: nonCompliant.length === 0,
      ticketZNumero: checklistType === 'cierre' ? ticketZ : undefined,
      cashDifference: checklistType === 'cierre' ? parseFloat(cashDifference) : undefined,
      closureNotes: closureNotes.trim() || undefined,
      supervisorVerified: currentUser.role !== 'trabajador',
      supervisorName: currentUser.role !== 'trabajador' ? currentUser.name : undefined,
      supervisorVerifiedAt: currentUser.role !== 'trabajador' ? timeStr : undefined
    };

    const updated = [newExecution, ...executionHistory];
    setExecutionHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setSubmitSuccess(true);
    setNonCompliantWarning(null);
    setTicketZ('');
    setClosureNotes('');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const completedCount = activeTasks.filter(t => t.status === 'completada').length;
  const totalCount = activeTasks.length;

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto font-sans">
      
      {/* 1. CABECERA OPERATIVA */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-bold border border-[#C5A880]/30 uppercase">
                Módulo 2 · Mis Tareas
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {currentEstablishmentName} · {currentStationName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#C5A880]" />
              <span>Checklists de Apertura, Servicio y Cierre</span>
            </h2>
            <p className="text-xs text-gray-500">
              Comprobaciones obligatorias del turno con trazabilidad inmutable y registro de arqueo
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-xs font-semibold text-[#1A2530] transition-colors self-start sm:self-center"
          >
            <History className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{showHistory ? 'Ocultar Histórico' : `Histórico (${executionHistory.length})`}</span>
          </button>
        </div>

        {/* Selector de Tipo de Checklist */}
        <div className="flex items-center gap-2 bg-[#F8F9FA] p-1.5 rounded-xl border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => handleSwitchType('apertura')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              checklistType === 'apertura'
                ? 'bg-[#1A2530] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            Apertura de Turno
          </button>

          <button
            type="button"
            onClick={() => handleSwitchType('cambio_turno')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              checklistType === 'cambio_turno'
                ? 'bg-[#1A2530] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            Cambio de Turno
          </button>

          <button
            type="button"
            onClick={() => handleSwitchType('cierre')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              checklistType === 'cierre'
                ? 'bg-[#1A2530] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#1A2530]'
            }`}
          >
            Cierre y Arqueo TPV
          </button>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <div>Checklist de {checklistType.toUpperCase()} firmado y registrado oficialmente.</div>
            <p className="text-emerald-700 text-xs font-normal mt-0.5">
              El registro ha quedado archivado con identificador inmutable. No será sobrescrito en el próximo turno.
            </p>
          </div>
        </div>
      )}

      {/* ADVERTENCIA DE NO CONFORMIDAD */}
      {nonCompliantWarning && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-amber-900 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{nonCompliantWarning}</span>
        </div>
      )}

      {/* HISTORIAL INMUTABLE (SI ESTÁ ABIERTO) */}
      {showHistory && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C5A880]" />
              <span>Libro de Registros de Checklists Archivados</span>
            </h3>
            <span className="text-xs text-gray-500 font-mono">{executionHistory.length} registros</span>
          </div>

          {executionHistory.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">No hay registros de checklists guardados todavía.</p>
          ) : (
            <div className="space-y-2">
              {executionHistory.map(exec => (
                <div key={exec.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A2530] uppercase">
                      {exec.type.replace('_', ' ')} · {exec.dateStr} {exec.timeStr}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      exec.allRequiredCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exec.allRequiredCompleted ? 'Conforme' : 'Con Observaciones'}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Operario: <strong>{exec.operatorName}</strong> ({exec.operatorRole}) · {exec.items.filter(i => i.status === 'completada').length}/{exec.items.length} tareas
                  </div>
                  {exec.ticketZNumero && (
                    <div className="text-gray-600 font-mono text-[11px]">
                      Ticket Z: <strong>{exec.ticketZNumero}</strong> | Descuadre: {exec.cashDifference} €
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. LISTA DE TAREAS INTERACTIVAS */}
      <form onSubmit={handleSubmitChecklist} className="space-y-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
          
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] text-xs">
            <span className="font-bold text-gray-500 uppercase tracking-wider">
              Tareas asignadas al puesto ({completedCount} de {totalCount} completadas)
            </span>
            <span className="font-mono text-gray-400">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#C5A880] transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>

          <div className="space-y-2.5 pt-2">
            {activeTasks.map((task, idx) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  task.status === 'completada' 
                    ? 'bg-emerald-50/40 border-emerald-200' 
                    : task.status === 'no_conforme'
                    ? 'bg-red-50/40 border-red-200'
                    : 'bg-white border-[#E2E8F0]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="w-5 h-5 rounded-full bg-[#F8F9FA] border border-[#E2E8F0] text-[10px] font-mono text-[#2C3E50] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#1A2530]">
                        {task.label}
                        {task.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500 mt-1 inline-block">
                        {task.category}
                      </span>
                    </div>
                  </div>

                  {/* Selector de Estado de la Tarea */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleUpdateTaskStatus(task.id, 'completada')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        task.status === 'completada'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Conforme</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateTaskStatus(task.id, 'no_conforme')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                        task.status === 'no_conforme'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Incidencia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateTaskStatus(task.id, 'no_aplicable')}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        task.status === 'no_aplicable'
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      N/A
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPOS FISCALES OBLIGATORIOS PARA CIERRE DE TURNO */}
        {checklistType === 'cierre' && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4 animate-fade-in">
            <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#C5A880]" />
              <span>Arqueo y Cierre Fiscal (TPV)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Número de Ticket Z (*):
                </label>
                <input
                  type="text"
                  required
                  value={ticketZ}
                  onChange={(e) => setTicketZ(e.target.value)}
                  placeholder="Ej. Z-20261024-001"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] font-mono bg-[#F8F9FA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descuadre de Caja Efectivo (€):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cashDifference}
                  onChange={(e) => setCashDifference(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] font-mono bg-[#F8F9FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Observaciones del Cierre:
              </label>
              <input
                type="text"
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                placeholder="Ej. Sobrecarga en terraza a las 22:00, reposición de hielo realizada."
                className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
              />
            </div>
          </div>
        )}

        {/* ACCIONES Y ENVÍO */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-4 h-4 text-[#C5A880]" />
            <span>Firma responsable: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Firmar y Cerrar Checklist
          </button>
        </div>
      </form>

    </div>
  );
};
