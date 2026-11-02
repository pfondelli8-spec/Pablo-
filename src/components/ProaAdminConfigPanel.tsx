import React, { useState, useMemo } from 'react';
import {
  Building2,
  Layers,
  FileText,
  UtensilsCrossed,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Eye,
  Smartphone,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Archive,
  Power,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronDown,
  Info,
  Search,
  Filter,
  Sliders,
  FileCheck,
  Lock,
  User,
  Coffee,
  Flame,
  Snowflake,
  ShieldAlert,
  ArrowLeft,
  Award
} from 'lucide-react';
import {
  ProaAdminRole,
  StructureEntityConfig,
  StructureNodeType,
  FormTemplateConfig,
  FormFieldDefinition,
  FormFieldType,
  ManagedDocRecord,
  AdminTechnicalSheet,
  AdminCleaningTaskConfig,
  AdminIncidentCategoryConfig,
  AdminAuditChangeLogEntry,
  EU_14_ALLERGENS,
  AllergenId,
  AdminUserOperator
} from '../types/proaAdminConfig';
import { proaAdminConfigService, DEMO_OPERATORS } from '../services/proaAdminConfigService';
import { ActiveTenantSession } from '../services/tenantIsolationService';
import { SecurityIsolationAuditModal } from './SecurityIsolationAuditModal';
import { chefConfigService, ChefProfile } from '../services/chefConfigService';

interface ProaAdminConfigPanelProps {
  activeTenant: ActiveTenantSession;
  initialRole?: ProaAdminRole;
  currentHotelId?: string | null;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

type AdminTab = 
  | 'estructura' 
  | 'formularios' 
  | 'documentos' 
  | 'fichas_tecnicas' 
  | 'limpieza' 
  | 'incidencias' 
  | 'auditoria' 
  | 'rbac'
  | 'chefs';

export const ProaAdminConfigPanel: React.FC<ProaAdminConfigPanelProps> = ({
  activeTenant,
  initialRole = 'jefe_departamento',
  currentHotelId = 'est-bitacora',
  onClose,
  onConfigUpdated
}) => {
  // Operador y rol activo para evaluar RBAC
  const [currentOperator, setCurrentOperator] = useState<AdminUserOperator>(() => {
    return DEMO_OPERATORS.find(op => op.role === initialRole) || DEMO_OPERATORS[0];
  });

  // Configuración completa cargada
  const [config, setConfig] = useState(() => proaAdminConfigService.getConfigPayload());
  const [activeTab, setActiveTab] = useState<AdminTab>('estructura');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'warn' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Guardar estado reactivo y sincronizar
  const handleSaveAll = (updatedConfig = config) => {
    proaAdminConfigService.saveConfigPayload(updatedConfig);
    setConfig(updatedConfig);
    if (onConfigUpdated) onConfigUpdated();
  };

  // =========================================================================
  // ESTADO: CONFIGURADOR DE ESTRUCTURA
  // =========================================================================
  const [structureTypeFilter, setStructureTypeFilter] = useState<string>('all');
  const [editingStructure, setEditingStructure] = useState<StructureEntityConfig | null>(null);
  const [isNewStructureModalOpen, setIsNewStructureModalOpen] = useState(false);
  const [newStructureType, setNewStructureType] = useState<StructureNodeType>('area');
  const [newStructureParentId, setNewStructureParentId] = useState<string>('dep-bitacora-cocina');
  const [newStructureName, setNewStructureName] = useState('');
  const [newStructureCode, setNewStructureCode] = useState('');
  const [newStructureDesc, setNewStructureDesc] = useState('');
  const [newStructureLead, setNewStructureLead] = useState('');

  // Modal de Eliminación Segura
  const [safeDeletionData, setSafeDeletionData] = useState<{
    nodeType: StructureNodeType | 'form' | 'doc' | 'recipe';
    entityId: string;
    entityName: string;
    checkResult: ReturnType<typeof proaAdminConfigService.checkSafeDeletion>;
  } | null>(null);

  // =========================================================================
  // ESTADO: EDITOR DE FORMULARIOS
  // =========================================================================
  const [selectedFormId, setSelectedFormId] = useState<string>(config.forms[0]?.id || '');
  const [isEditingFormFields, setIsEditingFormFields] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishChangelogText, setPublishChangelogText] = useState('');

  // Formulario nuevo
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormCode, setNewFormCode] = useState('');
  const [newFormCategory, setNewFormCategory] = useState<'temperaturas' | 'limpieza_desinfeccion' | 'apertura_cierre' | 'revision_maquinaria' | 'control_camaras' | 'incidencias' | 'checklist_personalizado'>('temperaturas');
  const [newFormDesc, setNewFormDesc] = useState('');

  // Campo nuevo en formulario activo
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormFieldType>('number');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldUnit, setNewFieldUnit] = useState('ºC');
  const [newFieldMin, setNewFieldMin] = useState<number | undefined>(0);
  const [newFieldMax, setNewFieldMax] = useState<number | undefined>(4);
  const [newFieldOptions, setNewFieldOptions] = useState('Opción 1, Opción 2, Opción 3');

  // =========================================================================
  // ESTADO: GESTIÓN DOCUMENTAL
  // =========================================================================
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('all');
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCode, setNewDocCode] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<ManagedDocRecord['category']>('normas_appcc');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocEffectiveDate, setNewDocEffectiveDate] = useState('2026-03-01');
  const [newDocApproverRole, setNewDocApproverRole] = useState('Chef Ejecutivo');

  // =========================================================================
  // ESTADO: FICHAS TÉCNICAS Y RECETAS
  // =========================================================================
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(config.technicalSheets[0]?.id || null);
  const [isEditingSheet, setIsEditingSheet] = useState(false);
  const [isNewSheetModalOpen, setIsNewSheetModalOpen] = useState(false);
  const [sheetFilterCategory, setSheetFilterCategory] = useState<string>('all');

  // Formulario nueva Ficha Técnica
  const [newSheetName, setNewSheetName] = useState('');
  const [newSheetCode, setNewSheetCode] = useState('');
  const [newSheetCategory, setNewSheetCategory] = useState<AdminTechnicalSheet['category']>('cocina_caliente');
  const [newSheetServings, setNewSheetServings] = useState(1);
  const [newSheetGlassware, setNewSheetGlassware] = useState('');
  const [newSheetSensory, setNewSheetSensory] = useState('');
  const [newSheetCost, setNewSheetCost] = useState<number>(4.50);
  const [newSheetPrice, setNewSheetPrice] = useState<number>(18.00);
  const [newSheetAllergens, setNewSheetAllergens] = useState<AllergenId[]>([]);
  const [newSheetFormulationRaw, setNewSheetFormulationRaw] = useState<string>(
    '200 gr | Solomillo de vaca madurada\n30 gr | Mantequilla clarificada\n3 gotas | Aceite de trufa'
  );
  const [newSheetElaborationRaw, setNewSheetElaborationRaw] = useState<string>(
    '1. Atemperamos la carne durante 20 minutos.\n2. Marcamos en plancha a 240ºC por ambos lados.\n3. Servimos en plato caliente.'
  );

  // =========================================================================
  // ESTADO: GESTIÓN DE ROLES Y PERSONAL (RBAC)
  // =========================================================================
  const [editingOperator, setEditingOperator] = useState<AdminUserOperator | null>(null);
  const [isNewOperatorModalOpen, setIsNewOperatorModalOpen] = useState(false);
  const [newOpName, setNewOpName] = useState('');
  const [newOpEmail, setNewOpEmail] = useState('');
  const [newOpRole, setNewOpRole] = useState<ProaAdminRole>('trabajador');
  const [newOpJobTitle, setNewOpJobTitle] = useState('');
  const [newOpEstablishment, setNewOpEstablishment] = useState('est-bitacora');
  const [newOpDepartment, setNewOpDepartment] = useState('dep-bitacora-cocina');

  // =========================================================================
  // ESTADO: PLANES DE LIMPIEZA Y ACTIVIDADES
  // =========================================================================
  const [editingCleaningTask, setEditingCleaningTask] = useState<AdminCleaningTaskConfig | null>(null);

  // =========================================================================
  // ESTADO: EDICIÓN DE FORMULARIOS Y CAMPOS
  // =========================================================================
  const [editingFormField, setEditingFormField] = useState<FormFieldDefinition | null>(null);
  const [isEditingFormMetadata, setIsEditingFormMetadata] = useState(false);

  // =========================================================================
  // ESTADO: FOTOGRAFÍAS Y CHEFS DE HOTEL
  // =========================================================================
  const [editingChefBitacora, setEditingChefBitacora] = useState<ChefProfile>(() => 
    chefConfigService.getProfileForHotel('model-bitacora')
  );
  const [editingChefVulcano, setEditingChefVulcano] = useState<ChefProfile>(() => 
    chefConfigService.getProfileForHotel('model-vulcano')
  );

  // =========================================================================
  // RBAC: Verificación de Permisos
  // =========================================================================
  const permissionCheck = useMemo(() => {
    return proaAdminConfigService.canUserPerformAction(
      currentOperator.role,
      activeTab === 'auditoria' ? 'view_audit' : 'view_config'
    );
  }, [currentOperator.role, activeTab]);

  const activeForm = useMemo(() => {
    return config.forms.find(f => f.id === selectedFormId) || config.forms[0];
  }, [config.forms, selectedFormId]);

  const activeSheet = useMemo(() => {
    return config.technicalSheets.find(s => s.id === selectedSheetId) || config.technicalSheets[0];
  }, [config.technicalSheets, selectedSheetId]);

  // Si el usuario es un trabajador sin permisos, mostrar vista de acceso restringido
  if (!permissionCheck.allowed && currentOperator.role === 'trabajador') {
    return (
      <div className="fixed inset-0 z-50 bg-[#1A2530]/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-200 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1A2530] mb-2">Acceso Restringido a Configuración</h3>
          <p className="text-xs text-[#2C3E50]/80 mb-6 leading-relaxed">
            Tu perfil actual es <strong className="text-red-700">Trabajador Operativo</strong>. El panel de administración y configuración requiere permisos de Dirección, Jefatura de Departamento o Administración.
          </p>

          <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E2E8F0] mb-6 text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/60 mb-2">Cambiar a rol de prueba:</div>
            <div className="flex flex-col gap-1.5">
              {DEMO_OPERATORS.filter(o => o.role !== 'trabajador').map(op => (
                <button
                  key={op.id}
                  onClick={() => {
                    setCurrentOperator(op);
                    showToast(`Sesión cambiada a ${op.name} (${op.role})`);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg bg-white hover:bg-[#C5A880]/15 hover:border-[#C5A880] border border-[#E2E8F0] transition flex items-center justify-between"
                >
                  <span className="font-medium text-[#1A2530]">{op.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A2530] text-[#C5A880] font-mono">{op.role}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#1A2530] text-white rounded-xl text-xs font-semibold hover:bg-black transition shadow"
          >
            ← Volver al Panel Operativo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] flex flex-col font-sans text-[#2C3E50] overflow-hidden select-none">
      {/* Toast Notificación */}
      {feedbackToast && (
        <div className={`fixed top-4 right-4 z-[999] px-4 py-3 rounded-xl shadow-xl border text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
          feedbackToast.type === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          {feedbackToast.type === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* =========================================================================
          CABECERA SUPERIOR DEL PANEL DE ADMINISTRACIÓN
          ========================================================================= */}
      <header className="bg-[#1A2530] text-white px-6 py-3 border-b border-[#2C3E50] shadow-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-semibold"
            title="Volver al panel operativo"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a Operaciones</span>
          </button>

          <div className="h-5 w-px bg-white/20" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold tracking-wide text-white">PROA</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40">
                Administración & Configuración
              </span>
            </div>
            <div className="text-[11px] text-white/70 flex items-center gap-1.5">
              <span>{activeTenant.name}</span>
              <span>·</span>
              <span className="font-mono text-[#C5A880]">{activeTenant.code}</span>
            </div>
          </div>
        </div>

        {/* Selector de Rol y Operador para Pruebas de RBAC */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 rounded-xl px-3 py-1.5 border border-white/15 flex items-center gap-2">
            <User className="w-4 h-4 text-[#C5A880]" />
            <div className="text-right">
              <div className="text-[10px] text-white/60 uppercase font-semibold leading-none">Operador Actual (RBAC):</div>
              <select
                value={currentOperator.id}
                onChange={(e) => {
                  const op = DEMO_OPERATORS.find(o => o.id === e.target.value);
                  if (op) {
                    setCurrentOperator(op);
                    showToast(`Sesión cambiada a ${op.name} · Rol: ${op.role}`);
                  }
                }}
                className="bg-transparent text-xs font-semibold text-white cursor-pointer focus:outline-none"
              >
                {DEMO_OPERATORS.map(op => (
                  <option key={op.id} value={op.id} className="bg-[#1A2530] text-white">
                    {op.name} ({op.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              handleSaveAll();
              showToast('Todas las configuraciones operativas guardadas con éxito.');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#C5A880] hover:bg-[#b0936b] text-[#1A2530] font-semibold text-xs transition flex items-center gap-1.5 shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Todo</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN SECUNDARIA (TABS DE SUBMÓDULOS)
          ========================================================================= */}
      <nav className="bg-white border-b border-[#E2E8F0] px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0 shadow-sm">
        {[
          { id: 'estructura', label: 'Estructura & Puntos de Control', icon: Building2 },
          { id: 'formularios', label: 'Editor de Formularios & Registros', icon: Sliders },
          { id: 'documentos', label: 'Gestión Documental & SOPs', icon: FileText },
          { id: 'fichas_tecnicas', label: 'Cartas, Menús y Fichas Técnicas', icon: UtensilsCrossed },
          { id: 'limpieza', label: 'Planes de Limpieza', icon: Sparkles },
          { id: 'incidencias', label: 'Comunicaciones e Incidencias', icon: AlertTriangle },
          { id: 'auditoria', label: 'Auditoría & Control de Cambios', icon: ShieldCheck },
          { id: 'rbac', label: 'Roles y Permisos (RBAC)', icon: Lock },
          { id: 'chefs', label: 'Fotografías & Chefs de Hotel', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#1A2530] text-white shadow-sm font-semibold'
                  : 'text-[#2C3E50]/70 hover:bg-[#F8F9FA] hover:text-[#1A2530]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* =========================================================================
          ÁREA PRINCIPAL DE CONTENIDO
          ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* =====================================================================
            1. CONFIGURADOR DE ESTRUCTURA
            ===================================================================== */}
        {activeTab === 'estructura' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A2530]">Configurador de Estructura Organizativa</h2>
                <p className="text-xs text-[#2C3E50]/70">
                  Gestiona establecimientos, departamentos, áreas de trabajo, turnos y puntos de control sin alterar datos históricos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={structureTypeFilter}
                  onChange={(e) => setStructureTypeFilter(e.target.value)}
                  className="text-xs bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#2C3E50]"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="establishment">Establecimientos</option>
                  <option value="department">Departamentos</option>
                  <option value="area">Áreas de Trabajo</option>
                  <option value="equipment">Equipos y Puntos de Control</option>
                </select>

                <button
                  onClick={() => setIsNewStructureModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>+ Agregar Elemento</span>
                </button>
              </div>
            </div>

            {/* Listado Jerárquico de Elementos de Estructura */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
              {config.structures
                .filter(s => structureTypeFilter === 'all' || s.type === structureTypeFilter)
                .map((item, idx) => (
                  <div key={item.id} className="p-4 hover:bg-[#F8F9FA] transition flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        item.type === 'establishment' ? 'bg-[#1A2530] text-[#C5A880]' :
                        item.type === 'department' ? 'bg-amber-100 text-amber-800' :
                        item.type === 'area' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {item.type === 'establishment' ? 'H' : item.type === 'department' ? 'D' : item.type === 'area' ? 'A' : 'EQ'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#1A2530]">{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]">
                            {item.code}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            item.status === 'activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                          {item.metadata?.criticalControlPoint && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold">
                              Punto de Control Crítico (PCC)
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-[#2C3E50]/70 mt-0.5">
                          {item.description || 'Sin descripción'}
                          {item.leadName && <span> · Responsable: <strong className="text-[#1A2530]">{item.leadName}</strong></span>}
                          {item.metadata?.tempMin !== undefined && (
                            <span> · Rango térmico: {item.metadata.tempMin} a {item.metadata.tempMax} {item.metadata.unit}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones: Encender/Apagar, Modificar y Eliminación Segura */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const updated = { ...config };
                          const target = updated.structures.find(s => s.id === item.id);
                          if (target) {
                            target.status = target.status === 'activo' ? 'inactivo' : 'activo';
                            proaAdminConfigService.recordAuditChange({
                              operatorId: currentOperator.id,
                              operatorName: currentOperator.name,
                              operatorRole: currentOperator.role,
                              targetModule: 'estructura',
                              actionType: 'modificacion',
                              entityId: item.id,
                              entityName: item.name,
                              summary: `Estado cambiado a ${target.status}`
                            });
                            handleSaveAll(updated);
                            showToast(`Elemento ${item.name} marcado como ${target.status}`);
                          }
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-xs transition flex items-center gap-1 font-semibold ${
                          item.status === 'activo'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={item.status === 'activo' ? 'Apagar / Desactivar' : 'Encender / Activar'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{item.status === 'activo' ? 'Apagar' : 'Encender'}</span>
                      </button>

                      <button
                        onClick={() => setEditingStructure({ ...item })}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                        title="Modificar nombre, responsable, código o parámetros técnicos"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Modificar</span>
                      </button>

                      <button
                        onClick={() => {
                          // Lanzar Comprobación de Eliminación Segura
                          const check = proaAdminConfigService.checkSafeDeletion(item.type, item.id);
                          setSafeDeletionData({
                            nodeType: item.type,
                            entityId: item.id,
                            entityName: item.name,
                            checkResult: check
                          });
                        }}
                        className="px-2 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 text-xs"
                        title="Eliminar de forma segura (con comprobación de históricos)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            2. EDITOR VISUAL DE FORMULARIOS Y REGISTROS CON PREVISUALIZACIÓN MÓVIL
            ===================================================================== */}
        {activeTab === 'formularios' && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Lista lateral de formularios disponibles */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif font-bold text-sm text-[#1A2530]">Formularios Operativos</h3>
                  <button
                    onClick={() => setIsNewFormModalOpen(true)}
                    className="p-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] hover:bg-black transition text-xs flex items-center gap-1"
                    title="Crear nuevo formulario"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {config.forms.map(form => (
                    <div
                      key={form.id}
                      onClick={() => setSelectedFormId(form.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        selectedFormId === form.id
                          ? 'bg-[#1A2530] text-white border-[#1A2530] shadow-sm'
                          : 'bg-[#F8F9FA] text-[#2C3E50] border-[#E2E8F0] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          selectedFormId === form.id ? 'bg-white/20 text-[#C5A880]' : 'bg-white text-slate-600 border border-[#E2E8F0]'
                        }`}>
                          {form.code}
                        </span>
                        <span className="text-[10px] font-bold uppercase">{form.version}</span>
                      </div>
                      <div className="font-semibold text-xs leading-tight mb-1">{form.title}</div>
                      <div className={`text-[11px] line-clamp-1 ${selectedFormId === form.id ? 'text-white/70' : 'text-[#2C3E50]/60'}`}>
                        {form.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de Edición y Campos del Formulario Seleccionado */}
            <div className="lg:col-span-8 space-y-4">
              {activeForm && (
                <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-serif font-bold text-[#1A2530]">{activeForm.title}</h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          {activeForm.version} ({activeForm.status})
                        </span>
                      </div>
                      <p className="text-xs text-[#2C3E50]/70 mt-0.5">{activeForm.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditingFormMetadata(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#1A2530] border border-slate-300 text-xs font-semibold hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                        title="Modificar título, código, categoría y configuración del formulario"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-700" />
                        <span>Modificar Formulario</span>
                      </button>

                      <button
                        onClick={() => setMobilePreviewOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition flex items-center gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Vista Móvil</span>
                      </button>

                      <button
                        onClick={() => setIsPublishModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-semibold hover:bg-[#b0936b] transition flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publicar Versión</span>
                      </button>
                    </div>
                  </div>

                  {/* Lista de Campos del Formulario */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50]/70">
                        Campos y Puntos de Control ({activeForm.fields.length})
                      </h4>
                      <button
                        onClick={() => setIsAddFieldModalOpen(true)}
                        className="text-xs font-semibold text-[#1A2530] hover:text-[#C5A880] flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Campo</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {activeForm.fields.map((fld, fIdx) => (
                        <div key={fld.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-bold text-slate-400 w-4">#{fIdx + 1}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-[#1A2530]">{fld.label}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-[#E2E8F0] font-mono">
                                  {fld.type}
                                </span>
                                {fld.required && (
                                  <span className="text-[10px] text-red-600 font-bold">*Obligatorio</span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#2C3E50]/70 mt-0.5">
                                {fld.unit && <span>Unidad: {fld.unit} · </span>}
                                {fld.minValue !== undefined && <span>Rango: {fld.minValue} a {fld.maxValue} {fld.unit} · </span>}
                                {fld.criticalAlertMessage && (
                                  <span className="text-amber-800 font-medium">Alerta crítica configurada</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingFormField({ ...fld })}
                              className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center gap-1 text-xs font-bold cursor-pointer shadow-xs"
                              title="Modificar campo, rango y alertas"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Modificar</span>
                            </button>

                            <button
                              onClick={() => {
                                const updated = { ...config };
                                const form = updated.forms.find(f => f.id === activeForm.id);
                                if (form) {
                                  form.fields = form.fields.filter(f => f.id !== fld.id);
                                  handleSaveAll(updated);
                                  showToast(`Campo '${fld.label}' eliminado del formulario.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                              title="Eliminar campo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historial de Versiones Inmutables */}
                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C3E50]/70 mb-2">
                      Historial de Versiones Publicadas (Trazabilidad Inmutable)
                    </h4>
                    <div className="space-y-1.5">
                      {activeForm.versionChangelog?.map((log, lIdx) => (
                        <div key={lIdx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold font-mono text-[#1A2530] mr-2">{log.version}</span>
                            <span className="text-slate-600">{log.changesSummary}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Por {log.author} el {new Date(log.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            3. GESTIÓN DOCUMENTAL & SOPS
            ===================================================================== */}
        {activeTab === 'documentos' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A2530]">Gestión Documental y Procedimientos (SOPs)</h2>
                <p className="text-xs text-[#2C3E50]/70">
                  Controla versiones, fechas de vigencia y aprobaciones obligatorias para el personal operativo.
                </p>
              </div>

              <button
                onClick={() => setIsNewDocModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>+ Subir / Redactar Documento</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.documents.map(doc => (
                <div key={doc.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#C5A880] transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#1A2530] font-bold border border-[#E2E8F0]">
                        {doc.code}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        doc.status === 'vigente' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.status} ({doc.version})
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-[#1A2530] mb-1 leading-snug">{doc.title}</h3>
                    <p className="text-xs text-[#2C3E50]/70 mb-3 line-clamp-2">{doc.description}</p>

                    <div className="space-y-1 text-[11px] text-[#2C3E50]/70 pt-2 border-t border-[#E2E8F0]">
                      <div>Entrada en vigor: <strong className="text-[#1A2530]">{doc.effectiveDate}</strong></div>
                      <div>Revisión programada: <strong className="text-[#1A2530]">{doc.reviewDate}</strong></div>
                      <div>Aprobador: <strong className="text-[#1A2530]">{doc.approvedBy || doc.approverRole}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">{doc.fileName || 'Documento interno'}</span>
                    <button
                      onClick={() => {
                        const updated = { ...config };
                        const target = updated.documents.find(d => d.id === doc.id);
                        if (target) {
                          target.status = target.status === 'vigente' ? 'obsoleto' : 'vigente';
                          proaAdminConfigService.recordAuditChange({
                            operatorId: currentOperator.id,
                            operatorName: currentOperator.name,
                            operatorRole: currentOperator.role,
                            targetModule: 'documentos',
                            actionType: 'modificacion',
                            entityId: doc.id,
                            entityName: doc.title,
                            summary: `Estado de documento cambiado a ${target.status}`
                          });
                          handleSaveAll(updated);
                          showToast(`Documento marcado como ${target.status}`);
                        }
                      }}
                      className="text-xs font-semibold text-[#1A2530] hover:text-[#C5A880] transition"
                    >
                      Alternar Vigencia
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            4. GESTIÓN DE CARTAS, MENÚS Y FICHAS TÉCNICAS (CON ESTÁNDAR F&B)
            ===================================================================== */}
        {activeTab === 'fichas_tecnicas' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A2530]">Fichas Técnicas Estandarizadas F&B</h2>
                <p className="text-xs text-[#2C3E50]/70">
                  Formulación exacta con nomenclatura técnica (cl, gr, un., gotas), flujo en 1ª persona plural y matriz de 14 alérgenos UE.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewSheetModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>+ Nueva Ficha Técnica</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Listado de Fichas */}
              <div className="space-y-3">
                {config.technicalSheets.map(sheet => (
                  <div
                    key={sheet.id}
                    onClick={() => setSelectedSheetId(sheet.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedSheetId === sheet.id
                        ? 'bg-[#1A2530] text-white border-[#1A2530] shadow-md'
                        : 'bg-white text-[#2C3E50] border-[#E2E8F0] hover:border-[#C5A880]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        selectedSheetId === sheet.id ? 'bg-white/20 text-[#C5A880]' : 'bg-[#F8F9FA] text-[#1A2530] border border-[#E2E8F0]'
                      }`}>
                        {sheet.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase">{sheet.version}</span>
                    </div>

                    <h4 className="font-serif font-bold text-xs mb-1 leading-snug">{sheet.name}</h4>
                    <div className={`text-[11px] mb-2 ${selectedSheetId === sheet.id ? 'text-white/70' : 'text-[#2C3E50]/60'}`}>
                      {sheet.categoryLabel} · {sheet.servings} ración(es)
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                      <span>Coste: <strong>€{sheet.costPerServing?.toFixed(2)}</strong></span>
                      <span className="text-[#C5A880] font-bold">PVP: €{sheet.sellingPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visor / Editor Detallado de Ficha Técnica */}
              <div className="lg:col-span-2">
                {activeSheet && (
                  <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-6">
                    <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 uppercase">
                          {activeSheet.code} · {activeSheet.status} ({activeSheet.version})
                        </span>
                        <h2 className="text-lg font-serif font-bold text-[#1A2530] mt-1.5">{activeSheet.name}</h2>
                        <div className="text-xs text-[#2C3E50]/70">
                          Autor: {activeSheet.author} · Aprobado por: {activeSheet.approverName || 'Jefatura de Cocina'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-400">PVP Venta</div>
                        <div className="text-xl font-bold font-serif text-[#1A2530]">€{activeSheet.sellingPrice?.toFixed(2)}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold">Coste: {activeSheet.foodCostPercentage}%</div>
                      </div>
                    </div>

                    {/* Formulación Estandarizada */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2530] mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                        <span>Formulación Técnica Estandarizada</span>
                      </h4>
                      <div className="bg-[#F8F9FA] rounded-xl border border-[#E2E8F0] overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#1A2530] text-white text-[10px] uppercase font-mono">
                            <tr>
                              <th className="py-2 px-3">Medida</th>
                              <th className="py-2 px-3">Ingrediente & Nomenclatura Técnica</th>
                              <th className="py-2 px-3 text-right">Coste Aprox.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E8F0]">
                            {activeSheet.formulation.map((item, iIdx) => (
                              <tr key={iIdx} className="hover:bg-white transition">
                                <td className="py-2 px-3 font-bold font-mono text-[#1A2530]">{item.measure}</td>
                                <td className="py-2 px-3 text-[#2C3E50]">
                                  <strong>{item.name}</strong>
                                  <div className="text-[10px] text-slate-500">{item.technicalNaming}</div>
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-600">
                                  €{item.costApprox?.toFixed(2) || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Flujo de Elaboración */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2530] mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                        <span>Flujo de Elaboración Secuencial</span>
                      </h4>
                      <div className="space-y-1.5 bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0] text-xs leading-relaxed text-[#2C3E50]">
                        {activeSheet.elaborationFlow.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2">
                            <span className="font-bold text-[#1A2530] font-mono">{sIdx + 1}.</span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cristaleria y Utiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E2E8F0]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/60 mb-1">Cristalería y Útiles:</div>
                        <div className="text-xs text-[#1A2530] font-medium">{activeSheet.glasswareAndTools}</div>
                      </div>

                      <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E2E8F0]">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#2C3E50]/60 mb-1">Diagnóstico Sensorial:</div>
                        <div className="text-xs text-[#1A2530] font-medium">{activeSheet.sensoryDiagnosis}</div>
                      </div>
                    </div>

                    {/* Matriz de Alérgenos */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A2530] mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        <span>Declaración Obligatoria de Alérgenos (Reglamento UE 1169/2011)</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {EU_14_ALLERGENS.map(al => {
                          const isPresent = activeSheet.allergens.includes(al.id);
                          return (
                            <span
                              key={al.id}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                isPresent
                                  ? 'bg-red-50 text-red-800 border border-red-300 font-bold'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-40'
                              }`}
                            >
                              <span>{al.icon}</span>
                              <span>{al.label}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            5. PLANES DE LIMPIEZA Y DESINFECCIÓN
            ===================================================================== */}
        {activeTab === 'limpieza' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A2530]">Planes de Limpieza y Desinfección Operativa</h2>
                <p className="text-xs text-[#2C3E50]/70">
                  Dosificación autorizada de químicos, frecuencias por turno y requisitos de verificación por supervisor.
                </p>
              </div>

              <button
                onClick={() => {
                  const updated = { ...config };
                  updated.cleaningTasks.push({
                    id: `cln-new-${Date.now()}`,
                    establishmentId: 'est-bitacora',
                    departmentId: 'dep-bitacora-cocina',
                    areaKey: 'area-bit-caliente-manana',
                    areaOrEquipment: 'Horno Mixto Racional y Sondas Térmicas',
                    frequency: 'diaria',
                    shift: 'tarde',
                    authorizedProduct: 'Pastillas de detergente y abrillantador homologadas',
                    dosage: 'Programa automático CleanJet Care',
                    applicationMethod: 'Ciclo nocturno automático con enfriamiento a 50ºC.',
                    responsibleRole: 'Cocinero de cierre',
                    requiresSupervisorVerification: true,
                    requiredEvidence: 'fotografia',
                    status: 'activo',
                    updatedAt: new Date().toISOString()
                  });
                  handleSaveAll(updated);
                  showToast('Nuevo protocolo de limpieza añadido con éxito.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>+ Añadir Protocolo de Limpieza</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.cleaningTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-serif font-bold text-sm text-[#1A2530]">{task.areaOrEquipment}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        task.status === 'inactivo' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-800'
                      }`}>
                        {task.frequency} ({task.shift})
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        task.status === 'inactivo' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {task.status === 'inactivo' ? 'Inactivo' : 'Activo'}
                      </span>
                      {task.requiresSupervisorVerification && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          Requiere Firma Supervisor
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#2C3E50]/80 space-y-0.5">
                      <div>Rol Asignado: <strong className="text-[#1A2530]">{task.responsibleRole}</strong></div>
                      <div>Químico Autorizado: <strong className="text-[#1A2530]">{task.authorizedProduct}</strong></div>
                      <div>Dosificación: <strong className="text-slate-700">{task.dosage}</strong></div>
                      <div>Método: <span className="text-slate-600">{task.applicationMethod}</span></div>
                    </div>
                  </div>

                  {/* Acciones: Encender/Apagar, Modificar, Eliminar */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        const updated = { ...config };
                        const target = updated.cleaningTasks.find(t => t.id === task.id);
                        if (target) {
                          target.status = target.status === 'activo' ? 'inactivo' : 'activo';
                          proaAdminConfigService.recordAuditChange({
                            operatorId: currentOperator.id,
                            operatorName: currentOperator.name,
                            operatorRole: currentOperator.role,
                            targetModule: 'limpieza',
                            actionType: 'modificacion',
                            entityId: task.id,
                            entityName: task.areaOrEquipment,
                            summary: `Estado de protocolo cambiado a ${target.status}`
                          });
                          handleSaveAll(updated);
                          showToast(`Protocolo marcado como ${target.status}`);
                        }
                      }}
                      className={`px-2 py-1.5 rounded-lg border text-xs transition flex items-center gap-1 font-semibold ${
                        task.status === 'activo'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={task.status === 'activo' ? 'Apagar / Desactivar protocolo' : 'Encender / Activar protocolo'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{task.status === 'activo' ? 'Apagar' : 'Encender'}</span>
                    </button>

                    <button
                      onClick={() => setEditingCleaningTask({ ...task })}
                      className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                      title="Modificar frecuencia, químico, dosificación o rol responsable"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Modificar</span>
                    </button>

                    <button
                      onClick={() => {
                        const updated = { ...config };
                        updated.cleaningTasks = updated.cleaningTasks.filter(t => t.id !== task.id);
                        proaAdminConfigService.recordAuditChange({
                          operatorId: currentOperator.id,
                          operatorName: currentOperator.name,
                          operatorRole: currentOperator.role,
                          targetModule: 'limpieza',
                          actionType: 'eliminacion_segura',
                          entityId: task.id,
                          entityName: task.areaOrEquipment,
                          summary: 'Eliminación de protocolo de limpieza'
                        });
                        handleSaveAll(updated);
                        showToast('Protocolo de limpieza eliminado.');
                      }}
                      className="px-2 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 text-xs"
                      title="Eliminar protocolo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            6. COMUNICACIONES E INCIDENCIAS
            ===================================================================== */}
        {activeTab === 'incidencias' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <h2 className="text-base font-serif font-bold text-[#1A2530]">Configuración de Incidencias Operativas</h2>
              <p className="text-xs text-[#2C3E50]/70">
                Define categorías, niveles de severidad y tiempos máximos de escalado antes de notificar a supervisores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.incidentCategories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#1A2530] font-bold border border-[#E2E8F0]">
                      {cat.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      cat.severityDefault === 'critica' ? 'bg-red-50 text-red-700 border border-red-200' :
                      cat.severityDefault === 'alta' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700'
                    }`}>
                      Severidad: {cat.severityDefault}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs text-[#1A2530] mb-1">{cat.name}</h4>
                  <p className="text-xs text-[#2C3E50]/70 mb-3">{cat.description}</p>

                  <div className="text-[11px] text-[#2C3E50]/80 pt-2 border-t border-[#E2E8F0] space-y-1">
                    <div>Responsable por defecto: <strong className="text-[#1A2530]">{cat.defaultAssignedRole}</strong></div>
                    <div>Auto-escalado a supervisores: <strong className="text-red-700">{cat.autoEscalateHours} horas</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            7. AUDITORÍA INMUTABLE Y CONTROL DE CAMBIOS (GOVERNANCE)
            ===================================================================== */}
        {activeTab === 'auditoria' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif font-bold text-[#1A2530]">Registro de Auditoría y Control de Cambios</h2>
                <p className="text-xs text-[#2C3E50]/70">
                  Trazabilidad inmutable de todas las modificaciones, aprobaciones y publicaciones en la plataforma.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500">
                {config.auditLogs.length} eventos registrados
              </div>
            </div>

            {/* Certificado Oficial de Aislamiento Tenant Vault */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1A2530] via-[#243342] to-[#1A2530] text-white border-2 border-[#C5A880]/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#C5A880] text-[#1A2530] flex items-center justify-center shrink-0 shadow">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                      Certificación Aprobada · 100% de Pruebas Superadas
                    </span>
                    <span className="text-[10px] font-mono text-[#C5A880]">SEC-AUDIT-31E0ECE4</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white mt-1">
                    Certificado de Conformidad y Aislamiento Multiempresa
                  </h3>
                  <p className="text-xs text-white/80 max-w-xl mt-0.5">
                    Garantía técnica del motor Tenant Vault: partición estricta de base de datos, tokens criptográficos, prevención 403 de lectura/escritura/borrado cruzado e inmutabilidad de plantillas maestras.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A880] text-[#1A2530] hover:brightness-110 font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Ver Certificado Oficial</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm divide-y divide-[#E2E8F0]">
              {config.auditLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-[#F8F9FA] transition flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A2530] text-[#C5A880] flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs text-[#1A2530]">{log.entityName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold uppercase">
                          {log.actionType}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono">
                          {log.targetModule}
                        </span>
                      </div>

                      <p className="text-xs text-[#2C3E50]/80 mb-1">{log.summary}</p>
                      <div className="text-[10px] text-slate-400">
                        Ejecutado por <strong className="text-[#1A2530]">{log.operatorName}</strong> ({log.operatorRole}) el {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            8. MATRIZ DE ROLES Y PERMISOS (RBAC)
            ===================================================================== */}
        {activeTab === 'rbac' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-serif font-bold text-[#1A2530]">Gestión de Personal, Puestos y Asignación de Roles (RBAC)</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Control de Acceso Total
                  </span>
                </div>
                <p className="text-xs text-[#2C3E50]/70 mt-0.5">
                  <strong>Antonio González</strong> y <strong>Giacomo Longo</strong> tienen asignado el rol de <strong>Administrador</strong> con plenos permisos para modificar roles, altas/bajas de personal y actividades operativas.
                </p>
              </div>

              <button
                onClick={() => setIsNewOperatorModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] hover:bg-black font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Registrar Personal</span>
              </button>
            </div>

            {/* Listado Interactivo de Personal y Roles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A2530] flex items-center gap-2">
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>Personal del Establecimiento y Asignaciones Activas ({(config.operators || DEMO_OPERATORS).length})</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {(config.operators || DEMO_OPERATORS).map((op) => {
                  const isAdmin = op.role === 'admin_empresa' || op.role === 'admin_plataforma';
                  const isDeptHead = op.role === 'jefe_departamento';
                  const isSupervisor = op.role === 'supervisor';
                  const isWorker = op.role === 'trabajador';
                  const isAreaLead = op.role === 'responsable_area';
                  const isActive = op.status !== 'inactivo';

                  return (
                    <div
                      key={op.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-white border-[#E2E8F0] shadow-sm hover:border-[#C5A880]'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isAdmin ? 'bg-[#1A2530] text-[#C5A880] border-[#C5A880]/40' :
                          isDeptHead ? 'bg-blue-100 text-blue-900 border-blue-200' :
                          isSupervisor ? 'bg-amber-100 text-amber-900 border-amber-200' :
                          'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          {op.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-[#1A2530]">{op.name}</span>
                            
                            {/* Badge de Rol */}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                              isAdmin
                                ? 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold'
                                : isDeptHead
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : isSupervisor
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : isAreaLead
                                ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {op.role === 'admin_empresa' && '👑 Administrador de Establecimiento'}
                              {op.role === 'admin_plataforma' && '⚡ Administrador de Plataforma'}
                              {op.role === 'jefe_departamento' && '👨‍🍳 Jefe de Departamento'}
                              {op.role === 'responsable_area' && '📍 Responsable de Área'}
                              {op.role === 'supervisor' && '📋 Supervisor de Turno'}
                              {op.role === 'trabajador' && '👤 Trabajador Operativo'}
                            </span>

                            {/* Badge de Estado */}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {isActive ? 'Activo' : 'Inactivo / Apagado'}
                            </span>
                          </div>

                          <div className="text-xs text-[#2C3E50]/80 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            <span className="font-medium text-slate-700">{op.jobTitle || 'Personal Operativo'}</span>
                            <span>·</span>
                            <span className="text-slate-500 font-mono text-[11px]">{op.email}</span>
                            {op.assignedEstablishmentId && (
                              <>
                                <span>·</span>
                                <span className="text-slate-600">
                                  {op.assignedEstablishmentId === 'est-bitacora' ? 'Hotel Bitácora' : 'Hotel Vulcano'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botones de Acción: Encender/Apagar, Modificar Rol y Eliminar */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* 1. Botón Encender / Apagar */}
                        <button
                          onClick={() => {
                            const updated = { ...config };
                            const list = updated.operators || DEMO_OPERATORS;
                            const target = list.find(o => o.id === op.id);
                            if (target) {
                              target.status = target.status === 'inactivo' ? 'activo' : 'inactivo';
                              updated.operators = [...list];
                              proaAdminConfigService.recordAuditChange({
                                operatorId: currentOperator.id,
                                operatorName: currentOperator.name,
                                operatorRole: currentOperator.role,
                                targetModule: 'rbac',
                                actionType: 'modificacion',
                                entityId: op.id,
                                entityName: op.name,
                                summary: `Acceso del usuario ${op.name} cambiado a ${target.status}`
                              });
                              handleSaveAll(updated);
                              showToast(`Acceso de ${op.name} marcado como ${target.status}`);
                            }
                          }}
                          className={`px-2 py-1.5 rounded-lg border text-xs transition flex items-center gap-1 font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={isActive ? 'Apagar / Desactivar acceso' : 'Encender / Habilitar acceso'}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{isActive ? 'Apagar' : 'Encender'}</span>
                        </button>

                        {/* 2. Botón Modificar Rol */}
                        <button
                          onClick={() => setEditingOperator({ ...op })}
                          className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                          title="Modificar rol, permisos, cargo o asignaciones de esta persona"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Modificar Rol</span>
                        </button>

                        {/* 3. Botón Eliminar */}
                        <button
                          onClick={() => {
                            if (op.id === 'usr-antonio' || op.id === 'usr-giacomo') {
                              showToast('No se puede eliminar a los administradores principales del establecimiento.', 'warn');
                              return;
                            }
                            const updated = { ...config };
                            const list = updated.operators || DEMO_OPERATORS;
                            updated.operators = list.filter(o => o.id !== op.id);
                            proaAdminConfigService.recordAuditChange({
                              operatorId: currentOperator.id,
                              operatorName: currentOperator.name,
                              operatorRole: currentOperator.role,
                              targetModule: 'rbac',
                              actionType: 'eliminacion_segura',
                              entityId: op.id,
                              entityName: op.name,
                              summary: `Usuario ${op.name} eliminado de la organización.`
                            });
                            handleSaveAll(updated);
                            showToast(`Usuario ${op.name} retirado del personal.`);
                          }}
                          className="px-2 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 text-xs"
                          title="Eliminar del personal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matriz Técnica de Privilegios Operativos */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm mt-8">
              <div className="p-4 border-b border-[#E2E8F0] bg-[#F8F9FA]">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A2530]">
                  Matriz Comparativa de Privilegios por Rol Operativo
                </h4>
                <p className="text-[11px] text-[#2C3E50]/70">
                  Las validaciones se ejecutan tanto en la interfaz de usuario como de forma estricta en el servidor para evitar accesos cruzados.
                </p>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A2530] text-white text-[10px] uppercase font-mono">
                  <tr>
                    <th className="py-3 px-4">Rol Operativo</th>
                    <th className="py-3 px-3">Estructura</th>
                    <th className="py-3 px-3">Formularios & Tareas</th>
                    <th className="py-3 px-3">Documentación</th>
                    <th className="py-3 px-3">Fichas Técnicas</th>
                    <th className="py-3 px-3">Modificar Roles</th>
                    <th className="py-3 px-3">Publicar</th>
                    <th className="py-3 px-3">Eliminar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {[
                    { role: 'Administrador de Plataforma', rbacKey: 'admin_plataforma', struct: 'Total', forms: 'Total', docs: 'Total', ft: 'Total', roles: 'Total', pub: 'Sí', del: 'Segura' },
                    { role: 'Administrador de Empresa (ej. Antonio González / Giacomo Longo)', rbacKey: 'admin_empresa', struct: 'Su Hotel', forms: 'Su Hotel', docs: 'Su Hotel', ft: 'Su Hotel', roles: 'Pleno Poder', pub: 'Sí', del: 'Segura' },
                    { role: 'Jefe de Departamento', rbacKey: 'jefe_departamento', struct: 'Cocina', forms: 'Cocina', docs: 'Cocina', ft: 'Cocina', roles: 'Solo Lectura', pub: 'Sí', del: 'No' },
                    { role: 'Responsable de Área / Puesto', rbacKey: 'responsable_area', struct: 'No', forms: 'Su Puesto', docs: 'Lectura', ft: 'Su Puesto', roles: 'Sin Acceso', pub: 'Borrador', del: 'No' },
                    { role: 'Supervisor de Turno', rbacKey: 'supervisor', struct: 'Lectura', forms: 'Lectura', docs: 'Lectura', ft: 'Lectura', roles: 'Sin Acceso', pub: 'No', del: 'No' },
                    { role: 'Trabajador de Línea', rbacKey: 'trabajador', struct: 'Sin Acceso', forms: 'Sin Acceso', docs: 'Sin Acceso', ft: 'Sin Acceso', roles: 'Sin Acceso', pub: 'No', del: 'No' }
                  ].map((row, rIdx) => (
                    <tr key={rIdx} className={currentOperator.role === row.rbacKey ? 'bg-amber-50 font-semibold' : 'hover:bg-[#F8F9FA]'}>
                      <td className="py-3 px-4 text-[#1A2530]">
                        <div className="font-bold">{row.role}</div>
                        <div className="text-[10px] font-mono text-slate-500">{row.rbacKey}</div>
                      </td>
                      <td className="py-3 px-3">{row.struct}</td>
                      <td className="py-3 px-3">{row.forms}</td>
                      <td className="py-3 px-3">{row.docs}</td>
                      <td className="py-3 px-3">{row.ft}</td>
                      <td className="py-3 px-3 text-blue-700 font-bold">{row.roles}</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">{row.pub}</td>
                      <td className="py-3 px-3 text-red-700 font-bold">{row.del}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================================================
            9. GESTIÓN DE FOTOGRAFÍAS Y CHEFS DE HOTEL
            ===================================================================== */}
        {activeTab === 'chefs' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <User className="w-5 h-5 text-[#C5A880]" />
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1A2530]">
                    Configuración de Fotografías y Chefs Ejecutivos
                  </h3>
                </div>
                <p className="text-xs text-[#2C3E50]/80 mt-1 max-w-3xl leading-relaxed">
                  Configure las identidades, cargos y fotografías de los chefs de Hotel Bitácora y Hotel Vulcano.
                  Si todavía no dispone de una fotografía, puede dejar el campo vacío para que el sistema muestre automáticamente
                  un <strong>espacio reservado para añadirla posteriormente</strong>, sin inventar imágenes ficticias ni identidades.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold">
                  ✓ Sincronización Inmediata
                </span>
              </div>
            </div>

            {/* Grid con los dos Hoteles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD: HOTEL BITÁCORA */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#C5A880] shadow-sm space-y-5 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#C5A880]" />
                    <h4 className="font-bold text-base text-[#1A2530]">Cocina — Hotel Bitácora</h4>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Spring Hoteles
                  </span>
                </div>

                {/* Formulario Bitácora */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nombre del Chef:</label>
                    <input
                      type="text"
                      value={editingChefBitacora.chefName}
                      onChange={(e) => setEditingChefBitacora({ ...editingChefBitacora, chefName: e.target.value })}
                      placeholder="Ej. Antonio González"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Cargo / Título Oficial:</label>
                    <input
                      type="text"
                      value={editingChefBitacora.roleTitle}
                      onChange={(e) => setEditingChefBitacora({ ...editingChefBitacora, roleTitle: e.target.value })}
                      placeholder="Ej. Chef Ejecutivo de Cocina"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">URL de la Fotografía:</label>
                    <input
                      type="text"
                      value={editingChefBitacora.photoUrl}
                      onChange={(e) => setEditingChefBitacora({ ...editingChefBitacora, photoUrl: e.target.value })}
                      placeholder="Ruta local o URL (dejar vacío para espacio reservado)"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880] font-mono text-[11px]"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditingChefBitacora({
                          ...editingChefBitacora,
                          photoUrl: '/assets/aistudio/chef1_6d694bfa.jfif'
                        })}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 transition"
                      >
                        📷 Restaurar Foto Antonio González
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingChefBitacora({
                          ...editingChefBitacora,
                          photoUrl: ''
                        })}
                        className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[10px] font-semibold text-amber-800 border border-amber-200 transition"
                      >
                        ⬜ Dejar Vacío (Espacio Reservado)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Biografía / Declaración Profesional:</label>
                    <textarea
                      rows={3}
                      value={editingChefBitacora.bio}
                      onChange={(e) => setEditingChefBitacora({ ...editingChefBitacora, bio: e.target.value })}
                      placeholder="Trayectoria o cita del chef..."
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Previsualización en Vivo Bitácora */}
                <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-200 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Vista Previa de la Tarjeta
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    {editingChefBitacora.photoUrl ? (
                      <img
                        src={editingChefBitacora.photoUrl}
                        alt={editingChefBitacora.chefName}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-[#C5A880] shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-1 text-center shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-[8px] text-gray-500 leading-tight">Espacio reservado</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-[#1A2530] truncate">
                        {editingChefBitacora.chefName || '(Sin nombre configurado)'}
                      </div>
                      <div className="text-[11px] text-[#C5A880] font-semibold truncate">
                        {editingChefBitacora.roleTitle}
                      </div>
                      <div className="text-[10px] text-gray-500 italic line-clamp-1 mt-0.5">
                        “{editingChefBitacora.bio}”
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción Bitácora */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const res = chefConfigService.resetProfile('model-bitacora');
                      setEditingChefBitacora({ ...res });
                      showToast('Configuración del Chef de Bitácora restaurada a predeterminados.');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs text-gray-600 font-bold transition"
                  >
                    Restaurar Inicial
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      chefConfigService.saveProfile('model-bitacora', editingChefBitacora);
                      showToast('Fotografía y perfil de Chef de Hotel Bitácora guardados.');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1A2530] hover:bg-black text-[#C5A880] font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Chef Bitácora</span>
                  </button>
                </div>
              </div>

              {/* CARD: HOTEL VULCANO */}
              <div className="bg-white p-6 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#C5A880] shadow-sm space-y-5 transition-all">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-600" />
                    <h4 className="font-bold text-base text-[#1A2530]">Cocina — Hotel Vulcano</h4>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    Alta Gastronomía
                  </span>
                </div>

                {/* Formulario Vulcano */}
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nombre del Chef:</label>
                    <input
                      type="text"
                      value={editingChefVulcano.chefName}
                      onChange={(e) => setEditingChefVulcano({ ...editingChefVulcano, chefName: e.target.value })}
                      placeholder="Ej. Giacomo Longo"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Cargo / Título Oficial:</label>
                    <input
                      type="text"
                      value={editingChefVulcano.roleTitle}
                      onChange={(e) => setEditingChefVulcano({ ...editingChefVulcano, roleTitle: e.target.value })}
                      placeholder="Ej. Chef Ejecutivo & Alta Cocina de Autor"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">URL de la Fotografía:</label>
                    <input
                      type="text"
                      value={editingChefVulcano.photoUrl}
                      onChange={(e) => setEditingChefVulcano({ ...editingChefVulcano, photoUrl: e.target.value })}
                      placeholder="Ruta local o URL (dejar vacío para espacio reservado)"
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880] font-mono text-[11px]"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditingChefVulcano({
                          ...editingChefVulcano,
                          photoUrl: '/assets/aistudio/chef2_7a8fd6b5.png'
                        })}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 transition"
                      >
                        📷 Restaurar Foto Giacomo Longo
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingChefVulcano({
                          ...editingChefVulcano,
                          photoUrl: ''
                        })}
                        className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-[10px] font-semibold text-amber-800 border border-amber-200 transition"
                      >
                        ⬜ Dejar Vacío (Espacio Reservado)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Biografía / Declaración Profesional:</label>
                    <textarea
                      rows={3}
                      value={editingChefVulcano.bio}
                      onChange={(e) => setEditingChefVulcano({ ...editingChefVulcano, bio: e.target.value })}
                      placeholder="Trayectoria o descripción del chef..."
                      className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {/* Previsualización en Vivo Vulcano */}
                <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-200 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Vista Previa de la Tarjeta
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    {editingChefVulcano.photoUrl ? (
                      <img
                        src={editingChefVulcano.photoUrl}
                        alt={editingChefVulcano.chefName}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-sky-400 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-1 text-center shrink-0">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-[8px] text-gray-500 leading-tight">Espacio reservado</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-[#1A2530] truncate">
                        {editingChefVulcano.chefName || '(Sin nombre configurado)'}
                      </div>
                      <div className="text-[11px] text-sky-600 font-semibold truncate">
                        {editingChefVulcano.roleTitle}
                      </div>
                      <div className="text-[10px] text-gray-500 italic line-clamp-1 mt-0.5">
                        “{editingChefVulcano.bio}”
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción Vulcano */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const res = chefConfigService.resetProfile('model-vulcano');
                      setEditingChefVulcano({ ...res });
                      showToast('Configuración del Chef de Vulcano restaurada a predeterminados.');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-xs text-gray-600 font-bold transition"
                  >
                    Restaurar Inicial
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      chefConfigService.saveProfile('model-vulcano', editingChefVulcano);
                      showToast('Fotografía y perfil de Chef de Hotel Vulcano guardados.');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#1A2530] hover:bg-black text-[#C5A880] font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Chef Vulcano</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: PREVISUALIZACIÓN MÓVIL EN VIVO (SMARTPHONE SIMULATOR)
          ========================================================================= */}
      {mobilePreviewOpen && activeForm && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A2530] p-4 rounded-[40px] shadow-2xl border-4 border-slate-700 max-w-sm w-full animate-in zoom-in-95">
            {/* Altavoz y Cámara simulada */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>

            {/* Pantalla del Teléfono */}
            <div className="bg-[#F8F9FA] rounded-[28px] overflow-hidden text-[#2C3E50] border border-slate-600 flex flex-col h-[580px]">
              {/* Barra de Estado del Móvil */}
              <div className="bg-[#1A2530] text-white px-4 py-2 flex items-center justify-between text-[11px] font-mono">
                <span>09:41</span>
                <span>PROA Mobile · 5G</span>
              </div>

              {/* Contenido del Formulario en Móvil */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
                  <div className="text-[10px] font-mono font-bold text-[#C5A880] uppercase">{activeForm.code} · {activeForm.version}</div>
                  <h3 className="font-serif font-bold text-sm text-[#1A2530]">{activeForm.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{activeForm.description}</p>
                </div>

                <div className="space-y-3">
                  {activeForm.fields.map(fld => (
                    <div key={fld.id} className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm">
                      <label className="block text-xs font-bold text-[#1A2530] mb-1">
                        {fld.label} {fld.required && <span className="text-red-600">*</span>}
                      </label>

                      {fld.type === 'number' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="0.0"
                            className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                          />
                          {fld.unit && <span className="text-xs font-mono font-bold text-slate-500">{fld.unit}</span>}
                        </div>
                      )}

                      {fld.type === 'select' && (
                        <select className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] focus:outline-none">
                          {fld.options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {fld.type === 'checkbox' && (
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input type="checkbox" className="rounded text-[#C5A880] focus:ring-0" />
                          <span>Conforme y verificado</span>
                        </label>
                      )}

                      {fld.type === 'signature' && (
                        <div className="h-16 bg-[#F8F9FA] rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          [ Toca para firmar en pantalla ]
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Enviar en Móvil */}
              <div className="p-3 bg-white border-t border-[#E2E8F0]">
                <button
                  onClick={() => setMobilePreviewOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1A2530] text-white text-xs font-bold hover:bg-black transition text-center shadow"
                >
                  Cerrar Previsualización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PUBLICAR NUEVA VERSIÓN DE FORMULARIO
          ========================================================================= */}
      {isPublishModalOpen && activeForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-base text-[#1A2530] mb-1">
              Publicar Versión Actualizada
            </h3>
            <p className="text-xs text-[#2C3E50]/70 mb-4">
              Esta acción incrementará la versión del formulario ({activeForm.version} → siguiente) y actualizará la plantilla para todos los trabajadores sin alterar los registros históricos previos.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Resumen del Cambio (Changelog):</label>
                <textarea
                  value={publishChangelogText}
                  onChange={(e) => setPublishChangelogText(e.target.value)}
                  placeholder="Ej. Se incorpora nuevo umbral térmico y firma obligatoria..."
                  rows={3}
                  className="w-full text-xs p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Los registros completados anteriormente mantendrán su versión ({activeForm.version}) para garantizar la trazabilidad legal en auditorías sanitarias.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  proaAdminConfigService.publishFormVersion(
                    activeForm.id,
                    publishChangelogText || 'Actualización de formulario',
                    currentOperator.name
                  );
                  setIsPublishModalOpen(false);
                  setPublishChangelogText('');
                  setConfig(proaAdminConfigService.getConfigPayload());
                  showToast('Formulario publicado exitosamente con nueva versión.');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-bold hover:bg-[#b0936b] transition shadow"
              >
                Confirmar y Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: COMPROBACIÓN DE ELIMINACIÓN SEGURA
          ========================================================================= */}
      {safeDeletionData && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                safeDeletionData.checkResult.canDeletePhysically ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                {safeDeletionData.checkResult.canDeletePhysically ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1A2530]">
                  Comprobación de Eliminación Segura
                </h3>
                <div className="text-xs text-slate-500 font-medium">{safeDeletionData.entityName}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] mb-5 text-xs text-[#2C3E50] leading-relaxed">
              <p className="mb-2">{safeDeletionData.checkResult.explanation}</p>
              {safeDeletionData.checkResult.historicalCount > 0 && (
                <div className="font-bold text-red-700">
                  ⚠️ Registros sanitarios vinculados: {safeDeletionData.checkResult.historicalCount}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSafeDeletionData(null)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>

              {/* Si se recomienda archivar o desactivar */}
              {!safeDeletionData.checkResult.canDeletePhysically ? (
                <button
                  onClick={() => {
                    const updated = { ...config };
                    const node = updated.structures.find(s => s.id === safeDeletionData.entityId);
                    if (node) {
                      node.status = 'archivado';
                      proaAdminConfigService.recordAuditChange({
                        operatorId: currentOperator.id,
                        operatorName: currentOperator.name,
                        operatorRole: currentOperator.role,
                        targetModule: 'estructura',
                        actionType: 'archivo',
                        entityId: node.id,
                        entityName: node.name,
                        summary: 'Elemento archivado para proteger trazabilidad sanitaria de sus registros.'
                      });
                      handleSaveAll(updated);
                      showToast(`Elemento archivado con éxito. Se preservaron todos los registros históricos.`);
                    }
                    setSafeDeletionData(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition shadow"
                >
                  Archivar de Forma Segura
                </button>
              ) : (
                <button
                  onClick={() => {
                    const updated = { ...config };
                    updated.structures = updated.structures.filter(s => s.id !== safeDeletionData.entityId);
                    proaAdminConfigService.recordAuditChange({
                      operatorId: currentOperator.id,
                      operatorName: currentOperator.name,
                      operatorRole: currentOperator.role,
                      targetModule: 'estructura',
                      actionType: 'eliminacion_segura',
                      entityId: safeDeletionData.entityId,
                      entityName: safeDeletionData.entityName,
                      summary: 'Eliminación física definitiva tras verificar ausencia de dependencias e históricos.'
                    });
                    handleSaveAll(updated);
                    setSafeDeletionData(null);
                    showToast('Elemento eliminado definitivamente.');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition shadow"
                >
                  Eliminar Definitivamente
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AÑADIR ELEMENTO A ESTRUCTURA
          ========================================================================= */}
      {isNewStructureModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-base text-[#1A2530] mb-3">
              Nuevo Elemento Organizativo
            </h3>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Nivel:</label>
                <select
                  value={newStructureType}
                  onChange={(e) => setNewStructureType(e.target.value as StructureNodeType)}
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                >
                  <option value="establishment">Establecimiento (Hotel)</option>
                  <option value="department">Departamento</option>
                  <option value="area">Área Operativa de Cocina / Sala</option>
                  <option value="equipment">Equipo / Punto de Control</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Nombre:</label>
                <input
                  type="text"
                  value={newStructureName}
                  onChange={(e) => setNewStructureName(e.target.value)}
                  placeholder="Ej. Cocina Caliente — Pase Nocturno"
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Código:</label>
                <input
                  type="text"
                  value={newStructureCode}
                  onChange={(e) => setNewStructureCode(e.target.value)}
                  placeholder="Ej. ST-PAS-NOC"
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Responsable Asignado:</label>
                <input
                  type="text"
                  value={newStructureLead}
                  onChange={(e) => setNewStructureLead(e.target.value)}
                  placeholder="Ej. Antonio González / Jefe de Partida"
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewStructureModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newStructureName.trim()) return;
                  const updated = { ...config };
                  updated.structures.push({
                    id: `str-${Date.now().toString(36)}`,
                    type: newStructureType,
                    parentId: newStructureParentId,
                    name: newStructureName.trim(),
                    code: newStructureCode.trim() || `COD-${Date.now().toString(36).slice(-4).toUpperCase()}`,
                    description: newStructureDesc.trim(),
                    leadName: newStructureLead.trim(),
                    sortOrder: updated.structures.length + 1,
                    status: 'activo',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  handleSaveAll(updated);
                  setIsNewStructureModalOpen(false);
                  setNewStructureName('');
                  setNewStructureCode('');
                  showToast('Nuevo elemento organizativo añadido con éxito.');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-bold hover:bg-[#b0936b] transition shadow"
              >
                Crear Elemento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AÑADIR CAMPO AL FORMULARIO ACTIVO
          ========================================================================= */}
      {isAddFieldModalOpen && activeForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <h3 className="font-serif font-bold text-base text-[#1A2530] mb-3">
              Añadir Campo a Formulario
            </h3>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Etiqueta del Campo:</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="Ej. Temperatura de Cámara Fría"
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">Tipo de Campo:</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as FormFieldType)}
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                >
                  <option value="number">Número (con rangos y alertas)</option>
                  <option value="text">Texto</option>
                  <option value="select">Lista Desplegable (Select)</option>
                  <option value="checkbox">Casilla de Verificación (Sí/No)</option>
                  <option value="photo">Evidencia Fotográfica</option>
                  <option value="signature">Firma Digital</option>
                  <option value="date">Fecha</option>
                  <option value="time">Hora</option>
                </select>
              </div>

              {newFieldType === 'number' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Mínimo:</label>
                    <input
                      type="number"
                      value={newFieldMin ?? ''}
                      onChange={(e) => setNewFieldMin(parseFloat(e.target.value))}
                      className="w-full text-xs p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Máximo:</label>
                    <input
                      type="number"
                      value={newFieldMax ?? ''}
                      onChange={(e) => setNewFieldMax(parseFloat(e.target.value))}
                      className="w-full text-xs p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Unidad:</label>
                    <input
                      type="text"
                      value={newFieldUnit}
                      onChange={(e) => setNewFieldUnit(e.target.value)}
                      placeholder="ºC"
                      className="w-full text-xs p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                </div>
              )}

              {newFieldType === 'select' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1A2530] mb-1">Opciones (separadas por coma):</label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Opción 1, Opción 2, Opción 3"
                    className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="rounded text-[#C5A880] focus:ring-0"
                />
                <span>Campo Obligatorio</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddFieldModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newFieldLabel.trim()) return;
                  const updated = { ...config };
                  const form = updated.forms.find(f => f.id === activeForm.id);
                  if (form) {
                    const newFld: FormFieldDefinition = {
                      id: `fld-${Date.now().toString(36)}`,
                      label: newFieldLabel.trim(),
                      type: newFieldType,
                      required: newFieldRequired,
                      order: form.fields.length + 1,
                      minValue: newFieldMin,
                      maxValue: newFieldMax,
                      unit: newFieldUnit,
                      options: newFieldType === 'select' ? newFieldOptions.split(',').map(s => s.trim()) : undefined
                    };
                    form.fields.push(newFld);
                    handleSaveAll(updated);
                    setIsAddFieldModalOpen(false);
                    setNewFieldLabel('');
                    showToast('Campo añadido al formulario.');
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-bold hover:bg-[#b0936b] transition shadow"
              >
                Añadir al Formulario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: NUEVA FICHA TÉCNICA
          ========================================================================= */}
      {isNewSheetModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-[#1A2530] mb-2">
              Nueva Ficha Técnica Estandarizada
            </h3>
            <p className="text-xs text-[#2C3E50]/70 mb-4">
              Cumple con el estándar de Dirección de Operaciones F&B. Medidas exactas, flujo en primera persona plural y declaración de alérgenos.
            </p>

            <div className="space-y-3.5 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A2530] mb-1">Nombre:</label>
                  <input
                    type="text"
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    placeholder="Ej. Solomillo de vaca madurada"
                    className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A2530] mb-1">Código Ficha:</label>
                  <input
                    type="text"
                    value={newSheetCode}
                    onChange={(e) => setNewSheetCode(e.target.value)}
                    placeholder="Ej. FT-CAL-05"
                    className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">
                  Formulación (Líneas con: [Medida exacta] | [Ingrediente técnico]):
                </label>
                <textarea
                  value={newSheetFormulationRaw}
                  onChange={(e) => setNewSheetFormulationRaw(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1">
                  Flujo de Elaboración (Verbos en 1ª persona plural: Añadimos, Marcamos...):
                </label>
                <textarea
                  value={newSheetElaborationRaw}
                  onChange={(e) => setNewSheetElaborationRaw(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A2530] mb-1">Cristalería y Útiles:</label>
                  <input
                    type="text"
                    value={newSheetGlassware}
                    onChange={(e) => setNewSheetGlassware(e.target.value)}
                    placeholder="Ej. Plato cerámico 28cm precalentado a 60ºC"
                    className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A2530] mb-1">Diagnóstico Sensorial:</label>
                  <input
                    type="text"
                    value={newSheetSensory}
                    onChange={(e) => setNewSheetSensory(e.target.value)}
                    placeholder="Ej. Perfil cárnico umami con notas tostadas..."
                    className="w-full text-xs p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              </div>

              {/* Selector de Alérgenos */}
              <div>
                <label className="block text-xs font-semibold text-[#1A2530] mb-1.5">
                  Alérgenos Presentes (Normativa Sanitaria UE):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                  {EU_14_ALLERGENS.map(al => {
                    const selected = newSheetAllergens.includes(al.id);
                    return (
                      <button
                        key={al.id}
                        type="button"
                        onClick={() => {
                          setNewSheetAllergens(prev => 
                            selected ? prev.filter(x => x !== al.id) : [...prev, al.id]
                          );
                        }}
                        className={`text-[11px] px-2 py-1 rounded-md border font-semibold transition ${
                          selected
                            ? 'bg-red-50 text-red-800 border-red-300 shadow-xs'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {al.icon} {al.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewSheetModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newSheetName.trim()) return;
                  // Parsear formulación
                  const formulation = newSheetFormulationRaw.split('\n').filter(l => l.trim()).map(line => {
                    const parts = line.split('|');
                    return {
                      measure: parts[0]?.trim() || '1 un.',
                      name: parts[1]?.trim() || line.trim(),
                      technicalNaming: parts[1]?.trim() || line.trim(),
                      costApprox: 0.50
                    };
                  });

                  // Parsear pasos
                  const elaborationFlow = newSheetElaborationRaw.split('\n').filter(l => l.trim());

                  const updated = { ...config };
                  const newSheet: AdminTechnicalSheet = {
                    id: `ft-${Date.now().toString(36)}`,
                    name: newSheetName.trim(),
                    code: newSheetCode.trim() || `FT-${Date.now().toString(36).slice(-4).toUpperCase()}`,
                    category: newSheetCategory,
                    categoryLabel: 'Cocina Caliente',
                    establishmentId: 'est-bitacora',
                    departmentId: 'dep-bitacora-cocina',
                    servings: newSheetServings,
                    formulation,
                    elaborationFlow,
                    glasswareAndTools: newSheetGlassware.trim() || 'Vajilla estándar',
                    sensoryDiagnosis: newSheetSensory.trim() || 'Perfil equilibrado y balanceado.',
                    allergens: newSheetAllergens,
                    costPerServing: newSheetCost,
                    sellingPrice: newSheetPrice,
                    foodCostPercentage: Number(((newSheetCost / newSheetPrice) * 100).toFixed(1)),
                    version: 'v1.0',
                    status: 'vigente',
                    effectiveDate: new Date().toISOString().split('T')[0],
                    author: currentOperator.name,
                    approverName: currentOperator.name,
                    approvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  };

                  updated.technicalSheets.push(newSheet);
                  proaAdminConfigService.recordAuditChange({
                    operatorId: currentOperator.id,
                    operatorName: currentOperator.name,
                    operatorRole: currentOperator.role,
                    targetModule: 'fichas_tecnicas',
                    actionType: 'creacion',
                    entityId: newSheet.id,
                    entityName: newSheet.name,
                    summary: `Creación y aprobación de nueva Ficha Técnica '${newSheet.name}' con ${newSheetAllergens.length} alérgenos declarados.`
                  });
                  handleSaveAll(updated);
                  setIsNewSheetModalOpen(false);
                  setSelectedSheetId(newSheet.id);
                  showToast('Nueva Ficha Técnica creada y validada con éxito.');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-bold hover:bg-[#b0936b] transition shadow"
              >
                Guardar y Validar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFICAR ELEMENTO DE ESTRUCTURA ORGANIZATIVA
          ========================================================================= */}
      {editingStructure && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2530]">
                    Modificar Elemento Organizativo
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">{editingStructure.code}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingStructure(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Nombre del Elemento (*):</label>
                <input
                  type="text"
                  value={editingStructure.name}
                  onChange={(e) => setEditingStructure({ ...editingStructure, name: e.target.value })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Código Identificador:</label>
                  <input
                    type="text"
                    value={editingStructure.code}
                    onChange={(e) => setEditingStructure({ ...editingStructure, code: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Nivel / Tipo:</label>
                  <select
                    value={editingStructure.type}
                    onChange={(e) => setEditingStructure({ ...editingStructure, type: e.target.value as StructureNodeType })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="establishment">Establecimiento (Hotel)</option>
                    <option value="department">Departamento</option>
                    <option value="area">Área Operativa de Cocina / Sala</option>
                    <option value="pos">Punto de Venta (P.O.S.)</option>
                    <option value="zone">Zona de Trabajo</option>
                    <option value="shift">Turno</option>
                    <option value="equipment">Equipo / Punto de Control</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Descripción Operativa:</label>
                <textarea
                  value={editingStructure.description || ''}
                  onChange={(e) => setEditingStructure({ ...editingStructure, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Responsable Asignado:</label>
                  <input
                    type="text"
                    value={editingStructure.leadName || ''}
                    onChange={(e) => setEditingStructure({ ...editingStructure, leadName: e.target.value })}
                    placeholder="Ej. Antonio González"
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Cargo / Puesto:</label>
                  <input
                    type="text"
                    value={editingStructure.leadRole || ''}
                    onChange={(e) => setEditingStructure({ ...editingStructure, leadRole: e.target.value })}
                    placeholder="Ej. Chef Ejecutivo"
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Estado Operativo:</label>
                  <select
                    value={editingStructure.status}
                    onChange={(e) => setEditingStructure({ ...editingStructure, status: e.target.value as any })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="activo">Activo (Operativo)</option>
                    <option value="inactivo">Inactivo / Apagado</option>
                    <option value="archivado">Archivado (Histórico)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Punto de Control Crítico (PCC):</label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingStructure.metadata?.criticalControlPoint}
                      onChange={(e) => setEditingStructure({
                        ...editingStructure,
                        metadata: { ...editingStructure.metadata, criticalControlPoint: e.target.checked }
                      })}
                      className="rounded text-[#C5A880] focus:ring-0"
                    />
                    <span className="text-xs text-slate-700">Requiere control APPCC</span>
                  </label>
                </div>
              </div>

              {/* Rango de temperatura si es equipo */}
              {editingStructure.type === 'equipment' && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="font-semibold text-amber-900 mb-2">Parámetros Térmicos APPCC</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-semibold">Tª Mínima:</label>
                      <input
                        type="number"
                        value={editingStructure.metadata?.tempMin ?? ''}
                        onChange={(e) => setEditingStructure({
                          ...editingStructure,
                          metadata: { ...editingStructure.metadata, tempMin: parseFloat(e.target.value) }
                        })}
                        className="w-full p-1.5 bg-white rounded border border-amber-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-semibold">Tª Máxima:</label>
                      <input
                        type="number"
                        value={editingStructure.metadata?.tempMax ?? ''}
                        onChange={(e) => setEditingStructure({
                          ...editingStructure,
                          metadata: { ...editingStructure.metadata, tempMax: parseFloat(e.target.value) }
                        })}
                        className="w-full p-1.5 bg-white rounded border border-amber-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-semibold">Unidad:</label>
                      <input
                        type="text"
                        value={editingStructure.metadata?.unit || 'ºC'}
                        onChange={(e) => setEditingStructure({
                          ...editingStructure,
                          metadata: { ...editingStructure.metadata, unit: e.target.value }
                        })}
                        className="w-full p-1.5 bg-white rounded border border-amber-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setEditingStructure(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!editingStructure.name.trim()) return;
                  const updated = { ...config };
                  const idx = updated.structures.findIndex(s => s.id === editingStructure.id);
                  if (idx >= 0) {
                    updated.structures[idx] = {
                      ...editingStructure,
                      updatedAt: new Date().toISOString()
                    };
                    proaAdminConfigService.recordAuditChange({
                      operatorId: currentOperator.id,
                      operatorName: currentOperator.name,
                      operatorRole: currentOperator.role,
                      targetModule: 'estructura',
                      actionType: 'modificacion',
                      entityId: editingStructure.id,
                      entityName: editingStructure.name,
                      summary: `Modificación de parámetros, responsable y estado del elemento organizativo '${editingStructure.name}'.`
                    });
                    handleSaveAll(updated);
                    setEditingStructure(null);
                    showToast(`Elemento organizativo '${editingStructure.name}' modificado correctamente.`);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] text-xs font-bold hover:brightness-110 transition shadow cursor-pointer"
              >
                Guardar Modificaciones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFICAR ROL Y PERSONAL (RBAC)
          ========================================================================= */}
      {editingOperator && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2530]">
                    Modificar Rol y Privilegios del Usuario
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">{editingOperator.name}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingOperator(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Nombre Completo (*):</label>
                  <input
                    type="text"
                    value={editingOperator.name}
                    onChange={(e) => setEditingOperator({ ...editingOperator, name: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Correo Electrónico (*):</label>
                  <input
                    type="email"
                    value={editingOperator.email}
                    onChange={(e) => setEditingOperator({ ...editingOperator, email: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Cargo / Puesto Funcional:</label>
                <input
                  type="text"
                  value={editingOperator.jobTitle || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, jobTitle: e.target.value })}
                  placeholder="Ej. Chef Ejecutivo / Cocinero de Partida / Bartender"
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              {/* SELECTOR DE ROL OPERATIVO */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                <label className="block font-bold text-blue-950">Rol de Seguridad y Permisos (RBAC) (*):</label>
                <select
                  value={editingOperator.role}
                  onChange={(e) => setEditingOperator({ ...editingOperator, role: e.target.value as ProaAdminRole })}
                  className="w-full p-2.5 bg-white rounded-lg border border-blue-300 font-semibold text-[#1A2530] focus:ring-1 focus:ring-[#C5A880]"
                >
                  <option value="admin_empresa">👑 Administrador de Establecimiento (Hotel) — Control Total de Roles, Fichas y Actividades</option>
                  <option value="admin_plataforma">⚡ Administrador de Plataforma — Gestión Global de Organizaciones</option>
                  <option value="jefe_departamento">👨‍🍳 Jefe de Departamento (Chef / Maître) — Edición de Contenidos de Cocina</option>
                  <option value="responsable_area">📍 Responsable de Área / Puesto — Cumplimentación y Borradores</option>
                  <option value="supervisor">📋 Supervisor de Turno — Validación y Auditoría (Solo Lectura)</option>
                  <option value="trabajador">👤 Trabajador Operativo — Ejecución y Firma Diaria</option>
                </select>

                <div className="text-[11px] text-blue-800 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-blue-100">
                  {editingOperator.role === 'admin_empresa' && (
                    <span><strong>Permisos Administrador:</strong> Acceso total al panel de administración. Puede modificar roles de personas, altas/bajas de personal, activar/desactivar actividades, publicar formularios y gestionar toda la gobernanza técnica de su establecimiento.</span>
                  )}
                  {editingOperator.role === 'admin_plataforma' && (
                    <span><strong>Permisos Superadmin:</strong> Acceso integral de plataforma a través de todos los establecimientos y organizaciones.</span>
                  )}
                  {editingOperator.role === 'jefe_departamento' && (
                    <span><strong>Permisos Jefatura:</strong> Puede editar fichas técnicas, protocolos de limpieza y formularios de su departamento. No puede reasignar roles de usuarios administradores.</span>
                  )}
                  {editingOperator.role === 'supervisor' && (
                    <span><strong>Permisos Supervisión:</strong> Supervisa registros sanitarios y firmas sin permiso de modificación de estructura ni roles.</span>
                  )}
                  {editingOperator.role === 'trabajador' && (
                    <span><strong>Permisos Operativos:</strong> Consulta información de servicio y completa sus tareas asignadas sin acceso al panel administrativo.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Establecimiento Asignado:</label>
                  <select
                    value={editingOperator.assignedEstablishmentId || 'est-bitacora'}
                    onChange={(e) => setEditingOperator({ ...editingOperator, assignedEstablishmentId: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="est-bitacora">Hotel Bitácora</option>
                    <option value="est-vulcano">Hotel Vulcano</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Departamento:</label>
                  <select
                    value={editingOperator.assignedDepartmentId || 'dep-bitacora-cocina'}
                    onChange={(e) => setEditingOperator({ ...editingOperator, assignedDepartmentId: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="dep-bitacora-cocina">Cocina & Gastronomía (Bitácora)</option>
                    <option value="dep-vulcano-cocina">Cocina & Gastronomía (Vulcano)</option>
                    <option value="dep-fnb">F&B / Bares</option>
                    <option value="dep-sala">Restaurante & Sala</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Estado de Acceso:</label>
                <select
                  value={editingOperator.status || 'activo'}
                  onChange={(e) => setEditingOperator({ ...editingOperator, status: e.target.value as any })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                >
                  <option value="activo">Activo (Acceso Autorizado)</option>
                  <option value="inactivo">Inactivo / Apagado (Acceso Bloqueado)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setEditingOperator(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!editingOperator.name.trim() || !editingOperator.email.trim()) return;
                  const updated = { ...config };
                  const list = updated.operators || DEMO_OPERATORS;
                  const idx = list.findIndex(o => o.id === editingOperator.id);
                  if (idx >= 0) {
                    list[idx] = { ...editingOperator };
                  } else {
                    list.push(editingOperator);
                  }
                  updated.operators = [...list];

                  // Si se editó el operador actualmente en sesión, actualizar sesión
                  if (currentOperator.id === editingOperator.id) {
                    setCurrentOperator({ ...editingOperator });
                  }

                  proaAdminConfigService.recordAuditChange({
                    operatorId: currentOperator.id,
                    operatorName: currentOperator.name,
                    operatorRole: currentOperator.role,
                    targetModule: 'rbac',
                    actionType: 'modificacion',
                    entityId: editingOperator.id,
                    entityName: editingOperator.name,
                    summary: `Rol y permisos del usuario '${editingOperator.name}' modificados a '${editingOperator.role}'.`
                  });
                  handleSaveAll(updated);
                  setEditingOperator(null);
                  showToast(`Rol de ${editingOperator.name} actualizado con éxito a ${editingOperator.role}.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-[#1A2530] text-xs font-bold hover:bg-[#b0936b] transition shadow cursor-pointer"
              >
                Guardar Modificación de Rol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REGISTRAR NUEVO PERSONAL (RBAC)
          ========================================================================= */}
      {isNewOperatorModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-serif font-bold text-base text-[#1A2530]">
                Registrar Nuevo Personal y Asignar Rol
              </h3>
              <button
                onClick={() => setIsNewOperatorModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Nombre Completo (*):</label>
                  <input
                    type="text"
                    value={newOpName}
                    onChange={(e) => setNewOpName(e.target.value)}
                    placeholder="Ej. Roberto Sánchez"
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Correo Electrónico (*):</label>
                  <input
                    type="email"
                    value={newOpEmail}
                    onChange={(e) => setNewOpEmail(e.target.value)}
                    placeholder="rsanchez@hotelbitacora.com"
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Cargo / Puesto:</label>
                <input
                  type="text"
                  value={newOpJobTitle}
                  onChange={(e) => setNewOpJobTitle(e.target.value)}
                  placeholder="Ej. Jefe de Partida Caliente"
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Rol de Acceso (RBAC):</label>
                <select
                  value={newOpRole}
                  onChange={(e) => setNewOpRole(e.target.value as ProaAdminRole)}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] font-semibold text-[#1A2530]"
                >
                  <option value="admin_empresa">👑 Administrador de Establecimiento</option>
                  <option value="jefe_departamento">👨‍🍳 Jefe de Departamento</option>
                  <option value="responsable_area">📍 Responsable de Área</option>
                  <option value="supervisor">📋 Supervisor de Turno</option>
                  <option value="trabajador">👤 Trabajador Operativo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Establecimiento:</label>
                  <select
                    value={newOpEstablishment}
                    onChange={(e) => setNewOpEstablishment(e.target.value)}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="est-bitacora">Hotel Bitácora</option>
                    <option value="est-vulcano">Hotel Vulcano</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Departamento:</label>
                  <select
                    value={newOpDepartment}
                    onChange={(e) => setNewOpDepartment(e.target.value)}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="dep-bitacora-cocina">Cocina & Gastronomía (Bitácora)</option>
                    <option value="dep-vulcano-cocina">Cocina & Gastronomía (Vulcano)</option>
                    <option value="dep-fnb">F&B / Bares</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setIsNewOperatorModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newOpName.trim() || !newOpEmail.trim()) return;
                  const newOp: AdminUserOperator = {
                    id: `usr-${Date.now().toString(36)}`,
                    name: newOpName.trim(),
                    email: newOpEmail.trim(),
                    role: newOpRole,
                    jobTitle: newOpJobTitle.trim() || 'Personal Operativo',
                    status: 'activo',
                    assignedEstablishmentId: newOpEstablishment,
                    assignedDepartmentId: newOpDepartment
                  };

                  const updated = { ...config };
                  const list = updated.operators || DEMO_OPERATORS;
                  updated.operators = [...list, newOp];

                  proaAdminConfigService.recordAuditChange({
                    operatorId: currentOperator.id,
                    operatorName: currentOperator.name,
                    operatorRole: currentOperator.role,
                    targetModule: 'rbac',
                    actionType: 'creacion',
                    entityId: newOp.id,
                    entityName: newOp.name,
                    summary: `Alta de nuevo usuario '${newOp.name}' con rol '${newOp.role}'.`
                  });
                  handleSaveAll(updated);
                  setIsNewOperatorModalOpen(false);
                  setNewOpName('');
                  setNewOpEmail('');
                  setNewOpJobTitle('');
                  showToast(`Nuevo personal '${newOp.name}' incorporado con éxito.`);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] text-xs font-bold hover:brightness-110 transition shadow cursor-pointer"
              >
                Registrar Personal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFICAR PROTOCOLO DE LIMPIEZA / ACTIVIDAD
          ========================================================================= */}
      {editingCleaningTask && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A2530]">
                    Modificar Protocolo de Limpieza / Actividad
                  </h3>
                  <div className="text-[11px] text-slate-500">{editingCleaningTask.areaOrEquipment}</div>
                </div>
              </div>
              <button
                onClick={() => setEditingCleaningTask(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Área o Equipo (*):</label>
                <input
                  type="text"
                  value={editingCleaningTask.areaOrEquipment}
                  onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, areaOrEquipment: e.target.value })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Frecuencia:</label>
                  <select
                    value={editingCleaningTask.frequency}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, frequency: e.target.value as any })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="por_turno">Por Turno de Trabajo</option>
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Turno Asignado:</label>
                  <select
                    value={editingCleaningTask.shift}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, shift: e.target.value as any })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="manana">Mañana</option>
                    <option value="tarde">Tarde / Cierre</option>
                    <option value="ambos">Ambos Turnos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Rol Responsable:</label>
                <input
                  type="text"
                  value={editingCleaningTask.responsibleRole}
                  onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, responsibleRole: e.target.value })}
                  placeholder="Ej. Cocinero de partida / Marmitón"
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Producto Químico Autorizado:</label>
                <input
                  type="text"
                  value={editingCleaningTask.authorizedProduct}
                  onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, authorizedProduct: e.target.value })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Dosificación Prescrita:</label>
                  <input
                    type="text"
                    value={editingCleaningTask.dosage}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, dosage: e.target.value })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Estado de Actividad:</label>
                  <select
                    value={editingCleaningTask.status}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, status: e.target.value as any })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="activo">Activo (Exigible en Turno)</option>
                    <option value="inactivo">Inactivo / Apagado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Método de Aplicación:</label>
                <textarea
                  value={editingCleaningTask.applicationMethod}
                  onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, applicationMethod: e.target.value })}
                  rows={2}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCleaningTask.requiresSupervisorVerification}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, requiresSupervisorVerification: e.target.checked })}
                    className="rounded text-[#C5A880] focus:ring-0"
                  />
                  <span className="font-semibold text-slate-700">Requiere Firma de Supervisor</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Evidencia Requerida:</label>
                  <select
                    value={editingCleaningTask.requiredEvidence}
                    onChange={(e) => setEditingCleaningTask({ ...editingCleaningTask, requiredEvidence: e.target.value as any })}
                    className="w-full p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                  >
                    <option value="ninguna">Solo Marca de Check</option>
                    <option value="firma">Firma Digital</option>
                    <option value="fotografia">Fotografía Obligatoria</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setEditingCleaningTask(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!editingCleaningTask.areaOrEquipment.trim()) return;
                  const updated = { ...config };
                  const idx = updated.cleaningTasks.findIndex(t => t.id === editingCleaningTask.id);
                  if (idx >= 0) {
                    updated.cleaningTasks[idx] = {
                      ...editingCleaningTask,
                      updatedAt: new Date().toISOString()
                    };
                    proaAdminConfigService.recordAuditChange({
                      operatorId: currentOperator.id,
                      operatorName: currentOperator.name,
                      operatorRole: currentOperator.role,
                      targetModule: 'limpieza',
                      actionType: 'modificacion',
                      entityId: editingCleaningTask.id,
                      entityName: editingCleaningTask.areaOrEquipment,
                      summary: `Modificación de parámetros del protocolo de limpieza '${editingCleaningTask.areaOrEquipment}'.`
                    });
                    handleSaveAll(updated);
                    setEditingCleaningTask(null);
                    showToast(`Protocolo '${editingCleaningTask.areaOrEquipment}' modificado correctamente.`);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] text-xs font-bold hover:brightness-110 transition shadow cursor-pointer"
              >
                Guardar Modificación de Actividad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFICAR CAMPO DE FORMULARIO
          ========================================================================= */}
      {editingFormField && activeForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-serif font-bold text-base text-[#1A2530]">
                Modificar Campo de Formulario
              </h3>
              <button
                onClick={() => setEditingFormField(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Etiqueta del Campo (*):</label>
                <input
                  type="text"
                  value={editingFormField.label}
                  onChange={(e) => setEditingFormField({ ...editingFormField, label: e.target.value })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Tipo de Campo:</label>
                <select
                  value={editingFormField.type}
                  onChange={(e) => setEditingFormField({ ...editingFormField, type: e.target.value as FormFieldType })}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                >
                  <option value="number">Número (con rangos y alertas)</option>
                  <option value="text">Texto</option>
                  <option value="select">Lista Desplegable (Select)</option>
                  <option value="checkbox">Casilla de Verificación (Sí/No)</option>
                  <option value="photo">Evidencia Fotográfica</option>
                  <option value="signature">Firma Digital</option>
                  <option value="date">Fecha</option>
                  <option value="time">Hora</option>
                </select>
              </div>

              {editingFormField.type === 'number' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Mínimo:</label>
                    <input
                      type="number"
                      value={editingFormField.minValue ?? ''}
                      onChange={(e) => setEditingFormField({ ...editingFormField, minValue: parseFloat(e.target.value) })}
                      className="w-full p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Máximo:</label>
                    <input
                      type="number"
                      value={editingFormField.maxValue ?? ''}
                      onChange={(e) => setEditingFormField({ ...editingFormField, maxValue: parseFloat(e.target.value) })}
                      className="w-full p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[#1A2530]">Unidad:</label>
                    <input
                      type="text"
                      value={editingFormField.unit || ''}
                      onChange={(e) => setEditingFormField({ ...editingFormField, unit: e.target.value })}
                      placeholder="ºC"
                      className="w-full p-1.5 bg-[#F8F9FA] rounded border border-[#E2E8F0]"
                    />
                  </div>
                </div>
              )}

              {editingFormField.type === 'select' && (
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Opciones (separadas por coma):</label>
                  <input
                    type="text"
                    value={editingFormField.options?.join(', ') || ''}
                    onChange={(e) => setEditingFormField({
                      ...editingFormField,
                      options: e.target.value.split(',').map(s => s.trim())
                    })}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingFormField.required}
                  onChange={(e) => setEditingFormField({ ...editingFormField, required: e.target.checked })}
                  className="rounded text-[#C5A880] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Campo Obligatorio</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setEditingFormField(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!editingFormField.label.trim()) return;
                  const updated = { ...config };
                  const form = updated.forms.find(f => f.id === activeForm.id);
                  if (form) {
                    const fIndex = form.fields.findIndex(f => f.id === editingFormField.id);
                    if (fIndex >= 0) {
                      form.fields[fIndex] = { ...editingFormField };
                      handleSaveAll(updated);
                      setEditingFormField(null);
                      showToast(`Campo '${editingFormField.label}' modificado con éxito.`);
                    }
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] text-xs font-bold hover:brightness-110 transition shadow cursor-pointer"
              >
                Guardar Campo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: MODIFICAR INFORMACIÓN DE FORMULARIO
          ========================================================================= */}
      {isEditingFormMetadata && activeForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E2E8F0] shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
              <h3 className="font-serif font-bold text-base text-[#1A2530]">
                Modificar Formulario Operativo
              </h3>
              <button
                onClick={() => setIsEditingFormMetadata(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Título del Formulario (*):</label>
                <input
                  type="text"
                  value={activeForm.title}
                  onChange={(e) => {
                    const updated = { ...config };
                    const form = updated.forms.find(f => f.id === activeForm.id);
                    if (form) {
                      form.title = e.target.value;
                      setConfig(updated);
                    }
                  }}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Código:</label>
                  <input
                    type="text"
                    value={activeForm.code}
                    onChange={(e) => {
                      const updated = { ...config };
                      const form = updated.forms.find(f => f.id === activeForm.id);
                      if (form) {
                        form.code = e.target.value;
                        setConfig(updated);
                      }
                    }}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1A2530] mb-1">Categoría:</label>
                  <select
                    value={activeForm.category}
                    onChange={(e) => {
                      const updated = { ...config };
                      const form = updated.forms.find(f => f.id === activeForm.id);
                      if (form) {
                        form.category = e.target.value as any;
                        setConfig(updated);
                      }
                    }}
                    className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                  >
                    <option value="temperaturas">Control de Temperaturas APPCC</option>
                    <option value="limpieza_desinfeccion">Limpieza & Desinfección</option>
                    <option value="apertura_cierre">Apertura & Cierre de Turno</option>
                    <option value="revision_maquinaria">Revisión de Maquinaria</option>
                    <option value="control_camaras">Control de Cámaras Frigoríficas</option>
                    <option value="incidencias">Incidencias y Averías</option>
                    <option value="checklist_personalizado">Lista de Comprobación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1A2530] mb-1">Descripción:</label>
                <textarea
                  value={activeForm.description || ''}
                  onChange={(e) => {
                    const updated = { ...config };
                    const form = updated.forms.find(f => f.id === activeForm.id);
                    if (form) {
                      form.description = e.target.value;
                      setConfig(updated);
                    }
                  }}
                  rows={2}
                  className="w-full p-2 bg-[#F8F9FA] rounded-lg border border-[#E2E8F0]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={activeForm.requiresSupervisorSignature}
                  onChange={(e) => {
                    const updated = { ...config };
                    const form = updated.forms.find(f => f.id === activeForm.id);
                    if (form) {
                      form.requiresSupervisorSignature = e.target.checked;
                      setConfig(updated);
                    }
                  }}
                  className="rounded text-[#C5A880] focus:ring-0"
                />
                <span className="font-semibold text-slate-700">Exigir Firma Obligatoria de Supervisor</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                onClick={() => setIsEditingFormMetadata(false)}
                className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-slate-600 hover:bg-[#F8F9FA]"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleSaveAll();
                  setIsEditingFormMetadata(false);
                  showToast('Información del formulario actualizada con éxito.');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-[#C5A880] text-xs font-bold hover:brightness-110 transition shadow cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Certificado Oficial de Seguridad y Aislamiento */}
      <SecurityIsolationAuditModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
};
