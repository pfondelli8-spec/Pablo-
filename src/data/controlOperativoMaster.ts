/**
 * FASE 11 – BASE DE DATOS Y GESTIÓN DE CONTROL OPERATIVO
 * Klayman Hospitality Management (Diamond & Olivina)
 */

import { ChecklistRecord, ChecklistItemDef, TipoChecklist, ControlOperativoStats } from '../types/controlOperativo';

const STORAGE_KEY = 'klayman_control_operativo_data';

// ============================================================================
// PLANTILLAS OFICIALES DE CHECKLISTS
// ============================================================================

export const CHECKLIST_TEMPLATES: Record<TipoChecklist, {
  titulo: string;
  descripcion: string;
  items: Omit<ChecklistItemDef, 'checked'>[];
}> = {
  // 1. CHECKLIST APERTURA (OBLIGATORIO SEGÚN BRIEF)
  apertura: {
    titulo: 'Checklist de Apertura de Barra y Terraza',
    descripcion: 'Puesta a punto matinal obligatoria antes de atender al primer huésped.',
    items: [
      { id: 'ap-1', label: 'Limpieza realizada', required: true, category: 'Higiene' },
      { id: 'ap-2', label: 'Mise en place completa', required: true, category: 'Producción' },
      { id: 'ap-3', label: 'Hielo disponible', required: true, category: 'Stock' },
      { id: 'ap-4', label: 'Cámaras verificadas', required: true, category: 'Frío' },
      { id: 'ap-5', label: 'TPV operativo', required: true, category: 'Tecnología' },
      { id: 'ap-6', label: 'Fondo de caja recibido', required: true, category: 'Caja' },
      { id: 'ap-7', label: 'Cristalería preparada', required: true, category: 'Servicio' },
      { id: 'ap-8', label: 'Música ambiente', required: false, category: 'Ambiente' },
      { id: 'ap-9', label: 'Terraza preparada', required: true, category: 'Instalaciones' }
    ]
  },

  // 2. CHECKLIST CIERRE (OBLIGATORIO SEGÚN BRIEF)
  cierre: {
    titulo: 'Checklist de Cierre de Turno y Caja',
    descripcion: 'Verificación exhaustiva de cierre nocturno, recogida de terraza y cuadre fiscal.',
    items: [
      { id: 'ci-1', label: 'Limpieza realizada', required: true, category: 'Higiene' },
      { id: 'ci-2', label: 'Reposición realizada', required: true, category: 'Stock' },
      { id: 'ci-3', label: 'Cámaras cerradas', required: true, category: 'Seguridad' },
      { id: 'ci-4', label: 'Caja cerrada', required: true, category: 'Caja' },
      { id: 'ci-5', label: 'Ticket Z adjunto', required: true, category: 'Fiscal' },
      { id: 'ci-6', label: 'Incidencias comunicadas', required: false, category: 'Operativa' },
      { id: 'ci-7', label: 'Terraza recogida', required: true, category: 'Instalaciones' },
      { id: 'ci-8', label: 'Basuras retiradas', required: true, category: 'Higiene' }
    ]
  },

  // 3. AUDITORÍA APPCC
  appcc: {
    titulo: 'Auditoría Higiénico-Sanitaria APPCC',
    descripcion: 'Control de puntos críticos de control higiénico según normativa sanitaria europea.',
    items: [
      { id: 'ap-p1', label: 'Temperaturas de conservación lácteos y perecederos (< 4ºC)', required: true, category: 'Frío' },
      { id: 'ap-p2', label: 'Control de congelación de pulpas y fruta (-18ºC)', required: true, category: 'Frío' },
      { id: 'ap-p3', label: 'Rotación y etiquetado secundario FIFO al día', required: true, category: 'Trazabilidad' },
      { id: 'ap-p4', label: 'Desinfección de superficies y bayetas por código de color', required: true, category: 'Desinfección' },
      { id: 'ap-p5', label: 'Lavavasos con ciclo térmico de aclarado a > 65ºC verificado', required: true, category: 'Vajilla' },
      { id: 'ap-p6', label: 'Control de alérgenos y estación libre de contaminación cruzada', required: true, category: 'Alérgenos' }
    ]
  },

  // 4. REVISIONES HIGIÉNICO-SANITARIAS
  higienico_sanitario: {
    titulo: 'Revisión Higiénico-Sanitaria de Instalaciones',
    descripcion: 'Inspección de orden, manipulación de alimentos y estado de las dependencias.',
    items: [
      { id: 'hs-1', label: 'Uniformidad impecable, pelo recogido y carnet manipulador al día', required: true, category: 'Personal' },
      { id: 'hs-2', label: 'Dispensadores de jabón bactericida y papel secamanos abastecidos', required: true, category: 'Higiene' },
      { id: 'hs-3', label: 'Cubos de residuos con tapa accionada por pedal y bolsas cerradas', required: true, category: 'Residuos' },
      { id: 'hs-4', label: 'Ausencia total de plagas e insectocutores ultravioleta limpios y activos', required: true, category: 'Control Plagas' },
      { id: 'hs-5', label: 'Almacén de planta -1 con productos elevados > 15 cm del suelo', required: true, category: 'Almacén' }
    ]
  },

  // 5. CALIBRACIONES DE FRÍO
  calibracion_frio: {
    titulo: 'Calibración y Registro Termométrico de Frío',
    descripcion: 'Registro de sondas térmicas en cámaras, botelleros y fabricador de hielo.',
    items: [
      { id: 'cf-1', label: 'Cámara 1 Cerveza / Refrescos (+2.0 ºC a +4.0 ºC)', required: true, category: 'Cámaras', temperatureValue: 3.2 },
      { id: 'cf-2', label: 'Cámara 2 Vinos Canarios y Cavas (+6.0 ºC a +8.0 ºC)', required: true, category: 'Cámaras', temperatureValue: 6.8 },
      { id: 'cf-3', label: 'Botellero contrabarra principal (+3.0 ºC a +5.0 ºC)', required: true, category: 'Barra', temperatureValue: 3.9 },
      { id: 'cf-4', label: 'Fabricador de hielo macizo (-5.0 ºC / bomba sin calcificación)', required: true, category: 'Hielo', temperatureValue: -4.8 },
      { id: 'cf-5', label: 'Arcón congelador de fruta y pulpas (-18.0 ºC a -21.0 ºC)', required: true, category: 'Congelación', temperatureValue: -19.2 }
    ]
  },

  // 6. REVISIONES OPERATIVAS
  revision_operativa: {
    titulo: 'Revisión Operativa de Calidad y Servicio',
    descripcion: 'Supervisión del confort, presentación de sala, menús y estado de mobiliario.',
    items: [
      { id: 'ro-1', label: 'Anclajes de sombrillas de terraza firmes y seguros', required: true, category: 'Terraza' },
      { id: 'ro-2', label: 'Cartas QR de mesa desinfectadas y enlaces verificados', required: true, category: 'Menús' },
      { id: 'ro-3', label: 'Cristalería tallada de cóctel brillante y sin marcas de cal', required: true, category: 'Vajilla' },
      { id: 'ro-4', label: 'Cojines y tumbonas del solárium alineadas y limpias', required: false, category: 'Mobiliario' },
      { id: 'ro-5', label: 'Iluminación ambiental y focos sunset encendidos en su franja', required: false, category: 'Iluminación' }
    ]
  }
};

// ============================================================================
// HISTORIAL INICIAL PARA TRAZABILIDAD (BASE DE DATOS OPERATIVA)
// ============================================================================

export const INITIAL_CHECKLIST_RECORDS: ChecklistRecord[] = [
  // 1. Apertura de Hoy
  {
    id: 'reg-20261001-001',
    numeroRegistro: 'REG-20261001-001',
    tipo: 'apertura',
    tipoLabel: 'Checklist de Apertura',
    fecha: '2026-10-01',
    hora: '07:45',
    timestamp: '2026-10-01T07:45:00Z',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    area: 'Bar / Terraza Diamond',
    empleadoResponsable: 'Carlos Mendoza Santana (Bartender Principal)',
    items: CHECKLIST_TEMPLATES.apertura.items.map(i => ({ ...i, checked: true })),
    totalItems: 9,
    itemsCompletados: 9,
    porcentajeConformidad: 100,
    conforme: true,
    observaciones: 'Apertura puntual. Hielo a máxima capacidad (arcón lleno). Terraza despejada y sombrillas fijadas con seguridad.',
    fotografias: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    enviadoWhatsApp: true,
    enviadoEmail: true,
    emailDestinatario: 'direccionfb@klaymanhotels.com'
  },

  // 2. Calibración de Frío de Hoy
  {
    id: 'reg-20261001-002',
    numeroRegistro: 'REG-20261001-002',
    tipo: 'calibracion_frio',
    tipoLabel: 'Calibraciones de Frío',
    fecha: '2026-10-01',
    hora: '11:15',
    timestamp: '2026-10-01T11:15:00Z',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    area: 'Bar / Terraza Diamond',
    empleadoResponsable: 'Juanito Suárez (Jefe de Sala)',
    items: CHECKLIST_TEMPLATES.calibracion_frio.items.map(i => ({ ...i, checked: true })),
    totalItems: 5,
    itemsCompletados: 5,
    porcentajeConformidad: 100,
    conforme: true,
    observaciones: 'Todas las sondas térmicas verificadas con termómetro calibrado Testo 104. Cámaras en rango óptimo.',
    fotografias: [],
    enviadoWhatsApp: true,
    enviadoEmail: true,
    emailDestinatario: 'calidad@klaymanhotels.com'
  },

  // 3. Cierre de Ayer
  {
    id: 'reg-20260930-003',
    numeroRegistro: 'REG-20260930-003',
    tipo: 'cierre',
    tipoLabel: 'Checklist de Cierre',
    fecha: '2026-09-30',
    hora: '22:35',
    timestamp: '2026-09-30T22:35:00Z',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    area: 'Bar / Terraza Diamond',
    empleadoResponsable: 'Carlos Mendoza Santana',
    ticketZNumero: 'Z-1085',
    items: CHECKLIST_TEMPLATES.cierre.items.map(i => ({ ...i, checked: true })),
    totalItems: 8,
    itemsCompletados: 8,
    porcentajeConformidad: 100,
    conforme: true,
    observaciones: 'Cierre Z verificado y cuadrado. Sombrillas plegadas con cinchas de seguridad por previsión de viento. Basuras en punto limpio.',
    fotografias: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
    ],
    enviadoWhatsApp: true,
    enviadoEmail: true,
    emailDestinatario: 'direccionfb@klaymanhotels.com'
  },

  // 4. Auditoría APPCC Semanal
  {
    id: 'reg-20260929-001',
    numeroRegistro: 'REG-20260929-001',
    tipo: 'appcc',
    tipoLabel: 'Auditorías APPCC',
    fecha: '2026-09-29',
    hora: '16:30',
    timestamp: '2026-09-29T16:30:00Z',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    area: 'Bar / Terraza Diamond',
    empleadoResponsable: 'Laura Betancor (F&B Manager)',
    items: CHECKLIST_TEMPLATES.appcc.items.map(i => ({ ...i, checked: true })),
    totalItems: 6,
    itemsCompletados: 6,
    porcentajeConformidad: 100,
    conforme: true,
    observaciones: 'Auditoría semanal sin no-conformidades. Registro de temperaturas y lote de desinfectantes en orden.',
    fotografias: [],
    enviadoWhatsApp: true,
    enviadoEmail: true,
    emailDestinatario: 'sanidad@klaymanhotels.com'
  }
];

// ============================================================================
// FUNCIONES Y SERVICIOS DE LA BASE DE DATOS OPERATIVA
// ============================================================================

export function getStoredChecklistRecords(): ChecklistRecord[] {
  if (typeof window === 'undefined') return INITIAL_CHECKLIST_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CHECKLIST_RECORDS));
      return INITIAL_CHECKLIST_RECORDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error al leer checklists de localStorage', e);
    return INITIAL_CHECKLIST_RECORDS;
  }
}

export function saveStoredChecklistRecords(list: ChecklistRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('klayman_checklists_updated'));
  } catch (e) {
    console.error('Error al guardar checklists en localStorage', e);
  }
}

/**
 * Genera el número de registro correlativo oficial (ej. REG-20261001-005)
 */
export function generateNextRegistrationNumber(list: ChecklistRecord[] = getStoredChecklistRecords()): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const datePrefix = `REG-${yyyy}${mm}${dd}`;

  const sameDayRecords = list.filter(r => r.numeroRegistro && r.numeroRegistro.startsWith(datePrefix));
  const nextSeq = sameDayRecords.length + 1;
  return `${datePrefix}-${String(nextSeq).padStart(3, '0')}`;
}

/**
 * Inserta un nuevo registro en la base de datos interna
 */
export function createChecklistRecord(recordData: Omit<ChecklistRecord, 'id' | 'numeroRegistro' | 'timestamp'>): ChecklistRecord {
  const current = getStoredChecklistRecords();
  const nextNum = generateNextRegistrationNumber(current);
  const now = new Date();

  const newRecord: ChecklistRecord = {
    ...recordData,
    id: `reg-${Date.now()}`,
    numeroRegistro: nextNum,
    timestamp: now.toISOString()
  };

  const updated = [newRecord, ...current];
  saveStoredChecklistRecords(updated);
  return newRecord;
}

/**
 * Formatea el resumen oficial para envío por WhatsApp
 */
export function buildWhatsAppChecklistMessage(record: ChecklistRecord): string {
  const statusEmoji = record.conforme ? '✅' : '⚠️';
  const checkedItems = record.items.filter(i => i.checked);
  const uncheckedItems = record.items.filter(i => !i.checked);

  let text = `📋 *CONTROL OPERATIVO · KLAYMAN*\n`;
  text += `*${record.tipoLabel.toUpperCase()}* ${statusEmoji}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `🆔 *Registro:* \`${record.numeroRegistro}\`\n`;
  text += `🏨 *Hotel:* ${record.hotel} · ${record.area}\n`;
  text += `🗓️ *Fecha:* ${record.fecha} · ⏰ *Hora:* ${record.hora} h\n`;
  text += `👤 *Responsable:* ${record.empleadoResponsable}\n`;
  if (record.ticketZNumero) {
    text += `🧾 *Ticket Z:* ${record.ticketZNumero}\n`;
  }
  text += `📊 *Conformidad:* ${record.porcentajeConformidad}% (${record.itemsCompletados}/${record.totalItems} ítems)\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*ÍTEMS VERIFICADOS:*\n`;

  checkedItems.forEach(item => {
    text += `✓ ${item.label}${item.temperatureValue !== undefined ? ` [${item.temperatureValue}ºC]` : ''}\n`;
  });

  if (uncheckedItems.length > 0) {
    text += `\n*ÍTEMS PENDIENTES / INCIDENCIA:*\n`;
    uncheckedItems.forEach(item => {
      text += `✗ ${item.label}\n`;
    });
  }

  if (record.observaciones) {
    text += `\n📝 *Observaciones:* ${record.observaciones}\n`;
  }

  if (record.fotografias && record.fotografias.length > 0) {
    text += `📷 *Evidencias Fotográficas:* ${record.fotografias.length} foto(s) adjunta(s)\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Validado en Portal Oficial Klayman Operations_`;

  return text;
}

/**
 * Construye el enlace mailto: oficial para envío de copia por correo electrónico
 */
export function buildEmailChecklistUrl(record: ChecklistRecord, recipient: string = 'direccionfb@klaymanhotels.com'): string {
  const subject = `[CONTROL OPERATIVO] ${record.numeroRegistro} - ${record.tipoLabel} - ${record.hotel} (${record.fecha})`;
  const body = `INFORME OFICIAL DE CONTROL OPERATIVO - KLAYMAN HOSPITALITY
===========================================================
Nº REGISTRO: ${record.numeroRegistro}
TIPO: ${record.tipoLabel}
HOTEL: ${record.hotel} - ${record.area}
FECHA Y HORA: ${record.fecha} a las ${record.hora} h
RESPONSABLE: ${record.empleadoResponsable}
CONFORMIDAD: ${record.porcentajeConformidad}% (${record.conforme ? 'CONFORME' : 'CON INCIDENCIAS'})
${record.ticketZNumero ? `TICKET Z: ${record.ticketZNumero}\n` : ''}
PUNTOS DE CONTROL:
${record.items.map(i => `[${i.checked ? 'X' : ' '}] ${i.label}${i.temperatureValue !== undefined ? ` (${i.temperatureValue}ºC)` : ''}`).join('\n')}

OBSERVACIONES:
${record.observaciones || 'Sin observaciones adicionales.'}

FOTOGRAFÍAS:
${record.fotografias && record.fotografias.length > 0 ? `${record.fotografias.length} fotografía(s) archivadas en el servidor.` : 'Sin fotografías adjuntas.'}

===========================================================
Registro generado automáticamente desde el Sistema Klayman Operations.
`;

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Estadísticas generales de control operativo
 */
export function getControlOperativoStats(list: ChecklistRecord[] = getStoredChecklistRecords()): ControlOperativoStats {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = list.filter(r => r.fecha === todayStr);

  const aperturasHoy = todayRecords.filter(r => r.tipo === 'apertura').length;
  const cierresHoy = todayRecords.filter(r => r.tipo === 'cierre').length;
  const auditoriasAPPCC = list.filter(r => r.tipo === 'appcc').length;
  const calibracionesFrio = list.filter(r => r.tipo === 'calibracion_frio').length;

  const totalPorcentaje = list.reduce((acc, curr) => acc + curr.porcentajeConformidad, 0);
  const conformidadMedia = list.length > 0 ? Math.round(totalPorcentaje / list.length) : 100;

  return {
    totalRegistros: list.length,
    registrosHoy: todayRecords.length,
    aperturasHoy,
    cierresHoy,
    auditoriasAPPCC,
    calibracionesFrio,
    conformidadMedia
  };
}
