/**
 * HOSTELOPS - MODELOS DE HOTEL PRECARGADOS Y ESTRUCTURA DE COCINA
 * Proporciona los dos modelos de demostración independientes:
 * - Hotel Mitaca (Resort 4★ · Alto volumen · Buffet y Showcooking)
 * - Hotel Vulcano (Boutique 5★ · Gastronómico · Carta de autor y Pase fino)
 * Incluye las 7 áreas de cocina y las 6 categorías documentales normalizadas.
 */

import {
  DemoHotelModel,
  KitchenStationArea,
  KitchenStationKey,
  DocumentCategoryKey,
  UploadedDocumentRecord,
  EstablishmentConfig,
  DepartmentConfig,
  PointOfSaleConfig,
  JobRoleConfig,
  KnowledgeDocument,
  StandardRecipeEntity,
  EquipmentAppccDef
} from '../types/multiTenantConfig';
import { multiTenantStorage } from './multiTenantStorage';

const STORAGE_MODELS_KEY = 'hostelops_demo_hotel_models';
const STORAGE_ACTIVE_MODEL_KEY = 'hostelops_active_hotel_model_id';
const STORAGE_UPLOADED_DOCS_KEY = 'hostelops_uploaded_kitchen_documents';

// 6 Categorías documentales normalizadas según el prompt maestro
export const STANDARD_DOCUMENT_CATEGORIES: {
  key: DocumentCategoryKey;
  label: string;
  shortDesc: string;
}[] = [
  {
    key: 'info_puesto',
    label: 'Información del puesto',
    shortDesc: 'Descripción del puesto, organigrama, competencias y normas de conducta.'
  },
  {
    key: 'operativa_turno',
    label: 'Operativa del turno',
    shortDesc: 'Checklists de apertura/cierre, tiempos de pase y protocolos de servicio.'
  },
  {
    key: 'elaboraciones',
    label: 'Elaboraciones',
    shortDesc: 'Fichas técnicas, escandallos, pasos de preparación y presentación.'
  },
  {
    key: 'higiene_seguridad',
    label: 'Higiene y seguridad alimentaria',
    shortDesc: 'Controles APPCC, temperaturas críticas, plan de alérgenos y trazabilidad.'
  },
  {
    key: 'equipos_materiales',
    label: 'Equipos y materiales',
    shortDesc: 'Guías de uso de maquinaria, mantenimiento preventivo y fichas de limpieza.'
  },
  {
    key: 'formacion',
    label: 'Formación',
    shortDesc: 'Manuales de acogida, técnicas culinarias y prevención de riesgos.'
  }
];

// Metadatos y etiquetas para las 7 áreas de cocina
export const KITCHEN_STATION_META: Record<KitchenStationKey, {
  name: string;
  code: string;
  order: number;
  badge: string;
}> = {
  cafeteria: { name: 'Partida de Desayunos y Cafetería', code: 'COC-01', order: 1, badge: 'Cocinero de Desayunos' },
  frio: { name: 'Partida Fría', code: 'COC-02', order: 2, badge: 'Cocinero de Partida Fría' },
  caliente: { name: 'Partida Caliente', code: 'COC-03', order: 3, badge: 'Cocinero de Partida Caliente' },
  manana: { name: 'Turno Mañana', code: 'COC-04', order: 4, badge: 'Turno Matinal' },
  tarde: { name: 'Turno Tarde', code: 'COC-05', order: 5, badge: 'Turno Vespertino' },
  barmitonio: { name: 'Partida de Plancha y Platería', code: 'COC-06', order: 6, badge: 'Cocinero de Plancha & Pase' },
  menu_rueda_1: { name: 'Menú — Rueda 1', code: 'MENU-01', order: 7, badge: 'Ciclo 15 Días R1' },
  menu_rueda_2: { name: 'Menú — Rueda 2', code: 'MENU-02', order: 8, badge: 'Ciclo 15 Días R2' },
  frio_manana: { name: 'Partida Fría de Mañana', code: 'COC-02', order: 2, badge: 'Cocinero de Frío (AM)' },
  frio_tarde: { name: 'Partida Fría de Tarde', code: 'COC-03', order: 3, badge: 'Cocinero de Frío (PM)' },
  caliente_manana: { name: 'Partida Caliente de Mañana', code: 'COC-04', order: 4, badge: 'Cocinero de Caliente (AM)' },
  caliente_tarde: { name: 'Partida Caliente de Tarde', code: 'COC-05', order: 5, badge: 'Cocinero de Caliente (PM)' },
  pasteleria: { name: 'Partida de Pastelería y Repostería', code: 'COC-06', order: 6, badge: 'Cocinero de Pastelería' },
  marmiton: { name: 'Partida de Plancha y Platería', code: 'COC-07', order: 7, badge: 'Cocinero de Plancha & Pase' },
  plateria: { name: 'Partida de Plancha y Platería', code: 'COC-07', order: 7, badge: 'Cocinero de Plancha & Pase' },
  // Pisos & Housekeeping
  pisos_habitaciones: { name: 'Habitaciones & Pisos', code: 'PIS-01', order: 1, badge: 'Inspección & Salidas' },
  pisos_lenceria: { name: 'Lencería & Lavandería', code: 'PIS-02', order: 2, badge: 'Stock Textil & Lavado' },
  pisos_zonas_comunes: { name: 'Zonas Comunes & Salones', code: 'PIS-03', order: 3, badge: 'Higiene & Aseos Públicos' },
  pisos_auditoria: { name: 'Auditoría Housekeeping', code: 'PIS-04', order: 4, badge: 'Control Calidad VIP' },
  // Mantenimiento Técnico & SST
  mant_climatizacion: { name: 'Climatización & ACS', code: 'MAN-01', order: 1, badge: 'Calderas & Legionella' },
  mant_piscinas: { name: 'Piscinas & Balneoterapia', code: 'MAN-02', order: 2, badge: 'Cloro, pH & Aguas' },
  mant_electricidad: { name: 'Electricidad & Cuadros', code: 'MAN-03', order: 3, badge: 'Alumbrado & Grupo' },
  mant_sst: { name: 'Partes de Avería & SST', code: 'MAN-04', order: 4, badge: 'Seguridad & Incidencias' },
  // Bares & Restauración
  bar_piscina: { name: 'Bar Piscina & Snack', code: 'BAR-01', order: 1, badge: 'Tiradores & Bebidas' },
  bar_hall: { name: 'Lobby Bar & Coctelería', code: 'BAR-02', order: 2, badge: 'Coctelería de Autor' },
  bar_salones: { name: 'Salones & Terrazas', code: 'BAR-03', order: 3, badge: 'Banquetes & Eventos' },
  // Recepción & Front Office
  recep_mostrador: { name: 'Mostrador & Check-In', code: 'REC-01', order: 1, badge: 'Front Desk & Caja' },
  recep_auditoria: { name: 'Auditoría Nocturna', code: 'REC-02', order: 2, badge: 'Night Audit & Balance' },
  recep_guest_experience: { name: 'Guest Experience & VIP', code: 'REC-03', order: 3, badge: 'Atención & Novedades' }
};

// =========================================================================
// 1. ESTRUCTURAS DE COCINA: HOTEL MITACA (RESORT 4★)
// =========================================================================
const MITACA_KITCHEN_AREAS: KitchenStationArea[] = [
  {
    id: 'area-mitaca-cafeteria',
    key: 'cafeteria',
    name: 'Cafetería',
    code: 'MIT-COC-01',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 1,
    shiftSchedule: '06:30 - 14:30 (Turno Mañana intensivo)',
    responsibilities: [
      'Puesta a punto de molinos y cafeteras industriales de alta presión.',
      'Elaboración continuada de termos de café y leche para buffet central.',
      'Exprimido mecánico de zumos naturales de naranja (volumen estimado 60L).',
      'Reposición de bollería recién horneada y panes cortados en línea de autoservicio.'
    ],
    criticalTasks: {
      apertura: [
        'Comprobar descalcificador y purgar grupos de cafeteras a 92ºC.',
        'Verificar temperatura de leche pasteurizada en vitrina bajo mostrador (< 4ºC).',
        'Cargar tolvas de café de tueste natural y verificar granulometría de molienda.',
        'Rellenar dispensadores térmicos de café para línea de desayuno antes de las 07:15.'
      ],
      servicio: [
        'Monitorear flujo de termos cada 20 minutos durante hora punta (08:30 - 10:00).',
        'Reponer fruta de temporada fresca y panes sin gluten con pinzas exclusivas.',
        'Mantener encimera de autoservicio limpia y libre de derrames.'
      ],
      cierre: [
        'Ciclo de lavado químico de grupos de café con detergente desincrustante.',
        'Desmontar y lavar con agua clorada los cabezales del exprimidor automático.',
        'Descarte o etiquetado de mermas de leche con fecha y hora de apertura.'
      ]
    },
    assignedEquipment: [
      'Cafetera industrial 3 grupos Faema',
      'Molino automático on-demand con tolva doble',
      'Exprimidor industrial Zumex Speed Pro',
      'Tostador de cinta continuo 300 piezas/hora',
      'Vitrina frigorífica bajo barra Infrico (0ºC - 4ºC)'
    ],
    allergensFocus: ['Gluten', 'Lácteos', 'Soja', 'Frutos de cáscara'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-frio-manana',
    key: 'frio_manana',
    name: 'Frío mañana',
    code: 'MIT-COC-02',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 2,
    shiftSchedule: '07:00 - 15:00',
    responsibilities: [
      'Mise en place de estación de ensaladas y crudités para el almuerzo buffet.',
      'Corte higiénico de embutidos ibéricos y quesos para desayuno tardío y brunch.',
      'Porcionado y desinfección de frutas de temporada en solución de hipoclorito alimentario.',
      'Abatimiento térmico de vinagretas y guarniciones frías con registro de lote.'
    ],
    criticalTasks: {
      apertura: [
        'Revisión de termómetros de cámaras frigoríficas de verduras y lácteos (< 4ºC).',
        'Inmersión de vegetales crudos en agua con lejía apta consumo (50 ppm, 5 min).',
        'Verificar afilado y estado de discos de la cortadora de fiambre industrial.'
      ],
      servicio: [
        'Supervisar reposición de bandejas gastronorm frías cada 30 min (máx. 8ºC en superficie).',
        'Comprobar que ninguna ensalada con huevo permanezca más de 2 horas en exposición.',
        'Etiquetado de bandejas de reserva en cámara de pase con fecha de producción.'
      ],
      cierre: [
        'Traspaso a recipientes higiénicos limpios y filmado de remanentes aptos.',
        'Desinfección integral de tablas de corte de polietileno azul/verde con peracético.',
        'Limpieza a fondo de cámara de verduras y vaciado de bandejas de condensado.'
      ]
    },
    assignedEquipment: [
      'Cortadora de fiambres profesional Berkel',
      'Mesa fría de preparación 4 puertas con vitrina de ingredientes refrigerada',
      'Centrifugadora industrial de verduras Dynamic',
      'Abatidor de temperatura 5 bandejas Irinox'
    ],
    allergensFocus: ['Mostaza', 'Huevos', 'Dióxido de azufre y sulfitos', 'Pescado'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-frio-tarde',
    key: 'frio_tarde',
    name: 'Frío tarde',
    code: 'MIT-COC-03',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 3,
    shiftSchedule: '15:00 - 23:00',
    responsibilities: [
      'Montaje de la línea de entrantes fríos de la cena buffet (400 comensales).',
      'Preparación de carpaccios, ensaladillas, hummus y tablas de ahumados.',
      'Control riguroso de rotación FIFO en cámara de producto elaborado.',
      'Recepción y verificación de verduras del pedido de tarde si procede.'
    ],
    criticalTasks: {
      apertura: [
        'Relevo con el frío de mañana y lectura del libro de novedades de estación.',
        'Comprobar existencias de salsas emulsionadas y bases de ensaladas.',
        'Encender placas eutécticas de la línea buffet de ensaladas 45 min antes del pase.'
      ],
      servicio: [
        'Control estricto de temperatura en vitrina de ensaladas (máximo 8ºC legal).',
        'Cambio sistemático de pinzas y cubiertos de servicio cada 45 minutos.',
        'Atender peticiones especiales de comensales celíacos o alérgicos.'
      ],
      cierre: [
        'Inventario rápido de mermas y pesado de producto no aprovechable.',
        'Desalojo total de vitrinas de buffet; lavado de cubetas gastronorm en marmitón.',
        'Desconexión de equipos no esenciales y revisión de puertas de cámaras herméticas.'
      ]
    },
    assignedEquipment: [
      'Línea de buffet frío con reserva inferior refrigerada',
      'Termoselladora de barquetas al vacío Sammic',
      'Balanza electrónica de precisión Gram'
    ],
    allergensFocus: ['Moluscos', 'Pescado', 'Sésamo', 'Huevos'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-caliente-manana',
    key: 'caliente_manana',
    name: 'Caliente mañana',
    code: 'MIT-COC-04',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 4,
    shiftSchedule: '07:30 - 15:30',
    responsibilities: [
      'Showcooking de desayunos: tortillas al gusto, huevos fritos, beicon y tortitas.',
      'Cocinado de platos calientes del buffet de almuerzo: arroces, pastas y guarniciones.',
      'Elaboración de fondos claros y oscuros en marmita basculante.',
      'Operación segura de freidoras y planchas de cromo duro.'
    ],
    criticalTasks: {
      apertura: [
        'Puesta en marcha del sistema de extracción de humos y campana industrial.',
        'Verificación de nivel de aceite y test de compuestos polares en freidoras (< 25%).',
        'Encendido gradual de planchas y baños maría a 85ºC para mantenimiento caliente.'
      ],
      servicio: [
        'Garantizar que todo alimento en línea de pase supere los 65ºC en el corazón del producto.',
        'Reposición ágil de bandejas de showcooking en tandas pequeñas para evitar resecamiento.',
        'Atención amable al huésped con correcta higiene de guantes y mandil ignífugo.'
      ],
      cierre: [
        'Filtrado y decantado de aceites de fritura en cubas higiénicas de acero inoxidable.',
        'Desengrasado con producto alcalino de filtros de campana y superficies calientes.',
        'Pase de relevo detallado con el cocinero de caliente tarde.'
      ]
    },
    assignedEquipment: [
      'Plancha de cromo duro de 1200 mm Repagas',
      'Horno mixto de convección Rational iCombi Pro 10 bandejas',
      'Freidora doble de alto rendimiento 2x20L Frymaster',
      'Marmita basculante de vapor 150L Fagor'
    ],
    allergensFocus: ['Gluten', 'Huevos', 'Pescado', 'Crustáceos'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-caliente-tarde',
    key: 'caliente_tarde',
    name: 'Caliente tarde',
    code: 'MIT-COC-05',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 5,
    shiftSchedule: '15:30 - 23:30',
    responsibilities: [
      'Showcooking de carnes y pescados a la plancha durante la cena buffet.',
      'Cocinado de asados de ternera, cerdo y aves con termonda de control térmico.',
      'Regeneración en horno mixto de guarniciones calientes manteniendo textura.',
      'Gestión de reposición y aviso anticipado a sala sobre platos estrella.'
    ],
    criticalTasks: {
      apertura: [
        'Lectura de previsiones de comensales y reservas para ajustar mise en place.',
        'Sellar carnes para asados y programar sonda térmica Rational a 72ºC corazón.',
        'Encendido de línea de calor radiante del buffet 30 min antes de la apertura (19:00).'
      ],
      servicio: [
        'Corte en vivo en el buffet con tabla de corte higiénica y guante anticorte.',
        'Comprobación horaria de temperatura en baño maría mediante termómetro de infrarrojos.',
        'Gestión rápida de intolerancias alimentarias comunicadas por el maitre.'
      ],
      cierre: [
        'Desinfección de planchas con hielo y espátula sin rayar el recubrimiento de cromo.',
        'Lanzar ciclo de limpieza automática del horno Rational con pastillas Care.',
        'Apagado general de válvulas de gas natural de la batería de cocina.'
      ]
    },
    assignedEquipment: [
      'Plancha de asados de doble zona independiente',
      'Lámparas de calor por infrarrojos sobre pasaplatos',
      'Salamandra eléctrica de techo móvil',
      'Termómetro digital con sonda de penetración HACCP Testo 106'
    ],
    allergensFocus: ['Gluten', 'Mostaza', 'Sulfitos', 'Apio'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-pasteleria',
    key: 'pasteleria',
    name: 'Pastelería',
    code: 'MIT-COC-06',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 6,
    shiftSchedule: '06:00 - 14:00',
    responsibilities: [
      'Horneado diario de panadería, croissants, napolitanas y panes especiales de desayuno.',
      'Producción de postres individuales de buffet (mousses, vasitos, gelatinas, flanes).',
      'Corte milimétrico de tartas caseras y reposición del buffet temático de dulces.',
      'Mantenimiento de materias primas sensibles (chocolates, frutos secos, harinas).'
    ],
    criticalTasks: {
      apertura: [
        'Precalentamiento de hornos rotativos o de pisos para panadería matutina.',
        'Descongelación reglada y fermentación de masas madre controladas en cámara.',
        'Disposición de bollería recién salida en cestas de mimbre con fundas higiénicas.'
      ],
      servicio: [
        'Producción seriada de semifríos para el almuerzo y cena del día siguiente.',
        'Decoración y glaseado de piezas con frutas frescas y brillo neutro.',
        'Control estricto de contaminación cruzada por harinas y frutos secos.'
      ],
      cierre: [
        'Barrido y fregado de obrador para evitar acumulación de polvo de harina.',
        'Guardado hermético en contenedores de plástico alimentario de coberturas y pastas.',
        'Etiquetado de masas refrigeradas con fecha de caducidad máxima (72h).'
      ]
    },
    assignedEquipment: [
      'Amasadora de espiral 25 kg Sammic',
      'Horno de pastelería con inyección de vapor Miwe',
      'Batidora planetaria de mesa KitchenAid Professional',
      'Atemperador de chocolate de mesa',
      'Cámara de fermentación controlada'
    ],
    allergensFocus: ['Gluten', 'Huevos', 'Lácteos', 'Frutos de cáscara', 'Soja'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-mitaca-marmiton',
    key: 'marmiton',
    name: 'Marmitón',
    code: 'MIT-COC-07',
    departmentId: 'dep-cocina-mitaca',
    hotelModelId: 'model-mitaca',
    order: 7,
    shiftSchedule: '08:00 - 16:00 y 16:00 - 00:00 (Rotativo continuo)',
    responsibilities: [
      'Lavado, desincrustado y desinfección térmica de perolas, cazuelas y sartenes.',
      'Lavado automático de bandejas gastronorm de acero inoxidable y policarbonato.',
      'Reposición ordenada de menaje limpio en las 6 estaciones de cocina restantes.',
      'Gestión de contenedores de residuos urbanos, orgánicos, vidrio, cartón y aceites usados.'
    ],
    criticalTasks: {
      apertura: [
        'Llenado de tinas de remojo con detergente desengrasante clorado a 55ºC.',
        'Comprobación de niveles de abrillantador y detergente químico del túnel de lavado.',
        'Revisión visual del filtro de residuos del lavautensilios industrial.'
      ],
      servicio: [
        'Retirada constante de menaje sucio del pasillo de retorno de cocina.',
        'Verificación de que el agua de aclarado del lavaperolas alcance 85ºC (desinfección térmica).',
        'Cambio de bolsas de basura en cuanto alcancen el 80% de su capacidad.'
      ],
      cierre: [
        'Vaciado completo y desincrustación con ácido sulfámico del túnel de lavado.',
        'Fregado con fregadora automática y desinfectante clorado de todos los suelos de cocina.',
        'Limpieza a presión del cuarto de basuras refrigerado y cubos municipales.'
      ]
    },
    assignedEquipment: [
      'Lavautensilios industrial de gran formato Hobart',
      'Pila de remojo doble con grifo gerontológico y manguera de alta presión',
      'Fregadora de suelos compacta Kärcher',
      'Compactador ecológico de cartón'
    ],
    allergensFocus: ['Alergias por contacto cruzado en utensilios mal higienizados'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  }
];

// =========================================================================
// 2. ESTRUCTURAS DE COCINA: HOTEL VULCANO (BOUTIQUE 5★ GASTRONÓMICO)
// =========================================================================
const VULCANO_KITCHEN_AREAS: KitchenStationArea[] = [
  {
    id: 'area-vulcano-cafeteria',
    key: 'cafeteria',
    name: 'Cafetería de Especialidad',
    code: 'VUL-COC-01',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 1,
    shiftSchedule: '07:30 - 15:30',
    responsibilities: [
      'Servicio de café de especialidad monorigen (Etiopía y Colombia) con tueste artesano.',
      'Elaboración a la minuta de desayunos a la carta: huevos benedictinos, tostadas brioche.',
      'Preparación de infusiones a granel de agricultura ecológica con control de infusión.',
      'Coordinación directa con sumiller para el servicio matinal en terraza panorámica.'
    ],
    criticalTasks: {
      apertura: [
        'Calibrado de molienda y pesado de dosis (18.5g in, 38g out en 27s a 93.5ºC).',
        'Comprobación de calidad del agua osmotizada (TDS entre 100 y 150 ppm).',
        'Mise en place de holandesa recién montada al baño maría a 58ºC.'
      ],
      servicio: [
        'Texturizado de leche fresca entera a 60ºC para latte art sin quemar azúcares.',
        'Emplatado estético con floristería orgánica y germinados de rábano.',
        'Atención a fichas individuales de alergias de huéspedes de suites.'
      ],
      cierre: [
        'Retrolavado con detergente Puly Caff de los 2 grupos de la cafetera artesanal.',
        'Purga y secado de lanzaderas de vapor con paño microfibra antimicrobiano.',
        'Sellado al vacío de tolvas de café en grano para conservar aromas volátiles.'
      ]
    },
    assignedEquipment: [
      'Cafetera espresso multicaldera La Marzocco Strada',
      'Molino de muelas planas Mythos Two con control de temperatura de cámara',
      'Salamandra de pase a gas con encendido electrónico instantáneo',
      'Batidora de inmersión Bamix Gastro'
    ],
    allergensFocus: ['Gluten', 'Huevos', 'Lácteos'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-frio-manana',
    key: 'frio_manana',
    name: 'Frío mañana (Garde Manger)',
    code: 'VUL-COC-02',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 2,
    shiftSchedule: '09:00 - 17:00',
    responsibilities: [
      'Mise en place de entrantes fríos del Menú Degustación y Carta de Temporada.',
      'Marinados en frío, tiraditos, ceviches de pescado de lonja y escabeches suaves.',
      'Gelificaciones, aires emulsionados y texturizados con agar-agar y lecitina.',
      'Selección y cuidado de hierbas aromáticas silvestres en microhuerto de cocina.'
    ],
    criticalTasks: {
      apertura: [
        'Revisión de certificados de congelación preventiva contra Anisakis (-20ºC, > 24h).',
        'Pesaje micrométrico de texturizantes en balanza de precisión de 0.01g.',
        'Comprobación del vacío en bolsas de marinados y aceites aromatizados.'
      ],
      servicio: [
        'Mantenimiento de bases frías a 2ºC en mesa de trabajo refrigerada.',
        'Emplatado con pinzas de precisión bajo supervisión directa del Jefe de Cocina.',
        'Atemperado controlado de carpaccios 3 minutos antes del pase para optimizar sabor.'
      ],
      cierre: [
        'Etiquetado con impresora térmica de cada preparación (lote, fecha, caducidad 48h).',
        'Limpieza con alcohol alimentario de balanzas y encimeras de granito.',
        'Reunión de 10 min de cambio de turno con el responsable de frío tarde.'
      ]
    },
    assignedEquipment: [
      'Balanza analítica de precisión KERN 0.01g',
      'Mesa de pase frío de acero inox 316 con cajones frigoríficos',
      'Cortadora de fiambres volante manual retro para jamón de bellota',
      'Centrifugadora de laboratorio para clarificación de jugos'
    ],
    allergensFocus: ['Pescado', 'Moluscos', 'Crustáceos', 'Sulfitos'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-frio-tarde',
    key: 'frio_tarde',
    name: 'Frío tarde (Pase Degustación)',
    code: 'VUL-COC-03',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 3,
    shiftSchedule: '16:00 - 00:00',
    responsibilities: [
      'Pase de entrantes fríos y aperitivos del Menú Degustación (máximo 60 comensales).',
      'Emplatado milimétrico en vajilla de gres artesanal a baja temperatura.',
      'Corte de ostras al momento y preparaciones de caviar imperial con cucharillas de nácar.',
      'Control del ritmo del servicio sincronizado con la partida caliente y el sommelier.'
    ],
    criticalTasks: {
      apertura: [
        'Revisión visual de vajilla fría almacenada en congelador de platos a -10ºC.',
        'Chequeo de reservas VIP, intolerancias alimentarias y protocolos personalizados.',
        'Montaje de biberones y mangas de salsas frías en lecho de hielo pilé.'
      ],
      servicio: [
        'Salida de platos en menos de 90 segundos desde la comanda del jefe de sala.',
        'Limpieza de bordes de platos con papel especial que no desprende pelusa.',
        'Descarte inmediato de cualquier elemento que no cumpla la simetría exigida.'
      ],
      cierre: [
        'Retirada de flores y hierbas delicadas a cámara protegidas con papel húmedo.',
        'Desinfección de pinzas de emplatar y cubertería de servicio en solución estéril.',
        'Informe al libro de guardia del gasto de ingredientes premium (caviar, trufa).'
      ]
    },
    assignedEquipment: [
      'Arcón congelador de vajilla artesanal Liebherr',
      'Lámpara UV germicida para cuchillos de sushi y sashimi',
      'Abridor ergonómico de ostras con sujeción de seguridad'
    ],
    allergensFocus: ['Moluscos', 'Crustáceos', 'Pescado', 'Sésamo'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-caliente-manana',
    key: 'caliente_manana',
    name: 'Caliente mañana (Producción & Fondos)',
    code: 'VUL-COC-04',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 4,
    shiftSchedule: '10:00 - 18:00',
    responsibilities: [
      'Elaboración de fondos oscuros de ternera tostada durante 18 horas de reducción lenta.',
      'Preparación de caldos clarificados (consomés de ave) mediante clarificación con claras.',
      'Envasado al vacío de porciones de cordero lechal y carnes maduradas para cocción roner.',
      'Control de temperaturas de cocción sous-vide (65ºC durante 24 horas continuas).'
    ],
    criticalTasks: {
      apertura: [
        'Inspección olfativa y refractométrica del fondo del día anterior.',
        'Calibrado de cubetas sous-vide de cocción lenta y comprobación de nivel de agua destilada.',
        'Recepción de carnes de ganadería local con ficha de trazabilidad y pH.'
      ],
      servicio: [
        'Monitoreo continuo de termopares en bolsas al vacío sous-vide con registro digital.',
        'Espumado periódico de grasas e impurezas en marmitas de cocción lenta.',
        'Filtrado por estameña fina de reducciones y glaces de vino tinto.'
      ],
      cierre: [
        'Abatimiento térmico obligatorio de fondos de 65ºC a menos de 10ºC en menos de 120 minutos.',
        'Sellado y etiquetado hermético de bolsas de fondo concentrado.',
        'Limpieza con ácido fosfórico alimentario del interior de ollas de cobre y acero inoxidable.'
      ]
    },
    assignedEquipment: [
      'Circulador de inmersión Sous-Vide Roner Clip / PolyScience',
      'Envasadora de campana con control de vacío por sensor Multivac',
      'Abatidor criogénico de temperatura rápida',
      'Termocirculador de vapor continuo'
    ],
    allergensFocus: ['Apio', 'Sulfitos', 'Gluten'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-caliente-tarde',
    key: 'caliente_tarde',
    name: 'Caliente tarde (Pase a la Carta)',
    code: 'VUL-COC-05',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 5,
    shiftSchedule: '17:00 - 01:00',
    responsibilities: [
      'Pase de principales a la minuta de pescados salvajes y carnes nobles a la brasa/sartén.',
      'Montaje de emulsiones en directo (beurre blanc, demiglace reducida a la copa).',
      'Control de puntos de cocción al corazón (pescados a 52ºC, solomillo a 54ºC).',
      'Coordinación con el Chef ejecutivo en el pase central bajo campana térmica.'
    ],
    criticalTasks: {
      apertura: [
        'Encendido del horno de brasa vegetal Josper con carbón de marabú cubano.',
        'Atemperado de carnes maduradas a 18ºC antes del contacto con la brasa.',
        'Comprobación de temperatura en pasaplatos térmico calefactado a 68ºC.'
      ],
      servicio: [
        'Termosellado inmediato de pescados salvajes en sartén de hierro colado.',
        'Uso de aguja térmica para comprobación táctil y digital del punto de carne.',
        'Armonía y silencio operativo en la cocina durante el clímax del servicio.'
      ],
      cierre: [
        'Sellado del tiro y registro de aire del Josper para ahogo controlado del carbón.',
        'Limpieza a fondo con espátula y cepillo de cerdas de latón de las parrillas calientes.',
        'Auditoría nocturna del stock de carnes y pescados para el pedido de lonja de las 06:00.'
      ]
    },
    assignedEquipment: [
      'Horno de brasa Josper HJX-45',
      'Batería de cocina de cobre estañado De Buyer',
      'Cocina de inducción de fuego continuo 4 zonas independientes',
      'Termómetro infrarrojo Fluke de alta sensibilidad'
    ],
    allergensFocus: ['Pescado', 'Lácteos', 'Sulfitos', 'Mostaza'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-pasteleria',
    key: 'pasteleria',
    name: 'Pastelería & Postres al Plato',
    code: 'VUL-COC-06',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 6,
    shiftSchedule: '08:00 - 16:00 & Apoyo nocturno',
    responsibilities: [
      'Creación de postres al plato de alta gastronomía, helados mantecados en Pacojet.',
      'Atemperado manual de chocolates de origen único Valrhona (curvas de cristalización).',
      'Elaboración de bombonería fina y petit fours para acompañar los cafés de sobremesa.',
      'Elaboración de panes de fermentación natural (hogazas de trigo sarraceno y espelta).'
    ],
    criticalTasks: {
      apertura: [
        'Comprobar temperatura y humedad del obrador de chocolate (18ºC y < 50% humedad relativa).',
        'Refresco de masa madre y amasado de panes para la cena gastronómica.',
        'Mantecado en Pacojet de vasos de helados a -22ºC para conseguir microtextura.'
      ],
      servicio: [
        'Emplatado de postres complejos en pases coordinados con sumillería dulce.',
        'Aplicación de crujientes y caramelo isomalt justo en el momento de la entrega a sala.',
        'Decoración con oro comestible y esferificaciones de frutas exóticas.'
      ],
      cierre: [
        'Limpieza aséptica de cuchillas y vasos de la máquina Pacojet con desinfectante no corrosivo.',
        'Guardado de bombones en armario climatizado para evitar blanqueamiento de manteca.',
        'Inventario de vainilla bourbon de Madagascar y chocolates de cobertura.'
      ]
    },
    assignedEquipment: [
      'Microprocesador culinario Pacojet 4',
      'Atemperadora automática de chocolate Selmi One',
      'Deshidratador digital de alimentos Excalibur',
      'Aerógrafo profesional para pintura con manteca de cacao coloreada'
    ],
    allergensFocus: ['Gluten', 'Huevos', 'Lácteos', 'Frutos de cáscara', 'Soja'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  },
  {
    id: 'area-vulcano-marmiton',
    key: 'marmiton',
    name: 'Marmitón & Plonge Especializada',
    code: 'VUL-COC-07',
    departmentId: 'dep-cocina-vulcano',
    hotelModelId: 'model-vulcano',
    order: 7,
    shiftSchedule: '11:00 - 19:00 y 19:00 - 01:30',
    responsibilities: [
      'Tratamiento y lavado cuidadoso de vajillas artesanales de autor, cobre y hierro colado.',
      'Prohibición de estropajos abrasivos en menaje antiadherente y esmaltados de diseño.',
      'Desinfección de cubos higiénicos y cámaras de conservación de producto noble.',
      'Cuidado y pulido de cubertería de plata o aleaciones especiales para servicio gastronómico.'
    ],
    criticalTasks: {
      apertura: [
        'Revisión del nivel de sales en el descalcificador volumétrico específico de la plonge.',
        'Preparación de soluciones de lavado neutras para cerámicas esmaltadas a mano.',
        'Inspección del estado de los cestos de lavado con separadores de goma antichoque.'
      ],
      servicio: [
        'Lavado inmediato de sartenes de cobre por inmersión sin someterlas a choques térmicos.',
        'Secado a mano con paños de lino 100% de la vajilla de pase para evitar marcas de agua.',
        'Suministro continuo de bandejas limpias a las partidas de caliente y frío.'
      ],
      cierre: [
        'Secado y engrasado protector con aceite vegetal neutro de las sartenes de hierro De Buyer.',
        'Desinfección general de sumideros de suelo con pastillas biológicas enzimáticas.',
        'Desconexión segura de bombas de agua a presión y cierre del cuarto de residuos.'
      ]
    },
    assignedEquipment: [
      'Lavavajillas de capota con ósmosis inversa integrada Winterhalter',
      'Pila de inmersión para menaje de cobre con grifo monomando extensible',
      'Armario secador de cubertería por aire ionizado',
      'Contenedores de residuos estancos con pedal de acero inoxidable 316'
    ],
    allergensFocus: ['Protocolo hospitalario de lavado para erradicación de trazas de alérgenos'],
    docCategories: STANDARD_DOCUMENT_CATEGORIES.map(cat => ({
      key: cat.key,
      label: cat.label,
      shortDesc: cat.shortDesc,
      documentCount: 0
    }))
  }
];

// =========================================================================
// 3. DOCUMENTOS PRECARGADOS EN LAS 6 CATEGORÍAS (DEMOSTRACIÓN REALISTA)
// =========================================================================
const DEFAULT_PRELOADED_DOCUMENTS: UploadedDocumentRecord[] = [];

// =========================================================================
// 4. MODELOS COMPLETOS PRECARGADOS: HOTEL MITACA & HOTEL VULCANO
// =========================================================================
export const DEFAULT_DEMO_HOTEL_MODELS: DemoHotelModel[] = [
  {
    id: 'model-bitacora',
    name: 'Hotel Bitácora',
    code: 'MOD-BITACORA',
    category: 'resort_4s',
    badge: 'Resort 4★ · Gran Volumen & Buffet Familiar',
    stars: 4,
    description: 'Modelo integral para Hotel Bitácora. Orientado a operativas de alta exigencia con buffet centralizado, showcooking en vivo, desayunos dinámicos y pases de cena con 7 áreas de cocina coordinadas por el chef Antonio González y el 1er jefe Giacomo Longo.',
    operationalProfile: 'Buffet de alta capacidad (400 - 650 pax), showcooking continuo, reposición térmica de bandejas gastronorm, 7 áreas de cocina y control de seguridad alimentaria APPCC riguroso.',
    configuredDepartmentsCount: 4,
    workstationsCount: 7,
    loadedDocumentsCount: 0,
    configStatus: 'plantilla_maestra',
    isTemplate: true,
    departments: [
      {
        id: 'dep-cocina-bitacora',
        companyId: 'company-generic-01',
        establishmentId: 'est-bitacora',
        name: 'Cocina & Producción Gastronómica',
        code: 'DEP-COC-BIT',
        category: 'cocina',
        status: 'activo'
      },
      {
        id: 'dep-fnb-bitacora',
        companyId: 'company-generic-01',
        establishmentId: 'est-bitacora',
        name: 'Restauración, Bares & Snack Piscina',
        code: 'DEP-BAR-BIT',
        category: 'barra',
        status: 'activo'
      },
      {
        id: 'dep-sala-bitacora',
        companyId: 'company-generic-01',
        establishmentId: 'est-bitacora',
        name: 'Sala & Montaje Buffet',
        code: 'DEP-SAL-BIT',
        category: 'sala',
        status: 'activo'
      },
      {
        id: 'dep-mant-bitacora',
        companyId: 'company-generic-01',
        establishmentId: 'est-bitacora',
        name: 'Mantenimiento & Servicios Técnicos',
        code: 'DEP-MAN-BIT',
        category: 'mantenimiento',
        status: 'activo'
      }
    ],
    kitchenAreas: MITACA_KITCHEN_AREAS.map(a => ({
      ...a,
      hotelModelId: 'model-bitacora',
      departmentId: 'dep-cocina-bitacora'
    })),
    pointsOfSale: [
      {
        id: 'pos-bit-buffet',
        establishmentId: 'est-bitacora',
        departmentId: 'dep-cocina-bitacora',
        name: 'Restaurante Buffet Principal Bitácora',
        code: 'POS-BIT-01',
        type: 'restaurante',
        schedule: '07:30 - 10:30 | 13:00 - 15:30 | 19:30 - 22:00',
        status: 'activo'
      },
      {
        id: 'pos-bit-pool',
        establishmentId: 'est-bitacora',
        departmentId: 'dep-fnb-bitacora',
        name: 'Pool Bar & Snack Solarium Bitácora',
        code: 'POS-BIT-02',
        type: 'barra',
        schedule: '10:30 - 19:00',
        status: 'activo'
      },
      {
        id: 'pos-bit-lounge',
        establishmentId: 'est-bitacora',
        departmentId: 'dep-fnb-bitacora',
        name: 'Lobby Bar Bitácora Lounge',
        code: 'POS-BIT-03',
        type: 'barra',
        schedule: '17:00 - 00:30',
        status: 'activo'
      }
    ],
    jobRoles: [
      {
        id: 'role-bit-chef-ejecutivo',
        departmentId: 'dep-cocina-bitacora',
        title: 'Chef de Bitácora · Antonio González',
        code: 'ROL-BIT-01',
        level: 'direccion',
        responsibilities: [
          'Dirección y liderazgo de los equipos de cocina de Hotel Bitácora (21 años en Spring Hoteles)',
          'Planificación de menús cíclicos de buffet y showcooking',
          'Supervisión de calidad, costes y estándares APPCC'
        ]
      },
      {
        id: 'role-bit-sous-chef',
        departmentId: 'dep-cocina-bitacora',
        title: 'Sous Chef / 2º Jefe de Cocina · Bitácora',
        code: 'ROL-BIT-02',
        level: 'jefe_departamento',
        responsibilities: [
          'Coordinación operativa diaria de las 7 áreas de cocina de Bitácora',
          'Supervisión directa de mise en place y pases de servicio',
          'Validación de checklists de apertura/cierre y controles de temperatura'
        ]
      },
      {
        id: 'role-bit-marmiton',
        departmentId: 'dep-cocina-bitacora',
        title: 'Operario Marmitón & Plonge',
        code: 'ROL-BIT-03',
        level: 'base',
        responsibilities: ['Lavado térmico industrial', 'Higienización de cámaras', 'Control de residuos']
      }
    ],
    knowledgeDocs: [],
    recipes: [],
    equipments: [
      {
        id: 'eq-bit-01',
        establishmentId: 'est-bitacora',
        pointOfSaleId: 'pos-bit-buffet',
        name: 'Cámara Frigorífica Central de Carnes (Bitácora)',
        category: 'refrigeracion',
        tempMin: 0,
        tempMax: 4,
        unit: 'ºC',
        description: 'Cámara de conservación de carnes frescas despiezadas para buffet'
      },
      {
        id: 'eq-bit-02',
        establishmentId: 'est-bitacora',
        pointOfSaleId: 'pos-bit-buffet',
        name: 'Línea Caliente Buffet Showcooking 1',
        category: 'vitrina',
        tempMin: 65,
        tempMax: 85,
        unit: 'ºC',
        description: 'Mantenimiento en caliente de platos preparados listos para consumo'
      }
    ],
    uploadedDocuments: DEFAULT_PRELOADED_DOCUMENTS.filter(d => d.hotelModelId === 'model-mitaca' || d.hotelModelId === 'model-bitacora')
  },
  {
    id: 'model-vulcano',
    name: 'Hotel Vulcano',
    code: 'MOD-VULCANO',
    category: 'boutique_5s',
    badge: 'Boutique 5★ · Gastronómico & Alta Cocina',
    stars: 5,
    description: 'Modelo diseñado para hoteles boutique y restaurantes gastronómicos de autor. Enfocado en pases a la carta de alta precisión, técnicas avanzadas de cocina (sous-vide, fermentaciones), coctelería molecular y servicio personalizado.',
    operationalProfile: 'Servicio a la carta exclusivo (máx. 80 - 100 pax), menú degustación maridado, fichas técnicas de alto detalle con escandallos milimétricos, 7 áreas de cocina especializadas.',
    configuredDepartmentsCount: 4,
    workstationsCount: 7,
    loadedDocumentsCount: 0,
    configStatus: 'plantilla_maestra',
    isTemplate: true,
    departments: [
      {
        id: 'dep-cocina-vulcano',
        companyId: 'company-generic-01',
        establishmentId: 'est-vulcano',
        name: 'Cocina de Autor & Atelier Gastronómico',
        code: 'DEP-COC-VUL',
        category: 'cocina',
        status: 'activo'
      },
      {
        id: 'dep-fnb-vulcano',
        companyId: 'company-generic-01',
        establishmentId: 'est-vulcano',
        name: 'Coctelería de Autor & Bodega de Sumillería',
        code: 'DEP-BAR-VUL',
        category: 'barra',
        status: 'activo'
      },
      {
        id: 'dep-sala-vulcano',
        companyId: 'company-generic-01',
        establishmentId: 'est-vulcano',
        name: 'Sala Gastronómica & Maitre d’Hôtel',
        code: 'DEP-SAL-VUL',
        category: 'sala',
        status: 'activo'
      },
      {
        id: 'dep-mant-vulcano',
        companyId: 'company-generic-01',
        establishmentId: 'est-vulcano',
        name: 'Mantenimiento & Control Bioclimático',
        code: 'DEP-MAN-VUL',
        category: 'mantenimiento',
        status: 'activo'
      }
    ],
    kitchenAreas: VULCANO_KITCHEN_AREAS,
    pointsOfSale: [
      {
        id: 'pos-vul-gourmet',
        establishmentId: 'est-vulcano',
        departmentId: 'dep-cocina-vulcano',
        name: 'Restaurante Gastronómico Vulcano',
        code: 'POS-VUL-01',
        type: 'restaurante',
        schedule: '13:30 - 16:00 | 20:00 - 23:30 (Sólo con reserva)',
        status: 'activo'
      },
      {
        id: 'pos-vul-cocktails',
        establishmentId: 'est-vulcano',
        departmentId: 'dep-fnb-vulcano',
        name: 'Atelier Bar & Coctelería de Autor',
        code: 'POS-VUL-02',
        type: 'barra',
        schedule: '18:00 - 02:00',
        status: 'activo'
      },
      {
        id: 'pos-vul-terrace',
        establishmentId: 'est-vulcano',
        departmentId: 'dep-fnb-vulcano',
        name: 'Sky Lounge & Champagne Terrace',
        code: 'POS-VUL-03',
        type: 'terraza',
        schedule: '12:00 - 23:00',
        status: 'activo'
      }
    ],
    jobRoles: [
      {
        id: 'role-vul-chef-ejecutivo',
        departmentId: 'dep-cocina-vulcano',
        title: 'Chef de Hotel Vulcano · Giacomo Longo',
        code: 'ROL-VUL-01',
        level: 'direccion',
        responsibilities: [
          'Dirección gastronómica y de alta cocina de Hotel Vulcano (Granadilla de Abona, Canarias, España)',
          'Diseño de menús degustación de autor y técnicas de vanguardia',
          'Supervisión de las 7 áreas de cocina, pase gastronómico y auditoría APPCC'
        ]
      },
      {
        id: 'role-vul-sous-chef',
        departmentId: 'dep-cocina-vulcano',
        title: 'Sous Chef / Jefe de Partida',
        code: 'ROL-VUL-02',
        level: 'supervisor',
        responsibilities: ['Supervisión de mise en place', 'Control de puntos de cocción', 'APPCC y trazabilidad']
      },
      {
        id: 'role-vul-pastelero',
        departmentId: 'dep-cocina-vulcano',
        title: 'Chef Pastelero & Chocolatero',
        code: 'ROL-VUL-03',
        level: 'jefe_departamento',
        responsibilities: ['Postres al plato', 'Bombonería artesanal', 'Masas madre fermentadas']
      }
    ],
    knowledgeDocs: [],
    recipes: [],
    equipments: [
      {
        id: 'eq-vul-01',
        establishmentId: 'est-vulcano',
        pointOfSaleId: 'pos-vul-gourmet',
        name: 'Baño María Sous-Vide Roner Precisión 1',
        category: 'refrigeracion',
        tempMin: 50,
        tempMax: 90,
        unit: 'ºC',
        description: 'Control térmico continuo con tolerancia +-0.1ºC'
      },
      {
        id: 'eq-vul-02',
        establishmentId: 'est-vulcano',
        pointOfSaleId: 'pos-vul-gourmet',
        name: 'Cámara Maduración de Carnes y Pescados Secos',
        category: 'refrigeracion',
        tempMin: 1,
        tempMax: 3,
        unit: 'ºC',
        description: 'Control de humedad 75% y esterilización por ozono activo'
      }
    ],
    uploadedDocuments: DEFAULT_PRELOADED_DOCUMENTS.filter(d => d.hotelModelId === 'model-vulcano')
  }
];

// =========================================================================
// 5. SERVICIO DE GESTIÓN Y PERSISTENCIA DE MODELOS
// =========================================================================
export const demoHotelModelsService = {
  // Obtener lista completa de modelos
  getModels: (): DemoHotelModel[] => {
    try {
      const stored = localStorage.getItem(STORAGE_MODELS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Actualizar roles de chefs para reflejar: Antonio González en Bitácora y Giacomo Longo en Vulcano
          const updatedWithChefs = parsed.map(m => {
            if (m.id === 'model-bitacora' || m.name === 'Hotel Bitácora') {
              return {
                ...m,
                jobRoles: DEFAULT_DEMO_HOTEL_MODELS[0].jobRoles
              };
            }
            if (m.id === 'model-vulcano' || m.name === 'Hotel Vulcano') {
              return {
                ...m,
                jobRoles: DEFAULT_DEMO_HOTEL_MODELS[1].jobRoles
              };
            }
            if (m.id === 'model-mitaca' || m.name === 'Hotel Mitaca') {
              return DEFAULT_DEMO_HOTEL_MODELS[0];
            }
            return m;
          });
          return updatedWithChefs;
        }
      }
    } catch {}

    // Semilla inicial
    try {
      localStorage.setItem(STORAGE_MODELS_KEY, JSON.stringify(DEFAULT_DEMO_HOTEL_MODELS));
    } catch {}
    return DEFAULT_DEMO_HOTEL_MODELS;
  },

  // Obtener modelo por ID
  getModelById: (id: string): DemoHotelModel | undefined => {
    const list = demoHotelModelsService.getModels();
    if (id === 'model-mitaca') {
      return list.find(m => m.id === 'model-bitacora') || list[0];
    }
    return list.find(m => m.id === id);
  },

  // Obtener ID del modelo activo actual
  getActiveModelId: (): string => {
    try {
      const id = localStorage.getItem(STORAGE_ACTIVE_MODEL_KEY);
      if (id && id !== 'model-mitaca') return id;
    } catch {}
    return 'model-bitacora';
  },

  // Cambiar modelo activo (conmutación transparente sin perder datos)
  setActiveModelId: (id: string): void => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_MODEL_KEY, id);
    } catch {}
  },

  // Actualizar configuración de un modelo (cambiar nombre, descripción, etc.)
  updateModelConfig: (modelId: string, partial: Partial<DemoHotelModel>): DemoHotelModel[] => {
    const list = demoHotelModelsService.getModels();
    const updated = list.map(m => {
      if (m.id === modelId) {
        return {
          ...m,
          ...partial,
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    });

    try {
      localStorage.setItem(STORAGE_MODELS_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Duplicar un modelo existente para crear una nueva plantilla
  duplicateModel: (sourceModelId: string, newName: string): DemoHotelModel => {
    const list = demoHotelModelsService.getModels();
    const source = list.find(m => m.id === sourceModelId) || list[0];
    const newId = `model-custom-${Date.now()}`;
    const newCode = `MOD-${newName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;

    const clonedModel: DemoHotelModel = {
      ...source,
      id: newId,
      name: newName,
      code: newCode,
      badge: `${newName} · Plantilla Personalizada`,
      description: `Plantilla derivada de ${source.name}. Configurada por el usuario.`,
      configStatus: 'en_revision',
      isTemplate: true,
      kitchenAreas: source.kitchenAreas.map(a => ({
        ...a,
        id: `area-${newId}-${a.key}`,
        hotelModelId: newId
      })),
      uploadedDocuments: source.uploadedDocuments.map(d => ({
        ...d,
        id: `doc-${newId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        hotelModelId: newId
      }))
    };

    const nextList = [...list, clonedModel];
    try {
      localStorage.setItem(STORAGE_MODELS_KEY, JSON.stringify(nextList));
    } catch {}
    return clonedModel;
  },

  // CREAR ESTABLECIMIENTO OPERATIVO A PARTIR DE UN MODELO (COPIA LIMPIA)
  // Requisito estricto: COPIA estructura, departamentos, puntos de venta, puestos y documentos seleccionados.
  // NUNCA copia registros históricos, temperaturas, firmas, incidencias reales ni datos de operadores.
  createEstablishmentFromModel: (
    modelId: string, 
    establishmentName: string, 
    address: string
  ): EstablishmentConfig => {
    const model = demoHotelModelsService.getModelById(modelId) || demoHotelModelsService.getModels()[0];
    const newEstId = `est-operativo-${Date.now()}`;
    const newEstCode = `EST-${establishmentName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}`;

    // 1. Nuevo establecimiento
    const newEstablishment: EstablishmentConfig = {
      id: newEstId,
      companyId: 'company-generic-01',
      name: establishmentName,
      code: newEstCode,
      type: 'hotel',
      address: address || 'Dirección operativa configurada',
      phone: '+34 900 000 000',
      email: `operaciones@${establishmentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      status: 'activo'
    };

    // 2. Guardar en almacenamiento de establecimientos
    const currentEsts = multiTenantStorage.getEstablishments();
    multiTenantStorage.saveEstablishments([...currentEsts, newEstablishment]);

    // 3. Copiar departamentos vinculándolos al nuevo establecimiento
    const currentDeps = multiTenantStorage.getDepartments();
    const copiedDeps: DepartmentConfig[] = model.departments.map(d => ({
      ...d,
      id: `dep-${newEstId}-${d.code.toLowerCase()}`,
      establishmentId: newEstId
    }));
    multiTenantStorage.saveDepartments([...currentDeps, ...copiedDeps]);

    // 4. Copiar puntos de venta
    const currentPos = multiTenantStorage.getPointsOfSale();
    const copiedPos: PointOfSaleConfig[] = model.pointsOfSale.map(p => ({
      ...p,
      id: `pos-${newEstId}-${p.code.toLowerCase()}`,
      establishmentId: newEstId,
      departmentId: copiedDeps[0]?.id || 'dep-fnb'
    }));
    multiTenantStorage.savePointsOfSale([...currentPos, ...copiedPos]);

    // 5. Vincular equipos APPCC base limpios (sin registros previos de temperaturas)
    const currentEquipments = multiTenantStorage.getEquipments();
    const copiedEquipments: EquipmentAppccDef[] = model.equipments.map(eq => ({
      ...eq,
      id: `eq-${newEstId}-${Math.random().toString(36).substr(2, 5)}`,
      establishmentId: newEstId,
      pointOfSaleId: copiedPos[0]?.id || eq.pointOfSaleId
    }));
    multiTenantStorage.saveEquipments([...currentEquipments, ...copiedEquipments]);

    return newEstablishment;
  },

  // =========================================================================
  // GESTIÓN DE DOCUMENTOS SUBIDOS / ASOCIADOS A ÁREAS Y CATEGORÍAS
  // =========================================================================
  getUploadedDocuments: (
    modelId?: string, 
    stationKey?: KitchenStationKey, 
    categoryKey?: DocumentCategoryKey
  ): UploadedDocumentRecord[] => {
    let all: UploadedDocumentRecord[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_UPLOADED_DOCS_KEY);
      if (stored) {
        all = JSON.parse(stored);
      } else {
        all = DEFAULT_PRELOADED_DOCUMENTS;
        localStorage.setItem(STORAGE_UPLOADED_DOCS_KEY, JSON.stringify(all));
      }
    } catch {
      all = DEFAULT_PRELOADED_DOCUMENTS;
    }

    return all.filter(doc => {
      if (modelId && doc.hotelModelId !== modelId) return false;
      if (stationKey && doc.stationKey !== stationKey) return false;
      if (categoryKey && doc.categoryKey !== categoryKey) return false;
      return true;
    });
  },

  // Añadir o actualizar un documento
  saveUploadedDocument: (doc: UploadedDocumentRecord): UploadedDocumentRecord[] => {
    let all = demoHotelModelsService.getUploadedDocuments();
    const existingIndex = all.findIndex(d => d.id === doc.id);
    let updated: UploadedDocumentRecord[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = doc;
    } else {
      updated = [doc, ...all];
    }

    try {
      localStorage.setItem(STORAGE_UPLOADED_DOCS_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Eliminar documento
  deleteUploadedDocument: (docId: string): UploadedDocumentRecord[] => {
    let all = demoHotelModelsService.getUploadedDocuments();
    const filtered = all.filter(d => d.id !== docId);
    try {
      localStorage.setItem(STORAGE_UPLOADED_DOCS_KEY, JSON.stringify(filtered));
    } catch {}
    return filtered;
  }
};
