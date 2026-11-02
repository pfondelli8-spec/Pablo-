import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wine, 
  Search, 
  GlassWater, 
  Check, 
  Copy, 
  Printer, 
  ChevronRight, 
  Wand2, 
  Plus, 
  RefreshCw, 
  Trash2, 
  X 
} from 'lucide-react';
import { TechnicalSheet } from '../types/hotelPortal';
import { TECHNICAL_SHEETS_DATABASE, DEMO_SAMPLE_TECHNICAL_SHEETS } from '../data/hotelPortalData';
import { 
  formatTechnicalSheetStandardText, 
  transformRawRecipeToStandardized 
} from '../utils/technicalSheetFormatter';

interface DiamondTechnicalSheetsViewerProps {
  embeddedInTerrace?: boolean;
  onOpenModal?: (sheet: TechnicalSheet) => void;
  defaultCategory?: string;
}

const LOCAL_STORAGE_SHEETS_KEY = 'fnb_custom_technical_sheets';

export const DiamondTechnicalSheetsViewer: React.FC<DiamondTechnicalSheetsViewerProps> = ({
  embeddedInTerrace = false,
  onOpenModal,
  defaultCategory = 'todos'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Estado para el Transformador / Asistente de Recetas
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [converterInput, setConverterInput] = useState('');
  const [convertedOutput, setConvertedOutput] = useState<string | null>(null);
  const [convertedSheet, setConvertedSheet] = useState<Partial<TechnicalSheet> | null>(null);
  const [converterCopied, setConverterCopied] = useState(false);

  // Modal para creación manual directa de ficha
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('FT-001');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'cocteles' | 'cafeteria' | 'cocina_recetas'>('cocteles');
  const [newGlassware, setNewGlassware] = useState('');
  const [newTechnique, setNewTechnique] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newIngredientsText, setNewIngredientsText] = useState('');
  const [newMethodText, setNewMethodText] = useState('');
  const [newAllergensText, setNewAllergensText] = useState('Sin alérgenos declarables');

  // Lista local reactiva de fichas con persistencia en localStorage
  const [customSheets, setCustomSheets] = useState<TechnicalSheet[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SHEETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SHEETS_KEY, JSON.stringify(customSheets));
    } catch {}
  }, [customSheets]);

  const allSheets = useMemo(() => {
    return [...TECHNICAL_SHEETS_DATABASE, ...customSheets];
  }, [customSheets]);

  const handleLoadDemoSamples = () => {
    setCustomSheets(DEMO_SAMPLE_TECHNICAL_SHEETS);
  };

  const handleClearAllCustomSheets = () => {
    setCustomSheets([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SHEETS_KEY);
    } catch {}
  };

  // Filtrado reactivo por término y categoría
  const filteredSheets = useMemo(() => {
    return allSheets.filter(sheet => {
      // Filtro de categoría
      if (selectedCategory === 'cocteles' && sheet.category !== 'cocteles') return false;
      if (selectedCategory === 'cafeteria' && sheet.category !== 'cafeteria') return false;
      if (selectedCategory === 'gastronomia' && sheet.category !== 'cocina_recetas' && sheet.category !== 'productos') return false;

      // Filtro de búsqueda
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchName = (sheet.name || sheet.title).toLowerCase().includes(term);
      const matchCode = sheet.code.toLowerCase().includes(term);
      const matchGlass = (sheet.glassware || '').toLowerCase().includes(term);
      const matchTech = (sheet.technique || '').toLowerCase().includes(term);
      const matchDiagnosis = (sheet.diagnosis || '').toLowerCase().includes(term);
      const matchIng = sheet.ingredients.some(ing => 
        ing.name.toLowerCase().includes(term) || ing.quantity.toLowerCase().includes(term)
      );

      return matchName || matchCode || matchGlass || matchTech || matchDiagnosis || matchIng;
    });
  }, [allSheets, selectedCategory, searchTerm]);

  // Copiar formato estandarizado
  const handleCopyRecipe = (sheet: TechnicalSheet, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const recipeText = formatTechnicalSheetStandardText(sheet);
    navigator.clipboard.writeText(recipeText);
    setCopiedId(sheet.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  // Ejecutar transformación de receta
  const handleProcessRawRecipe = () => {
    if (!converterInput.trim()) return;
    const result = transformRawRecipeToStandardized(converterInput);
    setConvertedOutput(result.standardizedText);
    setConvertedSheet(result.sheetData);
  };

  // Añadir la receta convertida a la base de datos de la sesión
  const handleAddConvertedToCatalog = () => {
    if (!convertedSheet) return;
    const newSheet: TechnicalSheet = {
      id: `custom-${Date.now()}`,
      code: `FT-OP-${Math.floor(100 + Math.random() * 900)}`,
      hotelId: 'klayman-diamond',
      outletId: 'diamond-bar-terraza',
      outletName: 'Área de Barra & Coctelería',
      title: convertedSheet.name || 'Nueva Ficha',
      name: convertedSheet.name || 'Nueva Ficha',
      category: 'cocteles',
      version: '1.0',
      updatedDate: new Date().toLocaleDateString('es-ES'),
      status: 'Aprobada',
      technique: convertedSheet.technique || 'Preparación estandarizada',
      preparationMethod: convertedSheet.preparationMethod || [],
      glassware: convertedSheet.glassware || 'Vaso / Copa estándar',
      tools: convertedSheet.tools || 'Coctelera, jigger y colador',
      diagnosis: convertedSheet.diagnosis || 'Perfil equilibrado y formulación técnica estándar.',
      ingredients: convertedSheet.ingredients || [],
      allergens: convertedSheet.allergens || ['Sin alérgenos declarables'],
      keyQualityPoints: [
        'Respetar rigurosamente la formulación técnica.',
        'Verificar temperatura de pase antes del servicio.',
        'Confirmar ausencia de alérgenos cruzados.'
      ]
    };

    setCustomSheets(prev => [newSheet, ...prev]);
    setIsConverterOpen(false);
    setConverterInput('');
    setConvertedOutput(null);
    setConvertedSheet(null);
  };

  const handleCreateManualSheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const ingredientsList = newIngredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const match = line.match(/^([0-9.,]+(?:\s*[a-zA-Z.]+)?)\s+(.+)$/);
        if (match) {
          return { quantity: match[1], name: match[2] };
        }
        return { quantity: 'Al gusto', name: line };
      });

    const methodSteps = newMethodText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const allergensList = newAllergensText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    const createdSheet: TechnicalSheet = {
      id: `ft-${Date.now()}`,
      code: newCode.trim() || `FT-${String(allSheets.length + 1).padStart(3, '0')}`,
      hotelId: 'klayman-diamond',
      outletId: 'diamond-bar-terraza',
      outletName: 'Área de Barra & Coctelería',
      title: newName.trim(),
      name: newName.trim(),
      category: newCategory,
      version: '1.0',
      updatedDate: new Date().toLocaleDateString('es-ES'),
      status: 'Aprobada',
      technique: newTechnique.trim() || 'Elaboración técnica según procedimiento',
      preparationMethod: methodSteps.length > 0 ? methodSteps : ['Añadimos los ingredientes según ficha y servimos con temperatura óptima.'],
      glassware: newGlassware.trim() || 'Cristalería técnica especificada',
      tools: 'Útiles estandarizados de estación',
      diagnosis: newDiagnosis.trim() || 'Perfil organoléptico balanceado y viabilidad operativa certificada.',
      ingredients: ingredientsList.length > 0 ? ingredientsList : [{ quantity: '1 un.', name: 'Ingrediente base' }],
      allergens: allergensList.length > 0 ? allergensList : ['Sin alérgenos declarables'],
      keyQualityPoints: [
        'Respetar medidas exactas de formulación.',
        'Comprobar cristalería limpia y fría.',
        'Cumplir tiempos de pase y control APPCC.'
      ]
    };

    setCustomSheets(prev => [createdSheet, ...prev]);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewGlassware('');
    setNewTechnique('');
    setNewDiagnosis('');
    setNewIngredientsText('');
    setNewMethodText('');
  };

  return (
    <div className={`space-y-6 font-sans text-[#2C3E50] ${embeddedInTerrace ? 'pt-2' : ''}`}>
      {/* CABECERA PRINCIPAL DEL MÓDULO DE FICHAS TÉCNICAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-[#C5A880]" />
            <span className="text-xs font-mono text-[#C5A880] uppercase font-bold tracking-wider">
              DIRECCIÓN DE OPERACIONES F&B · ESTÁNDARES TÉCNICOS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mt-1">
            Fichas Técnicas Estandarizadas
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#2C3E50]/70 font-mono mt-1 flex-wrap">
            <span>{allSheets.length} fichas homologadas</span>
            <span aria-hidden="true">·</span>
            <span>Estructura normalizada para TPV y manuales</span>
            <span aria-hidden="true">·</span>
            <span>Nomenclatura técnica sin marcas comerciales</span>
          </div>
        </div>

        {/* Acciones: Transformador de Recetas + Crear + Opciones */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Ficha Técnica</span>
          </button>

          <button
            onClick={() => setIsConverterOpen(!isConverterOpen)}
            className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] hover:border-[#C5A880] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{isConverterOpen ? 'Cerrar Asistente' : 'Asistente: Estandarizar'}</span>
          </button>

          {allSheets.length === 0 ? (
            <button
              onClick={handleLoadDemoSamples}
              className="px-3 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] transition-colors text-xs font-mono flex items-center gap-1"
              title="Cargar recetas de demostración"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Cargar Demo</span>
            </button>
          ) : (
            <button
              onClick={handleClearAllCustomSheets}
              className="p-2 rounded-xl bg-transparent hover:bg-rose-50 text-[#2C3E50]/70 hover:text-rose-600 border border-[#E2E8F0] transition-colors text-xs font-mono"
              title="Vaciar fichas técnicas registradas"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center p-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-mono">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#1A2530] text-white font-bold' 
                  : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              Vista Fichas
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'compact' 
                  ? 'bg-[#1A2530] text-white font-bold' 
                  : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              Modo Rápido
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Imprimir fichas técnicas"
            className="p-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <Printer className="w-4 h-4 text-[#C5A880]" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* PANEL ASISTENTE / TRANSFORMADOR DE RECETAS A TEXTO ESTANDARIZADO */}
      {isConverterOpen && (
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#C5A880] text-xs font-mono font-bold uppercase">
                <Wand2 className="w-4 h-4" />
                <span>ASISTENTE DE TRANSFORMACIÓN A FICHA TÉCNICA OFICIAL</span>
              </div>
              <p className="text-xs text-[#2C3E50]/80 max-w-2xl leading-relaxed">
                Pega cualquier receta, idea o listado informal de ingredientes. El sistema normaliza las medidas exactas, sustituye marcas por nomenclatura técnica estándar (ej. "Ron blanco"), redacta los pasos en 1ª persona del plural y genera el diagnóstico técnico.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#1A2530] bg-[#C5A880]/20 px-2 py-1 rounded border border-[#C5A880]/40 shrink-0 font-bold">
              TPV / Manual Ready
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input área */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#2C3E50] font-semibold block">
                Pega tu receta o ingredientes aquí:
              </label>
              <textarea
                value={converterInput}
                onChange={(e) => setConverterInput(e.target.value)}
                placeholder={`Ejemplo:
Daiquiri de autor
6 cl Bacardí carta blanca
3 cl zumo de lima recién exprimido
2 cl jarabe de azúcar
Agitar bien con hielo y colar en copa fría con rodaja de lima`}
                rows={7}
                className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] text-xs font-mono placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setConverterInput(`Daiquiri Clásico
6 cl Bacardí Carta Blanca
3 cl zumo fresco de lima
2 cl jarabe de azúcar de caña
Agitar en coctelera durante 12 segundos con hielo macizo
Doble colar en copa Coupé bien fría
Decorar con media rueda de lima`);
                  }}
                  className="text-[11px] font-mono text-[#2C3E50]/70 hover:text-[#C5A880] underline"
                >
                  Cargar ejemplo de prueba
                </button>
                <button
                  type="button"
                  onClick={handleProcessRawRecipe}
                  disabled={!converterInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] disabled:opacity-50 text-[#1A2530] font-bold text-xs font-mono transition-colors"
                >
                  Transformar a Formato Oficial →
                </button>
              </div>
            </div>

            {/* Output área */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#2C3E50] font-bold block">
                  Resultado Base Estandarizado:
                </label>
                {convertedOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(convertedOutput);
                        setConverterCopied(true);
                        setTimeout(() => setConverterCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] hover:border-[#C5A880]"
                    >
                      {converterCopied ? <Check className="w-3 h-3 text-[#C5A880]" /> : <Copy className="w-3 h-3 text-[#2C3E50]" />}
                      <span>{converterCopied ? '¡Copiado!' : 'Copiar Texto'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddConvertedToCatalog}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#C5A880] text-[#1A2530] font-bold hover:bg-[#b5976f]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir a Catálogo</span>
                    </button>
                  </div>
                )}
              </div>
              <pre className="p-3 sm:p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono text-xs whitespace-pre-wrap h-44 overflow-y-auto leading-relaxed select-all">
                {convertedOutput || '// El texto base estandarizado se generará aquí estrictamente con la estructura:\n// [NOMBRE]\n//  * FORMULACIÓN\n//  * FLUJO DE ELABORACIÓN\n//  * CRISTALERÍA Y ÚTILES\n//  * DIAGNÓSTICO\n//  * ALÉRGENOS'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* BARRA DE FILTROS & BÚSQUEDA */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Barra de Búsqueda Rápida */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por formulación, técnica, cristalería, diagnóstico..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#2C3E50] text-xs font-mono placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C3E50]/50 hover:text-[#2C3E50] text-xs font-mono"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Segmented Controls para Categorías F&B */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono overflow-x-auto max-w-full">
            {[
              { id: 'todos', label: 'Todas las Fichas', count: allSheets.length },
              { id: 'cocteles', label: 'Coctelería', count: allSheets.filter(s => s.category === 'cocteles').length },
              { id: 'cafeteria', label: 'Cafetería & Bebidas', count: allSheets.filter(s => s.category === 'cafeteria').length },
              { id: 'gastronomia', label: 'Cocina & Gastro', count: allSheets.filter(s => s.category === 'cocina_recetas' || s.category === 'productos').length }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A2530] text-white font-bold'
                    : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  selectedCategory === cat.id
                    ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                    : 'bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTADO DE FICHAS TÉCNICAS */}
      {allSheets.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
          <div className="w-14 h-14 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center text-[#C5A880] mx-auto">
            <Wine className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-[#2C3E50]">
              Catálogo de Fichas Técnicas Vacío
            </h3>
            <p className="text-xs text-[#2C3E50]/70 max-w-md mx-auto leading-relaxed">
              La base de datos está limpia para que su empresa registre sus propias recetas y cócteles estandarizados. Puede crear una ficha directamente, convertir una receta con el asistente o cargar muestras de prueba.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Crear Nueva Ficha</span>
            </button>
            <button
              onClick={() => setIsConverterOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] font-mono text-xs transition-colors flex items-center gap-1.5 border border-[#E2E8F0]"
            >
              <Wand2 className="w-4 h-4 text-[#C5A880]" />
              <span>Asistente de Estandarización</span>
            </button>
            <button
              onClick={handleLoadDemoSamples}
              className="px-3.5 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] font-mono text-xs transition-colors border border-[#E2E8F0]"
            >
              Cargar Muestra Demo
            </button>
          </div>
        </div>
      ) : filteredSheets.length === 0 ? (
        <div className="p-8 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-2">
          <Wine className="w-8 h-8 text-[#C5A880] mx-auto" />
          <p className="text-[#2C3E50] text-sm font-bold">No se encontraron fichas técnicas coincidentes</p>
          <p className="text-[#2C3E50]/60 text-xs font-mono">Modifica los filtros de búsqueda o categoría.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSheets.map(sheet => {
            const isCopied = copiedId === sheet.id;

            return (
              <div
                key={sheet.id}
                onClick={() => onOpenModal && onOpenModal(sheet)}
                className="group relative p-5 rounded-xl bg-white hover:border-[#C5A880] border border-[#E2E8F0] transition-all cursor-pointer space-y-4"
              >
                {/* Cabecera de la ficha */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                        {sheet.code}
                      </span>
                      <span className="text-[10px] font-mono text-[#2C3E50]/60">
                        v{sheet.version}
                      </span>
                      <span className="text-[10px] font-mono text-[#2C3E50]/50">
                        {sheet.outletName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2C3E50] group-hover:text-[#1A2530] transition-colors">
                      {sheet.name || sheet.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleCopyRecipe(sheet, e)}
                      title="Copiar Texto Base Estandarizado"
                      className={`p-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1 border border-[#E2E8F0] ${
                        isCopied 
                          ? 'bg-[#C5A880] text-[#1A2530] font-bold border-[#C5A880]' 
                          : 'bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50]'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#C5A880]" />}
                      <span className="hidden sm:inline">{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* DIAGNÓSTICO */}
                {sheet.diagnosis && (
                  <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs">
                    <span className="text-[10px] font-mono text-[#C5A880] font-bold uppercase block mb-0.5">
                      Diagnóstico:
                    </span>
                    <p className="text-[#2C3E50]/80 leading-snug line-clamp-2">
                      {sheet.diagnosis}
                    </p>
                  </div>
                )}

                {/* FORMULACIÓN (Medida exacta + nomenclatura) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#2C3E50]/70 font-bold block">
                    Formulación ({sheet.ingredients.length} componentes):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sheet.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]"
                      >
                        <strong className="text-[#1A2530] mr-1">{ing.quantity}</strong>
                        {ing.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CRISTALERÍA & MÉTODO */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono text-[#2C3E50]/70">
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <GlassWater className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                    <span className="truncate">{sheet.glassware || 'Cristalería estándar'}</span>
                  </div>
                  <div className="text-[#C5A880] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>Ver Detalle</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA COMPACTA PARA SERVICIO RÁPIDO */
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden divide-y divide-[#E2E8F0]">
          {filteredSheets.map(sheet => {
            const isCopied = copiedId === sheet.id;

            return (
              <div
                key={sheet.id}
                onClick={() => onOpenModal && onOpenModal(sheet)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F9FA] cursor-pointer transition-colors"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] font-bold">
                      {sheet.code}
                    </span>
                    <span className="font-bold text-[#2C3E50] text-sm truncate">
                      {sheet.name || sheet.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#2C3E50]/70 font-mono truncate">
                    {sheet.ingredients.map(i => `${i.quantity} ${i.name}`).join(' · ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-[#2C3E50]/60 hidden md:inline">
                    {sheet.glassware}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyRecipe(sheet, e)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1 border border-[#E2E8F0] ${
                      isCopied 
                        ? 'bg-[#C5A880] text-[#1A2530] font-bold border-[#C5A880]' 
                        : 'bg-transparent hover:bg-white text-[#2C3E50]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-[#C5A880]" />}
                    <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE CREACIÓN MANUAL DE FICHA TÉCNICA */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-xl w-full max-w-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#C5A880] uppercase font-bold">
                  ESTÁNDAR OPERATIVO F&B
                </span>
                <h3 className="text-xl font-bold text-[#2C3E50]">
                  Nueva Ficha Técnica Homologada
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSheet} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Código Ficha:</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="FT-COC-001"
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Nombre del Cóctel o Plato:</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej. Mojito Clásico de Autor"
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Categoría:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="cocteles">Coctelería</option>
                    <option value="cafeteria">Cafetería & Bebidas</option>
                    <option value="cocina_recetas">Cocina & Gastro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Cristalería / Menaje:</label>
                  <input
                    type="text"
                    value={newGlassware}
                    onChange={(e) => setNewGlassware(e.target.value)}
                    placeholder="Ej. Vaso Highball (35 cl)"
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Técnica:</label>
                  <input
                    type="text"
                    value={newTechnique}
                    onChange={(e) => setNewTechnique(e.target.value)}
                    placeholder="Ej. Directo en vaso / Agitado"
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#2C3E50] font-semibold block">
                  Formulación (Uno por línea: cantidad + ingrediente):
                </label>
                <textarea
                  rows={4}
                  value={newIngredientsText}
                  onChange={(e) => setNewIngredientsText(e.target.value)}
                  placeholder={`6 cl Ron blanco\n3 cl Zumo fresco de lima\n2 cl Jarabe simple de azúcar\n8 un. Hojas de hierbabuena fresca\n6 cl Soda o agua con gas`}
                  className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#2C3E50] font-semibold block">
                  Flujo de Elaboración (Pasos con verbos en 1ª persona plural):
                </label>
                <textarea
                  rows={4}
                  value={newMethodText}
                  onChange={(e) => setNewMethodText(e.target.value)}
                  placeholder={`Añadimos la hierbabuena y el zumo de lima en el vaso.\nMajamos suavemente con maza técnica sin romper las hojas.\nAñadimos el ron blanco y hielo picado.\nRemovemos con cuchara imperial y completamos con soda.`}
                  className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Diagnóstico Organoléptico:</label>
                  <input
                    type="text"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="Ej. Perfil cítrico, refrescante y mentolado con final persistente."
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#2C3E50] font-semibold block">Alérgenos (separados por coma):</label>
                  <input
                    type="text"
                    value={newAllergensText}
                    onChange={(e) => setNewAllergensText(e.target.value)}
                    placeholder="Sin alérgenos declarables o Sulfitos, Lácteos..."
                    className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold transition-colors"
                >
                  Guardar Ficha Técnica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
