import React, { useState } from 'react';
import { Building2, Plus, X } from 'lucide-react';
import { HotelEntity } from '../types/hotelPortal';

interface AddHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHotel: (hotel: HotelEntity) => void;
  initialStars?: number;
}

export const AddHotelModal: React.FC<AddHotelModalProps> = ({
  isOpen,
  onClose,
  onAddHotel,
  initialStars = 4
}) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [location, setLocation] = useState('');
  const [stars, setStars] = useState<number>(initialStars);
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [outletsText, setOutletsText] = useState('Barra Principal, Área de Restauración');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `unit-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const newUnit: HotelEntity = {
      id,
      name,
      shortName: shortName || name,
      location: location || 'Área Operativa F&B',
      stars,
      categoryLabel: 'Unidad Operativa',
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=240&h=240&q=80',
      code: `OP-${id.slice(5, 10).toUpperCase()}`,
      tagline: `Unidad de Operaciones F&B en ${location || 'Centro Operativo'}`,
      status: 'operativo_activo',
      summary: description || `Nueva unidad operativa independiente con catálogo de recetas y control de turnos.`,
      address: location || 'Centro Operativo F&B',
      phone: '+34 900 00 00 00',
      email: `${id}@operations.fnhub-portal.internal`,
      website: `https://${id}.operations.fnhub-portal.internal/`,
      departments: [
        { 
          id: 'food-and-beverage', 
          name: 'F&B', 
          code: 'FB', 
          iconName: 'UtensilsCrossed', 
          description: 'Gestión técnica de barra, cartas y fichas.',
          status: 'activo_piloto',
          leadRole: 'Jefatura F&B',
          modulesCount: 5,
          hasContent: true
        },
        { 
          id: 'cocina', 
          name: 'Cocina & Producción', 
          code: 'COC', 
          iconName: 'ChefHat', 
          description: 'Mise en place de producción y control APPCC.',
          status: 'activo_piloto',
          leadRole: 'Jefe de Cocina',
          modulesCount: 3,
          hasContent: true
        },
        { 
          id: 'rrhh', 
          name: 'Recursos Humanos & Cumplimiento', 
          code: 'RRHH', 
          iconName: 'Users', 
          description: 'Control de acreditaciones sanitarias y plantilla.',
          status: 'activo_piloto',
          leadRole: 'Coordinación RRHH',
          modulesCount: 2,
          hasContent: true
        }
      ]
    };

    onAddHotel(newUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in font-sans text-[#2C3E50]">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E2E8F0] rounded-xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] font-bold">
            <Building2 className="w-4 h-4" />
            <span>Arquitectura Modular · Alta de Unidad Operativa</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#2C3E50] uppercase font-semibold">
            Nombre de la Unidad Operativa / Centro F&B:
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Centro Operativo Norte, Terraza Central F&B..."
            className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#C5A880] font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#2C3E50] uppercase font-semibold">
              Nombre Corto:
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="Ej. Unidad Norte"
              className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#C5A880] font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#2C3E50] uppercase font-semibold">
              Ubicación / Área:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Zona Central, Planta 1..."
              className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#C5A880] font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#2C3E50] uppercase font-semibold">
            Puntos de Servicio / Áreas (separados por coma):
          </label>
          <input
            type="text"
            value={outletsText}
            onChange={(e) => setOutletsText(e.target.value)}
            placeholder="Ej. Barra Principal, Sala, Terraza..."
            className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#C5A880] font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-mono text-[#2C3E50] uppercase font-semibold">
            Descripción Operativa:
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Resumen del enfoque operativo, tipo de servicio y oferta..."
            className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#2C3E50] focus:outline-none focus:border-[#C5A880] font-mono"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#F8F9FA] text-[#2C3E50] text-xs font-mono border border-[#E2E8F0]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors"
          >
            Guardar Unidad Operativa
          </button>
        </div>
      </form>
    </div>
  );
};
