export interface BarProcedureItem {
  id: string;
  code: string;
  title: string;
  category: 'operativo' | 'seguridad' | 'calidad';
  timing?: string;
  responsible: string;
  steps: {
    order: number;
    title: string;
    detail: string;
    criticalCheck?: string;
  }[];
  safetyNotes?: string[];
  requirements?: string[];
}

export const BAR_OFFICIAL_PROCEDURES: BarProcedureItem[] = [];
