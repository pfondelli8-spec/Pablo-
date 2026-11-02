/**
 * FASE 10 – MODAL DE DETALLE Y RESOLUCIÓN DE INCIDENCIA / FALTANTE
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PackageX, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { IncidenciaEntity, EstadoIncidencia } from '../types/incidencias';

interface IncidenciaDetailModalProps {
  incidencia: IncidenciaEntity;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: EstadoIncidencia, resueltaPor?: string) => void;
}

export const IncidenciaDetailModal: React.FC<IncidenciaDetailModalProps> = ({
  incidencia,
  onClose,
  onUpdateStatus
}) => {
  const [resolverName, setResolverName] = useState('Maître General');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
              incidencia.gravedad === 'urgente' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
              incidencia.gravedad === 'media' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-stone-800 text-stone-300'
            }`}>
              {incidencia.gravedad.toUpperCase()}
            </span>

            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
              incidencia.estado === 'resuelta' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
              incidencia.estado === 'en_proceso' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
              'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {incidencia.estado.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase block">
              {incidencia.tipo === 'faltante_stock' ? 'Faltante de Stock' : 'Incidencia Operativa'} · ID: {incidencia.id}
            </span>
            <h2 className="text-lg sm:text-xl font-display font-bold text-stone-100 mt-0.5">
              {incidencia.titulo}
            </h2>
          </div>

          {/* Grid de metadatos */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
              <span className="text-stone-500 text-[10px] font-mono block">Fecha y Hora</span>
              <span className="text-stone-200 font-mono font-semibold">{incidencia.fecha} · {incidencia.hora} h</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
              <span className="text-stone-500 text-[10px] font-mono block">Reportado Por</span>
              <span className="text-stone-200 font-semibold truncate block">{incidencia.reportadoPor}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 col-span-2">
              <span className="text-stone-500 text-[10px] font-mono block">Centro de Venta</span>
              <span className="text-amber-400 font-semibold">{incidencia.hotel} — {incidencia.centroVenta}</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-stone-400 uppercase font-semibold">
              Descripción del Problema
            </span>
            <p className="text-xs sm:text-sm text-stone-200 bg-stone-950 p-3.5 rounded-2xl border border-stone-850 leading-relaxed">
              {incidencia.descripcion}
            </p>
          </div>

          {/* Producto afectado si aplica */}
          {incidencia.productoAfectado && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs">
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">
                Producto o Receta Afectada
              </span>
              <span className="text-stone-200 font-medium">{incidencia.productoAfectado}</span>
            </div>
          )}

          {/* Acción tomada */}
          {incidencia.accionTomada && (
            <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/40 text-xs">
              <span className="text-[10px] font-mono text-sky-400 font-bold block uppercase">
                Acción o Aviso Ejecutado
              </span>
              <span className="text-stone-200">{incidencia.accionTomada}</span>
            </div>
          )}

          {/* Datos de resolución si está resuelta */}
          {incidencia.estado === 'resuelta' && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Incidencia Resuelta con Éxito</span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Cerrada el {incidencia.resueltaAt || 'Hoy'} por <strong>{incidencia.resueltaPor || 'Dirección F&B'}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Pie con cambio de estado */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-stone-500 shrink-0">Cambiar estado:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateStatus(incidencia.id, 'abierta')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                  incidencia.estado === 'abierta' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                Abierta
              </button>
              <button
                onClick={() => onUpdateStatus(incidencia.id, 'en_proceso')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                  incidencia.estado === 'en_proceso' ? 'bg-sky-500 text-stone-950' : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                En Proceso
              </button>
              <button
                onClick={() => onUpdateStatus(incidencia.id, 'resuelta', resolverName)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                  incidencia.estado === 'resuelta' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-900 text-emerald-400 border border-emerald-900/60'
                }`}
              >
                ✓ Resuelta
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono font-bold transition-colors w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
