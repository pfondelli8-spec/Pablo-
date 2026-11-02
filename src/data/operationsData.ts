import { HotelProperty, OperatingProcedure, BarSolMenuItem } from '../types/operations';

/**
 * UNIDADES OPERATIVAS / ESTABLECIMIENTOS
 * Esquema neutral para centros y puntos de venta de la empresa.
 */
export const HOTEL_PROPERTIES: HotelProperty[] = [
  {
    id: 'klayman-diamond',
    name: 'Unidad Operativa Principal (F&B / Central)',
    shortName: 'Sede Principal',
    city: 'Centro Operativo 1',
    address: 'Área Central de Operaciones F&B',
    postalCode: '38001',
    phone: '+34 900 00 00 01',
    email: 'operaciones@empresa-fnb.internal',
    website: 'https://operaciones.empresa-fnb.internal/',
    stars: 4,
    roomsCount: 0,
    type: 'Centro Operativo F&B Central',
    code: 'OP-CENTRAL-01',
    description: 'Centro principal para operaciones de coctelería de autor, gastronomía estandarizada, control de costes y formación técnica.',
    amenities: [
      'Estación de coctelería técnica de alta velocidad',
      'Línea de tiro y refrigeración controlada por APPCC',
      'Cocina de producción y mise en place estandarizada',
      'Terminales TPV integrados con arqueo digital',
      'Área de formación técnica y manuales operativos'
    ]
  },
  {
    id: 'klayman-olivina',
    name: 'Unidad Operativa 2 (Punto de Venta F&B)',
    shortName: 'Unidad Satélite 2',
    city: 'Centro Operativo 2',
    address: 'Área Satélite de Operaciones F&B',
    postalCode: '38002',
    phone: '+34 900 00 00 02',
    email: 'unidad2@empresa-fnb.internal',
    website: 'https://unidad2.empresa-fnb.internal/',
    stars: 3,
    roomsCount: 0,
    type: 'Punto de Venta F&B Satélite',
    code: 'OP-SATELITE-02',
    description: 'Punto de venta y terraza exterior enfocado a rotación rápida, combinados clásicos, cafetería y snacks.',
    amenities: [
      'Barra exterior con módulo de cócteles directos',
      'Servicio continuo de cafetería y combinados',
      'Zona de terraza con comanderos digitales'
    ]
  }
];

/**
 * CARTA DE SERVICIO Y PLATOS (INICIALMENTE VACÍA)
 */
export const BAR_SOL_MENU: BarSolMenuItem[] = [];

/**
 * PROCEDIMIENTOS OPERATIVOS ESTÁNDAR (INICIALMENTE VACÍOS)
 */
export const OPERATING_PROCEDURES: OperatingProcedure[] = [];
