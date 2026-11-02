import React from 'react';
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Calendar, 
  Calculator, 
  ClipboardList, 
  Compass, 
  ConciergeBell, 
  Droplets, 
  Flame, 
  Globe2, 
  Hotel, 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  UtensilsCrossed, 
  Wind 
} from 'lucide-react';
import { CourseModule, FoodItem } from '../types/clima';

interface HomeViewProps {
  onNavigateTab: (tab: 'operations' | 'barsol' | 'academy' | 'atlas' | 'calculator' | 'calendar' | 'glossary') => void;
  onOpenModule: (moduleId: string) => void;
  modules: CourseModule[];
  featuredFoods: FoodItem[];
  completedCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenModule,
  modules,
  featuredFoods,
  completedCount,
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Principal Editorial */}
      <section className="relative overflow-hidden rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900/90 via-stone-900/50 to-stone-950 p-6 sm:p-12 lg:p-16">
        {/* Gráfico de fondo estilizado con SVG geométrico solar y vegetal */}
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-emerald-950/20 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-6 opacity-10 pointer-events-none hidden md:block">
          <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-emerald-300">
            <circle cx="50" cy="50" r="45" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" strokeWidth="0.8" />
            <path d="M50 5 L50 95 M5 50 L95 50" strokeWidth="0.5" />
            <path d="M18 18 L82 82 M18 82 L82 18" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>OPERATIONS HUB</span>
            <span aria-hidden="true">·</span>
            <span>Dirección de Operaciones & F&B</span>
            <span aria-hidden="true">·</span>
            <span>Manual Operativo</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.12] text-balance">
            La Tierra, el Clima y el Alimento: El Vínculo que Sostiene la Vida
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-2xl">
            Un portal abierto para comprender cómo la radiación solar, el régimen de lluvias y las zonas bioclimáticas modulan la densidad biológica de lo que comemos, regenerando el suelo y garantizando la soberanía de la vida.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigateTab('operations')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Procedimientos Operativos & Fichas</span>
            </button>
            <button
              onClick={() => onNavigateTab('barsol')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm shadow-amber-950"
            >
              <Sun className="w-4 h-4" />
              <span>Carta Oficial Bar Sol (Azotea)</span>
            </button>
            <button
              onClick={() => onNavigateTab('academy')}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Campus de Formación</span>
            </button>
          </div>

          {/* Microindicadores contextuales sin adornos superfluos */}
          <div className="pt-6 border-t border-stone-800/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-stone-400">Estación Solar</div>
              <div className="font-semibold text-stone-200 mt-0.5">Equinoccio de Otoño</div>
            </div>
            <div>
              <div className="text-stone-400">Despensa Activa</div>
              <div className="font-semibold text-stone-200 mt-0.5">Granada, Mijo & Secano</div>
            </div>
            <div>
              <div className="text-stone-400">Límite Planetario</div>
              <div className="font-semibold text-emerald-400 mt-0.5">&le; 2.1 kg CO₂e / día</div>
            </div>
            <div>
              <div className="text-stone-400">Progreso Formativo</div>
              <div className="font-semibold text-stone-200 font-mono mt-0.5">
                {completedCount} de {modules.length} módulos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Las 3 Grandes Dimensiones de Grupo Clima */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-emerald-500 mb-1">01. Estructura Didáctica</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-100">
            Aulas del Conocimiento Bioclimático
          </h2>
          <p className="text-sm text-stone-400 max-w-2xl mt-1">
            Diseñadas tanto para educadores y nutricionistas como para agricultores y ciudadanos que desean alinear su alimentación con los ciclos termodinámicos de la biosfera.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onNavigateTab('academy')}
            className="group cursor-pointer rounded-xl border border-stone-800 bg-stone-900/60 p-6 hover:border-emerald-600/60 hover:bg-stone-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
                Campus de Formación Modular
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                5 módulos académicos con rigor científico sobre climatología, fijación biológica de nutrientes, análisis de ciclo de vida (ACV) y certificación con diploma acreditativo.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Ingresar al temario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('atlas')}
            className="group cursor-pointer rounded-xl border border-stone-800 bg-stone-900/60 p-6 hover:border-emerald-600/60 hover:bg-stone-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                Atlas Bioclimático de Alimentos
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Fichas analíticas con métricas verificadas de huella de carbono (kg CO₂e), agua verde vs. azul, densidad de fitoquímicos y métodos de conservación ancestral.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Explorar el atlas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigateTab('calendar')}
            className="group cursor-pointer rounded-xl border border-stone-800 bg-stone-900/60 p-6 hover:border-emerald-600/60 hover:bg-stone-900/90 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-stone-100 group-hover:text-sky-300 transition-colors">
                Rueda Fenológica de las 4 Estaciones
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Calendario dinámico mes a mes con el estado del suelo, la insolación fotosintética incidente y las necesidades metabólicas humanas en cada época del año.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Consultar meses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Módulo Operativo de Hoteles */}
      <section className="rounded-2xl border border-emerald-800/60 bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-stone-950 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-700/60 text-xs font-mono text-emerald-300">
              <Hotel className="w-3.5 h-3.5" />
              <span>OPERACIONES · DIRECCIÓN OPERATIVA & F&B</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-stone-100">
              Procedimientos Operativos & Fichas Técnicas Estandarizadas
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Manuales de trabajo estandarizados (SOP) y fichas técnicas para el personal de Sala / Barra, Cocina / Servicio (APPCC y alérgenos), Higiene y Control de Cierre en todas las unidades operativas.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('operations')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-950 whitespace-nowrap self-start lg:self-center"
          >
            <span>Acceder a Procedimientos Operativos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          <div 
            onClick={() => onNavigateTab('operations')}
            className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-emerald-700/80 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold mb-1">
              <ConciergeBell className="w-4 h-4" />
              <span>Recepción & Front Desk</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Atención al cliente, control de aforo, registro de peticiones y flujo de servicio.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('barsol')}
            className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 hover:border-amber-500 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2 text-amber-400 font-mono font-semibold mb-1">
              <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Bar Satélite · Servicio F&B</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              Carta estandarizada de comidas, desayunos, café de especialidad, coctelería y alérgenos UE.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('operations')}
            className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-emerald-700/80 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-amber-300 font-mono font-semibold mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Cocina & APPCC</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Control de temperaturas y conservación, alérgenos obligatorios y desinfección higiénica.
            </p>
          </div>

          <div 
            onClick={() => onNavigateTab('operations')}
            className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-emerald-700/80 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-teal-400 font-mono font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Pisos & Kitchenettes</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Limpieza 5 días/sem, microondas, cafetera, hervidor y sanitizado según normativa canaria.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Manifiesto: Los 4 Principios de la Alimentación Bioclimática */}
      <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6 sm:p-10 space-y-8">
        <div>
          <div className="text-xs font-mono text-emerald-500 mb-1">02. Fundamentos Éticos & Científicos</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-100">
            El Decálogo del Grupo Clima
          </h2>
          <p className="text-sm text-stone-400 max-w-2xl mt-1">
            Cuatro leyes biológicas irreductibles para reconectar el apetito humano con la supervivencia del sistema Tierra.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 border-l-2 border-emerald-600 pl-4">
            <div className="text-xs font-mono text-stone-400">Principio I · Termodinámica</div>
            <h4 className="font-display text-base font-semibold text-stone-100">
              Fotosíntesis directa sobre conversión trófica
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Consumir la energía solar convertida directamente en biomasa vegetal (legumbres, granos, hortalizas) es 10 veces más eficiente que pasarla por intermediarios animales de engorde industrial que consumen grano de importación.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-sky-600 pl-4">
            <div className="text-xs font-mono text-stone-400">Principio II · Hidrología</div>
            <h4 className="font-display text-base font-semibold text-stone-100">
              Soberanía de Agua Verde
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Priorizar cultivos de secano y regadío deficitario adaptados a la pluviometría de la cuenca protege los acuíferos subterráneos de la sobreexplotación y la salinización irreversible.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-amber-600 pl-4">
            <div className="text-xs font-mono text-stone-400">Principio III · Pedología</div>
            <h4 className="font-display text-base font-semibold text-stone-100">
              Suelo vivo como sumidero activo de carbono
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Un suelo con cubierta vegetal viva y sin pesticidas aloja miles de millones de hongos micorrícicos que fijan carbono atmosférico y transfieren minerales biodisponibles al alimento.
            </p>
          </div>

          <div className="space-y-2 border-l-2 border-rose-600 pl-4">
            <div className="text-xs font-mono text-stone-400">Principio IV · Cronobiología</div>
            <h4 className="font-display text-base font-semibold text-stone-100">
              Sincronía metabólica con la estación
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Comer lo que el clima produce en cada estación no es una moda romántica: es una correspondencia biológica entre el estrés térmico ambiental y los antioxidantes que el organismo necesita.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Módulo Formativo Recomendado del Mes */}
      <section className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-500 mb-1">03. Formación en Curso</div>
            <h2 className="font-display text-2xl font-bold text-stone-100">
              Módulos Académicos Destacados
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('academy')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver los 5 cursos completos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.slice(0, 2).map((mod) => (
            <div
              key={mod.id}
              className="rounded-xl border border-stone-800 bg-stone-900/50 p-6 flex flex-col justify-between hover:border-stone-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-mono text-emerald-400">{mod.code}</span>
                  <div className="flex items-center gap-2">
                    <span>Nivel {mod.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{mod.estimatedHours} horas lectivas</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold text-stone-100 leading-snug">
                  {mod.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  {mod.description}
                </p>

                <div className="text-xs text-stone-300 pt-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acreditación: <strong>{mod.badgeName}</strong></span>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-stone-800/80 mt-6">
                <span className="text-xs text-stone-400">
                  {mod.lessons.length} lecciones magistrales + autoevaluación
                </span>
                <button
                  onClick={() => onOpenModule(mod.id)}
                  className="px-4 py-2 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Abrir Módulo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Alimentos del Clima Actual (Fichas Destacadas) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-500 mb-1">04. Despensa Viva</div>
            <h2 className="font-display text-2xl font-bold text-stone-100">
              Especies Bioclimáticas Esenciales
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Baja huella de carbono, alta densidad fitoquímica y resiliencia a la sequía.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('atlas')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFoods.slice(0, 3).map((food) => (
            <div
              key={food.id}
              className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-4 hover:border-stone-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="text-emerald-400">{food.categoryLabel}</span>
                  <span className="font-mono">{food.climateZoneLabel}</span>
                </div>

                <h4 className="font-display text-lg font-bold text-stone-100">
                  {food.name}
                </h4>
                <div className="text-xs italic text-stone-400 font-serif">
                  {food.scientificName}
                </div>

                <p className="text-xs text-stone-400 line-clamp-2">
                  {food.climateBenefit}
                </p>

                <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Huella CO₂e</span>
                    <span className="text-stone-200 font-semibold">{food.carbonFootprintKgCO2e} kg/kg</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Huella Hídrica</span>
                    <span className="text-stone-200 font-semibold">{food.waterFootprintLiters} L/kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                <span className="text-stone-400">Densidad Vital:</span>
                <span className="font-mono font-bold text-emerald-400">{food.nutrientDensityScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
