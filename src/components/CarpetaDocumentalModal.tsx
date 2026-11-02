import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  FileText,
  Thermometer,
  Sparkles,
  ClipboardCheck,
  Calendar,
  AlertTriangle,
  Printer,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Filter,
  Search,
  X,
  UserCheck,
  Building2,
  Check,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  DossierRecord,
  DossierFamily,
  DOSSIER_FAMILIES_META,
  cumulativeFolderService
} from '../services/cumulativeFolderService';

interface CarpetaDocumentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  activeOperatorName: string;
  userRole?: 'admin' | 'jefe' | 'empleado';
}

export const CarpetaDocumentalModal: React.FC<CarpetaDocumentalModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  activeOperatorName,
  userRole = 'jefe'
}) => {
  // Registros acumulativos del hotel
  const [records, setRecords] = useState<DossierRecord[]>(() => {
    return cumulativeFolderService.getRecordsForHotel(hotelId);
  });

  // Filtros
  const [selectedFamily, setSelectedFamily] = useState<DossierFamily | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'conforme' | 'desviacion' | 'pendientes_firma'>('all');

  // Firma individual modal / prompt
  const [signingRecord, setSigningRecord] = useState<DossierRecord | null>(null);
  const [signNotes, setSignNotes] = useState('');

  if (!isOpen) return null;

  // Lista de departamentos presentes en los registros
  const departmentsList = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach(r => {
      map.set(r.departmentId, r.departmentName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [records]);

  // Registros filtrados
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      if (selectedFamily !== 'all' && rec.family !== selectedFamily) return false;
      if (selectedDept !== 'all' && rec.departmentId !== selectedDept) return false;

      if (filterStatus === 'conforme' && rec.status !== 'conforme') return false;
      if (filterStatus === 'desviacion' && rec.status !== 'desviacion') return false;
      if (filterStatus === 'pendientes_firma' && rec.supervisionStatus !== 'pendiente') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchItem = rec.itemName.toLowerCase().includes(q);
        const matchArea = rec.areaName.toLowerCase().includes(q);
        const matchOp = rec.operatorName.toLowerCase().includes(q);
        const matchVal = (rec.readingValue || '').toLowerCase().includes(q);
        if (!matchItem && !matchArea && !matchOp && !matchVal) return false;
      }

      return true;
    });
  }, [records, selectedFamily, selectedDept, filterStatus, searchQuery]);

  // Contadores de resumen por familia
  const familyCounts = useMemo(() => {
    const counts: Record<string, number> = {
      temperaturas: 0,
      limpieza: 0,
      checklists: 0,
      caducidades: 0,
      incidencias: 0
    };
    records.forEach(r => {
      if (counts[r.family] !== undefined) counts[r.family]++;
    });
    return counts;
  }, [records]);

  // Manejar firma individual
  const handleConfirmSignRecord = () => {
    if (!signingRecord) return;
    const updated = cumulativeFolderService.signOffRecord(
      hotelId,
      signingRecord.id,
      activeOperatorName,
      signNotes
    );
    setRecords(updated);
    setSigningRecord(null);
    setSignNotes('');
  };

  // Manejar firma masiva
  const handleSignAllPending = () => {
    if (window.confirm(`¿Firmar y validar todos los registros pendientes de la familia seleccionada como ${activeOperatorName}?`)) {
      const updated = cumulativeFolderService.signOffAllPending(
        hotelId,
        selectedFamily,
        activeOperatorName
      );
      setRecords(updated);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      {/* Estilos para impresión del dossier */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-dossier-binder, #printable-dossier-binder * {
            visibility: visible !important;
          }
          #printable-dossier-binder {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: auto !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* CABECERA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-serif font-black text-amber-400 text-sm select-none">PF</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight">CARPETA DOCUMENTAL ACUMULATIVA</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                  PF Operations · F&B · {hotelName}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Dossier Operativo · Tenerife
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Registros agrupados por familia operativa, fichas técnicas y APPCC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(userRole === 'admin' || userRole === 'jefe') && (
              <button
                onClick={handleSignAllPending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                title="Firmar todos los registros pendientes"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Firmar Pendientes en Bloque</span>
              </button>
            )}

            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Carpeta Sanitaria</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BARRA DE FILTROS Y FAMILIAS */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3">
          {/* Selector de Familias Sanitarias (Pestañas estilo archivador) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedFamily('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedFamily === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todas las Familias ({records.length})
            </button>

            <button
              onClick={() => setSelectedFamily('temperaturas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedFamily === 'temperaturas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temperaturas ({familyCounts.temperaturas})</span>
            </button>

            <button
              onClick={() => setSelectedFamily('limpieza')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedFamily === 'limpieza'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limpieza L+D ({familyCounts.limpieza})</span>
            </button>

            <button
              onClick={() => setSelectedFamily('checklists')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedFamily === 'checklists'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Checklists ({familyCounts.checklists})</span>
            </button>

            <button
              onClick={() => setSelectedFamily('caducidades')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedFamily === 'caducidades'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Caducidades ({familyCounts.caducidades})</span>
            </button>

            <button
              onClick={() => setSelectedFamily('incidencias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedFamily === 'incidencias'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Incidencias ({familyCounts.incidencias})</span>
            </button>
          </div>

          {/* Filtros secundarios: Departamento, Estado, Buscador */}
          <div className="flex items-center gap-2">
            {/* Departamento */}
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
            >
              <option value="all">Todos los Departamentos</option>
              {departmentsList.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Estado */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
            >
              <option value="all">Todos los Estados</option>
              <option value="conforme">Solo Conformes</option>
              <option value="desviacion">Solo Desviaciones</option>
              <option value="pendientes_firma">Pendientes de Firma Jefe</option>
            </select>

            {/* Buscador */}
            <div className="relative w-44">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar en carpeta..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL EXPEDIENTE (FORMATO ARCHIVADOR FÍSICO) */}
        <div id="printable-dossier-binder" className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* CABECERA OFICIAL DEL ARCHIVADOR */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="border-b-2 border-slate-800 pb-3 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    SISTEMA DE GESTIÓN DE SEGURIDAD ALIMENTARIA · REGLAMENTO (CE) Nº 852/2004
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">
                    EXPEDIENTE HIGIÉNICO-SANITARIO: {hotelName}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Familia: {selectedFamily === 'all' ? 'Consolidado General' : DOSSIER_FAMILIES_META[selectedFamily]?.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 block">Establecimiento:</span>
                  <span>{hotelName}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Responsable de Auditoría:</span>
                  <span>{hotelId.includes('vulcano') ? 'Giacomo Longo (Jefe Vulcano)' : 'Antonio González (Jefe Bitácora)'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Registros Totales:</span>
                  <span className="font-bold text-slate-900">{filteredRecords.length} entradas auditadas</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Estado Cumplimiento:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Trazable
                  </span>
                </div>
              </div>
            </div>

            {/* TABLA PRINCIPAL DE REGISTROS ACUMULATIVOS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3 w-28">Fecha / Hora</th>
                      <th className="p-3 w-32">Familia</th>
                      <th className="p-3">Área & Departamento</th>
                      <th className="p-3">Elemento / Control Verificado</th>
                      <th className="p-3 text-right">Lectura / Valor</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3">Operador / Turno</th>
                      <th className="p-3">VºBº Jefatura</th>
                      <th className="p-3 text-center no-print">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">
                          No existen registros acumulados que coincidan con los filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map(rec => {
                        const isConforme = rec.status === 'conforme';
                        const isSupervised = rec.supervisionStatus === 'validado_jefe';

                        return (
                          <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Fecha / Hora */}
                            <td className="p-3 font-mono">
                              <div className="font-bold text-slate-900">{rec.formattedDate}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {rec.formattedTime}
                              </div>
                            </td>

                            {/* Familia */}
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${DOSSIER_FAMILIES_META[rec.family]?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                                {rec.familyLabel}
                              </span>
                            </td>

                            {/* Área & Dept */}
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{rec.areaName}</div>
                              <div className="text-[10px] text-slate-500">{rec.departmentName}</div>
                            </td>

                            {/* Item Verificado */}
                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{rec.itemName}</div>
                              {rec.targetRange && (
                                <div className="text-[10px] text-slate-500">
                                  Rango estándar: <span className="font-mono text-slate-700">{rec.targetRange}</span>
                                </div>
                              )}
                              {rec.correctiveAction && (
                                <div className="mt-1 p-1.5 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-800">
                                  <span className="font-bold">Acción correctora: </span>
                                  {rec.correctiveAction}
                                </div>
                              )}
                            </td>

                            {/* Lectura / Valor */}
                            <td className="p-3 text-right font-mono font-bold">
                              <span className={isConforme ? 'text-slate-900' : 'text-rose-600'}>
                                {rec.readingValue || '—'}
                              </span>
                            </td>

                            {/* Estado Conforme / Desviación */}
                            <td className="p-3 text-center">
                              {isConforme ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Check className="w-3 h-3" /> Conforme
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                  <AlertCircle className="w-3 h-3" /> Desviación
                                </span>
                              )}
                            </td>

                            {/* Operador */}
                            <td className="p-3">
                              <div className="font-medium text-slate-800">{rec.operatorName}</div>
                              <div className="text-[10px] text-slate-400 capitalize">{rec.operatorRole} • Turno {rec.shift}</div>
                            </td>

                            {/* VºBº Jefatura */}
                            <td className="p-3">
                              {isSupervised ? (
                                <div className="text-[11px]">
                                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Firmado: {rec.supervisedBy}</span>
                                  </div>
                                  {rec.supervisionNotes && (
                                    <div className="text-[10px] text-slate-500 italic mt-0.5">
                                      "{rec.supervisionNotes}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  Pendiente revisión
                                </span>
                              )}
                            </td>

                            {/* Acción (Firmar) */}
                            <td className="p-3 text-center no-print">
                              {!isSupervised && (userRole === 'admin' || userRole === 'jefe') ? (
                                <button
                                  onClick={() => setSigningRecord(rec)}
                                  className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition-colors"
                                >
                                  Dar VºBº
                                </button>
                              ) : isSupervised ? (
                                <span className="text-emerald-600 font-bold text-[11px]">✓ Aprobado</span>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Solo lectura</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SELLO Y DILIGENCIA DE AUDITORÍA (VISIBLE EN IMPRESIÓN) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-xs text-slate-700 grid grid-cols-2 gap-8 shadow-sm">
              <div>
                <div className="font-bold uppercase text-[11px] text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Diligencia del Jefe de Cocina / Responsable de Calidad
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  D. {hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González'}, en calidad de Responsable de Cocina y Seguridad Alimentaria de {hotelName}, certifica que los registros consignados en la presente carpeta documental han sido verificados conforme al plan APPCC y normativa higiénico-sanitaria vigente.
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="font-mono text-[10px] text-slate-400">
                    Firma digital autorizada: PROA-TENANT-SEC
                  </div>
                  <div className="w-32 border-b-2 border-slate-400 text-center text-[10px] text-slate-500 pb-1 font-semibold">
                    Firma y Sello
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold uppercase text-[11px] text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  Observaciones de Sanidad / Auditoría Externa
                </div>
                <div className="h-20 border border-dashed border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-400 text-[11px] italic">
                  Espacio reservado para el acta de inspección sanitaria oficial o sello de conformidad de la entidad auditora.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE FIRMA Y VºBº INDIVIDUAL */}
      {signingRecord && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Visto Bueno de Jefatura</h3>
                <p className="text-xs text-slate-500">{signingRecord.itemName}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><span className="font-bold">Fecha / Hora:</span> {signingRecord.formattedDate} a las {signingRecord.formattedTime}</div>
              <div><span className="font-bold">Área:</span> {signingRecord.areaName} ({signingRecord.departmentName})</div>
              <div><span className="font-bold">Lectura:</span> <span className="font-mono font-bold">{signingRecord.readingValue}</span></div>
              <div><span className="font-bold">Operador:</span> {signingRecord.operatorName}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones del Supervisor / Jefe (Opcional):
              </label>
              <textarea
                rows={2}
                value={signNotes}
                onChange={e => setSignNotes(e.target.value)}
                placeholder="Ej. Comprobado en panel digital, correcto..."
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSigningRecord(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSignRecord}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
              >
                Firmar y Aprobar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
