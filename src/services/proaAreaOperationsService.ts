/**
 * PROA — SERVICIO DE OPERACIONES POR ÁREA (COCINA)
 * Gestiona de forma reactiva y persistente:
 * 1. Checklists de Apertura y Cierre
 * 2. Controles de Temperatura APPCC con validación min/máx y acción correctiva obligatoria
 * 3. Plan de Limpieza y Desinfección con productos autorizados y dosificación
 * 4. Control de Caducidades, etiquetado de producto abierto y caducidad secundaria
 * 5. Registro de Incidencias y averías del área
 * 6. Historial inmutable de registros para auditoría sanitaria
 */

import { KitchenStationKey } from '../types/multiTenantConfig';

export interface StationChecklistItem {
  id: string;
  label: string;
  phase: 'manana' | 'tarde' | 'noche' | 'apertura' | 'servicio' | 'cierre';
  completed: boolean;
  notes?: string;
  completedAt?: string;
  completedBy?: string;
}

export interface StationEquipmentTemp {
  id: string;
  name: string;
  category: 'refrigeracion' | 'congelacion' | 'calor' | 'lavado' | 'coccion';
  tempMin: number;
  tempMax: number;
  unit: string;
  lastReading?: number;
  lastReadingAt?: string;
  lastOperator?: string;
  status: 'conforme' | 'desviacion' | 'pendiente';
  correctiveAction?: string;
}

export interface StationCleaningTask {
  id: string;
  areaOrEquipment: string;
  frequency: 'turno' | 'diaria' | 'semanal';
  authorizedProduct: string;
  dosage: string;
  shift: 'manana' | 'tarde' | 'ambos';
  status: 'pendiente' | 'realizada';
  lastCompletedAt?: string;
  lastOperator?: string;
  notes?: string;
}

export interface OpenedProductLabel {
  id: string;
  productName: string;
  batchLot: string;
  openedAt: string;
  secondaryExpiry: string; // ISO date string
  locationOrChamber: string;
  operator: string;
  status: 'valido' | 'proximo_caducar' | 'vencido' | 'consumido';
  storageNotes?: string;
}

export interface StationIncident {
  id: string;
  hotelId: string;
  stationKey: KitchenStationKey;
  title: string;
  category: 'averia_equipo' | 'desviacion_temperatura' | 'rotura_material' | 'higiene' | 'almacen';
  severity: 'baja' | 'media' | 'alta' | 'critica';
  description: string;
  correctiveActionTaken: string;
  reportedBy: string;
  reportedAt: string;
  status: 'abierta' | 'en_proceso' | 'resuelta';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AreaAuditRecord {
  id: string;
  hotelId: string;
  stationKey: KitchenStationKey;
  stationName: string;
  type: 'checklist_apertura' | 'checklist_cierre' | 'temperatura' | 'limpieza' | 'caducidad' | 'incidencia';
  title: string;
  summary: string;
  status: 'conforme' | 'desviacion' | 'corregido' | 'advertencia';
  operator: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const STORAGE_OPS_KEY = 'proa_kitchen_station_operations_v2';
const STORAGE_HISTORY_KEY = 'proa_kitchen_station_history_v2';

// Equipos predeterminados por área de cocina
const DEFAULT_EQUIPMENTS_BY_STATION: Partial<Record<KitchenStationKey, StationEquipmentTemp[]>> = {
  cafeteria: [
    {
      id: 'eq-caf-01',
      name: 'Vitrina Frigorífica Bajo Mostrador (Leche y Zumos)',
      category: 'refrigeracion',
      tempMin: 0,
      tempMax: 4,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-caf-02',
      name: 'Cafetera Industrial Grupo 1 (Caldera Infusión)',
      category: 'calor',
      tempMin: 90,
      tempMax: 96,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-caf-03',
      name: 'Dispensador Térmico Café Filtro Buffet',
      category: 'calor',
      tempMin: 75,
      tempMax: 85,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  frio_manana: [
    {
      id: 'eq-frm-01',
      name: 'Cámara Frigorífica de Vegetales y Ensaladas',
      category: 'refrigeracion',
      tempMin: 1,
      tempMax: 4,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-frm-02',
      name: 'Mesa Fría de Preparación Ensaladas 4 Puertas',
      category: 'refrigeracion',
      tempMin: 2,
      tempMax: 6,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-frm-03',
      name: 'Abatidor de Temperatura (Ciclo Frío Rápido)',
      category: 'refrigeracion',
      tempMin: -10,
      tempMax: 3,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  frio_tarde: [
    {
      id: 'eq-frt-01',
      name: 'Vitrina Refrigerada Exposición Buffet Frío',
      category: 'refrigeracion',
      tempMin: 1,
      tempMax: 5,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-frt-02',
      name: 'Cámara de Embutidos y Quesos',
      category: 'refrigeracion',
      tempMin: 2,
      tempMax: 5,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  caliente_manana: [
    {
      id: 'eq-clm-01',
      name: 'Horno Mixto Vapor Rational 1 (Ciclo Asados)',
      category: 'coccion',
      tempMin: 140,
      tempMax: 220,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-clm-02',
      name: 'Mesa Caliente Mantenedora Pasaplatos',
      category: 'calor',
      tempMin: 65,
      tempMax: 85,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-clm-03',
      name: 'Baño María Mantenedor de Salsas y Fondos',
      category: 'calor',
      tempMin: 65,
      tempMax: 80,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  caliente_tarde: [
    {
      id: 'eq-clt-01',
      name: 'Línea de Calor Buffet Showcooking 1',
      category: 'calor',
      tempMin: 65,
      tempMax: 85,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-clt-02',
      name: 'Plancha Cromo Duro (Pase Carnes y Pescados)',
      category: 'coccion',
      tempMin: 180,
      tempMax: 260,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  pasteleria: [
    {
      id: 'eq-pas-01',
      name: 'Cámara de Fermentación Controlada de Bollería',
      category: 'refrigeracion',
      tempMin: 18,
      tempMax: 24,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-pas-02',
      name: 'Congelador de Semifríos y Mousses Obrador',
      category: 'congelacion',
      tempMin: -22,
      tempMax: -18,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-pas-03',
      name: 'Atemperador de Cobertura de Chocolate',
      category: 'calor',
      tempMin: 30,
      tempMax: 34,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  marmiton: [
    {
      id: 'eq-mar-01',
      name: 'Lavautensilios Gran Formato (Aclarado Térmico)',
      category: 'lavado',
      tempMin: 82,
      tempMax: 90,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-mar-02',
      name: 'Tina de Remojo Químico Desengrasante',
      category: 'lavado',
      tempMin: 45,
      tempMax: 60,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  pisos_habitaciones: [
    {
      id: 'eq-pis-01',
      name: 'Aspirador Industrial Filtrado HEPA (Potencia Succión)',
      category: 'lavado',
      tempMin: 80,
      tempMax: 100,
      unit: '%',
      status: 'pendiente'
    },
    {
      id: 'eq-pis-02',
      name: 'Generador de Ozono / Purificador Desinfección VIP',
      category: 'lavado',
      tempMin: 15,
      tempMax: 45,
      unit: 'min',
      status: 'pendiente'
    }
  ],
  mant_climatizacion: [
    {
      id: 'eq-man-01',
      name: 'Acumulador Central ACS (Agua Caliente Sanitaria Anti-Legionella)',
      category: 'calor',
      tempMin: 60,
      tempMax: 70,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-man-02',
      name: 'Circuito Primario Caldera / Bomba de Calor',
      category: 'calor',
      tempMin: 70,
      tempMax: 85,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-man-03',
      name: 'Red de Climatización Habitaciones (Salida Chiller Frío)',
      category: 'refrigeracion',
      tempMin: 7,
      tempMax: 12,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  mant_piscinas: [
    {
      id: 'eq-pisc-01',
      name: 'Piscina Principal Climatizada (Temperatura del Vaso)',
      category: 'calor',
      tempMin: 26,
      tempMax: 29,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-pisc-02',
      name: 'Control Químico: Cloro Libre Residual',
      category: 'lavado',
      tempMin: 1.0,
      tempMax: 2.0,
      unit: 'ppm',
      status: 'pendiente'
    },
    {
      id: 'eq-pisc-03',
      name: 'Control Químico: Potencial pH Agua de Baño',
      category: 'lavado',
      tempMin: 7.2,
      tempMax: 7.6,
      unit: 'pH',
      status: 'pendiente'
    }
  ],
  bar_piscina: [
    {
      id: 'eq-bar-01',
      name: 'Botellero Frigorífico Trasbarra Bar Piscina',
      category: 'refrigeracion',
      tempMin: 1,
      tempMax: 4,
      unit: 'ºC',
      status: 'pendiente'
    },
    {
      id: 'eq-bar-02',
      name: 'Fabricador de Hielo Macizo en Cubitos',
      category: 'refrigeracion',
      tempMin: -5,
      tempMax: 0,
      unit: 'ºC',
      status: 'pendiente'
    }
  ],
  recep_mostrador: [
    {
      id: 'eq-rec-01',
      name: 'Climatización Mostrador Front Desk y Hall Principal',
      category: 'refrigeracion',
      tempMin: 21,
      tempMax: 24,
      unit: 'ºC',
      status: 'pendiente'
    }
  ]
};

// Tareas de limpieza predeterminadas por estación
const DEFAULT_CLEANING_BY_STATION: Partial<Record<KitchenStationKey, StationCleaningTask[]>> = {
  cafeteria: [
    {
      id: 'cl-caf-01',
      areaOrEquipment: 'Purgado y retrolavado químico de grupos de cafetera',
      frequency: 'turno',
      authorizedProduct: 'Puly Caff Detergente Desincrustante',
      dosage: '1 cacito (5g) en filtro ciego por grupo',
      shift: 'ambos',
      status: 'pendiente'
    },
    {
      id: 'cl-caf-02',
      areaOrEquipment: 'Desmontaje y desinfección de cabezales exprimidor Zumex',
      frequency: 'diaria',
      authorizedProduct: 'Germisan Clorado Grado Alimentario',
      dosage: 'Solución 2% en cuba de inmersión 10 min',
      shift: 'tarde',
      status: 'pendiente'
    },
    {
      id: 'cl-caf-03',
      areaOrEquipment: 'Limpieza interior y exterior de vitrina refrigerada bajo mostrador',
      frequency: 'diaria',
      authorizedProduct: 'Detergente Neutro Desengrasante Sanitario',
      dosage: 'Pulverización directa y aclarado con papel',
      shift: 'tarde',
      status: 'pendiente'
    }
  ],
  frio_manana: [
    {
      id: 'cl-frm-01',
      areaOrEquipment: 'Desinfección de tablas de corte y cuchillería de verduras',
      frequency: 'turno',
      authorizedProduct: 'Ácido Peracético Alimentario Diluido',
      dosage: '0.5% en pulverizador, tiempo contacto 3 min',
      shift: 'manana',
      status: 'pendiente'
    },
    {
      id: 'cl-frm-02',
      areaOrEquipment: 'Desmontaje y sanitización de cortadora de fiambres Berkel',
      frequency: 'diaria',
      authorizedProduct: 'Detergente Espumante Desinfectante Sin Cloro',
      dosage: 'Pulverizar sobre disco y carro, aclarar y secar',
      shift: 'manana',
      status: 'pendiente'
    }
  ],
  frio_tarde: [
    {
      id: 'cl-frt-01',
      areaOrEquipment: 'Limpieza y desescarche de placas frías de buffet',
      frequency: 'diaria',
      authorizedProduct: 'Alcohol Isopropílico Alimentario 70%',
      dosage: 'Aplicación directa tras descongelación',
      shift: 'tarde',
      status: 'pendiente'
    }
  ],
  caliente_manana: [
    {
      id: 'cl-clm-01',
      areaOrEquipment: 'Ciclo de autolimpieza intensivo Horno Rational',
      frequency: 'diaria',
      authorizedProduct: 'Pastillas Detergentes y Pastillas Care Rational',
      dosage: '2 pastillas rojas + 1 pastilla azul en cajón',
      shift: 'tarde',
      status: 'pendiente'
    },
    {
      id: 'cl-clm-02',
      areaOrEquipment: 'Desengrase de filtros de campana extractora sobre partida caliente',
      frequency: 'semanal',
      authorizedProduct: 'Desengrasante Cáustico Alta Potencia',
      dosage: 'Inmersión 30 min en agua caliente a 65ºC',
      shift: 'tarde',
      status: 'pendiente'
    }
  ],
  caliente_tarde: [
    {
      id: 'cl-clt-01',
      areaOrEquipment: 'Desglasado y abrillantado de plancha de cromo duro',
      frequency: 'diaria',
      authorizedProduct: 'Hielo en cubos y Desincrustante Específico Cromo',
      dosage: 'Aplicar a 80ºC con espátula de teflón, sin rayar',
      shift: 'tarde',
      status: 'pendiente'
    }
  ],
  pasteleria: [
    {
      id: 'cl-pas-01',
      areaOrEquipment: 'Sanitización profunda de cubas de amasadora y batidora planetaria',
      frequency: 'diaria',
      authorizedProduct: 'Detergente Bactericida Neutro Alimentario',
      dosage: 'Solución al 3%, secado con celulosa desechable',
      shift: 'manana',
      status: 'pendiente'
    }
  ],
  marmiton: [
    {
      id: 'cl-mar-01',
      areaOrEquipment: 'Desincrustación antical y purga de resistencias del lavaperolas',
      frequency: 'semanal',
      authorizedProduct: 'Ácido Fosfórico Desincrustante Industrial',
      dosage: 'Dosis 100ml en depósito de lavado, recircular 15 min',
      shift: 'tarde',
      status: 'pendiente'
    },
    {
      id: 'cl-mar-02',
      areaOrEquipment: 'Fregado y desinfección de suelos generales de cocina con fregadora',
      frequency: 'diaria',
      authorizedProduct: 'Detergente Clorado Alcalino Antideslizante',
      dosage: '1% en depósito de fregadora industrial Kärcher',
      shift: 'tarde',
      status: 'pendiente'
    }
  ]
};

/// Checklist Operativo de Turnos: Mañana, Tarde y Noche (Spring Hotels Group)
export type GimnasiaShiftPhase = 'manana' | 'tarde' | 'noche' | 'apertura' | 'cierre';

const DEFAULT_CHECKLISTS_BY_STATION: Partial<Record<KitchenStationKey, {
  manana: string[];
  tarde: string[];
  noche: string[];
  apertura?: string[];
  cierre?: string[];
}>> = {
  cafeteria: {
    manana: [
      'Verificar encendido y manómetro de presión de cafetera industrial (1.1 - 1.2 bar).',
      'Comprobar temperatura de leche fresca en vitrina bajo mostrador (< 4ºC).',
      'Realizar purga y descalcificación preventiva de grupos de café.',
      'Cargar tolvas de molinos con café de grano natural fresco 100% arábica.',
      'Revisar existencias de leches especiales (sin lactosa, avena, soja, almendra).',
      'Exprimir primera tanda de zumo de naranja natural en jarra con tapa fechada.'
    ],
    tarde: [
      'Relevo de novedades de cafetera y reposición de grano para el servicio de cena.',
      'Limpiar y purgar lanzas de vapor de leche tras el turno de desayunos/almuerzo.',
      'Reponer tazas precalentadas, platillos y complementos en mueble cafetera.',
      'Comprobar temperatura y estanqueidad de la vitrina refrigerada de tarde (< 4ºC).',
      'Preparar jarras de infusiones frías y aguas saborizadas para el pase vespertino.'
    ],
    noche: [
      'Retrolavado químico de grupos de cafetera con detergente homologado Puly Caff.',
      'Desmontar, lavar y desinfectar cabezales y cubeta de pulpa del exprimidor Zumex.',
      'Vaciar tolvas de café molido sobrante en contenedor hermético fechado.',
      'Desechar mermas de leche abierta que superen las 24 horas reglamentarias.',
      'Limpieza y desinfección de encimeras, rejillas de goteo y bandeja de tazas.',
      'Comprobar cierre hermético y desconexión de calentadores auxiliares.'
    ]
  },
  frio_manana: {
    manana: [
      'Registrar temperatura de cámaras frigoríficas de verduras y lácteos (< 4ºC).',
      'Desinfección de ensaladas y crudités en agua con hipoclorito alimentario (50 ppm, 5 min).',
      'Comprobar afilado, limpieza y disco protector de la cortadora de fiambres.',
      'Preparar mise en place de salsas frías (vinagretas, mahonesas) con fecha y lote.',
      'Comprobar disponibilidad de pinzas exclusivas por alérgeno para buffet.'
    ],
    tarde: [
      'Lectura del libro de relevo y control de mermas del pase de mediodía.',
      'Reponer bandejas gastronorm de ensaladas compuestas y quesos con rotación FIFO.',
      'Verificar que las placas frías de buffet alcancen temperatura óptima (< 4ºC).',
      'Elaborar aderezos y vinagretas especiales para el servicio de cena.'
    ],
    noche: [
      'Retirar todos los alimentos perecederos del buffet y registrar sobrantes en mermas.',
      'Filmar y etiquetar con caducidad secundaria todas las elaboraciones en cámara.',
      'Desinfectar tablas de corte de polietileno con solución peracética alimentaria.',
      'Desconectar maquinaria auxiliar y vaciar bandejas de condensación de mesas frías.',
      'Dejar nota de relevo nocturna para el equipo de apertura matinal.'
    ]
  },
  frio_tarde: {
    manana: [
      'Revisión matinal de cámaras de apoyo y recepción de pedidos de chacinería y quesos.',
      'Comprobación de bolsas de vacío y etiquetado de fiambres en conservación.',
      'Mise en place de bases frías y marinados para los platos fríos del día.'
    ],
    tarde: [
      'Lectura del libro de novedades y relevo con cocinero de mañana.',
      'Comprobar encendido de placas frías de buffet 45 min antes de la apertura de cena.',
      'Verificar temperaturas de embutidos y ensaladas en cámara de pase (< 4ºC).',
      'Montar línea de entrantes fríos, carpaccios y canapés respetando rotación FIFO.'
    ],
    noche: [
      'Retirar todo producto perecedero del buffet y comprobar caducidades secundarias.',
      'Limpieza y desinfección de encimeras frías, vitrinas y carros de reposición.',
      'Comprobar termómetros de cámaras frigoríficas y dejar cerradas bajo llave.',
      'Apagado de iluminación y desconexión de placas de frío.'
    ]
  },
  caliente_manana: {
    manana: [
      'Precalentar hornos Rational en función mixta y convección.',
      'Comprobar temperatura de mantenimiento en línea de calor (> 65ºC).',
      'Comprobar existencias de bases calientes, fondos oscuros y caldos madre.',
      'Puesta a punto de fuegos vivos y comprobar detectores de gas.',
      'Preparar showcooking de desayuno (huevos, tortillas, bacon, tortitas).'
    ],
    tarde: [
      'Relevo técnico de cocina caliente y comprobación de guisos en marcha.',
      'Abatimiento rápido de caldos o salsas que no se consuman en el almuerzo (< 10ºC en 2h).',
      'Mise en place de pastas, arroces y guarniciones para el turno de cena.',
      'Comprobar estado del aceite de freidoras y registrar test de compuestos polares.'
    ],
    noche: [
      'Abatir en menos de 2 horas caldos y guisos a menos de 10ºC antes de refrigerar.',
      'Lanzar ciclo de autolimpieza química del horno Rational (pastillas rojas y azules).',
      'Cierre general de llaves de paso de gas e inspección de electroválvulas.',
      'Desconexión de freidoras, baños maría y mesas calientes.',
      'Limpieza y abrillantado de fuegos y canaletas de desagüe.'
    ]
  },
  caliente_tarde: {
    manana: [
      'Recepción y despiece de carnes y pescados frescos para el menú del día.',
      'Porcionado y pesado exacto según escandallo de raciones de cena.',
      'Envasado al vacío y fechado de proteínas para el servicio nocturno.'
    ],
    tarde: [
      'Revisar mise en place de carnes y pescados porcionados para showcooking de cena.',
      'Calentar plancha de cromo a 200ºC y comprobar extracción de humos.',
      'Comprobar que bandejas gastronorm de mantenimiento alcancen más de 65ºC.',
      'Puesta en marcha de lámparas térmicas del pasaplatos.'
    ],
    noche: [
      'Desglasar plancha caliente con hielo y desengrasante homologado de cromo.',
      'Filtrar y medir compuestos polares del aceite de freidoras (< 25%).',
      'Cierre de válvulas maestras de gas e inspección de campana extractora.',
      'Desinfección de cuchillos, pinzas y espátulas en solución desinfectante.'
    ]
  },
  pasteleria: {
    manana: [
      'Comprobar temperatura de cámara de fermentación de bollería.',
      'Hornear panes artesanos y bollería francesa de desayuno.',
      'Verificar descongelación reglada en cámara a 4ºC de masas madre.',
      'Montar isla de postres y repostería matinal del buffet.'
    ],
    tarde: [
      'Elaboración de tartas, mousses y cremas para el servicio de cena.',
      'Atemperado de coberturas de chocolate y decoración de copas de postre.',
      'Comprobación de etiquetado de alérgenos en cartelería de repostería.',
      'Control térmico de vitrina expositora de postres fríos (< 5ºC).'
    ],
    noche: [
      'Etiquetar masas y rellenos sobrantes con fecha y alérgenos en cámara.',
      'Barrer y fregar suelo del obrador para evitar suspensión de harina.',
      'Desconectar atemperadores de chocolate y apagar hornos de convección.',
      'Dejar masas de bollería en fermentación controlada para la mañana siguiente.'
    ]
  },
  marmiton: {
    manana: [
      'Llenar tinas de remojo con agua caliente a 55ºC y detergente desengrasante.',
      'Comprobar niveles de abrillantador y detergente de túnel de lavado.',
      'Revisar toberas y filtros de residuos del lavaperolas industrial.',
      'Clasificación y distribución de vajilla limpia en las estaciones de desayuno.'
    ],
    tarde: [
      'Lavado continuo de perolas, bandejas gastronorm y útiles del almuerzo.',
      'Reposición de cubos de basura limpios con bolsa reglamentaria en partidas.',
      'Comprobación de temperatura de aclarado del lavavajillas (> 82ºC para desinfección).',
      'Entrega de material limpio a cocina caliente y fría para el pase de cena.'
    ],
    noche: [
      'Vaciado completo, aclarado y secado de la cuba del lavaperolas.',
      'Fregado desinfectante de todos los suelos y sumideros de cocina con fregadora.',
      'Evacuar contenedores de basura cerrados al cuarto de residuos refrigerado.',
      'Desinfección química de mesados de plonge y estanterías de secado.'
    ]
  },
  pisos_habitaciones: {
    manana: [
      'Recepción del listado de salidas previstas, entradas prioritarias y clientes VIP.',
      'Carga y abastecimiento de carros de pisos con lencería limpia y amenities Spring.',
      'Apertura de ventanas para ventilación profunda y retirada de ropa usada en sacos.',
      'Limpieza bactericida de baños, sanitarios y reposición de toallas según estándar.'
    ],
    tarde: [
      'Servicio de cobertura de tarde (Turn-down service) en habitaciones VIP y Suites.',
      'Repaso de habitaciones de check-in tardío y comprobación de minibares.',
      'Retirada de vajilla de room service de los pasillos hacia office de pisos.',
      'Comunicación directa de partes de mantenimiento detectados por la gobernanta.'
    ],
    noche: [
      'Recogida y bloqueo de carros de camareras en el office cerrado con llave.',
      'Recuento y custodia de llaves maestras en el cajón de seguridad.',
      'Entrega de partes de ropa a lavandería y listado de incidencias a recepción.',
      'Repaso desinfectante de pasillos, ascensores y aseos de zonas comunes.'
    ]
  },
  mant_climatizacion: {
    manana: [
      'Comprobación de temperatura en acumulador central de ACS (> 60ºC anti-legionella).',
      'Lectura de presión manométrica en circuito de calderas (1.8 a 2.2 bar).',
      'Inspección de bombas de recirculación de agua caliente y bombas de calor.',
      'Revisión del sistema de climatización central (temperatura de impulsión de aire).'
    ],
    tarde: [
      'Inspección visual de salas de calderas y cuadros de control de ventilación.',
      'Atención y resolución de partes correctivos en habitaciones (termostatos, cisternas, luces).',
      'Monitorización de alarmas en el sistema BMS de gestión técnica centralizada.'
    ],
    noche: [
      'Verificación de apagado programado de climatización en zonas comunes vacías.',
      'Comprobación de iluminación perimetral de emergencia y vías de evacuación.',
      'Registro diario de contadores de agua, gas y electricidad del hotel.',
      'Custodia de herramientas y relevo al turno técnico de guardia nocturno.'
    ]
  },
  mant_piscinas: {
    manana: [
      'Toma de muestra y medición fotométrica de cloro libre (1.0 - 2.0 ppm).',
      'Medición de pH (7.2 - 7.6) y calibración de sondas de dosificación química.',
      'Limpieza de cestillos de skimmers y comprobación de presión en filtros de arena.',
      'Verificación de temperatura de piscina climatizada y cascadas hidroterapia.'
    ],
    tarde: [
      'Segunda medición oficial de cloro libre y pH para libro de registro de piscinas.',
      'Inspección de rejillas perimetrales y estado de escaleras y duchas exteriores.',
      'Retrolavado de filtros de arena si la presión diferencial supera 1.5 bar.'
    ],
    noche: [
      'Tercera medición de parámetros y cierre del libro diario de calidad de agua.',
      'Puesta en marcha de robot limpiafondos automático en el vaso principal.',
      'Comprobación de depósitos de hipoclorito y minorador de pH en sala de dosificación.',
      'Desconexión de juegos de agua y aseguramiento del perímetro de baño.'
    ]
  },
  bar_piscina: {
    manana: [
      'Apertura de bar piscina, encendido de cámaras de bebidas y máquinas de granizados.',
      'Comprobar temperatura de botelleros (1 - 4ºC) y nivel de hielo macizo.',
      'Preparación de mise en place de frutas frescas cortadas (limones, naranjas, menta).',
      'Purga y verificación de presión de CO2 en grifos de cerveza de barril.'
    ],
    tarde: [
      'Reposición de stock de botellas, refrescos y cervezas para horas punta.',
      'Limpieza continua de bandeja de goteo de tiradores y bayetas desinfectadas.',
      'Control de caducidades secundarias en zumos naturales y siropes.'
    ],
    noche: [
      'Desmontaje y lavado de boquillas de grifos de cerveza en agua caliente.',
      'Vaciado de cubiteras de hielo, desinfección de trasbarra y encimera inox.',
      'Cierre de persianas de seguridad y cuadre de caja del punto de venta.'
    ]
  },
  recep_mostrador: {
    manana: [
      'Relevo verbal con el auditor nocturno y lectura del libro de novedades.',
      'Comprobación del fondo de caja de recepción y cuadre de terminales TPV.',
      'Coordinación con gobernanta de salidas de habitaciones y entradas VIP.',
      'Atención personalizada del flujo matinal de check-outs y facturación.'
    ],
    tarde: [
      'Asignación definitiva de habitaciones limpias e inspeccionadas a check-ins.',
      'Entrega de llaves magnéticas, pulseras de acceso y bienvenida institucional Spring.',
      'Gestión proactiva de reservas de restaurantes temáticos y traslados.',
      'Arqueo parcial de caja y entrega de turno de tarde.'
    ],
    noche: [
      'Inicio de la auditoría nocturna (Night Audit) en el PMS hotelero.',
      'Balanceo de cobros del día, cruce con puntos de venta y cierre contable.',
      'Emisión de listados de llegadas de madrugada y huéspedes no-show.',
      'Preparación del dossier matinal de ocupación para Dirección y Cocina.'
    ]
  }
};

// Productos abiertos / elaborados iniciales para demostración
const DEFAULT_OPENED_PRODUCTS: Partial<Record<KitchenStationKey, OpenedProductLabel[]>> = {};

// Historial inicial demostrativo
const DEFAULT_INITIAL_HISTORY: AreaAuditRecord[] = [];

function getStationFallbackKey(key: KitchenStationKey): KitchenStationKey {
  if (key === 'frio') return 'frio_manana';
  if (key === 'caliente') return 'caliente_manana';
  if (key === 'manana') return 'frio_manana';
  if (key === 'tarde') return 'caliente_tarde';
  if (key === 'barmitonio' || key === 'plateria') return 'marmiton';
  if (typeof key === 'string' && key.startsWith('pisos_') && !DEFAULT_CHECKLISTS_BY_STATION[key]) return 'pisos_habitaciones';
  if (typeof key === 'string' && key.startsWith('mant_') && !DEFAULT_CHECKLISTS_BY_STATION[key]) return 'mant_climatizacion';
  if (typeof key === 'string' && key.startsWith('bar_') && !DEFAULT_CHECKLISTS_BY_STATION[key]) return 'bar_piscina';
  if (typeof key === 'string' && key.startsWith('recep_') && !DEFAULT_CHECKLISTS_BY_STATION[key]) return 'recep_mostrador';
  return key;
}

export const proaAreaOperationsService = {
  // Obtener equipos y temperaturas de un área
  getStationEquipments: (hotelId: string, stationKey: KitchenStationKey): StationEquipmentTemp[] => {
    try {
      const storageKey = `${STORAGE_OPS_KEY}_eq_${hotelId}_${stationKey}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    const direct = DEFAULT_EQUIPMENTS_BY_STATION[stationKey];
    if (direct && direct.length > 0) return direct;
    return DEFAULT_EQUIPMENTS_BY_STATION[getStationFallbackKey(stationKey)] || [];
  },

  // Guardar lectura de temperatura de un equipo con validación y acción correctiva
  saveEquipmentReading: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    equipmentId: string,
    reading: number,
    operator: string,
    correctiveAction?: string
  ): { equipment: StationEquipmentTemp; isDeviation: boolean } => {
    const list = proaAreaOperationsService.getStationEquipments(hotelId, stationKey);
    let isDeviation = false;
    let targetEquipment: StationEquipmentTemp | null = null;

    const updated = list.map(eq => {
      if (eq.id === equipmentId) {
        const outOfRange = reading < eq.tempMin || reading > eq.tempMax;
        isDeviation = outOfRange;
        const status = outOfRange ? 'desviacion' : 'conforme';
        const updatedEq: StationEquipmentTemp = {
          ...eq,
          lastReading: reading,
          lastReadingAt: new Date().toISOString(),
          lastOperator: operator,
          status,
          correctiveAction: outOfRange ? (correctiveAction || 'Medida correctiva en curso') : undefined
        };
        targetEquipment = updatedEq;
        return updatedEq;
      }
      return eq;
    });

    try {
      const storageKey = `${STORAGE_OPS_KEY}_eq_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Registrar en auditoría inmutable
    if (targetEquipment) {
      proaAreaOperationsService.addAuditRecord({
        id: `aud-temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        hotelId,
        stationKey,
        stationName,
        type: 'temperatura',
        title: `Control APPCC: ${(targetEquipment as StationEquipmentTemp).name}`,
        summary: `Lectura: ${reading} ${(targetEquipment as StationEquipmentTemp).unit} (Rango admisible: ${(targetEquipment as StationEquipmentTemp).tempMin} a ${(targetEquipment as StationEquipmentTemp).tempMax} ${(targetEquipment as StationEquipmentTemp).unit}). ${isDeviation ? `DESVIACIÓN. Acción correctiva: ${correctiveAction || 'No indicada'}` : 'Conforme.'}`,
        status: isDeviation ? 'desviacion' : 'conforme',
        operator,
        timestamp: new Date().toISOString(),
        metadata: { equipmentId, reading, tempMin: (targetEquipment as StationEquipmentTemp).tempMin, tempMax: (targetEquipment as StationEquipmentTemp).tempMax, correctiveAction }
      });
    }

    return { equipment: targetEquipment || list[0], isDeviation };
  },

  // Obtener tareas de limpieza de un área
  getStationCleaningTasks: (hotelId: string, stationKey: KitchenStationKey): StationCleaningTask[] => {
    try {
      const storageKey = `${STORAGE_OPS_KEY}_clean_${hotelId}_${stationKey}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    const direct = DEFAULT_CLEANING_BY_STATION[stationKey];
    if (direct && direct.length > 0) return direct;
    return DEFAULT_CLEANING_BY_STATION[getStationFallbackKey(stationKey)] || [];
  },

  // Registrar ejecución de tarea de limpieza
  recordCleaningExecution: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    taskId: string,
    operator: string,
    notes?: string
  ): StationCleaningTask[] => {
    const list = proaAreaOperationsService.getStationCleaningTasks(hotelId, stationKey);
    let completedTask: StationCleaningTask | null = null;

    const updated = list.map(t => {
      if (t.id === taskId) {
        const u: StationCleaningTask = {
          ...t,
          status: 'realizada',
          lastCompletedAt: new Date().toISOString(),
          lastOperator: operator,
          notes
        };
        completedTask = u;
        return u;
      }
      return t;
    });

    try {
      const storageKey = `${STORAGE_OPS_KEY}_clean_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    if (completedTask) {
      proaAreaOperationsService.addAuditRecord({
        id: `aud-cl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        hotelId,
        stationKey,
        stationName,
        type: 'limpieza',
        title: `Limpieza Realizada: ${(completedTask as StationCleaningTask).areaOrEquipment}`,
        summary: `Producto: ${(completedTask as StationCleaningTask).authorizedProduct} · Dosis: ${(completedTask as StationCleaningTask).dosage}. Frecuencia: ${(completedTask as StationCleaningTask).frequency}.`,
        status: 'conforme',
        operator,
        timestamp: new Date().toISOString()
      });
    }

    return updated;
  },

  // Obtener checklists de la estación (Mañana, Tarde, Noche)
  getStationChecklistItems: (
    hotelId: string,
    stationKey: KitchenStationKey,
    phase: GimnasiaShiftPhase = 'manana'
  ): StationChecklistItem[] => {
    // Normalizar fase: 'apertura' -> 'manana', 'cierre' -> 'noche'
    const normalizedPhase: 'manana' | 'tarde' | 'noche' =
      phase === 'apertura' ? 'manana' : phase === 'cierre' ? 'noche' : phase;

    try {
      const storageKey = `${STORAGE_OPS_KEY}_chk_${hotelId}_${stationKey}_${normalizedPhase}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: StationChecklistItem[] = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          label: item.label.replace(/^Gimnasia\s+(Mañana|Tarde|Noche):\s*/i, '')
        }));
      }
    } catch {}

    const direct = DEFAULT_CHECKLISTS_BY_STATION[stationKey]?.[normalizedPhase];
    const defaults = direct && direct.length > 0
      ? direct
      : DEFAULT_CHECKLISTS_BY_STATION[getStationFallbackKey(stationKey)]?.[normalizedPhase] || [];
    return defaults.map((label, idx) => ({
      id: `chk-${stationKey}-${normalizedPhase}-${idx + 1}`,
      label,
      phase: normalizedPhase,
      completed: false
    }));
  },

  // Guardar estado de ítems de checklist
  updateChecklistItems: (
    hotelId: string,
    stationKey: KitchenStationKey,
    phase: GimnasiaShiftPhase,
    items: StationChecklistItem[]
  ): void => {
    const normalizedPhase: 'manana' | 'tarde' | 'noche' =
      phase === 'apertura' ? 'manana' : phase === 'cierre' ? 'noche' : phase;
    try {
      const storageKey = `${STORAGE_OPS_KEY}_chk_${hotelId}_${stationKey}_${normalizedPhase}`;
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  },

  // Completar y firmar checklist operativo de turno (Mañana, Tarde, Noche)
  submitStationChecklist: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    phase: GimnasiaShiftPhase,
    items: StationChecklistItem[],
    operator: string,
    generalNotes?: string
  ): void => {
    const normalizedPhase: 'manana' | 'tarde' | 'noche' =
      phase === 'apertura' ? 'manana' : phase === 'cierre' ? 'noche' : phase;
    const completedCount = items.filter(i => i.completed).length;
    const totalCount = items.length;
    const allDone = completedCount === totalCount;

    proaAreaOperationsService.updateChecklistItems(hotelId, stationKey, normalizedPhase, items);

    const phaseLabel = normalizedPhase === 'manana' ? 'Turno Mañana' : normalizedPhase === 'tarde' ? 'Turno Tarde' : 'Turno Noche';

    // Registro inmutable en auditoría
    proaAreaOperationsService.addAuditRecord({
      id: `aud-chk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hotelId,
      stationKey,
      stationName,
      type: normalizedPhase === 'manana' ? 'checklist_apertura' : 'checklist_cierre',
      title: `Checklist Operativo (${phaseLabel}) Firmado`,
      summary: `${completedCount} de ${totalCount} tareas de checklist completadas en ${stationName}. ${generalNotes ? `Observaciones: ${generalNotes}` : 'Sin incidencias reportadas.'}`,
      status: allDone ? 'conforme' : 'advertencia',
      operator,
      timestamp: new Date().toISOString(),
      metadata: { itemsCompleted: completedCount, totalCount, phase: normalizedPhase, generalNotes }
    });
  },

  // Obtener productos abiertos y caducidades
  getOpenedProducts: (hotelId: string, stationKey: KitchenStationKey): OpenedProductLabel[] => {
    try {
      const storageKey = `${STORAGE_OPS_KEY}_prods_${hotelId}_${stationKey}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    const direct = DEFAULT_OPENED_PRODUCTS[stationKey];
    if (direct && direct.length > 0) return direct;
    return DEFAULT_OPENED_PRODUCTS[getStationFallbackKey(stationKey)] || [];
  },

  // Añadir nuevo producto abierto / etiquetado secundario
  addOpenedProduct: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    product: Omit<OpenedProductLabel, 'id' | 'status'>
  ): OpenedProductLabel => {
    const list = proaAreaOperationsService.getOpenedProducts(hotelId, stationKey);
    const newRecord: OpenedProductLabel = {
      ...product,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'valido'
    };

    const updated = [newRecord, ...list];
    try {
      const storageKey = `${STORAGE_OPS_KEY}_prods_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    // Registrar en auditoría
    proaAreaOperationsService.addAuditRecord({
      id: `aud-prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hotelId,
      stationKey,
      stationName,
      type: 'caducidad',
      title: `Nuevo Producto Etiquetado: ${product.productName}`,
      summary: `Lote: ${product.batchLot} · Ubicación: ${product.locationOrChamber}. Caducidad secundaria: ${new Date(product.secondaryExpiry).toLocaleString()}.`,
      status: 'conforme',
      operator: product.operator,
      timestamp: new Date().toISOString()
    });

    return newRecord;
  },

  // Marcar producto como consumido o retirado
  markProductConsumed: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    productId: string,
    operator: string,
    reason: 'consumido' | 'retirado_por_caducidad'
  ): OpenedProductLabel[] => {
    const list = proaAreaOperationsService.getOpenedProducts(hotelId, stationKey);
    let target: OpenedProductLabel | null = null;

    const updated = list.filter(p => {
      if (p.id === productId) {
        target = p;
        return false; // Retirar de la lista de activos
      }
      return true;
    });

    try {
      const storageKey = `${STORAGE_OPS_KEY}_prods_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    if (target) {
      proaAreaOperationsService.addAuditRecord({
        id: `aud-prod-out-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        hotelId,
        stationKey,
        stationName,
        type: 'caducidad',
        title: `Baja de Producto: ${(target as OpenedProductLabel).productName}`,
        summary: `Motivo: ${reason === 'consumido' ? 'Consumo íntegro en servicio' : 'Retirado por vencimiento / merma'}. Lote: ${(target as OpenedProductLabel).batchLot}.`,
        status: reason === 'consumido' ? 'conforme' : 'advertencia',
        operator,
        timestamp: new Date().toISOString()
      });
    }

    return updated;
  },

  // Obtener incidencias del área
  getStationIncidents: (hotelId: string, stationKey: KitchenStationKey): StationIncident[] => {
    try {
      const storageKey = `${STORAGE_OPS_KEY}_inc_${hotelId}_${stationKey}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  },

  // Reportar incidencia
  reportStationIncident: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    incident: Omit<StationIncident, 'id' | 'reportedAt' | 'status'>
  ): StationIncident => {
    const list = proaAreaOperationsService.getStationIncidents(hotelId, stationKey);
    const newInc: StationIncident = {
      ...incident,
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      reportedAt: new Date().toISOString(),
      status: 'abierta'
    };

    const updated = [newInc, ...list];
    try {
      const storageKey = `${STORAGE_OPS_KEY}_inc_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    proaAreaOperationsService.addAuditRecord({
      id: `aud-inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      hotelId,
      stationKey,
      stationName,
      type: 'incidencia',
      title: `Incidencia Registrada: ${incident.title}`,
      summary: `Severidad: ${incident.severity.toUpperCase()} · ${incident.description}. Acción inmediata tomada: ${incident.correctiveActionTaken}`,
      status: incident.severity === 'critica' || incident.severity === 'alta' ? 'desviacion' : 'advertencia',
      operator: incident.reportedBy,
      timestamp: new Date().toISOString()
    });

    return newInc;
  },

  // Resolver incidencia
  resolveStationIncident: (
    hotelId: string,
    stationKey: KitchenStationKey,
    stationName: string,
    incidentId: string,
    resolvedBy: string,
    resolutionNotes: string
  ): StationIncident[] => {
    const list = proaAreaOperationsService.getStationIncidents(hotelId, stationKey);
    let resolvedItem: StationIncident | null = null;

    const updated = list.map(inc => {
      if (inc.id === incidentId) {
        const r: StationIncident = {
          ...inc,
          status: 'resuelta',
          resolvedAt: new Date().toISOString(),
          resolvedBy
        };
        resolvedItem = r;
        return r;
      }
      return inc;
    });

    try {
      const storageKey = `${STORAGE_OPS_KEY}_inc_${hotelId}_${stationKey}`;
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    if (resolvedItem) {
      proaAreaOperationsService.addAuditRecord({
        id: `aud-inc-res-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        hotelId,
        stationKey,
        stationName,
        type: 'incidencia',
        title: `Incidencia Resuelta: ${(resolvedItem as StationIncident).title}`,
        summary: `Resuelta por ${resolvedBy}. Resolución: ${resolutionNotes}`,
        status: 'corregido',
        operator: resolvedBy,
        timestamp: new Date().toISOString()
      });
    }

    return updated;
  },

  // AUDITORÍA INMUTABLE: Obtener registros históricos
  getAuditHistory: (hotelId: string, stationKey?: KitchenStationKey): AreaAuditRecord[] => {
    try {
      const saved = localStorage.getItem(`${STORAGE_HISTORY_KEY}_${hotelId}`);
      if (saved) {
        const records: AreaAuditRecord[] = JSON.parse(saved);
        if (stationKey) {
          return records.filter(r => r.stationKey === stationKey);
        }
        return records;
      }
    } catch {}

    const seed = DEFAULT_INITIAL_HISTORY.filter(h => h.hotelId === hotelId || hotelId === 'model-bitacora');
    if (stationKey) {
      return seed.filter(r => r.stationKey === stationKey);
    }
    return seed;
  },

  // Añadir registro a auditoría inmutable
  addAuditRecord: (record: AreaAuditRecord): void => {
    try {
      const storageKey = `${STORAGE_HISTORY_KEY}_${record.hotelId}`;
      const saved = localStorage.getItem(storageKey);
      const list: AreaAuditRecord[] = saved ? JSON.parse(saved) : DEFAULT_INITIAL_HISTORY;
      const updated = [record, ...list];
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  }
};
