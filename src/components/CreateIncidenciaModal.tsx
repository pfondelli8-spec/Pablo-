/**
 * FASE 10 – MODAL PARA REPORTAR INCIDENCIA O FALTANTE DE STOCK
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PackageX, 
  Wrench, 
  Flame, 
  Building2, 
  User, 
  CheckCircle2 
} from 'lucide-react';
import { IncidenciaEntity, TipoIncidencia, GravedadIncidencia } from '../types/incidencias';

interface CreateIncidenciaModalProps {
  initialType?: TipoIncidencia;
  onClose: () => void;
  onSave: (inc: IncidenciaEntity) => void;
}

export const CreateIncidenciaModal: React.FC<CreateIncidenciaModalProps> = ({
  initialType = 'incidencia',
  onClose,
  onSave
}) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<TipoIncidencia>(initialType);
  const [gravedad, setGravedad] = useState<GravedadIncidencia>('urgente');
  const [hotel, setHotel] = useState<'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos'>('Klayman Diamond');
  const [centroVenta, setCentroVenta] = useState('Bar / Terraza Diamond');
  const [reportadoPor, setReportadoPor] = useState('Personal en Turno');
  const [productoAfectado, setProductoAfectado] = useState('');
  const [accionTomada, setAccionTomada] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) return;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const hotelId = hotel === 'Klayman Diamond' ? 'klayman-diamond' : hotel === 'Klayman Olivina' ? 'klayman-olivina' : 'todos';

    const newInc: IncidenciaEntity = {
      id: `inc-${Date.now()}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      tipo,
      gravedad,
      estado: 'abierta',
      fecha,
      hora,
      hotel,
      hotelId,
      centroVenta,
      reportadoPor: reportadoPor.trim(),
      productoAfectado: productoAfectado.trim() || undefined,
      accionTomada: accionTomada.trim() || undefined
    };

    onSave(newInc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              tipo === 'faltante_stock' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {tipo === 'faltante_stock' ? <PackageX className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                Operativa Klayman
              </span>
              <h2 className="text-lg font-display font-bold text-stone-100">
                {tipo === 'faltante_stock' ? 'Reportar Faltante de Stock' : 'Registrar Nueva Incidencia'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                Tipo *
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoIncidencia)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="faltante_stock">Faltante de Stock / Producto</option>
                <option value="incidencia">Incidencia Operativa</option>
                <option value="averia_tecnica">Avería Técnica / Instalaciones</option>
                <option value="servicio">Incidencia de Servicio</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                Gravedad *
              </label>
              <select
                value={gravedad}
                onChange={(e) => setGravedad(e.target.value as GravedadIncidencia)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="urgente">🔴 Urgente (Atención Inmediata)</option>
                <option value="media">🟠 Media (Turno Actual)</option>
                <option value="baja">🟡 Baja (Ordinaria)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-stone-400 block mb-1">
              Título Breve *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Agotado Zumo de Piña / Avería en TPV 2"
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-stone-400 block mb-1">
              Descripción Detallada *
            </label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Explica qué ha ocurrido, impacto en el servicio o cliente y qué se necesita..."
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                Hotel & Centro *
              </label>
              <input
                type="text"
                required
                value={centroVenta}
                onChange={(e) => setCentroVenta(e.target.value)}
                placeholder="Bar / Terraza Diamond"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-stone-400 block mb-1">
                Reportado Por *
              </label>
              <input
                type="text"
                required
                value={reportadoPor}
                onChange={(e) => setReportadoPor(e.target.value)}
                placeholder="Nombre y cargo"
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-stone-400 block mb-1">
              Producto o Elemento Afectado (Opcional)
            </label>
            <input
              type="text"
              value={productoAfectado}
              onChange={(e) => setProductoAfectado(e.target.value)}
              placeholder="Ej: Mojito Tradicional / Mesas 12 a 15"
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-stone-400 block mb-1">
              Acción Tomada / Aviso Inmediato (Opcional)
            </label>
            <input
              type="text"
              value={accionTomada}
              onChange={(e) => setAccionTomada(e.target.value)}
              placeholder="Ej: Avisado a Laura (F&B) y puesta sombrilla plegada"
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-mono font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            >
              Registrar Reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
