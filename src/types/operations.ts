export type HotelDepartment = 'recepcion' | 'cocina' | 'limpieza' | 'mantenimiento';

export type ProcedureType = 'guia_trabajo' | 'ficha_tecnica' | 'checklist_turno';

export interface HotelProperty {
  id: string;
  name: string;
  shortName: string;
  city: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  stars: number;
  roomsCount: number;
  type: string;
  code: string;
  checkInTime?: string;
  checkOutTime?: string;
  receptionHours?: string;
  poolHours?: string;
  cleaningSchedule?: string;
  amenities?: string[];
  description?: string;
}

export type BarSolCategory = 'desayunos' | 'tapas_snacks' | 'platos_principales' | 'cocteleria' | 'cafeteria_bebidas';

export interface BarSolMenuItem {
  id: string;
  name: string;
  nameEn?: string;
  category: BarSolCategory;
  categoryLabel: string;
  description: string;
  price: number;
  allergens: string[]; // ej. 'Gluten', 'Lácteos', 'Huevos', 'Crustáceos', 'Sulfitos', etc.
  dietaryTags?: ('Vegetariano' | 'Vegano' | 'Sin Gluten' | 'Producto Canario' | 'Especialidad Rooftop')[];
  prepTimeMinutes?: number;
  temperatureServing?: string;
  servingHours?: string; // ej. 'Todo el día (09:00 - 18:00)'
  technicalRecipeRef?: string;
}

export interface OperationalStep {
  stepNumber: number;
  title: string;
  description: string;
  durationApproxMinutes?: number;
  criticalPoint?: string; // Punto Crítico de Control / Advertencia
}

export interface TechnicalChemicalItem {
  name: string;
  commercialRef?: string;
  function: string;
  dilutionRatio: string; // ej. "20 ml por 1 litro de agua (2%)"
  contactTime: string; // ej. "5 minutos"
  phLevel?: string; // ej. "pH 11.5 (alcalino desengrasante)"
  colorCode?: string; // ej. "Azul / Cristales" o "Rojo / Sanitarios"
}

export interface OperatingProcedure {
  id: string;
  code: string; // ej. "SOP-REC-01", "FT-LIM-04", "APPCC-COC-02"
  title: string;
  titleEn?: string;
  propertyId?: string;
  department: HotelDepartment;
  departmentLabel: string;
  type: ProcedureType;
  typeLabel?: string;
  hotelIds?: string[]; // Hoteles donde aplica (o ['all'])
  version: string;
  updatedDate?: string;
  validFrom?: string;
  responsibleRole?: string; // ej. "Recepcionista de Turno", "Cocinero de Partida", "Camarera de Pisos (Gobernanta)"
  targetRoles?: string[];
  shift?: 'Mañana' | 'Tarde' | 'Noche' | 'Continuo' | 'Según Ocupación' | 'Semanal' | string;
  estimatedDuration?: string;
  estimatedDurationMinutes?: number;
  objective: string;
  scope?: string;
  requiredPPE?: string[]; // EPIs obligatorios
  requiredTools?: string[]; // Maquinaria / útiles
  chemicals?: TechnicalChemicalItem[]; // Para fichas técnicas de limpieza o desinfección de cocina
  steps: OperationalStep[] | any[];
  checklistItems?: string[]; // Tareas verificables del turno
  checklist?: (string | { id: string; task: string; isCritical: boolean; })[];
  safetyPrecautions?: string[]; // Advertencias PRL / APPCC
  relatedRegulations?: string; // ej. "Reglamento UE 1169/2011", "R.D. 486/1997 PRL"
}

export interface ShiftChecklistLog {
  id: string;
  procedureId: string;
  procedureCode: string;
  procedureTitle: string;
  hotelId: string;
  hotelName: string;
  workerName: string;
  department: HotelDepartment;
  shift: string;
  completedAt: string;
  completedItemsCount: number;
  totalItemsCount: number;
  notes?: string;
}
