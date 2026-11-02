import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Coffee, 
  Snowflake, 
  Flame, 
  Cake, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  Search, 
  Filter, 
  User, 
  Building2, 
  Info,
  Calendar,
  X,
  FileCheck
} from 'lucide-react';
import { 
  KitchenStationKey, 
  DocumentCategoryKey, 
  KitchenStationArea, 
  UploadedDocumentRecord, 
  UserAccount,
  DemoHotelModel
} from '../types/multiTenantConfig';
import { 
  demoHotelModelsService, 
  STANDARD_DOCUMENT_CATEGORIES, 
  KITCHEN_STATION_META 
} from '../services/demoHotelModelsService';

interface KitchenAreasManagerViewProps {
  currentUser: UserAccount;
  currentEstablishmentName: string;
  activeModel: DemoHotelModel;
  onOpenModelSelector?: () => void;
  onLaunchChecklist?: (stationName: string) => void;
}

export const KitchenAreasManagerView: React.FC<KitchenAreasManagerViewProps> = ({
  currentUser,
  currentEstablishmentName,
  activeModel,
  onOpenModelSelector,
  onLaunchChecklist
}) => {
  // Estación de cocina seleccionada (por defecto la primera de las 7)
  const [selectedStationKey, setSelectedStationKey] = useState<KitchenStationKey>('cafeteria');

  // Categoría documental activa (de las 6 normalizadas)
  const [activeCategoryKey, setActiveCategoryKey] = useState<DocumentCategoryKey>('info_puesto');

  // Documentos subidos / cargados
  const [docsList, setDocsList] = useState<UploadedDocumentRecord[]>(() => 
    demoHotelModelsService.getUploadedDocuments()
  );

  // Estados de modales
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [readingDoc, setReadingDoc] = useState<UploadedDocumentRecord | null>(null);
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulario de subida de documento
  const [uploadForm, setUploadForm] = useState({
    title: '',
    fileName: '',
    fileSize: '450 KB',
    fileType: 'pdf' as 'pdf' | 'docx' | 'xlsx' | 'imagen' | 'guia',
    version: '1.0',
    status: 'publicado' as 'borrador' | 'revision' | 'publicado' | 'obsoleto',
    categoryKey: 'info_puesto' as DocumentCategoryKey,
    stationKey: 'cafeteria' as KitchenStationKey,
    summary: '',
    contentSnippet: ''
  });

  // Estaciones del modelo activo
  const kitchenAreas = activeModel.kitchenAreas || [];
  const currentStation = kitchenAreas.find(a => a.key === selectedStationKey) || kitchenAreas[0];

  // Documentos filtrados para la estación y categoría seleccionada
  const filteredDocs = useMemo(() => {
    return docsList.filter(d => {
      // Filtrar por estación y categoría
      if (d.stationKey !== selectedStationKey) return false;
      if (d.categoryKey !== activeCategoryKey) return false;
      // Búsqueda libre
      if (searchDocQuery.trim()) {
        const q = searchDocQuery.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.fileName.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [docsList, selectedStationKey, activeCategoryKey, searchDocQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let detectedType: 'pdf' | 'docx' | 'xlsx' | 'imagen' | 'guia' = 'pdf';
      if (ext === 'docx' || ext === 'doc') detectedType = 'docx';
      else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') detectedType = 'xlsx';
      else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) detectedType = 'imagen';

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      setUploadForm(prev => ({
        ...prev,
        fileName: file.name,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        fileSize: sizeStr,
        fileType: detectedType,
        contentSnippet: `Documento oficial verificado para ${KITCHEN_STATION_META[prev.stationKey]?.name || 'Cocina'}. Archivo: ${file.name}. Validado por el departamento de Operaciones & Calidad F&B.`
      }));
    }
  };

  const handleSaveUploadedDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim() || !uploadForm.fileName.trim()) return;

    const newRecord: UploadedDocumentRecord = {
      id: `doc-custom-${Date.now()}`,
      companyId: 'company-generic-01',
      hotelModelId: activeModel.id,
      establishmentId: 'est-mitaca',
      stationKey: uploadForm.stationKey,
      categoryKey: uploadForm.categoryKey,
      title: uploadForm.title.trim(),
      fileName: uploadForm.fileName.trim(),
      fileSize: uploadForm.fileSize || '380 KB',
      fileType: uploadForm.fileType,
      version: uploadForm.version || '1.0',
      status: uploadForm.status,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'trabajador' ? 'Cocinero de Partida' : 'Jefe de Cocina',
      uploadedAt: new Date().toLocaleDateString('es-ES') + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      summary: uploadForm.summary.trim() || 'Procedimiento operativo de cocina incorporado al sistema.',
      contentSnippet: uploadForm.contentSnippet || 'Contenido técnico de operativa, estándares de calidad y normas de seguridad alimentaria aplicables a este puesto.'
    };

    demoHotelModelsService.saveUploadedDocument(newRecord);
    setDocsList(demoHotelModelsService.getUploadedDocuments());
    setIsUploadModalOpen(false);

    // Reset form
    setUploadForm({
      title: '',
      fileName: '',
      fileSize: '450 KB',
      fileType: 'pdf',
      version: '1.0',
      status: 'publicado',
      categoryKey: activeCategoryKey,
      stationKey: selectedStationKey,
      summary: '',
      contentSnippet: ''
    });

    showToast(`Documento «${newRecord.title}» incorporado con éxito a ${KITCHEN_STATION_META[newRecord.stationKey].name}.`);
  };

  const handleDeleteDoc = (docId: string, title: string) => {
    if (confirm(`¿Deseas archivar o eliminar el documento «${title}»?`)) {
      demoHotelModelsService.deleteUploadedDocument(docId);
      setDocsList(demoHotelModelsService.getUploadedDocuments());
      showToast(`Documento archivado.`);
    }
  };

  // Iconos visuales para las 7 estaciones
  const getStationIcon = (key: KitchenStationKey) => {
    switch (key) {
      case 'cafeteria': return <Coffee className="w-4 h-4 text-[#C5A880]" />;
      case 'frio_manana': return <Snowflake className="w-4 h-4 text-sky-600" />;
      case 'frio_tarde': return <Snowflake className="w-4 h-4 text-blue-700" />;
      case 'caliente_manana': return <Flame className="w-4 h-4 text-amber-600" />;
      case 'caliente_tarde': return <Flame className="w-4 h-4 text-orange-600" />;
      case 'pasteleria': return <Cake className="w-4 h-4 text-rose-500" />;
      case 'marmiton': return <Utensils className="w-4 h-4 text-emerald-600" />;
      default: return <Utensils className="w-4 h-4 text-[#C5A880]" />;
    }
  };

  // Badge de formato de archivo
  const getFileBadge = (type: string) => {
    switch (type) {
      case 'pdf': return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">PDF</span>;
      case 'docx': return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">DOCX</span>;
      case 'xlsx': return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">XLSX</span>;
      case 'imagen': return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">IMG</span>;
      default: return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">DOC</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans animate-fade-in pb-16">
      
      {/* 1. HEADER: CHEF DE COCINA & MODELO ACTIVO */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Identidad del Chef con Foto enviada por el usuario */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src="/assets/aistudio/image_056773e3.png" 
                alt="Giacomo Longo / Antonio González · Jefe de Cocina" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-[#C5A880] shadow-sm"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-[#1A2530] text-[#C5A880] text-[10px] font-bold border border-[#C5A880]/40 font-mono">
                1er CHEF
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#2C3E50] font-bold">
                  {activeModel.id.includes('vulcano') ? 'Chef de Hotel Vulcano' : 'Chef de Bitácora'}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-600 font-medium">
                  {activeModel.id.includes('vulcano') ? 'Granadilla de Abona · Canarias' : '21 años en Spring Hoteles'}
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-bold text-[#1A2530] mt-0.5">
                {activeModel.id.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González'}
              </h1>
              
              <p className="text-xs sm:text-sm text-[#2C3E50] italic mt-1 leading-relaxed max-w-2xl">
                {activeModel.id.includes('vulcano')
                  ? 'Dirección culinaria, alta cocina gastronómica de autor, técnicas de vanguardia y supervisión de las 7 áreas de cocina de Hotel Vulcano.'
                  : '“Llevo 21 años en Spring y empecé desde los puestos más bajos de cocina hasta convertirme en el chef de Bitácora. Para mí Spring significa oportunidad.”'}
              </p>
            </div>
          </div>

          {/* Selector / Indicador del Modelo Activo */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0] shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Modelo de Hotel en Uso
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-sm text-[#1A2530]">{activeModel.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {activeModel.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                {activeModel.stars} Estrellas · 7 Áreas Operativas
              </p>
            </div>

            {onOpenModelSelector && (
              <button
                type="button"
                onClick={onOpenModelSelector}
                className="px-3.5 py-1.5 rounded-lg bg-[#1A2530] hover:bg-black text-[#C5A880] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Cambiar de Modelo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3 flex items-center gap-2.5 text-xs text-emerald-800 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2. SELECTOR DE LAS 7 ÁREAS O PUESTOS DE COCINA (OBLIGATORIAS POR PROMPT) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Estructura de Cocina (7 Áreas de Trabajo)</span>
          </span>
          <span className="text-[11px] text-gray-400 hidden sm:inline">
            Selecciona una partida para consultar operativa y documentación
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {kitchenAreas.map((area) => {
            const isSelected = area.key === selectedStationKey;
            const meta = KITCHEN_STATION_META[area.key];

            return (
              <button
                key={area.key}
                type="button"
                onClick={() => {
                  setSelectedStationKey(area.key);
                  setUploadForm(prev => ({ ...prev, stationKey: area.key }));
                }}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#C5A880] bg-[#C5A880]/15 ring-2 ring-[#C5A880]/40 shadow-xs'
                    : 'border-[#E2E8F0] hover:border-gray-300 hover:bg-[#F8F9FA]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    0{area.order}. {area.code}
                  </span>
                  {getStationIcon(area.key)}
                </div>

                <div className="font-bold text-xs text-[#1A2530] truncate">
                  {area.name}
                </div>

                <div className="text-[10px] text-gray-500 truncate mt-0.5">
                  {meta?.badge || 'Cocina'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FICHA DETALLADA DEL PUESTO SELECCIONADO */}
      {currentStation && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
          
          {/* Header de la Ficha */}
          <div className="bg-[#1A2530] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] font-bold border border-[#C5A880]/30">
                  Área 0{currentStation.order} · {currentStation.code}
                </span>
                <span className="text-xs text-gray-300">
                  Departamento: <strong>Cocina & Gastronomía</strong>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
                {currentStation.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-gray-200 border border-white/15 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A880]" />
                <span>Horario habitual: <strong>{currentStation.shiftSchedule}</strong></span>
              </div>

              {onLaunchChecklist && (
                <button
                  type="button"
                  onClick={() => onLaunchChecklist(currentStation.name)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold transition-colors shrink-0"
                >
                  Abrir Checklist Turno
                </button>
              )}
            </div>
          </div>

          {/* Cuerpo de la Ficha: Responsabilidades, Tareas Críticas y Equipos */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Columna 1: Responsabilidades Principales */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                <FileCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Responsabilidades Principales</span>
              </h3>
              <ul className="space-y-2">
                {currentStation.responsibilities?.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] shrink-0 mt-1.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              {/* Alérgenos con foco crítico */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                <span className="font-bold text-[#1A2530] block mb-1.5 text-[11px] uppercase tracking-wide">
                  Enfoque Crítico de Alérgenos (UE 14):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStation.allergensFocus?.map((al, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium">
                      {al}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna 2: Tareas Críticas (Apertura, Servicio, Cierre) */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                <AlertCircle className="w-4 h-4 text-[#C5A880]" />
                <span>Tareas Críticas por Fase</span>
              </h3>
              
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                  <strong className="text-[11px] uppercase text-[#1A2530] font-bold block mb-1">
                    🌅 1. Apertura & Puesta a Punto
                  </strong>
                  <ul className="space-y-1 text-[11px] text-gray-600">
                    {currentStation.criticalTasks.apertura?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                  <strong className="text-[11px] uppercase text-[#1A2530] font-bold block mb-1">
                    ⚡ 2. Servicio & Tiempos de Pase
                  </strong>
                  <ul className="space-y-1 text-[11px] text-gray-600">
                    {currentStation.criticalTasks.servicio?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0]">
                  <strong className="text-[11px] uppercase text-[#1A2530] font-bold block mb-1">
                    🌙 3. Cierre, Higiene & Traspaso
                  </strong>
                  <ul className="space-y-1 text-[11px] text-gray-600">
                    {currentStation.criticalTasks.cierre?.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Columna 3: Maquinaria y Equipos Asignados */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Equipamiento & Maquinaria</span>
              </h3>
              <p className="text-gray-500 text-[11px]">
                Equipos bajo responsabilidad de inventario, calibración y limpieza de este puesto:
              </p>
              <div className="space-y-1.5">
                {currentStation.assignedEquipment?.map((eq, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] flex items-center gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A2530] shrink-0" />
                    <span className="font-medium text-[11px]">{eq}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. HUB DOCUMENTAL: LAS 6 CATEGORÍAS NORMALIZADAS */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        
        {/* Barra superior del Hub */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C5A880]" />
              <h3 className="font-bold text-base text-[#1A2530]">
                Documentación Operativa de {currentStation.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Consulta manuales, recetas, guías de maquinaria y normativas sin tener que descargar archivos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Buscador de documentos */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar documento..."
                value={searchDocQuery}
                onChange={e => setSearchDocQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none w-44 sm:w-56"
              />
            </div>

            {/* Botón Subir Documento */}
            <button
              type="button"
              onClick={() => {
                setUploadForm(prev => ({
                  ...prev,
                  stationKey: selectedStationKey,
                  categoryKey: activeCategoryKey
                }));
                setIsUploadModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Documento</span>
            </button>
          </div>
        </div>

        {/* Pestañas de las 6 Categorías Normalizadas */}
        <div className="bg-[#F8F9FA] px-4 border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {STANDARD_DOCUMENT_CATEGORIES.map(cat => {
            const isActive = cat.key === activeCategoryKey;
            const countForCat = docsList.filter(d => d.stationKey === selectedStationKey && d.categoryKey === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategoryKey(cat.key)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1A2530] text-white shadow-xs'
                    : 'text-[#2C3E50] hover:bg-white border border-transparent hover:border-[#E2E8F0]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#C5A880] text-[#1A2530]' : 'bg-gray-200 text-gray-600'
                }`}>
                  {countForCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lista de Documentos en la Categoría Seleccionada */}
        <div className="p-5">
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-[#E2E8F0] space-y-3">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <div className="text-xs text-gray-500 max-w-sm mx-auto">
                No hay documentos registrados todavía en <strong>{STANDARD_DOCUMENT_CATEGORIES.find(c => c.key === activeCategoryKey)?.label}</strong> para el puesto de {currentStation.name}.
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-black transition-colors"
              >
                + Subir el primer archivo a esta categoría
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map(doc => {
                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#C5A880] transition-all bg-white flex flex-col justify-between group shadow-xs"
                  >
                    <div>
                      {/* Fila superior: Tipo, Versión, Estado */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          {getFileBadge(doc.fileType)}
                          <span className="text-[11px] font-mono text-gray-500">v{doc.version}</span>
                          <span className="text-[10px] text-gray-400">· {doc.fileSize}</span>
                        </div>

                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'publicado' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : doc.status === 'revision'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      {/* Título y Nombre de Archivo */}
                      <h4 className="font-bold text-sm text-[#1A2530] group-hover:text-[#C5A880] transition-colors line-clamp-2">
                        {doc.title}
                      </h4>
                      
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5 truncate">
                        Archivo: {doc.fileName}
                      </p>

                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {doc.summary}
                      </p>
                    </div>

                    {/* Fila inferior: Autor, Fecha y Botones */}
                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                      <div className="text-[11px] text-gray-500">
                        <span>Por <strong>{doc.authorName}</strong></span>
                        <span className="block text-[10px] text-gray-400">{doc.uploadedAt}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setReadingDoc(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#1A2530] hover:bg-black text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span>Ver</span>
                        </button>

                        {(currentUser.role === 'admin_plataforma' || currentUser.role === 'admin_empresa' || currentUser.role === 'direccion_operaciones' || currentUser.role === 'jefe_departamento') && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar o archivar documento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: SUBIR / IMPORTAR DOCUMENTO */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1A2530]">
                    Subir Documento Operativo de Cocina
                  </h3>
                  <p className="text-xs text-gray-500">Asocia manuales, recetas, APPCC o formación al puesto</p>
                </div>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSaveUploadedDoc} className="space-y-3.5 text-xs">
              
              {/* Selector de Archivo Local */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Seleccionar Archivo (PDF, DOCX, XLSX o Imagen):
                </label>
                <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#C5A880] rounded-xl p-4 text-center cursor-pointer bg-[#F8F9FA] transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileUploadSimulated}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-[#C5A880] mx-auto mb-1.5" />
                  <span className="block font-semibold text-gray-700">
                    {uploadForm.fileName ? `Archivo: ${uploadForm.fileName}` : 'Arrastra un archivo o haz clic para examinar'}
                  </span>
                  <span className="text-[10px] text-gray-400">Soporta formatos estándar de ofimática de hostelería</span>
                </div>
              </div>

              {/* Título del Documento */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Título del Procedimiento o Ficha:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ficha Técnica de Elaboración de Salsas Base"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              {/* Puesto / Área y Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Área de Cocina:</label>
                  <select
                    value={uploadForm.stationKey}
                    onChange={e => setUploadForm({ ...uploadForm, stationKey: e.target.value as KitchenStationKey })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                  >
                    {kitchenAreas.map(a => (
                      <option key={a.key} value={a.key}>{a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Categoría Documental (6 Obligatorias):</label>
                  <select
                    value={uploadForm.categoryKey}
                    onChange={e => setUploadForm({ ...uploadForm, categoryKey: e.target.value as DocumentCategoryKey })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                  >
                    {STANDARD_DOCUMENT_CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Versión y Estado del Ciclo de Vida */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Versión:</label>
                  <input
                    type="text"
                    required
                    value={uploadForm.version}
                    onChange={e => setUploadForm({ ...uploadForm, version: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none font-mono"
                    placeholder="1.0"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estado:</label>
                  <select
                    value={uploadForm.status}
                    onChange={e => setUploadForm({ ...uploadForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]"
                  >
                    <option value="publicado">Publicado (Vigente en servicio)</option>
                    <option value="revision">En revisión (Pendiente de aprobación)</option>
                    <option value="borrador">Borrador preliminar</option>
                  </select>
                </div>
              </div>

              {/* Resumen Operativo */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Resumen del Contenido:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explica brevemente de qué trata este documento, parámetros críticos o instrucciones clave para el cocinero..."
                  value={uploadForm.summary}
                  onChange={e => setUploadForm({ ...uploadForm, summary: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!uploadForm.title || !uploadForm.fileName}
                  className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold disabled:opacity-50 transition-colors"
                >
                  Guardar e Incorporar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISOR DE DOCUMENTO (LECTURA RÁPIDA SIN DESCARGAS PESADAS) */}
      {readingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white text-[#2C3E50] rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Header del Visor */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0] shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getFileBadge(readingDoc.fileType)}
                  <span className="text-[11px] font-mono text-gray-500">v{readingDoc.version}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {readingDoc.status}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-[#1A2530]">
                  {readingDoc.title}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {readingDoc.fileName} ({readingDoc.fileSize})
                </p>
              </div>
              <button onClick={() => setReadingDoc(null)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>

            {/* Metadatos */}
            <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E2E8F0] text-xs grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Área Asignada</span>
                <span className="font-bold text-[#1A2530]">{KITCHEN_STATION_META[readingDoc.stationKey]?.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Categoría</span>
                <span className="font-bold text-[#1A2530]">
                  {STANDARD_DOCUMENT_CATEGORIES.find(c => c.key === readingDoc.categoryKey)?.label}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Publicado Por</span>
                <span className="font-bold text-[#1A2530] truncate block">{readingDoc.authorName}</span>
              </div>
            </div>

            {/* Contenido / Texto del Documento */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-gray-50/70 border border-[#E2E8F0] text-xs leading-relaxed text-[#2C3E50]">
              <div>
                <strong className="text-[#1A2530] block mb-1 font-bold text-sm">Resumen Ejecutivo de Operaciones:</strong>
                <p className="text-gray-700 bg-white p-3 rounded-lg border border-[#E2E8F0]">
                  {readingDoc.summary}
                </p>
              </div>

              <div>
                <strong className="text-[#1A2530] block mb-1 font-bold text-sm">Extracto de Normativa & Procedimiento:</strong>
                <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] space-y-2 text-gray-700 font-mono text-[11px]">
                  <p>
                    {readingDoc.contentSnippet || 'Documento validado para la operativa en cocina. Los trabajadores de esta partida deben observar estrictamente los puntos críticos aquí descritos antes de comenzar el servicio.'}
                  </p>
                  <p className="text-gray-500">
                    • Trazabilidad y conservación: Todos los recipientes deben estar rotulados con fecha de elaboración y caducidad secundaria (máx. 72 horas a temperatura ≤ 4ºC).
                  </p>
                  <p className="text-gray-500">
                    • Control de alérgenos: Utilizar exclusivamente la tabla y el menaje específico identificado con código de color.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer con Acción */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between shrink-0 text-xs">
              <span className="text-gray-400 text-[11px]">
                Última revisión: {readingDoc.uploadedAt}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Descarga de «${readingDoc.fileName}» simulada correctamente.`);
                    setReadingDoc(null);
                  }}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-[#1A2530] font-semibold hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Descargar Archivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReadingDoc(null)}
                  className="px-4 py-2 rounded-lg bg-[#1A2530] text-white font-semibold hover:bg-black transition-colors"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
