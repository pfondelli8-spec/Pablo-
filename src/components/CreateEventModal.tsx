/**
 * FASE 8 – MODAL DE CREACIÓN DE NUEVO EVENTO
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
  Wine, 
  Tag, 
  FileCheck2, 
  Paperclip, 
  Sparkles,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { 
  EventoEntity, 
  EventStatus, 
  EventPriority, 
  EventType, 
  EventAttachment, 
  EventProductLink,
  EventPromotionLink,
  EventProcedureLink
} from '../types/events';
import { AGORA_MASTER_PRODUCTS } from '../data/agoraPricesMaster';
import { PROMOTIONS_DATABASE } from '../data/promotionsMaster';
import { BAR_OFFICIAL_PROCEDURES } from '../data/barProceduresData';

interface CreateEventModalProps {
  onClose: () => void;
  onSave: (newEvent: EventoEntity) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onSave
}) => {
  // Campos del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('16:00');
  const [horaFin, setHoraFin] = useState('18:00');
  const [hotel, setHotel] = useState<'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos'>('Klayman Diamond');
  const [centroVenta, setCentroVenta] = useState('Bar / Terraza Diamond');
  const [responsable, setResponsable] = useState('');
  const [estado, setEstado] = useState<EventStatus>('Programado');
  const [prioridad, setPrioridad] = useState<EventPriority>('Media');
  const [tipo, setTipo] = useState<EventType>('Operativo');
  const [imagen, setImagen] = useState('');
  const [observacionesOperativas, setObservacionesOperativas] = useState('');
  const [happyHourVinculado, setHappyHourVinculado] = useState(false);

  // Vinculaciones seleccionadas
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedPromoIds, setSelectedPromoIds] = useState<string[]>([]);
  const [selectedProcIds, setSelectedProcIds] = useState<string[]>([]);

  // Adjunto inicial opcional
  const [attName, setAttName] = useState('');
  const [attType, setAttType] = useState<'foto' | 'pdf' | 'instruccion'>('foto');
  const [attUrl, setAttUrl] = useState('');

  // Imágenes predeterminadas temáticas para agilizar
  const PRESET_IMAGES = [
    { label: 'Coctelería', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Terraza Sunset', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Quesos y Vinos', url: 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cafetería & Barista', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Reunión Operativa', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Control APPCC', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80' }
  ];

  const handleHotelChange = (newHotel: 'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos') => {
    setHotel(newHotel);
    if (newHotel === 'Klayman Diamond') {
      setCentroVenta('Bar / Terraza Diamond');
    } else if (newHotel === 'Klayman Olivina') {
      setCentroVenta('Sol Bar Olivina');
    } else {
      setCentroVenta('Bar Diamond / Sol Bar Olivina');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !responsable.trim()) return;

    // Hotel ID
    const hotelId = hotel === 'Klayman Diamond' ? 'klayman-diamond' : hotel === 'Klayman Olivina' ? 'klayman-olivina' : 'todos';
    const outletId = hotelId === 'klayman-diamond' ? 'diamond-bar-terraza' : hotelId === 'klayman-olivina' ? 'olivina-bar-sol' : 'diamond-bar-terraza';

    // Productos vinculados
    const productosVinculados: EventProductLink[] = selectedProductIds.map(id => {
      const p = AGORA_MASTER_PRODUCTS.find(prod => prod.id === id);
      const pr = p?.precioDiamond !== null && p?.precioDiamond !== undefined ? p.precioDiamond : (p?.precioOlivina ?? undefined);
      return {
        id,
        nombre: p?.name || id,
        precio: pr,
        categoria: p?.category
      };
    });

    // Promociones vinculadas
    const promocionesVinculadas: EventPromotionLink[] = selectedPromoIds.map(id => {
      const promo = PROMOTIONS_DATABASE.find(pr => pr.id === id);
      return {
        id,
        nombre: promo?.nombre || id,
        descuento: promo?.precioPromocionalTexto
      };
    });

    // Procedimientos vinculados
    const procedimientosEspeciales: EventProcedureLink[] = selectedProcIds.map(id => {
      const proc = BAR_OFFICIAL_PROCEDURES.find(pr => pr.id === id);
      return {
        id,
        titulo: proc?.title || id,
        codigo: proc?.code
      };
    });

    // Adjuntos
    const adjuntos: EventAttachment[] = [];
    if (attName.trim()) {
      adjuntos.push({
        id: `att-${Date.now()}`,
        name: attName.trim(),
        type: attType,
        url: attUrl.trim() || '#',
        size: '1.2 MB',
        uploadedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }

    const newEvento: EventoEntity = {
      id: `evt-${Date.now()}`,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha,
      horaInicio,
      horaFin,
      hotel,
      hotelId,
      centroVenta,
      outletId,
      responsable: responsable.trim(),
      estado,
      prioridad,
      tipo,
      imagen: imagen.trim() || undefined,
      observacionesOperativas: observacionesOperativas.trim() || undefined,
      productosVinculados: productosVinculados.length > 0 ? productosVinculados : undefined,
      promocionesVinculadas: promocionesVinculadas.length > 0 ? promocionesVinculadas : undefined,
      happyHourVinculado,
      procedimientosEspeciales: procedimientosEspeciales.length > 0 ? procedimientosEspeciales : undefined,
      adjuntos: adjuntos.length > 0 ? adjuntos : undefined
    };

    onSave(newEvento);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* CABECERA */}
        <div className="p-4 sm:p-6 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              FASE 8 · Calendario Operativo
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100">
              Crear Nuevo Evento Operativo
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* 1. DATOS PRINCIPALES */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
              1. Información General
            </h3>

            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                Título del Evento *
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Masterclass de Coctelería con Jigger / Sunset Live"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                Descripción Detallada *
              </label>
              <textarea
                required
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Explica el objetivo, mecánica y alcance de este evento..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Tipo de Evento *
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as EventType)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Operativo">Operativo</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Formación">Formación</option>
                  <option value="Animación">Animación</option>
                  <option value="Dirección">Dirección</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Prioridad *
                </label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as EventPriority)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Estado Inicial *
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value as EventStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Programado">Programado</option>
                  <option value="Activo">Activo</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. CALENDARIO, HORAS Y UBICACIÓN */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
              2. Calendario, Horario y Centro
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Fecha (AAAA-MM-DD) *
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  required
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Hora Fin *
                </label>
                <input
                  type="time"
                  required
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Hotel *
                </label>
                <select
                  value={hotel}
                  onChange={(e) => handleHotelChange(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Klayman Diamond">Klayman Diamond</option>
                  <option value="Klayman Olivina">Klayman Olivina</option>
                  <option value="Ambos Establecimientos">Ambos Establecimientos</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Centro de Venta / Espacio *
                </label>
                <input
                  type="text"
                  required
                  value={centroVenta}
                  onChange={(e) => setCentroVenta(e.target.value)}
                  placeholder="Ej: Bar / Terraza Diamond"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Responsable Operativo *
                </label>
                <input
                  type="text"
                  required
                  value={responsable}
                  onChange={(e) => setResponsable(e.target.value)}
                  placeholder="Ej: Eugenia (F&B) / Jefe de Sala"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 3. IMAGEN Y OBSERVACIONES */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
              3. Imagen y Observaciones Operativas
            </h3>

            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                URL de la Imagen (o selecciona una plantilla rápida)
              </label>
              <input
                type="text"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500 mb-2"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-stone-500">Plantillas:</span>
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagen(preset.url)}
                    className="px-2 py-0.5 rounded bg-stone-800 hover:bg-amber-500/20 text-stone-300 hover:text-amber-400 text-[10px] font-mono border border-stone-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                Observaciones Operativas para el Equipo
              </label>
              <textarea
                rows={2}
                value={observacionesOperativas}
                onChange={(e) => setObservacionesOperativas(e.target.value)}
                placeholder="Puntos de refuerzo, montaje especial de mesas, precauciones de cristalería..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4. VINCULACIONES (PRODUCTOS, PROMOCIONES, HAPPY HOUR, SOPS) */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
              4. Vinculaciones con Productos, Promociones y SOPs
            </h3>

            {/* Happy Hour Check */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-amber-300 font-bold block">
                  ⚡ Vincular Tarifa Happy Hour
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  Aplica tarifa especial de Happy Hour durante el horario del evento
                </span>
              </div>
              <input
                type="checkbox"
                checked={happyHourVinculado}
                onChange={(e) => setHappyHourVinculado(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Selector de Promociones */}
            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                Vincular Promociones Existentes
              </label>
              <select
                multiple
                value={selectedPromoIds}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => (o as HTMLOptionElement).value);
                  setSelectedPromoIds(opts);
                }}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500 h-24"
              >
                {PROMOTIONS_DATABASE.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.precioPromocionalTexto}) - {p.hotel}
                  </option>
                ))}
              </select>
              <span className="text-[10px] font-mono text-stone-500">
                Mantén pulsado Ctrl / Cmd para seleccionar varias promociones
              </span>
            </div>

            {/* Selector de Procedimientos Especiales */}
            <div>
              <label className="text-xs font-mono text-stone-300 block mb-1">
                Vincular Procedimientos Operativos (SOPs)
              </label>
              <select
                multiple
                value={selectedProcIds}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions).map(o => (o as HTMLOptionElement).value);
                  setSelectedProcIds(opts);
                }}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500 h-24"
              >
                {BAR_OFFICIAL_PROCEDURES.map(pr => (
                  <option key={pr.id} value={pr.id}>
                    [{pr.code}] {pr.title}
                  </option>
                ))}
              </select>
              <span className="text-[10px] font-mono text-stone-500">
                Mantén pulsado Ctrl / Cmd para seleccionar varios SOPs
              </span>
            </div>
          </div>

          {/* 5. ADJUNTO INICIAL */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold border-b border-stone-800 pb-1">
              5. Adjuntar Documentación (Opcional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Nombre del Documento
                </label>
                <input
                  type="text"
                  value={attName}
                  onChange={(e) => setAttName(e.target.value)}
                  placeholder="Ej: Guia_Montaje.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={attType}
                  onChange={(e) => setAttType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="foto">Fotografía</option>
                  <option value="pdf">Documento PDF</option>
                  <option value="instruccion">Instrucciones Operativas</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-300 block mb-1">
                  Enlace URL / Ubicación
                </label>
                <input
                  type="text"
                  value={attUrl}
                  onChange={(e) => setAttUrl(e.target.value)}
                  placeholder="https://... o ruta"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-mono font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
            >
              Guardar y Publicar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
