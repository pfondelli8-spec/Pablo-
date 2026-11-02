import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { CORPORATE_POLICIES, HOTEL_PROCEDURES_DATABASE } from '../data/hotelPortalData';
import { CorporatePolicy } from '../types/hotelPortal';

interface CorporateViewProps {
  onBackToSelector: () => void;
  onReturnToHotel?: (hotelId: string) => void;
}

export const CorporateView: React.FC<CorporateViewProps> = ({
  onBackToSelector,
  onReturnToHotel
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'normas_corporativas' | 'politicas' | 'prevencion_prl' | 'proteccion_datos'>('todos');
  const [selectedPolicy, setSelectedPolicy] = useState<CorporatePolicy | null>(null);

  const corporateProcedures = HOTEL_PROCEDURES_DATABASE.filter(p => p.hotelId === 'corporate');

  const filteredPolicies = selectedCategory === 'todos' 
    ? CORPORATE_POLICIES 
    : CORPORATE_POLICIES.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans text-[#2C3E50]">
      {/* Barra de Navegación de Retorno */}
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
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span className="font-bold text-[#2C3E50] text-sm">DIRECCIÓN CENTRAL</span>
            <span className="text-[#2C3E50]/70">· Normas, Políticas & Estándares Globales</span>
          </div>
        </div>

        {onReturnToHotel && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReturnToHotel('klayman-diamond')}
              className="font-mono text-[11px] px-2.5 py-1 rounded bg-transparent text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]"
            >
              Unidad Principal →
            </button>
            <button
              onClick={() => onReturnToHotel('klayman-olivina')}
              className="font-mono text-[11px] px-2.5 py-1 rounded bg-transparent text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]"
            >
              Unidad Satélite 2 →
            </button>
          </div>
        )}
      </div>

      {/* Banner Principal */}
      <div className="rounded-xl bg-white border border-[#E2E8F0] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Capa Transversal de Dirección de Operaciones</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#2C3E50] tracking-tight">
          DIRECCIÓN CENTRAL & ESTÁNDARES GLOBALES
        </h1>

        <p className="text-xs sm:text-sm text-[#2C3E50]/80 leading-relaxed max-w-3xl">
          Contenidos y políticas comunes a todas las unidades operativas: 
          estándares de calidad y servicio F&B, prevención de riesgos laborales (PRL), 
          seguridad e higiene alimentaria (APPCC) y protección de datos (RGPD).
        </p>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {[
          { id: 'todos', label: `Todas las Políticas (${CORPORATE_POLICIES.length})` },
          { id: 'normas_corporativas', label: 'Estándares de Servicio' },
          { id: 'politicas', label: 'Seguridad Alimentaria (APPCC)' },
          { id: 'prevencion_prl', label: 'Prevención PRL' },
          { id: 'proteccion_datos', label: 'Protección de Datos (RGPD)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3.5 py-2 rounded-xl border transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#1A2530] border-[#1A2530] text-white font-bold'
                : 'bg-white border-[#E2E8F0] text-[#2C3E50] hover:bg-[#F8F9FA]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Políticas o Estado Vacío */}
      {filteredPolicies.length === 0 ? (
        <div className="p-10 rounded-xl bg-white border border-[#E2E8F0] text-center space-y-3 max-w-xl mx-auto">
          <ShieldCheck className="w-10 h-10 text-[#C5A880] mx-auto" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-[#2C3E50]">
              No hay políticas corporativas cargadas
            </h4>
            <p className="text-xs text-[#2C3E50]/70 font-mono">
              Redacte o importe las políticas transversales (PRL, RGPD, APPCC, manual de acogida) de su empresa.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolicies.map(pol => (
            <div
              key={pol.id}
              onClick={() => setSelectedPolicy(pol)}
              className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0] font-bold uppercase">
                  {pol.category.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-mono text-[#2C3E50]/50">
                  v{pol.version}
                </span>
              </div>

              <h3 className="font-bold text-[#2C3E50] text-base group-hover:text-[#1A2530] transition-colors">
                {pol.title}
              </h3>

              <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
                {pol.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E2E8F0]">
                {pol.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Procedimientos Transversales */}
      {corporateProcedures.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#2C3E50]">
            Procedimientos Transversales de Operaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {corporateProcedures.map(proc => (
              <div key={proc.id} className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-bold">
                  {proc.code}
                </span>
                <h3 className="font-bold text-[#2C3E50] text-sm">{proc.title}</h3>
                <p className="text-xs text-[#2C3E50]/70">{proc.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
