/**
 * FASE 11 – TIPOS PARA CONTROL OPERATIVO, CHECKLISTS DIGITALES Y TRAZABILIDAD
 * Klayman Hospitality Management (Diamond & Olivina)
 */

export type TipoChecklist = 
  | 'apertura' 
  | 'cierre' 
  | 'appcc' 
  | 'higienico_sanitario' 
  | 'calibracion_frio' 
  | 'revision_operativa';

export interface ChecklistItemDef {
  id: string;
  label: string;
  checked: boolean;
  required?: boolean;
  category?: string;
  temperatureValue?: number; // Para calibraciones térmicas (ej: +3.5ºC)
  notes?: string;
}

export interface ChecklistRecord {
  id: string;
  numeroRegistro: string; // ej. 'REG-20261001-001'
  tipo: TipoChecklist;
  tipoLabel: string;
  fecha: string;          // YYYY-MM-DD
  hora: string;           // HH:mm
  timestamp: string;      // ISO
  hotel: 'Klayman Diamond' | 'Klayman Olivina';
  hotelId: 'klayman-diamond' | 'klayman-olivina';
  area: string;           // 'Bar / Terraza Diamond', 'Sol Bar Olivina', 'Cocina', etc.
  empleadoResponsable: string;
  items: ChecklistItemDef[];
  totalItems: number;
  itemsCompletados: number;
  porcentajeConformidad: number;
  conforme: boolean;      // 100% de ítems críticos
  observaciones?: string;
  fotografias: string[];  // Base64 o URLs de fotos tomadas
  enviadoWhatsApp: boolean;
  enviadoEmail: boolean;
  emailDestinatario?: string;
  ticketZNumero?: string; // Opcional para checklist de cierre
}

export interface ControlOperativoStats {
  totalRegistros: number;
  registrosHoy: number;
  aperturasHoy: number;
  cierresHoy: number;
  auditoriasAPPCC: number;
  calibracionesFrio: number;
  conformidadMedia: number;
}
