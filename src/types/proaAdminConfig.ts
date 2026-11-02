/**
 * PROA — MODELOS DE DATOS DEL PANEL DE ADMINISTRACIÓN Y CONFIGURACIÓN OPERATIVA
 * Soporta jerarquía completa:
 * Hotel → Departamento → Área → Punto de Venta → Turnos → Equipos → Formularios → Documentación → Fichas Técnicas
 */

export type ProaAdminRole = 
  | 'admin_plataforma'       // Administrador de la plataforma (todas las organizaciones)
  | 'admin_empresa'          // Administrador del establecimiento (hotel y sus departamentos)
  | 'jefe_departamento'      // Jefe o responsable de departamento (ej. Chef Ejecutivo Cocina)
  | 'responsable_area'       // Responsable de área / Punto de Venta (ej. Encargado Cafetería)
  | 'supervisor'             // Supervisor de turno (revisión y validación)
  | 'trabajador';            // Trabajador operativo de línea (consulta y ejecución)

export interface AdminUserOperator {
  id: string;
  name: string;
  email: string;
  role: ProaAdminRole;
  jobTitle?: string;
  status?: 'activo' | 'inactivo';
  assignedEstablishmentId?: string;
  assignedDepartmentId?: string;
  assignedAreaKey?: string;
  avatarUrl?: string;
  phone?: string;
}

// -------------------------------------------------------------
// 1. CONFIGURADOR DE ESTRUCTURA
// -------------------------------------------------------------
export type StructureNodeType = 'establishment' | 'department' | 'area' | 'pos' | 'zone' | 'shift' | 'equipment';

export interface StructureEntityConfig {
  id: string;
  type: StructureNodeType;
  parentId?: string; // id del padre (ej. hotelId para departamento, deptId para área)
  name: string;
  code: string;
  description?: string;
  iconName?: string;
  sortOrder: number;
  status: 'activo' | 'inactivo' | 'archivado';
  leadName?: string; // Responsable asignado (ej. Antonio González)
  leadRole?: string;
  colorBadge?: string;
  // Campos específicos
  metadata?: {
    category?: string; // e.g. 'cocina', 'barra', 'sala'
    tempMin?: number;
    tempMax?: number;
    unit?: string;
    shiftStart?: string;
    shiftEnd?: string;
    scheduleHours?: string;
    hasShowcooking?: boolean;
    criticalControlPoint?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// 2. EDITOR DE FORMULARIOS Y REGISTROS
// -------------------------------------------------------------
export type FormFieldType = 
  | 'text'
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'photo'
  | 'signature';

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  order: number;
  // Reglas numéricas y de control
  minValue?: number;
  maxValue?: number;
  unit?: string; // e.g. "ºC", "bar", "ppm"
  // Reglas de alerta y acción correctiva obligatoria
  criticalMinThreshold?: number;
  criticalMaxThreshold?: number;
  criticalAlertMessage?: string;
  requiresCorrectiveActionIfDeviated?: boolean;
  // Para selects o listas
  options?: string[];
  defaultValue?: any;
}

export type FormCategory = 
  | 'temperaturas'
  | 'limpieza_desinfeccion'
  | 'apertura_cierre'
  | 'revision_maquinaria'
  | 'control_camaras'
  | 'incidencias'
  | 'checklist_personalizado';

export interface FormTemplateConfig {
  id: string;
  code: string;
  title: string;
  category: FormCategory;
  categoryLabel: string;
  description?: string;
  establishmentId: string; // '*' para todos o id específico
  departmentId: string;    // '*' para todos o id específico
  areaKey?: string;        // opcional
  version: string;         // e.g. "v1.0", "v1.1", "v2.0"
  status: 'borrador' | 'en_revision' | 'publicado' | 'desactivado' | 'archivado';
  fields: FormFieldDefinition[];
  requiresSupervisorSignature: boolean;
  frequencyHint?: 'por_turno' | 'diario' | 'semanal' | 'mensual';
  publishedAt?: string;
  publishedBy?: string;
  versionChangelog: {
    version: string;
    publishedAt: string;
    author: string;
    changesSummary: string;
  }[];
}

// -------------------------------------------------------------
// 3. GESTIÓN DOCUMENTAL
// -------------------------------------------------------------
export type DocLifecycleStatus = 'borrador' | 'pendiente_aprobacion' | 'vigente' | 'obsoleto' | 'archivado';

export interface ManagedDocRecord {
  id: string;
  code: string;
  title: string;
  category: 'sop_procedimiento' | 'manual_operativo' | 'normas_appcc' | 'maquinaria' | 'fichas_tecnicas' | 'emergencias';
  categoryLabel: string;
  description: string;
  establishmentId: string;
  departmentId: string;
  areaKey?: string;
  version: string;
  status: DocLifecycleStatus;
  effectiveDate: string; // Fecha de entrada en vigor
  reviewDate: string;    // Fecha de revisión programada
  approverRole: string;
  approvedBy?: string;
  approvedAt?: string;
  author: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  contentMarkdown?: string;
  readConfirmationCount: number;
  versionHistory: {
    version: string;
    date: string;
    author: string;
    approvedBy: string;
    changeNotes: string;
  }[];
}

// -------------------------------------------------------------
// 4. GESTIÓN DE CARTAS, MENÚS Y FICHAS TÉCNICAS
// -------------------------------------------------------------
export const EU_14_ALLERGENS = [
  { id: 'gluten', label: 'Gluten / Cereales', icon: '🌾' },
  { id: 'crustaceos', label: 'Crustáceos', icon: '🦞' },
  { id: 'huevos', label: 'Huevos', icon: '🥚' },
  { id: 'pescado', label: 'Pescado', icon: '🐟' },
  { id: 'cacahuetes', label: 'Cacahuetes', icon: '🥜' },
  { id: 'soja', label: 'Soja', icon: '🫘' },
  { id: 'lacteos', label: 'Lácteos', icon: '🥛' },
  { id: 'frutos_cascara', label: 'Frutos de Cáscara', icon: '🌰' },
  { id: 'apio', label: 'Apio', icon: '🥬' },
  { id: 'mostaza', label: 'Mostaza', icon: '🟡' },
  { id: 'sesamo', label: 'Granos de Sésamo', icon: '🥯' },
  { id: 'sulfitos', label: 'Dióxido de Azufre y Sulfitos', icon: '🍷' },
  { id: 'altramuces', label: 'Altramuces', icon: '🌼' },
  { id: 'moluscos', label: 'Moluscos', icon: '🦪' }
] as const;

export type AllergenId = typeof EU_14_ALLERGENS[number]['id'];

export interface RecipeIngredientItem {
  name: string;
  measure: string; // e.g. "5 cl", "180 gr", "1 un.", "3 gotas"
  technicalNaming: string; // e.g. "Ron blanco de caña 38% vol."
  costApprox?: number;
}

export interface AdminTechnicalSheet {
  id: string;
  name: string;
  code: string;
  category: 'cocteleria' | 'cocina_caliente' | 'cocina_fria' | 'pasteleria' | 'cafeteria' | 'vinos';
  categoryLabel: string;
  establishmentId: string;
  departmentId: string;
  areaKey?: string;
  pointOfSaleId?: string;
  servings: number;
  formulation: RecipeIngredientItem[];
  elaborationFlow: string[]; // Pasos numerados con verbos en 1ª pers. plural (Añadimos, Marcamos...)
  glasswareAndTools: string;
  sensoryDiagnosis: string;
  allergens: AllergenId[];
  costPerServing?: number;
  sellingPrice?: number;
  foodCostPercentage?: number;
  photoUrl?: string;
  version: string;
  status: 'borrador' | 'pendiente_aprobacion' | 'vigente' | 'archivado';
  effectiveDate: string;
  author: string;
  approverName?: string;
  approvedAt?: string;
  updatedAt: string;
}

export interface AdminMenuCarta {
  id: string;
  code: string;
  name: string;
  establishmentId: string;
  departmentId: string;
  pointOfSaleId?: string;
  serviceType: 'desayuno' | 'almuerzo' | 'cena' | 'all_day' | 'cocteleria' | 'pool_bar';
  status: 'borrador' | 'vigente' | 'archivado';
  effectiveDate: string;
  technicalSheetIds: string[];
  notes?: string;
}

// -------------------------------------------------------------
// 5. PLANES DE LIMPIEZA Y DESINFECCIÓN
// -------------------------------------------------------------
export interface AdminCleaningTaskConfig {
  id: string;
  establishmentId: string;
  departmentId: string;
  areaKey: string;
  areaOrEquipment: string;
  frequency: 'por_turno' | 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  shift: 'manana' | 'tarde' | 'ambos';
  authorizedProduct: string;
  dosage: string;
  applicationMethod: string;
  contactTimeMinutes?: number;
  responsibleRole: string;
  requiresSupervisorVerification: boolean;
  requiredEvidence: 'ninguna' | 'firma' | 'fotografia';
  status: 'activo' | 'inactivo' | 'archivado';
  updatedAt: string;
}

// -------------------------------------------------------------
// 6. COMUNICACIONES E INCIDENCIAS
// -------------------------------------------------------------
export interface AdminIncidentCategoryConfig {
  id: string;
  code: string;
  name: string;
  description: string;
  severityDefault: 'baja' | 'media' | 'alta' | 'critica';
  defaultAssignedRole: string;
  autoEscalateHours: number;
  notifySupervisors: boolean;
  status: 'activo' | 'inactivo';
}

// -------------------------------------------------------------
// 7. HISTORIAL DE AUDITORÍA Y CONTROL DE CAMBIOS (GOVERNANCE)
// -------------------------------------------------------------
export interface AdminAuditChangeLogEntry {
  id: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  operatorRole: ProaAdminRole;
  targetModule: 'estructura' | 'formularios' | 'documentos' | 'fichas_tecnicas' | 'limpieza' | 'incidencias' | 'rbac';
  actionType: 'creacion' | 'modificacion' | 'publicacion' | 'desactivacion' | 'archivo' | 'eliminacion_segura' | 'aprobacion';
  entityId: string;
  entityName: string;
  summary: string;
  previousValueSnapshot?: any;
  newValueSnapshot?: any;
  warningNotice?: string;
}

// -------------------------------------------------------------
// CONFIGURACIÓN GLOBAL MULTI-TENANT
// -------------------------------------------------------------
export interface TenantAdminConfigPayload {
  organizationId: string;
  structures: StructureEntityConfig[];
  forms: FormTemplateConfig[];
  documents: ManagedDocRecord[];
  technicalSheets: AdminTechnicalSheet[];
  menus: AdminMenuCarta[];
  cleaningTasks: AdminCleaningTaskConfig[];
  incidentCategories: AdminIncidentCategoryConfig[];
  operators?: AdminUserOperator[];
  auditLogs: AdminAuditChangeLogEntry[];
  lastSavedAt: string;
}
