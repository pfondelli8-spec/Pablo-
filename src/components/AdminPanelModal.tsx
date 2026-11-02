import React, { useState } from 'react';
import { 
  Building2, 
  FolderPlus, 
  Wine, 
  Layers, 
  Image, 
  History, 
  CheckCircle2, 
  Lock, 
  Users, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  X,
  GraduationCap
} from 'lucide-react';
import { DEMO_SAMPLE_TECHNICAL_SHEETS } from '../data/hotelPortalData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddHotel: () => void;
  onUpdateCompany?: (name: string, subtitle: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onOpenAddHotel,
  onUpdateCompany
}) => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'overview' | 'roles'>('empresa');
  const [companyName, setCompanyName] = useState(() => {
    try {
      return localStorage.getItem('fnb_hub_company_name') || 'OPERATIONS HUB';
    } catch {
      return 'OPERATIONS HUB';
    }
  });
  const [companySubtitle, setCompanySubtitle] = useState(() => {
    try {
      return localStorage.getItem('fnb_hub_company_subtitle') || 'Dirección de operaciones, fichas técnicas estandarizadas y gestión F&B';
    } catch {
      return 'Dirección de operaciones, fichas técnicas estandarizadas y gestión F&B';
    }
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const adminCapabilities = [
    {
      id: 'unidades',
      title: 'Gestión de Unidades Operativas',
      icon: Building2,
      status: 'Activo',
      actionLabel: '+ Añadir Unidad',
      description: 'Crear nuevos entornos independientes para futuros centros operativos F&B.',
      onAction: () => {
        onClose();
        onOpenAddHotel();
      }
    },
    {
      id: 'departamentos',
      title: 'Estructura Departamental',
      icon: FolderPlus,
      status: 'Preparado',
      actionLabel: 'Configurar Deptos.',
      description: 'Habilitar o conectar nuevos departamentos (Recepción, Pisos, Mantenimiento, Cocina, Administración).'
    },
    {
      id: 'areas',
      title: 'Puntos de Venta & Áreas (P.O.S.)',
      icon: Layers,
      status: 'Preparado',
      actionLabel: 'Añadir P.O.S.',
      description: 'Crear nuevas barras, terrazas, buffets o áreas operativas por establecimiento.'
    },
    {
      id: 'fichas',
      title: 'Fichas Técnicas & Escandallos',
      icon: Wine,
      status: 'Piloto F&B Activo',
      actionLabel: 'Nueva Ficha Técnica',
      description: 'Carga de recetas exactas, métodos, cristalería, brújula de sabores y cálculo de margen.'
    },
    {
      id: 'formacion',
      title: 'Publicación de Formación',
      icon: GraduationCap,
      status: 'Preparado',
      actionLabel: 'Crear Módulo Formativo',
      description: 'Vincular fichas técnicas y procedimientos a tracks formativos para el personal.'
    },
    {
      id: 'media',
      title: 'Banco de Fotografías & Activos',
      icon: Image,
      status: 'Preparado',
      actionLabel: 'Subir Fotografías',
      description: 'Galería de fotos de presentación, garnishes y estándares visuales de emplatado.'
    },
    {
      id: 'versionado',
      title: 'Control de Versiones & Auditoría',
      icon: History,
      status: 'Preparado',
      actionLabel: 'Registro de Cambios',
      description: 'Trazabilidad documental ISO/APPCC con historial de revisiones y firmas de jefatura.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in overflow-y-auto font-sans text-[#2C3E50]">
      <div className="relative w-full max-w-4xl bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden my-8">
        {/* Cabecera */}
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center text-[#C5A880]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[#C5A880] font-bold tracking-wider">
                  Arquitectura & Permisos
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]">
                  Control de Acceso (RBAC)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">
                PANEL DE ADMINISTRACIÓN & ROLES
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas: Adaptar Empresa vs Visión General vs Matriz de Permisos */}
        <div className="px-6 py-2.5 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('empresa')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'empresa'
                ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Adaptar a su Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Capacidades de Gestión</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-[#C5A880] text-[#1A2530] font-bold'
                : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-[#F8F9FA]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Matriz de Permisos & Roles</span>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {activeTab === 'empresa' && (
            <div className="space-y-6 animate-fade-in">
              {/* Sección 1: Personalización de Marca */}
              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>IDENTIDAD Y DENOMINACIÓN COMERCIAL</span>
                </div>
                <p className="text-xs text-[#2C3E50]/80">
                  Defina el nombre comercial de su empresa o grupo de restauración. Aparecerá en el encabezado, documentos exportados e informes fiscales.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-[#2C3E50] font-semibold block">Nombre de su Empresa / Marca:</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej. Grupo Gourmet F&B"
                      className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#2C3E50] font-semibold block">Subtítulo o Lema Operativo:</label>
                    <input
                      type="text"
                      value={companySubtitle}
                      onChange={(e) => setCompanySubtitle(e.target.value)}
                      placeholder="Ej. Dirección de operaciones y fichas técnicas estandarizadas"
                      className="w-full p-2.5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-[#C5A880] font-semibold">
                    {statusMessage}
                  </span>
                  <button
                    onClick={() => {
                      try {
                        localStorage.setItem('fnb_hub_company_name', companyName.trim());
                        localStorage.setItem('fnb_hub_company_subtitle', companySubtitle.trim());
                        if (onUpdateCompany) {
                          onUpdateCompany(companyName.trim(), companySubtitle.trim());
                        }
                        setStatusMessage('✓ Cambios guardados correctamente');
                        setTimeout(() => setStatusMessage(null), 3000);
                      } catch {}
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors"
                  >
                    Guardar Datos de Empresa
                  </button>
                </div>
              </div>

              {/* Sección 2: Control de Base de Datos y Limpieza de Contenido */}
              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold uppercase">
                  <Trash2 className="w-4 h-4" />
                  <span>GESTIÓN DE CONTENIDO Y RESET LIMPIO</span>
                </div>
                <p className="text-xs text-[#2C3E50]/80 leading-relaxed">
                  Todo el contenido predeterminado ha sido vaciado para adaptarse a su negocio. Si desea reiniciar todas las fichas o cierres en caché local para empezar de cero, o por el contrario desea cargar datos de ejemplo para probar el sistema, use los controles inferiores:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-rose-700 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Vaciar Todo el Contenido (Reset a Blanco)</span>
                    </h4>
                    <p className="text-[11px] text-[#2C3E50]/70">
                      Elimina fichas técnicas, cierres Z y datos de empleados creados en el navegador para tener la plataforma 100% limpia.
                    </p>
                    <button
                      onClick={() => {
                        try {
                          localStorage.removeItem('fnb_custom_technical_sheets');
                          localStorage.removeItem('operations_cash_closings_data');
                          localStorage.removeItem('klayman_employees_compliance_data');
                          setStatusMessage('✓ Todo el contenido se ha vaciado a blanco.');
                          setTimeout(() => window.location.reload(), 800);
                        } catch {}
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-mono font-bold transition-colors"
                    >
                      Vaciar y Reiniciar Limpio
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-2.5">
                    <h4 className="text-xs font-mono font-bold text-[#1A2530] flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Cargar Datos de Muestra (Demo Opcional)</span>
                    </h4>
                    <p className="text-[11px] text-[#2C3E50]/70">
                      Carga fichas técnicas de coctelería internacional con la formulación estándar estricta para explorar el funcionamiento.
                    </p>
                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem('fnb_custom_technical_sheets', JSON.stringify(DEMO_SAMPLE_TECHNICAL_SHEETS));
                          setStatusMessage('✓ Fichas de demostración cargadas con éxito.');
                          setTimeout(() => window.location.reload(), 800);
                        } catch {}
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#1A2530] border border-[#C5A880]/50 text-xs font-mono font-bold transition-colors"
                    >
                      Cargar Muestra Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6 animate-fade-in">
              {/* Explicación didáctica sobre cómo se diseñan los permisos */}
              <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
                  <h3 className="text-sm font-mono font-bold text-[#2C3E50] uppercase">
                    ¿Para quién está pensada la aplicación y cómo se controlan los accesos?
                  </h3>
                </div>
                <p className="text-xs text-[#2C3E50]/80 leading-relaxed font-sans">
                  La plataforma está diseñada con una arquitectura de <strong>Control de Acceso Basado en Roles (RBAC)</strong>. El empleado de servicio utiliza la herramienta para operar en su día a día (consultar recetas, subir tickets de caja, ver su formación), mientras que los administradores y directores deciden qué información confidencial (costes, márgenes, datos de otros compañeros) queda oculta.
                </p>
              </div>

              {/* Matriz interactiva de Roles */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#2C3E50]/70 uppercase font-bold block">
                  Matriz de Visibilidad y Permisos por Perfil de Usuario:
                </span>

                <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-[#F8F9FA] font-mono text-[11px] text-[#2C3E50] uppercase border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-3">Módulo / Sección</th>
                        <th className="p-3 text-[#2C3E50]">1. Empleado Base (Camarero/Cocina)</th>
                        <th className="p-3 text-[#2C3E50]">2. Jefatura (Maître/Gobernanta)</th>
                        <th className="p-3 text-[#2C3E50]">3. Dirección & RRHH</th>
                        <th className="p-3 text-[#C5A880] font-bold">4. Admin Corporativo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white font-mono text-xs">
                      <tr>
                        <td className="p-3 font-semibold text-[#2C3E50]">
                          Recetas & Fichas Técnicas
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Modo Servicio
                          </span>
                          <div className="text-[10px] text-[#2C3E50]/60 font-sans">Pasos, fotos y cristalería.</div>
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Lectura + Stock
                          </span>
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Escandallo & PVP
                          </span>
                          <div className="text-[10px] text-[#2C3E50]/60 font-sans">Márgenes y costes de compra.</div>
                        </td>
                        <td className="p-3 text-[#C5A880] font-bold">
                          Edición & Estandarización
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-semibold text-[#2C3E50]">
                          Banco de Tickets de Caja
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Subir Cierre
                          </span>
                          <div className="text-[10px] text-[#2C3E50]/60 font-sans">Foto de su ticket y totales.</div>
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Auditar Barra
                          </span>
                          <div className="text-[10px] text-[#2C3E50]/60 font-sans">Revisar descuentos y arqueo.</div>
                        </td>
                        <td className="p-3 text-[#1A2530] font-bold">
                          Auditoría Contable
                        </td>
                        <td className="p-3 text-[#C5A880] font-bold">
                          Consolidado Multi-Hotel
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-semibold text-[#2C3E50]">
                          RRHH & Carnets Sanitarios
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#1A2530] font-bold">
                            <Eye className="w-3.5 h-3.5 text-[#C5A880]" /> Solo su ficha (RGPD)
                          </span>
                          <div className="text-[10px] text-rose-600 font-sans">Compañeros bloqueados.</div>
                        </td>
                        <td className="p-3 text-[#2C3E50]/80">
                          <span className="inline-flex items-center gap-1 text-[#2C3E50] font-bold">
                            <Check className="w-3.5 h-3.5 text-[#C5A880]" /> Equipo de su Turno
                          </span>
                        </td>
                        <td className="p-3 text-[#1A2530] font-bold">
                          Toda la Plantilla + Sanidad
                        </td>
                        <td className="p-3 text-[#C5A880] font-bold">
                          Supervisión Global
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-semibold text-[#2C3E50]">
                          Costes de Compra & Márgenes
                        </td>
                        <td className="p-3 text-rose-600 font-bold">
                          <span className="inline-flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" /> Totalmente Oculto
                          </span>
                        </td>
                        <td className="p-3 text-[#2C3E50]/70">
                          Consulta Operativa
                        </td>
                        <td className="p-3 text-[#1A2530] font-bold">
                          Acceso Completo
                        </td>
                        <td className="p-3 text-[#C5A880] font-bold">
                          Gestión Centralizada
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 font-semibold text-[#2C3E50]">
                          Añadir Hoteles o Deptos.
                        </td>
                        <td className="p-3 text-rose-600 font-bold">
                          <span className="inline-flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" /> Bloqueado
                          </span>
                        </td>
                        <td className="p-3 text-rose-600 font-bold">
                          <span className="inline-flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" /> Bloqueado
                          </span>
                        </td>
                        <td className="p-3 text-[#2C3E50]/70">
                          Solicitud a Central
                        </td>
                        <td className="p-3 text-[#C5A880] font-bold">
                          Permiso Maestro
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ¿Cómo se prepara técnicamente para que no se vea? */}
              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#2C3E50] uppercase flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#C5A880]" />
                  <span>¿Cómo se prepara en la aplicación para que no se vea lo confidencial?</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
                    <span className="font-mono text-[#1A2530] font-bold block">1. Por Inicio de Sesión / PIN</span>
                    <p className="text-[#2C3E50]/70 font-sans text-[11px] leading-relaxed">
                      El empleado se identifica (mediante su perfil de camarero o PIN de barra). La aplicación solo muestra los botones operativos de servicio y oculta menús de gerencia.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
                    <span className="font-mono text-[#1A2530] font-bold block">2. Blindaje Legal RGPD</span>
                    <p className="text-[#2C3E50]/70 font-sans text-[11px] leading-relaxed">
                      En el Portal del Empleado, el sistema solo carga el registro del trabajador autenticado. Las fichas médicas, DNI y carnets de sus compañeros no existen en su pantalla.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
                    <span className="font-mono text-[#1A2530] font-bold block">3. Ocultación de Escandallos</span>
                    <p className="text-[#2C3E50]/70 font-sans text-[11px] leading-relaxed">
                      Los precios de compra a distribuidores y el beneficio neto quedan reservados para Dirección. El personal solo visualiza el PVP oficial para cobrar al huésped.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Banner de Estado Arquitectónico */}
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-mono text-[#2C3E50] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                    <span>Estructura preparada para gestión modular integral:</span>
                  </span>
                  <p className="text-[#2C3E50]/70">
                    La plataforma contempla la creación, edición, versionado y retirada de contenidos operativos en tiempo real para todas las unidades operativas.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddHotel();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold font-mono transition-colors shrink-0"
                >
                  <Building2 className="w-4 h-4" />
                  <span>+ Añadir Nueva Unidad</span>
                </button>
              </div>

              {/* Grid de Capacidades del Panel de Control */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adminCapabilities.map(cap => {
                  const Icon = cap.icon;
                  return (
                    <div 
                      key={cap.id}
                      className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-colors flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#C5A880]" />
                            <h3 className="font-bold text-[#2C3E50] text-sm">
                              {cap.title}
                            </h3>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            cap.status.includes('Activo') 
                              ? 'bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-bold' 
                              : 'bg-[#F8F9FA] text-[#2C3E50]/70 border border-[#E2E8F0]'
                          }`}>
                            {cap.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#2C3E50]/70 leading-relaxed">
                          {cap.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#2C3E50]/50">
                          ID: {cap.id}
                        </span>
                        {cap.onAction ? (
                          <button
                            onClick={cap.onAction}
                            className="text-xs font-mono text-[#C5A880] hover:text-[#b5976f] font-bold"
                          >
                            {cap.actionLabel} →
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-[#2C3E50]/50">
                            Preparado para fase 2
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs font-mono text-[#2C3E50]/70">
          <span>Operations Hub · Gobernanza de Contenidos F&B</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] border border-[#E2E8F0] text-[#2C3E50] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
