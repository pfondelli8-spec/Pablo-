/**
 * SERVICIO DE GESTIÓN Y PARSEO DE ARCHIVOS EXCEL (.XLSX / .XLS)
 * Proporciona lectura de hojas múltiples, extracción de tablas, datos estructurados,
 * generación de libros de demostración y descarga de archivos originales.
 */

import * as XLSX from 'xlsx';

export interface ExcelSheetData {
  sheetName: string;
  headers: string[];
  rows: (string | number)[][];
  rowCount: number;
  colCount: number;
}

export interface ParsedExcelWorkbook {
  fileName: string;
  sheetNames: string[];
  sheets: Record<string, ExcelSheetData>;
  activeSheetName: string;
  rawBase64?: string;
  fileSizeBytes?: number;
}

/**
 * Parsea un archivo Excel desde Base64 o ArrayBuffer
 */
export function parseExcelFile(
  data: string | ArrayBuffer,
  fileName: string,
  rawBase64?: string
): ParsedExcelWorkbook {
  let workbook: XLSX.WorkBook;

  if (typeof data === 'string') {
    // Si viene como dataURL tipo "data:application/...;base64,AAAA..."
    const base64Data = data.includes('base64,') ? data.split('base64,')[1] : data;
    workbook = XLSX.read(base64Data, { type: 'base64', cellFormula: false });
  } else {
    workbook = XLSX.read(data, { type: 'array', cellFormula: false });
  }

  const sheetNames = workbook.SheetNames || [];
  const sheets: Record<string, ExcelSheetData> = {};

  sheetNames.forEach(sheetName => {
    const ws = workbook.Sheets[sheetName];
    if (!ws) return;

    // Convertir hoja a matriz de filas crudas
    const rawData = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
      header: 1,
      raw: false,
      defval: ''
    });

    if (rawData.length === 0) {
      sheets[sheetName] = {
        sheetName,
        headers: ['Columna 1'],
        rows: [],
        rowCount: 0,
        colCount: 0
      };
      return;
    }

    // Determinar encabezados a partir de la primera fila con contenido
    const firstRow = rawData[0] || [];
    const headers = firstRow.map((h, idx) => (h !== undefined && h !== '' ? String(h).trim() : `Columna ${idx + 1}`));
    const rows = rawData.slice(1);

    sheets[sheetName] = {
      sheetName,
      headers,
      rows,
      rowCount: rows.length,
      colCount: headers.length
    };
  });

  const activeSheetName = sheetNames[0] || 'Hoja1';

  return {
    fileName,
    sheetNames,
    sheets,
    activeSheetName,
    rawBase64: rawBase64 || (typeof data === 'string' && data.includes('base64,') ? data.split('base64,')[1] : undefined)
  };
}

/**
 * Genera un archivo Excel (.xlsx) real con múltiples hojas y devuelve su base64
 */
export function createMultiSheetWorkbook(
  sheetsDefinition: { sheetName: string; data: (string | number)[][] }[]
): string {
  const wb = XLSX.utils.book_new();

  sheetsDefinition.forEach(({ sheetName, data }) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31)); // Límite de 31 chars en nombres de hoja Excel
  });

  const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  return base64;
}

/**
 * Descarga en el navegador un archivo Excel a partir de su Base64
 */
export function downloadExcelFile(base64Data: string, fileName: string): void {
  try {
    const cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') ? fileName : `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al descargar archivo Excel:', err);
  }
}
