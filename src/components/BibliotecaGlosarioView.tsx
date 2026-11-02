import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  FileText, 
  Filter, 
  Layers, 
  Library, 
  Search, 
  Sparkles, 
  X 
} from 'lucide-react';
import { GlossaryTerm } from '../types/clima';

interface BibliotecaGlosarioViewProps {
  terms: GlossaryTerm[];
}

export const BibliotecaGlosarioView: React.FC<BibliotecaGlosarioViewProps> = ({
  terms
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeGuideModal, setActiveGuideModal] = useState<string | null>(null);

  const filteredTerms = terms.filter(t => {
    if (selectedCategory !== 'todos' && t.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.contextExample.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Biblioteca Científica & Terminología</span>
          <span aria-hidden="true">·</span>
          <span>Grupo Clima</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
          Glosario & Documentación Bioclimática
        </h1>
        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Un repositorio abierto de definiciones científicas, guías metodológicas y fuentes documentales de referencia (IPCC, FAO, EAT-Lancet) para fundamentar cualquier programa formativo o divulgativo.
        </p>
      </section>

      {/* Guías Prácticas Descargables */}
      <section className="space-y-4">
        <div className="text-xs font-mono text-stone-400">
          Protocolos Formativos & Guías Descargables:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-700/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <FileText className="w-4 h-4" />
                <span>Protocolo de Aula · PDF Interactivo</span>
              </div>
              <h3 className="font-display text-lg font-bold text-stone-100">
                Guía de Alimentación Bioclimática de la Tierra a la Mesa
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Compendio de 12 páginas con tablas de estacionalidad por climas, pautas de reducción de huella hídrica y sustitución de proteínas según el modelo EAT-Lancet.
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500">Versión 2.4 · 2026</span>
              <button
                onClick={() => setActiveGuideModal('guia-bioclimatica')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Abrir Guía</span>
              </button>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-700/60 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                <FileText className="w-4 h-4" />
                <span>Manual Técnico · PDF Interactivo</span>
              </div>
              <h3 className="font-display text-lg font-bold text-stone-100">
                Manual de Conservación Ancestral Cero Desperdicio
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Técnicas sin electricidad: lactofermentación en salmuera marina, deshidratación solar pasiva, secado de granos en era y envasado en aceite virgen extra.
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500">Versión 1.8 · 2026</span>
              <button
                onClick={() => setActiveGuideModal('manual-conservacion')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Abrir Manual</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Glosario de Términos */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-500 mb-0.5">Terminología Validada</div>
            <h2 className="font-display text-2xl font-bold text-stone-100">
              Glosario del Grupo Clima
            </h2>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['todos', 'Climatología', 'Agroecología', 'Nutrición', 'Sostenibilidad'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat === 'todos' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar término (ej. RFA, Fotosíntesis C4, Huella Verde, EAT-Lancet)..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Lista de Conceptos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map(term => (
            <div
              key={term.id}
              className="bg-stone-900/40 border border-stone-800 p-5 rounded-2xl space-y-2 hover:border-stone-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-mono text-[11px]">
                  {term.category}
                </span>
              </div>

              <h4 className="font-display text-lg font-bold text-stone-100">
                {term.term}
              </h4>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                {term.definition}
              </p>

              <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 italic">
                <strong>Contexto en la vida:</strong> {term.contextExample}
              </div>
            </div>
          ))}

          {filteredTerms.length === 0 && (
            <div className="col-span-full text-center py-8 text-stone-500 text-xs">
              No se han encontrado términos que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </section>

      {/* Fuentes y Bibliografía Científica */}
      <section className="bg-stone-900/30 border border-stone-800 p-6 sm:p-8 rounded-2xl space-y-4">
        <h3 className="font-display text-lg font-bold text-stone-100">
          Fuentes Científicas y Organismos de Referencia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-400">
          <div className="space-y-1 border-l border-stone-800 pl-3">
            <strong className="text-stone-200 block">IPCC AR6 WGII (2023)</strong>
            <span>Impactos, adaptación y vulnerabilidad de los sistemas de producción de alimentos.</span>
          </div>
          <div className="space-y-1 border-l border-stone-800 pl-3">
            <strong className="text-stone-200 block">EAT-Lancet Commission 2.0</strong>
            <span>Dieta de salud planetaria y límites biofísicos de la producción agroalimentaria.</span>
          </div>
          <div className="space-y-1 border-l border-stone-800 pl-3">
            <strong className="text-stone-200 block">FAO (SOLAW 2024)</strong>
            <span>El estado de los recursos de tierras y aguas del mundo para la alimentación.</span>
          </div>
          <div className="space-y-1 border-l border-stone-800 pl-3">
            <strong className="text-stone-200 block">Water Footprint Network</strong>
            <span>Metodología estándar para el cálculo de agua verde, azul y gris (Hoekstra et al.).</span>
          </div>
        </div>
      </section>

      {/* Modal Visor de Guía */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-100">
            <div className="flex items-start justify-between border-b border-stone-800 pb-4">
              <div>
                <div className="text-xs font-mono text-emerald-400">Grupo Clima · Cuaderno Formativo</div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                  {activeGuideModal === 'guia-bioclimatica'
                    ? 'Guía de Alimentación Bioclimática'
                    : 'Manual de Conservación Ancestral'}
                </h3>
              </div>
              <button
                onClick={() => setActiveGuideModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeGuideModal === 'guia-bioclimatica' ? (
                <>
                  <p>
                    <strong>1. Selección por Bioma:</strong> Prioriza alimentos procedentes de cuencas climáticas semejantes a la tuya. En el clima mediterráneo, las legumbres de secano y el olivo representan la mayor densidad nutricional con mínima demanda de agua fósil.
                  </p>
                  <p>
                    <strong>2. Regla del 70% de Granja:</strong> Más de dos tercios del impacto ambiental de un plato ocurre en la fase agraria. Comer local pero procedente de invernadero calefactado con gas o de ganadería estabulada genera mucho más impacto que comer legumbres de secano cultivadas al aire libre.
                  </p>
                  <p>
                    <strong>3. Sincronización Estacional:</strong> Las hortalizas de invierno concentran glucosinolatos y azúcares simples protectores; las frutas de verano concentran licopeno y agua viva para amortiguar el calor.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Lactofermentación en Salmuera (2.5%):</strong> Para coles, zanahorias y rábanos. Las bacterias del ácido láctico acidifican el medio a pH &lt; 4.0, protegiendo las vitaminas durante más de 6 meses a temperatura ambiente.
                  </p>
                  <p>
                    <strong>2. Deshidratación Solar Pasiva:</strong> Higos, tomates y uvas expuestos en bastidores de malla transpirable al sol estival directo pierden el 80% del agua libre sin alterar los polifenoles ni los minerales.
                  </p>
                  <p>
                    <strong>3. Conservación en Aceite Virgen Extra:</strong> El AOVE crea una barrera anaeróbica total contra el oxígeno mientras transfiere sus polifenoles liposolubles a las hortalizas sumergidas.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-500">Material de libre difusión educativa</span>
              <button
                onClick={() => setActiveGuideModal(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
