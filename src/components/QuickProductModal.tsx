import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  GlassWater, 
  Snowflake, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Check,
  Copy,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Maximize2,
  Flame
} from 'lucide-react';
import { MenuItem, TechnicalSheet } from '../types/hotelPortal';
import { 
  resolveItemPhoto, 
  saveCustomItemPhoto, 
  resetCustomItemPhoto 
} from '../services/customPhotos';
import { ENRICHED_OPERATIONAL_PRODUCTS } from '../data/operationalDocumentationAudit';
import { getHappyHourLiveStatus } from '../data/promotionsMaster';

interface QuickProductModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onOpenTechnicalSheet?: (sheetId: string) => void;
  linkedSheet?: TechnicalSheet | null;
}

export const QuickProductModal: React.FC<QuickProductModalProps> = ({
  item,
  onClose,
  onOpenTechnicalSheet,
  linkedSheet
}) => {
  const [showRecipePreview, setShowRecipePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [zoomPhoto, setZoomPhoto] = useState(false);

  useEffect(() => {
    if (!item) return;
    const currentPhoto = resolveItemPhoto(item.id, item.technicalSheetId || linkedSheet?.id, item.imageUrl);
    setPhotoUrl(currentPhoto);

    const handlePhotoUpdated = () => {
      const updated = resolveItemPhoto(item.id, item.technicalSheetId || linkedSheet?.id, item.imageUrl);
      setPhotoUrl(updated);
    };

    window.addEventListener('klayman_photos_updated', handlePhotoUpdated);
    return () => {
      window.removeEventListener('klayman_photos_updated', handlePhotoUpdated);
    };
  }, [item, linkedSheet]);

  if (!item) return null;

  const hasTechnicalSheet = Boolean(item.technicalSheetId || linkedSheet);
  const targetSheetId = item.technicalSheetId || linkedSheet?.id || item.name;
  const enriched = ENRICHED_OPERATIONAL_PRODUCTS.find(p => p.id === item.id || (linkedSheet && p.technicalSheetId === linkedSheet.id));

  const handleCopyRecipe = () => {
    if (!linkedSheet) return;
    const text = `=== FICHA TÉCNICA KLAYMAN DIAMOND ===
CÓDIGO: ${linkedSheet.code}
NOMBRE: ${linkedSheet.name || linkedSheet.title}
CRISTALERÍA: ${linkedSheet.glassware || 'Estándar'}
HIELO: ${linkedSheet.ice || 'Cubos macizos'}
GARNISH: ${linkedSheet.garnish || linkedSheet.decoration || 'Mise en place'}

INGREDIENTES:
${(linkedSheet.ingredients || []).map(i => `• ${i.quantity} - ${i.name} ${i.commercialBrand ? `(${i.commercialBrand})` : ''}`).join('\n')}

MÉTODO:
${(linkedSheet.preparationMethod || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSheet = () => {
    if (onOpenTechnicalSheet) {
      onOpenTechnicalSheet(targetSheetId);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        saveCustomItemPhoto(item.id, base64);
        if (item.technicalSheetId) {
          saveCustomItemPhoto(item.technicalSheetId, base64);
        }
        setPhotoUrl(base64);
        setIsUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrlPhoto = () => {
    if (!inputUrl.trim()) return;
    saveCustomItemPhoto(item.id, inputUrl.trim());
    if (item.technicalSheetId) {
      saveCustomItemPhoto(item.technicalSheetId, inputUrl.trim());
    }
    setPhotoUrl(inputUrl.trim());
    setInputUrl('');
    setIsUploadingPhoto(false);
  };

  const handleResetPhoto = () => {
    resetCustomItemPhoto(item.id);
    if (item.technicalSheetId) {
      resetCustomItemPhoto(item.technicalSheetId);
    }
    const fresh = resolveItemPhoto(item.id, item.technicalSheetId || linkedSheet?.id, item.imageUrl);
    setPhotoUrl(fresh);
    setIsUploadingPhoto(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Cabecera modal */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/90 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-semibold">
                Consulta Rápida · Carta
              </span>
              {linkedSheet?.code && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 font-bold">
                  {linkedSheet.code}
                </span>
              )}
              {item.tag && !linkedSheet?.code && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                  {item.tag}
                </span>
              )}
              {enriched?.auditState && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border tracking-tight ${
                  enriched.auditState === 'COMPLETO'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : enriched.auditState === 'REVISAR FOTO'
                    ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                    : enriched.auditState === 'REVISAR ALÉRGENOS'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : enriched.auditState === 'REVISAR ESCANDALLO'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                    : 'bg-amber-950/80 text-amber-300 border-amber-800'
                }`}>
                  {enriched.auditState}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-100 uppercase tracking-wide">
              {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors shrink-0 active:scale-95"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido de la consulta rápida */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">

          {/* FOTOGRAFÍA OFICIAL DEL ARTÍCULO / CÓCTEL */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950/90 shadow-md">
            {photoUrl ? (
              <div className="relative group">
                <img 
                  src={photoUrl} 
                  alt={item.name}
                  className="w-full h-48 sm:h-56 object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />

                {/* Badge Fotografía Oficial */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700/70 text-[10px] font-mono text-emerald-400 font-semibold shadow-sm">
                  <Camera className="w-3 h-3 text-emerald-400" />
                  <span>Presentación Oficial Carta</span>
                </div>

                {/* Botón Zoom / Lightbox */}
                <button
                  onClick={() => setZoomPhoto(true)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-stone-950/80 hover:bg-stone-900 border border-stone-700/70 text-stone-300 hover:text-white transition-all shadow-sm active:scale-95"
                  title="Ver foto a tamaño completo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Botón flotante para cambiar foto */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                  <button
                    onClick={() => setIsUploadingPhoto(!isUploadingPhoto)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 backdrop-blur-md border border-stone-700 text-[10px] font-mono text-stone-300 hover:text-white transition-colors active:scale-95 shadow-md"
                  >
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Cambiar Foto</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 mx-auto flex items-center justify-center text-stone-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-stone-400">
                  Sin fotografía cargada para este producto
                </div>
                <button
                  onClick={() => setIsUploadingPhoto(!isUploadingPhoto)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-mono font-semibold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Foto del Archivo</span>
                </button>
              </div>
            )}

            {/* Panel de Carga / Modificación de Foto */}
            {isUploadingPhoto && (
              <div className="p-3.5 bg-stone-950 border-t border-stone-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-stone-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Actualizar foto de {item.name}:</span>
                  </span>
                  <button 
                    onClick={() => setIsUploadingPhoto(false)}
                    className="text-stone-500 hover:text-stone-300 text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Subir archivo desde dispositivo */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-stone-400">
                    1. Subir archivo de imagen (PNG, JPG, WEBP):
                  </label>
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-stone-700 hover:border-amber-400/70 bg-stone-900/60 cursor-pointer transition-colors text-xs font-mono text-stone-300 hover:text-amber-300">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Elegir archivo de foto...</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* O introducir URL */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-stone-400">
                    2. O pegar enlace directo de imagen (URL):
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      placeholder="https://..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleSaveUrlPhoto}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                {/* Botón Restablecer Foto Oficial */}
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 hover:text-stone-300 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restablecer foto oficial predeterminada</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comparativa de Precios: Precio Normal y Happy Hour */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
                Precio Normal de Carta
              </span>
              <div className="text-2xl sm:text-3xl font-display font-bold text-stone-100">
                {item.price.toFixed(2)} €
              </div>
            </div>

            {/* FASE 7: Bloque Happy Hour Automatizado */}
            {(() => {
              const hhStatus = getHappyHourLiveStatus('klayman-diamond');
              const hhPrice = item.precioHHDiamond ?? enriched?.precioHHDiamond ?? (
                (item.technicalSheetId?.includes('ckt') || item.id.includes('ckt')) 
                  ? Number((item.price / 2).toFixed(2)) 
                  : null
              );

              if (hhPrice === null) return null;

              return (
                <div className="pt-2 border-t border-stone-800/70 flex items-center justify-between gap-2 text-xs font-mono">
                  <div className="space-y-0.5 min-w-0">
                    <span className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Precio Happy Hour (2x1 / Sunset)</span>
                    </span>
                    <span className="text-[10.5px] text-stone-400 block truncate">
                      Horario: {hhStatus.horario} · {hhStatus.isActivo ? '¡ACTIVO AHORA!' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl font-display font-bold text-emerald-400">
                      {hhPrice.toFixed(2)} €
                    </span>
                    <span className={`block text-[9px] font-bold ${
                      hhStatus.isActivo ? 'text-emerald-400 animate-pulse' : 'text-stone-500'
                    }`}>
                      {hhStatus.isActivo ? '● Tarifa en Vigor' : '○ Tarifa Inactiva'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Ingredientes de consulta rápida (para el cliente) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ingredientes principales (Carta)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800/80 text-stone-100 font-medium text-sm leading-relaxed">
              {item.ingredientsSummary || (item.description ? item.description.split('.')[0] + '.' : '')}
            </div>
          </div>

          {/* Descripción comercial de la carta */}
          {item.description && (
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
                Descripción comercial de carta
              </div>
              <div className="p-3 rounded-2xl bg-stone-950/40 border border-stone-800/60 text-stone-300 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </div>
            </div>
          )}

          {/* Alérgenos */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/40 border border-stone-800/60">
            <span className="text-xs font-mono uppercase text-stone-400 font-semibold">
              Alérgenos:
            </span>
            {item.allergens && item.allergens.length > 0 ? (
              <span className="text-xs font-mono font-bold text-amber-400">
                {item.allergens.join(', ')}
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sin alérgenos declarados</span>
              </span>
            )}
          </div>

          {/* FASE 5 – Parámetros Operativos: Presentación & Observaciones de Servicio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/60 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                Presentación Homologada
              </span>
              <p className={`text-xs leading-relaxed ${
                enriched?.presentation && enriched.presentation !== 'PENDIENTE DE REVISIÓN'
                  ? 'text-stone-200'
                  : 'text-amber-400/90 italic'
              }`}>
                {enriched?.presentation || 'PENDIENTE DE REVISIÓN'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/60 space-y-1">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                Observaciones de Servicio F&B
              </span>
              <p className={`text-xs leading-relaxed ${
                enriched?.serviceObservations && enriched.serviceObservations !== 'PENDIENTE DE REVISIÓN'
                  ? 'text-stone-200'
                  : 'text-amber-400/90 italic'
              }`}>
                {enriched?.serviceObservations || 'PENDIENTE DE REVISIÓN'}
              </p>
            </div>
          </div>

          {/* Tarjeta destacada si tiene Ficha Técnica vinculada */}
          {hasTechnicalSheet && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-800/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Ficha Técnica Homologada
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-200">
                      {linkedSheet ? `${linkedSheet.code} · ${linkedSheet.name || linkedSheet.title}` : 'Receta y dosificación disponible'}
                    </span>
                  </div>
                </div>

                {onOpenTechnicalSheet && (
                  <button
                    onClick={handleOpenSheet}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-mono font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                  >
                    <span>Ver Ficha</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Botón desplegable para vista previa de receta rápida */}
              {linkedSheet && (
                <div className="pt-2 border-t border-emerald-900/40">
                  <button
                    onClick={() => setShowRecipePreview(!showRecipePreview)}
                    className="w-full flex items-center justify-between text-xs font-mono text-stone-300 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{showRecipePreview ? 'Ocultar resumen de receta' : 'Ver receta rápida de barra (cantidades & técnica)'}</span>
                    </span>
                    {showRecipePreview ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>

                  {/* Vista previa desplegada de la receta */}
                  {showRecipePreview && (
                    <div className="mt-3 pt-3 border-t border-stone-800 space-y-3 animate-fadeIn">
                      {/* 4 pilares en miniatura */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 flex items-center gap-1">
                            <GlassWater className="w-3 h-3 text-emerald-400" /> Cristalería:
                          </span>
                          <span className="text-stone-200 font-medium truncate block">{linkedSheet.glassware || 'Estándar'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 flex items-center gap-1">
                            <Snowflake className="w-3 h-3 text-sky-400" /> Hielo:
                          </span>
                          <span className="text-stone-200 font-medium truncate block">{linkedSheet.ice || 'Cubos macizos'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-amber-400" /> Técnica:
                          </span>
                          <span className="text-stone-200 font-medium truncate block">{linkedSheet.technique || 'Estándar'}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-stone-900 border border-stone-800">
                          <span className="text-stone-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" /> Garnish:
                          </span>
                          <span className="text-stone-200 font-medium truncate block">{linkedSheet.garnish || linkedSheet.decoration || 'Mise en place'}</span>
                        </div>
                      </div>

                      {/* Ingredientes dosificados */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-stone-300">
                          <span>Ingredientes & Dosificación Oficial:</span>
                          <button
                            onClick={handleCopyRecipe}
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copied ? 'Copiado' : 'Copiar'}</span>
                          </button>
                        </div>
                        <div className="space-y-1 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                          {linkedSheet.ingredients?.map((ing, iIdx) => (
                            <div key={iIdx} className="flex items-baseline justify-between text-[11px] font-mono">
                              <span className="text-stone-200">{ing.name} {ing.commercialBrand && <span className="text-stone-500">({ing.commercialBrand})</span>}</span>
                              <span className="font-bold text-emerald-400 shrink-0 ml-2">{ing.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Método de elaboración */}
                      {linkedSheet.preparationMethod && linkedSheet.preparationMethod.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-mono font-semibold text-stone-300">Método de preparación:</span>
                          <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-300 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                            {linkedSheet.preparationMethod.map((step, sIdx) => (
                              <li key={sIdx} className="leading-relaxed">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tarjeta de estado si NO tiene Ficha Técnica aún */}
          {!hasTechnicalSheet && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-700/80 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    PENDIENTE DE DOCUMENTAR
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">
                    Ficha técnica oficial y escandallo en proceso de homologación F&B
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-700/50 shrink-0">
                PENDIENTE
              </span>
            </div>
          )}
        </div>

        {/* Pie de modal */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
          {hasTechnicalSheet && onOpenTechnicalSheet ? (
            <button
              onClick={handleOpenSheet}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold active:scale-95 transition-all"
            >
              <span>Ver Ficha Técnica Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-mono text-stone-500">
              Klayman Diamond · Carta
            </span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-semibold transition-colors active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL PARA VER FOTO A TAMAÑO COMPLETO */}
      {zoomPhoto && photoUrl && (
        <div 
          onClick={() => setZoomPhoto(false)}
          className="fixed inset-0 z-60 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-3xl w-full">
            <button 
              onClick={() => setZoomPhoto(false)}
              className="absolute -top-10 right-0 p-2 text-stone-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={photoUrl} 
              alt={item.name}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-stone-800" 
            />
            <div className="mt-3 text-center">
              <h3 className="text-lg font-display font-bold text-white uppercase">{item.name}</h3>
              <p className="text-xs font-mono text-emerald-400">{item.price.toFixed(2)} € · Presentación Oficial de Barra</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
