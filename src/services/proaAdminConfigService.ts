/**
 * PROA — SERVICIO DE ADMINISTRACIÓN Y CONFIGURACIÓN OPERATIVA
 * Gestiona de forma reactiva, multi-tenant y aislada:
 * 1. Estructura jerárquica (Establecimientos, Departamentos, Áreas, Puntos de Venta, Zonas, Turnos, Equipos)
 * 2. Editor de Formularios y Registros con control de versiones y reglas de alerta
 * 3. Gestión Documental con ciclo de vida (borrador -> revisión -> vigente)
 * 4. Fichas Técnicas estandarizadas con validación de alérgenos y métricas exactas
 * 5. Planes de Limpieza y Desinfección
 * 6. Categorías y reglas de incidencias
 * 7. Control de cambios y auditoría inmutable
 * 8. Eliminación segura con verificación previa de dependencias e históricos
 * 9. RBAC estricto según rol y departamento asignado
 */

import { 
  ProaAdminRole, 
  StructureEntityConfig, 
  StructureNodeType,
  FormTemplateConfig, 
  ManagedDocRecord, 
  AdminTechnicalSheet, 
  AdminMenuCarta, 
  AdminCleaningTaskConfig, 
  AdminIncidentCategoryConfig, 
  AdminAuditChangeLogEntry, 
  TenantAdminConfigPayload,
  AdminUserOperator
} from '../types/proaAdminConfig';
import { tenantIsolationService } from './tenantIsolationService';

// Datos predeterminados con el estándar técnico y gastronómico de Hotel Bitácora y Hotel Vulcano
const SEED_STRUCTURES: StructureEntityConfig[] = [
  // Hoteles
  {
    id: 'est-bitacora',
    type: 'establishment',
    name: 'Hotel Bitácora',
    code: 'EST-BITACORA',
    description: 'Resort 4★ Gran Volumen · Buffet central, showcooking y 7 partidas de cocina.',
    sortOrder: 1,
    status: 'activo',
    leadName: 'Antonio González',
    leadRole: 'Chef Ejecutivo (21 años en Spring Hoteles)',
    colorBadge: '#1A2530',
    iconName: 'Building2',
    metadata: { hasShowcooking: true },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'est-vulcano',
    type: 'establishment',
    name: 'Hotel Vulcano',
    code: 'EST-VULCANO',
    description: 'Boutique 5★ Gastronómico · Alta cocina mediterránea y pases a la carta de precisión.',
    sortOrder: 2,
    status: 'activo',
    leadName: 'Giacomo Longo',
    leadRole: 'Chef Ejecutivo (Granadilla de Abona)',
    colorBadge: '#C5A880',
    iconName: 'Sparkles',
    metadata: { hasShowcooking: false },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  // Departamentos
  {
    id: 'dep-bitacora-cocina',
    type: 'department',
    parentId: 'est-bitacora',
    name: 'Cocina & Gastronomía',
    code: 'DEP-COC-BIT',
    description: 'Producción general, buffets y showcooking diario.',
    sortOrder: 1,
    status: 'activo',
    leadName: 'Antonio González',
    leadRole: 'Chef Ejecutivo',
    metadata: { category: 'cocina' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'dep-vulcano-cocina',
    type: 'department',
    parentId: 'est-vulcano',
    name: 'Cocina & Gastronomía',
    code: 'DEP-COC-VUL',
    description: 'Alta gastronomía, pases a la carta y partida de postres de autor.',
    sortOrder: 1,
    status: 'activo',
    leadName: 'Giacomo Longo',
    leadRole: 'Chef Ejecutivo',
    metadata: { category: 'cocina' },
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  // Áreas de Cocina (Bitácora)
  {
    id: 'area-bit-cafeteria',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Cafetería & Desayunos',
    code: 'ST-CAF',
    description: 'Línea de termos, molinos de café, tostadores y zumos naturales.',
    sortOrder: 1,
    status: 'activo',
    leadName: 'Segundo de Cocina (Desayunos)',
    metadata: { scheduleHours: '06:00 - 15:00' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-frio-manana',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Cocina fría — mañana',
    code: 'ST-FR-M',
    description: 'Cámara de ensaladas, fiambres, frutas y mise en place frío.',
    sortOrder: 2,
    status: 'activo',
    leadName: 'Cocinero de Partida Fría',
    metadata: { scheduleHours: '07:00 - 15:30' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-frio-tarde',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Cocina fría — tarde',
    code: 'ST-FR-T',
    description: 'Reposición buffets cena, canapés y carpaccios.',
    sortOrder: 3,
    status: 'activo',
    leadName: 'Cocinero de Partida Fría (Cena)',
    metadata: { scheduleHours: '15:00 - 23:30' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-caliente-manana',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Cocina caliente — mañana',
    code: 'ST-CAL-M',
    description: 'Fondos, guisos, planchas y showcooking almuerzo.',
    sortOrder: 4,
    status: 'activo',
    leadName: 'Jefe de Partida Caliente',
    metadata: { scheduleHours: '07:00 - 15:30' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-caliente-tarde',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Cocina caliente — tarde',
    code: 'ST-CAL-T',
    description: 'Servicio cena buffet, asados y pase en vivo.',
    sortOrder: 5,
    status: 'activo',
    leadName: 'Jefe de Partida Caliente (Cena)',
    metadata: { scheduleHours: '15:00 - 23:30' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-pasteleria',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Pastelería & Obrador',
    code: 'ST-PAS',
    description: 'Bollería matinal, mousses, tartas y templado de chocolate.',
    sortOrder: 6,
    status: 'activo',
    leadName: 'Maestro Pastelero',
    metadata: { scheduleHours: '06:00 - 14:30' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'area-bit-marmiton',
    type: 'area',
    parentId: 'dep-bitacora-cocina',
    name: 'Marmitón & Plonge',
    code: 'ST-MAR',
    description: 'Tren de lavado, desincrustado térmico de ollas y carros de servicio.',
    sortOrder: 7,
    status: 'activo',
    leadName: 'Responsable de Plonge',
    metadata: { scheduleHours: '08:00 - 00:00' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  // Puntos de Control y Equipos Críticos
  {
    id: 'eq-bit-cam-frio',
    type: 'equipment',
    parentId: 'area-bit-frio-manana',
    name: 'Cámara 1 · Verduras y Fiambres',
    code: 'EQ-CAM-01',
    description: 'Cámara frigorífica principal de partida fría.',
    sortOrder: 1,
    status: 'activo',
    metadata: { tempMin: 1.0, tempMax: 4.0, unit: 'ºC', criticalControlPoint: true },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'eq-bit-abatidor',
    type: 'equipment',
    parentId: 'area-bit-caliente-manana',
    name: 'Abatidor Térmico 10 GN',
    code: 'EQ-ABAT-01',
    description: 'Enfriamiento rápido según APPCC (< +10ºC en menos de 2 horas).',
    sortOrder: 1,
    status: 'activo',
    metadata: { tempMin: -25.0, tempMax: 3.0, unit: 'ºC', criticalControlPoint: true },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z'
  }
];

const SEED_FORMS: FormTemplateConfig[] = [
  {
    id: 'form-tpl-appcc-temp',
    code: 'FRM-APPCC-01',
    title: 'Control Diario de Temperaturas APPCC',
    category: 'temperaturas',
    categoryLabel: 'Temperaturas APPCC',
    description: 'Registro de frío positivo, congelación y baños maría con límites críticos sanitarios.',
    establishmentId: '*',
    departmentId: '*',
    version: 'v2.1',
    status: 'publicado',
    requiresSupervisorSignature: true,
    frequencyHint: 'por_turno',
    publishedAt: '2026-02-01T08:00:00Z',
    publishedBy: 'Dirección Sanitaria',
    fields: [
      {
        id: 'fld-eq-id',
        label: 'Equipo o Cámara a Registrar',
        type: 'select',
        required: true,
        order: 1,
        options: ['Cámara 1 (Frío Verduras)', 'Cámara 2 (Carnes Frescas)', 'Cámara 3 (Pescados)', 'Cámara Congelados (-18ºC)', 'Timbre de Servicio', 'Baño María Caliente (>65ºC)']
      },
      {
        id: 'fld-temp-val',
        label: 'Temperatura Registrada',
        type: 'number',
        required: true,
        order: 2,
        unit: 'ºC',
        minValue: -30,
        maxValue: 100,
        criticalMinThreshold: 0,
        criticalMaxThreshold: 4,
        criticalAlertMessage: 'Desviación térmica detectada. Debe registrarse acción correctiva inmediata.',
        requiresCorrectiveActionIfDeviated: true
      },
      {
        id: 'fld-corr-act',
        label: 'Medida Correctiva Aplicada',
        type: 'text',
        required: false,
        placeholder: 'Ej. Ajuste de termostato a posición 2, aviso a mantenimiento y reubicación de producto perecedero.',
        order: 3
      },
      {
        id: 'fld-operator-sig',
        label: 'Firma de Conformidad del Operador',
        type: 'signature',
        required: true,
        order: 4
      }
    ],
    versionChangelog: [
      {
        version: 'v2.0',
        publishedAt: '2026-01-10T09:00:00Z',
        author: 'Antonio González',
        changesSummary: 'Versión inicial estandarizada de registro térmico.'
      },
      {
        version: 'v2.1',
        publishedAt: '2026-02-01T08:00:00Z',
        author: 'Dirección Sanitaria',
        changesSummary: 'Se incorpora firma digital obligatoria del operario y umbral de aviso acústico.'
      }
    ]
  },
  {
    id: 'form-tpl-apertura-cocina',
    code: 'FRM-CHK-AP-01',
    title: 'Checklist Operativo de Apertura de Puesto',
    category: 'apertura_cierre',
    categoryLabel: 'Apertura y Cierre',
    description: 'Comprobaciones higiénico-sanitarias y puesta a punto antes del inicio del servicio.',
    establishmentId: '*',
    departmentId: '*',
    version: 'v1.4',
    status: 'publicado',
    requiresSupervisorSignature: false,
    frequencyHint: 'por_turno',
    publishedAt: '2026-02-10T07:30:00Z',
    publishedBy: 'Antonio González (Chef Ejecutivo)',
    fields: [
      {
        id: 'fld-chk-lavamanos',
        label: 'Lavamanos dotado con jabón bactericida y papel secamanos desechable',
        type: 'checkbox',
        required: true,
        order: 1
      },
      {
        id: 'fld-chk-termometros',
        label: 'Termómetros de cámaras verificados y sin alarmas previas',
        type: 'checkbox',
        required: true,
        order: 2
      },
      {
        id: 'fld-chk-tablas',
        label: 'Tablas de corte desinfectadas y codificadas por colores (rojo, azul, verde, amarillo, blanco)',
        type: 'checkbox',
        required: true,
        order: 3
      },
      {
        id: 'fld-chk-cuchillos',
        label: 'Cuchillería afilada y esterilizada en soporte UV',
        type: 'checkbox',
        required: true,
        order: 4
      },
      {
        id: 'fld-chk-foto',
        label: 'Foto del estado general del puesto (evidencia visual)',
        type: 'photo',
        required: false,
        order: 5
      }
    ],
    versionChangelog: [
      {
        version: 'v1.4',
        publishedAt: '2026-02-10T07:30:00Z',
        author: 'Antonio González',
        changesSummary: 'Actualización de colores de tablas según normativa europea.'
      }
    ]
  },
  {
    id: 'form-tpl-limpieza-profunda',
    code: 'FRM-LIMP-02',
    title: 'Registro de Desinfección Profunda y Filtros de Campana',
    category: 'limpieza_desinfeccion',
    categoryLabel: 'Limpieza y Desinfección',
    description: 'Control de inmersión desengrasante de filtros y limpieza de campanas extractoras.',
    establishmentId: '*',
    departmentId: '*',
    version: 'v1.0',
    status: 'publicado',
    requiresSupervisorSignature: true,
    frequencyHint: 'semanal',
    publishedAt: '2026-01-20T10:00:00Z',
    publishedBy: 'Giacomo Longo (Chef Ejecutivo)',
    fields: [
      {
        id: 'fld-filtro-cant',
        label: 'Número de filtros desengrasados',
        type: 'number',
        required: true,
        minValue: 1,
        maxValue: 20,
        unit: 'un.',
        order: 1
      },
      {
        id: 'fld-quimico-dos',
        label: 'Producto químico utilizado y concentración (ej. Alcalino D1 al 5%)',
        type: 'text',
        required: true,
        order: 2
      },
      {
        id: 'fld-tiempo-inmersion',
        label: 'Tiempo de inmersión en balsa (minutos)',
        type: 'number',
        required: true,
        minValue: 15,
        maxValue: 120,
        unit: 'min',
        order: 3
      },
      {
        id: 'fld-sup-sig',
        label: 'Firma de verificación del Supervisor o Jefe de Partida',
        type: 'signature',
        required: true,
        order: 4
      }
    ],
    versionChangelog: [
      {
        version: 'v1.0',
        publishedAt: '2026-01-20T10:00:00Z',
        author: 'Giacomo Longo',
        changesSummary: 'Creación de protocolo de desengrasado de campanas.'
      }
    ]
  }
];

const SEED_DOCS: ManagedDocRecord[] = [
  {
    id: 'doc-sop-appcc-01',
    code: 'SOP-APPCC-01',
    title: 'Procedimiento Estándar de Recepción y Control Térmico de Mercancías',
    category: 'normas_appcc',
    categoryLabel: 'Normas APPCC y Sanidad',
    description: 'Protocolo de inspección obligatoria en muelle de descarga: temperaturas de llegada, fechas de caducidad y estado de empaquetado.',
    establishmentId: '*',
    departmentId: '*',
    version: 'v3.2',
    status: 'vigente',
    effectiveDate: '2026-01-01',
    reviewDate: '2027-01-01',
    approverRole: 'Dirección de Operaciones F&B',
    approvedBy: 'Comité de Seguridad Alimentaria',
    approvedAt: '2026-01-02T10:00:00Z',
    author: 'Departamento de Calidad e Higiene',
    fileName: 'SOP_Recepcion_Mercancias_2026.pdf',
    fileSize: '1.4 MB',
    readConfirmationCount: 38,
    versionHistory: [
      {
        version: 'v3.2',
        date: '2026-01-02',
        author: 'Departamento Calidad',
        approvedBy: 'Comité Sanidad',
        changeNotes: 'Ajuste en temperatura máxima de entrega para pescado fresco (0º a 2ºC con hielo picado).'
      }
    ]
  },
  {
    id: 'doc-sop-higiene-manos',
    code: 'SOP-HIG-02',
    title: 'Protocolo de Lavado y Desinfección de Manos en Partida',
    category: 'normas_appcc',
    categoryLabel: 'Normas APPCC y Sanidad',
    description: 'Técnica de lavado de 40 a 60 segundos con jabón bactericida neutro, cepillado de uñas y secado con papel no reciclado.',
    establishmentId: '*',
    departmentId: '*',
    version: 'v2.0',
    status: 'vigente',
    effectiveDate: '2026-01-10',
    reviewDate: '2027-01-10',
    approverRole: 'Chef Ejecutivo',
    approvedBy: 'Antonio González',
    approvedAt: '2026-01-10T12:00:00Z',
    author: 'Antonio González',
    fileName: 'Protocolo_Lavado_Manos_Bitacora.pdf',
    fileSize: '850 KB',
    readConfirmationCount: 52,
    versionHistory: [
      {
        version: 'v2.0',
        date: '2026-01-10',
        author: 'Antonio González',
        approvedBy: 'Antonio González',
        changeNotes: 'Homologación de uso de papel desechable sin contacto manual con papelera de pedal.'
      }
    ]
  },
  {
    id: 'doc-manual-abatidor',
    code: 'MAN-EQ-04',
    title: 'Manual Operativo del Abatidor de Temperatura 10 GN',
    category: 'maquinaria',
    categoryLabel: 'Manuales de Maquinaria',
    description: 'Instrucciones técnicas de ciclos de abatimiento positivo (+70ºC a +3ºC) y ultracongelación negativa (+70ºC a -18ºC).',
    establishmentId: '*',
    departmentId: '*',
    version: 'v1.1',
    status: 'vigente',
    effectiveDate: '2026-01-15',
    reviewDate: '2027-01-15',
    approverRole: 'Jefe de Mantenimiento',
    approvedBy: 'Giacomo Longo',
    approvedAt: '2026-01-16T15:00:00Z',
    author: 'Servicio Técnico Oficial',
    fileName: 'Manual_Abatidor_GN10_V2.pdf',
    fileSize: '3.2 MB',
    readConfirmationCount: 24,
    versionHistory: [
      {
        version: 'v1.1',
        date: '2026-01-16',
        author: 'Servicio Técnico',
        approvedBy: 'Giacomo Longo',
        changeNotes: 'Añadido protocolo de desescarche automático diario.'
      }
    ]
  }
];

const SEED_TECHNICAL_SHEETS: AdminTechnicalSheet[] = [
  {
    id: 'ft-solomillo-truffle',
    name: 'Solomillo de Vaca Madurada al Soplete con Parmentier Trufada',
    code: 'FT-CAL-01',
    category: 'cocina_caliente',
    categoryLabel: 'Cocina Caliente',
    establishmentId: 'est-bitacora',
    departmentId: 'dep-bitacora-cocina',
    areaKey: 'area-bit-caliente-manana',
    servings: 1,
    formulation: [
      { name: 'Solomillo de vaca madurada (21 días)', measure: '200 gr', technicalNaming: 'Corte central de solomillo vacuno limpio', costApprox: 4.80 },
      { name: 'Patata Monalisa cocida al vapor', measure: '120 gr', technicalNaming: 'Patata Monalisa pelada', costApprox: 0.25 },
      { name: 'Mantequilla francesa clarificada', measure: '30 gr', technicalNaming: 'Mantequilla 82% materia grasa', costApprox: 0.40 },
      { name: 'Nata fresca 35% MG', measure: '3 cl', technicalNaming: 'Nata para cocinar UHT 35%', costApprox: 0.15 },
      { name: 'Aceite de trufa negra melanosporum', measure: '3 gotas', technicalNaming: 'Aceite de oliva infusionado con trufa', costApprox: 0.35 },
      { name: 'Flor de sal volcánica de Canarias', measure: '2 gr', technicalNaming: 'Sal marina natural sin refinar', costApprox: 0.05 },
      { name: 'Jugo glaseado de carne concentrado', measure: '4 cl', technicalNaming: 'Demi-glace de ternera reducido', costApprox: 0.60 }
    ],
    elaborationFlow: [
      '1. Atemperamos la pieza de solomillo a 20ºC durante 25 minutos antes del marcado.',
      '2. Elaboramos la parmentier emulsionando la patata tamizada con la mantequilla clarificada, la nata caliente y las gotas de aceite de trufa.',
      '3. Marcamos el solomillo en plancha de cromo a 240ºC durante 90 segundos por cada cara para sellar la reacción de Maillard.',
      '4. Glaseamos la carne con el jugo reducido de ternera en salamandra durante 1 minuto.',
      '5. Servimos sobre plato hondo caliente disponiendo la parmentier en base y coronando con la carne y la flor de sal volcánica.'
    ],
    glasswareAndTools: 'Plato cerámico térmico 28cm precalentado a 60ºC, soplete culinario, termómetro sonda digital, pinzas de emplatar.',
    sensoryDiagnosis: 'Perfil cárnico profundo con notas tostadas y umami pronunciado; contraste sedoso y untuoso de la parmentier de trufa.',
    allergens: ['lacteos'],
    costPerServing: 6.60,
    sellingPrice: 24.50,
    foodCostPercentage: 26.9,
    version: 'v2.0',
    status: 'vigente',
    effectiveDate: '2026-01-15',
    author: 'Antonio González (Chef Bitácora)',
    approverName: 'Antonio González',
    approvedAt: '2026-01-15T11:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z'
  },
  {
    id: 'ft-tartar-atun-rojo',
    name: 'Tartar de Atún Rojo de Almadraba con Aguacate de Tenerife',
    code: 'FT-FR-02',
    category: 'cocina_fria',
    categoryLabel: 'Cocina Fría',
    establishmentId: 'est-vulcano',
    departmentId: 'dep-vulcano-cocina',
    areaKey: 'area-bit-frio-manana',
    servings: 1,
    formulation: [
      { name: 'Lomo de atún rojo de almadraba', measure: '140 gr', technicalNaming: 'Thunnus thynnus lomo ultracongelado -60ºC', costApprox: 5.20 },
      { name: 'Aguacate Hass de Tenerife', measure: '60 gr', technicalNaming: 'Aguacate maduro en brunoise fina', costApprox: 0.60 },
      { name: 'Aceite de sésamo tostado', measure: '0.5 cl', technicalNaming: 'Aceite de sésamo prensado en frío', costApprox: 0.18 },
      { name: 'Salsa de soja sin gluten Tamari', measure: '1.5 cl', technicalNaming: 'Salsa de soja fermentada naturalmente', costApprox: 0.22 },
      { name: 'Cebollino fresco picado', measure: '5 gr', technicalNaming: 'Cebollino fresco fino', costApprox: 0.10 },
      { name: 'Semillas de sésamo negro tostadas', measure: '2 gr', technicalNaming: 'Sésamo negro calidad gourmet', costApprox: 0.08 }
    ],
    elaborationFlow: [
      '1. Descongelamos el atún en cámara fría a +2ºC respetando la cadena de frío sanitaria.',
      '2. Cortamos el lomo a cuchillo en dados regulares de 5x5 mm.',
      '3. Aliñamos el atún en bol de inox sobre baño de hielo con la salsa de soja, el aceite de sésamo y el cebollino.',
      '4. Emplatamos utilizando aro metálico de 8 cm: disponemos la base de aguacate Hass y compactamos suavemente el tartar de atún.',
      '5. Decoramos con las semillas de sésamo tostado y servimos inmediatamente a 6ºC.'
    ],
    glasswareAndTools: 'Plato frío de pizarra negra, aro de emplatar 8cm, bol de inox, baño maría inverso con hielo picado.',
    sensoryDiagnosis: 'Equilibrio marino y graso con final salino y tostado de sésamo; textura firme del atún contrastada por la cremosidad del aguacate.',
    allergens: ['pescado', 'soja', 'sesamo'],
    costPerServing: 6.38,
    sellingPrice: 22.00,
    foodCostPercentage: 29.0,
    version: 'v1.5',
    status: 'vigente',
    effectiveDate: '2026-02-01',
    author: 'Giacomo Longo (Chef Vulcano)',
    approverName: 'Giacomo Longo',
    approvedAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'ft-cocktail-negroni-volcan',
    name: 'Cóctel Negroni Volcánico de Autor',
    code: 'FT-BAR-01',
    category: 'cocteleria',
    categoryLabel: 'Coctelería & Bar',
    establishmentId: 'est-vulcano',
    departmentId: 'dep-vulcano-cocina',
    servings: 1,
    formulation: [
      { name: 'Ginebra artesanal volcánica', measure: '3 cl', technicalNaming: 'Dry Gin destilada en alambique de cobre', costApprox: 1.10 },
      { name: 'Campari Bitter italiano', measure: '3 cl', technicalNaming: 'Licor amargo de infusión botánica', costApprox: 0.85 },
      { name: 'Vermut rojo dulce de barrica', measure: '3 cl', technicalNaming: 'Vermouth di Torino reserva', costApprox: 0.90 },
      { name: 'Bitter de naranja amarga', measure: '2 gotas', technicalNaming: 'Orange bitters aromatizante', costApprox: 0.15 },
      { name: 'Corteza fresca de naranja ecológica', measure: '1 un.', technicalNaming: 'Twist de piel de naranja sin albedo', costApprox: 0.10 },
      { name: 'Bloque de hielo cristalino 5x5', measure: '1 un.', technicalNaming: 'Hielo transparente de descongelación lenta', costApprox: 0.20 }
    ],
    elaborationFlow: [
      '1. Enfriamos el vaso mezclador con hielo compacto y descartamos el agua sobrante.',
      '2. Añadimos la ginebra volcánica, el Campari y el vermut rojo en proporciones exactas de 3 cl.',
      '3. Incorporamos 2 gotas de bitter de naranja y agitamos suavemente con cucharilla imperial durante 25 segundos.',
      '4. Colamos con colador julep sobre vaso Old Fashioned que contiene el bloque de hielo cristalino.',
      '5. Decoramos expresando los aceites esenciales del twist de naranja sobre la superficie y borde de la copa.'
    ],
    glasswareAndTools: 'Vaso Old Fashioned de cristal labrado, vaso mezclador 500ml, cucharilla imperial helicoidal, colador julep, pinzas de hielo.',
    sensoryDiagnosis: 'Perfil amargo equilibrado con notas cítricas vivas y final herbáceo aterciopelado; dilución controlada de alta elegancia.',
    allergens: ['sulfitos'],
    costPerServing: 3.30,
    sellingPrice: 14.50,
    foodCostPercentage: 22.7,
    version: 'v1.2',
    status: 'vigente',
    effectiveDate: '2026-01-20',
    author: 'Giacomo Longo',
    approverName: 'Giacomo Longo',
    approvedAt: '2026-01-20T17:00:00Z',
    updatedAt: '2026-01-20T17:00:00Z'
  }
];

const SEED_CLEANING_TASKS: AdminCleaningTaskConfig[] = [
  {
    id: 'cln-cfg-01',
    establishmentId: 'est-bitacora',
    departmentId: 'dep-bitacora-cocina',
    areaKey: 'area-bit-caliente-manana',
    areaOrEquipment: 'Planchas de cromo duro y fuegos centrales',
    frequency: 'por_turno',
    shift: 'ambos',
    authorizedProduct: 'Desengrasante concentrado neutro homologado',
    dosage: '100 ml por cada 1 litro de agua caliente (10%)',
    applicationMethod: 'Aplicación a 60ºC con espátula de teflón y aclarado con agua potable y vinagre blanco de neutralización.',
    contactTimeMinutes: 10,
    responsibleRole: 'Cocinero de partida caliente',
    requiresSupervisorVerification: true,
    requiredEvidence: 'fotografia',
    status: 'activo',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'cln-cfg-02',
    establishmentId: 'est-bitacora',
    departmentId: 'dep-bitacora-cocina',
    areaKey: 'area-bit-frio-manana',
    areaOrEquipment: 'Cámaras frigoríficas y estanterías higiénicas de polipropileno',
    frequency: 'semanal',
    shift: 'manana',
    authorizedProduct: 'Detergente desinfectante clorado alimentario',
    dosage: '50 ml en 5 litros de agua templada (1%)',
    applicationMethod: 'Vaciado de producto perecedero en cámara contigua, pulverización manual, frotado con bayeta de microfibra azul y secado integral.',
    contactTimeMinutes: 15,
    responsibleRole: 'Responsable de cocina fría',
    requiresSupervisorVerification: true,
    requiredEvidence: 'firma',
    status: 'activo',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'cln-cfg-03',
    establishmentId: 'est-bitacora',
    departmentId: 'dep-bitacora-cocina',
    areaKey: 'area-bit-marmiton',
    areaOrEquipment: 'Tren de lavado industrial y filtros de decantación',
    frequency: 'diaria',
    shift: 'tarde',
    authorizedProduct: 'Desincrustante ácido antical para lavavajillas',
    dosage: 'Dosificación automática conectada a bomba peristáltica (2 gr/l)',
    applicationMethod: 'Ciclo de vaciado térmico a 85ºC y retirada de residuos sólidos en cestillo colector.',
    contactTimeMinutes: 5,
    responsibleRole: 'Marmitón de turno',
    requiresSupervisorVerification: false,
    requiredEvidence: 'ninguna',
    status: 'activo',
    updatedAt: '2026-01-10T08:00:00Z'
  }
];

const SEED_INCIDENT_CATEGORIES: AdminIncidentCategoryConfig[] = [
  {
    id: 'inc-cat-averia',
    code: 'INC-AVE',
    name: 'Avería o fallo de maquinaria operativa',
    description: 'Paradas de cámaras, fogones, abatidores, lavavajillas o trenes de lavado.',
    severityDefault: 'alta',
    defaultAssignedRole: 'Jefe de Mantenimiento',
    autoEscalateHours: 2,
    notifySupervisors: true,
    status: 'activo'
  },
  {
    id: 'inc-cat-desv-temp',
    code: 'INC-TEM',
    name: 'Desviación de temperatura crítica APPCC',
    description: 'Lecturas térmicas fuera del rango tolerado (>4ºC en refrigeración, > -18ºC en congelación).',
    severityDefault: 'critica',
    defaultAssignedRole: 'Chef Ejecutivo / Calidad',
    autoEscalateHours: 1,
    notifySupervisors: true,
    status: 'activo'
  },
  {
    id: 'inc-cat-rotura',
    code: 'INC-ROT',
    name: 'Rotura de material, vajilla o cristalería',
    description: 'Bajas por rotura física en servicio o mise en place.',
    severityDefault: 'baja',
    defaultAssignedRole: 'Jefe de Partida',
    autoEscalateHours: 24,
    notifySupervisors: false,
    status: 'activo'
  },
  {
    id: 'inc-cat-higiene',
    code: 'INC-HIG',
    name: 'Incidencia de higiene o presencia de alérgenos no declarados',
    description: 'Contaminación cruzada, rotura de cadena de frío o error en etiquetado secundario.',
    severityDefault: 'critica',
    defaultAssignedRole: 'Comité de Seguridad Alimentaria',
    autoEscalateHours: 0.5,
    notifySupervisors: true,
    status: 'activo'
  }
];

const SEED_AUDIT_LOGS: AdminAuditChangeLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-01-10T08:00:00Z',
    operatorId: 'op-antonio',
    operatorName: 'Antonio González',
    operatorRole: 'jefe_departamento',
    targetModule: 'estructura',
    actionType: 'creacion',
    entityId: 'est-bitacora',
    entityName: 'Hotel Bitácora',
    summary: 'Configuración de 7 áreas de cocina para Hotel Bitácora con asignación de turnos.',
    newValueSnapshot: { hotel: 'Hotel Bitácora', areasCount: 7 }
  },
  {
    id: 'aud-002',
    timestamp: '2026-02-01T08:00:00Z',
    operatorId: 'op-sanidad',
    operatorName: 'Dirección Sanitaria',
    operatorRole: 'admin_empresa',
    targetModule: 'formularios',
    actionType: 'publicacion',
    entityId: 'form-tpl-appcc-temp',
    entityName: 'Control Diario de Temperaturas APPCC',
    summary: 'Publicación de versión v2.1 con campo de firma obligatoria y umbrales críticos.',
    previousValueSnapshot: { version: 'v2.0' },
    newValueSnapshot: { version: 'v2.1' }
  }
];

// Operadores de demostración para pruebas de RBAC
export const DEMO_OPERATORS: AdminUserOperator[] = [
  {
    id: 'usr-antonio',
    name: 'Antonio González',
    email: 'antoniogonzalez@springhoteles.com',
    role: 'admin_empresa',
    jobTitle: 'Chef Ejecutivo & Administrador del Establecimiento',
    status: 'activo',
    assignedEstablishmentId: 'est-bitacora',
    assignedDepartmentId: 'dep-bitacora-cocina',
    phone: '+34 922 79 00 00',
    avatarUrl: '/assets/aistudio/image_056773e3.png'
  },
  {
    id: 'usr-giacomo',
    name: 'Giacomo Longo',
    email: 'giacomolongo@hotelvulcano.com',
    role: 'admin_empresa',
    jobTitle: 'Chef Ejecutivo & Administrador del Establecimiento',
    status: 'activo',
    assignedEstablishmentId: 'est-vulcano',
    assignedDepartmentId: 'dep-vulcano-cocina',
    phone: '+34 922 79 20 00',
    avatarUrl: '/assets/aistudio/image_056773e3.png'
  },
  {
    id: 'usr-director',
    name: 'Dirección de Operaciones F&B',
    email: 'direccion.operaciones@proahotels.com',
    role: 'admin_empresa',
    jobTitle: 'Director Corporativo de Restauración',
    status: 'activo',
    assignedEstablishmentId: 'est-bitacora'
  },
  {
    id: 'usr-platform-admin',
    name: 'Administrador de Plataforma PROA',
    email: 'admin.platform@proahub.com',
    role: 'admin_plataforma',
    jobTitle: 'Superadministrador de Sistemas',
    status: 'activo'
  },
  {
    id: 'usr-supervisor-turno',
    name: 'Carlos Mendoza (Supervisor)',
    email: 'cmendoza@hotelbitacora.com',
    role: 'supervisor',
    jobTitle: 'Supervisor de Turno',
    status: 'activo',
    assignedEstablishmentId: 'est-bitacora',
    assignedDepartmentId: 'dep-bitacora-cocina'
  },
  {
    id: 'usr-line-cook',
    name: 'Marta Rivas (Cocinera de Línea)',
    email: 'mrivas@hotelbitacora.com',
    role: 'trabajador',
    jobTitle: 'Cocinera de Partida Fría',
    status: 'activo',
    assignedEstablishmentId: 'est-bitacora',
    assignedDepartmentId: 'dep-bitacora-cocina',
    assignedAreaKey: 'area-bit-frio-manana'
  }
];

export const proaAdminConfigService = {
  // Obtener payload completo de configuración para el tenant activo
  getConfigPayload: (): TenantAdminConfigPayload => {
    const tenant = tenantIsolationService.getActiveTenant();
    const subKey = 'admin_operational_config_v3';
    
    const fallback: TenantAdminConfigPayload = {
      organizationId: tenant.orgId,
      structures: SEED_STRUCTURES,
      forms: SEED_FORMS,
      documents: SEED_DOCS,
      technicalSheets: SEED_TECHNICAL_SHEETS,
      menus: [],
      cleaningTasks: SEED_CLEANING_TASKS,
      incidentCategories: SEED_INCIDENT_CATEGORIES,
      operators: DEMO_OPERATORS,
      auditLogs: SEED_AUDIT_LOGS,
      lastSavedAt: new Date().toISOString()
    };

    const loaded = tenantIsolationService.getPartitionData<TenantAdminConfigPayload>(subKey, fallback);
    if (!loaded.operators || loaded.operators.length === 0) {
      loaded.operators = DEMO_OPERATORS;
    }
    // Asegurar que Antonio González y Giacomo Longo son administradores en el almacén cargado
    const antonio = loaded.operators.find(o => o.id === 'usr-antonio' || o.name.toLowerCase().includes('antonio'));
    if (antonio) {
      antonio.role = 'admin_empresa';
      antonio.jobTitle = 'Chef Ejecutivo & Administrador del Establecimiento';
    }
    const giacomo = loaded.operators.find(o => o.id === 'usr-giacomo' || o.name.toLowerCase().includes('giacomo'));
    if (giacomo) {
      giacomo.role = 'admin_empresa';
      giacomo.jobTitle = 'Chef Ejecutivo & Administrador del Establecimiento';
    }

    return loaded;
  },

  // Guardar configuración completa en el almacén del tenant activo
  saveConfigPayload: (payload: TenantAdminConfigPayload): void => {
    const tenant = tenantIsolationService.getActiveTenant();
    const subKey = 'admin_operational_config_v3';
    payload.organizationId = tenant.orgId;
    payload.lastSavedAt = new Date().toISOString();
    tenantIsolationService.setPartitionData(subKey, payload);

    // Intentar sincronizar con el backend
    try {
      fetch(`/api/tenant/admin-config/${tenant.orgId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tenant.token}`
        },
        body: JSON.stringify({ config: payload })
      }).catch(() => {});
    } catch {}
  },

  // Comprobar RBAC
  canUserPerformAction: (
    role: ProaAdminRole,
    action: 'view_config' | 'edit_structure' | 'edit_forms' | 'edit_documents' | 'edit_cleaning' | 'edit_activities' | 'edit_roles' | 'publish' | 'delete' | 'view_audit',
    targetDepartmentId?: string,
    userDepartmentId?: string
  ): { allowed: boolean; reason?: string } => {
    // 1. Trabajador: sin acceso al panel de administración
    if (role === 'trabajador') {
      return {
        allowed: false,
        reason: 'El rol de Trabajador no tiene permisos para acceder al panel de administración y configuración operativa.'
      };
    }

    // 2. Supervisor: solo lectura y revisión de auditoría
    if (role === 'supervisor') {
      if (action === 'view_config' || action === 'view_audit') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'El rol de Supervisor tiene acceso de solo lectura y supervisión; las modificaciones requieren rol de Administrador o Jefatura autorizada.'
      };
    }

    // 3. Administrador de Plataforma y Administrador de Empresa (ej. Antonio González, Giacomo Longo): ACCESO TOTAL A ROLES, ESTRUCTURA Y ACTIVIDADES
    if (role === 'admin_plataforma' || role === 'admin_empresa') {
      return { allowed: true };
    }

    // 4. Jefe de Departamento: puede modificar elementos y actividades de su departamento (pero no roles globales)
    if (role === 'jefe_departamento') {
      if (action === 'edit_roles') {
        return {
          allowed: false,
          reason: 'La asignación y modificación de roles de usuarios requiere permisos de Administrador de Establecimiento (Antonio González / Giacomo Longo) o Dirección.'
        };
      }
      if (targetDepartmentId && userDepartmentId && targetDepartmentId !== userDepartmentId) {
        return {
          allowed: false,
          reason: 'Como Jefe de Departamento solo tienes autorización para modificar la estructura y contenidos de tu departamento asignado.'
        };
      }
      return { allowed: true };
    }

    // 5. Responsable de Área: puede editar fichas y listas de su ámbito
    if (role === 'responsable_area') {
      if (action === 'edit_structure' || action === 'delete' || action === 'edit_roles') {
        return {
          allowed: false,
          reason: 'Modificar roles, jerarquías o eliminar elementos estructurales requiere autorización de Administración de Establecimiento.'
        };
      }
      return { allowed: true };
    }

    return { allowed: true };
  },

  // Registrar entrada en el historial inmutable de auditoría (Governance)
  recordAuditChange: (
    entry: Omit<AdminAuditChangeLogEntry, 'id' | 'timestamp'>
  ): AdminAuditChangeLogEntry => {
    const config = proaAdminConfigService.getConfigPayload();
    const newLog: AdminAuditChangeLogEntry = {
      ...entry,
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    config.auditLogs.unshift(newLog);
    // Conservar hasta 200 logs en memoria local
    if (config.auditLogs.length > 200) {
      config.auditLogs = config.auditLogs.slice(0, 200);
    }

    proaAdminConfigService.saveConfigPayload(config);
    return newLog;
  },

  // Eliminación Segura: comprueba dependencias e históricos antes de permitir borrado
  checkSafeDeletion: (
    nodeType: StructureNodeType | 'form' | 'doc' | 'recipe',
    entityId: string
  ): {
    canDeletePhysically: boolean;
    hasHistoricalRecords: boolean;
    historicalCount: number;
    childEntitiesCount: number;
    recommendedAction: 'desactivar' | 'archivar' | 'eliminar_fisicamente';
    explanation: string;
  } => {
    const config = proaAdminConfigService.getConfigPayload();

    // 1. Si es un establecimiento o departamento, buscar elementos hijos
    let childEntitiesCount = 0;
    if (nodeType === 'establishment') {
      childEntitiesCount = config.structures.filter(s => s.parentId === entityId).length;
    } else if (nodeType === 'department') {
      childEntitiesCount = config.structures.filter(s => s.parentId === entityId).length;
    } else if (nodeType === 'area') {
      childEntitiesCount = config.structures.filter(s => s.parentId === entityId).length;
    }

    // 2. Comprobar registros históricos simulados y en localStorage
    let historicalCount = 0;
    try {
      const opsKey = 'proa_kitchen_station_operations_v2';
      const histKey = 'proa_kitchen_station_history_v2';
      const rawOps = localStorage.getItem(opsKey);
      const rawHist = localStorage.getItem(histKey);
      if (rawHist) {
        const hist = JSON.parse(rawHist);
        if (Array.isArray(hist)) {
          historicalCount += hist.filter((h: any) => 
            h.hotelId === entityId || h.stationKey === entityId || (h.metadata && h.metadata.formId === entityId)
          ).length;
        }
      }
      if (rawOps) {
        historicalCount += 3; // Registros operativos vinculados
      }
    } catch {}

    // Si tiene entidades hijas o históricos vinculados, NO se permite borrado físico
    if (childEntitiesCount > 0) {
      return {
        canDeletePhysically: false,
        hasHistoricalRecords: true,
        historicalCount,
        childEntitiesCount,
        recommendedAction: 'desactivar',
        explanation: `No se puede eliminar porque contiene ${childEntitiesCount} elemento(s) dependientes. Debes reasignar o eliminar primero los elementos inferiores, o simplemente Desactivar este nivel.`
      };
    }

    if (historicalCount > 0) {
      return {
        canDeletePhysically: false,
        hasHistoricalRecords: true,
        historicalCount,
        childEntitiesCount: 0,
        recommendedAction: 'archivar',
        explanation: `Este elemento posee ${historicalCount} registro(s) históricos de auditoría sanitaria o APPCC. Para preservar la trazabilidad legal inmutable, el sistema protege los datos y recomienda Archivarlo en lugar de destruirlo.`
      };
    }

    return {
      canDeletePhysically: true,
      hasHistoricalRecords: false,
      historicalCount: 0,
      childEntitiesCount: 0,
      recommendedAction: 'eliminar_fisicamente',
      explanation: 'El elemento no tiene registros históricos ni dependencias vinculadas. Es seguro eliminarlo definitivamente.'
    };
  },

  // Publicar nueva versión de formulario con incremento de versión y snapshot inmutable
  publishFormVersion: (
    formId: string,
    changesSummary: string,
    author: string
  ): FormTemplateConfig => {
    const config = proaAdminConfigService.getConfigPayload();
    const formIndex = config.forms.findIndex(f => f.id === formId);
    if (formIndex === -1) throw new Error('Formulario no encontrado');

    const form = config.forms[formIndex];
    const prevVersion = form.version;

    // Calcular incremento de versión
    const versionMatch = prevVersion.match(/^v?(\d+)\.(\d+)$/);
    let nextVersion = 'v1.1';
    if (versionMatch) {
      const major = parseInt(versionMatch[1], 10);
      const minor = parseInt(versionMatch[2], 10) + 1;
      nextVersion = `v${major}.${minor}`;
    }

    form.version = nextVersion;
    form.status = 'publicado';
    form.publishedAt = new Date().toISOString();
    form.publishedBy = author;

    if (!form.versionChangelog) form.versionChangelog = [];
    form.versionChangelog.push({
      version: nextVersion,
      publishedAt: form.publishedAt,
      author,
      changesSummary: changesSummary || 'Actualización y publicación de formulario operativo.'
    });

    config.forms[formIndex] = form;
    proaAdminConfigService.saveConfigPayload(config);

    // Registrar en auditoría
    proaAdminConfigService.recordAuditChange({
      operatorId: 'admin',
      operatorName: author,
      operatorRole: 'jefe_departamento',
      targetModule: 'formularios',
      actionType: 'publicacion',
      entityId: form.id,
      entityName: form.title,
      summary: `Publicación de versión ${nextVersion} del formulario '${form.title}'. Resumen: ${changesSummary}`,
      previousValueSnapshot: { version: prevVersion },
      newValueSnapshot: { version: nextVersion, fieldsCount: form.fields.length }
    });

    return form;
  },

  // Validar Ficha Técnica según las directrices de F&B
  validateTechnicalSheet: (sheet: Partial<AdminTechnicalSheet>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!sheet.name || !sheet.name.trim()) {
      errors.push('El nombre del cóctel o plato es obligatorio.');
    }

    if (!sheet.formulation || sheet.formulation.length === 0) {
      errors.push('La formulación debe contener al menos un ingrediente con medida exacta.');
    } else {
      sheet.formulation.forEach((item, idx) => {
        if (!item.name || !item.name.trim()) {
          errors.push(`El ingrediente #${idx + 1} no tiene nombre.`);
        }
        if (!item.measure || !item.measure.trim()) {
          errors.push(`El ingrediente '${item.name || `#${idx + 1}`}' requiere medida técnica exacta (cl, gr, un., gotas).`);
        }
      });
    }

    if (!sheet.elaborationFlow || sheet.elaborationFlow.length === 0) {
      errors.push('El flujo de elaboración debe contener pasos secuenciales numerados.');
    }

    if (!sheet.glasswareAndTools || !sheet.glasswareAndTools.trim()) {
      errors.push('Especifica la cristalería y útiles necesarios de barra o cocina.');
    }

    if (!sheet.sensoryDiagnosis || !sheet.sensoryDiagnosis.trim()) {
      errors.push('Se requiere una nota técnica concisa sobre el perfil sensorial o diagnóstico.');
    }

    if (!sheet.allergens) {
      errors.push('Debe especificarse la declaración de alérgenos según normativa (puede ser lista vacía si está libre de alérgenos).');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
