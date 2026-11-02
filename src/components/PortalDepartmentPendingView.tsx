import React from 'react';
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

interface PortalDepartmentPendingViewProps {
  hotelName: string;
  departmentName: string;
  onBack: () => void;
}

export const PortalDepartmentPendingView: React.FC<PortalDepartmentPendingViewProps> = ({
  hotelName,
  departmentName,
  onBack
}) => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 animate-fadeIn">
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="flex items-center justify-between gap-4 border-b border-stone-800/80 pb-5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>← Volver a Departamentos</span>
        </button>

        <span className="text-xs font-mono text-stone-400">
          {hotelName}
        </span>
      </div>

      {/* TARJETA DE ESTADO OFICIAL */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-950/20">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-amber-400 tracking-widest font-bold">
            DEPARTAMENTO EN FASE DE DOCUMENTACIÓN
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-100">
            {departmentName.toUpperCase()}
          </h2>
        </div>

        <div className="max-w-md mx-auto space-y-3 pt-2">
          <p className="text-base text-stone-200 font-sans font-medium">
            Este departamento se incorporará próximamente.
          </p>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            Siguiendo las directrices del Portal Interno de Operaciones Klayman, no se muestra contenido ficticio. Este departamento se habilitará con sus cartas, procedimientos y fichas técnicas conforme se valide la documentación oficial.
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-mono font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar a Selección de Departamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
