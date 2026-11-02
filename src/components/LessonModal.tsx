import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Lightbulb, X, ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { CourseModule, LessonContent } from '../types/clima';

interface LessonModalProps {
  module: CourseModule | null;
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (module: CourseModule) => void;
  isCompleted: boolean;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  module,
  isOpen,
  onClose,
  onStartQuiz,
  isCompleted
}) => {
  if (!isOpen || !module) return null;

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const lesson: LessonContent = module.lessons[currentLessonIndex] || module.lessons[0];

  const handleNext = () => {
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // Direct to quiz
      onStartQuiz(module);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header del Aula */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>{module.code}</span>
              <span aria-hidden="true">·</span>
              <span>Lección {currentLessonIndex + 1} de {module.lessons.length}</span>
              {isCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Acreditado
                  </span>
                </>
              )}
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-stone-100 mt-0.5">
              {module.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector rápido de lecciones */}
        <div className="px-6 py-2.5 bg-stone-900/90 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          {module.lessons.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => setCurrentLessonIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                idx === currentLessonIndex
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <span>{idx + 1}.</span>
              <span className="truncate max-w-[180px]">{l.title}</span>
            </button>
          ))}
          <button
            onClick={() => onStartQuiz(module)}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-700/50 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Test de Autoevaluación</span>
          </button>
        </div>

        {/* Contenido de la Lección */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Tiempo estimado de lectura: {lesson.durationMinutes} minutos</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-stone-100">
              {lesson.title}
            </h3>
            <p className="text-sm italic text-stone-300 border-l-2 border-emerald-600 pl-3 py-1">
              "{lesson.readingSnippet}"
            </p>
          </div>

          {/* Secciones de la lección */}
          <div className="space-y-6 text-sm text-stone-300 leading-relaxed font-sans">
            {lesson.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-display text-base font-semibold text-stone-100">
                  {sec.heading}
                </h4>
                <p className="text-stone-300">
                  {sec.body}
                </p>
                {sec.keyTakeaway && (
                  <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-lg text-xs text-emerald-300">
                    <strong>Conclusión Clave:</strong> {sec.keyTakeaway}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consejo Práctico Bioclimático */}
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-amber-300 mb-0.5">Aplicación en la Vida Cotidiana:</span>
              <span>{lesson.practicalTip}</span>
            </div>
          </div>
        </div>

        {/* Footer con controles de navegación */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentLessonIndex === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              currentLessonIndex === 0
                ? 'opacity-40 cursor-not-allowed text-stone-500'
                : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lección anterior</span>
          </button>

          <div className="text-xs text-stone-400 font-mono">
            {currentLessonIndex + 1} / {module.lessons.length}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <span>
              {currentLessonIndex === module.lessons.length - 1 ? 'Iniciar Autoevaluación' : 'Siguiente lección'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
