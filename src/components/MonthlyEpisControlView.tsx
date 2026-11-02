import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  FileCheck, 
  Plus, 
  X, 
  Printer, 
  Check, 
  RefreshCw, 
  Info,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import { MonthlyEpisRecord, EpiItemCheck, EpiStatus } from '../types/episControl';
import { episAppccService, STANDARD_EPI_CATALOG } from '../services/episAppccService';

interface MonthlyEpisControlViewProps {
  hotelId: string;
  hotelName: string;
  stationKey?: string;
  stationName?: string;
  currentChefName?: string;
  currentChefRole?: string;
  userRole?: string;
  onClose?: () => void;
}

export const MonthlyEpisControlView: React.FC<MonthlyEpisControlViewProps> = ({
  hotelId,
  hotelName,
  stationKey = 'general_cocina',
  stationName = 'Cocina & Buffet Central',
  currentChefName = 'Antonio González',
  currentChefRole = 'Chef Ejecutivo de Cocina',
  userRole = 'empleado',
  onClose
}) => {
  const [records, setRecords] = useState<MonthlyEpisRecord[]>([]);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MonthlyEpisRecord | null>(null);

  // Formulario de firma mensual
  const [periodMonth, setPeriodMonth] = useState('2026-11');
  const [checkDate, setCheckDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [inspectorName, setInspectorName] = useState(currentChefName);
  const [inspectorRole, setInspectorRole] = useState(currentChefRole);
  const [itemsChecklist, setItemsChecklist] = useState<EpiItemCheck[]>(() => {
    return STANDARD_EPI_CATALOG.map(i => ({ ...i }));
  });
  const [replacementRequested, setReplacementRequested] = useState(false);
  const [replacementNotes, setReplacementNotes] = useState('');
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [canvasHasDrawn, setCanvasHasDrawn] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Cargar registros al montar o cambiar hotel/estación
  useEffect(() => {
    loadRecords();
  }, [hotelId, stationKey]);

  const loadRecords = () => {
    const list = episAppccService.getRecordsForFilter(hotelId, stationKey);
    setRecords(list);
    if (list.length > 0 && !selectedRecordForDetail) {
      setSelectedRecordForDetail(list[0]);
    }
  };

  const currentMonthRecord = records.find(r => r.periodMonth === periodMonth);

  // Manejo de firma con canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setCanvasHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0284c7';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasHasDrawn(false);
  };

  const handleOpenSignModal = () => {
    // Si ya existe un registro para este mes, cargamos sus valores para edición
    const existing = records.find(r => r.periodMonth === periodMonth);
    if (existing) {
      setCheckDate(existing.checkDate);
      setInspectorName(existing.inspectorName);
      setInspectorRole(existing.inspectorRole);
      setItemsChecklist(existing.items.map(i => ({ ...i })));
      setReplacementRequested(existing.replacementRequested);
      setReplacementNotes(existing.replacementNotes || '');
    } else {
      setItemsChecklist(STANDARD_EPI_CATALOG.map(i => ({ ...i })));
      setReplacementRequested(false);
      setReplacementNotes('');
    }
    setSignatureCompleted(false);
    setCanvasHasDrawn(false);
    setIsSignModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: EpiStatus) => {
    setItemsChecklist(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleSaveMonthlyRecord = () => {
    let signatureUrl = '';
    if (canvasRef.current && canvasHasDrawn) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    } else {
      // Firma digital generada por sello del inspector
      signatureUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40"><text x="10" y="26" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230284c7">FIRMA DIGITAL: ${encodeURIComponent(inspectorName)}</text></svg>`;
    }

    const hasAnyReplacement = itemsChecklist.some(i => i.status === 'requiere_reposicion') || replacementRequested;
    const monthNames: Record<string, string> = {
      '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
      '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
      '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
    };
    const [year, month] = periodMonth.split('-');
    const periodLabel = `${monthNames[month] || month} ${year}`;

    const newRecord = episAppccService.saveRecord({
      hotelId,
      hotelName,
      stationKey,
      stationName,
      periodMonth,
      periodLabel,
      checkDate,
      inspectorName,
      inspectorRole,
      signatureDataUrl: signatureUrl,
      signatureTimestamp: new Date().toISOString(),
      overallStatus: hasAnyReplacement ? 'requiere_reposicion' : 'en_garantia',
      replacementRequested: hasAnyReplacement,
      replacementNotes: replacementNotes || (hasAnyReplacement ? 'Tramitada reposición al departamento de Compras / Economato.' : 'Inspección conforme. Todo el equipamiento se encuentra en periodo de garantía técnica.'),
      items: itemsChecklist
    });

    setIsSignModalOpen(false);
    loadRecords();
    setSelectedRecordForDetail(newRecord);
    setSaveSuccessMsg(`Control mensual de EPIs correspondiente a ${periodLabel} guardado y firmado correctamente.`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Toast de confirmación */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3 shadow-md animate-scale-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{saveSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Superior Institucional de EPIs APPCC / PRL */}
      <div className="bg-[#1A2530] text-white rounded-3xl p-5 sm:p-7 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Normativa APPCC & PRL · Control Mensual</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-[10px] font-mono font-bold">
                {hotelName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Control y Firma Mensual de EPIs (Equipos de Protección Individual)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Verificación técnica periódica por cocina: certificación de garantía en vigor, integridad mecánica y reposición obligatoria de protecciones frente a cortes, quemaduras y riesgos químicos.
            </p>
          </div>

          {/* Botón de Acción Destacado: Firmar / Certificar Mes */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenSignModal}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-95"
            >
              <FileCheck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{currentMonthRecord ? 'Actualizar Firma Noviembre' : 'Firmar Control Mensual (Nov 2026)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Indicadores Rápidos de la Cocina */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Estado Mes en Curso
          </div>
          <div className="flex items-center gap-2">
            {currentMonthRecord ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Firmado y Conforme</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Pendiente de Firma</span>
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Periodo: {currentMonthRecord?.periodLabel || 'Noviembre 2026'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            EPIs Homologados
          </div>
          <div className="text-xl font-black text-slate-900">
            {STANDARD_EPI_CATALOG.length} Familias
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Corte, térmicos, químicos, calzado y auditivos
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Garantía Técnica
          </div>
          <div className="text-xl font-black text-emerald-700">
            100% en Garantía
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Certificación CE según normas armonizadas
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Auditor / Responsable
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {records[0]?.inspectorName || currentChefName}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-1">
            {records[0]?.inspectorRole || currentChefRole}
          </div>
        </div>
      </div>

      {/* Grid Central: Lista de EPIs Homologados con Estado en Garantía vs Reposición */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-[#1A2530] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Catálogo de EPIs y Estado de Garantía · {stationName}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-200 font-bold bg-white/10 px-2.5 py-0.5 rounded border border-white/10">
            {STANDARD_EPI_CATALOG.length} equipos obligatorios
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {STANDARD_EPI_CATALOG.map((epi, idx) => {
            const currentItemState = currentMonthRecord?.items.find(i => i.id === epi.id) || epi;
            const isWarranty = currentItemState.status === 'en_garantia';

            return (
              <div 
                key={epi.id} 
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {epi.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {epi.standardNorm}
                      </span>
                      {isWarranty ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>En Garantía</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Requiere Reposición</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {epi.description}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span className="font-semibold text-slate-600">Verificación periódica:</span>
                      <span>{currentItemState.notes || epi.notes}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Garantía / Vigencia</div>
                    <div className="text-xs font-mono font-semibold text-slate-700">
                      {epi.expirationOrWarrantyDate || 'Permanente'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historial Oficial de Revisiones Mensuales Firmadas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Libro Oficial de Registros Mensuales Firmados (EPIs APPCC)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trazabilidad inmutable requerida para auditorías sanitarias y de seguridad y salud laboral.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {records.length} actas registradas
          </span>
        </div>

        <div className="space-y-3">
          {records.map(record => {
            const isSelected = selectedRecordForDetail?.id === record.id;
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecordForDetail(record)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-amber-400 bg-amber-50/30 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {record.periodMonth.split('-')[1]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {record.periodLabel}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-mono text-slate-500">
                          Fecha: {record.checkDate}
                        </span>
                        {record.overallStatus === 'en_garantia' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            En Garantía
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            Reposición Tramitada
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Firma del Inspector: <strong>{record.inspectorName}</strong> ({record.inspectorRole})</span>
                      </div>
                    </div>
                  </div>

                  {/* Firma Digital & Sello */}
                  <div className="flex items-center gap-3">
                    {record.signatureDataUrl && (
                      <div className="p-1 px-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center gap-2">
                        <img 
                          src={record.signatureDataUrl} 
                          alt="Firma Digital" 
                          className="h-6 w-auto max-w-[120px] object-contain"
                        />
                        <span className="text-[9px] font-mono text-slate-400 uppercase">Certificado</span>
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Notas de reposición / inspección si está seleccionado */}
                {isSelected && record.replacementNotes && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600 bg-white/70 p-3 rounded-xl">
                    <span className="font-bold text-slate-800">Observaciones técnicas de la revisión: </span>
                    {record.replacementNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODAL DE FIRMA Y REGISTRO MENSUAL DE EPIS
          ========================================================================= */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">
            {/* Cabecera del modal */}
            <div className="bg-[#1A2530] text-white p-5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black text-white">
                    Firma Mensual de Control de EPIs
                  </h3>
                  <div className="text-xs text-slate-300">
                    {hotelName} · {stationName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del formulario de firma */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Selector de Mes y Fecha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mes de Control
                  </label>
                  <select
                    value={periodMonth}
                    onChange={e => setPeriodMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-400"
                  >
                    <option value="2026-11">Noviembre 2026</option>
                    <option value="2026-12">Diciembre 2026</option>
                    <option value="2026-10">Octubre 2026</option>
                    <option value="2026-09">Septiembre 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Inspección
                  </label>
                  <input
                    type="date"
                    value={checkDate}
                    onChange={e => setCheckDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Datos del Responsable que Firma */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsable / Chef que Firma
                  </label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={e => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cargo / Puesto Operativo
                  </label>
                  <input
                    type="text"
                    value={inspectorRole}
                    onChange={e => setInspectorRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Lista interactiva de EPIs para marcar estado En Garantía vs Reponer */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Verificación individual de EPIs (Seleccione Garantía o Reponer):
                </label>
                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {itemsChecklist.map(item => (
                    <div key={item.id} className="p-2.5 px-3.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{item.standardNorm}</div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'en_garantia')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            item.status === 'en_garantia'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          En Garantía
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'requiere_reposicion')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            item.status === 'requiere_reposicion'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Reponer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observaciones y Solicitud de Reposición a Compras */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observaciones Técnicas o Solicitud de Reposición a Compras:
                </label>
                <textarea
                  value={replacementNotes}
                  onChange={e => setReplacementNotes(e.target.value)}
                  placeholder="Ej. Inspección conforme. Solicitados dos pares de guantes térmicos nuevos para partida caliente..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-amber-400 h-16 resize-none"
                />
              </div>

              {/* Canvas de Firma Digital */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Firma Digital del Responsable</span>
                  </label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Borrar trazo
                  </button>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 p-1 relative flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={100}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-24 bg-white rounded-xl cursor-crosshair touch-none"
                  />
                  {!canvasHasDrawn && (
                    <div className="absolute pointer-events-none text-xs text-slate-400 font-medium select-none">
                      Dibuje aquí la firma con el dedo o ratón
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pie del modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsSignModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveMonthlyRecord}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4 text-amber-400" />
                <span>Confirmar y Guardar Firma Mensual</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
