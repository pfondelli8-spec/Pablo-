import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  FileText,
  FileSpreadsheet,
  Upload,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers,
  Search,
  BookOpen,
  ChefHat,
  Sun,
  Sunset,
  Moon,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import {
  MenuServiceType,
  MenuItem,
  DayMenuCycle,
  MenuServiceCycle,
  TechSheet
} from '../types/menuAndTechSheets';
import {
  menuAndTechSheetsStorage
} from '../services/menuAndTechSheetsService';
import {
  DocumentRecord,
  SupportedFileFormat,
  cartaMenusDocumentStorage,
  detectFileFormat
} from '../services/cartaMenusDocumentService';
import { ExcelViewerModal } from './ExcelViewerModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { TechSheetDetailModal } from './TechSheetDetailModal';
import { TechSheetEditModal } from './TechSheetEditModal';
import { parseExcelFile, ParsedExcelWorkbook } from '../services/excelService';

interface CartaMenusFichasHubProps {
  hotelId: string;
  hotelName: string;
  onBack: () => void;
  userRole?: 'admin' | 'jefe' | 'empleado';
  authorName?: string;
  initialTab?: 'carta' | 'rueda_1' | 'rueda_2' | 'fichas';
}

export const CartaMenusFichasHub: React.FC<CartaMenusFichasHubProps> = ({
  hotelId,
  hotelName,
  onBack,
  userRole = 'admin',
  authorName = 'Antonio González',
  initialTab = 'rueda_1'
}) => {
  // Pestaña principal: 'carta' | 'rueda_1' | 'rueda_2' | 'fichas'
  const [activeMainTab, setActiveMainTab] = useState<'carta' | 'rueda_1' | 'rueda_2' | 'fichas'>(initialTab);

  // En ruedas de menú: día activo (1 a 15)
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);

  // En ruedas de menú: servicio activo ('desayuno' | 'almuerzo' | 'cena')
  const [activeService, setActiveService] = useState<MenuServiceType>('almuerzo');

  // Sub-vista dentro de la rueda: 'documento' | 'platos'
  const [wheelSubView, setWheelSubView] = useState<'platos' | 'documento'>('platos');

  // Filtro de la doble matriz en platos: 'all' | 'rotativa' | 'fija'
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'rotativa' | 'fija'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Desglose de partidas operativas / comidas del día: 'all' | 'desayuno' | 'frio_manana' | 'frio_tarde' | 'caliente_manana' | 'caliente_tarde' | 'plateria' | 'pasteleria'
  const [partidaFilter, setPartidaFilter] = useState<'all' | 'desayuno' | 'frio_manana' | 'frio_tarde' | 'caliente_manana' | 'caliente_tarde' | 'plateria' | 'pasteleria'>('all');

  // Modales de visualización de documentos
  const [viewingDocument, setViewingDocument] = useState<DocumentRecord | null>(null);
  const [viewingWorkbook, setViewingWorkbook] = useState<ParsedExcelWorkbook | null>(null);
  const [viewingTechSheet, setViewingTechSheet] = useState<TechSheet | null>(null);
  const [editingTechSheet, setEditingTechSheet] = useState<Partial<TechSheet> | null>(null);

  // Modal para vincular plato a ficha
  const [linkingItem, setLinkingItem] = useState<MenuItem | null>(null);

  // Ref para input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadContext, setUploadContext] = useState<{
    target: 'full_wheel' | 'service_doc' | 'carta' | 'tech_sheet' | 'batch_tech_sheets';
    techSheetId?: string;
  } | null>(null);

  // Recarga reactiva de datos
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const forceRefresh = () => setRefreshTrigger(prev => prev + 1);

  // 1. Ciclo de menú activo (Rueda 1 o Rueda 2)
  const activeWheelId = activeMainTab === 'rueda_2' ? 'rueda_2' : 'rueda_1';
  const currentMenuCycle = useMemo(() => {
    return menuAndTechSheetsStorage.getMenuCycle(hotelId, activeService, activeWheelId);
  }, [hotelId, activeService, activeWheelId, refreshTrigger]);

  // Día activo
  const activeDay: DayMenuCycle = useMemo(() => {
    return (
      currentMenuCycle.days.find(d => d.dayNumber === activeDayNumber) ||
      currentMenuCycle.days[0]
    );
  }, [currentMenuCycle, activeDayNumber]);

  // 2. Fichas técnicas disponibles
  const availableTechSheets = useMemo(() => {
    return menuAndTechSheetsStorage.getTechSheetsForHotel(hotelId);
  }, [hotelId, refreshTrigger]);

  // 3. Documentos del hotel (cartas, ruedas, fichas)
  const hotelDocuments = useMemo(() => {
    return cartaMenusDocumentStorage.getDocumentsForHotel(hotelId);
  }, [hotelId, refreshTrigger]);

  // Documentos de la rueda activa
  const wheelDocs = useMemo(() => {
    return cartaMenusDocumentStorage.getWheelDocuments(hotelId, activeWheelId);
  }, [hotelId, activeWheelId, refreshTrigger]);

  // Documento específico del día y servicio activo
  const currentServiceDocKey = `d${activeDayNumber}_${activeService}`;
  const currentServiceDoc = wheelDocs.serviceDocs[currentServiceDocKey] || null;

  // Documentos de Carta
  const cartaDocuments = useMemo(() => {
    return hotelDocuments.filter(d => d.category === 'carta');
  }, [hotelDocuments]);

  // Filtrado de platos del día
  const filteredDayItems = useMemo(() => {
    let items = activeDay.items;
    if (matrixFilter === 'rotativa') {
      items = items.filter(it => it.matrixType === 'rotativa' || !it.matrixType);
    } else if (matrixFilter === 'fija') {
      items = items.filter(it => it.matrixType === 'fija');
    }

    if (partidaFilter !== 'all') {
      items = items.filter(it => {
        const s = (it.station || '').toLowerCase();
        const c = (it.category || '').toLowerCase();
        const f = (it.fixedFamily || '').toLowerCase();

        switch (partidaFilter) {
          case 'desayuno':
            return activeService === 'desayuno' || s.includes('desayun') || s.includes('pan') || s.includes('cafeter') || s.includes('lácteo') || f.includes('boller') || f.includes('cereal') || f.includes('caf');
          case 'frio_manana':
            return s.includes('frío mañana') || s.includes('ensalada') || s.includes('crudit') || s.includes('embutid') || s.includes('queso') || s.includes('fría') || c.includes('ensalada');
          case 'frio_tarde':
            return s.includes('frío tarde') || s.includes('carpaccio') || s.includes('hummus') || s.includes('ahumad') || s.includes('entrante frío') || s.includes('tarde');
          case 'caliente_manana':
            return s.includes('caliente mañana') || s.includes('showcooking') || s.includes('tortilla') || s.includes('huevo') || s.includes('arroz') || s.includes('pasta') || c.includes('arroz') || c.includes('pasta');
          case 'caliente_tarde':
            return s.includes('caliente tarde') || s.includes('asado') || s.includes('plancha') || s.includes('carne') || s.includes('pescado') || c.includes('carne') || c.includes('pescado');
          case 'pasteleria':
            return s.includes('pasteler') || s.includes('postre') || s.includes('dulce') || s.includes('tarta') || s.includes('mousse') || c.includes('postre') || f.includes('postre');
          case 'plateria':
            return s.includes('plater') || s.includes('marmit') || s.includes('plonge') || s.includes('vajilla') || s.includes('higiene') || s.includes('buffet') || c.includes('plater');
          default:
            return true;
        }
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        it =>
          it.name.toLowerCase().includes(q) ||
          (it.station && it.station.toLowerCase().includes(q)) ||
          (it.category && it.category.toLowerCase().includes(q)) ||
          (it.fixedFamily && it.fixedFamily.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeDay, matrixFilter, partidaFilter, searchQuery, activeService]);

  // Contadores de la doble matriz
  const matrixCounts = useMemo(() => {
    const total = activeDay.items.length;
    const rotativos = activeDay.items.filter(it => it.matrixType === 'rotativa' || !it.matrixType).length;
    const fijos = activeDay.items.filter(it => it.matrixType === 'fija').length;
    const conFicha = activeDay.items.filter(it => Boolean(it.techSheetId)).length;
    return { total, rotativos, fijos, conFicha };
  }, [activeDay]);

  // Agrupar platos por estación
  const itemsByStation = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    filteredDayItems.forEach(item => {
      const station = item.station || 'General';
      if (!map[station]) map[station] = [];
      map[station].push(item);
    });
    return map;
  }, [filteredDayItems]);

  // Manejo de carga de archivos (PDF, DOCX, XLSX, imágenes)
  const handleTriggerUpload = (
    target: 'full_wheel' | 'service_doc' | 'carta' | 'tech_sheet' | 'batch_tech_sheets',
    techSheetId?: string
  ) => {
    setUploadContext({ target, techSheetId });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const readFileAsDataUrl = (file: File): Promise<{ file: File; base64: string }> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => {
        resolve({ file, base64: (event.target?.result as string) || '' });
      };
      reader.onerror = () => resolve({ file, base64: '' });
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (fileList.length === 0 || !uploadContext) return;

    const readFiles = await Promise.all(fileList.map((f: File) => readFileAsDataUrl(f)));

    for (let i = 0; i < readFiles.length; i++) {
      const { file, base64 } = readFiles[i];
      if (!base64) continue;

      const fileName = file.name;
      const fileSizeBytes = file.size;
      const fileFormat = detectFileFormat(fileName);

      if (uploadContext.target === 'full_wheel') {
        cartaMenusDocumentStorage.saveFullWheelDocument(hotelId, activeWheelId, {
          fileName,
          fileFormat,
          fileBase64: base64,
          fileSizeBytes,
          author: authorName,
          versionSummary: `Carga de archivo oficial de la rueda completa (${fileName})`
        });
      } else if (uploadContext.target === 'service_doc') {
        cartaMenusDocumentStorage.saveServiceDocument(
          hotelId,
          activeWheelId,
          activeDayNumber,
          activeService,
          {
            fileName,
            fileFormat,
            fileBase64: base64,
            fileSizeBytes,
            author: authorName,
            versionSummary: `Carga de archivo para Día ${activeDayNumber} · ${activeService} (${fileName})`
          }
        );
      } else if (uploadContext.target === 'carta') {
        cartaMenusDocumentStorage.saveCartaDocument(hotelId, {
          fileName,
          title: `Carta ${fileName.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ')}`,
          fileFormat,
          fileBase64: base64,
          fileSizeBytes,
          author: authorName,
          versionSummary: `Carga de carta oficial (${fileName})`
        });
      } else if (uploadContext.target === 'tech_sheet' && uploadContext.techSheetId) {
        cartaMenusDocumentStorage.attachDocumentToTechSheet(hotelId, uploadContext.techSheetId, {
          fileName,
          fileFormat,
          fileBase64: base64,
          fileSizeBytes,
          author: authorName,
          versionSummary: `Documento adjunto a ficha técnica (${fileName})`
        });
      } else if (uploadContext.target === 'batch_tech_sheets' || (uploadContext.target === 'tech_sheet' && !uploadContext.techSheetId)) {
        // Creación masiva automática de recetas a partir de archivos
        const cleanTitle = fileName
          .replace(/\.[^/.]+$/, '')
          .replace(/[_\\-]/g, ' ')
          .trim();
        const sheetId = `ft-upload-${Date.now()}-${i}`;
        const newSheet: TechSheet = {
          id: sheetId,
          code: `FT-REC-${Math.floor(100 + Math.random() * 900)}`,
          hotelId,
          departmentId: `dep-cocina-${hotelId}`,
          departmentName: 'Cocina & Gastronomía',
          areaKey: 'elaboraciones',
          areaName: 'Recetas y Elaboraciones',
          name: cleanTitle,
          category: 'elaboraciones',
          categoryLabel: 'Receta / Ficha',
          portionWeight: '1 ración',
          yieldRations: '1 ración',
          description: `Receta técnica oficial digitalizada a partir del documento: ${fileName}`,
          photoUrl: fileFormat === 'image' ? base64 : undefined,
          ingredients: [
            { name: 'Según desglose en documento adjunto', quantity: 1, unit: 'ud' }
          ],
          production: {
            pax100: 'Consultar documento adjunto',
            pax300: 'Consultar documento adjunto',
            pax800: 'Consultar documento adjunto'
          },
          elaborationSteps: [
            `Elaboración y procedimientos técnicos especificados en el documento ${fileName}.`,
            'Seguir estrictamente el plan APPCC y control de alérgenos.'
          ],
          allergens: [],
          conservationTemp: 'Refrigerado <= 3°C',
          serviceTemp: '> 65°C caliente / < 4°C frío',
          shelfLife: '48 horas',
          platingAndPresentation: 'Presentación según estándar del chef ejecutivo.',
          operationalNotes: `Archivo oficial adjunto: ${fileName} (${(fileSizeBytes / 1024).toFixed(1)} KB)`,
          version: 'v1.0',
          author: authorName,
          status: 'activa',
          updatedAt: new Date().toISOString()
        };

        menuAndTechSheetsStorage.saveSingleTechSheet(hotelId, newSheet, `Carga masiva de receta ${fileName}`);
        cartaMenusDocumentStorage.attachDocumentToTechSheet(hotelId, sheetId, {
          fileName,
          fileFormat,
          fileBase64: base64,
          fileSizeBytes,
          author: authorName,
          versionSummary: `Documento oficial original (${fileName})`
        });
      }
    }

    forceRefresh();
    setUploadContext(null);
  };

  // Abrir visor de documento o Excel
  const handleOpenDoc = (doc: DocumentRecord) => {
    if ((doc.fileFormat === 'xlsx' || doc.fileFormat === 'xls') && doc.fileBase64) {
      if (!doc.parsedExcel) {
        doc.parsedExcel = parseExcelFile(doc.fileBase64, doc.fileName, doc.fileBase64);
      }
      setViewingWorkbook(doc.parsedExcel);
    } else {
      setViewingDocument(doc);
    }
  };

  return (
    <div className="bg-[#F8F9FA] text-[#2C3E50] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1A2530]">
      {/* Input oculto para carga de archivos (soporte múltiple) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      {/* =========================================================================
          SELECTOR DE PESTAÑAS: RUEDA 1 · RUEDA 2 · FICHAS TÉCNICAS & RECETAS · CARTA
          ========================================================================= */}
      <div className="bg-slate-900 text-white rounded-2xl p-2.5 shadow-sm border border-slate-800 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveMainTab('rueda_1')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                activeMainTab === 'rueda_1'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Rueda 1</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-current font-semibold shrink-0">
                15 Días
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('rueda_2')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                activeMainTab === 'rueda_2'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Rueda 2</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-current font-semibold shrink-0">
                15 Días
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('fichas')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                activeMainTab === 'fichas'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Fichas & Recetas</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-current font-semibold shrink-0">
                {availableTechSheets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('carta')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                activeMainTab === 'carta'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Carta</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/40 text-current font-semibold shrink-0">
                {cartaDocuments.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs flex-shrink-0">
            {userRole === 'empleado' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 whitespace-nowrap">
                <span>👷 Modo Trabajador (Consulta)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 whitespace-nowrap">
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Jefe Activo ({authorName})</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTENEDOR PRINCIPAL
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* =========================================================================
            APARTADO 1: CARTA DEL ESTABLECIMIENTO
            ========================================================================= */}
        {activeMainTab === 'carta' && (
          <div className="space-y-5 animate-fade-in">
            {/* Cabecera de Sección Carta */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#C5A880] bg-[#C5A880]/15 px-2.5 py-0.5 rounded-md">
                    Documentación de Carta
                  </span>
                  <span className="text-xs text-gray-500">· {hotelName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1A2530] mt-1">
                  Cartas de Restaurantes, Bares y Terraza
                </h2>
                <p className="text-xs text-[#2C3E50]/70 mt-1 max-w-2xl">
                  Gestión y archivo documental de cartas vigentes en formatos PDF, Word (.docx) y Excel (.xlsx con soporte multi-hoja de platos, bebidas y alérgenos).
                </p>
              </div>

              {(userRole === 'admin' || userRole === 'jefe') && (
                <button
                  onClick={() => handleTriggerUpload('carta')}
                  className="px-4 py-2 rounded-xl bg-[#1A2530] hover:bg-[#C5A880] hover:text-[#1A2530] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>Subir Nueva Carta (PDF / Word / Excel)</span>
                </button>
              )}
            </div>

            {/* Listado de Documentos de Carta */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartaDocuments.map(doc => {
                const isExcel = doc.fileFormat === 'xlsx' || doc.fileFormat === 'xls';
                const isPdf = doc.fileFormat === 'pdf';

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isExcel
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : isPdf
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}
                          >
                            {isExcel ? (
                              <FileSpreadsheet className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              {doc.fileFormat.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono ml-1.5 font-bold">
                              {doc.version}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-500 font-mono">
                          {(doc.fileSizeBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#1A2530] group-hover:text-[#C5A880] transition-colors line-clamp-1">
                          {doc.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono truncate mt-0.5">
                          {doc.fileName}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                        <span>Autor: <strong>{doc.author.split('(')[0]}</strong></span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Botones de Acción de Carta */}
                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDoc(doc)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#C5A880] hover:text-slate-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visualizar {isExcel ? 'Excel' : 'Doc'}</span>
                      </button>

                      {(userRole === 'admin' || userRole === 'jefe') && (
                        <button
                          onClick={() => handleTriggerUpload('carta')}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                          title="Subir nueva versión"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            APARTADO 2 & 3: MENÚ — RUEDA 1 y MENÚ — RUEDA 2 (15 DÍAS · 3 SERVICIOS = 45 APARTADOS)
            ========================================================================= */}
        {(activeMainTab === 'rueda_1' || activeMainTab === 'rueda_2') && (
          <div className="space-y-4 animate-fade-in">
            {/* BARRA SUPERIOR DE LA RUEDA: DOCUMENTO GLOBAL Y MODALIDADES */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                    {activeMainTab === 'rueda_1' ? 'Menú — Rueda 1' : 'Menú — Rueda 2'}
                  </span>
                  <span className="text-xs text-gray-500">· 15 Días × 3 Servicios (45 Apartados)</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Aislamiento {hotelName}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#1A2530]">
                  {activeMainTab === 'rueda_1' ? 'Rueda de Menú 1' : 'Rueda de Menú 2'} · Programación Quincenal
                </h2>
              </div>

              {/* Botón Documento Global de la Rueda (Excel/PDF de los 15 días completos) */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                {wheelDocs.fullWheelDoc ? (
                  <button
                    onClick={() => handleOpenDoc(wheelDocs.fullWheelDoc!)}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    title="Abrir libro Excel de la rueda completa con todas las hojas"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Ver Libro Completo ({wheelDocs.fullWheelDoc.fileName})</span>
                  </button>
                ) : (
                  <span className="text-xs text-gray-500 italic">Sin libro global cargado</span>
                )}

                {(userRole === 'admin' || userRole === 'jefe') && (
                  <button
                    onClick={() => handleTriggerUpload('full_wheel')}
                    className="px-3 py-2 rounded-xl border border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Cargar documento único para toda la rueda de 15 días (PDF, DOCX o XLSX)"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cargar Libro Global (XLSX/PDF)</span>
                  </button>
                )}
              </div>
            </div>

            {/* =========================================================================
                SELECTORES DE NAVEGACIÓN DE LA RUEDA:
                1. SELECTOR COMPACTO DE LOS 15 DÍAS
                2. SELECTOR DE LOS 3 SERVICIOS (DESAYUNO / ALMUERZO / CENA)
                ========================================================================= */}
            <div className="bg-[#141C26] rounded-2xl border border-slate-800 p-3 sm:p-4 space-y-3">
              {/* Barra de los 15 Días */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {Array.from({ length: 15 }, (_, i) => i + 1).map(dayNum => {
                  const isSelected = activeDayNumber === dayNum;
                  const hasDoc = Boolean(
                    wheelDocs.serviceDocs[`d${dayNum}_desayuno`] ||
                    wheelDocs.serviceDocs[`d${dayNum}_almuerzo`] ||
                    wheelDocs.serviceDocs[`d${dayNum}_cena`]
                  );

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setActiveDayNumber(dayNum)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#C5A880] text-slate-950 shadow-md scale-105 font-extrabold'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      <span>Día {dayNum}</span>
                      {hasDoc && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Contiene documento" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Barra de los 3 Servicios (Desayuno, Almuerzo, Cena) y Modo de Vista */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Servicio Día {activeDayNumber}:
                  </span>

                  <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveService('desayuno')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeService === 'desayuno'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Desayuno</span>
                    </button>

                    <button
                      onClick={() => setActiveService('almuerzo')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeService === 'almuerzo'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Sunset className="w-3.5 h-3.5" />
                      <span>Almuerzo</span>
                    </button>

                    <button
                      onClick={() => setActiveService('cena')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeService === 'cena'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Cena</span>
                    </button>
                  </div>
                </div>

                {/* Conmutador de Vista: Elaboraciones & Platos vs Documento Oficial de Servicio */}
                <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setWheelSubView('platos')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      wheelSubView === 'platos'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Platos & Fichas ({activeDay.items.length})
                  </button>
                  <button
                    onClick={() => setWheelSubView('documento')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      wheelSubView === 'documento'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Documento Oficial ({currentServiceDoc ? '1' : '0'})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================================================
                VISTA A: DOCUMENTO OFICIAL DEL SERVICIO (SUBIR, VISUALIZAR EXCEL/PDF, VERSIONAR)
                ========================================================================= */}
            {wheelSubView === 'documento' && (
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Apartado {activeDayNumber}/15 · {activeService.toUpperCase()}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A2530] mt-1">
                      Documento Oficial del Servicio: Día {activeDayNumber} — {activeService === 'desayuno' ? 'Desayuno' : activeService === 'almuerzo' ? 'Almuerzo' : 'Cena'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Permite cargar y consultar el archivo específico de este servicio (PDF, DOCX o Excel multi-hoja).
                    </p>
                  </div>

                  {(userRole === 'admin' || userRole === 'jefe') && (
                    <button
                      onClick={() => handleTriggerUpload('service_doc')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{currentServiceDoc ? 'Sustituir por Nueva Versión' : 'Subir Documento de Servicio'}</span>
                    </button>
                  )}
                </div>

                {currentServiceDoc ? (
                  <div className="p-5 rounded-2xl bg-[#0F1722] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                            {currentServiceDoc.fileFormat.toUpperCase()}
                          </span>
                          <span className="text-xs font-mono text-[#C5A880] font-bold">
                            {currentServiceDoc.version}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({(currentServiceDoc.fileSizeBytes / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {currentServiceDoc.fileName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Subido por <strong>{currentServiceDoc.author}</strong> el {new Date(currentServiceDoc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleOpenDoc(currentServiceDoc)}
                        className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Abrir Visor Integrado</span>
                      </button>

                      {currentServiceDoc.fileBase64 && (
                        <button
                          onClick={() => handleOpenDoc(currentServiceDoc)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          title="Descargar archivo original"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-3">
                    <FileSpreadsheet className="w-10 h-10 text-gray-400 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        No hay archivo individual para este servicio
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                        Puede subir un archivo PDF, Word o Excel específico para este pase, o consultar la rueda en el libro global superior o en la vista interactiva de platos.
                      </p>
                    </div>

                    {(userRole === 'admin' || userRole === 'jefe') && (
                      <button
                        onClick={() => handleTriggerUpload('service_doc')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-[#C5A880] hover:text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir Archivo de este Pase</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                VISTA B: PLATOS & ELABORACIONES DEL DÍA CON VINCULACIÓN A FICHAS TÉCNICAS
                ========================================================================= */}
            {wheelSubView === 'platos' && (
              <div className="space-y-4 animate-fade-in">
                {/* Desglose Operativo por Comida / Partida (Desayuno, Frío Mañana, Frío Tarde, Caliente Mañana, Caliente Tarde, Platería, Pastelería) */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 sm:p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Desglose por Comida y Partidas (Día {activeDayNumber}):</span>
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {filteredDayItems.length} platos filtrados
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { key: 'all' as const, label: 'Todo el Buffet' },
                      { key: 'desayuno' as const, label: 'Partida de Desayunos' },
                      { key: 'frio_manana' as const, label: 'Partida Fría (Mañana)' },
                      { key: 'frio_tarde' as const, label: 'Partida Fría (Noche)' },
                      { key: 'caliente_manana' as const, label: 'Partida Caliente (Mañana)' },
                      { key: 'caliente_tarde' as const, label: 'Partida Caliente (Noche)' },
                      { key: 'pasteleria' as const, label: 'Partida de Pastelería' },
                      { key: 'plateria' as const, label: 'Partida de Plancha y Platería' }
                    ].map(tab => {
                      const isSelected = partidaFilter === tab.key;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setPartidaFilter(tab.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-[#1A2530] text-amber-300 shadow-xs font-bold border border-amber-400/50'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Barra de Filtro de Doble Matriz y Búsqueda */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                      <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Filtro Matriz:</span>
                    </span>

                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                      <button
                        onClick={() => setMatrixFilter('all')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          matrixFilter === 'all'
                            ? 'bg-[#1A2530] text-white shadow-xs'
                            : 'text-gray-700 hover:text-gray-950'
                        }`}
                      >
                        Todo ({matrixCounts.total})
                      </button>
                      <button
                        onClick={() => setMatrixFilter('rotativa')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          matrixFilter === 'rotativa'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-amber-900 hover:text-amber-950 font-bold'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Rotativa ({matrixCounts.rotativos})</span>
                      </button>
                      <button
                        onClick={() => setMatrixFilter('fija')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          matrixFilter === 'fija'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-sky-900 hover:text-sky-950 font-bold'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        <span>Fija Base ({matrixCounts.fijos})</span>
                      </button>
                    </div>
                  </div>

                  {/* Buscador de platos */}
                  <div className="relative min-w-[200px] sm:min-w-[260px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Buscar elaboración del buffet..."
                      className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:border-[#C5A880] outline-none"
                    />
                  </div>
                </div>

                {/* Listado de Platos Agrupados por Estación */}
                <div className="space-y-4">
                  {(Object.entries(itemsByStation) as [string, MenuItem[]][]).map(([stationName, items]) => (
                    <div
                      key={stationName}
                      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs"
                    >
                      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-amber-500/40">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-md ring-4 ring-amber-400/30 shrink-0" />
                          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 drop-shadow-sm">
                            {stationName}
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-950 bg-amber-400 px-3 py-0.5 rounded-full shadow-xs">
                          {items.length} elaboraciones
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {items.map(item => {
                          const hasTechSheet = Boolean(item.techSheetId);
                          const linkedSheet = hasTechSheet
                            ? availableTechSheets.find(s => s.id === item.techSheetId)
                            : null;

                          return (
                            <div
                              key={item.id}
                              className="p-3 sm:p-4 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-[#1A2530]">
                                    {item.name}
                                  </span>

                                  {item.matrixType === 'fija' ? (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                                      Fijo Base
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                      Rotativo Día {activeDayNumber}
                                    </span>
                                  )}

                                  {item.fixedFamily && (
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                      {item.fixedFamily}
                                    </span>
                                  )}

                                  {item.temperatureTarget && (
                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                                      {item.temperatureTarget}
                                    </span>
                                  )}
                                </div>

                                {item.dietaryTags && item.dietaryTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dietaryTags.map((tag, tIdx) => (
                                      <span
                                        key={tIdx}
                                        className="text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Botón de Enlace a la Ficha Técnica */}
                              <div className="shrink-0 self-end sm:self-center">
                                {hasTechSheet ? (
                                  <button
                                    onClick={() => {
                                      if (linkedSheet) setViewingTechSheet(linkedSheet);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#1A2530] border border-[#C5A880]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                    title="Abrir Ficha Técnica Normalizada"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#C5A880]" />
                                    <span>Ver Ficha Técnica</span>
                                    {linkedSheet && (
                                      <span className="text-[10px] font-mono text-gray-500 font-normal">
                                        ({linkedSheet.code})
                                      </span>
                                    )}
                                  </button>
                                ) : (
                                  userRole !== 'empleado' ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                                      <span>Sin ficha vinculada</span>
                                    </span>
                                  ) : null
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            APARTADO 4: BIBLIOTECA DE FICHAS TÉCNICAS Y ELABORACIONES
            ========================================================================= */}
        {activeMainTab === 'fichas' && (
          <div className="space-y-5 animate-fade-in">
            {/* Cabecera Fichas */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#C5A880] bg-[#C5A880]/15 px-2.5 py-0.5 rounded-md">
                    Archivo Documental Independiente
                  </span>
                  <span className="text-xs text-gray-500">· {hotelName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1A2530] mt-1">
                  Fichas Técnicas, Escandallos y APPCC
                </h2>
                <p className="text-xs text-[#2C3E50]/70 mt-1 max-w-2xl">
                  Biblioteca de recetas normalizadas a 1 página (100, 300 y 800 pax) con soporte para adjuntar archivos Excel (.xlsx multi-hoja), Word o PDF.
                </p>
              </div>

              {(userRole === 'admin' || userRole === 'jefe') && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTriggerUpload('batch_tech_sheets')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                    title="Subir uno o varios archivos (PDF, fotos JPG/PNG, Word o Excel) para crear fichas técnicas de recetas de golpe"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Subir Recetas / Fichas (Múltiple)</span>
                  </button>
                  <button
                    onClick={() => setEditingTechSheet({ hotelId })}
                    className="px-4 py-2 rounded-xl bg-[#1A2530] hover:bg-[#C5A880] hover:text-[#1A2530] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Ficha Manual</span>
                  </button>
                </div>
              )}
            </div>

            {/* Listado de Fichas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTechSheets.map(sheet => {
                // Comprobar si tiene documento adjunto (ej. Excel)
                const attachedDoc = hotelDocuments.find(
                  d => d.category === 'ficha_tecnica' && d.techSheetId === sheet.id
                );

                return (
                  <div
                    key={sheet.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-[#1A2530] border border-gray-200">
                          {sheet.code}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {sheet.categoryLabel}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#1A2530] group-hover:text-[#C5A880] transition-colors line-clamp-1">
                          {sheet.name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {sheet.description}
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                        <div className="flex justify-between">
                          <span>Ración base:</span>
                          <strong>{sheet.portionWeight}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Pase APPCC:</span>
                          <strong className="text-cyan-800">{sheet.serviceTemp}</strong>
                        </div>
                        {sheet.costPerPortion && (
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>Coste ración:</span>
                            <span>{sheet.costPerPortion.toFixed(2)} €</span>
                          </div>
                        )}
                      </div>

                      {/* Documento adjunto si existe */}
                      {attachedDoc && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 truncate">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate font-mono text-[11px]">{attachedDoc.fileName}</span>
                          </div>
                          <button
                            onClick={() => handleOpenDoc(attachedDoc)}
                            className="text-[10px] font-bold text-emerald-900 underline hover:text-emerald-700 shrink-0 ml-1"
                          >
                            Ver Excel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Acciones de la Ficha */}
                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
                      {attachedDoc ? (
                        <>
                          <button
                            onClick={() => handleOpenDoc(attachedDoc)}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Documento de Receta</span>
                          </button>
                          <button
                            onClick={() => setViewingTechSheet(sheet)}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                            title="Ver Ficha Normalizada estándar"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setViewingTechSheet(sheet)}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#C5A880] hover:text-slate-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ficha Normalizada</span>
                        </button>
                      )}

                      {(userRole === 'admin' || userRole === 'jefe') && (
                        <>
                          <button
                            onClick={() => handleTriggerUpload('tech_sheet', sheet.id)}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                            title="Adjuntar archivo Excel/PDF a esta ficha"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setEditingTechSheet(sheet)}
                            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                            title="Editar ficha técnica"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALES DE VISUALIZACIÓN Y EDICIÓN
          ========================================================================= */}
      {/* 1. Visor Interactivo de Libros Excel (.xlsx / .xls) Multi-Hoja */}
      {viewingWorkbook && (
        <ExcelViewerModal
          isOpen={!!viewingWorkbook}
          onClose={() => setViewingWorkbook(null)}
          workbook={viewingWorkbook}
        />
      )}

      {/* 2. Visor de Documentos Genéricos (PDF / Word) */}
      {viewingDocument && (
        <DocumentPreviewModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          document={viewingDocument}
        />
      )}

      {/* 3. Visor de Ficha Técnica Normalizada (1 Página A4 con escalado 100/300/800 pax) */}
      {viewingTechSheet && (
        <TechSheetDetailModal
          isOpen={!!viewingTechSheet}
          onClose={() => setViewingTechSheet(null)}
          sheet={viewingTechSheet}
        />
      )}

      {/* 4. Editor de Ficha Técnica */}
      {editingTechSheet && (
        <TechSheetEditModal
          isOpen={!!editingTechSheet}
          onClose={() => setEditingTechSheet(null)}
          sheet={editingTechSheet}
          hotelId={hotelId}
          authorName={authorName}
          onSaved={() => {
            forceRefresh();
            setEditingTechSheet(null);
          }}
        />
      )}
    </div>
  );
};
