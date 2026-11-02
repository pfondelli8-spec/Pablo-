/**
 * HOSTELOPS - PLATAFORMA DE GESTIÓN OPERATIVA MULTIEMPRESA
 * Definición formal del modelo jerárquico:
 * Empresa → Establecimientos → Departamentos → Puntos de Venta → Puestos de Trabajo → Usuarios y Tareas
 */

export type UserProfileRole = 
  | 'admin_plataforma'       // Administrador de la plataforma
  | 'admin_empresa'          // Administrador de empresa
  | 'direccion_operaciones'  // Dirección / Responsable de operaciones
  | 'jefe_departamento'      // Jefe de departamento / Encargado
  | 'trabajador';            // Trabajador operativo

export interface CompanyConfig {
  id: string;
  name: string;
  legalName: string;
  taxId: string;
  slogan: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  activeModules: {
    misTareas: boolean;
    conocimiento: boolean;
    recetas: boolean;
    controlesTemperaturas: boolean;
    controlesLimpieza: boolean;
    incidencias: boolean;
    supervision: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EstablishmentConfig {
  id: string;
  companyId: string;
  name: string;
  code: string;
  type: 'hotel' | 'restaurante' | 'cafeteria' | 'bar' | 'colectividad';
  address: string;
  phone?: string;
  email?: string;
  status: 'activo' | 'inactivo';
}

export interface DepartmentConfig {
  id: string;
  companyId: string;
  establishmentId: string;
  name: string;
  code: string;
  category: 'cocina' | 'barra' | 'sala' | 'pisos' | 'mantenimiento' | 'administracion';
  status: 'activo' | 'inactivo';
}

export interface PointOfSaleConfig {
  id: string;
  establishmentId: string;
  departmentId: string;
  name: string;
  code: string;
  type: 'restaurante' | 'barra' | 'terraza' | 'cafeteria' | 'pantry' | 'office';
  schedule?: string;
  status: 'activo' | 'inactivo';
}

export interface JobRoleConfig {
  id: string;
  departmentId: string;
  title: string;
  code: string;
  level: 'base' | 'supervisor' | 'jefe_departamento' | 'direccion';
  responsibilities: string[];
}

export interface UserAccount {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserProfileRole;
  establishmentId: string;
  departmentId: string;
  pointOfSaleId: string;
  jobRoleId: string;
  avatarUrl?: string;
}

// ==========================================
// MÓDULO 6: CONOCIMIENTO Y FORMACIÓN
// ==========================================

export type DocumentLifecycleStatus = 'borrador' | 'revision' | 'publicado' | 'obsoleto' | 'archivado';

export interface KnowledgeDocStep {
  order: number;
  title: string;
  detail: string;
  criticalCheck?: string;
}

export interface KnowledgeDocument {
  id: string;
  companyId: string;
  establishmentId: string;
  departmentId: string;
  title: string;
  code: string;
  category: 
    | 'manual_bienvenida' 
    | 'funciones_puesto' 
    | 'sop_procedimiento' 
    | 'normas_higiene' 
    | 'atencion_cliente' 
    | 'maquinaria' 
    | 'emergencias';
  categoryLabel: string;
  version: string;
  status: DocumentLifecycleStatus;
  summary: string;
  steps: KnowledgeDocStep[];
  safetyNotes?: string[];
  responsible: string;
  effectiveDate: string;
  reviewDate: string;
  readConfirmations: {
    userId: string;
    userName: string;
    userRole: string;
    version: string;
    readAt: string;
  }[];
}

// ==========================================
// MÓDULO 7: RECETAS Y FICHAS TÉCNICAS
// ==========================================

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  costApprox?: number;
}

export interface StandardRecipeEntity {
  id: string;
  companyId: string;
  establishmentId: string;
  departmentId: string;
  pointOfSaleId: string;
  name: string;
  code: string;
  category: 'cocteleria' | 'cocina' | 'cafeteria' | 'pasteleria' | 'bebidas';
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes?: number;
  ingredients: RecipeIngredient[];
  elaborationSteps: string[];
  utensilsAndGlassware: string;
  sensoryDiagnosis: string;
  allergens: string[];
  criticalPoints?: string;
  costPerServing?: number;
  sellingPrice?: number;
  version: string;
  status: 'publicado' | 'borrador' | 'en_revision';
  updatedAt: string;
  responsible: string;
}

// ==========================================
// MÓDULO 8: MIS TAREAS Y CHECKLISTS DE TURNO
// ==========================================

export type ChecklistTaskStatus = 'pendiente' | 'en_curso' | 'completada' | 'no_conforme' | 'no_aplicable';

export interface ShiftChecklistTaskItem {
  id: string;
  label: string;
  required: boolean;
  status: ChecklistTaskStatus;
  category: string;
  observation?: string;
}

export interface ShiftChecklistExecution {
  id: string;
  companyId: string;
  establishmentId: string;
  departmentId: string;
  pointOfSaleId: string;
  type: 'apertura' | 'cambio_turno' | 'cierre';
  shift: 'manana' | 'tarde' | 'noche' | 'partido';
  dateStr: string;
  timeStr: string;
  operatorId: string;
  operatorName: string;
  operatorRole: string;
  items: ShiftChecklistTaskItem[];
  allRequiredCompleted: boolean;
  ticketZNumero?: string;
  cashDifference?: number;
  closureNotes?: string;
  supervisorVerified: boolean;
  supervisorName?: string;
  supervisorVerifiedAt?: string;
}

// ==========================================
// MÓDULO 9 & 10: CONTROLES APPCC & LIMPIEZA
// ==========================================

export interface EquipmentAppccDef {
  id: string;
  establishmentId: string;
  pointOfSaleId: string;
  name: string;
  category: 'refrigeracion' | 'congelacion' | 'vitrina' | 'maquina_hielo' | 'lavado_termico';
  tempMin: number;
  tempMax: number;
  unit: 'ºC';
  description?: string;
}

export interface AppccTempRecord {
  id: string;
  companyId: string;
  establishmentId: string;
  pointOfSaleId: string;
  equipmentId: string;
  equipmentName: string;
  recordedTemp: number;
  tempMin: number;
  tempMax: number;
  isOutOfRange: boolean;
  correctiveAction?: string;
  followUpMinutes?: number;
  assignedTo?: string;
  operatorName: string;
  operatorRole: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  supervisorVerified?: boolean;
  supervisorName?: string;
  verifiedAt?: string;
}

export interface CleaningTaskExecution {
  id: string;
  companyId: string;
  establishmentId: string;
  pointOfSaleId: string;
  surfaceOrEquipment: string;
  frequency: 'por_turno' | 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  approvedChemical: string;
  dosageInstructions: string;
  contactTimeMinutes: number;
  completed: boolean;
  operatorName: string;
  dateStr: string;
  timeStr: string;
  supervisorVerified: boolean;
  supervisorName?: string;
  verifiedAt?: string;
}

// ==========================================
// MÓDULO 11: INCIDENCIAS OPERATIVAS
// ==========================================

export interface IncidentTicket {
  id: string;
  companyId: string;
  establishmentId: string;
  pointOfSaleId: string;
  ticketCode: string;
  title: string;
  description: string;
  category: 'averia_tecnica' | 'limpieza_no_conforme' | 'desviacion_temperatura' | 'faltante_stock' | 'rotura_material' | 'seguridad_alimentaria' | 'operativa';
  priority: 'baja' | 'media' | 'urgente';
  status: 'abierta' | 'asignada' | 'en_resolucion' | 'pendiente_verificacion' | 'resuelta' | 'cerrada';
  authorName: string;
  authorRole: string;
  assignedTo?: string;
  photoUrl?: string;
  dateStr: string;
  timeStr: string;
  history: {
    id: string;
    author: string;
    role: string;
    action: string;
    timestamp: string;
    statusAfter: string;
  }[];
}

// ==========================================
// MÓDULO 12: MODELOS DE HOTEL & COCINA OPERATIVA
// ==========================================

export type KitchenStationKey = 
  | 'cafeteria'
  | 'frio'
  | 'caliente'
  | 'manana'
  | 'tarde'
  | 'barmitonio'
  | 'menu_rueda_1'
  | 'menu_rueda_2'
  | 'frio_manana'
  | 'frio_tarde'
  | 'caliente_manana'
  | 'caliente_tarde'
  | 'pasteleria'
  | 'marmiton'
  | 'plateria'
  // Pisos & Housekeeping
  | 'pisos_habitaciones'
  | 'pisos_lenceria'
  | 'pisos_zonas_comunes'
  | 'pisos_auditoria'
  // Mantenimiento Técnico & SST
  | 'mant_climatizacion'
  | 'mant_piscinas'
  | 'mant_electricidad'
  | 'mant_sst'
  // Bares & Restauración
  | 'bar_piscina'
  | 'bar_hall'
  | 'bar_salones'
  // Recepción & Front Office
  | 'recep_mostrador'
  | 'recep_auditoria'
  | 'recep_guest_experience'
  | (string & {});

export type DocumentCategoryKey = 
  | 'info_puesto'
  | 'operativa_turno'
  | 'elaboraciones'
  | 'higiene_seguridad'
  | 'equipos_materiales'
  | 'formacion';

export interface StationDocCategoryMeta {
  key: DocumentCategoryKey;
  label: string;
  shortDesc: string;
  documentCount: number;
}

export interface KitchenStationArea {
  id: string;
  key: KitchenStationKey;
  name: string;
  code: string;
  departmentId: string;
  hotelModelId: string;
  order: number;
  shiftSchedule: string;
  responsibilities: string[];
  criticalTasks: {
    apertura: string[];
    servicio: string[];
    cierre: string[];
  };
  assignedEquipment: string[];
  allergensFocus: string[];
  docCategories: StationDocCategoryMeta[];
}

export interface UploadedDocumentRecord {
  id: string;
  companyId: string;
  hotelModelId: string;
  establishmentId: string;
  stationKey: KitchenStationKey;
  categoryKey: DocumentCategoryKey;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'imagen' | 'guia';
  version: string;
  status: 'borrador' | 'revision' | 'publicado' | 'obsoleto';
  authorName: string;
  authorRole: string;
  uploadedAt: string;
  summary: string;
  previewUrl?: string;
  contentSnippet?: string;
}

export interface DemoHotelModel {
  id: string;
  name: string;
  code: string;
  category: 'resort_4s' | 'boutique_5s' | 'urbano_gastronomico';
  badge: string;
  stars: number;
  description: string;
  operationalProfile: string;
  configuredDepartmentsCount: number;
  workstationsCount: number;
  loadedDocumentsCount: number;
  configStatus: 'completado' | 'en_revision' | 'plantilla_maestra';
  isTemplate: boolean;
  departments: DepartmentConfig[];
  kitchenAreas: KitchenStationArea[];
  pointsOfSale: PointOfSaleConfig[];
  jobRoles: JobRoleConfig[];
  knowledgeDocs: KnowledgeDocument[];
  recipes: StandardRecipeEntity[];
  equipments: EquipmentAppccDef[];
  uploadedDocuments: UploadedDocumentRecord[];
}

