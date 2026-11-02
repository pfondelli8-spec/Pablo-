export type InformationPriorityLevel = 
  | 'nivel_1_hotel' 
  | 'nivel_2_departamento' 
  | 'nivel_3_corporativo' 
  | 'nivel_4_web_publica';

export type PromotionStatus = 'ACTIVA' | 'PRÓXIMAMENTE' | 'PAUSADA' | 'FINALIZADA';
export type TemporalType = 'permanente' | 'temporal';

export interface PriorityBadgeMeta {
  level: InformationPriorityLevel;
  code: string;
  name: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export interface HotelOutlet {
  id: string;
  name: string;
  shortName: string;
  type: 'Restaurante' | 'Bar' | 'Terraza' | 'Piscina' | 'Cafeteria' | 'Rooftop';
  schedule: string;
  kitchenSchedule?: string;
  location: string;
  description: string;
  features: string[];
}

export interface PromotionEntity {
  id: string;
  hotelId: string;
  name: string;
  outletId: string;
  outletName: string;
  category: 'happy_hour' | 'bebidas' | 'cocteles' | 'comida' | 'temporada' | 'eventos' | 'otras';
  type: TemporalType; // 'permanente' | 'temporal'
  days: string;
  schedule: string;
  startDate?: string;
  endDate?: string;
  includedProducts: string[];
  price: string;
  conditions: string[];
  applicationProcedure: string[];
  status: PromotionStatus;
  highlightDishOrDrink?: string;
  sourceDoc?: string;
}

export interface TechnicalSheetIngredient {
  name: string;
  quantity: string;
  commercialBrand?: string;
  costApprox?: string;
}

export interface FlavorCompass {
  sweet: number;      // 0 - 5
  sour: number;       // 0 - 5
  bitter: number;     // 0 - 5
  fruity: number;     // 0 - 5
  alcohol: number;    // 0 - 5
  herbal?: number;    // 0 - 5
}

export interface TechnicalSheet {
  id: string;
  code: string;
  hotelId: string;
  outletId: string;
  outletName: string;
  title: string;
  name?: string; // Nombre oficial explícito
  category: 'cocteles' | 'productos' | 'cafeteria' | 'cocina_recetas';
  version: string;
  updatedDate: string;
  status: 'Aprobada' | 'En Revisión' | 'Borrador';
  
  // Campos técnicos exactos de F&B
  technique?: string;
  preparationMethod: string[];
  method?: string[]; // Alias para método
  ice?: string;
  glassware?: string;
  decoration?: string;
  garnish?: string;
  presentation?: string;
  flavorCompass?: FlavorCompass;
  additionalInfo?: string;

  tools?: string;
  diagnosis?: string;
  ingredients: TechnicalSheetIngredient[];
  allergens: string[];
  servingTemperature?: string;
  escandallo?: {
    rawCost: number;
    sellingPrice: number;
    marginPercent: number;
  };
  keyQualityPoints: string[];
  notes?: string;
  sourceDoc?: string;
  imageUrl?: string;
  criticalPoint?: string;
  officialNumber?: string | number;
  originType?: string;
  costStatus?: string;
  normalizationDecision?: string;
  precioOlivina?: number;
  precioHHOlivina?: number;
  precioDiamond?: number;
  precioHHDiamond?: number;
  documentationStatus?: string;
  ingredientsSummary?: string;
}

/**
 * Ítems de Carta y Menú
 */
export interface HotelMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergens: string[];
  technicalSheetId?: string;
  tag?: string;
  imageUrl?: string;
  ingredientsSummary?: string;
  precioOlivina?: number;
  precioHHOlivina?: number;
  precioDiamond?: number;
  precioHHDiamond?: number;
  documentationStatus?: string;
}

export type MenuItem = HotelMenuItem;

/**
 * Estructura de Datos Específica para Fichas Técnicas F&B Estandarizadas
 * Garantiza la presencia de: Nombre, Formulación, Método, Técnica, Cristalería, Diagnóstico y Alérgenos
 */
export interface FBTechnicalSheet extends TechnicalSheet {
  name: string;                         // Nombre Oficial
  technique: string;                    // Técnica de Elaboración
  glassware: string;                    // Cristalería Homologada
  garnish: string;                      // Garnish & Decoración
  preparationMethod: string[];          // Método Paso a Paso
  ingredients: TechnicalSheetIngredient[]; // Ingredientes & Dosificación
}

export interface HotelMenuSection {
  id: string;
  name: string;
  description?: string;
  items: HotelMenuItem[];
}

export interface HotelMenu {
  id: string;
  hotelId: string;
  outletId: string;
  outletName: string;
  title: string;
  subtitle: string;
  category: 'restaurante' | 'bar' | 'cocteles' | 'confiteria_snacks';
  servingHours: string;
  type?: TemporalType;
  validFrom?: string;
  validTo?: string;
  sections: HotelMenuSection[];
}

export interface HotelProcedureDoc {
  id: string;
  code: string;
  hotelId: string; // 'klayman-diamond' | 'klayman-olivina' | 'corporate'
  title: string;
  department: 'recepcion' | 'restauracion' | 'cocina' | 'pisos' | 'mantenimiento' | 'administracion' | string;
  departmentLabel: string;
  priorityLevel: InformationPriorityLevel;
  type: 'especifico_hotel' | 'corporativo_grupo' | string;
  status?: string;
  scope?: string;
  temporalType?: TemporalType;
  version: string;
  updatedDate: string;
  responsible?: string;
  responsibleRoles?: string[];
  verificationMethod?: string;
  relatedForms?: string[];
  summary?: string;
  purpose?: string;
  steps: ({
    order: number;
    title: string;
    detail: string;
    criticalCheck?: string;
  } | string)[];
  requirements?: string[];
  safetyNotes?: string[];
  sourceDoc?: string;
}

export interface DepartmentEntity {
  id: string;
  name: string;
  code: string;
  iconName: string;
  description: string;
  status: 'activo_piloto' | 'pendiente_incorporacion';
  leadRole?: string;
  modulesCount: number;
  hasContent: boolean;
}

export interface TrainingTrack {
  id: string;
  hotelId?: string;
  departmentId?: string;
  department?: string;
  durationHours?: number;
  modulesCount?: number;
  title: string;
  category?: 'cocteleria' | 'servicio_bar' | 'apertura' | 'cierre' | 'promociones' | 'producto' | 'general' | string;
  description: string;
  linkedTechnicalSheetIds?: string[];
  linkedProcedureIds?: string[];
  keyObjectives?: string[];
  status?: 'disponible' | 'preparado_pendiente_material' | string;
  estimatedMinutes?: number;
}

export interface HotelEntity {
  id: string;
  name: string;
  shortName: string;
  location: string;
  island?: string;
  stars: number;
  categoryLabel?: string;
  logoUrl?: string;
  code: string;
  tagline: string;
  heroImage?: string;
  status: string;
  summary: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  departments: DepartmentEntity[];
  outlets?: HotelOutlet[];
  schedules?: {
    service: string;
    schedule: string;
    location: string;
    type?: TemporalType;
    validPeriod?: string;
    note?: string;
  }[];
  facilities?: string[];
  services?: string[];
}

export interface CorporatePolicy {
  id: string;
  code?: string;
  title: string;
  category: 'valores' | 'normas_corporativas' | 'politicas' | 'prevencion_prl' | 'proteccion_datos' | 'rrhh' | string;
  version: string;
  effectiveDate?: string;
  summary?: string;
  description?: string;
  complianceLevel?: string;
  tags?: string[];
  keyPoints?: string[];
  appliesTo?: string;
}

export interface DocumentIntakeItem {
  id: string;
  hotelId: string;
  receivedDate?: string;
  date?: string;
  title: string;
  category: 'ficha_tecnica' | 'carta' | 'horario' | 'promocion' | 'procedimiento' | 'foto_activo' | string;
  suggestedModule?: string;
  status?: 'Pendiente de Clasificar' | 'Asignado a Módulo' | 'Integrado' | 'Procesado' | string;
  notes?: string;
  summary?: string;
  sourceFile?: string;
}

// =========================================================================
// GESTIÓN DE REQUISITOS OBLIGATORIOS DEL PERSONAL (MANIPULADOR, PRL, ETC.)
// =========================================================================

export interface MandatoryRequirementDefinition {
  id: string;
  code: string;
  name: string;
  category: 'sanidad' | 'prl' | 'higiene' | 'legal';
  description: string;
  isMandatory: boolean;
  defaultValidityMonths?: number; // p. ej. 48 meses para manipulador
}

export interface EmployeeRequirementStatus {
  requirementId: string;
  requirementName: string;
  hasCertificate: boolean; // ¿Lo tiene acreditado / en posesión?
  status: 'en_regla' | 'pendiente' | 'caducado' | 'en_tramite';
  issueDate?: string; // Fecha de emisión / expedición
  expiryDate?: string; // Fecha de caducidad
  certificateNumber?: string; // Nº de registro o carnet
  documentUrl?: string; // Foto o justificante del certificado
  verifiedBy?: string; // Verificado por (ej. Dirección F&B)
  notes?: string;
}

export interface HotelEmployee {
  id: string;
  hotelId: string;
  fullName: string;
  alias?: string;
  department: string;
  departmentLabel: string;
  role: string; // Puesto (ej. Bartender Principal, Camarero Terraza, Ayudante, etc.)
  shift?: string; // Turno habitual
  dniNie?: string;
  phone?: string;
  email?: string;
  startDate: string;
  status: 'activo' | 'baja' | 'en_formacion';
  avatarUrl?: string;
  requirements: EmployeeRequirementStatus[];
}

// =========================================================================
// BANCO DE DATOS & CANAL DE CIERRES DE CAJA Y TICKETS NOCTURNOS (F&B)
// =========================================================================

export interface CashRegisterClosing {
  id: string;
  hotelId: string;
  outletId?: string;
  outletName: string; // ej. Bar / Servicio Principal F&B
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  shift: 'cierre_noche' | 'cierre_tarde' | 'cierre_completo' | 'cierre_mediodia' | 'noche' | 'tarde';
  cashierName?: string; // Persona que realiza el cierre
  responsibleStaff?: string;
  registerNumber?: string; // ej. TPV 1 Terraza
  posTerminal?: string;
  ticketZNumber: string; // Nº Cierre Z / Ticket

  totalGross?: number; // Total facturado bruto (€)
  totalRevenue?: number;
  totalCash?: number; // Efectivo recaudado (€)
  totalCashSystem?: number;
  totalCashCounted?: number;
  totalCreditCard?: number; // Tarjeta / Datáfono (€)
  totalCreditCardSystem?: number;
  totalCreditCardPOS?: number;
  totalDiscounts?: number; // Descuentos aplicados (€)
  discountReason?: string; // Detalle o motivo de descuentos
  discountsApplied?: any[];
  totalInvitations?: number; // Invitaciones / Cortesías (€)
  invitationDetails?: string; // Detalle de las invitaciones
  invitationsOrLosses?: any[];

  discrepancy?: number; // Descuadre de caja (+ / -)
  difference?: number;
  tips?: number; // Propinas declaradas (€)

  ticketPhotoUrl?: string; // Foto subida del ticket Z de caja
  ticketZPhotoUrl?: string;
  ticketPhotoName?: string;
  notes?: string; // Observaciones de la noche (incidencias, eventos)
  generalNotes?: string;
  status?: string;
  verified?: boolean; // Validado por Administración
  verifiedByManager?: string;
  createdAt: string;
}

