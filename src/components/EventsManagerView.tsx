/**
 * FASE 8 & REDISEÑO OPERATIVO – MÓDULO DE EVENTOS Y CALENDARIO
 * Klayman Hospitality Management (Diamond & Olivina)
 * 
 * Principios UX:
 * - Menos elementos visibles, máxima velocidad de lectura en móvil (< 3 segundos)
 * - Navegación superior simplificada: [HOY] · [MAÑANA] · [PRÓXIMAMENTE]
 * - Eliminadas estadísticas saturadas, KPIs visibles y prioridades ruidosas
 * - Destacado de Evento de Hoy
 * - Happy Hour Oficial Estricta: 15:00 - 16:00 (2 Cervezas 6 €, 2 Cócteles 12 €)
 * - Promociones especiales separadas de Happy Hour
 * - Alertas automáticas de antelación (60 min, 30 min, 15 min)
 * - Función Universal de Compartir (WhatsApp, PDF, Email)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Sparkles, 
  BellRing, 
  Wine, 
  Tag, 
  Share2,
  ChevronRight,
  Flame,
  CheckCircle2,
  RotateCcw,
  Search,
  ExternalLink
} from 'lucide-react';
import { 
  EventoEntity, 
  EventStatus, 
  EventAttachment 
} from '../types/events';
import { 
  getStoredEvents, 
  addStoredEvent, 
  updateStoredEvent, 
  deleteStoredEvent, 
  resetStoredEventsToDefault 
} from '../data/eventsMaster';
import { EventDetailModal } from './EventDetailModal';
import { CreateEventModal } from './CreateEventModal';
import { UniversalShareModal, UniversalSharePayload } from './UniversalShareModal';

export type EventSimpleTab = 'hoy' | 'manana' | 'proximamente';

interface EventsManagerViewProps {
  onOpenProductDetail?: (productId: string, nameFallback?: string) => void;
  onOpenTechnicalSheet?: (sheetId: string) => void;
  onOpenPromotion?: (promoId: string) => void;
  onOpenProcedure?: (procId: string) => void;
  onBack?: () => void;
}

export const EventsManagerView: React.FC<EventsManagerViewProps> = ({
  onOpenProductDetail,
  onOpenTechnicalSheet,
  onOpenPromotion,
  onOpenProcedure,
  onBack
}) => {
  // Lista de eventos en estado
  const [events, setEvents] = useState<EventoEntity[]>(() => getStoredEvents());

  // Reloj reactivo (actualiza cada 30 segundos)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Nueva navegación simplificada: HOY | MAÑANA | PRÓXIMAMENTE
  const [activeTab, setActiveTab] = useState<EventSimpleTab>('hoy');

  // Búsqueda rápida opcional
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventoEntity | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Escuchar eventos de actualización
  useEffect(() => {
    const handleEventsUpdated = () => {
      setEvents(getStoredEvents());
    };
    window.addEventListener('klayman_events_updated', handleEventsUpdated);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => {
      window.removeEventListener('klayman_events_updated', handleEventsUpdated);
      clearInterval(timer);
    };
  }, []);

  // Fechas de referencia
  const todayStr = useMemo(() => {
    return currentTime.toISOString().split('T')[0];
  }, [currentTime]);

  const tomorrowStr = useMemo(() => {
    const tom = new Date(currentTime);
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().split('T')[0];
  }, [currentTime]);

  // Eventos oficiales filtrados (excluyendo formaciones o auditorías internas que tienen su propio módulo)
  const officialEvents = useMemo(() => {
    return events.filter(e => {
      // Excluir formaciones o APPCC si existieran
      if (e.tipo === 'formacion') return false;
      return true;
    });
  }, [events]);

  // Cálculo de eventos por pestaña
  const eventsByTab = useMemo(() => {
    const hoyList = officialEvents.filter(e => {
      // Coincide con hoy o está en curso hoy
      return e.fechaInicio <= todayStr && e.fechaFin >= todayStr;
    });

    const mananaList = officialEvents.filter(e => {
      return e.fechaInicio === tomorrowStr;
    });

    const proximosList = officialEvents.filter(e => {
      return e.fechaInicio > tomorrowStr;
    });

    return {
      hoy: hoyList,
      manana: mananaList,
      proximamente: proximosList
    };
  }, [officialEvents, todayStr, tomorrowStr]);

  // Eventos mostrados según la pestaña activa y búsqueda
  const displayedEvents = useMemo(() => {
    const list = eventsByTab[activeTab];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(e => 
      e.titulo.toLowerCase().includes(q) ||
      e.descripcion.toLowerCase().includes(q) ||
      e.centroVenta.toLowerCase().includes(q)
    );
  }, [eventsByTab, activeTab, searchQuery]);

  // Evento destacado de hoy (primer evento de hoy que sea show/animación/música o especial)
  const eventoDestacadoHoy = useMemo(() => {
    if (eventsByTab.hoy.length === 0) return null;
    return eventsByTab.hoy.find(e => e.tipo === 'musica' || e.tipo === 'animacion') || eventsByTab.hoy[0];
  }, [eventsByTab.hoy]);

  // Estado dinámico del Happy Hour (15:00 a 16:00 h)
  const happyHourStatus = useMemo(() => {
    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const currentDec = currentHour + currentMin / 60;

    if (currentDec >= 15 && currentDec < 16) {
      const minutesLeft = 60 - currentMin;
      return {
        estado: 'activa' as const,
        label: '🟢 ACTIVA AHORA',
        badgeClass: 'bg-emerald-500 text-stone-950 font-bold animate-pulse',
        subtext: `Finaliza a las 16:00 h (quedan ${minutesLeft} min)`
      };
    } else if (currentDec < 15) {
      const minToStart = Math.round((15 - currentDec) * 60);
      return {
        estado: 'proxima' as const,
        label: '🕒 PRÓXIMA',
        badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        subtext: minToStart <= 60 
          ? `Comienza en ${minToStart} minutos (a las 15:00 h)` 
          : 'Hoy de 15:00 a 16:00 h'
      };
    } else {
      return {
        estado: 'finalizada' as const,
        label: 'FINALIZADA',
        badgeClass: 'bg-stone-800 text-stone-400',
        subtext: 'Finalizada por hoy. Vuelve mañana a las 15:00 h'
      };
    }
  }, [currentTime]);

  // Avisos y Recordatorios automáticos en tiempo real
  const automaticNotifications = useMemo(() => {
    const notifs: { id: string; type: 'urgent' | 'info'; title: string; text: string; timeBadge: string }[] = [];

    // 1. Aviso de Happy Hour si está activa o a punto de empezar (<60m)
    const currentHour = currentTime.getHours();
    const currentMin = currentTime.getMinutes();
    const currentDec = currentHour + currentMin / 60;

    if (currentDec >= 15 && currentDec < 16) {
      notifs.push({
        id: 'hh-active',
        type: 'urgent',
        title: 'Happy Hour Activa en Terraza',
        text: '15:00 – 16:00 h · 🍺 2 Cervezas = 6 € | 🍹 2 Cócteles = 12 €',
        timeBadge: 'EN VIVO'
      });
    } else if (currentDec >= 14 && currentDec < 15) {
      const minLeft = Math.round((15 - currentDec) * 60);
      if (minLeft <= 60) {
        notifs.push({
          id: 'hh-soon',
          type: 'info',
          title: `Happy Hour comienza en ${minLeft} min`,
          text: 'Preparar mise en place de cañas y licores para el servicio de 15:00 h',
          timeBadge: `En ${minLeft}m`
        });
      }
    }

    // 2. Avisos de eventos programados hoy
    eventsByTab.hoy.forEach(ev => {
      if (!ev.horaInicio) return;
      const [h, m] = ev.horaInicio.split(':').map(Number);
      const evDec = h + (m || 0) / 60;
      const diffMin = Math.round((evDec - currentDec) * 60);

      if (diffMin > 0 && diffMin <= 60) {
        notifs.push({
          id: `ev-${ev.id}-soon`,
          type: diffMin <= 15 ? 'urgent' : 'info',
          title: `Recordatorio: ${ev.titulo}`,
          text: `Comienza en ${diffMin} minutos en ${ev.centroVenta || 'Bar Terraza'}.`,
          timeBadge: `En ${diffMin}m`
        });
      }
    });

    return notifs;
  }, [currentTime, eventsByTab.hoy]);

  // Manejador para reiniciar a catálogo oficial si se necesita
  const handleReset = () => {
    if (window.confirm('¿Restablecer el calendario a los eventos oficiales?')) {
      const def = resetStoredEventsToDefault();
      setEvents(def);
    }
  };

  // Payload para compartir agenda
  const sharePayload: UniversalSharePayload = {
    title: `Agenda de Eventos · ${activeTab.toUpperCase()}`,
    moduleName: 'Eventos y Agenda F&B',
    hotelName: 'Klayman Diamond Aparthotel ★★★★',
    areaName: 'Bar / Terraza Diamond',
    date: currentTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    summaryText: `Agenda operativa para ${activeTab === 'hoy' ? 'HOY' : activeTab === 'manana' ? 'MAÑANA' : 'PRÓXIMAMENTE'}.\nHappy Hour: 15:00 a 16:00 h (2 Cervezas 6 € / 2 Cócteles 12 €).\nEventos programados: ${displayedEvents.length} eventos.\n${displayedEvents.map(e => `• ${e.titulo} (${e.horaInicio || 'Todo el día'}) - ${e.centroVenta}`).join('\n')}`,
    details: [
      { label: 'Pestaña', value: activeTab.toUpperCase() },
      { label: 'Eventos', value: `${displayedEvents.length} programados` },
      { label: 'Happy Hour', value: '15:00-16:00 h' },
      { label: 'Hotel', value: 'Klayman Diamond' }
    ]
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn pb-16">
      {/* CABECERA MINIMALISTA Y ELEGANTE (< 10% ESPACIO) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/30 border border-stone-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              AGENDA OPERATIVA
            </span>
            <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} h
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-stone-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400 shrink-0" />
            <span>EVENTOS Y CALENDARIO</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Compartir agenda por WhatsApp o PDF"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Compartir</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Evento</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 transition-colors"
            >
              ← Menú Bar
            </button>
          )}
        </div>
      </div>

      {/* AVISOS AUTOMÁTICOS (NOTIFICACIONES EN VIVO) */}
      {automaticNotifications.length > 0 && (
        <div className="space-y-2">
          {automaticNotifications.map(notif => (
            <div 
              key={notif.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-md animate-fadeIn ${
                notif.type === 'urgent'
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-200'
                  : 'bg-stone-900/90 border-stone-800 text-stone-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'urgent' ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-sky-400'
                }`}>
                  <BellRing className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-bold">{notif.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                      {notif.timeBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 font-sans mt-0.5">{notif.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BLOQUE ESTRICTO: HAPPY HOUR DIARIO (15:00 - 16:00 H) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/50 via-stone-900 to-stone-900 border border-amber-500/40 shadow-lg space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                OFERTA ESTANDARIZADA OFICIAL
              </span>
              <h2 className="text-sm sm:text-base font-display font-bold text-stone-100">
                HAPPY HOUR SUNSET · 15:00 a 16:00 h
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-xl font-bold uppercase ${happyHourStatus.badgeClass}`}>
              {happyHourStatus.label}
            </span>
          </div>
        </div>

        {/* PRECIOS OFICIALES ESTRICTOS (SIN PRECIOS GENÉRICOS) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍺</span>
              <div>
                <span className="text-xs font-display font-bold text-stone-200 block">2 Cervezas</span>
                <span className="text-[10px] font-mono text-stone-500">Caña Dorada Especial</span>
              </div>
            </div>
            <span className="text-sm font-display font-bold text-amber-400 font-mono">6,00 €</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍹</span>
              <div>
                <span className="text-xs font-display font-bold text-stone-200 block">2 Cócteles</span>
                <span className="text-[10px] font-mono text-stone-500">Carta Oficial Diamond</span>
              </div>
            </div>
            <span className="text-sm font-display font-bold text-amber-400 font-mono">12,00 €</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-850 pt-2">
          <span>{happyHourStatus.subtext}</span>
          <span className="text-stone-500">Terraza Diamond</span>
        </div>
      </div>

      {/* TARJETA DESTACADA: EVENTO DE HOY (SI EXISTE) */}
      {activeTab === 'hoy' && eventoDestacadoHoy && (
        <div 
          onClick={() => setSelectedEventForModal(eventoDestacadoHoy)}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-stone-900 to-stone-900 border border-purple-500/40 hover:border-purple-400 cursor-pointer transition-all shadow-lg space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                🔔 EVENTO DESTACADO DE HOY
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-400 group-hover:underline flex items-center gap-1 font-bold">
              <span>Ver detalle</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-display font-bold text-stone-100 group-hover:text-purple-300 transition-colors">
                {eventoDestacadoHoy.titulo}
              </h2>
              <p className="text-xs text-stone-300 font-sans mt-0.5 line-clamp-2">
                {eventoDestacadoHoy.descripcion}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-850 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>{eventoDestacadoHoy.horaInicio || '15:00'} – {eventoDestacadoHoy.horaFin || '22:00'} h</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{eventoDestacadoHoy.centroVenta || 'Bar Terraza'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-400 hidden sm:flex">
              <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="truncate">{eventoDestacadoHoy.responsable || 'Personal de Turno'}</span>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN PRINCIPAL: [HOY] · [MAÑANA] · [PRÓXIMAMENTE] */}
      <div className="space-y-3">
        <div className="p-1 bg-stone-900 rounded-2xl border border-stone-800 grid grid-cols-3 gap-1 shadow-md select-none">
          <button
            onClick={() => setActiveTab('hoy')}
            className={`py-2.5 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'hoy'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
            }`}
          >
            <span className="text-xs font-display font-bold uppercase tracking-wider">
              HOY
            </span>
            <span className="text-[10px] font-mono opacity-80">
              ({eventsByTab.hoy.length} eventos)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manana')}
            className={`py-2.5 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'manana'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
            }`}
          >
            <span className="text-xs font-display font-bold uppercase tracking-wider">
              MAÑANA
            </span>
            <span className="text-[10px] font-mono opacity-80">
              ({eventsByTab.manana.length} eventos)
            </span>
          </button>

          <button
            onClick={() => setActiveTab('proximamente')}
            className={`py-2.5 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'proximamente'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
            }`}
          >
            <span className="text-xs font-display font-bold uppercase tracking-wider">
              PRÓXIMAMENTE
            </span>
            <span className="text-[10px] font-mono opacity-80">
              ({eventsByTab.proximamente.length} en agenda)
            </span>
          </button>
        </div>

        {/* BUSCADOR RÁPIDO DISCRETO */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar evento en ${activeTab.toUpperCase()}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* LISTA LIMPIA DE EVENTOS DE LA PESTAÑA */}
      <div className="space-y-3">
        {displayedEvents.length > 0 ? (
          displayedEvents.map(ev => (
            <div
              key={ev.id}
              onClick={() => setSelectedEventForModal(ev)}
              className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-all space-y-2 group shadow-sm active:scale-99"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                      {ev.fechaInicio === todayStr ? 'HOY' : ev.fechaInicio === tomorrowStr ? 'MAÑANA' : ev.fechaInicio}
                    </span>
                    {ev.horaInicio && (
                      <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.horaInicio} {ev.horaFin ? `– ${ev.horaFin}` : ''} h
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-stone-400">
                      📍 {ev.centroVenta || 'Bar Terraza'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-stone-100 group-hover:text-amber-300 transition-colors">
                    {ev.titulo}
                  </h3>
                  <p className="text-xs text-stone-400 font-sans mt-0.5 line-clamp-2">
                    {ev.descripcion}
                  </p>
                </div>

                <div className="shrink-0 p-2 rounded-xl bg-stone-800 text-stone-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* VINCULACIONES OPERATIVAS DIRECTAS */}
              {(ev.linkedPromotionId || ev.linkedSheetId) && (
                <div className="pt-2 border-t border-stone-850 flex items-center gap-2 text-[11px] font-mono">
                  {ev.linkedPromotionId && onOpenPromotion && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPromotion(ev.linkedPromotionId!);
                      }}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-stone-950 transition-colors flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Ver Promo Asociada</span>
                    </button>
                  )}
                  {ev.linkedSheetId && onOpenTechnicalSheet && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTechnicalSheet(ev.linkedSheetId!);
                      }}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-stone-950 transition-colors flex items-center gap-1"
                    >
                      <Wine className="w-3 h-3" />
                      <span>Ver Ficha Técnica</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 rounded-3xl bg-stone-900/50 border border-stone-850 text-center space-y-2">
            <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
            <h3 className="font-display font-bold text-sm text-stone-300">
              No hay eventos programados para {activeTab === 'hoy' ? 'hoy' : activeTab === 'manana' ? 'mañana' : 'las próximas fechas'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans">
              La operativa de Bar y Terraza se rige por la carta estándar y el Happy Hour oficial de 15:00 a 16:00 h.
            </p>
          </div>
        )}
      </div>

      {/* PROMOCIONES ESPECIALES (SEPARADAS DE HAPPY HOUR) */}
      <div className="p-4 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-display font-bold text-stone-200 uppercase tracking-wider">
              PROMOCIONES ESPECIALES ACTIVAS (SEPARADAS DE HAPPY HOUR)
            </h3>
          </div>
          {onOpenPromotion && (
            <button
              onClick={() => onOpenPromotion('all')}
              className="text-[11px] font-mono text-amber-400 hover:underline"
            >
              Ver todas →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-stone-200 block">Miércoles Spritz</span>
              <span className="text-[10px] font-mono text-stone-500">Todos los miércoles de 18:00 a 21:00 h</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
              Aperol 5,00 €
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-stone-200 block">Mojito Sunset</span>
              <span className="text-[10px] font-mono text-stone-500">Viernes y Sábados al atardecer</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">
              Mojito 5,00 €
            </span>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-500">
        <button
          onClick={handleReset}
          className="hover:text-amber-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restaurar eventos oficiales</span>
        </button>
        <span>Klayman Operations Hub</span>
      </div>

      {/* MODAL DE DETALLE DE EVENTO */}
      {selectedEventForModal && (
        <EventDetailModal
          event={selectedEventForModal}
          isOpen={true}
          onClose={() => setSelectedEventForModal(null)}
          onUpdateStatus={(newStatus) => {
            const updated = { ...selectedEventForModal, estado: newStatus };
            const res = updateStoredEvent(updated);
            setEvents(res);
            setSelectedEventForModal(updated);
          }}
          onDeleteEvent={(id) => {
            const res = deleteStoredEvent(id);
            setEvents(res);
            setSelectedEventForModal(null);
          }}
          onOpenProductDetail={onOpenProductDetail}
          onOpenTechnicalSheet={onOpenTechnicalSheet}
          onOpenPromotion={onOpenPromotion}
          onOpenProcedure={onOpenProcedure}
        />
      )}

      {/* MODAL CREAR NUEVO EVENTO */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={(newEvent) => {
            const res = addStoredEvent(newEvent);
            setEvents(res);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* MODAL UNIVERSAL DE COMPARTIR */}
      <UniversalShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        payload={sharePayload}
      />
    </div>
  );
};
