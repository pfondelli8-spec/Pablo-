import { 
  HotelEntity, 
  PromotionEntity, 
  TechnicalSheet, 
  HotelMenu, 
  HotelProcedureDoc, 
  CorporatePolicy,
  DocumentIntakeItem,
  TrainingTrack
} from '../types/hotelPortal';

/**
 * UNIDADES OPERATIVAS (Esquema White-Label F&B adaptable a cualquier empresa)
 * Sin referencias a marcas comerciales predeterminadas.
 */
export const KLAYMAN_HOTELS: HotelEntity[] = [
  {
    id: 'klayman-diamond',
    name: 'Unidad Operativa Principal (F&B / Central)',
    shortName: 'Sede Principal',
    location: 'Centro Operativo F&B 1',
    island: 'Sede Central',
    stars: 4,
    categoryLabel: 'Centro Principal',
    logoUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=160&h=160&q=80',
    code: 'OP-CENTRAL-01',
    tagline: 'Centro de Coctelería de Autor, Gastronomía y Dirección Operativa',
    status: 'operativo_activo',
    summary: 'Centro operativo central para servicio de coctelería estandarizada, producción técnica, control APPCC y gestión de operaciones.',
    address: 'Área Central de Operaciones F&B',
    phone: '+34 900 00 00 01',
    email: 'operaciones@empresa-fnb.internal',
    website: 'https://operaciones.empresa-fnb.internal/',
    departments: [
      {
        id: 'food-and-beverage',
        name: 'F&B',
        code: 'FB-01',
        iconName: 'UtensilsCrossed',
        description: 'Barra técnica, coctelería estandarizada, fichas técnicas, control de escandallos, arqueos y servicio.',
        status: 'activo_piloto',
        leadRole: 'Jefatura de Operaciones & F&B Manager',
        modulesCount: 10,
        hasContent: true
      },
      {
        id: 'rrhh',
        name: 'Recursos Humanos & Cumplimiento',
        code: 'RRHH-01',
        iconName: 'Users',
        description: 'Control de plantilla, registro de certificaciones obligatorias (Manipulador de Alimentos, APPCC, PRL) y alertas de caducidad.',
        status: 'activo_piloto',
        leadRole: 'Coordinación de Operaciones & RRHH',
        modulesCount: 4,
        hasContent: true
      },
      {
        id: 'cocina',
        name: 'Cocina & Producción',
        code: 'COC-01',
        iconName: 'ChefHat',
        description: 'Mise en place de producción, fichas técnicas de cocina, APPCC y control de alérgenos.',
        status: 'activo_piloto',
        leadRole: 'Jefatura de Producción',
        modulesCount: 4,
        hasContent: true
      },
      {
        id: 'mantenimiento',
        name: 'Mantenimiento Técnico',
        code: 'MAN-01',
        iconName: 'Wrench',
        description: 'Mantenimiento preventivo de maquinaria de frío, coctelería y sistemas de dispensación.',
        status: 'pendiente_incorporacion',
        leadRole: 'Servicios Técnicos',
        modulesCount: 2,
        hasContent: false
      },
      {
        id: 'administracion',
        name: 'Administración & Control de Costes',
        code: 'ADM-01',
        iconName: 'Building2',
        description: 'Escandallos, inventarios, arqueos de caja y control de mermas.',
        status: 'activo_piloto',
        leadRole: 'Control de Gestión F&B',
        modulesCount: 3,
        hasContent: true
      }
    ]
  },
  {
    id: 'klayman-olivina',
    name: 'Unidad Operativa 2 (Punto de Venta F&B)',
    shortName: 'Unidad Satélite 2',
    location: 'Centro Operativo F&B 2',
    island: 'Área Satélite',
    stars: 3,
    categoryLabel: 'Unidad Satélite',
    logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=160&h=160&q=80',
    code: 'OP-SATELITE-02',
    tagline: 'Punto de Venta de Terraza y Servicio Continuo de Barra',
    status: 'operativo_activo',
    summary: 'Punto de venta satélite enfocado a servicio ágil de combinados, cafetería de alta rotación y aperitivos.',
    address: 'Área Satélite de Operaciones F&B',
    phone: '+34 900 00 00 02',
    email: 'unidad2@empresa-fnb.internal',
    website: 'https://unidad2.empresa-fnb.internal/',
    departments: [
      {
        id: 'food-and-beverage',
        name: 'F&B',
        code: 'FB-02',
        iconName: 'UtensilsCrossed',
        description: 'Servicio continuado de coctelería, combinados y barra rápida.',
        status: 'activo_piloto',
        leadRole: 'Jefe de Barra',
        modulesCount: 4,
        hasContent: true
      },
      {
        id: 'rrhh',
        name: 'Personal & Requisitos',
        code: 'RRHH-02',
        iconName: 'Users',
        description: 'Control de certificados de manipulador y PRL del equipo satélite.',
        status: 'activo_piloto',
        leadRole: 'Coordinador de Turno',
        modulesCount: 2,
        hasContent: true
      }
    ]
  }
];

/**
 * BASE DE DATOS DE FICHAS TÉCNICAS
 * Se inicializa vacía ([]). Su empresa puede añadir o importar sus propias fichas técnicas.
 */
export const TECHNICAL_SHEETS_DATABASE: TechnicalSheet[] = [];

/**
 * MANUALES DE PROCEDIMIENTOS OPERATIVOS (SOP)
 * Se inicializa vacía ([]). Su empresa puede crear sus propios procedimientos normalizados.
 */
export const HOTEL_PROCEDURES_DATABASE: HotelProcedureDoc[] = [];

/**
 * MENÚS Y CARTAS F&B ESTANDARIZADAS
 * Se inicializa vacía ([]).
 */
export const DIAMOND_MENUS: HotelMenu[] = [];
export const HOTEL_MENUS: HotelMenu[] = [];

/**
 * PROMOCIONES OPERATIVAS
 * Se inicializa vacía ([]).
 */
export const DIAMOND_PROMOTIONS: PromotionEntity[] = [];
export const OLIVINA_PROMOTIONS: PromotionEntity[] = [];
export const PROMOTIONS_DATABASE: PromotionEntity[] = [];

/**
 * POLÍTICAS CORPORATIVAS DE OPERACIONES
 * Se inicializa vacía ([]).
 */
export const CORPORATE_POLICIES: CorporatePolicy[] = [];

/**
 * BANDEJA DE ENTRADA DOCUMENTAL
 * Se inicializa vacía ([]).
 */
export const INITIAL_DOCUMENT_INTAKE: DocumentIntakeItem[] = [];
export const DOCUMENT_INTAKE_ITEMS: DocumentIntakeItem[] = [];

/**
 * PROGRAMAS DE FORMACIÓN
 * Se inicializa vacía ([]).
 */
export const DIAMOND_TRAINING_TRACKS: TrainingTrack[] = [];

/**
 * PLANTILLA DE DEMOSTRACIÓN (OPCIONAL)
 * Si el usuario desea cargar datos de ejemplo para explorar el sistema, puede activar esta plantilla.
 */
export const DEMO_SAMPLE_TECHNICAL_SHEETS: TechnicalSheet[] = [
  {
    id: 'mojito-clasico',
    code: 'FT-COC-001',
    hotelId: 'klayman-diamond',
    outletId: 'diamond-bar-terraza',
    outletName: 'Área de Barra & Coctelería',
    title: 'Mojito Clásico',
    name: 'Mojito Clásico',
    category: 'cocteles',
    version: '2.0',
    updatedDate: '15/10/2026',
    status: 'Aprobada',
    technique: 'Directo en vaso / Majado suave',
    preparationMethod: [
      'Añadimos las hojas de hierbabuena fresca, el zumo fresco de lima y el jarabe de azúcar de caña en el vaso.',
      'Majamos suavemente con maza técnica para extraer aceites esenciales sin romper la fibra vegetal.',
      'Añadimos el ron blanco y colmamos el vaso con hielo picado hasta dos tercios.',
      'Removemos con cuchara imperial mediante movimiento ascendente para integrar los componentes.',
      'Completamos con soda carbonatada y corona de hielo picado.',
      'Decoramos con ramillete de hierbabuena previamente palmeada y rueda de lima fresca.'
    ],
    ice: 'Hielo picado (crushed ice)',
    glassware: 'Vaso Collins / Highball (35 cl)',
    tools: 'Maza de coctelería (muddler), cuchara imperial, jigger graduado y pinzas de precisión',
    decoration: 'Ramillete de hierbabuena fresca palmeada y rueda de lima',
    garnish: 'Ramillete de hierbabuena fresca palmeada y rueda de lima',
    presentation: 'Servido con pajita compostable y corona de hielo picado limpio',
    diagnosis: 'Perfil refrescante, cítrico y aromático con balance dulce-ácido preciso y persistencia mentolada.',
    flavorCompass: {
      sweet: 3,
      sour: 4,
      bitter: 0,
      fruity: 3,
      alcohol: 3,
      herbal: 5
    },
    ingredients: [
      { quantity: '6 cl', name: 'Ron blanco' },
      { quantity: '3 cl', name: 'Zumo fresco de lima' },
      { quantity: '2 cl', name: 'Jarabe de azúcar de caña' },
      { quantity: '8 un.', name: 'Hojas de hierbabuena fresca' },
      { quantity: '6 cl', name: 'Soda / Agua carbonatada' }
    ],
    allergens: ['Sin alérgenos declarables'],
    servingTemperature: '0 °C a 2 °C',
    escandallo: {
      rawCost: 1.45,
      sellingPrice: 9.50,
      marginPercent: 84.7
    },
    keyQualityPoints: [
      'No triturar la hierbabuena para evitar la extracción de taninos amargos.',
      'Utilizar exclusivamente zumo de lima recién exprimido.',
      'Servir inmediatamente para mantener la carbonatación activa.'
    ],
    notes: 'Cóctel emblemático de alta rotación en servicio continuo.'
  },
  {
    id: 'dry-martini',
    code: 'FT-COC-002',
    hotelId: 'klayman-diamond',
    outletId: 'diamond-bar-terraza',
    outletName: 'Área de Barra & Coctelería',
    title: 'Dry Martini Clásico',
    name: 'Dry Martini Clásico',
    category: 'cocteles',
    version: '2.0',
    updatedDate: '16/10/2026',
    status: 'Aprobada',
    technique: 'Removido en vaso mezclador (Stirred)',
    preparationMethod: [
      'Enfriamos la copa cóctel previamente con hielo y agua en la estación de mise en place.',
      'Añadimos abundante hielo macizo en el vaso mezclador.',
      'Añadimos la ginebra London Dry y el vermut seco según dosificación con jigger.',
      'Removemos suavemente con cuchara imperial durante 25 segundos controlando la dilución térmica.',
      'Descartamos el hielo de enfriamiento de la copa cóctel.',
      'Servimos colando la mezcla con colador Julep en la copa técnica fría.',
      'Decoramos aromatizando la superficie con los aceites de un twist de limón fresco o brocheta con aceituna verde.'
    ],
    ice: 'Hielo macizo para mezcla (sin hielo en copa)',
    glassware: 'Copa Martini / Copa Nick & Nora (18 cl)',
    tools: 'Vaso mezclador de cristal (Mixing glass), cuchara imperial, colador Julep, jigger graduado y pinza',
    decoration: 'Twist de piel de limón descartado o aceituna verde sin hueso en brocheta',
    garnish: 'Twist de limón o aceituna verde de manzanilla',
    presentation: 'Líquido cristalino, libre de cristales de hielo suspendidos, copa con escarcha térmica',
    diagnosis: 'Perfil seco, espirituoso y botánico, de gran pureza con matices de enebro, cítricos y final mineral.',
    flavorCompass: {
      sweet: 0,
      sour: 1,
      bitter: 2,
      fruity: 1,
      alcohol: 5,
      herbal: 4
    },
    ingredients: [
      { quantity: '6 cl', name: 'Ginebra London Dry' },
      { quantity: '1 cl', name: 'Vermut seco' },
      { quantity: '1 un.', name: 'Aceituna verde deshuesada o twist de piel de limón' }
    ],
    allergens: ['Sulfitos'],
    servingTemperature: '-2 °C a 0 °C',
    escandallo: {
      rawCost: 1.60,
      sellingPrice: 11.00,
      marginPercent: 85.4
    },
    keyQualityPoints: [
      'Copa rigurosamente fría antes del servicio.',
      'Control estricto del tiempo de removido para evitar sobre-dilución.',
      'Uso de cristalería pulida sin rastros de grasa o detergente.'
    ],
    notes: 'Referente de coctelería clásica internacional.'
  }
];
