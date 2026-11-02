import React from 'react';
import { 
  ClipboardCheck, 
  Thermometer, 
  Sparkles, 
  BookOpen, 
  UtensilsCrossed, 
  Wine, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search, 
  FileText, 
  ShieldCheck, 
  Megaphone, 
  Bell, 
  Layers,
  CheckSquare
} from 'lucide-react';
import { 
  UserRole, 
  ShiftType, 
  StationType, 
  OperationalIncident, 
  ManagementAnnouncement,
  SupervisionKPIs 
} from '../types/fnbOperationsMaster';
import { FnbNavigationTab } from './FnbBottomNav';

interface FnbHomeDashboardProps {
  currentRole: UserRole;
  currentShift: ShiftType;
  currentStation: StationType;
  userName: string;
  hotelName: string;
  kpis: SupervisionKPIs;
  recentIncidents: OperationalIncident[];
  announcements: ManagementAnnouncement[];
  onNavigateTab: (tab: FnbNavigationTab, subFilter?: string) => void;
  onOpenSearch: () => void;
  onAcknowledgeAnnouncement: (id: string) => void;
}

export const FnbHomeDashboard: React.FC<FnbHomeDashboardProps> = ({
  currentRole,
  currentShift,
  currentStation,
  userName,
  hotelName,
  kpis,
  recentIncidents,
  announcements,
  onNavigateTab,
  onOpenSearch,
  onAcknowledgeAnnouncement
}) => {
  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const urgentIncidents = recentIncidents.filter(i => i.status !== 'cerrada' && i.priority === 'urgente');
  const unreadAnnouncements = announcements.filter(a => !a.readByUsers.some(u => u.userName === userName));

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. HERO OPERATIVO: SALUDO & TURNO */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
                SERVICIO EN CURSO · {hotelName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1A2530]">
              Hola, {userName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 capitalize mt-0.5">
              {todayFormatted} · <strong className="text-[#2C3E50]">{currentStation}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-medium text-[#2C3E50] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="capitalize font-semibold">{currentShift}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/30 text-xs font-semibold">
              Rol: {currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Buscador Rápido Operativo integrado en Inicio */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-[#F8F9FA] hover:bg-gray-100 border border-[#E2E8F0] text-gray-500 text-xs sm:text-sm transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#C5A880]" />
              <span>Buscar procedimiento, plato, cóctel o alérgeno...</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#E2E8F0] text-gray-400">
              Ctrl + K
            </span>
          </button>
        </div>
      </div>

      {/* 2. AVISOS CRÍTICOS / PENDIENTES DEL TURNO (DISCRETOS PERO VISIBLES) */}
      {(kpis.outOfRangeAlertsPending > 0 || urgentIncidents.length > 0 || unreadAnnouncements.length > 0) && (
        <div className="space-y-3">
          {/* Alerta de Temperatura Fuera de Rango */}
          {kpis.outOfRangeAlertsPending > 0 && (
            <div className="bg-red-50/80 border border-red-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-red-900">
                    Alerta Sanitaria APPCC: {kpis.outOfRangeAlertsPending} equipo(s) fuera de límite térmico
                  </h4>
                  <button 
                    onClick={() => onNavigateTab('registros', 'temperaturas')}
                    className="text-xs font-semibold text-red-700 hover:text-red-900 underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    Actuar ahora <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-red-700 mt-0.5">
                  Se requiere documentación de la acción correctiva y seguimiento según protocolo sanitario.
                </p>
              </div>
            </div>
          )}

          {/* Incidencia Urgente Abierta */}
          {urgentIncidents.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-900 truncate">
                    Incidencia Urgente: {urgentIncidents[0].title}
                  </h4>
                  <button 
                    onClick={() => onNavigateTab('comunicaciones', 'incidencias')}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    Ver ticket <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-amber-800 mt-0.5 truncate">
                  {urgentIncidents[0].description}
                </p>
              </div>
            </div>
          )}

          {/* Comunicado de Dirección no leído */}
          {unreadAnnouncements.length > 0 && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3">
              <Megaphone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-blue-950 truncate">
                    Aviso de Dirección: {unreadAnnouncements[0].title}
                  </h4>
                  <button 
                    onClick={() => onAcknowledgeAnnouncement(unreadAnnouncements[0].id)}
                    className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0 ml-2"
                  >
                    Marcar Leído
                  </button>
                </div>
                <p className="text-xs text-blue-800 mt-1 line-clamp-2">
                  {unreadAnnouncements[0].content}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RESUMEN DISCRETO DE CONTROLES DEL TURNO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center">
          <div className="text-[11px] text-gray-500 font-medium">Controles Frío</div>
          <div className="text-lg font-bold text-[#1A2530] mt-0.5">
            {kpis.temperaturesCompletedToday} / {kpis.temperaturesRequiredToday}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Equipos revisados</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center">
          <div className="text-[11px] text-gray-500 font-medium">Limpieza APPCC</div>
          <div className="text-lg font-bold text-[#1A2530] mt-0.5">
            {kpis.cleaningCompletedToday} / {kpis.cleaningRequiredToday}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Tareas completadas</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center">
          <div className="text-[11px] text-gray-500 font-medium">Incidencias</div>
          <div className="text-lg font-bold text-[#1A2530] mt-0.5">
            {kpis.openIncidentsCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Activas en servicio</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center">
          <div className="text-[11px] text-gray-500 font-medium">Checklist Turno</div>
          <div className="text-lg font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Al día</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-0.5">Apertura completada</div>
        </div>
      </div>

      {/* 4. ¿QUÉ NECESITAS HACER? - LAS 6 TARJETAS OPERATIVAS MAESTRAS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-1">
          Operativa Diaria del Trabajador
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Card 1: Registros de Temperaturas y Controles */}
          <button
            onClick={() => onNavigateTab('registros', 'temperaturas')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Thermometer className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Registros de Turno
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Lectura de temperaturas de cámaras (0-4ºC), congeladores (-18ºC) y controles con alerta fuera de rango.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Rellenar registro</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Card 2: Limpieza y Desinfección */}
          <button
            onClick={() => onNavigateTab('registros', 'limpieza')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Limpieza y APPCC
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Tareas diarias y semanales con productos químicos autorizados (Suma Bac D10), dosificaciones y verificación.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Ver tareas y químicos</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Card 3: Cartas, Menús y Fichas Técnicas */}
          <button
            onClick={() => onNavigateTab('documentacion', 'fichas')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wine className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Cartas y Fichas F&B
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Recetas oficiales, medidas exactas (cl/gr), cristalería, flujo de elaboración estandarizado y TPV Ágora.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Consultar recetas</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Card 4: Manual de Procedimientos (SOPs) */}
          <button
            onClick={() => onNavigateTab('documentacion', 'sops')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Procedimientos Vigentes
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Protocolos oficiales F&B: apertura, servicio en mesa, seguridad alimentaria, alérgenos y arqueo de caja.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Biblioteca de SOPs</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Card 5: Incidencias y Averías */}
          <button
            onClick={() => onNavigateTab('comunicaciones', 'incidencias')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Incidencias y Averías
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Comunicar roturas, faltantes de stock o averías técnicas con foto y seguimiento de estado en tiempo real.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Reportar incidencia</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

          {/* Card 6: Mis Tareas y Checklists de Turno */}
          <button
            onClick={() => onNavigateTab('registros', 'checklists')}
            className="text-left p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                Mis Tareas de Turno
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Checklist paso a paso: apertura de terraza, mise en place, lavavasos térmico y cierre con Ticket Z.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1A2530]">
              <span>Comprobar tareas</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C5A880] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};
