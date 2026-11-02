import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  FileCheck, 
  Filter, 
  GraduationCap, 
  PlayCircle, 
  Sparkles 
} from 'lucide-react';
import { CourseModule, CertificationRecord } from '../types/clima';

interface AcademyViewProps {
  modules: CourseModule[];
  completedModuleIds: string[];
  certifications: Record<string, CertificationRecord>;
  onOpenLesson: (module: CourseModule) => void;
  onOpenQuiz: (module: CourseModule) => void;
  onViewCertificate: (cert: CertificationRecord) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  modules,
  completedModuleIds,
  certifications,
  onOpenLesson,
  onOpenQuiz,
  onViewCertificate
}) => {
  const [levelFilter, setLevelFilter] = useState<'Todos' | 'Introductorio' | 'Intermedio' | 'Avanzado'>('Todos');

  const filteredModules = modules.filter(m => {
    if (levelFilter === 'Todos') return true;
    return m.level === levelFilter;
  });

  const totalHours = modules.reduce((acc, m) => acc + m.estimatedHours, 0);

  return (
    <div className="space-y-10 pb-16">
      {/* Header del Campus */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span>Campus Pedagógico</span>
          <span aria-hidden="true">·</span>
          <span>Acreditación en Climatología y Alimentación</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
              Aulas Formativas del Grupo Clima
            </h1>
            <p className="text-sm sm:text-base text-stone-300 font-normal leading-relaxed">
              Itinerario estructurado para profesionales, divulgadores y ciudadanía. Cada módulo cuenta con fundamentación científica rigurosa, casos de aplicación práctica y prueba de evaluación con diploma digital verificable.
            </p>
          </div>

          {/* Estadísticas de aprovechamiento */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl text-center">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Completados</div>
              <div className="font-display text-2xl font-bold text-emerald-400 font-mono">
                {completedModuleIds.length}/{modules.length}
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl text-center">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">Carga Lectiva</div>
              <div className="font-display text-2xl font-bold text-stone-200 font-mono">
                {totalHours}h
              </div>
            </div>
          </div>
        </div>

        {/* Filtros de nivel */}
        <div className="pt-4 flex items-center gap-2 overflow-x-auto border-b border-stone-800 pb-3">
          <span className="text-xs text-stone-500 flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Nivel:
          </span>
          {(['Todos', 'Introductorio', 'Intermedio', 'Avanzado'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                levelFilter === lvl
                  ? 'bg-stone-100 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 hover:bg-stone-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de Módulos */}
      <div className="space-y-6">
        {filteredModules.map((module) => {
          const isDone = completedModuleIds.includes(module.id);
          const cert = certifications[module.id];

          return (
            <div
              key={module.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDone
                  ? 'bg-stone-900/70 border-emerald-800/60'
                  : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Cabecera del módulo */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                        {module.code}
                      </span>
                      <span className="text-stone-400">Nivel {module.level}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span className="text-stone-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-500" /> {module.estimatedHours} horas
                      </span>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-100">
                      {module.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-400 font-medium italic">
                      {module.subtitle}
                    </p>
                  </div>

                  {isDone && (
                    <div className="shrink-0 flex items-center gap-2 bg-emerald-950/60 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-emerald-300 text-xs font-semibold">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Completado & Acreditado</span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {module.description}
                </p>

                {/* Desglose de Lecciones */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono text-stone-400">
                    Plan de Estudios ({module.lessons.length} lecciones):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="bg-stone-950/70 border border-stone-800/80 p-3.5 rounded-xl flex items-start gap-3 text-xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <div className="font-semibold text-stone-200">
                            {lesson.title}
                          </div>
                          <div className="text-stone-400 text-[11px] line-clamp-1">
                            {lesson.readingSnippet}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barra de acción del módulo */}
                <div className="pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <span>Insignia: <strong>{module.badgeName}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isDone && cert && (
                      <button
                        onClick={() => onViewCertificate(cert)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/70 rounded-lg hover:bg-emerald-900/60 transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ver Diploma ({cert.scorePercentage}%)</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenLesson(module)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isDone ? 'Repasar Lecciones' : 'Comenzar Lecciones'}</span>
                    </button>

                    <button
                      onClick={() => onOpenQuiz(module)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Repetir Test' : 'Test de Acreditación'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
