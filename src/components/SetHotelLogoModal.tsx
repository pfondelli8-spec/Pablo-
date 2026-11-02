import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  Sparkles, 
  Check, 
  X, 
  Link as LinkIcon, 
  RotateCcw,
  Star,
  Building2
} from 'lucide-react';
import { HotelEntity } from '../types/hotelPortal';

interface SetHotelLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelEntity | null;
  onSaveLogo: (hotelId: string, logoUrl: string, categoryLabel?: string, stars?: number) => void;
}

export const SetHotelLogoModal: React.FC<SetHotelLogoModalProps> = ({
  isOpen,
  onClose,
  hotel,
  onSaveLogo
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [logoUrlInput, setLogoUrlInput] = useState(hotel?.logoUrl || '');
  const [previewUrl, setPreviewUrl] = useState(hotel?.logoUrl || '');
  const [stars, setStars] = useState(hotel?.stars || 4);
  const [categoryLabel, setCategoryLabel] = useState(hotel?.categoryLabel || (hotel?.stars === 4 ? 'Cuatro Estrellas' : 'Tres Estrellas'));
  const [uploadFileName, setUploadFileName] = useState('');

  // Sincronizar cuando cambia el hotel
  React.useEffect(() => {
    if (hotel) {
      setLogoUrlInput(hotel.logoUrl || '');
      setPreviewUrl(hotel.logoUrl || '');
      setStars(hotel.stars || 4);
      setCategoryLabel(hotel.categoryLabel || (hotel.stars === 4 ? 'Cuatro Estrellas' : 'Tres Estrellas'));
    }
  }, [hotel]);

  if (!isOpen || !hotel) return null;

  // Manejar subida de archivo local y convertir a Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        setLogoUrlInput(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_LOGOS = [
    {
      id: 'diamond-crest',
      title: 'Emblema Operativo Principal',
      desc: 'Monograma geométrico de dirección F&B',
      url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=240&h=240&q=80'
    },
    {
      id: 'emerald-luxury',
      title: 'Distintivo Calidad F&B',
      desc: 'Sello de calidad para barra técnica',
      url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=240&h=240&q=80'
    },
    {
      id: 'sunset-sol',
      title: 'Distintivo Terraza & Servicio',
      desc: 'Distintivo para puntos de servicio exterior',
      url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=240&h=240&q=80'
    },
    {
      id: 'boutique-minimal',
      title: 'Monograma Minimalista F&B',
      desc: 'Identidad limpia contemporánea para centros operativos',
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=240&h=240&q=80'
    }
  ];

  const handleSave = () => {
    onSaveLogo(hotel.id, previewUrl, categoryLabel, stars);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A2530]/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-[#2C3E50]">
      <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-lg">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>PERSONALIZAR IDENTIDAD VISUAL & CATEGORÍA</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">
              Poner Logo: {hotel.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previsualización del Logo */}
        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center overflow-hidden shrink-0">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Logo Preview" 
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <Building2 className="w-8 h-8 text-[#C5A880]" />
            )}
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-[#C5A880]">
                {'★'.repeat(stars)}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-[#2C3E50] border border-[#E2E8F0] font-semibold">
                {categoryLabel || `${stars} Estrellas`}
              </span>
            </div>
            <p className="text-sm font-bold text-[#2C3E50] truncate">
              {hotel.name}
            </p>
            <p className="text-xs font-mono text-[#2C3E50]/60">
              {previewUrl ? 'Logo cargado correctamente' : 'Sin logo personalizado (mostrando icono)'}
            </p>
          </div>
          {previewUrl && (
            <button
              onClick={() => {
                setPreviewUrl('');
                setLogoUrlInput('');
                setUploadFileName('');
              }}
              title="Quitar logo"
              className="p-2 rounded-xl text-[#2C3E50]/50 hover:text-rose-600 hover:bg-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Botón de Categoría */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#2C3E50] uppercase font-bold block">
            Categoría Oficial del Establecimiento:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setStars(4);
                setCategoryLabel('Cuatro Estrellas');
              }}
              className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                stars === 4 
                  ? 'bg-[#1A2530] border-[#1A2530] text-white' 
                  : 'bg-white border-[#E2E8F0] text-[#2C3E50] hover:bg-[#F8F9FA]'
              }`}
            >
              <Star className={`w-4 h-4 ${stars === 4 ? 'fill-[#C5A880] text-[#C5A880]' : 'text-[#2C3E50]/40'}`} />
              <span>★★★★ Cuatro Estrellas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStars(3);
                setCategoryLabel('Tres Estrellas');
              }}
              className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                stars === 3 
                  ? 'bg-[#1A2530] border-[#1A2530] text-white' 
                  : 'bg-white border-[#E2E8F0] text-[#2C3E50] hover:bg-[#F8F9FA]'
              }`}
            >
              <Star className={`w-4 h-4 ${stars === 3 ? 'fill-[#C5A880] text-[#C5A880]' : 'text-[#2C3E50]/40'}`} />
              <span>★★★ Tres Estrellas</span>
            </button>
          </div>
        </div>

        {/* Pestañas para Elegir cómo Poner el Logo */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'upload' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Subir Archivo de Imagen</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'url' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Pegar URL del Logo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'presets' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Logos Preconfigurados</span>
            </button>
          </div>

          {/* 1. Subir Imagen Local */}
          {activeTab === 'upload' && (
            <div className="p-5 rounded-xl bg-white border-2 border-dashed border-[#E2E8F0] hover:border-[#C5A880] transition-colors text-center space-y-3">
              <Upload className="w-8 h-8 text-[#C5A880] mx-auto" />
              <div>
                <p className="text-xs font-mono font-bold text-[#2C3E50]">
                  Selecciona el archivo de imagen de tu logotipo
                </p>
                <p className="text-[11px] font-mono text-[#2C3E50]/60 mt-1">
                  Formatos compatibles: PNG (con transparencia), SVG, JPG o WebP
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono cursor-pointer transition-colors">
                <Image className="w-4 h-4" />
                <span>Explorar mi equipo...</span>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
              {uploadFileName && (
                <p className="text-xs font-mono text-[#1A2530] font-semibold pt-1">
                  Archivo cargado: {uploadFileName}
                </p>
              )}
            </div>
          )}

          {/* 2. Pegar URL de Imagen */}
          {activeTab === 'url' && (
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
              <label className="text-xs font-mono text-[#2C3E50] uppercase font-semibold block">
                URL o enlace directo a la imagen del logo:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={logoUrlInput}
                  onChange={(e) => {
                    setLogoUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://ejemplo.com/logo-unidad-operativa.png"
                  className="flex-1 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E50] font-mono focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(logoUrlInput)}
                  className="px-3.5 py-2.5 bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] rounded-xl text-xs font-mono"
                >
                  Probar
                </button>
              </div>
              <p className="text-[11px] font-mono text-[#2C3E50]/60">
                Asegúrate de que la URL termine en .png, .svg, .jpg o sea accesible públicamente.
              </p>
            </div>
          )}

          {/* 3. Logos Preconfigurados */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {PRESET_LOGOS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setPreviewUrl(preset.url);
                    setLogoUrlInput(preset.url);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    previewUrl === preset.url 
                      ? 'bg-[#C5A880]/15 border-[#C5A880]' 
                      : 'bg-white border-[#E2E8F0] hover:border-[#C5A880]/60'
                  }`}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.title} 
                    className="w-10 h-10 rounded-lg object-cover shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-mono font-bold text-[#2C3E50] block truncate">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-[#2C3E50]/70 block truncate">
                      {preset.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones del Modal */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-mono text-xs font-bold transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Logo & Categoría</span>
          </button>
        </div>
      </div>
    </div>
  );
};
