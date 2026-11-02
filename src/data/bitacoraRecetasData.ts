/**
 * BITÁCORA DE RECETAS Y RUEDAS DE MENÚ
 * Sistema integral de fichas técnicas normalizadas a 1 página (A4)
 * Estructura:
 * ├── MENÚS (RUEDA 1 / RUEDA 2) -> PLATOS & FICHAS TÉCNICAS
 * ├── RECETAS (CARNES, PESCADOS, ARROCES, PASTAS, SOPAS, ENSALADAS, GUARNICIONES, POSTRES)
 * ├── APPCC, ALÉRGENOS Y ESCANDALLOS
 * Escalamiento automático de raciones: 1 ración, 100 pax, 300 pax, 800 pax
 */

export type RecipeCategory = 
  | 'carnes'
  | 'pescados'
  | 'arroces'
  | 'pastas'
  | 'sopas'
  | 'ensaladas'
  | 'guarniciones'
  | 'postres';

export type MenuWheelType = 'rueda_1' | 'rueda_2';

export interface RecipeIngredient {
  name: string;
  qtyPerPortion: number; // en g o ml
  unit: 'g' | 'ml' | 'ud' | 'c/s';
  allergen?: string;
  notes?: string;
}

export interface ProductionScale {
  pax100: string;
  pax300: string;
  pax800: string;
}

export interface RecipeTechnicalSheet {
  id: string;
  code: string;
  name: string;
  category: RecipeCategory;
  categoryLabel: string;
  menuWheel?: MenuWheelType;
  day?: number;
  service: 'Almuerzo' | 'Cena' | 'Almuerzo y Cena';
  portionSize: string;
  yieldInfo: string;
  photoUrl: string;
  description: string;
  ingredients: RecipeIngredient[];
  production: ProductionScale;
  elaborationSteps: string[];
  appcc: {
    criticalLimit: string;
    stage: string;
    correctiveAction: string;
  };
  allergens: string[];
  costPerPortion: number; // €
  cost100Pax: number;
  cost300Pax: number;
  cost800Pax: number;
  suggestedSalePrice: number; // €
  chefObservations: string;
  hotelId?: string; // Para aislamiento estricto
}

// 14 Alérgenos de Declaración Obligatoria (Reglamento UE 1169/2011)
export const OFFICIAL_ALLERGENS_LIST = [
  { key: 'gluten', label: 'Gluten / Cereales', icon: '🌾' },
  { key: 'crustaceos', label: 'Crustáceos', icon: '🦐' },
  { key: 'huevos', label: 'Huevos', icon: '🥚' },
  { key: 'pescado', label: 'Pescado', icon: '🐟' },
  { key: 'cacahuetes', label: 'Cacahuetes', icon: '🥜' },
  { key: 'soja', label: 'Soja', icon: '🌱' },
  { key: 'lacteos', label: 'Lácteos', icon: '🥛' },
  { key: 'frutos_cascara', label: 'Frutos de Cáscara', icon: '🌰' },
  { key: 'apio', label: 'Apio', icon: '🥬' },
  { key: 'mostaza', label: 'Mostaza', icon: '🟡' },
  { key: 'sesamo', label: 'Sésamo', icon: '⚪' },
  { key: 'sulfitos', label: 'Dióxido de azufre y sulfitos', icon: '🍷' },
  { key: 'altramuces', label: 'Altramuces', icon: '🌼' },
  { key: 'moluscos', label: 'Moluscos', icon: '🦪' }
];

export const RECIPE_CATEGORIES_CONFIG: {
  key: RecipeCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  { key: 'carnes', label: 'Carnes & Aves', icon: '🥩', description: 'Vacuno, aves, porcino y estofados' },
  { key: 'pescados', label: 'Pescados & Mariscos', icon: '🐟', description: 'Blancos, azules y mariscos de lonja' },
  { key: 'arroces', label: 'Arroces', icon: '🥘', description: 'Paellas, caldosos, melosos y pilaf' },
  { key: 'pastas', label: 'Pastas', icon: '🍝', description: 'Frescas, gratinadas y salsas artesanales' },
  { key: 'sopas', label: 'Sopas & Cremas', icon: '🥣', description: 'Caldos, cremas calientes, gazpachos fríos' },
  { key: 'ensaladas', label: 'Ensaladas', icon: '🥗', description: 'Crudités, verdes, aliños y vinagretas' },
  { key: 'guarniciones', label: 'Guarniciones', icon: '🥔', description: 'Patatas, verduras salteadas, legumbres' },
  { key: 'postres', label: 'Postres & Dulces', icon: '🍰', description: 'Obrador propio, tartas, flanes y frutas' }
];

// Base de Recetas Maestras (Inicialmente vacía: estructura preparada para carga limpia)
export const MASTER_RECIPES_DATABASE: RecipeTechnicalSheet[] = [];

// Helper para almacenamiento local aislado por hotel
export const bitacoraRecetasStorage = {
  getRecipesForHotel: (hotelId: string): RecipeTechnicalSheet[] => {
    try {
      const storageKey = `proa_recipes_isolated_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  },

  saveRecipesForHotel: (hotelId: string, recipes: RecipeTechnicalSheet[]): void => {
    try {
      localStorage.setItem(`proa_recipes_isolated_${hotelId}`, JSON.stringify(recipes));
    } catch {}
  },

  addRecipeToHotel: (hotelId: string, recipe: RecipeTechnicalSheet): RecipeTechnicalSheet[] => {
    const current = bitacoraRecetasStorage.getRecipesForHotel(hotelId);
    const updated = [recipe, ...current];
    bitacoraRecetasStorage.saveRecipesForHotel(hotelId, updated);
    return updated;
  },

  updateRecipeInHotel: (hotelId: string, updatedRecipe: RecipeTechnicalSheet): RecipeTechnicalSheet[] => {
    const current = bitacoraRecetasStorage.getRecipesForHotel(hotelId);
    const index = current.findIndex(r => r.id === updatedRecipe.id);
    if (index >= 0) {
      current[index] = updatedRecipe;
    } else {
      current.unshift(updatedRecipe);
    }
    bitacoraRecetasStorage.saveRecipesForHotel(hotelId, current);
    return current;
  },

  deleteRecipeFromHotel: (hotelId: string, recipeId: string): RecipeTechnicalSheet[] => {
    const current = bitacoraRecetasStorage.getRecipesForHotel(hotelId);
    const filtered = current.filter(r => r.id !== recipeId);
    bitacoraRecetasStorage.saveRecipesForHotel(hotelId, filtered);
    return filtered;
  }
};
