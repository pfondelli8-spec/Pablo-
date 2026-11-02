/**
 * FASE 8 – ENTIDAD OFICIAL DE EVENTOS Y CALENDARIO OPERATIVO
 * Klayman Hospitality Management (Diamond & Olivina)
 */

export type EventStatus = 'Programado' | 'Activo' | 'Finalizado' | 'Cancelado';
export type EventPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type EventType = 'Operativo' | 'Comercial' | 'Formación' | 'Animación' | 'Dirección';

export interface EventAttachment {
  id: string;
  name: string;
  type: 'foto' | 'pdf' | 'instruccion';
  url: string;
  size?: string;
  uploadedAt?: string;
}

export interface EventProductLink {
  id: string;
  nombre: string;
  precio?: number;
  categoria?: string;
}

export interface EventPromotionLink {
  id: string;
  nombre: string;
  descuento?: string;
}

export interface EventProcedureLink {
  id: string;
  titulo: string;
  codigo?: string;
}

export interface EventoEntity {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;               // YYYY-MM-DD
  horaInicio: string;          // HH:mm
  horaFin: string;             // HH:mm
  hotel: 'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos';
  hotelId: 'klayman-diamond' | 'klayman-olivina' | 'todos';
  centroVenta: string;         // 'Bar / Terraza Diamond', 'Sol Bar Olivina', 'Restaurante', etc.
  outletId: string;
  responsable: string;
  estado: EventStatus;
  prioridad: EventPriority;
  tipo: EventType;
  imagen?: string;
  observacionesOperativas?: string;

  // Vinculaciones obligatorias de la FASE 8
  productosVinculados?: EventProductLink[];
  promocionesVinculadas?: EventPromotionLink[];
  happyHourVinculado?: boolean;
  procedimientosEspeciales?: EventProcedureLink[];

  // Adjuntos (Fotografías, PDFs, Instrucciones)
  adjuntos?: EventAttachment[];
}

export interface EventSummaryStats {
  eventosHoy: number;
  eventosProximos: number;
  eventosActivos: number;
  eventosCriticos: number;
  totalEventos: number;
}
