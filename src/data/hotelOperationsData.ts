import { 
  MandatoryRequirementDefinition, 
  HotelEmployee, 
  CashRegisterClosing 
} from '../types/hotelPortal';

// Definición de requisitos legales y operativos obligatorios (Marco legal y estándar de cumplimiento)
export const MANDATORY_REQUIREMENTS: MandatoryRequirementDefinition[] = [
  {
    id: 'req-manipulador',
    code: 'SAN-01',
    name: 'Carnet de Manipulador de Alimentos',
    category: 'sanidad',
    description: 'Acreditación oficial obligatoria para manipulación y servicio de alimentos y bebidas en hostelería.',
    isMandatory: true,
    defaultValidityMonths: 48
  },
  {
    id: 'req-alergenos',
    code: 'SAN-02',
    name: 'Gestión de Alérgenos & APPCC (Reglamento UE 1169/2011)',
    category: 'higiene',
    description: 'Protocolos de no contaminación cruzada y declaración obligatoria de los 14 alérgenos al cliente.',
    isMandatory: true,
    defaultValidityMonths: 36
  },
  {
    id: 'req-prl',
    code: 'PRL-01',
    name: 'Prevención de Riesgos Laborales (PRL en Hostelería)',
    category: 'prl',
    description: 'Formación en riesgos específicos de barra y sala (cortes, quemaduras, caídas, sobreesfuerzos y químicos).',
    isMandatory: true,
    defaultValidityMonths: 24
  },
  {
    id: 'req-emergencias',
    code: 'PRL-02',
    name: 'Primeros Auxilios & Evacuación',
    category: 'prl',
    description: 'Protocolo de actuación ante emergencias en barra/sala y plan de evacuación.',
    isMandatory: false,
    defaultValidityMonths: 36
  }
];

// Plantilla operativa inicial: VACÍA para que su empresa añada sus propios empleados
export const INITIAL_DIAMOND_EMPLOYEES: HotelEmployee[] = [];

// Imagen SVG de ticket genérico de respaldo
export const SAMPLE_TICKET_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="%23ffffff"><rect width="300" height="400" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><text x="150" y="40" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="%230f172a">CIERRE DIARIO Z</text><text x="150" y="60" font-family="monospace" font-size="10" text-anchor="middle" fill="%2364748b">INFORME FISCAL TPV</text><line x1="20" y1="75" x2="280" y2="75" stroke="%2394a3b8" stroke-dasharray="4"/><text x="30" y="100" font-family="monospace" font-size="11" fill="%23334155">TOTAL VENTAS BRUTO:</text><text x="270" y="100" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end" fill="%230f172a">0.00 EUR</text><text x="30" y="125" font-family="monospace" font-size="11" fill="%23334155">TOTAL EFECTIVO:</text><text x="270" y="125" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end" fill="%230f172a">0.00 EUR</text><text x="30" y="150" font-family="monospace" font-size="11" fill="%23334155">TOTAL TARJETA / TPV:</text><text x="270" y="150" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end" fill="%230f172a">0.00 EUR</text><line x1="20" y1="175" x2="280" y2="175" stroke="%2394a3b8" stroke-dasharray="4"/><text x="150" y="210" font-family="monospace" font-size="11" text-anchor="middle" fill="%2316a34a">CUADRE CONCILIADO</text></svg>`;

// Histórico de Cierres de Caja Z: VACÍA para que su empresa registre sus propios cierres de caja
export const INITIAL_CASH_CLOSINGS: CashRegisterClosing[] = [];
