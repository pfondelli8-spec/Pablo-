import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Copy, 
  Edit3, 
  ArrowRight, 
  Check, 
  Layers, 
  FileText, 
  Users, 
  Briefcase, 
  Plus, 
  ShieldCheck, 
  Flame, 
  Utensils, 
  Clock, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { DemoHotelModel, EstablishmentConfig } from '../types/multiTenantConfig';
import { demoHotelModelsService } from '../services/demoHotelModelsService';

interface HotelModelsSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModelId: string;
  onSelectModel: (modelId: string) => void;
  onEstablishmentCreated?: (newEst: EstablishmentConfig) => void;
  onModelsChanged?: () => void;
}

export const HotelModelsSelectorModal: React.FC<HotelModelsSelectorModalProps> = ({
  isOpen,
  onClose,
  activeModelId,
  onSelectModel,
  onEstablishmentCreated,
  onModelsChanged
}) => {
  const [models, setModels] = useState<DemoHotelModel[]>(() => demoHotelModelsService.getModels());
  const [editingModel, setEditingModel] = useState<DemoHotelModel | null>(null);
  const [cloningModel, setCloningModel] = useState<DemoHotelModel | null>(null);
  const [newEstName, setNewEstName] = useState('');
  const [newEstAddress, setNewEstAddress] = useState('');
  const [copySuccessToast, setCopySuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefresh = () => {
    const updated = demoHotelModelsService.getModels();
    setModels(updated);
    if (onModelsChanged) onModelsChanged();
  };

  const handleOpenModel = (modelId: string) => {
    demoHotelModelsService.setActiveModelId(modelId);
    onSelectModel(modelId);
    onClose();
  };

  const handleSaveModelEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    demoHotelModelsService.updateModelConfig(editingModel.id, {
      name: editingModel.name,
      badge: editingModel.badge,
      description: editingModel.description,
      operationalProfile: editingModel.operationalProfile
    });

    setEditingModel(null);
    handleRefresh();
    showToast(`Configuración de «${editingModel.name}» actualizada correctamente.`);
  };

  const handleExecuteCloneToEstablishment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloningModel || !newEstName.trim()) return;

    const newEst = demoHotelModelsService.createEstablishmentFromModel(
      cloningModel.id,
      newEstName.trim(),
      newEstAddress.trim()
    );

    setCloningModel(null);
    setNewEstName('');
    setNewEstAddress('');
    handleRefresh();

    if (onEstablishmentCreated) {
      onEstablishmentCreated(newEst);
    }

    showToast(`Establecimiento operativo «${newEst.name}» creado con éxito. No se han copiado registros históricos ni datos sensibles.`);
  };

  const handleDuplicateAsNewTemplate = (model: DemoHotelModel) => {
    const customName = `${model.name} (Copia)`;
    const duplicated = demoHotelModelsService.duplicateModel(model.id, customName);
    handleRefresh();
    showToast(`Nueva plantilla de modelo «${duplicated.name}» creada.`);
  };

  const showToast = (msg: string) => {
    setCopySuccessToast(msg);
    setTimeout(() => setCopySuccessToast(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#F8F9FA] text-[#2C3E50] rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-[#1A2530] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#2C3E50] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white">
                  Modelos de Establecimiento Precargados
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 font-semibold">
                  Hostelería Real
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Selecciona, edita o clona plantillas maestras independientes con estructura de Cocina precargada.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NOTIFICACIÓN TOAST */}
        {copySuccessToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{copySuccessToast}</span>
          </div>
        )}

        {/* CUERPO: LISTA DE MODELOS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Banner explicativo: Modelo vs Establecimiento */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div className="text-xs text-[#2C3E50] leading-relaxed">
              <strong className="text-[#1A2530]">Diferencia clave entre Modelo y Establecimiento:</strong>
              <p className="text-gray-600 mt-0.5">
                Los <strong>Modelos</strong> («Hotel Mitaca» y «Hotel Vulcano») son plantillas maestras de referencia con sus 7 puestos de cocina y documentación. Al <strong>«Duplicar como Establecimiento»</strong> se genera una copia limpia para trabajar día a día: no se copian firmas, registros históricos, temperaturas ni incidencias del pasado.
              </p>
            </div>
          </div>

          {/* GRID DE MODELOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {models.map((model) => {
              const isActive = model.id === activeModelId;
              const isMitaca = model.id.includes('mitaca');
              const isVulcano = model.id.includes('vulcano');

              return (
                <div
                  key={model.id}
                  className={`bg-white rounded-xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                    isActive 
                      ? 'border-[#C5A880] ring-2 ring-[#C5A880]/30 shadow-md' 
                      : 'border-[#E2E8F0] hover:border-gray-300'
                  }`}
                >
                  {/* Tarjeta Top */}
                  <div className="p-5">
                    
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isMitaca 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : isVulcano 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {model.stars > 0 ? `${model.stars}★` : 'HOT'}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#1A2530] flex items-center gap-1.5">
                            {model.name}
                            {isActive && (
                              <span className="text-[10px] bg-[#C5A880] text-[#1A2530] font-bold px-1.5 py-0.2 rounded font-mono">
                                ACTIVO
                              </span>
                            )}
                          </h3>
                          <span className="text-[11px] text-gray-500 font-mono">
                            Código: {model.code}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#2C3E50] border border-gray-200">
                        {model.badge}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                      {model.description}
                    </p>

                    {/* Perfil Operativo */}
                    <div className="bg-[#F8F9FA] rounded-lg p-2.5 border border-[#E2E8F0] mb-4 text-xs">
                      <span className="font-bold text-[#1A2530] block mb-0.5 text-[11px] uppercase tracking-wide">
                        Perfil Operativo:
                      </span>
                      <p className="text-gray-600 line-clamp-2 text-[11px]">
                        {model.operationalProfile}
                      </p>
                    </div>

                    {/* Métricas del Modelo */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-[#E2E8F0] text-center text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Departamentos</span>
                        <span className="font-bold text-[#1A2530] text-sm">{model.departments?.length || 4}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Puestos Cocina</span>
                        <span className="font-bold text-[#C5A880] text-sm">{model.kitchenAreas?.length || 7} áreas</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Documentos</span>
                        <span className="font-bold text-[#1A2530] text-sm">{model.uploadedDocuments?.length || 18}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de la Tarjeta */}
                  <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] space-y-2">
                    
                    {/* Botón Principal: Abrir modelo */}
                    <button
                      type="button"
                      onClick={() => handleOpenModel(model.id)}
                      className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                        isActive
                          ? 'bg-[#1A2530] text-white hover:bg-black'
                          : 'bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530]'
                      }`}
                    >
                      <span>{isActive ? 'Modelo en uso (Explorar)' : 'Abrir este modelo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Botones Secundarios: Editar y Duplicar */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingModel(model)}
                        className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:border-gray-400 bg-white text-xs font-semibold text-[#2C3E50] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-gray-500" />
                        <span>Editar datos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCloningModel(model)}
                        className="py-1.5 px-2 rounded-lg border border-[#E2E8F0] hover:border-[#C5A880] bg-white text-xs font-semibold text-[#2C3E50] hover:text-[#1A2530] flex items-center justify-center gap-1.5 transition-colors"
                        title="Crear un establecimiento real a partir de esta plantilla sin historial previo"
                      >
                        <Copy className="w-3 h-3 text-[#C5A880]" />
                        <span>Crear hotel real</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDuplicateAsNewTemplate(model)}
                      className="w-full text-center text-[10px] text-gray-500 hover:text-gray-800 transition-colors pt-1"
                    >
                      + Duplicar como nueva plantilla de modelo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-white border-t border-[#E2E8F0] px-5 sm:px-6 py-3 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500">
            Total de modelos activos: <strong>{models.length}</strong> (100% aislados e independientes)
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2C3E50] hover:bg-[#1A2530] text-white font-semibold transition-colors"
          >
            Cerrar selector
          </button>
        </div>

      </div>

      {/* MODAL SECUNDARIO: EDITAR CONFIGURACIÓN DEL MODELO */}
      {editingModel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Editar Configuración del Modelo</h3>
                <p className="text-xs text-gray-500">Los cambios se aplican a este identificador de plantilla</p>
              </div>
              <button onClick={() => setEditingModel(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSaveModelEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Modelo:</label>
                <input
                  type="text"
                  required
                  value={editingModel.name}
                  onChange={e => setEditingModel({ ...editingModel, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Insignia / Tipo de Operativa:</label>
                <input
                  type="text"
                  required
                  value={editingModel.badge}
                  onChange={e => setEditingModel({ ...editingModel, badge: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción General:</label>
                <textarea
                  rows={3}
                  required
                  value={editingModel.description}
                  onChange={e => setEditingModel({ ...editingModel, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Perfil Operativo F&B:</label>
                <textarea
                  rows={2}
                  value={editingModel.operationalProfile}
                  onChange={e => setEditingModel({ ...editingModel, operationalProfile: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingModel(null)}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b89a72] text-[#1A2530] font-bold"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SECUNDARIO: CREAR ESTABLECIMIENTO OPERATIVO DESDE MODELO */}
      {cloningModel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-[#2C3E50] rounded-xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="font-bold text-base text-[#1A2530]">Crear Establecimiento Real</h3>
                <p className="text-xs text-gray-500">A partir de la plantilla: <strong>{cloningModel.name}</strong></p>
              </div>
              <button onClick={() => setCloningModel(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
              <strong className="block mb-1 font-bold">Garantía de Aislamiento y Datos Limpios:</strong>
              Se clonará la estructura departamental, las 7 áreas de cocina, los puestos y los procedimientos base. <strong>NO</strong> se copiarán registros de temperaturas, firmas, checklists ejecutados ni incidencias anteriores.
            </div>

            <form onSubmit={handleExecuteCloneToEstablishment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del nuevo Establecimiento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gran Hotel Costa Azul, Restaurante Brisas..."
                  value={newEstName}
                  onChange={e => setNewEstName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Dirección / Ubicación Física:</label>
                <input
                  type="text"
                  placeholder="Ej: Paseo Marítimo 12, Planta Baja"
                  value={newEstAddress}
                  onChange={e => setNewEstAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCloningModel(null)}
                  className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newEstName.trim()}
                  className="px-4 py-2 rounded-lg bg-[#1A2530] hover:bg-black text-white font-bold disabled:opacity-50"
                >
                  Generar Establecimiento Limpio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
