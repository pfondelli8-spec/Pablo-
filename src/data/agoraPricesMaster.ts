/**
 * ARCHIVO MAESTRO DE PRECIOS OFICIALES Y CONTROL DE FICHAS TÉCNICAS (ÁGORA ERP)
 * FASE 1 – INTEGRACIÓN DE PRECIOS MULTI-ESTABLECIMIENTO
 * 
 * Centraliza la relación unificada de productos, tarifas y estado documental:
 * - Precio Olivina
 * - Precio HH Olivina (Happy Hour)
 * - Precio Diamond
 * - Precio HH Diamond (Happy Hour Diario 2 Cócteles x 12€ / 2 Jarras x 6€ y Viernes 2x1 Cócteles)
 * 
 * Regla de negocio:
 * - Única ficha por producto (sin duplicados).
 * - Fichas técnicas, fotos y escandallos existentes se conservan 100% intactos.
 * - Productos con precio pero sin ficha técnica oficial: Marcados como "PENDIENTE DE DOCUMENTAR".
 */

import { DEFAULT_ITEM_PHOTOS } from '../services/customPhotos';

export interface AgoraProductPriceEntry {
  id: string;
  code?: string;
  name: string;
  family?: string;
  subfamily?: string;
  category: 'cocteles' | 'cafeteria' | 'cervezas_bebidas' | 'vinos_cavas' | 'confiteria_tartas' | 'snacks_terraza' | 'restauracion_sol';
  categoryLabel: string;
  hotelAvailability: ('klayman-diamond' | 'klayman-olivina')[];
  precioOlivina: number | null;
  precioHHOlivina: number | null;
  precioDiamond: number | null;
  precioHHDiamond: number | null;
  technicalSheetId: string | null;
  escandallo?: {
    rawCost: number;
    sellingPrice: number;
    marginPercent: number;
  } | null;
  imageUrl?: string | null;
  documentationStatus: 'DOCUMENTADA' | 'PENDIENTE DE DOCUMENTAR';
  notes?: string;
}

export const AGORA_MASTER_PRODUCTS: AgoraProductPriceEntry[] = [
  // =========================================================================
  // 1. CÓCTELES CON ALCOHOL (29 CÓCTELES HOMOLOGADOS · KLAYMAN DIAMOND)
  // =========================================================================
  {
    id: 'item-ckt-01-sex-on-the-beach',
    code: 'FT CKT 01',
    name: 'Sex on the Beach',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25, // 2x1 Happy Hour Sunset & Viernes Todo el Día
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-01',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-02-blue-diamond',
    code: 'FT CKT 02',
    name: 'Blue Diamond (Insignia Sunset)',
    category: 'cocteles',
    categoryLabel: 'Coctelería Signature',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-02',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-03-mojito-tradicional',
    code: 'FT CKT 03',
    name: 'Mojito Tradicional',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: 7.80, // Mojito Canario Bar Sol Olivina
    precioHHOlivina: 3.90,
    technicalSheetId: 'ft-dia-ckt-03',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-04-mojito-sabores',
    code: 'FT CKT 04',
    name: 'Mojito Sabores (Fresa o Fruta de la Pasión)',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-04',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-05-daiquiris-sabores',
    code: 'FT CKT 05',
    name: 'Daiquiri (Fresa o Fruta de la Pasión)',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-05',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-06-margarita-tradicional',
    code: 'FT CKT 06',
    name: 'Margarita Tradicional',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-06',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-07-margarita-sabores',
    code: 'FT CKT 07',
    name: 'Margarita Sabores (Fresa o Fruta de la Pasión)',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-07',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-08-vodka-berry-elderflower',
    code: 'FT CKT 08',
    name: 'Vodka Berry / Elderflower',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-08',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-09-dreamland',
    code: 'FT CKT 09',
    name: 'Dreamland',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-09',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-10-negroni',
    code: 'FT CKT 10',
    name: 'Negroni Clásico',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-10',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-11-fresa-colada',
    code: 'FT CKT 11',
    name: 'Fresa Colada',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-11',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-12-old-fashioned',
    code: 'FT CKT 12',
    name: 'Old Fashioned',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-12',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-13-kir-royal',
    code: 'FT CKT 13',
    name: 'Kir Royal',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-13',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-14-estrellas',
    code: 'FT CKT 14',
    name: 'Estrellas',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-14',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-15-rossini',
    code: 'FT CKT 15',
    name: 'Rossini',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-15',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-16-long-island-iced-tea',
    code: 'FT CKT 16',
    name: 'Long Island Ice Tea',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.00,
    precioHHDiamond: 4.50,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-16',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-17-bloody-mary',
    code: 'FT CKT 17',
    name: 'Bloody Mary',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.00,
    precioHHDiamond: 4.50,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-17',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-18-pina-colada',
    code: 'FT CKT 18',
    name: 'Piña Colada Clásica',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: 8.00, // Piña Colada Artesanal Bar Sol Olivina
    precioHHOlivina: 4.00,
    technicalSheetId: 'ft-dia-ckt-18',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-19-lady-marmalade',
    code: 'FT CKT 19',
    name: 'Lady Marmalade',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.00,
    precioHHDiamond: 4.50,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-19',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-20-aperol-spritz',
    code: 'FT CKT 20',
    name: 'Aperol Spritz',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: 7.50, // Aperol Spritz Clásico Bar Sol Olivina
    precioHHOlivina: 3.75,
    technicalSheetId: 'ft-dia-ckt-20',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-21-woo-woo',
    code: 'FT CKT 21',
    name: 'Woo Woo',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-21',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-22-classic-martini',
    code: 'FT CKT 22',
    name: 'Classic Martini (Dry Martini)',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-22',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-23-espresso-martini',
    code: 'FT CKT 23',
    name: 'Espresso Martini',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-23',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-24-porn-star-martini',
    code: 'FT CKT 24',
    name: 'Porn Star Martini (Passion Fruit Martini)',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: 8.50, // Porn Star Martini Bar Sol Olivina
    precioHHOlivina: 4.25,
    technicalSheetId: 'ft-dia-ckt-24',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-25-americano',
    code: 'FT CKT 25',
    name: 'Americano',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-25',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-29-mai-tai',
    code: 'FT CKT 29',
    name: 'Mai Tai',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.00,
    precioHHDiamond: 4.50,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-29',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-30-bahama-mama',
    code: 'FT CKT 30',
    name: 'Bahama Mama',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-30',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-31-blood-and-sand',
    code: 'FT CKT 31',
    name: 'Blood and Sand',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: 4.25,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-31',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-32-perfect-continuous',
    code: 'FT CKT 32',
    name: 'Perfect Continuous',
    category: 'cocteles',
    categoryLabel: 'Coctelería con Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.00,
    precioHHDiamond: 4.50,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-32',
    documentationStatus: 'DOCUMENTADA'
  },

  // =========================================================================
  // 2. MOCKTAILS 0.0% SIN ALCOHOL (3 CÓCTELES · KLAYMAN DIAMOND)
  // =========================================================================
  {
    id: 'item-ckt-26-virgin-mojito',
    code: 'FT CKT 26',
    name: 'Virgin Mojito 0.0%',
    category: 'cocteles',
    categoryLabel: 'Mocktails 0.0% Sin Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.50,
    precioHHDiamond: null, // Los cócteles 0.0% no entran en el 2x1 de licores
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-26',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-27-san-francisco',
    code: 'FT CKT 27',
    name: 'San Francisco 0.0%',
    category: 'cocteles',
    categoryLabel: 'Mocktails 0.0% Sin Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-27',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-ckt-28-virgin-colada',
    code: 'FT CKT 28',
    name: 'Virgin Colada 0.0%',
    category: 'cocteles',
    categoryLabel: 'Mocktails 0.0% Sin Alcohol',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-ckt-28',
    documentationStatus: 'DOCUMENTADA'
  },

  // =========================================================================
  // 3. CAFETERÍA DE ESPECIALIDAD & BARRAQUITOS
  // =========================================================================
  {
    id: 'item-barraquito-especial',
    code: 'CAF-01',
    name: 'Barraquito Especial Canario',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 3.80,
    precioHHDiamond: null,
    precioOlivina: 3.50, // Barraquito Tradicional Bar Sol Olivina
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-barraquito',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-cafe-bombon',
    name: 'Café Bombón Canario',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.60,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cafe-leche-leche',
    name: 'Café Leche y Leche',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.80,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cafe-con-leche',
    name: 'Café con Leche Tradicional',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.20,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cafe-solo',
    name: 'Café Solo / Espresso Natural',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 1.80,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cafe-cortado',
    name: 'Café Cortado Canario',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cappuccino-diamond',
    name: 'Cappuccino Italiano con Cacao',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 3.20,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-infusiones-premium',
    name: 'Tés e Infusiones Prémium',
    category: 'cafeteria',
    categoryLabel: 'Cafetería de Especialidad',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },

  // =========================================================================
  // 4. CERVEZAS & BEBIDAS REFRESCANTES
  // =========================================================================
  {
    id: 'item-dorada-especial',
    name: 'Cerveza Dorada Especial de Barril (Copa 33 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 3.50,
    precioHHDiamond: 1.75, // Incluida en 2x1 Happy Hour Sunset & Viernes Todo el Día
    precioOlivina: 3.20, // Dorada Especial Bar Sol Olivina
    precioHHOlivina: 1.60,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-dorada-tostada',
    name: 'Cerveza Dorada Especial Tostada (Botellín 33 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 3.80,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-dorada-sin-gluten',
    name: 'Cerveza Dorada Sin Gluten (Botellín 33 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 3.80,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-coronita',
    name: 'Cerveza Coronita / Stella Artois (Botellín 33 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 4.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cerveza-sin-alcohol',
    name: 'Cerveza 0.0% Sin Alcohol (Botellín 33 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 3.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-refrescos-varios',
    name: 'Refrescos de Grifo & Botellín (35 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.80,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-agua-fuentealta',
    name: 'Agua Mineral Natural Fuentealta (50 cl)',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 2.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-zumo-naranja-natural',
    name: 'Zumo de Naranja Natural Exprimido',
    category: 'cervezas_bebidas',
    categoryLabel: 'Cervezas & Refrescos',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 4.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },

  // =========================================================================
  // 5. VINOS DE TENERIFE & ESPUMOSOS
  // =========================================================================
  {
    id: 'item-vino-blanco',
    name: 'Vino Blanco Canario (D.O. Tenerife)',
    category: 'vinos_cavas',
    categoryLabel: 'Vinos & Cavas',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 22.00, // Botella Viñátigo / Tajinaste en Diamond
    precioHHDiamond: null,
    precioOlivina: 4.20,  // Copa D.O. Abona en Olivina Bar Sol
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-vino-tinto',
    name: 'Tajinaste Tinto Tradicional (D.O. Valle de la Orotava)',
    category: 'vinos_cavas',
    categoryLabel: 'Vinos & Cavas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 24.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-vino-rosado',
    name: 'Brumas de Ayosa Rosado (D.O. Valle de Güímar)',
    category: 'vinos_cavas',
    categoryLabel: 'Vinos & Cavas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 20.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-cava-brut',
    name: 'Cava Brut Nature Reserva (D.O. Cava)',
    category: 'vinos_cavas',
    categoryLabel: 'Vinos & Cavas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 26.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-champagne-moet',
    name: 'Champagne Moët & Chandon Brut Impérial (75 cl)',
    category: 'vinos_cavas',
    categoryLabel: 'Vinos & Cavas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 75.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },

  // =========================================================================
  // 6. CONFITERÍA & TARTAS CASERAS
  // =========================================================================
  {
    id: 'item-tarta-queso',
    name: 'Tarta de Queso Fluida al Horno',
    category: 'confiteria_tartas',
    categoryLabel: 'Confitería & Tartas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-brownie',
    name: 'Brownie de Chocolate 70% con Helado de Vainilla Bourbon',
    category: 'confiteria_tartas',
    categoryLabel: 'Confitería & Tartas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-tarta-zanahoria',
    name: 'Tarta de Zanahoria & Nuez con Crema Mascarpone',
    category: 'confiteria_tartas',
    categoryLabel: 'Confitería & Tartas',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 6.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },

  // =========================================================================
  // 7. SNACKS SALADOS & APERITIVOS DE TERRAZA
  // =========================================================================
  {
    id: 'item-tabla-quesos-bar',
    code: 'FT-GAST-01',
    name: 'Tabla de Quesos Artesanos de Tenerife',
    category: 'snacks_terraza',
    categoryLabel: 'Snacks & Salados',
    hotelAvailability: ['klayman-diamond', 'klayman-olivina'],
    precioDiamond: 13.50,
    precioHHDiamond: null,
    precioOlivina: 11.50, // Bar Sol Olivina bs-tap-01
    precioHHOlivina: null,
    technicalSheetId: 'ft-dia-cheese-board',
    documentationStatus: 'DOCUMENTADA'
  },
  {
    id: 'item-sandwich-club',
    name: 'Sándwich Club Diamond de Terraza',
    category: 'snacks_terraza',
    categoryLabel: 'Snacks & Salados',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 9.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-focaccia-iberica',
    name: 'Focaccia de Jamón Ibérico & Tomate Canario Rallado',
    category: 'snacks_terraza',
    categoryLabel: 'Snacks & Salados',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 8.50,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'item-mix-frutos-secos',
    name: 'Mix de Frutos Secos Tostados & Aceitunas Aliñadas',
    category: 'snacks_terraza',
    categoryLabel: 'Snacks & Salados',
    hotelAvailability: ['klayman-diamond'],
    precioDiamond: 4.00,
    precioHHDiamond: null,
    precioOlivina: null,
    precioHHOlivina: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },

  // =========================================================================
  // 8. RESTAURACIÓN BAR SOL (EXCLUSIVOS KLAYMAN OLIVINA)
  // =========================================================================
  {
    id: 'bs-des-01',
    name: 'Desayuno Inglés Completo (Full English Breakfast)',
    category: 'restauracion_sol',
    categoryLabel: 'Desayunos & Brunches Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 9.50,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-des-02',
    name: 'Tostada de Aguacate y Tomate Canario con Huevo Poché',
    category: 'restauracion_sol',
    categoryLabel: 'Desayunos & Brunches Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 8.20,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-des-03',
    name: 'Bowl de Yogur Griego, Fruta Tropical de Tenerife y Granola Artesana',
    category: 'restauracion_sol',
    categoryLabel: 'Desayunos & Brunches Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 7.00,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-tap-02',
    name: 'Papas Arrugadas con Dúo de Mojos Canarios (Rojo Picón y Verde)',
    category: 'restauracion_sol',
    categoryLabel: 'Tapas & Snacks Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 6.80,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-tap-03',
    name: 'Nachos Supreme Olivina con Guacamole Casero y Queso Fundido',
    category: 'restauracion_sol',
    categoryLabel: 'Tapas & Snacks Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 9.80,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-pla-01',
    name: 'Paella Mixta Tradicional de la Bahía (Mínimo 2 personas)',
    category: 'restauracion_sol',
    categoryLabel: 'Platos Principales Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 14.50,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-pla-02',
    name: 'Hamburguesa Olivina Gourmet (100% Vacuno Canario)',
    category: 'restauracion_sol',
    categoryLabel: 'Platos Principales Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 12.80,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-pla-03',
    name: 'Pizza Artesana Cuatro Quesos de la Casa (Masa Madre)',
    category: 'restauracion_sol',
    categoryLabel: 'Platos Principales Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 11.20,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  },
  {
    id: 'bs-pla-04',
    name: 'Ensalada Fresca Olivina con Queso de Cabra a la Plancha',
    category: 'restauracion_sol',
    categoryLabel: 'Platos Principales Sol',
    hotelAvailability: ['klayman-olivina'],
    precioOlivina: 10.50,
    precioHHOlivina: null,
    precioDiamond: null,
    precioHHDiamond: null,
    technicalSheetId: null,
    documentationStatus: 'PENDIENTE DE DOCUMENTAR'
  }
];

/**
 * Auto-enriquecimiento de registros FASE 3:
 * - Familia y Subfamilia normalizadas
 * - Vinculación de fotografía existente
 */
AGORA_MASTER_PRODUCTS.forEach(p => {
  p.family = p.category;
  p.subfamily = p.categoryLabel;
  if (!p.imageUrl) {
    p.imageUrl = DEFAULT_ITEM_PHOTOS[p.id] || (p.technicalSheetId ? DEFAULT_ITEM_PHOTOS[p.technicalSheetId] : null) || null;
  }
});

/**
 * Mapa de búsqueda rápida por ID de producto
 */
export const AGORA_PRICES_LOOKUP: Record<string, AgoraProductPriceEntry> = AGORA_MASTER_PRODUCTS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, AgoraProductPriceEntry>);

/**
 * Obtener estadísticas consolidadas de la integración FASE 1
 */
export function getAgoraPricingStatistics() {
  const total = AGORA_MASTER_PRODUCTS.length;
  const withPrice = AGORA_MASTER_PRODUCTS.filter(p => p.precioDiamond !== null || p.precioOlivina !== null).length;
  const withoutPrice = AGORA_MASTER_PRODUCTS.filter(p => p.precioDiamond === null && p.precioOlivina === null).length;
  
  // Productos coincidentes en ambos establecimientos (Diamond y Olivina)
  const matchingBothHotels = AGORA_MASTER_PRODUCTS.filter(p => 
    p.hotelAvailability.includes('klayman-diamond') && p.hotelAvailability.includes('klayman-olivina')
  ).length;

  // Productos sin coincidencia (exclusivos de un establecimiento u otro)
  const exclusiveDiamond = AGORA_MASTER_PRODUCTS.filter(p => 
    p.hotelAvailability.includes('klayman-diamond') && !p.hotelAvailability.includes('klayman-olivina')
  ).length;

  const exclusiveOlivina = AGORA_MASTER_PRODUCTS.filter(p => 
    !p.hotelAvailability.includes('klayman-diamond') && p.hotelAvailability.includes('klayman-olivina')
  ).length;

  const documented = AGORA_MASTER_PRODUCTS.filter(p => p.documentationStatus === 'DOCUMENTADA').length;
  const pending = AGORA_MASTER_PRODUCTS.filter(p => p.documentationStatus === 'PENDIENTE DE DOCUMENTAR').length;

  return {
    totalEncontrados: total,
    conPrecio: withPrice,
    sinPrecio: withoutPrice,
    sinCoincidenciaAmbosHoteles: exclusiveDiamond + exclusiveOlivina,
    coincidentesAmbosHoteles: matchingBothHotels,
    exclusivosDiamond: exclusiveDiamond,
    exclusivosOlivina: exclusiveOlivina,
    documentadas: documented,
    pendientesDocumentar: pending
  };
}

/**
 * Obtener informe consolidado FASE 3 – CREACIÓN DE PRODUCTOS FALTANTES
 */
export function getAgoraPhase3Statistics() {
  const total = AGORA_MASTER_PRODUCTS.length;
  const vinculadosFicha = AGORA_MASTER_PRODUCTS.filter(p => p.technicalSheetId !== null).length;
  const vinculadosFoto = AGORA_MASTER_PRODUCTS.filter(p => !!p.imageUrl).length;
  const pendientesDoc = AGORA_MASTER_PRODUCTS.filter(p => p.documentationStatus === 'PENDIENTE DE DOCUMENTAR').length;

  return {
    productosCreados: total,
    productosVinculadosFicha: vinculadosFicha,
    productosVinculadosFoto: vinculadosFoto,
    productosPendientesDoc: pendientesDoc,
    totalActuales: total
  };
}
