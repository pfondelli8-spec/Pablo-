/**
 * GESTOR DE ESCANDALLOS, COSTES Y PRECIOS OFICIALES F&B KLAYMAN
 * Permite simular y persistir precios de venta (PVP TPV), costes de materia prima
 * y márgenes brutos con sincronización reactiva en tiempo real.
 */

import { TechnicalSheet } from '../types/hotelPortal';

const STORAGE_KEY = 'klayman_diamond_custom_escandallos';

export interface EscandalloData {
  rawCost: number;
  sellingPrice: number;
  marginPercent: number;
  notes?: string;
  updatedAt?: string;
}

export interface EscandalloCalculatedMetrics {
  rawCost: number;
  sellingPrice: number;
  marginPercent: number;
  foodCostPercent: number;
  unitProfit: number;
  igicAmount: number; // 7% IGIC Canarias
  netPriceWithoutTax: number;
  happyHourPrice: number; // 2x1 = 50%
  happyHourMargin: number;
  minimumRecommendedPrice80: number; // Precio mínimo para 80% margen
  status: 'optimo' | 'aceptable' | 'alerta';
}

export function getCustomEscandallosMap(): Record<string, EscandalloData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error al leer escandallos personalizados:', err);
    return {};
  }
}

export function resolveItemEscandallo(sheet: { id: string; escandallo?: { rawCost: number; sellingPrice: number; marginPercent: number } }): EscandalloData {
  const customMap = getCustomEscandallosMap();
  if (customMap[sheet.id]) {
    return customMap[sheet.id];
  }
  
  if (sheet.escandallo) {
    return {
      rawCost: sheet.escandallo.rawCost,
      sellingPrice: sheet.escandallo.sellingPrice,
      marginPercent: sheet.escandallo.marginPercent
    };
  }

  // Valores predeterminados estándar de barra Diamond
  return {
    rawCost: 1.30,
    sellingPrice: 8.50,
    marginPercent: 84.7
  };
}

export function saveCustomEscandallo(sheetId: string, data: EscandalloData): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomEscandallosMap();
    current[sheetId] = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('klayman_escandallos_updated'));
  } catch (err) {
    console.error('Error al guardar escandallo personalizado:', err);
  }
}

export function resetCustomEscandallo(sheetId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomEscandallosMap();
    delete current[sheetId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('klayman_escandallos_updated'));
  } catch (err) {
    console.error('Error al restablecer escandallo:', err);
  }
}

export function calculateEscandalloMetrics(rawCost: number, sellingPrice: number): EscandalloCalculatedMetrics {
  const safeCost = Math.max(0.01, rawCost);
  const safePrice = Math.max(0.01, sellingPrice);

  const marginPercent = ((safePrice - safeCost) / safePrice) * 100;
  const foodCostPercent = (safeCost / safePrice) * 100;
  const unitProfit = safePrice - safeCost;

  // IGIC Canarias 7% incluido en PVP de hostelería
  const netPriceWithoutTax = safePrice / 1.07;
  const igicAmount = safePrice - netPriceWithoutTax;

  // Tarifa Happy Hour 2x1 (50% descuento efectivo por unidad)
  const happyHourPrice = safePrice * 0.5;
  const happyHourMargin = ((happyHourPrice - safeCost) / happyHourPrice) * 100;

  // Precio mínimo para objetivo F&B del 80% de margen bruto
  const minimumRecommendedPrice80 = safeCost / 0.20;

  let status: 'optimo' | 'aceptable' | 'alerta' = 'optimo';
  if (marginPercent < 72) {
    status = 'alerta';
  } else if (marginPercent < 80) {
    status = 'aceptable';
  }

  return {
    rawCost: safeCost,
    sellingPrice: safePrice,
    marginPercent: parseFloat(marginPercent.toFixed(1)),
    foodCostPercent: parseFloat(foodCostPercent.toFixed(1)),
    unitProfit: parseFloat(unitProfit.toFixed(2)),
    igicAmount: parseFloat(igicAmount.toFixed(2)),
    netPriceWithoutTax: parseFloat(netPriceWithoutTax.toFixed(2)),
    happyHourPrice: parseFloat(happyHourPrice.toFixed(2)),
    happyHourMargin: parseFloat(happyHourMargin.toFixed(1)),
    minimumRecommendedPrice80: parseFloat(minimumRecommendedPrice80.toFixed(2)),
    status
  };
}
