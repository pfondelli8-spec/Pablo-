/**
 * HOSTELOPS - SERVICIO MULTIEMPRESA Y PERSISTENCIA DE DATOS
 * Implementa aislamiento por empresa, gestión de configuración, registros inmutables y trazabilidad
 */

import {
  CompanyConfig,
  EstablishmentConfig,
  DepartmentConfig,
  PointOfSaleConfig,
  JobRoleConfig,
  UserAccount,
  UserProfileRole,
  KnowledgeDocument,
  StandardRecipeEntity,
  ShiftChecklistExecution,
  EquipmentAppccDef,
  AppccTempRecord,
  CleaningTaskExecution,
  IncidentTicket
} from '../types/multiTenantConfig';

// =========================================================================
// 1. DATOS GENÉRICOS DE DEMOSTRACIÓN (100% LIBRES DE MARCAS PROPIETARIAS)
// =========================================================================

export const DEFAULT_DEMO_COMPANY: CompanyConfig = {
  id: 'company-generic-01',
  name: 'GastroOps Hospitality Group',
  legalName: 'GastroOps Soluciones Hosteleras S.L.',
  taxId: 'B-87654321',
  slogan: 'Plataforma estandarizada de operaciones, seguridad alimentaria y manuales técnicos.',
  logoUrl: '',
  primaryColor: '#1A2530',
  accentColor: '#C5A880',
  activeModules: {
    misTareas: true,
    conocimiento: true,
    recetas: true,
    controlesTemperaturas: true,
    controlesLimpieza: true,
    incidencias: true,
    supervision: true
  },
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: new Date().toISOString()
};

export const DEFAULT_DEMO_ESTABLISHMENTS: EstablishmentConfig[] = [
  {
    id: 'est-01',
    companyId: 'company-generic-01',
    name: 'Hotel & Restaurante Central Demo',
    code: 'EST-H01',
    type: 'hotel',
    address: 'Avda. Principal Hostelería, 42',
    phone: '+34 912 345 678',
    email: 'central@gastroops-demo.com',
    status: 'activo'
  },
  {
    id: 'est-02',
    companyId: 'company-generic-01',
    name: 'Bistró & Cocktails Lounge Demo',
    code: 'EST-B02',
    type: 'restaurante',
    address: 'Calle Gastronómica, 18',
    phone: '+34 912 987 654',
    email: 'bistro@gastroops-demo.com',
    status: 'activo'
  }
];

export const DEFAULT_DEMO_DEPARTMENTS: DepartmentConfig[] = [
  {
    id: 'dep-fnb',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    name: 'F&B / Restauración',
    code: 'DEP-FNB',
    category: 'barra',
    status: 'activo'
  },
  {
    id: 'dep-cocina',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    name: 'Cocina & Producción Gastronómica',
    code: 'DEP-COC',
    category: 'cocina',
    status: 'activo'
  },
  {
    id: 'dep-sala',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    name: 'Sala & Atención en Mesa',
    code: 'DEP-SAL',
    category: 'sala',
    status: 'activo'
  },
  {
    id: 'dep-mant',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    name: 'Mantenimiento & Servicios Técnicos',
    code: 'DEP-MAN',
    category: 'mantenimiento',
    status: 'activo'
  }
];

export const DEFAULT_DEMO_POINTS_OF_SALE: PointOfSaleConfig[] = [
  {
    id: 'pos-barra-piscina',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    name: 'Bar Piscina & Terraza',
    code: 'POS-01',
    type: 'barra',
    schedule: '10:00 - 19:00',
    status: 'activo'
  },
  {
    id: 'pos-cocktails-lounge',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    name: 'Cocktails & Spirits Lounge',
    code: 'POS-02',
    type: 'barra',
    schedule: '18:00 - 02:00',
    status: 'activo'
  },
  {
    id: 'pos-restaurante',
    establishmentId: 'est-01',
    departmentId: 'dep-sala',
    name: 'Restaurante Buffet Principal',
    code: 'POS-03',
    type: 'restaurante',
    schedule: '07:30 - 22:30',
    status: 'activo'
  },
  {
    id: 'pos-cocina-central',
    establishmentId: 'est-01',
    departmentId: 'dep-cocina',
    name: 'Cocina Central & Cuarto Frío',
    code: 'POS-04',
    type: 'pantry',
    schedule: '06:00 - 23:30',
    status: 'activo'
  }
];

export const DEFAULT_DEMO_JOB_ROLES: JobRoleConfig[] = [
  {
    id: 'role-bartender',
    departmentId: 'dep-fnb',
    title: 'Bartender / Camarero de Barra',
    code: 'PST-01',
    level: 'base',
    responsibilities: [
      'Preparación de cócteles y combinados según fichas técnicas estandarizadas',
      'Registro térmico de cámaras de frío en el turno matinal y vespertino',
      'Ejecución del plan de limpieza de superficies con químicos autorizados',
      'Arqueo de caja y emisión obligatoria de Ticket Z al cierre'
    ]
  },
  {
    id: 'role-supervisor',
    departmentId: 'dep-fnb',
    title: 'Supervisor de Turno F&B',
    code: 'PST-02',
    level: 'supervisor',
    responsibilities: [
      'Verificación y firma de registros APPCC y limpieza',
      'Gestión y asignación de incidencias operativas y roturas',
      'Supervisión de mise en place y estándares de atención'
    ]
  },
  {
    id: 'role-jefe-cocina',
    departmentId: 'dep-cocina',
    title: 'Jefe de Partida / Cocinero',
    code: 'PST-03',
    level: 'base',
    responsibilities: [
      'Elaboración de recetas según escandallos y fichas técnicas oficiales',
      'Control de alérgenos y prevención de contaminación cruzada',
      'Registro de temperaturas de cocción (>75ºC) y enfriamiento rápido'
    ]
  },
  {
    id: 'role-director',
    departmentId: 'dep-fnb',
    title: 'Dirección de Operaciones F&B',
    code: 'PST-04',
    level: 'direccion',
    responsibilities: [
      'Supervisión global de cumplimiento de auditorías e indicadores',
      'Aprobación de nuevas versiones de procedimientos y cartas',
      'Gestión de costes, proveedores y parámetros legales'
    ]
  }
];

export const DEFAULT_DEMO_USERS: UserAccount[] = [
  {
    id: 'usr-admin-plat',
    companyId: 'company-generic-01',
    name: 'Superadmin Plataforma',
    email: 'admin@hostelops-plataforma.com',
    role: 'admin_plataforma',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    jobRoleId: 'role-director'
  },
  {
    id: 'usr-admin-emp',
    companyId: 'company-generic-01',
    name: 'Marta González (Admin Empresa)',
    email: 'marta.gonzalez@gastroops-demo.com',
    role: 'admin_empresa',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    jobRoleId: 'role-director'
  },
  {
    id: 'usr-dir-ops',
    companyId: 'company-generic-01',
    name: 'Roberto Vilar (Director de Operaciones)',
    email: 'roberto.vilar@gastroops-demo.com',
    role: 'direccion_operaciones',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    jobRoleId: 'role-director'
  },
  {
    id: 'usr-jefe-dep',
    companyId: 'company-generic-01',
    name: 'Laura Santos (Jefa de Bares)',
    email: 'laura.santos@gastroops-demo.com',
    role: 'jefe_departamento',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    jobRoleId: 'role-supervisor'
  },
  {
    id: 'usr-antonio-admin',
    companyId: 'company-generic-01',
    name: 'Antonio González (Chef Ejecutivo & Admin)',
    email: 'antoniogonzalez@springhoteles.com',
    role: 'admin_empresa',
    establishmentId: 'est-01',
    departmentId: 'dep-cocina',
    pointOfSaleId: 'pos-restaurante',
    jobRoleId: 'role-director',
    avatarUrl: '/assets/aistudio/image_056773e3.png'
  },
  {
    id: 'usr-jefe-cocina',
    companyId: 'company-generic-01',
    name: 'Giacomo Longo (Chef Ejecutivo & Admin)',
    email: 'giacomo.longo@hotelvulcano.com',
    role: 'admin_empresa',
    establishmentId: 'est-01',
    departmentId: 'dep-cocina',
    pointOfSaleId: 'pos-restaurante',
    jobRoleId: 'role-director',
    avatarUrl: '/assets/aistudio/image_056773e3.png'
  },
  {
    id: 'usr-trabajador',
    companyId: 'company-generic-01',
    name: 'Carlos Mendoza (Bartender)',
    email: 'carlos.mendoza@gastroops-demo.com',
    role: 'trabajador',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    jobRoleId: 'role-bartender'
  }
];

// Documentos iniciales de Conocimiento y Formación
export const DEFAULT_DEMO_KNOWLEDGE: KnowledgeDocument[] = [
  {
    id: 'doc-sop-01',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    title: 'SOP 01: Procedimiento Homologado de Apertura y Puesta a Punto de Barra',
    code: 'SOP-BAR-01',
    category: 'sop_procedimiento',
    categoryLabel: 'Procedimientos Operativos',
    version: '2.1',
    status: 'publicado',
    summary: 'Pasos cronológicos para la puesta en marcha de estaciones de coctelería y barra antes del servicio.',
    steps: [
      { order: 1, title: 'Inspección Térmica', detail: 'Verificar lecturas de sondas en cámaras (0 a 4ºC) y congelador (-18ºC). Registrar valor en la app.', criticalCheck: 'Desviación superior a +4ºC exige acción correctiva' },
      { order: 2, title: 'Puesta en Marcha de Lavavasos', detail: 'Comprobar niveles de detergente neutro y abrillantador. Ejecutar ciclo térmico en vacío hasta alcanzar >65ºC de aclarado.' },
      { order: 3, title: 'Mise en Place de Estación', detail: 'Montar contenedores gastronorm con fruta recién cortada (cítricos con rotulación de fecha FIFO), hielo macizo en cuba y siropes.' },
      { order: 4, title: 'Verificación de TPV y Fondo', detail: 'Comprobar enlace de red con impresora térmica de tickets y confirmar fondo de caja físico.' }
    ],
    safetyNotes: ['Calzado antideslizante obligatorio', 'Uso de pinzas para hielo (prohibido vaso de cristal en cubo)'],
    responsible: 'Dirección de Operaciones F&B',
    effectiveDate: '2026-01-01',
    reviewDate: '2026-12-31',
    readConfirmations: [
      { userId: 'usr-trabajador', userName: 'Carlos Mendoza', userRole: 'trabajador', version: '2.1', readAt: '2026-02-10 09:15' }
    ]
  },
  {
    id: 'doc-higiene-02',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    title: 'Norma de Higiene: Manejo de Alérgenos y Prevención de Contaminación Cruzada',
    code: 'APPCC-ALER-02',
    category: 'normas_higiene',
    categoryLabel: 'Seguridad Alimentaria & APPCC',
    version: '1.4',
    status: 'publicado',
    summary: 'Protocolo estricto para la manipulación y servicio de alimentos y bebidas libres de alérgenos.',
    steps: [
      { order: 1, title: 'Consulta de Ficha Técnica', detail: 'Ante cualquier duda del comensal, contrastar con la matriz oficial de los 14 alérgenos UE.', criticalCheck: 'Nunca inferir la ausencia de un alérgeno sin verificar ficha' },
      { order: 2, title: 'Higienización Previa', detail: 'Lavar manos y desinfectar con bayeta de microfibra azul la coctelera o superficie de trabajo antes de preparar la comanda.' },
      { order: 3, title: 'Servicio Diferenciado', detail: 'Marcar el tique de TPV con el distintivo de comensal celíaco o alérgico y servir con cubertería esterilizada separada.' }
    ],
    responsible: 'Responsable Sanitario & Calidad',
    effectiveDate: '2026-01-15',
    reviewDate: '2026-12-31',
    readConfirmations: []
  }
];

// Recetas y Fichas Técnicas Estándar Genéricas
export const DEFAULT_DEMO_RECIPES: StandardRecipeEntity[] = [
  {
    id: 'rec-01',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Mojito Clásico Estandarizado',
    code: 'FT-CKT-01',
    category: 'cocteleria',
    servings: 1,
    prepTimeMinutes: 3,
    ingredients: [
      { name: 'Ron blanco tradicional', quantity: '5 cl', unit: 'cl', costApprox: 0.65 },
      { name: 'Zumo de lima recién exprimido', quantity: '2.5 cl', unit: 'cl', costApprox: 0.20 },
      { name: 'Sirope de azúcar de caña simple (1:1)', quantity: '2 cl', unit: 'cl', costApprox: 0.08 },
      { name: 'Hierbabuena fresca en rama', quantity: '8 hojas', unit: 'hojas', costApprox: 0.15 },
      { name: 'Soda carbónica / Agua con gas', quantity: '6 cl', unit: 'cl', costApprox: 0.10 },
      { name: 'Hielo pilé picado', quantity: '150 gr', unit: 'gr', costApprox: 0.05 }
    ],
    elaborationSteps: [
      '1. Añadimos las hojas de hierbabuena fresca y el sirope de azúcar simple al vaso.',
      '2. Presionamos suavemente con el mazo de coctelería sin romper las fibras vegetales para evitar notas amargas.',
      '3. Añadimos el zumo de lima recién exprimido y el ron blanco.',
      '4. Incorporamos hielo pilé hasta completar 3/4 partes del vaso.',
      '5. Removemos con la cuchara de bar de abajo hacia arriba para homogeneizar la mezcla.',
      '6. Completamos con soda carbónica fría y una cúpula de hielo pilé.',
      '7. Decoramos con ramillete de hierbabuena fresca palmeada y rodaja de lima.'
    ],
    utensilsAndGlassware: 'Vaso Collins o Highball (35 cl), mazo de bar, cuchara trenzada',
    sensoryDiagnosis: 'Perfil cítrico y muy refrescante, con dulzor balanceado y aroma mentolado vivo sin astringencia.',
    allergens: ['Sin alérgenos declarables según Reglamento UE 1169/2011'],
    criticalPoints: 'No triturar la hierbabuena; utilizar soda bien fría para mantener la efervescencia.',
    costPerServing: 1.23,
    sellingPrice: 8.50,
    version: '3.0',
    status: 'publicado',
    updatedAt: '2026-02-01',
    responsible: 'Jefe de Bares'
  },
  {
    id: 'rec-02',
    companyId: 'company-generic-01',
    establishmentId: 'est-01',
    departmentId: 'dep-fnb',
    pointOfSaleId: 'pos-cocktails-lounge',
    name: 'Espresso Martini Signature',
    code: 'FT-CKT-02',
    category: 'cocteleria',
    servings: 1,
    prepTimeMinutes: 4,
    ingredients: [
      { name: 'Vodka destilado de grano', quantity: '5 cl', unit: 'cl', costApprox: 0.85 },
      { name: 'Licor de café de especialidad', quantity: '2 cl', unit: 'cl', costApprox: 0.40 },
      { name: 'Café espresso recién extraído caliente', quantity: '3 cl (1 shot)', unit: 'cl', costApprox: 0.25 },
      { name: 'Sirope de vainilla bourbon', quantity: '1 cl', unit: 'cl', costApprox: 0.12 },
      { name: 'Granos de café tostado', quantity: '3 unidades', unit: 'un', costApprox: 0.05 }
    ],
    elaborationSteps: [
      '1. Enfriamos previamente la copa Coupé con hielo y agua.',
      '2. Extraemos el café espresso al momento para garantizar crema densa.',
      '3. Añadimos el vodka, el licor de café, el sirope de vainilla y el café recién hecho en la coctelera Boston.',
      '4. Llenamos la coctelera con hielo macizo de 40g.',
      '5. Agitamos enérgicamente durante 12 segundos para emulsionar los aceites del café con el licor.',
      '6. Descartamos el agua de la copa y servimos mediante doble colado (colador gusanillo + colador fino).',
      '7. Decoramos posando 3 granos de café tostado en el centro de la corona de crema.'
    ],
    utensilsAndGlassware: 'Copa Coupé / Martini (22 cl), coctelera Boston, colador fino',
    sensoryDiagnosis: 'Textura cremosa y aterciopelada, notas tostadas profundas de café de altura armonizadas con vainilla y final seco.',
    allergens: ['Sin alérgenos declarables'],
    criticalPoints: 'El espresso debe estar recién hecho y el batido debe ser muy vigoroso para generar la espuma característica.',
    costPerServing: 1.67,
    sellingPrice: 9.50,
    version: '2.4',
    status: 'publicado',
    updatedAt: '2026-01-20',
    responsible: 'Jefe de Bares'
  }
];

// Equipos APPCC genéricos configurables
export const DEFAULT_DEMO_EQUIPMENT_APPCC: EquipmentAppccDef[] = [
  {
    id: 'eq-camara-1',
    establishmentId: 'est-01',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Cámara 1: Lácteos, Huevos y Perecederos',
    category: 'refrigeracion',
    tempMin: 0.0,
    tempMax: 4.0,
    unit: 'ºC',
    description: 'Conservación sanitaria de lácteos y pre-batches perecederos.'
  },
  {
    id: 'eq-camara-2',
    establishmentId: 'est-01',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Cámara 2: Bebidas, Fruta y Zumos',
    category: 'refrigeracion',
    tempMin: 2.0,
    tempMax: 6.0,
    unit: 'ºC',
    description: 'Zumos naturales, cítricos cortados y cerveza de barril.'
  },
  {
    id: 'eq-congelador',
    establishmentId: 'est-01',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Arcón Congelador: Pulpas y Hielos',
    category: 'congelacion',
    tempMin: -24.0,
    tempMax: -18.0,
    unit: 'ºC',
    description: 'Conservación de pulpas de fruta y materia prima congelada.'
  },
  {
    id: 'eq-vitrina-fria',
    establishmentId: 'est-01',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Vitrina Fría Contrabarra (Garnish)',
    category: 'vitrina',
    tempMin: 1.0,
    tempMax: 5.0,
    unit: 'ºC',
    description: 'Guarniciones de servicio preparadas.'
  },
  {
    id: 'eq-lavavasos',
    establishmentId: 'est-01',
    pointOfSaleId: 'pos-barra-piscina',
    name: 'Lavavasos Térmico (Ciclo Aclarado)',
    category: 'lavado_termico',
    tempMin: 65.0,
    tempMax: 85.0,
    unit: 'ºC',
    description: 'Termodesinfección de vajilla y cristalería.'
  }
];

// =========================================================================
// 2. MOTOR DE PERSISTENCIA CON AISLAMIENTO POR EMPRESA
// =========================================================================

const PREFIX = 'hostelops_tenant_';

export const multiTenantStorage = {
  // Configuración de la Empresa
  getCompany: (): CompanyConfig => {
    try {
      const data = localStorage.getItem(`${PREFIX}company`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}company`, JSON.stringify(DEFAULT_DEMO_COMPANY));
    } catch {}
    return DEFAULT_DEMO_COMPANY;
  },

  saveCompany: (company: CompanyConfig) => {
    company.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(`${PREFIX}company`, JSON.stringify(company));
    } catch {}
    return company;
  },

  // Establecimientos
  getEstablishments: (): EstablishmentConfig[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}establishments`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}establishments`, JSON.stringify(DEFAULT_DEMO_ESTABLISHMENTS));
    } catch {}
    return DEFAULT_DEMO_ESTABLISHMENTS;
  },

  saveEstablishments: (list: EstablishmentConfig[]) => {
    try {
      localStorage.setItem(`${PREFIX}establishments`, JSON.stringify(list));
    } catch {}
    return list;
  },

  addEstablishment: (est: Omit<EstablishmentConfig, 'id'>): EstablishmentConfig => {
    const list = multiTenantStorage.getEstablishments();
    const newEst: EstablishmentConfig = {
      ...est,
      id: `est-${Date.now()}`
    };
    const updated = [...list, newEst];
    multiTenantStorage.saveEstablishments(updated);
    return newEst;
  },

  // Departamentos
  getDepartments: (): DepartmentConfig[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}departments`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}departments`, JSON.stringify(DEFAULT_DEMO_DEPARTMENTS));
    } catch {}
    return DEFAULT_DEMO_DEPARTMENTS;
  },

  saveDepartments: (list: DepartmentConfig[]) => {
    try {
      localStorage.setItem(`${PREFIX}departments`, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Puntos de Venta
  getPointsOfSale: (): PointOfSaleConfig[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}points_of_sale`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}points_of_sale`, JSON.stringify(DEFAULT_DEMO_POINTS_OF_SALE));
    } catch {}
    return DEFAULT_DEMO_POINTS_OF_SALE;
  },

  savePointsOfSale: (list: PointOfSaleConfig[]) => {
    try {
      localStorage.setItem(`${PREFIX}points_of_sale`, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Puestos de Trabajo
  getJobRoles: (): JobRoleConfig[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}job_roles`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}job_roles`, JSON.stringify(DEFAULT_DEMO_JOB_ROLES));
    } catch {}
    return DEFAULT_DEMO_JOB_ROLES;
  },

  saveJobRoles: (list: JobRoleConfig[]) => {
    try {
      localStorage.setItem(`${PREFIX}job_roles`, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Usuarios
  getUsers: (): UserAccount[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}users`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}users`, JSON.stringify(DEFAULT_DEMO_USERS));
    } catch {}
    return DEFAULT_DEMO_USERS;
  },

  saveUsers: (list: UserAccount[]) => {
    try {
      localStorage.setItem(`${PREFIX}users`, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Usuario Activo en Sesión
  getCurrentUser: (): UserAccount => {
    const users = multiTenantStorage.getUsers();
    try {
      const id = localStorage.getItem(`${PREFIX}current_user_id`);
      if (id) {
        const found = users.find(u => u.id === id);
        if (found) return found;
      }
    } catch {}
    // Default a trabajador para experiencia mobile-first
    return users.find(u => u.role === 'trabajador') || users[0];
  },

  setCurrentUser: (userId: string) => {
    try {
      localStorage.setItem(`${PREFIX}current_user_id`, userId);
    } catch {}
  },

  // Documentos de Conocimiento (SOPs, manuales)
  getKnowledgeDocs: (): KnowledgeDocument[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}knowledge_docs`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}knowledge_docs`, JSON.stringify(DEFAULT_DEMO_KNOWLEDGE));
    } catch {}
    return DEFAULT_DEMO_KNOWLEDGE;
  },

  saveKnowledgeDoc: (doc: KnowledgeDocument): KnowledgeDocument[] => {
    const list = multiTenantStorage.getKnowledgeDocs();
    const existingIndex = list.findIndex(d => d.id === doc.id);
    let updated: KnowledgeDocument[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = doc;
    } else {
      updated = [doc, ...list];
    }
    try {
      localStorage.setItem(`${PREFIX}knowledge_docs`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  confirmDocRead: (docId: string, user: UserAccount): KnowledgeDocument[] => {
    const list = multiTenantStorage.getKnowledgeDocs();
    const doc = list.find(d => d.id === docId);
    if (!doc) return list;

    const alreadyRead = doc.readConfirmations.some(r => r.userId === user.id && r.version === doc.version);
    if (!alreadyRead) {
      doc.readConfirmations.push({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        version: doc.version,
        readAt: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      });
      try {
        localStorage.setItem(`${PREFIX}knowledge_docs`, JSON.stringify(list));
      } catch {}
    }
    return list;
  },

  // Recetario & Fichas Técnicas
  getRecipes: (): StandardRecipeEntity[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}recipes`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}recipes`, JSON.stringify(DEFAULT_DEMO_RECIPES));
    } catch {}
    return DEFAULT_DEMO_RECIPES;
  },

  saveRecipe: (recipe: StandardRecipeEntity): StandardRecipeEntity[] => {
    const list = multiTenantStorage.getRecipes();
    const existingIndex = list.findIndex(r => r.id === recipe.id);
    let updated: StandardRecipeEntity[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = recipe;
    } else {
      updated = [recipe, ...list];
    }
    try {
      localStorage.setItem(`${PREFIX}recipes`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Equipos APPCC
  getEquipments: (): EquipmentAppccDef[] => {
    try {
      const data = localStorage.getItem(`${PREFIX}equipments_appcc`);
      if (data) return JSON.parse(data);
    } catch {}
    try {
      localStorage.setItem(`${PREFIX}equipments_appcc`, JSON.stringify(DEFAULT_DEMO_EQUIPMENT_APPCC));
    } catch {}
    return DEFAULT_DEMO_EQUIPMENT_APPCC;
  },

  saveEquipments: (list: EquipmentAppccDef[]) => {
    try {
      localStorage.setItem(`${PREFIX}equipments_appcc`, JSON.stringify(list));
    } catch {}
    return list;
  },

  // Exportar respaldo de datos de la empresa
  exportCompanyBackup: () => {
    const payload = {
      exportDate: new Date().toISOString(),
      company: multiTenantStorage.getCompany(),
      establishments: multiTenantStorage.getEstablishments(),
      departments: multiTenantStorage.getDepartments(),
      pointsOfSale: multiTenantStorage.getPointsOfSale(),
      jobRoles: multiTenantStorage.getJobRoles(),
      users: multiTenantStorage.getUsers(),
      knowledge: multiTenantStorage.getKnowledgeDocs(),
      recipes: multiTenantStorage.getRecipes(),
      equipments: multiTenantStorage.getEquipments()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${payload.company.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Restablecer valores de fábrica
  resetToFactoryDemo: () => {
    localStorage.removeItem(`${PREFIX}company`);
    localStorage.removeItem(`${PREFIX}establishments`);
    localStorage.removeItem(`${PREFIX}departments`);
    localStorage.removeItem(`${PREFIX}points_of_sale`);
    localStorage.removeItem(`${PREFIX}job_roles`);
    localStorage.removeItem(`${PREFIX}users`);
    localStorage.removeItem(`${PREFIX}knowledge_docs`);
    localStorage.removeItem(`${PREFIX}recipes`);
    localStorage.removeItem(`${PREFIX}equipments_appcc`);
  }
};
