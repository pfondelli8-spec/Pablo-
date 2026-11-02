/**
 * FASE 10 – DIRECCIÓN F&B / DASHBOARD OPERATIVO DEL MAÎTRE GENERAL
 * Klayman Hospitality Management (Diamond & Olivina)
 * 
 * Concentra toda la información crítica de la operación en una sola pantalla:
 * 1. OPERACIÓN DEL DÍA: Último cierre recibido, Cierre pendiente, Ticket recibido, Ticket pendiente
 * 2. INCIDENCIAS: Incidencias abiertas, Faltantes pendientes, Incidencias urgentes
 * 3. PROMOCIONES: Happy Hour activa, Próxima Happy Hour, Promoción activa
 * 4. EVENTOS: Eventos de hoy, Próximos eventos, Eventos críticos
 * 5. FORMACIÓN: Productos sin ficha, Productos sin foto, Productos pendientes de documentación
 * 6. ALERTAS: Faltante urgente (🔴), Evento en <60 min (🟠), Happy Hour próxima (🟡), Caja recibida (🟢)
 * 7. COMUNICACIONES: Últimas incidencias recibidas, Últimos faltantes reportados, Últimos cierres enviados
 * 8. ACCESOS RÁPIDOS: Caja, Eventos, Promociones, Incidencias, Faltantes
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Clock, 
  Calendar, 
  Receipt, 
  AlertTriangle, 
  PackageX, 
  Tag, 
  Flame, 
  FileText, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Eye, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Wine, 
  ShieldAlert, 
  BellRing, 
  ArrowRight, 
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Banknote,
  Search,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  ClipboardCheck,
  HelpCircle
} from 'lucide-react';
import { 
  getStoredEvents, 
  getEventosHoy, 
  getEventosProximos, 
  evaluarAlertaEvento, 
  calcularEstadoEvento 
} from '../data/eventsMaster';
import { 
  PROMOTIONS_DATABASE, 
  getHappyHourLiveStatus, 
  getPromocionesActivas, 
  getProximaPromocion 
} from '../data/promotionsMaster';
import { 
  getStoredIncidencias, 
  addStoredIncidencia, 
  updateStoredIncidencia, 
  resolveStoredIncidencia, 
  getIncidenciasAbiertas, 
  getFaltantesPendientes, 
  getIncidenciasUrgentes, 
  getIncidenciasStats 
} from '../data/incidenciasFaltantesMaster';
import { INITIAL_CASH_CLOSINGS } from '../data/hotelOperationsData';
import { CashRegisterClosing } from '../types/hotelPortal';
import { IncidenciaEntity, EstadoIncidencia, TipoIncidencia } from '../types/incidencias';
import { AGORA_MASTER_PRODUCTS, AGORA_PRICES_LOOKUP } from '../data/agoraPricesMaster';
import { TECHNICAL_SHEETS_DATABASE } from '../data/hotelPortalData';
import { DEFAULT_ITEM_PHOTOS } from '../services/customPhotos';
import { CreateIncidenciaModal } from './CreateIncidenciaModal';
import { IncidenciaDetailModal } from './IncidenciaDetailModal';

const CASH_STORAGE_KEY = 'klayman_cash_closings_data';

interface DireccionFBViewProps {
  onNavigateToTab?: (tab: 'control_operativo' | 'cartas' | 'fichas' | 'promociones' | 'eventos' | 'procedimientos' | 'puesto' | 'cierre_caja') => void;
  onOpenProductDetail?: (productId: string, nameFallback?: string) => void;
  onOpenTechnicalSheet?: (sheetId: string) => void;
  onBackToMenu?: () => void;
}

export const DireccionFBView: React.FC<DireccionFBViewProps> = ({
  onNavigateToTab,
  onOpenProductDetail,
  onOpenTechnicalSheet,
  onBackToMenu
}) => {
  // Reloj reactivo en vivo
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Estado de cierres de caja cargados de localStorage
  const [closings, setClosings] = useState<CashRegisterClosing[]>(() => {
    try {
      const saved = localStorage.getItem(CASH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CASH_CLOSINGS;
  });

  // Estado de incidencias y faltantes
  const [incidencias, setIncidencias] = useState<IncidenciaEntity[]>(() => getStoredIncidencias());

  // Estado de eventos
  const [events, setEvents] = useState(() => getStoredEvents());

  // Modales
  const [showCreateIncidencia, setShowCreateIncidencia] = useState(false);
  const [createInitialType, setCreateInitialType] = useState<TipoIncidencia>('incidencia');
  const [selectedIncidenciaModal, setSelectedIncidenciaModal] = useState<IncidenciaEntity | null>(null);

  // Modal para ver foto de ticket de caja ampliada
  const [ticketModalUrl, setTicketModalUrl] = useState<string | null>(null);

  // Filtro de establecimiento en el dashboard
  const [selectedHotel, setSelectedHotel] = useState<'todos' | 'klayman-diamond' | 'klayman-olivina'>('klayman-diamond');

  // Sincronización y eventos
  useEffect(() => {
    const handleEventsUpdate = () => setEvents(getStoredEvents());
    const handleIncidenciasUpdate = () => setIncidencias(getStoredIncidencias());

    window.addEventListener('klayman_events_updated', handleEventsUpdate);
    window.addEventListener('klayman_incidencias_updated', handleIncidenciasUpdate);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Refrescar cierres
      try {
        const saved = localStorage.getItem(CASH_STORAGE_KEY);
        if (saved) setClosings(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }, 15000);

    return () => {
      window.removeEventListener('klayman_events_updated', handleEventsUpdate);
      window.removeEventListener('klayman_incidencias_updated', handleIncidenciasUpdate);
      clearInterval(timer);
    };
  }, []);

  // 1. CÁLCULOS: OPERACIÓN DEL DÍA (CIERRES & TICKETS)
  const operacionDelDia = useMemo(() => {
    const sorted = [...closings].sort((a, b) => {
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      return dateB.localeCompare(dateA);
    });

    const ultimoCierre = sorted[0] || null;

    // Verificar si hoy tiene cierre registrado
    const todayStr = currentTime.toISOString().split('T')[0];
    const tieneCierreHoy = sorted.some(c => c.date === todayStr);

    // Cierre pendiente: si son más de las 15:00 h y no hay cierre de tarde/noche
    const horaActual = currentTime.getHours();
    const cierrePendiente = !tieneCierreHoy;

    // Ticket recibido / pendiente
    const ultimoTieneTicket = !!(ultimoCierre && ultimoCierre.ticketPhotoUrl);
    const ticketsPendientesCount = sorted.filter(c => !c.ticketPhotoUrl).length;

    return {
      ultimoCierre,
      cierrePendiente,
      ultimoTieneTicket,
      ticketsPendientesCount,
      totalFacturadoUltimo: ultimoCierre?.totalGross || 0,
      totalEfectivoUltimo: ultimoCierre?.totalCash || 0,
      totalTarjetaUltimo: ultimoCierre?.totalCreditCard || 0,
      descuadreUltimo: ultimoCierre?.discrepancy || 0
    };
  }, [closings, currentTime]);

  // 2. CÁLCULOS: INCIDENCIAS & FALTANTES
  const incidenciasStats = useMemo(() => {
    const list = incidencias;
    const abiertas = getIncidenciasAbiertas(list);
    const faltantes = getFaltantesPendientes(list);
    const urgentes = getIncidenciasUrgentes(list);

    return {
      abiertas,
      faltantes,
      urgentes,
      totalAbiertas: abiertas.length,
      totalFaltantes: faltantes.length,
      totalUrgentes: urgentes.length
    };
  }, [incidencias]);

  // 3. CÁLCULOS: PROMOCIONES & HAPPY HOUR
  const promosData = useMemo(() => {
    const targetHotel = selectedHotel === 'klayman-olivina' ? 'klayman-olivina' : 'klayman-diamond';
    const hhStatus = getHappyHourLiveStatus(targetHotel, currentTime);
    const proximaPromo = getProximaPromocion(selectedHotel, 'todos', currentTime);
    const activas = getPromocionesActivas(currentTime);

    return {
      hhStatus,
      proximaPromo,
      promosActivas: activas
    };
  }, [selectedHotel, currentTime]);

  // 4. CÁLCULOS: EVENTOS
  const eventosData = useMemo(() => {
    const hoy = getEventosHoy(events, currentTime);
    const proximos = getEventosProximos(events, currentTime);
    const criticos = events.filter(e => e.prioridad === 'Crítica' && e.estado !== 'Cancelado' && e.estado !== 'Finalizado');

    // Comprobar eventos en menos de 60 minutos
    const alertaEvento60Min = hoy.find(e => {
      const res = evaluarAlertaEvento(e, currentTime);
      return res.timing === 'comienza_en_30_min' || res.timing === 'comienza_en_60_min';
    });

    const eventoActivo = hoy.find(e => {
      const res = evaluarAlertaEvento(e, currentTime);
      return res.timing === 'activo';
    });

    return {
      eventosHoy: hoy,
      proximos,
      criticos,
      alertaEvento60Min,
      eventoActivo
    };
  }, [events, currentTime]);

  // 5. CÁLCULOS: FORMACIÓN & CALIDAD DOCUMENTAL
  const formacionData = useMemo(() => {
    const totalProductos = AGORA_MASTER_PRODUCTS.length;
    let sinFicha = 0;
    let sinFoto = 0;
    let pendientesDoc = 0;

    AGORA_MASTER_PRODUCTS.forEach(p => {
      // Ficha
      const sheet = TECHNICAL_SHEETS_DATABASE.find(s => s.id === p.id || s.code === p.code || s.name.toLowerCase() === p.name.toLowerCase());
      if (!sheet) {
        sinFicha++;
      }
      // Foto
      const photo = p.imageUrl || (sheet?.imageUrl) || DEFAULT_ITEM_PHOTOS[p.id];
      if (!photo) {
        sinFoto++;
      }
      // Estado
      if (p.documentationStatus === 'PENDIENTE DE DOCUMENTAR' || !sheet) {
        pendientesDoc++;
      }
    });

    const completos = totalProductos - pendientesDoc;
    const porcentajeGlobal = Math.round((completos / totalProductos) * 100);

    return {
      totalProductos,
      sinFicha,
      sinFoto,
      pendientesDoc,
      completos,
      porcentajeGlobal
    };
  }, []);

  // 6. ALERTAS OPERATIVAS OBLIGATORIAS
  const alertasVivas = useMemo(() => {
    // 🔴 1. Faltante urgente
    const faltanteUrgente = incidenciasStats.faltantes.find(f => f.gravedad === 'urgente');

    // 🟠 2. Evento en menos de 60 minutos
    const evento60 = eventosData.alertaEvento60Min;

    // 🟡 3. Happy Hour próxima
    const hhProxima = promosData.hhStatus.status === 'proxima' || (promosData.hhStatus.minutosHastaInicio !== null && promosData.hhStatus.minutosHastaInicio <= 45);

    // 🟢 4. Caja recibida correctamente
    const cajaCorrecta = operacionDelDia.ultimoCierre && operacionDelDia.ultimoCierre.verified && operacionDelDia.ultimoCierre.discrepancy === 0;

    return {
      faltanteUrgente,
      evento60,
      hhProxima,
      cajaCorrecta
    };
  }, [incidenciasStats, eventosData, promosData, operacionDelDia]);

  // Manejadores de incidencias
  const handleSaveIncidencia = (newInc: IncidenciaEntity) => {
    const updated = addStoredIncidencia(newInc);
    setIncidencias(updated);
    setShowCreateIncidencia(false);
  };

  const handleUpdateIncidenciaStatus = (id: string, newStatus: EstadoIncidencia, resueltaPor?: string) => {
    let updated: IncidenciaEntity[];
    if (newStatus === 'resuelta') {
      updated = resolveStoredIncidencia(id, resueltaPor || 'Maître General');
    } else {
      const target = incidencias.find(i => i.id === id);
      if (target) {
        updated = updateStoredIncidencia({ ...target, estado: newStatus });
      } else {
        updated = incidencias;
      }
    }
    setIncidencias(updated);
    if (selectedIncidenciaModal && selectedIncidenciaModal.id === id) {
      setSelectedIncidenciaModal(updated.find(i => i.id === id) || null);
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* CABECERA PRINCIPAL: DIRECCIÓN F&B */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                FASE 10 · CONTROL GENERAL
              </span>
              <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} h
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                · {currentTime.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-amber-400" />
              <span>DIRECCIÓN F&B · DASHBOARD OPERATIVO</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 font-sans">
              Consola unificada del Maître General: control de cierres, alertas vivas, incidencias, stock y promociones
            </p>
          </div>

          {/* Selector de Hotel y Botones */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800">
              <button
                onClick={() => setSelectedHotel('klayman-diamond')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedHotel === 'klayman-diamond' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Diamond
              </button>
              <button
                onClick={() => setSelectedHotel('klayman-olivina')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedHotel === 'klayman-olivina' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Olivina
              </button>
            </div>

            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 hover:text-white transition-colors"
              >
                ← Menú Bar
              </button>
            )}
          </div>
        </div>

        {/* BARRA DE ACCESOS RÁPIDOS DIRECTOS */}
        <div className="pt-2 border-t border-stone-800/80">
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-2 font-semibold">
            ACCESOS RÁPIDOS A MÓDULOS OPERATIVOS:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* 1. Control Operativo */}
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('control_operativo')}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-emerald-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-emerald-300 truncate">
                  1. Checklists
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 shrink-0" />
            </button>

            {/* 2. Caja */}
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('cierre_caja')}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-emerald-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-emerald-300 truncate">
                  2. Caja
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-emerald-400 shrink-0" />
            </button>

            {/* 3. Eventos */}
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('eventos')}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-amber-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-amber-300 truncate">
                  3. Eventos
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 shrink-0" />
            </button>

            {/* 4. Promociones */}
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('promociones')}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-amber-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-amber-300 truncate">
                  4. Promos
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 shrink-0" />
            </button>

            {/* 5. Incidencias */}
            <button
              onClick={() => {
                setCreateInitialType('incidencia');
                setShowCreateIncidencia(true);
              }}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-rose-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-rose-300 truncate">
                  5. + Incidencia
                </span>
              </div>
              <Plus className="w-3.5 h-3.5 text-stone-600 group-hover:text-rose-400 shrink-0" />
            </button>

            {/* 6. Faltantes */}
            <button
              onClick={() => {
                setCreateInitialType('faltante_stock');
                setShowCreateIncidencia(true);
              }}
              className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-850 hover:border-amber-500/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <PackageX className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-stone-200 group-hover:text-amber-300 truncate">
                  6. + Faltante
                </span>
              </div>
              <Plus className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN OBLIGATORIA: ALERTAS EN VIVO (🔴 🟠 🟡 🟢) */}
      <div className="space-y-2.5">
        <span className="text-xs font-mono text-stone-400 uppercase tracking-wider font-semibold flex items-center gap-2 px-1">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>Alertas Operativas Activas</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 🔴 ALERTA 1: Faltante urgente */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            alertasVivas.faltanteUrgente 
              ? 'bg-rose-950/60 border-rose-800 text-rose-200 shadow-md ring-1 ring-rose-500/40' 
              : 'bg-stone-950/60 border-stone-850 text-stone-500'
          }`}>
            <span className="text-lg shrink-0">🔴</span>
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-rose-400">
                Faltante Urgente
              </span>
              {alertasVivas.faltanteUrgente ? (
                <div>
                  <p className="text-xs font-semibold text-stone-100 truncate">
                    {alertasVivas.faltanteUrgente.titulo}
                  </p>
                  <p className="text-[10px] font-mono text-rose-300">
                    {alertasVivas.faltanteUrgente.centroVenta} · {alertasVivas.faltanteUrgente.hora} h
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Sin roturas críticas de stock</p>
              )}
            </div>
          </div>

          {/* 🟠 ALERTA 2: Evento en menos de 60 minutos */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            alertasVivas.evento60 
              ? 'bg-amber-950/60 border-amber-800 text-amber-200 shadow-md ring-1 ring-amber-500/40' 
              : 'bg-stone-950/60 border-stone-850 text-stone-500'
          }`}>
            <span className="text-lg shrink-0">🟠</span>
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-amber-400">
                Evento en ≤ 60 min
              </span>
              {alertasVivas.evento60 ? (
                <div>
                  <p className="text-xs font-semibold text-stone-100 truncate">
                    {alertasVivas.evento60.titulo}
                  </p>
                  <p className="text-[10px] font-mono text-amber-300">
                    Inicia a las {alertasVivas.evento60.horaInicio} h ({alertasVivas.evento60.responsable})
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Ningún evento inmediato en 1h</p>
              )}
            </div>
          </div>

          {/* 🟡 ALERTA 3: Happy Hour próxima */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            promosData.hhStatus.status === 'activa' || alertasVivas.hhProxima
              ? 'bg-amber-950/40 border-amber-700/80 text-amber-200 shadow-md ring-1 ring-amber-500/30'
              : 'bg-stone-950/60 border-stone-850 text-stone-500'
          }`}>
            <span className="text-lg shrink-0">🟡</span>
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-amber-400">
                Happy Hour Próxima / Activa
              </span>
              {promosData.hhStatus.status === 'activa' ? (
                <div>
                  <p className="text-xs font-semibold text-emerald-300 truncate">
                    ¡Happy Hour Activa en este momento!
                  </p>
                  <p className="text-[10px] font-mono text-amber-300">
                    Tarifa 2x1 hasta las {promosData.hhStatus.activePromo?.horaFin} h
                  </p>
                </div>
              ) : promosData.hhStatus.minutosHastaInicio !== null ? (
                <div>
                  <p className="text-xs font-semibold text-stone-100 truncate">
                    Comienza a las {promosData.hhStatus.activePromo?.horaInicio} h
                  </p>
                  <p className="text-[10px] font-mono text-amber-300">
                    Faltan {promosData.hhStatus.minutosHastaInicio} minutos
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Sin franja de HH inmediata</p>
              )}
            </div>
          </div>

          {/* 🟢 ALERTA 4: Caja recibida correctamente */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            alertasVivas.cajaCorrecta 
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200 shadow-md' 
              : 'bg-stone-950/60 border-stone-850 text-stone-500'
          }`}>
            <span className="text-lg shrink-0">🟢</span>
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold block text-emerald-400">
                Caja Recibida
              </span>
              {operacionDelDia.ultimoCierre ? (
                <div>
                  <p className="text-xs font-semibold text-emerald-300 truncate">
                    Cuadre OK: {operacionDelDia.ultimoCierre.totalGross.toFixed(2)} €
                  </p>
                  <p className="text-[10px] font-mono text-stone-300">
                    Descuadre: 0,00 € · {operacionDelDia.ultimoCierre.ticketZNumber}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Esperando primer arqueo Z</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE PRINCIPAL EN 2 COLUMNAS ERGONÓMICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* =========================================================================
            1. SECCIÓN: OPERACIÓN DEL DÍA
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Auditoría Financiera Diaria
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  OPERACIÓN DEL DÍA
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('cierre_caja')}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Abrir Caja</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Último cierre recibido */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                  Último Cierre Recibido
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              {operacionDelDia.ultimoCierre ? (
                <div>
                  <span className="text-lg font-display font-bold text-emerald-400">
                    {operacionDelDia.totalFacturadoUltimo.toFixed(2)} €
                  </span>
                  <div className="text-[10px] font-mono text-stone-400 space-y-0.5 mt-1">
                    <p>TPV: {operacionDelDia.ultimoCierre.ticketZNumber} · {operacionDelDia.ultimoCierre.cashierName.split(' ')[0]}</p>
                    <p className="text-stone-500">Fecha: {operacionDelDia.ultimoCierre.date} ({operacionDelDia.ultimoCierre.time} h)</p>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-stone-500 italic block">Sin cierres aún</span>
              )}
            </div>

            {/* Cierre pendiente */}
            <div className={`p-3 rounded-2xl border space-y-1 ${
              operacionDelDia.cierrePendiente ? 'bg-amber-950/20 border-amber-800/60' : 'bg-stone-950 border-stone-850'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-semibold text-amber-400">
                  Cierre Pendiente
                </span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div>
                <span className="text-base font-display font-bold text-amber-300 block">
                  {operacionDelDia.cierrePendiente ? 'Pendiente Turno Noche' : 'Al Día (Completado)'}
                </span>
                <p className="text-[10px] font-mono text-stone-400 mt-1">
                  Hora límite: <strong>22:30 h</strong> (tras cierre de terraza)
                </p>
              </div>
            </div>

            {/* Ticket recibido */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                  Ticket Recibido
                </span>
                <Camera className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-200 font-mono block">
                  {operacionDelDia.ultimoTieneTicket ? '✓ Ticket Fiscal Adjunto' : 'Sin Foto de Ticket'}
                </span>
                {operacionDelDia.ultimoCierre?.ticketPhotoUrl && (
                  <button
                    onClick={() => setTicketModalUrl(operacionDelDia.ultimoCierre!.ticketPhotoUrl)}
                    className="text-[10px] font-mono text-amber-400 hover:underline mt-1 block flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ver justificante ({operacionDelDia.ultimoCierre.ticketZNumber})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Ticket pendiente */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                  Ticket Pendiente
                </span>
                <AlertCircle className={`w-3.5 h-3.5 ${operacionDelDia.cierrePendiente ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-200 font-mono block">
                  {operacionDelDia.cierrePendiente ? '1 ticket por subir' : '0 tickets pendientes'}
                </span>
                <p className="text-[10px] font-mono text-stone-500 mt-1">
                  Subida obligatoria al Cierre Z
                </p>
              </div>
            </div>
          </div>

          {/* Desglose rápido de medios de pago */}
          {operacionDelDia.ultimoCierre && (
            <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-semibold block">
                Desglose Último Cierre (Sin Cargo a Habitación):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">Tarjeta (TPV)</span>
                  <span className="text-sky-300 font-bold">{operacionDelDia.totalTarjetaUltimo.toFixed(2)} €</span>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">Efectivo</span>
                  <span className="text-emerald-300 font-bold">{operacionDelDia.totalEfectivoUltimo.toFixed(2)} €</span>
                </div>
                <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <span className="text-stone-500 text-[10px] block">Descuadres</span>
                  <span className="text-stone-300 font-bold">0,00 € OK</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            2. SECCIÓN: INCIDENCIAS Y FALTANTES
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Gestión Operativa de Incidencias
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  INCIDENCIAS & FALTANTES
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                setCreateInitialType('incidencia');
                setShowCreateIncidencia(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-[11px] font-mono text-rose-300 font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Reportar</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Incidencias abiertas */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Abiertas
              </span>
              <span className="text-2xl font-display font-bold text-amber-400 block mt-0.5">
                {incidenciasStats.totalAbiertas}
              </span>
              <span className="text-[10px] font-mono text-stone-500">en seguimiento</span>
            </div>

            {/* Faltantes pendientes */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Faltantes
              </span>
              <span className="text-2xl font-display font-bold text-amber-400 block mt-0.5">
                {incidenciasStats.totalFaltantes}
              </span>
              <span className="text-[10px] font-mono text-stone-500">stock / barra</span>
            </div>

            {/* Incidencias urgentes */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-rose-900/60">
              <span className="text-[10px] font-mono text-rose-400 uppercase block font-semibold">
                Urgentes
              </span>
              <span className="text-2xl font-display font-bold text-rose-400 block mt-0.5 animate-pulse">
                {incidenciasStats.totalUrgentes}
              </span>
              <span className="text-[10px] font-mono text-rose-400/80">acción hoy</span>
            </div>
          </div>

          {/* Listado dinámico de incidencias críticas */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-semibold block">
              Incidencias y Faltantes Activos:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {incidenciasStats.abiertas.length > 0 ? (
                incidenciasStats.abiertas.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidenciaModal(inc)}
                    className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 hover:border-amber-500/60 cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${inc.gravedad === 'urgente' ? 'bg-rose-400 animate-ping' : 'bg-amber-400'}`} />
                      <div className="truncate">
                        <p className="font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                          {inc.titulo}
                        </p>
                        <span className="text-[10px] font-mono text-stone-500">
                          {inc.centroVenta} · {inc.hora} h · {inc.reportadoPor.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        inc.gravedad === 'urgente' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-stone-900 text-stone-400'
                      }`}>
                        {inc.tipo === 'faltante_stock' ? 'Stock' : 'Incidencia'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-400" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic p-3 text-center bg-stone-950 rounded-xl">
                  Sin incidencias pendientes en este momento. Operación al 100%.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. SECCIÓN: PROMOCIONES Y HAPPY HOUR
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Estrategia Comercial & Tarifas
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  PROMOCIONES & HAPPY HOUR
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('promociones')}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Promos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Happy Hour activa */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-stone-400 block">
                  Happy Hour Activa
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${promosData.hhStatus.status === 'activa' ? 'bg-emerald-400 animate-ping' : 'bg-stone-600'}`} />
                  <span className="text-sm font-display font-bold text-stone-200">
                    {promosData.hhStatus.status === 'activa' ? 'ACTIVA EN ESTE MOMENTO' : 'Inactiva (Fuera de franja)'}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-amber-400">
                  {promosData.hhStatus.activePromo?.nombre || 'Happy Hour Sunset Diario'} ({promosData.hhStatus.activePromo?.horaInicio} - {promosData.hhStatus.activePromo?.horaFin} h)
                </p>
              </div>

              {promosData.hhStatus.status === 'activa' ? (
                <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                  ⚡ 2x1 ACTIVO
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono text-stone-500 bg-stone-900 border border-stone-800">
                  Tarifa Estándar
                </span>
              )}
            </div>

            {/* Próxima Happy Hour */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-stone-400 block">
                  Próxima Happy Hour
                </span>
                <span className="text-sm font-semibold text-stone-200">
                  {promosData.hhStatus.activePromo?.horaInicio || '17:00'} - {promosData.hhStatus.activePromo?.horaFin || '18:00'} h
                </span>
                <p className="text-[11px] font-mono text-stone-500">
                  {promosData.hhStatus.minutosHastaInicio !== null 
                    ? `Comienza en ${promosData.hhStatus.minutosHastaInicio} minutos`
                    : 'Próxima sesión mañana a las 17:00 h'}
                </p>
              </div>

              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
            </div>

            {/* Promociones Activas en Carta */}
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold block">
                Promociones Especiales Activas Hoy ({promosData.promosActivas.length})
              </span>
              <div className="space-y-1.5">
                {promosData.promosActivas.slice(0, 3).map(pr => (
                  <div key={pr.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-300 font-medium truncate">{pr.nombre}</span>
                    <span className="text-emerald-400 font-mono font-bold shrink-0">{pr.precioPromocionalTexto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. SECCIÓN: EVENTOS Y CALENDARIO
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Agenda de Animación & Operativa
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  EVENTOS & CALENDARIO
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('eventos')}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] font-mono text-sky-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Eventos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Eventos de hoy */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Eventos Hoy
              </span>
              <span className="text-2xl font-display font-bold text-sky-400 block mt-0.5">
                {eventosData.eventosHoy.length}
              </span>
              <span className="text-[10px] font-mono text-stone-500">en agenda</span>
            </div>

            {/* Próximos eventos */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Próximos
              </span>
              <span className="text-2xl font-display font-bold text-stone-200 block mt-0.5">
                {eventosData.proximos.length}
              </span>
              <span className="text-[10px] font-mono text-stone-500">programados</span>
            </div>

            {/* Eventos críticos */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-rose-900/60">
              <span className="text-[10px] font-mono text-rose-400 uppercase block font-semibold">
                Críticos
              </span>
              <span className="text-2xl font-display font-bold text-rose-400 block mt-0.5">
                {eventosData.criticos.length}
              </span>
              <span className="text-[10px] font-mono text-rose-400/80">alta prioridad</span>
            </div>
          </div>

          {/* Listado dinámico de eventos de hoy */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-semibold block">
              Eventos Programados para Hoy:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {eventosData.eventosHoy.length > 0 ? (
                eventosData.eventosHoy.map(ev => {
                  const est = calcularEstadoEvento(ev, currentTime);
                  return (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <p className="font-semibold text-stone-200 truncate">{ev.titulo}</p>
                        <span className="text-[10px] font-mono text-stone-500">
                          {ev.horaInicio} - {ev.horaFin} h · Resp: {ev.responsable}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 uppercase ${
                        est === 'Activo' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-stone-900 text-sky-300 border border-sky-900/60'
                      }`}>
                        {est}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-500 italic p-3 text-center bg-stone-950 rounded-xl">
                  Sin eventos especiales hoy. Servicio ordinario de carta.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            5. SECCIÓN: FORMACIÓN Y CALIDAD DOCUMENTAL
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Estándares & Auditoría de Calidad
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  FORMACIÓN & FICHAS
                </h2>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab && onNavigateToTab('fichas')}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-[11px] font-mono text-purple-400 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Ver Fichas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center">
            {/* Productos sin ficha */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Sin Ficha
              </span>
              <span className="text-2xl font-display font-bold text-amber-400 block mt-0.5">
                {formacionData.sinFicha}
              </span>
              <span className="text-[10px] font-mono text-stone-500">pendientes</span>
            </div>

            {/* Productos sin foto */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-400 uppercase block font-semibold">
                Sin Foto
              </span>
              <span className="text-2xl font-display font-bold text-stone-300 block mt-0.5">
                {formacionData.sinFoto}
              </span>
              <span className="text-[10px] font-mono text-stone-500">por disparar</span>
            </div>

            {/* Pendientes de documentación */}
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-purple-400 uppercase block font-semibold">
                Pendientes
              </span>
              <span className="text-2xl font-display font-bold text-purple-400 block mt-0.5">
                {formacionData.pendientesDoc}
              </span>
              <span className="text-[10px] font-mono text-stone-500">de 69 productos</span>
            </div>
          </div>

          {/* Barra de progreso de documentación */}
          <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-850 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 font-mono">Índice de Documentación Global:</span>
              <span className="text-emerald-400 font-mono font-bold">{formacionData.porcentajeGlobal}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-700" 
                style={{ width: `${formacionData.porcentajeGlobal}%` }} 
              />
            </div>
            <p className="text-[10px] font-mono text-stone-500">
              {formacionData.completos} productos completamente documentados de {formacionData.totalProductos} totales.
            </p>
          </div>
        </div>

        {/* =========================================================================
            6. SECCIÓN: COMUNICACIONES OPERATIVAS
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Feed de Sala, Barra y Cierres
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  COMUNICACIONES RECIENTES
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Últimas incidencias recibidas */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold block">
                Últimas Incidencias Recibidas:
              </span>
              <div className="space-y-1">
                {incidencias.filter(i => i.tipo !== 'faltante_stock').slice(0, 2).map(inc => (
                  <div key={inc.id} className="p-2 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-between text-xs">
                    <span className="text-stone-300 truncate">{inc.titulo}</span>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0">{inc.hora} h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Últimos faltantes reportados */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold block">
                Últimos Faltantes Reportados:
              </span>
              <div className="space-y-1">
                {incidencias.filter(i => i.tipo === 'faltante_stock').slice(0, 2).map(f => (
                  <div key={f.id} className="p-2 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-between text-xs">
                    <span className="text-amber-300 truncate">{f.titulo}</span>
                    <span className="text-[10px] font-mono text-stone-500 shrink-0">{f.reportadoPor.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Últimos cierres enviados */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold block">
                Últimos Cierres Enviados:
              </span>
              <div className="space-y-1">
                {closings.slice(0, 2).map(c => (
                  <div key={c.id} className="p-2 rounded-xl bg-stone-950 border border-stone-850 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{c.totalGross.toFixed(2)} € ({c.ticketZNumber})</span>
                    <span className="text-stone-400 text-[10px]">{c.date} · {c.cashierName.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA CREAR INCIDENCIA / FALTANTE */}
      {showCreateIncidencia && (
        <CreateIncidenciaModal
          initialType={createInitialType}
          onClose={() => setShowCreateIncidencia(false)}
          onSave={handleSaveIncidencia}
        />
      )}

      {/* MODAL DE DETALLE DE INCIDENCIA */}
      {selectedIncidenciaModal && (
        <IncidenciaDetailModal
          incidencia={selectedIncidenciaModal}
          onClose={() => setSelectedIncidenciaModal(null)}
          onUpdateStatus={handleUpdateIncidenciaStatus}
        />
      )}

      {/* MODAL DE VISUALIZACIÓN DE TICKET FISCAL */}
      {ticketModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                JUSTIFICANTE FISCAL · CIERRE DE CAJA
              </span>
              <button onClick={() => setTicketModalUrl(null)} className="text-stone-400 hover:text-stone-100">
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-white p-2">
              <img src={ticketModalUrl} alt="Ticket Z" className="w-full h-auto object-contain" />
            </div>
            <button
              onClick={() => setTicketModalUrl(null)}
              className="w-full py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-mono font-bold"
            >
              Cerrar Justificante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
