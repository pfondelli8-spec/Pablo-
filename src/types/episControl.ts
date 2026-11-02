export type EpiStatus = 'en_garantia' | 'requiere_reposicion' | 'repuesto';

export interface EpiItemCheck {
  id: string;
  name: string;
  category: 'corte' | 'termico' | 'quimico' | 'calzado' | 'ocular' | 'higiene' | 'auditivo';
  description: string;
  standardNorm: string; // ej. EN 388, EN 407, EN ISO 20345
  status: EpiStatus;
  expirationOrWarrantyDate?: string;
  notes?: string;
}

export interface MonthlyEpisRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  stationKey: string;
  stationName: string;
  periodMonth: string; // YYYY-MM
  periodLabel: string; // ej. "Noviembre 2026"
  checkDate: string; // YYYY-MM-DD
  inspectorName: string;
  inspectorRole: string;
  signatureDataUrl?: string;
  signatureTimestamp: string;
  overallStatus: 'en_garantia' | 'requiere_reposicion' | 'revisado';
  replacementRequested: boolean;
  replacementNotes?: string;
  items: EpiItemCheck[];
  createdAt: string;
}
