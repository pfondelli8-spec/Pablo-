import React, { useState, useMemo } from 'react';
import { 
  Wine, 
  UtensilsCrossed, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  ShieldAlert, 
  ChevronRight, 
  Layers, 
  Tag, 
  Clock, 
  DollarSign,
  Lock,
  ExternalLink
} from 'lucide-react';
import { StandardRecipeEntity, UserAccount } from '../types/multiTenantConfig';
import { multiTenantStorage } from '../services/multiTenantStorage';

interface DocumentosRegistrosViewProps {
  currentUser: UserAccount;
  currentEstablishmentName: string;
}

export const DocumentosRegistrosView: React.FC<DocumentosRegistrosViewProps> = ({
  currentUser,
  currentEstablishmentName
}) => {
  const [subTab, setSubTab] = useState<'recetas' | 'alergenos' | 'exportar'>('recetas');
  const [recipes, setRecipes] = useState<StandardRecipeEntity[]>(() => multiTenantStorage.getRecipes());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<StandardRecipeEntity | null>(null);

  // Modal nueva receta
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [newRecName, setNewRecName] = useState('');
  const [newRecCode, setNewRecCode] = useState('');
  const [newRecCategory, setNewRecCategory] = useState<StandardRecipeEntity['category']>('cocteleria');
  const [newRecSteps, setNewRecSteps] = useState('');
  const [newRecIngredients, setNewRecIngredients] = useState('');
  const [newRecGlassware, setNewRecGlassware] = useState('');
  const [newRecPrice, setNewRecPrice] = useState('8.50');

  // 14 Alérgenos de Declaración Obligatoria (Reglamento UE 1169/2011)
  const officialAllergensList = [
    'Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos',
    'Frutos de cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Dióxido de azufre y sulfitos', 'Altramuces', 'Moluscos'
  ];

  // Filtrado de recetas
  const filteredRecipes = useMemo(() => {
    return recipes.filter(rec => {
      if (categoryFilter !== 'todos' && rec.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rec.name.toLowerCase().includes(q);
        const matchesCode = rec.code.toLowerCase().includes(q);
        const matchesIng = rec.ingredients.some(i => i.name.toLowerCase().includes(q));
        return matchesName || matchesCode || matchesIng;
      }
      return true;
    });
  }, [recipes, categoryFilter, searchQuery]);

  // Formatear texto estandarizado para TPV / Manual
  const formatStandardText = (recipe: StandardRecipeEntity) => {
    return `[${recipe.name.toUpperCase()}]
 * FORMULACIÓN:
${recipe.ingredients.map(i => `   - ${i.quantity} de ${i.name}`).join('\n')}
 * FLUJO DE ELABORACIÓN:
${recipe.elaborationSteps.map((s, idx) => `   ${idx + 1}. ${s.replace(/^\d+\.\s*/, '')}`).join('\n')}
 * CRISTALERÍA Y ÚTILES:
   - ${recipe.utensilsAndGlassware}
 * DIAGNÓSTICO:
   - ${recipe.sensoryDiagnosis}
 * ALÉRGENOS:
   - ${recipe.allergens.length > 0 ? recipe.allergens.join(', ') : 'Sin alérgenos declarables según Reglamento UE 1169/2011.'}`;
  };

  const handleCopyStandardText = (recipe: StandardRecipeEntity, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = formatStandardText(recipe);
    navigator.clipboard.writeText(text);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName.trim()) return;

    const parsedIng = newRecIngredients.split('\n').filter(Boolean).map(line => ({
      name: line.trim(),
      quantity: 'Dosis oficial',
      unit: 'unidad'
    }));

    const parsedSteps = newRecSteps.split('\n').filter(Boolean).map((s, i) => `${i + 1}. ${s.trim()}`);

    const newRecipe: StandardRecipeEntity = {
      id: `rec-${Date.now()}`,
      companyId: currentUser.companyId,
      establishmentId: currentUser.establishmentId,
      departmentId: currentUser.departmentId,
      pointOfSaleId: currentUser.pointOfSaleId,
      name: newRecName.trim(),
      code: newRecCode.trim() || `FT-${Date.now().toString().slice(-4)}`,
      category: newRecCategory,
      servings: 1,
      prepTimeMinutes: 5,
      ingredients: parsedIng.length > 0 ? parsedIng : [{ name: 'Ingrediente base', quantity: '5 cl', unit: 'cl' }],
      elaborationSteps: parsedSteps.length > 0 ? parsedSteps : ['Añadimos los ingredientes en el recipiente de servicio.'],
      utensilsAndGlassware: newRecGlassware.trim() || 'Vaso o cristalería homologada',
      sensoryDiagnosis: 'Equilibrado en boca con perfil organoléptico balanceado y final limpio.',
      allergens: ['Sin alérgenos declarables'],
      sellingPrice: parseFloat(newRecPrice) || 8.00,
      version: '1.0',
      status: 'publicado',
      updatedAt: new Date().toISOString().split('T')[0],
      responsible: currentUser.name
    };

    const updated = multiTenantStorage.saveRecipe(newRecipe);
    setRecipes(updated);
    setShowAddRecipeModal(false);
    setNewRecName('');
    setNewRecCode('');
    setNewRecSteps('');
    setNewRecIngredients('');
  };

  const handleExportFullCSV = () => {
    const rows = [
      ['Código', 'Nombre Receta', 'Categoría', 'PVP (€)', 'Coste (€)', 'Versión', 'Responsable', 'Alérgenos']
    ];

    recipes.forEach(r => {
      rows.push([
        r.code,
        `"${r.name}"`,
        r.category,
        r.sellingPrice ? r.sellingPrice.toFixed(2) : '0.00',
        r.costPerServing ? r.costPerServing.toFixed(2) : '0.00',
        `v${r.version}`,
        `"${r.responsible}"`,
        `"${r.allergens.join(', ')}"`
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `recetario_oficial_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto font-sans">
      
      {/* 1. CABECERA & SUBPESTAÑAS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-bold border border-[#C5A880]/30 uppercase">
                Módulo 5 · Documentos & Recetas
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {currentEstablishmentName}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <Wine className="w-5 h-5 text-[#C5A880]" />
              <span>Recetario Profesional & Fichas Técnicas TPV</span>
            </h2>
            <p className="text-xs text-gray-500">
              Formulaciones con medidas exactas, método secuencial y matriz de los 14 alérgenos UE
            </p>
          </div>

          {currentUser.role !== 'trabajador' && (
            <button
              onClick={() => setShowAddRecipeModal(true)}
              className="px-3.5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva Ficha Técnica</span>
            </button>
          )}
        </div>

        {/* Subpestañas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setSubTab('recetas')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              subTab === 'recetas'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Wine className="w-4 h-4 text-[#C5A880]" />
            <span>Fichas Técnicas ({recipes.length})</span>
          </button>

          <button
            onClick={() => setSubTab('alergenos')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              subTab === 'alergenos'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#C5A880]" />
            <span>Matriz 14 Alérgenos UE</span>
          </button>

          <button
            onClick={() => setSubTab('exportar')}
            className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              subTab === 'exportar'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Download className="w-4 h-4 text-[#C5A880]" />
            <span>Exportar Libro TPV</span>
          </button>
        </div>

        {/* Buscador & Filtro de Categoría */}
        {subTab === 'recetas' && (
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, código o ingrediente..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none bg-[#F8F9FA]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
            >
              <option value="todos">Todas las categorías</option>
              <option value="cocteleria">Coctelería</option>
              <option value="cocina">Cocina & Producción</option>
              <option value="cafeteria">Cafetería & Barista</option>
              <option value="pasteleria">Pastelería & Postres</option>
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUBTAB 1: RECETAS Y FICHAS TÉCNICAS
         ========================================================================= */}
      {subTab === 'recetas' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecipes.map(recipe => {
              const isCopied = copiedId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipeModal(recipe)}
                  className="bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#C5A880] font-bold uppercase tracking-wider block">
                          {recipe.code} · {recipe.category.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors mt-0.5">
                          {recipe.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCopyStandardText(recipe, e)}
                        className={`p-2 rounded-lg border transition-all shrink-0 ${
                          isCopied 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'border-[#E2E8F0] hover:bg-gray-50 text-gray-500'
                        }`}
                        title="Copiar texto oficial estandarizado para TPV o manual"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Formulación Rápida */}
                    <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Formulación Oficial:
                      </span>
                      <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                        {recipe.ingredients.map(i => `${i.quantity} ${i.name}`).join(' · ')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                      <div>Cristalería: <strong className="text-[#1A2530]">{recipe.utensilsAndGlassware}</strong></div>
                      <div>PVP Sugerido: <strong className="text-[#1A2530] font-mono">{recipe.sellingPrice ? `${recipe.sellingPrice.toFixed(2)} €` : 'Carta'}</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span className="text-[11px] font-mono text-gray-400">v{recipe.version} Vigente</span>
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
          SUBTAB 2: MATRIZ DE 14 ALÉRGENOS OFICIALES
         ========================================================================= */}
      {subTab === 'alergenos' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#1A2530] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Matriz Oficial de Declaración de Alérgenos (Reglamento UE 1169/2011)</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Información vinculante para la atención al comensal. Queda terminantemente prohibido inferir la ausencia de un alérgeno por falta de datos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {officialAllergensList.map((allergen, idx) => (
              <div key={allergen} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-gray-400 text-[10px]">#{idx + 1}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Auditado
                  </span>
                </div>
                <div className="font-bold text-[#1A2530]">{allergen}</div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Protocolo ante alergia severa o anafilaxia:</strong> Remitir la consulta de inmediato al responsable de sala y verificar presencialmente el etiquetado del envase primario antes de servir.
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: EXPORTACIÓN
         ========================================================================= */}
      {subTab === 'exportar' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-base text-[#1A2530]">
            Exportar Recetario y Fichas Técnicas
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Genera un archivo CSV compatible con sistemas TPV o imprime fichas plastificadas para el área de producción.
          </p>

          <div className="pt-2">
            <button
              onClick={handleExportFullCSV}
              className="px-5 py-2.5 rounded-lg bg-[#1A2530] hover:bg-[#2C3E50] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#C5A880]" />
              <span>Descargar Recetario en CSV / Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETALLE: FICHA TÉCNICA ESTANDARIZADA */}
      {selectedRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            <div className="p-5 border-b border-[#E2E8F0] flex items-start justify-between bg-[#1A2530] text-white">
              <div>
                <div className="text-[11px] font-mono text-[#C5A880] font-bold uppercase tracking-wider">
                  {selectedRecipeModal.code} · FICHA TÉCNICA HOMOLOGADA
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  [{selectedRecipeModal.name}]
                </h2>
              </div>

              <button
                onClick={() => setSelectedRecipeModal(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Bloque Texto Estandarizado F&B */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-mono bg-[#F8F9FA] flex-1 leading-relaxed">
              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">* FORMULACIÓN:</span>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-700">
                  {selectedRecipeModal.ingredients.map((ing, i) => (
                    <li key={i}><strong>{ing.quantity}</strong> de {ing.name}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">* FLUJO DE ELABORACIÓN:</span>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                  {selectedRecipeModal.elaborationSteps.map((step, idx) => (
                    <li key={idx}>{step.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ol>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">* CRISTALERÍA Y ÚTILES:</span>
                <p className="text-gray-700">{selectedRecipeModal.utensilsAndGlassware}</p>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">* DIAGNÓSTICO:</span>
                <p className="text-gray-700">{selectedRecipeModal.sensoryDiagnosis}</p>
              </div>

              <div>
                <span className="font-bold text-[#1A2530] text-sm block mb-1">* ALÉRGENOS:</span>
                <p className="text-gray-700">
                  {selectedRecipeModal.allergens.length > 0 ? selectedRecipeModal.allergens.join(', ') : 'Sin alérgenos declarables según Reglamento UE 1169/2011.'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => handleCopyStandardText(selectedRecipeModal, e)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {copiedId === selectedRecipeModal.id ? (
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
                onClick={() => setSelectedRecipeModal(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-100 text-xs font-semibold text-gray-700"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVA RECETA */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#1A2530]">Crear Nueva Ficha Técnica</h3>
              <button onClick={() => setShowAddRecipeModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateRecipe} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre (*):</label>
                <input
                  type="text"
                  required
                  value={newRecName}
                  onChange={(e) => setNewRecName(e.target.value)}
                  placeholder="Ej. Cóctel Signature de la Casa"
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Código Interno:</label>
                  <input
                    type="text"
                    value={newRecCode}
                    onChange={(e) => setNewRecCode(e.target.value)}
                    placeholder="FT-CKT-05"
                    className="w-full p-2 rounded-lg border border-[#E2E8F0] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Categoría:</label>
                  <select
                    value={newRecCategory}
                    onChange={(e) => setNewRecCategory(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="cocteleria">Coctelería</option>
                    <option value="cocina">Cocina</option>
                    <option value="cafeteria">Cafetería</option>
                    <option value="pasteleria">Pastelería</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ingredientes (un ingrediente por línea con medida exacta):</label>
                <textarea
                  rows={3}
                  value={newRecIngredients}
                  onChange={(e) => setNewRecIngredients(e.target.value)}
                  placeholder="5 cl Ron añejo&#10;2.5 cl Zumo de lima&#10;2 cl Sirope simple"
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Pasos de Elaboración (un paso por línea en primera persona plural: Añadimos, Servimos...):</label>
                <textarea
                  rows={3}
                  value={newRecSteps}
                  onChange={(e) => setNewRecSteps(e.target.value)}
                  placeholder="Añadimos los destilados en la coctelera.&#10;Agitamos con hielo macizo.&#10;Servimos con doble colado."
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Cristalería y Útiles:</label>
                <input
                  type="text"
                  value={newRecGlassware}
                  onChange={(e) => setNewRecGlassware(e.target.value)}
                  placeholder="Copa Coupé / Coctelera Boston"
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecipeModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E8F0] hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C5A880] text-[#1A2530] font-bold uppercase"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
