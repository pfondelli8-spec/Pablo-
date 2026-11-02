import { MonthlyEpisRecord, EpiItemCheck } from '../types/episControl';

const STORAGE_KEY = 'proa_monthly_epis_records_v1';

export const STANDARD_EPI_CATALOG: EpiItemCheck[] = [
  {
    id: 'epi-01',
    name: 'Guantes de malla de acero inoxidable',
    category: 'corte',
    description: 'Guante de cinco dedos en acero AISI 316L con cinta ajustable. Uso obligatorio en despiece, fileteado y cortes de alto riesgo.',
    standardNorm: 'EN 1082-1 / CE Cat II',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-06-30',
    notes: 'Malla íntegra sin deformaciones ni eslabones rotos. Cierre de muñeca operativo.'
  },
  {
    id: 'epi-02',
    name: 'Guantes térmicos para hornos y calor de contacto',
    category: 'termico',
    description: 'Guantes de fibra para-aramida con forro térmico. Protección garantizada frente a contacto térmico hasta 250°C-350°C.',
    standardNorm: 'EN 407 (42XXXX) / EN 388',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-04-15',
    notes: 'Superficie sin quemaduras profundas ni pérdida de densidad aislante.'
  },
  {
    id: 'epi-03',
    name: 'Calzado de seguridad antideslizante con puntera',
    category: 'calzado',
    description: 'Zapato/zueco ergonómico de cocina con suela antideslizante SRC de poliuretano y puntera de protección frente a impactos de 200J.',
    standardNorm: 'EN ISO 20345:2011 S2 SRC',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-08-01',
    notes: 'Relieve de suela con dibujo superior al mínimo legal. Sin desprendimientos.'
  },
  {
    id: 'epi-04',
    name: 'Delantal impermeable de PVC / Malla protectora',
    category: 'corte',
    description: 'Mandil de alta resistencia para operaciones de despiece, lavado a presión y corte con cuchillos manuales.',
    standardNorm: 'EN ISO 13998 Nivel 2',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-03-31',
    notes: 'Arneses y cinchas elásticas en perfecto estado de ajuste.'
  },
  {
    id: 'epi-05',
    name: 'Pantalla facial y gafas panorámicas de seguridad',
    category: 'ocular',
    description: 'Protección ocular completa contra salpicaduras de líquidos cáusticos, detergentes clorados y desincrustantes químicos de L+D.',
    standardNorm: 'EN 166 (Campo 3 gotas y salpicaduras)',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-10-10',
    notes: 'Visor transparente sin rayaduras que impidan la correcta visión.'
  },
  {
    id: 'epi-06',
    name: 'Guantes de nitrilo reforzado para dosificación química',
    category: 'quimico',
    description: 'Guante de puño largo estanco para recambio de garrafas de lavavajillas, desengrasantes y túneles de lavado.',
    standardNorm: 'EN ISO 374-1 Tipo A (AJKLPT)',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-01-30',
    notes: 'Estanqueidad comprobada mediante prueba de inflado previa.'
  },
  {
    id: 'epi-07',
    name: 'Protectores auditivos / tapones de atenuación acústica',
    category: 'auditivo',
    description: 'Atenuación acústica (SNR 28-32 dB) para personal expuesto en barmitonio, trenes de lavado continuo y turbinas de extracción.',
    standardNorm: 'EN 352-1 / EN 352-2',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-12-31',
    notes: 'Almohadillas limpias y diadema elástica con presión homologada.'
  },
  {
    id: 'epi-08',
    name: 'Gorros y mallas higiénicas cubre-cabello / cubre-barba',
    category: 'higiene',
    description: 'Prendas desechables o lavables de contención capilar estricta según normativa higiénico-sanitaria APPCC.',
    standardNorm: 'Reglamento (CE) 852/2004 Higiene Alimentaria',
    status: 'en_garantia',
    expirationOrWarrantyDate: '2027-12-31',
    notes: 'Dispensadores abastecidos en acceso a zona de manipulación.'
  }
];

const SEED_RECORDS: MonthlyEpisRecord[] = [
  {
    id: 'epis-bitacora-2026-10',
    hotelId: 'model-bitacora',
    hotelName: 'Hotel Bitácora · 4★ Superior',
    stationKey: 'general_cocina',
    stationName: 'Cocina & Buffet Central',
    periodMonth: '2026-10',
    periodLabel: 'Octubre 2026',
    checkDate: '2026-10-05',
    inspectorName: 'Antonio González',
    inspectorRole: 'Chef Ejecutivo de Cocina',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><path d="M10 25 Q30 5 60 20 T110 15 T150 25" fill="none" stroke="%230f766e" stroke-width="2.5"/></svg>',
    signatureTimestamp: '2026-10-05T10:15:00Z',
    overallStatus: 'en_garantia',
    replacementRequested: false,
    replacementNotes: 'Inspección mensual conforme. Todos los equipos de protección individual se encuentran dentro del periodo de garantía del fabricante y en condiciones óptimas.',
    items: STANDARD_EPI_CATALOG.map(i => ({ ...i })),
    createdAt: '2026-10-05T10:15:00Z'
  },
  {
    id: 'epis-bitacora-2026-11',
    hotelId: 'model-bitacora',
    hotelName: 'Hotel Bitácora · 4★ Superior',
    stationKey: 'general_cocina',
    stationName: 'Cocina & Buffet Central',
    periodMonth: '2026-11',
    periodLabel: 'Noviembre 2026',
    checkDate: '2026-11-01',
    inspectorName: 'Antonio González',
    inspectorRole: 'Chef Ejecutivo de Cocina',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><path d="M10 25 Q30 5 60 20 T110 15 T150 25" fill="none" stroke="%230f766e" stroke-width="2.5"/></svg>',
    signatureTimestamp: '2026-11-01T08:30:00Z',
    overallStatus: 'en_garantia',
    replacementRequested: false,
    replacementNotes: 'Revisión mensual de inicio de mes. Guantes de malla y calzado certificados. Stock de reposición verificado en almacén de partida.',
    items: STANDARD_EPI_CATALOG.map(i => ({ ...i })),
    createdAt: '2026-11-01T08:30:00Z'
  },
  {
    id: 'epis-vulcano-2026-10',
    hotelId: 'model-vulcano',
    hotelName: 'Hotel Vulcano · 4★ Superior',
    stationKey: 'general_cocina',
    stationName: 'Cocina & Buffet Central',
    periodMonth: '2026-10',
    periodLabel: 'Octubre 2026',
    checkDate: '2026-10-04',
    inspectorName: 'Giacomo Longo',
    inspectorRole: 'Chef Ejecutivo Titular',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><path d="M10 20 Q40 30 70 10 T120 25 T150 18" fill="none" stroke="%23047857" stroke-width="2.5"/></svg>',
    signatureTimestamp: '2026-10-04T09:40:00Z',
    overallStatus: 'en_garantia',
    replacementRequested: false,
    replacementNotes: 'Control mensual validado según estándar higiénico APPCC y plan de prevención de riesgos laborales.',
    items: STANDARD_EPI_CATALOG.map(i => ({ ...i })),
    createdAt: '2026-10-04T09:40:00Z'
  },
  {
    id: 'epis-vulcano-2026-11',
    hotelId: 'model-vulcano',
    hotelName: 'Hotel Vulcano · 4★ Superior',
    stationKey: 'general_cocina',
    stationName: 'Cocina & Buffet Central',
    periodMonth: '2026-11',
    periodLabel: 'Noviembre 2026',
    checkDate: '2026-11-01',
    inspectorName: 'Giacomo Longo',
    inspectorRole: 'Chef Ejecutivo Titular',
    signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><path d="M10 20 Q40 30 70 10 T120 25 T150 18" fill="none" stroke="%23047857" stroke-width="2.5"/></svg>',
    signatureTimestamp: '2026-11-01T09:00:00Z',
    overallStatus: 'en_garantia',
    replacementRequested: false,
    replacementNotes: 'Parque de EPIs en garantía y plenamente operativo. Repuesto 1 par de guantes térmicos para hornos de repostería.',
    items: STANDARD_EPI_CATALOG.map(i => ({ ...i })),
    createdAt: '2026-11-01T09:00:00Z'
  }
];

export const episAppccService = {
  getRecords(): MonthlyEpisRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading EPIs from localStorage:', e);
    }
    // Seed and persist initial records
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RECORDS));
    } catch {}
    return [...SEED_RECORDS];
  },

  getRecordsForFilter(hotelId?: string, stationKey?: string): MonthlyEpisRecord[] {
    const all = this.getRecords();
    return all.filter(r => {
      const matchesHotel = !hotelId || r.hotelId === hotelId;
      const matchesStation = !stationKey || r.stationKey === stationKey || r.stationKey === 'general_cocina';
      return matchesHotel && matchesStation;
    }).sort((a, b) => b.checkDate.localeCompare(a.checkDate));
  },

  getLatestRecord(hotelId: string, stationKey?: string): MonthlyEpisRecord | null {
    const records = this.getRecordsForFilter(hotelId, stationKey);
    return records.length > 0 ? records[0] : null;
  },

  saveRecord(record: Omit<MonthlyEpisRecord, 'id' | 'createdAt'>): MonthlyEpisRecord {
    const all = this.getRecords();
    const newRecord: MonthlyEpisRecord = {
      ...record,
      id: `epis-${record.hotelId}-${record.periodMonth}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };

    // Remove existing record for the exact same hotel + station + period if it exists to allow re-signing/updating
    const filtered = all.filter(
      r => !(r.hotelId === record.hotelId && r.stationKey === record.stationKey && r.periodMonth === record.periodMonth)
    );

    const updated = [newRecord, ...filtered];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving EPIs record:', e);
    }
    return newRecord;
  },

  getDefaultCatalog(): EpiItemCheck[] {
    return STANDARD_EPI_CATALOG.map(i => ({ ...i }));
  }
};
