/**
 * SERVICIO DE EXPEDIENTE Y CARPETA DOCUMENTAL ACUMULATIVA APPCC
 * Almacena y consolida todos los registros operativos agrupados por:
 * 1. Hotel (Aislamiento total Hotel Bitácora vs Hotel Vulcano)
 * 2. Departamento (Cocina, Sala, Bares, Piscinas, Mantenimiento)
 * 3. Familia Sanitaria (Temperaturas con Temperaturas, Limpieza con Limpieza, Checklists, Caducidades, Incidencias)
 * Permite control acumulativo histórico, verificación del jefe de departamento y auditorías sanitarias oficiales.
 */

export type DossierFamily = 
  | 'temperaturas' 
  | 'limpieza' 
  | 'checklists' 
  | 'caducidades' 
  | 'incidencias';

export interface DossierRecord {
  id: string;
  hotelId: string;
  departmentId: string;
  departmentName: string;
  family: DossierFamily;
  familyLabel: string;
  timestamp: string; // ISO
  formattedDate: string;
  formattedTime: string;
  areaKey: string;
  areaName: string;
  itemName: string;
  readingValue?: string; // e.g. "2.4 °C", "Realizado conforme", "78.0 °C"
  targetRange?: string; // e.g. "0 °C a 4 °C", "> 65 °C", "Diaria"
  status: 'conforme' | 'desviacion' | 'critico';
  operatorName: string;
  operatorRole: string;
  correctiveAction?: string;
  shift: 'manana' | 'tarde' | 'noche';
  supervisionStatus: 'pendiente' | 'validado_jefe';
  supervisedBy?: string;
  supervisedAt?: string;
  supervisionNotes?: string;
  evidenceUrl?: string;
}

export const DOSSIER_FAMILIES_META: Record<DossierFamily, {
  key: DossierFamily;
  label: string;
  icon: string;
  badgeColor: string;
  description: string;
}> = {
  temperaturas: {
    key: 'temperaturas',
    label: 'Control de Temperaturas (APPCC)',
    icon: 'Thermometer',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Cámaras frigoríficas, congeladores, vitrinas de buffet caliente (>65°C) y abatidores de temperatura.'
  },
  limpieza: {
    key: 'limpieza',
    label: 'Plan de Limpieza y Desinfección (L+D)',
    icon: 'Sparkles',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Registros de desinfección diaria de superficies, planchas, hornos, campanas y menaje de cocina.'
  },
  checklists: {
    key: 'checklists',
    label: 'Listas de Comprobación y Verificación',
    icon: 'ClipboardCheck',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Inspecciones higiénicas de apertura de turno, pase de servicio, cambio de aceite y cierre higiénico.'
  },
  caducidades: {
    key: 'caducidades',
    label: 'Trazabilidad y Caducidades Secundarias',
    icon: 'Calendar',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Etiquetado de apertura de productos perecederos, números de lote y control de horas límite de consumo.'
  },
  incidencias: {
    key: 'incidencias',
    label: 'Incidencias y Acciones Correctoras',
    icon: 'AlertTriangle',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Desviaciones detectadas, no conformidades, medidas inmediatas adoptadas y visto bueno de jefatura.'
  }
};

// Generador de registros iniciales realistas para demostración e inspección
const generateInitialDossier = (_hotelId: string): DossierRecord[] => [];

export const cumulativeFolderService = {
  // Obtener todos los registros del expediente para un hotel
  getRecordsForHotel: (hotelId: string): DossierRecord[] => {
    try {
      const storageKey = `proa_dossier_records_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    const initials = generateInitialDossier(hotelId);
    try {
      localStorage.setItem(`proa_dossier_records_${hotelId}`, JSON.stringify(initials));
    } catch {}
    return initials;
  },

  // Añadir un nuevo registro acumulativo
  addRecord: (
    hotelId: string,
    record: Omit<DossierRecord, 'id' | 'timestamp' | 'formattedDate' | 'formattedTime' | 'supervisionStatus'>
  ): DossierRecord => {
    const current = cumulativeFolderService.getRecordsForHotel(hotelId);
    const now = new Date();
    const newEntry: DossierRecord = {
      ...record,
      id: `dos-${hotelId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      formattedDate: now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      formattedTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      supervisionStatus: 'pendiente'
    };

    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(`proa_dossier_records_${hotelId}`, JSON.stringify(updated));
    } catch {}
    return newEntry;
  },

  // Firma y validación por el Jefe de Departamento / Administrador
  signOffRecord: (
    hotelId: string,
    recordId: string,
    chiefName: string,
    notes?: string
  ): DossierRecord[] => {
    const current = cumulativeFolderService.getRecordsForHotel(hotelId);
    const updated = current.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          supervisionStatus: 'validado_jefe' as const,
          supervisedBy: chiefName,
          supervisedAt: new Date().toISOString(),
          supervisionNotes: notes || 'Conforme según auditoría de supervisión presencial.'
        };
      }
      return rec;
    });

    try {
      localStorage.setItem(`proa_dossier_records_${hotelId}`, JSON.stringify(updated));
    } catch {}
    return updated;
  },

  // Firma masiva de todos los registros pendientes de una familia
  signOffAllPending: (
    hotelId: string,
    family: DossierFamily | 'all',
    chiefName: string
  ): DossierRecord[] => {
    const current = cumulativeFolderService.getRecordsForHotel(hotelId);
    const nowIso = new Date().toISOString();
    const updated = current.map(rec => {
      if ((family === 'all' || rec.family === family) && rec.supervisionStatus === 'pendiente') {
        return {
          ...rec,
          supervisionStatus: 'validado_jefe' as const,
          supervisedBy: chiefName,
          supervisedAt: nowIso,
          supervisionNotes: 'Validación en bloque de expediente por Jefatura.'
        };
      }
      return rec;
    });

    try {
      localStorage.setItem(`proa_dossier_records_${hotelId}`, JSON.stringify(updated));
    } catch {}
    return updated;
  }
};
