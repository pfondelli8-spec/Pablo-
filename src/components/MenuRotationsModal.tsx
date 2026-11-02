import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Clock,
  Printer,
  FileText,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  ChefHat,
  Eye,
  Link as LinkIcon,
  Search,
  Sparkles,
  ArrowRight,
  FolderOpen,
  Filter,
  Archive,
  RefreshCw,
  Scale,
  Layers
} from 'lucide-react';
import {
  MenuServiceType,
  MenuItem,
  DayMenuCycle,
  MenuServiceCycle,
  TechSheet
} from '../types/menuAndTechSheets';
import { menuAndTechSheetsStorage } from '../services/menuAndTechSheetsService';
import { TechSheetDetailModal } from './TechSheetDetailModal';
import { TechSheetEditModal } from './TechSheetEditModal';
import { GastronomicMatrixModal } from './GastronomicMatrixModal';

interface MenuRotationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  wheelId?: 'rueda_1' | 'rueda_2';
  userRole?: 'admin' | 'jefe' | 'empleado';
  authorName?: string;
}

export const MenuRotationsModal: React.FC<MenuRotationsModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  wheelId = 'rueda_1',
  userRole = 'admin',
  authorName = 'Antonio González'
}) => {
  // Pestaña principal dentro de la Rueda: Platos vs Fichas Técnicas
  const [activeSectionTab, setActiveSectionTab] = useState<'platos' | 'fichas'>('platos');

  // Servicio seleccionado: desayuno, almuerzo, cena
  const [activeService, setActiveService] = useState<MenuServiceType>('almuerzo');

  // Día activo (1 a 15)
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);

  // Ciclo activo cargado desde storage para este hotel y esta rueda específica
  const [currentCycle, setCurrentCycle] = useState<MenuServiceCycle>(() => {
    return menuAndTechSheetsStorage.getMenuCycle(hotelId, 'almuerzo', wheelId);
  });

  // Fichas técnicas disponibles para este hotel
  const [availableTechSheets, setAvailableTechSheets] = useState<TechSheet[]>(() => {
    return menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId);
  });

  // Filtros de búsqueda en la pestaña B (Fichas Técnicas)
  const [techSheetSearch, setTechSheetSearch] = useState('');
  const [techSheetCategory, setTechSheetCategory] = useState('todas');
  const [techSheetStatus, setTechSheetStatus] = useState<'activa' | 'archivada' | 'todas'>('activa');

  // Recargar al cambiar de hotel, servicio o rueda
  useEffect(() => {
    const cycle = menuAndTechSheetsStorage.getMenuCycle(hotelId, activeService, wheelId);
    setCurrentCycle(cycle);
    setAvailableTechSheets(menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId));
  }, [hotelId, activeService, wheelId]);

  // Modal para ver ficha técnica vinculada en A4
  const [viewingTechSheet, setViewingTechSheet] = useState<TechSheet | null>(null);

  // Modal para vincular ficha técnica a un plato
  const [linkingItem, setLinkingItem] = useState<{ dayNumber: number; item: MenuItem } | null>(null);

  // Modal para crear / editar ficha técnica
  const [isEditSheetModalOpen, setIsEditSheetModalOpen] = useState(false);
  const [editingSheetData, setEditingSheetData] = useState<Partial<TechSheet> | null>(null);

  // Edición del día del menú (Admin/Jefe)
  const [isEditingDayTitle, setIsEditingDayTitle] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState('');

  // Modal de añadir plato al día
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemStation, setNewItemStation] = useState('Buffet Caliente');
  const [newItemCategory, setNewItemCategory] = useState('Carnes');
  const [newItemDietary, setNewItemDietary] = useState('');

  // Modal para ver la Matriz Gastronómica Mensual Completa (30 Días · 4 Columnas)
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  if (!isOpen) return null;

  // Cambiar servicio
  const handleSelectService = (service: MenuServiceType) => {
    setActiveService(service);
    const cycle = menuAndTechSheetsStorage.getMenuCycle(hotelId, service, wheelId);
    setCurrentCycle(cycle);
  };

  // Recargar datos
  const reloadCycle = () => {
    const cycle = menuAndTechSheetsStorage.getMenuCycle(hotelId, activeService, wheelId);
    setCurrentCycle(cycle);
    setAvailableTechSheets(menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId));
  };

  // Filtros de la Doble Matriz en el menú activo
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'rotativa' | 'fija'>('all');
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Día activo actual
  const activeDay: DayMenuCycle = useMemo(() => {
    return (
      currentCycle.days.find(d => d.dayNumber === activeDayNumber) ||
      currentCycle.days[0]
    );
  }, [currentCycle, activeDayNumber]);

  // Contadores de la Doble Matriz para el día activo
  const matrixCounts = useMemo(() => {
    const total = activeDay.items.length;
    const rotativos = activeDay.items.filter(it => it.matrixType === 'rotativa' || !it.matrixType).length;
    const fijos = activeDay.items.filter(it => it.matrixType === 'fija').length;
    const conFicha = activeDay.items.filter(it => Boolean(it.techSheetId)).length;
    return { total, rotativos, fijos, conFicha };
  }, [activeDay]);

  // Ítems filtrados por matriz (Todo / Rotativa / Fija) y búsqueda
  const filteredDayItems = useMemo(() => {
    let items = activeDay.items;
    if (matrixFilter === 'rotativa') {
      items = items.filter(it => it.matrixType === 'rotativa' || !it.matrixType);
    } else if (matrixFilter === 'fija') {
      items = items.filter(it => it.matrixType === 'fija');
    }

    if (itemSearchQuery.trim()) {
      const q = itemSearchQuery.toLowerCase();
      items = items.filter(
        it =>
          it.name.toLowerCase().includes(q) ||
          (it.station && it.station.toLowerCase().includes(q)) ||
          (it.category && it.category.toLowerCase().includes(q)) ||
          (it.fixedFamily && it.fixedFamily.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeDay, matrixFilter, itemSearchQuery]);

  // Agrupar platos filtrados del día por Estación de Servicio
  const itemsByStation = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    filteredDayItems.forEach(item => {
      const station = item.station || 'General';
      if (!map[station]) {
        map[station] = [];
      }
      map[station].push(item);
    });
    return map;
  }, [filteredDayItems]);

  // Fichas filtradas para el apartado B
  const filteredTechSheets = useMemo(() => {
    return availableTechSheets.filter(sheet => {
      if (techSheetStatus !== 'todas' && sheet.status !== techSheetStatus) return false;
      if (techSheetCategory !== 'todas' && sheet.category !== techSheetCategory) return false;
      if (techSheetSearch.trim()) {
        const q = techSheetSearch.toLowerCase();
        const matchName = sheet.name.toLowerCase().includes(q);
        const matchCode = sheet.code.toLowerCase().includes(q);
        const matchArea = sheet.areaName.toLowerCase().includes(q);
        const matchIng = sheet.ingredients.some(i => i.name.toLowerCase().includes(q));
        const matchAlg = sheet.allergens.some(a => a.toLowerCase().includes(q));
        if (!matchName && !matchCode && !matchArea && !matchIng && !matchAlg) return false;
      }
      return true;
    });
  }, [availableTechSheets, techSheetSearch, techSheetCategory, techSheetStatus]);

  // Abrir visor de ficha técnica
  const handleOpenTechSheet = (techSheetId: string) => {
    const sheet = menuAndTechSheetsStorage.getTechSheetById(hotelId, techSheetId);
    if (sheet) {
      setViewingTechSheet(sheet);
    }
  };

  // Manejar vinculación de ficha a plato
  const handleSelectSheetToLink = (sheetId: string) => {
    if (!linkingItem) return;
    menuAndTechSheetsStorage.linkItemToTechSheet(
      hotelId,
      activeService,
      wheelId,
      linkingItem.dayNumber,
      linkingItem.item.id,
      sheetId
    );
    setLinkingItem(null);
    reloadCycle();
  };

  const handleUnlinkSheet = (dayNumber: number, itemId: string) => {
    menuAndTechSheetsStorage.linkItemToTechSheet(
      hotelId,
      activeService,
      wheelId,
      dayNumber,
      itemId,
      undefined
    );
    reloadCycle();
  };

  // Crear ficha técnica para un plato sin ficha
  const handleStartCreateSheetForDish = (item: MenuItem) => {
    setEditingSheetData({
      name: item.name,
      code: `FT-MENU-${Math.floor(100 + Math.random() * 900)}`,
      category: 'carnes',
      categoryLabel: item.category || 'Cocina General',
      areaName: item.station || 'Partida de Cocina',
      description: `Ficha técnica oficial para ${item.name} programado en Ruedas de Menú.`,
      portionWeight: '200 g',
      yieldRations: '1 ración'
    });
    setIsEditSheetModalOpen(true);
  };

  // Cambiar estado de publicación del día
  const handleToggleDayStatus = (newStatus: 'publicado' | 'en_revision' | 'borrador') => {
    menuAndTechSheetsStorage.updateDayMenu(hotelId, activeService, wheelId, activeDayNumber, {
      status: newStatus
    });
    reloadCycle();
  };

  // Guardar título del día
  const handleSaveDayTitle = () => {
    if (newDayTitle.trim()) {
      menuAndTechSheetsStorage.updateDayMenu(hotelId, activeService, wheelId, activeDayNumber, {
        themeTitle: newDayTitle.trim()
      });
      setIsEditingDayTitle(false);
      reloadCycle();
    }
  };

  // Añadir nuevo plato al día
  const handleAddItemToDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      station: newItemStation,
      category: newItemCategory,
      dietaryTags: newItemDietary ? newItemDietary.split(',').map(s => s.trim()) : []
    };

    menuAndTechSheetsStorage.addMenuItemToDay(hotelId, activeService, wheelId, activeDayNumber, newItem);
    setNewItemName('');
    setIsAddItemModalOpen(false);
    reloadCycle();
  };

  // Eliminar plato del día
  const handleDeleteItem = (itemId: string) => {
    menuAndTechSheetsStorage.removeMenuItemFromDay(hotelId, activeService, wheelId, activeDayNumber, itemId);
    reloadCycle();
  };

  const handlePrintMenuDay = () => {
    window.print();
  };

  const wheelLabel = wheelId === 'rueda_2' ? 'Rueda 2' : 'Rueda 1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-[#10161F] text-slate-100 rounded-2xl shadow-2xl border border-slate-700/80 my-4 flex flex-col h-[94vh]">
        {/* Cabecera Superior con Identificación de Hotel y Rueda */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/80 bg-[#141E2A] rounded-t-2xl shrink-0 print:hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C5A880]/20 to-[#C5A880]/5 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] shadow">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                  {wheelLabel.toUpperCase()} · CICLO 15 DÍAS
                </span>
                <span className="text-xs text-slate-400 font-medium">{hotelName}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {hotelName} — Menú {wheelLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMatrixOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Abrir Matriz Gastronómica Mensual (30 Días · 4 Columnas Operativas)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Matriz Mensual (30d)</span>
              <span className="sm:hidden">Matriz 30d</span>
            </button>

            <button
              onClick={handlePrintMenuDay}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Imprimir oferta del día"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SELECTOR OBLIGATORIO DE LOS DOS APARTADOS: A. PLATOS DEL MENÚ / B. FICHAS TÉCNICAS */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-[#162230] shrink-0 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSectionTab('platos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSectionTab === 'platos'
                  ? 'bg-[#C5A880] text-slate-950 shadow-md scale-102'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>A. Platos del Menú (15 Días)</span>
            </button>

            <button
              onClick={() => setActiveSectionTab('fichas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSectionTab === 'fichas'
                  ? 'bg-[#C5A880] text-slate-950 shadow-md scale-102'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>B. Fichas Técnicas y Elaboración ({availableTechSheets.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden md:block">
            {activeSectionTab === 'platos'
              ? 'Programación de productos por servicio sin saturación técnica.'
              : 'Biblioteca documental de recetas, alérgenos y elaboración.'}
          </div>
        </div>

        {/* =========================================================================
            APARTADO A: PLATOS DEL MENÚ (15 DÍAS · DESAYUNO, ALMUERZO, CENA)
            ========================================================================= */}
        {activeSectionTab === 'platos' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Selector de los 3 Servicios (Desayuno / Almuerzo / Cena) */}
            <div className="px-6 py-2.5 border-b border-slate-800 bg-[#121923] shrink-0 print:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => handleSelectService('desayuno')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeService === 'desayuno'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Desayuno (15 Días)</span>
                  </button>

                  <button
                    onClick={() => handleSelectService('almuerzo')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeService === 'almuerzo'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Sunset className="w-3.5 h-3.5" />
                    <span>Almuerzo (15 Días)</span>
                  </button>

                  <button
                    onClick={() => handleSelectService('cena')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeService === 'cena'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Cena (15 Días)</span>
                  </button>
                </div>

                {/* Control de Publicación para Admin/Jefe */}
                {(userRole === 'admin' || userRole === 'jefe') && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Estado Día {activeDayNumber}:</span>
                    <select
                      value={activeDay.status}
                      onChange={e => handleToggleDayStatus(e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none ${
                        activeDay.status === 'publicado'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : activeDay.status === 'en_revision'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="publicado" className="bg-slate-900 text-white">Publicado para Servicio</option>
                      <option value="en_revision" className="bg-slate-900 text-white">En Revisión Operativa</option>
                      <option value="borrador" className="bg-slate-900 text-white">Borrador de Trabajo</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Selector de los 15 Días de la Rueda */}
            <div className="px-6 py-2 border-b border-slate-800/80 bg-[#0E141D] shrink-0 overflow-x-auto print:hidden">
              <div className="flex items-center gap-2 min-w-max pb-1">
                {Array.from({ length: 15 }, (_, i) => i + 1).map(dayNum => {
                  const dayData = currentCycle.days.find(d => d.dayNumber === dayNum);
                  const isSelected = activeDayNumber === dayNum;
                  const isPublished = dayData?.status === 'publicado';

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setActiveDayNumber(dayNum)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-[#C5A880] text-slate-950 shadow-lg scale-105'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      <span>Día {dayNum}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cabecera del Día */}
            <div className="px-6 py-3 bg-[#141C26] border-b border-slate-800 shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#C5A880] uppercase">
                      {wheelLabel} · {currentCycle.serviceLabel} · Día {activeDay.dayNumber} de 15
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        activeDay.status === 'publicado'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {activeDay.status === 'publicado' ? 'Publicado' : 'En Revisión'}
                    </span>
                  </div>

                  {isEditingDayTitle ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={newDayTitle}
                        onChange={e => setNewDayTitle(e.target.value)}
                        className="bg-slate-900 border border-slate-600 rounded px-2.5 py-1 text-sm font-bold text-white outline-none"
                      />
                      <button
                        onClick={handleSaveDayTitle}
                        className="bg-[#C5A880] text-slate-950 px-2 py-1 rounded text-xs font-bold"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditingDayTitle(false)}
                        className="text-slate-400 hover:text-white text-xs px-2 py-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-0.5">
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        {activeDay.themeTitle}
                      </h2>
                      {(userRole === 'admin' || userRole === 'jefe') && (
                        <button
                          onClick={() => {
                            setNewDayTitle(activeDay.themeTitle);
                            setIsEditingDayTitle(true);
                          }}
                          className="text-slate-400 hover:text-[#C5A880] p-1"
                          title="Editar título"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeDay.serviceNotes} · Responsable: <strong className="text-slate-300">{activeDay.responsible}</strong>
                  </p>
                </div>

                {(userRole === 'admin' || userRole === 'jefe') && (
                  <button
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Producto al Día</span>
                  </button>
                )}
              </div>
            </div>

            {/* Barra de Control de la Doble Matriz (Filtro Matriz Rotativa vs Matriz Fija y Búsqueda) */}
            <div className="px-6 py-2.5 bg-[#0F1621] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Doble Matriz:</span>
                </span>

                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg">
                  <button
                    onClick={() => setMatrixFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      matrixFilter === 'all'
                        ? 'bg-[#C5A880] text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Todo ({matrixCounts.total})
                  </button>
                  <button
                    onClick={() => setMatrixFilter('rotativa')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                      matrixFilter === 'rotativa'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-amber-300 hover:text-amber-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Rotativa ({matrixCounts.rotativos})</span>
                  </button>
                  <button
                    onClick={() => setMatrixFilter('fija')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                      matrixFilter === 'fija'
                        ? 'bg-sky-500 text-slate-950 shadow-sm'
                        : 'text-sky-300 hover:text-sky-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Fija Base ({matrixCounts.fijos})</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative min-w-[200px] sm:min-w-[260px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={itemSearchQuery}
                    onChange={e => setItemSearchQuery(e.target.value)}
                    placeholder="Filtrar elaboraciones del día..."
                    className="w-full pl-8 pr-3 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:border-[#C5A880] outline-none"
                  />
                  {itemSearchQuery && (
                    <button
                      onClick={() => setItemSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="text-[#C5A880] font-bold">{matrixCounts.conFicha}</span>
                  <span>fichas vinculadas</span>
                </div>
              </div>
            </div>

            {/* Lista de Platos por Estación */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
              {Object.keys(itemsByStation).length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-sm font-semibold">No se encontraron productos para el filtro seleccionado.</p>
                  <p className="text-xs text-slate-500 mt-1">Prueba cambiando la vista de la matriz o limpiando la búsqueda.</p>
                </div>
              ) : (
                (Object.entries(itemsByStation) as [string, MenuItem[]][]).map(([stationName, stationItems]) => (
                  <div key={stationName} className="border border-slate-800 rounded-xl overflow-hidden bg-[#131B25]">
                    <div className="bg-slate-900 px-4 py-2.5 border-b-2 border-amber-500/40 flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2.5 drop-shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-400/40" />
                        {stationName}
                      </h3>
                      <span className="text-xs font-mono font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-xs">
                        {stationItems.length} elaboraciones
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                      {stationItems.map(item => {
                        const hasTechSheet = Boolean(item.techSheetId);
                        const linkedSheet = hasTechSheet
                          ? availableTechSheets.find(s => s.id === item.techSheetId)
                          : null;

                        return (
                          <div
                            key={item.id}
                            className="p-3.5 sm:p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                                  {item.name}
                                </span>
                                {item.matrixType === 'fija' ? (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                    Fijo Base
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    Rotativo Día {activeDay.dayNumber}
                                  </span>
                                )}
                                {item.fixedFamily && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {item.fixedFamily}
                                  </span>
                                )}
                                {item.category && !item.fixedFamily && (
                                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {item.category}
                                  </span>
                                )}
                                {item.temperatureTarget && (
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                    Temp: {item.temperatureTarget}
                                  </span>
                                )}
                              </div>

                              {item.dietaryTags && item.dietaryTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {item.dietaryTags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="text-[9px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                          {/* Botón de Ficha Técnica o Indicador de "Sin Ficha" */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {hasTechSheet ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleOpenTechSheet(item.techSheetId!)}
                                  className="px-3 py-1.5 rounded-lg bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                                  title="Abrir Ficha Técnica Normalizada"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Ver Ficha Técnica</span>
                                  {linkedSheet && (
                                    <span className="text-[10px] opacity-75 font-mono ml-0.5">
                                      ({linkedSheet.code})
                                    </span>
                                  )}
                                </button>

                                {(userRole === 'admin' || userRole === 'jefe') && (
                                  <button
                                    onClick={() => handleUnlinkSheet(activeDay.dayNumber, item.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs transition-colors"
                                    title="Desvincular ficha técnica"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                                  <span>Sin ficha técnica vinculada</span>
                                </span>

                                {(userRole === 'admin' || userRole === 'jefe') && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => setLinkingItem({ dayNumber: activeDay.dayNumber, item })}
                                      className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1 rounded transition-colors"
                                      title="Vincular con una ficha existente"
                                    >
                                      Vincular
                                    </button>
                                    <button
                                      onClick={() => handleStartCreateSheetForDish(item)}
                                      className="text-[10px] font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 px-2 py-1 rounded transition-colors"
                                      title="Crear ficha técnica oficial"
                                    >
                                      + Crear
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {(userRole === 'admin' || userRole === 'jefe') && (
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors ml-1"
                                title="Eliminar plato de este día"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {/* =========================================================================
            APARTADO B: FICHAS TÉCNICAS Y DE ELABORACIÓN (BIBLIOTECA DOCUMENTAL DE LA RUEDA)
            ========================================================================= */}
        {activeSectionTab === 'fichas' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#131B24] shrink-0 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por plato, ingrediente, alérgeno, código o partida..."
                    value={techSheetSearch}
                    onChange={e => setTechSheetSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-[#C5A880] outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={techSheetCategory}
                    onChange={e => setTechSheetCategory(e.target.value)}
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

                <div className="sm:col-span-3 flex items-center gap-2">
                  <select
                    value={techSheetStatus}
                    onChange={e => setTechSheetStatus(e.target.value as any)}
                    className="flex-1 py-2 px-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-300 outline-none"
                  >
                    <option value="activa">Activas ({availableTechSheets.filter(s => s.status === 'activa').length})</option>
                    <option value="archivada">Archivadas ({availableTechSheets.filter(s => s.status === 'archivada').length})</option>
                    <option value="todas">Todas ({availableTechSheets.length})</option>
                  </select>

                  {(userRole === 'admin' || userRole === 'jefe') && (
                    <button
                      onClick={() => {
                        setEditingSheetData(null);
                        setIsEditSheetModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-[#C5A880] text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Ficha</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid de Fichas Técnicas */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {filteredTechSheets.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No se encontraron fichas técnicas con los filtros indicados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTechSheets.map(sheet => (
                    <div
                      key={sheet.id}
                      className="bg-[#151E28] border border-slate-700/80 hover:border-[#C5A880]/60 rounded-xl overflow-hidden transition-all shadow-md flex flex-col group"
                    >
                      <div className="relative h-36 bg-slate-800 overflow-hidden">
                        <img
                          src={sheet.photoUrl}
                          alt={sheet.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold bg-black/75 text-[#C5A880] px-2 py-0.5 rounded border border-[#C5A880]/40">
                            {sheet.code}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded">
                            {sheet.version}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A880]">
                            {sheet.categoryLabel}
                          </span>
                          <h3 className="text-sm font-bold text-white truncate">
                            {sheet.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                        <div className="text-xs space-y-1 text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ración:</span>
                            <strong className="text-[#C5A880]">{sheet.portionWeight}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Partida:</span>
                            <span>{sheet.areaName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ingredientes:</span>
                            <span>{sheet.ingredients.length} items</span>
                          </div>
                          {sheet.allergens.length > 0 && (
                            <div className="pt-1.5 border-t border-slate-800 flex flex-wrap gap-1">
                              {sheet.allergens.slice(0, 3).map((a, i) => (
                                <span key={i} className="text-[9px] bg-red-500/15 text-red-300 px-1.5 py-0.5 rounded font-bold">
                                  {a}
                                </span>
                              ))}
                              {sheet.allergens.length > 3 && (
                                <span className="text-[9px] text-slate-500">+{sheet.allergens.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setViewingTechSheet(sheet)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40 text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Ficha (A4)</span>
                          </button>
                          {(userRole === 'admin' || userRole === 'jefe') && (
                            <button
                              onClick={() => {
                                setEditingSheetData(sheet);
                                setIsEditSheetModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Editar Ficha"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Visor de Ficha Técnica Completa (Formato A4) */}
      {viewingTechSheet && (
        <TechSheetDetailModal
          isOpen={!!viewingTechSheet}
          onClose={() => setViewingTechSheet(null)}
          techSheet={viewingTechSheet}
          hotelName={hotelName}
          userRole={userRole}
          onEdit={(sheet) => {
            setViewingTechSheet(null);
            setEditingSheetData(sheet);
            setIsEditSheetModalOpen(true);
          }}
        />
      )}

      {/* MODAL 2: Vincular Ficha Técnica Existente */}
      {linkingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#141C24] text-slate-100 rounded-2xl shadow-2xl border border-slate-700 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#C5A880]" />
                Vincular Ficha a: {linkingItem.item.name}
              </h3>
              <button
                onClick={() => setLinkingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-80 overflow-y-auto">
              <span className="text-xs text-slate-400 block mb-2">
                Selecciona la ficha técnica del archivo documental:
              </span>
              {availableTechSheets.map(sh => (
                <button
                  key={sh.id}
                  onClick={() => handleSelectSheetToLink(sh.id)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#C5A880]/50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A880] block font-bold">
                      {sh.code} · {sh.categoryLabel}
                    </span>
                    <strong className="text-xs text-white">{sh.name}</strong>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-bold">
                    Vincular <ArrowRight className="w-3 h-3 text-[#C5A880]" />
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setLinkingItem(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Crear / Editar Ficha Técnica */}
      {isEditSheetModalOpen && (
        <TechSheetEditModal
          isOpen={isEditSheetModalOpen}
          onClose={() => {
            setIsEditSheetModalOpen(false);
            setEditingSheetData(null);
          }}
          onSave={(newSheet, changeSummary) => {
            menuAndTechSheetsStorage.saveSingleTechSheet(hotelId, newSheet, changeSummary);
            if (editingSheetData?.name) {
              const item = activeDay.items.find(i => i.name === editingSheetData.name);
              if (item) {
                menuAndTechSheetsStorage.linkItemToTechSheet(
                  hotelId,
                  activeService,
                  wheelId,
                  activeDayNumber,
                  item.id,
                  newSheet.id
                );
              }
            }
            reloadCycle();
          }}
          initialSheet={editingSheetData}
          hotelId={hotelId}
          hotelName={hotelName}
          authorName={authorName}
        />
      )}

      {/* MODAL 4: Añadir Plato a la Rueda del Día */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#141C24] text-slate-100 rounded-2xl shadow-2xl border border-slate-700 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C5A880]" />
                Añadir Producto · {wheelLabel} Día {activeDayNumber} ({currentCycle.serviceLabel})
              </h3>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItemToDay} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre del Plato / Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Salmón a la plancha con verduritas"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estación / Línea de Servicio</label>
                <select
                  value={newItemStation}
                  onChange={e => setNewItemStation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  <option value="Buffet Caliente">Buffet Caliente</option>
                  <option value="Show Cooking">Show Cooking en Directo</option>
                  <option value="Fríos & Ensaladas">Fríos & Ensaladas</option>
                  <option value="Sopas & Cremas">Sopas & Cremas</option>
                  <option value="Carnes & Asados">Carnes & Asados</option>
                  <option value="Pescados & Mariscos">Pescados & Mariscos</option>
                  <option value="Arroces & Pastas">Arroces & Pastas</option>
                  <option value="Guarniciones">Guarniciones</option>
                  <option value="Postres & Obrador">Postres & Obrador</option>
                  <option value="Panadería & Bollería">Panadería & Bollería</option>
                  <option value="Charcutería & Quesos">Charcutería & Quesos</option>
                  <option value="Fruta & Saludable">Fruta & Saludable</option>
                  <option value="Bebidas & Zumos">Bebidas & Zumos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoría</label>
                <input
                  type="text"
                  placeholder="Ej. Pescados, Postres, etc."
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Etiquetas Dietéticas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Ej. Sin Gluten, Vegetariano"
                  value={newItemDietary}
                  onChange={e => setNewItemDietary(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C5A880] text-slate-950 text-xs font-bold"
                >
                  Añadir Plato a {wheelLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Matriz Gastronómica Mensual (30 Días · 4 Columnas) */}
      <GastronomicMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        hotelId={hotelId}
        hotelName={hotelName}
      />
    </div>
  );
};
