import { TechnicalSheet, TechnicalSheetIngredient } from '../types/hotelPortal';

/**
 * Mapeo de marcas comerciales o nombres informales a nomenclatura técnica estandarizada F&B
 */
const INGREDIENT_STANDARDIZATION_MAP: Record<string, string> = {
  // Rones
  'bacardi': 'Ron blanco',
  'bacardí': 'Ron blanco',
  'bacardi carta blanca': 'Ron blanco',
  'havana club': 'Ron blanco',
  'havana 3': 'Ron blanco',
  'havana 7': 'Ron añejo',
  'barcelo': 'Ron añejo',
  'barceló': 'Ron añejo',
  'ron barcelo': 'Ron añejo',
  'zacapa': 'Ron gran reserva añejo',
  'captain morgan': 'Ron especiado',

  // Ginebras
  'bombay': 'Ginebra London Dry',
  'bombay sapphire': 'Ginebra London Dry',
  'tanqueray': 'Ginebra London Dry',
  'tanqueray ten': 'Ginebra destilada premium',
  'beefeater': 'Ginebra London Dry',
  'hendricks': 'Ginebra destilada botánica',
  'hendrick\'s': 'Ginebra destilada botánica',
  'puerto de indias': 'Ginebra aromatizada de fresa',

  // Vodkas
  'absolut': 'Vodka neutro',
  'absolut blue': 'Vodka neutro',
  'smirnoff': 'Vodka neutro',
  'grey goose': 'Vodka premium de trigo',
  'belvedere': 'Vodka premium de centeno',

  // Tequilas y Mezcales
  'jose cuervo': 'Tequila blanco',
  'cuervo': 'Tequila mixto',
  'herradura': 'Tequila 100% agave',
  'patron': 'Tequila blanco 100% agave',
  'patrón': 'Tequila blanco 100% agave',
  'don julio': 'Tequila reposado 100% agave',

  // Licores y Aperitivos
  'campari': 'Bitter aperitivo rojo',
  'aperol': 'Aperitivo amargo de naranja y hierbas',
  'cointreau': 'Triple seco / Licor de naranja',
  'grand marnier': 'Licor de naranja a base de cognac',
  'kahlua': 'Licor de café',
  'kahlúa': 'Licor de café',
  'tia maria': 'Licor de café y vainilla',
  'disaronno': 'Licor de almendra amarga (Amaretto)',
  'amaretto': 'Licor de almendra amarga',
  'baileys': 'Crema de whisky irlandés',
  'angostura': 'Bitter aromático concentrado',
  'martini rosso': 'Vermut rojo dulce',
  'martini bianco': 'Vermut blanco dulce',
  'martini extra dry': 'Vermut seco',

  // Mezcladores y Soft Drinks
  'coca cola': 'Refresco de cola',
  'coca-cola': 'Refresco de cola',
  'pepsi': 'Refresco de cola',
  'schweppes tonica': 'Tónica premium',
  'schweppes tónica': 'Tónica premium',
  'tonica schweppes': 'Tónica premium',
  'red bull': 'Bebida energética taurina',
  'sprite': 'Refresco de lima-limón',
  'seven up': 'Refresco de lima-limón',
  '7up': 'Refresco de lima-limón',
  'fanta': 'Refresco de naranja',
  'ginger beer': 'Cerveza de jengibre fermentada',
  'ginger ale': 'Refresco carbonatado de jengibre'
};

/**
 * Normaliza el nombre de un ingrediente sustituyendo marcas comerciales
 * por nomenclatura técnica estandarizada.
 */
export function standardizeIngredientName(name: string): string {
  const clean = name.trim();
  const lower = clean.toLowerCase();

  for (const [brand, technical] of Object.entries(INGREDIENT_STANDARDIZATION_MAP)) {
    if (lower === brand || lower.includes(brand)) {
      return technical;
    }
  }

  // Si no está en el mapa, devolver el nombre limpio asegurando mayúscula inicial
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Estandariza un verbo o frase en primera persona del plural (Añadimos, Agitamos, etc.)
 */
export function standardizeActionStep(step: string): string {
  let s = step.trim();
  // Quitar numeración previa tipo "1.", "1 -", etc.
  s = s.replace(/^\d+[\.\-\)]\s*/, '');

  const replacements: [RegExp, string][] = [
    [/^(agitar|agite|agita|shake)\b/i, 'Agitamos'],
    [/^(añadir|añada|agrega|agregar|add)\b/i, 'Añadimos'],
    [/^(servir|sirva|sirve|pour)\b/i, 'Servimos'],
    [/^(decorar|decore|decora|garnish)\b/i, 'Decoramos'],
    [/^(enfriar|enfrie|enfria|chill)\b/i, 'Enfriamos'],
    [/^(colar|cuele|cola|strain)\b/i, 'Colamos'],
    [/^(doble colar|hacer doble colado|double strain)\b/i, 'Realizamos doble colado'],
    [/^(remover|remueva|remueve|stir)\b/i, 'Removemos con cuchara imperial'],
    [/^(majado|majar|mache|muddle)\b/i, 'Majamos suavemente'],
    [/^(completar|complete|completa|top)\b/i, 'Completamos'],
    [/^(mezclar|mezcle|mezcla|mix)\b/i, 'Mezclamos homogéneamente'],
    [/^(exprimir|exprima|exprime|squeeze)\b/i, 'Exprimimos']
  ];

  for (const [regex, replacement] of replacements) {
    if (regex.test(s)) {
      s = s.replace(regex, replacement);
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Genera estrictamente el texto base estandarizado según la estructura exigida:
 * 
 * [NOMBRE DEL CÓCTEL / PLATO]
 *  * FORMULACIÓN: Presenta los ingredientes especificando primero la medida exacta (cl, gr, un., gotas) seguida del ingrediente con su nomenclatura técnica estandarizada.
 *  * FLUJO DE ELABORACIÓN: Enumera los pasos de forma secuencial (1, 2, 3...), utilizando verbos de acción precisos en primera persona del plural (Añadimos, Agitamos, Servimos, Decoramos).
 *  * CRISTALERÍA Y ÚTILES: Especifica el tipo de vaso y las herramientas necesarias de barra.
 *  * DIAGNÓSTICO: Incluye una nota técnica concisa sobre el perfil de la bebida, su concepto o matices de sabor.
 *  * ALÉRGENOS: Lista los alérgenos presentes según la normativa.
 */
export function formatTechnicalSheetStandardText(sheet: Partial<TechnicalSheet>): string {
  const name = (sheet.name || sheet.title || 'FICHA TÉCNICA SIN NOMBRE').toUpperCase();

  // Formulación: Medida exacta primero seguida de nomenclatura estandarizada
  const formulationItems = (sheet.ingredients || []).map(ing => {
    const qty = (ing.quantity || '').trim();
    const ingName = standardizeIngredientName(ing.name);
    return `${qty} ${ingName}`.trim();
  });
  const formulationText = formulationItems.length > 0 
    ? formulationItems.join(', ') 
    : 'No especificada';

  // Flujo de elaboración: 1, 2, 3... con verbos en primera persona del plural
  const steps = (sheet.preparationMethod || sheet.method || []).map((step, idx) => {
    const standardizedStep = standardizeActionStep(step);
    return `${idx + 1}. ${standardizedStep}`;
  });
  const elaborationFlowText = steps.length > 0 
    ? steps.join(' ') 
    : '1. Añadimos los componentes técnicos según dosificación. 2. Mezclamos y servimos en temperatura de servicio.';

  // Cristalería y útiles
  const glassware = sheet.glassware || 'Vaso / Copa técnica no especificada';
  const tools = sheet.tools || 'Coctelera Boston, colador gusanillo (Hawthorne), jigger graduado y pinzas de precisión';
  const glasswareAndToolsText = `${glassware}. Útiles: ${tools}.`;

  // Diagnóstico
  const diagnosisText = sheet.diagnosis || 
    (sheet.notes ? sheet.notes : 'Perfil equilibrado y balance organoléptico definido para servicio técnico en sala/barra.');

  // Alérgenos según normativa (14 alérgenos UE)
  const allergensText = (sheet.allergens && sheet.allergens.length > 0 && sheet.allergens[0] !== 'Sin alérgenos declarables')
    ? sheet.allergens.join(', ')
    : 'Sin alérgenos declarables (Reglamento UE 1169/2011)';

  return `[${name}]
 * FORMULACIÓN: ${formulationText}
 * FLUJO DE ELABORACIÓN: ${elaborationFlowText}
 * CRISTALERÍA Y ÚTILES: ${glasswareAndToolsText}
 * DIAGNÓSTICO: ${diagnosisText}
 * ALÉRGENOS: ${allergensText}`;
}

/**
 * Función transformadora para convertir cualquier receta en texto libre
 * en una ficha técnica estandarizada lista para TPV o manuales operativos.
 */
export function transformRawRecipeToStandardized(input: string): {
  standardizedText: string;
  sheetData: Partial<TechnicalSheet>;
} {
  const lines = input.split('\n').map(l => l.trim()).filter(Boolean);

  let rawName = 'Cóctel Estandarizado';
  const ingredients: TechnicalSheetIngredient[] = [];
  const rawSteps: string[] = [];
  let glassware = 'Vaso Old Fashioned';
  let tools = 'Coctelera, jigger y colador';
  let diagnosis = 'Perfil equilibrado y técnica operativa estandarizada.';
  const detectedAllergens: string[] = [];

  // Analizar líneas del texto
  let currentSection: 'header' | 'ingredients' | 'steps' | 'other' = 'header';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detectar título entre corchetes o primera línea corta
    if (i === 0 && line.length < 50 && !line.includes(':')) {
      rawName = line.replace(/[\[\]]/g, '').trim();
      continue;
    }

    if (/^(ingredientes|formulación|receta|ingredientes:)/i.test(line)) {
      currentSection = 'ingredients';
      continue;
    }
    if (/^(preparación|elaboración|pasos|método|flujo)/i.test(line)) {
      currentSection = 'steps';
      continue;
    }

    // Extracción de ingredientes con medidas
    const measureMatch = line.match(/^(\d+(?:[\.,]\d+)?\s*(?:cl|ml|gr|g|oz|un\.|unidades|gotas|dash|golpes|dashs|hojas|cucharadas|barspoon))\s+(?:de\s+)?(.+)$/i);
    if (measureMatch) {
      const quantity = measureMatch[1].trim();
      const rawIngName = measureMatch[2].replace(/^[-•*]\s*/, '').trim();
      const stdName = standardizeIngredientName(rawIngName);
      ingredients.push({ quantity, name: stdName });

      // Detección simple de alérgenos
      const lower = rawIngName.toLowerCase();
      if (lower.includes('huevo') || lower.includes('clara')) detectedAllergens.push('Huevos');
      if (lower.includes('leche') || lower.includes('nata') || lower.includes('crema')) detectedAllergens.push('Lácteos');
      if (lower.includes('frutos secos') || lower.includes('almendra') || lower.includes('nuez')) detectedAllergens.push('Frutos de cáscara');
      if (lower.includes('sulfitos') || lower.includes('vino') || lower.includes('vermut')) detectedAllergens.push('Sulfitos');
      continue;
    }

    // Pasos numerados o con guiones
    if (/^\d+[\.\-\)]\s*/.test(line) || currentSection === 'steps') {
      rawSteps.push(line);
      continue;
    }

    // Cristalería y útiles
    if (/^(cristalería|vaso|copa)/i.test(line)) {
      glassware = line.replace(/^(cristalería|vaso|copa):?\s*/i, '').trim();
      continue;
    }
    if (/^(útiles|herramientas|tools)/i.test(line)) {
      tools = line.replace(/^(útiles|herramientas|tools):?\s*/i, '').trim();
      continue;
    }
    if (/^(diagnóstico|perfil|nota)/i.test(line)) {
      diagnosis = line.replace(/^(diagnóstico|perfil|nota):?\s*/i, '').trim();
      continue;
    }
  }

  // Fallbacks si no se detectaron pasos o ingredientes suficientes
  if (ingredients.length === 0) {
    ingredients.push(
      { quantity: '5 cl', name: 'Destilado base estandarizado' },
      { quantity: '3 cl', name: 'Zumo fresco de cítrico' },
      { quantity: '2 cl', name: 'Jarabe de azúcar simple' }
    );
  }

  if (rawSteps.length === 0) {
    rawSteps.push(
      'Añadimos todos los ingredientes técnicos en la coctelera con hielo macizo.',
      'Agitamos enérgicamente durante 12 segundos para lograr emulsión y enfriamiento.',
      'Servimos realizando doble colado sobre cristalería pre-enfriada.',
      'Decoramos con el garnish homologado según manual operativo.'
    );
  }

  const sheetData: Partial<TechnicalSheet> = {
    name: rawName,
    title: rawName,
    ingredients,
    preparationMethod: rawSteps,
    glassware,
    tools,
    diagnosis,
    allergens: detectedAllergens.length > 0 ? Array.from(new Set(detectedAllergens)) : ['Sin alérgenos declarables']
  };

  const standardizedText = formatTechnicalSheetStandardText(sheetData);

  return {
    standardizedText,
    sheetData
  };
}
