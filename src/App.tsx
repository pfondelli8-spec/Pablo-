import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { HotelSelectorView } from './components/HotelSelectorView';
import { DiamondDashboardView } from './components/DiamondDashboardView';
import { OlivinaDashboardView } from './components/OlivinaDashboardView';
import { CorporateView } from './components/CorporateView';
import { AddHotelModal } from './components/AddHotelModal';
import { SetHotelLogoModal } from './components/SetHotelLogoModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CocktailDetailModal } from './components/CocktailDetailModal';
import { PromotionDetailModal } from './components/PromotionDetailModal';
import { HotelEntity, TechnicalSheet, PromotionEntity, HotelProcedureDoc } from './types/hotelPortal';
import { KLAYMAN_HOTELS } from './data/hotelPortalData';
import { FnbOperationsPortal } from './components/FnbOperationsPortal';
import { HostelOpsMasterPortal } from './components/HostelOpsMasterPortal';
import { ProaOperationalPortal } from './components/ProaOperationalPortal';
import { CompanyConfigAdminModal } from './components/CompanyConfigAdminModal';

export default function App() {
  // Estado del Establecimiento Seleccionado: default 'klayman-diamond' para acceso directo al portal operativo
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('klayman_portal_selected_hotel') || 'klayman-diamond';
    } catch {
      return 'klayman-diamond';
    }
  });

  const [opsMode, setOpsMode] = useState<'proa' | 'daily_ops' | 'archive_dashboard'>('proa');
  const [isCompanyAdminOpen, setIsCompanyAdminOpen] = useState(false);

  const [hotelsList, setHotelsList] = useState<HotelEntity[]>(() => {
    try {
      const saved = localStorage.getItem('klayman_portal_hotels_custom');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return KLAYMAN_HOTELS;
  });

  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [addHotelInitialStars, setAddHotelInitialStars] = useState<number>(4);
  const [editingLogoHotel, setEditingLogoHotel] = useState<HotelEntity | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchInitialQuery, setGlobalSearchInitialQuery] = useState('');

  const [activeSearchCocktail, setActiveSearchCocktail] = useState<TechnicalSheet | null>(null);
  const [activeSearchPromotion, setActiveSearchPromotion] = useState<PromotionEntity | null>(null);

  // Denominación y marca de la empresa
  const [companyName, setCompanyName] = useState(() => {
    try {
      const saved = localStorage.getItem('fnb_hub_company_name');
      if (saved && saved !== 'PABLO FONDEN' && saved !== 'PF OPERATIONS') return saved;
      return 'Pablo Fondelli · Hospitality & F&B Operations';
    } catch {
      return 'Pablo Fondelli · Hospitality & F&B Operations';
    }
  });
  const [companySubtitle, setCompanySubtitle] = useState(() => {
    try {
      const saved = localStorage.getItem('fnb_hub_company_subtitle');
      if (saved && saved !== 'Hostelería · Gestión y Producción de Cocina, Bares y Restaurantes') return saved;
      return 'Gestión Operativa de Cocinas, Bares y Restaurantes · Live Buffet Management';
    } catch {
      return 'Gestión Operativa de Cocinas, Bares y Restaurantes · Live Buffet Management';
    }
  });

  // Guardar estado en localStorage
  useEffect(() => {
    try {
      if (selectedHotelId) {
        localStorage.setItem('klayman_portal_selected_hotel', selectedHotelId);
      } else {
        localStorage.removeItem('klayman_portal_selected_hotel');
      }
    } catch {
      // Ignorar errores en sandbox
    }
  }, [selectedHotelId]);

  const handleAddCustomHotel = (newHotel: HotelEntity) => {
    setHotelsList(prev => {
      const updated = [...prev, newHotel];
      try {
        localStorage.setItem('klayman_portal_hotels_custom', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSelectedHotelId(newHotel.id);
  };

  const handleSaveHotelLogo = (hotelId: string, logoUrl: string, categoryLabel?: string, stars?: number) => {
    setHotelsList(prev => {
      const updated = prev.map(h => {
        if (h.id === hotelId) {
          return {
            ...h,
            logoUrl,
            categoryLabel: categoryLabel || h.categoryLabel,
            stars: stars ?? h.stars
          };
        }
        return h;
      });
      try {
        localStorage.setItem('klayman_portal_hotels_custom', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleOpenGlobalSearchWithQuery = (query: string) => {
    setGlobalSearchInitialQuery(query);
    setIsGlobalSearchOpen(true);
  };

  // 1. MODO PROA: GESTIÓN OPERATIVA DEL HOTEL (JERARQUÍA PROA → HOTEL → DEPARTAMENTO → ÁREA)
  if (opsMode === 'proa') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-500/20 selection:text-slate-900">
        <ProaOperationalPortal
          onOpenGlobalSearch={() => {
            setGlobalSearchInitialQuery('');
            setIsGlobalSearchOpen(true);
          }}
          onOpenAdminConfig={() => setIsCompanyAdminOpen(true)}
        />

        {/* Modal de Administración Central */}
        {isCompanyAdminOpen && (
          <CompanyConfigAdminModal
            isOpen={isCompanyAdminOpen}
            onClose={() => setIsCompanyAdminOpen(false)}
            onConfigChanged={() => {}}
          />
        )}

        {/* Modal de Búsqueda Global */}
        {isGlobalSearchOpen && (
          <GlobalSearchModal
            isOpen={isGlobalSearchOpen}
            onClose={() => setIsGlobalSearchOpen(false)}
            initialQuery={globalSearchInitialQuery}
            onSelectCocktail={(sheet) => {
              setActiveSearchCocktail(sheet);
              setIsGlobalSearchOpen(false);
            }}
            onSelectPromotion={(promo) => {
              setActiveSearchPromotion(promo);
              setIsGlobalSearchOpen(false);
            }}
          />
        )}

        {/* Modal Detalle Cóctel */}
        {activeSearchCocktail && (
          <CocktailDetailModal
            cocktail={activeSearchCocktail}
            isOpen={!!activeSearchCocktail}
            onClose={() => setActiveSearchCocktail(null)}
          />
        )}
      </div>
    );
  }

  // 2. MODO MAESTRO: HOSTELOPS PLATAFORMA INTEGRAL (MOBILE-FIRST & MULTIEMPRESA)
  if (opsMode === 'daily_ops') {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1A2530]">
        <HostelOpsMasterPortal
          onOpenGlobalSearch={() => {
            setGlobalSearchInitialQuery('');
            setIsGlobalSearchOpen(true);
          }}
        />

        {/* Modal de Búsqueda Global */}
        {isGlobalSearchOpen && (
          <GlobalSearchModal
            isOpen={isGlobalSearchOpen}
            onClose={() => setIsGlobalSearchOpen(false)}
            initialQuery={globalSearchInitialQuery}
            onSelectCocktail={(sheet) => {
              setActiveSearchCocktail(sheet);
              setIsGlobalSearchOpen(false);
            }}
            onSelectPromotion={(promo) => {
              setActiveSearchPromotion(promo);
              setIsGlobalSearchOpen(false);
            }}
          />
        )}

        {/* Modal Detalle Cóctel */}
        {activeSearchCocktail && (
          <CocktailDetailModal
            cocktail={activeSearchCocktail}
            isOpen={!!activeSearchCocktail}
            onClose={() => setActiveSearchCocktail(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-[#1A2530]">
      {/* Barra de Navegación Contractual para OPERATIONS HUB */}
      <TopNav
        selectedHotelId={selectedHotelId}
        hotelsList={hotelsList}
        companyName={companyName}
        companySubtitle={companySubtitle}
        onSelectHotel={(hotelId) => setSelectedHotelId(hotelId)}
        onSelectCorporate={() => setSelectedHotelId('corporate')}
        onOpenGlobalSearch={() => {
          setGlobalSearchInitialQuery('');
          setIsGlobalSearchOpen(true);
        }}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 1. PANTALLA PRINCIPAL: SELECCIÓN DE UNIDAD OPERATIVA */}
        {selectedHotelId === null && (
          <HotelSelectorView
            hotels={hotelsList}
            onSelectHotel={(hotelId) => setSelectedHotelId(hotelId)}
            onOpenCorporate={() => setSelectedHotelId('corporate')}
            onOpenAddHotel={(stars = 4) => {
              setAddHotelInitialStars(stars);
              setIsAddHotelOpen(true);
            }}
            onOpenSetLogo={(hotel) => setEditingLogoHotel(hotel)}
            onOpenGlobalSearchWithQuery={handleOpenGlobalSearchWithQuery}
          />
        )}

        {/* 2. ENTORNO OPERATIVO: UNIDAD OPERATIVA PRINCIPAL (F&B / CENTRAL) */}
        {selectedHotelId === 'klayman-diamond' && (
          opsMode === 'daily_ops' ? (
            <div className="space-y-4">
              <div className="flex justify-end px-1">
                <button
                  onClick={() => setOpsMode('archive_dashboard')}
                  className="text-xs text-gray-500 hover:text-[#1A2530] font-semibold flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-xs"
                >
                  <span>Ver Gestión Documental Completa & Escandallos</span>
                  <span className="text-[#C5A880]">→</span>
                </button>
              </div>
              <FnbOperationsPortal
                hotelName="Hotel Diamond · F&B Principal"
                hotelId="klayman-diamond"
                onOpenGlobalSearch={() => {
                  setGlobalSearchInitialQuery('');
                  setIsGlobalSearchOpen(true);
                }}
                onSwitchHotel={() => setSelectedHotelId(null)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-start px-1">
                <button
                  onClick={() => setOpsMode('daily_ops')}
                  className="text-xs font-bold flex items-center gap-1.5 transition-colors bg-[#C5A880] text-[#1A2530] px-3.5 py-1.5 rounded-lg shadow-xs"
                >
                  ← Volver al Portal Operativo Diario (F&B Mobile)
                </button>
              </div>
              <DiamondDashboardView
                onBackToSelector={() => setSelectedHotelId(null)}
                onNavigateToCorporate={() => setSelectedHotelId('corporate')}
                onSwitchToOlivina={() => setSelectedHotelId('klayman-olivina')}
                onOpenGlobalSearchWithQuery={handleOpenGlobalSearchWithQuery}
              />
            </div>
          )
        )}

        {/* 3. ENTORNO OPERATIVO: UNIDAD OPERATIVA 2 (PUNTO DE VENTA SATÉLITE) */}
        {selectedHotelId === 'klayman-olivina' && (
          opsMode === 'daily_ops' ? (
            <div className="space-y-4">
              <div className="flex justify-end px-1">
                <button
                  onClick={() => setOpsMode('archive_dashboard')}
                  className="text-xs text-gray-500 hover:text-[#1A2530] font-semibold flex items-center gap-1.5 transition-colors bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-xs"
                >
                  <span>Ver Gestión Satélite Clásica</span>
                  <span className="text-[#C5A880]">→</span>
                </button>
              </div>
              <FnbOperationsPortal
                hotelName="Hotel Olivina · F&B Satélite"
                hotelId="klayman-olivina"
                onOpenGlobalSearch={() => {
                  setGlobalSearchInitialQuery('');
                  setIsGlobalSearchOpen(true);
                }}
                onSwitchHotel={() => setSelectedHotelId(null)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-start px-1">
                <button
                  onClick={() => setOpsMode('daily_ops')}
                  className="text-xs font-bold flex items-center gap-1.5 transition-colors bg-[#C5A880] text-[#1A2530] px-3.5 py-1.5 rounded-lg shadow-xs"
                >
                  ← Volver al Portal Operativo Diario (F&B Mobile)
                </button>
              </div>
              <OlivinaDashboardView
                onBackToSelector={() => setSelectedHotelId(null)}
                onNavigateToCorporate={() => setSelectedHotelId('corporate')}
                onSwitchToDiamond={() => setSelectedHotelId('klayman-diamond')}
              />
            </div>
          )
        )}

        {/* 4. CAPA TRANSVERSAL: DIRECCIÓN CENTRAL & ESTÁNDARES */}
        {selectedHotelId === 'corporate' && (
          <CorporateView
            onBackToSelector={() => setSelectedHotelId(null)}
            onReturnToHotel={(hotelId) => setSelectedHotelId(hotelId)}
          />
        )}

        {/* OTROS ESTABLECIMIENTOS AÑADIDOS DINÁMICAMENTE */}
        {selectedHotelId !== null && 
         selectedHotelId !== 'klayman-diamond' && 
         selectedHotelId !== 'klayman-olivina' && 
         selectedHotelId !== 'corporate' && (
          <FnbOperationsPortal
            hotelName={hotelsList.find(h => h.id === selectedHotelId)?.name || 'Unidad Operativa'}
            hotelId={selectedHotelId}
            onOpenGlobalSearch={() => {
              setGlobalSearchInitialQuery('');
              setIsGlobalSearchOpen(true);
            }}
            onSwitchHotel={() => setSelectedHotelId(null)}
          />
        )}
      </main>

      {/* Footer Operativo Centrado en OPERATIONS HUB */}
      <footer className="border-t border-[#E2E8F0] bg-white py-8 text-xs text-[#2C3E50]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-[#1A2530]">
              OPERATIONS HUB · F&B
            </div>
            <div className="text-[11px] text-[#2C3E50]/80">
              “Estandarización técnica de recetas, manuales operativos y control de calidad.”
            </div>
            <div className="text-[10px] text-[#2C3E50]/60">
              Plataforma digital para dirección de operaciones, fichas técnicas TPV y cumplimiento normativo.
            </div>
          </div>
          <div className="text-[#2C3E50]/70 font-mono text-[11px]">
            Dirección de Operaciones F&B · Sistema Oficial
          </div>
        </div>
      </footer>

      {/* Modal: Buscador Global Multifuncional */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        initialQuery={globalSearchInitialQuery}
        onSelectCocktail={(sheet) => {
          setActiveSearchCocktail(sheet);
        }}
        onSelectPromotion={(promo) => {
          setActiveSearchPromotion(promo);
        }}
      />

      {/* Modal: Vista de Cóctel desde Buscador Global */}
      <CocktailDetailModal
        sheet={activeSearchCocktail}
        onClose={() => setActiveSearchCocktail(null)}
      />

      {/* Modal: Vista de Promoción desde Buscador Global */}
      <PromotionDetailModal
        promotion={activeSearchPromotion}
        onClose={() => setActiveSearchPromotion(null)}
      />

      {/* Modal: Panel de Administración Central (Personalización de Empresa & Roles) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onOpenAddHotel={() => setIsAddHotelOpen(true)}
        onUpdateCompany={(name, subtitle) => {
          setCompanyName(name);
          setCompanySubtitle(subtitle);
        }}
      />

      {/* Modal: Añadir Establecimiento (Escalabilidad) */}
      <AddHotelModal
        isOpen={isAddHotelOpen}
        onClose={() => setIsAddHotelOpen(false)}
        onAddHotel={handleAddCustomHotel}
        initialStars={addHotelInitialStars}
      />

      {/* Modal: Poner / Cambiar Logo del Hotel & Categoría */}
      <SetHotelLogoModal
        isOpen={!!editingLogoHotel}
        onClose={() => setEditingLogoHotel(null)}
        hotel={editingLogoHotel}
        onSaveLogo={handleSaveHotelLogo}
      />
    </div>
  );
}
