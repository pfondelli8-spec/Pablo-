import React from 'react';
import { 
  Home, 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { UserRole } from '../types/fnbOperationsMaster';

export type FnbNavigationTab = 
  | 'inicio' 
  | 'registros' 
  | 'documentacion' 
  | 'comunicaciones' 
  | 'supervision';

interface FnbBottomNavProps {
  activeTab: FnbNavigationTab;
  onTabChange: (tab: FnbNavigationTab) => void;
  currentRole: UserRole;
  pendingRegistrosCount: number;
  urgentIncidentsCount: number;
}

export const FnbBottomNav: React.FC<FnbBottomNavProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  pendingRegistrosCount,
  urgentIncidentsCount
}) => {
  const isSupervisorOrAbove = currentRole === 'supervisor' || currentRole === 'responsable_fnb' || currentRole === 'direccion';

  return (
    <nav 
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A2530] text-white border-t border-[#2C3E50] md:hidden shadow-lg safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        
        {/* 1. INICIO */}
        <button
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
            activeTab === 'inicio' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium tracking-tight">Inicio</span>
          {activeTab === 'inicio' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 2. REGISTROS */}
        <button
          onClick={() => onTabChange('registros')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
            activeTab === 'registros' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="relative">
            <ClipboardCheck className="w-5 h-5 mb-0.5" />
            {pendingRegistrosCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {pendingRegistrosCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">Registros</span>
          {activeTab === 'registros' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 3. DOCUMENTACIÓN */}
        <button
          onClick={() => onTabChange('documentacion')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
            activeTab === 'documentacion' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium tracking-tight">Documentación</span>
          {activeTab === 'documentacion' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 4. COMUNICACIONES */}
        <button
          onClick={() => onTabChange('comunicaciones')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
            activeTab === 'comunicaciones' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 mb-0.5" />
            {urgentIncidentsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {urgentIncidentsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">Comunicaciones</span>
          {activeTab === 'comunicaciones' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 5. SUPERVISIÓN (si el usuario es supervisor o dirección) */}
        {isSupervisorOrAbove && (
          <button
            onClick={() => onTabChange('supervision')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
              activeTab === 'supervision' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium tracking-tight">Supervisión</span>
            {activeTab === 'supervision' && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            )}
          </button>
        )}
      </div>
    </nav>
  );
};
