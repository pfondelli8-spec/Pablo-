import { TechnicalSheet, MenuItem } from '../types/hotelPortal';
import { DEFAULT_ITEM_PHOTOS } from '../services/customPhotos';
import { AGORA_MASTER_PRODUCTS, AGORA_PRICES_LOOKUP } from './agoraPricesMaster';

/**
 * MANUAL DE INGENIERÍA DE SERVICIO Y COCTELERÍA
 * KLAYMAN DIAMOND APARTHOTEL · DEPARTAMENTO F&B
 * 45 FICHAS TÉCNICAS NORMALIZADAS · REVISIÓN IBA 2026
 * 
 * Normativa:
 * - Columna 1: Materia prima (cl exactos con jigger, orden de vertido, tipo de hielo estructural)
 * - Columna 2: Ingeniería de servicio (fotografía, cristalería homologada, método en instrucción ejecutable)
 * - Columna 3: Acabados y control (útiles necesarios, garnish milimétrico, semáforo crítico de alérgenos y observación técnica)
 */
export const COCKTAILS_MASTER_TECHNICAL_SHEETS: TechnicalSheet[] = [];

/**
 * REGISTRO OFICIAL DE ESCANDALLOS DE COCTELERÍA 2026 · 45 RECETAS
 * Numeración oficial alineada con la presentación · FT CKT 01 a FT CKT 45
 */
export const OFFICIAL_COCKTAIL_REGISTRY_2026: Record<string, {
  number: number;
  origin: 'Escandallo original' | 'Receta maestra';
  costStatus: 'Costes importados' | 'Pendiente artículos/costes';
}> = {
  'FT CKT 01': { number: 1, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 02': { number: 2, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 03': { number: 3, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 04': { number: 4, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 05': { number: 5, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 06': { number: 6, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 07': { number: 7, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 08': { number: 8, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 09': { number: 9, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 10': { number: 10, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 11': { number: 11, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 12': { number: 12, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 13': { number: 13, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 14': { number: 14, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 15': { number: 15, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 16': { number: 16, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 17': { number: 17, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 18': { number: 18, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 19': { number: 19, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 20': { number: 20, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 21': { number: 21, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 22': { number: 22, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 23': { number: 23, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 24': { number: 24, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 25': { number: 25, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 26': { number: 26, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 27': { number: 27, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 28': { number: 28, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 29': { number: 29, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 30': { number: 30, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 31': { number: 31, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 32': { number: 32, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 33': { number: 33, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 34': { number: 34, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 35': { number: 35, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 36': { number: 36, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 37': { number: 37, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 38': { number: 38, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 39': { number: 39, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 40': { number: 40, origin: 'Receta maestra', costStatus: 'Pendiente artículos/costes' },
  'FT CKT 41': { number: 41, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 42': { number: 42, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 43': { number: 43, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 44': { number: 44, origin: 'Escandallo original', costStatus: 'Costes importados' },
  'FT CKT 45': { number: 45, origin: 'Receta maestra', costStatus: 'Costes importados' }
};

/**
 * CATÁLOGO DE PRODUCTOS EN CARTA CON VINCULACIÓN A LAS 44 FICHAS TÉCNICAS
 */
export const COCKTAILS_MASTER_MENU_ITEMS: {
  alcoholic: MenuItem[];
  nonAlcoholic: MenuItem[];
} = {
  alcoholic: COCKTAILS_MASTER_TECHNICAL_SHEETS
    .filter(sheet => !['ft-dia-ckt-22', 'ft-dia-ckt-23', 'ft-dia-ckt-24'].includes(sheet.id))
    .map(sheet => ({
      id: `item-${sheet.id.replace('ft-dia-', '')}-${sheet.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: sheet.name || sheet.title,
      price: sheet.escandallo?.sellingPrice || 8.50,
      ingredientsSummary: sheet.ingredients.map(i => `${i.name} (${i.quantity})`).join(', '),
      description: `${sheet.technique}. ${sheet.notes || sheet.presentation || ''}`,
      allergens: sheet.allergens,
      technicalSheetId: sheet.id,
      tag: `${sheet.code} · ${sheet.glassware} · ${sheet.escandallo?.sellingPrice ? `${sheet.escandallo.sellingPrice.toFixed(2)} €` : '8,50 €'}`
    })),
  nonAlcoholic: [
    {
      id: 'item-ckt-22-virgin-mojito',
      name: 'Virgin Mojito',
      price: 6.50,
      ingredientsSummary: 'Hierbabuena, zumo de lima, sirope de azúcar y soda.',
      description: 'Presionar la menta sin romperla, rellenar con hielo picado y completar.',
      allergens: ['Verificar sirope'],
      technicalSheetId: 'ft-dia-ckt-22',
      tag: 'FT CKT 22 · Sin Alcohol · 6,50 €'
    },
    {
      id: 'item-ckt-23-san-francisco',
      name: 'San Francisco',
      price: 6.50,
      ingredientsSummary: 'Zumo de naranja, piña, melocotón y granadina.',
      description: 'Agitar los zumos y verter la granadina al final para el degradado.',
      allergens: ['Verificar cereza en almíbar'],
      technicalSheetId: 'ft-dia-ckt-23',
      tag: 'FT CKT 23 · Sin Alcohol · 6,50 €'
    },
    {
      id: 'item-ckt-24-virgin-colada',
      name: 'Virgin Colada',
      price: 6.50,
      ingredientsSummary: 'Crema de coco, zumo de piña y nata líquida.',
      description: 'Batir en blender hasta obtener textura densa y cremosa.',
      allergens: ['Lácteos (Nata líquida y crema de coco)'],
      technicalSheetId: 'ft-dia-ckt-24',
      tag: 'FT CKT 24 · Sin Alcohol · 6,50 €'
    }
  ]
};

// Auto-asociación de fotografías oficiales y metadatos oficiales del Escandallo 2026
COCKTAILS_MASTER_TECHNICAL_SHEETS.forEach(sheet => {
  const meta = OFFICIAL_COCKTAIL_REGISTRY_2026[sheet.code];
  if (meta) {
    sheet.officialNumber = meta.number;
    sheet.originType = meta.origin;
    sheet.costStatus = meta.costStatus;
  }
  if (!sheet.imageUrl && DEFAULT_ITEM_PHOTOS[sheet.id]) {
    sheet.imageUrl = DEFAULT_ITEM_PHOTOS[sheet.id];
  }
});

COCKTAILS_MASTER_MENU_ITEMS.alcoholic.forEach(item => {
  if (!item.imageUrl) {
    item.imageUrl = DEFAULT_ITEM_PHOTOS[item.id] || (item.technicalSheetId ? DEFAULT_ITEM_PHOTOS[item.technicalSheetId] : undefined);
  }
});

COCKTAILS_MASTER_MENU_ITEMS.nonAlcoholic.forEach(item => {
  if (!item.imageUrl) {
    item.imageUrl = DEFAULT_ITEM_PHOTOS[item.id] || (item.technicalSheetId ? DEFAULT_ITEM_PHOTOS[item.technicalSheetId] : undefined);
  }
});

// FASE 1 – INTEGRACIÓN DE PRECIOS OFICIALES ÁGORA ERP
COCKTAILS_MASTER_TECHNICAL_SHEETS.forEach(sheet => {
  const agora = AGORA_MASTER_PRODUCTS.find(p => p.technicalSheetId === sheet.id || p.code === sheet.code);
  if (agora) {
    sheet.precioOlivina = agora.precioOlivina;
    sheet.precioHHOlivina = agora.precioHHOlivina;
    sheet.precioDiamond = agora.precioDiamond;
    sheet.precioHHDiamond = agora.precioHHDiamond;
    sheet.documentationStatus = agora.documentationStatus;
  } else {
    sheet.precioOlivina = null;
    sheet.precioHHOlivina = null;
    sheet.precioDiamond = sheet.escandallo?.sellingPrice ?? 8.50;
    sheet.precioHHDiamond = null;
    sheet.documentationStatus = 'DOCUMENTADA';
  }
});

COCKTAILS_MASTER_MENU_ITEMS.alcoholic.forEach(item => {
  const agora = AGORA_PRICES_LOOKUP[item.id] || AGORA_MASTER_PRODUCTS.find(p => p.technicalSheetId === item.technicalSheetId);
  if (agora) {
    item.precioOlivina = agora.precioOlivina;
    item.precioHHOlivina = agora.precioHHOlivina;
    item.precioDiamond = agora.precioDiamond;
    item.precioHHDiamond = agora.precioHHDiamond;
    item.documentationStatus = agora.documentationStatus;
  } else {
    item.precioOlivina = null;
    item.precioHHOlivina = null;
    item.precioDiamond = item.price ?? 8.50;
    item.precioHHDiamond = null;
    item.documentationStatus = item.technicalSheetId ? 'DOCUMENTADA' : 'PENDIENTE DE DOCUMENTAR';
  }
});

COCKTAILS_MASTER_MENU_ITEMS.nonAlcoholic.forEach(item => {
  const agora = AGORA_PRICES_LOOKUP[item.id] || AGORA_MASTER_PRODUCTS.find(p => p.technicalSheetId === item.technicalSheetId);
  if (agora) {
    item.precioOlivina = agora.precioOlivina;
    item.precioHHOlivina = agora.precioHHOlivina;
    item.precioDiamond = agora.precioDiamond;
    item.precioHHDiamond = agora.precioHHDiamond;
    item.documentationStatus = agora.documentationStatus;
  } else {
    item.precioOlivina = null;
    item.precioHHOlivina = null;
    item.precioDiamond = item.price ?? 6.50;
    item.precioHHDiamond = null;
    item.documentationStatus = item.technicalSheetId ? 'DOCUMENTADA' : 'PENDIENTE DE DOCUMENTAR';
  }
});
