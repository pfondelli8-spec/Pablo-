import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Thermometer,
  ShieldAlert,
  Clock,
  Sparkles,
  ChefHat,
  Scale,
  Calendar,
  AlertTriangle,
  Info,
  Layers,
  Edit3
} from 'lucide-react';
import { TechSheet } from '../types/menuAndTechSheets';
import { OFFICIAL_ALLERGENS_LIST } from '../data/bitacoraRecetasData';

interface TechSheetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  techSheet: TechSheet | null;
  hotelName?: string;
  userRole?: 'admin' | 'jefe' | 'empleado';
  onEdit?: (sheet: TechSheet) => void;
}

export const TechSheetDetailModal: React.FC<TechSheetDetailModalProps> = ({
  isOpen,
  onClose,
  techSheet,
  hotelName = 'Hotel Bitácora',
  userRole = 'admin',
  onEdit
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPax, setSelectedPax] = useState<'1' | '100' | '300' | '800'>('1');

  if (!isOpen || !techSheet) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `[FICHA TÉCNICA · ${techSheet.code}]
${techSheet.name.toUpperCase()}
Establecimiento: ${hotelName} | Departamento: ${techSheet.departmentName} | Área: ${techSheet.areaName}
Ración: ${techSheet.portionWeight} | Rendimiento: ${techSheet.yieldRations}

* FORMULACIÓN (Ingredientes por ración):
${techSheet.ingredients.map(i => ` - ${i.quantity} ${i.unit} de ${i.name}${i.allergen ? ` [Alérgeno: ${i.allergen}]` : ''}`).join('\n')}

* FLUJO DE ELABORACIÓN:
${techSheet.elaborationSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

* PARÁMETROS APPCC & TEMPERATURAS:
- Conservación: ${techSheet.conservationTemp}
- Servicio: ${techSheet.serviceTemp}
- Vida útil: ${techSheet.shelfLife}

* MONTAJE Y PRESENTACIÓN:
${techSheet.platingAndPresentation}

* ALÉRGENOS DECLARABLES (UE 1169/2011):
${techSheet.allergens.length > 0 ? techSheet.allergens.join(', ') : 'Ninguno declarable'}

* OBSERVACIONES OPERATIVAS:
${techSheet.operationalNotes}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#121820] text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 my-4 flex flex-col max-h-[94vh]">
        {/* Encabezado Superior (No impreso) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/70 bg-[#16202C] rounded-t-2xl shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#C5A880]/20 text-[#C5A880] px-2 py-0.5 rounded border border-[#C5A880]/30">
                  {techSheet.code}
                </span>
                <span className="text-xs text-slate-400">
                  Versión: <strong className="text-slate-200">{techSheet.version}</strong>
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  techSheet.status === 'activa' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {techSheet.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-[400px]">
                {techSheet.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(userRole === 'admin' || userRole === 'jefe') && onEdit && (
              <button
                onClick={() => onEdit(techSheet)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Editar Ficha Técnica"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editar Ficha</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copiar texto normalizado para TPV o manuales"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b0926a] text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
              title="Imprimir Ficha Técnica a 1 página A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir A4</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENEDOR DOCUMENTAL FORMATO A4 / PANTALLA */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 print:p-0 print:m-0 print:text-black print:bg-white print:overflow-visible">
          {/* Header Normalizado de Ficha A4 */}
          <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/40 print:border-black print:bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-700 pb-3 mb-3 print:border-black">
              <div>
                <div className="text-[11px] font-bold tracking-wider uppercase text-[#C5A880] print:text-gray-700">
                  {hotelName} · SISTEMA DOCUMENTAL APPCC & OPERACIONES F&B
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white print:text-black tracking-tight">
                  FICHA TÉCNICA: {techSheet.name.toUpperCase()}
                </h1>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold bg-[#C5A880]/20 text-[#C5A880] px-2.5 py-1 rounded border border-[#C5A880]/30 print:border-black print:text-black">
                  CÓD: {techSheet.code}
                </span>
              </div>
            </div>

            {/* Metadatos en Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-gray-600">Departamento / Área</span>
                <span className="font-semibold text-slate-200 print:text-black">{techSheet.departmentName} · {techSheet.areaName}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-gray-600">Categoría / Familia</span>
                <span className="font-semibold text-slate-200 print:text-black">{techSheet.categoryLabel}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-gray-600">Gramaje Ración / Rend.</span>
                <span className="font-semibold text-[#C5A880] print:text-black">{techSheet.portionWeight} ({techSheet.yieldRations})</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 print:border-gray-300 print:bg-gray-50">
                <span className="text-slate-400 block text-[10px] uppercase font-bold print:text-gray-600">Responsable / Fecha</span>
                <span className="font-semibold text-slate-200 print:text-black truncate block">{techSheet.author}</span>
              </div>
            </div>
          </div>

          {/* Bloque Imagen & Descripción General */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 rounded-xl overflow-hidden border border-slate-700 print:border-black max-h-56">
              <img
                src={techSheet.photoUrl}
                alt={techSheet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="md:col-span-2 flex flex-col justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700 print:bg-transparent print:border-gray-300">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5 print:text-gray-600">
                  <Info className="w-3.5 h-3.5 text-[#C5A880]" />
                  Descripción y Concepto
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed print:text-black">
                  {techSheet.description}
                </p>
              </div>

              {/* Indicadores térmicos y vida útil */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/70 print:border-gray-300 text-xs">
                <div className="flex items-center gap-2 text-slate-300 print:text-black">
                  <Thermometer className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-slate-400 print:text-gray-600 font-bold">Conservación</span>
                    <span>{techSheet.conservationTemp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 print:text-black">
                  <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-slate-400 print:text-gray-600 font-bold">Temp. Servicio</span>
                    <span>{techSheet.serviceTemp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 print:text-black">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-slate-400 print:text-gray-600 font-bold">Vida Útil</span>
                    <span>{techSheet.shelfLife}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulación e Ingredientes */}
          <div className="border border-slate-700 rounded-xl overflow-hidden print:border-black">
            <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between print:bg-gray-100 print:border-black">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white print:text-black flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C5A880]" />
                Formulación de Ingredientes por Ración
              </h3>
              <span className="text-xs text-slate-400 print:text-gray-600">
                Total ingredientes: <strong className="text-white print:text-black">{techSheet.ingredients.length}</strong>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 print:text-black">
                <thead className="bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700 print:bg-gray-200 print:text-gray-800 print:border-black">
                  <tr>
                    <th className="py-2.5 px-4">Ingrediente Nomenclatura Oficial</th>
                    <th className="py-2.5 px-4 text-right">Cantidad / Ración</th>
                    <th className="py-2.5 px-4">Alérgeno Declarable</th>
                    <th className="py-2.5 px-4">Notas Técnicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {techSheet.ingredients.map((ing, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                      <td className="py-2 px-4 font-medium text-white print:text-black">{ing.name}</td>
                      <td className="py-2 px-4 text-right font-mono font-bold text-[#C5A880] print:text-black">
                        {ing.quantity} {ing.unit}
                      </td>
                      <td className="py-2 px-4">
                        {ing.allergen ? (
                          <span className="inline-block text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-bold print:border-red-600 print:text-red-700">
                            {ing.allergen}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-slate-400 text-[11px] print:text-gray-600">{ing.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Escandallado y Producción para Colectividades (100, 300, 800 pax) */}
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/30 print:border-black">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between print:bg-gray-100 print:border-black">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white print:text-black flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A880]" />
                Escalado de Producción para Banquetes & Buffet
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-700 print:divide-gray-300 text-xs">
              <div className="p-3.5">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Producción 100 Pax</span>
                <p className="text-slate-200 print:text-black text-xs leading-relaxed">{techSheet.production.pax100}</p>
              </div>
              <div className="p-3.5">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Producción 300 Pax</span>
                <p className="text-slate-200 print:text-black text-xs leading-relaxed">{techSheet.production.pax300}</p>
              </div>
              <div className="p-3.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Producción 800 Pax</span>
                <p className="text-slate-200 print:text-black text-xs leading-relaxed">{techSheet.production.pax800}</p>
              </div>
            </div>
          </div>

          {/* Flujo de Elaboración Secuencial */}
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/20 print:border-black">
            <div className="bg-slate-800/80 px-4 py-2.5 border-b border-slate-700 print:bg-gray-100 print:border-black">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white print:text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                Flujo de Elaboración Secuencial Operativo
              </h3>
            </div>
            <div className="p-4 space-y-2.5">
              {techSheet.elaborationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 print:border-black print:text-black">
                    {idx + 1}
                  </span>
                  <p className="pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alérgenos Declarables (Reglamento UE 1169/2011) */}
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/20 print:border-black">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between print:bg-gray-100 print:border-black">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white print:text-black flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Alérgenos Declarables (Reglamento UE 1169/2011)
              </h3>
              <span className="text-[11px] text-slate-400 print:text-gray-600">14 Grupos Oficiales</span>
            </div>
            <div className="p-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {OFFICIAL_ALLERGENS_LIST.map(alg => {
                  const isPresent = techSheet.allergens.some(a => 
                    a.toLowerCase().includes(alg.key.toLowerCase()) || 
                    alg.label.toLowerCase().includes(a.toLowerCase())
                  );
                  return (
                    <div
                      key={alg.key}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        isPresent
                          ? 'bg-red-500/20 border-red-500 text-red-200 font-bold shadow-sm print:bg-red-100 print:text-red-900 print:border-red-600'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60 print:border-gray-200 print:text-gray-400'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{alg.icon}</span>
                      <span className="text-[10px] block leading-tight">{alg.label.split('/')[0]}</span>
                      {isPresent && (
                        <span className="inline-block mt-1 text-[9px] bg-red-600 text-white font-extrabold px-1 rounded">
                          PRESENTE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Montaje, Presentación y Observaciones del Chef */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/30 print:border-black">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A880] mb-2 print:text-black">
                Montaje, Vajilla y Presentación
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed">
                {techSheet.platingAndPresentation}
              </p>
            </div>
            <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/30 print:border-black">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 print:text-black">
                Observaciones y Diagnóstico Operativo
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 print:text-black leading-relaxed">
                {techSheet.operationalNotes}
              </p>
            </div>
          </div>

          {/* Historial de Versiones y Trazabilidad Documental */}
          {techSheet.versionHistory && techSheet.versionHistory.length > 0 && (
            <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/20 print:border-black">
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between print:bg-gray-100 print:border-black">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                  Historial de Versiones y Revisiones Aprobadas
                </h4>
                <span className="text-[10px] text-slate-400 print:text-gray-600">
                  {techSheet.versionHistory.length} revisiones registradas
                </span>
              </div>
              <div className="divide-y divide-slate-800 text-xs print:divide-gray-300">
                {techSheet.versionHistory.map((vh, vIdx) => (
                  <div key={vIdx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-800 text-[#C5A880] px-2 py-0.5 rounded border border-slate-700 print:border-gray-400 print:text-black">
                        {vh.version}
                      </span>
                      <span className="text-slate-200 print:text-black font-medium">{vh.changesSummary}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-gray-600 flex items-center gap-2">
                      <span>Por: <strong className="text-slate-200 print:text-black">{vh.author}</strong></span>
                      <span>·</span>
                      <span>{new Date(vh.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pie de Documento / Firma */}
          <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 print:text-gray-600 print:border-black">
            <span>PROA Hospitality Suite · Aislamiento Multitenant Aprobado</span>
            <span>Documento emitido: {new Date(techSheet.updatedAt).toLocaleDateString('es-ES')} · Responsable: {techSheet.author}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
