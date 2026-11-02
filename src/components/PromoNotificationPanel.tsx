import React, { useState, useEffect } from 'react';
import { 
  BellRing,
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Flame, 
  Play,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  getPromoNotificationConfig, 
  savePromoNotificationConfig, 
  getNotificationPermissionStatus,
  requestNotificationPermission,
  simulatePromoAlert,
  PromoNotificationConfig
} from '../services/promoNotificationService';

export const PromoNotificationPanel: React.FC = () => {
  const [config, setConfig] = useState<PromoNotificationConfig>(getPromoNotificationConfig);
  const [permissionStatus, setPermissionStatus] = useState(getNotificationPermissionStatus);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleConfigUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PromoNotificationConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      }
    };

    window.addEventListener('klayman_promo_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('klayman_promo_config_updated', handleConfigUpdate);
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    const granted = await requestNotificationPermission();
    setPermissionStatus(getNotificationPermissionStatus());
    setIsRequesting(false);
    if (granted) {
      simulatePromoAlert('happy_hour');
      setTestSent('happy_hour');
      setTimeout(() => setTestSent(null), 3000);
    }
  };

  const handleToggleSound = () => {
    const updated = savePromoNotificationConfig({ soundEnabled: !config.soundEnabled });
    setConfig(updated);
  };

  const handleToggleVibration = () => {
    const updated = savePromoNotificationConfig({ vibrationEnabled: !config.vibrationEnabled });
    setConfig(updated);
  };

  const handleSimulate = (type: 'happy_hour' | 'lunes_beer' | 'spritz_days' | 'domingos_mojitos' | 'viernes_hh') => {
    simulatePromoAlert(type);
    setTestSent(type);
    setTimeout(() => setTestSent(null), 3000);
  };

  return (
    <div className="rounded-xl bg-stone-900/80 border border-stone-800 p-2.5 sm:p-3 shadow-sm space-y-2.5">
      
      {/* BARRA HORIZONTAL COMPACTA */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-display font-bold text-stone-200 truncate">
                Alertas en el Móvil
              </span>
              <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
                · 14:55 h (Happy Hour) & 10:00 h (Ofertas de día)
              </span>
              {permissionStatus === 'granted' ? (
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[9px] font-bold">
                  Activo
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 font-mono text-[9px]">
                  Configurar
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ACCIÓN PRINCIPAL DE PERMISOS Y PRUEBAS */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {permissionStatus !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-mono font-bold text-[11px] transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <BellRing className="w-3 h-3" />
              <span>{isRequesting ? 'Activando...' : 'Activar en Móvil'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleSimulate('happy_hour')}
              className="py-1 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{testSent ? '¡Enviada!' : 'Probar'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors text-[11px] font-mono flex items-center gap-1"
            title={isExpanded ? 'Ocultar detalles' : 'Ver horarios y ajustes'}
          >
            <span className="hidden md:inline">{isExpanded ? 'Ocultar' : 'Ajustes'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* DETALLES EXPANDIBLES SOLO CUANDO EL USUARIO LO REQUIERE */}
      {isExpanded && (
        <div className="space-y-2.5 pt-2 border-t border-stone-800 animate-fadeIn text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* 1. HAPPY HOUR 14:55 h */}
            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-850 space-y-1">
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1 text-[11px]">
                  <Flame className="w-3 h-3" />
                  <span>14:55 h · Happy Hour (Tres menos cinco)</span>
                </span>
                <button
                  onClick={() => handleSimulate('happy_hour')}
                  className="px-2 py-0.5 rounded bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-mono text-[10px] text-stone-300 transition-all flex items-center gap-1"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Probar</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Aviso 5 min antes del 2x1 diario (15:00 a 16:00 h).
              </p>
            </div>

            {/* 2. OFERTAS DE DÍA A LAS 10:00 h */}
            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-850 space-y-1">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>10:00 h · Ofertas de Día (Lun, Mié, Dom, Vie)</span>
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => handleSimulate('lunes_beer')}
                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-mono text-[9px] text-amber-300 font-bold"
                    title="Probar alerta Lunes Jarras de Cerveza 3€"
                  >
                    Lun Jarras 3€
                  </button>
                  <button
                    onClick={() => handleSimulate('spritz_days')}
                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-orange-500 hover:text-stone-950 font-mono text-[9px] text-orange-300 font-bold"
                    title="Probar alerta Spritz a 6€ (Las 4 Variedades)"
                  >
                    Spritz 6€ (4 Var)
                  </button>
                  <button
                    onClick={() => handleSimulate('domingos_mojitos')}
                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 font-mono text-[9px] text-emerald-300 font-bold"
                    title="Probar alerta Domingos de Mojitos a 5€ (Solo Domingos)"
                  >
                    Dom Mojitos 5€
                  </button>
                  <button
                    onClick={() => handleSimulate('viernes_hh')}
                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-amber-500 hover:text-stone-950 font-mono text-[9px] text-amber-300 font-bold"
                    title="Probar alerta Viernes 2x1 en Cócteles Seleccionados (10:00 - 22:00 h)"
                  >
                    Vie 2x1
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Notifica a las 10:00 h: Lunes Jarras 3€ (08:00-22:00), Miércoles Spritz a 6€ (4 variedades · 08:00-22:30), Viernes 2x1 en cócteles (10:00-22:00) y Domingos Mojitos a 5€ (solo domingos · 08:00-22:30). Desactivadas en TPV las teclas obsoletas de Cócteles Sunset y Spritz en domingo.
              </p>
            </div>
          </div>

          {/* AJUSTES DE SONIDO Y VIBRACIÓN */}
          <div className="flex items-center justify-between gap-2 pt-1 font-mono text-[11px] text-stone-400 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSound}
                className={`px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                  config.soundEnabled
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                    : 'bg-stone-850 text-stone-500 border-stone-800'
                }`}
              >
                {config.soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>{config.soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
              </button>

              <button
                onClick={handleToggleVibration}
                className={`px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                  config.vibrationEnabled
                    ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                    : 'bg-stone-850 text-stone-500 border-stone-800'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>{config.vibrationEnabled ? 'Vibración ON' : 'Vibración OFF'}</span>
              </button>
            </div>

            <div className="text-[10px] text-stone-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Android, iPhone y PC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
