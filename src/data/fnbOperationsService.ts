/**
 * F&B OPERATIONS SERVICE - DATOS Y LÓGICA DE NEGOCIO OPERATIVA
 * Proporciona catálogos técnicos homologados, almacenamiento local de auditoría y cálculo de KPIs
 */

import {
  TemperatureEquipmentDef,
  TemperatureLogEntry,
  CleaningTaskDef,
  CleaningLogEntry,
  ChecklistTaskItem,
  ShiftChecklistRecord,
  OperationalIncident,
  ManagementAnnouncement,
  ShiftTask,
  SupervisionKPIs,
  ShiftType,
  StationType
} from '../types/fnbOperationsMaster';

// =========================================================================
// 1. CATÁLOGO HOMOLOGADO DE EQUIPOS DE FRÍO Y APPCC
// =========================================================================

export const DEFAULT_APPCC_EQUIPMENTS: TemperatureEquipmentDef[] = [
  {
    id: 'eq-camara-lacteos',
    name: 'Cámara 1: Lácteos, Huevos y Perecederos',
    category: 'refrigeracion',
    location: 'Office / Barra Principal',
    tempMin: 0.0,
    tempMax: 4.0,
    criticalLimit: 5.5,
    unit: 'ºC',
    description: 'Temperatura crítica sanitaria para prevención de listeria y salmonella.'
  },
  {
    id: 'eq-camara-bebidas',
    name: 'Cámara 2: Zumos, Fruta Fresca y Bebidas',
    category: 'refrigeracion',
    location: 'Almacén Frío Barra',
    tempMin: 2.0,
    tempMax: 6.0,
    criticalLimit: 8.0,
    unit: 'ºC',
    description: 'Conservación de pre-batches, cítricos cortados y zumos naturales.'
  },
  {
    id: 'eq-arcon-congelador',
    name: 'Arcón Congelador: Pulpas y Fruta Helada',
    category: 'congelacion',
    location: 'Office Barra',
    tempMin: -24.0,
    tempMax: -18.0,
    criticalLimit: -15.0,
    unit: 'ºC',
    description: 'Congelación profunda de ingredientes para cócteles y smoothies.'
  },
  {
    id: 'eq-vitrina-barra',
    name: 'Vitrina Fría Contrabarra (Garnish & Fruta)',
    category: 'vitrina',
    location: 'Estación de Coctelería',
    tempMin: 1.0,
    tempMax: 5.0,
    criticalLimit: 6.5,
    unit: 'ºC',
    description: 'Mantenimiento en servicio de guarniciones, fruta cortada y siropes perecederos.'
  },
  {
    id: 'eq-maquina-hielo',
    name: 'Fabricador de Hielo Macizo (Scotsman)',
    category: 'maquina_hielo',
    location: 'Cuarto de Máquinas / Barra',
    tempMin: -8.0,
    tempMax: -3.0,
    criticalLimit: 0.0,
    unit: 'ºC',
    description: 'Generación continua de cubos de 40g sin calcificación y con ciclo higiénico.'
  },
  {
    id: 'eq-lavavasos-aclarado',
    name: 'Lavavasos Térmico (Ciclo de Aclarado)',
    category: 'calor',
    location: 'Office de Barra',
    tempMin: 65.0,
    tempMax: 85.0,
    criticalLimit: 60.0,
    unit: 'ºC',
    description: 'Termodesinfección obligatoria de cristalería contra agentes patógenos.'
  }
];

// =========================================================================
// 2. CATÁLOGO OFICIAL DE LIMPIEZA Y DESINFECCIÓN (PRODUCTOS AUTORIZADOS)
// =========================================================================

export const DEFAULT_CLEANING_CATALOG: CleaningTaskDef[] = [
  {
    id: 'cl-tabla-corte',
    area: 'Terraza Principal',
    surfaceOrEquipment: 'Tablas de corte y cuchillería de barra',
    frequency: 'diaria',
    approvedChemical: 'Suma Bac D10 (Desinfectante Detergente Clorado)',
    dosageInstructions: 'Disolución al 1% (100 ml en 10 L de agua tibia a 40ºC). Dejar actuar 5 min y aclarar con agua potable.',
    contactTimeMinutes: 5,
    safetyEquipment: ['Guantes de nitrilo', 'Mandil impermeable'],
    procedureSummary: 'Desmontar tablas, retirar restos orgánicos, pulverizar solución, frotar con estropajo azul, aclarar y secar al aire.'
  },
  {
    id: 'cl-superficie-barra',
    area: 'Bar Piscina',
    surfaceOrEquipment: 'Mostrador de servicio y encimeras de acero inox',
    frequency: 'diaria',
    approvedChemical: 'Suma Star D1 (Detergente Neutro Multiusos)',
    dosageInstructions: 'Dilución 20 ml en 5 L de agua. Aplicar con bayeta de microfibra azul limpia.',
    contactTimeMinutes: 2,
    safetyEquipment: ['Guantes de goma'],
    procedureSummary: 'Limpieza continua durante el servicio y desinfección profunda al cierre.'
  },
  {
    id: 'cl-filtros-hielo',
    area: 'Office / Barra Principal',
    surfaceOrEquipment: 'Filtro de aire y depósito de la máquina de hielo',
    frequency: 'semanal',
    approvedChemical: 'Suma Des T30 (Higienizante Descalcificante Grado Alimentario)',
    dosageInstructions: '50 ml por cada litro de agua desmineralizada. Aclarado exhaustivo con agua potable.',
    contactTimeMinutes: 15,
    safetyEquipment: ['Gafas de protección', 'Guantes de nitrilo químicos'],
    procedureSummary: 'Vaciar cubo de hielo, pulverizar paredes internas, cepillar toberas y realizar 2 ciclos de purga.'
  },
  {
    id: 'cl-camaras-estantes',
    area: 'Office / Barra Principal',
    surfaceOrEquipment: 'Baldas, juntas de goma y suelo de cámaras de frío',
    frequency: 'semanal',
    approvedChemical: 'Suma Bac D10 + Neutro',
    dosageInstructions: '2% en agua a 35ºC. Secar inmediatamente con papel desechable homologado.',
    contactTimeMinutes: 10,
    safetyEquipment: ['Guantes térmicos/nitrilo'],
    procedureSummary: 'Retirar género temporalmente en carros térmicos, limpiar juntas de cierre y verificar desagües.'
  },
  {
    id: 'cl-grifos-cerveza',
    area: 'Bar Piscina',
    surfaceOrEquipment: 'Caños de tiro de cerveza y bandejas recoge-gotas',
    frequency: 'diaria',
    approvedChemical: 'Pastillas Higienizantes TM Desana Max',
    dosageInstructions: '1 bolsita diluida en recirculador de limpieza de serpentines.',
    contactTimeMinutes: 20,
    safetyEquipment: ['Gafas de seguridad', 'Guantes'],
    procedureSummary: 'Conectar cabezales al bucle de limpieza, recircular hasta viraje de color a violeta y aclarar con 20L de agua.'
  },
  {
    id: 'cl-campanas-extractores',
    area: 'Cocina / Office',
    surfaceOrEquipment: 'Filtros de campana extractora y plenum',
    frequency: 'quincenal',
    approvedChemical: 'Suma Frit D9 (Desengrasante Alcalino Potente)',
    dosageInstructions: 'Inmersión al 5% en agua caliente a 60ºC durante 30 minutos.',
    contactTimeMinutes: 30,
    safetyEquipment: ['Guantes de protección química alta', 'Gafas estancas', 'Mandil'],
    procedureSummary: 'Sumergir filtros metálicos en cuba, frotar residuos carbonizados, lavar en lavavajillas y volver a montar.'
  }
];

// =========================================================================
// 3. PLANTILLAS DE APERTURA Y CIERRE DE TURNO
// =========================================================================

export const DEFAULT_OPENING_CHECKLIST: ChecklistTaskItem[] = [
  { id: 'ap-1', label: 'Encendido de TPV y comprobación de conexión con impresora de tickets', required: true, checked: false, category: 'Sistemas' },
  { id: 'ap-2', label: 'Verificación de fondo de caja y cambio fraccionario entregado', required: true, checked: false, category: 'Caja' },
  { id: 'ap-3', label: 'Lectura y registro de temperaturas de cámaras de frío', required: true, checked: false, category: 'APPCC' },
  { id: 'ap-4', label: 'Comprobación del nivel y calidad del hielo macizo', required: true, checked: false, category: 'Producción' },
  { id: 'ap-5', label: 'Mise en place de estación de coctelería (fruta fresca, siropes y garnishes)', required: true, checked: false, category: 'Servicio' },
  { id: 'ap-6', label: 'Puesta en marcha y ciclo térmico inicial del lavavasos (>65ºC)', required: true, checked: false, category: 'Higiene' },
  { id: 'ap-7', label: 'Montaje de terraza: sombrillas ancladas, mesas higienizadas y cartas QR', required: true, checked: false, category: 'Instalaciones' },
  { id: 'ap-8', label: 'Revisión de cartas físicas y comprobación de productos agotados', required: false, checked: false, category: 'Menús' }
];

export const DEFAULT_CLOSING_CHECKLIST: ChecklistTaskItem[] = [
  { id: 'ci-1', label: 'Limpieza y desinfección de superficies de barra con Suma Bac D10', required: true, checked: false, category: 'Higiene' },
  { id: 'ci-2', label: 'Vaciado, limpieza y desconexión de bandejas de goteo de cerveza/cafetera', required: true, checked: false, category: 'Maquinaria' },
  { id: 'ci-3', label: 'Almacenamiento de perecederos y fruta en cámara refrigerada rotulada (FIFO)', required: true, checked: false, category: 'APPCC' },
  { id: 'ci-4', label: 'Cierre de puertas de cámaras y arcones de congelación con cerrojo', required: true, checked: false, category: 'Seguridad' },
  { id: 'ci-5', label: 'Arqueo de TPV: emisión y archivo de Ticket Z obligatorio', required: true, checked: false, category: 'Fiscal' },
  { id: 'ci-6', label: 'Cuadre de caja en efectivo y reporte de diferencias si existen', required: true, checked: false, category: 'Caja' },
  { id: 'ci-7', label: 'Recogida y amarre de mobiliario de terraza exterior', required: true, checked: false, category: 'Instalaciones' },
  { id: 'ci-8', label: 'Retirada de basuras a cuarto de residuos refrigerado y cambio de bolsas', required: true, checked: false, category: 'Higiene' },
  { id: 'ci-9', label: 'Registro de incidencias, averías o faltantes de stock del turno', required: false, checked: false, category: 'Operativa' }
];

// =========================================================================
// 4. INCIDENCIAS INICIALES DE DEMOSTRACIÓN
// =========================================================================

export const INITIAL_INCIDENTS_DEMO: OperationalIncident[] = [
  {
    id: 'inc-001',
    ticketCode: 'INC-20261023-01',
    title: 'Fuga leve de agua en grifo central de office',
    description: 'Goteo continuo en la junta inferior del fregadero de barra. Se ha colocado cubeto preventivo. Requiere revisión de fontanería.',
    category: 'averia_tecnica',
    priority: 'media',
    status: 'en_curso',
    station: 'Terraza Principal',
    reportedBy: 'Carlos Mendoza (Bartender)',
    assignedTo: 'Mantenimiento Central',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60',
    reportedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    actionTaken: 'Avisado técnico de guardia. Pieza solicitada para sustitución a las 10:00.',
    history: [
      {
        id: 'act-1',
        author: 'Carlos Mendoza',
        role: 'Trabajador',
        action: 'Incidencia reportada con fotografía de la junta',
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        statusAfter: 'nueva'
      },
      {
        id: 'act-2',
        author: 'Laura Santos',
        role: 'Supervisora F&B',
        action: 'Asignada a equipo de Mantenimiento con prioridad Media',
        timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        statusAfter: 'en_curso'
      }
    ]
  },
  {
    id: 'inc-002',
    ticketCode: 'INC-20261023-02',
    title: 'Rotura de stock: Ron Añejo Especial para carta',
    description: 'Quedan únicamente 2 botellas en contrabarra y el almacén general no tiene existencias. Se prevé rotura durante el turno de noche.',
    category: 'faltante_stock',
    priority: 'urgente',
    status: 'asignada',
    station: 'Bar Piscina',
    reportedBy: 'Elena Rivas (Jefa de Sala)',
    assignedTo: 'Economato / Compras',
    reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    actionTaken: 'Comunicado a Compras. Se autoriza sustitución provisional por referencia premium homologada.',
    history: [
      {
        id: 'act-1',
        author: 'Elena Rivas',
        role: 'Supervisor',
        action: 'Alerta de rotura emitida tras inventario intermedio',
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        statusAfter: 'asignada'
      }
    ]
  }
];

// =========================================================================
// 5. COMUNICACIONES Y AVISOS DE DIRECCIÓN
// =========================================================================

export const INITIAL_ANNOUNCEMENTS_DEMO: ManagementAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Nueva Versión Fichas Técnicas Carta de Otoño Homologada',
    content: 'Se han actualizado las dosificaciones exactas de cócteles clásicos y firmas en el módulo de Fichas Técnicas para sincronización TPV Ágora. Rogamos a todo el equipo de barra consultar los flujos de elaboración y cristalería antes del servicio.',
    priority: 'destacado',
    publishedBy: 'Dirección de Operaciones F&B',
    publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    category: 'carta',
    requireReadConfirmation: true,
    readByUsers: [
      { userId: 'u-1', userName: 'Carlos Mendoza', readAt: '09:15' },
      { userId: 'u-2', userName: 'Laura Santos', readAt: '09:40' }
    ]
  },
  {
    id: 'ann-02',
    title: 'Protocolo APPCC: Registro estricto de temperaturas de recepción de mercancía',
    content: 'Recordatorio sanitario: Cualquier producto congelado que llegue a temperatura superior a -15ºC o lácteo superior a +6ºC debe ser rechazado en albarán inmediatamente con fotografía.',
    priority: 'urgente',
    publishedBy: 'Responsable de Calidad e Higiene Sanitaria',
    publishedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    category: 'sanidad',
    requireReadConfirmation: true,
    readByUsers: [
      { userId: 'u-1', userName: 'Carlos Mendoza', readAt: 'Ayer 16:30' }
    ]
  }
];

// =========================================================================
// 6. GESTIÓN DE PERSISTENCIA LOCAL (DEMO / AUDITORÍA SEGURA)
// =========================================================================

const STORAGE_KEYS = {
  TEMPERATURES: 'fnb_ops_temperatures_log',
  CLEANING: 'fnb_ops_cleaning_log',
  CHECKLISTS: 'fnb_ops_checklists_log',
  INCIDENTS: 'fnb_ops_incidents_log',
  ANNOUNCEMENTS: 'fnb_ops_announcements_log',
  CURRENT_USER: 'fnb_ops_current_user',
  CURRENT_STATION: 'fnb_ops_current_station',
  CURRENT_SHIFT: 'fnb_ops_current_shift'
};

// Generar registros iniciales de demostración para temperaturas
const generateInitialTemperatureLogs = (): TemperatureLogEntry[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 't-log-1',
      equipmentId: 'eq-camara-lacteos',
      equipmentName: 'Cámara 1: Lácteos, Huevos y Perecederos',
      location: 'Office / Barra Principal',
      recordedTemp: 3.1,
      tempMin: 0.0,
      tempMax: 4.0,
      isOutOfRange: false,
      recordedBy: 'Carlos Mendoza',
      workerRole: 'Bartender',
      timestamp: new Date().toISOString(),
      dateStr: todayStr,
      timeStr: '08:30',
      shift: 'manana',
      supervisorSignature: 'L. Santos',
      supervisorVerifiedAt: '09:00',
      notes: 'Sonda calibrada. Funcionamiento óptimo.'
    },
    {
      id: 't-log-2',
      equipmentId: 'eq-arcon-congelador',
      equipmentName: 'Arcón Congelador: Pulpas y Fruta Helada',
      location: 'Office Barra',
      recordedTemp: -19.4,
      tempMin: -24.0,
      tempMax: -18.0,
      isOutOfRange: false,
      recordedBy: 'Carlos Mendoza',
      workerRole: 'Bartender',
      timestamp: new Date().toISOString(),
      dateStr: todayStr,
      timeStr: '08:35',
      shift: 'manana',
      supervisorSignature: 'L. Santos',
      supervisorVerifiedAt: '09:00',
      notes: 'Sin escarcha excesiva en juntas.'
    }
  ];
};

// Generar registros iniciales de demostración para limpieza
const generateInitialCleaningLogs = (): CleaningLogEntry[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'c-log-1',
      taskId: 'cl-tabla-corte',
      surfaceOrEquipment: 'Tablas de corte y cuchillería de barra',
      area: 'Terraza Principal',
      frequency: 'diaria',
      approvedChemical: 'Suma Bac D10 (Desinfectante Detergente Clorado)',
      completed: true,
      completedBy: 'Carlos Mendoza',
      completedAt: new Date().toISOString(),
      dateStr: todayStr,
      shift: 'manana',
      observations: 'Desinfección de 4 tablas por código de color.',
      verifiedBySupervisor: true,
      supervisorName: 'Laura Santos',
      supervisorVerifiedAt: '09:15'
    }
  ];
};

export const fnbStorage = {
  // Temperaturas
  getTemperatures: (): TemperatureLogEntry[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPERATURES);
      if (data) return JSON.parse(data);
    } catch {}
    const initial = generateInitialTemperatureLogs();
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPERATURES, JSON.stringify(initial));
    } catch {}
    return initial;
  },

  saveTemperature: (entry: TemperatureLogEntry): TemperatureLogEntry[] => {
    const list = fnbStorage.getTemperatures();
    const updated = [entry, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPERATURES, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  verifyTemperature: (id: string, supervisorName: string): TemperatureLogEntry[] => {
    const list = fnbStorage.getTemperatures().map(item => {
      if (item.id === id) {
        return {
          ...item,
          supervisorSignature: supervisorName,
          supervisorVerifiedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return item;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPERATURES, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Limpieza
  getCleaningLogs: (): CleaningLogEntry[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLEANING);
      if (data) return JSON.parse(data);
    } catch {}
    const initial = generateInitialCleaningLogs();
    try {
      localStorage.setItem(STORAGE_KEYS.CLEANING, JSON.stringify(initial));
    } catch {}
    return initial;
  },

  saveCleaningLog: (entry: CleaningLogEntry): CleaningLogEntry[] => {
    const list = fnbStorage.getCleaningLogs();
    const updated = [entry, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.CLEANING, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  verifyCleaningLog: (id: string, supervisorName: string): CleaningLogEntry[] => {
    const list = fnbStorage.getCleaningLogs().map(item => {
      if (item.id === id) {
        return {
          ...item,
          verifiedBySupervisor: true,
          supervisorName,
          supervisorVerifiedAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return item;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.CLEANING, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Incidencias
  getIncidents: (): OperationalIncident[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS_DEMO));
    } catch {}
    return INITIAL_INCIDENTS_DEMO;
  },

  saveIncident: (incident: OperationalIncident): OperationalIncident[] => {
    const list = fnbStorage.getIncidents();
    const updated = [incident, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  updateIncidentStatus: (id: string, newStatus: OperationalIncident['status'], author: string, note?: string): OperationalIncident[] => {
    const list = fnbStorage.getIncidents().map(inc => {
      if (inc.id === id) {
        const historyEntry = {
          id: `act-${Date.now()}`,
          author,
          role: 'Supervisor',
          action: note || `Estado actualizado a ${newStatus.toUpperCase()}`,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          statusAfter: newStatus
        };
        return {
          ...inc,
          status: newStatus,
          history: [...inc.history, historyEntry],
          resolvedAt: newStatus === 'cerrada' ? new Date().toISOString() : inc.resolvedAt,
          resolvedBy: newStatus === 'cerrada' ? author : inc.resolvedBy
        };
      }
      return inc;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Comunicaciones
  getAnnouncements: (): ManagementAnnouncement[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS_DEMO));
    } catch {}
    return INITIAL_ANNOUNCEMENTS_DEMO;
  },

  confirmAnnouncementRead: (announcementId: string, userId: string, userName: string): ManagementAnnouncement[] => {
    const list = fnbStorage.getAnnouncements().map(ann => {
      if (ann.id === announcementId) {
        const alreadyRead = ann.readByUsers.some(u => u.userId === userId || u.userName === userName);
        if (!alreadyRead) {
          return {
            ...ann,
            readByUsers: [
              ...ann.readByUsers,
              {
                userId,
                userName,
                readAt: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
      }
      return ann;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Reset demo data
  resetAllDemoData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TEMPERATURES);
      localStorage.removeItem(STORAGE_KEYS.CLEANING);
      localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
      localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
      localStorage.removeItem(STORAGE_KEYS.CHECKLISTS);
    } catch {}
  }
};

// =========================================================================
// 7. CÁLCULO DE KPIs DE SUPERVISIÓN EN TIEMPO REAL
// =========================================================================

export const calculateSupervisionKPIs = (
  temperatures: TemperatureLogEntry[],
  cleaningLogs: CleaningLogEntry[],
  incidents: OperationalIncident[]
): SupervisionKPIs => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTemps = temperatures.filter(t => t.dateStr === todayStr);
  const outOfRangeAlerts = todayTemps.filter(t => t.isOutOfRange && t.followUpStatus !== 'completado').length;

  const todayCleaning = cleaningLogs.filter(c => c.dateStr === todayStr);
  const cleaningPendingVerification = todayCleaning.filter(c => !c.verifiedBySupervisor).length;

  const openIncidents = incidents.filter(i => i.status !== 'cerrada');
  const urgentIncidents = openIncidents.filter(i => i.priority === 'urgente').length;

  return {
    temperaturesCompletedToday: todayTemps.length,
    temperaturesRequiredToday: DEFAULT_APPCC_EQUIPMENTS.length,
    outOfRangeAlertsPending: outOfRangeAlerts,
    cleaningCompletedToday: todayCleaning.length,
    cleaningRequiredToday: DEFAULT_CLEANING_CATALOG.length,
    cleaningPendingVerification,
    openIncidentsCount: openIncidents.length,
    urgentIncidentsCount: urgentIncidents,
    shiftChecklistCompleted: todayTemps.length > 0 && todayCleaning.length > 0
  };
};
