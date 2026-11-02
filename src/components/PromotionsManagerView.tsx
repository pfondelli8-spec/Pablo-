/**
 * FASE 7 – COMPONENTE DE GESTIÓN AUTOMATIZADA DE PROMOCIONES Y HAPPY HOUR
 * 
 * Implementa:
 * - Entidad independiente de promociones con:
 *   Nombre, Hotel, Centro de venta, Fecha inicio/fin, Hora inicio/fin,
 *   Productos incluidos, Precio promocional, Estado (Activa, Programada, Finalizada)
 * - Mostrar promociones activas
 * - Mostrar próxima promoción (con cuenta atrás)
 * - Mostrar promociones del día
 * - Filtros por hotel y por centro de venta
 * - Relación de promociones con productos (precios normales vs promocionales)
 * - Módulo Happy Hour en tiempo real (precio normal, precio HH, horario, estado activo/inactivo)
 * - Alertas automáticas:
 *   • Happy Hour comienza en 30 minutos
 *   • Happy Hour activa
 *   • Happy Hour finalizada
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Clock, 
  Calendar, 
  Tag, 
  Sparkles, 
  BellRing, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Wine, 
  Beer, 
  Building2, 
  MapPin, 
  ArrowRight, 
  Filter, 
  Volume2, 
  Eye, 
  Play,
  RotateCcw,
  FileText,
  Copy,
  Check,
  Lock,
  ShieldCheck,
  Table,
  Download
} from 'lucide-react';
import { 
  PROMOTIONS_DATABASE, 
  PromotionEntityMaster, 
  PromotionStatus,
  calcularEstadoPromocion,
  getPromocionesActivas,
  getPromocionesDelDia,
  getProximaPromocion,
  getHappyHourLiveStatus,
  filtrarPorHotel,
  filtrarPorCentroVenta,
  HappyHourLiveStatus,
  KLAYMAN_DIAMOND_OPERATIONAL_MATRIX,
  KLAYMAN_DIAMOND_CSV_RAW
} from '../data/promotionsMaster';
import { 
  dispatchPromoNotification, 
  playPromoChime, 
  triggerPromoVibration 
} from '../services/promoNotificationService';

interface PromotionsManagerViewProps {
  initialHotel?: 'klayman-diamond' | 'klayman-olivina';
  onOpenProductDetail?: (productId: string, nameFallback?: string) => void;
  onOpenTechnicalSheet?: (sheetId: string) => void;
}

export const PromotionsManagerView: React.FC<PromotionsManagerViewProps> = ({
  initialHotel = 'klayman-diamond',
  onOpenProductDetail,
  onOpenTechnicalSheet
}) => {
  // Filtros principales: se distingue estrictamente cada hotel sin unificarlos
  const [selectedHotel, setSelectedHotel] = useState<'klayman-diamond' | 'klayman-olivina'>(initialHotel);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activas' | 'hoy' | 'programadas'>('todos');
  
  // Estado de tiempo en vivo (reloj reactivo)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Promoción seleccionada para modal/detalle
  const [expandedPromoId, setExpandedPromoId] = useState<string | null>(null);

  // Alerta disparada para feedback visual
  const [recentAlert, setRecentAlert] = useState<{
    tipo: string;
    mensaje: string;
    hora: string;
  } | null>(null);

  // Modal / Desplegable de Cheat Sheet Plastificada de Barra
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [cheatSheetCopied, setCheatSheetCopied] = useState(false);

  const handleCopyCheatSheet = () => {
    const text = `==========================================================
KLAYMAN DIAMOND · CHEAT SHEET PLASTIFICADA DE BARRA (OFICIAL)
==========================================================

1. REGLAS INNEGOCIABLES: HAPPY HOUR DIARIO
• Horario: 15:00 a 16:00 h (Todos los días).
• Oferta: 2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €.
• Política de servicio:
  - Bebidas idénticas obligatorias (mismo cóctel o dos jarras).
  - Prohibido vender 1 jarra suelta a 3 €.
  - Cero excepciones: ni combinaciones mixtas ni mitad de precio.
• 6 Cócteles incluidos:
  1. Margarita Clásica
  2. Mojito Tradicional
  3. Blue Diamond Sunset
  4. Piña Colada
  5. Aperol Spritz
  6. Sex on the Beach
• TPV Ágora: Teclas directas [HH 2 CÓCTELES 12.00€] y [HH 2 JARRAS 6.00€].

----------------------------------------------------------
2. CALENDARIO SEMANAL DE PROMOCIONES VIGENTES
----------------------------------------------------------
• LUNES (08:00 - 22:00 h):
  Jarra Dorada Especial (50 cl) = 3,00 € (Incluye frutos secos tostados canarios).
  TPV: [PROMO LUNES JARRAS 3.00€]

• MIÉRCOLES (08:00 - 22:30 h):
  Spritz (Aperol, Campari, Limoncello, Hugo) = 6,00 € (Copa balón con hielo macizo).
  TPV: [PROMO SPRITZ 6.00€]

• VIERNES (10:00 - 22:00 h):
  2x1 en Cócteles Seleccionados de la carta oficial.
  TPV: [PROMO VIERNES 2X1 CÓCTELES]

• DOMINGO (08:00 - 22:30 h):
  Mojitos (Tradicional, Fresa, Maracuyá, Virgin) = 5,00 € (Exclusivo domingos).
  TPV: [PROMO DOMINGO MOJITO 5.00€]

----------------------------------------------------------
3. AUDITORÍA DE SEGURIDAD TPV & CARTELERÍA (ELIMINADAS)
----------------------------------------------------------
- ❌ Cócteles Sunset del viernes: ELIMINADA (Tecla TPV desactivada y bloqueada).
- ❌ Spritz del domingo: ELIMINADA (Tecla TPV desactivada; Spritz solo miércoles).
Riesgo de cobro obsoleto: 0%`;
    navigator.clipboard.writeText(text);
    setCheatSheetCopied(true);
    setTimeout(() => setCheatSheetCopied(false), 2500);
  };

  const [csvCopied, setCsvCopied] = useState(false);

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(KLAYMAN_DIAMOND_CSV_RAW);
    setCsvCopied(true);
    setTimeout(() => setCsvCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    const blob = new Blob(["\uFEFF" + KLAYMAN_DIAMOND_CSV_RAW], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'promociones_klayman_diamond.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sincronizar si cambia initialHotel
  useEffect(() => {
    if (initialHotel) {
      setSelectedHotel(initialHotel);
      setSelectedOutlet('todos');
    }
  }, [initialHotel]);

  // Actualizar reloj cada 30 segundos para automatización
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Cálculo del estado en tiempo real de Happy Hour específico del hotel seleccionado
  const hhLiveStatus: HappyHourLiveStatus = useMemo(() => {
    return getHappyHourLiveStatus(selectedHotel, currentTime);
  }, [selectedHotel, currentTime]);

  // Cálculo de la próxima promoción del hotel seleccionado
  const nextPromoInfo = useMemo(() => {
    return getProximaPromocion(selectedHotel, selectedOutlet, currentTime);
  }, [selectedHotel, selectedOutlet, currentTime]);

  // Total de promociones del hotel activo
  const totalHotelPromosCount = useMemo(() => {
    return PROMOTIONS_DATABASE.filter(p => p.hotelId === selectedHotel).length;
  }, [selectedHotel]);

  // Lista de promociones filtradas (estrictamente del hotel seleccionado, sin mezclar)
  const filteredPromotions = useMemo(() => {
    let list = PROMOTIONS_DATABASE.filter(p => p.hotelId === selectedHotel);

    // Filtro por Centro de Venta
    if (selectedOutlet !== 'todos') {
      list = list.filter(p => p.outletId === selectedOutlet || p.centroVenta === selectedOutlet);
    }

    // Filtro por Estado / Tiempo
    if (statusFilter === 'activas') {
      list = list.filter(p => calcularEstadoPromocion(p, currentTime) === 'Activa');
    } else if (statusFilter === 'hoy') {
      const todayDay = currentTime.getDay();
      list = list.filter(p => p.diasSemana.includes(todayDay));
    } else if (statusFilter === 'programadas') {
      list = list.filter(p => calcularEstadoPromocion(p, currentTime) === 'Programada');
    }

    return list;
  }, [selectedHotel, selectedOutlet, statusFilter, currentTime]);

  // Promociones activas en este preciso momento para el hotel seleccionado
  const activasAhoraCount = useMemo(() => {
    return getPromocionesActivas(selectedHotel, selectedOutlet, currentTime).length;
  }, [selectedHotel, selectedOutlet, currentTime]);

  // Promociones del día para el hotel seleccionado
  const promosDelDiaCount = useMemo(() => {
    return getPromocionesDelDia(selectedHotel, selectedOutlet, currentTime).length;
  }, [selectedHotel, selectedOutlet, currentTime]);

  // Función para disparar las 3 alertas automáticas solicitadas
  const handleTriggerHappyHourAlert = (tipo: 'comienza_en_30_min' | 'activa' | 'finalizada') => {
    const horaActual = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    let titulo = '';
    let mensaje = '';

    const isDiamond = selectedHotel === 'klayman-diamond';

    if (tipo === 'comienza_en_30_min') {
      titulo = `⏳ Happy Hour comienza en 30 min · ${isDiamond ? 'Diamond' : 'Olivina'}`;
      mensaje = isDiamond
        ? 'Preparar mise en place de cítricos, cubos de hielo y cristalería. Horario 15:00 a 16:00 h (2 cócteles 12€ / 2 jarras 6€).'
        : 'Preparar azotea Sol Bar Olivina. Horario 16:00 a 18:00 h (Cócteles 6,00 € y Cañas 2,20 €).';
    } else if (tipo === 'activa') {
      titulo = `🔥 ¡Happy Hour activa en ${isDiamond ? 'AK Terraza Diamond' : 'Sol Bar Olivina'}!`;
      mensaje = isDiamond
        ? 'Tarifa oficial en vigor: 2 cócteles 12€ ó 2 jarras 6€ (mismo producto obligatorio). Registrar en TPV.'
        : 'Tarifa oficial en vigor en Sol Bar: Cócteles 6€ y Cañas 2,20€. Registrar en TPV Ágora de Olivina.';
    } else {
      titulo = `🏁 Happy Hour finalizada · ${isDiamond ? 'Diamond' : 'Olivina'}`;
      mensaje = 'El horario de promoción especial ha concluido. Restablecer precios ordinarios en comandas de TPV.';
    }

    // Disparar servicio de audio y notificación
    playPromoChime();
    triggerPromoVibration();

    dispatchPromoNotification({
      id: `hh-alert-${Date.now()}`,
      promoId: isDiamond ? 'promo-dia-hh-sunset' : 'promo-oli-hh-solbar',
      title: titulo,
      body: mensaje,
      time: horaActual,
      tag: 'HAPPY HOUR',
      badgeText: 'ALERTA OFICIAL',
      category: 'happy_hour',
      iconType: 'flame',
      timestamp: Date.now()
    });

    setRecentAlert({
      tipo,
      mensaje: `${titulo}: ${mensaje}`,
      hora: horaActual
    });

    setTimeout(() => {
      setRecentAlert(null);
    }, 6000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. CABECERA & CONTROLES DE FILTRO */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900/90 border border-amber-500/20 p-3 sm:p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-display font-black text-[10px] uppercase tracking-wider">
                {selectedHotel === 'klayman-diamond' ? 'KLAYMAN DIAMOND · BAR & TERRAZA' : 'KLAYMAN OLIVINA · SOL BAR'}
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Hora actual: {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              {activasAhoraCount > 0 ? (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  <span>{activasAhoraCount} {activasAhoraCount === 1 ? 'PROMO ACTIVA AHORA' : 'PROMOS ACTIVAS AHORA'}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-stone-800/80 text-stone-400 font-mono text-[10px]">
                  0 activas en este minuto
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
              {selectedHotel === 'klayman-diamond' ? 'Ofertas & Happy Hour · Klayman Diamond' : 'Ofertas & Happy Hour · Klayman Olivina'}
            </h2>
            <p className="text-[11px] text-stone-400">
              {selectedHotel === 'klayman-diamond' 
                ? 'Catálogo exclusivo de ofertas y carta de precios oficiales de Bar / Terraza Diamond.' 
                : 'Catálogo exclusivo de ofertas y carta de precios oficiales de Sol Bar Olivina.'}
            </p>
          </div>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
              <span className="text-[9px] font-mono text-stone-400 block uppercase">Hoy</span>
              <span className="text-sm font-mono font-bold text-amber-400">{promosDelDiaCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
              <span className="text-[9px] font-mono text-stone-400 block uppercase">Total</span>
              <span className="text-sm font-mono font-bold text-stone-200">{totalHotelPromosCount}</span>
            </div>
          </div>
        </div>

        {/* FILTROS SEGMENTADOS: SELECCIÓN ESTRICTA DE HOTEL (SIN UNIFICAR), CENTRO DE VENTA Y ESTADO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-800/70 text-xs font-mono">
          {/* Selector de Hotel (Establecimiento diferenciado e independiente) */}
          <div className="flex items-center gap-1.5 bg-stone-950/80 p-1.5 rounded-xl border border-amber-500/40 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
            <select
              value={selectedHotel}
              onChange={(e) => {
                const val = e.target.value as 'klayman-diamond' | 'klayman-olivina';
                setSelectedHotel(val);
                setSelectedOutlet('todos'); // Reset outlet
              }}
              className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none w-full cursor-pointer"
            >
              <option value="klayman-diamond" className="bg-stone-900 text-stone-100">Klayman Diamond (Bar / Terraza)</option>
              <option value="klayman-olivina" className="bg-stone-900 text-stone-100">Klayman Olivina (Sol Bar)</option>
            </select>
          </div>

          {/* Filtro por Centro de Venta */}
          <div className="flex items-center gap-1.5 bg-stone-950/70 p-1.5 rounded-xl border border-stone-800">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="bg-transparent text-stone-200 text-xs focus:outline-none w-full cursor-pointer"
            >
              <option value="todos" className="bg-stone-900 text-stone-100">Todos los Puntos del Hotel</option>
              {selectedHotel === 'klayman-diamond' && (
                <option value="diamond-bar-terraza" className="bg-stone-900 text-stone-100">Bar / Terraza Diamond</option>
              )}
              {selectedHotel === 'klayman-olivina' && (
                <option value="olivina-bar-sol" className="bg-stone-900 text-stone-100">Sol Bar Olivina</option>
              )}
            </select>
          </div>

          {/* Filtro por Estado Operativo */}
          <div className="flex items-center gap-1.5 bg-stone-950/70 p-1.5 rounded-xl border border-stone-800">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-stone-200 text-xs focus:outline-none w-full cursor-pointer"
            >
              <option value="todos" className="bg-stone-900 text-stone-100">Todas las Ofertas</option>
              <option value="activas" className="bg-stone-900 text-stone-100">Activas Ahora Mismo</option>
              <option value="hoy" className="bg-stone-900 text-stone-100">Programadas para Hoy</option>
              <option value="programadas" className="bg-stone-900 text-stone-100">Próximamente / Programadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. MÓDULO HAPPY HOUR EN TIEMPO REAL CON ALERTAS AUTOMÁTICAS */}
      <div className={`rounded-2xl border p-4 shadow-lg transition-all ${
        hhLiveStatus.isActivo
          ? 'bg-gradient-to-br from-emerald-950/60 via-stone-900 to-stone-950 border-emerald-500/80 shadow-emerald-950/50'
          : 'bg-stone-900/90 border-stone-800'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border shadow-sm ${
                hhLiveStatus.isActivo
                  ? 'bg-emerald-500 text-stone-950 border-emerald-400 animate-pulse'
                  : 'bg-stone-950 text-stone-300 border-stone-700'
              }`}>
                <Flame className={`w-3.5 h-3.5 ${hhLiveStatus.isActivo ? 'fill-current' : 'text-stone-500'}`} />
                <span>{hhLiveStatus.isActivo ? '¡HAPPY HOUR ACTIVA AHORA!' : 'HAPPY HOUR: INACTIVA'}</span>
              </span>

              <span className="text-xs font-mono text-stone-300 px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                Horario: <strong className="text-amber-400">{hhLiveStatus.horario}</strong>
              </span>

              <span className="text-[11px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                {selectedHotel === 'klayman-diamond' ? 'AK Terraza Diamond' : 'Sol Bar Olivina'}
              </span>
            </div>

            <p className="text-xs font-mono text-stone-300 leading-snug">
              {hhLiveStatus.mensajeAlerta}
            </p>
          </div>

          {/* BOTONES DE DISPARO Y PRUEBA DE LAS 3 ALERTAS AUTOMÁTICAS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full lg:w-auto">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider self-start sm:self-center block sm:hidden lg:block mr-1">
              Alertas automáticas:
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => handleTriggerHappyHourAlert('comienza_en_30_min')}
                className="px-2 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-[10px] font-mono text-amber-300 font-bold transition-all active:scale-95 text-center"
                title="Aviso preventivo para preparar barra"
              >
                <span>30 min antes</span>
              </button>
              <button
                onClick={() => handleTriggerHappyHourAlert('activa')}
                className="px-2 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-[10px] font-mono text-emerald-300 font-bold transition-all active:scale-95 text-center"
                title="Aviso de inicio oficial en TPV"
              >
                <span>Activa</span>
              </button>
              <button
                onClick={() => handleTriggerHappyHourAlert('finalizada')}
                className="px-2 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-[10px] font-mono text-stone-300 font-bold transition-all active:scale-95 text-center"
                title="Aviso de fin de horario promocional"
              >
                <span>Finalizada</span>
              </button>
            </div>
          </div>
        </div>

        {/* FEEDBACK DE ALERTA DISPARADA RECIENTEMENTE */}
        {recentAlert && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
              <span><strong>Alerta Disparada [{recentAlert.hora}]:</strong> {recentAlert.mensaje}</span>
            </div>
            <span className="text-[10px] text-amber-400/80">Sonido & Notificación enviados</span>
          </div>
        )}

        {/* NORMAS ESPECÍFICAS DE HAPPY HOUR Y CALENDARIO SEMANAL SEGÚN EL HOTEL SELECCIONADO */}
        {selectedHotel === 'klayman-diamond' ? (
          <div className="mt-3 space-y-2.5">
            {/* 1. REGLAS INNEGOCIABLES: HAPPY HOUR DIARIO */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/60 space-y-2 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wide">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>1. Reglas Innegociables: Happy Hour Diario (15:00 a 16:00 h)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  2 CÓCTELES 12€ | 2 JARRAS DORADA 6€
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-300">
                <div className="space-y-1">
                  <p className="flex items-start gap-1">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Oferta fija:</strong> 2 Cócteles por 12,00 € | 2 Jarras Dorada Especial (2x50 cl) por 6,00 €.</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold">•</span>
                    <span className="text-stone-200"><strong>Prohibido vender 1 jarra suelta a 3 €:</strong> En Happy Hour no existe jarra individual; la tarifa aplica obligatoriamente al pack de 2 jarras por 6 €.</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-start gap-1">
                    <span className="text-rose-400 font-bold">•</span>
                    <span><strong>Bebidas idénticas obligatorias:</strong> Parejas del mismo producto (2 margaritas o 2 jarras idénticas; no se pueden pedir distintas bebidas ni mezclar cócteles).</span>
                  </p>
                  <p className="flex items-start gap-1">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="text-amber-200"><strong>Cero excepciones:</strong> Prohibida mitad de precio, combinaciones mixtas o descuentos parciales.</span>
                  </p>
                </div>
              </div>

              {/* LISTADO OFICIAL DE LOS 6 CÓCTELES INCLUIDOS */}
              <div className="pt-2 border-t border-amber-800/60 flex items-center gap-1.5 flex-wrap text-[10.5px]">
                <span className="text-amber-400 font-bold uppercase text-[10px]">Cócteles incluidos (6 oficiales):</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Margarita Clásica</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Mojito Tradicional</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Blue Diamond Sunset</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Piña Colada</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Aperol Spritz</span>
                <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-amber-900/80 text-stone-200">Sex on the Beach</span>
              </div>
            </div>

            {/* 2. CALENDARIO SEMANAL & AUDITORÍA TPV */}
            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-stone-200 font-bold text-xs uppercase tracking-wide">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>2. Calendario Semanal de Promociones Vigentes</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowCheatSheet(!showCheatSheet)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showCheatSheet ? 'Ocultar Cheat Sheet' : 'Cheat Sheet de Barra'}</span>
                  </button>

                  <button
                    onClick={handleCopyCheatSheet}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[11px] flex items-center gap-1 transition-all"
                    title="Copiar Cheat Sheet de Barra para imprimir / plastificar"
                  >
                    {cheatSheetCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{cheatSheetCopied ? '¡Copiada!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* 4 DÍAS DE PROMOCIÓN SEMANAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 space-y-0.5">
                  <div className="flex items-center justify-between text-amber-400 font-bold text-[10px]">
                    <span>LUNES</span>
                    <span>08:00 - 22:00</span>
                  </div>
                  <div className="text-stone-100 font-bold">Jarra Dorada (50 cl) = 3,00 €</div>
                  <div className="text-[10px] text-stone-400">Incluye frutos secos tostados canarios de cortesía</div>
                </div>

                <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 space-y-0.5">
                  <div className="flex items-center justify-between text-orange-400 font-bold text-[10px]">
                    <span>MIÉRCOLES</span>
                    <span>08:00 - 22:30</span>
                  </div>
                  <div className="text-stone-100 font-bold">Spritz (4 Variedades) = 6,00 €</div>
                  <div className="text-[10px] text-stone-400">Aperol, Campari, Limoncello y Hugo Spritz</div>
                </div>

                <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 space-y-0.5">
                  <div className="flex items-center justify-between text-amber-400 font-bold text-[10px]">
                    <span>VIERNES</span>
                    <span>10:00 - 22:00</span>
                  </div>
                  <div className="text-stone-100 font-bold">2x1 Cócteles Seleccionados</div>
                  <div className="text-[10px] text-stone-400">En toda la selección oficial de la carta</div>
                </div>

                <div className="p-2 rounded-lg bg-stone-950/80 border border-stone-800 space-y-0.5">
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-[10px]">
                    <span>DOMINGO</span>
                    <span>08:00 - 22:30</span>
                  </div>
                  <div className="text-stone-100 font-bold">Mojitos = 5,00 € (Solo Dom)</div>
                  <div className="text-[10px] text-stone-400">Tradicional, Fresa, Maracuyá y Virgin Mojito</div>
                </div>
              </div>

              {/* AUDITORÍA DE SEGURIDAD BACK-OFFICE TPV: PROMOCIONES ELIMINADAS SIN RIESGO OPERATIVO */}
              <div className="p-2.5 rounded-lg bg-stone-950/90 border border-rose-900/40 text-[10.5px] space-y-1">
                <div className="flex items-center justify-between text-rose-300 font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Back-Office TPV: Teclas y Reglas Desactivadas (Riesgo 0 de descuento obsoleto)</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Auditoría OK</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span><strong>Cócteles Sunset Viernes 6,50€:</strong> Tecla desactivada y bloqueada en TPV Ágora.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span><strong>Spritz en Domingo:</strong> Regla desactivada; Spritz exclusivo miércoles a 6€.</span>
                  </div>
                </div>
              </div>

              {/* DESPLEGABLE CHEAT SHEET PLASTIFICADA COMPLETA */}
              {showCheatSheet && (
                <div className="p-3 rounded-xl bg-stone-950 border border-amber-500/40 space-y-2 text-stone-300 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                    <span className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Cheat Sheet Plastificada de Barra · F&B Klayman Diamond</span>
                    </span>
                    <button
                      onClick={handleCopyCheatSheet}
                      className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center gap-1"
                    >
                      {cheatSheetCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{cheatSheetCopied ? 'Copiada' : 'Copiar texto'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono whitespace-pre-wrap text-stone-300 bg-stone-900/90 p-2.5 rounded-lg border border-stone-800 overflow-x-auto leading-relaxed">
{`==========================================================
KLAYMAN DIAMOND · CHEAT SHEET PLASTIFICADA DE BARRA (OFICIAL)
==========================================================

1. REGLAS INNEGOCIABLES: HAPPY HOUR DIARIO
• Horario: 15:00 a 16:00 h (Todos los días).
• Oferta: 2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €.
• Política de servicio:
  - Bebidas idénticas obligatorias (mismo cóctel o dos jarras).
  - Prohibido vender 1 jarra suelta a 3 €.
  - Cero excepciones: ni combinaciones mixtas ni mitad de precio.
• 6 Cócteles incluidos:
  1. Margarita Clásica
  2. Mojito Tradicional
  3. Blue Diamond Sunset
  4. Piña Colada
  5. Aperol Spritz
  6. Sex on the Beach
• TPV Ágora: Teclas directas [HH 2 CÓCTELES 12.00€] y [HH 2 JARRAS 6.00€].

----------------------------------------------------------
2. CALENDARIO SEMANAL DE PROMOCIONES VIGENTES
----------------------------------------------------------
• LUNES (08:00 - 22:00 h):
  Jarra Dorada Especial (50 cl) = 3,00 € (Incluye frutos secos tostados canarios).
  TPV: [PROMO LUNES JARRAS 3.00€]

• MIÉRCOLES (08:00 - 22:30 h):
  Spritz (Aperol, Campari, Limoncello, Hugo) = 6,00 € (Copa balón con hielo macizo).
  TPV: [PROMO SPRITZ 6.00€]

• VIERNES (10:00 - 22:00 h):
  2x1 en Cócteles Seleccionados de la carta oficial.
  TPV: [PROMO VIERNES 2X1 CÓCTELES]

• DOMINGO (08:00 - 22:30 h):
  Mojitos (Tradicional, Fresa, Maracuyá, Virgin) = 5,00 € (Exclusivo domingos).
  TPV: [PROMO DOMINGO MOJITO 5.00€]

----------------------------------------------------------
3. AUDITORÍA DE SEGURIDAD TPV & CARTELERÍA (ELIMINADAS)
----------------------------------------------------------
- ❌ Cócteles Sunset del viernes: ELIMINADA (Tecla TPV desactivada y bloqueada).
- ❌ Spritz del domingo: ELIMINADA (Tecla TPV desactivada; Spritz solo miércoles).
Riesgo de cobro obsoleto: 0%`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-xl bg-sky-950/40 border border-sky-600/50 space-y-1.5 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-sky-300 font-bold text-[11px] uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Condiciones Operativas de Happy Hour Olivina (16:00 a 18:00 h)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-300">
              <div className="space-y-1">
                <p className="flex items-start gap-1">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Cócteles Seleccionados:</strong> A 6,00 € (PVP ordinario 7,50 €) en Sol Bar Olivina.</span>
                </p>
                <p className="flex items-start gap-1">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Caña Dorada Especial:</strong> A 2,20 € (PVP ordinario 3,00 €).</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="flex items-start gap-1">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Ubicación:</strong> Azotea Rooftop Sol Bar Olivina con vistas atardecer.</span>
                </p>
                <p className="flex items-start gap-1">
                  <span className="text-sky-400 font-bold">•</span>
                  <span><strong>Registro TPV:</strong> Seleccionar botón directo [HAPPY HOUR SOL BAR] en TPV Ágora Olivina.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TABLA COMPARATIVA DE PRECIOS: PRECIO NORMAL VS PRECIO HAPPY HOUR */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-stone-300 font-bold flex items-center gap-1.5">
              <Wine className="w-3.5 h-3.5 text-amber-400" />
              <span>Productos en Happy Hour ({selectedHotel === 'klayman-diamond' ? 'Bar / Terraza Diamond' : 'Sol Bar Olivina'})</span>
            </span>
            <span className="text-[10px] text-stone-500">
              {hhLiveStatus.promoActiva?.productosIncluidos.length || 0} artículos con tarifa especial
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(hhLiveStatus.promoActiva?.productosIncluidos || []).map((prod) => (
              <div 
                key={prod.id}
                onClick={() => onOpenProductDetail && onOpenProductDetail(prod.id, prod.nombre)}
                className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-all flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-mono font-bold text-stone-200 group-hover:text-amber-300 truncate">
                    {prod.nombre}
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500">
                    Tarifa regular: <span className="line-through">{prod.precioNormal.toFixed(2)} €</span>
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono font-bold text-xs">
                    {prod.precioPromocional.toFixed(2)} €
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 block">
                    {hhLiveStatus.isActivo ? 'Tarifa Activa' : 'Tarifa HH'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BLOQUE DE PRÓXIMA PROMOCIÓN PROGRAMADA */}
      {nextPromoInfo.promocion && (
        <div className="rounded-2xl bg-stone-900/80 border border-stone-800 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Próxima Promoción en Calendario
              </span>
              <h3 className="text-sm font-display font-bold text-stone-100 truncate">
                {nextPromoInfo.promocion.nombre}
              </h3>
              <p className="text-xs font-mono text-stone-400">
                {nextPromoInfo.mensaje} · {nextPromoInfo.promocion.hotel} ({nextPromoInfo.promocion.centroVenta})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono font-bold text-amber-300">
              {nextPromoInfo.promocion.precioPromocionalTexto}
            </span>
            <button
              onClick={() => setExpandedPromoId(expandedPromoId === nextPromoInfo.promocion?.id ? null : nextPromoInfo.promocion?.id || null)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Ver detalle"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. LISTADO PRINCIPAL DE PROMOCIONES AUDITADAS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <h3 className="text-sm font-display font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Ofertas Oficiales {selectedHotel === 'klayman-diamond' ? 'Klayman Diamond' : 'Klayman Olivina'} ({filteredPromotions.length})</span>
          </h3>
          <span className="text-xs font-mono text-stone-500">
            Catálogo personalizado e independiente
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPromotions.map((promo) => {
            const estadoCalculado = calcularEstadoPromocion(promo, currentTime);
            const isExpanded = expandedPromoId === promo.id;

            return (
              <div
                key={promo.id}
                className="rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/60 p-4 transition-all shadow-md flex flex-col justify-between gap-3 group"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Estado dinámico: Activa / Programada / Finalizada */}
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] uppercase border ${
                        estadoCalculado === 'Activa'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse'
                          : estadoCalculado === 'Programada'
                          ? 'bg-sky-950 text-sky-300 border-sky-800'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}>
                        ● {estadoCalculado}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-stone-950 text-amber-400 border border-amber-900/60 font-mono text-[10px] font-bold">
                        {promo.hotel}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-lg bg-stone-950 border border-amber-500/40 text-amber-400 font-mono font-bold text-xs shadow-sm">
                        {promo.precioPromocionalTexto}
                      </span>
                    </div>
                  </div>

                  {/* Nombre y Centro de Venta */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                      {promo.nombre}
                    </h4>
                    <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      <span>{promo.centroVenta}</span>
                    </span>
                  </div>

                  {/* Fechas y Horarios */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-stone-950/70 border border-stone-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-stone-500 text-[9px] uppercase block">Días & Horario</span>
                      <span className="text-stone-200 font-semibold">{promo.diasTexto}</span>
                      <span className="text-amber-400 block text-[10px]">{promo.horaInicio} - {promo.horaFin} h</span>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[9px] uppercase block">Vigencia</span>
                      <span className="text-stone-300">{promo.fechaInicio.split('-')[0]}</span>
                      <span className="text-[10px] text-stone-400 block">Hasta {promo.fechaFin}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 font-sans leading-relaxed">
                    {promo.descripcion}
                  </p>
                </div>

                {/* Relación con Productos Incluidos (Desplegable) */}
                <div className="border-t border-stone-800/80 pt-2.5 space-y-2">
                  <button
                    onClick={() => setExpandedPromoId(isExpanded ? null : promo.id)}
                    className="w-full flex items-center justify-between text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-amber-400" />
                      <span>Productos Incluidos ({promo.productosIncluidos.length})</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-1.5 pt-1 animate-fadeIn">
                      {promo.productosIncluidos.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => onOpenProductDetail && onOpenProductDetail(prod.id, prod.nombre)}
                          className="p-2 rounded-lg bg-stone-950/90 border border-stone-800/90 hover:border-amber-500/50 flex items-center justify-between gap-2 text-xs font-mono cursor-pointer transition-all"
                        >
                          <span className="text-stone-300 hover:text-amber-300 truncate">
                            {prod.nombre}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-stone-500 line-through text-[10px]">
                              {prod.precioNormal.toFixed(2)} €
                            </span>
                            <span className="font-bold text-emerald-400 text-xs">
                              {prod.precioPromocional.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Condiciones y Procedimiento TPV */}
                      <div className="mt-2 p-2.5 rounded-lg bg-stone-950 border border-stone-800/80 text-[10.5px] font-mono text-stone-400 space-y-1">
                        <strong className="text-stone-300 block">Condición de aplicación:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {promo.condiciones.slice(0, 2).map((cond, cIdx) => (
                            <li key={cIdx} className="leading-snug">{cond}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
