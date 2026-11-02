import React, { useState, useEffect } from 'react';
import {
  Edit3,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Layers,
  X,
  CheckCircle2,
  Trash2,
  Sliders,
  Sparkles,
  Thermometer,
  ClipboardCheck
} from 'lucide-react';

export type ActivityType = 'checklist' | 'temperatura' | 'limpieza' | 'tarea_general';

export interface EditableActivityData {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  stationKey?: string;
  stationName?: string;
  departmentId?: string;
  phase?: 'apertura' | 'servicio' | 'cierre' | 'manana' | 'tarde' | 'noche';
  frequency?: 'diaria' | 'semanal' | 'mensual';
  criticalLimit?: string;
  targetTempRange?: string;
  correctiveAction?: string;
  assignedRole?: string;
  status?: 'activo' | 'inactivo';
}

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: EditableActivityData | null;
  onSave: (updated: EditableActivityData) => void;
  onDelete?: (id: string, type: ActivityType) => void;
  activeOperatorName: string;
}

export const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  onSave,
  onDelete,
  activeOperatorName
}) => {
  const [formData, setFormData] = useState<EditableActivityData | null>(null);

  useEffect(() => {
    if (activity) {
      setFormData({ ...activity });
    }
  }, [activity]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Modificar Actividad / Control</h3>
              <p className="text-[11px] text-slate-300">
                Permisos de Administrador concedidos ({activeOperatorName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Nombre de la Actividad / Tarea *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
              placeholder="Ej. Desinfección de superficies con peracético"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Descripción o Procedimiento Detallado
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              placeholder="Instrucciones paso a paso para el operador..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fase / Momento del Turno</label>
              <select
                value={formData.phase || 'manana'}
                onChange={e => setFormData({ ...formData, phase: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                <option value="manana">Checklist Mañana (Apertura)</option>
                <option value="tarde">Checklist Tarde (Mise en Place & Pase)</option>
                <option value="noche">Checklist Noche (Cierre & L+D)</option>
                <option value="apertura">Apertura de Turno (Histórico)</option>
                <option value="servicio">Durante el Servicio / Pase</option>
                <option value="cierre">Cierre Final (Histórico)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Frecuencia Exigida</label>
              <select
                value={formData.frequency || 'diaria'}
                onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              >
                <option value="diaria">Diaria (En cada turno)</option>
                <option value="semanal">Semanal (Día asignado)</option>
                <option value="mensual">Mensual / Trimestral</option>
              </select>
            </div>
          </div>

          {formData.type === 'temperatura' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Rango Térmico Reglamentario (APPCC)
              </label>
              <input
                type="text"
                value={formData.targetTempRange || ''}
                onChange={e => setFormData({ ...formData, targetTempRange: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                placeholder="Ej. 0.0 °C a 4.0 °C"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Límite Crítico & Acción Correctora Obligatoria
            </label>
            <input
              type="text"
              value={formData.correctiveAction || ''}
              onChange={e => setFormData({ ...formData, correctiveAction: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              placeholder="Ej. Si supera 4°C, avisar a mantenimiento y trasladar a cámara auxiliar"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Puesto / Rol Asignado</label>
              <input
                type="text"
                value={formData.assignedRole || ''}
                onChange={e => setFormData({ ...formData, assignedRole: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                placeholder="Ej. Cocinero de Partida / Marmitón"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Estado de la Tarea</label>
              <select
                value={formData.status || 'activo'}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="activo">Activa (Exigible en turno)</option>
                <option value="inactivo">Pausada / Inactiva</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Está seguro de eliminar esta actividad definitivamente?')) {
                    onDelete(formData.id, formData.type);
                    onClose();
                  }
                }}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Actividad</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
              >
                Guardar Modificaciones
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
