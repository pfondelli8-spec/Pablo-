import React, { useState, useEffect } from 'react';
import { 
  X, 
  Pencil, 
  Check, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Clock, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import { BarProcedureItem, BAR_OFFICIAL_PROCEDURES } from '../data/barProceduresData';

interface EditProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: BarProcedureItem | null;
  onSave: (updatedProcedure: BarProcedureItem) => void;
  onResetToDefault: (procedureId: string) => void;
}

export const EditProcedureModal: React.FC<EditProcedureModalProps> = ({
  isOpen,
  onClose,
  procedure,
  onSave,
  onResetToDefault
}) => {
  if (!isOpen || !procedure) return null;

  // Estados locales para el formulario de parámetros
  const [formData, setFormData] = useState<BarProcedureItem>(() => JSON.parse(JSON.stringify(procedure)));
  const [newRequirement, setNewRequirement] = useState('');
  const [newSafetyNote, setNewSafetyNote] = useState('');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDetail, setNewStepDetail] = useState('');
  const [newStepCritical, setNewStepCritical] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (procedure) {
      setFormData(JSON.parse(JSON.stringify(procedure)));
      setSaveSuccess(false);
    }
  }, [procedure]);

  const handleInputChange = (field: keyof BarProcedureItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddRequirement = () => {
    if (!newRequirement.trim()) return;
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), newRequirement.trim()]
    }));
    setNewRequirement('');
  };

  const handleRemoveRequirement = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== idx)
    }));
  };

  const handleRequirementChange = (idx: number, val: string) => {
    setFormData(prev => {
      const copy = [...(prev.requirements || [])];
      copy[idx] = val;
      return { ...prev, requirements: copy };
    });
  };

  const handleAddSafetyNote = () => {
    if (!newSafetyNote.trim()) return;
    setFormData(prev => ({
      ...prev,
      safetyNotes: [...(prev.safetyNotes || []), newSafetyNote.trim()]
    }));
    setNewSafetyNote('');
  };

  const handleRemoveSafetyNote = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      safetyNotes: (prev.safetyNotes || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSafetyNoteChange = (idx: number, val: string) => {
    setFormData(prev => {
      const copy = [...(prev.safetyNotes || [])];
      copy[idx] = val;
      return { ...prev, safetyNotes: copy };
    });
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim() || !newStepDetail.trim()) return;
    const newOrder = formData.steps.length + 1;
    const stepObj: BarProcedureItem['steps'][0] = {
      order: newOrder,
      title: newStepTitle.trim(),
      detail: newStepDetail.trim(),
      ...(newStepCritical.trim() ? { criticalCheck: newStepCritical.trim() } : {})
    };

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, stepObj]
    }));

    setNewStepTitle('');
    setNewStepDetail('');
    setNewStepCritical('');
    setShowAddStep(false);
  };

  const handleRemoveStep = (idx: number) => {
    setFormData(prev => {
      const updated = prev.steps.filter((_, i) => i !== idx).map((s, i) => ({
        ...s,
        order: i + 1
      }));
      return { ...prev, steps: updated };
    });
  };

  const handleStepFieldChange = (idx: number, field: 'title' | 'detail' | 'criticalCheck', val: string) => {
    setFormData(prev => {
      const copy = [...prev.steps];
      copy[idx] = {
        ...copy[idx],
        [field]: val
      };
      return { ...prev, steps: copy };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const original = BAR_OFFICIAL_PROCEDURES.find(p => p.id === procedure.id);
    if (original) {
      setFormData(JSON.parse(JSON.stringify(original)));
      onResetToDefault(procedure.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="w-full max-w-3xl my-auto bg-stone-900 border border-sky-500/50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA DEL MODAL */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-950 via-stone-900 to-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center shrink-0">
              <Pencil className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500 text-stone-950 border border-sky-400">
                  {formData.code}
                </span>
                <span className="text-xs font-mono text-sky-400 uppercase tracking-wider font-bold">
                  Modificar Parámetros de la Mesa / Protocolo
                </span>
              </div>
              <h2 className="font-display font-bold text-base sm:text-lg text-white truncate mt-0.5">
                {formData.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO DEL FORMULARIO CON SCROLL */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-xs">
                ¡Parámetros de la mesa actualizados y guardados correctamente en el sistema!
              </span>
            </div>
          )}

          {/* PARÁMETROS GENERALES: NOMBRE, CÓDIGO, CATEGORÍA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-400 mb-1 text-[11px] uppercase tracking-wider font-bold">
                Título / Nombre de la Mesa:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-sky-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 text-[11px] uppercase tracking-wider font-bold">
                Código SOP:
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sky-400 font-bold focus:outline-none focus:border-sky-500 text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-stone-400 mb-1 text-[11px] uppercase tracking-wider font-bold">
                Categoría:
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-sky-500 text-xs cursor-pointer"
              >
                <option value="operativo">Bar & Servicio (Operativo)</option>
                <option value="calidad">Limpieza & APPCC (Calidad)</option>
                <option value="seguridad">Seguridad & Normativa</option>
              </select>
            </div>
          </div>

          {/* PARÁMETROS DE SERVICIO: RESPONSABLE Y TIMING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800/80">
            <div>
              <label className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px] uppercase tracking-wider font-bold">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Responsable de la Mesa / Turno:</span>
              </label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleInputChange('responsible', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-sky-500 text-xs"
                placeholder="Ej. Bartender / Camarero Turno Mañana"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px] uppercase tracking-wider font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horario / Timing Operativo:</span>
              </label>
              <input
                type="text"
                value={formData.timing || ''}
                onChange={(e) => handleInputChange('timing', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-amber-300 focus:outline-none focus:border-sky-500 text-xs font-mono"
                placeholder="Ej. 10:30 h y 17:30 h / Continuo"
              />
            </div>
          </div>

          {/* REQUISITOS PREVIOS Y DOTACIÓN OBLIGATORIA (FONDO DE CAJA, CRISTALERÍA, ETC.) */}
          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-emerald-900/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Requisitos Previos & Dotación Obligatoria ({formData.requirements?.length || 0}):</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {(formData.requirements || []).map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-900 transition-colors"
                    title="Eliminar requisito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Añadir nuevo requisito (ej. Fondo de cambio de 200,00 €, tablas verdes...)"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequirement(); }}}
                className="flex-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 text-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* PASOS OPERATIVOS DE LA MESA */}
          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-sky-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Pasos Operativos de la Mesa ({formData.steps.length} pasos):</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddStep(prev => !prev)}
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{showAddStep ? 'Cancelar paso' : 'Añadir nuevo paso'}</span>
              </button>
            </div>

            {/* FORMULARIO PARA AÑADIR NUEVO PASO */}
            {showAddStep && (
              <div className="p-3 rounded-xl bg-stone-900 border border-sky-500/50 space-y-2 animate-fadeIn">
                <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider block">
                  Nuevo Paso #{formData.steps.length + 1}
                </span>
                <input
                  type="text"
                  placeholder="Título del paso (ej. Pulido de cristalería, comprobación TPV...)"
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-sky-500"
                />
                <textarea
                  placeholder="Detalle operativo paso a paso..."
                  rows={2}
                  value={newStepDetail}
                  onChange={(e) => setNewStepDetail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  placeholder="Control crítico APPCC opcional (ej. Temperatura > 65ºC)"
                  value={newStepCritical}
                  onChange={(e) => setNewStepCritical(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-amber-300 text-xs focus:outline-none focus:border-sky-500"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddStep(false)}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-300 text-xs cursor-pointer"
                  >
                    Descartar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    disabled={!newStepTitle.trim() || !newStepDetail.trim()}
                    className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Guardar este paso
                  </button>
                </div>
              </div>
            )}

            {/* LISTA EDITABLE DE PASOS */}
            <div className="space-y-2">
              {formData.steps.map((st, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-md bg-stone-800 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {st.order}
                      </span>
                      <input
                        type="text"
                        value={st.title}
                        onChange={(e) => handleStepFieldChange(idx, 'title', e.target.value)}
                        className="flex-1 font-bold text-stone-100 bg-transparent border-b border-transparent hover:border-stone-700 focus:border-sky-500 focus:outline-none text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 rounded text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors"
                      title="Eliminar paso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={st.detail}
                    onChange={(e) => handleStepFieldChange(idx, 'detail', e.target.value)}
                    className="w-full px-2 py-1 rounded bg-stone-950 border border-stone-850 text-stone-300 text-[11px] focus:outline-none focus:border-sky-500 font-sans"
                  />
                  {st.criticalCheck !== undefined && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[9px] text-amber-400 font-bold uppercase shrink-0">APPCC:</span>
                      <input
                        type="text"
                        value={st.criticalCheck || ''}
                        onChange={(e) => handleStepFieldChange(idx, 'criticalCheck', e.target.value)}
                        className="flex-1 px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[10px] focus:outline-none focus:border-amber-500"
                        placeholder="Comprobación crítica..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NOTAS DE SEGURIDAD Y PREVENCIÓN */}
          <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-amber-900/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Normas de Seguridad & Prevención ({formData.safetyNotes?.length || 0}):</span>
              </span>
            </div>

            <div className="space-y-1.5">
              {(formData.safetyNotes || []).map((note, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => handleSafetyNoteChange(idx, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSafetyNote(idx)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-900 transition-colors"
                    title="Eliminar nota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Añadir norma de seguridad (ej. Usar pinzas higiénicas para manipular hielo...)"
                value={newSafetyNote}
                onChange={(e) => setNewSafetyNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSafetyNote(); }}}
                className="flex-1 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSafetyNote}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1 text-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN: GUARDAR, RESTAURAR, CANCELAR */}
          <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
              title="Restablecer a valores de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer valores originales</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Guardar Parámetros de la Mesa</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
