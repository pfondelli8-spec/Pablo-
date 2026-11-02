import React, { useState } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  ChefHat,
  Scale,
  Sparkles,
  ShieldAlert,
  Info,
  Clock,
  Thermometer,
  Calendar
} from 'lucide-react';
import { TechSheet, TechSheetIngredient } from '../types/menuAndTechSheets';
import { OFFICIAL_ALLERGENS_LIST } from '../data/bitacoraRecetasData';

interface TechSheetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sheet: TechSheet, changeSummary?: string) => void;
  initialSheet?: Partial<TechSheet> | null;
  hotelId: string;
  hotelName: string;
  authorName: string;
}

export const TechSheetEditModal: React.FC<TechSheetEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSheet,
  hotelId,
  hotelName,
  authorName
}) => {
  if (!isOpen) return null;

  const isNew = !initialSheet?.id;

  const [changesSummary, setChangesSummary] = useState(
    isNew ? 'Aprobación inicial de ficha técnica' : 'Revisión y actualización de parámetros técnicos'
  );
  const [code, setCode] = useState(initialSheet?.code || `FT-COC-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState(initialSheet?.name || '');
  const [category, setCategory] = useState(initialSheet?.category || 'carnes');
  const [categoryLabel, setCategoryLabel] = useState(initialSheet?.categoryLabel || 'Carnes & Asados');
  const [departmentName, setDepartmentName] = useState(initialSheet?.departmentName || 'Cocina & Gastronomía');
  const [areaName, setAreaName] = useState(initialSheet?.areaName || 'Partida de Calientes');
  const [portionWeight, setPortionWeight] = useState(initialSheet?.portionWeight || '200 g');
  const [yieldRations, setYieldRations] = useState(initialSheet?.yieldRations || '1 ración');
  const [description, setDescription] = useState(initialSheet?.description || '');
  const [photoUrl, setPhotoUrl] = useState(
    initialSheet?.photoUrl ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  );

  const [ingredients, setIngredients] = useState<TechSheetIngredient[]>(
    initialSheet?.ingredients || [
      { name: 'Ingrediente base', quantity: 150, unit: 'g' },
      { name: 'Aceite de oliva virgen extra', quantity: 10, unit: 'ml' },
      { name: 'Sal marina', quantity: 2, unit: 'g' }
    ]
  );

  const [production100, setProduction100] = useState(initialSheet?.production?.pax100 || '15 kg base, 1 L AOVE, 200 g sal');
  const [production300, setProduction300] = useState(initialSheet?.production?.pax300 || '45 kg base, 3 L AOVE, 600 g sal');
  const [production800, setProduction800] = useState(initialSheet?.production?.pax800 || '120 kg base, 8 L AOVE, 1.6 kg sal');

  const [steps, setSteps] = useState<string[]>(
    initialSheet?.elaborationSteps || [
      'Disponemos los ingredientes limpios y pesados en mesa de trabajo.',
      'Procedemos a la cocción controlando temperatura interna mediante termómetro sonda.',
      'Emplatamos y mantenemos en línea de servicio a temperatura reglamentaria.'
    ]
  );

  const [allergens, setAllergens] = useState<string[]>(initialSheet?.allergens || []);
  const [conservationTemp, setConservationTemp] = useState(initialSheet?.conservationTemp || 'Refrigeración 0°C a 4°C');
  const [serviceTemp, setServiceTemp] = useState(initialSheet?.serviceTemp || '> 65°C en buffet');
  const [shelfLife, setShelfLife] = useState(initialSheet?.shelfLife || '48 horas refrigerado');
  const [platingAndPresentation, setPlatingAndPresentation] = useState(
    initialSheet?.platingAndPresentation || 'Presentación en barqueta GN 1/2 con guarnición armónica y vajilla precalentada.'
  );
  const [operationalNotes, setOperationalNotes] = useState(
    initialSheet?.operationalNotes || 'Control estricto de temperatura en el corazón del producto durante todo el servicio.'
  );

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: 'g' }]);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleUpdateIngredient = (idx: number, field: keyof TechSheetIngredient, value: any) => {
    const updated = [...ingredients];
    updated[idx] = { ...updated[idx], [field]: value };
    setIngredients(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (idx: number) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleUpdateStep = (idx: number, value: string) => {
    const updated = [...steps];
    updated[idx] = value;
    setSteps(updated);
  };

  const toggleAllergen = (label: string) => {
    if (allergens.includes(label)) {
      setAllergens(allergens.filter(a => a !== label));
    } else {
      setAllergens([...allergens, label]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sheetToSave: TechSheet = {
      id: initialSheet?.id || `ft-${Date.now()}`,
      code: code.trim(),
      hotelId,
      departmentId: initialSheet?.departmentId || `dep-cocina-${hotelId}`,
      departmentName: departmentName.trim(),
      areaKey: initialSheet?.areaKey || 'calientes',
      areaName: areaName.trim(),
      name: name.trim(),
      category,
      categoryLabel: categoryLabel.trim(),
      portionWeight: portionWeight.trim(),
      yieldRations: yieldRations.trim(),
      description: description.trim(),
      photoUrl: photoUrl.trim(),
      ingredients: ingredients.filter(i => i.name.trim().length > 0),
      production: {
        pax100: production100.trim(),
        pax300: production300.trim(),
        pax800: production800.trim()
      },
      elaborationSteps: steps.filter(s => s.trim().length > 0),
      allergens,
      conservationTemp: conservationTemp.trim(),
      serviceTemp: serviceTemp.trim(),
      shelfLife: shelfLife.trim(),
      platingAndPresentation: platingAndPresentation.trim(),
      operationalNotes: operationalNotes.trim(),
      version: initialSheet?.version ? `v${(parseFloat(initialSheet.version.replace('v', '')) + 0.1).toFixed(1)}` : 'v1.0',
      updatedAt: new Date().toISOString(),
      author: authorName,
      status: initialSheet?.status || 'activa'
    };

    onSave(sheetToSave, changesSummary.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#141C24] text-slate-100 rounded-2xl shadow-2xl border border-slate-700 my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-[#18232E] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isNew ? 'Nueva Ficha Técnica Normalizada' : `Editar Ficha: ${name}`}
              </h2>
              <p className="text-xs text-slate-400">
                {hotelName} · Creación y edición documental autorizada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* Fila 1: Código, Nombre y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Código Ficha</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#C5A880] focus:border-[#C5A880] outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre de la Elaboración / Plato</label>
              <input
                type="text"
                required
                placeholder="Ej. Pollo al Limón y Romero"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:border-[#C5A880] outline-none"
              />
            </div>
          </div>

          {/* Fila 2: Categoría, Departamento y Área */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoría</label>
              <select
                value={category}
                onChange={e => {
                  setCategory(e.target.value);
                  const labels: Record<string, string> = {
                    carnes: 'Carnes & Asados',
                    pescados: 'Pescados & Mariscos',
                    arroces: 'Arroces & Paellas',
                    pastas: 'Pastas Frescas',
                    sopas: 'Sopas & Cremas',
                    ensaladas: 'Ensaladas & Crudités',
                    guarniciones: 'Guarniciones',
                    postres: 'Postres & Dulces',
                    desayunos: 'Desayunos & Huevos'
                  };
                  setCategoryLabel(labels[e.target.value] || e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              >
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
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Departamento</label>
              <input
                type="text"
                value={departmentName}
                onChange={e => setDepartmentName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Área / Partida</label>
              <input
                type="text"
                value={areaName}
                onChange={e => setAreaName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Fila 3: Gramajes y Foto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gramaje Ración</label>
              <input
                type="text"
                value={portionWeight}
                onChange={e => setPortionWeight(e.target.value)}
                placeholder="Ej. 220 g o 250 ml"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rendimiento Base</label>
              <input
                type="text"
                value={yieldRations}
                onChange={e => setYieldRations(e.target.value)}
                placeholder="Ej. 1 ración"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">URL Fotografía</label>
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descripción y Concepto</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Breve reseña técnica del plato o preparación..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
            />
          </div>

          {/* Ingredientes Dinámicos */}
          <div className="border border-slate-700 rounded-xl p-3 bg-slate-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#C5A880]" />
                Ingredientes por Ración
              </span>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-[11px] bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40 px-2 py-1 rounded font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Añadir Ingrediente
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nombre ingrediente"
                    value={ing.name}
                    onChange={e => handleUpdateIngredient(idx, 'name', e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={ing.quantity}
                    onChange={e => handleUpdateIngredient(idx, 'quantity', e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-[#C5A880] font-mono font-bold"
                  />
                  <select
                    value={ing.unit}
                    onChange={e => handleUpdateIngredient(idx, 'unit', e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="ud">ud</option>
                    <option value="c/s">c/s</option>
                    <option value="kg">kg</option>
                    <option value="l">l</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Alérgeno si aplica"
                    value={ing.allergen || ''}
                    onChange={e => handleUpdateIngredient(idx, 'allergen', e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pasos de Elaboración Dinámicos */}
          <div className="border border-slate-700 rounded-xl p-3 bg-slate-800/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                Flujo de Elaboración Secuencial (1, 2, 3...)
              </span>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-[11px] bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] border border-[#C5A880]/40 px-2 py-1 rounded font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Añadir Paso
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={st}
                    onChange={e => handleUpdateStep(idx, e.target.value)}
                    placeholder="Describe el paso operativo con verbos en primera persona del plural (Añadimos, Salteamos...)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Alérgenos Selector Checkboxes */}
          <div className="border border-slate-700 rounded-xl p-3 bg-slate-800/30">
            <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Alérgenos Declarables Presentes (UE 1169/2011)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {OFFICIAL_ALLERGENS_LIST.map(alg => {
                const checked = allergens.some(a => a.toLowerCase().includes(alg.key.toLowerCase()) || alg.label.toLowerCase().includes(a.toLowerCase()));
                return (
                  <button
                    type="button"
                    key={alg.key}
                    onClick={() => toggleAllergen(alg.label.split('/')[0].trim())}
                    className={`flex items-center gap-2 p-1.5 rounded border text-xs text-left transition-all ${
                      checked
                        ? 'bg-red-500/20 border-red-500 text-red-200 font-bold'
                        : 'bg-slate-900/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{alg.icon}</span>
                    <span className="truncate">{alg.label.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* APPCC, Temperaturas y Vida Útil */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Temp. Conservación</label>
              <input
                type="text"
                value={conservationTemp}
                onChange={e => setConservationTemp(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Temp. Servicio</label>
              <input
                type="text"
                value={serviceTemp}
                onChange={e => setServiceTemp(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vida Útil</label>
              <input
                type="text"
                value={shelfLife}
                onChange={e => setShelfLife(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Montaje y Observaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Montaje y Presentación</label>
              <textarea
                rows={2}
                value={platingAndPresentation}
                onChange={e => setPlatingAndPresentation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Observaciones Operativas</label>
              <textarea
                rows={2}
                value={operationalNotes}
                onChange={e => setOperationalNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Motivo o Resumen de la Revisión (Historial de Versiones) */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
            <label className="block text-xs font-bold text-[#C5A880] uppercase mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Motivo o Resumen de la Revisión (Historial de Versiones)
            </label>
            <input
              type="text"
              required
              value={changesSummary}
              onChange={e => setChangesSummary(e.target.value)}
              placeholder="Ej. Ajuste de gramajes por ración y actualización de alérgenos"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#b0926a] text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Ficha Técnica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
