/**
 * MATRICES DEL BUFFET DE ALTO VOLUMEN (50 - 82 ÍTEMS POR SERVICIO)
 * Estructura de doble matriz según la directriz operativa de cocina:
 * 1. MATRIZ FIJA: Partidas base permanentes que se repiten a diario para asegurar volumen y estabilidad.
 * 2. MATRIZ ROTATIVA: Platos variables, show cooking y elaboraciones temáticas que cambian según el día (1 a 15).
 */

import { MenuItem } from '../types/menuAndTechSheets';

// =========================================================================
// 1. MATRIZ FIJA - DESAYUNO (50 ÍTEMS BASE)
// =========================================================================
export const FIXED_BREAKFAST_ITEMS: MenuItem[] = [
  // A. Panadería y Bollería (18 ítems)
  { id: 'fix-des-pan-1', name: 'Pan de molde blanco', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-pan-2', name: 'Pan de molde integral', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegano'] },
  { id: 'fix-des-pan-3', name: 'Panecillos rústicos artesanos', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegano'] },
  { id: 'fix-des-pan-4', name: 'Pan de semillas de lino y chía', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegano'] },
  { id: 'fix-des-pan-5', name: 'Pan sin gluten certificado', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Sin Gluten'] },
  { id: 'fix-des-pan-6', name: 'Baguette tradicional francesa', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegano'] },
  { id: 'fix-des-pan-7', name: 'Tostadas biscottes tostadas', station: 'Panadería & Obrador', category: 'Panadería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-1', name: 'Croissants de mantequilla fresca', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-2', name: 'Croissants rellenos de chocolate', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-3', name: 'Napolitanas de crema pastelera', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-4', name: 'Palmeritas de hojaldre caramelizadas', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-5', name: 'Ensaimadas tradicionales', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-6', name: 'Muffins de arándanos silvestres', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-7', name: 'Muffins de chocolate intenso', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-8', name: 'Bizcocho mármol de cacao', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-9', name: 'Bizcocho casero de limón y canela', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-10', name: 'Donuts glaseados de azúcar', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-bol-11', name: 'Churros clásicos crujientes', station: 'Panadería & Obrador', category: 'Bollería', matrixType: 'fija', fixedFamily: 'Panadería y Bollería', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },

  // B. Lácteos, Cereales y Bebidas (16 ítems)
  { id: 'fix-des-lac-1', name: 'Leche entera pasteurizada', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-2', name: 'Leche semidesnatada', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-3', name: 'Leche sin lactosa', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Sin Lactosa', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-4', name: 'Bebida vegetal de soja', station: 'Lácteos & Bebidas', category: 'Bebidas Vegetales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Lactosa'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-5', name: 'Bebida vegetal de avena', station: 'Lácteos & Bebidas', category: 'Bebidas Vegetales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Lactosa'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-6', name: 'Yogur natural cremoso', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-7', name: 'Yogur de fresa', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-lac-8', name: 'Yogur bífidus desnatado', station: 'Lácteos & Bebidas', category: 'Lácteos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-cer-1', name: 'Corn Flakes clásicos de maíz', station: 'Lácteos & Bebidas', category: 'Cereales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-cer-2', name: 'Choco Krispies crujientes', station: 'Lácteos & Bebidas', category: 'Cereales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-cer-3', name: 'Muesli suizo con frutos secos', station: 'Lácteos & Bebidas', category: 'Cereales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegetariano'] },
  { id: 'fix-des-cer-4', name: 'Copos de avena integral', station: 'Lácteos & Bebidas', category: 'Cereales', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano'] },
  { id: 'fix-des-beb-1', name: 'Zumo de naranja recién exprimido', station: 'Lácteos & Bebidas', category: 'Zumos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-beb-2', name: 'Zumo de manzana natural', station: 'Lácteos & Bebidas', category: 'Zumos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-beb-3', name: 'Zumo de piña tropical', station: 'Lácteos & Bebidas', category: 'Zumos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-beb-4', name: 'Zumo detox verde (espinaca, pepino, manzana)', station: 'Lácteos & Bebidas', category: 'Zumos', matrixType: 'fija', fixedFamily: 'Lácteos, Cereales y Bebidas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // C. Frutas, Fiambres y Quesos (16 ítems)
  { id: 'fix-des-fru-1', name: 'Melón piel de sapo cortado', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fru-2', name: 'Sandía fresca cortada en triángulos', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fru-3', name: 'Piña natural pelada y laminada', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fru-4', name: 'Naranja en gajos vivos', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fru-5', name: 'Manzana entera lavada desinfectada', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-des-fru-6', name: 'Plátano canario IGP', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-des-fru-7', name: 'Kiwi en mitades', station: 'Frutería & Charcutería', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-unt-1', name: 'Miel de flores natural en dosificador', station: 'Frutería & Charcutería', category: 'Untables', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'] },
  { id: 'fix-des-unt-2', name: 'Mermelada de fresa extra', station: 'Frutería & Charcutería', category: 'Untables', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-des-unt-3', name: 'Mermelada de melocotón', station: 'Frutería & Charcutería', category: 'Untables', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-des-unt-4', name: 'Mantequilla individual de pasto', station: 'Frutería & Charcutería', category: 'Untables', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fia-1', name: 'Jamón cocido extra calidad', station: 'Frutería & Charcutería', category: 'Fiambres', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fia-2', name: 'Pechuga de pavo asada braseada', station: 'Frutería & Charcutería', category: 'Fiambres', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-fia-3', name: 'Salami Milano loncheado fino', station: 'Frutería & Charcutería', category: 'Fiambres', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-que-1', name: 'Queso Gouda tierno en lonchas', station: 'Frutería & Charcutería', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-des-que-2', name: 'Queso Edam holandés en lonchas', station: 'Frutería & Charcutería', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Frutas, Fiambres y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // D. Calientes Buffet Base (10 ítems)
  { id: 'fix-des-cal-1', name: 'Huevos revueltos de granja a la mantequilla', station: 'Buffet Caliente', category: 'Huevos', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', techSheetId: 'ft-huevos-revueltos-granja', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-2', name: 'Bacon ahumado crujiente', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-3', name: 'Salchichas frankfurt selectas', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-4', name: 'Salchichas de pollo braseadas', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-5', name: 'Baked beans (alubias en salsa de tomate melosa)', station: 'Buffet Caliente', category: 'Legumbres', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-6', name: 'Champiñones laminados salteados con hierbas', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-7', name: 'Tomates asados al horno con orégano', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-8', name: 'Hash browns (tortitas doradas de patata)', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-9', name: 'Tortilla española jugosa tradicional', station: 'Buffet Caliente', category: 'Huevos', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-des-cal-10', name: 'Huevos cocidos 6 minutos (mollet)', station: 'Buffet Caliente', category: 'Huevos', matrixType: 'fija', fixedFamily: 'Calientes Buffet Base', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' }
];

// =========================================================================
// 2. MATRIZ FIJA - ALMUERZO (45 ÍTEMS BASE)
// =========================================================================
export const FIXED_LUNCH_ITEMS: MenuItem[] = [
  // A. Salad Bar y Crudités (18 ítems)
  { id: 'fix-alm-sal-1', name: 'Lechuga iceberg fresca cortada', station: 'Salad Bar', category: 'Ensaladas', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-2', name: 'Mezclum gourmet de hojas tiernas', station: 'Salad Bar', category: 'Ensaladas', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-3', name: 'Tomate de ensalada en rodajas', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-4', name: 'Pepino laminado fresco', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-5', name: 'Zanahoria rallada crujiente', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-6', name: 'Maíz dulce en grano', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-7', name: 'Remolacha cocida en dados', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-8', name: 'Cebolla blanca en juliana', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-9', name: 'Aceitunas verdes manzanilla', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-10', name: 'Aceitunas negras cacereñas', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-11', name: 'Atún claro en aceite de girasol', station: 'Salad Bar', category: 'Pescados', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-12', name: 'Huevo duro pelado en mitades', station: 'Salad Bar', category: 'Huevos', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-13', name: 'Picatostes de pan crujientes', station: 'Salad Bar', category: 'Guarniciones', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegetariano'] },
  { id: 'fix-alm-sal-14', name: 'Aceite de oliva virgen extra', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-sal-15', name: 'Vinagre de vino blanco', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-sal-16', name: 'Vinagre balsámico de Módena', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-sal-17', name: 'Salsa de yogur con hierbabuena', station: 'Salad Bar', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-sal-18', name: 'Salsa vinagreta clásica emulsionada', station: 'Salad Bar', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Salad Bar y Crudités', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // B. Guarniciones y Sopas Base (12 ítems)
  { id: 'fix-alm-gua-1', name: 'Sopa de ave reconfortante con fideos', station: 'Sopas & Guisos', category: 'Sopas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: [], temperatureTarget: '>70°C' },
  { id: 'fix-alm-gua-2', name: 'Gazpacho andaluz tradicional', station: 'Sopas & Guisos', category: 'Sopas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', techSheetId: 'ft-gazpacho-andaluz', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-gua-3', name: 'Arroz blanco largo al vapor', station: 'Pastas & Arroces', category: 'Arroces', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-alm-gua-4', name: 'Patatas fritas doradas crujientes', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-alm-gua-5', name: 'Pasta penne rigate al dente', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
  { id: 'fix-alm-gua-6', name: 'Espaguetis tradicionales al huevo', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
  { id: 'fix-alm-gua-7', name: 'Salsa pomodoro casera al orégano', station: 'Pastas & Arroces', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-alm-gua-8', name: 'Salsa boloñesa tradicional de carne', station: 'Pastas & Arroces', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-alm-pan-1', name: 'Pan rústico de leña en rebanadas', station: 'Panadería', category: 'Panes', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano'] },
  { id: 'fix-alm-pan-2', name: 'Pan integral multicereales', station: 'Panadería', category: 'Panes', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano'] },
  { id: 'fix-alm-pan-3', name: 'Picos de pan y colines', station: 'Panadería', category: 'Panes', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegano'] },
  { id: 'fix-alm-pan-4', name: 'Mantequilla fresca individual', station: 'Panadería', category: 'Untables', matrixType: 'fija', fixedFamily: 'Guarniciones y Sopas Base', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // C. Postres y Helados (15 ítems)
  { id: 'fix-alm-pos-1', name: 'Tarta de chocolate fondant', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-2', name: 'Tarta de queso horneada', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-3', name: 'Flan de huevo con caramelo', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-4', name: 'Gelatina de fresa refrescante', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-5', name: 'Gelatina de limón natural', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-6', name: 'Profiteroles rellenos de nata con chocolate', station: 'Postres & Helados', category: 'Postres', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-7', name: 'Melón fresco cortado', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-8', name: 'Sandía fresca troceada', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-9', name: 'Piña natural en rodajas', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-alm-pos-10', name: 'Manzana entera Golden', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-pos-11', name: 'Plátano canario maduro', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-pos-12', name: 'Pera conferencia de agua', station: 'Postres & Helados', category: 'Frutas', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-alm-hel-1', name: 'Helado artesano de vainilla Bourbon', station: 'Postres & Helados', category: 'Helados', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
  { id: 'fix-alm-hel-2', name: 'Helado cremoso de chocolate negro', station: 'Postres & Helados', category: 'Helados', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
  { id: 'fix-alm-hel-3', name: 'Helado refrescante de fresa silvestre', station: 'Postres & Helados', category: 'Helados', matrixType: 'fija', fixedFamily: 'Postres y Helados', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' }
];

// =========================================================================
// 3. MATRIZ FIJA - CENA (52 ÍTEMS BASE)
// =========================================================================
export const FIXED_DINNER_ITEMS: MenuItem[] = [
  // A. Salad Bar, Encurtidos y Salsas (25 ítems)
  { id: 'fix-cen-sal-1', name: 'Lechuga romana crujiente', station: 'Salad Bar', category: 'Ensaladas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-2', name: 'Mezclum de brotes selectos', station: 'Salad Bar', category: 'Ensaladas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-3', name: 'Rúcula selvática fresca', station: 'Salad Bar', category: 'Ensaladas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-4', name: 'Tomate cherry en racimo', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-5', name: 'Tomate de ensalada aliñado', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-6', name: 'Pepino en finas láminas', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-7', name: 'Zanahoria baby rallada', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-8', name: 'Maíz tierno dulce', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-9', name: 'Remolacha cocida', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-10', name: 'Cebolla morada en pluma fina', station: 'Salad Bar', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-enc-1', name: 'Alcaparras encurtidas en flor', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-enc-2', name: 'Pepinillos agridulces en rodajas', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-enc-3', name: 'Cebolletas en vinagre balsámico', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-enc-4', name: 'Aceitunas gordal marinadas con romero', station: 'Salad Bar', category: 'Encurtidos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-top-1', name: 'Croutons tostados al ajo y perejil', station: 'Salad Bar', category: 'Toppings', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegetariano'] },
  { id: 'fix-cen-top-2', name: 'Bacon crujiente picado', station: 'Salad Bar', category: 'Toppings', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Sin Gluten'] },
  { id: 'fix-cen-top-3', name: 'Queso Parmesano Reggiano rallado', station: 'Salad Bar', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-top-4', name: 'Nueces peladas en mitades', station: 'Salad Bar', category: 'Frutos Secos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-top-5', name: 'Pasas sultanas sin semillas', station: 'Salad Bar', category: 'Frutos Secos', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-ali-1', name: 'Aceite de oliva virgen extra DO', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-ali-2', name: 'Vinagre de Jerez reserva', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-ali-3', name: 'Crema balsámica glaseada', station: 'Salad Bar', category: 'Aliños', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-sal-11', name: 'Salsa rosa suave al brandy', station: 'Salad Bar', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-12', name: 'Salsa César auténtica con anchoas', station: 'Salad Bar', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-sal-13', name: 'Mostaza antigua en grano', station: 'Salad Bar', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Salad Bar, Encurtidos y Salsas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // B. Panes y Quesos (12 ítems)
  { id: 'fix-cen-pan-1', name: 'Surtido de panes rústicos artesanos (6 variedades)', station: 'Panadería & Quesos', category: 'Panes', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano'] },
  { id: 'fix-cen-pan-2', name: 'Pan de cristal fino crujiente', station: 'Panadería & Quesos', category: 'Panes', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano'] },
  { id: 'fix-cen-pan-3', name: 'Focaccia con aceite de romero y sal maldon', station: 'Panadería & Quesos', category: 'Panes', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano'] },
  { id: 'fix-cen-pan-4', name: 'Regañás y picos camperos', station: 'Panadería & Quesos', category: 'Panes', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano'] },
  { id: 'fix-cen-pan-5', name: 'Pan de centeno alemán denso', station: 'Panadería & Quesos', category: 'Panes', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano'] },
  { id: 'fix-cen-que-1', name: 'Queso semicurado de cabra majorero', station: 'Panadería & Quesos', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-que-2', name: 'Queso curado de oveja manchego DO', station: 'Panadería & Quesos', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-que-3', name: 'Queso azul Roquefort francés', station: 'Panadería & Quesos', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-que-4', name: 'Queso Brie cremoso de Meaux', station: 'Panadería & Quesos', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-que-5', name: 'Dulce de membrillo artesano en dados', station: 'Panadería & Quesos', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-que-6', name: 'Surtido de frutos secos tostados (almendras, avellanas)', station: 'Panadería & Quesos', category: 'Frutos Secos', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-que-7', name: 'Mantequilla clarificada con flor de sal', station: 'Panadería & Quesos', category: 'Untables', matrixType: 'fija', fixedFamily: 'Panes y Quesos', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },

  // C. Guarniciones, Sopas y Pastas Base (15 ítems)
  { id: 'fix-cen-sop-1', name: 'Crema de verduras de temporada', station: 'Sopas & Cremas', category: 'Sopas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', techSheetId: 'ft-crema-verduras', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-cen-sop-2', name: 'Consomé claro de ave al jerez', station: 'Sopas & Cremas', category: 'Sopas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-cen-gua-1', name: 'Arroz salvaje con hierbas aromáticas', station: 'Guarniciones', category: 'Arroces', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-gua-2', name: 'Patatas gajo asadas con piel y pimentón', station: 'Guarniciones', category: 'Patatas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-gua-3', name: 'Puré de patatas cremoso a la mantequilla', station: 'Guarniciones', category: 'Patatas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-pas-1', name: 'Espaguetis al dente con hilo de AOVE', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-pas-2', name: 'Macarrones rigati italianos', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-pas-3', name: 'Salsa carbonara clásica con panceta', station: 'Pastas & Arroces', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-cen-pas-4', name: 'Salsa napolitana de tomate y albahaca fresca', station: 'Pastas & Arroces', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>70°C' },
  { id: 'fix-cen-pas-5', name: 'Queso rallado Grana Padano', station: 'Pastas & Arroces', category: 'Quesos', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
  { id: 'fix-cen-ver-1', name: 'Verduras al vapor (zanahoria, judía verde, coliflor)', station: 'Guarniciones', category: 'Verduras', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-can-1', name: 'Papas arrugadas tradicionales canarias', station: 'Rincón Canario', category: 'Patatas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
  { id: 'fix-cen-can-2', name: 'Mojo rojo picón palmero', station: 'Rincón Canario', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-can-3', name: 'Mojo verde de cilantro fresco', station: 'Rincón Canario', category: 'Salsas', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano', 'Sin Gluten'] },
  { id: 'fix-cen-pan-6', name: 'Surtido de picos y bastones camperos', station: 'Panadería', category: 'Panes', matrixType: 'fija', fixedFamily: 'Guarniciones, Sopas y Pastas', dietaryTags: ['Vegano'] }
];

// =========================================================================
// 4. GENERADORES DE MATRIZ ROTATIVA POR DÍA (DÍA 1 A 15)
// =========================================================================

export function getBreakfastRotatingItems(dayNumber: number): MenuItem[] {
  if (dayNumber === 1) {
    // Día 1: Show Cooking (4 ítems) -> Total: 50 + 14 fijos adicionales = 64
    return [
      { id: 'rot-des-d1-1', name: 'Tortitas americanas esponjosas', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', techSheetId: 'ft-tortitas-sirope', dietaryTags: ['Vegetariano'], temperatureTarget: 'Al momento (>68°C)' },
      { id: 'rot-des-d1-2', name: 'Sirope de arce canadiense puro', station: 'Show Cooking', category: 'Acompañamientos', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] },
      { id: 'rot-des-d1-3', name: 'Nata montada fresca azucarada', station: 'Show Cooking', category: 'Lácteos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d1-4', name: 'Huevos fritos al momento en AOVE', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: 'Al momento (>75°C)' }
    ];
  }

  if (dayNumber === 2) {
    // Día 2: Show Cooking a medida (13 ítems) -> Total: 50 + 13 = 63
    return [
      { id: 'rot-des-d2-1', name: 'Tortilla francesa a medida (Show Cooking)', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: 'Al momento (>75°C)' },
      { id: 'rot-des-d2-2', name: 'Jamón cocido picado para tortilla', station: 'Show Cooking', category: 'Ingredientes', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-3', name: 'Queso rallado fundente para tortilla', station: 'Show Cooking', category: 'Ingredientes', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-4', name: 'Champiñones laminados para tortilla', station: 'Show Cooking', category: 'Ingredientes', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-5', name: 'Cebolla picada fina para tortilla', station: 'Show Cooking', category: 'Ingredientes', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-6', name: 'Pimiento rojo picado en dados', station: 'Show Cooking', category: 'Ingredientes', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-7', name: 'Huevos fritos con puntilla al momento', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: 'Al momento (>75°C)' },
      { id: 'rot-des-d2-8', name: 'Huevos poché escalfados al punto', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: 'Al momento (>70°C)' },
      { id: 'rot-des-d2-9', name: 'Gofres belgas recién horneados', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: 'Al momento (>65°C)' },
      { id: 'rot-des-d2-10', name: 'Salsa tibia de chocolate belga', station: 'Show Cooking', category: 'Salsas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '45°C' },
      { id: 'rot-des-d2-11', name: 'Sirope natural de fresas silvestres', station: 'Show Cooking', category: 'Salsas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] },
      { id: 'rot-des-d2-12', name: 'Nata montada artesana', station: 'Show Cooking', category: 'Lácteos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-des-d2-13', name: 'Azúcar glas en espolvoreador', station: 'Show Cooking', category: 'Acompañamientos', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] }
    ];
  }

  // Días 3 a 15: Temáticas de Show Cooking (13-14 ítems para alcanzar 63-64 total)
  return [
    { id: `rot-des-d${dayNumber}-1`, name: `Crepes dulces y salados rellenos al momento (Día ${dayNumber})`, station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: 'Al momento (>70°C)' },
    { id: `rot-des-d${dayNumber}-2`, name: 'Huevos Benedictine con salsa holandesa', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-3`, name: 'Huevos fritos camperos al momento', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: 'Al momento' },
    { id: `rot-des-d${dayNumber}-4`, name: 'Tostadas francesas brioche doradas a la mantequilla', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-5`, name: 'Jamón ibérico de bellota al corte', station: 'Show Cooking', category: 'Charcutería', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-des-d${dayNumber}-6`, name: 'Revuelto cremoso con espárragos trigueros', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-7`, name: 'Smoothie bowl de mango y fruta de la pasión', station: 'Show Cooking', category: 'Frutas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-des-d${dayNumber}-8`, name: 'Pancakes de avena y plátano caramelizado', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-9`, name: 'Sirope de agave orgánico', station: 'Show Cooking', category: 'Acompañamientos', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] },
    { id: `rot-des-d${dayNumber}-10`, name: 'Compota casera de frutos rojos', station: 'Show Cooking', category: 'Acompañamientos', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-des-d${dayNumber}-11`, name: 'Tostada de pan de espelta con aguacate y semillas', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegano'] },
    { id: `rot-des-d${dayNumber}-12`, name: 'Huevos pasados por agua a 64°C', station: 'Show Cooking', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-13`, name: 'Gofres artesanos con canela', station: 'Show Cooking', category: 'Obrador', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>65°C' },
    { id: `rot-des-d${dayNumber}-14`, name: 'Coulis de chocolate caliente', station: 'Show Cooking', category: 'Salsas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '45°C' }
  ];
}

export function getLunchRotatingItems(dayNumber: number): MenuItem[] {
  if (dayNumber === 1) {
    // Día 1: Platos Fríos (8) + Platos Calientes Principales (10) = 18 ítems -> Total: 45 + 18 = 63
    return [
      // Platos Fríos y Compuestos (8)
      { id: 'rot-alm-d1-f1', name: 'Ensalada campera tradicional de patata y pimiento', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f2', name: 'Ensalada Caprese con mozzarella fresca y pesto genovés', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f3', name: 'Salpicón de marisco fresco de la costa', station: 'Buffet Frío', category: 'Mariscos', matrixType: 'rotativa', techSheetId: 'ft-salpicon-marisco', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f4', name: 'Huevos camperos rellenos de atún y mayonesa suave', station: 'Buffet Frío', category: 'Huevos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f5', name: 'Ensaladilla de pasta tricolor con maíz y jamón york', station: 'Buffet Frío', category: 'Pastas Frías', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f6', name: 'Hummus tradicional de garbanzo con pimentón de la Vera', station: 'Buffet Frío', category: 'Untables', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d1-f7', name: 'Nachos de maíz crujientes', station: 'Buffet Frío', category: 'Snacks', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] },
      { id: 'rot-alm-d1-f8', name: 'Guacamole casero con lima y cilantro', station: 'Buffet Frío', category: 'Salsas Frías', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },

      // Platos Calientes Principales (10)
      { id: 'rot-alm-d1-c1', name: 'Lomo de cerdo asado con compota de manzana reineta', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'rotativa', techSheetId: 'ft-lomo-cerdo-manzana', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d1-c2', name: 'Merluza a la romana dorada con mahonesa de ajo suave', station: 'Show Cooking Pescados', category: 'Pescados', matrixType: 'rotativa', techSheetId: 'ft-merluza-marinera', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d1-c3', name: 'Pollo al ajillo tradicional con vino blanco', station: 'Buffet Caliente', category: 'Aves', matrixType: 'rotativa', techSheetId: 'ft-pollo-limon-romero', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d1-c4', name: 'Pastel de carne inglés con costra de puré gratinado', station: 'Buffet Caliente', category: 'Guisos', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d1-c5', name: 'Brócoli salteado con lascas de ajo y aceite virgen', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d1-c6', name: 'Coliflor al vapor con vinagreta templada', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d1-c7', name: 'Patatas panadera horneadas con pimientos y cebolla', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d1-c8', name: 'Arroz pilaf con cardamomo y cebolla dorada', station: 'Pastas & Arroces', category: 'Arroces', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d1-c9', name: 'Lasaña de verduras de la huerta gratinada con bechamel', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d1-c10', name: 'Pizza margarita artesanal con mozzarella y albahaca', station: 'Pizzería & Horno', category: 'Pizzas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>70°C' }
    ];
  }

  if (dayNumber === 2) {
    // Día 2: Platos Fríos (10) + Platos Calientes Principales (10) = 20 ítems -> Total: 45 + 20 = 65
    return [
      // Platos Fríos y Compuestos (10)
      { id: 'rot-alm-d2-f1', name: 'Ensalada mixta mediterránea con atún y huevo', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f2', name: 'Ensalada de pasta tricolor con vinagreta de albahaca', station: 'Buffet Frío', category: 'Pastas Frías', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f3', name: 'Tomate aliñado con orégano y sal marina de cumbre', station: 'Buffet Frío', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f4', name: 'Ensalada alemana de patata con salchicha y mostaza dulce', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f5', name: 'Rollitos de jamón york rellenos de huevo hilado', station: 'Buffet Frío', category: 'Charcutería', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f6', name: 'Espárragos blancos de Navarra con mayonesa suave', station: 'Buffet Frío', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f7', name: 'Ensalada de garbanzos con vinagreta de pimientos', station: 'Buffet Frío', category: 'Legumbres', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f8', name: 'Gazpacho refrescante de melón con menta fresca', station: 'Buffet Frío', category: 'Sopas Frías', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f9', name: 'Salpicón de ave con manzana y apio crujiente', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-alm-d2-f10', name: 'Carpaccio de remolacha asada con queso feta', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },

      // Platos Calientes Principales (10)
      { id: 'rot-alm-d2-c1', name: 'Pollo al curry suave con leche de coco y verduras', station: 'Buffet Caliente', category: 'Aves', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d2-c2', name: 'Fritura andaluza de pescado blanco con limón', station: 'Show Cooking Pescados', category: 'Pescados', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d2-c3', name: 'Estofado de ternera a la jardinera con verduras', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'rotativa', techSheetId: 'ft-estofado-ternera', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d2-c4', name: 'Macarrones gratinados al horno con chorizo ibérico', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-alm-d2-c5', name: 'Zanahorias baby glaseadas a la miel y mantequilla', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d2-c6', name: 'Judías verdes salteadas con tacos de jamón serrano', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d2-c7', name: 'Arroz tres delicias con tortilla y guisantes', station: 'Pastas & Arroces', category: 'Arroces', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d2-c8', name: 'Patatas bravas tradicionales con salsa picante', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d2-c9', name: 'Empanadillas caseras de atún, tomate y huevo', station: 'Buffet Caliente', category: 'Aperitivos Calientes', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>65°C' },
      { id: 'rot-alm-d2-c10', name: 'Pizza romana de jamón cocido y queso mozzarella', station: 'Pizzería & Horno', category: 'Pizzas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>70°C' }
    ];
  }

  // Días 3 a 15: 18 a 20 platos rotativos para alcanzar 63 a 65 total
  return [
    { id: `rot-alm-d${dayNumber}-f1`, name: `Ensalada temática del día ${dayNumber}`, station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f2`, name: 'Carpaccio de ternera con lascas de queso', station: 'Buffet Frío', category: 'Carnes Frías', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f3`, name: 'Tartar de tomate y aguacate con cilantro', station: 'Buffet Frío', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f4`, name: 'Pastel frío de cabracho con tostas', station: 'Buffet Frío', category: 'Pescados Fríos', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f5`, name: 'Taboulé oriental con hierbabuena y limón', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegano'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f6`, name: 'Mejillones en escabeche artesano', station: 'Buffet Frío', category: 'Conservas Selectas', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f7`, name: 'Ensalada de espinacas baby con manzana y queso azul', station: 'Buffet Frío', category: 'Ensaladas Compuestas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-f8`, name: 'Crema fría vichyssoise tradicional de puerro', station: 'Buffet Frío', category: 'Sopas Frías', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-alm-d${dayNumber}-c1`, name: `Especialidad de pescado a la plancha (Día ${dayNumber})`, station: 'Show Cooking Pescados', category: 'Pescados', matrixType: 'rotativa', techSheetId: 'ft-merluza-marinera', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c2`, name: `Asado maestro de carne con su salsa (Día ${dayNumber})`, station: 'Buffet Caliente', category: 'Carnes', matrixType: 'rotativa', techSheetId: 'ft-pollo-limon-romero', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c3`, name: 'Paella mixta tradicional valenciana en vivo', station: 'Show Cooking Arroces', category: 'Arroces', matrixType: 'rotativa', techSheetId: 'ft-paella-valenciana-mixta', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c4`, name: 'Pechuga de pavo rellena con frutos secos', station: 'Buffet Caliente', category: 'Aves', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c5`, name: 'Albóndigas caseras en salsa española', station: 'Buffet Caliente', category: 'Guisos', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c6`, name: 'Salteado wok de verduras crujientes con soja', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano'], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c7`, name: 'Patatas al romero horneadas con ajo confitado', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-alm-d${dayNumber}-c8`, name: 'Cuscús con pasas y almendras', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'rotativa', dietaryTags: ['Vegano'], temperatureTarget: '>65°C' },
    { id: `rot-alm-d${dayNumber}-c9`, name: 'Lasaña boloñesa al horno con mozzarella', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'rotativa', techSheetId: 'ft-lasana-bolonesa', dietaryTags: [], temperatureTarget: '>68°C' },
    { id: `rot-alm-d${dayNumber}-c10`, name: 'Pizza artesanal del día con queso fundente', station: 'Pizzería & Horno', category: 'Pizzas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>70°C' }
  ];
}

export function getDinnerRotatingItems(dayNumber: number): MenuItem[] {
  if (dayNumber === 1) {
    // Día 1: CENA GALA DE BIENVENIDA (30 rotativos) -> Total: 52 + 30 = 82 ítems
    return [
      // Entrantes Fríos Especiales (8)
      { id: 'rot-cen-d1-f1', name: 'Cóctel de gambas con salsa rosa al brandy y piña', station: 'Buffet Frío de Gala', category: 'Mariscos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f2', name: 'Ensalada de pato confitado con frutos rojos y vinagreta de miel', station: 'Buffet Frío de Gala', category: 'Ensaladas Especiales', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f3', name: 'Carpaccio de ternera gallega con lascas de Parmesano', station: 'Buffet Frío de Gala', category: 'Carnes Frías', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f4', name: 'Tartaletas hojaldradas de ensaladilla rusa con caviar de mújol', station: 'Buffet Frío de Gala', category: 'Aperitivos de Gala', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f5', name: 'Espejos de salmón ahumado noruego con alcaparras y eneldo', station: 'Buffet Frío de Gala', category: 'Pescados Ahumados', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f6', name: 'Surtido de ibéricos de bellota (jamón, lomo, chorizo, salchichón)', station: 'Buffet Frío de Gala', category: 'Ibéricos Nobles', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f7', name: 'Paté de campaña con pistachos y mermelada de higos', station: 'Buffet Frío de Gala', category: 'Patés & Terrinas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-f8', name: 'Tomates cherry rellenos de queso de cabra y albahaca', station: 'Buffet Frío de Gala', category: 'Entrantes Fríos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },

      // Calientes Principales y Show Cooking (10)
      { id: 'rot-cen-d1-c1', name: 'Roast Beef al corte en vivo con salsa Gravy caliente', station: 'Show Cooking Gala', category: 'Carnes', matrixType: 'rotativa', techSheetId: 'ft-roast-beef', dietaryTags: ['Sin Gluten'], temperatureTarget: 'Al corte (>65°C)' },
      { id: 'rot-cen-d1-c2', name: 'Jugo de carne concentrado (Gravy de asado)', station: 'Show Cooking Gala', category: 'Salsas Calientes', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>75°C' },
      { id: 'rot-cen-d1-c3', name: 'Salmón noruego en costra de hierbas y crujiente cítrico', station: 'Buffet Caliente', category: 'Pescados', matrixType: 'rotativa', techSheetId: 'ft-salmon-costra', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d1-c4', name: 'Pechuga de pollo de corral rellena de espinacas y queso feta', station: 'Buffet Caliente', category: 'Aves', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d1-c5', name: 'Espárragos trigueros a la parrilla con sal en escamas', station: 'Show Cooking Verduras', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: 'Al momento (>68°C)' },
      { id: 'rot-cen-d1-c6', name: 'Champiñones portobello al ajillo con vino blanco', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-cen-d1-c7', name: 'Gratinado Dauphinois tradicional con nata y nuez moscada', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d1-c8', name: 'Pimientos del piquillo rellenos de bacalao en salsa vizcaína', station: 'Buffet Caliente', category: 'Pescados & Rellenos', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d1-c9', name: 'Quiche Lorraine artesanal de bacon y puerros', station: 'Buffet Caliente', category: 'Tartas Saladas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d1-c10', name: 'Fritura crujiente de calamares de potera con alioli suave', station: 'Show Cooking Fritura', category: 'Pescados', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: 'Al momento (>75°C)' },

      // Postres Especiales Gala (12)
      { id: 'rot-cen-d1-p1', name: 'Cascada de chocolate caliente fondue', station: 'Isla de Postres Gala', category: 'Fuentes & Chocolate', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '45°C' },
      { id: 'rot-cen-d1-p2', name: 'Fresas frescas de Huelva para fondue', station: 'Isla de Postres Gala', category: 'Frutas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p3', name: 'Nubes de azúcar y gominolas para chocolate', station: 'Isla de Postres Gala', category: 'Dulces', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'] },
      { id: 'rot-cen-d1-p4', name: 'Tarta Ópera francesa clásica con capas de café y ganache', station: 'Isla de Postres Gala', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p5', name: 'Mousse esponjosa de fruta de la pasión con coulis', station: 'Isla de Postres Gala', category: 'Mousses', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p6', name: 'Trufas de chocolate negro al cacao amargo', station: 'Isla de Postres Gala', category: 'Bombonería', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p7', name: 'Tarta San Marcos tostada tradicional con yema', station: 'Isla de Postres Gala', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p8', name: 'Tocino de cielo artesano con almíbar de azahar', station: 'Isla de Postres Gala', category: 'Postres Tradicionales', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p9', name: 'Macedonia de frutas frescas exóticas al licor de naranja', station: 'Isla de Postres Gala', category: 'Frutas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d1-p10', name: 'Helado premium de pistacho siciliano', station: 'Isla de Postres Gala', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
      { id: 'rot-cen-d1-p11', name: 'Helado premium de sorbete de mango', station: 'Isla de Postres Gala', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
      { id: 'rot-cen-d1-p12', name: 'Helado premium de dulce de leche con nuez', station: 'Isla de Postres Gala', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' }
    ];
  }

  if (dayNumber === 2) {
    // Día 2: CENA TEMÁTICA ITALIANA (28 rotativos) -> Total: 52 + 28 = 80 ítems
    return [
      // Entrantes Fríos Especiales (10)
      { id: 'rot-cen-d2-f1', name: 'Ensalada Panzanella toscana con pan crujiente y albahaca', station: 'Antipasti Fríos', category: 'Ensaladas Italianas', matrixType: 'rotativa', dietaryTags: ['Vegano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f2', name: 'Caprese clásica con mozzarella di bufala, tomate y pesto', station: 'Antipasti Fríos', category: 'Ensaladas Italianas', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f3', name: 'Carpaccio de calabacín marinado con limón y piñones', station: 'Antipasti Fríos', category: 'Verduras Frías', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f4', name: 'Vitello Tonnato piamontés con salsa cremosa de atún y alcaparras', station: 'Antipasti Fríos', category: 'Carnes Frías', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f5', name: 'Tabla de charcutería italiana (mortadela de Bolonia, salame nostrano)', station: 'Antipasti Fríos', category: 'Embutidos Italianos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f6', name: 'Provolone marinado en aceite de hierbas aromáticas', station: 'Antipasti Fríos', category: 'Quesos Italianos', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f7', name: 'Ensalada de orzo mediterránea con tomate seco y rúcula', station: 'Antipasti Fríos', category: 'Pastas Frías', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-f8', name: 'Focaccia artesana al romero y sal gruesa', station: 'Panadería Italiana', category: 'Panes', matrixType: 'rotativa', dietaryTags: ['Vegano'] },
      { id: 'rot-cen-d2-f9', name: 'Bruschettas de tomate concassé, albahaca y ajo confitado', station: 'Antipasti Fríos', category: 'Aperitivos Italianos', matrixType: 'rotativa', dietaryTags: ['Vegano'] },
      { id: 'rot-cen-d2-f10', name: 'Aceitunas aliñadas a la siciliana con cítricos e hinojo', station: 'Antipasti Fríos', category: 'Encurtidos', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },

      // Calientes Principales y Show Cooking (10)
      { id: 'rot-cen-d2-c1', name: 'Estación de pastas frescas en vivo (Show Cooking: Tagliatelle, Ravioli)', station: 'Show Cooking Pastas', category: 'Pastas Frescas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: 'Al momento (>75°C)' },
      { id: 'rot-cen-d2-c2', name: 'Lasaña boloñesa tradicional gratinada', station: 'Buffet Caliente', category: 'Pastas', matrixType: 'rotativa', techSheetId: 'ft-lasana-bolonesa', dietaryTags: [], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d2-c3', name: 'Pez espada a la siciliana con alcaparras, aceitunas y tomate', station: 'Show Cooking Pescados', category: 'Pescados', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d2-c4', name: 'Pollo a la cacciatora estofado con champiñones y vino blanco', station: 'Buffet Caliente', category: 'Aves', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d2-c5', name: 'Caponata agridulce siciliana de berenjenas', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
      { id: 'rot-cen-d2-c6', name: 'Risotto cremoso de setas boletus y aceite de trufa', station: 'Pastas & Arroces', category: 'Arroces', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d2-c7', name: 'Gnocchi di patata a los cuatro quesos fundentes', station: 'Pastas & Arroces', category: 'Pastas', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>68°C' },
      { id: 'rot-cen-d2-c8', name: 'Pizza napolitana de pepperoni picante al horno de piedra', station: 'Pizzería en Vivo', category: 'Pizzas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>70°C' },
      { id: 'rot-cen-d2-c9', name: 'Pizza cuatro estaciones con alcachofas, jamón y champiñón', station: 'Pizzería en Vivo', category: 'Pizzas', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>70°C' },
      { id: 'rot-cen-d2-c10', name: 'Focaccia caliente con aceite de oliva virgen extra', station: 'Pizzería en Vivo', category: 'Panes', matrixType: 'rotativa', dietaryTags: ['Vegano'], temperatureTarget: '>65°C' },

      // Postres Especiales (8)
      { id: 'rot-cen-d2-p1', name: 'Tiramisú artesanal clásico al mascarpone', station: 'Dolci Italiani', category: 'Postres', matrixType: 'rotativa', techSheetId: 'ft-tiramisu-clasico', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-p2', name: 'Panna cotta con coulis natural de frambuesas', station: 'Dolci Italiani', category: 'Postres', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-p3', name: 'Cannoli sicilianos rellenos de ricotta y pistachos', station: 'Dolci Italiani', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-p4', name: 'Helado italiano artesano de stracciatella', station: 'Dolci Italiani', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
      { id: 'rot-cen-d2-p5', name: 'Helado de pistacho de Bronte', station: 'Dolci Italiani', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
      { id: 'rot-cen-d2-p6', name: 'Macedonia de frutas al licor de marrasquino', station: 'Dolci Italiani', category: 'Frutas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-p7', name: 'Bizcocho genovés con almíbar de limón de Sorrento', station: 'Dolci Italiani', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
      { id: 'rot-cen-d2-p8', name: 'Profiteroles italianos rellenos de crema chantilly', station: 'Dolci Italiani', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' }
    ];
  }

  // Días 3 a 15: Temáticas de Cena (28 a 30 platos rotativos para alcanzar 80 a 82 ítems)
  const themeName = getDinnerThemeName(dayNumber);
  return [
    { id: `rot-cen-d${dayNumber}-f1`, name: `Entrante frío especial ${themeName} (Día ${dayNumber})`, station: 'Buffet Frío Temático', category: 'Entrantes', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f2`, name: `Ensalada gourmet de autor ${themeName}`, station: 'Buffet Frío Temático', category: 'Ensaladas Especiales', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f3`, name: 'Carpaccio de salmón marinado con cítricos y eneldo', station: 'Buffet Frío Temático', category: 'Pescados Fríos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f4`, name: 'Tabla de quesos y embutidos regionales temáticos', station: 'Buffet Frío Temático', category: 'Charcutería', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f5`, name: 'Tartar de atún rojo con sésamo tostado y soja', station: 'Buffet Frío Temático', category: 'Pescados Fríos', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f6`, name: 'Hummus variado con pan pita caliente', station: 'Buffet Frío Temático', category: 'Untables', matrixType: 'rotativa', dietaryTags: ['Vegano'] },
    { id: `rot-cen-d${dayNumber}-f7`, name: 'Ceviche de corvina con maíz cancha y camote', station: 'Buffet Frío Temático', category: 'Pescados Fríos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-f8`, name: 'Rollitos de calabacín rellenos de requesón y nueces', station: 'Buffet Frío Temático', category: 'Entrantes', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-c1`, name: `Especialidad de carne asada al corte (Día ${dayNumber})`, station: 'Show Cooking Temático', category: 'Carnes', matrixType: 'rotativa', techSheetId: 'ft-roast-beef', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c2`, name: `Pescado de roca a la espalda con bilbaína`, station: 'Show Cooking Pescados', category: 'Pescados', matrixType: 'rotativa', techSheetId: 'ft-merluza-marinera', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c3`, name: `Guiso meloso tradicional ${themeName}`, station: 'Buffet Caliente', category: 'Guisos', matrixType: 'rotativa', techSheetId: 'ft-estofado-ternera', dietaryTags: [], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c4`, name: 'Arroz caldoso marinero con marisco fresco', station: 'Show Cooking Arroces', category: 'Arroces', matrixType: 'rotativa', techSheetId: 'ft-paella-valenciana-mixta', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c5`, name: 'Parrillada de verduras con romero y flor de sal', station: 'Buffet Caliente', category: 'Verduras', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-cen-d${dayNumber}-c6`, name: 'Solomillo de cerdo con reducción de Oporto y frutos rojos', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'rotativa', dietaryTags: [], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c7`, name: 'Patatas panadera al tomillo', station: 'Buffet Caliente', category: 'Patatas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'], temperatureTarget: '>65°C' },
    { id: `rot-cen-d${dayNumber}-c8`, name: 'Wok salteado en directo con tallarines y verduras', station: 'Show Cooking Wok', category: 'Wok', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '>70°C' },
    { id: `rot-cen-d${dayNumber}-c9`, name: 'Costillar de cerdo glaseado a la barbacoa con miel', station: 'Buffet Caliente', category: 'Carnes', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-c10`, name: 'Brochetas de gambones y calamares a la parrilla', station: 'Show Cooking', category: 'Mariscos', matrixType: 'rotativa', dietaryTags: ['Sin Gluten'], temperatureTarget: '>68°C' },
    { id: `rot-cen-d${dayNumber}-p1`, name: `Tarta artesanal de autor ${themeName}`, station: 'Postres Especiales', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-p2`, name: 'Mousse esponjosa de chocolate blanco y maracuyá', station: 'Postres Especiales', category: 'Mousses', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-p3`, name: 'Tarta de manzana tibia con crema pastelera', station: 'Postres Especiales', category: 'Tartas Dulces', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-p4`, name: 'Copa de crema catalana caramelizada con soplete', station: 'Postres Especiales', category: 'Postres Tradicionales', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-p5`, name: 'Brochetas de frutas variadas con hilo de chocolate', station: 'Postres Especiales', category: 'Frutas', matrixType: 'rotativa', dietaryTags: ['Vegano', 'Sin Gluten'] },
    { id: `rot-cen-d${dayNumber}-p6`, name: 'Tarta red velvet con glaseado de queso crema', station: 'Postres Especiales', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' },
    { id: `rot-cen-d${dayNumber}-p7`, name: 'Surtido de helados artesanos (3 variedades)', station: 'Postres Especiales', category: 'Helados', matrixType: 'rotativa', dietaryTags: ['Vegetariano', 'Sin Gluten'], temperatureTarget: '<-12°C' },
    { id: `rot-cen-d${dayNumber}-p8`, name: 'Brownie de nueces con nuez pecana', station: 'Postres Especiales', category: 'Pastelería Fina', matrixType: 'rotativa', dietaryTags: ['Vegetariano'], temperatureTarget: '<4°C' }
  ];
}

export function getDinnerThemeName(dayNumber: number): string {
  const themes = [
    'Gala de Bienvenida',
    'Noche Italiana & Pasta Viva',
    'Noche Canaria & Sabores de las Islas',
    'Noche de los Pescadores & Lonja Atlántica',
    'Fiesta de la Barbacoa & Grill Americano',
    'Noche Asiática & Wok Imperial',
    'Tradición Española & Tapas de Autor',
    'Noche Mexicana & Tex-Mex',
    'Haute Cuisine Francesa & Quesos de Granja',
    'Noche del Asador & Carnes Maduradas',
    'Noche Árabe & Especias de Oriente',
    'Fiesta Ibérica & Fritura Andaluza',
    'Noche Mediterránea & Islas Griegas',
    'Selección Gastronómica del Chef Ejecutivo',
    'Gran Gala de Clausura & Pase de Estrellas'
  ];
  return themes[(dayNumber - 1) % themes.length];
}
