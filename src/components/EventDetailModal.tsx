/**
 * FASE 8 – MODAL DE DETALLE Y GESTIÓN OPERATIVA DE EVENTO
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  MapPin, 
  User, 
  AlertCircle, 
  Flame, 
  FileText, 
  Tag, 
  Wine, 
  FileCheck2, 
  Paperclip, 
  Image as ImageIcon, 
  FileCode, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { EventoEntity, EventStatus, EventPriority, EventAttachment } from '../types/events';
import { evaluarAlertaEvento } from '../data/eventsMaster';

interface EventDetailModalProps {
  evento: EventoEntity;
  currentTime?: Date;
  onClose: () => void;
  onUpdateStatus?: (newStatus: EventStatus) => void;
  onAddAttachment?: (eventId: string, attachment: EventAttachment) => void;
  onRemoveAttachment?: (eventId: string, attachmentId: string) => void;
  onOpenProductDetail?: (productId: string, nameFallback?: string) => void;
  onOpenTechnicalSheet?: (sheetId: string) => void;
  onOpenPromotion?: (promoId: string) => void;
  onOpenProcedure?: (procId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  evento,
  currentTime = new Date(),
  onClose,
  onUpdateStatus,
  onAddAttachment,
  onRemoveAttachment,
  onOpenProductDetail,
  onOpenTechnicalSheet,
  onOpenPromotion,
  onOpenProcedure
}) => {
  // Estado para formulario de nuevo adjunto
  const [showAddAttachment, setShowAddAttachment] = useState(false);
  const [attachName, setAttachName] = useState('');
  const [attachType, setAttachType] = useState<'foto' | 'pdf' | 'instruccion'>('foto');
  const [attachUrl, setAttachUrl] = useState('');
  const [attachText, setAttachText] = useState('');

  // Evaluación de alerta en vivo
  const alerta = evaluarAlertaEvento(evento, currentTime);

  // Colores por prioridad
  const getPriorityBadge = (priority: EventPriority) => {
    switch (priority) {
      case 'Crítica':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-1.5 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Prioridad Crítica
          </span>
        );
      case 'Alta':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Prioridad Alta
          </span>
        );
      case 'Media':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-sky-950/80 text-sky-300 border border-sky-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Prioridad Media
          </span>
        );
      case 'Baja':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800">
            Prioridad Baja
          </span>
        );
    }
  };

  // Colores por estado
  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'Activo':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Activo Ahora
          </span>
        );
      case 'Programado':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            Programado
          </span>
        );
      case 'Finalizado':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
            Finalizado
          </span>
        );
      case 'Cancelado':
        return (
          <span className="px-3 py-1 rounded-xl text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-900 line-through">
            Cancelado
          </span>
        );
    }
  };

  const handleCreateAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachName.trim()) return;

    const newAtt: EventAttachment = {
      id: `att-${Date.now()}`,
      name: attachName.trim(),
      type: attachType,
      url: attachType === 'instruccion' ? (attachText || '#') : (attachUrl.trim() || '#'),
      size: attachType === 'pdf' ? 'Aprox. 450 KB' : attachType === 'foto' ? 'Aprox. 800 KB' : `${(attachText.length / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };

    if (onAddAttachment) {
      onAddAttachment(evento.id, newAtt);
    }

    setAttachName('');
    setAttachUrl('');
    setAttachText('');
    setShowAddAttachment(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* CABECERA */}
        <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950/90 flex items-start justify-between gap-4 sticky top-0 z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                {evento.tipo}
              </span>
              {getPriorityBadge(evento.prioridad)}
              {getStatusBadge(evento.estado)}
              <span className="text-[10px] font-mono text-stone-500">
                ID: {evento.id}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100 leading-snug">
              {evento.titulo}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* BANNER DE ALERTA AUTOMÁTICA EN VIVO SI APLICA */}
          {alerta.timing !== 'ninguna' && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 shadow-md ${
              alerta.timing === 'activo'
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 animate-pulse'
                : alerta.timing === 'comienza_en_30_min'
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                : 'bg-sky-950/60 border-sky-500/80 text-sky-200'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="text-xs sm:text-sm font-medium">
                <span className="font-bold block font-mono uppercase text-[11px] tracking-wider mb-0.5">
                  {alerta.timing === 'activo' ? 'Alerta en Vivo: Evento Activo' : 'Alerta Automática de Inicio'}
                </span>
                {alerta.mensaje}
              </div>
            </div>
          )}

          {/* IMAGEN DE REFERENCIA SI EXISTE */}
          {evento.imagen && (
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-stone-800 shadow-inner group">
              <img 
                src={evento.imagen} 
                alt={evento.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] font-mono text-stone-300 bg-stone-900/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-stone-800">
                  {evento.centroVenta}
                </span>
              </div>
            </div>
          )}

          {/* DATOS OPERATIVOS CLAVE EN REJILLA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-mono mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Fecha</span>
              </div>
              <p className="text-sm font-bold text-stone-200 font-mono">
                {evento.fecha}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-mono mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horario</span>
              </div>
              <p className="text-sm font-bold text-amber-300 font-mono">
                {evento.horaInicio} - {evento.horaFin} h
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-mono mb-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotel</span>
              </div>
              <p className="text-xs font-semibold text-stone-200 truncate">
                {evento.hotel}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-mono mb-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Responsable</span>
              </div>
              <p className="text-xs font-semibold text-stone-200 truncate" title={evento.responsable}>
                {evento.responsable}
              </p>
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Descripción del Evento
            </h3>
            <p className="text-sm text-stone-300 bg-stone-950/70 p-4 rounded-2xl border border-stone-850 leading-relaxed">
              {evento.descripcion}
            </p>
          </div>

          {/* OBSERVACIONES OPERATIVAS */}
          {evento.observacionesOperativas && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/50 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Observaciones Operativas para el Equipo</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                {evento.observacionesOperativas}
              </p>
            </div>
          )}

          {/* VINCULACIONES OPERATIVAS (Productos, Promociones, Happy Hour, Procedimientos) */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold border-b border-stone-800 pb-2">
              Vinculaciones Operativas del Evento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. PRODUCTOS VINCULADOS */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                    <Wine className="w-4 h-4" />
                    Productos Carta ({evento.productosVinculados?.length || 0})
                  </span>
                </div>
                {evento.productosVinculados && evento.productosVinculados.length > 0 ? (
                  <div className="space-y-1.5">
                    {evento.productosVinculados.map((prod, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs hover:border-amber-500/50 transition-colors"
                      >
                        <span className="text-stone-200 font-medium truncate">
                          {prod.nombre}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {prod.precio !== undefined && (
                            <span className="text-amber-400 font-mono font-bold">
                              {prod.precio.toFixed(2)} €
                            </span>
                          )}
                          {onOpenProductDetail && (
                            <button
                              onClick={() => onOpenProductDetail(prod.id, prod.nombre)}
                              className="text-[10px] font-mono text-stone-400 hover:text-amber-300 underline"
                            >
                              Ver
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Sin productos de carta directamente vinculados.
                  </p>
                )}
              </div>

              {/* 2. PROMOCIONES & HAPPY HOUR */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    Promociones & Tarifas
                  </span>
                  {evento.happyHourVinculado && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      ⚡ HAPPY HOUR ACTIVO
                    </span>
                  )}
                </div>
                {evento.promocionesVinculadas && evento.promocionesVinculadas.length > 0 ? (
                  <div className="space-y-1.5">
                    {evento.promocionesVinculadas.map((promo, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800 text-xs hover:border-emerald-500/50 transition-colors"
                      >
                        <span className="text-stone-200 font-medium truncate">
                          {promo.nombre}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {promo.descuento && (
                            <span className="text-emerald-400 font-mono font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 text-[10px]">
                              {promo.descuento}
                            </span>
                          )}
                          {onOpenPromotion && (
                            <button
                              onClick={() => onOpenPromotion(promo.id)}
                              className="text-[10px] font-mono text-stone-400 hover:text-emerald-300 underline"
                            >
                              Abrir
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    {evento.happyHourVinculado 
                      ? 'Tarifa Happy Hour vinculada al evento.' 
                      : 'Tarifas regulares de carta vigentes.'}
                  </p>
                )}
              </div>

              {/* 3. PROCEDIMIENTOS ESPECIALES */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400 font-bold flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4" />
                    Procedimientos y SOPs Vinculados ({evento.procedimientosEspeciales?.length || 0})
                  </span>
                </div>
                {evento.procedimientosEspeciales && evento.procedimientosEspeciales.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {evento.procedimientosEspeciales.map((proc, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs hover:border-sky-500/50 transition-colors"
                      >
                        <div className="space-y-0.5 truncate mr-2">
                          <span className="text-[10px] font-mono text-sky-400 font-bold block">
                            {proc.codigo || 'SOP OPERATIVO'}
                          </span>
                          <span className="text-stone-200 font-medium truncate block">
                            {proc.titulo}
                          </span>
                        </div>
                        {onOpenProcedure && (
                          <button
                            onClick={() => onOpenProcedure(proc.id)}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-sky-500 hover:text-stone-950 text-stone-300 font-mono text-[10px] transition-colors shrink-0"
                          >
                            Ver SOP →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Protocolo estándar ordinario sin SOPs excepcionales.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ADJUNTOS OPERATIVOS (FOTOGRAFÍAS, PDFS, INSTRUCCIONES) */}
          <div className="space-y-3 border-t border-stone-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-300 font-semibold flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-purple-400" />
                  Adjuntos Operativos ({evento.adjuntos?.length || 0})
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">
                  Fotografías, PDFs oficiales e instrucciones de servicio
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAttachment(!showAddAttachment)}
                className="px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-300 border border-purple-800/80 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adjuntar</span>
              </button>
            </div>

            {/* FORMULARIO PARA AÑADIR ADJUNTO */}
            {showAddAttachment && (
              <form onSubmit={handleCreateAttachment} className="p-4 rounded-2xl bg-stone-950 border border-purple-800/60 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                  <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                    Añadir Nuevo Adjunto al Evento
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowAddAttachment(false)}
                    className="text-stone-500 hover:text-stone-300 text-xs"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">
                      Nombre del archivo / documento *
                    </label>
                    <input 
                      type="text" 
                      value={attachName}
                      onChange={(e) => setAttachName(e.target.value)}
                      placeholder="Ej: Checklist_Montaje_Terraza.pdf"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">
                      Tipo de documento *
                    </label>
                    <select
                      value={attachType}
                      onChange={(e) => setAttachType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="foto">Fotografía (.png / .jpg)</option>
                      <option value="pdf">Documento PDF (.pdf)</option>
                      <option value="instruccion">Instrucciones Operativas (.txt / manual)</option>
                    </select>
                  </div>
                </div>

                {attachType === 'instruccion' ? (
                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">
                      Texto de la instrucción operativa
                    </label>
                    <textarea
                      value={attachText}
                      onChange={(e) => setAttachText(e.target.value)}
                      placeholder="Escribe aquí las pautas operativas específicas para el equipo..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-mono text-stone-400 block mb-1">
                      Enlace URL / Ubicación del archivo
                    </label>
                    <input 
                      type="text" 
                      value={attachUrl}
                      onChange={(e) => setAttachUrl(e.target.value)}
                      placeholder="https://... o ruta del archivo"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors"
                  >
                    Guardar Adjunto
                  </button>
                </div>
              </form>
            )}

            {/* LISTADO DE ADJUNTOS EXISTENTES */}
            {evento.adjuntos && evento.adjuntos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {evento.adjuntos.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between gap-3 group hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center shrink-0">
                        {att.type === 'foto' ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : att.type === 'pdf' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <FileCode className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-stone-200 truncate group-hover:text-purple-300 transition-colors">
                          {att.name}
                        </p>
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {att.type.toUpperCase()} {att.size ? `· ${att.size}` : ''} {att.uploadedAt ? `· ${att.uploadedAt}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {att.url && att.url !== '#' && (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                          title="Abrir o ver adjunto"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {onRemoveAttachment && (
                        <button
                          type="button"
                          onClick={() => onRemoveAttachment(evento.id, att.id)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Eliminar adjunto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-850 text-center">
                <p className="text-xs text-stone-500 font-mono">
                  No hay archivos adjuntos todavía para este evento.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* PIE DE MODAL (CAMBIO DE ESTADO + ACCIONES) */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Selector rápido de Estado */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-stone-500 shrink-0">
              Estado:
            </span>
            <div className="flex items-center gap-1.5">
              {(['Programado', 'Activo', 'Finalizado', 'Cancelado'] as EventStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus && onUpdateStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    evento.estado === st
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono font-bold transition-colors w-full sm:w-auto text-center"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
