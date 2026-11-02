import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  UtensilsCrossed,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  Sparkles,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Calendar,
  Layers,
  ChevronDown,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  Coffee,
  Flame,
  Snowflake,
  Cake,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Info,
  Sliders,
  CheckSquare,
  Square,
  Lock,
  KeyRound,
  BookOpen,
  FolderOpen,
  Edit3,
  Sun,
  Sunset,
  Moon,
  ChefHat,
  FileSpreadsheet,
  Upload,
  BarChart3,
  Wrench,
  BedDouble,
  Wine,
  ConciergeBell
} from 'lucide-react';
import { detectFileFormat } from '../services/cartaMenusDocumentService';
import { 
  DemoHotelModel, 
  KitchenStationArea, 
  KitchenStationKey,
  UploadedDocumentRecord,
  DepartmentConfig
} from '../types/multiTenantConfig';
import { demoHotelModelsService, KITCHEN_STATION_META } from '../services/demoHotelModelsService';
import { 
  proaAreaOperationsService, 
  StationEquipmentTemp, 
  StationCleaningTask, 
  StationChecklistItem, 
  OpenedProductLabel, 
  StationIncident, 
  AreaAuditRecord 
} from '../services/proaAreaOperationsService';
import { tenantIsolationService, ActiveTenantSession } from '../services/tenantIsolationService';
import { SecurityIsolationAuditModal } from './SecurityIsolationAuditModal';
import { WorkspaceSelectorModal } from './WorkspaceSelectorModal';
import { ProaAdminConfigPanel } from './ProaAdminConfigPanel';
import { ProaAdminRole } from '../types/proaAdminConfig';
import { BitacoraRecetasModal } from './BitacoraRecetasModal';
import { MenuRotationsModal } from './MenuRotationsModal';
import { TechSheetsLibraryModal } from './TechSheetsLibraryModal';
import { CarpetaDocumentalModal } from './CarpetaDocumentalModal';
import { PinAuthModal, PinAccessTier } from './PinAuthModal';
import { EditActivityModal, EditableActivityData } from './EditActivityModal';
import { CartaMenusFichasHub } from './CartaMenusFichasHub';
import { Dashboard } from './Dashboard';
import { cumulativeFolderService } from '../services/cumulativeFolderService';
import { chefConfigService, ChefProfile } from '../services/chefConfigService';
import { PabloFondelliLogo } from './PFCorporateLogo';
import { PabloFondelliModal } from './PabloFondelliModal';
import { UserManualHelpCenterModal } from './UserManualHelpCenterModal';
import { ManualChapterId } from '../types/userManual';
import { MonthlyEpisControlView } from './MonthlyEpisControlView';

interface ProaOperationalPortalProps {
  onOpenGlobalSearch?: () => void;
  onOpenAdminConfig?: () => void;
}

type NavigationLevel = 'portada' | 'hotel' | 'department' | 'area_list' | 'station_dashboard';

export const ProaOperationalPortal: React.FC<ProaOperationalPortalProps> = ({
  onOpenGlobalSearch,
  onOpenAdminConfig
}) => {
  // Modelos de Hotel disponibles (Hotel Bitácora & Hotel Vulcano)
  const [models, setModels] = useState<DemoHotelModel[]>(() => demoHotelModelsService.getModels());

  // Estado de navegación jerárquica: Portada -> Hotel -> Estructura (7 Departamentos / Ruedas) -> Estación
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('proa_selected_hotel_id') || 'model-bitacora';
    } catch {
      return 'model-bitacora';
    }
  });

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('proa_selected_dept_id') || 'dep-cocina';
    } catch {
      return 'dep-cocina';
    }
  });

  const [selectedStationKey, setSelectedStationKey] = useState<KitchenStationKey | null>(null);

  // Nivel de navegación explícito: inicia siempre en 'portada' con el Hero Split de Lujo
  const [navLevel, setNavLevel] = useState<NavigationLevel>('portada');

  // Paleta de portada: 'carbon' (#14171A) o 'marfil' (#F7F5F0)
  const [portadaTheme, setPortadaTheme] = useState<'carbon' | 'marfil'>('carbon');

  // Perfiles de Chefs reactivos (Antonio González para Bitácora, Giacomo Longo para Vulcano)
  const [chefProfiles, setChefProfiles] = useState<Record<string, ChefProfile>>(() => chefConfigService.getProfiles());

  useEffect(() => {
    const handleProfilesUpdated = () => {
      setChefProfiles(chefConfigService.getProfiles());
    };
    window.addEventListener('proa_chef_profiles_updated', handleProfilesUpdated);
    return () => window.removeEventListener('proa_chef_profiles_updated', handleProfilesUpdated);
  }, []);

  // Modal activo para rueda de menú: 'rueda_1' | 'rueda_2' | null
  const [activeWheelModal, setActiveWheelModal] = useState<'rueda_1' | 'rueda_2' | null>(null);

  // Operador y turno actual
  const [activeOperator, setActiveOperator] = useState<string>(() => {
    const saved = localStorage.getItem('proa_selected_hotel_id');
    return saved?.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González';
  });
  const [activeShift, setActiveShift] = useState<'manana' | 'noche'>('manana');

  // Sesión del Espacio de Trabajo / Organización (Aislamiento Total Multi-Tenant)
  const [activeTenant, setActiveTenant] = useState<ActiveTenantSession>(() => tenantIsolationService.getActiveTenant());
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState(false);
  const [isWorkspaceSelectorOpen, setIsWorkspaceSelectorOpen] = useState(false);

  // MÓDULO: Panel de Administración y Configuración Operativa
  const [isProaAdminPanelOpen, setIsProaAdminPanelOpen] = useState(false);
  const [currentOperatorRole, setCurrentOperatorRole] = useState<ProaAdminRole>('trabajador');

  // Control de Acceso por PIN: inicia por defecto en 'empleado' (Modo Trabajador)
  const [pinTier, setPinTier] = useState<PinAccessTier>(() => {
    try {
      const saved = localStorage.getItem('proa_active_pin_tier') as PinAccessTier | null;
      if (saved && ['admin', 'jefe', 'empleado'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'empleado';
  });
  const [isPinAuthOpen, setIsPinAuthOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

  // Modo Chef / Administrador activo si tier es 'admin' o 'jefe'
  const isChefAdminMode = pinTier === 'admin' || pinTier === 'jefe';

  // MÓDULO: Bitácora de Recetas & Ruedas de Menú
  const [isBitacoraRecetasOpen, setIsBitacoraRecetasOpen] = useState(false);

  // MÓDULO SEPARADO: Ruedas de Menú de 15 Días (Desayuno, Almuerzo, Cena)
  const [isMenuRotationsOpen, setIsMenuRotationsOpen] = useState(false);

  // MÓDULO SEPARADO: Fichas Técnicas y Elaboraciones Documentales Independientes
  const [isTechSheetsLibraryOpen, setIsTechSheetsLibraryOpen] = useState(false);

  // MÓDULO: Carpeta Documental Acumulativa por Familias y Departamentos
  const [isCarpetaDocumentalOpen, setIsCarpetaDocumentalOpen] = useState(false);

  // Sub-pestaña activa en pantalla de hotel: 'casillas' | 'carta_menus' | 'dashboard' | 'epis'
  const [hotelViewMode, setHotelViewMode] = useState<'casillas' | 'carta_menus' | 'dashboard' | 'epis'>('casillas');
  const [cartaMenusInitialTab, setCartaMenusInitialTab] = useState<'carta' | 'rueda_1' | 'rueda_2' | 'fichas'>('rueda_1');

  // MÓDULO: Modificación de Actividades y Roles (para Antonio González y Giacomo Longo)
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<EditableActivityData | null>(null);

  // MÓDULO: Manual de Usuario & Centro de Ayuda Operativo
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [manualInitialChapter, setManualInitialChapter] = useState<ManualChapterId | undefined>(undefined);
  const [manualInitialArticleId, setManualInitialArticleId] = useState<string | undefined>(undefined);

  const openUserManual = (chapterId?: ManualChapterId, articleId?: string) => {
    setManualInitialChapter(chapterId);
    setManualInitialArticleId(articleId);
    setIsUserManualOpen(true);
  };

  // Modales
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isAddHotelModalOpen, setIsAddHotelModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<UploadedDocumentRecord | null>(null);
  const [showChefModal, setShowChefModal] = useState(false);

  // Formulario de nuevo departamento
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCategory, setNewDeptCategory] = useState<'cocina' | 'barra' | 'sala' | 'pisos' | 'mantenimiento'>('barra');
  const [customDepartments, setCustomDepartments] = useState<Record<string, DepartmentConfig[]>>(() => {
    try {
      const saved = localStorage.getItem('proa_custom_departments_by_hotel');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Formulario nuevo hotel
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCategory, setNewHotelCategory] = useState<'resort_4s' | 'boutique_5s' | 'urbano_gastronomico'>('resort_4s');
  const [newHotelStars, setNewHotelStars] = useState(4);

  // Pestaña activa dentro del Panel Operativo de Área (Nivel 4)
  const [stationActiveTab, setStationActiveTab] = useState<
    'checklists' | 'temperaturas' | 'limpieza' | 'caducidades' | 'documentos' | 'incidencias' | 'historial' | 'epis'
  >('checklists');

  // Filtro de fase en Checklist Operativo: 'manana' | 'noche' (Servicios de Datos)
  const [checklistPhase, setChecklistPhase] = useState<'manana' | 'noche'>('manana');

  // Categoría de departamento activo para gestión interdepartamental
  const [activeDepartmentCategory, setActiveDepartmentCategory] = useState<'cocina' | 'pisos' | 'mantenimiento' | 'barra' | 'recepcion'>('cocina');

  // Notificación de éxito / feedback
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);

  // Estados interactivos del área activa
  const [checklistItems, setChecklistItems] = useState<StationChecklistItem[]>([]);
  const [equipments, setEquipments] = useState<StationEquipmentTemp[]>([]);
  const [cleaningTasks, setCleaningTasks] = useState<StationCleaningTask[]>([]);
  const [openedProducts, setOpenedProducts] = useState<OpenedProductLabel[]>([]);
  const [incidents, setIncidents] = useState<StationIncident[]>([]);
  const [historyRecords, setHistoryRecords] = useState<AreaAuditRecord[]>([]);

  // Formulario para registro de temperatura
  const [tempInputValues, setTempInputValues] = useState<Record<string, string>>({});
  const [tempCorrectiveActions, setTempCorrectiveActions] = useState<Record<string, string>>({});

  // Formulario para etiquetar nuevo producto
  const [isLabelProductModalOpen, setIsLabelProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdLot, setNewProdLot] = useState('');
  const [newProdHours, setNewProdHours] = useState('48');
  const [newProdLocation, setNewProdLocation] = useState('Vitrina refrigerada bajo mostrador');

  // Formulario para nueva incidencia
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [newIncTitle, setNewIncTitle] = useState('');
  const [newIncCategory, setNewIncCategory] = useState<StationIncident['category']>('desviacion_temperatura');
  const [newIncSeverity, setNewIncSeverity] = useState<StationIncident['severity']>('media');
  const [newIncDesc, setNewIncDesc] = useState('');
  const [newIncAction, setNewIncAction] = useState('');

  // Formulario para nuevo documento
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<any>('elaboraciones');
  const [newDocType, setNewDocType] = useState<any>('pdf');
  const [newDocSummary, setNewDocSummary] = useState('');

  // Sincronizar hotel seleccionado
  const currentHotel = useMemo(() => {
    return models.find(m => m.id === selectedHotelId) || models[0] || null;
  }, [models, selectedHotelId]);

  // Departamentos del hotel actual (Cocina fija + los personalizados creados)
  const hotelDepartments = useMemo(() => {
    if (!currentHotel) return [];
    const baseCocina: DepartmentConfig = {
      id: `dep-cocina-${currentHotel.id}`,
      companyId: 'company-generic-01',
      establishmentId: currentHotel.id,
      name: 'Cocina & Gastronomía',
      code: 'DEP-COC',
      category: 'cocina',
      status: 'activo'
    };
    const custom = customDepartments[currentHotel.id] || [];
    return [baseCocina, ...custom];
  }, [currentHotel, customDepartments]);

  // Estaciones de cocina del hotel actual
  const kitchenAreas = useMemo(() => {
    if (!currentHotel) return [];
    return currentHotel.kitchenAreas || [];
  }, [currentHotel]);

  // Chefs específicos por hotel
  const bitacoraChef = useMemo(() => {
    return chefProfiles['model-bitacora'] || chefConfigService.getProfileForHotel('model-bitacora');
  }, [chefProfiles]);

  const vulcanoChef = useMemo(() => {
    return chefProfiles['model-vulcano'] || chefConfigService.getProfileForHotel('model-vulcano');
  }, [chefProfiles]);

  const currentChef = useMemo(() => {
    if (currentHotel?.id.includes('vulcano')) return vulcanoChef;
    return bitacoraChef;
  }, [currentHotel, bitacoraChef, vulcanoChef]);

  // Sincronizar automáticamente el operador activo con el chef titular del hotel seleccionado
  useEffect(() => {
    if (selectedHotelId.includes('vulcano')) {
      setActiveOperator(vulcanoChef.chefName || 'Giacomo Longo');
    } else {
      setActiveOperator(bitacoraChef.chefName || 'Antonio González');
    }
  }, [selectedHotelId, vulcanoChef.chefName, bitacoraChef.chefName]);

  // Limpieza de claves previas de demostración para iniciar con plantilla de datos 100% vacía
  useEffect(() => {
    try {
      const cleanKey = 'proa_clean_empty_state_v1';
      if (!localStorage.getItem(cleanKey)) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (
            k &&
            (k.startsWith('proa_recipes_isolated_') ||
              k.startsWith('proa_tech_sheets_') ||
              k.startsWith('proa_menu_cycle_') ||
              k.startsWith('proa_carta_menus_docs_') ||
              k.startsWith('proa_uploaded_docs') ||
              k.startsWith('proa_dossier_records_') ||
              k.startsWith('proa_kitchen_station_operations_') ||
              k.startsWith('proa_kitchen_station_history_'))
          ) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => {
          try {
            localStorage.removeItem(k);
          } catch {}
        });
        localStorage.setItem(cleanKey, 'true');
      }
    } catch {}
  }, []);

  // Estaciones operativas estructuradas por departamento (Cocina, Pisos, Mantenimiento, Bares, Recepción)
  const DEPARTMENT_STATIONS_MAP = useMemo(() => ({
    cocina: {
      categoryName: 'Cocina & Gastronomía',
      icon: UtensilsCrossed,
      stations: [
        {
          key: 'cafeteria' as KitchenStationKey,
          number: 1,
          name: 'Partida de Desayunos y Cafetería',
          roleName: 'Cocinero de Partida de Desayunos',
          badge: 'Cocinero de Desayunos',
          desc: 'Elaboración, montaje y control operativo de desayunos, cafetería y zumos durante el servicio.',
          schedule: '06:30 - 15:00'
        },
        {
          key: 'frio_manana' as KitchenStationKey,
          number: 2,
          name: 'Partida Fría de Mañana',
          roleName: 'Cocinero de Partida Fría (Mañana)',
          badge: 'Cocinero de Frío (AM)',
          desc: 'Elaboración, montaje y control operativo de ensaladas, cuartos fríos y crudités durante el servicio.',
          schedule: '07:00 - 15:30'
        },
        {
          key: 'frio_tarde' as KitchenStationKey,
          number: 3,
          name: 'Partida Fría de Noche',
          roleName: 'Cocinero de Partida Fría (Noche)',
          badge: 'Cocinero de Frío (Noche)',
          desc: 'Elaboración, montaje y control operativo de entremeses, platos fríos y pases de cena durante el servicio.',
          schedule: '15:00 - 23:30'
        },
        {
          key: 'caliente_manana' as KitchenStationKey,
          number: 4,
          name: 'Partida Caliente de Mañana',
          roleName: 'Cocinero de Partida Caliente (Mañana)',
          badge: 'Cocinero de Caliente (AM)',
          desc: 'Elaboración, montaje y control operativo de showcooking, guarniciones y almuerzos durante el servicio.',
          schedule: '07:00 - 15:30'
        },
        {
          key: 'caliente_tarde' as KitchenStationKey,
          number: 5,
          name: 'Partida Caliente de Noche',
          roleName: 'Cocinero de Partida Caliente (Noche)',
          badge: 'Cocinero de Caliente (Noche)',
          desc: 'Elaboración, montaje y control operativo de asados, carnes, pescados y cenas buffet durante el servicio.',
          schedule: '15:00 - 23:30'
        },
        {
          key: 'pasteleria' as KitchenStationKey,
          number: 6,
          name: 'Partida de Pastelería y Repostería',
          roleName: 'Cocinero de Partida de Pastelería',
          badge: 'Cocinero de Pastelería',
          desc: 'Elaboración, montaje y control operativo de repostería, tartas y postres individuales durante el servicio.',
          schedule: '06:00 - 14:30'
        },
        {
          key: 'plateria' as KitchenStationKey,
          number: 7,
          name: 'Partida de Plancha y Platería',
          roleName: 'Cocinero de Partida de Plancha y Pase',
          badge: 'Cocinero de Plancha & Pase',
          desc: 'Elaboración, montaje y control operativo de planchas en directo, plonge e higiene durante el servicio.',
          schedule: '08:00 - 00:00'
        }
      ]
    },
    pisos: {
      categoryName: 'Pisos & Housekeeping',
      icon: BedDouble,
      stations: [
        {
          key: 'pisos_habitaciones' as KitchenStationKey,
          number: 1,
          name: 'Habitaciones & Pisos',
          badge: 'Inspección & Salidas',
          desc: 'Limpieza y desinfección de habitaciones, cambio de sábanas y toallas, reposición de minibar.',
          schedule: '08:00 - 16:30'
        },
        {
          key: 'pisos_lenceria' as KitchenStationKey,
          number: 2,
          name: 'Lencería & Lavandería',
          badge: 'Stock Textil & Lavado',
          desc: 'Gestión de stocks textiles, toallas de piscina, uniformidad de personal y lavado interno.',
          schedule: '07:30 - 15:30'
        },
        {
          key: 'pisos_zonas_comunes' as KitchenStationKey,
          number: 3,
          name: 'Zonas Comunes & Salones',
          badge: 'Higiene & Áreas Nobles',
          desc: 'Aseo de halls, salones, ascensores, aseos generales y desinfección de zonas comunes.',
          schedule: '06:00 - 22:00'
        },
        {
          key: 'pisos_auditoria' as KitchenStationKey,
          number: 4,
          name: 'Auditoría Housekeeping',
          badge: 'Control Calidad VIP',
          desc: 'Supervisión de habitaciones VIP, control de puntos ciegos, inventario de amenities Spring.',
          schedule: '09:00 - 18:00'
        }
      ]
    },
    mantenimiento: {
      categoryName: 'Mantenimiento Técnico & SST',
      icon: Wrench,
      stations: [
        {
          key: 'mant_climatizacion' as KitchenStationKey,
          number: 1,
          name: 'Climatización & Calderas ACS',
          badge: 'ACS Anti-Legionella',
          desc: 'Control de temperaturas de acumuladores (>60ºC), presiones de calderas, chillers y bombas.',
          schedule: '24 Horas (Guardia)'
        },
        {
          key: 'mant_piscinas' as KitchenStationKey,
          number: 2,
          name: 'Piscinas & Balneoterapia',
          badge: 'Cloro, pH & Aguas',
          desc: 'Medición 3 veces al día de cloro libre, pH, turbidez, temperatura vaso y retrolavado filtros.',
          schedule: '07:00 - 20:00'
        },
        {
          key: 'mant_electricidad' as KitchenStationKey,
          number: 3,
          name: 'Cuadros Eléctricos & Alumbrado',
          badge: 'Sistemas & Grupos',
          desc: 'Supervisión de grupo electrógeno, alumbrado de emergencia, subcuadros y consumos.',
          schedule: '08:00 - 16:30'
        },
        {
          key: 'mant_sst' as KitchenStationKey,
          number: 4,
          name: 'Partes de Avería & SST',
          badge: 'Averías & Seguridad',
          desc: 'Resolución de partes de habitaciones y departamentos, extintores, salidas de emergencia.',
          schedule: '08:00 - 22:00'
        }
      ]
    },
    barra: {
      categoryName: 'Bares & Restauración',
      icon: Wine,
      stations: [
        {
          key: 'bar_piscina' as KitchenStationKey,
          number: 1,
          name: 'Bar Piscina & Snack',
          badge: 'Tiradores & Terraza',
          desc: 'Servicio de bebidas diurnas, tiradores de cerveza, batidos, café de piscina y botelleros.',
          schedule: '10:00 - 18:30'
        },
        {
          key: 'bar_hall' as KitchenStationKey,
          number: 2,
          name: 'Lobby Lounge & Coctelería',
          badge: 'Coctelería de Autor',
          desc: 'Coctelería premium, bodega de vinos, copistería de cristal fino y servicio vespertino.',
          schedule: '17:00 - 01:00'
        },
        {
          key: 'bar_salones' as KitchenStationKey,
          number: 3,
          name: 'Salones & Eventos',
          badge: 'Banquetes & Bodega',
          desc: 'Montaje de eventos, control de stocks de licores, cavas y suministros para grupos.',
          schedule: 'Según Evento'
        }
      ]
    },
    recepcion: {
      categoryName: 'Recepción & Front Office',
      icon: ConciergeBell,
      stations: [
        {
          key: 'recep_mostrador' as KitchenStationKey,
          number: 1,
          name: 'Mostrador & Check-In',
          badge: 'Front Desk & Caja',
          desc: 'Gestión de entradas y salidas, arqueos de caja, llaves magnéticas y atención directa.',
          schedule: '07:00 - 23:00'
        },
        {
          key: 'recep_auditoria' as KitchenStationKey,
          number: 2,
          name: 'Auditoría Nocturna',
          badge: 'Night Audit & Cierres',
          desc: 'Cierre del día en el PMS, cruce con TPVs, cuadre contable y emisión de informes matinales.',
          schedule: '23:00 - 07:00'
        },
        {
          key: 'recep_guest_experience' as KitchenStationKey,
          number: 3,
          name: 'Guest Experience & VIP',
          badge: 'Atención & Novedades',
          desc: 'Gestión de peticiones especiales, transfers, reputación online y bienvenida personalizada.',
          schedule: '09:00 - 21:00'
        }
      ]
    }
  }), []);

  // Casillas activas según departamento seleccionado
  const CANONICAL_HOTEL_CASILLAS = useMemo(() => {
    return DEPARTMENT_STATIONS_MAP[activeDepartmentCategory]?.stations || DEPARTMENT_STATIONS_MAP.cocina.stations;
  }, [DEPARTMENT_STATIONS_MAP, activeDepartmentCategory]);

  // Área activa seleccionada con resolución interdepartamental
  const currentStationArea = useMemo(() => {
    if (!selectedStationKey) return null;
    const direct = kitchenAreas.find(a => a.key === selectedStationKey);
    if (direct) return direct;

    // Buscar en todas las estaciones de DEPARTMENT_STATIONS_MAP
    for (const deptKey of (['cocina', 'pisos', 'mantenimiento', 'barra', 'recepcion'] as const)) {
      const found = DEPARTMENT_STATIONS_MAP[deptKey].stations.find(s => s.key === selectedStationKey);
      if (found) {
        return {
          id: `station-${selectedStationKey}`,
          key: selectedStationKey,
          name: found.name,
          code: KITCHEN_STATION_META[selectedStationKey]?.code || `DEP-0${found.number}`,
          departmentId: `dep-${deptKey}-${currentHotel?.id || 'default'}`,
          hotelModelId: currentHotel?.id || 'default',
          order: found.number,
          shiftSchedule: found.schedule,
          responsibilities: [
            `Gestión operativa del puesto ${found.name}`,
            'Cumplimiento estricto del plan de calidad y estándares de turno Spring',
            'Registro y firma de comprobaciones en Checklist Mañana y Noche'
          ],
          criticalTasks: {
            apertura: ['Comprobación inicial y calibración de puesto'],
            servicio: ['Seguimiento del turno y atención continua'],
            cierre: ['Desinfección, aseguramiento y traspaso de turno']
          },
          assignedEquipment: ['Terminal táctil de control', 'Maquinaria asignada al puesto', 'Registro documental'],
          allergensFocus: [],
          docCategories: []
        } as KitchenStationArea;
      }
    }

    const meta = KITCHEN_STATION_META[selectedStationKey];
    if (meta) {
      return {
        id: `station-${selectedStationKey}`,
        key: selectedStationKey,
        name: meta.name,
        code: meta.code,
        departmentId: `dep-dept-${currentHotel?.id || 'default'}`,
        hotelModelId: currentHotel?.id || 'default',
        order: meta.order,
        shiftSchedule: 'Servicios de Datos: Mañana y Noche',
        responsibilities: [
          `Gestión operativa de ${meta.name}`,
          'Cumplimiento estricto de protocolos y checklists',
          'Registro diario de controles y trazabilidad'
        ],
        criticalTasks: {
          apertura: ['Comprobación de puesta en marcha'],
          servicio: ['Mantenimiento de estándares'],
          cierre: ['Aseguramiento y cierre']
        },
        assignedEquipment: ['Equipos del puesto'],
        allergensFocus: [],
        docCategories: []
      } as KitchenStationArea;
    }
    return kitchenAreas[0] || null;
  }, [selectedStationKey, kitchenAreas, currentHotel, DEPARTMENT_STATIONS_MAP]);

  // Documentos cargados para el área activa
  const stationDocuments = useMemo(() => {
    if (!currentHotel || !selectedStationKey) return [];
    const fallbackKey = selectedStationKey === 'frio' ? 'frio_manana' : selectedStationKey === 'caliente' ? 'caliente_manana' : selectedStationKey === 'barmitonio' ? 'marmiton' : selectedStationKey;
    return (currentHotel.uploadedDocuments || []).filter(
      doc => doc.stationKey === selectedStationKey || doc.stationKey === fallbackKey
    );
  }, [currentHotel, selectedStationKey]);

  // Cargar datos operativos reactivos al seleccionar una estación
  const loadStationData = () => {
    if (!currentHotel || !selectedStationKey) return;
    const hotelId = currentHotel.id;

    const chk = proaAreaOperationsService.getStationChecklistItems(hotelId, selectedStationKey, checklistPhase);
    setChecklistItems(chk);

    const eq = proaAreaOperationsService.getStationEquipments(hotelId, selectedStationKey);
    setEquipments(eq);

    // Inicializar inputs de temperatura
    const initialTemps: Record<string, string> = {};
    eq.forEach(item => {
      initialTemps[item.id] = item.lastReading !== undefined ? item.lastReading.toString() : '';
    });
    setTempInputValues(initialTemps);

    const cln = proaAreaOperationsService.getStationCleaningTasks(hotelId, selectedStationKey);
    setCleaningTasks(cln);

    const prods = proaAreaOperationsService.getOpenedProducts(hotelId, selectedStationKey);
    setOpenedProducts(prods);

    const incs = proaAreaOperationsService.getStationIncidents(hotelId, selectedStationKey);
    setIncidents(incs);

    const hist = proaAreaOperationsService.getAuditHistory(hotelId, selectedStationKey);
    setHistoryRecords(hist);
  };

  useEffect(() => {
    loadStationData();
  }, [currentHotel?.id, selectedStationKey, checklistPhase]);

  // Toast auto-hide
  useEffect(() => {
    if (feedbackToast) {
      const timer = setTimeout(() => setFeedbackToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackToast]);

  // Manejadores de navegación
  const handleSelectHotel = (
    hotelId: string, 
    initialSubMode: 'casillas' | 'carta_menus' = 'casillas',
    initialTab: 'carta' | 'rueda_1' | 'rueda_2' | 'fichas' = 'rueda_1'
  ) => {
    setSelectedHotelId(hotelId);
    try {
      localStorage.setItem('proa_selected_hotel_id', hotelId);
    } catch {}
    demoHotelModelsService.setActiveModelId(hotelId);
    if (hotelId.includes('vulcano')) {
      setActiveOperator('Giacomo Longo');
    } else {
      setActiveOperator('Antonio González');
    }
    // Avanzar a nivel 2 o 3 directamente a departamentos
    setNavLevel('area_list');
    setSelectedStationKey(null);
    setHotelViewMode(initialSubMode);
    setCartaMenusInitialTab(initialTab);
  };

  const handleSelectStation = (stationKey: KitchenStationKey) => {
    setSelectedStationKey(stationKey);
    setNavLevel('station_dashboard');
    setStationActiveTab('checklists');
  };

  const handleAddDepartment = () => {
    if (!newDeptName.trim() || !currentHotel) return;
    const newDept: DepartmentConfig = {
      id: `dep-${Date.now()}`,
      companyId: 'company-generic-01',
      establishmentId: currentHotel.id,
      name: newDeptName.trim(),
      code: `DEP-${newDeptName.trim().slice(0, 3).toUpperCase()}`,
      category: newDeptCategory,
      status: 'activo'
    };

    const nextCustom = {
      ...customDepartments,
      [currentHotel.id]: [...(customDepartments[currentHotel.id] || []), newDept]
    };
    setCustomDepartments(nextCustom);
    try {
      localStorage.setItem('proa_custom_departments_by_hotel', JSON.stringify(nextCustom));
    } catch {}

    setNewDeptName('');
    setIsAddDeptModalOpen(false);
    setFeedbackToast({
      message: `Departamento "${newDept.name}" añadido exitosamente a ${currentHotel.name}`,
      type: 'success'
    });
  };

  const handleCreateNewHotel = () => {
    if (!newHotelName.trim()) return;
    const cloned = demoHotelModelsService.duplicateModel(
      models[0]?.id || 'model-bitacora',
      newHotelName.trim()
    );
    const updated = demoHotelModelsService.getModels();
    setModels(updated);
    setSelectedHotelId(cloned.id);
    setNavLevel('area_list');
    setIsAddHotelModalOpen(false);
    setNewHotelName('');
    setFeedbackToast({
      message: `Hotel "${cloned.name}" creado con estructura operativa independiente.`,
      type: 'success'
    });
  };

  // Métodos de Modificación de Actividades (Permisos para Antonio González y Giacomo Longo)
  const handleOpenEditActivity = (activity: EditableActivityData) => {
    setEditingActivity(activity);
    setIsEditActivityOpen(true);
  };

  const handleSaveActivity = (updated: EditableActivityData) => {
    if (!currentHotel || !selectedStationKey) return;
    
    if (updated.type === 'checklist') {
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === updated.id
            ? { ...item, label: updated.title }
            : item
        )
      );
    } else if (updated.type === 'temperatura') {
      setEquipments(prev =>
        prev.map(eq =>
          eq.id === updated.id
            ? { ...eq, name: updated.title, notes: updated.correctiveAction }
            : eq
        )
      );
    } else if (updated.type === 'limpieza') {
      setCleaningTasks(prev =>
        prev.map(task =>
          task.id === updated.id
            ? { ...task, areaOrEquipment: updated.title, frequency: (updated.frequency as any) || task.frequency }
            : task
        )
      );
    }

    setFeedbackToast({
      message: `Actividad "${updated.title}" modificada exitosamente por ${activeOperator}.`,
      type: 'success'
    });
  };

  const handleDeleteActivity = (id: string, type: any) => {
    if (type === 'checklist') {
      setChecklistItems(prev => prev.filter(i => i.id !== id));
    } else if (type === 'temperatura') {
      setEquipments(prev => prev.filter(i => i.id !== id));
    } else if (type === 'limpieza') {
      setCleaningTasks(prev => prev.filter(i => i.id !== id));
    }
    setFeedbackToast({
      message: 'Actividad eliminada de la estación.',
      type: 'success'
    });
  };

  // Acciones en Panel Operativo: Checklists
  const handleToggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : undefined,
              completedBy: !item.completed ? activeOperator : undefined
            }
          : item
      )
    );
  };

  const handleSaveChecklist = () => {
    if (!currentHotel || !selectedStationKey || !currentStationArea) return;
    proaAreaOperationsService.submitStationChecklist(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      checklistPhase,
      checklistItems,
      activeOperator
    );

    // Registro acumulativo en expediente sanitario
    const completedCount = checklistItems.filter(i => i.completed).length;
    const phaseLabel = checklistPhase === 'manana' ? 'Mañana (Servicio Diurno)' : 'Noche (Servicio Cierre)';
    cumulativeFolderService.addRecord(currentHotel.id, {
      hotelId: currentHotel.id,
      departmentId: `dep-cocina-${currentHotel.id}`,
      departmentName: 'Cocina & Gastronomía',
      family: 'checklists',
      familyLabel: 'Checklist Operativo de Turno',
      areaKey: selectedStationKey,
      areaName: currentStationArea.name,
      itemName: `Checklist Operativo de ${phaseLabel} (${completedCount}/${checklistItems.length} tareas realizadas)`,
      readingValue: `${Math.round((completedCount / (checklistItems.length || 1)) * 100)}% Completado`,
      targetRange: '100% de cumplimiento',
      status: completedCount === checklistItems.length ? 'conforme' : 'desviacion',
      operatorName: activeOperator,
      operatorRole: pinTier === 'admin' ? 'Administrador' : pinTier === 'jefe' ? 'Jefe de Departamento' : 'Operador / Empleado',
      shift: checklistPhase
    });

    setFeedbackToast({
      message: `Checklist de ${phaseLabel} guardado y certificado en expediente sanitario por ${activeOperator}.`,
      type: 'success'
    });
    loadStationData();
  };

  // Acciones en Panel Operativo: Temperaturas
  const handleSaveEquipmentTemp = (eq: StationEquipmentTemp) => {
    if (!currentHotel || !selectedStationKey || !currentStationArea) return;
    const rawVal = tempInputValues[eq.id];
    const val = parseFloat(rawVal);
    if (isNaN(val)) {
      setFeedbackToast({ message: 'Por favor, introduzca un valor numérico válido.', type: 'warn' });
      return;
    }

    const isDeviation = val < eq.tempMin || val > eq.tempMax;
    const corrective = tempCorrectiveActions[eq.id];

    if (isDeviation && (!corrective || !corrective.trim())) {
      setFeedbackToast({
        message: '¡Atención! La lectura está fuera de rango admisible. Debe indicar una acción correctiva obligatoria.',
        type: 'warn'
      });
      return;
    }

    const result = proaAreaOperationsService.saveEquipmentReading(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      eq.id,
      val,
      activeOperator,
      corrective
    );

    // Registro acumulativo en expediente sanitario
    cumulativeFolderService.addRecord(currentHotel.id, {
      hotelId: currentHotel.id,
      departmentId: `dep-cocina-${currentHotel.id}`,
      departmentName: 'Cocina & Gastronomía',
      family: 'temperaturas',
      familyLabel: 'Control de Temperaturas (APPCC)',
      areaKey: selectedStationKey,
      areaName: currentStationArea.name,
      itemName: eq.name,
      readingValue: `${val} ${eq.unit}`,
      targetRange: `${eq.tempMin} ${eq.unit} a ${eq.tempMax} ${eq.unit}`,
      status: result.isDeviation ? 'desviacion' : 'conforme',
      operatorName: activeOperator,
      operatorRole: pinTier === 'admin' ? 'Administrador' : pinTier === 'jefe' ? 'Jefe de Departamento' : 'Operador / Empleado',
      correctiveAction: corrective,
      shift: activeShift
    });

    setFeedbackToast({
      message: result.isDeviation
        ? `Desviación en ${eq.name} registrada en carpeta documental con acción correctiva para auditoría.`
        : `Control de temperatura conforme guardado (${val} ${eq.unit}) y sumado al archivo.`,
      type: result.isDeviation ? 'warn' : 'success'
    });

    loadStationData();
  };

  // Acciones en Panel Operativo: Limpieza
  const handleCompleteCleaning = (task: StationCleaningTask) => {
    if (!currentHotel || !selectedStationKey || !currentStationArea) return;
    proaAreaOperationsService.recordCleaningExecution(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      task.id,
      activeOperator
    );

    // Registro acumulativo en expediente sanitario
    cumulativeFolderService.addRecord(currentHotel.id, {
      hotelId: currentHotel.id,
      departmentId: `dep-cocina-${currentHotel.id}`,
      departmentName: 'Cocina & Gastronomía',
      family: 'limpieza',
      familyLabel: 'Plan de Limpieza y Desinfección (L+D)',
      areaKey: selectedStationKey,
      areaName: currentStationArea.name,
      itemName: `${task.areaOrEquipment} (${task.authorizedProduct})`,
      readingValue: 'Completado conforme',
      targetRange: task.frequency,
      status: 'conforme',
      operatorName: activeOperator,
      operatorRole: pinTier === 'admin' ? 'Administrador' : pinTier === 'jefe' ? 'Jefe de Departamento' : 'Operador / Empleado',
      shift: activeShift
    });

    setFeedbackToast({
      message: `Limpieza de "${task.areaOrEquipment}" registrada y sumada al archivo documental.`,
      type: 'success'
    });
    loadStationData();
  };

  // Acciones en Panel Operativo: Caducidades
  const handleLabelNewProduct = () => {
    if (!newProdName.trim() || !newProdLot.trim() || !currentHotel || !selectedStationKey || !currentStationArea) return;
    const hours = parseInt(newProdHours, 10) || 48;
    const expiryDate = new Date(Date.now() + hours * 3600000).toISOString();

    proaAreaOperationsService.addOpenedProduct(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      {
        productName: newProdName.trim(),
        batchLot: newProdLot.trim(),
        openedAt: new Date().toISOString(),
        secondaryExpiry: expiryDate,
        locationOrChamber: newProdLocation,
        operator: activeOperator
      }
    );

    // Registro acumulativo en expediente sanitario
    cumulativeFolderService.addRecord(currentHotel.id, {
      hotelId: currentHotel.id,
      departmentId: `dep-cocina-${currentHotel.id}`,
      departmentName: 'Cocina & Gastronomía',
      family: 'caducidades',
      familyLabel: 'Trazabilidad y Caducidades Secundarias',
      areaKey: selectedStationKey,
      areaName: currentStationArea.name,
      itemName: `Apertura envase: ${newProdName.trim()}`,
      readingValue: `Lote ${newProdLot.trim()} · Cad. ${hours}h`,
      targetRange: `Máx. ${hours}h tras apertura`,
      status: 'conforme',
      operatorName: activeOperator,
      operatorRole: pinTier === 'admin' ? 'Administrador' : pinTier === 'jefe' ? 'Jefe de Departamento' : 'Operador / Empleado',
      shift: activeShift
    });

    setNewProdName('');
    setNewProdLot('');
    setIsLabelProductModalOpen(false);
    setFeedbackToast({
      message: `Producto "${newProdName}" etiquetado y registrado en trazabilidad.`,
      type: 'success'
    });
    loadStationData();
  };

  const handleConsumeProduct = (prodId: string, reason: 'consumido' | 'retirado_por_caducidad') => {
    if (!currentHotel || !selectedStationKey || !currentStationArea) return;
    proaAreaOperationsService.markProductConsumed(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      prodId,
      activeOperator,
      reason
    );
    setFeedbackToast({
      message: reason === 'consumido' ? 'Producto marcado como consumido en servicio.' : 'Producto retirado por caducidad.',
      type: 'success'
    });
    loadStationData();
  };

  // Acciones en Panel Operativo: Incidencias
  const handleReportIncident = () => {
    if (!newIncTitle.trim() || !newIncDesc.trim() || !currentHotel || !selectedStationKey || !currentStationArea) return;

    proaAreaOperationsService.reportStationIncident(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      {
        hotelId: currentHotel.id,
        stationKey: selectedStationKey,
        title: newIncTitle.trim(),
        category: newIncCategory,
        severity: newIncSeverity,
        description: newIncDesc.trim(),
        correctiveActionTaken: newIncAction.trim() || 'Comunicado a responsable de turno',
        reportedBy: activeOperator
      }
    );

    // Registro acumulativo en expediente sanitario
    cumulativeFolderService.addRecord(currentHotel.id, {
      hotelId: currentHotel.id,
      departmentId: `dep-cocina-${currentHotel.id}`,
      departmentName: 'Cocina & Gastronomía',
      family: 'incidencias',
      familyLabel: 'Incidencias y Acciones Correctoras',
      areaKey: selectedStationKey,
      areaName: currentStationArea.name,
      itemName: newIncTitle.trim(),
      readingValue: `Severidad ${newIncSeverity.toUpperCase()}`,
      targetRange: 'Cero desviaciones no corregidas',
      status: 'desviacion',
      operatorName: activeOperator,
      operatorRole: pinTier === 'admin' ? 'Administrador' : pinTier === 'jefe' ? 'Jefe de Departamento' : 'Operador / Empleado',
      correctiveAction: newIncAction.trim() || newIncDesc.trim(),
      shift: activeShift
    });

    setNewIncTitle('');
    setNewIncDesc('');
    setNewIncAction('');
    setIsNewIncidentModalOpen(false);
    setFeedbackToast({
      message: 'Incidencia registrada en historial con trazabilidad inmediata.',
      type: 'success'
    });
    loadStationData();
  };

  const handleResolveIncident = (incidentId: string) => {
    if (!currentHotel || !selectedStationKey || !currentStationArea) return;
    proaAreaOperationsService.resolveStationIncident(
      currentHotel.id,
      selectedStationKey,
      currentStationArea.name,
      incidentId,
      activeOperator,
      'Verificado y subsanado por supervisor en turno'
    );
    setFeedbackToast({
      message: 'Incidencia marcada como resuelta.',
      type: 'success'
    });
    loadStationData();
  };

  // Acciones en Panel Operativo: Subir Documento
  const handleUploadDocument = () => {
    if (!newDocTitle.trim() || !currentHotel || !selectedStationKey) return;
    const newDoc: UploadedDocumentRecord = {
      id: `doc-${Date.now()}`,
      companyId: 'company-generic-01',
      hotelModelId: currentHotel.id,
      establishmentId: currentHotel.id,
      stationKey: selectedStationKey,
      categoryKey: newDocCategory,
      title: newDocTitle.trim(),
      fileName: `${newDocTitle.trim().replace(/\s+/g, '_')}.${newDocType === 'xlsx' ? 'xlsx' : newDocType === 'docx' ? 'docx' : 'pdf'}`,
      fileSize: '450 KB',
      fileType: newDocType,
      version: '1.0',
      status: 'publicado',
      authorName: activeOperator,
      authorRole: 'Jefe de Partida / Supervisor',
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      summary: newDocSummary.trim() || 'Documentación técnica incorporada a la estación de trabajo.'
    };

    demoHotelModelsService.saveUploadedDocument(newDoc);
    const updated = demoHotelModelsService.getModels();
    setModels(updated);
    setIsNewDocModalOpen(false);
    setNewDocTitle('');
    setNewDocSummary('');
    setFeedbackToast({
      message: `Documento "${newDoc.title}" subido y disponible en el puesto.`,
      type: 'success'
    });
  };

  // Subida múltiple y rápida de documentos al departamento activo
  const handleDepartmentMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !currentHotel || !selectedStationKey) return;

    let addedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const detectedFmt = detectFileFormat(file.name);
      const fileType = detectedFmt === 'xlsx' || detectedFmt === 'xls'
        ? 'xlsx'
        : detectedFmt === 'docx' || detectedFmt === 'doc'
        ? 'docx'
        : detectedFmt === 'image'
        ? 'imagen'
        : 'pdf';

      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      let previewUrl: string | undefined = undefined;
      try {
        previewUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      } catch {}

      const newDoc: UploadedDocumentRecord = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        companyId: 'company-generic-01',
        hotelModelId: currentHotel.id,
        establishmentId: currentHotel.id,
        stationKey: selectedStationKey,
        categoryKey: 'elaboraciones',
        title: cleanTitle,
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024) || 1} KB`,
        fileType: fileType,
        version: '1.0',
        status: 'publicado',
        authorName: activeOperator,
        authorRole: 'Jefe de Partida / Chef',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        summary: `Documentación técnica incorporada a la partida de ${currentStationArea?.name || 'la cocina'}.`,
        previewUrl
      };

      demoHotelModelsService.saveUploadedDocument(newDoc);
      addedCount++;
    }

    const updated = demoHotelModelsService.getModels();
    setModels(updated);
    setFeedbackToast({
      message: `${addedCount} archivo(s) subido(s) correctamente a ${currentStationArea?.name || 'la partida'}.`,
      type: 'success'
    });
    e.target.value = '';
  };

  // Icono del área
  const getStationIcon = (key: KitchenStationKey) => {
    switch (key) {
      case 'cafeteria':
        return <Coffee className="w-5 h-5 text-[#C5A880]" />;
      case 'frio':
      case 'frio_manana':
      case 'frio_tarde':
        return <Snowflake className="w-5 h-5 text-sky-500" />;
      case 'caliente':
      case 'caliente_manana':
      case 'caliente_tarde':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'manana':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'tarde':
        return <Sunset className="w-5 h-5 text-orange-400" />;
      case 'barmitonio':
      case 'marmiton':
        return <UtensilsCrossed className="w-5 h-5 text-emerald-600" />;
      case 'menu_rueda_1':
      case 'menu_rueda_2':
        return <Calendar className="w-5 h-5 text-indigo-400" />;
      case 'pasteleria':
        return <Cake className="w-5 h-5 text-purple-500" />;
      case 'pisos_habitaciones':
      case 'pisos_lenceria':
      case 'pisos_zonas_comunes':
      case 'pisos_auditoria':
        return <BedDouble className="w-5 h-5 text-indigo-400" />;
      case 'mant_climatizacion':
      case 'mant_piscinas':
      case 'mant_electricidad':
      case 'mant_sst':
        return <Wrench className="w-5 h-5 text-sky-400" />;
      case 'bar_piscina':
      case 'bar_hall':
      case 'bar_salones':
        return <Wine className="w-5 h-5 text-rose-400" />;
      case 'recep_mostrador':
      case 'recep_auditoria':
      case 'recep_guest_experience':
        return <ConciergeBell className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-[#C5A880]" />;
    }
  };

  // =========================================================================
  // PORTADA MODERNA: HERO SPLIT / DASHBOARD DE LUJO A PANTALLA COMPLETA
  // =========================================================================
  if (navLevel === 'portada') {
    return (
      <div className="h-screen h-dvh max-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-[#022042] text-white font-sans selection:bg-[#E8B849]/30 selection:text-white">
        {/* Feedback Toast en Portada */}
        {feedbackToast && (
          <div className="fixed top-4 right-4 z-50 max-w-md animate-fade-in shadow-xl">
            <div
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                feedbackToast.type === 'warn'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              {feedbackToast.type === 'warn' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-semibold leading-relaxed flex-1">
                {feedbackToast.message}
              </div>
              <button
                onClick={() => setFeedbackToast(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PORTADA PRINCIPAL: CUBIERTA CORPORATIVA PABLO FONDELLI
            Al tocar la portada o el botón se entra al sistema operacional
            ========================================================================= */}
        <div 
          onClick={() => {
            setNavLevel('hotel');
            setSelectedStationKey(null);
          }}
          className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-2 pb-9 sm:pb-10 cursor-pointer select-none group"
          role="button"
          tabIndex={0}
          title="Presione aquí para avanzar a producción"
        >
          {/* Cubierta con nueva imagen corporativa que aprovecha el espacio disponible dejando holgura al pie */}
          <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-[1.01] active:scale-[0.99]">
            <div className="relative inline-flex items-center justify-center max-h-[calc(100dvh-200px)] sm:max-h-[calc(100dvh-175px)] aspect-[2/3] max-w-[94vw] rounded-2xl shadow-2xl">
              <img
                src="/assets/aistudio/1793483557803_3ac834ff.png"
                alt="Pablo Fondelli · Consultor en Food & Beverage Management"
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Botón interactivo: Bajado 5-6 mm adicionales (aprox. 22px más abajo) para despegarlo completamente de las letras */}
              <div className="absolute -bottom-9 sm:-bottom-10 left-1/2 -translate-x-1/2 w-max pointer-events-auto z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNavLevel('hotel');
                    setSelectedStationKey(null);
                  }}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-2xl shadow-black/90 border-2 border-white/90 flex items-center gap-2 group-hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-amber-400/30"
                  title="Presione para entrar al sistema de jefaturas"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="whitespace-nowrap font-extrabold uppercase tracking-wider">Acceso a Jefaturas</span>
                  <ChevronRight className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PIE DE PORTADA: BOTONES INFERIORES MANTENIDOS EXACTAMENTE IGUAL
            ========================================================================= */}
        <footer className="relative z-20 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-2 pb-5 sm:pb-6 flex flex-row items-center justify-center gap-2 sm:gap-3 text-xs border-t border-cyan-900/60 bg-[#021832]/80 backdrop-blur-sm text-slate-200 shrink-0">
          {/* Botón 1: Dirección */}
          <button
            onClick={() => setIsAuthorModalOpen(true)}
            className="flex-1 max-w-[170px] h-11 sm:h-12 px-2.5 sm:px-4 rounded-2xl bg-[#072B4D] hover:bg-[#0a3865] text-cyan-100 hover:text-white border-2 border-cyan-500/60 text-xs font-bold shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            title="Dirección del proyecto y arquitecto responsable"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">Dirección</span>
          </button>

          {/* Botón 2: Manual */}
          <button
            onClick={() => openUserManual()}
            className="flex-1 max-w-[160px] h-11 sm:h-12 px-2.5 sm:px-4 rounded-2xl bg-[#072B4D] hover:bg-[#0a3865] text-teal-200 hover:text-white border-2 border-teal-500/60 text-xs font-bold shadow-lg shadow-black/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            title="Manual de Usuario y Centro de Ayuda"
          >
            <BookOpen className="w-4 h-4 text-teal-300 shrink-0" />
            <span className="whitespace-nowrap">Manual</span>
          </button>

          {/* Botón 3: Modo Jefe */}
          <div className="flex-1 max-w-[200px] flex items-center justify-center">
            {isChefAdminMode ? (
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => setIsProaAdminPanelOpen(true)}
                  className="flex-1 h-11 sm:h-12 px-2.5 sm:px-3 rounded-2xl bg-[#FFB800] hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-black/30 border-2 border-amber-300 transition-all cursor-pointer whitespace-nowrap active:scale-98"
                  title="Panel Modo Jefe"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" />
                  <span>Modo Jefe</span>
                </button>
                <button
                  onClick={() => {
                    setPinTier('empleado');
                    setCurrentOperatorRole('trabajador');
                    try {
                      localStorage.setItem('proa_active_pin_tier', 'empleado');
                    } catch {}
                    setFeedbackToast({
                      message: 'Modo Jefe cerrado. Ha vuelto al Modo Trabajador.',
                      type: 'success'
                    });
                  }}
                  className="h-11 sm:h-12 w-11 rounded-2xl bg-[#0A223E] hover:bg-rose-950/80 text-rose-300 border-2 border-slate-700/80 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-98"
                  title="Cerrar Modo Jefe (Candado)"
                >
                  <Lock className="w-4 h-4 text-rose-300" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPinAuthOpen(true)}
                className="w-full h-11 sm:h-12 px-2.5 sm:px-4 rounded-2xl bg-[#FFB800] hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-black/30 border-2 border-amber-300 transition-all cursor-pointer whitespace-nowrap active:scale-98"
                title="Acceso Modo Jefe (PIN Requerido)"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" />
                <span>Modo Jefe</span>
              </button>
            )}
          </div>
        </footer>

        {/* Modal de Dirección del Proyecto / Pablo Fondelli */}
        <PabloFondelliModal
          isOpen={isAuthorModalOpen}
          onClose={() => setIsAuthorModalOpen(false)}
        />

        {/* Modal de PIN si se solicita desde la portada */}
        {isPinAuthOpen && (
          <PinAuthModal
            isOpen={isPinAuthOpen}
            onClose={() => setIsPinAuthOpen(false)}
            onSuccess={(tier) => {
              setPinTier(tier);
              setCurrentOperatorRole(tier === 'admin' ? 'administrador' : 'jefe_cocina');
              try {
                localStorage.setItem('proa_active_pin_tier', tier);
              } catch {}
              setFeedbackToast({
                message: `Autenticación correcta como ${tier === 'admin' ? 'Administrador General' : 'Jefe de Cocina'}.`,
                type: 'success'
              });
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
      {/* =========================================================================
          TOP BAR INSTITUCIONAL DE PROA (SLATE-900 / ALTO CONTRASTE)
          ========================================================================= */}
      <header className="bg-[#2C3E4C] text-white border-b border-slate-700/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-1.5 sm:py-2 min-h-12 sm:min-h-14 flex items-center justify-between gap-2 flex-wrap">
          {/* Logo de la plataforma */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setNavLevel('portada');
                setSelectedStationKey(null);
              }}
              className="flex items-center group focus:outline-hidden cursor-pointer"
              title="Volver a Portada Principal · Pablo Fondelli"
            >
              <img
                src="/assets/aistudio/grok_1793484133769_3447b05d.jpg"
                alt="PF · Pablo Fondelli"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover border border-[#E8B849]/60 shrink-0 shadow-sm group-hover:scale-105 group-hover:border-[#E8B849] transition-all"
              />
            </button>
          </div>

          {/* Botones de acción compactos sin barra deslizante */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {/* Botón Manual de Usuario & Centro de Ayuda */}
            <button
              onClick={() => openUserManual()}
              className="h-6 sm:h-7 px-2 sm:px-2.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white border border-teal-400/40 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Manual de Usuario y Centro de Ayuda Operativo"
            >
              <BookOpen className="w-3 h-3 text-teal-300" />
              <span className="hidden sm:inline">Manual de Usuario</span>
              <span className="sm:hidden">Manual</span>
            </button>

            {/* Botón Acceso Rápido a Métricas / Dashboard */}
            <button
              onClick={() => {
                setNavLevel('area_list');
                setHotelViewMode('dashboard');
                setSelectedStationKey(null);
              }}
              className={`h-6 sm:h-7 px-2 rounded-lg transition-all flex items-center gap-1 border text-[11px] font-bold cursor-pointer ${
                navLevel === 'area_list' && hotelViewMode === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title="Abrir Dashboard de Métricas Operativas"
            >
              <BarChart3 className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Métricas</span>
            </button>

            {/* Separación estricta Modo Trabajador vs Modo Administrador / Chef */}
            {isChefAdminMode ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsProaAdminPanelOpen(true)}
                  className="h-6 sm:h-7 px-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Abrir Panel Jefe"
                >
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                  <span>Jefe</span>
                </button>
                <button
                  onClick={() => {
                    setPinTier('empleado');
                    setCurrentOperatorRole('trabajador');
                    try {
                      localStorage.setItem('proa_active_pin_tier', 'empleado');
                    } catch {}
                    setFeedbackToast({
                      message: 'Modo Jefe cerrado. Ha vuelto al Modo Trabajador.',
                      type: 'success'
                    });
                  }}
                  className="h-6 sm:h-7 px-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold text-[11px] rounded-lg transition-all flex items-center cursor-pointer"
                  title="Cerrar Modo Jefe"
                >
                  <Lock className="w-3 h-3 text-rose-300" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPinAuthOpen(true)}
                className="w-7 h-7 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white rounded-lg transition-all flex items-center justify-center border border-white/10 cursor-pointer shrink-0"
                title="Acceso restringido"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>

        {/* Migas de pan de navegación limpias (ocultas en la portada y en la vista principal de hoteles) */}
        {navLevel !== 'portada' && navLevel !== 'hotel' && (
          <div className="bg-slate-950/80 border-t border-slate-800 px-2.5 sm:px-6 py-1.5">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5 text-[11px] text-white/70">
              <button
                onClick={() => {
                  setNavLevel('hotel');
                  setSelectedStationKey(null);
                }}
                className={`hover:text-white font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                  navLevel === 'hotel' ? 'text-amber-400 font-bold' : ''
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                <span>Cocinas de Hotel</span>
              </button>

              {currentHotel && (navLevel === 'area_list' || navLevel === 'station_dashboard') && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <button
                    onClick={() => {
                      setNavLevel('area_list');
                      setHotelViewMode('casillas');
                      setSelectedStationKey(null);
                    }}
                    className={`hover:text-white font-medium flex items-center gap-1 transition-colors shrink-0 ${
                      navLevel === 'area_list' && hotelViewMode === 'casillas' ? 'text-amber-400 font-bold' : ''
                    }`}
                  >
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>Cocina — {currentHotel.name}</span>
                  </button>

                  {navLevel === 'area_list' && hotelViewMode === 'carta_menus' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>Ruedas de Menú, Recetas y Fichas</span>
                      </span>
                    </>
                  )}

                  {navLevel === 'area_list' && hotelViewMode === 'epis' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>Control Mensual de EPIs (APPCC / PRL)</span>
                      </span>
                    </>
                  )}

                  {navLevel === 'area_list' && hotelViewMode === 'dashboard' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                        <BarChart3 className="w-3 h-3 text-amber-400" />
                        <span>Métricas & Dashboard Operativo</span>
                      </span>
                    </>
                  )}
                </>
              )}

              {currentStationArea && navLevel === 'station_dashboard' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
                    {getStationIcon(currentStationArea.key)}
                    <span>{currentStationArea.name}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-24 right-4 z-50 max-w-md animate-fade-in shadow-xl">
          <div
            className={`flex items-start gap-3 p-3.5 rounded-xl border ${
              feedbackToast.type === 'warn'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            {feedbackToast.type === 'warn' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs font-semibold leading-relaxed flex-1">
              {feedbackToast.message}
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENIDO PRINCIPAL DINÁMICO SEGÚN EL NIVEL DE NAVEGACIÓN
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* =====================================================================
            PANTALLA DE PORTADA: SELLO PF INTERACTIVO Y CABECERA LIMPIA
            ===================================================================== */}
        {/* =====================================================================
            NIVEL 1: PANTALLA PRINCIPAL DE HOTELES — COCINAS DE HOTEL OPERATIVAS
            Entrada directa con 1 clic: Cocina — Hotel Bitácora & Cocina — Hotel Vulcano
            ===================================================================== */}
        {navLevel === 'hotel' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Encabezado limpio y directo con buen espaciado */}
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-2 mb-6">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Cocinas de Hotel Operativas
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Seleccione el establecimiento para gestionar departamentos, operativas de pase y auditoría APPCC.
              </p>
              <button
                onClick={() => openUserManual('capitulo_1_primeros_pasos')}
                className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-teal-900 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>¿Dudas sobre el funcionamiento? Consultar Capítulo I: Primeros Pasos</span>
                <ChevronRight className="w-3 h-3 text-teal-500" />
              </button>
            </div>

            {/* Grid con las dos tarjetas limpias de Hotel: Bitácora (Turquesa) & Vulcano (Esmeralda) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* TARJETA 1: COCINA — HOTEL BITÁCORA */}
              <div
                onClick={() => handleSelectHotel('model-bitacora', 'casillas')}
                className="bg-white rounded-3xl border-2 border-teal-500/30 hover:border-teal-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full overflow-hidden group cursor-pointer"
              >
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <span className="inline-block whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        HOTEL BITÁCORA · 4★ SUPERIOR
                      </span>
                      <span className="text-amber-500 text-xs font-bold tracking-tight">★★★★</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors mt-1 leading-tight">
                      Hotel Bitácora
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-1 truncate whitespace-nowrap">
                      Playa de Las Américas, Tenerife · Cocina & Buffet Operativo
                    </p>
                  </div>

                  {/* Fotografía y Datos del Chef Antonio González */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5 min-h-[110px]">
                    <img
                      src={bitacoraChef.photoUrl || '/assets/aistudio/chef1_6d694bfa.jfif'}
                      alt={bitacoraChef.chefName}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-teal-500 shadow-md group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="text-[10px] uppercase font-bold text-teal-700 truncate">DIRECCIÓN DE COCINA</div>
                      <div className="text-base font-extrabold text-slate-900 truncate leading-tight mt-0.5">
                        Antonio González
                      </div>
                      <div className="text-xs text-teal-700 font-semibold truncate mt-0.5">
                        Chef Ejecutivo de Cocina y Buffet
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        14 años de trayectoria · Hotel Bitácora
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción simétricos Bitácora */}
                <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap truncate">
                    7 Partidas Operativas · Turnos M / T / N
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHotel('model-bitacora', 'carta_menus', 'rueda_1');
                      }}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                      title="Acceso directo a Ruedas de Menú de 15 Días"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Ruedas de Menú</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHotel('model-bitacora', 'casillas');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                    >
                      <span>Acceder a Bitácora</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TARJETA 2: COCINA — HOTEL VULCANO */}
              <div
                onClick={() => handleSelectHotel('model-vulcano', 'casillas')}
                className="bg-white rounded-3xl border-2 border-emerald-500/30 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full overflow-hidden group cursor-pointer"
              >
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <span className="inline-block whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        HOTEL VULCANO · 4★ SUPERIOR
                      </span>
                      <span className="text-amber-500 text-xs font-bold tracking-tight">★★★★</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mt-1 leading-tight">
                      Hotel Vulcano
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-1 truncate whitespace-nowrap">
                      Playa de Las Américas, Tenerife · Cocina & Buffet Operativo
                    </p>
                  </div>

                  {/* Fotografía y Datos del Chef Giacomo Longo */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5 min-h-[110px]">
                    <img
                      src={vulcanoChef.photoUrl || '/assets/aistudio/chef2_7a8fd6b5.png'}
                      alt={vulcanoChef.chefName}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-500 shadow-md group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-700 truncate">DIRECCIÓN DE COCINA</div>
                      <div className="text-base font-extrabold text-slate-900 truncate leading-tight mt-0.5">
                        Giacomo Longo
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold truncate mt-0.5">
                        Chef Ejecutivo de Cocina y Buffet
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        8 años de trayectoria · Hotel Vulcano
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción simétricos Vulcano */}
                <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap truncate">
                    7 Partidas Operativas · Turnos M / T / N
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHotel('model-vulcano', 'carta_menus', 'rueda_1');
                      }}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                      title="Acceso directo a Ruedas de Menú de 15 Días"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Ruedas de Menú</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHotel('model-vulcano', 'casillas');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                    >
                      <span>Acceder a Vulcano</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCESO AL DASHBOARD DE MÉTRICAS OPERATIVAS & RECHARTS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 border border-slate-800">
                  <BarChart3 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Métricas Operativas & Auditoría APPCC
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tasas de checklist, conformidad térmica, plan L+D y comparativa entre Hotel Bitácora y Hotel Vulcano.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedHotelId('model-bitacora');
                  setNavLevel('area_list');
                  setHotelViewMode('dashboard');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Ver Métricas & Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            NIVEL 2 & 3: PANTALLA DE TRABAJO DEL HOTEL (BITÁCORA O VULCANO)
            Barra superior compacta y elegante + 3 Pestañas sin partir líneas
            ===================================================================== */}
        {navLevel === 'area_list' && currentHotel && (
          <div className="space-y-6 animate-fade-in pt-5">
            {/* BARRA SUPERIOR COMPACTA Y ELEGANTE DEL HOTEL */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Izquierda: Botón Cambiar Hotel + Avatar del Chef y Hotel */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => {
                    setNavLevel('portada');
                    setSelectedStationKey(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  title="Volver a Portada Principal"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Portada</span>
                </button>

                <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                {/* Avatar pequeño del chef y títulos */}
                <div 
                  onClick={() => setShowChefModal(true)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                  title="Click para ver ficha del chef"
                >
                  {currentChef.photoUrl ? (
                    <img
                      src={currentChef.photoUrl}
                      alt={currentChef.chefName}
                      className={`w-10 h-10 rounded-xl object-cover border-2 ${
                        currentHotel.id.includes('bitacora') ? 'border-teal-500' : 'border-emerald-500'
                      } shadow-xs group-hover:scale-105 transition-transform shrink-0`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 shrink-0">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-none">
                        Cocina — {currentHotel.name}
                      </h1>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        currentHotel.id.includes('bitacora')
                          ? 'text-teal-700 bg-teal-50 border-teal-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {'★'.repeat(currentHotel.stars || 4)} 4★ Superior
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <ChefHat className={`w-3 h-3 ${currentHotel.id.includes('bitacora') ? 'text-teal-600' : 'text-emerald-600'}`} />
                      <span className="font-semibold text-slate-700">{currentChef.chefName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">{currentChef.roleTitle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derecha: Pestañas superiores fijas, compactas y sin barra deslizante */}
              <div className="grid grid-cols-2 sm:grid-cols-4 items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold gap-1 w-full md:w-auto">
                <button
                  onClick={() => setHotelViewMode('casillas')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs font-semibold ${
                    hotelViewMode === 'casillas'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span className="truncate">Departamentos</span>
                </button>

                <button
                  onClick={() => {
                    setCartaMenusInitialTab('rueda_1');
                    setHotelViewMode('carta_menus');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs font-semibold ${
                    hotelViewMode === 'carta_menus'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">Ruedas & Recetas</span>
                </button>

                <button
                  onClick={() => setHotelViewMode('epis')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs font-semibold ${
                    hotelViewMode === 'epis'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="Firma Mensual de Control de EPIs APPCC / PRL"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate">Control EPIs (APPCC)</span>
                </button>

                <button
                  onClick={() => setHotelViewMode('dashboard')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs font-semibold ${
                    hotelViewMode === 'dashboard'
                      ? 'bg-slate-900 text-amber-400 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
                  <span className="truncate">Métricas</span>
                </button>
              </div>
            </div>

            {/* CONTENIDO SEGÚN MODO SELECCIONADO: CARTA / MENÚS, DASHBOARD, EPIS O LOS 7 DEPARTAMENTOS */}
            {hotelViewMode === 'carta_menus' ? (
              <CartaMenusFichasHub
                hotelId={currentHotel.id}
                hotelName={currentHotel.name}
                onBack={() => setHotelViewMode('casillas')}
                userRole={pinTier}
                authorName={activeOperator}
                initialTab={cartaMenusInitialTab}
              />
            ) : hotelViewMode === 'epis' ? (
              <MonthlyEpisControlView
                hotelId={currentHotel.id}
                hotelName={currentHotel.name}
                stationKey="general_cocina"
                stationName="Cocina & Buffet Central"
                currentChefName={currentChef.chefName}
                currentChefRole={currentChef.roleTitle}
                userRole={pinTier}
                onClose={() => setHotelViewMode('casillas')}
              />
            ) : hotelViewMode === 'dashboard' ? (
              <Dashboard
                initialHotelId={currentHotel.id}
                onClose={() => setHotelViewMode('casillas')}
                onSelectStation={(hId, stKey) => {
                  setSelectedHotelId(hId);
                  handleSelectStation(stKey);
                }}
              />
            ) : (
              /* SECCIÓN PRINCIPAL: DEPARTAMENTOS OPERATIVOS DEL HOTEL */
              <div className="space-y-4 pt-1">
                {/* SELECTOR DE DEPARTAMENTO DEL HOTEL (COMPACTO, FIJO Y SIN SCROLLBAR) */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-2 sm:p-2.5 shadow-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Departamentos Operativos:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-1.5">
                    {[
                      { id: 'cocina' as const, label: 'Cocina & Gastronomía', icon: UtensilsCrossed, badge: '7' },
                      { id: 'pisos' as const, label: 'Pisos & Housekeeping', icon: BedDouble, badge: '3' },
                      { id: 'mantenimiento' as const, label: 'Mantenimiento & SST', icon: Wrench, badge: '3' },
                      { id: 'barra' as const, label: 'Bares & Restauración', icon: Wine, badge: '3' },
                      { id: 'recepcion' as const, label: 'Recepción & Front Office', icon: ConciergeBell, badge: '3' },
                    ].map((dept) => {
                      const DeptIcon = dept.icon;
                      const isActive = activeDepartmentCategory === dept.id;
                      return (
                        <button
                          key={dept.id}
                          onClick={() => setActiveDepartmentCategory(dept.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer border ${
                            isActive
                              ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs ring-1 ring-amber-400/30'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <DeptIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                            <span className="truncate">{dept.label}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {dept.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="inline-flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        currentHotel.id.includes('bitacora')
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {currentHotel.name} · Estructura Operativa
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight leading-tight">
                      {activeDepartmentCategory === 'cocina' && <UtensilsCrossed className="w-5 h-5 text-teal-600" />}
                      {activeDepartmentCategory === 'pisos' && <BedDouble className="w-5 h-5 text-indigo-600" />}
                      {activeDepartmentCategory === 'mantenimiento' && <Wrench className="w-5 h-5 text-amber-600" />}
                      {activeDepartmentCategory === 'barra' && <Wine className="w-5 h-5 text-rose-600" />}
                      {activeDepartmentCategory === 'recepcion' && <ConciergeBell className="w-5 h-5 text-blue-600" />}
                      <span>
                        {activeDepartmentCategory === 'cocina' && 'Cocina & Gastronomía'}
                        {activeDepartmentCategory === 'pisos' && 'Pisos & Housekeeping'}
                        {activeDepartmentCategory === 'mantenimiento' && 'Mantenimiento Técnico & SST'}
                        {activeDepartmentCategory === 'barra' && 'Bares & Restauración'}
                        {activeDepartmentCategory === 'recepcion' && 'Recepción & Front Office'}
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Áreas operativas, maquinaria crítica, tolerancias y checklists operativos en 2 servicios de datos (Mañana y Noche) para {currentHotel.name}.
                    </p>
                  </div>

                  {/* Acceso a ficha del Chef */}
                  {activeDepartmentCategory === 'cocina' && (
                    <button
                      onClick={() => setShowChefModal(true)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-800 shadow-xs cursor-pointer self-start sm:self-auto whitespace-nowrap"
                    >
                      <ChefHat className={`w-4 h-4 ${currentHotel.id.includes('bitacora') ? 'text-teal-600' : 'text-emerald-600'}`} />
                      <span>Chef: {currentChef.chefName}</span>
                    </button>
                  )}
                </div>

                {/* Acceso Rápido Sincronizado a Ruedas de Menú (15 Días) para Bitácora y Vulcano */}
                {activeDepartmentCategory === 'cocina' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCartaMenusInitialTab('rueda_1');
                        setHotelViewMode('carta_menus');
                      }}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm cursor-pointer ${
                        currentHotel.id.includes('bitacora')
                          ? 'bg-teal-50/70 border-teal-200 hover:border-teal-400 text-teal-950'
                          : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs ${
                          currentHotel.id.includes('bitacora') ? 'bg-teal-700' : 'bg-emerald-700'
                        }`}>
                          R1
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight flex items-center gap-1.5 truncate">
                            <span>Menú — Rueda 1</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 font-semibold border border-slate-200 text-slate-700">
                              Ciclo 15 Días
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            Desayuno, Almuerzo y Cena rotativa de buffet
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCartaMenusInitialTab('rueda_2');
                        setHotelViewMode('carta_menus');
                      }}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm cursor-pointer ${
                        currentHotel.id.includes('bitacora')
                          ? 'bg-teal-50/70 border-teal-200 hover:border-teal-400 text-teal-950'
                          : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-400 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs ${
                          currentHotel.id.includes('bitacora') ? 'bg-teal-800' : 'bg-emerald-800'
                        }`}>
                          R2
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight flex items-center gap-1.5 truncate">
                            <span>Menú — Rueda 2</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/90 font-semibold border border-slate-200 text-slate-700">
                              Ciclo 15 Días
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            Segundo ciclo quincenal alternativo de producción
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  </div>
                )}

                {/* Grid con los 7 Departamentos Canónicos (Alineación geométrica milimétrica) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
                  {CANONICAL_HOTEL_CASILLAS.map(casilla => {
                    const isBitacora = currentHotel.id.includes('bitacora');
                    const roleLabel = (casilla as any).roleName || casilla.badge;
                    return (
                      <div
                        key={casilla.number}
                        onClick={() => handleSelectStation(casilla.key)}
                        className={`bg-white rounded-2xl border-2 border-slate-200/80 ${
                          isBitacora ? 'hover:border-teal-500' : 'hover:border-emerald-500'
                        } transition-all flex flex-col justify-between h-full overflow-hidden group shadow-xs hover:shadow-md cursor-pointer`}
                      >
                        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  {getStationIcon(casilla.key)}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                                    Partida 0{casilla.number}
                                  </div>
                                  <h3 className={`text-sm sm:text-base font-bold text-slate-900 ${
                                    isBitacora ? 'group-hover:text-teal-700' : 'group-hover:text-emerald-700'
                                  } transition-colors truncate leading-tight`}>
                                    {casilla.name}
                                  </h3>
                                </div>
                              </div>

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isBitacora
                                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              } whitespace-nowrap shrink-0`}>
                                {casilla.badge}
                              </span>
                            </div>

                            {/* Puesto Operativo unificado */}
                            <div className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 truncate mb-2.5">
                              <span className="text-slate-400 font-medium">Puesto:</span> <span className="font-bold text-slate-800">{roleLabel}</span>
                            </div>

                            {/* Descripción estandarizada (2 líneas exactas min-h-[40px]) */}
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 min-h-[40px]">
                              {casilla.desc}
                            </p>
                          </div>

                          {/* Indicadores operativos de la partida */}
                          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Controles APPCC</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <ClipboardCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Checklists</span>
                            </span>
                          </div>
                        </div>

                        {/* Botón de acceso al departamento */}
                        <div className={`w-full py-2.5 px-4 bg-slate-50 ${
                          isBitacora
                            ? 'group-hover:bg-teal-600 group-hover:text-white'
                            : 'group-hover:bg-emerald-600 group-hover:text-white'
                        } text-slate-700 font-bold text-xs border-t border-slate-100 flex items-center justify-between transition-colors whitespace-nowrap`}>
                          <span className="truncate">Acceder a Partida</span>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            NIVEL 4: PANEL OPERATIVO DE UN ÁREA (Ejemplo Práctico: Cafetería)
            PROA → [Hotel] → Cocina → Cafetería → Tareas, Controles y Documentación
            ===================================================================== */}
        {navLevel === 'station_dashboard' && currentStationArea && currentHotel && (
          <div className="space-y-6 animate-fade-in">
            {/* Header del Área Operativa */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${
                    currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white' : 'bg-emerald-600 text-white'
                  } flex items-center justify-center shrink-0 shadow-xs`}>
                    {getStationIcon(currentStationArea.key)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                        {currentStationArea.code}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Departamento Cocina · Área Operativa
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                      {currentStationArea.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Horario: {currentStationArea.shiftSchedule}</span>
                      </span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">
                        Turno activo: {activeShift.toUpperCase()} ({currentChef.chefName || activeOperator})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones de cabecera */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => setNavLevel('area_list')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a Cocina</span>
                  </button>
                  <button
                    onClick={() => openUserManual('capitulo_6_checklists_controles')}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Consultar manual sobre listas de comprobación y APPCC"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                    <span>Guía de Puesto</span>
                  </button>
                  <button
                    onClick={() => setIsNewIncidentModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reportar Incidencia</span>
                  </button>
                </div>
              </div>

              {/* Pestañas Operativas del Área (Compactas, fijas y sin barra deslizante) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-1.5 pt-3 mt-3 border-t border-slate-100">
                <button
                  onClick={() => setStationActiveTab('checklists')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'checklists'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Checklist (M/N)</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('temperaturas')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'temperaturas'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Temperaturas ({equipments.length})</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('limpieza')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'limpieza'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Limpieza L+D</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('caducidades')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'caducidades'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Caducidades ({openedProducts.length})</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('documentos')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'documentos'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Fichas & Recetas</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('incidencias')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'incidencias'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Incidencias ({incidents.length})</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('epis')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'epis'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                  title="Control y Firma Mensual de EPIs APPCC / PRL"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Control EPIs (Mensual)</span>
                </button>

                <button
                  onClick={() => setStationActiveTab('historial')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    stationActiveTab === 'historial'
                      ? currentHotel.id.includes('bitacora') ? 'bg-teal-600 text-white shadow-xs' : 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Historial</span>
                </button>
              </div>
            </div>

            {/* =================================================================
                SECCIÓN A: CHECKLIST OPERATIVO DE SERVICIO (MAÑANA Y NOCHE)
                ================================================================= */}
            {stationActiveTab === 'checklists' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-xs">
                      <span className="font-serif font-black text-amber-400 text-xs select-none">PF</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#1A2530]">
                          Checklist Operativo del Puesto: {currentStationArea.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-amber-400/30 whitespace-nowrap">
                          PF Operativa
                        </span>
                      </div>
                      <p className="text-xs text-[#2C3E50]/70 mt-0.5">
                        Ejecución obligatoria en 2 servicios de datos (Mañana y Noche). Registro inmutable con fecha, hora y firma del operador.
                      </p>
                    </div>
                  </div>

                  {/* Selector interactivo de los 2 Servicios de Datos: Mañana y Noche */}
                  <div className="flex flex-wrap items-center bg-[#F8F9FA] p-1 rounded-xl border border-gray-200 gap-1 shrink-0">
                    <button
                      onClick={() => setChecklistPhase('manana')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        checklistPhase === 'manana'
                          ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                          : 'text-[#2C3E50]/70 hover:text-[#1A2530]'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Servicio Mañana</span>
                    </button>
                    <button
                      onClick={() => setChecklistPhase('noche')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        checklistPhase === 'noche'
                          ? 'bg-[#1A2530] text-[#C5A880] shadow-xs'
                          : 'text-[#2C3E50]/70 hover:text-[#1A2530]'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Servicio Noche</span>
                    </button>
                  </div>
                </div>

                {/* Lista interactiva de comprobaciones */}
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklistItem(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        item.completed
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-white border-[#E2E8F0] hover:border-gray-300'
                      }`}
                    >
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          item.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-gray-300 bg-white'
                        }`}
                      >
                        {item.completed && <Check className="w-4 h-4" />}
                      </button>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <div className={`font-semibold ${item.completed ? 'line-through text-emerald-900' : 'text-[#1A2530]'}`}>
                            {item.label}
                          </div>
                          {isChefAdminMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditActivity({
                                   id: item.id,
                                   type: 'checklist',
                                   title: item.label,
                                   phase: checklistPhase,
                                   frequency: 'diaria',
                                   stationKey: selectedStationKey || undefined,
                                   stationName: currentStationArea?.name,
                                   status: 'activo'
                                });
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0"
                              title="Modificar actividad (Permiso Administrador)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {item.completed && (
                          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-2">
                            <span>Completado a las {new Date(item.completedAt || Date.now()).toLocaleTimeString()}</span>
                            <span>·</span>
                            <span>Operador: {item.completedBy || activeOperator}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumen y Botón de Firma */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#2C3E50]/80">
                    <span className="font-bold">
                      {checklistItems.filter(i => i.completed).length} de {checklistItems.length} comprobaciones
                    </span>{' '}
                    realizadas para el <span className="font-bold text-slate-900">Checklist de {checklistPhase === 'manana' ? 'Mañana' : 'Noche'}</span>.
                  </div>

                  <button
                    onClick={handleSaveChecklist}
                    className="px-5 py-2.5 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Certificar y Firmar Checklist ({activeOperator})</span>
                  </button>
                </div>
              </div>
            )}

            {/* =================================================================
                SECCIÓN B: CONTROLES DE SEGURIDAD E HIGIENE (APPCC & EQUIPOS)
                ================================================================= */}
            {stationActiveTab === 'temperaturas' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A2530]">
                    Controles de Temperatura y Equipos Críticos APPCC
                  </h3>
                  <p className="text-xs text-[#2C3E50]/70">
                    Registro de lecturas de maquinaria de {currentStationArea.name}. El sistema valida los límites mín/máx y exige acción correctiva ante cualquier desviación.
                  </p>
                </div>

                {/* Tarjetas de Equipos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {equipments.map(eq => {
                    const currentValStr = tempInputValues[eq.id] || '';
                    const parsedVal = parseFloat(currentValStr);
                    const hasValue = !isNaN(parsedVal);
                    const isOutOfRange = hasValue && (parsedVal < eq.tempMin || parsedVal > eq.tempMax);

                    return (
                      <div
                        key={eq.id}
                        className={`rounded-2xl border p-5 space-y-4 transition-all ${
                          isOutOfRange
                            ? 'bg-rose-50/70 border-rose-300'
                            : 'bg-white border-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              {eq.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#1A2530] mt-0.5">
                              {eq.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isChefAdminMode && (
                              <button
                                type="button"
                                onClick={() => handleOpenEditActivity({
                                  id: eq.id,
                                  type: 'temperatura',
                                  title: eq.name,
                                  targetTempRange: `${eq.tempMin} a ${eq.tempMax} ${eq.unit}`,
                                  correctiveAction: eq.notes || 'Comprobar termostato y registrar incidencia',
                                  stationKey: selectedStationKey || undefined,
                                  stationName: currentStationArea?.name,
                                  status: 'activo'
                                })}
                                className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                                title="Modificar límites o nombre de equipo (Permiso Administrador)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOutOfRange
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : eq.status === 'conforme'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {isOutOfRange ? 'Desviación' : eq.status === 'conforme' ? 'Conforme' : 'Pendiente'}
                            </span>
                          </div>
                        </div>

                        {/* Rango admisible */}
                        <div className="p-2.5 rounded-xl bg-gray-50 text-xs flex items-center justify-between font-mono">
                          <span className="text-gray-500 text-[11px]">Rango normativo:</span>
                          <span className="font-bold text-[#1A2530]">
                            {eq.tempMin} a {eq.tempMax} {eq.unit}
                          </span>
                        </div>

                        {/* Input de lectura */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700 block">
                            Lectura Actual ({eq.unit}):
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={currentValStr}
                              onChange={e =>
                                setTempInputValues(prev => ({
                                  ...prev,
                                  [eq.id]: e.target.value
                                }))
                              }
                              placeholder="Ej. 3.2"
                              className={`w-full text-sm font-mono font-bold p-2 rounded-xl border focus:outline-hidden ${
                                isOutOfRange
                                  ? 'border-rose-400 bg-white text-rose-700 focus:ring-2 focus:ring-rose-200'
                                  : 'border-gray-300 bg-white focus:border-[#C5A880]'
                              }`}
                            />
                            <span className="text-sm font-bold text-gray-500">{eq.unit}</span>
                          </div>
                        </div>

                        {/* Acción correctiva obligatoria si hay desviación */}
                        {isOutOfRange && (
                          <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-300 text-xs space-y-1.5 animate-fade-in">
                            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Acción Correctiva Obligatoria:</span>
                            </div>
                            <input
                              type="text"
                              value={tempCorrectiveActions[eq.id] || ''}
                              onChange={e =>
                                setTempCorrectiveActions(prev => ({
                                  ...prev,
                                  [eq.id]: e.target.value
                                }))
                              }
                              placeholder="Ej. Ajustado termostato y avisado a Mantenimiento..."
                              className="w-full text-xs p-2 rounded-lg border border-rose-300 bg-white focus:outline-hidden"
                            />
                          </div>
                        )}

                        {/* Botón de guardado */}
                        <button
                          onClick={() => handleSaveEquipmentTemp(eq)}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                            isOutOfRange
                              ? 'bg-rose-600 text-white hover:bg-rose-700'
                              : 'bg-[#1A2530] text-[#C5A880] hover:brightness-110'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Guardar Registro</span>
                        </button>

                        {/* Última lectura registrada */}
                        {eq.lastReadingAt && (
                          <div className="text-[10px] text-gray-400 text-center font-medium">
                            Último control: {new Date(eq.lastReadingAt).toLocaleTimeString()} por {eq.lastOperator || 'Operador'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =================================================================
                SECCIÓN C: PLAN DE LIMPIEZA Y DESINFECCIÓN
                ================================================================= */}
            {stationActiveTab === 'limpieza' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A2530]">
                    Plan de Higiene y Desinfección de {currentStationArea.name}
                  </h3>
                  <p className="text-xs text-[#2C3E50]/70">
                    Protocolos sanitarios con productos químicos homologados, dosificación prescrita y verificación por turno.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {cleaningTasks.map(task => (
                    <div
                      key={task.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            Frecuencia: {task.frequency}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              task.status === 'realizada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {task.status === 'realizada' ? 'Realizada' : 'Pendiente hoy'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1A2530]">
                            {task.areaOrEquipment}
                          </h4>
                          {isChefAdminMode && (
                            <button
                              type="button"
                              onClick={() => handleOpenEditActivity({
                                id: task.id,
                                type: 'limpieza',
                                title: task.areaOrEquipment,
                                description: `${task.authorizedProduct} - ${task.dosage}`,
                                frequency: (task.frequency as any) || 'diaria',
                                phase: 'cierre',
                                stationKey: selectedStationKey || undefined,
                                stationName: currentStationArea?.name,
                                status: 'activo'
                              })}
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                              title="Modificar tarea de limpieza (Permiso Administrador)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 space-y-0.5">
                          <div>
                            <span className="font-semibold text-gray-800">Producto químico:</span>{' '}
                            {task.authorizedProduct}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800">Dosificación / Modo empleo:</span>{' '}
                            {task.dosage}
                          </div>
                        </div>

                        {task.lastCompletedAt && (
                          <div className="text-[11px] text-emerald-700 mt-1">
                            ✓ Ejecutada a las {new Date(task.lastCompletedAt).toLocaleTimeString()} por {task.lastOperator}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCompleteCleaning(task)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors ${
                          task.status === 'realizada'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-[#1A2530] text-[#C5A880] hover:brightness-110 shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{task.status === 'realizada' ? 'Volver a registrar' : 'Registrar realizada'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =================================================================
                SECCIÓN D: CADUCIDADES Y CONSERVACIÓN DE ALIMENTOS
                ================================================================= */}
            {stationActiveTab === 'caducidades' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2530]">
                      Control de Caducidades y Etiquetado Secundario
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70">
                      Gestión de envases abiertos, productos semielaborados y materias primas en {currentStationArea.name}.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsLabelProductModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Etiquetar nuevo producto</span>
                  </button>
                </div>

                {/* Tabla de Productos Activos */}
                {openedProducts.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600">
                      No hay productos abiertos registrados en esta estación
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Pulse en "+ Etiquetar nuevo producto" para abrir un lote y calcular su caducidad secundaria.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Producto</th>
                          <th className="py-2.5 px-3">Lote</th>
                          <th className="py-2.5 px-3">Apertura</th>
                          <th className="py-2.5 px-3">Caducidad Secundaria</th>
                          <th className="py-2.5 px-3">Ubicación</th>
                          <th className="py-2.5 px-3">Responsable</th>
                          <th className="py-2.5 px-3 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {openedProducts.map(prod => {
                          const now = Date.now();
                          const expTime = new Date(prod.secondaryExpiry).getTime();
                          const diffHours = (expTime - now) / 3600000;
                          const isExpired = diffHours <= 0;
                          const isNear = diffHours > 0 && diffHours <= 24;

                          return (
                            <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-3 font-bold text-[#1A2530]">
                                {prod.productName}
                              </td>
                              <td className="py-3 px-3 font-mono text-gray-600">
                                {prod.batchLot}
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {new Date(prod.openedAt).toLocaleDateString()} {new Date(prod.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                    isExpired
                                      ? 'bg-rose-100 text-rose-800'
                                      : isNear
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {isExpired ? 'VENCIDO' : isNear ? 'Próximo (<24h)' : 'En fecha'} ·{' '}
                                  {new Date(prod.secondaryExpiry).toLocaleDateString()} {new Date(prod.secondaryExpiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {prod.locationOrChamber}
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {prod.operator}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleConsumeProduct(prod.id, 'consumido')}
                                    className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-bold"
                                    title="Marcar como consumido íntegramente"
                                  >
                                    Consumido
                                  </button>
                                  <button
                                    onClick={() => handleConsumeProduct(prod.id, 'retirado_por_caducidad')}
                                    className="px-2 py-1 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded text-[11px] font-bold"
                                    title="Dar de baja / merma"
                                  >
                                    Retirar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                SECCIÓN E: PROCEDIMIENTOS Y DOCUMENTACIÓN DEL ÁREA
                ================================================================= */}
            {stationActiveTab === 'documentos' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2530]">
                      Documentación y Fichas Técnicas: {currentStationArea.name}
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70">
                      Manuales de acogida, fichas de elaboración, protocolos de seguridad y guías de maquinaria.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsTechSheetsLibraryOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#1A2530] border border-[#C5A880]/40 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Abrir Archivo Documental de Fichas Técnicas Oficiales"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Ver Fichas Técnicas</span>
                    </button>

                    {isChefAdminMode && (
                      <>
                        <label className="px-3.5 py-2 rounded-xl bg-[#1A2530] hover:bg-[#253545] text-[#C5A880] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>+ Subir Fichas/Recetas (Múltiple)</span>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={handleDepartmentMultiFileUpload}
                          />
                        </label>
                        <button
                          onClick={() => setIsNewDocModalOpen(true)}
                          className="px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Formulario individual de subida"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Formulario</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Grid de Documentos */}
                {stationDocuments.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-600">
                      No hay documentos cargados específicamente en esta área
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Suba un manual, receta o checklist mediante el botón superior.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stationDocuments.map(doc => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#C5A880] transition-all flex flex-col justify-between space-y-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {doc.fileType.toUpperCase()} · v{doc.version}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              {doc.status}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#1A2530] group-hover:text-[#C5A880] transition-colors leading-snug">
                            {doc.title}
                          </h4>

                          <p className="text-xs text-[#2C3E50]/75 line-clamp-2">
                            {doc.summary}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <span>Por: {doc.authorName}</span>
                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="font-bold text-[#1A2530] hover:text-[#C5A880] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Consultar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                SECCIÓN F: INCIDENCIAS Y ACCIONES CORRECTIVAS
                ================================================================= */}
            {stationActiveTab === 'incidencias' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A2530]">
                      Gestión de Incidencias y Averías: {currentStationArea.name}
                    </h3>
                    <p className="text-xs text-[#2C3E50]/70">
                      Reporte ágil de no conformidades con medidas correctoras inmediatas y trazabilidad sanitaria.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNewIncidentModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Reportar Incidencia</span>
                  </button>
                </div>

                {/* Lista de Incidencias */}
                {incidents.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">
                      Área sin incidencias activas
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Todos los equipos y procedimientos se encuentran conformes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incidents.map(inc => (
                      <div
                        key={inc.id}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          inc.status === 'resuelta'
                            ? 'bg-gray-50 border-gray-200 opacity-80'
                            : inc.severity === 'critica' || inc.severity === 'alta'
                            ? 'bg-rose-50/70 border-rose-300'
                            : 'bg-amber-50/70 border-amber-300'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                inc.severity === 'critica'
                                  ? 'bg-rose-600 text-white'
                                  : inc.severity === 'alta'
                                  ? 'bg-rose-200 text-rose-900'
                                  : 'bg-amber-200 text-amber-900'
                              }`}
                            >
                              Severidad: {inc.severity}
                            </span>
                            <span className="text-[10px] font-bold text-gray-600 uppercase">
                              {inc.category.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                inc.status === 'resuelta'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {inc.status.toUpperCase()}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-[#1A2530]">
                            {inc.title}
                          </h4>

                          <p className="text-xs text-[#2C3E50]/80">
                            {inc.description}
                          </p>

                          <div className="text-xs font-semibold text-[#1A2530] pt-1">
                            Acción inmediata tomada: {inc.correctiveActionTaken}
                          </div>

                          <div className="text-[10px] text-gray-500 pt-1">
                            Reportada por {inc.reportedBy} el {new Date(inc.reportedAt).toLocaleString()}
                          </div>
                        </div>

                        {inc.status !== 'resuelta' && (
                          <button
                            onClick={() => handleResolveIncident(inc.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#1A2530] text-[#C5A880] hover:brightness-110 font-bold text-xs shrink-0"
                          >
                            Marcar como Resuelta
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =================================================================
                SECCIÓN G: HISTORIAL Y REGISTROS INMUTABLES
                ================================================================= */}
            {stationActiveTab === 'historial' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1A2530]">
                    Libro de Registro Histórico e Inmutable: {currentStationArea.name}
                  </h3>
                  <p className="text-xs text-[#2C3E50]/70">
                    Trazabilidad cronológica de comprobaciones, tomas de temperatura y limpiezas. Los registros no se sobrescriben para garantizar cumplimiento sanitario ante inspecciones.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {historyRecords.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-xs">
                      No hay registros archivados para esta estación todavía.
                    </div>
                  ) : (
                    historyRecords.map(record => (
                      <div key={record.id} className="py-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                              {record.type.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                record.status === 'conforme'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : record.status === 'desviacion'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#1A2530]">
                            {record.title}
                          </h4>

                          <p className="text-xs text-[#2C3E50]/80">
                            {record.summary}
                          </p>

                          <div className="text-[10px] text-gray-400">
                            {new Date(record.timestamp).toLocaleString()} · Operador: {record.operator}
                          </div>
                        </div>

                        <div className="text-[10px] text-gray-400 font-mono shrink-0">
                          ID: {record.id.slice(0, 12)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* =================================================================
                SECCIÓN H: CONTROL Y FIRMA MENSUAL DE EPIS (APPCC / PRL)
                ================================================================= */}
            {stationActiveTab === 'epis' && (
              <MonthlyEpisControlView
                hotelId={currentHotel.id}
                hotelName={currentHotel.name}
                stationKey={currentStationArea.code}
                stationName={currentStationArea.name}
                currentChefName={currentChef.chefName}
                currentChefRole={currentChef.roleTitle}
                userRole={pinTier}
              />
            )}
          </div>
        )}
      </main>


      {/* =========================================================================
          MODAL: AÑADIR DEPARTAMENTO
          ========================================================================= */}
      {isAddDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A2530]">
                + Agregar Departamento a {currentHotel?.name}
              </h3>
              <button
                onClick={() => setIsAddDeptModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Nombre del departamento:
                </label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  placeholder="Ej. Bares & Coctelería, Sala, Pisos..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Categoría operativa:
                </label>
                <select
                  value={newDeptCategory}
                  onChange={e => setNewDeptCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                >
                  <option value="barra">Bares / Coctelería / Cafetería</option>
                  <option value="sala">Sala & Eventos</option>
                  <option value="pisos">Pisos & Housekeeping</option>
                  <option value="mantenimiento">Mantenimiento Técnico</option>
                  <option value="cocina">Cocina auxiliar</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddDeptModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110"
              >
                Crear Departamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR NUEVO HOTEL / ESTABLECIMIENTO
          ========================================================================= */}
      {isAddHotelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A2530]">
                + Dar de Alta Nuevo Hotel
              </h3>
              <button
                onClick={() => setIsAddHotelModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Nombre del Hotel:
                </label>
                <input
                  type="text"
                  value={newHotelName}
                  onChange={e => setNewHotelName(e.target.value)}
                  placeholder="Ej. Hotel Gran Palmera"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Categoría:
                </label>
                <select
                  value={newHotelCategory}
                  onChange={e => setNewHotelCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                >
                  <option value="resort_4s">Resort Vacacional 4★</option>
                  <option value="boutique_5s">Hotel Boutique 5★</option>
                  <option value="urbano_gastronomico">Urbano Gastronómico</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsAddHotelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewHotel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110"
              >
                Crear Hotel con Aislamiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ETIQUETAR PRODUCTO ABIERTO
          ========================================================================= */}
      {isLabelProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A2530]">
                Etiquetado de Producto Abierto / Elaborado
              </h3>
              <button
                onClick={() => setIsLabelProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Nombre del Producto / Preparación:
                </label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="Ej. Leche abierta, salsa tártara, hummus..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Lote / Código de trazabilidad:
                </label>
                <input
                  type="text"
                  value={newProdLot}
                  onChange={e => setNewProdLot(e.target.value)}
                  placeholder="Ej. L-260301-A"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Caducidad Secundaria (Horas):
                </label>
                <select
                  value={newProdHours}
                  onChange={e => setNewProdHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                >
                  <option value="12">12 Horas (Consumo preferente turno)</option>
                  <option value="24">24 Horas (1 Día)</option>
                  <option value="48">48 Horas (2 Días - Recomendado)</option>
                  <option value="72">72 Horas (3 Días)</option>
                  <option value="168">7 Días (Conservas y almíbares)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Ubicación de almacenamiento:
                </label>
                <input
                  type="text"
                  value={newProdLocation}
                  onChange={e => setNewProdLocation(e.target.value)}
                  placeholder="Ej. Vitrina refrigerada bajo mostrador"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsLabelProductModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleLabelNewProduct}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110"
              >
                Generar Etiqueta & Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REPORTAR INCIDENCIA
          ========================================================================= */}
      {isNewIncidentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A2530]">
                Reportar Incidencia en {currentStationArea?.name}
              </h3>
              <button
                onClick={() => setIsNewIncidentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Título de la Incidencia:
                </label>
                <input
                  type="text"
                  value={newIncTitle}
                  onChange={e => setNewIncTitle(e.target.value)}
                  placeholder="Ej. Fallo en presión de cafetera, vitrina a 6ºC..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Tipo:
                  </label>
                  <select
                    value={newIncCategory}
                    onChange={e => setNewIncCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                  >
                    <option value="desviacion_temperatura">Desviación Temperatura</option>
                    <option value="averia_equipo">Avería de Maquinaria</option>
                    <option value="rotura_material">Rotura de Vajilla / Menaje</option>
                    <option value="higiene">Higiene / Alérgenos</option>
                    <option value="almacen">Falta de Stock</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Severidad:
                  </label>
                  <select
                    value={newIncSeverity}
                    onChange={e => setNewIncSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Descripción del problema:
                </label>
                <textarea
                  rows={2}
                  value={newIncDesc}
                  onChange={e => setNewIncDesc(e.target.value)}
                  placeholder="Describa lo sucedido..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Acción Correctiva Inmediata tomada:
                </label>
                <input
                  type="text"
                  value={newIncAction}
                  onChange={e => setNewIncAction(e.target.value)}
                  placeholder="Ej. Avisado a Mantenimiento de guardia..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsNewIncidentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleReportIncident}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
              >
                Registrar Incidencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CONSULTAR DOCUMENTO (VISOR DIRECTO PF)
          ========================================================================= */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
            {/* Cabecera institucional PF */}
            <div className="bg-[#1A2530] p-4 sm:p-5 text-white flex items-center justify-between border-b border-[#2C3E50]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A880] text-[#1A2530] flex items-center justify-center font-black text-base shadow-inner shrink-0">
                  PF
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-white/10 text-[#C5A880] px-2 py-0.5 rounded">
                      {viewingDoc.fileType.toUpperCase()} · v{viewingDoc.version}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {viewingDoc.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-white mt-0.5 truncate max-w-md sm:max-w-xl">
                    {viewingDoc.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {viewingDoc.previewUrl && (
                  <a
                    href={viewingDoc.previewUrl}
                    download={viewingDoc.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                    title="Descargar / Abrir en pestaña nueva"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => setViewingDoc(null)}
                  className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                  title="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cuerpo del visor */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#2C3E50]">
              {/* Previsualizador directo según tipo */}
              {viewingDoc.previewUrl ? (
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-slate-900/5 min-h-[360px] flex items-center justify-center">
                  {viewingDoc.fileType === 'pdf' ? (
                    <iframe
                      src={viewingDoc.previewUrl}
                      className="w-full h-[55vh] border-0 rounded-2xl"
                      title={viewingDoc.title}
                    />
                  ) : viewingDoc.fileType === 'imagen' || viewingDoc.previewUrl.startsWith('data:image/') ? (
                    <img
                      src={viewingDoc.previewUrl}
                      alt={viewingDoc.title}
                      className="max-h-[55vh] max-w-full object-contain mx-auto rounded-xl shadow-xs"
                    />
                  ) : (
                    <iframe
                      src={viewingDoc.previewUrl}
                      className="w-full h-[55vh] border-0 rounded-2xl"
                      title={viewingDoc.title}
                    />
                  )}
                </div>
              ) : null}

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-bold block text-gray-700 mb-1">Resumen Ejecutivo / Descripción:</span>
                <p className="leading-relaxed">{viewingDoc.summary}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-gray-600 bg-slate-50/50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="font-bold text-gray-800 block">Autor:</span>
                  <span>{viewingDoc.authorName}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">Fecha de Carga:</span>
                  <span>{viewingDoc.uploadedAt}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">Archivo:</span>
                  <span className="truncate block font-mono">{viewingDoc.fileName}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 block">Tamaño:</span>
                  <span>{viewingDoc.fileSize}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-950 font-medium text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Documento operativo validado según los estándares de Dirección de Alimentos y Bebidas PF.</span>
              </div>
            </div>

            {/* Pie con cierre limpio */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-mono truncate max-w-xs">
                {viewingDoc.fileName}
              </span>
              <div className="flex items-center gap-2">
                {viewingDoc.previewUrl && (
                  <a
                    href={viewingDoc.previewUrl}
                    download={viewingDoc.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                )}
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110 cursor-pointer shadow-xs"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PERFIL DEL CHEF (ANTONIO GONZÁLEZ & GIACOMO LONGO)
          ========================================================================= */}
      {/* =========================================================================
          MODAL: PERFIL DEL CHEF (REACTIVO Y CONFIGURABLE)
          ========================================================================= */}
      {showChefModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between border-b pb-3">
              <div className="flex items-center gap-3.5">
                {currentChef.photoUrl ? (
                  <img
                    src={currentChef.photoUrl}
                    alt={currentChef.chefName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C5A880] shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-1 text-center shrink-0">
                    <User className="w-6 h-6 text-gray-400" />
                    <span className="text-[8px] text-gray-500 font-medium">Espacio reservado</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {currentChef.roleTitle}
                  </span>
                  <h3 className="font-black text-xl text-[#1A2530] mt-0.5">
                    {currentChef.chefName}
                  </h3>
                  <div className="text-xs text-[#2C3E50]/70 font-medium">
                    Chef de {currentHotel?.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChefModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#2C3E50]">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="font-extrabold text-[#1A2530] text-sm">
                  Trayectoria y Compromiso Profesional
                </div>
                <blockquote className="italic text-gray-800 leading-relaxed font-serif text-[13px]">
                  “{currentChef.bio}”
                </blockquote>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="font-bold text-[#1A2530]">
                  Gobernanza Culinaria en {currentHotel?.name}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Supervisión técnica de las 8 casillas de trabajo (Cafetería, Frío, Caliente, Mañana, Tarde, Barmitonio, Menú Rueda 1 y Menú Rueda 2), garantizando el cumplimiento estricto de los estándares de calidad, alérgenos y auditorías APPCC.
                </p>
              </div>

              {!currentChef.photoUrl && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center justify-between">
                  <span>ℹ️ Fotografía en espacio reservado. Puede añadirla desde el Panel de Administración.</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              {currentOperatorRole !== 'trabajador' && pinTier !== 'empleado' ? (
                <button
                  onClick={() => {
                    setShowChefModal(false);
                    setIsProaAdminPanelOpen(true);
                  }}
                  className="text-xs text-[#C5A880] hover:underline font-bold flex items-center gap-1"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configurar en Administración</span>
                </button>
              ) : <div />}
              <button
                onClick={() => setShowChefModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SUBIR DOCUMENTO AL PUESTO
          ========================================================================= */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#1A2530]">
                Subir Documento a {currentStationArea?.name}
              </h3>
              <button
                onClick={() => setIsNewDocModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Título del Documento / Ficha:
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  placeholder="Ej. Ficha Técnica Café Bombón Especial..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Categoría:
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={e => setNewDocCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                  >
                    <option value="elaboraciones">Elaboraciones (Fichas Técnicas)</option>
                    <option value="operativa_turno">Operativa del Turno</option>
                    <option value="higiene_seguridad">Higiene & APPCC</option>
                    <option value="equipos_materiales">Equipos & Materiales</option>
                    <option value="info_puesto">Información del Puesto</option>
                    <option value="formacion">Formación</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Tipo de archivo:
                  </label>
                  <select
                    value={newDocType}
                    onChange={e => setNewDocType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                  >
                    <option value="pdf">PDF Documento</option>
                    <option value="xlsx">Excel / Escandallo</option>
                    <option value="docx">Word / Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Resumen o instrucciones:
                </label>
                <textarea
                  rows={2}
                  value={newDocSummary}
                  onChange={e => setNewDocSummary(e.target.value)}
                  placeholder="Detalles sobre el procedimiento..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setIsNewDocModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleUploadDocument}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A2530] text-[#C5A880] hover:brightness-110"
              >
                Publicar en el Puesto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Suite de Auditoría de Aislamiento de Seguridad (Requisito Crítico) */}
      <SecurityIsolationAuditModal
        isOpen={isSecurityAuditOpen}
        onClose={() => setIsSecurityAuditOpen(false)}
      />

      {/* Modal: Selector y Aprovisionamiento de Espacios de Trabajo Privados */}
      <WorkspaceSelectorModal
        isOpen={isWorkspaceSelectorOpen}
        onClose={() => setIsWorkspaceSelectorOpen(false)}
        onWorkspaceChanged={(newSession) => {
          setActiveTenant(newSession);
          setFeedbackToast({
            message: `Cambiado al espacio "${newSession.name}" (${newSession.isDemoTenant ? 'Demostración' : 'Privado'}). Aislamiento verificado en servidor.`,
            type: 'success'
          });
        }}
      />

      {/* Panel de Administración y Configuración Operativa (Nuevo Módulo) */}
      {isProaAdminPanelOpen && (
        <ProaAdminConfigPanel
          activeTenant={activeTenant}
          initialRole={currentOperatorRole}
          currentHotelId={currentHotel?.id || 'est-bitacora'}
          onClose={() => setIsProaAdminPanelOpen(false)}
          onConfigUpdated={() => {
            loadStationData();
            setFeedbackToast({
              message: 'Configuraciones operativas actualizadas y sincronizadas.',
              type: 'success'
            });
          }}
        />
      )}

      {/* Módulo MENÚS: Ruedas de Menú de 15 Días (Desayuno, Almuerzo, Cena) */}
      <MenuRotationsModal
        isOpen={isMenuRotationsOpen || activeWheelModal !== null}
        onClose={() => {
          setIsMenuRotationsOpen(false);
          setActiveWheelModal(null);
        }}
        hotelId={currentHotel?.id || 'model-bitacora'}
        hotelName={currentHotel?.name || 'Hotel Bitácora'}
        wheelId={activeWheelModal || 'rueda_1'}
        userRole={pinTier}
        authorName={activeOperator}
      />

      {/* Módulo FICHAS TÉCNICAS Y ELABORACIONES: Archivo Documental Independiente */}
      <TechSheetsLibraryModal
        isOpen={isTechSheetsLibraryOpen}
        onClose={() => setIsTechSheetsLibraryOpen(false)}
        hotelId={currentHotel?.id || 'model-bitacora'}
        hotelName={currentHotel?.name || 'Hotel Bitácora'}
        userRole={pinTier}
        authorName={activeOperator}
      />

      {/* Modal: Bitácora de Recetas Histórica (Mantenida para compatibilidad) */}
      <BitacoraRecetasModal
        isOpen={isBitacoraRecetasOpen}
        onClose={() => setIsBitacoraRecetasOpen(false)}
        hotelId={currentHotel?.id || 'model-bitacora'}
        hotelName={currentHotel?.name || 'Hotel Bitácora'}
        userRole={pinTier}
      />

      {/* Modal: Carpeta Documental Acumulativa por Familias y Departamentos */}
      <CarpetaDocumentalModal
        isOpen={isCarpetaDocumentalOpen}
        onClose={() => setIsCarpetaDocumentalOpen(false)}
        hotelId={currentHotel?.id || 'model-bitacora'}
        hotelName={currentHotel?.name || 'Hotel Bitácora'}
        activeOperatorName={activeOperator}
        userRole={pinTier}
      />

      {/* Modal: Autenticación por Código PIN */}
      <PinAuthModal
        isOpen={isPinAuthOpen}
        onClose={() => setIsPinAuthOpen(false)}
        currentTier={pinTier}
        title="Acceso de Supervisión y Dirección"
        subtitle="Introduzca el código PIN autorizado para habilitar el modo de administración."
        onSelectTier={(newTier, operatorName) => {
          setPinTier(newTier);
          try {
            localStorage.setItem('proa_active_pin_tier', newTier);
          } catch {}
          if (newTier === 'admin') {
            setCurrentOperatorRole('admin_empresa');
          } else if (newTier === 'jefe') {
            setCurrentOperatorRole('supervisor');
          } else {
            setCurrentOperatorRole('trabajador');
          }
          // No abrir automáticamente el panel de administración
          setIsProaAdminPanelOpen(false);
          if (operatorName) {
            setActiveOperator(operatorName);
          }
          setFeedbackToast({
            message: `Modo Jefe activado (${operatorName || newTier}).`,
            type: 'success'
          });
        }}
        activeHotelName={currentHotel?.name || 'Dirección de Cocinas'}
      />

      {/* Modal: Modificación de Actividades (Permisos para Antonio González y Giacomo Longo) */}
      <EditActivityModal
        isOpen={isEditActivityOpen}
        onClose={() => {
          setIsEditActivityOpen(false);
          setEditingActivity(null);
        }}
        activity={editingActivity}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        activeOperatorName={activeOperator}
      />

      {/* Modal: Dirección del Proyecto & Autor (Pablo Fondelli) */}
      <PabloFondelliModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
      />

      {/* Modal: Manual de Usuario & Centro de Ayuda Operativo */}
      <UserManualHelpCenterModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
        initialChapterId={manualInitialChapter}
        initialArticleId={manualInitialArticleId}
        userRole={pinTier}
        activeHotelName={currentHotel?.name || 'Hotel Bitácora & Vulcano'}
      />
    </div>
  );
};

