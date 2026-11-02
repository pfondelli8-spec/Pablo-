/**
 * FASE 11 – CONTROL OPERATIVO, CHECKLISTS DIGITALES Y TRAZABILIDAD
 * Klayman Hospitality Management (Diamond & Olivina)
 * 
 * Módulo oficial para:
 * ✅ Checklist de Apertura
 * ✅ Checklist de Cierre
 * ✅ Auditorías APPCC
 * ✅ Revisiones Higiénico-Sanitarias
 * ✅ Calibraciones de Frío
 * ✅ Revisiones Operativas
 * ✅ Base de Datos Operativa (Histórico y Trazabilidad sin depender de email)
 * ✅ Envíos automáticos por WhatsApp y correo electrónico
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Camera, 
  X, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  MessageCircle, 
  Mail, 
  Copy, 
  Check, 
  Thermometer, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Eye,
  Receipt,
  Download,
  Trash2,
  Share2,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  TipoChecklist, 
  ChecklistItemDef, 
  ChecklistRecord, 
  ControlOperativoStats 
} from '../types/controlOperativo';
import { 
  CHECKLIST_TEMPLATES, 
  getStoredChecklistRecords, 
  createChecklistRecord, 
  buildWhatsAppChecklistMessage, 
  buildEmailChecklistUrl, 
  getControlOperativoStats 
} from '../data/controlOperativoMaster';
import { UniversalShareModal, UniversalSharePayload } from './UniversalShareModal';

interface ControlOperativoViewProps {
  onBackToMenu?: () => void;
  defaultType?: TipoChecklist;
}

export const ControlOperativoView: React.FC<ControlOperativoViewProps> = ({
  onBackToMenu,
  defaultType = 'apertura'
}) => {
  // Pestaña principal: 'formulario' | 'historico_db'
  const [mainView, setMainView] = useState<'formulario' | 'historico_db'>('formulario');

  // Tipo de checklist activo para cumplimentar
  const [activeType, setActiveType] = useState<TipoChecklist>(defaultType);

  // Lista de registros cargados de la base de datos interna
  const [records, setRecords] = useState<ChecklistRecord[]>(() => getStoredChecklistRecords());

  // Estado del formulario actual
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(() => new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  const [hotel, setHotel] = useState<'Klayman Diamond' | 'Klayman Olivina'>('Klayman Diamond');
  const [area, setArea] = useState('Bar / Terraza Diamond');
  const [empleadoResponsable, setEmpleadoResponsable] = useState('Carlos Mendoza (Bartender Principal)');
  const [ticketZNumero, setTicketZNumero] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fotografias, setFotografias] = useState<string[]>([]);

  // Ítems del checklist actual
  const [items, setItems] = useState<ChecklistItemDef[]>(() => {
    return CHECKLIST_TEMPLATES[defaultType].items.map(i => ({ ...i, checked: false }));
  });

  // Registro recién completado para mostrar confirmación de envío
  const [lastSubmittedRecord, setLastSubmittedRecord] = useState<ChecklistRecord | null>(null);

  // Registro seleccionado para ver detalle en histórico
  const [detailModalRecord, setDetailModalRecord] = useState<ChecklistRecord | null>(null);

  // Feedback de copiado
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Control de KPIs desplegables (Reubicación UX)
  const [isKpiOpen, setIsKpiOpen] = useState(false);

  // Modal universal de compartir
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filtros en la base de datos histórica
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [dbTypeFilter, setDbTypeFilter] = useState<'todos' | TipoChecklist>('todos');

  // Actualizar ítems cuando cambia el tipo de checklist
  useEffect(() => {
    setItems(CHECKLIST_TEMPLATES[activeType].items.map(i => ({ ...i, checked: false })));
    setObservaciones('');
    setFotografias([]);
    setLastSubmittedRecord(null);
    setHora(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  }, [activeType]);

  // Escuchar actualizaciones de registros
  useEffect(() => {
    const handleUpdate = () => setRecords(getStoredChecklistRecords());
    window.addEventListener('klayman_checklists_updated', handleUpdate);
    return () => window.removeEventListener('klayman_checklists_updated', handleUpdate);
  }, []);

  // Estadísticas operativas en vivo
  const stats = useMemo(() => getControlOperativoStats(records), [records]);

  // Manejo de cambios en ítems
  const handleToggleItem = (itemId: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item));
  };

  const handleUpdateTemperature = (itemId: string, temp: number) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, temperatureValue: temp, checked: true } : item));
  };

  const handleMarcarTodoConforme = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: true })));
  };

  // Manejo de subida de fotos
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFotografias(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Enviar y registrar checklist
  const handleSubmitChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empleadoResponsable.trim()) return;

    const total = items.length;
    const completados = items.filter(i => i.checked).length;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 100;
    const template = CHECKLIST_TEMPLATES[activeType];

    const newRecord = createChecklistRecord({
      tipo: activeType,
      tipoLabel: template.titulo,
      fecha,
      hora,
      hotel,
      hotelId: hotel === 'Klayman Diamond' ? 'klayman-diamond' : 'klayman-olivina',
      area,
      empleadoResponsable: empleadoResponsable.trim(),
      items,
      totalItems: total,
      itemsCompletados: completados,
      porcentajeConformidad: porcentaje,
      conforme: porcentaje === 100,
      observaciones: observaciones.trim() || undefined,
      fotografias,
      enviadoWhatsApp: false,
      enviadoEmail: false,
      ticketZNumero: ticketZNumero.trim() || undefined,
      emailDestinatario: 'direccionfb@klaymanhotels.com'
    });

    setRecords(getStoredChecklistRecords());
    setLastSubmittedRecord(newRecord);
  };

  // Copiar resumen al portapapeles
  const handleCopyRecord = (record: ChecklistRecord) => {
    const text = buildWhatsAppChecklistMessage(record);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filtrado de la Base de Datos Operativa
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (dbTypeFilter !== 'todos' && r.tipo !== dbTypeFilter) return false;
      if (!dbSearchQuery.trim()) return true;
      const q = dbSearchQuery.toLowerCase();
      return (
        r.numeroRegistro.toLowerCase().includes(q) ||
        r.empleadoResponsable.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.tipoLabel.toLowerCase().includes(q) ||
        (r.observaciones && r.observaciones.toLowerCase().includes(q))
      );
    });
  }, [records, dbTypeFilter, dbSearchQuery]);

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* CABECERA PRINCIPAL: CONTROL OPERATIVO */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950/40 p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                FASE 11 · SISTEMA DE CALIDAD & TRAZABILIDAD
              </span>
              <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {hora} h · {fecha}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 flex items-center gap-3">
              <ClipboardCheck className="w-7 h-7 text-emerald-400" />
              <span>CONTROL OPERATIVO</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 font-sans">
              Checklists digitales, trazabilidad interna permanente y envío multicanal automático (WhatsApp y Email)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Conmutador de vista: Formulario vs Base de Datos */}
            <div className="flex items-center p-1 rounded-xl bg-stone-950 border border-stone-800">
              <button
                onClick={() => setMainView('formulario')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  mainView === 'formulario' ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                + Nuevo Checklist
              </button>
              <button
                onClick={() => setMainView('historico_db')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 ${
                  mainView === 'historico_db' ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Base de Datos ({records.length})</span>
              </button>
            </div>

            {/* BOTÓN UNIVERSAL DE COMPARTIR */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Compartir checklist por WhatsApp, PDF o Correo"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Compartir</span>
            </button>

            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 hover:text-white transition-colors"
              >
                ← Menú Bar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          VISTA 1: FORMULARIO INTERACTIVO DE CUMPLIMENTACIÓN
         ===================================================================== */}
      {mainView === 'formulario' && (
        <div className="space-y-6">
          {/* SELECTOR ERGONÓMICO DE LOS 6 TIPOS DE CHECKLIST */}
          <div className="p-1 bg-stone-900 rounded-2xl border border-stone-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 shadow-md">
            {/* 1. Apertura */}
            <button
              onClick={() => setActiveType('apertura')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'apertura' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">01. Obligatorio</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">Apertura</span>
            </button>

            {/* 2. Cierre */}
            <button
              onClick={() => setActiveType('cierre')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'cierre' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">02. Obligatorio</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">Cierre</span>
            </button>

            {/* 3. APPCC */}
            <button
              onClick={() => setActiveType('appcc')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'appcc' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">03. Sanidad</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">APPCC</span>
            </button>

            {/* 4. Higiénico-Sanitaria */}
            <button
              onClick={() => setActiveType('higienico_sanitario')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'higienico_sanitario' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">04. Higiene</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">Higiénico</span>
            </button>

            {/* 5. Calibración Frío */}
            <button
              onClick={() => setActiveType('calibracion_frio')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'calibracion_frio' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">05. Temperaturas</span>
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">Frío / Sondas</span>
            </button>

            {/* 6. Revisión Operativa */}
            <button
              onClick={() => setActiveType('revision_operativa')}
              className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                activeType === 'revision_operativa' 
                  ? 'bg-emerald-500 text-stone-950 font-bold shadow-md' 
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase">06. Servicio</span>
                <Eye className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-display font-bold uppercase mt-1">Operativa</span>
            </button>
          </div>

          {/* CONFIRMACIÓN INMEDIATA TRAS REGISTRAR (ENVÍO AUTOMÁTICO WHATSAPP & EMAIL) */}
          {lastSubmittedRecord && (
            <div className="p-5 sm:p-6 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                      ¡Registro Guardado en Base de Datos Interna!
                    </span>
                    <h3 className="text-lg font-display font-bold text-white">
                      Nº Registro: <span className="font-mono text-emerald-300">{lastSubmittedRecord.numeroRegistro}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-200">
                    {lastSubmittedRecord.fecha} · {lastSubmittedRecord.hora} h
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    Conformidad: {lastSubmittedRecord.porcentajeConformidad}%
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300">
                La trazabilidad ha quedado sellada de forma permanente. Puedes enviar de inmediato el resumen oficial al grupo o a la dirección:
              </p>

              {/* BOTONES DE ENVÍO AUTOMÁTICO */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* 1. Botón WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(buildWhatsAppChecklistMessage(lastSubmittedRecord))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Resumen por WhatsApp</span>
                </a>

                {/* 2. Botón Correo Electrónico */}
                <a
                  href={buildEmailChecklistUrl(lastSubmittedRecord, 'direccionfb@klaymanhotels.com')}
                  className="px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar Copia por Email</span>
                </a>

                {/* 3. Botón Copiar Texto */}
                <button
                  onClick={() => handleCopyRecord(lastSubmittedRecord)}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === lastSubmittedRecord.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">✓ Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-400" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>

                {/* 4. Ir a la Base de Datos */}
                <button
                  onClick={() => {
                    setMainView('historico_db');
                    setLastSubmittedRecord(null);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-750 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors ml-auto"
                >
                  <span>Ver en Base de Datos →</span>
                </button>
              </div>
            </div>
          )}

          {/* FORMULARIO OFICIAL DEL CHECKLIST */}
          <form onSubmit={handleSubmitChecklist} className="p-4 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Cumplimentación en Vivo
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100 mt-0.5">
                  {CHECKLIST_TEMPLATES[activeType].titulo}
                </h2>
                <p className="text-xs text-stone-400 font-sans mt-0.5">
                  {CHECKLIST_TEMPLATES[activeType].descripcion}
                </p>
              </div>

              <button
                type="button"
                onClick={handleMarcarTodoConforme}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Marcar Todo Conforme</span>
              </button>
            </div>

            {/* METADATOS OBLIGATORIOS: FECHA, HORA, HOTEL, ÁREA, EMPLEADO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* Fecha */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Hora */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                  Hora *
                </label>
                <input
                  type="text"
                  required
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  placeholder="08:00"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Hotel */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                  Hotel *
                </label>
                <select
                  value={hotel}
                  onChange={(e) => {
                    const h = e.target.value as 'Klayman Diamond' | 'Klayman Olivina';
                    setHotel(h);
                    setArea(h === 'Klayman Diamond' ? 'Bar / Terraza Diamond' : 'Sol Bar Olivina');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Klayman Diamond">Klayman Diamond</option>
                  <option value="Klayman Olivina">Klayman Olivina</option>
                </select>
              </div>

              {/* Área */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                  Área / Centro *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Bar / Terraza Diamond"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Empleado responsable */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold block">
                  Empleado Responsable *
                </label>
                <input
                  type="text"
                  required
                  value={empleadoResponsable}
                  onChange={(e) => setEmpleadoResponsable(e.target.value)}
                  placeholder="Nombre y cargo"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* SI ES CIERRE: CAMPO ADICIONAL DE TICKET Z */}
            {activeType === 'cierre' && (
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                    Comprobación de Caja y Ticket Z
                  </span>
                  <p className="text-stone-300 text-[11px] mt-0.5">
                    Introduce el número de informe Z del TPV antes de sellar el cierre.
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    value={ticketZNumero}
                    onChange={(e) => setTicketZNumero(e.target.value)}
                    placeholder="Ej. Ticket Z-1085"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* LISTA DE ÍTEMS DEL CHECKLIST */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 uppercase font-bold tracking-wider">
                  Puntos de Control a Verificar ({items.filter(i => i.checked).length} de {items.length} completados)
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {Math.round((items.filter(i => i.checked).length / items.length) * 100)}%
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      item.checked 
                        ? 'bg-emerald-950/30 border-emerald-700/60 text-stone-100 shadow-sm' 
                        : 'bg-stone-950 border-stone-850 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        item.checked ? 'bg-emerald-500 text-stone-950' : 'bg-stone-900 border border-stone-750 text-stone-500'
                      }`}>
                        {item.checked ? '✓' : idx + 1}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium block">
                          {item.label}
                        </span>
                        {item.category && (
                          <span className="text-[10px] font-mono text-stone-500 uppercase block">
                            Categoría: {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Si tiene valor de temperatura (calibración de frío) */}
                    {item.temperatureValue !== undefined ? (
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="flex items-center gap-1.5 shrink-0"
                      >
                        <input
                          type="number"
                          step="0.1"
                          value={item.temperatureValue}
                          onChange={(e) => handleUpdateTemperature(item.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 text-xs font-mono text-center text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs font-mono text-stone-400">ºC</span>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                        item.checked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-900 text-stone-500'
                      }`}>
                        {item.checked ? 'Conforme' : 'Pendiente'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* OBSERVACIONES */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-400 uppercase font-semibold block">
                Observaciones
              </label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Anota incidencias resueltas, material reabastecido o novedades del turno..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* FOTOGRAFÍAS OPCIONALES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-stone-400 uppercase font-semibold block">
                  Fotografías opcionales
                </label>
                <span className="text-[10px] font-mono text-stone-500">
                  {fotografias.length} foto(s) adjunta(s)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-850 border border-stone-800 hover:border-emerald-500/60 text-stone-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-all">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Adjuntar Foto / Evidencia</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {fotografias.map((img, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-700 group">
                    <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFotografias(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-rose-950/80 text-rose-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN FINAL DE REGISTRO */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-800">
              <span className="text-[11px] font-mono text-stone-500">
                Al enviar se genera automáticamente el número correlativo y se archiva en la base de datos interna.
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar y Enviar Registro</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          VISTA 2: BASE DE DATOS OPERATIVA (HISTÓRICO & TRAZABILIDAD)
         ===================================================================== */}
      {mainView === 'historico_db' && (
        <div className="space-y-4">
          {/* BUSCADOR Y FILTROS */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  placeholder="Buscar por Nº Registro, responsable, área o texto..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={dbTypeFilter}
                onChange={(e) => setDbTypeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="todos">Todos los Tipos de Checklist</option>
                <option value="apertura">Apertura</option>
                <option value="cierre">Cierre</option>
                <option value="appcc">APPCC</option>
                <option value="higienico_sanitario">Higiénico-Sanitario</option>
                <option value="calibracion_frio">Calibraciones de Frío</option>
                <option value="revision_operativa">Revisiones Operativas</option>
              </select>
            </div>
          </div>

          {/* LISTADO DE REGISTROS DE LA BASE DE DATOS */}
          <div className="space-y-3">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-emerald-500/60 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                        {rec.numeroRegistro}
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-sm text-stone-100">
                          {rec.tipoLabel}
                        </h3>
                        <span className="text-[10px] font-mono text-stone-500">
                          {rec.hotel} · {rec.area}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <span className="text-[11px] font-mono text-stone-400">
                        {rec.fecha} a las {rec.hora} h
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        rec.conforme ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {rec.porcentajeConformidad}% Conforme
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-850">
                      <span className="text-[10px] font-mono text-stone-500 block">Responsable</span>
                      <span className="text-stone-200 font-semibold truncate block">{rec.empleadoResponsable}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-850">
                      <span className="text-[10px] font-mono text-stone-500 block">Puntos Verificados</span>
                      <span className="text-emerald-400 font-mono font-bold block">{rec.itemsCompletados} de {rec.totalItems} ítems</span>
                    </div>

                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-850">
                      <span className="text-[10px] font-mono text-stone-500 block">Ticket Z / Evidencias</span>
                      <span className="text-stone-300 font-mono block">
                        {rec.ticketZNumero || (rec.fotografias.length > 0 ? `${rec.fotografias.length} foto(s)` : 'Sin adjuntos')}
                      </span>
                    </div>
                  </div>

                  {rec.observaciones && (
                    <p className="text-xs text-stone-300 bg-stone-950/80 p-2.5 rounded-xl border border-stone-850 italic">
                      "{rec.observaciones}"
                    </p>
                  )}

                  {/* ACCIONES DE TRAZABILIDAD (VER DETALLE, WHATSAPP, EMAIL, COPIAR) */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-stone-850">
                    <button
                      onClick={() => setDetailModalRecord(rec)}
                      className="px-3 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Trazabilidad Completa</span>
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(buildWhatsAppChecklistMessage(rec))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={buildEmailChecklistUrl(rec, rec.emailDestinatario || 'direccionfb@klaymanhotels.com')}
                      className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>

                    <button
                      onClick={() => handleCopyRecord(rec)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-mono transition-colors"
                      title="Copiar resumen"
                    >
                      {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-stone-900 rounded-3xl border border-stone-800 space-y-2">
                <ClipboardCheck className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="text-stone-300 font-display font-bold">No se encontraron registros</h4>
                <p className="text-xs text-stone-500">
                  Prueba a ajustar los filtros o registra un nuevo checklist desde la pestaña superior.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL DE DETALLE DE TRAZABILIDAD
         ===================================================================== */}
      {detailModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {detailModalRecord.numeroRegistro}
                </span>
                <h2 className="text-base sm:text-lg font-display font-bold text-stone-100">
                  {detailModalRecord.tipoLabel}
                </h2>
              </div>

              <button
                onClick={() => setDetailModalRecord(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
                  <span className="text-[10px] text-stone-500 block">FECHA</span>
                  <span className="text-stone-200 font-bold">{detailModalRecord.fecha}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
                  <span className="text-[10px] text-stone-500 block">HORA</span>
                  <span className="text-stone-200 font-bold">{detailModalRecord.hora} h</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
                  <span className="text-[10px] text-stone-500 block">HOTEL</span>
                  <span className="text-stone-200 font-bold truncate block">{detailModalRecord.hotel}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-850">
                  <span className="text-[10px] text-stone-500 block">CONFORMIDAD</span>
                  <span className="text-emerald-400 font-bold">{detailModalRecord.porcentajeConformidad}%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-850 text-xs">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">Responsable de Certificación</span>
                <span className="text-stone-100 font-bold">{detailModalRecord.empleadoResponsable}</span>
              </div>

              {/* LISTA COMPLETA DE PUNTOS DE CONTROL SELLADOS */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-stone-400 uppercase font-bold block">
                  Desglose de Ítems Auditados:
                </span>
                <div className="space-y-1 bg-stone-950 p-3 rounded-2xl border border-stone-850 max-h-56 overflow-y-auto">
                  {detailModalRecord.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-900 last:border-0">
                      <div className="flex items-center gap-2 truncate">
                        <span className={item.checked ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                          {item.checked ? '✓' : '✗'}
                        </span>
                        <span className={item.checked ? "text-stone-200 truncate" : "text-stone-400 line-through truncate"}>
                          {item.label}
                        </span>
                      </div>
                      {item.temperatureValue !== undefined && (
                        <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                          {item.temperatureValue} ºC
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {detailModalRecord.observaciones && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">
                    Observaciones Archivadas
                  </span>
                  <p className="text-xs text-stone-200 bg-stone-950 p-3 rounded-xl border border-stone-850">
                    {detailModalRecord.observaciones}
                  </p>
                </div>
              )}

              {/* EVIDENCIAS FOTOGRÁFICAS */}
              {detailModalRecord.fotografias && detailModalRecord.fotografias.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">
                    Fotografías y Comprobantes Adjuntos ({detailModalRecord.fotografias.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {detailModalRecord.fotografias.map((f, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-stone-800 aspect-video">
                        <img src={f} alt="Evidencia" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(buildWhatsAppChecklistMessage(detailModalRecord))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp</span>
                </a>

                <a
                  href={buildEmailChecklistUrl(detailModalRecord, 'direccionfb@klaymanhotels.com')}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>

              <button
                onClick={() => setDetailModalRecord(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-mono font-bold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RESUMEN OPERATIVO DESPLEGABLE (REUBICACIÓN UX - OPCIÓN PREFERIDA)
         ===================================================================== */}
      <div className="pt-2 border-t border-stone-850">
        <button
          onClick={() => setIsKpiOpen(!isKpiOpen)}
          className="w-full p-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800 flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-display font-bold text-stone-200 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <span>📊 Resumen Operativo</span>
                <span className="text-[10px] font-mono text-emerald-400 font-normal">
                  ({stats.registrosHoy} archivados hoy · {stats.conformidadMedia}% conformidad)
                </span>
              </span>
              <span className="text-[10px] font-mono text-stone-500 block">
                {isKpiOpen ? 'Toca para contraer indicadores' : 'Toca para ver desglose de auditorías y métricas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-mono">
            <span>{isKpiOpen ? 'Ocultar' : 'Ver KPIs'}</span>
            {isKpiOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400" />}
          </div>
        </button>

        {isKpiOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5 animate-fadeIn">
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">Registros Hoy</span>
              <span className="text-lg font-display font-bold text-emerald-400">{stats.registrosHoy} archivados</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">Apertura / Cierre</span>
              <span className="text-lg font-display font-bold text-stone-200">{stats.aperturasHoy} Ap. · {stats.cierresHoy} Ci.</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">Auditorías APPCC</span>
              <span className="text-lg font-display font-bold text-sky-400">{stats.auditoriasAPPCC} realizadas</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-950 border border-stone-850">
              <span className="text-[10px] font-mono text-stone-500 uppercase block">Conformidad Media</span>
              <span className="text-lg font-display font-bold text-amber-400">{stats.conformidadMedia}% global</span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL UNIVERSAL DE COMPARTIR */}
      <UniversalShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        payload={{
          title: `Checklist de ${CHECKLIST_TEMPLATES[activeType].title}`,
          moduleName: 'Control Operativo',
          hotelName: hotel,
          areaName: area,
          responsible: empleadoResponsable,
          date: fecha,
          time: hora,
          summaryText: `Registro operativo de ${CHECKLIST_TEMPLATES[activeType].title}.\nPuntos completados: ${items.filter(i => i.checked).length} de ${items.length} (${Math.round((items.filter(i => i.checked).length / items.length) * 100)}% de conformidad).\n${observaciones ? `Observaciones: ${observaciones}` : 'Sin incidencias reseñables registradas.'}`,
          details: [
            { label: 'Tipo', value: CHECKLIST_TEMPLATES[activeType].title },
            { label: 'Conformidad', value: `${Math.round((items.filter(i => i.checked).length / items.length) * 100)}%` },
            { label: 'Puntos Verificados', value: `${items.filter(i => i.checked).length}/${items.length}` },
            { label: 'Área', value: area }
          ]
        }}
      />
    </div>
  );
};
