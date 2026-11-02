import React, { useState } from 'react';
import { 
  Wine, 
  X, 
  GlassWater, 
  Snowflake, 
  Layers, 
  Compass, 
  Info, 
  DollarSign, 
  AlertCircle, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { TechnicalSheet } from '../types/hotelPortal';
import { formatTechnicalSheetStandardText } from '../utils/technicalSheetFormatter';

interface CocktailDetailModalProps {
  sheet: TechnicalSheet | null;
  onClose: () => void;
}

export const CocktailDetailModal: React.FC<CocktailDetailModalProps> = ({
  sheet,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawStandardText, setShowRawStandardText] = useState(false);

  if (!sheet) return null;

  const compass = sheet.flavorCompass;
  const standardText = formatTechnicalSheetStandardText(sheet);

  const handleCopyStandardText = () => {
    navigator.clipboard.writeText(standardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans text-[#2C3E50]">
      <div className="relative w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden my-6">
        {/* CABECERA DE LA FICHA TÉCNICA */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                {sheet.code}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]">
                v{sheet.version} · {sheet.updatedDate}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-semibold">
                {sheet.status}
              </span>
              <span className="text-xs font-mono text-[#2C3E50]/60">
                {sheet.outletName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
              {sheet.name || sheet.title}
            </h2>
            <p className="text-xs text-[#2C3E50]/70 font-mono">
              Ficha Técnica Operativa Estandarizada · F&B Hub
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawStandardText(!showRawStandardText)}
              title="Alternar vista texto estándar TPV"
              className="px-3 py-1.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono text-xs transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">{showRawStandardText ? 'Vista Detallada' : 'Texto TPV / Manual'}</span>
            </button>

            <button
              onClick={handleCopyStandardText}
              title="Copiar Ficha Técnica Estandarizada"
              className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-colors flex items-center gap-1.5 ${
                copied 
                  ? 'bg-[#C5A880] text-[#1A2530] font-bold' 
                  : 'bg-[#C5A880] text-[#1A2530] font-bold hover:bg-[#b5976f]'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1A2530]" /> : <Copy className="w-3.5 h-3.5 text-[#1A2530]" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Texto Base'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CUERPO DE LA FICHA */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {showRawStandardText ? (
            /* VISTA DEL TEXTO BASE ESTANDARIZADO REQUERIDO */
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono text-[#2C3E50]/70">
                <span className="text-[#C5A880] font-bold">ESTRUCTURA TÉCNICA OFICIAL NORMALIZADA:</span>
                <span>Listo para TPV / Manual Operativo</span>
              </div>
              <pre className="p-4 sm:p-6 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed select-all">
                {standardText}
              </pre>
            </div>
          ) : (
            <>
              {/* DIAGNÓSTICO DESTACADO */}
              <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>DIAGNÓSTICO TÉCNICO & PERFIL:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed">
                  {sheet.diagnosis || sheet.notes || 'Perfil equilibrado y balance organoléptico definido para servicio técnico en sala/barra.'}
                </p>
              </div>

              {/* Fila 1: Puntos Críticos de Servicio (Cristalería, Hielo, Técnica, Garnish) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A880] font-bold">
                    <GlassWater className="w-4 h-4" />
                    <span>CRISTALERÍA</span>
                  </div>
                  <p className="text-xs text-[#2C3E50] leading-snug">
                    {sheet.glassware || 'Cristalería estándar de servicio'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A880] font-bold">
                    <Snowflake className="w-4 h-4" />
                    <span>HIELO REQUERIDO</span>
                  </div>
                  <p className="text-xs text-[#2C3E50] leading-snug">
                    {sheet.ice || 'Cubos macizos en frío'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A880] font-bold">
                    <Layers className="w-4 h-4" />
                    <span>TÉCNICA DE ELABORACIÓN</span>
                  </div>
                  <p className="text-xs text-[#2C3E50] leading-snug">
                    {sheet.technique || 'Preparación de coctelería'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A880] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>GARNISH & DECORACIÓN</span>
                  </div>
                  <p className="text-xs text-[#2C3E50] leading-snug">
                    {sheet.garnish || sheet.decoration || 'Garnish estándar'}
                  </p>
                </div>
              </div>

              {/* ÚTILES DE BARRA */}
              {sheet.tools && (
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-xs">
                  <span className="font-mono text-[#C5A880] uppercase font-bold text-[11px] block">
                    ÚTILES & HERRAMIENTAS DE SERVICIO:
                  </span>
                  <p className="text-[#2C3E50] mt-1">{sheet.tools}</p>
                </div>
              )}

              {/* Fila 2: Formulación / Ingredientes & Sabores */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Formulación: Medida exacta + Nomenclatura técnica */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider">
                      FORMULACIÓN TÉCNICA:
                    </span>
                    <span className="text-[11px] font-mono text-[#2C3E50]/70">
                      {sheet.ingredients.length} componentes dosificados
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden divide-y divide-[#E2E8F0]">
                    {sheet.ingredients.map((ing, i) => (
                      <div key={i} className="p-3 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0" />
                          <span className="font-semibold text-[#2C3E50]">{ing.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-[#1A2530] text-xs px-2.5 py-0.5 rounded bg-[#F8F9FA] border border-[#E2E8F0]">
                            {ing.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ALÉRGENOS */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#C5A880] font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>ALÉRGENOS (REGLAMENTO UE 1169/2011)</span>
                    </div>
                    <p className="text-xs text-[#2C3E50]">
                      {(sheet.allergens && sheet.allergens.length > 0 && sheet.allergens[0] !== 'Sin alérgenos declarables')
                        ? sheet.allergens.join(', ')
                        : 'Sin alérgenos declarables'}
                    </p>
                  </div>
                </div>

                {/* Brújula de Sabores */}
                <div className="lg:col-span-5 space-y-4">
                  {compass && (
                    <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider flex items-center gap-1.5">
                          <Compass className="w-4 h-4" />
                          <span>BRÚJULA DE SABORES</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#2C3E50]/60">Escala 0-5</span>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        {[
                          { label: 'Frutal', val: compass.fruity },
                          { label: 'Cítrico / Ácido', val: compass.sour },
                          { label: 'Dulce', val: compass.sweet },
                          { label: 'Graduación / Alcohol', val: compass.alcohol },
                          { label: 'Amargo', val: compass.bitter },
                          { label: 'Herbal / Botánico', val: compass.herbal || 1 }
                        ].map(trait => (
                          <div key={trait.label} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#2C3E50]">{trait.label}</span>
                              <span className="text-[#2C3E50]/70 font-bold">{trait.val}/5</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#C5A880]" 
                                style={{ width: `${(trait.val / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Presentación & Temperatura */}
                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 text-xs">
                    <span className="font-mono text-[#C5A880] uppercase text-[11px] block font-bold">
                      Presentación Operativa:
                    </span>
                    <p className="text-[#2C3E50] leading-relaxed">
                      {sheet.presentation || 'Servicio directo en cristalería homologada y temperatura de pase controlada.'}
                    </p>
                    {sheet.servingTemperature && (
                      <div className="pt-1 text-[11px] font-mono text-[#2C3E50]/80">
                        <span className="text-[#2C3E50]/60">Temperatura ideal:</span> {sheet.servingTemperature}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fila 3: Flujo de Elaboración (Verbos en primera persona del plural) */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider block">
                  FLUJO DE ELABORACIÓN SECUENCIAL:
                </span>
                <div className="space-y-2">
                  {sheet.preparationMethod.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50] leading-relaxed flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#C5A880] text-[#1A2530] flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fila 4: Puntos Clave de Calidad & Escandallo */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                  <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>PUNTOS CLAVE DE CALIDAD OPERATIVA</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#2C3E50]">
                    {sheet.keyQualityPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#C5A880] font-bold shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {sheet.escandallo && (
                  <div className="md:col-span-4 p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 font-mono text-xs">
                    <span className="text-xs uppercase text-[#C5A880] font-bold tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      <span>ESCANDALLO OPERATIVO</span>
                    </span>
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span className="text-[#2C3E50]/70">Coste M. Prima:</span>
                        <span className="text-[#2C3E50] font-bold">{sheet.escandallo.rawCost.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#2C3E50]/70">Precio Venta (PVP):</span>
                        <span className="text-[#1A2530] font-bold text-sm">{sheet.escandallo.sellingPrice.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-[#E2E8F0] text-[#C5A880] font-bold">
                        <span>Margen Bruto:</span>
                        <span>{sheet.escandallo.marginPercent.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* PIE */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs font-mono text-[#2C3E50]/70">
          <span>F&B Hub · Estandarización Técnica de Operaciones</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
