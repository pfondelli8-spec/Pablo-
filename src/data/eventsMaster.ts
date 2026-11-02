/**
 * FASE 8 – MÓDULO MAESTRO DE EVENTOS Y CALENDARIO OPERATIVO
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import { EventoEntity, EventStatus, EventSummaryStats, EventAttachment } from '../types/events';

const STORAGE_KEY = 'klayman_operaciones_eventos_master';

/**
 * Catálogo Base Oficial de Eventos del Grupo Klayman
 */
export const INITIAL_EVENTS_DATABASE: EventoEntity[] = [
  // 1. EVENTO HOY 1: Formación de Coctelería IBA y Estandarización de Jigger
  {
    id: 'evt-2026-10-01-01',
    titulo: 'Taller Técnico: Dosificación con Jigger y Estandarización IBA',
    descripcion: 'Sesión práctica obligatoria para el equipo de barra y terraza sobre control milimétrico de pour cost (jigger 50/25 ml) y mise en place de speed rail según Módulo 3 y 5.',
    fecha: '2026-10-01',
    horaInicio: '13:30',
    horaFin: '15:00',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    responsable: 'Eugenia (F&B Manager)',
    estado: 'Programado',
    prioridad: 'Crítica',
    tipo: 'Formación',
    imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    observacionesOperativas: 'Revisión obligatoria de cristalería, cubos macizos de hielo y etiquetas FIFO en neveras de contrabarra.',
    productosVinculados: [
      { id: 'item-ckt-03-mojito-tradicional', nombre: 'Mojito Tradicional', precio: 8.50 },
      { id: 'item-ckt-06-margarita-tradicional', nombre: 'Margarita Tradicional', precio: 8.50 },
      { id: 'item-ckt-20-aperol-spritz', nombre: 'Aperol Spritz', precio: 8.50 }
    ],
    promocionesVinculadas: [
      { id: 'promo-dia-hh-sunset', nombre: 'Happy Hour Diario (15:00 a 16:00 h)', descuento: '2 Cócteles 12€ | 2 Jarras 6€' }
    ],
    happyHourVinculado: true,
    procedimientosEspeciales: [
      { id: 'proc-apertura-barra', titulo: 'Protocolo de Apertura de Barra y Puesta a Punto', codigo: 'SOP-BAR-01' },
      { id: 'proc-inventario', titulo: 'Control de Dosificación con Jigger y Pour Cost', codigo: 'SOP-BAR-03' }
    ],
    adjuntos: [
      {
        id: 'att-01',
        name: 'Manual_Estandares_Servicio_F&B.pdf',
        type: 'pdf',
        url: '#',
        size: '1.4 MB',
        uploadedAt: '01/10/2026 09:00'
      },
      {
        id: 'att-02',
        name: 'Guia_Dosificacion_Jigger_IBA.png',
        type: 'foto',
        url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        size: '850 KB',
        uploadedAt: '01/10/2026 09:30'
      },
      {
        id: 'att-03',
        name: 'Instrucciones_Corte_Citricos_Garnish.txt',
        type: 'instruccion',
        url: '#',
        size: '12 KB',
        uploadedAt: '01/10/2026 10:00'
      }
    ]
  },

  // 2. EVENTO HOY 2: Sunset Live Acoustic & Cócteles de Autor
  {
    id: 'evt-2026-10-01-02',
    titulo: 'Sunset Live Acoustic & Coctelería Signature',
    descripcion: 'Actuación musical en directo en la terraza panorámica durante la puesta de sol con servicio especial de cócteles insignia (Blue Diamond y Sunset Spritz) y Happy Hour.',
    fecha: '2026-10-01',
    horaInicio: '17:30',
    horaFin: '20:30',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    responsable: 'Jefatura de Sala & Animación',
    estado: 'Programado',
    prioridad: 'Alta',
    tipo: 'Animación',
    imagen: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    observacionesOperativas: 'Refuerzo de personal en terraza de 17:00 a 21:00 h. Montaje de velas led y pinzas sujeta-cartas en mesas exteriores.',
    productosVinculados: [
      { id: 'item-ckt-02-blue-diamond', nombre: 'Blue Diamond Sunset', precio: 9.50 },
      { id: 'item-ckt-24-porn-star-martini', nombre: 'Porn Star Martini', precio: 9.50 }
    ],
    promocionesVinculadas: [
      { id: 'promo-dia-hh-sunset', nombre: 'Happy Hour Diario (15:00 a 16:00 h)', descuento: '2 Cócteles 12€ | 2 Jarras 6€' }
    ],
    happyHourVinculado: true,
    procedimientosEspeciales: [
      { id: 'proc-atencion-cliente', titulo: 'Estándares de Servicio y Tiempo SLA en Terraza', codigo: 'SOP-SALA-02' }
    ],
    adjuntos: [
      {
        id: 'att-04',
        name: 'Rider_Acustico_Terraza.pdf',
        type: 'pdf',
        url: '#',
        size: '520 KB',
        uploadedAt: '01/10/2026 11:00'
      }
    ]
  },

  // 3. EVENTO ESTA SEMANA: Auditoría Semanal de APPCC y Calibración de Neveras
  {
    id: 'evt-2026-10-02-01',
    titulo: 'Auditoría Higiénico-Sanitaria APPCC & Calibración de Frío',
    descripcion: 'Inspección técnica de temperaturas en cámaras y vitrinas de barra (1ºC a 4ºC), rotulado FIFO de zumos y descarte de cítricos de jornada anterior.',
    fecha: '2026-10-02',
    horaInicio: '09:00',
    horaFin: '11:00',
    hotel: 'Ambos Establecimientos',
    hotelId: 'todos',
    centroVenta: 'Bar / Terraza Diamond & Sol Bar Olivina',
    outletId: 'diamond-bar-terraza',
    responsable: 'Alexis (Calidad & APPCC)',
    estado: 'Programado',
    prioridad: 'Crítica',
    tipo: 'Operativo',
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    observacionesOperativas: 'Tener a mano los termómetros sonda calibrados y las hojas de registro de control matutino.',
    procedimientosEspeciales: [
      { id: 'proc-limpieza-cierre', titulo: 'Protocolo APPCC de Higienización y Cierre de Líneas', codigo: 'SOP-APPCC-04' }
    ],
    adjuntos: [
      {
        id: 'att-05',
        name: 'Checklist_Auditoria_APPCC.pdf',
        type: 'pdf',
        url: '#',
        size: '340 KB',
        uploadedAt: '30/09/2026'
      }
    ]
  },

  // 4. EVENTO ESTA SEMANA: Tardeo Canario y Degustación de Quesos en Olivina
  {
    id: 'evt-2026-10-03-01',
    titulo: 'Tardeo Canario: Maridaje de Quesos Artesanales & Vinos de Tenerife',
    descripcion: 'Presentación especial de la Tabla de Quesos con D.O. de Tenerife acompañada de cata guiada de Tajinaste y vino blanco volcánico en la azotea de Olivina.',
    fecha: '2026-10-03',
    horaInicio: '14:00',
    horaFin: '17:30',
    hotel: 'Klayman Olivina',
    hotelId: 'klayman-olivina',
    centroVenta: 'Sol Bar Olivina',
    outletId: 'olivina-bar-sol',
    responsable: 'Maitrê Sol Bar & Eugenia',
    estado: 'Programado',
    prioridad: 'Alta',
    tipo: 'Comercial',
    imagen: 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=1200&q=80',
    observacionesOperativas: 'Cortar los quesos a 16ºC para máxima expresión de aromas. Disponer de nueces, tostas y confitura de higo canario.',
    productosVinculados: [
      { id: 'ft-dia-cheese-board', nombre: 'Tabla de Quesos Artesanales de Tenerife', precio: 14.50 },
      { id: 'item-vino-blanco', nombre: 'Vino Blanco Canario D.O.', precio: 4.50 }
    ],
    promocionesVinculadas: [
      { id: 'promo-oli-tardeo-papas', nombre: 'Tardeo Canario: Papas Arrugadas + Caña', descuento: '5,50 €' }
    ],
    adjuntos: [
      {
        id: 'att-06',
        name: 'Ficha_Cata_Quesos_Canarios.pdf',
        type: 'pdf',
        url: '#',
        size: '720 KB',
        uploadedAt: '01/10/2026'
      }
    ]
  },

  // 5. EVENTO PRÓXIMO: Comité Mensual de Dirección F&B y Revisión de Inventarios
  {
    id: 'evt-2026-10-08-01',
    titulo: 'Comité de Dirección F&B: Cuadre de Mermas y Cierres Mensuales',
    descripcion: 'Reunión directiva con Jefatura de Cocina, Sala y Dirección para evaluar las desviaciones de consumo teórico vs TPV (<2% de tolerancia) y ratios de rentabilidad.',
    fecha: '2026-10-08',
    horaInicio: '10:30',
    horaFin: '12:30',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Sala de Conferencia / Dirección',
    outletId: 'diamond-restaurante',
    responsable: 'Dirección de Operaciones & Eugenia',
    estado: 'Programado',
    prioridad: 'Media',
    tipo: 'Dirección',
    imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    observacionesOperativas: 'Tener impreso el balance de ventas de TPV Ágora cruzado con los albaranes de entrada de almacén.'
  },

  // 6. EVENTO PRÓXIMO: Masterclass de Cafetería y Barraquito Canario
  {
    id: 'evt-2026-10-15-01',
    titulo: 'Masterclass: Técnica por Capas del Barraquito Especial Canario',
    descripcion: 'Entrenamiento intensivo para personal de nuevo ingreso en la técnica perfecta de 5 capas: leche condensada, Licor 43, café espresso, espuma de leche y canela/limón.',
    fecha: '2026-10-15',
    horaInicio: '11:00',
    horaFin: '12:30',
    hotel: 'Ambos Establecimientos',
    hotelId: 'todos',
    centroVenta: 'Bar Diamond / Sol Bar Olivina',
    outletId: 'diamond-bar-terraza',
    responsable: 'Barista Principal Klayman',
    estado: 'Programado',
    prioridad: 'Media',
    tipo: 'Formación',
    imagen: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    productosVinculados: [
      { id: 'ft-dia-barraquito', nombre: 'Barraquito Especial Canario', precio: 3.80 }
    ],
    procedimientosEspeciales: [
      { id: 'proc-recetario-barra', titulo: 'Recetario Técnico de Cafetería y Cócteles', codigo: 'SOP-REC-02' }
    ]
  },

  // 7. EVENTO FINALIZADO 1: Puesta a Punto de Sombrillas y Mobiliario de Solárium
  {
    id: 'evt-2026-09-25-01',
    titulo: 'Puesta a Punto de Sombrillas, Toldos y Forros de Terraza',
    descripcion: 'Revisión estructural previa a temporada alta de toldos correderos, anclajes de seguridad contra viento y protocolo nocturno de doblado de forros.',
    fecha: '2026-09-25',
    horaInicio: '08:00',
    horaFin: '12:00',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    responsable: 'Mantenimiento & Sala',
    estado: 'Finalizado',
    prioridad: 'Media',
    tipo: 'Operativo',
    observacionesOperativas: 'Completado con éxito. Se reemplazaron dos pinzas de fijación en el ala norte.'
  },

  // 8. EVENTO FINALIZADO 2: Lanzamiento de Carta Digital de Terraza
  {
    id: 'evt-2026-09-28-01',
    titulo: 'Lanzamiento de Nueva Carta de Terraza y Despliegue de QR',
    descripcion: 'Colocación de soportes QR higienizados en mesas de bar y verificación de precios coincidentes con TPV Ágora ERP.',
    fecha: '2026-09-28',
    horaInicio: '15:00',
    horaFin: '18:00',
    hotel: 'Ambos Establecimientos',
    hotelId: 'todos',
    centroVenta: 'Bar Diamond / Sol Bar Olivina',
    outletId: 'diamond-bar-terraza',
    responsable: 'Marketing & F&B',
    estado: 'Finalizado',
    prioridad: 'Alta',
    tipo: 'Comercial',
    observacionesOperativas: 'QRs verificados con enlace directo al portal interno y cartas sincronizadas.'
  }
];

/**
 * Cargar eventos desde localStorage con fallback al catálogo base
 */
export function getStoredEvents(): EventoEntity[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS_DATABASE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS_DATABASE));
      return INITIAL_EVENTS_DATABASE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer eventos de localStorage:', err);
    return INITIAL_EVENTS_DATABASE;
  }
}

/**
 * Guardar eventos en localStorage
 */
export function saveStoredEvents(events: EventoEntity[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event('klayman_events_updated'));
  } catch (err) {
    console.error('Error al guardar eventos en localStorage:', err);
  }
}

/**
 * Convierte 'HH:mm' a minutos
 */
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Calcula dinámicamente el estado de un evento: Programado, Activo, Finalizado, Cancelado
 */
export function calcularEstadoEvento(evento: EventoEntity, now: Date = new Date()): EventStatus {
  if (evento.estado === 'Cancelado') return 'Cancelado';

  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (todayStr < evento.fecha) {
    return 'Programado';
  }

  if (todayStr > evento.fecha) {
    return 'Finalizado';
  }

  // Mismo día: comprobar horas
  const startMin = timeToMinutes(evento.horaInicio);
  const endMin = timeToMinutes(evento.horaFin);

  if (currentMinutes < startMin) {
    return 'Programado';
  } else if (currentMinutes >= startMin && currentMinutes <= endMin) {
    return 'Activo';
  } else {
    return 'Finalizado';
  }
}

/**
 * VISTA 1: Eventos Hoy
 */
export function getEventosHoy(events: EventoEntity[], now: Date = new Date()): EventoEntity[] {
  const todayStr = now.toISOString().split('T')[0];
  return events.filter(e => e.fecha === todayStr && e.estado !== 'Cancelado');
}

/**
 * VISTA 2: Eventos Esta Semana (próximos 7 días)
 */
export function getEventosEstaSemana(events: EventoEntity[], now: Date = new Date()): EventoEntity[] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const todayStr = today.toISOString().split('T')[0];
  const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

  return events.filter(e => {
    return e.fecha >= todayStr && e.fecha <= endOfWeekStr && e.estado !== 'Cancelado';
  });
}

/**
 * VISTA 3: Próximos eventos (a partir de hoy en adelante, no finalizados)
 */
export function getEventosProximos(events: EventoEntity[], now: Date = new Date()): EventoEntity[] {
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return events.filter(e => {
    if (e.estado === 'Cancelado' || e.estado === 'Finalizado') return false;
    if (e.fecha > todayStr) return true;
    if (e.fecha === todayStr) {
      return timeToMinutes(e.horaFin) >= currentMinutes;
    }
    return false;
  }).sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.horaInicio.localeCompare(b.horaInicio);
  });
}

/**
 * VISTA 4: Eventos Finalizados
 */
export function getEventosFinalizados(events: EventoEntity[], now: Date = new Date()): EventoEntity[] {
  return events.filter(e => {
    if (e.estado === 'Finalizado') return true;
    const estadoCalc = calcularEstadoEvento(e, now);
    return estadoCalc === 'Finalizado';
  });
}

/**
 * Resumen de métricas para el Panel Resumen
 */
export function getResumenEventos(events: EventoEntity[], now: Date = new Date()): EventSummaryStats {
  const hoy = getEventosHoy(events, now);
  const proximos = getEventosProximos(events, now);
  
  const activos = events.filter(e => calcularEstadoEvento(e, now) === 'Activo');
  const criticos = events.filter(e => e.prioridad === 'Crítica' && calcularEstadoEvento(e, now) !== 'Finalizado' && e.estado !== 'Cancelado');

  return {
    eventosHoy: hoy.length,
    eventosProximos: proximos.length,
    eventosActivos: activos.length,
    eventosCriticos: criticos.length,
    totalEventos: events.length
  };
}

/**
 * Alertas automáticas para un evento
 */
export type EventAlertTiming = 
  | 'comienza_en_60_min' 
  | 'comienza_en_30_min' 
  | 'activo' 
  | 'ninguna';

export function evaluarAlertaEvento(evento: EventoEntity, now: Date = new Date()): {
  timing: EventAlertTiming;
  mensaje: string;
  minutosRestantes: number | null;
} {
  const todayStr = now.toISOString().split('T')[0];
  if (evento.fecha !== todayStr) {
    return { timing: 'ninguna', mensaje: '', minutosRestantes: null };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMin = timeToMinutes(evento.horaInicio);
  const endMin = timeToMinutes(evento.horaFin);

  // 1. Activo
  if (currentMinutes >= startMin && currentMinutes <= endMin) {
    const rest = endMin - currentMinutes;
    return {
      timing: 'activo',
      mensaje: `¡Evento activo en este momento! Finaliza a las ${evento.horaFin} h (${rest} min restantes).`,
      minutosRestantes: rest
    };
  }

  // 2. Comienza en 30 minutos o menos
  if (currentMinutes < startMin && (startMin - currentMinutes) <= 30) {
    const diff = startMin - currentMinutes;
    return {
      timing: 'comienza_en_30_min',
      mensaje: `El evento "${evento.titulo}" comienza en ${diff} minutos (a las ${evento.horaInicio} h).`,
      minutosRestantes: diff
    };
  }

  // 3. Comienza en 60 minutos o menos
  if (currentMinutes < startMin && (startMin - currentMinutes) <= 60) {
    const diff = startMin - currentMinutes;
    return {
      timing: 'comienza_en_60_min',
      mensaje: `El evento "${evento.titulo}" comienza en ${diff} minutos (a las ${evento.horaInicio} h).`,
      minutosRestantes: diff
    };
  }

  return { timing: 'ninguna', mensaje: '', minutosRestantes: null };
}

/**
 * Obtener todas las alertas operativas automáticas activas en este instante
 */
export function getTodasLasAlertasEventos(events: EventoEntity[], now: Date = new Date()): Array<{
  evento: EventoEntity;
  timing: EventAlertTiming;
  mensaje: string;
  minutosRestantes: number | null;
}> {
  const alertas: Array<{
    evento: EventoEntity;
    timing: EventAlertTiming;
    mensaje: string;
    minutosRestantes: number | null;
  }> = [];

  events.forEach(evento => {
    if (evento.estado === 'Cancelado') return;
    const res = evaluarAlertaEvento(evento, now);
    if (res.timing !== 'ninguna') {
      alertas.push({
        evento,
        timing: res.timing,
        mensaje: res.mensaje,
        minutosRestantes: res.minutosRestantes
      });
    }
  });

  return alertas;
}

/**
 * Crear un nuevo evento en localStorage
 */
export function addStoredEvent(evento: EventoEntity): EventoEntity[] {
  const current = getStoredEvents();
  const updated = [evento, ...current];
  saveStoredEvents(updated);
  return updated;
}

/**
 * Actualizar un evento existente
 */
export function updateStoredEvent(evento: EventoEntity): EventoEntity[] {
  const current = getStoredEvents();
  const updated = current.map(e => e.id === evento.id ? evento : e);
  saveStoredEvents(updated);
  return updated;
}

/**
 * Eliminar un evento
 */
export function deleteStoredEvent(id: string): EventoEntity[] {
  const current = getStoredEvents();
  const updated = current.filter(e => e.id !== id);
  saveStoredEvents(updated);
  return updated;
}

/**
 * Adjuntar un documento (foto, pdf, instrucción) a un evento
 */
export function addAttachmentToEvent(eventId: string, attachment: EventAttachment): EventoEntity[] {
  const current = getStoredEvents();
  const updated = current.map(e => {
    if (e.id === eventId) {
      const adjuntos = e.adjuntos ? [...e.adjuntos, attachment] : [attachment];
      return { ...e, adjuntos };
    }
    return e;
  });
  saveStoredEvents(updated);
  return updated;
}

/**
 * Eliminar un adjunto de un evento
 */
export function removeAttachmentFromEvent(eventId: string, attachmentId: string): EventoEntity[] {
  const current = getStoredEvents();
  const updated = current.map(e => {
    if (e.id === eventId && e.adjuntos) {
      return {
        ...e,
        adjuntos: e.adjuntos.filter(a => a.id !== attachmentId)
      };
    }
    return e;
  });
  saveStoredEvents(updated);
  return updated;
}

/**
 * Restaurar catálogo oficial predeterminado de eventos
 */
export function resetStoredEventsToDefault(): EventoEntity[] {
  saveStoredEvents(INITIAL_EVENTS_DATABASE);
  return INITIAL_EVENTS_DATABASE;
}
