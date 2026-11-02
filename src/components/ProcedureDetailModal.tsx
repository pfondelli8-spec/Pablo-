import React, { useState } from 'react';
import { 
  AlertTriangle, 
  BookOpen, 
  Check, 
  CheckCircle2, 
  Clock, 
  Droplet, 
  FileSpreadsheet, 
  FileText, 
  HardHat, 
  Printer, 
  Send, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Wrench, 
  X 
} from 'lucide-react';
import { OperatingProcedure, HotelProperty, ShiftChecklistLog } from '../types/operations';

interface ProcedureDetailModalProps {
  procedure: OperatingProcedure | null;
  selectedHotel: HotelProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onLogShiftExecution: (log: ShiftChecklistLog) => void;
}

export const ProcedureDetailModal: React.FC<ProcedureDetailModalProps> = ({
  procedure,
  selectedHotel,
  isOpen,
  onClose,
  onLogShiftExecution
}) => {
  if (!isOpen || !procedure) return null;

  const [activeTab, setActiveTab] = useState<'guia' | 'tecnica' | 'checklist'>('guia');
  
  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [workerName, setWorkerName] = useState('');
  const [selectedShift, setSelectedShift] = useState(procedure.shift === 'Continuo' ? 'Mañana' : procedure.shift);
  const [shiftNotes, setShiftNotes] = useState('');
  const [logSubmitted, setLogSubmitted] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalChecklistCount = procedure.checklistItems.length;
  const isAllChecked = totalChecklistCount > 0 && completedCount === totalChecklistCount;

  const handleSubmitShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) return;

    const newLog: ShiftChecklistLog = {
      id: `log-${Date.now()}`,
      procedureId: procedure.id,
      procedureCode: procedure.code,
      procedureTitle: procedure.title,
      hotelId: selectedHotel ? selectedHotel.id : 'hotel-general',
      hotelName: selectedHotel ? selectedHotel.name : 'Todos los Hoteles',
      workerName: workerName.trim(),
      department: procedure.department,
      shift: selectedShift,
      completedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      completedItemsCount: completedCount,
      totalItemsCount: totalChecklistCount,
      notes: shiftNotes.trim() ? shiftNotes.trim() : undefined
    };

    onLogShiftExecution(newLog);
    setLogSubmitted(true);
    setTimeout(() => {
      setLogSubmitted(false);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 print:bg-white print:border-none print:shadow-none print:text-black">
        
        {/* Cabecera Oficial del Procedimiento */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between print:border-stone-400 print:bg-white">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 print:text-stone-700">
              <span className="font-bold bg-emerald-950/80 border border-emerald-800/70 px-2 py-0.5 rounded print:border-stone-400">
                {procedure.code}
              </span>
              <span>v{procedure.version}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-300 print:text-stone-800 font-semibold">{procedure.departmentLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400">Rev: {procedure.updatedDate}</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-stone-100 print:text-black">
              {procedure.title}
            </h2>
            <div className="text-xs text-stone-400 print:text-stone-600 flex items-center gap-2">
              <span>Hotel de Aplicación: <strong>{selectedHotel ? selectedHotel.name : 'Todos los Hoteles del Grupo'}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Puesto: <strong className="text-emerald-300 print:text-stone-900">{procedure.responsibleRole}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Imprimir o exportar ficha oficial"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pestañas de Vista */}
        <div className="px-6 py-2.5 bg-stone-900/90 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs print:hidden">
          <button
            onClick={() => setActiveTab('guia')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'guia'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía Operativa Paso a Paso ({procedure.steps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tecnica')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'tecnica'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ficha Técnica, EPIs & Dosificación</span>
            {procedure.chemicals && procedure.chemicals.length > 0 && (
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 rounded font-mono">
                {procedure.chemicals.length} químicos
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-semibold'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Checklist & Registro de Turno</span>
            {completedCount > 0 && (
              <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 rounded font-mono">
                {completedCount}/{totalChecklistCount}
              </span>
            )}
          </button>
        </div>

        {/* Contenido Desplazable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Banner de Objetivo & Alcance */}
          <div className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2 text-xs print:bg-stone-100 print:border-stone-300">
            <div>
              <span className="font-semibold text-emerald-400 print:text-emerald-800 uppercase tracking-wider font-mono text-[10px] block">
                Objetivo Operativo:
              </span>
              <p className="text-stone-300 print:text-stone-800 mt-0.5 leading-relaxed">
                {procedure.objective}
              </p>
            </div>
            <div className="pt-2 border-t border-stone-800/80 print:border-stone-300 flex flex-wrap items-center justify-between gap-2 text-stone-400 print:text-stone-700">
              <div>
                <span>Alcance: <strong>{procedure.scope}</strong></span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>Turno: <strong>{procedure.shift}</strong></span>
                <span>Tiempo estimado: <strong>{procedure.estimatedDuration}</strong></span>
              </div>
            </div>
          </div>

          {/* TAB 1: Guía Operativa Paso a Paso */}
          {activeTab === 'guia' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-stone-100 print:text-black">
                  Secuencia de Operaciones Cronológica
                </h3>
                <span className="text-xs text-stone-400 print:text-stone-600 font-mono">
                  {procedure.steps.length} etapas estandarizadas
                </span>
              </div>

              <div className="space-y-4">
                {procedure.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-stone-950/50 border border-stone-800/80 rounded-xl p-4 sm:p-5 space-y-3 print:border-stone-300 print:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/70 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 print:border-stone-400 print:text-stone-800 print:bg-stone-100">
                          {step.stepNumber}
                        </span>
                        <h4 className="font-display text-sm sm:text-base font-bold text-stone-100 print:text-black">
                          {step.title}
                        </h4>
                      </div>

                      {step.durationApproxMinutes !== undefined && step.durationApproxMinutes > 0 && (
                        <span className="text-[11px] font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded flex items-center gap-1 shrink-0 print:border-stone-300">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>~{step.durationApproxMinutes} min</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-300 print:text-stone-800 leading-relaxed font-sans pl-9">
                      {step.description}
                    </p>

                    {step.criticalPoint && (
                      <div className="ml-9 bg-amber-950/30 border border-amber-800/50 rounded-lg p-3 text-xs text-amber-200 flex items-start gap-2.5 print:border-stone-400 print:bg-stone-100 print:text-stone-900">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300 print:text-stone-900 block mb-0.5">
                            Punto Crítico de Control / Advertencia:
                          </strong>
                          <span>{step.criticalPoint}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Advertencias de Seguridad PRL / APPCC */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-2 text-xs text-rose-200 print:border-stone-300 print:bg-white print:text-stone-800">
                <div className="flex items-center gap-2 font-semibold text-rose-300 print:text-stone-900">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Precauciones de Seguridad y Salud en el Trabajo (PRL):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-stone-300 print:text-stone-700">
                  {procedure.safetyPrecautions.map((prec, i) => (
                    <li key={i}>{prec}</li>
                  ))}
                </ul>
                {procedure.relatedRegulations && (
                  <div className="pt-2 text-[11px] font-mono text-stone-400 print:text-stone-600">
                    Marco Regulatorio: {procedure.relatedRegulations}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Ficha Técnica, EPIs & Dosificación */}
          {activeTab === 'tecnica' && (
            <div className="space-y-6">
              {/* Equipos de Protección Individual (EPIs) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <HardHat className="w-4 h-4" />
                  <span className="uppercase">Equipos de Protección Individual (EPI) Obligatorios</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {procedure.requiredPPE.map((ppe, i) => (
                    <div
                      key={i}
                      className="bg-stone-950 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5 text-xs text-stone-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{ppe}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maquinaria, Útiles y Herramientas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <Wrench className="w-4 h-4" />
                  <span className="uppercase">Maquinaria y Útiles Requeridos</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {procedure.requiredTools.map((tool, i) => (
                    <div
                      key={i}
                      className="bg-stone-950 border border-stone-800 p-3 rounded-xl flex items-center gap-2.5 text-xs text-stone-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matriz de Químicos y Dosificación (si aplica) */}
              {procedure.chemicals && procedure.chemicals.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                      <Droplet className="w-4 h-4" />
                      <span className="uppercase">Matriz de Productos Químicos & Dosificación Oficial</span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-500">
                      Fichas de Datos de Seguridad (FDS)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {procedure.chemicals.map((chem, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
                          <div>
                            <span className="font-semibold text-stone-100 text-sm">{chem.name}</span>
                            {chem.commercialRef && (
                              <span className="ml-2 font-mono text-[11px] text-emerald-400">
                                Ref: {chem.commercialRef}
                              </span>
                            )}
                          </div>
                          {chem.colorCode && (
                            <span className="font-mono text-[11px] bg-stone-900 border border-stone-700 px-2 py-0.5 rounded text-stone-300">
                              Código: {chem.colorCode}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                          <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-400 uppercase block font-sans">Dosificación / Dilución</span>
                            <span className="text-emerald-300 font-semibold">{chem.dilutionRatio}</span>
                          </div>
                          <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-400 uppercase block font-sans">Tiempo de Contacto</span>
                            <span className="text-amber-300 font-semibold">{chem.contactTime}</span>
                          </div>
                          <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-400 uppercase block font-sans">Nivel de pH</span>
                            <span className="text-sky-300 font-semibold">{chem.phLevel || 'Neutro'}</span>
                          </div>
                        </div>

                        <p className="text-stone-300 font-sans">
                          <strong>Función específica:</strong> {chem.function}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Checklist & Registro de Turno */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-stone-100">
                    Lista de Verificación de Tareas del Turno
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Marca las verificaciones operativas realizadas antes de registrar y firmar tu turno de trabajo.
                  </p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-lg font-bold text-emerald-400">
                    {completedCount} / {totalChecklistCount}
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase">Verificaciones</div>
                </div>
              </div>

              {/* Items de la Checklist */}
              <div className="space-y-2.5">
                {procedure.checklistItems.map((item, idx) => {
                  const isChecked = Boolean(checkedItems[idx]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs sm:text-sm ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-stone-950'
                            : 'border-stone-700 bg-stone-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="flex-1 select-none leading-relaxed">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Formulario de Firma y Registro del Operario */}
              <form onSubmit={handleSubmitShift} className="bg-stone-950 border border-stone-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                  <span>REGISTRO Y FIRMA DIGITAL DEL TRABAJADOR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Nombre y Apellidos del Trabajador:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carmen Rodríguez (Pisos)"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-medium">Turno Operativo:</label>
                    <select
                      value={selectedShift}
                      onChange={(e) => setSelectedShift(e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Mañana">Turno de Mañana (07:00 - 15:00)</option>
                      <option value="Tarde">Turno de Tarde (15:00 - 23:00)</option>
                      <option value="Noche">Turno de Noche (23:00 - 07:00)</option>
                      <option value="Continuo">Turno Continuo / Refuerzo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 mb-1 text-xs font-medium">Observaciones / Incidencias detectadas durante el procedimiento:</label>
                  <textarea
                    rows={2}
                    placeholder="Opcional: registrar averías, falta de químicos de repuesto o casos especiales..."
                    value={shiftNotes}
                    onChange={(e) => setShiftNotes(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-500 font-mono">
                    {selectedHotel ? selectedHotel.name : 'Todos los Hoteles'} · Registro auditable
                  </div>

                  <button
                    type="submit"
                    disabled={!workerName.trim() || completedCount === 0}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      workerName.trim() && completedCount > 0
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-stone-950 shadow-sm'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Firmar y Registrar Cumplimiento</span>
                  </button>
                </div>

                {logSubmitted && (
                  <div className="bg-emerald-950/60 border border-emerald-700/60 p-3 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      ¡Registro completado con éxito! Se ha guardado en el Libro de Operaciones del hotel.
                    </span>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/90 flex items-center justify-between print:hidden">
          <span className="text-xs text-stone-500 font-mono">
            Código Documental: {procedure.code} (Confidencialidad Operativa)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
