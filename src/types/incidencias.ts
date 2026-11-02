/**
 * FASE 10 – ENTIDAD OFICIAL DE INCIDENCIAS Y FALTANTES
 * Klayman Hospitality Management (Diamond & Olivina)
 */

export type TipoIncidencia = 'incidencia' | 'faltante_stock' | 'averia_tecnica' | 'servicio';
export type GravedadIncidencia = 'baja' | 'media' | 'urgente';
export type EstadoIncidencia = 'abierta' | 'en_proceso' | 'resuelta';

export interface IncidenciaEntity {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoIncidencia;
  gravedad: GravedadIncidencia;
  estado: EstadoIncidencia;
  fecha: string;             // YYYY-MM-DD
  hora: string;              // HH:mm
  hotel: 'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos';
  hotelId: 'klayman-diamond' | 'klayman-olivina' | 'todos';
  centroVenta: string;       // 'Bar / Terraza Diamond', 'Sol Bar Olivina', etc.
  reportadoPor: string;      // Nombre y rol del empleado
  productoAfectado?: string; // Nombre del producto o ingrediente si aplica
  accionTomada?: string;
  fotoUrl?: string;
  resueltaAt?: string;
  resueltaPor?: string;
}

export interface IncidenciasSummaryStats {
  incidenciasAbiertas: number;
  faltantesPendientes: number;
  incidenciasUrgentes: number;
  totalReportadas: number;
}
