import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Layers, 
  UtensilsCrossed, 
  Search, 
  ChevronRight, 
  FolderTree, 
  Filter 
} from 'lucide-react';
import { KLAYMAN_HOTELS } from '../data/hotelPortalData';
import { HotelEntity } from '../types/hotelPortal';

interface HotelSelectorViewProps {
  hotels?: HotelEntity[];
  onSelectHotel: (hotelId: string) => void;
  onOpenCorporate: () => void;
  onOpenAddHotel: (initialStars?: number) => void;
  onOpenSetLogo?: (hotel: HotelEntity) => void;
  onOpenGlobalSearchWithQuery?: (query: string) => void;
}

export const HotelSelectorView: React.FC<HotelSelectorViewProps> = ({
  hotels = KLAYMAN_HOTELS,
  onSelectHotel,
  onOpenCorporate,
  onOpenAddHotel,
  onOpenGlobalSearchWithQuery
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'principales' | 'satelites'>('todos');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenGlobalSearchWithQuery && searchInput.trim()) {
      onOpenGlobalSearchWithQuery(searchInput.trim());
    }
  };

  const filteredHotels = hotels.filter(unit => {
    if (categoryFilter === 'principales') return unit.id === 'klayman-diamond';
    if (categoryFilter === 'satelites') return unit.id !== 'klayman-diamond';
    return true;
  });

  return (
    <div className="space-y-10 py-4 animate-fade-in font-sans">
      {/* CABECERA OPERATIVA PRINCIPAL */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#2C3E50] text-xs font-mono font-medium shadow-none">
          <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>SISTEMA DE GESTIÓN Y DIRECCIÓN DE OPERACIONES</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold text-[#2C3E50] tracking-tight">
          OPERATIONS HUB · F&B
        </h1>

        <p className="text-base sm:text-lg text-[#2C3E50]/80 font-medium">
          “Estandarización técnica de recetas, manuales de procedimiento y control operativo.”
        </p>

        <p className="text-xs sm:text-sm text-[#2C3E50]/70 max-w-2xl mx-auto">
          Estructura operativa unificada para puntos de venta, departamentos técnicos, fichas estandarizadas para TPV y gestión de turnos.
        </p>

        {/* BUSCADOR GLOBAL */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#C5A880] absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar en el Hub: 'Mojito Clásico', 'Espresso Martini', 'SOP Apertura'..."
              className="w-full bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl pl-11 pr-24 py-3 text-xs sm:text-sm text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] font-mono transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-3.5 py-1.5 bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold rounded-lg text-xs font-mono transition-colors"
            >
              Buscar
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-mono text-[#2C3E50]/60 flex-wrap">
            <span>Consultas directas:</span>
            {['Mojito Clásico', 'Dry Martini', 'Espresso Martini', 'Control APPCC', 'SOP Apertura'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => onOpenGlobalSearchWithQuery && onOpenGlobalSearchWithQuery(item)}
                className="text-[#2C3E50]/75 hover:text-[#C5A880] underline underline-offset-2 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ARQUITECTURA VISUAL EXPLICATIVA */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono text-[#2C3E50]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
          <span className="text-[#2C3E50] font-semibold flex items-center gap-1.5">
            <FolderTree className="w-4 h-4 text-[#C5A880]" />
            <span>Jerarquía Operativa del Sistema:</span>
          </span>
          <span className="text-[11px] text-[#C5A880] font-semibold">Esquema Centralizado</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
          <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[#2C3E50]/50 block text-[9px] uppercase">Nivel 1</span>
            <span className="text-[#2C3E50] font-bold block">OPERATIONS HUB</span>
            <span className="text-[#2C3E50]/60 text-[10px]">Capa Central</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#C5A880]/10 border border-[#C5A880]/40">
            <span className="text-[#C5A880] block text-[9px] uppercase font-bold">Nivel 2</span>
            <span className="text-[#1A2530] font-bold block">UNIDAD OPERATIVA</span>
            <span className="text-[#2C3E50]/80 text-[10px]">Centro F&B</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[#2C3E50]/50 block text-[9px] uppercase">Nivel 3</span>
            <span className="text-[#2C3E50] font-bold block">DEPARTAMENTO</span>
            <span className="text-[#2C3E50]/60 text-[10px]">F&B, Producción...</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[#2C3E50]/50 block text-[9px] uppercase">Nivel 4</span>
            <span className="text-[#2C3E50] font-bold block">PUNTO SERVICIO</span>
            <span className="text-[#2C3E50]/60 text-[10px]">Barra, Sala, Cocina</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
            <span className="text-[#2C3E50]/50 block text-[9px] uppercase">Nivel 5</span>
            <span className="text-[#2C3E50] font-bold block">FICHA TÉCNICA</span>
            <span className="text-[#2C3E50]/60 text-[10px]">Estandarización TPV</span>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTRO POR UNIDAD & ACCIONES */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#2C3E50]/70 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Filtrar:</span>
          </span>
          
          <button
            onClick={() => setCategoryFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              categoryFilter === 'todos'
                ? 'bg-[#1A2530] text-white font-bold border border-[#1A2530]'
                : 'bg-transparent text-[#2C3E50] hover:bg-white border border-[#E2E8F0]'
            }`}
          >
            Todas las Unidades ({hotels.length})
          </button>

          <button
            onClick={() => setCategoryFilter('principales')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              categoryFilter === 'principales'
                ? 'bg-[#1A2530] text-white font-bold border border-[#1A2530]'
                : 'bg-transparent text-[#2C3E50] hover:bg-white border border-[#E2E8F0]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Unidad Principal F&B</span>
          </button>

          <button
            onClick={() => setCategoryFilter('satelites')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
              categoryFilter === 'satelites'
                ? 'bg-[#1A2530] text-white font-bold border border-[#1A2530]'
                : 'bg-transparent text-[#2C3E50] hover:bg-white border border-[#E2E8F0]'
            }`}
          >
            <span>Unidades Satélites</span>
          </button>
        </div>

        <button
          onClick={() => onOpenAddHotel(4)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-all shadow-none group"
        >
          <Plus className="w-3.5 h-3.5 text-[#1A2530] group-hover:rotate-90 transition-transform" />
          <span>+ Añadir Unidad Operativa</span>
        </button>
      </div>

      {/* BANNER DIRECTO: HERRAMIENTA DE TRABAJO MÓVIL F&B */}
      <div className="max-w-5xl mx-auto">
        <div className="p-4 sm:p-5 rounded-xl bg-[#1A2530] text-white border border-[#2C3E50] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] font-bold">
                HERRAMIENTA DE TRABAJO DIARIO (MÓVIL & SERVICIO)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              F&B Operations Portal: Turno, Temperaturas, Limpieza & Fichas
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              Diseñado para operar desde el teléfono: registrar lecturas de frío APPCC con validación, tareas de limpieza, incidencias con fotos y consulta de recetas oficiales para TPV.
            </p>
          </div>

          <button
            onClick={() => onSelectHotel('klayman-diamond')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            <span>Entrar a F&B Operations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* UNIDADES OPERATIVAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredHotels.map(unit => {
          const isPrimary = unit.id === 'klayman-diamond';

          return (
            <div 
              key={unit.id}
              className="relative flex flex-col justify-between rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all overflow-hidden"
            >
              {/* Franja superior de acento */}
              <div className={`h-1.5 w-full ${isPrimary ? 'bg-[#C5A880]' : 'bg-[#E2E8F0]'}`} />

              <div className="p-6 sm:p-7 space-y-5 flex-1">
                {/* Cabecera de la Unidad */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                        {unit.code}
                      </span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#2C3E50] border border-[#C5A880]/40">
                        {unit.categoryLabel || 'Unidad Operativa'}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] truncate">
                      {unit.name}
                    </h2>

                    <div className="flex items-center gap-1.5 text-xs text-[#2C3E50]/70 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>{unit.location}</span>
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-xl border border-[#E2E8F0] flex items-center justify-center bg-[#F8F9FA] text-[#C5A880]">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                </div>

                {/* Resumen Operativo */}
                <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
                  {unit.summary}
                </p>

                {/* Estructura Departamental */}
                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                  <div className="text-[11px] font-mono uppercase text-[#2C3E50]/60 flex items-center justify-between">
                    <span>Departamentos Operativos:</span>
                    <span className="text-[#2C3E50]/70 font-normal">{unit.departments.length} Áreas</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {unit.departments.map(dept => (
                      <span
                        key={dept.id}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          dept.status === 'activo_piloto'
                            ? 'bg-[#C5A880]/15 text-[#1A2530] border-[#C5A880]/50 font-semibold'
                            : 'bg-[#F8F9FA] text-[#2C3E50]/70 border-[#E2E8F0]'
                        }`}
                      >
                        {dept.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Entrada */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectHotel(unit.id)}
                  className="w-full py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530]"
                >
                  <span>ACCEDER A {unit.name.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CAPA CORPORATIVA & ESCALABILIDAD */}
      <div className="max-w-5xl mx-auto pt-6 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta Dirección Central */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider">
                Capa Transversal Central
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#2C3E50]">
              DIRECCIÓN DE OPERACIONES CENTRAL
            </h3>
            <p className="text-xs text-[#2C3E50]/70 leading-relaxed">
              Normativas operativas, manuales de buenas prácticas de higiene (APPCC), 
              prevención de riesgos laborales (PRL) y políticas comunes para todas las unidades.
            </p>
          </div>

          <button
            onClick={onOpenCorporate}
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-xs font-medium text-[#2C3E50] border border-[#E2E8F0] transition-colors w-full"
          >
            <span>Acceder a Dirección Central</span>
            <ChevronRight className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>

        {/* Tarjeta Escalabilidad (+ Añadir Unidad) */}
        <div className="p-5 rounded-xl bg-white border border-dashed border-[#E2E8F0] hover:border-[#C5A880] transition-all flex flex-col justify-between space-y-4 group">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C5A880]" />
              <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider">
                Arquitectura Modular
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#2C3E50] group-hover:text-[#1A2530] transition-colors">
              + Añadir Nueva Unidad Operativa
            </h3>
            <p className="text-xs text-[#2C3E50]/70 leading-relaxed">
              El esquema permite incorporar nuevas unidades operativas con puntos de servicio propios, 
              fichas técnicas asignadas y control de turnos independientes.
            </p>
          </div>

          <button
            onClick={() => onOpenAddHotel(4)}
            className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-xs font-medium text-[#2C3E50] border border-[#E2E8F0] hover:border-[#C5A880] transition-colors w-full"
          >
            <span>Configurar Nueva Unidad</span>
            <Plus className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>
      </div>
    </div>
  );
};
