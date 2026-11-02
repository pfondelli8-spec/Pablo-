import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  ClipboardCheck, 
  BookOpen, 
  Thermometer, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  Search, 
  ChevronDown, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Briefcase,
  Sparkles,
  Layers,
  ArrowRight,
  UtensilsCrossed,
  Copy,
  Edit3
} from 'lucide-react';
import { 
  CompanyConfig, 
  EstablishmentConfig, 
  DepartmentConfig, 
  PointOfSaleConfig, 
  UserAccount, 
  UserProfileRole,
  DemoHotelModel
} from '../types/multiTenantConfig';
import { multiTenantStorage } from '../services/multiTenantStorage';
import { demoHotelModelsService } from '../services/demoHotelModelsService';
import { HostelOpsMobileTab, HostelOpsBottomNav } from './HostelOpsBottomNav';
import { CompanyConfigAdminModal } from './CompanyConfigAdminModal';
import { MisTareasChecklistsView } from './MisTareasChecklistsView';
import { ConocimientoFormacionView } from './ConocimientoFormacionView';
import { ControlesAppccView } from './ControlesAppccView';
import { DocumentosRegistrosView } from './DocumentosRegistrosView';
import { KitchenAreasManagerView } from './KitchenAreasManagerView';
import { HotelModelsSelectorModal } from './HotelModelsSelectorModal';
import { FnbSupervisionPanel } from './FnbSupervisionPanel';
import { calculateSupervisionKPIs, fnbStorage } from '../data/fnbOperationsService';

interface HostelOpsMasterPortalProps {
  onOpenGlobalSearch?: () => void;
}

export const HostelOpsMasterPortal: React.FC<HostelOpsMasterPortalProps> = ({
  onOpenGlobalSearch
}) => {
  // Configuración de la empresa y estructura
  const [company, setCompany] = useState<CompanyConfig>(() => multiTenantStorage.getCompany());
  const [establishments, setEstablishments] = useState<EstablishmentConfig[]>(() => multiTenantStorage.getEstablishments());
  const [departments, setDepartments] = useState<DepartmentConfig[]>(() => multiTenantStorage.getDepartments());
  const [pointsOfSale, setPointsOfSale] = useState<PointOfSaleConfig[]>(() => multiTenantStorage.getPointsOfSale());
  const [users, setUsers] = useState<UserAccount[]>(() => multiTenantStorage.getUsers());

  // Modelo de Hotel Activo (Hotel Mitaca o Hotel Vulcano)
  const [activeModelId, setActiveModelId] = useState<string>(() => demoHotelModelsService.getActiveModelId());

  // Sesión actual
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => multiTenantStorage.getCurrentUser());
  const [currentEstId, setCurrentEstId] = useState<string>(() => establishments[0]?.id || 'est-01');
  const [currentPosId, setCurrentPosId] = useState<string>(() => pointsOfSale[0]?.id || 'pos-barra-piscina');
  const [currentShift, setCurrentShift] = useState<'manana' | 'tarde' | 'noche'>('manana');

  // Pestaña de navegación (5 accesos mobile-first + cocina y supervisión)
  const [activeTab, setActiveTab] = useState<HostelOpsMobileTab | 'supervision'>('inicio');

  // Modales
  const [isCompanyConfigOpen, setIsCompanyConfigOpen] = useState(false);
  const [isHotelModelsModalOpen, setIsHotelModelsModalOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);

  // Recarga reactiva
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfigChanged = () => {
    setCompany(multiTenantStorage.getCompany());
    setEstablishments(multiTenantStorage.getEstablishments());
    setDepartments(multiTenantStorage.getDepartments());
    setPointsOfSale(multiTenantStorage.getPointsOfSale());
    setUsers(multiTenantStorage.getUsers());
    setCurrentUser(multiTenantStorage.getCurrentUser());
    setRefreshKey(prev => prev + 1);
  };

  const currentEstablishment = establishments.find(e => e.id === currentEstId) || establishments[0];
  const currentPos = pointsOfSale.find(p => p.id === currentPosId) || pointsOfSale[0];

  // Modelos de Hotel Precargados (Hotel Mitaca & Hotel Vulcano)
  const allDemoModels = useMemo(() => {
    return demoHotelModelsService.getModels();
  }, [refreshKey]);

  const activeDemoModel = useMemo(() => {
    return demoHotelModelsService.getModelById(activeModelId) || allDemoModels[0];
  }, [activeModelId, allDemoModels, refreshKey]);

  // Cálculo de KPIs de supervisión reales
  const temps = fnbStorage.getTemperatures();
  const cleans = fnbStorage.getCleaningLogs();
  const incidents = fnbStorage.getIncidents();
  const kpis = useMemo(() => calculateSupervisionKPIs(temps, cleans, incidents), [temps, cleans, incidents, refreshKey]);

  const roleLabels: Record<UserProfileRole, { title: string; badge: string; desc: string }> = {
    admin_plataforma: {
      title: 'Administrador de Plataforma',
      badge: 'Superadmin',
      desc: 'Gestión global de empresas y soporte técnico.'
    },
    admin_empresa: {
      title: 'Administrador de Empresa',
      badge: 'Organización',
      desc: 'Configuración de establecimientos, departamentos, usuarios y parámetros operativos.'
    },
    direccion_operaciones: {
      title: 'Dirección de Operaciones',
      badge: 'Mando Central',
      desc: 'Supervisión de indicadores de cumplimiento, APPCC y auditorías.'
    },
    jefe_departamento: {
      title: 'Jefe de Departamento / Encargado',
      badge: 'Supervisión Turno',
      desc: 'Asignación de tareas, revisión de turnos y validación de registros.'
    },
    trabajador: {
      title: 'Trabajador F&B',
      badge: 'Operativa Diaria',
      desc: 'Consulta de cartas/recetas, ejecución de checklists y registros de turno.'
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1A2530]">
      
      {/* 1. TOP STATUS BAR: EMPRESA, ESTABLECIMIENTO, ROL & CONFIGURACIÓN */}
      <header className="bg-[#1A2530] text-white border-b border-[#2C3E50] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          
          {/* Identidad de Empresa & Establecimiento */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-[#C5A880]" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white truncate">
                  {company.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-semibold">
                  Multiempresa
                </span>
              </div>
              
              <button 
                onClick={() => setShowVenueModal(true)}
                className="flex items-center gap-1 text-xs text-gray-300 hover:text-white transition-colors truncate"
              >
                <MapPin className="w-3 h-3 text-[#C5A880] shrink-0" />
                <span className="truncate">{currentEstablishment?.name} · {currentPos?.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>
            </div>
          </div>

          {/* Selector de Rol de Usuario & Acceso a Configuración */}
          <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
            
            {/* Conmutador de Modelo de Hotel Precargado */}
            <button
              onClick={() => setIsHotelModelsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 border border-[#C5A880]/40 text-xs font-semibold text-[#C5A880] transition-colors"
              title="Selector de modelos de hotel precargados: Hotel Mitaca y Hotel Vulcano"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="font-bold">{activeDemoModel?.name || 'Hotel Mitaca'}</span>
              <span className="hidden lg:inline text-[10px] opacity-75">({activeDemoModel?.stars ? `${activeDemoModel.stars}★` : 'Demo'})</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Selector de Modelos de Hotel (Hotel Mitaca & Hotel Vulcano) */}
            <button
              onClick={() => setIsHotelModelsModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 border border-[#C5A880]/40 text-xs font-semibold text-[#C5A880] transition-colors"
              title="Modelos de establecimiento precargados: Hotel Mitaca y Hotel Vulcano"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Modelo:</span>
              <strong className="text-white truncate max-w-[100px]">{activeDemoModel.name}</strong>
              <span className="text-[10px] bg-[#C5A880] text-[#1A2530] font-bold px-1 rounded font-mono">
                {activeDemoModel.stars}★
              </span>
            </button>

            {/* Conmutador de Perfil */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs transition-colors shadow-xs"
              title="Cambiar perfil de usuario para pruebas"
            >
              <User className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px] sm:max-w-none">{currentUser.name}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {/* Botón «Configuración de mi empresa» */}
            {(currentUser.role === 'admin_plataforma' || currentUser.role === 'admin_empresa' || currentUser.role === 'direccion_operaciones') && (
              <button
                onClick={() => setIsCompanyConfigOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2C3E50]/80 hover:bg-[#2C3E50] border border-gray-600/50 text-xs font-semibold text-gray-200 transition-colors"
                title="Configuración de mi empresa: establecimientos, departamentos, puestos, límites APPCC"
              >
                <Settings className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden md:inline">Configuración</span>
              </button>
            )}

            {/* Buscador Rápido */}
            {onOpenGlobalSearch && (
              <button
                onClick={onOpenGlobalSearch}
                className="w-8 h-8 rounded-lg bg-[#2C3E50]/80 hover:bg-[#2C3E50] border border-gray-600/50 flex items-center justify-center text-gray-200 hover:text-white transition-colors"
                title="Buscar en recetas, manuales y registros"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. BARRA DE NAVEGACIÓN EN ESCRITORIO (TABS DE LOS 5 MÓDULOS PRINCIPALES + COCINA) */}
      <nav aria-label="Navegación principal en escritorio" className="hidden md:block bg-white border-b border-[#E2E8F0] sticky top-[53px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            
            <button
              type="button"
              onClick={() => setActiveTab('inicio')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'inicio'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <Home className="w-4 h-4 text-[#C5A880]" />
              <span>1. Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mis_tareas')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'mis_tareas'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-[#C5A880]" />
              <span>2. Mis Tareas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('conocimiento')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'conocimiento'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#C5A880]" />
              <span>3. Conocimiento</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('controles')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'controles'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <Thermometer className="w-4 h-4 text-[#C5A880]" />
              <span>4. Controles APPCC</span>
              {kpis.outOfRangeAlertsPending > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('documentos')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'documentos'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C5A880]" />
              <span>5. Documentos & Recetas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cocina')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'cocina'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-[#C5A880]" />
              <span>6. Cocina (7 Áreas)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('supervision')}
              className={`py-3 px-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'supervision'
                  ? 'border-[#C5A880] text-[#1A2530]'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#C5A880]" />
              <span>Supervisión & KPIs</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompanyConfigOpen(true)}
              className="text-xs font-semibold text-gray-600 hover:text-[#1A2530] flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Configuración de mi empresa</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. CONTENEDOR PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* PESTAÑA 1: INICIO (ADAPTADA AL PUESTO DEL TRABAJADOR) */}
        {activeTab === 'inicio' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            {/* Banner Saludo & Puesto */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
                      {company.name} · {currentEstablishment?.name}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#1A2530]">
                    Hola, {currentUser.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Estación: <strong className="text-[#2C3E50]">{currentPos?.name}</strong> · Perfil: <strong className="text-[#C5A880] uppercase">{roleLabels[currentUser.role]?.badge}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-semibold text-[#2C3E50] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="capitalize font-mono">Turno {currentShift}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Alerta de Desviación APPCC si existe */}
            {kpis.outOfRangeAlertsPending > 0 && (
              <div className="bg-red-50/90 border border-red-300 rounded-xl p-4 flex items-center justify-between gap-3 text-red-900 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="text-xs">
                    <strong>Alerta Higiénico-Sanitaria:</strong> {kpis.outOfRangeAlertsPending} equipo(s) con desviación de temperatura pendiente de resolver.
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('controles')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shrink-0"
                >
                  Documentar Medidas
                </button>
              </div>
            )}

            {/* SECCIÓN 1.1: MODELOS DE ESTABLECIMIENTO DE DEMOSTRACIÓN (HOTEL MITACA & HOTEL VULCANO) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Modelos de Establecimiento Precargados
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Estructuras maestras independientes con sus 7 puestos de cocina y operativas diferenciadas
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHotelModelsModalOpen(true)}
                  className="text-xs font-bold text-[#C5A880] hover:text-[#b89a72] flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gestionar modelos</span>
                </button>
              </div>

              {/* GRID DE MODELOS: MITACA & VULCANO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {allDemoModels.slice(0, 2).map((model) => {
                  const isCurrent = model.id === activeModelId;
                  const isMitaca = model.id.includes('mitaca');

                  return (
                    <div
                      key={model.id}
                      className={`bg-white rounded-xl border p-4 flex flex-col justify-between shadow-xs transition-all ${
                        isCurrent 
                          ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30' 
                          : 'border-[#E2E8F0] hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isMitaca ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {model.stars}★
                            </span>
                            <div>
                              <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-1.5">
                                {model.name}
                                {isCurrent && (
                                  <span className="text-[9px] bg-[#C5A880] text-[#1A2530] font-bold px-1.5 py-0.2 rounded font-mono">
                                    ACTIVO
                                  </span>
                                )}
                              </h3>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {model.code}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {model.badge}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                          {model.description}
                        </p>

                        <div className="grid grid-cols-3 gap-1.5 py-2 border-t border-b border-[#E2E8F0] text-center text-[11px] mb-3">
                          <div>
                            <span className="text-gray-400 block text-[9px] uppercase font-semibold">Departamentos</span>
                            <span className="font-bold text-[#1A2530]">{model.departments?.length || 4}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] uppercase font-semibold">Puestos Cocina</span>
                            <span className="font-bold text-[#C5A880]">{model.kitchenAreas?.length || 7} áreas</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[9px] uppercase font-semibold">Documentos</span>
                            <span className="font-bold text-[#1A2530]">{model.uploadedDocuments?.length || 18}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModelId(model.id);
                            demoHotelModelsService.setActiveModelId(model.id);
                            handleConfigChanged();
                          }}
                          className={`py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors ${
                            isCurrent
                              ? 'bg-[#1A2530] text-white'
                              : 'bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530]'
                          }`}
                        >
                          <span>{isCurrent ? 'En uso' : 'Abrir'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsHotelModelsModalOpen(true)}
                          className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-gray-500" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsHotelModelsModalOpen(true)}
                          className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:border-[#C5A880] hover:text-[#1A2530] text-[11px] font-semibold text-gray-700 flex items-center justify-center gap-1"
                          title="Duplicar como hotel real independiente sin historial previo"
                        >
                          <Copy className="w-3 h-3 text-[#C5A880]" />
                          <span>Duplicar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 1.2: ACCESO DESTACADO A COCINA & LAS 7 ÁREAS */}
            <div className="bg-gradient-to-r from-[#1A2530] to-[#2C3E50] rounded-xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-xs uppercase font-mono tracking-wider font-semibold text-[#C5A880]">
                    Departamento de Cocina · {activeDemoModel?.name}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Las 7 Áreas Operativas & 6 Categorías Documentales
                </h3>
                <p className="text-xs text-gray-300 max-w-xl leading-relaxed">
                  Cafetería, Frío mañana/tarde, Caliente mañana/tarde, Pastelería y Marmitón. Con fichas de puesto, horarios de turno, tareas críticas y visor/subida de documentos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('cocina')}
                className="shrink-0 px-4 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
              >
                <span>Acceder a Cocina</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Accesos Directos a los Módulos Operativos */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-1">
                Operativa Diaria en tu Puesto de Trabajo
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 2. Mis Tareas */}
                <button
                  type="button"
                  onClick={() => setActiveTab('mis_tareas')}
                  className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3">
                      <ClipboardCheck className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                      2. Mis Tareas de Turno
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Checklist de apertura, puesta a punto de estación, cambio de turno y cierre con arqueo de Ticket Z.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span>Iniciar checklist</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </button>

                {/* 3. Conocimiento */}
                <button
                  type="button"
                  onClick={() => setActiveTab('conocimiento')}
                  className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                      3. Conocimiento & SOPs
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Manuales de bienvenida, funciones de puesto, procedimientos vigentes y confirmación de lectura.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span>Consultar manuales</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </button>

                {/* 4. Controles */}
                <button
                  type="button"
                  onClick={() => setActiveTab('controles')}
                  className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3">
                      <Thermometer className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                      4. Controles APPCC & Limpieza
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Registro de temperaturas de frío, alertas de desviación con acción correctiva y plan de limpieza.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span>Registrar control</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </button>

                {/* 5. Documentos */}
                <button
                  type="button"
                  onClick={() => setActiveTab('documentos')}
                  className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                      5. Documentos & Recetas TPV
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Recetas oficiales, medidas exactas, 14 alérgenos UE y botón de copiado de formato técnico para TPV.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
                    <span>Ver recetario</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] transition-colors" />
                  </div>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: MIS TAREAS */}
        {activeTab === 'mis_tareas' && (
          <MisTareasChecklistsView
            currentUser={currentUser}
            currentEstablishmentName={currentEstablishment?.name || 'Establecimiento'}
            currentStationName={currentPos?.name || 'Punto de Venta'}
          />
        )}

        {/* PESTAÑA 3: CONOCIMIENTO */}
        {activeTab === 'conocimiento' && (
          <ConocimientoFormacionView
            currentUser={currentUser}
            currentEstablishmentName={currentEstablishment?.name || 'Establecimiento'}
          />
        )}

        {/* PESTAÑA 4: CONTROLES */}
        {activeTab === 'controles' && (
          <ControlesAppccView
            currentUser={currentUser}
            currentEstablishmentName={currentEstablishment?.name || 'Establecimiento'}
            currentStationName={currentPos?.name || 'Punto de Venta'}
          />
        )}

        {/* PESTAÑA 5: DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <DocumentosRegistrosView
            currentUser={currentUser}
            currentEstablishmentName={currentEstablishment?.name || 'Establecimiento'}
          />
        )}

        {/* PESTAÑA 6: COCINA & LAS 7 ÁREAS OPERATIVAS */}
        {activeTab === 'cocina' && (
          <KitchenAreasManagerView
            currentUser={currentUser}
            currentEstablishmentName={currentEstablishment?.name || activeDemoModel.name}
            activeModel={activeDemoModel}
            onOpenModelSelector={() => setIsHotelModelsModalOpen(true)}
            onLaunchChecklist={() => {
              setActiveTab('mis_tareas');
            }}
          />
        )}

        {/* PESTAÑA 6: SUPERVISIÓN (DIRECCIÓN / ADMIN) */}
        {activeTab === 'supervision' && (
          <FnbSupervisionPanel
            currentRole={currentUser.role as any}
            currentShift={currentShift}
            currentStation={currentPos?.name as any}
            userName={currentUser.name}
            hotelName={currentEstablishment?.name || company.name}
            kpis={kpis}
            onRefreshData={handleConfigChanged}
            onResetDemoData={() => {
              multiTenantStorage.resetToFactoryDemo();
              handleConfigChanged();
            }}
          />
        )}

      </main>

      {/* 4. BARRA DE NAVEGACIÓN INFERIOR PARA MÓVIL (LOS 5 ACCESOS EXACTOS DEL PROMPT) */}
      <HostelOpsBottomNav
        activeTab={activeTab === 'supervision' ? 'inicio' : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingChecksCount={kpis.outOfRangeAlertsPending}
      />

      {/* MODAL: CAMBIO DE ROL DE USUARIO */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Perfiles de Usuario & Permisos</h3>
                <p className="text-xs text-gray-500">Prueba la plataforma desde los 5 perfiles requeridos</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-2">
              {users.map(u => {
                const isSelected = currentUser.id === u.id;
                const roleInfo = roleLabels[u.role];

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      multiTenantStorage.setCurrentUser(u.id);
                      setCurrentUser(u);
                      setShowRoleModal(false);
                      handleConfigChanged();
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#C5A880]/10 ring-1 ring-[#C5A880]' 
                        : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A2530]">{u.name}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold">
                          {roleInfo?.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{roleInfo?.desc}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIO DE ESTABLECIMIENTO O PUNTO DE VENTA */}
      {showVenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-base text-[#1A2530]">Ubicación de Trabajo</h3>
              <button onClick={() => setShowVenueModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Establecimiento:</label>
                <select
                  value={currentEstId}
                  onChange={(e) => setCurrentEstId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                >
                  {establishments.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Punto de Venta / Estación:</label>
                <select
                  value={currentPosId}
                  onChange={(e) => setCurrentPosId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                >
                  {pointsOfSale.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Turno:</label>
                <select
                  value={currentShift}
                  onChange={(e) => setCurrentShift(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                >
                  <option value="manana">Turno Mañana (08:00 - 16:00)</option>
                  <option value="tarde">Turno Tarde (16:00 - 00:00)</option>
                  <option value="noche">Turno Noche / Cierre (20:00 - 04:00)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowVenueModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1A2530] text-white font-semibold"
                >
                  Aplicar Ubicación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL «CONFIGURACIÓN DE MI EMPRESA» */}
      <CompanyConfigAdminModal
        isOpen={isCompanyConfigOpen}
        onClose={() => setIsCompanyConfigOpen(false)}
        onConfigChanged={handleConfigChanged}
        onOpenModelWorkspace={(modelId) => {
          setActiveModelId(modelId);
          demoHotelModelsService.setActiveModelId(modelId);
          setIsCompanyConfigOpen(false);
          handleConfigChanged();
        }}
      />

      {/* MODAL «MODELOS DE ESTABLECIMIENTO» (HOTEL MITACA & HOTEL VULCANO) */}
      <HotelModelsSelectorModal
        isOpen={isHotelModelsModalOpen}
        onClose={() => setIsHotelModelsModalOpen(false)}
        activeModelId={activeModelId}
        onSelectModel={(modelId) => {
          setActiveModelId(modelId);
          demoHotelModelsService.setActiveModelId(modelId);
          handleConfigChanged();
        }}
        onEstablishmentCreated={(newEst) => {
          handleConfigChanged();
          setCurrentEstId(newEst.id);
        }}
        onModelsChanged={handleConfigChanged}
      />

    </div>
  );
};
