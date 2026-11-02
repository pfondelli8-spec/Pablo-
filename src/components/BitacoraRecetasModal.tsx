import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  BookOpen,
  Printer,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
  ChevronDown,
  Layers,
  Thermometer,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  X,
  Check,
  Copy,
  Clock,
  Sparkles,
  FolderTree,
  Calendar,
  ChefHat
} from 'lucide-react';
import {
  RecipeTechnicalSheet,
  RecipeCategory,
  MenuWheelType,
  OFFICIAL_ALLERGENS_LIST,
  RECIPE_CATEGORIES_CONFIG,
  bitacoraRecetasStorage
} from '../data/bitacoraRecetasData';

interface BitacoraRecetasModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  userRole?: 'admin' | 'jefe' | 'empleado';
}

type ActiveViewSection = 
  | 'rueda_1' 
  | 'rueda_2' 
  | 'todas_recetas' 
  | 'categoria_filter' 
  | 'appcc_global' 
  | 'alergenos_global' 
  | 'escandallos_global';

export const BitacoraRecetasModal: React.FC<BitacoraRecetasModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  userRole = 'admin'
}) => {
  // Recetas reactivas aisladas por hotel
  const [recipes, setRecipes] = useState<RecipeTechnicalSheet[]>(() => {
    return bitacoraRecetasStorage.getRecipesForHotel(hotelId);
  });

  // Sección activa en el árbol
  const [activeSection, setActiveSection] = useState<ActiveViewSection>('rueda_1');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedPaxScale, setSelectedPaxScale] = useState<'1' | '100' | '300' | '800'>('1');

  // Estado para crear / editar ficha técnica
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Partial<RecipeTechnicalSheet> | null>(null);

  // Copiado al portapapeles
  const [copiedText, setCopiedText] = useState(false);

  // Control del árbol colapsable
  const [isMenusTreeOpen, setIsMenusTreeOpen] = useState(true);
  const [isRecetasTreeOpen, setIsRecetasTreeOpen] = useState(true);

  if (!isOpen) return null;

  // Filtrado de recetas
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => {
      // Filtro de sección
      if (activeSection === 'rueda_1' && r.menuWheel !== 'rueda_1') return false;
      if (activeSection === 'rueda_2' && r.menuWheel !== 'rueda_2') return false;
      if (activeSection === 'categoria_filter' && selectedCategory && r.category !== selectedCategory) return false;

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchCat = r.categoryLabel.toLowerCase().includes(q);
        const matchIng = r.ingredients.some(i => i.name.toLowerCase().includes(q));
        const matchAllergen = r.allergens.some(a => a.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchIng && !matchAllergen) return false;
      }

      return true;
    });
  }, [recipes, activeSection, selectedCategory, searchQuery]);

  // Receta actualmente seleccionada para visualizar
  const activeRecipe = useMemo(() => {
    if (selectedRecipeId) {
      return recipes.find(r => r.id === selectedRecipeId) || filteredRecipes[0] || recipes[0];
    }
    return filteredRecipes[0] || recipes[0];
  }, [recipes, selectedRecipeId, filteredRecipes]);

  // Manejar impresión de ficha a 1 página A4
  const handlePrintSheet = () => {
    window.print();
  };

  // Abrir modal de creación
  const handleOpenCreateRecipe = () => {
    const newSheet: Partial<RecipeTechnicalSheet> = {
      id: `rec-custom-${Date.now()}`,
      code: `FT-CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'carnes',
      categoryLabel: 'Carnes & Aves',
      menuWheel: activeSection === 'rueda_2' ? 'rueda_2' : 'rueda_1',
      day: 1,
      service: 'Almuerzo',
      portionSize: '200 g',
      yieldInfo: '1 ración',
      photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      description: '',
      ingredients: [
        { name: 'Ingrediente principal', qtyPerPortion: 150, unit: 'g' },
        { name: 'Aceite de oliva virgen extra', qtyPerPortion: 10, unit: 'ml' },
        { name: 'Sal marina', qtyPerPortion: 2, unit: 'g' }
      ],
      production: {
        pax100: '100 raciones calculadas',
        pax300: '300 raciones calculadas',
        pax800: '800 raciones calculadas'
      },
      elaborationSteps: [
        'Mise en place y pesado higiénico de ingredientes.',
        'Cocción y elaboración con control térmico.',
        'Emplatado y mantenimiento a temperatura regulada.'
      ],
      appcc: {
        criticalLimit: 'Temperatura interior >= 75°C. Mantenimiento >65°C.',
        stage: 'Cocción y pase',
        correctiveAction: 'Comprobar con sonda y prolongar cocción si es necesario.'
      },
      allergens: [],
      costPerPortion: 1.20,
      cost100Pax: 120.00,
      cost300Pax: 360.00,
      cost800Pax: 960.00,
      suggestedSalePrice: 8.50,
      chefObservations: 'Revisión y firma del Chef Ejecutivo.'
    };
    setEditingRecipe(newSheet);
    setIsEditModalOpen(true);
  };

  const handleOpenEditRecipe = (recipe: RecipeTechnicalSheet) => {
    setEditingRecipe({ ...recipe });
    setIsEditModalOpen(true);
  };

  const handleSaveRecipe = () => {
    if (!editingRecipe || !editingRecipe.name) return;
    const fullRecipe = editingRecipe as RecipeTechnicalSheet;
    const updated = bitacoraRecetasStorage.updateRecipeInHotel(hotelId, fullRecipe);
    setRecipes(updated);
    setSelectedRecipeId(fullRecipe.id);
    setIsEditModalOpen(false);
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta ficha técnica de la bitácora?')) {
      const updated = bitacoraRecetasStorage.deleteRecipeFromHotel(hotelId, id);
      setRecipes(updated);
      if (selectedRecipeId === id) {
        setSelectedRecipeId(updated[0]?.id || null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      {/* Estilos para impresión A4 exacta a una sola página */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-technical-sheet, #printable-technical-sheet * {
            visibility: visible !important;
          }
          #printable-technical-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* CABECERA PRINCIPAL */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">BITÁCORA DE RECETAS & MENÚS</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {hotelName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Aislamiento Activo
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Fichas Técnicas Normalizadas a 1 Página para Archivador, APPCC y Cocina Operativa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(userRole === 'admin' || userRole === 'jefe') && (
              <button
                onClick={handleOpenCreateRecipe}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Ficha Técnica</span>
              </button>
            )}

            <button
              onClick={handlePrintSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENEDOR CENTRAL (ÁRBOL IZQUIERDO + LISTA PLATOS + FICHA TÉCNICA DERECHA) */}
        <div className="flex-1 flex overflow-hidden">
          {/* 1. ÁRBOL JERÁRQUICO LATERAL IZQUIERDO */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto shrink-0 space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Estructura Bitácora
            </div>

            {/* MENÚS */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsMenusTreeOpen(!isMenusTreeOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  MENÚS CÍCLICOS
                </span>
                {isMenusTreeOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isMenusTreeOpen && (
                <div className="pl-3 space-y-0.5 text-xs">
                  <button
                    onClick={() => {
                      setActiveSection('rueda_1');
                      setSelectedCategory(null);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
                      activeSection === 'rueda_1'
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>├── RUEDA 1 (Día 1 a 14)</span>
                    <span className="text-[10px] opacity-75">12 platos</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveSection('rueda_2');
                      setSelectedCategory(null);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
                      activeSection === 'rueda_2'
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>└── RUEDA 2 (Rotación)</span>
                    <span className="text-[10px] opacity-75">4 platos</span>
                  </button>
                </div>
              )}
            </div>

            {/* RECETAS POR CATEGORÍA */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsRecetasTreeOpen(!isRecetasTreeOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                  RECETAS POR FAMILIA
                </span>
                {isRecetasTreeOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isRecetasTreeOpen && (
                <div className="pl-3 space-y-0.5 text-xs">
                  {RECIPE_CATEGORIES_CONFIG.map(cat => {
                    const isSelected = activeSection === 'categoria_filter' && selectedCategory === cat.key;
                    const count = recipes.filter(r => r.category === cat.key).length;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setActiveSection('categoria_filter');
                          setSelectedCategory(cat.key);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
                          isSelected
                            ? 'bg-amber-600 text-white font-semibold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-200/50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{cat.icon}</span>
                          <span className="uppercase text-[11px] font-medium">{cat.label}</span>
                        </span>
                        <span className="text-[10px] opacity-75">{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MÓDULOS TRANSVERSALES */}
            <div className="pt-2 border-t border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Control & Seguridad
              </div>

              <button
                onClick={() => {
                  setActiveSection('appcc_global');
                  setSelectedCategory(null);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'appcc_global'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>PUNTOS CRÍTICOS APPCC</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('alergenos_global');
                  setSelectedCategory(null);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'alergenos_global'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>MATRIZ 14 ALÉRGENOS</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('escandallos_global');
                  setSelectedCategory(null);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeSection === 'escandallos_global'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>ESCANDALLOS & RENDIMIENTOS</span>
              </button>
            </div>
          </div>

          {/* 2. LISTA DE PLATOS (COLUMNA INTERMEDIA) */}
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
            {/* Buscador */}
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar plato o ingrediente..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Título de la lista */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Platos disponibles ({filteredRecipes.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {activeSection === 'rueda_1' ? 'Rueda 1' : activeSection === 'rueda_2' ? 'Rueda 2' : 'Categoría'}
              </span>
            </div>

            {/* Listado */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredRecipes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No se encontraron recetas con ese criterio
                </div>
              ) : (
                filteredRecipes.map(recipe => {
                  const isSelected = activeRecipe && activeRecipe.id === recipe.id;
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => setSelectedRecipeId(recipe.id)}
                      className={`p-3 cursor-pointer transition-colors relative flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={recipe.photoUrl}
                        alt={recipe.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{recipe.code}</span>
                          <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {recipe.categoryLabel}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{recipe.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span>{recipe.service}</span>
                          <span>•</span>
                          <span>{recipe.portionSize}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. VISOR DE FICHA TÉCNICA NORMALIZADA A 1 PÁGINA (A4 PRINT READY) */}
          <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto flex justify-center">
            {activeRecipe ? (
              <div
                id="printable-technical-sheet"
                className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-8 flex flex-col justify-between text-slate-900"
              >
                {/* CABECERA DE LA FICHA TÉCNICA */}
                <div>
                  <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                          {activeRecipe.menuWheel === 'rueda_1' ? 'RUEDA 1 · DÍA 1' : 'RUEDA 2 · ROTACIÓN'}
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs font-mono font-bold text-indigo-700">{activeRecipe.code}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-xs font-semibold text-emerald-700">{hotelName}</span>
                      </div>
                      <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
                        FICHA TÉCNICA: {activeRecipe.name}
                      </h1>
                    </div>

                    <div className="text-right flex items-center gap-2 no-print">
                      {/* Selector de escalado en pantalla */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                        <span className="px-2 text-slate-500 font-semibold text-[11px]">Escala:</span>
                        {(['1', '100', '300', '800'] as const).map(scale => (
                          <button
                            key={scale}
                            onClick={() => setSelectedPaxScale(scale)}
                            className={`px-2 py-0.5 rounded font-bold transition-colors ${
                              selectedPaxScale === scale
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {scale === '1' ? '1 pax' : `${scale} pax`}
                          </button>
                        ))}
                      </div>

                      {(userRole === 'admin' || userRole === 'jefe') && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditRecipe(activeRecipe)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                            title="Editar ficha"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleDeleteRecipe(activeRecipe.id)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
                              title="Eliminar ficha"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BLOQUE SUPERIOR: FOTOGRAFÍA + DATOS GENERALES */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    {/* Fotografía de alta fidelidad */}
                    <div className="col-span-4">
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm aspect-4/3">
                        <img
                          src={activeRecipe.photoUrl}
                          alt={activeRecipe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {activeRecipe.portionSize}
                        </div>
                      </div>
                    </div>

                    {/* Tabla de Datos Generales */}
                    <div className="col-span-8">
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold uppercase text-[11px]">
                            <th colSpan={2} className="p-1.5 text-left">DATOS GENERALES DEL PLATO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50 w-1/3 text-slate-700">Familia / Partida:</td>
                            <td className="p-1.5 text-slate-800">{activeRecipe.categoryLabel}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50 text-slate-700">Servicio:</td>
                            <td className="p-1.5 text-slate-800">{activeRecipe.service}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50 text-slate-700">Gramaje Ración:</td>
                            <td className="p-1.5 font-bold text-indigo-700">{activeRecipe.portionSize}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50 text-slate-700">Rendimiento:</td>
                            <td className="p-1.5 text-slate-800">{activeRecipe.yieldInfo}</td>
                          </tr>
                          <tr>
                            <td className="p-1.5 font-bold bg-slate-50 text-slate-700">Descripción:</td>
                            <td className="p-1.5 text-slate-600 italic text-[11px]">{activeRecipe.description}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BLOQUE MEDIO: INGREDIENTES POR RACIÓN & PRODUCCIÓN ESCALADA */}
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    {/* Ingredientes por ración (con multiplicador interactivo) */}
                    <div className="col-span-6">
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-white font-bold uppercase text-[10px]">
                            <th className="p-1.5 text-left">Ingrediente</th>
                            <th className="p-1.5 text-right">
                              {selectedPaxScale === '1' ? 'Cant. por Ración' : `Cant. ${selectedPaxScale} pax`}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {activeRecipe.ingredients.map((ing, idx) => {
                            const scaleMult = parseInt(selectedPaxScale, 10);
                            let displayQty: string;
                            if (scaleMult === 1) {
                              displayQty = `${ing.qtyPerPortion} ${ing.unit}`;
                            } else {
                              const total = ing.qtyPerPortion * scaleMult;
                              if (ing.unit === 'g' && total >= 1000) {
                                displayQty = `${(total / 1000).toFixed(1)} kg`;
                              } else if (ing.unit === 'ml' && total >= 1000) {
                                displayQty = `${(total / 1000).toFixed(1)} L`;
                              } else {
                                displayQty = `${total} ${ing.unit}`;
                              }
                            }

                            return (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="p-1.5 font-medium text-slate-800">
                                  {ing.name}
                                  {ing.allergen && (
                                    <span className="ml-1 text-[10px] text-amber-700 font-semibold">
                                      ({ing.allergen})
                                    </span>
                                  )}
                                </td>
                                <td className="p-1.5 text-right font-mono font-bold text-slate-900">
                                  {displayQty}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Tabla de Producción Escalada Oficial (100 pax, 300 pax, 800 pax) */}
                    <div className="col-span-6 space-y-3">
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-indigo-900 text-white font-bold uppercase text-[10px]">
                            <th className="p-1.5 text-left w-24">Producción</th>
                            <th className="p-1.5 text-left">Cantidad Total & Referencia de Partida</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr className={selectedPaxScale === '100' ? 'bg-indigo-50 font-bold' : ''}>
                            <td className="p-1.5 font-bold text-indigo-900 bg-slate-50">100 pax</td>
                            <td className="p-1.5 text-slate-800 font-mono text-[11px]">{activeRecipe.production.pax100}</td>
                          </tr>
                          <tr className={selectedPaxScale === '300' ? 'bg-indigo-50 font-bold' : ''}>
                            <td className="p-1.5 font-bold text-indigo-900 bg-slate-50">300 pax</td>
                            <td className="p-1.5 text-slate-800 font-mono text-[11px]">{activeRecipe.production.pax300}</td>
                          </tr>
                          <tr className={selectedPaxScale === '800' ? 'bg-indigo-50 font-bold' : ''}>
                            <td className="p-1.5 font-bold text-indigo-900 bg-slate-50">800 pax</td>
                            <td className="p-1.5 text-slate-800 font-mono text-[11px]">{activeRecipe.production.pax800}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Escandallo y Costes Teóricos */}
                      <table className="w-full border-collapse border border-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-white font-bold uppercase text-[10px]">
                            <th className="p-1 text-center">Coste / Ración</th>
                            <th className="p-1 text-center">Coste 100 pax</th>
                            <th className="p-1 text-center">Coste 300 pax</th>
                            <th className="p-1 text-center">PVP Equivalente</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-center font-mono font-bold bg-white">
                            <td className="p-1.5 text-emerald-700">{activeRecipe.costPerPortion.toFixed(2)} €</td>
                            <td className="p-1.5 text-slate-800">{activeRecipe.cost100Pax.toFixed(2)} €</td>
                            <td className="p-1.5 text-slate-800">{activeRecipe.cost300Pax.toFixed(2)} €</td>
                            <td className="p-1.5 text-indigo-700">{activeRecipe.suggestedSalePrice.toFixed(2)} €</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* BLOQUE ELABORACIÓN PASO A PASO */}
                  <div className="mb-4">
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                          <th className="p-1.5 text-left">PROCESO DE ELABORACIÓN (MÉTODO OPERATIVO)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activeRecipe.elaborationSteps.map((step, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-1.5 text-slate-800 flex items-start gap-2">
                              <span className="font-bold text-indigo-700 font-mono shrink-0">{idx + 1}.</span>
                              <span>{step}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* BLOQUE APPCC Y ALÉRGENOS OBLIGATORIOS */}
                  <div className="grid grid-cols-12 gap-4 mb-3">
                    {/* APPCC */}
                    <div className="col-span-7">
                      <table className="w-full border-collapse border border-rose-300 text-xs bg-rose-50/30">
                        <thead>
                          <tr className="bg-rose-900 text-white font-bold uppercase text-[10px]">
                            <th className="p-1.5 text-left flex items-center gap-1.5">
                              <Thermometer className="w-3.5 h-3.5" />
                              PUNTOS DE CONTROL CRÍTICO (APPCC)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 space-y-1">
                              <div className="font-bold text-rose-950 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                {activeRecipe.appcc.criticalLimit}
                              </div>
                              <div className="text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">Etapa:</span> {activeRecipe.appcc.stage}
                              </div>
                              <div className="text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">Acción correctora:</span> {activeRecipe.appcc.correctiveAction}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* ALÉRGENOS */}
                    <div className="col-span-5">
                      <table className="w-full border-collapse border border-amber-300 text-xs bg-amber-50/30">
                        <thead>
                          <tr className="bg-amber-900 text-white font-bold uppercase text-[10px]">
                            <th className="p-1.5 text-left">ALÉRGENOS DECLARABLES (UE 1169/2011)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2">
                              {activeRecipe.allergens.length === 0 ? (
                                <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                                  <ShieldCheck className="w-4 h-4" />
                                  <span>Ninguno declarable</span>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {activeRecipe.allergens.map(al => (
                                    <span
                                      key={al}
                                      className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 border border-amber-300 text-amber-900"
                                    >
                                      ⚠️ {al}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* PIE DE PÁGINA: OBSERVACIONES CHEF Y FIRMA */}
                <div className="pt-2 border-t-2 border-slate-900 flex items-center justify-between text-xs">
                  <div className="w-2/3">
                    <span className="font-bold uppercase text-[10px] text-slate-500">Observaciones Chef: </span>
                    <span className="text-slate-700 italic text-[11px]">{activeRecipe.chefObservations}</span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>PROA HOSPITALITY SUITE · MOTOR RECETAS</div>
                    <div>Archivador F&B · Rev. 2026/10</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* MODAL PARA CREAR / EDITAR FICHA TÉCNICA */}
      {isEditModalOpen && editingRecipe && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingRecipe.name ? `Editar Ficha: ${editingRecipe.name}` : 'Crear Nueva Ficha Técnica'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre del Plato *</label>
                  <input
                    type="text"
                    value={editingRecipe.name || ''}
                    onChange={e => setEditingRecipe({ ...editingRecipe, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="Ej. Salmón a la Plancha"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código Ficha</label>
                  <input
                    type="text"
                    value={editingRecipe.code || ''}
                    onChange={e => setEditingRecipe({ ...editingRecipe, code: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Familia / Categoría</label>
                  <select
                    value={editingRecipe.category || 'carnes'}
                    onChange={e => {
                      const cat = e.target.value as RecipeCategory;
                      const cfg = RECIPE_CATEGORIES_CONFIG.find(c => c.key === cat);
                      setEditingRecipe({
                        ...editingRecipe,
                        category: cat,
                        categoryLabel: cfg?.label || 'Carnes'
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {RECIPE_CATEGORIES_CONFIG.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rueda de Menú</label>
                  <select
                    value={editingRecipe.menuWheel || 'rueda_1'}
                    onChange={e => setEditingRecipe({ ...editingRecipe, menuWheel: e.target.value as MenuWheelType })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="rueda_1">Rueda 1</option>
                    <option value="rueda_2">Rueda 2</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gramaje Ración</label>
                  <input
                    type="text"
                    value={editingRecipe.portionSize || '200 g'}
                    onChange={e => setEditingRecipe({ ...editingRecipe, portionSize: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Plato</label>
                <textarea
                  rows={2}
                  value={editingRecipe.description || ''}
                  onChange={e => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Resumen culinario..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Coste / Ración (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecipe.costPerPortion || 1.0}
                    onChange={e => {
                      const cost = parseFloat(e.target.value) || 0;
                      setEditingRecipe({
                        ...editingRecipe,
                        costPerPortion: cost,
                        cost100Pax: cost * 100,
                        cost300Pax: cost * 300,
                        cost800Pax: cost * 800
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PVP Equivalente (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingRecipe.suggestedSalePrice || 8.0}
                    onChange={e => setEditingRecipe({ ...editingRecipe, suggestedSalePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Límite Crítico APPCC</label>
                  <input
                    type="text"
                    value={editingRecipe.appcc?.criticalLimit || 'Temperatura interior >= 75°C'}
                    onChange={e => setEditingRecipe({
                      ...editingRecipe,
                      appcc: {
                        criticalLimit: e.target.value,
                        stage: editingRecipe.appcc?.stage || 'Cocción',
                        correctiveAction: editingRecipe.appcc?.correctiveAction || 'Prolongar cocción'
                      }
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones Chef</label>
                <input
                  type="text"
                  value={editingRecipe.chefObservations || ''}
                  onChange={e => setEditingRecipe({ ...editingRecipe, chefObservations: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveRecipe}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
              >
                Guardar Ficha Técnica
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
