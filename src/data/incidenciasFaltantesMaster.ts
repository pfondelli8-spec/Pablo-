/**
 * FASE 10 – CATÁLOGO MAESTRO Y SERVICIO DE INCIDENCIAS Y FALTANTES
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import { IncidenciaEntity, IncidenciasSummaryStats } from '../types/incidencias';

const STORAGE_KEY = 'klayman_incidencias_faltantes_data';

export const INITIAL_INCIDENCIAS_DATABASE: IncidenciaEntity[] = [
  // 1. FALTANTE URGENTE EN BAR DIAMOND
  {
    id: 'inc-2026-10-01-01',
    titulo: 'Agotado Sirope de Maracuyá para Porn Star Martini',
    descripcion: 'Se ha agotado el stock del sirope de maracuyá en la contrabarra. Es ingrediente crítico obligatorio de la ficha técnica FT-CKT-24 (Porn Star Martini). Solicitar reposición urgente a economato antes de las 17:00 h.',
    tipo: 'faltante_stock',
    gravedad: 'urgente',
    estado: 'abierta',
    fecha: '2026-10-01',
    hora: '11:30',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    reportadoPor: 'Carlos Mendoza (Bartender)',
    productoAfectado: 'Porn Star Martini (FT-CKT-24)',
    fotoUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    accionTomada: 'Notificado a Economato / Laura Betancor para retirada de almacén central.'
  },

  // 2. INCIDENCIA URGENTE DE INSTALACIONES EN TERRAZA
  {
    id: 'inc-2026-10-01-02',
    titulo: 'Anclaje de sombrilla mesa 14 desajustado por racha de viento',
    descripcion: 'El anclaje metálico del suelo en la sombrilla de la mesa 14 exterior presenta holgura. Plegada preventivamente para evitar accidentes con clientes durante la tarde.',
    tipo: 'averia_tecnica',
    gravedad: 'urgente',
    estado: 'en_proceso',
    fecha: '2026-10-01',
    hora: '09:15',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    reportadoPor: 'Juanito Suárez (Jefe de Sala)',
    accionTomada: 'Mantenimiento avisado (Ext. 9000). Pendiente de reapriete de tornillería.'
  },

  // 3. FALTANTE PENDIENTE EN CAFETERÍA
  {
    id: 'inc-2026-10-01-03',
    titulo: 'Stock bajo de Licor 43 en barra (última botella)',
    descripcion: 'Queda una sola botella en uso para la elaboración del Barraquito Especial Canario. Consumo alto previsto para el turno de sobremesa.',
    tipo: 'faltante_stock',
    gravedad: 'media',
    estado: 'abierta',
    fecha: '2026-10-01',
    hora: '10:45',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    reportadoPor: 'Bartender de Turno',
    productoAfectado: 'Barraquito Especial Canario'
  },

  // 4. INCIDENCIA DE SERVICIO TPV
  {
    id: 'inc-2026-09-30-01',
    titulo: 'Datáfono inalámbrico TPV 2 con batería degradada',
    descripcion: 'El terminal de tarjeta número 2 pierde la carga en menos de 2 horas. Conectado a base fija mientras llega sustitución por soporte técnico bancario.',
    tipo: 'incidencia',
    gravedad: 'media',
    estado: 'abierta',
    fecha: '2026-09-30',
    hora: '18:20',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    reportadoPor: 'Laura Betancor (F&B)'
  },

  // 5. INCIDENCIA RESUELTA: REPOSICIÓN DE HIELO
  {
    id: 'inc-2026-09-29-01',
    titulo: 'Reposición extra de bolsas de hielo macizo para terraza',
    descripcion: 'Pico de demanda por ola de calor. Se solicitaron 10 sacos adicionales al proveedor de frío.',
    tipo: 'faltante_stock',
    gravedad: 'media',
    estado: 'resuelta',
    fecha: '2026-09-29',
    hora: '16:00',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    reportadoPor: 'Carlos Mendoza',
    resueltaAt: '2026-09-29 17:15',
    resueltaPor: 'Eugenia (F&B Manager)',
    accionTomada: 'Entrega directa recibida e introducida en arcón de terraza.'
  }
];

export function getStoredIncidencias(): IncidenciaEntity[] {
  if (typeof window === 'undefined') return INITIAL_INCIDENCIAS_DATABASE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENCIAS_DATABASE));
      return INITIAL_INCIDENCIAS_DATABASE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer incidencias de localStorage:', err);
    return INITIAL_INCIDENCIAS_DATABASE;
  }
}

export function saveStoredIncidencias(list: IncidenciaEntity[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('klayman_incidencias_updated'));
  } catch (err) {
    console.error('Error al guardar incidencias:', err);
  }
}

export function addStoredIncidencia(inc: IncidenciaEntity): IncidenciaEntity[] {
  const current = getStoredIncidencias();
  const updated = [inc, ...current];
  saveStoredIncidencias(updated);
  return updated;
}

export function updateStoredIncidencia(inc: IncidenciaEntity): IncidenciaEntity[] {
  const current = getStoredIncidencias();
  const updated = current.map(item => item.id === inc.id ? inc : item);
  saveStoredIncidencias(updated);
  return updated;
}

export function resolveStoredIncidencia(id: string, resueltaPor: string): IncidenciaEntity[] {
  const current = getStoredIncidencias();
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        estado: 'resuelta' as const,
        resueltaAt: nowStr,
        resueltaPor
      };
    }
    return item;
  });
  saveStoredIncidencias(updated);
  return updated;
}

export function resetStoredIncidenciasToDefault(): IncidenciaEntity[] {
  saveStoredIncidencias(INITIAL_INCIDENCIAS_DATABASE);
  return INITIAL_INCIDENCIAS_DATABASE;
}

export function getIncidenciasAbiertas(list: IncidenciaEntity[]): IncidenciaEntity[] {
  return list.filter(i => i.estado === 'abierta' || i.estado === 'en_proceso');
}

export function getFaltantesPendientes(list: IncidenciaEntity[]): IncidenciaEntity[] {
  return list.filter(i => i.tipo === 'faltante_stock' && (i.estado === 'abierta' || i.estado === 'en_proceso'));
}

export function getIncidenciasUrgentes(list: IncidenciaEntity[]): IncidenciaEntity[] {
  return list.filter(i => i.gravedad === 'urgente' && (i.estado === 'abierta' || i.estado === 'en_proceso'));
}

export function getIncidenciasStats(list: IncidenciaEntity[]): IncidenciasSummaryStats {
  const abiertas = getIncidenciasAbiertas(list);
  const faltantes = getFaltantesPendientes(list);
  const urgentes = getIncidenciasUrgentes(list);

  return {
    incidenciasAbiertas: abiertas.length,
    faltantesPendientes: faltantes.length,
    incidenciasUrgentes: urgentes.length,
    totalReportadas: list.length
  };
}
