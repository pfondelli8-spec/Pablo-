export type ClimateZone = 'mediterraneo' | 'templado' | 'subtropical' | 'arido' | 'montana';

export type Season = 'primavera' | 'verano' | 'otono' | 'invierno';

export type FoodCategory = 
  | 'cereales_ancestrales' 
  | 'leguminosas_fijadoras' 
  | 'hortalizas_raiz_hoja' 
  | 'frutas_polinizacion' 
  | 'frutos_secos_semillas' 
  | 'acuicultura_regenerativa' 
  | 'lacteos_pastoreo';

export interface FoodItem {
  id: string;
  name: string;
  scientificName: string;
  category: FoodCategory;
  categoryLabel: string;
  primaryClimate: ClimateZone;
  climateZoneLabel: string;
  bestSeasons: Season[];
  carbonFootprintKgCO2e: number; // kg CO2e por kg de alimento
  waterFootprintLiters: number; // Litros de agua por kg de alimento
  nutrientDensityScore: number; // 0 - 100
  keyNutrients: string[];
  climateBenefit: string;
  vitalRole: string;
  traditionalConservation: string;
  recommendedIntake: string;
  imageAlt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LessonContent {
  id: string;
  title: string;
  durationMinutes: number;
  readingSnippet: string;
  sections: {
    heading: string;
    body: string;
    keyTakeaway?: string;
  }[];
  practicalTip: string;
}

export interface CourseModule {
  id: string;
  code: string; // ej. "MOD-01"
  title: string;
  subtitle: string;
  level: 'Introductorio' | 'Intermedio' | 'Avanzado';
  estimatedHours: number;
  description: string;
  iconName: string;
  lessons: LessonContent[];
  quiz: QuizQuestion[];
  badgeName: string;
}

export interface MonthPhenology {
  monthIndex: number; // 0 to 11
  name: string;
  season: Season;
  solarCharacteristics: string;
  soilCondition: string;
  peakHarvestFoods: string[];
  metabolicNeed: string;
  conservationTask: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Climatología' | 'Agroecología' | 'Nutrición' | 'Sostenibilidad';
  definition: string;
  contextExample: string;
}

export interface CalculatorIngredient {
  foodId: string;
  grams: number;
}

export interface CertificationRecord {
  moduleId: string;
  moduleTitle: string;
  studentName: string;
  dateCompleted: string;
  scorePercentage: number;
  certificateId: string;
}
