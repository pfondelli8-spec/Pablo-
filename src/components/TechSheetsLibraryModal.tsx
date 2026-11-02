import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Filter,
  Plus,
  FileText,
  ChefHat,
  Eye,
  Edit3,
  Archive,
  RefreshCw,
  FolderOpen,
  Scale,
  Sparkles,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { TechSheet } from '../types/menuAndTechSheets';
import { menuAndTechSheetsStorage } from '../services/menuAndTechSheetsService';
import { TechSheetDetailModal } from './TechSheetDetailModal';
import { TechSheetEditModal } from './TechSheetEditModal';

interface TechSheetsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  userRole?: 'admin' | 'jefe' | 'empleado';
  authorName?: string;
  initialSelectedSheetId?: string;
}

export const TechSheetsLibraryModal: React.FC<TechSheetsLibraryModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  userRole = 'admin',
  authorName = 'Antonio González',
  initialSelectedSheetId
}) => {
  // Estado de fichas técnicas para este hotel
  const [techSheets, setTechSheets] = useState<TechSheet[]>(() => {
    return menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId);
  });

  // Recargar al cambiar de hotel
  useEffect(() => {
    setTechSheets(menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId));
  }, [hotelId]);

  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<'activa' | 'archivada' | 'todas'>('activa');

  // Modales de detalle y edición
  const [viewingSheet, setViewingSheet] = useState<TechSheet | null>(() => {
    if (initialSelectedSheetId) {
      return techSheets.find(s => s.id === initialSelectedSheetId) || null;
    }
    return null;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSheet, setEditingSheet] = useState<Partial<TechSheet> | null>(null);

  if (!isOpen) return null;

  // Actualizar lista desde storage
  const reloadSheets = () => {
    setTechSheets(menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId));
  };

  // Departamentos únicos disponibles
  const availableDepartments = useMemo(() => {
    const depts = new Set(techSheets.map(s => s.departmentName).filter(Boolean));
    return Array.from(depts);
  }, [techSheets]);

  // Fichas filtradas
  const filteredSheets = useMemo(() => {
    return techSheets.filter(sheet => {
      // Filtro de estado
      if (statusFilter !== 'todas' && sheet.status !== statusFilter) return false;

      // Filtro de categoría
      if (selectedCategory !== 'todas' && sheet.category !== selectedCategory) return false;

      // Filtro de departamento
      if (selectedDepartment !== 'todos' && sheet.departmentName !== selectedDepartment) return false;

      // Búsqueda textual por nombre, código, ingrediente, área
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sheet.name.toLowerCase().includes(q);
        const matchCode = sheet.code.toLowerCase().includes(q);
        const matchArea = sheet.areaName.toLowerCase().includes(q);
        const matchCat = sheet.categoryLabel.toLowerCase().includes(q);
        const matchIng = sheet.ingredients.some(i => i.name.toLowerCase().includes(q));
        const matchAllergen = sheet.allergens.some(a => a.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchArea && !matchCat && !matchIng && !matchAllergen) {
          return false;
        }
      }

      return true;
    });
  }, [techSheets, searchQuery, selectedCategory, selectedDepartment, statusFilter]);

  const handleCreateNew = () => {
    setEditingSheet(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (sheet: TechSheet) => {
    setEditingSheet(sheet);
    setIsEditModalOpen(true);
  };

  const handleSaveSheet = (sheet: TechSheet, changeSummary?: string) => {
    menuAndTechSheetsStorage.saveSingleTechSheet(hotelId, sheet, changeSummary);
    reloadSheets();
    if (viewingSheet?.id === sheet.id) {
      setViewingSheet(sheet);
    }
  };

  const handleArchiveToggle = (sheet: TechSheet) => {
    if (sheet.status === 'activa') {
      menuAndTechSheetsStorage.archiveTechSheet(hotelId, sheet.id);
    } else {
      menuAndTechSheetsStorage.restoreTechSheet(hotelId, sheet.id);
    }
    reloadSheets();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#111720] text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 my-4 flex flex-col h-[92vh]">
        {/* Cabecera Superior */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/80 bg-[#151F2B] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-serif font-black text-amber-400 text-sm select-none">PF</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow-xs">
                  PF Operations · F&B Management
                </span>
                <span className="text-xs text-slate-300 font-medium">{hotelName}</span>
              </div>
              <h1 className="text-base sm:text-xl font-black text-white tracking-tight">
                Fichas Técnicas & Elaboraciones Gastronómicas
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {(userRole === 'admin' || userRole === 'jefe') && (
              <button
                onClick={handleCreateNew}
                className="bg-[#C5A880] hover:bg-[#b5966d] text-slate-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Ficha Técnica</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#131B24] shrink-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Buscador */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por elaboración, ingrediente, alérgeno, código o partida..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-[#C5A880] outline-none"
              />
            </div>

            {/* Categoría */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-300 outline-none"
              >
                <option value="todas">Todas las Categorías</option>
                <option value="carnes">Carnes & Asados</option>
                <option value="pescados">Pescados & Mariscos</option>
                <option value="arroces">Arroces & Paellas</option>
                <option value="pastas">Pastas Frescas</option>
                <option value="sopas">Sopas & Cremas</option>
                <option value="ensaladas">Ensaladas & Crudités</option>
                <option value="guarniciones">Guarniciones</option>
                <option value="postres">Postres & Dulces</option>
                <option value="desayunos">Desayunos & Huevos</option>
              </select>
            </div>

            {/* Departamento */}
            <div className="sm:col-span-2">
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
                className="w-full py-2 px-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-300 outline-none"
              >
                <option value="todos">Todos los Departamentos</option>
                {availableDepartments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            {/* Estado Activa / Archivada */}
            <div className="sm:col-span-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="w-full py-2 px-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-300 outline-none"
              >
                <option value="activa">Activas ({techSheets.filter(s => s.status === 'activa').length})</option>
                <option value="archivada">Archivadas ({techSheets.filter(s => s.status === 'archivada').length})</option>
                <option value="todas">Todas ({techSheets.length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listado / Catálogo de Fichas */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {filteredSheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No se encontraron fichas técnicas</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                No hay resultados para los filtros seleccionados o la búsqueda actual.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSheets.map(sheet => (
                <div
                  key={sheet.id}
                  className="bg-[#151E28] border border-slate-700/80 hover:border-[#C5A880]/60 rounded-xl overflow-hidden transition-all shadow-md hover:shadow-xl flex flex-col group"
                >
                  {/* Foto de Cabecera con Badges */}
                  <div className="relative h-40 bg-slate-800 overflow-hidden">
                    <img
                      src={sheet.photoUrl}
                      alt={sheet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-black/75 text-[#C5A880] px-2 py-0.5 rounded border border-[#C5A880]/40 backdrop-blur-sm">
                        {sheet.code}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded backdrop-blur-sm">
                        {sheet.version}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-sm ${
                        sheet.status === 'activa'
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}>
                        {sheet.status}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                        {sheet.categoryLabel}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate drop-shadow">
                        {sheet.name}
                      </h3>
                    </div>
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Partida / Área:</span>
                        <strong className="text-slate-200">{sheet.areaName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Gramaje Ración:</span>
                        <strong className="text-[#C5A880]">{sheet.portionWeight}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Ingredientes:</span>
                        <span className="text-slate-300">{sheet.ingredients.length} items</span>
                      </div>

                      {/* Alérgenos */}
                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                          Alérgenos:
                        </span>
                        {sheet.allergens.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {sheet.allergens.map((alg, i) => (
                              <span
                                key={i}
                                className="text-[9px] bg-red-500/15 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded font-bold"
                              >
                                {alg}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Sin alérgenos declarables
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botonera de Acciones */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setViewingSheet(sheet)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Ficha (A4)</span>
                      </button>

                      {(userRole === 'admin' || userRole === 'jefe') && (
                        <>
                          <button
                            onClick={() => handleEdit(sheet)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Editar Ficha"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchiveToggle(sheet)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              sheet.status === 'activa'
                                ? 'bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400'
                                : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400'
                            }`}
                            title={sheet.status === 'activa' ? 'Archivar Ficha' : 'Restaurar Ficha'}
                          >
                            {sheet.status === 'activa' ? (
                              <Archive className="w-3.5 h-3.5" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Visor A4 de Ficha Completa */}
      {viewingSheet && (
        <TechSheetDetailModal
          isOpen={!!viewingSheet}
          onClose={() => setViewingSheet(null)}
          techSheet={viewingSheet}
          hotelName={hotelName}
          userRole={userRole}
          onEdit={(sheet) => {
            setViewingSheet(null);
            handleEdit(sheet);
          }}
        />
      )}

      {/* Modal Editor / Creador de Ficha */}
      {isEditModalOpen && (
        <TechSheetEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingSheet(null);
          }}
          onSave={handleSaveSheet}
          initialSheet={editingSheet}
          hotelId={hotelId}
          hotelName={hotelName}
          authorName={authorName}
        />
      )}
    </div>
  );
};
