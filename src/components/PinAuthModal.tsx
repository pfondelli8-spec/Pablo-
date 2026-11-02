import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  KeyRound,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Crown,
  Briefcase,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

export type PinAccessTier = 'admin' | 'jefe' | 'empleado';

export interface PinAuthSession {
  tier: PinAccessTier;
  operatorName: string;
  unlockedAt: string;
}

interface PinAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: PinAccessTier;
  onSelectTier: (tier: PinAccessTier, operatorName?: string) => void;
  activeHotelName?: string;
  onSuccessAction?: (operatorName: string) => void;
  title?: string;
  subtitle?: string;
}

// Códigos PIN oficiales (Vulcano: 0000, Bitácora: 1234, Admin: 8899)
export const DEFAULT_PINS = {
  vulcano: '0000',
  bitacora: '1234',
  admin: '8899',
  jefe: '4455',
  empleado: '1234'
};

const STORAGE_CUSTOM_PINS_KEY = 'proa_security_pins_config';

export const getStoredPins = () => {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_PINS_KEY);
    if (saved) return { ...DEFAULT_PINS, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_PINS;
};

export const saveStoredPins = (pins: typeof DEFAULT_PINS) => {
  try {
    localStorage.setItem(STORAGE_CUSTOM_PINS_KEY, JSON.stringify(pins));
  } catch {}
};

export const PinAuthModal: React.FC<PinAuthModalProps> = ({
  isOpen,
  onClose,
  currentTier = 'admin',
  onSelectTier,
  activeHotelName = 'Dirección Operativa de Hoteles',
  onSuccessAction,
  title = 'Control de Acceso por Código',
  subtitle
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + num;
      setEnteredPin(next);
      setErrorMessage(null);
      if (next.length === 4) {
        validatePin(next);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorMessage(null);
  };

  const validatePin = (pin: string) => {
    const pins = getStoredPins();

    // 1. Hotel Vulcano Chef: 0000
    if (pin === pins.vulcano || pin === '0000') {
      setSuccessMessage('Acceso concedido: Chef Hotel Vulcano (Giacomo Longo)');
      setTimeout(() => {
        onSelectTier('admin', 'Giacomo Longo');
        if (onSuccessAction) onSuccessAction('Giacomo Longo');
        onClose();
        setEnteredPin('');
        setSuccessMessage(null);
      }, 400);
      return;
    }

    // 2. Hotel Bitácora Chef: 1234
    if (pin === pins.bitacora || pin === '1234') {
      setSuccessMessage('Acceso concedido: Chef Hotel Bitácora (Antonio González)');
      setTimeout(() => {
        onSelectTier('admin', 'Antonio González');
        if (onSuccessAction) onSuccessAction('Antonio González');
        onClose();
        setEnteredPin('');
        setSuccessMessage(null);
      }, 400);
      return;
    }

    // 3. Admin General: 8899
    if (pin === pins.admin || pin === '8899') {
      setSuccessMessage('Acceso concedido: Administrador General');
      setTimeout(() => {
        onSelectTier('admin', 'Administrador General');
        if (onSuccessAction) onSuccessAction('Administrador General');
        onClose();
        setEnteredPin('');
        setSuccessMessage(null);
      }, 400);
      return;
    }

    // 4. Jefe de Departamento: 4455
    if (pin === pins.jefe || pin === '4455') {
      setSuccessMessage('Acceso concedido: Jefe de Departamento');
      setTimeout(() => {
        onSelectTier('jefe', 'Jefe de Partida');
        if (onSuccessAction) onSuccessAction('Jefe de Partida');
        onClose();
        setEnteredPin('');
        setSuccessMessage(null);
      }, 400);
      return;
    }

    setErrorMessage('Código PIN incorrecto. Inténtelo de nuevo.');
    setEnteredPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scale-up">
        {/* Cabecera institucional */}
        <div className="bg-[#1A2530] p-6 text-white relative border-b border-[#2C3E50]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0e2a47] border border-amber-400/40 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <img src="/assets/aistudio/image_bcb1fe16.png" alt="Spring Hotels Group" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">{title}</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  F&B
                </span>
              </div>
              <p className="text-xs text-[#C5A880] font-semibold">{activeHotelName} · Spring Hotels Group</p>
            </div>
          </div>
          
          <p className="text-xs text-white/70 mt-1">
            {subtitle || 'Introduzca el código PIN para acceder a la administración y generar cambios operativos.'}
          </p>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-5">
          {/* Indicador de dígitos */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3.5">
              {[0, 1, 2, 3].map(index => {
                const filled = enteredPin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black transition-all ${
                      filled
                        ? 'bg-[#1A2530] text-[#C5A880] scale-105 shadow-md border-2 border-[#C5A880]'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {filled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Teclado numérico táctil */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-xl font-black text-[#1A2530] shadow-2xs transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs font-bold text-slate-600 uppercase transition-all flex items-center justify-center cursor-pointer"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-xl font-black text-[#1A2530] shadow-2xs transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-13 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-sm font-bold text-slate-600 uppercase transition-all flex items-center justify-center cursor-pointer"
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

