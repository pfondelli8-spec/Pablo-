import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Maximize2,
  Minimize2,
  AlertTriangle,
  History,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { DocumentRecord } from '../services/cartaMenusDocumentService';
import { ExcelViewerModal } from './ExcelViewerModal';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentRecord | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document
}) => {
  if (!isOpen || !document) return null;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Si es un archivo Excel con datos parseados, delegar en ExcelViewerModal
  if (document.fileFormat === 'xlsx' || document.fileFormat === 'xls') {
    if (document.parsedExcel) {
      return (
        <ExcelViewerModal
          isOpen={isOpen}
          onClose={onClose}
          workbook={document.parsedExcel}
          documentTitle={document.title}
        />
      );
    }
  }

  const handleDownload = () => {
    if (!document.fileBase64) return;
    try {
      const cleanBase64 = document.fileBase64.includes('base64,')
        ? document.fileBase64.split('base64,')[1]
        : document.fileBase64;
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      let mimeType = 'application/octet-stream';
      if (document.fileFormat === 'pdf') mimeType = 'application/pdf';
      else if (document.fileFormat === 'docx')
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (document.fileFormat === 'doc') mimeType = 'application/msword';

      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar archivo:', err);
    }
  };

  const getFormatBadge = () => {
    switch (document.fileFormat) {
      case 'pdf':
        return (
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
            PDF Documento
          </span>
        );
      case 'docx':
      case 'doc':
        return (
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Word DOC/DOCX
          </span>
        );
      case 'xlsx':
      case 'xls':
        return (
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Excel Spreadsheet
          </span>
        );
      case 'image':
        return (
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Imagen / Foto
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
            Documento
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-[#0F1722] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen
            ? 'w-full h-full rounded-none m-0'
            : 'w-full max-w-5xl max-h-[90vh] h-[82vh]'
        }`}
      >
        {/* Cabecera */}
        <div className="px-4 sm:px-6 py-3 bg-[#162231] border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {getFormatBadge()}
                <span className="text-[11px] text-[#C5A880] font-mono font-bold">
                  {document.version}
                </span>
                <span className="text-[10px] text-slate-400">
                  ({(document.fileSizeBytes / 1024).toFixed(1)} KB)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {document.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {document.versionHistory && document.versionHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  showHistory
                    ? 'bg-[#C5A880] text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Historial de versiones"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Historial</span>
              </button>
            )}

            {document.fileBase64 && (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b59870] text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                title="Descargar archivo original"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel de Historial de Versiones si está desplegado */}
        {showHistory && (
          <div className="px-6 py-3 bg-[#131C28] border-b border-slate-800 animate-fade-in shrink-0">
            <h3 className="text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Historial de Versiones del Documento</span>
            </h3>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {(document.versionHistory || []).map((ver, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#C5A880]">{ver.version}</span>
                    <span className="text-slate-400">· {ver.summary}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {ver.author}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(ver.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenido / Visualizador */}
        <div className="flex-1 overflow-auto bg-[#0A0F17] p-4 flex flex-col items-center justify-center">
          {document.fileFormat === 'image' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-[#0C121B] rounded-xl overflow-hidden">
              {document.fileBase64 ? (
                <img
                  src={
                    document.fileBase64.startsWith('data:')
                      ? document.fileBase64
                      : `data:image/jpeg;base64,${document.fileBase64}`
                  }
                  alt={document.title}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-slate-700/60"
                />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                  <p className="text-sm font-bold text-white">{document.fileName}</p>
                  <p className="text-xs">Imagen registrada en la base documental del hotel.</p>
                </div>
              )}
            </div>
          ) : document.fileFormat === 'pdf' ? (
            <div className="w-full h-full flex flex-col bg-[#131A24] rounded-xl border border-slate-800 overflow-hidden">
              {document.fileBase64 ? (
                <div className="w-full h-full flex flex-col">
                  <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs px-4">
                    <span className="text-slate-300 font-medium truncate max-w-md">
                      {document.fileName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={
                          document.fileBase64.startsWith('data:')
                            ? document.fileBase64
                            : `data:application/pdf;base64,${document.fileBase64}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir en nueva pestaña</span>
                      </a>
                      <button
                        onClick={handleDownload}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </div>
                  <iframe
                    src={
                      document.fileBase64.startsWith('data:')
                        ? document.fileBase64
                        : `data:application/pdf;base64,${document.fileBase64}`
                    }
                    title={document.title}
                    className="w-full flex-1 border-0 bg-white"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{document.fileName}</h3>
                  <p className="text-xs text-slate-400 max-w-md mb-4">
                    Documento PDF normalizado.
                  </p>
                </div>
              )}
            </div>
          ) : document.fileFormat === 'docx' || document.fileFormat === 'doc' ? (
            <div className="w-full max-w-3xl bg-white text-slate-800 rounded-xl p-8 sm:p-12 shadow-2xl my-auto font-serif">
              <div className="border-b border-gray-200 pb-4 mb-6 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-600 font-bold tracking-wider">
                    DOCUMENTO OFICIAL · MICROSOFT WORD
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {document.title}
                  </h1>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Archivo: <strong>{document.fileName}</strong> · Versión: {document.version}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .docx</span>
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 font-sans space-y-4">
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Documento Word verificado y registrado en el repositorio documental del hotel. Para edición con estilos enriquecidos, descargue el archivo original.
                  </span>
                </div>

                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900">Metadatos de Control</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Responsable / Autor:</span>
                      <strong className="block text-gray-800">{document.author}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Fecha de Registro:</span>
                      <strong className="block text-gray-800">
                        {new Date(document.uploadedAt).toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Tamaño del Archivo:</span>
                      <strong className="block text-gray-800 font-mono">
                        {(document.fileSizeBytes / 1024).toFixed(1)} KB
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado de Aprobación:</span>
                      <strong className="block text-emerald-700 font-bold">Activo & Verificado</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-semibold">Documento cargado en formato {document.fileFormat.toUpperCase()}</p>
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 rounded-xl bg-[#C5A880] text-slate-950 font-bold text-xs inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar {document.fileName}</span>
              </button>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#131C28] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div>
            Responsable: <strong className="text-slate-200">{document.author}</strong> · Actualizado:{' '}
            <span className="font-mono">{new Date(document.uploadedAt).toLocaleDateString()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar Visor
          </button>
        </div>
      </div>
    </div>
  );
};
