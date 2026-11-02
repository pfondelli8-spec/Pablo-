import React, { useState } from 'react';
import { 
  MessageSquare, 
  Megaphone, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Camera, 
  User, 
  Send, 
  Filter, 
  ChevronRight, 
  Check, 
  Paperclip, 
  X,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { 
  UserRole, 
  StationType, 
  OperationalIncident, 
  ManagementAnnouncement,
  IncidentPriority,
  IncidentCategory,
  IncidentStatus 
} from '../types/fnbOperationsMaster';
import { fnbStorage } from '../data/fnbOperationsService';

interface FnbComunicacionesViewProps {
  currentRole: UserRole;
  currentStation: StationType;
  userName: string;
  hotelName: string;
  initialSubTab?: 'incidencias' | 'avisos';
  onIncidentUpdated: () => void;
}

export const FnbComunicacionesView: React.FC<FnbComunicacionesViewProps> = ({
  currentRole,
  currentStation,
  userName,
  hotelName,
  initialSubTab = 'incidencias',
  onIncidentUpdated
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incidencias' | 'avisos'>(initialSubTab);
  const [incidentsList, setIncidentsList] = useState<OperationalIncident[]>(() => fnbStorage.getIncidents());
  const [announcementsList, setAnnouncementsList] = useState<ManagementAnnouncement[]>(() => fnbStorage.getAnnouncements());

  // Filtros de incidencias
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [priorityFilter, setPriorityFilter] = useState<string>('todas');

  // Modal para crear nueva incidencia
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<IncidentCategory>('averia_tecnica');
  const [newPriority, setNewPriority] = useState<IncidentPriority>('media');
  const [newAssignedTo, setNewAssignedTo] = useState('Mantenimiento F&B');
  const [newPhotoMock, setNewPhotoMock] = useState(false);

  // Modal para ver y actualizar incidencia
  const [selectedIncident, setSelectedIncident] = useState<OperationalIncident | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  const isSupervisorOrAbove = currentRole === 'supervisor' || currentRole === 'responsable_fnb' || currentRole === 'direccion';

  // Manejar creación de incidencia
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const count = incidentsList.length + 1;
    const ticketCode = `INC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(count).padStart(2, '0')}`;

    const newIncident: OperationalIncident = {
      id: `inc-${Date.now()}`,
      ticketCode,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'nueva',
      station: currentStation,
      reportedBy: `${userName} (${currentRole})`,
      assignedTo: newAssignedTo,
      photoUrl: newPhotoMock 
        ? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60' 
        : undefined,
      reportedAt: new Date().toISOString(),
      dateStr: new Date().toISOString().split('T')[0],
      history: [
        {
          id: `act-${Date.now()}`,
          author: userName,
          role: currentRole,
          action: 'Incidencia creada y registrada con identificador legal',
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          statusAfter: 'nueva'
        }
      ]
    };

    const updated = fnbStorage.saveIncident(newIncident);
    setIncidentsList(updated);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewPhotoMock(false);
    onIncidentUpdated();
  };

  // Manejar cambio de estado de incidencia
  const handleUpdateStatus = (newStatus: IncidentStatus) => {
    if (!selectedIncident) return;
    const updated = fnbStorage.updateIncidentStatus(
      selectedIncident.id,
      newStatus,
      userName,
      statusUpdateNote.trim() || undefined
    );
    setIncidentsList(updated);
    const refreshed = updated.find(i => i.id === selectedIncident.id) || null;
    setSelectedIncident(refreshed);
    setStatusUpdateNote('');
    onIncidentUpdated();
  };

  // Manejar confirmación de lectura de comunicado
  const handleAcknowledgeRead = (announcementId: string) => {
    const updated = fnbStorage.confirmAnnouncementRead(announcementId, `usr-${userName}`, userName);
    setAnnouncementsList(updated);
  };

  // Filtro
  const filteredIncidents = incidentsList.filter(inc => {
    const matchesStatus = statusFilter === 'todas' || inc.status === statusFilter;
    const matchesPriority = priorityFilter === 'todas' || inc.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const priorityColors: Record<IncidentPriority, { bg: string; text: string; border: string }> = {
    baja: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    media: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    urgente: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };

  const statusLabels: Record<IncidentStatus, string> = {
    nueva: 'Nueva',
    asignada: 'Asignada',
    en_curso: 'En Curso',
    pendiente_verificacion: 'Pendiente Verificación',
    cerrada: 'Cerrada'
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* 1. CABECERA & SUBPESTAÑAS */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1A2530] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#C5A880]" />
              <span>Comunicaciones Operativas e Incidencias</span>
            </h2>
            <p className="text-xs text-gray-500">
              Trazabilidad de averías, roturas, stock y comunicados vinculantes de dirección
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Comunicar Incidencia</span>
          </button>
        </div>

        {/* Subpestañas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E8F0]">
          <button
            onClick={() => setActiveSubTab('incidencias')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'incidencias'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#C5A880]" />
            <span>Incidencias y Averías ({incidentsList.filter(i => i.status !== 'cerrada').length} activas)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('avisos')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'avisos'
                ? 'bg-[#1A2530] text-white'
                : 'text-gray-600 hover:text-[#1A2530] hover:bg-gray-100'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#C5A880]" />
            <span>Avisos de Dirección ({announcementsList.length})</span>
          </button>
        </div>

        {/* Filtros de Incidencias */}
        {activeSubTab === 'incidencias' && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
            >
              <option value="todas">Todos los estados</option>
              <option value="nueva">Nuevas</option>
              <option value="asignada">Asignadas</option>
              <option value="en_curso">En Curso</option>
              <option value="pendiente_verificacion">Pendientes Verificación</option>
              <option value="cerrada">Cerradas</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="p-2 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50]"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUBTAB 1: INCIDENCIAS OPERATIVAS
         ========================================================================= */}
      {activeSubTab === 'incidencias' && (
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-xs text-gray-500">
              No hay incidencias que coincidan con los filtros seleccionados.
            </div>
          ) : (
            filteredIncidents.map(inc => {
              const priorityStyle = priorityColors[inc.priority];
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="bg-white border border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#C5A880]">
                        {inc.ticketCode}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                        {inc.priority}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {statusLabels[inc.status]}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {inc.dateStr} · {inc.station}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {inc.description}
                    </p>

                    <div className="text-[11px] text-gray-500 flex items-center gap-3 pt-1">
                      <span>Reportado por: <strong>{inc.reportedBy}</strong></span>
                      {inc.assignedTo && <span>Asignado a: <strong>{inc.assignedTo}</strong></span>}
                      {inc.photoUrl && <span className="text-[#C5A880]">📷 Evidencia adjunta</span>}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-[#1A2530] group-hover:text-[#C5A880] transition-colors">
                    <span>Gestionar Ticket</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: AVISOS DE DIRECCIÓN & CONFIRMACIÓN DE LECTURA
         ========================================================================= */}
      {activeSubTab === 'avisos' && (
        <div className="space-y-3">
          {announcementsList.map(ann => {
            const hasRead = ann.readByUsers.some(u => u.userName === userName);
            return (
              <div
                key={ann.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {ann.category.toUpperCase()}
                      </span>
                      {ann.priority === 'urgente' && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                          URGENTE
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 font-mono">
                        {ann.dateStr} · Publicado por {ann.publishedBy}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#1A2530] mt-1">
                      {ann.title}
                    </h3>
                  </div>

                  {/* Estado de Lectura */}
                  <div>
                    {hasRead ? (
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Leído por ti</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledgeRead(ann.id)}
                        className="px-3 py-1 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Confirmar Lectura
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed bg-[#F8F9FA] p-3 rounded-lg border border-[#E2E8F0]">
                  {ann.content}
                </p>

                <div className="text-[11px] text-gray-500 pt-1 flex items-center justify-between border-t border-[#E2E8F0]">
                  <span>Lecturas confirmadas en equipo: <strong>{ann.readByUsers.length} compañeros</strong></span>
                  <div className="flex items-center gap-1">
                    {ann.readByUsers.slice(0, 3).map(u => (
                      <span key={u.userId} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        {u.userName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR NUEVA INCIDENCIA
         ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Reportar Nueva Incidencia Operativa</h3>
                <p className="text-xs text-gray-500">Asigna código único con trazabilidad de resolución</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Título de la incidencia (*):
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Avería en grifo de cerveza nº 2 / Rotura stock sirope maracuyá"
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Categoría:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as IncidentCategory)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                  >
                    <option value="averia_tecnica">Avería Técnica</option>
                    <option value="faltante_stock">Faltante de Stock</option>
                    <option value="rotura_material">Rotura de Vajilla / Menaje</option>
                    <option value="seguridad_appcc">Seguridad Alimentaria / APPCC</option>
                    <option value="servicio_cliente">Servicio / Atención</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Prioridad:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as IncidentPriority)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                  >
                    <option value="baja">Baja (Planificada)</option>
                    <option value="media">Media (Durante el día)</option>
                    <option value="urgente">Urgente (Bloquea servicio)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Descripción detallada del problema (*):
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Explica qué ha ocurrido, en qué estación y qué medidas inmediatas se han tomado..."
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Asignar responsable:
                  </label>
                  <select
                    value={newAssignedTo}
                    onChange={(e) => setNewAssignedTo(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                  >
                    <option value="Mantenimiento F&B">Mantenimiento F&B</option>
                    <option value="Economato / Compras">Economato / Compras</option>
                    <option value="Supervisor de Turno">Supervisor de Turno</option>
                    <option value="Jefe de Bares">Jefe de Bares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Evidencia Fotográfica:
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPhotoMock(!newPhotoMock)}
                    className={`w-full p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      newPhotoMock 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold' 
                        : 'border-[#E2E8F0] hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-[#C5A880]" />
                    <span>{newPhotoMock ? '✓ Foto Adjunta' : 'Simular Captura'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Emitido por: {userName} ({currentStation})
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 py-2 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-xs font-semibold text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold uppercase tracking-wider"
                  >
                    Crear Ticket
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DETALLE Y GESTIÓN DE INCIDENCIA SELECCIONADA
         ========================================================================= */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C5A880]">
                    {selectedIncident.ticketCode}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${priorityColors[selectedIncident.priority].bg} ${priorityColors[selectedIncident.priority].text} ${priorityColors[selectedIncident.priority].border}`}>
                    {selectedIncident.priority}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {statusLabels[selectedIncident.status]}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-[#1A2530] mt-1">
                  {selectedIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-[#E2E8F0] text-xs space-y-1.5 leading-relaxed">
              <div><strong>Descripción:</strong> {selectedIncident.description}</div>
              <div><strong>Ubicación:</strong> {selectedIncident.station}</div>
              <div><strong>Reportado por:</strong> {selectedIncident.reportedBy} el {selectedIncident.dateStr}</div>
              <div><strong>Asignado a:</strong> {selectedIncident.assignedTo || 'Sin asignar'}</div>
            </div>

            {selectedIncident.photoUrl && (
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Evidencia Fotográfica:
                </span>
                <img
                  src={selectedIncident.photoUrl}
                  alt="Evidencia"
                  className="w-full h-44 object-cover rounded-lg border border-[#E2E8F0]"
                />
              </div>
            )}

            {/* Historial de actuaciones */}
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Trazabilidad y Actuaciones ({selectedIncident.history.length}):
              </span>
              <div className="space-y-1.5">
                {selectedIncident.history.map(act => (
                  <div key={act.id} className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white text-xs">
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span><strong>{act.author}</strong> ({act.role})</span>
                      <span className="font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{act.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actualización de estado por supervisor */}
            {isSupervisorOrAbove && selectedIncident.status !== 'cerrada' && (
              <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
                <h4 className="font-bold text-xs text-[#1A2530] uppercase tracking-wider">
                  Acción de Supervisión / Actualización de Estado:
                </h4>

                <input
                  type="text"
                  value={statusUpdateNote}
                  onChange={(e) => setStatusUpdateNote(e.target.value)}
                  placeholder="Nota de actuación o resolución..."
                  className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0]"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus('en_curso')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Pasar a En Curso
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('pendiente_verificacion')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                  >
                    Marcar Pendiente Verificación
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('cerrada')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
                  >
                    Cerrar Incidencia
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 text-right border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-lg bg-[#1A2530] text-white hover:bg-[#2C3E50] text-xs font-semibold"
              >
                Cerrar Ventana
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
