import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  Search, 
  Wine, 
  UtensilsCrossed, 
  FileText, 
  Flame, 
  GraduationCap, 
  FolderArchive, 
  ShieldAlert, 
  Layers, 
  ChevronRight, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  GlassWater, 
  Info, 
  BookOpen, 
  Receipt, 
  Users, 
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { 
  HotelEntity, 
  PromotionEntity, 
  TechnicalSheet, 
  HotelMenu, 
  HotelProcedureDoc,
  DocumentIntakeItem,
  TrainingTrack
} from '../types/hotelPortal';
import { 
  KLAYMAN_HOTELS, 
  DIAMOND_PROMOTIONS, 
  TECHNICAL_SHEETS_DATABASE, 
  DIAMOND_MENUS, 
  HOTEL_PROCEDURES_DATABASE,
  DIAMOND_TRAINING_TRACKS,
  INITIAL_DOCUMENT_INTAKE 
} from '../data/hotelPortalData';
import { CocktailDetailModal } from './CocktailDetailModal';
import { PromotionDetailModal } from './PromotionDetailModal';
import { DiamondTechnicalSheetsViewer } from './DiamondTechnicalSheetsViewer';
import { CashRegisterBankView } from './CashRegisterBankView';
import { EmployeeComplianceView } from './EmployeeComplianceView';
import { HRManagementView } from './HRManagementView';
import { formatTechnicalSheetStandardText } from '../utils/technicalSheetFormatter';

interface DiamondDashboardViewProps {
  onBackToSelector: () => void;
  onNavigateToCorporate: () => void;
  onSwitchToOlivina: () => void;
  onOpenGlobalSearchWithQuery?: (q: string) => void;
}

type FBSubModule = 
  | 'fichas_tecnicas'
  | 'cocteleria' 
  | 'cierres_caja'
  | 'personal_requisitos'
  | 'cartas' 
  | 'promociones' 
  | 'procedimientos' 
  | 'formacion' 
  | 'documentacion';

export const DiamondDashboardView: React.FC<DiamondDashboardViewProps> = ({
  onBackToSelector,
  onNavigateToCorporate,
  onSwitchToOlivina,
  onOpenGlobalSearchWithQuery
}) => {
  const unit = KLAYMAN_HOTELS.find(h => h.id === 'klayman-diamond') || KLAYMAN_HOTELS[0];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('food-and-beverage');
  const [activeSubModule, setActiveSubModule] = useState<FBSubModule>('fichas_tecnicas');

  // Filtros internos
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<'cocteles' | 'restaurante' | 'bar' | 'confiteria_snacks'>('cocteles');
  const [promotionFilter, setPromotionFilter] = useState<'todas' | 'ACTIVA' | 'PRÓXIMAMENTE' | 'permanente' | 'temporal'>('todas');
  const [copiedCocktailId, setCopiedCocktailId] = useState<string | null>(null);

  // Modales
  const [activeModalCocktail, setActiveModalCocktail] = useState<TechnicalSheet | null>(null);
  const [activeModalPromotion, setActiveModalPromotion] = useState<PromotionEntity | null>(null);

  // Ingesta de documentos
  const [documentIntake, setDocumentIntake] = useState<DocumentIntakeItem[]>(INITIAL_DOCUMENT_INTAKE);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'ficha_tecnica' | 'carta' | 'promocion' | 'procedimiento'>('ficha_tecnica');
  const [newDocNotes, setNewDocNotes] = useState('');

  const [customSheets] = useState<TechnicalSheet[]>(() => {
    try {
      const saved = localStorage.getItem('fnb_custom_technical_sheets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const unitPromotions = DIAMOND_PROMOTIONS;
  const unitMenus = DIAMOND_MENUS;
  const unitTechSheets = useMemo(() => [...TECHNICAL_SHEETS_DATABASE, ...customSheets], [customSheets]);
  const unitCocktails = useMemo(() => unitTechSheets.filter(f => f.category === 'cocteles'), [unitTechSheets]);
  const unitProcedures = HOTEL_PROCEDURES_DATABASE;
  const unitTraining = DIAMOND_TRAINING_TRACKS;

  const selectedDepartment = unit.departments.find(d => d.id === selectedDepartmentId);

  const handleCopyStandardCocktail = (cocktail: TechnicalSheet, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = formatTechnicalSheetStandardText(cocktail);
    navigator.clipboard.writeText(text);
    setCopiedCocktailId(cocktail.id);
    setTimeout(() => setCopiedCocktailId(null), 2000);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const newDoc: DocumentIntakeItem = {
      id: `doc-in-${Date.now()}`,
      hotelId: unit.id,
      receivedDate: new Date().toLocaleDateString('es-ES'),
      title: newDocTitle.trim(),
      category: newDocCategory,
      suggestedModule: `F&B → ${newDocCategory.replace('_', ' ').toUpperCase()}`,
      status: 'Procesado',
      notes: newDocNotes.trim() || 'Ficha técnica integrada en catálogo oficial.'
    };

    setDocumentIntake([newDoc, ...documentIntake]);
    setNewDocTitle('');
    setNewDocNotes('');
    setShowAddDocModal(false);
  };

  return (
    <div className="space-y-8 py-2 animate-fade-in font-sans text-[#2C3E50]">
      {/* 1. MIGA DE PAN & CABECERA DE LA UNIDAD OPERATIVA */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#2C3E50]/70 flex-wrap">
          <button
            onClick={onBackToSelector}
            className="hover:text-[#C5A880] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>OPERATIONS HUB</span>
          </button>
          <span>/</span>
          <span className="text-[#1A2530] font-bold uppercase">{unit.name}</span>
          <span>/</span>
          <span className="text-[#C5A880] font-semibold uppercase">{selectedDepartment?.name || 'DEPARTAMENTO'}</span>
          {selectedDepartmentId === 'food-and-beverage' && (
            <>
              <span>/</span>
              <span className="text-[#2C3E50] font-mono uppercase">{activeSubModule.replace('_', ' ')}</span>
            </>
          )}
        </div>

        {/* Hero Card de la Unidad */}
        <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#E2E8F0] shadow-none relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                  {unit.code}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-semibold">
                  {unit.categoryLabel || 'Unidad Operativa Principal'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-[#2C3E50] tracking-tight">
                {unit.name}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#2C3E50]/70 font-mono flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  {unit.location}
                </span>
                <span>·</span>
                <span>{unit.tagline}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={() => setSelectedDepartmentId('rrhh')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  selectedDepartmentId === 'rrhh'
                    ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                    : 'bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Módulo RRHH & Cumplimiento</span>
              </button>

              <button
                onClick={() => setSelectedDepartmentId('food-and-beverage')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  selectedDepartmentId === 'food-and-beverage'
                    ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                    : 'bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Operaciones F&B</span>
              </button>

              <button
                onClick={onSwitchToOlivina}
                className="px-3 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono text-[#2C3E50] transition-colors"
              >
                Ir a Unidad Satélite 2 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SELECTOR DE DEPARTAMENTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#2C3E50]/70 font-semibold tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A880]" />
            <span>ESTRUCTURA DEPARTAMENTAL:</span>
          </span>
          <span className="text-[11px] font-mono text-[#2C3E50]/60">
            {unit.departments.length} Departamentos Operativos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {unit.departments.map(dept => {
            const isSelected = selectedDepartmentId === dept.id;
            const isPilot = dept.status === 'activo_piloto';

            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartmentId(dept.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-white border-2 border-[#C5A880]'
                    : 'bg-white border border-[#E2E8F0] hover:border-[#C5A880]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#2C3E50]/50">
                    {dept.code}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#C5A880]' : isPilot ? 'bg-[#1A2530]' : 'bg-[#E2E8F0]'
                  }`} />
                </div>

                <div>
                  <h3 className={`font-bold text-xs ${
                    isSelected ? 'text-[#1A2530]' : 'text-[#2C3E50]'
                  }`}>
                    {dept.name}
                  </h3>
                  <span className={`text-[10px] font-mono block mt-0.5 ${
                    isSelected ? 'text-[#C5A880] font-semibold' : 'text-[#2C3E50]/60'
                  }`}>
                    {isPilot ? 'Operativo' : 'Estructura Configurada'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MÓDULO OPERATIVO DE RRHH */}
      {selectedDepartmentId === 'rrhh' && (
        <HRManagementView
          hotelId={unit.id}
          hotelName={unit.name}
          onNavigateToDepartment={(deptId) => setSelectedDepartmentId(deptId)}
        />
      )}

      {/* 3B. CONDICIONAL: SI ES OTRO DEPARTAMENTO */}
      {selectedDepartmentId !== 'food-and-beverage' && selectedDepartmentId !== 'rrhh' && (
        <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-4 max-w-2xl mx-auto my-8 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#C5A880]">
            <Info className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#C5A880] tracking-wider font-semibold">
              {selectedDepartment?.code} · {selectedDepartment?.name}
            </span>
            <h2 className="text-2xl font-bold text-[#2C3E50]">
              Módulo Departamental Estructurado
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#2C3E50]/80 leading-relaxed font-sans">
            La arquitectura operativa de este departamento está preparada para vincular protocolos, inventarios y manuales técnicos.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSelectedDepartmentId('food-and-beverage')}
              className="px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold font-mono text-xs transition-colors flex items-center gap-2"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Ver Operaciones F&B</span>
            </button>
            <button
              onClick={() => setSelectedDepartmentId('rrhh')}
              className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-bold font-mono text-xs transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#C5A880]" />
              <span>Ver RRHH & Certificaciones</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. MÓDULO OPERATIVO CENTRAL: F&B */}
      {selectedDepartmentId === 'food-and-beverage' && (
        <div className="space-y-6">
          {/* Navegación por los Submódulos de F&B */}
          <div className="p-1.5 rounded-xl bg-white border border-[#E2E8F0] overflow-x-auto">
            <nav className="flex items-center gap-1.5 min-w-max text-xs font-mono">
              {[
                { id: 'fichas_tecnicas', label: 'Fichas Técnicas F&B', icon: FileText, count: unitTechSheets.length, highlight: true },
                { id: 'cocteleria', label: 'Coctelería Estandarizada', icon: Wine, count: unitCocktails.length },
                { id: 'cierres_caja', label: 'Banco de Tickets & Cierres Z', icon: Receipt, badge: 'Arqueos & Control' },
                { id: 'personal_requisitos', label: 'Cumplimiento & Sanidad', icon: Users, badge: 'APPCC & PRL' },
                { id: 'cartas', label: 'Cartas & Menús', icon: BookOpen, count: unitMenus.length },
                { id: 'promociones', label: 'Promociones F&B', icon: Flame, count: unitPromotions.length },
                { id: 'procedimientos', label: 'Manuales Operativos (SOP)', icon: ShieldAlert, count: unitProcedures.length },
                { id: 'formacion', label: 'Formación Técnica', icon: GraduationCap, count: unitTraining.length },
                { id: 'documentacion', label: 'Bandeja Documental', icon: FolderArchive, count: documentIntake.length }
              ].map(sub => {
                const Icon = sub.icon;
                const isActive = activeSubModule === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubModule(sub.id as FBSubModule)}
                    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                        : 'text-[#2C3E50]/80 hover:text-[#1A2530] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1A2530]' : 'text-[#C5A880]'}`} />
                    <span>{sub.label}</span>
                    {sub.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-[#1A2530] text-white' : 'bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]'
                      }`}>
                        {sub.count}
                      </span>
                    )}
                    {sub.badge && (
                      <span className={`hidden xl:inline text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-[#1A2530] text-[#C5A880]' : 'text-[#2C3E50]/60'
                      }`}>
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SUBMÓDULO 1: FICHAS TÉCNICAS (Core) */}
          {activeSubModule === 'fichas_tecnicas' && (
            <div className="space-y-6 animate-fade-in">
              <DiamondTechnicalSheetsViewer 
                embeddedInTerrace={false} 
                onOpenModal={(sheet) => setActiveModalCocktail(sheet)} 
              />
            </div>
          )}

          {/* SUBMÓDULO 2: COCTELERÍA ESTANDARIZADA */}
          {activeSubModule === 'cocteleria' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Wine className="w-5 h-5 text-[#C5A880]" />
                    <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                      DIRECCIÓN TÉCNICA DE BARRA
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Coctelería Internacional Estandarizada
                  </h2>
                  <p className="text-xs text-[#2C3E50]/70 font-mono mt-0.5">
                    Formulación precisa, medidas exactas, verbos en 1ª persona del plural y declaración de alérgenos.
                  </p>
                </div>
              </div>

              {unitCocktails.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-4 max-w-xl mx-auto">
                  <Wine className="w-10 h-10 text-[#C5A880] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#2C3E50]">
                      No hay recetas de coctelería registradas
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70 font-mono">
                      Cree las fichas técnicas de su carta para que se muestren aquí de forma estandarizada.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubModule('fichas_tecnicas')}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors"
                  >
                    Ir al Gestor de Fichas Técnicas →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unitCocktails.map(cocktail => {
                    const isCopied = copiedCocktailId === cocktail.id;

                    return (
                      <div
                        key={cocktail.id}
                        onClick={() => setActiveModalCocktail(cocktail)}
                        className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all cursor-pointer space-y-4 group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] font-bold">
                              {cocktail.code}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyStandardCocktail(cocktail, e)}
                              className="p-1.5 rounded-lg bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] text-xs font-mono flex items-center gap-1"
                              title="Copiar formato estandarizado"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-[#C5A880]" /> : <Copy className="w-3.5 h-3.5 text-[#2C3E50]/70" />}
                              <span className="text-[10px]">{isCopied ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>

                          <h3 className="text-xl font-bold text-[#2C3E50] group-hover:text-[#1A2530] transition-colors">
                            {cocktail.name || cocktail.title}
                          </h3>

                          {cocktail.diagnosis && (
                            <p className="text-xs text-[#2C3E50]/80 leading-relaxed font-sans line-clamp-2">
                              {cocktail.diagnosis}
                            </p>
                          )}
                        </div>

                        {/* Parámetros Operativos Rápidos */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                          <div>
                            <span className="text-[#2C3E50]/60 block">Cristalería:</span>
                            <span className="text-[#2C3E50] font-medium line-clamp-1">{cocktail.glassware}</span>
                          </div>
                          <div>
                            <span className="text-[#2C3E50]/60 block">Técnica:</span>
                            <span className="text-[#2C3E50] font-medium line-clamp-1">{cocktail.technique}</span>
                          </div>
                        </div>

                        {/* Botón de Ficha Completa */}
                        <button
                          onClick={() => setActiveModalCocktail(cocktail)}
                          className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <span>Consultar Ficha Técnica</span>
                          <ChevronRight className="w-4 h-4 text-[#C5A880] group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBMÓDULO 3: CIERRES DE CAJA & TICKETS Z */}
          {activeSubModule === 'cierres_caja' && (
            <CashRegisterBankView
              hotelId={unit.id}
              hotelName={unit.name}
              defaultOutletName="Área de Barra & Coctelería"
            />
          )}

          {/* SUBMÓDULO 4: PERSONAL & REQUISITOS OBLIGATORIOS */}
          {activeSubModule === 'personal_requisitos' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F8F9FA] text-[#C5A880] border border-[#E2E8F0]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#2C3E50] uppercase">
                      Control Sanitario y Cumplimiento de Plantilla
                    </h4>
                    <p className="text-xs text-[#2C3E50]/70">
                      Registro de certificados oficiales (Manipulador de Alimentos, APPCC y PRL) con alertas de caducidad.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDepartmentId('rrhh')}
                  className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Módulo RRHH Integral</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <EmployeeComplianceView
                hotelId={unit.id}
                hotelName={unit.name}
                departmentName="F&B"
              />
            </div>
          )}

          {/* SUBMÓDULO 5: CARTAS & MENÚS */}
          {activeSubModule === 'cartas' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                    DOCUMENTOS OFICIALES DE SERVICIO
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Cartas & Oferta F&B
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono">
                  {[
                    { id: 'cocteles', label: 'Coctelería' },
                    { id: 'restaurante', label: 'Platos & Cocina' },
                    { id: 'bar', label: 'Bebidas' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedMenuCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        selectedMenuCategory === cat.id
                          ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                          : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {unitMenus.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-3 max-w-xl mx-auto">
                  <UtensilsCrossed className="w-10 h-10 text-[#C5A880] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#2C3E50]">
                      No hay cartas configuradas para esta unidad
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70 font-mono">
                      La oferta gastronómica y de coctelería está limpia y lista para estructurar la carta de su empresa.
                    </p>
                  </div>
                </div>
              ) : (
                unitMenus
                  .filter(m => m.category === selectedMenuCategory || selectedMenuCategory === 'cocteles')
                  .map(menu => (
                    <div key={menu.id} className="p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E2E8F0]">
                        <div>
                          <h3 className="text-xl font-bold text-[#2C3E50]">{menu.title}</h3>
                          <p className="text-xs text-[#2C3E50]/70 font-mono mt-0.5">{menu.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-[#C5A880] font-bold block">{menu.servingHours}</span>
                          <span className="text-[10px] font-mono text-[#2C3E50]/60 uppercase">{menu.outletName}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {menu.sections.map(sec => (
                          <div key={sec.id} className="space-y-3">
                            <div className="pb-1 border-b border-[#E2E8F0]">
                              <span className="text-xs font-mono uppercase text-[#C5A880] font-bold">{sec.name}</span>
                              {sec.description && (
                                <p className="text-[11px] text-[#2C3E50]/70">{sec.description}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sec.items.map(item => (
                                <div
                                  key={item.id}
                                  className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-colors flex flex-col justify-between space-y-2 group"
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-bold text-[#2C3E50] text-sm group-hover:text-[#1A2530] transition-colors">
                                        {item.name}
                                      </h4>
                                      <span className="font-mono text-xs text-[#C5A880] font-bold shrink-0">
                                        {item.price.toFixed(2)} €
                                      </span>
                                    </div>
                                    <p className="text-xs text-[#2C3E50]/70 mt-1 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-[11px] font-mono">
                                    {item.allergens.length > 0 ? (
                                      <span className="text-[#2C3E50]/60">
                                        Alérgenos: {item.allergens.join(', ')}
                                      </span>
                                    ) : (
                                      <span className="text-[#2C3E50]/50">Sin alérgenos declarables</span>
                                    )}

                                    {item.technicalSheetId && (
                                      <button
                                        onClick={() => {
                                          const sheet = unitTechSheets.find(t => t.id === item.technicalSheetId);
                                          if (sheet) setActiveModalCocktail(sheet);
                                        }}
                                        className="text-[#C5A880] hover:text-[#b5976f] font-bold inline-flex items-center gap-1"
                                      >
                                        <span>Ver Ficha</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {/* SUBMÓDULO 6: PROMOCIONES */}
          {activeSubModule === 'promociones' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#C5A880]" />
                    <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                      POLÍTICA PROMOCIONAL F&B
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Promociones Operativas
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono flex-wrap">
                  {[
                    { id: 'todas', label: 'Todas' },
                    { id: 'ACTIVA', label: 'Activas' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setPromotionFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        promotionFilter === f.id
                          ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                          : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {unitPromotions.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-3 max-w-xl mx-auto">
                  <Flame className="w-10 h-10 text-[#C5A880] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#2C3E50]">
                      No hay promociones activas registradas
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70 font-mono">
                      Configure ofertas periódicas o Happy Hours para incentivar franjas horarias específicas en su negocio.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {unitPromotions.map(promo => (
                    <div
                      key={promo.id}
                      className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                        <div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40">
                            {promo.status}
                          </span>
                          <h3 className="text-xl font-bold text-[#2C3E50] mt-1">
                            {promo.name}
                          </h3>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-mono text-[#C5A880] font-bold text-sm block">
                            {promo.price}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono uppercase text-[#2C3E50]/70 font-bold block">
                          Productos Incluidos:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {promo.includedProducts.map((prod, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50]">
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBMÓDULO 7: PROCEDIMIENTOS OPERATIVOS (SOP) */}
          {activeSubModule === 'procedimientos' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#C5A880]" />
                <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                  ESTÁNDARES DE OPERACIÓN
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                Manuales de Procedimiento Estándar (SOP)
              </h2>

              {unitProcedures.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-3 max-w-xl mx-auto">
                  <ShieldAlert className="w-10 h-10 text-[#C5A880] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#2C3E50]">
                      No hay manuales de procedimiento (SOP) registrados
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70 font-mono">
                      Redacte los protocolos de apertura, cierre, APPCC o prevención específicos de su negocio.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {unitProcedures.map(proc => (
                    <div key={proc.id} className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] font-bold">
                          {proc.code}
                        </span>
                        <span className="text-xs font-mono text-[#2C3E50]/60">v{proc.version}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#2C3E50]">
                        {proc.title}
                      </h3>

                      <p className="text-xs text-[#2C3E50]/80">
                        {proc.purpose}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                        <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase block font-bold">
                          Pasos Secuenciales:
                        </span>
                        <div className="space-y-1">
                          {proc.steps.map((st, idx) => (
                            <p key={idx} className="text-xs text-[#2C3E50] font-mono">
                              {st}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBMÓDULO 8: FORMACIÓN TÉCNICA */}
          {activeSubModule === 'formacion' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#C5A880]" />
                <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                  CAPACITACIÓN TÉCNICA
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                Programas de Formación F&B
              </h2>

              {unitTraining.length === 0 ? (
                <div className="p-8 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-2 max-w-xl mx-auto">
                  <GraduationCap className="w-8 h-8 text-[#C5A880] mx-auto" />
                  <h3 className="text-base font-bold text-[#2C3E50]">
                    No hay tracks formativos publicados
                  </h3>
                  <p className="text-xs text-[#2C3E50]/70 font-mono">
                    Diseñe programas de capacitación técnica para su equipo de sala, barra y cocina.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unitTraining.map(track => (
                    <div key={track.id} className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                          {track.department}
                        </span>
                        <span className="text-xs font-mono text-[#2C3E50]/60">⏱ {track.durationHours} horas</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#2C3E50]">
                        {track.title}
                      </h3>
                      <p className="text-xs text-[#2C3E50]/80">
                        {track.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUBMÓDULO 9: BANDEJA DOCUMENTAL */}
          {activeSubModule === 'documentacion' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[#C5A880] uppercase font-bold">
                    REGISTRO Y ARCHIVO
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
                    Bandeja Documental Operativa
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddDocModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Registrar Documento</span>
                </button>
              </div>

              {documentIntake.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-3 max-w-xl mx-auto">
                  <FolderArchive className="w-10 h-10 text-[#C5A880] mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#2C3E50]">
                      Bandeja documental vacía
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70 font-mono">
                      Registre fichas de proveedores, normativas o manuales para su procesamiento centralizado.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDocModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Registrar Primer Documento</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {documentIntake.map(doc => (
                    <div key={doc.id} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#2C3E50] text-sm">{doc.title}</h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#2C3E50]/70">{doc.summary || doc.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL COCTELERÍA COMPLETO */}
      <CocktailDetailModal
        sheet={activeModalCocktail}
        onClose={() => setActiveModalCocktail(null)}
      />

      {/* MODAL PROMOCIÓN COMPLETO */}
      <PromotionDetailModal
        promotion={activeModalPromotion}
        onClose={() => setActiveModalPromotion(null)}
      />

      {/* MODAL PARA AGREGAR DOCUMENTO A BANDEJA */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2530]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#2C3E50]">
              Registrar Documento Operativo
            </h3>
            <form onSubmit={handleAddDocument} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#2C3E50] font-semibold block mb-1">Título del Documento:</label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Ej: Ficha Técnica Estandarizada v2.0"
                  className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-2.5 text-[#2C3E50] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-[#2C3E50] font-semibold block mb-1">Categoría:</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-2.5 text-[#2C3E50] focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="ficha_tecnica">Ficha Técnica</option>
                  <option value="carta">Carta</option>
                  <option value="promocion">Promoción</option>
                  <option value="procedimiento">Procedimiento (SOP)</option>
                </select>
              </div>

              <div>
                <label className="text-[#2C3E50] font-semibold block mb-1">Observaciones / Notas:</label>
                <textarea
                  rows={3}
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  placeholder="Detalles de la receta, procedencia o aplicación..."
                  className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-2.5 text-[#2C3E50] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-transparent border border-[#E2E8F0] text-[#2C3E50] hover:bg-[#F8F9FA]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C5A880] text-[#1A2530] font-bold hover:bg-[#b5976f]"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
