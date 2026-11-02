import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  Search,
  AlertCircle,
  Table,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';
import { ParsedExcelWorkbook, downloadExcelFile } from '../services/excelService';

interface ExcelViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workbook: ParsedExcelWorkbook | null;
  documentTitle?: string;
}

export const ExcelViewerModal: React.FC<ExcelViewerModalProps> = ({
  isOpen,
  onClose,
  workbook,
  documentTitle
}) => {
  if (!isOpen || !workbook) return null;

  const [activeSheet, setActiveSheet] = useState<string>(
    workbook.activeSheetName || workbook.sheetNames[0] || 'Hoja1'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Obtener los datos de la hoja actualmente activa
  const currentSheetData = workbook.sheets[activeSheet] || {
    sheetName: activeSheet,
    headers: [],
    rows: [],
    rowCount: 0,
    colCount: 0
  };

  // Filtrado de filas si hay término de búsqueda
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return currentSheetData.rows;
    const term = searchTerm.toLowerCase();
    return currentSheetData.rows.filter(row =>
      row.some(cell => String(cell).toLowerCase().includes(term))
    );
  }, [currentSheetData.rows, searchTerm]);

  const handleDownload = () => {
    if (workbook.rawBase64) {
      downloadExcelFile(workbook.rawBase64, workbook.fileName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-[#0F1722] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none m-0'
            : 'w-full max-w-6xl max-h-[92vh] h-[85vh]'
        }`}
      >
        {/* Cabecera Principal del Visor */}
        <div className="px-4 sm:px-6 py-3 bg-[#162231] border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Excel Viewer · Multi-Hoja
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {workbook.sheetNames.length} {workbook.sheetNames.length === 1 ? 'hoja' : 'hojas disponibles'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {documentTitle || workbook.fileName}
              </h2>
            </div>
          </div>

          {/* Botones de Acción de Cabecera */}
          <div className="flex items-center gap-2 shrink-0">
            {workbook.rawBase64 && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                title="Descargar libro Excel original (.xlsx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar Original</span>
                <span className="sm:hidden">.xlsx</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Pestañas de Hojas de Cálculo (Sheet Tabs) */}
        <div className="px-4 sm:px-6 py-2 bg-[#121B26] border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#C5A880]" />
              <span>Hojas:</span>
            </span>
            {workbook.sheetNames.map(sheetName => {
              const isSelected = activeSheet === sheetName;
              const count = workbook.sheets[sheetName]?.rowCount || 0;
              return (
                <button
                  key={sheetName}
                  onClick={() => {
                    setActiveSheet(sheetName);
                    setSearchTerm('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Table className="w-3 h-3" />
                  <span>{sheetName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buscador dentro de la hoja activa */}
          <div className="relative min-w-[180px] sm:min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Buscar en ${activeSheet}...`}
              className="w-full pl-8 pr-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Advertencia técnica normativa */}
        <div className="px-4 sm:px-6 py-1.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Visualización interactiva de celdas y cantidades. Formatos visuales complejos o macros deben consultarse en el archivo original descargable.
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400/80 shrink-0 ml-2">
            Solo Lectura
          </span>
        </div>

        {/* Tabla de Hoja de Cálculo con Scroll Responsive */}
        <div className="flex-1 overflow-auto bg-[#0A0F17] p-2 sm:p-4">
          {currentSheetData.headers.length === 0 && currentSheetData.rows.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <Table className="w-12 h-12 mb-2 text-slate-600" />
              <p className="text-sm font-semibold">Esta hoja de cálculo está vacía o no contiene celdas visibles.</p>
            </div>
          ) : (
            <div className="inline-block min-w-full align-middle border border-slate-800 rounded-xl overflow-hidden shadow-lg bg-[#0F1622]">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                {/* Cabecera de Columnas */}
                <thead className="bg-[#172230] sticky top-0 z-10 shadow-xs">
                  <tr>
                    {/* Número de fila */}
                    <th
                      scope="col"
                      className="px-2.5 py-2 text-center text-[10px] font-mono text-slate-500 bg-[#141C28] border-r border-slate-800 w-10 shrink-0"
                    >
                      #
                    </th>
                    {currentSheetData.headers.map((header, colIdx) => (
                      <th
                        key={colIdx}
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-bold text-emerald-400 uppercase tracking-wider border-r border-slate-800 last:border-r-0 whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-500 font-normal">
                            {String.fromCharCode(65 + (colIdx % 26))}
                          </span>
                          <span>{header}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Filas de Datos */}
                <tbody className="divide-y divide-slate-800/80 bg-[#0E1520]">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={currentSheetData.headers.length + 1}
                        className="px-4 py-8 text-center text-slate-500 text-xs"
                      >
                        No se encontraron filas que coincidan con &ldquo;{searchTerm}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-slate-800/50 transition-colors group"
                      >
                        {/* Índice numérico de fila */}
                        <td className="px-2 py-1.5 text-center text-[10px] font-mono text-slate-500 bg-[#121924] border-r border-slate-800 group-hover:text-slate-300">
                          {rowIdx + 1}
                        </td>
                        {currentSheetData.headers.map((_, colIdx) => {
                          const cellValue = row[colIdx];
                          const isNumber =
                            typeof cellValue === 'number' ||
                            (!isNaN(Number(cellValue)) && cellValue !== '');

                          return (
                            <td
                              key={colIdx}
                              className={`px-3 py-1.5 text-xs border-r border-slate-800/60 last:border-r-0 whitespace-nowrap text-slate-200 ${
                                isNumber ? 'font-mono text-right text-emerald-300' : 'text-left'
                              }`}
                            >
                              {cellValue !== undefined && cellValue !== null && cellValue !== '' ? (
                                String(cellValue)
                              ) : (
                                <span className="text-slate-700 select-none">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pie de Estado del Visor */}
        <div className="px-4 sm:px-6 py-2 bg-[#131C28] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>
              Mostrando <strong className="text-white">{filteredRows.length}</strong> de{' '}
              <strong className="text-slate-300">{currentSheetData.rowCount}</strong> filas
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-300">{currentSheetData.colCount}</strong> columnas
            </span>
            {searchTerm && (
              <span className="text-emerald-400 font-medium">
                (Filtro: &ldquo;{searchTerm}&rdquo;)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              PROA Hospitality Sheet Engine
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
