/**
 * TIPOS Y DEFINICIONES PARA MENÚS Y FICHAS TÉCNICAS
 * Módulos desacoplados según normativa operativa F&B:
 * 1. Módulo MENÚS: Ruedas de 15 días para Desayuno, Almuerzo y Cena.
 * 2. Módulo FICHAS TÉCNICAS: Archivo documental técnico independiente con vinculación no intrusiva.
 */

export type MenuServiceType = 'desayuno' | 'almuerzo' | 'cena';

export interface MenuItem {
  id: string;
  name: string;
  station: string; // ej: "Buffet Caliente", "Show Cooking", "Fríos & Ensaladas", "Postres", "Panadería & Bollería"
  category: string;
  matrixType?: 'rotativa' | 'fija'; // Matriz Fija (base diaria) vs Matriz Rotativa (especialidad del día)
  fixedFamily?: string; // ej: "Panadería y Bollería", "Salad Bar y Crudités", "Lácteos, Cereales y Bebidas"
  techSheetId?: string; // ID de ficha técnica vinculada si existe
  dietaryTags?: string[]; // ej: ["Vegetariano", "Sin Gluten", "Sin Lactosa"]
  notes?: string;
  temperatureTarget?: string; // ej: ">65°C" o "<4°C"
}

export interface DayMenuCycle {
  dayNumber: number; // 1 a 15
  themeTitle: string; // ej: "Día 1 · Buffet Tradicional Español", "Día 5 · Noche Canaria"
  status: 'publicado' | 'en_revision' | 'borrador';
  lastUpdated: string;
  responsible: string;
  serviceNotes?: string;
  items: MenuItem[];
}

export interface MenuServiceCycle {
  hotelId: string;
  serviceType: MenuServiceType;
  serviceLabel: string;
  totalDays: number; // 15 días
  days: DayMenuCycle[];
}

export interface TechSheetIngredient {
  name: string;
  quantity: number | string;
  unit: 'g' | 'ml' | 'ud' | 'c/s' | 'kg' | 'l';
  notes?: string;
  allergen?: string;
}

export interface TechSheetProductionScale {
  pax100: string;
  pax300: string;
  pax800: string;
}

export interface TechSheet {
  id: string;
  code: string; // ej: "FT-COC-001"
  hotelId: string;
  departmentId: string; // ej: "dep-cocina", "dep-obrador", "dep-bar"
  departmentName: string;
  areaKey: string; // ej: "calientes", "cuarto_frio", "buffet", "show_cooking"
  areaName: string;
  name: string;
  category: string; // "carnes", "pescados", "arroces", "pastas", "sopas", "ensaladas", "guarniciones", "postres", "desayunos", "bebidas"
  categoryLabel: string;
  portionWeight: string; // ej: "220 g", "250 ml"
  yieldRations: string; // ej: "1 ración", "10 raciones"
  description: string;
  photoUrl: string;
  ingredients: TechSheetIngredient[];
  production: TechSheetProductionScale;
  elaborationSteps: string[];
  allergens: string[]; // Nombres de alérgenos UE presentes
  conservationTemp: string; // ej: "Refrigeración entre 0°C y 4°C"
  serviceTemp: string; // ej: ">65°C en línea de calor"
  shelfLife: string; // ej: "48 horas a <= 3°C"
  platingAndPresentation: string; // Instrucciones de montaje, vajilla y decoración
  operationalNotes: string; // Puntos críticos y consejos del chef
  version: string; // ej: "v2.1"
  updatedAt: string; // ISO string
  author: string; // Nombre del responsable
  status: 'activa' | 'archivada';
  versionHistory?: Array<{
    version: string;
    date: string;
    author: string;
    changesSummary: string;
  }>;
  costPerPortion?: number;
  salePriceEquivalent?: number;
}
