import React, { useState } from 'react';
import { 
  Building2, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ShieldCheck, 
  Layers, 
  Users, 
  Sliders, 
  Download, 
  RotateCcw, 
  Building,
  Store,
  Briefcase,
  FolderTree,
  AlertCircle,
  FileCheck,
  Copy,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  CompanyConfig, 
  EstablishmentConfig, 
  DepartmentConfig, 
  PointOfSaleConfig, 
  JobRoleConfig, 
  UserAccount,
  EquipmentAppccDef,
  DemoHotelModel
} from '../types/multiTenantConfig';
import { multiTenantStorage } from '../services/multiTenantStorage';
import { demoHotelModelsService } from '../services/demoHotelModelsService';

interface CompanyConfigAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
  onOpenModelWorkspace?: (modelId: string) => void;
}

export const CompanyConfigAdminModal: React.FC<CompanyConfigAdminModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
  onOpenModelWorkspace
}) => {
  const [activeTab, setActiveTab] = useState<'modelos_hotel' | 'empresa' | 'establecimientos' | 'departamentos' | 'puestos_usuarios' | 'limites_appcc' | 'respaldo'>('modelos_hotel');

  // Modelos de hotel precargados
  const [demoModels, setDemoModels] = useState<DemoHotelModel[]>(() => demoHotelModelsService.getModels());
  const [activeModelId, setActiveModelId] = useState<string>(() => demoHotelModelsService.getActiveModelId());
  const [editingModel, setEditingModel] = useState<DemoHotelModel | null>(null);
  const [cloningModel, setCloningModel] = useState<DemoHotelModel | null>(null);
  const [cloneEstName, setCloneEstName] = useState('');
  const [cloneEstAddress, setCloneEstAddress] = useState('');

  // Estados de datos
  const [company, setCompany] = useState<CompanyConfig>(() => multiTenantStorage.getCompany());
  const [establishments, setEstablishments] = useState<EstablishmentConfig[]>(() => multiTenantStorage.getEstablishments());
  const [departments, setDepartments] = useState<DepartmentConfig[]>(() => multiTenantStorage.getDepartments());
  const [pointsOfSale, setPointsOfSale] = useState<PointOfSaleConfig[]>(() => multiTenantStorage.getPointsOfSale());
  const [jobRoles, setJobRoles] = useState<JobRoleConfig[]>(() => multiTenantStorage.getJobRoles());
  const [users, setUsers] = useState<UserAccount[]>(() => multiTenantStorage.getUsers());
  const [equipments, setEquipments] = useState<EquipmentAppccDef[]>(() => multiTenantStorage.getEquipments());

  // Mensaje de éxito
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Formulario nuevo establecimiento
  const [newEstName, setNewEstName] = useState('');
  const [newEstCode, setNewEstCode] = useState('');
  const [newEstType, setNewEstType] = useState<EstablishmentConfig['type']>('hotel');
  const [newEstAddress, setNewEstAddress] = useState('');

  // Formulario nuevo departamento
  const [newDepName, setNewDepName] = useState('');
  const [newDepEstId, setNewDepEstId] = useState(establishments[0]?.id || '');
  const [newDepCategory, setNewDepCategory] = useState<DepartmentConfig['category']>('cocina');

  // Formulario nuevo punto de venta
  const [newPosName, setNewPosName] = useState('');
  const [newPosDepId, setNewPosDepId] = useState(departments[0]?.id || '');

  // Guardar datos de empresa
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    multiTenantStorage.saveCompany(company);
    setSuccessMessage('Datos de empresa actualizados correctamente');
    onConfigChanged();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Añadir establecimiento
  const handleAddEstablishment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEstName.trim()) return;

    const created = multiTenantStorage.addEstablishment({
      companyId: company.id,
      name: newEstName.trim(),
      code: newEstCode.trim() || `EST-${Date.now().toString().slice(-3)}`,
      type: newEstType,
      address: newEstAddress.trim() || 'Dirección de operaciones',
      status: 'activo'
    });

    setEstablishments(multiTenantStorage.getEstablishments());
    setNewEstName('');
    setNewEstCode('');
    setNewEstAddress('');
    setSuccessMessage('Nuevo establecimiento incorporado');
    onConfigChanged();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Añadir departamento
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName.trim()) return;

    const newDep: DepartmentConfig = {
      id: `dep-${Date.now()}`,
      companyId: company.id,
      establishmentId: newDepEstId,
      name: newDepName.trim(),
      code: `DEP-${Date.now().toString().slice(-3)}`,
      category: newDepCategory,
      status: 'activo'
    };

    const updated = [...departments, newDep];
    multiTenantStorage.saveDepartments(updated);
    setDepartments(updated);
    setNewDepName('');
    setSuccessMessage('Departamento añadido');
    onConfigChanged();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Añadir punto de venta
  const handleAddPos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosName.trim()) return;

    const targetDep = departments.find(d => d.id === newPosDepId);
    const newPos: PointOfSaleConfig = {
      id: `pos-${Date.now()}`,
      establishmentId: targetDep?.establishmentId || establishments[0]?.id || '',
      departmentId: newPosDepId,
      name: newPosName.trim(),
      code: `POS-${Date.now().toString().slice(-3)}`,
      type: 'barra',
      status: 'activo'
    };

    const updated = [...pointsOfSale, newPos];
    multiTenantStorage.savePointsOfSale(updated);
    setPointsOfSale(updated);
    setNewPosName('');
    setSuccessMessage('Punto de venta añadido');
    onConfigChanged();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Actualizar límites de equipo APPCC
  const handleUpdateEquipmentLimit = (id: string, field: 'tempMin' | 'tempMax', val: number) => {
    const updated = equipments.map(eq => eq.id === id ? { ...eq, [field]: val } : eq);
    multiTenantStorage.saveEquipments(updated);
    setEquipments(updated);
    onConfigChanged();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#1A2530] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Configuración de mi empresa</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 uppercase">
                  Admin Multitenant
                </span>
              </h2>
              <p className="text-xs text-gray-300">
                Personaliza establecimientos, departamentos, puestos, límites APPCC y módulos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Pestañas de Configuración */}
        <div className="flex items-center gap-1 px-5 border-b border-[#E2E8F0] bg-[#F8F9FA] overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('modelos_hotel')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'modelos_hotel'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Modelos de Establecimiento ({demoModels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('empresa')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'empresa'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Datos Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('establecimientos')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'establecimientos'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Establecimientos ({establishments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('departamentos')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'departamentos'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Departamentos & Puntos Venta</span>
          </button>

          <button
            onClick={() => setActiveTab('puestos_usuarios')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'puestos_usuarios'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Puestos & Usuarios ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('limites_appcc')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'limites_appcc'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Límites APPCC</span>
          </button>

          <button
            onClick={() => setActiveTab('respaldo')}
            className={`py-3 px-3 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'respaldo'
                ? 'border-[#C5A880] text-[#1A2530]'
                : 'border-transparent text-gray-500 hover:text-[#1A2530]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Copia de Seguridad</span>
          </button>
        </div>

        {/* Contenido del Panel */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* =========================================================================
              PESTAÑA 0: MODELOS DE ESTABLECIMIENTO (HOTEL MITACA & HOTEL VULCANO)
             ========================================================================= */}
          {activeTab === 'modelos_hotel' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] flex items-start gap-3">
                <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="text-xs text-[#2C3E50] leading-relaxed">
                  <h3 className="font-bold text-sm text-[#1A2530] mb-0.5">
                    Modelos de establecimiento precargados
                  </h3>
                  <p className="text-gray-600">
                    La plataforma incluye dos estructuras maestras independientes de demostración: <strong>Hotel Mitaca</strong> (4★ Resort de alto volumen) y <strong>Hotel Vulcano</strong> (5★ Boutique gastronómico). Ambos modelos cuentan con sus 7 puestos de cocina configurados y documentación de referencia.
                  </p>
                </div>
              </div>

              {/* LISTA DE MODELOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {demoModels.map(model => {
                  const isActive = model.id === activeModelId;
                  const isMitaca = model.id.includes('mitaca');
                  const isVulcano = model.id.includes('vulcano');

                  return (
                    <div
                      key={model.id}
                      className={`bg-white rounded-xl border p-5 flex flex-col justify-between shadow-xs transition-all ${
                        isActive ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30' : 'border-[#E2E8F0]'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isMitaca ? 'bg-amber-100 text-amber-800' : isVulcano ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {model.stars}★
                            </span>
                            <div>
                              <h4 className="font-bold text-base text-[#1A2530] flex items-center gap-1.5">
                                {model.name}
                                {isActive && (
                                  <span className="text-[10px] bg-[#C5A880] text-[#1A2530] font-bold px-1.5 rounded">
                                    ACTIVO
                                  </span>
                                )}
                              </h4>
                              <span className="text-[11px] text-gray-500 font-mono">Código: {model.code}</span>
                            </div>
                          </div>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {model.configStatus === 'plantilla_maestra' ? 'Plantilla Maestra' : 'En revisión'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                          {model.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-[#E2E8F0] text-center text-xs mb-4">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Departamentos</span>
                            <span className="font-bold text-[#1A2530]">{model.departments?.length || 4}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Puestos Cocina</span>
                            <span className="font-bold text-[#C5A880]">{model.kitchenAreas?.length || 7} áreas</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-semibold">Documentos</span>
                            <span className="font-bold text-[#1A2530]">{model.uploadedDocuments?.length || 18}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botones requeridos por el prompt */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            demoHotelModelsService.setActiveModelId(model.id);
                            setActiveModelId(model.id);
                            if (onOpenModelWorkspace) onOpenModelWorkspace(model.id);
                            setSuccessMessage(`Modelo «${model.name}» cargado en el espacio de trabajo.`);
                            onConfigChanged();
                            setTimeout(() => setSuccessMessage(null), 3000);
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            isActive
                              ? 'bg-[#1A2530] text-white hover:bg-black'
                              : 'bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530]'
                          }`}
                        >
                          <span>{isActive ? 'Modelo activo (En uso)' : 'Abrir modelo'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setEditingModel(model)}
                            className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-gray-500" />
                            <span>Editar configuración</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setCloningModel(model);
                              setCloneEstName('');
                              setCloneEstAddress('');
                            }}
                            className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:border-[#C5A880] hover:text-[#1A2530] text-gray-700 flex items-center justify-center gap-1 font-semibold"
                            title="Genera un hotel operativo independiente sin copiar historiales ni registros"
                          >
                            <Copy className="w-3 h-3 text-[#C5A880]" />
                            <span>Duplicar modelo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulario modal de edición rápida de modelo */}
              {editingModel && (
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#1A2530]">Editar Configuración: {editingModel.name}</h4>
                    <button onClick={() => setEditingModel(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Nombre del Modelo:</label>
                      <input
                        type="text"
                        value={editingModel.name}
                        onChange={e => setEditingModel({ ...editingModel, name: e.target.value })}
                        className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Insignia / Perfil:</label>
                      <input
                        type="text"
                        value={editingModel.badge}
                        onChange={e => setEditingModel({ ...editingModel, badge: e.target.value })}
                        className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Descripción Operativa:</label>
                    <textarea
                      rows={2}
                      value={editingModel.description}
                      onChange={e => setEditingModel({ ...editingModel, description: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingModel(null)} className="px-3 py-1.5 rounded border bg-white">Cancelar</button>
                    <button
                      onClick={() => {
                        demoHotelModelsService.updateModelConfig(editingModel.id, {
                          name: editingModel.name,
                          badge: editingModel.badge,
                          description: editingModel.description
                        });
                        setDemoModels(demoHotelModelsService.getModels());
                        setEditingModel(null);
                        setSuccessMessage('Configuración de modelo guardada.');
                        setTimeout(() => setSuccessMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded bg-[#C5A880] text-[#1A2530] font-bold"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}

              {/* Formulario de duplicación a establecimiento operativo */}
              {cloningModel && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3 text-xs text-blue-950">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Crear Establecimiento Operativo a partir de «{cloningModel.name}»</h4>
                      <p className="text-[11px] text-blue-700">Se copiará la estructura y documentos; se omitirán datos históricos y firmas.</p>
                    </div>
                    <button onClick={() => setCloningModel(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Nombre del Nuevo Establecimiento:</label>
                      <input
                        type="text"
                        placeholder="Ej. Hotel Costa Azul..."
                        value={cloneEstName}
                        onChange={e => setCloneEstName(e.target.value)}
                        className="w-full p-2 rounded-lg border border-blue-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Dirección:</label>
                      <input
                        type="text"
                        placeholder="Ej. Paseo de la Marina, 10"
                        value={cloneEstAddress}
                        onChange={e => setCloneEstAddress(e.target.value)}
                        className="w-full p-2 rounded-lg border border-blue-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setCloningModel(null)} className="px-3 py-1.5 rounded border border-gray-300 bg-white">Cancelar</button>
                    <button
                      disabled={!cloneEstName.trim()}
                      onClick={() => {
                        const newEst = demoHotelModelsService.createEstablishmentFromModel(
                          cloningModel.id,
                          cloneEstName.trim(),
                          cloneEstAddress.trim()
                        );
                        setEstablishments(multiTenantStorage.getEstablishments());
                        setCloningModel(null);
                        setSuccessMessage(`Establecimiento «${newEst.name}» creado limpiamente a partir de la plantilla.`);
                        onConfigChanged();
                        setTimeout(() => setSuccessMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 rounded bg-[#1A2530] text-white font-bold disabled:opacity-50"
                    >
                      Generar Establecimiento Limpio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* =========================================================================
              PESTAÑA 1: DATOS GENERALES DE LA EMPRESA
             ========================================================================= */}
          {activeTab === 'empresa' && (
            <form onSubmit={handleSaveCompany} className="space-y-4 max-w-2xl">
              <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <h3 className="font-bold text-sm text-[#1A2530]">Identidad Corporativa</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nombre Comercial de la Empresa (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#C5A880] focus:outline-none"
                    placeholder="Ej. GastroOps Hospitality Group / Grupo Restauración Iberia"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Razón Social:
                    </label>
                    <input
                      type="text"
                      value={company.legalName}
                      onChange={(e) => setCompany({ ...company, legalName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
                      placeholder="Ej. GastroOps Soluciones S.L."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      NIF / CIF:
                    </label>
                    <input
                      type="text"
                      value={company.taxId}
                      onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white font-mono"
                      placeholder="B-12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Eslogan o Subtítulo Operativo:
                  </label>
                  <input
                    type="text"
                    value={company.slogan}
                    onChange={(e) => setCompany({ ...company, slogan: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
                    placeholder="Estandarización técnica, APPCC y manuales operativos"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    URL de Logotipo (Opcional):
                  </label>
                  <input
                    type="url"
                    value={company.logoUrl || ''}
                    onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>
              </div>

              {/* Módulos Activos */}
              <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                <h3 className="font-bold text-sm text-[#1A2530] mb-2">Activación de Módulos Operativos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(company.activeModules).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setCompany({
                          ...company,
                          activeModules: { ...company.activeModules, [key]: e.target.checked }
                        })}
                        className="rounded text-[#C5A880] focus:ring-[#C5A880]"
                      />
                      <span className="capitalize font-medium text-gray-700">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              PESTAÑA 2: ESTABLECIMIENTOS
             ========================================================================= */}
          {activeTab === 'establecimientos' && (
            <div className="space-y-5">
              {/* Formulario Alta */}
              <form onSubmit={handleAddEstablishment} className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                <h3 className="font-bold text-sm text-[#1A2530] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>Dar de Alta Nuevo Establecimiento</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre (*):</label>
                    <input
                      type="text"
                      required
                      value={newEstName}
                      onChange={(e) => setNewEstName(e.target.value)}
                      placeholder="Ej. Hotel Gran Vía / Bistró Norte"
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo:</label>
                    <select
                      value={newEstType}
                      onChange={(e) => setNewEstType(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    >
                      <option value="hotel">Hotel / Apartahotel</option>
                      <option value="restaurante">Restaurante</option>
                      <option value="cafeteria">Cafetería</option>
                      <option value="bar">Bar / Coctelería</option>
                      <option value="colectividad">Comedor / Colectividad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Código:</label>
                    <input
                      type="text"
                      value={newEstCode}
                      onChange={(e) => setNewEstCode(e.target.value)}
                      placeholder="EST-03"
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#1A2530] hover:bg-[#2C3E50] text-white text-xs font-semibold transition-colors"
                  >
                    + Añadir Establecimiento
                  </button>
                </div>
              </form>

              {/* Listado */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Establecimientos Registrados ({establishments.length}):
                </h4>
                {establishments.map(est => (
                  <div
                    key={est.id}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A2530] text-sm">{est.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {est.code}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530]">
                          {est.type}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5">{est.address}</p>
                    </div>

                    <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-[11px] font-semibold border border-emerald-200">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 3: DEPARTAMENTOS Y PUNTOS DE VENTA (ESTRUCTURA)
             ========================================================================= */}
          {activeTab === 'departamentos' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Alta de Departamento */}
                <form onSubmit={handleAddDepartment} className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                  <h4 className="font-bold text-xs text-[#1A2530] uppercase tracking-wider flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>+ Añadir Departamento</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre (*):</label>
                    <input
                      type="text"
                      required
                      value={newDepName}
                      onChange={(e) => setNewDepName(e.target.value)}
                      placeholder="Ej. Pastelería / Room Service"
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Establecimiento:</label>
                    <select
                      value={newDepEstId}
                      onChange={(e) => setNewDepEstId(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    >
                      {establishments.map(est => (
                        <option key={est.id} value={est.id}>{est.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#1A2530] text-white text-xs font-semibold hover:bg-[#2C3E50]"
                  >
                    Crear Departamento
                  </button>
                </form>

                {/* Alta de Punto de Venta */}
                <form onSubmit={handleAddPos} className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
                  <h4 className="font-bold text-xs text-[#1A2530] uppercase tracking-wider flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>+ Añadir Punto de Venta / Estación</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre del Punto (*):</label>
                    <input
                      type="text"
                      required
                      value={newPosName}
                      onChange={(e) => setNewPosName(e.target.value)}
                      placeholder="Ej. Barra Terraza / Coffee Corner"
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Departamento:</label>
                    <select
                      value={newPosDepId}
                      onChange={(e) => setNewPosDepId(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#E2E8F0] bg-white"
                    >
                      {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#C5A880] text-[#1A2530] font-bold text-xs uppercase hover:bg-[#b89a72]"
                  >
                    Crear Punto de Venta
                  </button>
                </form>
              </div>

              {/* Árbol Jerárquico Visual */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Estructura Jerárquica Actual:
                </h4>

                <div className="space-y-2 text-xs">
                  {departments.map(dep => {
                    const childPos = pointsOfSale.filter(p => p.departmentId === dep.id);
                    return (
                      <div key={dep.id} className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA]">
                        <div className="font-bold text-[#1A2530] flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                          <span>{dep.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">({dep.code})</span>
                        </div>

                        <div className="pl-4 mt-2 space-y-1">
                          {childPos.length === 0 ? (
                            <span className="text-[11px] text-gray-400 italic">Sin puntos de venta asignados</span>
                          ) : (
                            childPos.map(pos => (
                              <div key={pos.id} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                                <span className="text-[#C5A880]">↳</span>
                                <strong>{pos.name}</strong>
                                <span className="text-gray-400 font-mono">[{pos.type}]</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 4: PUESTOS Y USUARIOS (5 ROLES DEL SISTEMA)
             ========================================================================= */}
          {activeTab === 'puestos_usuarios' && (
            <div className="space-y-4">
              <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E2E8F0] text-xs text-gray-600 leading-relaxed">
                El sistema implementa 5 perfiles de usuario configurables según el principio de mínimo privilegio:
                <strong> Administrador de plataforma, Administrador de empresa, Dirección de operaciones, Jefe de departamento</strong> y <strong>Trabajador</strong>.
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Usuarios Activos de la Empresa:
                </h4>
                {users.map(u => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1A2530]">{u.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] font-semibold border border-[#C5A880]/30">
                          {u.role.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5 font-mono text-[11px]">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-semibold">Modificar Rol:</span>
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value as any;
                            const updated = users.map(user => user.id === u.id ? { ...user, role: newRole } : user);
                            multiTenantStorage.saveUsers(updated);
                            setUsers(updated);
                            setSuccessMessage(`Rol de ${u.name} modificado a ${newRole}`);
                            onConfigChanged();
                            setTimeout(() => setSuccessMessage(null), 3000);
                          }}
                          className="p-1 rounded border border-[#E2E8F0] bg-white text-[11px] font-semibold text-[#1A2530] focus:ring-1 focus:ring-[#C5A880]"
                        >
                          <option value="admin_empresa">👑 Admin Empresa</option>
                          <option value="admin_plataforma">⚡ Admin Plataforma</option>
                          <option value="direccion_operaciones">📊 Dirección Ops</option>
                          <option value="jefe_departamento">👨‍🍳 Jefe Depto</option>
                          <option value="trabajador">👤 Trabajador</option>
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          multiTenantStorage.setCurrentUser(u.id);
                          setSuccessMessage(`Sesión cambiada a ${u.name}`);
                          onConfigChanged();
                          setTimeout(() => setSuccessMessage(null), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-gray-50 text-[11px] font-semibold text-[#1A2530]"
                      >
                        Probar como usuario
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 5: LÍMITES DE TEMPERATURA APPCC
             ========================================================================= */}
          {activeTab === 'limites_appcc' && (
            <div className="space-y-4">
              <div className="text-xs text-gray-600">
                Ajusta los umbrales térmicos reglamentarios aplicables a tu equipamiento. Cualquier lectura fuera de este rango disparará la alerta sanitaria y la exigencia de acción correctiva.
              </div>

              <div className="space-y-2.5">
                {equipments.map(eq => (
                  <div
                    key={eq.id}
                    className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#1A2530]">{eq.name}</div>
                      <div className="text-[11px] text-gray-500">{eq.description}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-500 font-semibold">Min:</span>
                      <input
                        type="number"
                        step="0.5"
                        value={eq.tempMin}
                        onChange={(e) => handleUpdateEquipmentLimit(eq.id, 'tempMin', parseFloat(e.target.value))}
                        className="w-16 p-1 rounded border border-[#E2E8F0] bg-white text-center font-mono"
                      />
                      <span className="text-gray-500 font-semibold">Max:</span>
                      <input
                        type="number"
                        step="0.5"
                        value={eq.tempMax}
                        onChange={(e) => handleUpdateEquipmentLimit(eq.id, 'tempMax', parseFloat(e.target.value))}
                        className="w-16 p-1 rounded border border-[#E2E8F0] bg-white text-center font-mono"
                      />
                      <span className="font-mono text-gray-500">ºC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PESTAÑA 6: COPIA DE SEGURIDAD & RESTABLECIMIENTO
             ========================================================================= */}
          {activeTab === 'respaldo' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8F9FA] space-y-3">
                <h4 className="font-bold text-sm text-[#1A2530] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <span>Exportar Respaldo de la Empresa</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Descarga un archivo JSON estructurado con todos los establecimientos, recetas, procedimientos y configuraciones para su archivo o migración a base de datos externa.
                </p>
                <button
                  onClick={() => multiTenantStorage.exportCompanyBackup()}
                  className="px-4 py-2 rounded-lg bg-[#1A2530] hover:bg-[#2C3E50] text-white text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Copia JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-3">
                <h4 className="font-bold text-sm text-red-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-600" />
                  <span>Restablecer Datos de Demostración</span>
                </h4>
                <p className="text-xs text-red-700 leading-relaxed">
                  Elimina las personalizaciones locales y restablece el conjunto genérico de demostración de GastroOps.
                </p>
                <button
                  onClick={() => {
                    if (confirm('¿Restablecer todos los datos a la configuración inicial de demostración?')) {
                      multiTenantStorage.resetToFactoryDemo();
                      setCompany(multiTenantStorage.getCompany());
                      setEstablishments(multiTenantStorage.getEstablishments());
                      setDepartments(multiTenantStorage.getDepartments());
                      setSuccessMessage('Datos restablecidos a valores de fábrica');
                      onConfigChanged();
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
                >
                  Restablecer a Valores de Fábrica
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-gray-50 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-mono">
            Tenant: {company.id} · v2.0 Multiempresa
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1A2530] text-white font-semibold text-xs hover:bg-[#2C3E50] transition-colors"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};
