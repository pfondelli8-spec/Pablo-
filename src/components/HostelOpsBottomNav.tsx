import React from 'react';
import { 
  Home, 
  ClipboardCheck, 
  BookOpen, 
  Thermometer, 
  FileText,
  Settings
} from 'lucide-react';

export type HostelOpsMobileTab = 
  | 'inicio' 
  | 'mis_tareas' 
  | 'conocimiento' 
  | 'controles' 
  | 'documentos'
  | 'cocina';

interface HostelOpsBottomNavProps {
  activeTab: HostelOpsMobileTab;
  onTabChange: (tab: HostelOpsMobileTab) => void;
  pendingChecksCount: number;
}

export const HostelOpsBottomNav: React.FC<HostelOpsBottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingChecksCount
}) => {
  return (
    <nav 
      aria-label="Navegación principal móvil"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A2530] text-white border-t border-[#2C3E50] md:hidden shadow-lg safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        
        {/* 1. INICIO */}
        <button
          type="button"
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-colors relative ${
            activeTab === 'inicio' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Inicio</span>
          {activeTab === 'inicio' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 2. MIS TAREAS */}
        <button
          type="button"
          onClick={() => onTabChange('mis_tareas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-colors relative ${
            activeTab === 'mis_tareas' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="relative">
            <ClipboardCheck className="w-5 h-5 mb-0.5" />
            {pendingChecksCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {pendingChecksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">Mis tareas</span>
          {activeTab === 'mis_tareas' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 3. CONOCIMIENTO */}
        <button
          type="button"
          onClick={() => onTabChange('conocimiento')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-colors relative ${
            activeTab === 'conocimiento' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Conocimiento</span>
          {activeTab === 'conocimiento' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 4. CONTROLES */}
        <button
          type="button"
          onClick={() => onTabChange('controles')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-colors relative ${
            activeTab === 'controles' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Thermometer className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Controles</span>
          {activeTab === 'controles' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

        {/* 5. DOCUMENTOS */}
        <button
          type="button"
          onClick={() => onTabChange('documentos')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-colors relative ${
            activeTab === 'documentos' ? 'text-[#C5A880]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Documentos</span>
          {activeTab === 'documentos' && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
          )}
        </button>

      </div>
    </nav>
  );
};
