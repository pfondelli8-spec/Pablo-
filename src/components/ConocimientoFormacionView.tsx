import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Check, 
  ChevronRight, 
  Layers, 
  Plus, 
  Tag, 
  History,
  Lock,
  UserCheck,
  Building2
} from 'lucide-react';
import { KnowledgeDocument, UserAccount } from '../types/multiTenantConfig';
import { multiTenantStorage } from '../services/multiTenantStorage';

interface ConocimientoFormacionViewProps {
  currentUser: UserAccount;
  currentEstablishmentName: string;
}

export const ConocimientoFormacionView: React.FC<ConocimientoFormacionViewProps> = ({
  currentUser,
  currentEstablishmentName
}) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => multiTenantStorage.getKnowledgeDocs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedDocModal, setSelectedDocModal] = useState<KnowledgeDocument | null>(null);
  const [readConfirmedSuccess, setReadConfirmedSuccess] = useState(false);

  // Filtrado de documentos
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      // Filtrar por categoría
      if (selectedCategory !== 'todos' && doc.category !== selectedCategory) {
        return false;
      }
      // Filtrar por buscador
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesCode = doc.code.toLowerCase().includes(q);
        const matchesSummary = doc.summary.toLowerCase().includes(q);
        const matchesSteps = doc.steps.some(s => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q));
        return matchesTitle || matchesCode || matchesSummary || matchesSteps;
      }
      return true;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Manejar confirmación de lectura oficial
  const handleConfirmRead = (docId: string) => {
    const updated = multiTenantStorage.confirmDocRead(docId, currentUser);
    setDocuments(updated);
    setReadConfirmedSuccess(true);
    if (selectedDocModal && selectedDocModal.id === docId) {
      const refreshed = updated.find(d => d.id === docId) || null;
      setSelectedDocModal(refreshed);
    }
    setTimeout(() => setReadConfirmedSuccess(false), 3000);
  };

  const categories = [
    { id: 'todos', label: 'Todos los Manuales' },
    { id: 'sop_procedimiento', label: 'Procedimientos (SOPs)' },
    { id: 'normas_higiene', label: 'Seguridad & APPCC' },
    { id: 'manual_bienvenida', label: 'Manuales de Bienvenida' },
    { id: 'funciones_puesto', label: 'Responsabilidades de Puesto' },
    { id: 'atencion_cliente', label: 'Protocolos de Servicio' }
  ];

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto font-sans">
      
      {/* 1. CABECERA & BUSCADOR */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-bold border border-[#C5A880]/30 uppercase">
                Módulo 3 · Conocimiento
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {currentEstablishmentName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C5A880]" />
              <span>Biblioteca Operativa & Procedimientos Vigentes</span>
            </h2>
            <p className="text-xs text-gray-500">
              Documentación técnica, protocolos homologados y confirmación de lectura legal
            </p>
          </div>
        </div>

        {/* Buscador y Filtro */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, código (ej. SOP-BAR-01) o palabra clave..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none bg-[#F8F9FA]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. LISTADO DE DOCUMENTOS VIGENTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Mostrando {filteredDocs.length} documento(s) vigente(s)</span>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Control de Versiones Activo
          </span>
        </div>

        {filteredDocs.map(doc => {
          const isRead = doc.readConfirmations.some(r => r.userId === currentUser.id && r.version === doc.version);

          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDocModal(doc)}
              className="bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#C5A880]">
                    {doc.code}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                    {doc.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    v{doc.version} Vigente
                  </span>
                  {isRead ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" />
                      <span>Leído</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      Lectura Pendiente
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                  {doc.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="text-[11px] text-gray-400 flex items-center gap-4 pt-1">
                  <span>Aprobado por: <strong>{doc.responsible}</strong></span>
                  <span>Vigencia: {doc.effectiveDate}</span>
                  <span>Lecturas confirmadas: <strong>{doc.readConfirmations.length}</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-[#1A2530] group-hover:text-[#C5A880] transition-colors self-end sm:self-center">
                <span>Consultar Manual</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MODAL DE CONSULTA Y CONFIRMACIÓN DE LECTURA */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Cabecera */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-[#1A2530] text-white">
              <div>
                <div className="text-[11px] font-mono text-[#C5A880] font-bold uppercase tracking-wider">
                  {selectedDocModal.code} · VERSIÓN {selectedDocModal.version} VIGENTE
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {selectedDocModal.title}
                </h2>
                <div className="text-xs text-gray-300 mt-1">
                  Responsable de aprobación: <strong>{selectedDocModal.responsible}</strong> · Revisión: {selectedDocModal.reviewDate}
                </div>
              </div>

              <button
                onClick={() => setSelectedDocModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Notificación de lectura confirmada */}
            {readConfirmedSuccess && (
              <div className="bg-emerald-50 border-b border-emerald-300 px-5 py-2.5 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Confirmación de lectura registrada oficialmente con sello de tiempo.</span>
              </div>
            )}

            {/* Contenido del Documento */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs leading-relaxed flex-1">
              <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0]">
                <strong className="text-[#1A2530] block mb-1">Resumen del Procedimiento:</strong>
                <p className="text-gray-700">{selectedDocModal.summary}</p>
              </div>

              {/* Pasos Secuenciales */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                  Secuencia de Ejecución Operativa ({selectedDocModal.steps.length} pasos):
                </h4>

                <div className="space-y-2.5">
                  {selectedDocModal.steps.map(step => (
                    <div key={step.order} className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                      <div className="font-bold text-[#1A2530] text-xs flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1A2530] text-white flex items-center justify-center font-mono text-[10px]">
                          {step.order}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-gray-600 pl-7">{step.detail}</p>
                      {step.criticalCheck && (
                        <div className="ml-7 mt-1.5 p-2 rounded bg-red-50 text-red-800 text-[11px] font-mono border border-red-200">
                          ⚠️ <strong>Punto Crítico de Control:</strong> {step.criticalCheck}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas de Seguridad */}
              {selectedDocModal.safetyNotes && selectedDocModal.safetyNotes.length > 0 && (
                <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                  <strong className="block">Precauciones de Seguridad & EPIs:</strong>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {selectedDocModal.safetyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Registro de Lecturas */}
              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-gray-500">
                <strong>Confirmaciones de lectura en el equipo ({selectedDocModal.readConfirmations.length}):</strong>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedDocModal.readConfirmations.length === 0 ? (
                    <span className="italic text-gray-400">Sin lecturas registradas en esta versión.</span>
                  ) : (
                    selectedDocModal.readConfirmations.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[10px]">
                        ✓ {r.userName} ({r.readAt})
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Pie con Acción de Confirmación */}
            <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                Usuario activo: <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleConfirmRead(selectedDocModal.id)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Confirmar Lectura Oficial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDocModal(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-100 text-xs font-semibold text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
