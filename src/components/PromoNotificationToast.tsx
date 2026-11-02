import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Flame, 
  Beer, 
  Wine, 
  Sparkles, 
  X, 
  Clock, 
  ArrowRight,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { PromoAlertPayload, getPromoNotificationConfig, savePromoNotificationConfig } from '../services/promoNotificationService';

interface PromoNotificationToastProps {
  onOpenPromo?: (promoId: string) => void;
}

export const PromoNotificationToast: React.FC<PromoNotificationToastProps> = ({ onOpenPromo }) => {
  const [currentAlert, setCurrentAlert] = useState<PromoAlertPayload | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => getPromoNotificationConfig().soundEnabled);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<PromoAlertPayload>;
      if (customEvent.detail) {
        setCurrentAlert(customEvent.detail);
      }
    };

    const handleConfigUpdate = () => {
      setSoundEnabled(getPromoNotificationConfig().soundEnabled);
    };

    window.addEventListener('klayman_promo_notification', handleNotification);
    window.addEventListener('klayman_promo_config_updated', handleConfigUpdate);

    return () => {
      window.removeEventListener('klayman_promo_notification', handleNotification);
      window.removeEventListener('klayman_promo_config_updated', handleConfigUpdate);
    };
  }, []);

  // Auto-ocultar tras 10 segundos
  useEffect(() => {
    if (!currentAlert) return;
    const timer = setTimeout(() => {
      setCurrentAlert(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentAlert]);

  if (!currentAlert) return null;

  const renderIcon = () => {
    switch (currentAlert.iconType) {
      case 'beer':
        return <Beer className="w-5 h-5 text-amber-400" />;
      case 'spritz':
        return <Wine className="w-5 h-5 text-orange-400" />;
      case 'cocktail':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'flame':
      default:
        return <Flame className="w-5 h-5 text-amber-400 animate-pulse" />;
    }
  };

  const handleActionClick = () => {
    if (onOpenPromo) {
      onOpenPromo(currentAlert.promoId);
    }
    setCurrentAlert(null);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    savePromoNotificationConfig({ soundEnabled: newSound });
  };

  return (
    <aside 
      aria-label="Aviso de promoción operativa"
      className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounceIn pointer-events-auto"
    >
      <div className="relative rounded-3xl bg-stone-900/95 border-2 border-amber-500/80 p-4 shadow-2xl backdrop-blur-xl space-y-3 ring-4 ring-amber-500/10">
        
        {/* CABECERA DE LA ALERTA */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              {renderIcon()}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-display font-black text-[10px] uppercase tracking-wider block">
                {currentAlert.badgeText}
              </span>
              <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Alerta programada {currentAlert.time} h</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              title={soundEnabled ? 'Sonido activado' : 'Sonido silenciado'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
            </button>

            <button
              onClick={() => setCurrentAlert(null)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CUERPO DE LA ALERTA */}
        <div className="space-y-1">
          <h4 className="text-sm font-display font-bold text-stone-100 leading-snug">
            {currentAlert.title}
          </h4>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {currentAlert.body}
          </p>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={handleActionClick}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ver Oferta & TPV</span>
          </button>

          <button
            onClick={() => setCurrentAlert(null)}
            className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-mono transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </aside>
  );
};
