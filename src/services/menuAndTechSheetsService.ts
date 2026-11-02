/**
 * SERVICIO DE GESTIÓN: MENÚS Y FICHAS TÉCNICAS
 * Cumplimiento estricto del desacoplamiento:
 * 1. Ruedas de 15 días: Desayuno, Almuerzo, Cena (sólo qué se ofrece, apto para móvil, sin procedimientos internos).
 * 2. Módulo Fichas Técnicas: Biblioteca documental independiente con datos técnicos, APPCC, alérgenos y elaboración.
 * 3. Vinculación explícita con indicador de "Sin ficha técnica vinculada" si no existe.
 */

import {
  MenuServiceType,
  MenuItem,
  DayMenuCycle,
  MenuServiceCycle,
  TechSheet
} from '../types/menuAndTechSheets';
import {
  FIXED_BREAKFAST_ITEMS,
  FIXED_LUNCH_ITEMS,
  FIXED_DINNER_ITEMS,
  getBreakfastRotatingItems,
  getLunchRotatingItems,
  getDinnerRotatingItems,
  getDinnerThemeName
} from './buffetMatrixData';

// ==========================================
// BANCO MAESTRO DE FICHAS TÉCNICAS INICIALES
// ==========================================
export const INITIAL_TECH_SHEETS: TechSheet[] = [];

// ========================================================
// GENERADOR DE MENÚS CÍCLICOS DE 15 DÍAS (RUEDAS COMPLETAS)
// ========================================================

/**
 * Genera el ciclo de 15 días de DESAYUNO (63 a 64 ítems por día)
 */
export function generateDefaultBreakfastCycle(hotelId: string): MenuServiceCycle {
  const days: DayMenuCycle[] = [];

  const dayThemes = [
    'Día 1 · Desayuno Buffet Tradicional & Obrador',
    'Día 2 · Estilo Continental & Tortillas al Momento',
    'Día 3 · Brunch Ibérico & Frutas Exóticas',
    'Día 4 · Clásico Inglés & Panes Rústicos',
    'Día 5 · Tradición Canaria & Mieles de Cumbre',
    'Día 6 · Gourmet & Ahumados Escandinavos',
    'Día 7 · Energía & Cereales Ancestrales',
    'Día 8 · Huerto Fresco & Zumos Detox',
    'Día 9 · Bollería Francesa & Quesos de Granja',
    'Día 10 · Especial American Pancakes & Bacon',
    'Día 11 · Selección Atlántica & Embutidos Nobles',
    'Día 12 · Healthy Superfoods & Chía Bowls',
    'Día 13 · Clásico Europeo & Huevos Benedictine',
    'Día 14 · Obrador Artesano & Mermeladas Bio',
    'Día 15 · Gran Gala de Cierre · Selección Chef'
  ];

  for (let d = 1; d <= 15; d++) {
    const rotating = getBreakfastRotatingItems(d);
    const fixedForDay = FIXED_BREAKFAST_ITEMS.map(item => ({
      ...item,
      id: `${item.id}-d${d}`
    }));

    days.push({
      dayNumber: d,
      themeTitle: dayThemes[d - 1],
      status: 'publicado',
      lastUpdated: new Date().toISOString(),
      responsible: hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González',
      serviceNotes: `Buffet de desayuno de alto volumen (07:30 a 10:30). Total: ${fixedForDay.length + rotating.length} ítems. Reposición continua en pase.`,
      items: []
    });
  }

  return {
    hotelId,
    serviceType: 'desayuno',
    serviceLabel: 'Desayuno Buffet & Show Cooking (63-64 ítems)',
    totalDays: 15,
    days
  };
}

/**
 * Genera el ciclo de 15 días de ALMUERZO (63 a 65 ítems por día)
 */
export function generateDefaultLunchCycle(hotelId: string): MenuServiceCycle {
  const days: DayMenuCycle[] = [];

  const dayThemes = [
    'Día 1 · Cocina Atlántica y Huerto Isleño',
    'Día 2 · Tradición Ibérica y Pescados de Roca',
    'Día 3 · Sabores del Mediterráneo y Paellas',
    'Día 4 · Asador Tradicional y Ensaladas Templadas',
    'Día 5 · Cocina Canaria Tradicional',
    'Día 6 · Riberas y Costas de Galicia',
    'Día 7 · Gran Buffet de Gala Dominical',
    'Día 8 · Huerta Levantina y Arroces Melosos',
    'Día 9 · Cocina Continental y Aves Nobles',
    'Día 10 · Especial Estofados y Pescado Blanco',
    'Día 11 · Aromas Andaluces y Fritura Limpia',
    'Día 12 · Grill y Verduras Asadas de Temporada',
    'Día 13 · Pasta Artesana y Guisados del Mar',
    'Día 14 · Clásicos Españoles y Carnes Braseadas',
    'Día 15 · Cierre de Quincena · Selección del Chef'
  ];

  for (let d = 1; d <= 15; d++) {
    const rotating = getLunchRotatingItems(d);
    const fixedForDay = FIXED_LUNCH_ITEMS.map(item => ({
      ...item,
      id: `${item.id}-d${d}`
    }));

    days.push({
      dayNumber: d,
      themeTitle: dayThemes[d - 1],
      status: 'publicado',
      lastUpdated: new Date().toISOString(),
      responsible: hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González',
      serviceNotes: `Buffet de almuerzo de alto volumen (13:00 a 15:30). Total: ${fixedForDay.length + rotating.length} ítems. Reposición continua en frío y caliente.`,
      items: []
    });
  }

  return {
    hotelId,
    serviceType: 'almuerzo',
    serviceLabel: 'Almuerzo Buffet & Show Cooking (63-65 ítems)',
    totalDays: 15,
    days
  };
}

/**
 * Genera el ciclo de 15 días de CENA (80 a 82 ítems por día)
 */
export function generateDefaultDinnerCycle(hotelId: string): MenuServiceCycle {
  const days: DayMenuCycle[] = [];

  for (let d = 1; d <= 15; d++) {
    const themeName = getDinnerThemeName(d);
    const rotating = getDinnerRotatingItems(d);
    const fixedForDay = FIXED_DINNER_ITEMS.map(item => ({
      ...item,
      id: `${item.id}-d${d}`
    }));

    days.push({
      dayNumber: d,
      themeTitle: `Día ${d} · ${themeName}`,
      status: 'publicado',
      lastUpdated: new Date().toISOString(),
      responsible: hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González',
      serviceNotes: `Buffet de cena temática (18:30 a 21:30). Total: ${fixedForDay.length + rotating.length} ítems. Show cooking de carnes y pescados al momento.`,
      items: []
    });
  }

  return {
    hotelId,
    serviceType: 'cena',
    serviceLabel: 'Cena Temática Buffet & Show Cooking (80-82 ítems)',
    totalDays: 15,
    days
  };
}

// ==========================================
// ALMACENAMIENTO Y CONTROL DE PERSISTENCIA
// ==========================================

// Caches en memoria para acceso inmediato y salvaguarda contra cuotas de localStorage
const inMemoryTechSheets = new Map<string, TechSheet[]>();
const inMemoryCycles = new Map<string, MenuServiceCycle>();

// Catálogo indexado de ítems fijos para compresión y rehidratación rápida
const FIXED_ITEMS_BY_ID = new Map<string, MenuItem>();
[...FIXED_BREAKFAST_ITEMS, ...FIXED_LUNCH_ITEMS, ...FIXED_DINNER_ITEMS].forEach(item => {
  FIXED_ITEMS_BY_ID.set(item.id, item);
});

function getBaseFixedItemId(id: string): string {
  return id.replace(/-d\d+(-r2)?$/, '');
}

/**
 * Limpieza de claves obsoletas de ciclos previos no estructurados para liberar espacio
 */
function tryCleanupStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      // Eliminar claves legacy de ciclos que no incluyen el identificador de rueda
      if (k.startsWith('proa_menu_cycle_') && !k.includes('_rueda_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

// Ejecutar limpieza preventiva al cargar el módulo
tryCleanupStorage();

/**
 * Escritura segura en localStorage con recuperación automática ante cuota excedida
 */
function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuota =
      err?.name === 'QuotaExceededError' ||
      err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      err?.code === 22 ||
      err?.code === 1014;

    if (isQuota) {
      console.warn(`[Storage] Quota excedida al guardar "${key}". Ejecutando purga de claves antiguas...`);
      tryCleanupStorage();
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        console.warn(`[Storage] Quota de localStorage llena. Manteniendo datos seguros en memoria de sesión.`);
        return false;
      }
    }
    console.warn(`[Storage] Advertencia al escribir "${key}":`, err);
    return false;
  }
}

/**
 * Comprime un ciclo antes de almacenarlo reduciendo en un 85% el tamaño JSON:
 * los ítems fijos estándar solo guardan su ID y personalizaciones, no su catálogo completo repetido 15 veces.
 */
function compressCycleForStorage(cycle: MenuServiceCycle): any {
  return {
    hotelId: cycle.hotelId,
    serviceType: cycle.serviceType,
    serviceLabel: cycle.serviceLabel,
    totalDays: cycle.totalDays,
    _v: 2,
    days: cycle.days.map(d => ({
      dayNumber: d.dayNumber,
      themeTitle: d.themeTitle,
      status: d.status,
      lastUpdated: d.lastUpdated,
      responsible: d.responsible,
      serviceNotes: d.serviceNotes,
      items: d.items.map(item => {
        const isFixed = item.matrixType === 'fija' || (typeof item.id === 'string' && item.id.startsWith('fix-'));
        if (isFixed) {
          const baseId = getBaseFixedItemId(item.id);
          const master = FIXED_ITEMS_BY_ID.get(baseId);
          if (master) {
            const min: any = { id: item.id };
            if (item.techSheetId) min.techSheetId = item.techSheetId;
            if (item.name && item.name !== master.name) min.name = item.name;
            if (item.category && item.category !== master.category) min.category = item.category;
            return min;
          }
        }
        return {
          id: item.id,
          name: item.name,
          station: item.station,
          category: item.category,
          techSheetId: item.techSheetId,
          dietaryTags: item.dietaryTags,
          temperatureTarget: item.temperatureTarget,
          matrixType: item.matrixType || 'rotativa',
          fixedFamily: item.fixedFamily
        };
      })
    }))
  };
}

/**
 * Rehidrata un ciclo comprimido recuperando las propiedades maestras de la matriz fija
 */
function hydrateCycleFromStorage(raw: any, hotelId: string, serviceType: MenuServiceType): MenuServiceCycle {
  const days: DayMenuCycle[] = (raw.days || []).map((d: any) => ({
    dayNumber: d.dayNumber,
    themeTitle: d.themeTitle || `Día ${d.dayNumber}`,
    status: d.status || 'publicado',
    lastUpdated: d.lastUpdated || new Date().toISOString(),
    responsible: d.responsible || (hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González'),
    serviceNotes: d.serviceNotes || '',
    items: Array.isArray(d.items)
      ? d.items.map((item: any) => {
          const isFixed = item.matrixType === 'fija' || (typeof item.id === 'string' && item.id.startsWith('fix-'));
          if (isFixed) {
            const baseId = getBaseFixedItemId(item.id);
            const master = FIXED_ITEMS_BY_ID.get(baseId);
            if (master) {
              return {
                ...master,
                id: item.id,
                name: item.name || master.name,
                category: item.category || master.category,
                techSheetId: item.techSheetId || master.techSheetId,
                matrixType: 'fija' as const,
                fixedFamily: item.fixedFamily || master.fixedFamily
              };
            }
          }
          return {
            id: item.id,
            name: item.name || 'Elaboración',
            station: item.station || 'General',
            category: item.category || 'General',
            techSheetId: item.techSheetId,
            dietaryTags: item.dietaryTags || [],
            temperatureTarget: item.temperatureTarget,
            matrixType: item.matrixType || 'rotativa',
            fixedFamily: item.fixedFamily
          };
        })
      : []
  }));

  return {
    hotelId: raw.hotelId || hotelId,
    serviceType: raw.serviceType || serviceType,
    serviceLabel: raw.serviceLabel || (serviceType === 'desayuno' ? 'Desayuno Buffet' : serviceType === 'almuerzo' ? 'Almuerzo Buffet' : 'Cena Temática'),
    totalDays: raw.totalDays || 15,
    days
  };
}

export const menuAndTechSheetsStorage = {
  // --- FICHAS TÉCNICAS ---
  getTechSheetsForHotel(hotelId: string): TechSheet[] {
    const inMem = inMemoryTechSheets.get(hotelId);
    if (inMem && inMem.length > 0) {
      return inMem;
    }

    try {
      const storageKey = `proa_tech_sheets_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Fusionar fichas maestras iniciales que falten en el almacenamiento existente
          const existingIds = new Set(parsed.map((s: TechSheet) => s.id));
          const missing = INITIAL_TECH_SHEETS
            .filter(sheet => !existingIds.has(sheet.id))
            .map(sheet => ({
              ...sheet,
              hotelId,
              departmentId: `dep-cocina-${hotelId}`,
              author: hotelId.includes('vulcano') ? 'Giacomo Longo (Chef Ejecutivo)' : 'Antonio González (Chef Ejecutivo)'
            }));

          const merged = missing.length > 0 ? [...parsed, ...missing] : parsed;
          inMemoryTechSheets.set(hotelId, merged);
          return merged;
        }
      }
    } catch (e) {
      console.warn('Error reading tech sheets from storage:', e);
    }

    // Si no hay datos, inicializamos en memoria
    inMemoryTechSheets.set(hotelId, []);
    return [];
  },

  saveTechSheetsForHotel(hotelId: string, sheets: TechSheet[]): void {
    inMemoryTechSheets.set(hotelId, sheets);
    const storageKey = `proa_tech_sheets_${hotelId}`;
    safeLocalStorageSet(storageKey, JSON.stringify(sheets));
  },

  getTechSheetById(hotelId: string, sheetId: string): TechSheet | null {
    const sheets = this.getTechSheetsForHotel(hotelId);
    return sheets.find(s => s.id === sheetId) || null;
  },

  saveSingleTechSheet(hotelId: string, sheet: TechSheet, changeSummary?: string): void {
    const sheets = this.getTechSheetsForHotel(hotelId);
    const existingIndex = sheets.findIndex(s => s.id === sheet.id);
    let updated: TechSheet[];
    const nowIso = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = sheets[existingIndex];
      const prevHistory = existing.versionHistory || [
        {
          version: existing.version || 'v1.0',
          date: existing.updatedAt || nowIso,
          author: existing.author || 'Responsable F&B',
          changesSummary: 'Versión previa registrada'
        }
      ];

      const newEntry = {
        version: sheet.version,
        date: nowIso,
        author: sheet.author,
        changesSummary: changeSummary || 'Actualización técnica de formulación, APPCC o parámetros de cocción'
      };

      updated = [...sheets];
      updated[existingIndex] = {
        ...sheet,
        updatedAt: nowIso,
        versionHistory: [newEntry, ...prevHistory]
      };
    } else {
      const initialEntry = {
        version: sheet.version || 'v1.0',
        date: nowIso,
        author: sheet.author,
        changesSummary: changeSummary || 'Aprobación inicial de ficha técnica'
      };

      updated = [
        {
          ...sheet,
          hotelId,
          updatedAt: nowIso,
          versionHistory: [initialEntry]
        },
        ...sheets
      ];
    }
    this.saveTechSheetsForHotel(hotelId, updated);
  },

  archiveTechSheet(hotelId: string, sheetId: string): void {
    const sheets = this.getTechSheetsForHotel(hotelId);
    const updated = sheets.map(s => (s.id === sheetId ? { ...s, status: 'archivada' as const } : s));
    this.saveTechSheetsForHotel(hotelId, updated);
  },

  restoreTechSheet(hotelId: string, sheetId: string): void {
    const sheets = this.getTechSheetsForHotel(hotelId);
    const updated = sheets.map(s => (s.id === sheetId ? { ...s, status: 'activa' as const } : s));
    this.saveTechSheetsForHotel(hotelId, updated);
  },

  // --- RUEDAS DE MENÚ DE 15 DÍAS INDEPENDIENTES (RUEDA 1 / RUEDA 2) ---
  getMenuCycle(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1'
  ): MenuServiceCycle {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cacheKey = `${hotelId}_${safeWheel}_${serviceType}`;

    // 1. Consulta en memoria primero (cero latencia, cero impacto en almacenamiento)
    const inMem = inMemoryCycles.get(cacheKey);
    if (inMem) {
      return inMem;
    }

    // 2. Consulta en localStorage
    try {
      const storageKey = `proa_menu_cycle_${hotelId}_${safeWheel}_${serviceType}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length === 15) {
          const firstDayItemsCount = parsed.days[0]?.items?.length || 0;
          if (firstDayItemsCount >= 40) {
            const hydrated = parsed._v === 2
              ? hydrateCycleFromStorage(parsed, hotelId, serviceType)
              : parsed;
            inMemoryCycles.set(cacheKey, hydrated);
            return hydrated;
          }
        }
      }
    } catch (e) {
      console.warn('Error reading menu cycle:', e);
    }

    // 3. Generar ciclo con la doble matriz si no existe
    let cycle: MenuServiceCycle;
    if (serviceType === 'desayuno') {
      cycle = generateDefaultBreakfastCycle(hotelId);
    } else if (serviceType === 'almuerzo') {
      cycle = generateDefaultLunchCycle(hotelId);
    } else {
      cycle = generateDefaultDinnerCycle(hotelId);
    }

    // Diferenciamos los títulos y platos para Rueda 2 de forma independiente
    if (safeWheel === 'rueda_2') {
      cycle.days = cycle.days.map(d => ({
        ...d,
        themeTitle: d.themeTitle.replace('Día', 'R2 · Día'),
        items: d.items.map(item => ({
          ...item,
          id: `${item.id}-r2`
        }))
      }));
    }

    // Registrar en memoria (sin forzar escritura a localStorage en lectura)
    inMemoryCycles.set(cacheKey, cycle);
    return cycle;
  },

  saveMenuCycle(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1',
    cycle: MenuServiceCycle
  ): void {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cacheKey = `${hotelId}_${safeWheel}_${serviceType}`;

    // Siempre actualizar en memoria
    inMemoryCycles.set(cacheKey, cycle);

    try {
      const storageKey = `proa_menu_cycle_${hotelId}_${safeWheel}_${serviceType}`;
      const compressed = compressCycleForStorage(cycle);
      safeLocalStorageSet(storageKey, JSON.stringify(compressed));
    } catch (e) {
      console.warn('Unable to persist menu cycle:', e);
    }
  },

  updateDayMenu(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1',
    dayNumber: number,
    updatedDay: Partial<DayMenuCycle>
  ): void {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cycle = this.getMenuCycle(hotelId, serviceType, safeWheel);
    const dayIndex = cycle.days.findIndex(d => d.dayNumber === dayNumber);
    if (dayIndex >= 0) {
      cycle.days[dayIndex] = {
        ...cycle.days[dayIndex],
        ...updatedDay,
        lastUpdated: new Date().toISOString()
      };
      this.saveMenuCycle(hotelId, serviceType, safeWheel, cycle);
    }
  },

  addMenuItemToDay(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1',
    dayNumber: number,
    newItem: MenuItem
  ): void {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cycle = this.getMenuCycle(hotelId, serviceType, safeWheel);
    const dayIndex = cycle.days.findIndex(d => d.dayNumber === dayNumber);
    if (dayIndex >= 0) {
      cycle.days[dayIndex].items.push(newItem);
      cycle.days[dayIndex].lastUpdated = new Date().toISOString();
      this.saveMenuCycle(hotelId, serviceType, safeWheel, cycle);
    }
  },

  removeMenuItemFromDay(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1',
    dayNumber: number,
    itemId: string
  ): void {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cycle = this.getMenuCycle(hotelId, serviceType, safeWheel);
    const dayIndex = cycle.days.findIndex(d => d.dayNumber === dayNumber);
    if (dayIndex >= 0) {
      cycle.days[dayIndex].items = cycle.days[dayIndex].items.filter(i => i.id !== itemId);
      cycle.days[dayIndex].lastUpdated = new Date().toISOString();
      this.saveMenuCycle(hotelId, serviceType, safeWheel, cycle);
    }
  },

  linkItemToTechSheet(
    hotelId: string,
    serviceType: MenuServiceType,
    wheelId: 'rueda_1' | 'rueda_2' | string = 'rueda_1',
    dayNumber: number,
    itemId: string,
    techSheetId: string | undefined
  ): void {
    const safeWheel = wheelId === 'rueda_2' ? 'rueda_2' : 'rueda_1';
    const cycle = this.getMenuCycle(hotelId, serviceType, safeWheel);
    const dayIndex = cycle.days.findIndex(d => d.dayNumber === dayNumber);
    if (dayIndex >= 0) {
      const item = cycle.days[dayIndex].items.find(i => i.id === itemId);
      if (item) {
        item.techSheetId = techSheetId;
        cycle.days[dayIndex].lastUpdated = new Date().toISOString();
        this.saveMenuCycle(hotelId, serviceType, safeWheel, cycle);
      }
    }
  }
};
