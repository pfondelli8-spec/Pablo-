import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  X, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Copy, 
  Check, 
  Share2, 
  Layers, 
  Info,
  Sliders,
  Receipt
} from 'lucide-react';
import { TechnicalSheet } from '../types/hotelPortal';
import { resolveItemPhoto } from '../services/customPhotos';
import { 
  resolveItemEscandallo, 
  saveCustomEscandallo, 
  resetCustomEscandallo, 
  calculateEscandalloMetrics,
  EscandalloCalculatedMetrics
} from '../services/customEscandallos';
import { UniversalShareModal, UniversalSharePayload } from './UniversalShareModal';

interface EscandalloSimulatorModalProps {
  sheet: TechnicalSheet;
  onClose: () => void;
}

export const EscandalloSimulatorModal: React.FC<EscandalloSimulatorModalProps> = ({
  sheet,
  onClose
}) => {
  const initialEsc = resolveItemEscandallo(sheet);
  const [rawCost, setRawCost] = useState<number>(initialEsc.rawCost);
  const [sellingPrice, setSellingPrice] = useState<number>(initialEsc.sellingPrice);
  const [notes, setNotes] = useState<string>(initialEsc.notes || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharePayload, setSharePayload] = useState<UniversalSharePayload | null>(null);

  const metrics: EscandalloCalculatedMetrics = calculateEscandalloMetrics(rawCost, sellingPrice);
  const photo = resolveItemPhoto(sheet.id, undefined, sheet.imageUrl);

  const handleSave = () => {
    saveCustomEscandallo(sheet.id, {
      rawCost: metrics.rawCost,
      sellingPrice: metrics.sellingPrice,
      marginPercent: metrics.marginPercent,
      notes: notes.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    resetCustomEscandallo(sheet.id);
    const orig = sheet.escandallo || { rawCost: 1.30, sellingPrice: 8.50, marginPercent: 84.7 };
    setRawCost(orig.rawCost);
    setSellingPrice(orig.sellingPrice);
    setNotes('');
  };

  const handleCopy = () => {
    const text = `=== ESCANDALLO & PRECIOS F&B KLAYMAN DIAMOND ===
CÓDIGO: ${sheet.code}
ARTÍCULO: ${sheet.name || sheet.title}
PVP OFICIAL TPV: ${metrics.sellingPrice.toFixed(2)} € (IGIC 7% inc.)
COSTE MATERIA PRIMA: ${metrics.rawCost.toFixed(2)} €
MARGEN BRUTO: ${metrics.marginPercent.toFixed(1)}% (${metrics.status.toUpperCase()})
BENEFICIO UNITARIO: ${metrics.unitProfit.toFixed(2)} € / copa
FOOD COST RATIO: ${metrics.foodCostPercent.toFixed(1)}%
TARIFA HAPPY HOUR 2x1: ${metrics.happyHourPrice.toFixed(2)} € (Margen HH: ${metrics.happyHourMargin.toFixed(1)}%)
PRECIO MÍN. OBJETIVO 80%: ${metrics.minimumRecommendedPrice80.toFixed(2)} €

INGREDIENTES & DOSIFICACIÓN:
${sheet.ingredients.map(i => `• ${i.quantity} - ${i.name} ${i.commercialBrand ? `(${i.commercialBrand})` : ''} ${i.costApprox ? `[${i.costApprox}]` : ''}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setSharePayload({
      title: `Escandallo · ${sheet.name || sheet.title}`,
      module: 'Ingeniería de Menús & Escandallos F&B',
      hotel: 'Klayman Diamond Aparthotel',
      area: sheet.outletName || 'Bar / Terraza Diamond',
      responsible: 'Dirección de F&B y Costes',
      summaryText: `Escandallo Técnico ${sheet.code}: ${sheet.name}. PVP TPV: ${metrics.sellingPrice.toFixed(2)} €. Coste MP: ${metrics.rawCost.toFixed(2)} €. Margen Bruto: ${metrics.marginPercent.toFixed(1)}%. Beneficio: ${metrics.unitProfit.toFixed(2)} €/ud.`,
      details: [
        { label: 'Código Ficha', value: sheet.code },
        { label: 'PVP Oficial TPV', value: `${metrics.sellingPrice.toFixed(2)} €` },
        { label: 'Coste Materia Prima', value: `${metrics.rawCost.toFixed(2)} €` },
        { label: 'Margen Bruto (%)', value: `${metrics.marginPercent.toFixed(1)}%` },
        { label: 'Beneficio Unitario', value: `${metrics.unitProfit.toFixed(2)} €` },
        { label: 'Happy Hour 2x1', value: `${metrics.happyHourPrice.toFixed(2)} € (${metrics.happyHourMargin.toFixed(1)}% margen)` },
        { label: 'IGIC 7% Desglosado', value: `${metrics.igicAmount.toFixed(2)} € (Base: ${metrics.netPriceWithoutTax.toFixed(2)} €)` }
      ]
    });
    setIsShareOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* CABECERA */}
        <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {photo && (
              <img 
                src={photo} 
                alt={sheet.name || sheet.title}
                className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shadow-md shrink-0" 
              />
            )}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {sheet.code}
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                  Simulador de Escandallos F&B
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100">
                {sheet.name || sheet.title}
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Cálculo de márgenes brutos, costes de materia prima y PVP Ágora TPV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors flex items-center gap-1.5 active:scale-95"
              title="Copiar informe de escandallo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95"
              title="Compartir por WhatsApp, PDF o Correo"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto divide-y divide-stone-800/80">
          
          {/* PANEL DE MÉTRICAS EN TIEMPO REAL */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Margen Bruto */}
            <div className={`p-4 rounded-2xl border ${
              metrics.status === 'optimo'
                ? 'bg-emerald-950/40 border-emerald-500/40'
                : metrics.status === 'aceptable'
                ? 'bg-amber-950/40 border-amber-500/40'
                : 'bg-rose-950/40 border-rose-500/40'
            } space-y-1`}>
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 font-semibold">
                <span>MARGEN BRUTO</span>
                <TrendingUp className={`w-3.5 h-3.5 ${
                  metrics.status === 'optimo' ? 'text-emerald-400' : metrics.status === 'aceptable' ? 'text-amber-400' : 'text-rose-400'
                }`} />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-stone-100">
                {metrics.marginPercent}%
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase block ${
                metrics.status === 'optimo' ? 'text-emerald-400' : metrics.status === 'aceptable' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {metrics.status === 'optimo' ? '✓ Óptimo F&B (≥80%)' : metrics.status === 'aceptable' ? '⚡ Aceptable (72-79%)' : '⚠ Alerta Rentabilidad'}
              </span>
            </div>

            {/* 2. Beneficio Unitario */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
              <span className="text-[11px] font-mono text-stone-400 block font-semibold">
                BENEFICIO BRUTO / COPA
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                +{metrics.unitProfit.toFixed(2)} €
              </div>
              <span className="text-[10px] font-mono text-stone-400 block">
                Por consumición vendida
              </span>
            </div>

            {/* 3. Coste de Materia Prima */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
              <span className="text-[11px] font-mono text-stone-400 block font-semibold">
                COSTE MATERIA PRIMA
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-stone-200">
                {metrics.rawCost.toFixed(2)} €
              </div>
              <span className="text-[10px] font-mono text-stone-400 block">
                Food Cost: {metrics.foodCostPercent}%
              </span>
            </div>

            {/* 4. Tarifa Happy Hour */}
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
              <span className="text-[11px] font-mono text-purple-400 block font-semibold">
                TARIFA HAPPY HOUR (2x12€ / 2x6€)
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-300">
                {metrics.happyHourPrice.toFixed(2)} €
              </div>
              <span className="text-[10px] font-mono text-stone-400 block">
                Margen pack: <strong className={metrics.happyHourMargin >= 65 ? 'text-emerald-400' : 'text-amber-400'}>{metrics.happyHourMargin}%</strong> (dupla obligatoria)
              </span>
            </div>
          </div>

          {/* CONTROLES INTERACTIVOS DE SIMULACIÓN */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Control 1: Precio de Venta (PVP TPV) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                  <DollarSign className="w-4 h-4" />
                  <span>1. PRECIO DE VENTA AL PÚBLICO (PVP TPV)</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                  {sellingPrice.toFixed(2)} €
                </span>
              </div>

              {/* Botones rápidos de PVP habitual y promocional */}
              <div className="flex flex-wrap gap-2">
                {[5.00, 6.00, 6.50, 7.50, 8.00, 8.50, 9.00, 9.50, 10.00].map(p => (
                  <button
                    key={p}
                    onClick={() => setSellingPrice(p)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      Math.abs(sellingPrice - p) < 0.01
                        ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {p.toFixed(2)} € {p === 5.00 ? '(Mojito)' : p === 6.00 ? '(Spritz)' : ''}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-stone-400">
                  <span>Ajuste milimétrico de PVP:</span>
                  <span>5,00 € a 15,00 €</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.25"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="text-[11px] font-mono text-stone-400 flex items-center justify-between pt-1">
                <span>Base Imponible neta: <strong className="text-stone-200">{metrics.netPriceWithoutTax.toFixed(2)} €</strong></span>
                <span>IGIC (7%): <strong className="text-stone-200">{metrics.igicAmount.toFixed(2)} €</strong></span>
              </div>
            </div>

            {/* Control 2: Coste de Materia Prima */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <Sliders className="w-4 h-4" />
                  <span>2. COSTE ESTIMADO DE MATERIA PRIMA</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                  {rawCost.toFixed(2)} €
                </span>
              </div>

              {/* Botones rápidos de ajuste de coste */}
              <div className="flex flex-wrap gap-2">
                {[0.80, 1.10, 1.30, 1.45, 1.60, 1.80, 2.00].map(c => (
                  <button
                    key={c}
                    onClick={() => setRawCost(c)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      Math.abs(rawCost - c) < 0.01
                        ? 'bg-emerald-500 text-stone-950 shadow-md ring-2 ring-emerald-400/50'
                        : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {c.toFixed(2)} €
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-stone-400">
                  <span>Ajuste de coste por variación de compras:</span>
                  <span>0,50 € a 4,00 €</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.05"
                  value={rawCost}
                  onChange={(e) => setRawCost(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="text-[11px] font-mono text-stone-400 flex items-center justify-between pt-1">
                <span>PVP mínimo para margen 80%:</span>
                <span className="text-emerald-400 font-bold">{metrics.minimumRecommendedPrice80.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* DESGLOSE DE INGREDIENTES Y DOSIFICACIÓN */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-stone-300 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>DESGLOSE DE MATERIA PRIMA ({sheet.ingredients.length} COMPONENTES)</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Coste total computado: <strong className="text-emerald-300">{metrics.rawCost.toFixed(2)} €</strong>
              </span>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950/70 overflow-hidden divide-y divide-stone-850">
              {sheet.ingredients.map((ing, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-stone-100 font-sans font-bold block truncate">{ing.name}</span>
                    {ing.commercialBrand && (
                      <span className="text-[11px] text-stone-400 block font-mono">
                        Marca estándar: {ing.commercialBrand}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold block">
                      {ing.quantity}
                    </span>
                    {ing.costApprox && (
                      <span className="text-xs font-mono text-stone-400 hidden sm:inline">
                        {ing.costApprox}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OBSERVACIONES Y POLÍTICA DE PRECIOS */}
          <div className="pt-6 space-y-2">
            <label className="text-xs font-mono font-semibold text-stone-300 uppercase block">
              Notas Técnicas de Fijación de Precios / Justificación de Costes:
            </label>
            <input
              type="text"
              placeholder="Ej. Revisado con nuevo precio de ron blanco Canario y jarabe de fruta de la pasión..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/70"
            />
          </div>
        </div>

        {/* PIE DE ACCIONES */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-mono text-xs transition-colors flex items-center gap-2 active:scale-95 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Estándar 2026</span>
          </button>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs transition-colors active:scale-95"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-450 text-stone-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Guardado con Éxito!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Precio & Escandallo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isShareOpen && sharePayload && (
        <UniversalShareModal
          payload={sharePayload}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
};
