import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Wine, 
  FileText,
  Tag, 
  FileCheck2, 
  Info, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldAlert, 
  CreditCard, 
  Receipt, 
  Key, 
  AlertTriangle,
  GlassWater,
  DollarSign,
  Layers,
  Search,
  BookOpen,
  Coffee,
  Check,
  Snowflake,
  ExternalLink,
  Compass,
  Sun,
  Moon,
  Sparkle,
  Package,
  ClipboardList,
  RefreshCw,
  FolderOpen,
  X,
  PhoneCall,
  Flame,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ListOrdered,
  Copy,
  CheckCheck,
  AlertCircle,
  FileCheck,
  Eye,
  Camera,
  LayoutGrid,
  Calendar,
  ClipboardCheck,
  Menu,
  Share2,
  Pencil,
  Monitor
} from 'lucide-react';
import { UniversalShareModal, UniversalSharePayload } from './UniversalShareModal';
import { EditProcedureModal } from './EditProcedureModal';
import { 
  TECHNICAL_SHEETS_DATABASE, 
  DIAMOND_PROMOTIONS, 
  DIAMOND_MENUS, 
  HOTEL_PROCEDURES_DATABASE 
} from '../data/hotelPortalData';
import { resolveItemPhoto } from '../services/customPhotos';
import { BAR_OFFICIAL_PROCEDURES, BarProcedureItem } from '../data/barProceduresData';
import { TechnicalSheet, PromotionEntity, MenuItem, HotelMenu } from '../types/hotelPortal';
import { CocktailDetailModal } from './CocktailDetailModal';
import { PromotionDetailModal } from './PromotionDetailModal';
import { PromoNotificationPanel } from './PromoNotificationPanel';
import { PromotionsManagerView } from './PromotionsManagerView';
import { EventsManagerView } from './EventsManagerView';
import { DireccionFBView } from './DireccionFBView';
import { ControlOperativoView } from './ControlOperativoView';
import { QuickProductModal } from './QuickProductModal';
import { FlavorCompassInteractive } from './FlavorCompassInteractive';
import { CashRegisterBankView } from './CashRegisterBankView';
import { EscandalloSimulatorModal } from './EscandalloSimulatorModal';
import { resolveItemEscandallo } from '../services/customEscandallos';
import { TpvCleanRulesGuidePanel } from './TpvCleanRulesGuidePanel';

export type BarCategory = 'control_operativo' | 'direccion_fb' | 'cartas' | 'fichas' | 'promociones' | 'eventos' | 'procedimientos' | 'puesto' | 'cierre_caja' | null;

export interface PortalBarViewProps {
  onBackToDepartments: () => void;
  category?: BarCategory;
  onCategoryChange?: (category: BarCategory) => void;
  targetItemId?: string | null;
  onClearTargetItem?: () => void;
}

interface PuestoTopic {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  summary: string;
  sections: {
    heading: string;
    items: {
      label: string;
      value: string;
      highlight?: boolean;
    }[];
    notes?: string;
  }[];
}

const PUESTO_TOPICS: PuestoTopic[] = [
  {
    id: 'puesto-caja-tpv',
    title: 'Manual de Caja, Medios de Cobro y TPV',
    shortTitle: 'Manual TPV y Cobros',
    icon: CreditCard,
    tag: 'Finanzas & Cobros',
    summary: 'Procedimiento oficial: no se admiten cargos a habitación; cobros exclusivos en tarjeta, efectivo o vouchers autorizados.',
    sections: [
      {
        heading: '1. Apertura de Caja y Fondo Inicial',
        items: [
          { label: 'Fondo obligatorio', value: '200,00 € en efectivo fraccionado (conteo obligatorio exacto)', highlight: true },
          { label: 'Comprobación', value: 'Recuento físico ciego antes de iniciar sesión en el TPV' },
          { label: 'Código de acceso', value: 'Cada empleado utiliza su PIN personal intransferible' }
        ],
        notes: 'Cualquier descuadre en el fondo fijo de 200€ debe comunicarse de inmediato a Recepción antes de registrar la primera venta.'
      },
      {
        heading: '2. Medios de Cobro Autorizados (Sin Cargo a Habitación)',
        items: [
          { label: 'Cargos a habitación', value: 'NO SE CARGAN A LA HABITACIÓN. En este bar/terraza todos los cobros son exclusivamente en Tarjeta, Efectivo o Vouchers de descuento autorizados.', highlight: true },
          { label: 'Tarjeta (Datáfono)', value: 'Cobro directo con datáfono inalámbrico (Visa, Mastercard, contactless o móvil). Guardar el resguardo del TPV para el arqueo.' },
          { label: 'Efectivo (Contado)', value: 'Cobro en metálico en euros. Entrega inmediata del cambio exacto e ingreso en el cajón portamonedas.' },
          { label: 'Vouchers de descuento / compensación', value: 'Admitidos únicamente con vales oficiales emitidos por Recepción o Dirección (compensaciones por incidencias, bonos o atenciones). Registrar en TPV y adjuntar voucher físico original firmado al cierre Z.', highlight: true }
        ],
        notes: 'Protocolo de cortesía con el cliente: Si un huésped solicita cargar consumiciones a su habitación, informarle amablemente de que en este establecimiento el servicio se cobra en el acto mediante tarjeta, efectivo o voucher de descuento.'
      },
      {
        heading: '3. Cierre Z y Cuadre Diario',
        items: [
          { label: 'Hora límite', value: '22:30 h (tras el cierre del servicio en terraza)' },
          { label: 'Registro ágil', value: 'Entrar en «Cierre de caja» e introducir: Visa, Contado, Vouchers (si los hay) y Ventas totales', highlight: true },
          { label: 'Foto del ticket', value: 'Subir foto nítida del ticket fiscal Cierre Z al grupo operativo' },
          { label: 'Custodia', value: 'Verificar fondo fijo (200€) y depositar sobre con recaudación y vouchers en caja fuerte de Recepción' }
        ]
      }
    ]
  },
  {
    id: 'puesto-limpieza-tpv',
    title: 'Protocolo Back-Office TPV: Limpieza de Reglas de Precio y Modificación de Teclas',
    shortTitle: 'Limpieza Reglas TPV',
    icon: Monitor,
    tag: 'Ágora Back-Office',
    summary: 'Procedimiento explícito para el Administrador / Jefatura de Sala: depuración de reglas automáticas de tarifas, retirada de botones descontinuados (Sunset viernes y Spritz domingo), y sincronización forzada para asegurar que el equipo no encuentre registros de promociones antiguas.',
    sections: [
      {
        heading: '1. Desactivación de Reglas de Precio Automáticas (Time Bands)',
        items: [
          { label: 'Ruta Ágora Back-Office', value: 'Tarifas y Precios → Reglas de Precio Automáticas / Franjas Horarias', highlight: true },
          { label: 'PR-RULE-SUNSET-FRI', value: 'Cócteles Sunset 6,50€ Viernes → DESACTIVADA Y BLOQUEADA' },
          { label: 'PR-RULE-SPRITZ-SUN', value: 'Spritz Domingos 6,00€ → DESACTIVADA (Spritz exclusivo de miércoles)' },
          { label: 'Vigencia actual', value: 'Spritz 6€ rige únicamente los miércoles de 08:00 a 22:30 h' }
        ],
        notes: 'Al deshabilitar la regla, el motor de cálculo del TPV nunca aplicará descuentos por franja horaria.'
      },
      {
        heading: '2. Limpieza de Botoneras y Teclados Táctiles',
        items: [
          { label: 'Ruta Ágora Back-Office', value: 'Terminales y Venta → Diseño de Teclados → Teclado Terraza → Promociones', highlight: true },
          { label: 'Teclas retiradas', value: '[SUNSET COCKTAIL 6.50€] y [SPRITZ DOMINGO 6.00€] (Eliminada asignación física)' },
          { label: 'Botonera oficial vigente', value: '[HH 2 CÓCTELES 12€], [HH 2 JARRAS 6€], [PROMO LUNES JARRAS 3€], [PROMO SPRITZ 6€ (Mié)], [PROMO VIERNES 2X1 CÓCTELES] y [PROMO DOMINGO MOJITO 5€]' }
        ]
      },
      {
        heading: '3. Depuración de Modificadores y Suplementos Huérfanos',
        items: [
          { label: 'Modificadores rápidos', value: 'Revisados y eliminados los modificadores con reducciones de precio para sunset o domingos' },
          { label: 'Tarifas por turno', value: 'Comprobado que ninguna tarifa secundaria altere los precios de Tarifa 1 (Carta Oficial)' }
        ]
      },
      {
        heading: '4. Sincronización Forzada a Terminales de Barra',
        items: [
          { label: 'Push de maestros', value: 'Enviar cambios a terminales desde Back-Office' },
          { label: 'Recarga forzada', value: 'En terminal físico: Salir de sesión → Recargar Maestros y Teclados desde Servidor', highlight: true }
        ]
      },
      {
        heading: '5. Auditoría en Vivo: Test de Comanda Ciega',
        items: [
          { label: 'Comprobación Viernes', value: 'Blue Diamond sin promo marca 8,50 € (Carta). Tecla de 6,50€ no existe' },
          { label: 'Comprobación Domingo', value: 'Aperol Spritz marca 8,50 € (Carta). Tecla de 6,00€ eliminada' },
          { label: 'Happy Hour (15-16 h)', value: '1 sola jarra marca 4,50 €; 2 jarras con tecla [HH 2 JARRAS 6.00€] marca 6,00 €' }
        ],
        notes: 'Garantiza riesgo residual 0%. El personal visualiza exclusivamente las promociones homologadas en la Cheat Sheet de contrabarra.'
      }
    ]
  },
  {
    id: 'puesto-cristaleria',
    title: 'Normativa Oficial de Cristalería y Servicio 2026',
    shortTitle: 'Normativa Cristalería',
    icon: Wine,
    tag: 'Estándar Barra & Terraza',
    summary: 'Directriz reglamentaria obligatoria: Los Mojitos se sirven exclusivamente en Vaso Diamond, los Spritz en Copa Balón (Spritz), y todos los combinados y tragos largos que usaban vaso se elaboran y sirven en Copa Hurricane.',
    sections: [
      {
        heading: '1. Los Mojitos en Vaso Diamond (Exclusividad de la Casa)',
        items: [
          { label: 'Mojitos oficiales', value: 'Mojito Tradicional (FT CKT 03), Mojito Fresa (FT CKT 34), Mojito Maracuyá (FT CKT 35) y Virgin Mojito 0.0% (FT CKT 22)', highlight: true },
          { label: 'Cristalería homologada', value: 'Vaso Diamond tallado exclusivo Klayman Diamond' },
          { label: 'Tipo de hielo', value: 'Hielo Pilé / picado abundante colmando el vaso hasta la corona' },
          { label: 'Técnica y majado', value: 'Majar suavemente con mortero de bar sin triturar la hierbabuena para evitar amargor; remover con cuchara imperial' }
        ],
        notes: 'Queda terminantemente prohibido servir mojitos en vaso Highball o vaso de tubo. El Vaso Diamond es la seña de identidad del Klayman Diamond.'
      },
      {
        heading: '2. Los Spritz en Copa Balón (Spritz)',
        items: [
          { label: 'Variedades de Spritz', value: 'Aperol Spritz (FT CKT 16), Campari Spritz (FT CKT 38), Limoncello Spritz (FT CKT 39) y Hugo Spritz (FT CKT 45)', highlight: true },
          { label: 'Cristalería homologada', value: 'Copa Balón (Spritz) de gran capacidad y fuste estilizado' },
          { label: 'Tipo de hielo', value: 'Cubitos de hielo macizo colmando la copa' },
          { label: 'Proporción y gas carbónico', value: 'Regla 3:2:1 (9 cl Prosecco, 6 cl aperitivo, 3 cl soda). Dar un único giro suave para preservar la efervescencia.' }
        ],
        notes: 'Los miércoles de Spritz (6,00€ copa) y en carta regular (8,50€), el servicio debe realizarse siempre en Copa Balón con rodaja de cítrico o menta palmeada.'
      },
      {
        heading: '3. Los que Usan Vaso Usaremos la Copa Hurricane',
        items: [
          { label: 'Directriz de sustitución', value: 'Todos los cócteles de trago largo y combinados que anteriormente usaban vaso (Highball, Collins o Rocks) pasan a servirse en Copa Hurricane.', highlight: true },
          { label: 'Cócteles migrados a Hurricane', value: 'Long Island Iced Tea (FT CKT 12), Bloody Mary (FT CKT 13), Woo Woo (FT CKT 17), San Francisco Mocktail (FT CKT 23), Tequila Sunrise (FT CKT 41), Tom Collins (FT CKT 42), Vodka Berry / Elderflower (FT CKT 04) y Dreamland (FT CKT 05)' },
          { label: 'Cócteles ya homologados en Hurricane', value: 'Sex on the Beach (FT CKT 01), Blue Diamond (FT CKT 02), Piña Colada (FT CKT 14), Fresa Colada (FT CKT 07), Virgin Colada (FT CKT 24) y Bahama Mama (FT CKT 37)' },
          { label: 'Estándar visual en terraza', value: 'Aporta máxima presencia estética en hamacas y terraza sunset, mayor volumen visual y homogeneidad de servicio.' }
        ],
        notes: 'Excepción: Los tragos On the Rocks (Negroni, Old Fashioned, Americano) se mantienen en Vaso Rocks con hielo de bloque; el Barraquito Especial en su vaso cilíndrico termorresistente de 180 ml (5 capas).'
      }
    ]
  },
  {
    id: 'puesto-telefonos',
    title: 'Directorio Telefónico Interno y Extensiones Clave',
    shortTitle: 'Teléfonos Internos',
    icon: PhoneCall,
    tag: 'Comunicaciones',
    summary: 'Extensiones telefónicas directas corporativas para coordinación interna y emergencias en Klayman Diamond y Klayman Olivina.',
    sections: [
      {
        heading: 'Extensiones Directas Klayman Diamond',
        items: [
          { label: 'Recepción Diamond (24h)', value: 'Ext. 9000', highlight: true },
          { label: 'Bar / Terraza Diamond', value: 'Ext. 9002', highlight: true },
          { label: 'Cocina Diamond', value: 'Ext. 9003' },
          { label: 'Administración (Dirección / RRHH / Compras)', value: 'Ext. 9001' },
          { label: 'Gobernanta / Pisos Diamond', value: 'Ext. 9004 (ant. 3325)' },
          { label: 'Llamar a Apartamento Diamond', value: 'Marcar 5 + Nº de habitación' },
          { label: 'Urgencias Médicas / Emergencias', value: '112 / Ext. 9000', highlight: true }
        ],
        notes: 'Plan corporativo de numeración Klayman. Para emergencias sanitarias, avisar simultáneamente a Recepción (Ext. 9000) para facilitar entrada a ambulancia.'
      },
      {
        heading: 'Extensiones de Referencia Klayman Olivina',
        items: [
          { label: 'Recepción Olivina', value: 'Ext. 8000' },
          { label: 'Sol Bar Olivina', value: 'Ext. 8002' },
          { label: 'Gobernanta / Pisos Olivina', value: 'Ext. 8004 (ant. 5869)' },
          { label: 'Dirección Corporativa', value: 'Ext. 8009 (ant. 3327)' },
          { label: 'Compras / RRHH', value: 'Ext. 8010 (ant. 3321)' },
          { label: 'F&B (Eugenia)', value: 'Ext. 8011 (ant. 3329)' },
          { label: 'Llamar a Apartamento Olivina', value: 'Marcar 4 + Nº de apartamento' }
        ]
      }
    ]
  },
  {
    id: 'puesto-llaves',
    title: 'Custodia de Llaves, Candados y Almacenes',
    shortTitle: 'Llaves y Candados',
    icon: Key,
    tag: 'Seguridad física',
    summary: 'Ubicación, custodia y firma de entrega de llaves maestras y candados de bar y solárium.',
    sections: [
      {
        heading: 'Control y Entrega de Llaves',
        items: [
          { label: 'Llavero de Barra', value: 'Ubicado en el armario de seguridad de Recepción (firmar recogida)' },
          { label: 'Llave maestra de licores', value: 'Bajo custodia exclusiva del responsable de turno' },
          { label: 'Candados de terraza', value: 'Cierre perimetral de rejas y sombrillas antes de las 23:00 h', highlight: true },
          { label: 'Almacén de bebidas y cámaras', value: 'Mantener siempre cerrado con llave tras cada reposición' }
        ],
        notes: 'Queda terminantemente prohibido sacar llaves del complejo hotelero al finalizar la jornada laboral.'
      }
    ]
  },
  {
    id: 'puesto-emergencias',
    title: 'Protocolos de Emergencia, Seguridad y Evacuación',
    shortTitle: 'Emergencias & PRL',
    icon: ShieldAlert,
    tag: 'Prevención & PRL',
    summary: 'Medidas de actuación inmediata ante incendio, accidentes o evacuación en la zona de Bar y Terraza.',
    sections: [
      {
        heading: 'Puntos Críticos y Equipamiento de Seguridad',
        items: [
          { label: 'Extintores en Bar', value: '1 de CO2 (cuadro eléctrico) + 1 de Polvo polivalente en office', highlight: true },
          { label: 'Botiquín de primeros auxilios', value: 'En armario superior del office de barra (revisión mensual)' },
          { label: 'Corte general de gas / cerveza', value: 'Válvula roja situada junto al serpentín cervecero' },
          { label: 'Punto de encuentro', value: 'Explanada de entrada principal exterior del hotel' }
        ],
        notes: 'En caso de conato de incendio, dar la voz de alarma a Recepción (Ext. 101) y no usar ascensores.'
      }
    ]
  },
  {
    id: 'puesto-alergenos',
    title: 'Gestión de Alérgenos y Protocolo de Incompatibilidades',
    shortTitle: 'Gestión de Alérgenos',
    icon: ShieldCheck,
    tag: 'Calidad & APPCC',
    summary: 'Normativa comunitaria de información obligatoria de alérgenos y prevención de contaminación cruzada.',
    sections: [
      {
        heading: 'Directrices Obligatorias de Servicio',
        items: [
          { label: 'Consulta activa al comensal', value: 'Preguntar siempre antes de tomar comanda si presenta alergias alimentarias', highlight: true },
          { label: 'Limpieza de coctelera', value: 'Lavado a fondo con agua a 65ºC tras preparar cócteles con lácteos, huevo o frutos secos' },
          { label: 'Fichas técnicas', value: 'Consultar el apartado de alérgenos de cada ficha técnica en caso de duda' },
          { label: 'Garnishes de frutos secos', value: 'Conservar en recipientes herméticos separados de la fruta fresca' }
        ],
        notes: 'Ante una reacción anafiláctica severa, llamar de inmediato al 112 y no administrar ningún alimento al afectado.'
      }
    ]
  }
];

export const PortalBarView: React.FC<PortalBarViewProps> = ({ 
  onBackToDepartments,
  category: externalCategory,
  onCategoryChange,
  targetItemId,
  onClearTargetItem
}) => {
  const [internalCategory, setInternalCategory] = useState<BarCategory>(null);
  const activeCategory = externalCategory !== undefined ? externalCategory : internalCategory;

  const setActiveCategory = (cat: BarCategory) => {
    setInternalCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  // Datos del hotel Diamond
  const diamondSheets = TECHNICAL_SHEETS_DATABASE.filter(s => s.hotelId === 'klayman-diamond');
  const diamondPromotions = DIAMOND_PROMOTIONS.filter(p => p.hotelId === 'klayman-diamond');
  const diamondMenus = DIAMOND_MENUS.filter(m => m.hotelId === 'klayman-diamond' && (m.category === 'cocteles' || m.category === 'bar' || m.category === 'confiteria_snacks'));

  // Buscador inteligente y tolerante de Fichas Técnicas
  const resolveTechnicalSheet = (identifier?: string, nameFallback?: string): TechnicalSheet | null => {
    if (!identifier && !nameFallback) return null;

    const allSheets = [...diamondSheets, ...TECHNICAL_SHEETS_DATABASE];
    
    if (identifier) {
      const idClean = identifier.trim().toLowerCase();
      const idNoDash = idClean.replace(/[\s-_]/g, '');

      // 1. Coincidencia directa por ID o código
      let found = allSheets.find(s => (s.id && s.id.toLowerCase() === idClean) || (s.code && s.code.toLowerCase() === idClean));
      if (found) return found;

      // 2. Coincidencia normalizada (sin guiones ni espacios)
      found = allSheets.find(s => {
        const sIdNoDash = (s.id || '').toLowerCase().replace(/[\s-_]/g, '');
        const sCodeNoDash = (s.code || '').toLowerCase().replace(/[\s-_]/g, '');
        return sIdNoDash === idNoDash || sCodeNoDash === idNoDash;
      });
      if (found) return found;

      // 3. Coincidencia por nombre o título usando el identificador
      found = allSheets.find(s => 
        (s.name && s.name.toLowerCase() === idClean) ||
        (s.title && s.title.toLowerCase() === idClean)
      );
      if (found) return found;
    }

    if (nameFallback) {
      const nameClean = nameFallback.trim().toLowerCase();
      // 4. Coincidencia exacta por nombre o título
      let found = allSheets.find(s => 
        (s.name && s.name.toLowerCase() === nameClean) ||
        (s.title && s.title.toLowerCase() === nameClean)
      );
      if (found) return found;

      // 5. Coincidencia parcial por nombre
      found = allSheets.find(s => {
        const sName = (s.name || s.title || '').toLowerCase();
        return sName && (sName.includes(nameClean) || nameClean.includes(sName));
      });
      if (found) return found;
    }

    return null;
  };

  // Selección y vistas
  const [selectedCocktail, setSelectedCocktail] = useState<TechnicalSheet | null>(() => diamondSheets[0] || null);
  const [fichaViewMode, setFichaViewMode] = useState<'reader' | 'all'>('reader');
  const [isCocktailModalOpen, setIsCocktailModalOpen] = useState(false);
  const [copiedFichaId, setCopiedFichaId] = useState<string | null>(null);

  const [selectedQuickProduct, setSelectedQuickProduct] = useState<MenuItem | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionEntity | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<BarProcedureItem | null>(null);
  const [openProcedureId, setOpenProcedureId] = useState<string | null>(null);
  const [procedureCategoryFilter, setProcedureCategoryFilter] = useState<string>('todos');
  const [copiedProcedureId, setCopiedProcedureId] = useState<string | null>(null);
  const [selectedPuestoTopic, setSelectedPuestoTopic] = useState<PuestoTopic | null>(null);
  const [showTpvCleanupPanel, setShowTpvCleanupPanel] = useState<boolean>(true);

  // Parámetros de procedimientos editables con persistencia en localStorage
  const [proceduresList, setProceduresList] = useState<BarProcedureItem[]>(() => {
    try {
      const saved = localStorage.getItem('bar_official_procedures_custom');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return BAR_OFFICIAL_PROCEDURES;
  });
  const [editingProcedure, setEditingProcedure] = useState<BarProcedureItem | null>(null);
  const [isEditProcedureModalOpen, setIsEditProcedureModalOpen] = useState(false);

  const handleSaveProcedureParameters = (updated: BarProcedureItem) => {
    setProceduresList(prev => {
      const next = prev.map(p => p.id === updated.id ? updated : p);
      try {
        localStorage.setItem('bar_official_procedures_custom', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    if (selectedProcedure?.id === updated.id) {
      setSelectedProcedure(updated);
    }
  };

  const handleResetProcedureToDefault = (procedureId: string) => {
    const original = BAR_OFFICIAL_PROCEDURES.find(p => p.id === procedureId);
    if (original) {
      setProceduresList(prev => {
        const next = prev.map(p => p.id === procedureId ? original : p);
        try {
          localStorage.setItem('bar_official_procedures_custom', JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
      if (selectedProcedure?.id === procedureId) {
        setSelectedProcedure(original);
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string>('menu-dia-cocteles');
  const [fichaFilter, setFichaFilter] = useState<string>('todos');
  const [showFlavorCompass, setShowFlavorCompass] = useState(false);
  const [cartasViewMode, setCartasViewMode] = useState<'visual' | 'compact'>('visual');
  const [promoViewMode, setPromoViewMode] = useState<'visual' | 'compact'>('visual');
  const [promoDayFilter, setPromoDayFilter] = useState<string>('todos');
  const [, setPhotoVersion] = useState(0);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorSheet, setSimulatorSheet] = useState<TechnicalSheet | null>(null);
  const [activePhotoZoom, setActivePhotoZoom] = useState<string | null>(null);
  const [, setEscandalloVersion] = useState(0);

  // Escuchar actualizaciones de escandallos en tiempo real
  React.useEffect(() => {
    const handleEsc = () => setEscandalloVersion(v => v + 1);
    window.addEventListener('klayman_escandallos_updated', handleEsc);
    return () => window.removeEventListener('klayman_escandallos_updated', handleEsc);
  }, []);

  // Navegación móvil rediseñada: Menú de módulos secundario (drawer / modal)
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  // Función universal de compartir
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentSharePayload, setCurrentSharePayload] = useState<UniversalSharePayload | null>(null);

  // Determinar si una promoción está activa hoy
  const isPromoActiveToday = (promo: PromotionEntity): boolean => {
    const day = new Date().getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    const id = promo.id.toLowerCase();
    if (id === 'dia-promo-01') return true; // Happy hour todos los días
    if (id.includes('lunes') && day === 1) return true; // Lunes jarras de cerveza 3€
    if (id.includes('spritz') && day === 3) return true; // Spritz 4 variedades a 6€ solo los miércoles
    if (id.includes('mojito') && day === 0) return true; // Mojitos a 5€ solo los domingos
    if (id.includes('viernes') && day === 5) return true; // Viernes 2x1 en cócteles
    return false;
  };

  // Escuchar actualizaciones de fotos en tiempo real
  React.useEffect(() => {
    const handleUpdate = () => setPhotoVersion(v => v + 1);
    window.addEventListener('klayman_photos_updated', handleUpdate);
    return () => window.removeEventListener('klayman_photos_updated', handleUpdate);
  }, []);

  // Apertura garantizada de Ficha Técnica desde cualquier artículo o acceso
  const handleOpenTechnicalSheetFromItem = (sheetIdOrItem: string, itemName?: string) => {
    const sheet = resolveTechnicalSheet(sheetIdOrItem, itemName);
    if (sheet) {
      setSelectedQuickProduct(null);
      setSelectedCocktail(sheet);
      setFichaFilter('todos');
      setSearchQuery('');
      setActiveCategory('fichas');
      setIsCocktailModalOpen(true);
      setTimeout(() => {
        const el = document.getElementById('lector-ficha');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  };

  const handleCopyFichaRecipe = (sheet: TechnicalSheet) => {
    const text = `=== FICHA TÉCNICA OFICIAL KLAYMAN DIAMOND ===
CÓDIGO: ${sheet.code} (v${sheet.version || '1.0'})
CÓCTEL / BEBIDA: ${sheet.name || sheet.title}
PUNTO DE VENTA: ${sheet.outletName || 'Bar / Terraza Diamond'}
TÉCNICA: ${sheet.technique || 'Estándar'}
CRISTALERÍA: ${sheet.glassware || 'Estándar'}
HIELO: ${sheet.ice || 'Cubos macizos'}
GARNISH: ${sheet.garnish || sheet.decoration || 'Mise en place'}

INGREDIENTES:
${(sheet.ingredients || []).map(i => `• ${i.quantity} - ${i.name} ${i.commercialBrand ? `(${i.commercialBrand})` : ''}`).join('\n')}

MÉTODO DE ELABORACIÓN:
${(sheet.preparationMethod || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

PUNTOS CLAVE DE CALIDAD:
${(sheet.keyQualityPoints || []).map(p => `• ${p}`).join('\n')}
${sheet.criticalPoint ? `\nPUNTO CRÍTICO: ${sheet.criticalPoint}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopiedFichaId(sheet.id);
    setTimeout(() => setCopiedFichaId(null), 2500);
  };

  // Apertura directa si viene del asistente inteligente
  React.useEffect(() => {
    if (targetItemId) {
      const foundSheet = resolveTechnicalSheet(targetItemId);
      if (foundSheet) {
        setSelectedCocktail(foundSheet);
        setActiveCategory('fichas');
        if (onClearTargetItem) onClearTargetItem();
      }
      const foundProc = BAR_OFFICIAL_PROCEDURES.find(p => p.id === targetItemId || p.code.toLowerCase() === targetItemId.toLowerCase());
      if (foundProc) {
        setSelectedProcedure(foundProc);
        setOpenProcedureId(foundProc.id);
        setActiveCategory('procedimientos');
        if (onClearTargetItem) onClearTargetItem();
      }
    }
  }, [targetItemId, onClearTargetItem]);

  // Iconos compactos para los 10 procedimientos oficiales
  const getProcedureIcon = (id: string) => {
    switch (id) {
      case 'proc-apertura': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'proc-cierre': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'proc-mise-en-place': return <Wine className="w-5 h-5 text-emerald-400" />;
      case 'proc-limpieza': return <Sparkle className="w-5 h-5 text-sky-400" />;
      case 'proc-reposicion': return <Package className="w-5 h-5 text-amber-400" />;
      case 'proc-inventario': return <ClipboardList className="w-5 h-5 text-teal-400" />;
      case 'proc-cambio-turno': return <RefreshCw className="w-5 h-5 text-blue-400" />;
      case 'proc-incidencias': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'proc-cierre-caja': return <Receipt className="w-5 h-5 text-emerald-400" />;
      default: return <FolderOpen className="w-5 h-5 text-stone-400" />;
    }
  };

  // =========================================================================
  // CABECERA MODULAR UNIFICADA & NAVEGACIÓN ERGONÓMICA (< 10% DEL VIEWPORT)
  // Reemplaza completamente la fila horizontal de 9 iconos en pantallas internas
  // =========================================================================
  const renderModuleHeader = (
    title: string,
    tag: string,
    icon: React.ComponentType<{ className?: string }>,
    colorClass: string,
    sharePayload?: UniversalSharePayload
  ) => {
    const IconComp = icon;
    return (
      <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-stone-850">
        <button
          onClick={() => { setActiveCategory(null); setSearchQuery(''); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono font-bold text-amber-400 hover:text-white hover:bg-stone-850 transition-all shadow-sm active:scale-95 shrink-0"
          title="Volver a la pantalla principal del Bar"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>← Menú Bar</span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <IconComp className={`w-4 h-4 ${colorClass} shrink-0`} />
          <span className="text-xs sm:text-sm font-display font-bold text-stone-100 uppercase truncate">
            {title}
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 border border-stone-800 uppercase">
            {tag}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {sharePayload && (
            <button
              onClick={() => {
                setCurrentSharePayload(sharePayload);
                setIsShareOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-stone-950 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
              title="Compartir por WhatsApp, PDF o Correo"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          )}

          <button
            onClick={() => setIsQuickMenuOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-850 text-xs font-mono font-bold transition-all shadow-sm active:scale-95"
            title="Abrir menú de módulos"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Módulos</span>
          </button>
        </div>
      </div>
    );
  };

  // Se anula la barra de 9 botones para que nunca consuma espacio vertical en pantallas internas
  const renderCategoryTabBar = () => null;

  // =========================================================================
  // RENDERIZADO PRINCIPAL DE MÓDULOS (UNA VEZ EN UN MÓDULO, OCULTA EL RESTO)
  // Dedica >90% de pantalla a la operativa y <10% a la navegación
  // =========================================================================
  const renderCategoryContent = () => {
    // 1. PANTALLA PRINCIPAL DE BAR: DASHBOARD OPERATIVO PREMIUM
    // TARJETAS GRANDES, ICONOS DE 28-36PX, ÁREA TÁCTIL MÍNIMA 48X48PX
    if (activeCategory === null) {
      return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6 pb-28 animate-fadeIn">
          {/* CABECERA SUPERIOR */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-850 pb-3">
          <button
            onClick={onBackToDepartments}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors shadow-sm shrink-0 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>← Departamentos</span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase block">
              KLAYMAN DIAMOND ★★★★
            </span>
            <span className="text-xs text-stone-400 font-sans">
              Bar / Terraza Sunset
            </span>
          </div>
        </div>

        {/* TÍTULO PRINCIPAL Y CONTEXTO */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 tracking-tight flex items-center gap-3">
            <Wine className="w-8 h-8 text-amber-400 shrink-0" />
            <span>PORTAL DE OPERACIONES · BAR & SALA</span>
          </h1>
          <p className="text-xs sm:text-sm font-sans text-stone-400">
            Selecciona un módulo operativo para acceder directamente al trabajo diario:
          </p>
        </div>

        {/* CUADRÍCULA DE TARJETAS GRANDES TIPO DASHBOARD (ICONOS 28-36PX, ÁREA TÁCTIL >48PX) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {/* 1. 📋 SOPs */}
          <button
            onClick={() => { setActiveCategory('procedimientos'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-sky-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform shrink-0">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-sky-950/80 text-sky-300 border border-sky-800/60 font-bold uppercase">
                Protocolos
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-sky-300 transition-colors uppercase leading-tight">
                📋 SOPs Y PROCEDIMIENTOS
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Protocolo de viento, alérgenos, apertura de terraza y estándares de servicio.
              </p>
            </div>
          </button>

          {/* 2. 🍸 Cartas */}
          <button
            onClick={() => { setActiveCategory('cartas'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Wine className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold uppercase">
                Ágora ERP
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-tight">
                🍸 CARTAS Y MENÚS
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Carta Terraza Diamond, Cócteles, Bar & Vinos, Snacks y Brújula de Sabores.
              </p>
            </div>
          </button>

          {/* 3. 📑 Fichas Técnicas */}
          <button
            onClick={() => { setActiveCategory('fichas'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold uppercase">
                {diamondSheets.length} Fichas IBA
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-emerald-300 transition-colors uppercase leading-tight">
                📑 FICHAS TÉCNICAS
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                {diamondSheets.length} recetas oficiales normalizadas, dosificación cl, cristalería y alérgenos.
              </p>
            </div>
          </button>

          {/* 4. 🎯 Promociones */}
          <button
            onClick={() => { setActiveCategory('promociones'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Tag className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold uppercase">
                15:00-16:00
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-tight">
                🎯 PROMOCIONES & HAPPY HOUR
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Happy Hour 15-16h (2 cócteles 12€ / 2 jarras 6€), Lunes jarras 3€, Miércoles Spritz 6€ y Mojito 5€ (todo el día).
              </p>
            </div>
          </button>

          {/* 5. ✅ Control Operativo */}
          <button
            onClick={() => { setActiveCategory('control_operativo'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold uppercase">
                Trazabilidad
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-emerald-300 transition-colors uppercase leading-tight">
                ✅ CONTROL OPERATIVO
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Checklists de Apertura, Cierre, APPCC, Higiene, Temperaturas y Base de Datos.
              </p>
            </div>
          </button>

          {/* 6. 💰 Caja */}
          <button
            onClick={() => { setActiveCategory('cierre_caja'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <Receipt className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-bold uppercase">
                Arqueo & Z
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-emerald-300 transition-colors uppercase leading-tight">
                💰 CIERRE DE CAJA
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Arqueo diario, datáfono, efectivo, resguardos y envío de informe Z a WhatsApp.
              </p>
            </div>
          </button>

          {/* 7. 👔 Dirección */}
          <button
            onClick={() => { setActiveCategory('direccion_fb'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/50 hover:border-amber-400 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                Consola Central
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-tight">
                👔 DIRECCIÓN F&B
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Consola del Maître General, alertas vivas, stock crítico, incidencias y auditorías.
              </p>
            </div>
          </button>

          {/* 8. 📅 Eventos */}
          <button
            onClick={() => { setActiveCategory('eventos'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-purple-500/80 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <Calendar className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-800/60 font-bold uppercase">
                Hoy · Mañana
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-purple-300 transition-colors uppercase leading-tight">
                📅 EVENTOS Y CALENDARIO
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Agenda del día: Hoy, Mañana y Próximamente. Sunset Sessions y animación.
              </p>
            </div>
          </button>

          {/* 9. ℹ️ Puesto */}
          <button
            onClick={() => { setActiveCategory('puesto'); setSearchQuery(''); }}
            className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex flex-col justify-between min-h-[145px] group shadow-lg"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-13 h-13 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 group-hover:scale-105 transition-transform shrink-0">
                <Info className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-stone-800 text-stone-400 border border-stone-700 font-bold uppercase">
                Manual
              </span>
            </div>
            <div className="mt-3">
              <h2 className="font-display font-bold text-base sm:text-lg text-stone-100 group-hover:text-stone-300 transition-colors uppercase leading-tight">
                ℹ️ INFORMACIÓN DEL PUESTO
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                Manual operativo, turnos, uniformidad, extensiones telefónicas y servicio.
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CATEGORÍA: CONTROL OPERATIVO, CHECKLISTS Y TRAZABILIDAD (FASE 11)
  // =========================================================================
  if (activeCategory === 'control_operativo') {
    return (
      <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-3.5 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Control Operativo",
          "Checklists & APPCC",
          ClipboardCheck,
          "text-emerald-400",
          {
            title: "Control Operativo Diario",
            module: "Control Operativo & APPCC",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Supervisor de F&B",
            summaryText: "Registro y ejecución de Checklists Operativos: Apertura, Cierre, APPCC, Higiene, Temperaturas y Servicio.",
            details: [
              { label: 'Hotel', value: 'Klayman Diamond' },
              { label: 'Área', value: 'Bar / Terraza' },
              { label: 'Checklists', value: '6 protocolos normalizados' },
              { label: 'Estado', value: 'Operativo activo' }
            ]
          }
        )}

        {/* COMPONENTE MAESTRO DE CONTROL OPERATIVO */}
        <ControlOperativoView onBackToMenu={() => setActiveCategory(null)} />
      </div>
    );
  }

  // =========================================================================
  // CATEGORÍA: DIRECCIÓN F&B / DASHBOARD OPERATIVO DEL MAÎTRE GENERAL (FASE 10)
  // =========================================================================
  if (activeCategory === 'direccion_fb') {
    return (
      <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-3.5 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Dirección F&B",
          "Consola Central",
          Sparkles,
          "text-amber-400",
          {
            title: "Consola de Dirección F&B",
            module: "Dirección F&B",
            hotel: "Klayman Diamond Aparthotel",
            area: "Dirección Operativa F&B",
            responsible: "Maître General / F&B Manager",
            summaryText: "Cuadro de mando general de F&B Klayman Diamond: Incidencias, faltantes, auditorías y trazabilidad.",
            details: [
              { label: 'Supervisión', value: 'Dirección de Operaciones' },
              { label: 'Hotel', value: 'Klayman Diamond' }
            ]
          }
        )}

        {/* COMPONENTE MAESTRO DE DIRECCIÓN F&B */}
        <DireccionFBView
          onNavigateToTab={(tab) => {
            setActiveCategory(tab);
            setSearchQuery('');
          }}
          onOpenProductDetail={(prodId, nameFallback) => {
            const sheet = resolveTechnicalSheet(prodId, nameFallback);
            if (sheet) {
              handleOpenTechnicalSheetFromItem(sheet.id, nameFallback);
            }
          }}
          onOpenTechnicalSheet={(sheetId) => {
            handleOpenTechnicalSheetFromItem(sheetId);
          }}
          onBackToMenu={() => setActiveCategory(null)}
        />
      </div>
    );
  }

  // =========================================================================
  // 2. CATEGORÍA 1: CARTAS (MOBILE-FIRST, SIN SCROLL HORIZONTAL)
  // =========================================================================
  if (activeCategory === 'cartas') {
    const currentMenu = diamondMenus.find(m => m.id === activeMenuId) || diamondMenus[0];

    const filteredSections = currentMenu.sections.map(section => {
      const filteredItems = section.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ingredientsSummary && item.ingredientsSummary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return { ...section, items: filteredItems };
    }).filter(section => section.items.length > 0);

    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Cartas y Menús",
          currentMenu?.title || "Terraza Diamond",
          Wine,
          "text-amber-400",
          {
            title: currentMenu?.title || 'Carta Oficial Terraza Diamond',
            module: 'Cartas y Menús F&B',
            hotel: 'Klayman Diamond Aparthotel',
            area: 'Bar / Terraza Diamond',
            responsible: 'Jefatura de Bar & F&B',
            summaryText: `${currentMenu?.title || 'Carta Oficial'}: ${currentMenu?.subtitle || 'Carta activa oficial integrada con Ágora ERP'}. Precios y referencias sincronizadas.`,
            details: [
              { label: 'Carta', value: currentMenu?.title || 'Terraza Diamond' },
              { label: 'Categoría', value: currentMenu?.category?.toUpperCase() || 'F&B' },
              { label: 'Integración', value: 'Ágora ERP' }
            ]
          }
        )}

        {/* SELECTOR DE CARTA EN CUADRÍCULA MOBILE-FIRST (CERO SCROLL HORIZONTAL) */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-900/80 rounded-2xl border border-stone-800 text-center">
            {diamondMenus.map((menu) => {
              // Títulos ultra compactos para móvil
              const shortTitle = menu.category === 'cocteles' 
                ? 'Cócteles' 
                : menu.category === 'bar' 
                ? 'Bar & Vinos' 
                : 'Snacks';

              return (
                <button
                  key={menu.id}
                  onClick={() => { setActiveMenuId(menu.id); setSearchQuery(''); }}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all truncate ${
                    activeMenuId === menu.id
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-stone-850'
                  }`}
                >
                  {shortTitle}
                </button>
              );
            })}
          </div>

          {/* BARRA DE HERRAMIENTAS: BRÚJULA DE SABORES + SELECTOR DE VISTA CON FOTOS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowFlavorCompass(true)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold bg-stone-900 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 transition-all flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Abrir La Brújula de Sabores</span>
            </button>

            {/* Selector de modo de vista: Visual con Fotos vs Rápida de Barra */}
            <div className="flex items-center justify-center p-1 bg-stone-900 rounded-xl border border-stone-800 shrink-0 gap-1">
              <button
                onClick={() => setCartasViewMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  cartasViewMode === 'visual'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Vista con fotos oficiales de presentación"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Con Fotos</span>
              </button>
              <button
                onClick={() => setCartasViewMode('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  cartasViewMode === 'compact'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Vista rápida y compacta de barra"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Rápida</span>
              </button>
            </div>
          </div>
        </div>

        {/* BUSCADOR COMPACTO */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/70"
          />
        </div>

        {/* PRODUCTOS DE LA CARTA */}
        <div className="space-y-5">
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-2.5">
              <div className="border-b border-stone-850 pb-1.5 flex items-baseline justify-between">
                <h3 className="text-xs sm:text-sm font-display font-bold text-stone-200 uppercase tracking-wide">
                  {section.name}
                </h3>
                <span className="text-[10px] font-mono text-stone-500">
                  {section.items.length} artículos
                </span>
              </div>

              {cartasViewMode === 'visual' ? (
                /* VISTA VISUAL CON FOTOGRAFÍAS OFICIALES */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {section.items.map((item) => {
                    const linkedSheet = resolveTechnicalSheet(item.technicalSheetId, item.name);
                    const itemPhoto = resolveItemPhoto(item.id, item.technicalSheetId || linkedSheet?.id, item.imageUrl);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedQuickProduct(item)}
                        className="rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/60 overflow-hidden flex flex-col justify-between group cursor-pointer shadow-md transition-all active:scale-[0.99]"
                      >
                        {/* Fotografía del artículo */}
                        <div className="relative h-28 sm:h-32 w-full bg-stone-950 overflow-hidden">
                          {itemPhoto ? (
                            <img
                              src={itemPhoto}
                              alt={item.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-stone-600 bg-stone-950">
                              <Camera className="w-6 h-6 stroke-1 mb-1" />
                              <span className="text-[9px] font-mono">Sin foto</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent pointer-events-none" />

                          {/* Precio en la esquina de la foto */}
                          <div className="absolute bottom-2 left-2">
                            <span className="px-2 py-0.5 rounded-lg bg-stone-950/90 backdrop-blur-md border border-stone-700/80 font-mono font-bold text-emerald-400 text-xs shadow-sm">
                              {item.price.toFixed(2)} €
                            </span>
                          </div>

                          {/* Código de Ficha Técnica si aplica o Etiqueta Pendiente de Documentar */}
                          {linkedSheet?.code ? (
                            <div className="absolute top-2 right-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[9px] font-mono text-emerald-300 font-bold">
                                {linkedSheet.code}
                              </span>
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2">
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-950/90 backdrop-blur-md border border-amber-800/80 text-[7.5px] font-mono text-amber-300 font-bold tracking-tight shadow-sm">
                                PENDIENTE DE DOCUMENTAR
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Información del artículo */}
                        <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                          <div className="space-y-1">
                            <h4 className="font-display font-bold text-xs sm:text-sm text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-snug line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-mono line-clamp-2 leading-relaxed">
                              {item.ingredientsSummary || item.description}
                            </p>
                          </div>

                          {/* Botones de acción rápida */}
                          <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between gap-1 text-[10px] font-mono">
                            <span className="text-amber-400 group-hover:underline flex items-center gap-0.5">
                              <span>Detalle</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>

                            {linkedSheet && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenTechnicalSheetFromItem(linkedSheet.id, item.name);
                                }}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/80 text-[10px] font-semibold transition-colors active:scale-95"
                                title={`Ver Ficha Técnica Oficial (${linkedSheet.code})`}
                              >
                                <FileText className="w-3 h-3 text-emerald-400" />
                                <span>Ficha FT</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* VISTA COMPACTA DE BARRA */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {section.items.map((item) => {
                    const linkedSheet = resolveTechnicalSheet(item.technicalSheetId, item.name);
                    const itemPhoto = resolveItemPhoto(item.id, item.technicalSheetId || linkedSheet?.id, item.imageUrl);

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/70 active:bg-stone-850 transition-all flex flex-col justify-between gap-2 shadow-sm min-h-[58px] group"
                      >
                        <button
                          onClick={() => setSelectedQuickProduct(item)}
                          className="text-left flex items-start justify-between gap-1.5 w-full"
                        >
                          <span className="font-display font-bold text-xs sm:text-sm text-stone-100 group-hover:text-amber-300 transition-colors uppercase leading-snug flex items-center gap-1">
                            {itemPhoto && (
                              <Camera className="w-3 h-3 text-amber-400/80 shrink-0 inline" title="Foto disponible" />
                            )}
                            <span className="truncate">{item.name}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0 mt-0.5" />
                        </button>

                        <div className="flex items-center justify-between pt-1 border-t border-stone-800/60 text-[11px] font-mono">
                          <span className="text-emerald-400 font-bold">
                            {item.price.toFixed(2)} €
                          </span>
                          {linkedSheet ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenTechnicalSheetFromItem(linkedSheet.id, item.name);
                              }}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/80 text-[10px] font-semibold transition-colors active:scale-95"
                              title={`Ver Ficha Técnica Oficial (${linkedSheet.code})`}
                            >
                              <FileText className="w-3 h-3 text-emerald-400" />
                              <span>Ficha FT</span>
                            </button>
                          ) : (
                            <span className="text-[7.5px] font-mono text-amber-400/90 font-bold px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-900/50 tracking-tight">
                              PENDIENTE DE DOCUMENTAR
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MODAL DE CONSULTA RÁPIDA: PRECIO + DESCRIPCIÓN */}
        {selectedQuickProduct && (
          <QuickProductModal
            item={selectedQuickProduct}
            onClose={() => setSelectedQuickProduct(null)}
            linkedSheet={resolveTechnicalSheet(selectedQuickProduct.technicalSheetId, selectedQuickProduct.name)}
            onOpenTechnicalSheet={(sheetId) => {
              handleOpenTechnicalSheetFromItem(sheetId, selectedQuickProduct.name);
            }}
          />
        )}

        {/* MODAL DE FICHA TÉCNICA A PANTALLA COMPLETA SI SE SOLICITA DESDE CARTA */}
        {isCocktailModalOpen && selectedCocktail && (
          <CocktailDetailModal
            sheet={selectedCocktail}
            onClose={() => setIsCocktailModalOpen(false)}
          />
        )}

        {/* BRÚJULA DE SABORES */}
        {showFlavorCompass && (
          <FlavorCompassInteractive
            sheets={diamondSheets}
            onSelectCocktail={(sheet) => {
              setShowFlavorCompass(false);
              setSelectedCocktail(sheet);
            }}
            onClose={() => setShowFlavorCompass(false)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. CATEGORÍA 2: FICHAS TÉCNICAS (LECTOR CON SCROLL DIRECTO EN PANTALLA)
  // =========================================================================
  if (activeCategory === 'fichas') {
    const isMocktail = (sheet: TechnicalSheet): boolean => {
      const c = sheet.code || '';
      const n = (sheet.name || sheet.title || '').toLowerCase();
      return c === 'FT CKT 22' || c === 'FT CKT 23' || c === 'FT CKT 24' ||
        sheet.id.includes('virgin') || sheet.id.includes('san-francisco') ||
        n.includes('virgin') || n.includes('san francisco') || n.includes('sin alcohol') || n.includes('0.0');
    };

    const isCafeteriaOGastro = (sheet: TechnicalSheet): boolean => {
      const c = sheet.code || '';
      return sheet.category === 'cafeteria' || sheet.category === 'productos' || sheet.category === 'cocina_recetas' || c.startsWith('CAF') || c.startsWith('CERV') || c.startsWith('FT-GAST') || c.startsWith('GAST');
    };

    const isPromoItem = (sheet: TechnicalSheet): boolean => {
      const c = sheet.code || '';
      const notes = (sheet.notes || '').toLowerCase();
      const info = (sheet.additionalInfo || '').toLowerCase();
      return notes.includes('happy hour') || notes.includes('promoción') || notes.includes('promocion') ||
             notes.includes('miércoles') || notes.includes('domingos') ||
             info.includes('happy hour') || info.includes('promoción') || info.includes('promocion') ||
             c === 'CERV-01' || c === 'FT CKT 01' || c === 'FT CKT 02' || c === 'FT CKT 03' || 
             c === 'FT CKT 14' || c === 'FT CKT 16' || c === 'FT CKT 22' || c === 'FT CKT 30' || 
             c === 'FT CKT 34' || c === 'FT CKT 35' || c === 'FT CKT 38' || c === 'FT CKT 39' || 
             c === 'FT CKT 45';
    };

    const filteredSheets = diamondSheets.filter(sheet => {
      const name = (sheet.name || sheet.title || '').toLowerCase();
      const code = (sheet.code || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      
      const isSinAlcohol = isMocktail(sheet);
      const isCaf = isCafeteriaOGastro(sheet);
      const isCoctelAlcohol = !isSinAlcohol && !isCaf;

      const matchesSearch = !q || 
        name.includes(q) || 
        code.includes(q) || 
        (sheet.glassware && sheet.glassware.toLowerCase().includes(q)) ||
        (sheet.technique && sheet.technique.toLowerCase().includes(q)) ||
        (sheet.ingredients && sheet.ingredients.some(i => (i.name || '').toLowerCase().includes(q) || (i.commercialBrand || '').toLowerCase().includes(q)));
      
      if (!matchesSearch) return false;
      if (fichaFilter === 'todos') return true;
      if (fichaFilter === 'promocion') return isPromoItem(sheet);
      if (fichaFilter === 'cocteles') return isCoctelAlcohol;
      if (fichaFilter === 'sin_alcohol') return isSinAlcohol;
      if (fichaFilter === 'cafeteria') return isCaf;
      return true;
    });

    const countTodos = diamondSheets.length;
    const countPromocion = diamondSheets.filter(s => isPromoItem(s)).length;
    const countCocteles = diamondSheets.filter(s => !isMocktail(s) && !isCafeteriaOGastro(s)).length;
    const countSinAlcohol = diamondSheets.filter(s => isMocktail(s)).length;
    const countCafeteria = diamondSheets.filter(s => isCafeteriaOGastro(s)).length;

    const currentModalSheet = selectedCocktail || filteredSheets[0] || diamondSheets[0];
    const currentModalIndex = filteredSheets.findIndex(s => s.id === currentModalSheet?.id);
    const hasPrevModal = currentModalIndex > 0;
    const hasNextModal = currentModalIndex >= 0 && currentModalIndex < filteredSheets.length - 1;

    return (
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Fichas Técnicas F&B",
          `${filteredSheets.length} FICHAS OFICIALES`,
          FileText,
          "text-emerald-400",
          {
            title: "Catálogo Oficial de Fichas Técnicas",
            module: "Fichas Técnicas F&B",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Jefatura de Bar & F&B",
            summaryText: `Catálogo visual premium de coctelería, combinados y cafetería. Pulsa cualquier ficha para abrir la receta completa, escandallo, elaboración, alérgenos y cristalería.`,
            details: [
              { label: 'Total Fichas', value: `${countTodos} fichas homologadas` },
              { label: '🔥 En Promo', value: `${countPromocion} recetas promocionales activas` },
              { label: 'Con Alcohol', value: `${countCocteles} cócteles clásicos y de autor` },
              { label: '0.0% Sin Alcohol', value: `${countSinAlcohol} mocktails` },
              { label: 'Cafetería & Cerveza', value: `${countCafeteria} especialidades` }
            ]
          }
        )}

        {/* BARRA SUPERIOR: BUSCADOR Y ACCESOS RÁPIDOS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* BUSCADOR */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cóctel, ingrediente (Ron Arehucas, lima...), cristalería o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500/70 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-0.5"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* BRÚJULA DE SABORES INTERACTIVA ACCESO DIRECTO */}
          <button
            onClick={() => setShowFlavorCompass(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 text-stone-300 hover:text-amber-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95"
            title="Abrir Brújula de Sabores Interactiva"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Brújula de Sabores</span>
          </button>
        </div>

        {/* FILTROS SEGMENTADOS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-stone-900/80 rounded-2xl border border-stone-800 text-center">
          {[
            { id: 'todos', label: `Todos (${countTodos})` },
            { id: 'promocion', label: `🔥 En Promo (${countPromocion})` },
            { id: 'cocteles', label: `Con Alcohol (${countCocteles})` },
            { id: 'sin_alcohol', label: `0.0% Sin Alcohol (${countSinAlcohol})` },
            { id: 'cafeteria', label: `Café & Cerveza (${countCafeteria})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFichaFilter(f.id)}
              className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all truncate active:scale-[0.98] ${
                fichaFilter === f.id
                  ? 'bg-emerald-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* BANNER OFICIAL DE CRISTALERÍA 2026 */}
        <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/30 border border-amber-500/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Wine className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-mono font-bold text-amber-300">
                Normativa de Cristalería 2026
              </p>
              <p className="text-[11px] text-stone-300">
                Mojitos en <strong className="text-white">Vaso Diamond</strong> · Spritz en <strong className="text-white">Copa Balón</strong> · Tragos largos en <strong className="text-white">Copa Hurricane</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSearchQuery('Vaso Diamond')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                searchQuery === 'Vaso Diamond' 
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' 
                  : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700/80 hover:text-white'
              }`}
            >
              💎 Mojitos ({diamondSheets.filter(s => s.glassware?.includes('Diamond')).length})
            </button>
            <button
              onClick={() => setSearchQuery('Copa Balón')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                searchQuery === 'Copa Balón' 
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' 
                  : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700/80 hover:text-white'
              }`}
            >
              🥂 Spritz ({diamondSheets.filter(s => s.glassware?.includes('Balón')).length})
            </button>
            <button
              onClick={() => setSearchQuery('Hurricane')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all border ${
                searchQuery === 'Hurricane' 
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' 
                  : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700/80 hover:text-white'
              }`}
            >
              🍹 Hurricane ({diamondSheets.filter(s => s.glassware?.includes('Hurricane')).length})
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 rounded-xl text-[10px] font-mono text-stone-400 hover:text-stone-200 transition-colors"
                title="Mostrar todas"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* CONTADOR DE FICHAS Y ACCESO RÁPIDO */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-1">
          <span>Mostrando <strong className="text-emerald-400">{filteredSheets.length}</strong> de {diamondSheets.length} fichas:</span>
          <span className="text-[11px] text-stone-500 hidden sm:inline">Pulsa cualquier tarjeta para abrir la ficha técnica completa</span>
        </div>

        {/* CATÁLOGO VISUAL DE FICHAS TÉCNICAS (CARTA DIGITAL PREMIUM DE HOTEL) */}
        {filteredSheets.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pt-1">
            {filteredSheets.map((sheet, index) => {
              const photo = resolveItemPhoto(sheet.id, undefined, sheet.imageUrl);
              const esc = resolveItemEscandallo(sheet);
              const isMock = isMocktail(sheet);
              const isCaf = isCafeteriaOGastro(sheet);

              return (
                <div
                  key={sheet.id}
                  onClick={() => {
                    setSelectedCocktail(sheet);
                    setIsCocktailModalOpen(true);
                  }}
                  className="group relative rounded-2xl sm:rounded-3xl border border-stone-800/90 bg-stone-900/80 hover:bg-stone-850 hover:border-emerald-500/60 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-emerald-950/20 hover:-translate-y-1 active:scale-[0.98]"
                >
                  {/* FOTOGRAFÍA CON OVERLAYS DE CÓDIGO Y PRECIO */}
                  <div className="relative w-full aspect-[4/3] bg-stone-950 overflow-hidden shrink-0">
                    {photo ? (
                      <img
                        src={photo}
                        alt={sheet.name || sheet.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading={index < 8 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-950 text-stone-700">
                        <Wine className="w-10 h-10 text-amber-500/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />

                    {/* BADGE SUPERIOR IZQUIERDA: CÓDIGO FT Y N.º OFICIAL */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 flex-wrap">
                      {sheet.officialNumber !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-stone-900/90 backdrop-blur-md border border-stone-700/80 text-[9px] font-mono font-bold text-stone-300 shadow-sm">
                          #{sheet.officialNumber}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-lg bg-stone-950/85 backdrop-blur-md border border-stone-700/80 text-[10px] font-mono font-bold text-emerald-400 shadow-sm">
                        {sheet.code}
                      </span>
                      {sheet.originType === 'Receta maestra' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-950/90 backdrop-blur-md border border-amber-600/80 text-[9px] font-mono font-bold text-amber-300">
                          Maestra
                        </span>
                      )}
                      {isMock && (
                        <span className="px-1.5 py-0.5 rounded-md bg-sky-950/85 backdrop-blur-md border border-sky-700/80 text-[9px] font-mono font-bold text-sky-300">
                          0.0%
                        </span>
                      )}
                      {isCaf && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-950/85 backdrop-blur-md border border-amber-700/80 text-[9px] font-mono font-bold text-amber-300">
                          Café
                        </span>
                      )}
                      {isPromoItem(sheet) && (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-500/70 text-[9px] font-mono font-bold text-amber-300">
                          🔥 Promo
                        </span>
                      )}
                    </div>

                    {/* BADGE INFERIOR DERECHA: PRECIO */}
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 font-mono font-bold text-xs shadow-md">
                        {esc.sellingPrice.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* CONTENIDO DE LA TARJETA */}
                  <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-xs sm:text-sm text-stone-100 uppercase group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {sheet.name || sheet.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] font-mono text-stone-400 line-clamp-1">
                        {sheet.glassware || 'Cristalería homologada'}
                        {sheet.garnish ? ` · ${sheet.garnish}` : ''}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono text-stone-400">
                      <span>Coste: {esc.rawCost.toFixed(2)} €</span>
                      <span className={esc.marginPercent >= 80 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                        {esc.marginPercent.toFixed(0)}% mrg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-stone-900/60 border border-stone-800 text-center space-y-3">
            <FileText className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-sm font-mono text-stone-300 font-bold uppercase">No se encontraron fichas</h3>
            <p className="text-xs font-mono text-stone-500 max-w-sm mx-auto">
              No hay fichas que coincidan con "{searchQuery}". Prueba a buscar por otro ingrediente o restablece los filtros.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFichaFilter('todos'); }}
              className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* MODAL FULLSCREEN DE FICHA TÉCNICA COMPLETA */}
        {isCocktailModalOpen && currentModalSheet && (
          <CocktailDetailModal
            sheet={currentModalSheet}
            onClose={() => setIsCocktailModalOpen(false)}
            onPrev={() => {
              if (currentModalIndex > 0) {
                setSelectedCocktail(filteredSheets[currentModalIndex - 1]);
              }
            }}
            onNext={() => {
              if (currentModalIndex >= 0 && currentModalIndex < filteredSheets.length - 1) {
                setSelectedCocktail(filteredSheets[currentModalIndex + 1]);
              }
            }}
            hasPrev={hasPrevModal}
            hasNext={hasNextModal}
            onOpenSimulator={(sheetToSimulate) => {
              setSimulatorSheet(sheetToSimulate);
              setIsSimulatorOpen(true);
            }}
          />
        )}

        {/* BRÚJULA DE SABORES INTERACTIVA */}
        {showFlavorCompass && (
          <FlavorCompassInteractive
            sheets={diamondSheets}
            onSelectCocktail={(sheet) => {
              setShowFlavorCompass(false);
              setSelectedCocktail(sheet);
              setIsCocktailModalOpen(true);
            }}
            onClose={() => setShowFlavorCompass(false)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. CATEGORÍA 3: PROMOCIONES Y OFERTAS OFICIALES AK TERRAZA DIAMOND
  // =========================================================================
  if (activeCategory === 'promociones') {
    return (
      <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-3.5 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Promociones & Happy Hour",
          "Tarifas Especiales",
          Tag,
          "text-amber-400",
          {
            title: "Promociones y Happy Hour",
            module: "Promociones F&B",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Jefatura de Bar & F&B",
            summaryText: "Ofertas oficiales de Klayman Diamond: Happy Hour diario 15:00-16:00 h (2 cócteles 12€ ó 2 jarras 6€ · bebidas idénticas en pareja, prohibido vender 1 jarra suelta a 3€, cero excepciones), Lunes jarras Dorada Especial (50 cl) a 3€ (08:00-22:00), Miércoles Spritz (Aperol, Campari, Limoncello, Hugo) a 6€ (08:00-22:30), Viernes 2x1 en cócteles seleccionados (10:00-22:00), Domingos Mojitos a 5€ (08:00-22:30). Desactivadas en TPV las ofertas obsoletas de Cócteles Sunset y Spritz en domingo.",
            details: [
              { label: 'Happy Hour Diario', value: '15:00 - 16:00 h (2 cócteles 12€ ó 2 jarras 6€ · misma bebida obligatoria)' },
              { label: 'Calendario Semanal', value: 'Lunes (Jarras 3€), Miércoles (Spritz 6€), Viernes (2x1 cócteles), Domingo (Mojitos 5€)' },
              { label: 'Auditoría TPV', value: 'Bloqueadas teclas obsoletas de Cócteles Sunset y Spritz domingo' },
              { label: 'Punto de Venta', value: 'Bar / Terraza Diamond' }
            ]
          }
        )}

        {/* GESTOR AUTOMATIZADO DE PROMOCIONES Y HAPPY HOUR (EXCLUSIVO KLAYMAN DIAMOND) */}
        <PromotionsManagerView
          initialHotel="klayman-diamond"
          onOpenProductDetail={(prodId, nameFallback) => {
            const sheet = resolveTechnicalSheet(prodId, nameFallback);
            if (sheet) {
              handleOpenTechnicalSheetFromItem(sheet.id, nameFallback);
            }
          }}
          onOpenTechnicalSheet={(sheetId) => {
            handleOpenTechnicalSheetFromItem(sheetId);
          }}
        />

        {/* MODAL CON TODA LA INFORMACIÓN DE LA PROMOCIÓN SI APLICA */}
        {selectedPromotion && (
          <PromotionDetailModal
            promotion={selectedPromotion}
            onClose={() => setSelectedPromotion(null)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // CATEGORÍA 4: EVENTOS Y CALENDARIO OPERATIVO (FASE 8)
  // =========================================================================
  if (activeCategory === 'eventos') {
    return (
      <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-3.5 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Eventos & Calendario",
          "Agenda Operativa",
          Calendar,
          "text-purple-400",
          {
            title: "Agenda de Eventos y Sunset Sessions",
            module: "Eventos & Calendario",
            hotel: "Klayman Diamond Aparthotel",
            area: "Terraza Diamond",
            responsible: "Coordinación de Eventos F&B",
            summaryText: "Programación de eventos, música en vivo y Sunset Sessions en Bar / Terraza Diamond.",
            details: [
              { label: 'Hotel', value: 'Klayman Diamond' },
              { label: 'Ubicación', value: 'Terraza Sunset' }
            ]
          }
        )}

        {/* MÓDULO MAESTRO DE EVENTOS */}
        <EventsManagerView
          onOpenProductDetail={(prodId, nameFallback) => {
            const sheet = resolveTechnicalSheet(prodId, nameFallback);
            if (sheet) {
              handleOpenTechnicalSheetFromItem(sheet.id, nameFallback);
            }
          }}
          onOpenTechnicalSheet={(sheetId) => {
            handleOpenTechnicalSheetFromItem(sheetId);
          }}
          onOpenPromotion={(_promoId) => {
            setActiveCategory('promociones');
          }}
          onOpenProcedure={(procId) => {
            const proc = BAR_OFFICIAL_PROCEDURES.find(p => p.id === procId);
            if (proc) {
              setSelectedProcedure(proc);
              setActiveCategory('procedimientos');
            }
          }}
          onBack={() => setActiveCategory(null)}
        />
      </div>
    );
  }

  // =========================================================================
  // 5. CATEGORÍA 5: PROCEDIMIENTOS OPERATIVOS (BOTONES DESPLEGABLES EN DESTINO)
  // Sin contenido debajo: al tocar cada botón (Limpieza, Cierre, etc.) se abre dentro
  // =========================================================================
  if (activeCategory === 'procedimientos') {
    // Filtrado por buscador y categoría
    const filteredProcedures = proceduresList.filter((proc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        proc.title.toLowerCase().includes(q) ||
        proc.code.toLowerCase().includes(q) ||
        proc.responsible.toLowerCase().includes(q) ||
        proc.steps.some(s => 
          s.title.toLowerCase().includes(q) || 
          s.detail.toLowerCase().includes(q) || 
          (s.criticalCheck && s.criticalCheck.toLowerCase().includes(q))
        );

      if (!matchSearch) return false;
      if (procedureCategoryFilter === 'todos') return true;
      if (procedureCategoryFilter === 'operativo') return proc.category === 'operativo';
      if (procedureCategoryFilter === 'calidad') return proc.category === 'calidad';
      if (procedureCategoryFilter === 'seguridad') return proc.category === 'seguridad';
      return true;
    });

    const countTodos = proceduresList.length;
    const countOperativos = proceduresList.filter(p => p.category === 'operativo').length;
    const countCalidad = proceduresList.filter(p => p.category === 'calidad').length;
    const countSeguridad = proceduresList.filter(p => p.category === 'seguridad').length;

    const handleCopyProcedure = (proc: BarProcedureItem, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const requirementsText = (proc.requirements || []).map(r => `• ${r}`).join('\n');
      const stepsText = proc.steps.map(s => 
        `${String(s.order).padStart(2, '0')}. ${s.title}\n   ${s.detail}${s.criticalCheck ? `\n   [CONTROL CRÍTICO APPCC]: ${s.criticalCheck}` : ''}`
      ).join('\n\n');
      const safetyText = (proc.safetyNotes || []).map(n => `• ${n}`).join('\n');

      const text = `=== PROCEDIMIENTO OPERATIVO OFICIAL KLAYMAN DIAMOND ===
CÓDIGO: ${proc.code}
TÍTULO: ${proc.title}
CATEGORÍA: ${proc.category.toUpperCase()}
HORARIO / TIMING: ${proc.timing || 'Turno operativo'}
RESPONSABLE: ${proc.responsible}

${requirementsText ? `DOTACIÓN Y REQUISITOS PREVIOS:\n${requirementsText}\n\n` : ''}PASOS DE EJECUCIÓN PASO A PASO:
${stepsText}

${safetyText ? `\nPUNTOS CRÍTICOS DE SEGURIDAD & APPCC:\n${safetyText}\n` : ''}
HOTEL: Klayman Diamond Aparthotel · Bar / Terraza Diamond`;

      navigator.clipboard.writeText(text);
      setCopiedProcedureId(proc.id);
      setTimeout(() => setCopiedProcedureId(null), 2500);
    };

    const handleShareProcedure = (proc: BarProcedureItem, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setCurrentSharePayload({
        title: proc.title,
        module: 'SOPs y Procedimientos Operativos',
        hotel: 'Klayman Diamond Aparthotel',
        area: 'Bar / Terraza Diamond',
        responsible: proc.responsible,
        summaryText: `${proc.code}: ${proc.title}. Responsable: ${proc.responsible}. Timing: ${proc.timing || 'Continuo'}. Pasos: ${proc.steps.length}.`,
        details: [
          { label: 'Código SOP', value: proc.code },
          { label: 'Categoría', value: proc.category.toUpperCase() },
          { label: 'Timing', value: proc.timing || 'Turno operativo' },
          { label: 'Responsable', value: proc.responsible },
          { label: 'Total Pasos', value: `${proc.steps.length} pasos detallados` }
        ]
      });
      setIsShareOpen(true);
    };

    // Desplazamiento seguro y continuo que NO rebota hacia arriba
    const handleJumpToProcedure = (procId: string) => {
      setOpenProcedureId(procId);
      const proc = proceduresList.find(p => p.id === procId) || null;
      setSelectedProcedure(proc);

      setTimeout(() => {
        const el = document.getElementById(`proc-card-${procId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + currentScroll - 75;
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    return (
      <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 space-y-4 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "SOPs y Procedimientos",
          `${filteredProcedures.length} PROTOCOLOS`,
          FileCheck2,
          "text-sky-400",
          {
            title: "Manual de Procedimientos y Protocolos de Bar",
            module: "SOPs y Procedimientos Operativos",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Jefatura de Bar & F&B",
            summaryText: `Catálogo de 10 procedimientos normalizados de trabajo (SOP). Toca cualquier botón (Limpieza, Cierre, Apertura, Cambio de turno...) para abrir el protocolo completo dentro del botón.`,
            details: [
              { label: 'Total Protocolos', value: '10 SOPs oficiales' },
              { label: 'Operativos', value: `${countOperativos} de servicio y barra` },
              { label: 'Calidad & APPCC', value: `${countCalidad} de limpieza e inventario` },
              { label: 'Seguridad', value: `${countSeguridad} de incidencias` }
            ]
          }
        )}

        {/* CABECERA EXPLICATIVA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div>
            <h2 className="text-sm font-mono uppercase text-sky-400 font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Protocolos Operativos Bar & Terraza</span>
            </h2>
            <p className="text-[11px] text-stone-400 font-mono mt-0.5">
              Toca cualquier botón para abrir el procedimiento completo en su interior.
            </p>
          </div>
        </div>

        {/* BUSCADOR REACTIVO */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por procedimiento (Limpieza, Cierre, Turno...), código o tarea..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-sky-500/70 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-0.5"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* FILTROS SEGMENTADOS DE CATEGORÍAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-stone-900/80 rounded-2xl border border-stone-800 text-center">
          {[
            { id: 'todos', label: `Todos (${countTodos})` },
            { id: 'operativo', label: `Bar & Servicio (${countOperativos})` },
            { id: 'calidad', label: `Limpieza & APPCC (${countCalidad})` },
            { id: 'seguridad', label: `Seguridad (${countSeguridad})` }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setProcedureCategoryFilter(cat.id)}
              className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all truncate active:scale-[0.98] cursor-pointer ${
                procedureCategoryFilter === cat.id
                  ? 'bg-sky-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* LISTADO DE LOS 10 PROCEDIMIENTOS: LIMPIO, ORDENADO Y DIRECTO */}
        {filteredProcedures.length > 0 ? (
          <div className="space-y-3 pt-1">
            {filteredProcedures.map((proc) => {
              const isOpen = openProcedureId === proc.id;
              const isCopied = copiedProcedureId === proc.id;

              return (
                <div
                  key={proc.id}
                  id={`proc-card-${proc.id}`}
                  className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden shadow-md scroll-mt-24 ${
                    isOpen
                      ? 'border-sky-500 bg-stone-900/95 ring-2 ring-sky-500/20 shadow-sky-950/30'
                      : 'border-stone-800 bg-stone-900/80 hover:border-sky-500/50 hover:bg-stone-850/80'
                  }`}
                >
                  {/* BOTÓN Y CABECERA DEL PROCEDIMIENTO */}
                  <div
                    onClick={() => {
                      if (isOpen) {
                        setOpenProcedureId(null);
                      } else {
                        handleJumpToProcedure(proc.id);
                      }
                    }}
                    className="w-full p-4 sm:p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group active:scale-[0.995] transition-all"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (isOpen) setOpenProcedureId(null);
                        else handleJumpToProcedure(proc.id);
                      }
                    }}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                        isOpen
                          ? 'bg-sky-950 border-sky-400 text-sky-300 shadow-md ring-2 ring-sky-500/20'
                          : 'bg-stone-950 border-stone-800 text-stone-300 group-hover:border-sky-500/50 group-hover:text-white'
                      }`}>
                        {getProcedureIcon(proc.id)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                            isOpen
                              ? 'bg-sky-500 text-stone-950 border-sky-400'
                              : 'bg-sky-950/90 text-sky-300 border-sky-800'
                          }`}>
                            {proc.code}
                          </span>
                          <span className="text-xs font-mono font-semibold text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800">
                            {proc.steps.length} pasos
                          </span>
                          {proc.timing && (
                            <span className="text-xs font-mono text-amber-300 font-medium">
                              · {proc.timing}
                            </span>
                          )}
                        </div>
                        <h3 className={`font-display font-bold text-base sm:text-lg uppercase tracking-tight transition-colors ${
                          isOpen ? 'text-sky-300' : 'text-stone-100 group-hover:text-sky-200'
                        }`}>
                          {proc.title}
                        </h3>
                        <p className="text-xs font-mono text-stone-400 mt-0.5">
                          Responsable: <span className="text-stone-200 font-medium">{proc.responsible}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      {/* BOTÓN PARA MODIFICAR PARÁMETROS DE LA MESA */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProcedure(proc);
                          setIsEditProcedureModalOpen(true);
                        }}
                        className="px-3 sm:px-3.5 py-2 rounded-xl border border-sky-400/50 bg-sky-950/70 hover:bg-sky-500 hover:text-stone-950 text-sky-300 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95 group/btn"
                        title="Modificar parámetros de la mesa / protocolo"
                      >
                        <Pencil className="w-3.5 h-3.5 stroke-[2.5] text-sky-400 group-hover/btn:text-stone-950" />
                        <span>Modificar parámetros de la mesa</span>
                      </button>

                      {/* BOTÓN ABRIR / CERRAR */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isOpen) {
                            setOpenProcedureId(null);
                          } else {
                            handleJumpToProcedure(proc.id);
                          }
                        }}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 border ${
                          isOpen
                            ? 'bg-sky-500 text-stone-950 border-sky-400 ring-2 ring-sky-400/30'
                            : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-sky-500/60 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        <span>{isOpen ? 'Cerrar' : 'Abrir'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* DENTRO DE ESE BOTÓN: LO QUE TIENE QUE HABER CUANDO SE ABRE */}
                  {isOpen && (
                    <div className="border-t border-stone-800/80 bg-stone-950/85 p-4 sm:p-5 space-y-4 animate-fadeIn">
                      {/* BANNER EDITABLE DE PARÁMETROS DE LA MESA */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs font-mono">
                        <div className="flex items-center gap-2 text-sky-300">
                          <Pencil className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>Parámetros operativos de esta mesa / protocolo configurables (horarios, requisitos, pasos, responsable).</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProcedure(proc);
                            setIsEditProcedureModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold flex items-center justify-center gap-1.5 text-xs transition-colors shadow cursor-pointer shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Modificar parámetros</span>
                        </button>
                      </div>

                      {/* METADATOS Y HORARIO */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-400">Timing operativo:</span>
                          <strong className="text-amber-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {proc.timing || 'Continuo durante el turno'}
                          </strong>
                        </div>
                        <div className="text-stone-400">
                          Área: <strong className="text-stone-200">Bar / Terraza Diamond</strong>
                        </div>
                      </div>

                      {/* REQUISITOS PREVIOS Y DOTACIÓN */}
                      {proc.requirements && proc.requirements.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-stone-900 border border-emerald-900/40 space-y-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Requisitos Previos & Dotación Obligatoria:</span>
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {proc.requirements.map((req, rIdx) => (
                              <div key={rIdx} className="p-2 rounded-lg bg-stone-950/90 border border-stone-800 text-xs text-stone-300 flex items-center gap-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PASOS DE EJECUCIÓN DETALLADOS */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                            <ListOrdered className="w-4 h-4 text-sky-400" />
                            <span>Pasos de Ejecución Detallados ({proc.steps.length} pasos):</span>
                          </h4>
                          <span className="text-[10px] font-mono text-stone-500">
                            Protocolo oficial de trabajo
                          </span>
                        </div>

                        <ol className="space-y-2.5">
                          {proc.steps.map((st) => (
                            <li
                              key={st.order}
                              className="p-3 sm:p-3.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-sky-500/40 transition-colors flex items-start gap-3 text-xs text-stone-300 shadow-sm"
                            >
                              <span className="font-mono font-bold text-sky-300 bg-sky-950/90 px-2 py-0.5 rounded-lg border border-sky-800 shrink-0 text-xs">
                                {String(st.order).padStart(2, '0')}
                              </span>
                              <div className="space-y-1 flex-1 min-w-0">
                                <span className="font-display font-bold text-sm text-stone-100 block">
                                  {st.title}
                                </span>
                                <p className="text-stone-300 leading-relaxed font-sans text-xs">
                                  {st.detail}
                                </p>
                                {st.criticalCheck && (
                                  <div className="mt-2 p-2 rounded-lg bg-amber-950/40 border border-amber-600/60 text-amber-200 text-xs font-mono flex items-start gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-amber-300 block">Control Crítico (APPCC):</span>
                                      <span>{st.criticalCheck}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* NOTAS DE SEGURIDAD & APPCC */}
                      {proc.safetyNotes && proc.safetyNotes.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-2">
                          <span className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-400" />
                            <span>Puntos Críticos de Seguridad, Prevención & APPCC:</span>
                          </span>
                          <ul className="space-y-1.5 pl-1">
                            {proc.safetyNotes.map((note, idx) => (
                              <li key={idx} className="text-xs text-stone-300 flex items-start gap-2">
                                <span className="text-amber-400 font-bold mt-0.5">•</span>
                                <span className="leading-relaxed">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* BOTÓN ESPECIAL SI ES CIERRE DE CAJA */}
                      {proc.id === 'proc-cierre-caja' && (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 flex-wrap">
                          <div className="text-xs font-mono text-emerald-300">
                            <strong>¿Vas a registrar el Cierre Z ahora?</strong> Accede al formulario digital interactivo.
                          </div>
                          <button
                            onClick={() => setActiveCategory('cierre_caja')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 shrink-0"
                          >
                            <Receipt className="w-4 h-4" />
                            <span>Abrir Módulo Cierre de Caja →</span>
                          </button>
                        </div>
                      )}

                      {/* BARRA DE ACCIONES INFERIOR DEL BOTÓN */}
                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleCopyProcedure(proc, e)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 border ${
                              isCopied
                                ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                                : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-800'
                            }`}
                            title="Copiar texto completo del protocolo"
                          >
                            {isCopied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? '¡Copiado!' : 'Copiar Procedimiento'}</span>
                          </button>

                          <button
                            onClick={(e) => handleShareProcedure(proc, e)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 border border-amber-500/30"
                            title="Compartir por WhatsApp, PDF o enlace"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Compartir</span>
                          </button>
                        </div>

                        <button
                          onClick={() => setOpenProcedureId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-mono transition-colors active:scale-95 border border-stone-800"
                        >
                          Cerrar Procedimiento ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-stone-900/60 border border-stone-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-stone-600 mx-auto" />
            <h3 className="text-sm font-mono text-stone-300 font-bold uppercase">No se encontraron procedimientos</h3>
            <p className="text-xs font-mono text-stone-500 max-w-sm mx-auto">
              No hay protocolos que coincidan con "{searchQuery}". Restablece la búsqueda para ver los 10 procedimientos.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setProcedureCategoryFilter('todos'); }}
              className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 6. CATEGORÍA 5: INFORMACIÓN PARA EL PUESTO (MOBILE-FIRST)
  // =========================================================================
  if (activeCategory === 'puesto') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Información del Puesto",
          "Manual Operativo",
          Info,
          "text-purple-400",
          {
            title: "Manual Operativo de Puesto",
            module: "Información del Puesto",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Jefatura de Sala & F&B",
            summaryText: "Información operativa del puesto de trabajo: Funciones, turnos, uniformidad, extensiones telefónicas y servicio al huésped.",
            details: [
              { label: 'Hotel', value: 'Klayman Diamond' },
              { label: 'Puesto', value: 'Bar / Terraza Sunset' }
            ]
          }
        )}

        {/* PANEL INFORMATIVO DESTACADO: PROTOCOLO TPV ÁGORA (LIMPIEZA DE REGLAS Y TECLAS) */}
        <div className="space-y-3">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-stone-900 to-stone-950 border border-purple-800/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/80 border border-purple-700/80 text-purple-300 flex items-center justify-center shrink-0 shadow-inner">
                <Monitor className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    Ágora Back-Office
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    Depuración de Promociones Antiguas
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Riesgo 0%
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-display font-bold text-stone-100">
                  Limpieza de Reglas de Precios y Modificación de Teclas en el TPV
                </h3>
                <p className="text-xs text-stone-400">
                  Desactiva las reglas de precio obsoletas (Sunset viernes y Spritz domingo) y depura las botoneras para que el equipo no encuentre registros de promociones antiguas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTpvCleanupPanel(!showTpvCleanupPanel)}
              className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-700 text-purple-200 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-center shrink-0"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{showTpvCleanupPanel ? 'Ocultar Panel TPV' : 'Desplegar Panel TPV'}</span>
            </button>
          </div>

          {/* COMPONENTE INTERACTIVO DE GUÍA DE LIMPIEZA TPV */}
          {showTpvCleanupPanel && (
            <TpvCleanRulesGuidePanel />
          )}
        </div>

        {/* LISTADO LIMPIO: SOLO TÍTULOS EN CUADRÍCULA MOBILE-FIRST */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {PUESTO_TOPICS.map((topic, idx) => {
            const Icon = topic.icon;
            const isLast = idx === PUESTO_TOPICS.length - 1;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedPuestoTopic(topic)}
                className={`p-3.5 sm:p-4 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-purple-500/70 active:bg-stone-850 active:scale-[0.98] transition-all text-left flex items-center justify-between gap-2 group shadow-sm min-h-[64px] ${
                  isLast ? 'col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/70 border border-purple-800/80 text-purple-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-display font-bold text-xs sm:text-sm text-stone-100 group-hover:text-purple-300 transition-colors uppercase truncate">
                      {topic.shortTitle || topic.title}
                    </h3>
                    <span className="text-[9px] font-mono text-purple-400/90 block leading-tight">
                      {topic.tag}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-purple-400 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* MODAL CON EL CONTENIDO COMPLETO */}
        {selectedPuestoTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-4">
              {/* CABECERA */}
              <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/90 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                    {selectedPuestoTopic.tag}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100">
                    {selectedPuestoTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedPuestoTopic(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CONTENIDO */}
              <div className="p-4 sm:p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-850">
                  {selectedPuestoTopic.summary}
                </p>

                {selectedPuestoTopic.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold border-b border-stone-800 pb-1">
                      {sec.heading}
                    </h4>
                    <div className="space-y-1.5">
                      {sec.items.map((it, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-stone-950 border border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <span className="text-stone-400 font-mono text-[11px]">{it.label}:</span>
                          <span className={`font-semibold ${it.highlight ? 'text-emerald-400 font-bold' : 'text-stone-200'}`}>
                            {it.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    {sec.notes && (
                      <p className="text-[10px] font-mono text-stone-400 italic pt-0.5">
                        * {sec.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* PIE DEL MODAL */}
              <div className="p-3 sm:p-4 border-t border-stone-800 bg-stone-950/90 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-stone-500 truncate">
                  Operativa de Puesto · Klayman Diamond
                </span>
                <div className="flex items-center gap-2">
                  {selectedPuestoTopic.id === 'puesto-limpieza-tpv' && (
                    <button
                      onClick={() => {
                        setSelectedPuestoTopic(null);
                        setShowTpvCleanupPanel(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-stone-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Abrir Guía Interactiva TPV</span>
                    </button>
                  )}
                  {selectedPuestoTopic.id === 'puesto-caja-tpv' && (
                    <button
                      onClick={() => {
                        setSelectedPuestoTopic(null);
                        setActiveCategory('cierre_caja');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Abrir Cierre de Caja</span>
                    </button>
                  )}
                  {selectedPuestoTopic.id === 'puesto-cristaleria' && (
                    <button
                      onClick={() => {
                        setSelectedPuestoTopic(null);
                        setActiveCategory('fichas');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                    >
                      <Wine className="w-3.5 h-3.5" />
                      <span>Ver Catálogo de Fichas</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPuestoTopic(null)}
                    className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono font-bold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 7. MÓDULO OPERATIVO: CIERRE DE CAJA
  // =========================================================================
  if (activeCategory === 'cierre_caja') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 pb-28 animate-fadeIn">
        {renderModuleHeader(
          "Cierre de Caja Diario",
          "Arqueo & TPV",
          Receipt,
          "text-emerald-400",
          {
            title: "Cierre de Caja y Arqueo Diario",
            module: "Cierre de Caja",
            hotel: "Klayman Diamond Aparthotel",
            area: "Bar / Terraza Diamond",
            responsible: "Responsable de Caja / Turno",
            summaryText: "Procedimiento oficial de cierre de caja, arqueo ciego, datáfono, desglose de monedas y billetes, e informe Z de Ágora ERP.",
            details: [
              { label: 'Hotel', value: 'Klayman Diamond' },
              { label: 'Área', value: 'Bar / Terraza Diamond' },
              { label: 'Protocolo', value: 'Arqueo de caja & Informe Z' }
            ]
          }
        )}

        {/* COMPONENTE OFICIAL DE CIERRE DE CAJA CON PERSISTENCIA Y LIGHTBOX */}
        <CashRegisterBankView
          hotelId="klayman-diamond"
          hotelName="KLAYMAN DIAMOND"
          defaultOutletName="Bar / Terraza Diamond"
        />
      </div>
    );
  }

    return null;
  };

  return (
    <>
      {renderCategoryContent()}

      {/* MODAL UNIVERSAL DE COMPARTIR */}
      {isShareOpen && currentSharePayload && (
        <UniversalShareModal
          payload={currentSharePayload}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* MODAL DETALLE DE FICHA TÉCNICA A PANTALLA COMPLETA */}
      {isCocktailModalOpen && selectedCocktail && (
        <CocktailDetailModal
          sheet={selectedCocktail}
          onClose={() => setIsCocktailModalOpen(false)}
        />
      )}

      {/* MODAL SIMULADOR DE ESCANDALLOS Y PRECIOS ÁGORA */}
      {isSimulatorOpen && simulatorSheet && (
        <EscandalloSimulatorModal
          sheet={simulatorSheet}
          onClose={() => {
            setIsSimulatorOpen(false);
            setSimulatorSheet(null);
          }}
        />
      )}

      {/* MODAL PARA MODIFICAR PARÁMETROS DE LA MESA / PROTOCOLO */}
      {isEditProcedureModalOpen && editingProcedure && (
        <EditProcedureModal
          isOpen={isEditProcedureModalOpen}
          procedure={editingProcedure}
          onClose={() => {
            setIsEditProcedureModalOpen(false);
            setEditingProcedure(null);
          }}
          onSave={handleSaveProcedureParameters}
          onResetToDefault={handleResetProcedureToDefault}
        />
      )}

      {/* LIGHTBOX DE FOTOGRAFÍA AMPLIADA */}
      {activePhotoZoom && (
        <div 
          onClick={() => setActivePhotoZoom(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-stone-700 shadow-2xl">
            <img src={activePhotoZoom} alt="Fotografía en grande" className="w-full h-full object-contain" />
            <button 
              onClick={() => setActivePhotoZoom(null)} 
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* MENÚ SECUNDARIO DE MÓDULOS (DRAWER DESLIZANTE ☰ MENÚ) */}
      {isQuickMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm h-full bg-stone-900 border-l border-stone-800 p-5 overflow-y-auto space-y-4 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-850">
                <div className="flex items-center gap-2">
                  <Wine className="w-5 h-5 text-amber-400" />
                  <span className="font-display font-bold text-stone-100 text-sm uppercase">
                    Módulos Operativos Bar
                  </span>
                </div>
                <button
                  onClick={() => setIsQuickMenuOpen(false)}
                  className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-stone-400 font-mono mt-2 mb-3">
                Cambio directo de módulo sin pasar por inicio:
              </p>

              <div className="space-y-1.5">
                {[
                  { id: 'procedimientos', label: '📋 SOPs & Procedimientos', tag: 'Protocolos', icon: FileCheck2, color: 'text-sky-400' },
                  { id: 'cartas', label: '🍸 Cartas & Menús', tag: 'Ágora ERP', icon: Wine, color: 'text-amber-400' },
                  { id: 'fichas', label: `📑 Fichas Técnicas (${diamondSheets.length})`, tag: 'IBA 2026', icon: FileText, color: 'text-emerald-400' },
                  { id: 'promociones', label: '🎯 Promociones & Happy Hour', tag: '15-16h', icon: Tag, color: 'text-amber-400' },
                  { id: 'control_operativo', label: '✅ Control Operativo', tag: 'APPCC', icon: ClipboardCheck, color: 'text-emerald-400' },
                  { id: 'cierre_caja', label: '💰 Cierre de Caja', tag: 'Arqueo & Z', icon: Receipt, color: 'text-emerald-400' },
                  { id: 'direccion_fb', label: '👔 Dirección F&B', tag: 'Consola', icon: Sparkles, color: 'text-amber-400' },
                  { id: 'eventos', label: '📅 Eventos & Calendario', tag: 'Sunset', icon: Calendar, color: 'text-purple-400' },
                  { id: 'puesto', label: 'ℹ️ Información Puesto', tag: 'Manual', icon: Info, color: 'text-stone-300' }
                ].map(mod => {
                  const Icon = mod.icon;
                  const isActive = activeCategory === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveCategory(mod.id as BarCategory);
                        setSearchQuery('');
                        setIsQuickMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                          : 'bg-stone-950/60 border-stone-850 hover:bg-stone-850 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 ${mod.color} shrink-0`} />
                        <span className="text-xs truncate">{mod.label}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800 shrink-0">
                        {mod.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setIsQuickMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-xs font-mono font-bold text-amber-400 text-center transition-colors"
              >
                ← Volver al Dashboard Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
