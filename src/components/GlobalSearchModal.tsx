import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Wine, 
  FileText, 
  Clock, 
  Flame, 
  GraduationCap, 
  UtensilsCrossed, 
  FolderArchive,
  Sparkles
} from 'lucide-react';
import { 
  TECHNICAL_SHEETS_DATABASE, 
  DIAMOND_MENUS, 
  DIAMOND_PROMOTIONS, 
  HOTEL_PROCEDURES_DATABASE, 
  DIAMOND_TRAINING_TRACKS,
  INITIAL_DOCUMENT_INTAKE,
  KLAYMAN_HOTELS
} from '../data/hotelPortalData';
import { TechnicalSheet, PromotionEntity, HotelProcedureDoc, TrainingTrack } from '../types/hotelPortal';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEstablishment?: (hotelId: string) => void;
  onSelectCocktail?: (sheet: TechnicalSheet) => void;
  onSelectProcedure?: (proc: HotelProcedureDoc) => void;
  onSelectPromotion?: (promo: PromotionEntity) => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEstablishment,
  onSelectCocktail,
  onSelectProcedure,
  onSelectPromotion,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return {
      cocktails: [],
      menus: [],
      promotions: [],
      procedures: [],
      schedules: [],
      training: [],
      documentation: []
    };

    // 1. Cócteles y Fichas Técnicas (Base de datos + Fichas añadidas)
    const customSheets: TechnicalSheet[] = (() => {
      try {
        const saved = localStorage.getItem('fnb_custom_technical_sheets');
        if (saved) return JSON.parse(saved);
      } catch {}
      return [];
    })();
    const allSheets = [...TECHNICAL_SHEETS_DATABASE, ...customSheets];

    const cocktails = allSheets.filter(sheet => 
      sheet.title.toLowerCase().includes(q) ||
      sheet.code.toLowerCase().includes(q) ||
      (sheet.glassware && sheet.glassware.toLowerCase().includes(q)) ||
      (sheet.ice && sheet.ice.toLowerCase().includes(q)) ||
      (sheet.technique && sheet.technique.toLowerCase().includes(q)) ||
      sheet.ingredients.some(ing => ing.name.toLowerCase().includes(q))
    );

    // 2. Ítems de Cartas
    const menus: { item: any; menuTitle: string; outletName: string }[] = [];
    DIAMOND_MENUS.forEach(menu => {
      menu.sections.forEach(sec => {
        sec.items.forEach(it => {
          if (
            it.name.toLowerCase().includes(q) ||
            it.description.toLowerCase().includes(q) ||
            menu.title.toLowerCase().includes(q)
          ) {
            menus.push({ item: it, menuTitle: menu.title, outletName: menu.outletName });
          }
        });
      });
    });

    // 3. Promociones
    const promotions = DIAMOND_PROMOTIONS.filter(promo =>
      promo.name.toLowerCase().includes(q) ||
      promo.category.toLowerCase().includes(q) ||
      promo.price.toLowerCase().includes(q) ||
      promo.schedule.toLowerCase().includes(q) ||
      (q === 'promociones de hoy' || q === 'hoy') ? promo.status === 'ACTIVA' : false ||
      promo.includedProducts.some(p => p.toLowerCase().includes(q))
    );

    // 4. Procedimientos Operativos (SOPs)
    const procedures = HOTEL_PROCEDURES_DATABASE.filter(proc =>
      proc.title.toLowerCase().includes(q) ||
      proc.code.toLowerCase().includes(q) ||
      (proc.summary && proc.summary.toLowerCase().includes(q)) ||
      proc.steps.some(st => (typeof st === 'string' ? st : `${st.title} ${st.detail}`).toLowerCase().includes(q))
    );

    // 5. Horarios Operativos
    const schedules: { service: string; schedule: string; location: string }[] = [];
    KLAYMAN_HOTELS.forEach(hotel => {
      (hotel.schedules || []).forEach(sch => {
        if (
          sch.service.toLowerCase().includes(q) ||
          sch.schedule.toLowerCase().includes(q) ||
          hotel.name.toLowerCase().includes(q)
        ) {
          schedules.push({ ...sch, location: hotel.name });
        }
      });
    });

    // 6. Formación
    const training = DIAMOND_TRAINING_TRACKS.filter(track =>
      track.title.toLowerCase().includes(q) ||
      track.department.toLowerCase().includes(q) ||
      track.description.toLowerCase().includes(q)
    );

    // 7. Documentación Ingesta
    const documentation = INITIAL_DOCUMENT_INTAKE.filter(doc =>
      doc.title.toLowerCase().includes(q) ||
      doc.notes.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q)
    );

    return {
      cocktails,
      menus,
      promotions,
      procedures,
      schedules,
      training,
      documentation
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResultsCount = 
    results.cocktails.length +
    results.menus.length +
    results.promotions.length +
    results.procedures.length +
    results.schedules.length +
    results.training.length +
    results.documentation.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-4 bg-[#1A2530]/60 backdrop-blur-sm animate-fade-in font-sans text-[#2C3E50]">
      <div className="relative w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#C5A880] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por formulación ('Ron blanco'), receta ('Mojito'), SOP, horario o alérgenos..."
            className="w-full bg-transparent text-[#2C3E50] placeholder:text-[#2C3E50]/40 text-sm sm:text-base font-mono focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-[#2C3E50]/50 hover:text-[#2C3E50] text-xs font-mono"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-[#F8F9FA] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sin Query: Sugerencias Rápidas */}
        {!query && (
          <div className="p-6 space-y-4 text-xs font-mono">
            <span className="text-[#2C3E50]/60 uppercase font-bold block">
              Búsquedas Operativas Frecuentes:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Mojito Clásico',
                'Dry Martini',
                'Espresso Martini',
                'Negroni Clásico',
                'Aperitivo Spritz',
                'SOP Apertura',
                'Control APPCC',
                'Alérgenos UE'
              ].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-xl bg-transparent hover:bg-[#F8F9FA] hover:border-[#C5A880] border border-[#E2E8F0] text-[#2C3E50] transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#C5A880]" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {query && (
          <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-mono text-[#2C3E50]/70 pb-2 border-b border-[#E2E8F0]">
              <span>{totalResultsCount} resultados encontrados para "{query}"</span>
              <span className="text-[#C5A880] font-bold">OPERATIONS HUB · F&B</span>
            </div>

            {totalResultsCount === 0 && (
              <div className="text-center py-12 space-y-3">
                <p className="text-[#2C3E50]/70 text-sm">
                  No se encontraron resultados directos para <span className="text-[#2C3E50] font-mono font-bold">"{query}"</span>.
                </p>
                <p className="text-xs text-[#2C3E50]/50 max-w-md mx-auto">
                  Prueba buscando por formulación ("Mojito", "Negroni"), procedimientos ("Arqueo Z", "APPCC") o alérgenos.
                </p>
              </div>
            )}

            {/* Cócteles & Fichas Técnicas */}
            {results.cocktails.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <Wine className="w-4 h-4" />
                  <span>Fichas Técnicas de Coctelería ({results.cocktails.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.cocktails.map(cocktail => (
                    <div
                      key={cocktail.id}
                      onClick={() => {
                        if (onSelectCocktail) onSelectCocktail(cocktail);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#1A2530] font-bold">{cocktail.code}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-semibold">
                          {cocktail.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#2C3E50] group-hover:text-[#1A2530] transition-colors">
                        {cocktail.title}
                      </h4>
                      <div className="text-[11px] text-[#2C3E50]/70 font-mono space-y-0.5">
                        <p><span className="text-[#2C3E50]/50">Cristalería:</span> {cocktail.glassware}</p>
                        <p><span className="text-[#2C3E50]/50">Técnica:</span> {cocktail.technique}</p>
                        <p><span className="text-[#2C3E50]/50">Garnish:</span> {cocktail.garnish}</p>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-xs font-mono">
                        <span className="text-[#C5A880] font-bold">{cocktail.escandallo?.sellingPrice.toFixed(2)} €</span>
                        <span className="text-[#C5A880] text-[11px] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Ver Ficha Completa →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promociones */}
            {results.promotions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <Flame className="w-4 h-4" />
                  <span>Promociones ({results.promotions.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {results.promotions.map(promo => (
                    <div
                      key={promo.id}
                      onClick={() => {
                        if (onSelectPromotion) onSelectPromotion(promo);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#2C3E50]/70 uppercase font-semibold">
                          {promo.outletName} · {promo.schedule}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 font-semibold">
                          {promo.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#2C3E50] text-base">
                        {promo.name}
                      </h4>
                      <p className="text-xs text-[#C5A880] font-mono font-bold">
                        {promo.price}
                      </p>
                      <div className="text-[11px] text-[#2C3E50]/70">
                        <span className="text-[#2C3E50]/50">Incluye:</span> {promo.includedProducts.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Procedimientos Operativos (SOPs) */}
            {results.procedures.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <FileText className="w-4 h-4" />
                  <span>Procedimientos Operativos / SOPs ({results.procedures.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {results.procedures.map(proc => (
                    <div
                      key={proc.id}
                      onClick={() => {
                        if (onSelectProcedure) onSelectProcedure(proc);
                        onClose();
                      }}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#1A2530] font-bold">{proc.code}</span>
                        <span className="text-[11px] font-mono text-[#2C3E50]/70">{proc.departmentLabel}</span>
                      </div>
                      <h4 className="font-bold text-[#2C3E50]">
                        {proc.title}
                      </h4>
                      <p className="text-xs text-[#2C3E50]/70 leading-relaxed">
                        {proc.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Horarios Operativos */}
            {results.schedules.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#2C3E50] uppercase font-bold">
                  <Clock className="w-4 h-4 text-[#C5A880]" />
                  <span>Horarios Oficiales ({results.schedules.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.schedules.map((sch, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#2C3E50] text-xs block">{sch.service}</span>
                        <span className="text-[11px] text-[#2C3E50]/60 font-mono">{sch.location}</span>
                      </div>
                      <span className="font-mono text-xs text-[#C5A880] font-bold">{sch.schedule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ítems de Cartas */}
            {results.menus.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Ítems en Cartas F&B ({results.menus.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.menus.map(({ item, menuTitle, outletName }, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C3E50] text-xs">{item.name}</span>
                        <span className="font-mono text-xs text-[#C5A880] font-bold">{item.price.toFixed(2)} €</span>
                      </div>
                      <p className="text-[11px] text-[#2C3E50]/70">{item.description}</p>
                      <span className="text-[10px] font-mono text-[#2C3E50]/50 block">{outletName} · {menuTitle}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formación */}
            {results.training.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Módulos de Formación ({results.training.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.training.map(tr => (
                    <div key={tr.id} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2C3E50] text-xs">{tr.title}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                          {tr.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2C3E50]/70">{tr.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documentación */}
            {results.documentation.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880] uppercase font-bold">
                  <FolderArchive className="w-4 h-4" />
                  <span>Documentación Oficial & Trazabilidad ({results.documentation.length})</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {results.documentation.map(doc => (
                    <div key={doc.id} className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#2C3E50] text-xs block">{doc.title}</span>
                        <span className="text-[11px] text-[#2C3E50]/60 font-mono">{doc.suggestedModule}</span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
