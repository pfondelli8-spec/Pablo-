import React from 'react';
import { 
  ArrowLeft, 
  Wine, 
  UtensilsCrossed, 
  ChefHat, 
  ConciergeBell, 
  Sparkles, 
  Wrench, 
  FileText, 
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';

interface DepartmentItem {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  isReady: boolean;
}

interface PortalDepartmentSelectorProps {
  hotelId: 'diamond' | 'olivina' | 'proximamente';
  onSelectDepartment: (deptId: string) => void;
  onBack: () => void;
}

export const PortalDepartmentSelector: React.FC<PortalDepartmentSelectorProps> = ({
  hotelId,
  onSelectDepartment,
  onBack
}) => {
  const hotelInfo = {
    diamond: {
      name: 'KLAYMAN DIAMOND',
      stars: '★★★★ 4 ESTRELLAS',
      location: 'Los Gigantes, Tenerife'
    },
    olivina: {
      name: 'KLAYMAN OLIVINA',
      stars: '★★★ 3 ESTRELLAS',
      location: 'Los Cristianos, Tenerife'
    },
    proximamente: {
      name: 'HOTEL ?',
      stars: 'PRÓXIMAMENTE',
      location: 'Tercer Establecimiento'
    }
  }[hotelId];

  const departments: DepartmentItem[] = [
    {
      id: 'bar',
      name: 'BAR / TERRAZA',
      shortDesc: 'Cartas, fichas, control operativo y procedimientos',
      icon: Wine,
      isReady: hotelId === 'diamond'
    },
    {
      id: 'restaurante',
      name: 'RESTAURANTE',
      shortDesc: 'Buffet, sala y desayunos',
      icon: UtensilsCrossed,
      isReady: false
    },
    {
      id: 'cocina',
      name: 'COCINA',
      shortDesc: 'Partidas y APPCC',
      icon: ChefHat,
      isReady: false
    },
    {
      id: 'recepcion',
      name: 'RECEPCIÓN',
      shortDesc: 'Check-in y atención 24h',
      icon: ConciergeBell,
      isReady: false
    },
    {
      id: 'pisos',
      name: 'PISOS / LIMPIEZA',
      shortDesc: 'Housekeeping y zonas nobles',
      icon: Sparkles,
      isReady: false
    },
    {
      id: 'mantenimiento',
      name: 'MANTENIMIENTO',
      shortDesc: 'Instalaciones y averías',
      icon: Wrench,
      isReady: false
    },
    {
      id: 'administracion',
      name: 'ADMINISTRACIÓN',
      shortDesc: 'Gestión y RRHH',
      icon: FileText,
      isReady: false
    },
    {
      id: 'otros',
      name: 'OTROS DEPTOS.',
      shortDesc: 'Servicios generales',
      icon: MoreHorizontal,
      isReady: false
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4 pb-28 animate-fadeIn">
      {/* 1. NAVEGACIÓN SUPERIOR COMPACTA */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-850 pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors shadow-sm shrink-0 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>← Volver a Hoteles</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
            {hotelInfo.stars}
          </span>
          <span className="text-xs text-stone-400 font-sans">
            {hotelInfo.location}
          </span>
        </div>
      </div>

      {/* 2. CABECERA DIRECTA */}
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100 tracking-tight">
          {hotelInfo.name}
        </h1>
        <p className="text-xs font-mono text-stone-400">
          Selecciona tu departamento:
        </p>
      </div>

      {/* 3. CUADRÍCULA MOBILE-FIRST DE 2 COLUMNAS ERGONÓMICA */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {departments.map((dept) => {
          const Icon = dept.icon;

          return (
            <button
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex flex-col justify-between min-h-[95px] sm:min-h-[110px] group shadow-sm ${
                dept.isReady
                  ? 'bg-stone-900 border-amber-500/50 hover:border-amber-400 ring-1 ring-amber-500/20'
                  : 'bg-stone-900/60 border-stone-850 hover:border-stone-750 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                  dept.isReady 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                    : 'bg-stone-950 border-stone-800 text-stone-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {dept.isReady ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    ACTIVO
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-stone-500">
                    Próx.
                  </span>
                )}
              </div>

              <div className="pt-2">
                <h3 className={`font-display font-bold text-xs sm:text-sm uppercase leading-tight truncate ${
                  dept.isReady ? 'text-stone-100 group-hover:text-amber-300' : 'text-stone-300'
                }`}>
                  {dept.name}
                </h3>
                <span className="text-[10px] font-mono text-stone-500 block truncate mt-0.5">
                  {dept.shortDesc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
