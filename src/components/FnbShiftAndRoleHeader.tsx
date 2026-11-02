import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  User, 
  MapPin, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  Check,
  RotateCcw
} from 'lucide-react';
import { UserRole, ShiftType, StationType } from '../types/fnbOperationsMaster';

interface FnbShiftAndRoleHeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentShift: ShiftType;
  onChangeShift: (shift: ShiftType) => void;
  currentStation: StationType;
  onChangeStation: (station: StationType) => void;
  hotelName: string;
  onOpenSearch: () => void;
  onResetDemoData: () => void;
}

export const FnbShiftAndRoleHeader: React.FC<FnbShiftAndRoleHeaderProps> = ({
  currentRole,
  onChangeRole,
  currentShift,
  onChangeShift,
  currentStation,
  onChangeStation,
  hotelName,
  onOpenSearch,
  onResetDemoData
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; desc: string }> = {
    trabajador: { 
      label: 'Trabajador F&B', 
      badge: 'Operativa Diaria', 
      desc: 'Consulta de cartas/SOPs y registro rápido de turnos, temperaturas y limpieza.' 
    },
    supervisor: { 
      label: 'Supervisor de Turno', 
      badge: 'Supervisión & Firma', 
      desc: 'Verificación de registros, validación APPCC y asignación de incidencias.' 
    },
    responsable_fnb: { 
      label: 'Responsable F&B', 
      badge: 'Gestión Departamental', 
      desc: 'Gestión de cartas, escandallos, límites de frío y directivas de servicio.' 
    },
    direccion: { 
      label: 'Dirección General', 
      badge: 'Auditoría Global', 
      desc: 'Acceso a auditorías inmutables, informes consolidados y control de calidad.' 
    }
  };

  const shiftLabels: Record<ShiftType, { label: string; hours: string }> = {
    manana: { label: 'Turno Mañana', hours: '08:00 - 16:00' },
    tarde: { label: 'Turno Tarde', hours: '16:00 - 00:00' },
    noche: { label: 'Turno Noche / Cierre', hours: '20:00 - 04:00' },
    partido: { label: 'Turno Partido', hours: '12:00-16:00 / 20:00-00:00' }
  };

  const stationsList: StationType[] = [
    'Bar Piscina',
    'Terraza Principal',
    'Restaurante Buffet',
    'Cocktails Lounge',
    'Cafetería & Desayunos',
    'Cocina / Office'
  ];

  return (
    <div className="bg-[#1A2530] text-white border-b border-[#2C3E50] sticky top-0 z-30 shadow-sm">
      {/* Barra corporativa minimalista y limpia */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        
        {/* 1. Logo de la compañía a la izquierda */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#C5A880] text-[#1A2530] flex items-center justify-center font-black text-lg tracking-wider shadow-inner">
            P
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-widest text-base text-white">PROA</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-[#C5A880]">
              F&B
            </span>
          </div>
        </div>

        {/* 2. Título 'Gestión Operativa F&B' centrado */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-center">
          <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white drop-shadow-xs">
            Gestión Operativa F&B
          </h1>
        </div>

        {/* 3. Un único icono de usuario a la derecha */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoleModal(true)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C5A880] cursor-pointer"
            title={`Usuario: ${roleLabels[currentRole].label} · Turno: ${shiftLabels[currentShift].label}`}
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* MODAL: CAMBIO DE ROL */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Seleccionar Rol de Usuario</h3>
                <p className="text-xs text-gray-500">Prueba la aplicación desde la perspectiva de cada perfil operativo</p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(Object.keys(roleLabels) as UserRole[]).map(roleKey => {
                const isSelected = currentRole === roleKey;
                const info = roleLabels[roleKey];
                return (
                  <button
                    key={roleKey}
                    onClick={() => {
                      onChangeRole(roleKey);
                      setShowRoleModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#C5A880]/10 ring-1 ring-[#C5A880]' 
                        : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1A2530]">{info.label}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {info.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{info.desc}</p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-gray-500 border-t border-[#E2E8F0]">
              Nota técnica: En un entorno de producción, los roles se autentican vía JWT / Firebase Auth con reglas de seguridad en Firestore.
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIO DE TURNO */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Seleccionar Turno de Trabajo</h3>
                <p className="text-xs text-gray-500">Afecta a los checklists de apertura, servicio y cierre</p>
              </div>
              <button 
                onClick={() => setShowShiftModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(Object.keys(shiftLabels) as ShiftType[]).map(shiftKey => {
                const isSelected = currentShift === shiftKey;
                const info = shiftLabels[shiftKey];
                return (
                  <button
                    key={shiftKey}
                    onClick={() => {
                      onChangeShift(shiftKey);
                      setShowShiftModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#C5A880]/10 ring-1 ring-[#C5A880]' 
                        : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-[#1A2530]">{info.label}</div>
                      <div className="text-xs text-gray-500 font-mono">{info.hours}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#C5A880]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMBIO DE ESTACIÓN / ÁREA */}
      {showStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Área o Punto de Venta</h3>
                <p className="text-xs text-gray-500">Filtra equipos y tareas según la ubicación del trabajador</p>
              </div>
              <button 
                onClick={() => setShowStationModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {stationsList.map(st => {
                const isSelected = currentStation === st;
                return (
                  <button
                    key={st}
                    onClick={() => {
                      onChangeStation(st);
                      setShowStationModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'border-[#C5A880] bg-[#C5A880]/10 ring-1 ring-[#C5A880]' 
                        : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-semibold text-sm text-[#1A2530]">{st}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#C5A880]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ESTADO DE DEMOSTRACIÓN & AUDITORÍA */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-[#1A2530]">Modo Demostración Operativa</h3>
              </div>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3 text-gray-600 leading-relaxed">
              <p>
                Esta aplicación está funcionando actualmente en <strong>Modo Demostración Funcional</strong>. Todos los registros de temperaturas, limpiezas, checklists e incidencias que introduzcas quedan registrados en el <strong>almacenamiento local del navegador con trazabilidad inmutable</strong>.
              </p>
              <div className="bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E8F0] space-y-1">
                <div className="font-semibold text-[#1A2530]">Para producción en cadena hotelera:</div>
                <p>
                  Basta con activar Firebase Firestore + Firebase Auth mediante el skill correspondiente para centralizar los registros entre todos los móviles del equipo y la terminal central de dirección.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  onResetDemoData();
                  setShowDemoModal(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Registros Demo</span>
              </button>
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-[#2C3E50] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
