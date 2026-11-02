import React from 'react';
import { 
  Flame, 
  X, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  DollarSign 
} from 'lucide-react';
import { PromotionEntity } from '../types/hotelPortal';

interface PromotionDetailModalProps {
  promotion: PromotionEntity | null;
  onClose: () => void;
}

export const PromotionDetailModal: React.FC<PromotionDetailModalProps> = ({
  promotion,
  onClose
}) => {
  if (!promotion) return null;

  const isTemporal = promotion.type === 'temporal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans text-[#2C3E50]">
      <div className="relative w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden my-6">
        {/* CABECERA */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                promotion.status === 'ACTIVA' 
                  ? 'bg-[#C5A880]/15 text-[#1A2530] border-[#C5A880]/40 font-bold' 
                  : 'bg-[#F8F9FA] text-[#2C3E50]/70 border-[#E2E8F0]'
              }`}>
                {promotion.status}
              </span>

              <span className="text-xs font-mono px-2 py-0.5 rounded border bg-[#F8F9FA] text-[#2C3E50] border-[#E2E8F0]">
                {isTemporal ? '⏳ INFORMACIÓN TEMPORAL' : '📌 INFORMACIÓN PERMANENTE'}
              </span>

              <span className="text-xs font-mono text-[#C5A880] font-bold">
                {promotion.outletName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
              {promotion.name}
            </h2>
            <p className="text-xs text-[#2C3E50]/70 font-mono">
              Categoría: {promotion.category.toUpperCase().replace('_', ' ')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Fila de Parámetros de Calendario & Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono text-[#C5A880] font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>HORARIO</span>
              </span>
              <p className="text-xs text-[#2C3E50] font-bold">
                {promotion.schedule}
              </p>
              <p className="text-[11px] text-[#2C3E50]/70">
                {promotion.days}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono text-[#C5A880] font-bold flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>PRECIO / CONDICIÓN</span>
              </span>
              <p className="text-xs text-[#1A2530] font-bold">
                {promotion.price}
              </p>
              <p className="text-[11px] text-[#2C3E50]/60">
                P.V.P. fijado en TPV
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono text-[#C5A880] font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>VIGENCIA</span>
              </span>
              <p className="text-xs text-[#2C3E50] font-bold">
                {isTemporal && promotion.startDate && promotion.endDate 
                  ? `${promotion.startDate} al ${promotion.endDate}`
                  : 'Permanente en temporada oficial'
                }
              </p>
              <p className="text-[11px] text-[#2C3E50]/70">
                {isTemporal ? 'Campaña con caducidad' : 'Estándar continuo'}
              </p>
            </div>
          </div>

          {/* Productos Incluidos */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#2C3E50]/70 font-bold tracking-wider block">
              Productos Incluidos en la Promoción:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {promotion.includedProducts.map((prod, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#2C3E50] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>{prod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Condiciones Operativas */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider block">
              Condiciones de Aplicación:
            </span>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5">
              {promotion.conditions.map((cond, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#2C3E50]">
                  <span className="text-[#C5A880] font-bold shrink-0">•</span>
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Procedimiento de Aplicación en Sala / TPV */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider block">
              Procedimiento de Aplicación (Equipo de Sala / Barra):
            </span>
            <div className="space-y-2">
              {promotion.applicationProcedure.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50] leading-relaxed flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#C5A880] text-[#1A2530] flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trazabilidad Documental */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono text-[#2C3E50]/70 flex items-center justify-between">
            <span>Fuente Documental: {promotion.sourceDoc || 'Registro de Operaciones Comerciales'}</span>
            <span className="text-[#C5A880] font-bold">Verificado</span>
          </div>
        </div>

        {/* PIE */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs font-mono text-[#2C3E50]/70">
          <span>Operations Hub · Módulo de Promociones F&B</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
