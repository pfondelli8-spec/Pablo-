/**
 * F&B OPERATIONS MASTER - TIPOS DE DATOS OPERATIVOS
 * Sistema integral de operaciones, registros APPCC, checklists, documentación y supervisión
 */

export type UserRole = 'trabajador' | 'supervisor' | 'responsable_fnb' | 'direccion';

export type ShiftType = 'manana' | 'tarde' | 'noche' | 'partido';

export type StationType = 
  | 'Bar Piscina' 
  | 'Terraza Principal' 
  | 'Restaurante Buffet' 
  | 'Cocktails Lounge' 
  | 'Cafetería & Desayunos' 
  | 'Cocina / Office';

// ==========================================
// REGISTROS DE TEMPERATURAS APPCC
// ==========================================

export interface TemperatureEquipmentDef {
  id: string;
  name: string;
  category: 'refrigeracion' | 'congelacion' | 'vitrina' | 'maquina_hielo' | 'calor';
  location: string;
  tempMin: number;
  tempMax: number;
  criticalLimit: number;
  unit: 'ºC';
  description?: string;
}

export interface TemperatureLogEntry {
  id: string;
  equipmentId: string;
  equipmentName: string;
  location: string;
  recordedTemp: number;
  tempMin: number;
  tempMax: number;
  isOutOfRange: boolean;
  correctiveAction?: string;
  assignedFollowUpMinutes?: number;
  followUpStatus?: 'pendiente' | 'completado' | 'escalado';
  recordedBy: string;
  workerRole: string;
  timestamp: string; // ISO
  dateStr: string;   // YYYY-MM-DD
  timeStr: string;   // HH:mm
  shift: ShiftType;
  supervisorSignature?: string;
  supervisorVerifiedAt?: string;
  notes?: string;
  photoUrl?: string;
}

// ==========================================
// REGISTROS DE LIMPIEZA Y DESINFECCIÓN
// ==========================================

export type CleaningFrequency = 'diaria' | 'semanal' | 'quincenal' | 'mensual';

export interface CleaningTaskDef {
  id: string;
  area: StationType | string;
  surfaceOrEquipment: string;
  frequency: CleaningFrequency;
  approvedChemical: string;
  dosageInstructions: string;
  contactTimeMinutes: number;
  safetyEquipment: string[]; // EPIs: ej. Guantes de nitrilo, Gafas de protección
  procedureSummary: string;
}

export interface CleaningLogEntry {
  id: string;
  taskId: string;
  surfaceOrEquipment: string;
  area: string;
  frequency: CleaningFrequency;
  approvedChemical: string;
  completed: boolean;
  completedBy: string;
  completedAt: string; // ISO
  dateStr: string;
  shift: ShiftType;
  observations?: string;
  photoEvidence?: string;
  verifiedBySupervisor: boolean;
  supervisorName?: string;
  supervisorVerifiedAt?: string;
}

// ==========================================
// CHECKLISTS DE APERTURA Y CIERRE
// ==========================================

export interface ChecklistTaskItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  category: string;
  notes?: string;
}

export interface ShiftChecklistRecord {
  id: string;
  type: 'apertura' | 'cierre' | 'servicio';
  station: StationType | string;
  shift: ShiftType;
  dateStr: string;
  timeStr: string;
  completedBy: string;
  workerRole: string;
  items: ChecklistTaskItem[];
  conforme: boolean;
  ticketZNumero?: string;
  cashDifference?: number;
  observations?: string;
  supervisorVerified: boolean;
  supervisorName?: string;
}

// ==========================================
// COMUNICACIONES E INCIDENCIAS
// ==========================================

export type IncidentCategory = 
  | 'averia_tecnica' 
  | 'faltante_stock' 
  | 'rotura_material' 
  | 'seguridad_appcc' 
  | 'servicio_cliente' 
  | 'mantenimiento';

export type IncidentPriority = 'baja' | 'media' | 'urgente';

export type IncidentStatus = 'nueva' | 'asignada' | 'en_curso' | 'pendiente_verificacion' | 'cerrada';

export interface IncidentActionLog {
  id: string;
  author: string;
  role: string;
  action: string;
  timestamp: string;
  statusAfter: IncidentStatus;
}

export interface OperationalIncident {
  id: string;
  ticketCode: string; // ej. INC-20261024-001
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  station: StationType | string;
  reportedBy: string;
  assignedTo?: string;
  photoUrl?: string;
  reportedAt: string; // ISO
  dateStr: string;
  resolvedAt?: string;
  resolvedBy?: string;
  actionTaken?: string;
  history: IncidentActionLog[];
}

export interface ManagementAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'destacado' | 'urgente';
  publishedBy: string;
  publishedAt: string;
  dateStr: string;
  category: 'procedimiento' | 'carta' | 'servicio' | 'sanidad' | 'general';
  requireReadConfirmation: boolean;
  readByUsers: { userId: string; userName: string; readAt: string }[];
}

// ==========================================
// TAREAS DEL TURNO
// ==========================================

export interface ShiftTask {
  id: string;
  title: string;
  description?: string;
  station: StationType | string;
  shift: ShiftType;
  assignedTo?: string;
  priority: 'alta' | 'media' | 'rutinaria';
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

// ==========================================
// AUDITORÍA Y KPIs DE SUPERVISIÓN
// ==========================================

export interface SupervisionKPIs {
  temperaturesCompletedToday: number;
  temperaturesRequiredToday: number;
  outOfRangeAlertsPending: number;
  cleaningCompletedToday: number;
  cleaningRequiredToday: number;
  cleaningPendingVerification: number;
  openIncidentsCount: number;
  urgentIncidentsCount: number;
  shiftChecklistCompleted: boolean;
}
