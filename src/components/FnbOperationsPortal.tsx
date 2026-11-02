import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Home, 
  ClipboardCheck, 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Plus, 
  Settings, 
  Search,
  Sparkles
} from 'lucide-react';
import { 
  UserRole, 
  ShiftType, 
  StationType, 
  SupervisionKPIs 
} from '../types/fnbOperationsMaster';
import { 
  fnbStorage, 
  calculateSupervisionKPIs 
} from '../data/fnbOperationsService';
import { FnbNavigationTab, FnbBottomNav } from './FnbBottomNav';
import { FnbShiftAndRoleHeader } from './FnbShiftAndRoleHeader';
import { FnbHomeDashboard } from './FnbHomeDashboard';
import { FnbOperationalRegistrosView } from './FnbOperationalRegistrosView';
import { FnbDocumentacionView } from './FnbDocumentacionView';
import { FnbComunicacionesView } from './FnbComunicacionesView';
import { FnbSupervisionPanel } from './FnbSupervisionPanel';

interface FnbOperationsPortalProps {
  hotelName?: string;
  hotelId?: string;
  onOpenGlobalSearch: () => void;
  onOpenRecipeAssistant?: () => void;
  onSwitchHotel?: () => void;
}

export const FnbOperationsPortal: React.FC<FnbOperationsPortalProps> = ({
  hotelName = 'Hotel Diamond · F&B Principal',
  hotelId = 'klayman-diamond',
  onOpenGlobalSearch,
  onOpenRecipeAssistant,
  onSwitchHotel
}) => {
  // Estado de navegación principal
  const [activeTab, setActiveTab] = useState<FnbNavigationTab>('inicio');
  const [activeSubFilter, setActiveSubFilter] = useState<string | undefined>(undefined);

  // Perfil del trabajador y contexto de turno
  const [currentRole, setCurrentRole] = useState<UserRole>('trabajador');
  const [currentShift, setCurrentShift] = useState<ShiftType>('manana');
  const [currentStation, setCurrentStation] = useState<StationType>('Bar Piscina');
  const [userName, setUserName] = useState<string>('Carlos Mendoza');

  // Trigger para recargar datos tras envíos
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Datos reactivos
  const temperatures = useMemo(() => fnbStorage.getTemperatures(), [refreshTrigger]);
  const cleaningLogs = useMemo(() => fnbStorage.getCleaningLogs(), [refreshTrigger]);
  const incidents = useMemo(() => fnbStorage.getIncidents(), [refreshTrigger]);
  const announcements = useMemo(() => fnbStorage.getAnnouncements(), [refreshTrigger]);

  const kpis: SupervisionKPIs = useMemo(() => {
    return calculateSupervisionKPIs(temperatures, cleaningLogs, incidents);
  }, [temperatures, cleaningLogs, incidents]);

  const handleDataUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleResetDemoData = () => {
    if (confirm('¿Restablecer todos los registros operativos a los valores por defecto de la demostración?')) {
      fnbStorage.resetAllDemoData();
      handleDataUpdated();
    }
  };

  const handleNavigateWithFilter = (tab: FnbNavigationTab, subFilter?: string) => {
    setActiveTab(tab);
    setActiveSubFilter(subFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAcknowledgeAnnouncement = (id: string) => {
    fnbStorage.confirmAnnouncementRead(id, `usr-${userName}`, userName);
    handleDataUpdated();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex flex-col font-sans">
      
      {/* 1. STATUS BAR SUPERIOR: TURNO, ROL, ESTACIÓN & BUSCADOR */}
      <FnbShiftAndRoleHeader
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          if (role === 'trabajador') {
            setUserName('Carlos Mendoza (Bartender)');
          } else if (role === 'supervisor') {
            setUserName('Laura Santos (Supervisora Turno)');
          } else if (role === 'responsable_fnb') {
            setUserName('David Morales (Jefe de Bares)');
          } else {
            setUserName('Dirección de Operaciones');
          }
        }}
        currentShift={currentShift}
        onChangeShift={setCurrentShift}
        currentStation={currentStation}
        onChangeStation={setCurrentStation}
        hotelName={hotelName}
        onOpenSearch={onOpenGlobalSearch}
        onResetDemoData={handleResetDemoData}
      />

      {/* 2. MENÚ DE NAVEGACIÓN EN ESCRITORIO (TABS DE ALTA VISIBILIDAD) */}
      <div className="hidden md:block bg-white border-b border-[#E2E8F0] sticky top-[49px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('inicio'); setActiveSubFilter(undefined); }}
              className={`py-3 px-4 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'inicio'
                  ? 'border-[#C5A880] text-[#1A2530] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <Home className="w-4 h-4 text-[#C5A880]" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => { setActiveTab('registros'); setActiveSubFilter(undefined); }}
              className={`py-3 px-4 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all relative ${
                activeTab === 'registros'
                  ? 'border-[#C5A880] text-[#1A2530] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Registros Operativos</span>
              {kpis.outOfRangeAlertsPending > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => { setActiveTab('documentacion'); setActiveSubFilter(undefined); }}
              className={`py-3 px-4 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'documentacion'
                  ? 'border-[#C5A880] text-[#1A2530] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#C5A880]" />
              <span>Documentación & Fichas</span>
            </button>

            <button
              onClick={() => { setActiveTab('comunicaciones'); setActiveSubFilter(undefined); }}
              className={`py-3 px-4 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all relative ${
                activeTab === 'comunicaciones'
                  ? 'border-[#C5A880] text-[#1A2530] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#C5A880]" />
              <span>Comunicaciones ({incidents.filter(i => i.status !== 'cerrada').length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('supervision'); setActiveSubFilter(undefined); }}
              className={`py-3 px-4 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'supervision'
                  ? 'border-[#C5A880] text-[#1A2530] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#1A2530]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#C5A880]" />
              <span>Supervisión & KPIs</span>
            </button>
          </div>

          {onSwitchHotel && (
            <button
              onClick={onSwitchHotel}
              className="text-xs text-gray-500 hover:text-[#1A2530] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Cambiar Establecimiento</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* INICIO */}
        {activeTab === 'inicio' && (
          <FnbHomeDashboard
            currentRole={currentRole}
            currentShift={currentShift}
            currentStation={currentStation}
            userName={userName}
            hotelName={hotelName}
            kpis={kpis}
            recentIncidents={incidents}
            announcements={announcements}
            onNavigateTab={handleNavigateWithFilter}
            onOpenSearch={onOpenGlobalSearch}
            onAcknowledgeAnnouncement={handleAcknowledgeAnnouncement}
          />
        )}

        {/* REGISTROS */}
        {activeTab === 'registros' && (
          <FnbOperationalRegistrosView
            currentRole={currentRole}
            currentShift={currentShift}
            currentStation={currentStation}
            userName={userName}
            hotelName={hotelName}
            initialSubTab={(activeSubFilter as any) || 'temperaturas'}
            onRecordCreated={handleDataUpdated}
          />
        )}

        {/* DOCUMENTACIÓN */}
        {activeTab === 'documentacion' && (
          <FnbDocumentacionView
            initialSubTab={(activeSubFilter as any) || 'fichas'}
            onOpenRecipeAssistant={onOpenRecipeAssistant}
          />
        )}

        {/* COMUNICACIONES */}
        {activeTab === 'comunicaciones' && (
          <FnbComunicacionesView
            currentRole={currentRole}
            currentStation={currentStation}
            userName={userName}
            hotelName={hotelName}
            initialSubTab={(activeSubFilter as any) || 'incidencias'}
            onIncidentUpdated={handleDataUpdated}
          />
        )}

        {/* SUPERVISIÓN */}
        {activeTab === 'supervision' && (
          <FnbSupervisionPanel
            currentRole={currentRole}
            currentShift={currentShift}
            currentStation={currentStation}
            userName={userName}
            hotelName={hotelName}
            kpis={kpis}
            onRefreshData={handleDataUpdated}
            onResetDemoData={handleResetDemoData}
          />
        )}

      </main>

      {/* 4. BARRA DE NAVEGACIÓN INFERIOR PARA MÓVIL (PRIORIDAD ABSOLUTA MOBILE-FIRST) */}
      <FnbBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveSubFilter(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentRole={currentRole}
        pendingRegistrosCount={kpis.outOfRangeAlertsPending}
        urgentIncidentsCount={kpis.urgentIncidentsCount}
      />

    </div>
  );
};
