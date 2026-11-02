/**
 * SERVICIO: MATRIZ GASTRONÓMICA & PLANIFICACIÓN MENSUAL (30 DÍAS)
 * Estructura de 2 bloques:
 * - Bloque 1: Días 1 - 15
 * - Bloque 2: Días 16 - 30
 * 
 * Cuatro columnas operativas estandarizadas:
 * 1. Día
 * 2. Especial Desayuno (Show Cooking - base 60 ítems)
 * 3. Proteína Principal Almuerzo (base 60 ítems)
 * 4. Rincón Temático Cena (base 90 ítems)
 */

export interface MatrixItemDetail {
  id: string;
  name: string;
  category?: string;
  allergens?: string[];
  dietaryTags?: string[];
  serviceTemp?: string;
  stationName?: string;
  servingPortion?: string;
  techSheetId?: string;
}

export interface DayGastronomicMatrix {
  dayNumber: number; // 1 a 30
  block: 'bloque_1' | 'bloque_2'; // Días 1-15 vs Días 16-30
  weekDayLabel: string; // Lunes, Martes, Miércoles...
  desayunoShowCooking: MatrixItemDetail; // Columna 2: Especial Desayuno (Show Cooking)
  almuerzoProteina: MatrixItemDetail; // Columna 3: Proteína Principal Almuerzo
  cenaRinconTematico: {
    themeName: string; // ej: "Rincón Canario & Atlántico", "Rincón Asiático Wok", "Rincón Asador & Grill"
    items: MatrixItemDetail[]; // Plato estrella + complementos (base 90 ítems)
  };
  notes?: string;
  status: 'confirmado' | 'en_revision';
}

// =========================================================================
// BANCO MAESTRO DE DATOS: 60 ÍTEMS DESAYUNO SHOW COOKING
// =========================================================================
export const BREAKFAST_SHOW_COOKING_LIBRARY: MatrixItemDetail[] = [
  { id: 'brk-01', name: 'Tortilla francesa al momento con finas hierbas y queso de cabra', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
  { id: 'brk-02', name: 'Huevos Benedictine sobre brioche artesanal y salsa holandesa', allergens: ['Huevo', 'Gluten', 'Lácteos'], dietaryTags: [], serviceTemp: '>68°C' },
  { id: 'brk-03', name: 'Crêpes suzette caramelizadas al fuego en directo con naranja', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-04', name: 'Omelette a la carta con espinacas baby, champiñón y emmental', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
  { id: 'brk-05', name: 'Huevos poché sobre tostada de masa madre con aguacate y chía', allergens: ['Huevo', 'Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-06', name: 'Pancakes dorados a la plancha con sirope de arce y frutos rojos', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-07', name: 'Gofres belgas crujientes con salsa de chocolate belga caliente', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-08', name: 'Revuelto cremoso con salmón ahumado nórdico y cebollino', allergens: ['Huevo', 'Pescado', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-09', name: 'Tostón campero con jamón ibérico de cebo y tomate rallado rústico', allergens: ['Gluten'], dietaryTags: [], serviceTemp: 'Templado' },
  { id: 'brk-10', name: 'Huevos fritos de corral con puntilla y virutas de panceta ibérica', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-11', name: 'Tortilla de patatas tradicional recién cuajada con cebolla pochada', allergens: ['Huevo'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'brk-12', name: 'Huevos Florentine con espinacas a la crema y parmesano gratinado', allergens: ['Huevo', 'Lácteos', 'Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: '>68°C' },
  { id: 'brk-13', name: 'Crêpes rellenos de jamón york braseado y queso havarti fundido', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'brk-14', name: 'Tostada francesa brioche caramelizada con azúcar mascabado', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-15', name: 'Revuelto jugoso de gulas al ajillo con toque de guindilla suave', allergens: ['Huevo', 'Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-16', name: 'Huevos al plato con sofrito de pimientos asados y chorizo criollo', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-17', name: 'Tortilla campesina de calabacín tierno, cebolleta y albahaca fresca', allergens: ['Huevo'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'brk-18', name: 'Pancakes de avena integral y plátano de Canarias al momento', allergens: ['Gluten', 'Huevo'], dietaryTags: ['Saludable'], serviceTemp: '>65°C' },
  { id: 'brk-19', name: 'Bikini gourmet trufado a la plancha en pan de molde artesanal', allergens: ['Gluten', 'Lácteos'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'brk-20', name: 'Champiñones portobello a la plancha con ajo y perejil para tostada', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-21', name: 'Huevos revueltos estilo inglés con nata fresca y mantequilla clarificada', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>68°C' },
  { id: 'brk-22', name: 'Tortilla paisana con taquitos de jamón serrano y pimiento verde', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-23', name: 'Bacon ahumado premium a la plancha extra crujiente', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-24', name: 'Salchichas artesanas de Baviera braseadas al momento', allergens: ['Mostaza'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-25', name: 'Omelette campestre con espárragos trigueros y queso gouda', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
  { id: 'brk-26', name: 'Crêpe enrollado de plátano caramelizado con nutella artesana', allergens: ['Gluten', 'Huevo', 'Lácteos', 'Frutos de Cáscara'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-27', name: 'Tortilla de claras fit con pavo braseado y hojas de rúcula salvaje', allergens: ['Huevo'], dietaryTags: ['Fitness', 'Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'brk-28', name: 'Tosta de salmón marinado al eneldo sobre pan nórdico con requesón', allergens: ['Pescado', 'Gluten', 'Lácteos'], dietaryTags: [], serviceTemp: 'Fresco' },
  { id: 'brk-29', name: 'Huevos rancheros sobre tortilla de maíz con frijoles y pico de gallo', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-30', name: 'Churros tradicionales lazo fritos al momento con azúcar y canela', allergens: ['Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: '>75°C' },
  { id: 'brk-31', name: 'Porras madrileñas crujientes con chocolate espeso a la taza', allergens: ['Gluten', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>75°C' },
  { id: 'brk-32', name: 'Omelette noruego con trucha ahumada y crema fresca ácida', allergens: ['Huevo', 'Pescado', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'brk-33', name: 'Tostada gratinada de queso de cabra Majorero con miel de palma', allergens: ['Gluten', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
  { id: 'brk-34', name: 'Huevos escalfados en cocotte sobre compota de tomate especiado', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-35', name: 'Crêpe bretona de trigo sarraceno con queso gruyère y huevo flor', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-36', name: 'Tortilla vaga de bacalao desalado con cebolleta pochada al wok', allergens: ['Huevo', 'Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-37', name: 'Bocadillito caliente de roastbeef templado con mostaza Dijon dulce', allergens: ['Gluten', 'Mostaza'], dietaryTags: [], serviceTemp: '>65°C' },
  { id: 'brk-38', name: 'Huevos revueltos trufados con queso fontina italiano', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>68°C' },
  { id: 'brk-39', name: 'Pancakes de frutos del bosque macerados en licor suave sin alcohol', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-40', name: 'Tortilla enrollada tamagoyaki japonesa con cebollino y soja dulce', allergens: ['Huevo', 'Soja'], dietaryTags: ['Vegetariano'], serviceTemp: '>68°C' },
  { id: 'brk-41', name: 'Brocheta caliente de fruta tropical a la plancha con canela y lima', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>65°C' },
  { id: 'brk-42', name: 'Arepas venezolanas asadas rellenas de queso blanco llanero caliente', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-43', name: 'Huevos al plato con sobrasada de Mallorca y miel de romero', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-44', name: 'Revuelto sedoso de alcachofas confitadas y jamón de pato', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-45', name: 'Omelette ibérico con pimientos de padrón y virutas de cecina', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-46', name: 'Crêpe salado de espinacas tiernas, nueces y gorgonzola fundido', allergens: ['Gluten', 'Huevo', 'Lácteos', 'Frutos de Cáscara'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
  { id: 'brk-47', name: 'Waffles belgas con coulis tibio de mango y virutas de coco tostado', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-48', name: 'Huevos poché royale sobre muffin inglés con salmón y caviar suave', allergens: ['Huevo', 'Gluten', 'Pescado', 'Lácteos'], dietaryTags: [], serviceTemp: '>68°C' },
  { id: 'brk-49', name: 'Tortilla de patatas baby arrugadas con chorizo palmero a la plancha', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-50', name: 'Mollete antequerano tostado con zurrapa de lomo ibérico en manteca', allergens: ['Gluten'], dietaryTags: [], serviceTemp: '>65°C' },
  { id: 'brk-51', name: 'Tosta de aguacate hass asado a la parrilla con semillas y sésamo', allergens: ['Sésamo', 'Gluten'], dietaryTags: ['Vegano'], serviceTemp: 'Templado' },
  { id: 'brk-52', name: 'Omelette mediterráneo con feta griego, aceitunas kalamata y orégano', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-53', name: 'Huevos fritos con txistorra navarra a la sartén de hierro', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'brk-54', name: 'Pancakes de requesón fresco y ralladura de limón ecológico', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-55', name: 'Crêpe de dulce de leche con láminas de almendra marcona tostada', allergens: ['Gluten', 'Huevo', 'Lácteos', 'Frutos de Cáscara'], dietaryTags: ['Vegetariano'], serviceTemp: '>65°C' },
  { id: 'brk-56', name: 'Revuelto cremoso con boletus edulis y lascas de trufa de verano', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-57', name: 'Tostada de pan de espelta con caballa del sur y tomate deshidratado', allergens: ['Gluten', 'Pescado'], dietaryTags: [], serviceTemp: 'Templado' },
  { id: 'brk-58', name: 'Huevos en cazuela de barro con verduritas de huerto pochadas', allergens: ['Huevo'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'brk-59', name: 'Flauta crujiente de lomo adobado con queso fundente al grill', allergens: ['Gluten', 'Lácteos'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'brk-60', name: 'Shakshuka magrebí individual con huevo cuajado y cilantro fresco', allergens: ['Huevo'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>75°C' }
];

// =========================================================================
// BANCO MAESTRO DE DATOS: 60 ÍTEMS PROTEÍNA PRINCIPAL ALMUERZO
// =========================================================================
export const LUNCH_PROTEIN_LIBRARY: MatrixItemDetail[] = [
  { id: 'lun-01', name: 'Entrecot de novillo a la brasa con mantequilla de hierbas aromáticas', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-02', name: 'Lubina de estero a la espalda con refrito de ajos y guindilla', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-03', name: 'Pollo de corral asado con limón macerado y romero silvestre', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-04', name: 'Solomillo de cerdo ibérico glaseado con reducción de Pedro Ximénez', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-05', name: 'Lomo de salmón noruego a la plancha con velouté de cítricos y eneldo', allergens: ['Pescado', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'lun-06', name: 'Carrillera de ternera estofada a fuego lento al vino tinto de Tacoronte', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-07', name: 'Chuletillas de cordero lechal a la parrilla con mojo de cilantro', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-08', name: 'Corvina atlántica al horno en costra de almendras y salsa verde', allergens: ['Pescado', 'Frutos de Cáscara'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-09', name: 'Magret de pato braseado con compota de manzana reineta especiada', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'lun-10', name: 'Bacalao confitado a baja temperatura sobre muselina de ajo tostado', allergens: ['Pescado', 'Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'lun-11', name: 'Costillar de cerdo BBQ cocinado 12h a baja temperatura y glaseado', allergens: ['Mostaza'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-12', name: 'Dorada salvaje a la plancha con emulsión de vinagre macho y pimentón', allergens: ['Pescado', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-13', name: 'Pechuga de pavo braseada con salsa de mostaza antigua y miel suave', allergens: ['Mostaza'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-14', name: 'Atún rojo del Atlántico marcado en tataki con sésamo y soja cítrica', allergens: ['Pescado', 'Soja', 'Sésamo'], dietaryTags: [], serviceTemp: '>65°C' },
  { id: 'lun-15', name: 'Osobuco de ternera milanesa estofado con gremolata y vino blanco', allergens: ['Sulfitos', 'Apio'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-16', name: 'Merluza del Cantábrico en salsa de marisco con almejas y langostinos', allergens: ['Pescado', 'Crustáceos', 'Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-17', name: 'Secreto ibérico a la brasa con sal marina en escamas y pimientos verdes', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-18', name: 'Cherne negro canario a la cazuela con cebolla pochada y papas', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-19', name: 'Medallones de solomillo de ternera con salsa cremosa de pimienta verde', allergens: ['Lácteos', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-20', name: 'Calamar nacional a la plancha con majado de ajo, perejil y lima fresca', allergens: ['Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-21', name: 'Conejo en salmorejo tradicional canario con su majado de pimiento picon', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-22', name: 'Pez espada a la parrilla con refrito de alcaparras y tomate confitado', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-23', name: 'Muslo de pavo relleno de frutos secos y orejones con reducción dulce', allergens: ['Frutos de Cáscara', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-24', name: 'Lenguado meunière con mantequilla avellana y zumo de limón colado', allergens: ['Pescado', 'Lácteos', 'Gluten'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'lun-25', name: 'Hamburguesa gourmet de vaca madurada con queso idiazábal fundido', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-26', name: 'Pulpo asado a la parrilla sobre cremoso de patata y pimentón de la Vera', allergens: ['Moluscos', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-27', name: 'Pluma ibérica a la brasa con chimichurri de hierbas frescas casero', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-28', name: 'Sargo a la plancha con sofrito de chalotas y tomates cherry confitados', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-29', name: 'Guiso de rabo de toro al vino tinto con zanahorias baby glaseadas', allergens: ['Sulfitos', 'Apio'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-30', name: 'Brocheta de pollo marinado tandoori con dip de yogur griego y menta', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-31', name: 'Emperador en escabeche suave de verduras con laurel y pimienta rosa', allergens: ['Pescado', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: 'Templado' },
  { id: 'lun-32', name: 'Presa ibérica bellota con reducción de frutos rojos y oporto', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-33', name: 'Rodaballo al horno con patatas panadera y refrito donostiarra', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-34', name: 'Codornices estofadas con uvas moscatel y chalotas caramelizadas', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-35', name: 'Vieiras del Atlántico gratinadas con bechamel de puerros finos', allergens: ['Moluscos', 'Lácteos', 'Gluten'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'lun-36', name: 'Lomo de buey salteado al wok estilo lomo saltado limeño', allergens: ['Soja'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-37', name: 'Gallo san pedro a la meunière clásica con alcaparras baby', allergens: ['Pescado', 'Lácteos', 'Gluten'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'lun-38', name: 'Churrasco de ternera a la parrilla con mojo rojo picón palmero', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-39', name: 'Sepia limpia a la brasa con alioli ligero de perejil y ajo suave', allergens: ['Moluscos', 'Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-40', name: 'Pollo tikka masala cocinado con especias aromáticas y cilantro', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-41', name: 'Cabrilla canaria frita entera con mojos canarios y limón', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-42', name: 'Albóndigas de ternera caseras en salsa española de hongos silvestres', allergens: ['Gluten', 'Huevo', 'Sulfitos'], dietaryTags: [], serviceTemp: '>75°C' },
  { id: 'lun-43', name: 'Tronco de merluza asado con costra de alioli suave gratinado', allergens: ['Pescado', 'Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-44', name: 'Picaña de novillo al grill con flor de sal y chimichurri criollo', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-45', name: 'Bonito del norte encebollado con pimientos verdes y vino blanco', allergens: ['Pescado', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-46', name: 'Jarrete de cordero glaseado con puré rústico y jugo concentrado', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-47', name: 'Gamba arrocera salteada al ajillo con aceite de oliva virgen virgen', allergens: ['Crustáceos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-48', name: 'Suprema de pintada rellena de foie y boletus con salsa trufada', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-49', name: 'Atún patudo canario a la plancha con vinagreta de tomates asados', allergens: ['Pescado', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
  { id: 'lun-50', name: 'Solomillo de buey con salsa bearnesa clásica al estragón', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-51', name: 'Mero salvaje a la cazuela marinera con almejas finas', allergens: ['Pescado', 'Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-52', name: 'Chuleta de cerdo duroc a la brasa con compota de ciruelas pasas', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-53', name: 'Rape en salsa verde con puntas de espárragos y almejas del carril', allergens: ['Pescado', 'Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-54', name: 'Ternera guisada a la jardinera con guisantes finos y patatas doradas', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-55', name: 'Langostinos tigres abiertos a la espalda a la plancha con sal gruesa', allergens: ['Crustáceos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-56', name: 'Pato laqueado al estilo oriental con salsa hoisin y crepes de arroz', allergens: ['Soja', 'Sésamo'], dietaryTags: [], serviceTemp: '>70°C' },
  { id: 'lun-57', name: 'Besugo al horno con cama de patatas panaderas y refrito de guindilla', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
  { id: 'lun-58', name: 'Entraña de ternera marinada a la brasa con provolone fundido', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-59', name: 'Choco canario en su tinta con arroz basmati aromático', allergens: ['Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
  { id: 'lun-60', name: 'Solomillo de venado braseado con reducción de grosellas y castañas', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' }
];

// =========================================================================
// BANCO MAESTRO DE DATOS: 90 ÍTEMS RINCÓN TEMÁTICO CENA
// =========================================================================
export const DINNER_THEMATIC_CORNER_LIBRARY: {
  theme: string;
  items: MatrixItemDetail[];
}[] = [
  {
    theme: 'Rincón Tradicional Canario & Atlántico',
    items: [
      { id: 'din-can-01', name: 'Sancocho canario de cherne salado con papas arrugadas y batata', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-can-02', name: 'Carne fiesta adobada con vino del país y orégano frita al momento', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-can-03', name: 'Escaldón de gofio con caldo de pescado de roca, cebolla roja y mojo', allergens: ['Gluten', 'Pescado'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-can-04', name: 'Queso asado de cabra de Fuerteventura con mojo verde de cilantro', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-can-05', name: 'Vieja sancochada con refrito de aceite de oliva, vinagre y ajos', allergens: ['Pescado', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-can-06', name: 'Ropa vieja canaria de ternera y garbanzos con verduras estofadas', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Italiano: Pasta Fresca & Risottos',
    items: [
      { id: 'din-ita-01', name: 'Risotto cremoso de boletus edulis mantecado con parmesano Reggiano 24m', allergens: ['Lácteos', 'Sulfitos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-ita-02', name: 'Ravioli frescos de ricotta y espinacas salteados con mantequilla y salvia', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
      { id: 'din-ita-03', name: 'Lasagna tradicional boloñesa de ternera con bechamel sedosa gratinada', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-ita-04', name: 'Tagliatelle al huevo frescos con salsa amatriciana y guanciale crujiente', allergens: ['Gluten', 'Huevo'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-ita-05', name: 'Ossobuco a la milanesa con risotto al azafrán en vivo', allergens: ['Lácteos', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-ita-06', name: 'Focaccia artesana recién horneada con romero, aceite virgen y flor de sal', allergens: ['Gluten'], dietaryTags: ['Vegano'], serviceTemp: '>65°C' }
    ]
  },
  {
    theme: 'Rincón Asiático & Show Wok',
    items: [
      { id: 'din-asi-01', name: 'Salteado de langostinos al wok con fideos udon, verduras crujientes y teriyaki', allergens: ['Gluten', 'Crustáceos', 'Soja', 'Sésamo'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-asi-02', name: 'Pollo salteado al curry amarillo tailandés con leche de coco y bambú', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-asi-03', name: 'Gyozas japonesas de cerdo y verduras doradas al vapor y plancha', allergens: ['Gluten', 'Soja', 'Sésamo'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-asi-04', name: 'Arroz frito cantonés estilo Yangchow con pato asado y cebolleta fresca', allergens: ['Huevo', 'Soja'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-asi-05', name: 'Tataki de salmón salvaje marinado con salsa ponzu de yuzu y sésamo negro', allergens: ['Pescado', 'Soja', 'Sésamo'], dietaryTags: [], serviceTemp: '>65°C' },
      { id: 'din-asi-06', name: 'Rollitos vietnamitas frescos de papel de arroz con verduras y menta', allergens: ['Soja'], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: 'Fresco' }
    ]
  },
  {
    theme: 'Rincón Asador & Grill Ibérico',
    items: [
      { id: 'din-gri-01', name: 'Chuletón de novillo madurado 30 días troceado a la brasa en directo', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-gri-02', name: 'Costillar de cerdo ibérico laqueado con miel de caña y tomillo silvestre', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-gri-03', name: 'Pinchos morunos de cordero marinados al carbón con comino y pimentón', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-gri-04', name: 'Chistorra de Navarra y morcilla de Burgos a la parrilla con pimientos asados', allergens: ['Gluten'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-gri-05', name: 'Pimientos de Padrón fritos con sal gorda marina al momento', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-gri-06', name: 'Patatas asadas a las brasas rellenas de crema agria de cebollino', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' }
    ]
  },
  {
    theme: 'Rincón Marinero & Arroces del Mediterráneo',
    items: [
      { id: 'din-med-01', name: 'Paella marinera de mariscos con cigalas, mejillones de batea y calamares', allergens: ['Crustáceos', 'Moluscos', 'Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-med-02', name: 'Fideuà de Gandía dorada con sepia, gambas y alioli casero tradicional', allergens: ['Gluten', 'Crustáceos', 'Moluscos', 'Huevo'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-med-03', name: 'Arroz negro meloso en paellera con chipirones de playa y zamburiñas', allergens: ['Moluscos', 'Crustáceos', 'Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-med-04', name: 'Zarzuela de pescados de roca y mariscos en cazuela de barro', allergens: ['Pescado', 'Crustáceos', 'Moluscos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-med-05', name: 'Mejillones de roca al vapor de Albariño con laurel y pimienta', allergens: ['Moluscos', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-med-06', name: 'Fritura andaluza de calamarines, boquerones al limón y cazones en adobo', allergens: ['Gluten', 'Pescado', 'Moluscos'], dietaryTags: [], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Tex-Mex & Sabores de Oaxaca',
    items: [
      { id: 'din-mex-01', name: 'Tacos de cochinita pibil marinada en achiote con cebolla encurtida y lima', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-mex-02', name: 'Fajitas de ternera marinada al grill en comal con pimientos y cebolla', allergens: ['Gluten'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-mex-03', name: 'Quesadillas al momento con queso Oaxaca, champiñones y epazote', allergens: ['Lácteos', 'Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
      { id: 'din-mex-04', name: 'Guacamole molcajeteado en directo con totopos crujientes de maíz', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: 'Fresco' },
      { id: 'din-mex-05', name: 'Chili con carne tradicional con frijoles negros y crema agria', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-mex-06', name: 'Enchiladas verdes de pollo con salsa de tomatillo y queso fresco', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Francés: Brasserie & Alta Cocina Clásica',
    items: [
      { id: 'din-fra-01', name: 'Boeuf Bourguignon estofado al vino tinto de Borgoña con chalotas y champiñón', allergens: ['Sulfitos', 'Apio'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-fra-02', name: 'Magret de canard con salsa agridulce de grosellas y pimienta verde', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-fra-03', name: 'Gratin Dauphinois de patatas laminadas con nata fresca y nuez moscada', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-fra-04', name: 'Sopa de cebolla francesa gratinada con tosta de baguette y queso comté', allergens: ['Gluten', 'Lácteos'], dietaryTags: ['Vegetariano'], serviceTemp: '>75°C' },
      { id: 'din-fra-05', name: 'Quiche Lorraine artesanal de panceta ahumada y queso gruyère', allergens: ['Gluten', 'Huevo', 'Lácteos'], dietaryTags: [], serviceTemp: '>68°C' },
      { id: 'din-fra-06', name: 'Ratatouille provenzal al horno con finas hierbas y aceite virgen', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>70°C' }
    ]
  },
  {
    theme: 'Rincón Oriental: Sushi, Robata & Ramen',
    items: [
      { id: 'din-jap-01', name: 'Estación de Nigiris y Makis elaborados al momento por sushiman', allergens: ['Pescado', 'Soja', 'Sésamo', 'Crustáceos'], dietaryTags: [], serviceTemp: 'Fresco' },
      { id: 'din-jap-02', name: 'Yakitori de pollo braseado a la robata japonesa con salsa tare dulce', allergens: ['Soja', 'Gluten', 'Sésamo'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-jap-03', name: 'Caldo de Ramen tonkotsu con fideos frescos, huevo marinado ajitsuke y chashu', allergens: ['Gluten', 'Huevo', 'Soja'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-jap-04', name: 'Tempura de langostinos tigre y verduras finas con salsa tentsuyu', allergens: ['Gluten', 'Crustáceos', 'Soja'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-jap-05', name: 'Salmón glaseado al miso rojo horneado con brotes de soja tiernos', allergens: ['Pescado', 'Soja'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-jap-06', name: 'Edamame salteado en sartén con escamas de sal marina y shichimi togarashi', allergens: ['Soja', 'Sésamo'], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>70°C' }
    ]
  },
  {
    theme: 'Rincón Magrebí: Cuscús, Tajines & Especias',
    items: [
      { id: 'din-mag-01', name: 'Tajine de cordero estofado con ciruelas pasas, almendras tostadas y canela', allergens: ['Frutos de Cáscara'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-mag-02', name: 'Cuscús real con siete verduras de huerta, garbanzos y caldo aromático', allergens: ['Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
      { id: 'din-mag-03', name: 'Pastela moruna crujiente de pollo de corral con almendras y canela fina', allergens: ['Gluten', 'Frutos de Cáscara', 'Huevo'], dietaryTags: [], serviceTemp: '>68°C' },
      { id: 'din-mag-04', name: 'Koftas de ternera especiadas a la brasa con salsa de tahini y limón', allergens: ['Sésamo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-mag-05', name: 'Zaalouk de berenjenas asadas y tomate confitado con comino', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: 'Templado' },
      { id: 'din-mag-06', name: 'Tajine de lubina al horno con patatas, limones encurtidos y aceitunas moradas', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' }
    ]
  },
  {
    theme: 'Rincón Vasco & Cocina del Cantábrico',
    items: [
      { id: 'din-vas-01', name: 'Bacalao al pil-pil ligado tradicionalmente en cazuela de barro en vivo', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>68°C' },
      { id: 'din-vas-02', name: 'Marmitako de bonito fresco del norte con patatas y pulpa de pimiento choricero', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-vas-03', name: 'Txangurro a la donostiarra gratinado en su concha con mantequilla', allergens: ['Crustáceos', 'Lácteos', 'Gluten'], dietaryTags: [], serviceTemp: '>70°C' },
      { id: 'din-vas-04', name: 'Merluza a la koxkera con espárragos navarros, almejas y huevo escalfado', allergens: ['Pescado', 'Moluscos', 'Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-vas-05', name: 'Pintxos calientes en barra de gilda templada, solomillito con brie y brochetas', allergens: ['Pescado', 'Lácteos', 'Gluten'], dietaryTags: [], serviceTemp: '>65°C' },
      { id: 'din-vas-06', name: 'Chuletillas de cordero al sarmiento con ensalada de lechuga de caserío', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Griego & Mar Egeo',
    items: [
      { id: 'din-grk-01', name: 'Moussaka griega al horno con capas de berenjena, carne picada especiada y bechamel', allergens: ['Gluten', 'Lácteos', 'Huevo'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-grk-02', name: 'Souvlaki de pollo marinado con orégano silvestre y aceite griego a la brasa', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-grk-03', name: 'Spanakopita de pasta filo crujiente rellena de espinacas y queso feta', allergens: ['Gluten', 'Lácteos', 'Huevo'], dietaryTags: ['Vegetariano'], serviceTemp: '>70°C' },
      { id: 'din-grk-04', name: 'Pulpo a la brasa marinada en vinagre de vino tinto y orégano', allergens: ['Moluscos', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-grk-05', name: 'Tzatziki auténtico de pepino rallado, yogur de oveja y eneldo con pan pita caliente', allergens: ['Lácteos', 'Gluten'], dietaryTags: ['Vegetariano'], serviceTemp: 'Fresco' },
      { id: 'din-grk-06', name: 'Cordero asado al horno kleftiko cocinado en papillote con verduras', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Nórdico & Ahumados Escandinavos',
    items: [
      { id: 'din-nor-01', name: 'Gravlax de salmón salvaje curado con remolacha, ginebra y eneldo fresco', allergens: ['Pescado'], dietaryTags: ['Sin Gluten'], serviceTemp: 'Fresco' },
      { id: 'din-nor-02', name: 'Albóndigas suecas tradicionales köttbullar con salsa de nata y mermelada de arándanos', allergens: ['Lácteos', 'Gluten', 'Huevo'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-nor-03', name: 'Bacalao skrei asado con costra de mostaza dulce y puré de chirivía', allergens: ['Pescado', 'Lácteos', 'Mostaza'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-nor-04', name: 'Sopa cremosa de pescado y mariscos Bergen fiskesuppe', allergens: ['Pescado', 'Crustáceos', 'Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-nor-05', name: 'Arenque marinado en tres salsas (mostaza, eneldo y remolacha)', allergens: ['Pescado', 'Mostaza', 'Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: 'Fresco' },
      { id: 'din-nor-06', name: 'Patatas Hasselback doradas al horno con mantequilla y romero', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>75°C' }
    ]
  },
  {
    theme: 'Rincón Rodizio & Sabores de Brasil',
    items: [
      { id: 'din-bra-01', name: 'Picanha brasileña ensartada en espadas y cortada al momento al pase', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-bra-02', name: 'Costela de vaca asada lentamente al carbón durante 8 horas', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-bra-03', name: 'Feijoada tradicional completa con carnes ahumadas, farofa y naranja', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-bra-04', name: 'Corazón de pollo marinado al grill en brochetas doradas', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-bra-05', name: 'Pão de queijo artesano caliente con fécula de mandioca y queso curado', allergens: ['Huevo', 'Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-bra-06', name: 'Piña asada a la espada con costra de azúcar moreno y canela', allergens: [], dietaryTags: ['Vegano', 'Sin Gluten'], serviceTemp: '>70°C' }
    ]
  },
  {
    theme: 'Rincón Peruano & Fusión Nikkei',
    items: [
      { id: 'din-per-01', name: 'Ceviche clásico de corvina con leche de tigre, choclo tierno y camote glaseado', allergens: ['Pescado', 'Apio'], dietaryTags: ['Sin Gluten'], serviceTemp: 'Fresco' },
      { id: 'din-per-02', name: 'Lomo saltado al wok criollo con cebolla morada, tomate y patatas crujientes', allergens: ['Soja'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-per-03', name: 'Tiradito de atún nikkei con emulsión de maracuyá y sésamo tostado', allergens: ['Pescado', 'Soja', 'Sésamo'], dietaryTags: [], serviceTemp: 'Fresco' },
      { id: 'din-per-04', name: 'Ají de gallina cremoso con nueces pecanas, arroz blanco y aceituna botija', allergens: ['Lácteos', 'Frutos de Cáscara', 'Gluten'], dietaryTags: [], serviceTemp: '>75°C' },
      { id: 'din-per-05', name: 'Anticuchos de ternera macerados en ají panca a la parrilla con salsa huancaína', allergens: ['Lácteos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-per-06', name: 'Causa limeña de pulpo al olivo con masa de papa amarilla y ají amarillo', allergens: ['Moluscos', 'Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: 'Fresco' }
    ]
  },
  {
    theme: 'Rincón de la Dehesa: Ibéricos & Setas Silvestres',
    items: [
      { id: 'din-deh-01', name: 'Cortador de jamón de bellota 100% ibérico en directo con regañás artesanas', allergens: ['Gluten'], dietaryTags: [], serviceTemp: 'Ambiente' },
      { id: 'din-deh-02', name: 'Salteado de níscalos y boletus frescos con yema de huevo de corral y jamón', allergens: ['Huevo'], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' },
      { id: 'din-deh-03', name: 'Solomillo de jabalí estofado con castañas asadas y bayas de enebro', allergens: ['Sulfitos'], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-deh-04', name: 'Presa ibérica a la plancha con escamas de sal y pimientos confitados', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>75°C' },
      { id: 'din-deh-05', name: 'Tabla de quesos de oveja curados al romero y torta del Casar', allergens: ['Lácteos'], dietaryTags: ['Vegetariano', 'Sin Gluten'], serviceTemp: 'Ambiente' },
      { id: 'din-deh-06', name: 'Arroz meloso de matanza con costilla ibérica, morcilla y habitas tiernas', allergens: [], dietaryTags: ['Sin Gluten'], serviceTemp: '>70°C' }
    ]
  }
];

// Helper para generar los 30 días con los 2 bloques
export function generateMonthlyGastronomicMatrix(hotelId: string): DayGastronomicMatrix[] {
  const days: DayGastronomicMatrix[] = [];
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  for (let d = 1; d <= 30; d++) {
    const isBlock1 = d <= 15;
    const weekDay = weekDays[(d - 1) % 7];

    // Selección cíclica pero variada de los bancos de datos:
    // Desayuno (base 60)
    const breakfastItem = BREAKFAST_SHOW_COOKING_LIBRARY[(d - 1) % BREAKFAST_SHOW_COOKING_LIBRARY.length];
    
    // Almuerzo (base 60)
    const lunchItem = LUNCH_PROTEIN_LIBRARY[(d - 1) % LUNCH_PROTEIN_LIBRARY.length];

    // Cena (base 90 distribuidos en 15 rincones temáticos x 6 ítems = 90)
    const themeIndex = (d - 1) % DINNER_THEMATIC_CORNER_LIBRARY.length;
    const themeGroup = DINNER_THEMATIC_CORNER_LIBRARY[themeIndex];

    days.push({
      dayNumber: d,
      block: isBlock1 ? 'bloque_1' : 'bloque_2',
      weekDayLabel: weekDay,
      desayunoShowCooking: breakfastItem,
      almuerzoProteina: lunchItem,
      cenaRinconTematico: {
        themeName: themeGroup.theme,
        items: themeGroup.items
      },
      status: 'confirmado',
      notes: `Planificación operativa aprobada para ${hotelId.includes('vulcano') ? 'Hotel Vulcano' : 'Hotel Bitácora'}`
    });
  }

  return days;
}

export const gastronomicMatrixService = {
  getMonthlyMatrix(hotelId: string): DayGastronomicMatrix[] {
    try {
      const storageKey = `proa_gastronomic_matrix_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 30) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading gastronomic matrix:', e);
    }

    const initial = generateMonthlyGastronomicMatrix(hotelId);
    this.saveMonthlyMatrix(hotelId, initial);
    return initial;
  },

  saveMonthlyMatrix(hotelId: string, matrix: DayGastronomicMatrix[]): void {
    try {
      const storageKey = `proa_gastronomic_matrix_${hotelId}`;
      localStorage.setItem(storageKey, JSON.stringify(matrix));
    } catch (e) {
      console.error('Error saving gastronomic matrix:', e);
    }
  },

  updateDayMatrix(hotelId: string, dayNumber: number, updatedDay: Partial<DayGastronomicMatrix>): DayGastronomicMatrix[] {
    const matrix = this.getMonthlyMatrix(hotelId);
    const index = matrix.findIndex(d => d.dayNumber === dayNumber);
    if (index >= 0) {
      matrix[index] = { ...matrix[index], ...updatedDay };
      this.saveMonthlyMatrix(hotelId, matrix);
    }
    return matrix;
  }
};
