/**
 * SERVICIO INTEGRAL DE DOCUMENTACIÓN: CARTA, MENÚS Y FICHAS TÉCNICAS
 * Soporta archivos reales en formatos:
 * - PDF: Visualización integrada.
 * - Word: DOC y DOCX.
 * - Excel: XLS y XLSX con soporte multi-hoja.
 * 
 * Estructura:
 * 1. Carta (documentos oficiales de cartas)
 * 2. Menú — Rueda 1 (documento global o 45 apartados: 15 días x 3 servicios)
 * 3. Menú — Rueda 2 (documento global o 45 apartados: 15 días x 3 servicios)
 * 4. Fichas Técnicas (documentos técnicos vinculables a platos)
 */

import { MenuServiceType } from '../types/menuAndTechSheets';
import { createMultiSheetWorkbook, parseExcelFile, ParsedExcelWorkbook } from './excelService';

export type SupportedFileFormat = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'image' | 'other';

export function detectFileFormat(fileName: string): SupportedFileFormat {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx';
  if (ext === 'docx' || ext === 'doc') return 'docx';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
  return 'other';
}

export interface DocumentRecord {
  id: string;
  hotelId: string;
  category: 'carta' | 'rueda_1' | 'rueda_2' | 'ficha_tecnica';
  title: string;
  fileName: string;
  fileFormat: SupportedFileFormat;
  fileSizeBytes: number;
  uploadedAt: string;
  author: string;
  version: string;
  // Si aplica a un día y servicio específico de una rueda
  dayNumber?: number; // 1 a 15
  serviceType?: MenuServiceType; // desayuno | almuerzo | cena
  // Si es documento de toda la rueda
  isFullWheelDocument?: boolean;
  // Si aplica a una ficha técnica
  techSheetId?: string;
  // Contenido en Base64 para visualización directa y descarga
  fileBase64?: string;
  // Datos parseados de Excel si es .xlsx / .xls
  parsedExcel?: ParsedExcelWorkbook;
  // Historial de versiones previas
  versionHistory?: {
    version: string;
    date: string;
    author: string;
    fileName: string;
    summary: string;
  }[];
}

// Caches en memoria para navegación instantánea y protección contra cuotas
const inMemoryDocuments = new Map<string, DocumentRecord[]>();

/**
 * Genera libros Excel de demostración con hojas múltiples reales
 */
export function generateDemoWheelExcel(hotelName: string, wheelTitle: string): string {
  const sheets = [
    {
      sheetName: 'Desayunos (15 Días)',
      data: [
        ['Día', 'Estación', 'Elaboración / Producto', 'Tipo Matriz', 'Temp. Objetivo', 'Alérgenos', 'Unidades Estimadas'],
        ['Día 1', 'Panadería & Obrador', 'Croissants de mantequilla fresca', 'Matriz Fija', 'Ambiente', 'Gluten, Lácteos, Huevos', '180 uds'],
        ['Día 1', 'Panadería & Obrador', 'Pan de semillas de lino y chía', 'Matriz Fija', 'Ambiente', 'Gluten', '90 uds'],
        ['Día 1', 'Lácteos & Bebidas', 'Zumo de naranja recién exprimido', 'Matriz Fija', '<4°C', 'Ninguno', '45 Litros'],
        ['Día 1', 'Show Cooking', 'Tortitas americanas con sirope de arce', 'Matriz Rotativa', 'Al momento', 'Gluten, Huevos, Lácteos', '140 raciones'],
        ['Día 1', 'Show Cooking', 'Huevos revueltos con bacon crujiente', 'Matriz Rotativa', '>65°C', 'Huevos, Lácteos', '120 raciones'],
        ['Día 2', 'Show Cooking', 'Tortilla de patatas casera al punto', 'Matriz Rotativa', '>65°C', 'Huevos', '8 unidades'],
        ['Día 2', 'Show Cooking', 'Gofres belgas artesanos', 'Matriz Rotativa', 'Al momento', 'Gluten, Huevos, Lácteos', '95 raciones'],
        ['Día 3', 'Show Cooking', 'Huevos benedictine con salsa holandesa', 'Matriz Rotativa', 'Al momento', 'Huevos, Lácteos, Sulfitos', '80 raciones'],
        ['Días 1-15', 'Buffet Base', 'Selección de 50 partidas fijas (Lácteos, Frutas, Fiambres, Bollería)', 'Matriz Fija', 'Control APPCC', 'Según partida', 'Consumo continuo']
      ]
    },
    {
      sheetName: 'Almuerzos (15 Días)',
      data: [
        ['Día', 'Partida', 'Plato Principal / Elaboración', 'Ficha Técnica Vinculada', 'Temp. Servicio', 'Pax 100', 'Pax 300', 'Pax 800'],
        ['Día 1', 'Sopas & Cremas', 'Crema de Verduras de Temporada', 'FT-COC-001 (Vinculada)', '>65°C', '25 L', '75 L', '200 L'],
        ['Día 1', 'Carnes & Asados', 'Pollo al Limón y Romero', 'FT-COC-002 (Vinculada)', '>68°C', '20 kg', '60 kg', '160 kg'],
        ['Día 1', 'Pescados', 'Merluza en Salsa Marinera', 'FT-COC-004 (Vinculada)', '>65°C', '18 kg', '54 kg', '144 kg'],
        ['Día 1', 'Arroces', 'Paella Valenciana Mixta', 'FT-COC-006 (Vinculada)', '>68°C', '28 kg', '84 kg', '224 kg'],
        ['Día 2', 'Fríos', 'Gazpacho Andaluz Tradicional', 'FT-COC-003 (Vinculada)', '<4°C', '25 L', '75 L', '200 L'],
        ['Día 2', 'Carnes', 'Lomo de Cerdo Asado con Manzana', 'FT-COC-007 (Vinculada)', '>68°C', '21 kg', '63 kg', '168 kg'],
        ['Día 3', 'Guisos', 'Estofado de Ternera a la Jardinera', 'FT-COC-009 (Vinculada)', '>68°C', '25 kg', '75 kg', '200 kg'],
        ['Día 4', 'Pescados', 'Salpicón de Marisco de la Costa', 'FT-COC-008 (Vinculada)', '<4°C', '16 kg', '48 kg', '128 kg']
      ]
    },
    {
      sheetName: 'Cenas Temáticas (15 Días)',
      data: [
        ['Día', 'Tematización de la Noche', 'Especialidad Show Cooking', 'Pescado de Lonja', 'Pastelería & Obrador', 'Norma APPCC'],
        ['Día 1', 'Gala de Bienvenida', 'Roast Beef al corte con Gravy', 'Lubina a la espalda con bilbaína', 'Tiramisú Clásico & Fuentes de Chocolate', 'Control Tª >65°C / <4°C'],
        ['Día 2', 'Noche Italiana & Pasta Viva', 'Lasaña boloñesa al horno de leña', 'Emperador a la plancha con pesto', 'Panna cotta con frutos del bosque', 'Control Tª >68°C'],
        ['Día 3', 'Noche Canaria & Sabores Isleños', 'Carne fiesta adobada tradicional', 'Vieja sancochada con mojo verde', 'Bienmesabe con helado de vainilla', 'Pescado de captura trazable'],
        ['Día 4', 'Lonja Atlántica & Mariscos', 'Brochetas de gambones y calamar', 'Salmón en costra de hierbas y cítricos', 'Mousse de maracuyá y lima', 'Control estricto sulfitos/mariscos'],
        ['Día 5', 'Asador & Grill Americano', 'Costillar BBQ glaseado con miel', 'Bacalao a la brasa con pimientos', 'Brownie casero con nueces pecanas', 'Carnes al punto en pase vivo']
      ]
    },
    {
      sheetName: 'Control APPCC & Alérgenos',
      data: [
        ['Punto de Control', 'Límite Crítico', 'Frecuencia de Registro', 'Medida Correctora', 'Responsable'],
        ['Pase Caliente Show Cooking', 'Temperatura >= 65°C', 'Cada 30 minutos', 'Ajustar termostato baño maría o regenerar', 'Jefe de Partida'],
        ['Buffet Frío y Ensaladas', 'Temperatura <= 4°C', 'Cada 30 minutos', 'Reemplazar hielo escama o revisar placa fría', 'Cocinero de Cuarto Frío'],
        ['Refrigeración de Pescados', 'Temperatura 0°C a 2°C', 'Continuo (2 veces por turno)', 'Reubicar en cámara de apoyo y avisar mantenimiento', 'Segundo de Cocina'],
        ['Declaración 14 Alérgenos EU', 'Ficha visible y etiquetado', 'Diario por servicio', 'Retirar cartel erróneo y verificar con chef ejecutivo', 'Chef Ejecutivo']
      ]
    }
  ];

  return createMultiSheetWorkbook(sheets);
}

/**
 * Genera libro Excel para una Ficha Técnica con escandallo
 */
export function generateDemoTechSheetExcel(recipeName: string, code: string): string {
  const sheets = [
    {
      sheetName: 'Ficha Técnica & Raciones',
      data: [
        ['Código', 'Receta', 'Familia', 'Ración Base', 'Coste Ración Estimado', 'PVP Carta'],
        [code, recipeName, 'Cocina Hotel', '1 ración', '1.95 €', '13.50 €'],
        ['', '', '', '', '', '', ''],
        ['Ingrediente', 'Cantidad (1 Pax)', 'Unidad', '100 Pax', '300 Pax', '800 Pax', 'Alérgeno'],
        ['Ingrediente Principal', '180', 'g', '18 kg', '54 kg', '144 kg', 'Verificado'],
        ['Verduras de Fondo', '60', 'g', '6 kg', '18 kg', '48 kg', 'Apio (si aplica)'],
        ['Aceite de Oliva Virgen Extra', '12', 'ml', '1.2 L', '3.6 L', '9.6 L', 'Sin Alérgenos'],
        ['Caldo / Fondo de Cocción', '250', 'ml', '25 L', '75 L', '200 L', 'Según receta'],
        ['Sal marina y condimentos', '3', 'g', '300 g', '900 g', '2.4 kg', 'Sin Alérgenos']
      ]
    },
    {
      sheetName: 'Escandallo de Costes',
      data: [
        ['Ingrediente', 'Precio Compra / Kg', 'Merma %', 'Coste Neto / Pax', 'Proveedor Homologado'],
        ['Género Principal Fresco', '8.50 €/kg', '12%', '1.08 €', 'Distribuciones Canarias F&B'],
        ['Hortalizas y Verduras', '1.80 €/kg', '8%', '0.32 €', 'Cooperativa Agrícola Tenerife'],
        ['AOVE Selección', '5.20 €/L', '0%', '0.15 €', 'Oleícola Central'],
        ['Condimentos y especias', '9.00 €/kg', '0%', '0.08 €', 'Especias del Atlántico'],
        ['TOTAL COSTE MATERIA PRIMA', '-', '-', '1.63 €', 'Margen Bruto Objetivo: 72%']
      ]
    },
    {
      sheetName: 'Protocolo APPCC',
      data: [
        ['Fase de Proceso', 'Temperatura', 'Tiempo Máximo', 'Registro Sanitario'],
        ['Recepción de Mercancía', '<= 4°C (Frescos)', 'Inmediato a cámaras', 'Hoja Control Recepción'],
        ['Cocción y Elaboración', '>= 75°C en corazón', 'Mínimo 2 minutos', 'Termómetro sonda digital'],
        ['Mantenimiento en Pase', '>= 65°C constante', 'Máximo 90 minutos', 'GastroNorm Buffet Caliente']
      ]
    }
  ];

  return createMultiSheetWorkbook(sheets);
}

/**
 * Genera libro Excel para la Carta de Restaurante/Bar
 */
export function generateDemoCartaExcel(hotelName: string): string {
  const sheets = [
    {
      sheetName: 'Platos & Raciones Carta',
      data: [
        ['Sección', 'Nombre del Plato', 'Descripción Comercial', 'Alérgenos', 'PVP (€)', 'Coste Ración'],
        ['Entrantes', 'Jamón Ibérico de Bellota cortado a mano con pan de cristal', 'Pan tostado con tomate colgado y AOVE', 'Gluten', '24.00 €', '6.80 €'],
        ['Entrantes', 'Tartar de Atún Rojo con aguacate de la isla y sésamo', 'Atún fresco de anzuelo con aliño de soja y lima', 'Pescado, Sésamo, Soja', '18.50 €', '4.20 €'],
        ['Entrantes', 'Croquetas cremosas de boletus y jamón ibérico (6 uds)', 'Bechamel suave con rebozado crujiente de panko', 'Gluten, Lácteos, Huevos', '12.00 €', '2.40 €'],
        ['Carnes', 'Solomillo de Ternera a la brasa con patatas trufadas', 'Corte noble de 220g con flor de sal y jugo reducido', 'Lácteos (guarnición)', '26.00 €', '7.50 €'],
        ['Carnes', 'Hamburguesa Gourmet de Buey con queso curado y cebolla caramelizada', 'Carne madurada 180g en pan brioche artesano', 'Gluten, Lácteos, Sésamo', '16.50 €', '4.10 €'],
        ['Pescados', 'Lomo de Corvina salvaje con refrito de ajos y papas arrugadas', 'Pescado de costa a la plancha con mojo rojo y verde', 'Pescado', '22.00 €', '5.80 €']
      ]
    },
    {
      sheetName: 'Bebidas y Cócteles',
      data: [
        ['Categoría', 'Cóctel / Bebida', 'Ingredientes Principales', 'Graduación', 'PVP (€)'],
        ['Cócteles de Autor', 'Mojito Tradicional de Caña', 'Ron blanco, hierbabuena fresca, lima, azúcar moreno, soda', 'Media', '9.50 €'],
        ['Cócteles de Autor', 'Gin Tonic Premium Atlántico', 'Ginebra botánica, tónica premium, enebro y piel de lima', 'Alta', '11.00 €'],
        ['Cócteles de Autor', 'Aperol Spritz', 'Aperol, Prosecco DOC, soda y rodaja de naranja', 'Baja', '8.50 €'],
        ['Sin Alcohol', 'San Francisco Frutal', 'Zumo de naranja, piña, melocotón y toque de granadina', '0.0%', '7.00 €'],
        ['Vinos', 'Vino Tinto Crianza DO Ribera del Duero', 'Copa 150ml / Botella 750ml', '14.0%', '4.50 € / 22.00 €']
      ]
    },
    {
      sheetName: 'Control de Alérgenos Carta',
      data: [
        ['Plato', 'Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos Cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'],
        ['Jamón Ibérico', 'SI', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO'],
        ['Tartar de Atún', 'NO', 'NO', 'NO', 'SI', 'NO', 'SI', 'NO', 'NO', 'NO', 'NO', 'SI', 'NO', 'NO', 'NO'],
        ['Croquetas', 'SI', 'NO', 'SI', 'NO', 'NO', 'NO', 'SI', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO'],
        ['Solomillo', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'SI', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO', 'NO']
      ]
    }
  ];

  return createMultiSheetWorkbook(sheets);
}

/**
 * Inicializa los documentos por defecto para un hotel (independientes entre Bitácora y Vulcano)
 */
export function getInitialHotelDocuments(hotelId: string): DocumentRecord[] {
  return [];
}

/**
 * Gestor de almacenamiento documental de Carta, Menús y Fichas Técnicas
 */
export const cartaMenusDocumentStorage = {
  getDocumentsForHotel(hotelId: string): DocumentRecord[] {
    const mem = inMemoryDocuments.get(hotelId);
    if (mem && mem.length > 0) return mem;

    try {
      const storageKey = `proa_carta_menus_docs_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: DocumentRecord[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Rehidratar archivos excel si están en base64
          parsed.forEach(doc => {
            if (doc.fileFormat === 'xlsx' || doc.fileFormat === 'xls') {
              if (doc.fileBase64 && !doc.parsedExcel) {
                try {
                  doc.parsedExcel = parseExcelFile(doc.fileBase64, doc.fileName, doc.fileBase64);
                } catch (e) {
                  console.warn('Error parsing cached excel file:', e);
                }
              }
            }
          });
          inMemoryDocuments.set(hotelId, parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading documents from storage:', e);
    }

    const initial = getInitialHotelDocuments(hotelId);
    inMemoryDocuments.set(hotelId, initial);
    return initial;
  },

  saveDocumentsForHotel(hotelId: string, docs: DocumentRecord[]): void {
    inMemoryDocuments.set(hotelId, docs);
    try {
      const storageKey = `proa_carta_menus_docs_${hotelId}`;
      // Para optimizar el tamaño en localStorage, no guardamos el parsedExcel (se rehidrata bajo demanda)
      const sanitized = docs.map(doc => {
        const { parsedExcel, ...rest } = doc;
        return rest;
      });
      localStorage.setItem(storageKey, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Quota advertencia al guardar documentos en localStorage (conservados en memoria):', e);
    }
  },

  // Obtener documentos de una rueda específica (ej. rueda_1 o rueda_2)
  getWheelDocuments(hotelId: string, wheelId: 'rueda_1' | 'rueda_2'): {
    fullWheelDoc: DocumentRecord | null;
    serviceDocs: Record<string, DocumentRecord>; // key: "d{dayNum}_{serviceType}"
  } {
    const docs = this.getDocumentsForHotel(hotelId);
    const fullWheelDoc = docs.find(d => d.category === wheelId && d.isFullWheelDocument) || null;

    const serviceDocs: Record<string, DocumentRecord> = {};
    docs
      .filter(d => d.category === wheelId && !d.isFullWheelDocument && d.dayNumber && d.serviceType)
      .forEach(d => {
        const key = `d${d.dayNumber}_${d.serviceType}`;
        serviceDocs[key] = d;
      });

    return { fullWheelDoc, serviceDocs };
  },

  // Guardar o sustituir un documento de un día y servicio
  saveServiceDocument(
    hotelId: string,
    wheelId: 'rueda_1' | 'rueda_2',
    dayNumber: number,
    serviceType: MenuServiceType,
    documentData: {
      fileName: string;
      fileFormat: SupportedFileFormat;
      fileBase64: string;
      fileSizeBytes: number;
      author: string;
      versionSummary?: string;
    }
  ): DocumentRecord {
    const docs = this.getDocumentsForHotel(hotelId);
    const existingIndex = docs.findIndex(
      d => d.category === wheelId && d.dayNumber === dayNumber && d.serviceType === serviceType
    );

    let parsedExcel: ParsedExcelWorkbook | undefined;
    if (documentData.fileFormat === 'xlsx' || documentData.fileFormat === 'xls') {
      try {
        parsedExcel = parseExcelFile(documentData.fileBase64, documentData.fileName, documentData.fileBase64);
      } catch (err) {
        console.warn('Error parsing uploaded excel:', err);
      }
    }

    const nowIso = new Date().toISOString();
    let newOrUpdated: DocumentRecord;

    if (existingIndex >= 0) {
      const prev = docs[existingIndex];
      const prevHistory = prev.versionHistory || [];
      const currentVerNum = parseFloat(prev.version.replace('v', '')) || 1.0;
      const nextVer = `v${(currentVerNum + 0.1).toFixed(1)}`;

      const historyEntry = {
        version: nextVer,
        date: nowIso,
        author: documentData.author,
        fileName: documentData.fileName,
        summary: documentData.versionSummary || 'Actualización de documento de servicio'
      };

      newOrUpdated = {
        ...prev,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: nextVer,
        versionHistory: [historyEntry, ...prevHistory]
      };

      docs[existingIndex] = newOrUpdated;
    } else {
      newOrUpdated = {
        id: `doc-${wheelId}-d${dayNumber}-${serviceType}-${Date.now()}`,
        hotelId,
        category: wheelId,
        dayNumber,
        serviceType,
        title: `Día ${dayNumber} · ${serviceType.toUpperCase()} (${documentData.fileName})`,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: 'v1.0',
        versionHistory: [
          {
            version: 'v1.0',
            date: nowIso,
            author: documentData.author,
            fileName: documentData.fileName,
            summary: documentData.versionSummary || 'Carga inicial del documento'
          }
        ]
      };
      docs.push(newOrUpdated);
    }

    this.saveDocumentsForHotel(hotelId, docs);
    return newOrUpdated;
  },

  // Guardar o sustituir documento de toda la rueda completa
  saveFullWheelDocument(
    hotelId: string,
    wheelId: 'rueda_1' | 'rueda_2',
    documentData: {
      fileName: string;
      fileFormat: SupportedFileFormat;
      fileBase64: string;
      fileSizeBytes: number;
      author: string;
      versionSummary?: string;
    }
  ): DocumentRecord {
    const docs = this.getDocumentsForHotel(hotelId);
    const existingIndex = docs.findIndex(d => d.category === wheelId && d.isFullWheelDocument);

    let parsedExcel: ParsedExcelWorkbook | undefined;
    if (documentData.fileFormat === 'xlsx' || documentData.fileFormat === 'xls') {
      try {
        parsedExcel = parseExcelFile(documentData.fileBase64, documentData.fileName, documentData.fileBase64);
      } catch (err) {
        console.warn('Error parsing full wheel excel:', err);
      }
    }

    const nowIso = new Date().toISOString();
    let newOrUpdated: DocumentRecord;

    if (existingIndex >= 0) {
      const prev = docs[existingIndex];
      const prevHistory = prev.versionHistory || [];
      const currentVerNum = parseFloat(prev.version.replace('v', '')) || 1.0;
      const nextVer = `v${(currentVerNum + 0.1).toFixed(1)}`;

      const historyEntry = {
        version: nextVer,
        date: nowIso,
        author: documentData.author,
        fileName: documentData.fileName,
        summary: documentData.versionSummary || 'Sustitución de documento completo de la rueda'
      };

      newOrUpdated = {
        ...prev,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: nextVer,
        versionHistory: [historyEntry, ...prevHistory]
      };
      docs[existingIndex] = newOrUpdated;
    } else {
      newOrUpdated = {
        id: `doc-${wheelId}-full-${Date.now()}`,
        hotelId,
        category: wheelId,
        isFullWheelDocument: true,
        title: `${wheelId === 'rueda_1' ? 'Rueda 1' : 'Rueda 2'} Completa (15 Días) · ${documentData.fileName}`,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: 'v1.0',
        versionHistory: [
          {
            version: 'v1.0',
            date: nowIso,
            author: documentData.author,
            fileName: documentData.fileName,
            summary: documentData.versionSummary || 'Carga inicial del documento global'
          }
        ]
      };
      docs.push(newOrUpdated);
    }

    this.saveDocumentsForHotel(hotelId, docs);
    return newOrUpdated;
  },

  // Guardar documento para la Carta
  saveCartaDocument(
    hotelId: string,
    documentData: {
      fileName: string;
      title?: string;
      fileFormat: SupportedFileFormat;
      fileBase64: string;
      fileSizeBytes: number;
      author: string;
      versionSummary?: string;
    }
  ): DocumentRecord {
    const docs = this.getDocumentsForHotel(hotelId);
    let parsedExcel: ParsedExcelWorkbook | undefined;
    if (documentData.fileFormat === 'xlsx' || documentData.fileFormat === 'xls') {
      try {
        parsedExcel = parseExcelFile(documentData.fileBase64, documentData.fileName, documentData.fileBase64);
      } catch (err) {
        console.warn('Error parsing carta excel:', err);
      }
    }

    const nowIso = new Date().toISOString();
    const newDoc: DocumentRecord = {
      id: `doc-carta-${hotelId}-${Date.now()}`,
      hotelId,
      category: 'carta',
      title: documentData.title || `Carta ${documentData.fileName}`,
      fileName: documentData.fileName,
      fileFormat: documentData.fileFormat,
      fileSizeBytes: documentData.fileSizeBytes,
      fileBase64: documentData.fileBase64,
      parsedExcel,
      uploadedAt: nowIso,
      author: documentData.author,
      version: 'v1.0',
      versionHistory: [
        {
          version: 'v1.0',
          date: nowIso,
          author: documentData.author,
          fileName: documentData.fileName,
          summary: documentData.versionSummary || 'Carga de carta oficial'
        }
      ]
    };

    docs.unshift(newDoc);
    this.saveDocumentsForHotel(hotelId, docs);
    return newDoc;
  },

  // Vincular archivo documental a una Ficha Técnica
  attachDocumentToTechSheet(
    hotelId: string,
    techSheetId: string,
    documentData: {
      fileName: string;
      fileFormat: SupportedFileFormat;
      fileBase64: string;
      fileSizeBytes: number;
      author: string;
      versionSummary?: string;
    }
  ): DocumentRecord {
    const docs = this.getDocumentsForHotel(hotelId);
    const existingIndex = docs.findIndex(
      d => d.category === 'ficha_tecnica' && d.techSheetId === techSheetId
    );

    let parsedExcel: ParsedExcelWorkbook | undefined;
    if (documentData.fileFormat === 'xlsx' || documentData.fileFormat === 'xls') {
      try {
        parsedExcel = parseExcelFile(documentData.fileBase64, documentData.fileName, documentData.fileBase64);
      } catch (err) {
        console.warn('Error parsing tech sheet excel:', err);
      }
    }

    const nowIso = new Date().toISOString();
    let newOrUpdated: DocumentRecord;

    if (existingIndex >= 0) {
      const prev = docs[existingIndex];
      const prevHistory = prev.versionHistory || [];
      const currentVerNum = parseFloat(prev.version.replace('v', '')) || 1.0;
      const nextVer = `v${(currentVerNum + 0.1).toFixed(1)}`;

      const historyEntry = {
        version: nextVer,
        date: nowIso,
        author: documentData.author,
        fileName: documentData.fileName,
        summary: documentData.versionSummary || 'Sustitución de documento técnico'
      };

      newOrUpdated = {
        ...prev,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: nextVer,
        versionHistory: [historyEntry, ...prevHistory]
      };
      docs[existingIndex] = newOrUpdated;
    } else {
      newOrUpdated = {
        id: `doc-ft-${techSheetId}-${Date.now()}`,
        hotelId,
        category: 'ficha_tecnica',
        techSheetId,
        title: `Ficha Técnica adjunta (${documentData.fileName})`,
        fileName: documentData.fileName,
        fileFormat: documentData.fileFormat,
        fileSizeBytes: documentData.fileSizeBytes,
        fileBase64: documentData.fileBase64,
        parsedExcel,
        uploadedAt: nowIso,
        author: documentData.author,
        version: 'v1.0',
        versionHistory: [
          {
            version: 'v1.0',
            date: nowIso,
            author: documentData.author,
            fileName: documentData.fileName,
            summary: documentData.versionSummary || 'Adjuntado inicial a ficha técnica'
          }
        ]
      };
      docs.push(newOrUpdated);
    }

    this.saveDocumentsForHotel(hotelId, docs);
    return newOrUpdated;
  }
};
