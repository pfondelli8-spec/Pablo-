import React, { useState } from 'react';
import { 
  Building2, 
  Sun, 
  UtensilsCrossed, 
  ArrowLeft, 
  ShieldAlert 
} from 'lucide-react';
import { KLAYMAN_HOTELS } from '../data/hotelPortalData';
import { BarSolMenuView } from './BarSolMenuView';
import { ProcedimientosOperativosView } from './ProcedimientosOperativosView';

interface OlivinaDashboardViewProps {
  onBackToSelector: () => void;
  onNavigateToCorporate: () => void;
  onSwitchToDiamond: () => void;
}

export const OlivinaDashboardView: React.FC<OlivinaDashboardViewProps> = ({
  onBackToSelector,
  onNavigateToCorporate,
  onSwitchToDiamond
}) => {
  const unit = KLAYMAN_HOTELS.find(h => h.id === 'klayman-olivina') || KLAYMAN_HOTELS[1];
  const [activeTab, setActiveTab] = useState<'overview' | 'barsol' | 'procedimientos'>('overview');

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans text-[#2C3E50]">
      {/* BARRA SUPERIOR DE CONTEXTO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSelector}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Volver a Unidades Operativas</span>
          </button>
          
          <div className="h-4 w-[1px] bg-[#E2E8F0] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-[#C5A880] font-bold">{unit.code}</span>
            <span className="font-bold text-[#2C3E50] text-sm">{unit.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToDiamond}
            className="font-mono text-[11px] px-2.5 py-1 rounded bg-transparent text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]"
          >
            Ir a Unidad Principal →
          </button>
          <button
            onClick={onNavigateToCorporate}
            className="font-mono text-[11px] text-[#2C3E50]/70 hover:text-[#C5A880] underline"
          >
            Dirección Central
          </button>
        </div>
      </div>

      {/* CABECERA PRINCIPAL */}
      <div className="rounded-xl bg-white border border-[#E2E8F0] p-6 sm:p-8 space-y-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">
            <Sun className="w-4 h-4" />
            <span>Punto de Venta Satélite F&B</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-[#2C3E50] tracking-tight">
            {unit.name.toUpperCase()}
          </h1>

          <p className="text-xs sm:text-sm text-[#2C3E50]/80 leading-relaxed">
            {unit.summary}
          </p>
        </div>
      </div>

      {/* SUB-NAVEGACIÓN */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E2E8F0] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-[#1A2530] text-white font-bold'
              : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
          }`}
        >
          Vista Operativa General
        </button>

        <button
          onClick={() => setActiveTab('barsol')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'barsol'
              ? 'bg-[#1A2530] text-white font-bold'
              : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Carta Oficial del Punto de Venta</span>
        </button>

        <button
          onClick={() => setActiveTab('procedimientos')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'procedimientos'
              ? 'bg-[#1A2530] text-white font-bold'
              : 'text-[#2C3E50]/70 hover:text-[#2C3E50] hover:bg-[#F8F9FA]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Procedimientos Operativos (SOP)</span>
        </button>
      </div>

      {/* TAB OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="font-bold text-lg text-[#2C3E50] flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-[#C5A880]" />
              <span>Servicio de Barra & Carta Rápida</span>
            </h3>
            <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
              Punto de servicio para rotación ágil, coctelería clásica simplificada, cafetería de especialidad y tapas estandarizadas.
            </p>
            <button
              onClick={() => setActiveTab('barsol')}
              className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors"
            >
              Consultar Carta Completa →
            </button>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
            <h3 className="font-bold text-lg text-[#2C3E50] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#C5A880]" />
              <span>Estándares & Procedimientos</span>
            </h3>
            <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
              Protocolos de apertura de turno, desinfección, control de temperaturas en cámaras y cuadre de arqueos de caja.
            </p>
            <button
              onClick={() => setActiveTab('procedimientos')}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] font-mono text-xs transition-colors"
            >
              Ver Protocolos Operativos →
            </button>
          </div>
        </div>
      )}

      {/* TAB CARTA */}
      {activeTab === 'barsol' && (
        <div className="animate-fade-in">
          <BarSolMenuView onBackToOperations={() => setActiveTab('overview')} />
        </div>
      )}

      {/* TAB PROCEDIMIENTOS */}
      {activeTab === 'procedimientos' && (
        <div className="animate-fade-in">
          <ProcedimientosOperativosView />
        </div>
      )}
    </div>
  );
};
