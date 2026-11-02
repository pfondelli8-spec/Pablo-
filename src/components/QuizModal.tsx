import React, { useState } from 'react';
import { Award, CheckCircle2, X, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { CourseModule, QuizQuestion } from '../types/clima';

interface QuizModalProps {
  module: CourseModule | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteModule: (moduleId: string, scorePercentage: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  module,
  isOpen,
  onClose,
  onCompleteModule
}) => {
  if (!isOpen || !module) return null;

  const questions = module.quiz;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ: QuizQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestionIndex];
  const isSubmitted = isAnswerSubmitted[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }));
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === undefined) return;
    setIsAnswerSubmitted(prev => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finalizar quiz y calcular nota
      setQuizFinished(true);
      const totalCorrect = questions.reduce((acc, q, idx) => {
        return acc + (selectedAnswers[idx] === q.correctOptionIndex ? 1 : 0);
      }, 0);
      const percentage = Math.round((totalCorrect / questions.length) * 100);
      if (percentage >= 70) {
        onCompleteModule(module.id, percentage);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted({});
    setQuizFinished(false);
  };

  const correctCount = questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctOptionIndex ? 1 : 0);
  }, 0);
  const finalPercentage = Math.round((correctCount / questions.length) * 100);
  const isPassed = finalPercentage >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-stone-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div>
            <div className="text-xs font-mono text-emerald-400">
              Autoevaluación Formativa · {module.code}
            </div>
            <h3 className="font-display text-lg font-bold text-stone-100 mt-0.5">
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Test */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {!quizFinished ? (
            <div className="space-y-6">
              {/* Barra de progreso */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-400 font-mono">
                  <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pregunta */}
              <h4 className="font-display text-lg sm:text-xl font-bold text-stone-100 leading-snug">
                {currentQ.question}
              </h4>

              {/* Opciones */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isThisSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctOptionIndex;

                  let borderClass = 'border-stone-800 hover:border-stone-700 bg-stone-950/50';
                  if (isSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-600 bg-emerald-950/40 text-emerald-200';
                    } else if (isThisSelected && !isCorrect) {
                      borderClass = 'border-rose-600 bg-rose-950/40 text-rose-200';
                    }
                  } else if (isThisSelected) {
                    borderClass = 'border-emerald-500 bg-stone-850 text-stone-100';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${borderClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-stone-700 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isThisSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explicación Pedagógica si ya se respondió */}
              {isSubmitted && (
                <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-1 text-xs text-stone-300 animate-fade-in">
                  <div className="font-semibold text-emerald-400">
                    Justificación Científica:
                  </div>
                  <p className="leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Pantalla de Resultados Finales */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-stone-950 border border-stone-800">
                <Award className={`w-8 h-8 ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`} />
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-2xl font-bold text-stone-100">
                  {isPassed ? '¡Enhorabuena! Módulo Acreditado' : 'Prueba No Superada'}
                </h4>
                <p className="text-sm text-stone-400 max-w-md mx-auto">
                  {isPassed
                    ? `Has obtenido un ${finalPercentage}% de respuestas correctas (${correctCount}/${questions.length}). Tu aprovechamiento pedagógico ha sido acreditado oficialmente.`
                    : `Has obtenido un ${finalPercentage}%. Se requiere al menos un 70% de aciertos para obtener la acreditación del módulo. Te recomendamos repasar las lecciones.`}
                </p>
              </div>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 inline-block font-mono text-xs">
                <span className="text-stone-400">Distinción: </span>
                <span className="text-emerald-400 font-semibold">{module.badgeName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
          {!quizFinished ? (
            <>
              <button
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-200"
              >
                Cerrar test
              </button>

              {!isSubmitted ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === undefined}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    selectedOption !== undefined
                      ? 'bg-emerald-400 text-stone-950 hover:bg-emerald-300'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Comprobar respuesta
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  <span>
                    {currentQuestionIndex < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultado'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar test</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Finalizar y Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
