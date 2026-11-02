/**
 * FASE 5 – COMPLETAR DOCUMENTACIÓN OPERATIVA
 * Auditoría y Enriquecimiento de Documentación Operativa de Productos
 * 
 * Evalúa los 69 productos existentes y completa:
 * - Descripción comercial
 * - Categoría
 * - Subcategoría
 * - Ingredientes principales (fuente: ficha técnica o escandallo o carta)
 * - Alérgenos
 * - Observaciones de servicio (temperatura, mise en place)
 * - Presentación (cristalería, garnish)
 * - Estado documental:
 *   - COMPLETO
 *   - REVISAR FOTO
 *   - REVISAR ALÉRGENOS
 *   - REVISAR FICHA TÉCNICA
 *   - REVISAR ESCANDALLO
 *   - PENDIENTE DE DOCUMENTAR
 */

import { AGORA_MASTER_PRODUCTS, AgoraProductPriceEntry } from './agoraPricesMaster';
import { TECHNICAL_SHEETS_DATABASE, DIAMOND_MENUS } from './hotelPortalData';
import { BAR_SOL_MENU } from './operationsData';
import { DEFAULT_ITEM_PHOTOS, resolveItemPhoto } from '../services/customPhotos';

export type OperationalAuditState = 
  | 'COMPLETO' 
  | 'REVISAR FOTO' 
  | 'REVISAR ALÉRGENOS' 
  | 'REVISAR FICHA TÉCNICA' 
  | 'REVISAR ESCANDALLO' 
  | 'PENDIENTE DE DOCUMENTAR';

export interface EnrichedOperationalProduct {
  id: string;
  code?: string;
  name: string;
  category: string;
  subcategory: string;
  comercialDescription: string;
  mainIngredients: string[];
  allergens: string[];
  serviceObservations: string;
  presentation: string;
  imageUrl: string | null;
  precioDiamond: number | null;
  precioHHDiamond: number | null;
  precioOlivina: number | null;
  precioHHOlivina: number | null;
  hasPhoto: boolean;
  hasTechnicalSheet: boolean;
  hasEscandallo: boolean;
  hasAllergens: boolean;
  isDrink: boolean;
  isFood: boolean;
  auditState: OperationalAuditState;
  technicalSheetId?: string | null;
}

// Mapa auxiliar de cartas para consulta rápida
const menuItemsMap = new Map();
DIAMOND_MENUS.forEach(m => m.sections.forEach(sec => sec.items.forEach(i => menuItemsMap.set(i.id, i))));
BAR_SOL_MENU.forEach(i => menuItemsMap.set(i.id, i));

/**
 * Catálogo consolidado enriquecido con documentación operativa FASE 5
 */
export const ENRICHED_OPERATIONAL_PRODUCTS: EnrichedOperationalProduct[] = AGORA_MASTER_PRODUCTS.map(p => {
  const sheet = TECHNICAL_SHEETS_DATABASE.find(s => s.id === p.technicalSheetId || s.code === p.code);
  const mi = menuItemsMap.get(p.id);

  // 1. Descripción comercial
  const desc = (sheet && sheet.additionalInfo) || (mi && mi.description) || '';
  
  // 2. Categoría y Subcategoría
  const cat = p.category;
  const subcat = p.categoryLabel;

  // 3. Ingredientes principales (sin inventar, desde fuente técnica o escandallo)
  let mainIng: string[] = [];
  if (sheet && sheet.ingredients && sheet.ingredients.length > 0) {
    mainIng = sheet.ingredients.map(i => i.name + (i.quantity ? ` (${i.quantity})` : ''));
  } else if (mi && mi.ingredientsSummary) {
    mainIng = mi.ingredientsSummary.split(',').map(s => s.trim()).filter(Boolean);
  }

  // 4. Alérgenos
  let allergens: string[] = [];
  if (sheet && sheet.allergens) {
    allergens = sheet.allergens;
  } else if (mi && mi.allergens) {
    allergens = mi.allergens;
  }

  // 5. Observaciones de servicio
  let obs = '';
  if (sheet && sheet.keyQualityPoints && sheet.keyQualityPoints.length > 0) {
    obs = sheet.keyQualityPoints[0];
  } else if (sheet && sheet.servingTemperature) {
    obs = `Temperatura de servicio: ${sheet.servingTemperature}`;
  } else {
    obs = 'PENDIENTE DE REVISIÓN';
  }

  // 6. Presentación (cristalería, garnish)
  let pres = '';
  if (sheet && (sheet.glassware || sheet.garnish)) {
    pres = (sheet.glassware ? sheet.glassware : '') + (sheet.garnish ? ` · Garnish: ${sheet.garnish}` : '');
  } else {
    pres = 'PENDIENTE DE REVISIÓN';
  }

  // 7. Fotografía
  const photo = p.imageUrl || sheet?.imageUrl || mi?.imageUrl || DEFAULT_ITEM_PHOTOS[p.id] || (p.technicalSheetId && DEFAULT_ITEM_PHOTOS[p.technicalSheetId]) || null;
  const hasPhoto = Boolean(photo);
  const hasSheet = Boolean(sheet);
  const hasEscandallo = Boolean(sheet && sheet.escandallo);
  const hasAllergens = Boolean(allergens.length > 0 || (sheet && Array.isArray(sheet.allergens)) || (mi && Array.isArray(mi.allergens)));

  const isDrink = p.category === 'cocteles' || p.category === 'cafeteria' || p.category === 'cervezas_bebidas' || p.category === 'vinos_cavas' || (mi && (mi.category === 'cocteles' || mi.category === 'cafeteria'));
  const isFood = !isDrink;

  // 8. Estado documental estandarizado
  let auditState: OperationalAuditState = 'PENDIENTE DE DOCUMENTAR';
  if (hasSheet && hasEscandallo && hasPhoto && desc && mainIng.length > 0 && obs !== 'PENDIENTE DE REVISIÓN' && pres !== 'PENDIENTE DE REVISIÓN') {
    auditState = 'COMPLETO';
  } else if (!hasPhoto) {
    auditState = 'REVISAR FOTO';
  } else if (!hasAllergens) {
    auditState = 'REVISAR ALÉRGENOS';
  } else if (!hasSheet) {
    auditState = 'REVISAR FICHA TÉCNICA';
  } else if (!hasEscandallo) {
    auditState = 'REVISAR ESCANDALLO';
  }

  return {
    id: p.id,
    code: p.code || sheet?.code,
    name: p.name,
    category: cat,
    subcategory: subcat,
    comercialDescription: desc,
    mainIngredients: mainIng,
    allergens,
    serviceObservations: obs,
    presentation: pres,
    imageUrl: photo,
    precioDiamond: p.precioDiamond,
    precioHHDiamond: p.precioHHDiamond,
    precioOlivina: p.precioOlivina,
    precioHHOlivina: p.precioHHOlivina,
    hasPhoto,
    hasTechnicalSheet: hasSheet,
    hasEscandallo,
    hasAllergens,
    isDrink,
    isFood,
    auditState,
    technicalSheetId: p.technicalSheetId
  };
});

/**
 * Función para obtener el informe consolidado oficial de FASE 5
 */
export function getPhase5OperationalAuditReport() {
  const total = ENRICHED_OPERATIONAL_PRODUCTS.length;
  const completos = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => p.auditState === 'COMPLETO');
  const pendientes = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => p.auditState !== 'COMPLETO');
  const sinFoto = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => !p.hasPhoto);
  const sinAlergenos = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => !p.hasAllergens);
  const sinFicha = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => !p.hasTechnicalSheet);
  const sinEscandallo = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => !p.hasEscandallo);

  const bebidas = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => p.isDrink);
  const comida = ENRICHED_OPERATIONAL_PRODUCTS.filter(p => p.isFood);
  const bebidasCompletas = bebidas.filter(p => p.auditState === 'COMPLETO');
  const comidaCompleta = comida.filter(p => p.auditState === 'COMPLETO');

  // Cálculo ponderado de atributos completos
  let totalAtributosDocumentados = 0;
  ENRICHED_OPERATIONAL_PRODUCTS.forEach(p => {
    if (p.hasPhoto) totalAtributosDocumentados++;
    if (p.comercialDescription) totalAtributosDocumentados++;
    if (p.category) totalAtributosDocumentados++;
    if (p.subcategory) totalAtributosDocumentados++;
    if (p.mainIngredients.length > 0) totalAtributosDocumentados++;
    if (p.hasAllergens) totalAtributosDocumentados++;
    if (p.hasTechnicalSheet) totalAtributosDocumentados++;
    if (p.hasEscandallo) totalAtributosDocumentados++;
  });
  const porcentajeAtributos = (totalAtributosDocumentados / (total * 8)) * 100;

  return {
    totalProductos: total,
    productosCompletos: completos.length,
    productosPendientes: pendientes.length,
    productosSinFoto: sinFoto.length,
    productosSinAlergenos: sinAlergenos.length,
    productosSinFicha: sinFicha.length,
    productosSinEscandallo: sinEscandallo.length,
    porcentajeDocumentacionCompletada: (completos.length / total) * 100,
    porcentajeAtributosDocumentados: porcentajeAtributos,
    porcentajeBebidasCompletas: (bebidasCompletas.length / bebidas.length) * 100,
    totalBebidas: bebidas.length,
    bebidasCompletasCount: bebidasCompletas.length,
    porcentajeComidaCompleta: (comidaCompleta.length / comida.length) * 100,
    totalComida: comida.length,
    comidaCompletaCount: comidaCompleta.length
  };
}
