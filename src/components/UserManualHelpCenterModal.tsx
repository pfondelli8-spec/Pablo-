import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Search,
  X,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Compass,
  Calendar,
  FolderArchive,
  Users,
  Layers,
  CheckSquare,
  Settings,
  HelpCircle,
  Sparkles,
  Printer,
  Share2,
  Copy,
  Info,
  Clock,
  ShieldAlert,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  ManualArticle,
  ManualChapterId,
  UserRoleTarget,
  ManualStep,
  ManualMistakeToAvoid
} from '../types/userManual';
import {
  userManualService,
  MANUAL_CHAPTERS_META
} from '../services/userManualService';

interface UserManualHelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: ManualChapterId;
  initialArticleId?: string;
  userRole?: 'admin' | 'jefe' | 'empleado';
  activeHotelName?: string;
}

export const UserManualHelpCenterModal: React.FC<UserManualHelpCenterModalProps> = ({
  isOpen,
  onClose,
  initialChapterId,
  initialArticleId,
  userRole = 'empleado',
  activeHotelName = 'Hotel Bitácora & Vulcano'
}) => {
  const [chapters] = useState(() => userManualService.getChapters());
  const [articles, setArticles] = useState<ManualArticle[]>(() => userManualService.getArticles());
  const [selectedChapterId, setSelectedChapterId] = useState<ManualChapterId>(
    initialChapterId || 'capitulo_1_primeros_pasos'
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialArticleId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRoleTarget>('todos');
  const [copiedToast, setCopiedToast] = useState(false);

  // Modo edición administrativa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ManualArticle | null>(null);

  const isSupervisorOrAdmin = userRole === 'admin' || userRole === 'jefe';

  // Sincronizar artículos si se actualiza el servicio
  useEffect(() => {
    const handleUpdate = () => {
      setArticles(userManualService.getArticles());
    };
    window.addEventListener('proa_manual_updated', handleUpdate);
    return () => window.removeEventListener('proa_manual_updated', handleUpdate);
  }, []);

  // Actualizar capítulo o artículo inicial si cambian los props
  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
    }
    if (initialArticleId) {
      setSelectedArticleId(initialArticleId);
    }
  }, [initialChapterId, initialArticleId]);

  // Icono del capítulo según configuración
  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4" />;
      case 'FolderArchive':
        return <FolderArchive className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'CheckSquare':
        return <CheckSquare className="w-4 h-4" />;
      case 'Settings':
        return <Settings className="w-4 h-4" />;
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Artículos filtrados según búsqueda y rol
  const filteredArticles = useMemo(() => {
    return userManualService.searchArticles(searchQuery, selectedRoleFilter, searchQuery ? 'todos' : selectedChapterId);
  }, [searchQuery, selectedRoleFilter, selectedChapterId, articles]);

  // Artículo activo seleccionado
  const currentArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return articles.find(a => a.id === selectedArticleId) || null;
  }, [selectedArticleId, articles]);

  const activeChapterMeta = useMemo(() => {
    return chapters.find(c => c.id === selectedChapterId) || chapters[0];
  }, [selectedChapterId, chapters]);

  // Copiar procedimiento al portapapeles
  const handleCopyProcedure = () => {
    if (!currentArticle) return;
    const text = `MANUAL OPERATIVO F&B: ${currentArticle.title}
${currentArticle.subtitle}

1. ¿PARA QUÉ SIRVE?
${currentArticle.paraQueSirve}

2. ¿QUIÉN PUEDE HACERLO?
${currentArticle.quienPuedeHacerlo.role} (PIN Requerido: ${currentArticle.quienPuedeHacerlo.pinRequired || 'Ninguno'})

3. PASO A PASO:
${currentArticle.pasoAPaso.map(s => `${s.stepNumber}. ${s.title}: ${s.instruction}`).join('\n')}

4. RESULTADO ESPERADO:
${currentArticle.resultadoEsperado.screenState}

5. ERRORES A EVITAR:
${currentArticle.erroresEvitar.map(e => `- ${e.mistake}: ${e.recommendation}`).join('\n')}

PF F&B Management · ${activeHotelName}`;

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Imprimir artículo
  const handlePrint = () => {
    window.print();
  };

  // Abrir editor para nuevo artículo
  const handleNewArticle = () => {
    const newArt: ManualArticle = {
      id: `art-custom-${Date.now()}`,
      chapterId: selectedChapterId,
      order: 99,
      title: 'Nuevo Procedimiento Operativo',
      subtitle: 'Descripción breve de la tarea y ámbito de aplicación.',
      slug: `procedimiento-${Date.now()}`,
      targetRoles: ['operario', 'jefe'],
      badge: 'Operativa',
      published: true,
      updatedAt: new Date().toISOString().slice(0, 10),
      author: 'Dirección Operativa F&B',
      tags: ['nuevo', 'procedimiento'],
      paraQueSirve: 'Explique con claridad qué objetivo persigue esta función en la cocina o departamento.',
      quienPuedeHacerlo: {
        role: 'Personal cualificado del área',
        pinRequired: 'Empleado (1234) o Jefe (5678)'
      },
      pasoAPaso: [
        {
          stepNumber: 1,
          title: 'Acceder a la sección correspondiente',
          instruction: 'Abra el panel de la partida o departamento desde la navegación principal.',
          screenLocation: 'Pantalla principal'
        },
        {
          stepNumber: 2,
          title: 'Ejecutar la comprobación',
          instruction: 'Verifique los parámetros físicos y pulse el botón de confirmación.',
          screenLocation: 'Botón de acción'
        }
      ],
      ejemploPractico: {
        hotelContext: 'Hotel Bitácora',
        scenario: 'Situación habitual en turno de trabajo.',
        resolution: 'Solución aplicada siguiendo la normativa interna.'
      },
      resultadoEsperado: {
        screenState: 'Confirmación visual en verde con hora registrada.',
        systemEffect: 'Guardado inmediato en base de datos local.',
        auditRecord: 'Certificado de operación completada.'
      },
      erroresEvitar: [
        {
          mistake: 'Omitir la comprobación física previa.',
          consequence: 'Posible incidencia sanitaria o desvío de costes.',
          recommendation: 'Verificar siempre antes de pulsar el botón de firma.'
        }
      ]
    };
    setEditingArticle(newArt);
    setIsEditModalOpen(true);
  };

  const handleEditCurrentArticle = (art: ManualArticle) => {
    setEditingArticle(JSON.parse(JSON.stringify(art)));
    setIsEditModalOpen(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este artículo del manual de usuario?')) {
      userManualService.deleteArticle(id);
      if (selectedArticleId === id) {
        setSelectedArticleId(null);
      }
    }
  };

  const handleSaveEditedArticle = () => {
    if (!editingArticle) return;
    userManualService.saveArticle(editingArticle);
    setIsEditModalOpen(false);
    setSelectedArticleId(editingArticle.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#f8fafc] w-full max-w-6xl h-[92vh] rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* =========================================================================
            1. HEADER INSTITUCIONAL DEL MANUAL (AZUL MARINO #022042 & TOQUES DORADOS)
            ========================================================================= */}
        <header className="bg-[#022042] text-white px-4 sm:px-6 py-3.5 border-b border-cyan-900/40 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Título & Identidad */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#042852] border border-[#ebd160]/40 flex items-center justify-center shrink-0 shadow-inner">
                <BookOpen className="w-5 h-5 text-[#ebd160]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ebd160] text-slate-950 shadow-2xs">
                    MANUAL DE USUARIO & AYUDA OPERATIVA
                  </span>
                  <span className="text-xs text-cyan-200/80 font-medium">
                    {activeHotelName} · F&B Management
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight mt-0.5">
                  Centro de Ayuda, Guías y Procedimientos
                </h1>
              </div>
            </div>

            {/* Acciones superiores & Cerrar */}
            <div className="flex items-center gap-2 shrink-0">
              {isSupervisorOrAdmin && (
                <>
                  <button
                    onClick={handleNewArticle}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Añadir nuevo procedimiento"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Nuevo Artículo</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('¿Desea restablecer todos los artículos al manual de fábrica original? Se mantendrán las guías estándar de los 8 capítulos.')) {
                        userManualService.resetToCanonical();
                      }
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-white transition-colors cursor-pointer"
                    title="Restablecer manual canónico"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar Manual"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Barra de Búsqueda y Filtros de Rol */}
          <div className="mt-3.5 pt-3 border-t border-cyan-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Buscador inteligente */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-cyan-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar procedimiento, duda, botón, temperatura, checklist..."
                className="w-full bg-[#042852]/90 border border-cyan-500/30 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-cyan-300/60 focus:outline-hidden focus:ring-2 focus:ring-[#ebd160]/60 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtro por Rol de Usuario */}
            <div className="flex items-center gap-1.5 bg-[#042852]/90 p-1 rounded-xl border border-cyan-500/30 overflow-x-auto">
              <span className="text-[10px] font-bold text-cyan-300/80 uppercase px-2 shrink-0">
                Ver para:
              </span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'operario', label: 'Operarios' },
                { id: 'jefe', label: 'Jefes de Depto.' },
                { id: 'admin', label: 'Dirección / Admin' }
              ].map(rf => (
                <button
                  key={rf.id}
                  onClick={() => setSelectedRoleFilter(rf.id as UserRoleTarget)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedRoleFilter === rf.id
                      ? 'bg-[#ebd160] text-slate-950 shadow-2xs'
                      : 'text-cyan-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* =========================================================================
            2. CUERPO PRINCIPAL: 2 COLUMNAS (SIDEBAR DE CAPÍTULOS + CONTENIDO)
            ========================================================================= */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* SIDEBAR IZQUIERDA: LISTA DE LOS 8 CAPÍTULOS Y ACCESOS RÁPIDOS */}
          <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-slate-100 bg-slate-50/70">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Índice de Capítulos (8 Secciones)
              </div>
            </div>

            <nav className="p-2 space-y-1 flex-1">
              {chapters.map(ch => {
                const isSelected = selectedChapterId === ch.id && !searchQuery;
                const count = articles.filter(a => a.chapterId === ch.id && a.published).length;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setSelectedArticleId(null);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm ring-1 ring-amber-400/20'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ch.numberRoman}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {ch.title}
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {ch.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Accesos rápidos al pie del sidebar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  setSelectedChapterId('capitulo_8_problemas_frecuentes');
                  setSelectedArticleId(null);
                  setSearchQuery('');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Preguntas Frecuentes (FAQ)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
              </button>

              <div className="text-[10px] text-slate-400 text-center font-medium">
                Reglamento (CE) 852/2004 & APPCC · Spring Hotels
              </div>
            </div>
          </aside>

          {/* ÁREA CENTRAL DE CONTENIDO: DETALLE DEL ARTÍCULO O LISTADO */}
          <main className="flex-1 bg-slate-50 overflow-y-auto p-4 sm:p-6">
            
            {/* VISTA 1: ARTÍCULO SELECCIONADO (ESTRUCTURA HOMOGÉNEA DE 6 SECCIONES) */}
            {currentArticle ? (
              <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
                
                {/* Barra de Migas y Volver */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <button
                    onClick={() => setSelectedArticleId(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al Capítulo</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyProcedure}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Copiar guía operativa"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedToast ? '¡Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Imprimir ficha de procedimiento"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir</span>
                    </button>

                    {isSupervisorOrAdmin && (
                      <button
                        onClick={() => handleEditCurrentArticle(currentArticle)}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        title="Editar artículo"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Cabecera del Artículo */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400">
                      {activeChapterMeta.numberRoman}. {activeChapterMeta.title}
                    </span>
                    {currentArticle.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        {currentArticle.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {currentArticle.slug}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {currentArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {currentArticle.subtitle}
                  </p>

                  {/* Ruta de pantalla y botones de acción rápida */}
                  {currentArticle.sectionPath && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">Ubicación en la App:</span>
                      <span className="truncate">{currentArticle.sectionPath}</span>
                    </div>
                  )}

                  {/* Botones rápidos */}
                  {currentArticle.quickButtons && currentArticle.quickButtons.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Botones Clave:
                      </span>
                      {currentArticle.quickButtons.map((btn, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs"
                          title={btn.hint}
                        >
                          [{btn.label}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* =====================================================================
                    LAS 6 SECCIONES HOMOGÉNEAS OBLIGATORIAS
                    ===================================================================== */}

                {/* SECCIÓN 1: ¿PARA QUÉ SIRVE? */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-blue-900 uppercase tracking-wide mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>1. ¿Para qué sirve?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {currentArticle.paraQueSirve}
                  </p>
                </div>

                {/* SECCIÓN 2: ¿QUIÉN PUEDE HACERLO? */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900 uppercase tracking-wide mb-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    <span>2. ¿Quién puede hacerlo?</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        {currentArticle.quienPuedeHacerlo.role}
                      </div>
                      {currentArticle.quienPuedeHacerlo.notes && (
                        <div className="text-[11px] text-emerald-800 mt-0.5">
                          {currentArticle.quienPuedeHacerlo.notes}
                        </div>
                      )}
                    </div>
                    {currentArticle.quienPuedeHacerlo.pinRequired && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs shrink-0 shadow-2xs">
                        <Lock className="w-3 h-3 text-emerald-200" />
                        <span>PIN: {currentArticle.quienPuedeHacerlo.pinRequired}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECCIÓN 3: PASO A PASO */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    <CheckSquare className="w-4 h-4 text-amber-500" />
                    <span>3. Procedimiento Paso a Paso</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    {currentArticle.pasoAPaso.map(step => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 hover:border-slate-300 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {step.title}
                            </h4>
                            {step.highlightButton && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                                Botón: [{step.highlightButton}]
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {step.instruction}
                          </p>
                          {step.screenLocation && (
                            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                              <Compass className="w-3 h-3" />
                              <span>Ubicación: {step.screenLocation}</span>
                            </div>
                          )}
                          {step.tip && (
                            <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                              💡 <span className="font-semibold">Consejo técnico:</span> {step.tip}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECCIÓN 4: EJEMPLO PRÁCTICO REAL */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-amber-950 uppercase tracking-wide mb-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>4. Ejemplo Práctico en Operativa Real</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-slate-50 border border-amber-200/90 space-y-2">
                    <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/60 text-amber-900">
                      Escenario: {currentArticle.ejemploPractico.hotelContext}
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                      "{currentArticle.ejemploPractico.scenario}"
                    </p>
                    <div className="pt-2 border-t border-amber-200/60 text-xs text-slate-700">
                      <span className="font-bold text-emerald-800">Resolución en la App: </span>
                      {currentArticle.ejemploPractico.resolution}
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 5: RESULTADO ESPERADO */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-teal-900 uppercase tracking-wide mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>5. Resultado Esperado en el Sistema</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                      <div className="font-bold text-teal-950 mb-1">En Pantalla:</div>
                      <div className="text-slate-700 text-[11px] leading-relaxed">
                        {currentArticle.resultadoEsperado.screenState}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                      <div className="font-bold text-teal-950 mb-1">Efecto en Sistema:</div>
                      <div className="text-slate-700 text-[11px] leading-relaxed">
                        {currentArticle.resultadoEsperado.systemEffect}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200">
                      <div className="font-bold text-teal-950 mb-1">Trazabilidad Sanitaria:</div>
                      <div className="text-slate-700 text-[11px] leading-relaxed">
                        {currentArticle.resultadoEsperado.auditRecord}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 6: ERRORES QUE DEBEMOS EVITAR */}
                <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-rose-900 uppercase tracking-wide mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>6. Errores Críticos que Debemos Evitar</span>
                  </div>
                  <div className="space-y-2.5">
                    {currentArticle.erroresEvitar.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1"
                      >
                        <div className="font-bold text-rose-900 flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Error: {err.mistake}</span>
                        </div>
                        <div className="text-slate-700 text-[11px] pl-5">
                          <span className="font-semibold text-rose-800">Consecuencia: </span>
                          {err.consequence}
                        </div>
                        <div className="text-emerald-800 font-semibold text-[11px] pl-5">
                          <span className="font-bold">Recomendación preventiva: </span>
                          {err.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie con metadatos y etiquetas */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Etiquetas:</span>
                    {currentArticle.tags.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div>
                    Actualizado: {currentArticle.updatedAt} · Por: {currentArticle.author}
                  </div>
                </div>
              </div>
            ) : (
              /* VISTA 2: LISTADO DE PROCEDIMIENTOS DEL CAPÍTULO ACTIVO O RESULTADOS DE BÚSQUEDA */
              <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
                
                {/* Encabezado del Capítulo o de Búsqueda */}
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                      {getChapterIcon(activeChapterMeta.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-800 border border-amber-300">
                          {searchQuery ? 'Resultados de Búsqueda' : `Capítulo ${activeChapterMeta.numberRoman}`}
                        </span>
                        <span className="text-xs text-slate-400">
                          {filteredArticles.length} procedimientos disponibles
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                        {searchQuery ? `Resultados para "${searchQuery}"` : activeChapterMeta.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        {searchQuery
                          ? 'Procedimientos localizados según palabras clave en títulos, pasos y errores comunes.'
                          : activeChapterMeta.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cuadrícula de Artículos del Capítulo */}
                {filteredArticles.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                    <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold">No se encontraron artículos con ese criterio.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Pruebe con otros términos como «menú», «temperatura», «pin» o seleccione «Todos» en el filtro de roles.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3.5">
                    {filteredArticles.map(art => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArticleId(art.id)}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {art.pasoAPaso.length} Pasos
                            </span>
                            {art.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                {art.badge}
                              </span>
                            )}
                            {art.isNew && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                                NUEVO
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 font-mono">
                              PIN: {art.quienPuedeHacerlo.pinRequired || 'Libre'}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                            {art.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-2">
                            {art.subtitle}
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                            <span>Dirigido a:</span>
                            <span className="font-semibold text-slate-600">
                              {art.quienPuedeHacerlo.role}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          {isSupervisorOrAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCurrentArticle(art);
                              }}
                              className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                              title="Editar artículo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="px-3.5 py-2 rounded-xl bg-slate-900 group-hover:bg-teal-600 text-amber-400 group-hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                            <span>Consultar Guía</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* =========================================================================
            3. MODAL DE EDICIÓN / ALTA DE ARTÍCULO (SOLO MODO JEFE / ADMIN)
            ========================================================================= */}
        {isEditModalOpen && editingArticle && (
          <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden">
              <div className="bg-[#022042] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-[#ebd160]" />
                  <h3 className="text-base font-bold">
                    {editingArticle.id.includes('custom') ? 'Crear Nuevo Procedimiento' : 'Editar Procedimiento Operativo'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Título y Capítulo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Título del Procedimiento:</label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Capítulo del Manual:</label>
                    <select
                      value={editingArticle.chapterId}
                      onChange={e => setEditingArticle({ ...editingArticle, chapterId: e.target.value as ManualChapterId })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                    >
                      {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          {ch.numberRoman}. {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subtítulo */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtítulo explicativo:</label>
                  <input
                    type="text"
                    value={editingArticle.subtitle}
                    onChange={e => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* 1. ¿Para qué sirve? */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">1. ¿Para qué sirve?</label>
                  <textarea
                    rows={3}
                    value={editingArticle.paraQueSirve}
                    onChange={e => setEditingArticle({ ...editingArticle, paraQueSirve: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* 2. ¿Quién puede hacerlo? */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rol Autorizado:</label>
                    <input
                      type="text"
                      value={editingArticle.quienPuedeHacerlo.role}
                      onChange={e =>
                        setEditingArticle({
                          ...editingArticle,
                          quienPuedeHacerlo: { ...editingArticle.quienPuedeHacerlo, role: e.target.value }
                        })
                      }
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">PIN Requerido:</label>
                    <input
                      type="text"
                      value={editingArticle.quienPuedeHacerlo.pinRequired || ''}
                      onChange={e =>
                        setEditingArticle({
                          ...editingArticle,
                          quienPuedeHacerlo: { ...editingArticle.quienPuedeHacerlo, pinRequired: e.target.value }
                        })
                      }
                      placeholder="Ej. Empleado (1234) o Jefe (5678)"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                {/* 3. Pasos (Editor simple de pasos) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700">3. Pasos del Procedimiento:</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newStep: ManualStep = {
                          stepNumber: editingArticle.pasoAPaso.length + 1,
                          title: 'Nuevo Paso',
                          instruction: 'Descripción concreta de la acción.'
                        };
                        setEditingArticle({
                          ...editingArticle,
                          pasoAPaso: [...editingArticle.pasoAPaso, newStep]
                        });
                      }}
                      className="text-teal-700 font-bold hover:underline"
                    >
                      + Añadir Paso
                    </button>
                  </div>
                  {editingArticle.pasoAPaso.map((st, sIdx) => (
                    <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500">Paso {st.stepNumber}:</span>
                        <input
                          type="text"
                          value={st.title}
                          onChange={e => {
                            const copy = [...editingArticle.pasoAPaso];
                            copy[sIdx].title = e.target.value;
                            setEditingArticle({ ...editingArticle, pasoAPaso: copy });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-xs"
                          placeholder="Título del paso"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={st.instruction}
                        onChange={e => {
                          const copy = [...editingArticle.pasoAPaso];
                          copy[sIdx].instruction = e.target.value;
                          setEditingArticle({ ...editingArticle, pasoAPaso: copy });
                        }}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                        placeholder="Instrucción detallada..."
                      />
                    </div>
                  ))}
                </div>

                {/* 4. Ejemplo Práctico */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Ejemplo Práctico en Operativa Real:</label>
                  <textarea
                    rows={2}
                    value={editingArticle.ejemploPractico.scenario}
                    onChange={e =>
                      setEditingArticle({
                        ...editingArticle,
                        ejemploPractico: { ...editingArticle.ejemploPractico, scenario: e.target.value }
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs"
                    placeholder="Situación real en cocina o pase..."
                  />
                </div>

                {/* 6. Errores a evitar */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">6. Error Crítico a Evitar:</label>
                  <input
                    type="text"
                    value={editingArticle.erroresEvitar[0]?.mistake || ''}
                    onChange={e => {
                      const copy = [...editingArticle.erroresEvitar];
                      if (!copy[0]) copy[0] = { mistake: '', consequence: '', recommendation: '' };
                      copy[0].mistake = e.target.value;
                      setEditingArticle({ ...editingArticle, erroresEvitar: copy });
                    }}
                    placeholder="Descripción del error común..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs mb-1.5"
                  />
                  <input
                    type="text"
                    value={editingArticle.erroresEvitar[0]?.recommendation || ''}
                    onChange={e => {
                      const copy = [...editingArticle.erroresEvitar];
                      if (!copy[0]) copy[0] = { mistake: '', consequence: '', recommendation: '' };
                      copy[0].recommendation = e.target.value;
                      setEditingArticle({ ...editingArticle, erroresEvitar: copy });
                    }}
                    placeholder="Recomendación preventiva..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* Botonera de Guardado */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteArticle(editingArticle.id)}
                  className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Artículo</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditedArticle}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
