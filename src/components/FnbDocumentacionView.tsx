import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Wine, 
  UtensilsCrossed, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldAlert, 
  Plus, 
  Layers, 
  FileText, 
  ExternalLink,
  Info
} from 'lucide-react';
import { TechnicalSheet, HotelProcedureDoc } from '../types/hotelPortal';
import { TECHNICAL_SHEETS_DATABASE, HOTEL_PROCEDURES_DATABASE } from '../data/hotelPortalData';
import { formatTechnicalSheetStandardText } from '../utils/technicalSheetFormatter';

interface FnbDocumentacionViewProps {
  initialSubTab?: 'fichas' | 'sops' | 'alergenos';
  onOpenRecipeAssistant?: () => void;
}

export const FnbDocumentacionView: React.FC<FnbDocumentacionViewProps> = ({
  initialSubTab = 'fichas',
  onOpenRecipeAssistant
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'fichas' | 'sops' | 'alergenos'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string>('todos');
  const [copiedSheetId, setCopiedSheetId] = useState<string | null>(null);
  const [selectedSheetModal, setSelectedSheetModal] = useState<TechnicalSheet | null>(null);
  const [selectedProcedureModal, setSelectedProcedureModal] = useState<HotelProcedureDoc | null>(null);

  // 14 Alérgenos de Declaración Obligatoria (Reglamento UE 1169/2011)
  const officialAllergensList = [
    'Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos',
    'Frutos de cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'
  ];

  // Filtrado de Fichas Técnicas
  const filteredSheets = useMemo(() => {
    return TECHNICAL_SHEETS_DATABASE.filter(sheet => {
      const q = searchQuery.toLowerCase().trim();
      const name = (sheet.title || sheet.name || '').toLowerCase();
      const ingSummary = (sheet.ingredientsSummary || '').toLowerCase();
      const ingredientsText = sheet.ingredients.map(i => i.name.toLowerCase()).join(' ');

      const matchesSearch = !q || name.includes(q) || ingSummary.includes(q) || ingredientsText.includes(q);
      const matchesCategory = selectedCategory === 'todos' || sheet.category === selectedCategory;
      const matchesAllergen = selectedAllergenFilter === 'todos' || sheet.allergens.includes(selectedAllergenFilter);

      return matchesSearch && matchesCategory && matchesAllergen;
    });
  }, [searchQuery, selectedCategory, selectedAllergenFilter]);

  // Filtrado de Procedimientos Operativos (SOPs)
  const filteredProcedures = useMemo(() => {
    return HOTEL_PROCEDURES_DATABASE.filter(proc => {
      const q = searchQuery.toLowerCase().trim();
      const title = proc.title.toLowerCase();
      const code = proc.code.toLowerCase();
      const summary = (proc.summary || '').toLowerCase();

      return !q || title.includes(q) || code.includes(q) || summary.includes(q);
    });
  }, [searchQuery]);

  const handleCopyStandardText = (sheet: TechnicalSheet, e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = formatTechnicalSheetStandardText(sheet);
    navigator.clipboard.writeText(formatted);
    setCopiedSheetId(sheet.id);
    setTimeout(() => setCopiedSheetId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. CABECERA & SELECTOR DE PESTAÑAS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C5A880]" />
              <span>Documentación Oficial & Fichas F&B</span>
            </h2>
            <p className="text-xs text-gray-500">
              Biblioteca técnica estandarizada para barra, sala y sistemas TPV
            </p>
          </div>

          {onOpenRecipeAssistant && (
            <button
              onClick={onOpenRecipeAssistant}
              className="px-3.5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>Asistente de Ficha Técnica</span>
            </button>
          )}
        </div>

        {/* Subpestañas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveSubTab('fichas')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'fichas'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Wine className="w-4 h-4 text-[#C5A880]" />
            <span>Fichas Técnicas F&B ({TECHNICAL_SHEETS_DATABASE.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sops')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'sops'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 text-[#C5A880]" />
            <span>Procedimientos SOPs ({HOTEL_PROCEDURES_DATABASE.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alergenos')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'alergenos'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#C5A880]" />
            <span>Matriz de Alérgenos (UE 1169/2011)</span>
          </button>
        </div>

        {/* Buscador y Filtros */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, ingrediente o código..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
            />
          </div>

          {activeSubTab === 'fichas' && (
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs p-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
              >
                <option value="todos">Todas las categorías</option>
                <option value="cocteles">Coctelería</option>
                <option value="cafeteria">Cafetería</option>
                <option value="productos">Bebidas y Vinos</option>
                <option value="cocina_recetas">Cocina / Snacks</option>
              </select>

              <select
                value={selectedAllergenFilter}
                onChange={(e) => setSelectedAllergenFilter(e.target.value)}
                className="text-xs p-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
              >
                <option value="todos">Todos los alérgenos</option>
                {officialAllergensList.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SUBTAB 1: FICHAS TÉCNICAS F&B (FORMATO ESTANDARIZADO)
         ========================================================================= */}
      {activeSubTab === 'fichas' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Mostrando {filteredSheets.length} ficha(s) técnica(s) homologada(s)</span>
            <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Formato Estandarizado F&B
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSheets.map(sheet => {
              const isCopied = copiedSheetId === sheet.id;
              const titleName = sheet.title || sheet.name || 'Ficha Sin Nombre';

              return (
                <div
                  key={sheet.id}
                  onClick={() => setSelectedSheetModal(sheet)}
                  className="bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">
                          {sheet.code} · {sheet.category.toUpperCase()}
                        </div>
                        <h3 className="font-bold text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors leading-snug">
                          {titleName}
                        </h3>
                      </div>
                      
                      <button
                        onClick={(e) => handleCopyStandardText(sheet, e)}
                        className={`p-2 rounded-lg border transition-all shrink-0 ${
                          isCopied 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'border-[#E2E8F0] hover:bg-gray-50 text-gray-500 hover:text-[#1A2530]'
                        }`}
                        title="Copiar texto base estandarizado para TPV o manual"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Formulación Rápida */}
                    <div className="bg-[#F8F9FA] p-2.5 rounded-lg border border-[#E2E8F0] space-y-1">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Formulación:
                      </div>
                      <div className="text-xs text-[#2C3E50] line-clamp-3 leading-relaxed">
                        {sheet.ingredients.map(i => `${i.quantity} ${i.name}`).join(' · ')}
                      </div>
                    </div>

                    {/* Datos Técnicos: Cristalería y Técnica */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="text-gray-500">
                        Cristalería: <strong className="text-[#1A2530]">{sheet.glassware || 'Homologada'}</strong>
                      </div>
                      <div className="text-gray-500">
                        Técnica: <strong className="text-[#1A2530]">{sheet.technique || 'Batido / Directo'}</strong>
                      </div>
                    </div>

                    {/* Alérgenos */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Alérgenos:</span>
                      {sheet.allergens && sheet.allergens.length > 0 ? (
                        sheet.allergens.map(a => (
                          <span key={a} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Sin alérgenos declarables
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span className="text-[11px] text-gray-500 font-mono">
                      PVP: {sheet.precioDiamond ? `${sheet.precioDiamond.toFixed(2)} €` : 'Carta'}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-[#C5A880] transition-colors">
                      Ver Ficha Completa <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: PROCEDIMIENTOS OPERATIVOS (SOPs)
         ========================================================================= */}
      {activeSubTab === 'sops' && (
        <div className="space-y-3">
          <div className="text-xs text-gray-500 px-1">
            Manual Operativo de F&B: {filteredProcedures.length} procedimiento(s) vigentes
          </div>

          <div className="space-y-3">
            {filteredProcedures.map(proc => (
              <div
                key={proc.id}
                onClick={() => setSelectedProcedureModal(proc)}
                className="bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C5A880]">
                      {proc.code}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {proc.departmentLabel}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      v{proc.version} Vigente
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                    {proc.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {proc.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                  <span>Abrir Manual</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: MATRIZ DE ALÉRGENOS OFICIAL (UE 1169/2011)
         ========================================================================= */}
      {activeSubTab === 'alergenos' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-base text-[#1A2530] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Declaración Oficial de Alérgenos (Reglamento UE 1169/2011)</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Información vinculante para la atención al huésped. Queda terminantemente prohibido inferir la ausencia de un alérgeno sin confirmación de la ficha técnica.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {officialAllergensList.map((allergen, idx) => {
              const count = TECHNICAL_SHEETS_DATABASE.filter(s => s.allergens.includes(allergen)).length;
              return (
                <div
                  key={allergen}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#1A2530]">
                    <span className="font-mono text-gray-400 text-[10px]">#{idx + 1}</span>
                    <span>{allergen}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">
                    Presente en: <strong className="text-[#1A2530]">{count} receta(s)</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
            <strong>Protocolo en caso de duda:</strong> Si un huésped informa sobre una alergia severa o anafilaxia, remitir inmediatamente al responsable de sala y verificar directamente el etiquetado primario del producto con el supervisor.
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETALLE: FICHA TÉCNICA ESTANDARIZADA
         ========================================================================= */}
      {selectedSheetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            
            {/* Cabecera Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <div className="text-[11px] font-mono text-[#C5A880] font-bold uppercase tracking-wider">
                  {selectedSheetModal.code} · FICHA TÉCNICA OFICIAL
                </div>
                <h2 className="text-xl font-bold text-[#1A2530]">
                  [{selectedSheetModal.title || selectedSheetModal.name}]
                </h2>
              </div>
              <button
                onClick={() => setSelectedSheetModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Bloque Texto Estandarizado F&B */}
            <div className="space-y-4 text-xs font-mono bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0]">
              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">
                  * FORMULACIÓN:
                </span>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {selectedSheetModal.ingredients.map((ing, i) => (
                    <li key={i}>
                      <strong>{ing.quantity}</strong> de {ing.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">
                  * FLUJO DE ELABORACIÓN:
                </span>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                  {selectedSheetModal.preparationMethod.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">
                  * CRISTALERÍA Y ÚTILES:
                </span>
                <p className="text-gray-700">
                  Cristalería: {selectedSheetModal.glassware || 'Vaso homologado'} | Útiles: {selectedSheetModal.tools || 'Coctelera Boston, colador gusanillo, medidor jigger'} | Hielo: {selectedSheetModal.ice || 'Hielo macizo'}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">
                  * DIAGNÓSTICO:
                </span>
                <p className="text-gray-700">
                  {selectedSheetModal.diagnosis || selectedSheetModal.additionalInfo || 'Equilibrado en boca con perfil aromático balanceado y final refrescante.'}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">
                  * ALÉRGENOS:
                </span>
                <p className="text-gray-700">
                  {selectedSheetModal.allergens && selectedSheetModal.allergens.length > 0 
                    ? selectedSheetModal.allergens.join(', ') 
                    : 'Sin alérgenos presentes según Reglamento UE 1169/2011.'}
                </p>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E2E8F0]">
              <button
                onClick={(e) => handleCopyStandardText(selectedSheetModal, e)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedSheetId === selectedSheetModal.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>¡Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Formato TPV Estandarizado</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedSheetModal(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-xs font-semibold text-gray-600"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DETALLE: PROCEDIMIENTO OPERATIVO (SOP)
         ========================================================================= */}
      {selectedProcedureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <div className="text-[11px] font-mono text-[#C5A880] font-bold uppercase tracking-wider">
                  {selectedProcedureModal.code} · v{selectedProcedureModal.version}
                </div>
                <h2 className="text-xl font-bold text-[#1A2530]">
                  {selectedProcedureModal.title}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  Departamento: <strong>{selectedProcedureModal.departmentLabel}</strong> · Aprobado por: {selectedProcedureModal.responsible || 'Dirección de Operaciones'}
                </div>
              </div>
              <button
                onClick={() => setSelectedProcedureModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-700 leading-relaxed bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E8F0]">
              <strong>Objetivo del Protocolo:</strong> {selectedProcedureModal.summary}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">
                Pasos de Ejecución Operativa:
              </h4>

              <div className="space-y-2">
                {selectedProcedureModal.steps.map((st, i) => {
                  const title = typeof st === 'string' ? `Paso ${i + 1}` : st.title;
                  const detail = typeof st === 'string' ? st : st.detail;
                  const critical = typeof st === 'object' && st.criticalCheck ? st.criticalCheck : null;

                  return (
                    <div key={i} className="p-3 rounded-lg border border-[#E2E8F0] bg-white space-y-1">
                      <div className="font-bold text-xs text-[#1A2530] flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1A2530] text-white flex items-center justify-center text-[10px] font-mono">
                          {i + 1}
                        </span>
                        <span>{title}</span>
                      </div>
                      <p className="text-xs text-gray-600 pl-7">{detail}</p>
                      {critical && (
                        <div className="ml-7 mt-1 text-[11px] font-mono text-red-700 bg-red-50 p-1.5 rounded border border-red-200">
                          ⚠️ Punto Crítico: {critical}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-right border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedProcedureModal(null)}
                className="px-4 py-2 rounded-lg bg-[#1A2530] text-white hover:bg-[#2C3E50] text-xs font-semibold"
              >
                Cerrar Protocolo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
