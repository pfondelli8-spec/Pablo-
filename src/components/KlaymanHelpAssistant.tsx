import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  X, 
  Send, 
  Search, 
  FileText, 
  Receipt, 
  Coins, 
  Wine, 
  Calendar, 
  CornerDownLeft, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { getLocalDeterministicAnswer } from '../services/assistantEngine';
import { BarCategory } from './PortalBarView';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  location?: string;
  category?: BarCategory;
  suggestedAction?: {
    label: string;
    actionType: string;
    target?: string;
  };
  source?: 'ai_grounded' | 'local_official_docs';
  timestamp: string;
}

export interface KlaymanHelpAssistantProps {
  onNavigateToTab?: (tab: BarCategory, itemId?: string) => void;
}

function inferTabFromLocation(location?: string, category?: string): BarCategory {
  if (category && ['control_operativo', 'direccion_fb', 'cartas', 'fichas', 'promociones', 'eventos', 'procedimientos', 'puesto', 'cierre_caja'].includes(category)) {
    return category as BarCategory;
  }
  if (!location) return null;
  const l = location.toLowerCase();
  if (l.includes('control') || l.includes('checklist') || l.includes('appcc') || l.includes('trazabilidad') || l.includes('calibracion') || l.includes('calibración')) return 'control_operativo';
  if (l.includes('direccion') || l.includes('dirección') || l.includes('dashboard') || l.includes('maitre') || l.includes('maître')) return 'direccion_fb';
  if (l.includes('cierre') && (l.includes('caja') || l.includes('banco'))) return 'cierre_caja';
  if (l.includes('evento') || l.includes('agenda') || l.includes('calendario')) return 'eventos';
  if (l.includes('pestaña 1') || l.includes('cartas')) return 'cartas';
  if (l.includes('pestaña 2') || l.includes('fichas')) return 'fichas';
  if (l.includes('pestaña 3') || l.includes('promociones')) return 'promociones';
  if (l.includes('pestaña 4') || l.includes('procedimientos')) return 'procedimientos';
  if (l.includes('pestaña 5') || l.includes('puesto')) return 'puesto';
  return null;
}

export function KlaymanHelpAssistant({ onNavigateToTab }: KlaymanHelpAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPill, setShowPill] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al final al recibir nuevos mensajes
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Foco en el input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputValue('');
    setIsLoading(true);

    try {
      // 1. Intentar resolver a través del backend con Gemini 3.8 Flash grounded
      const res = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend.trim(),
          history: messages.slice(-4).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.answer,
          location: data.location,
          category: (['cartas', 'fichas', 'promociones', 'procedimientos', 'puesto'].includes(data.category) ? data.category : null) as BarCategory,
          suggestedAction: data.suggestedAction,
          source: data.source || 'ai_grounded',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Error en la llamada al servidor');
      }
    } catch {
      // 2. Fallback determinista local en caso de desconexión o indisponibilidad
      const localResult = getLocalDeterministicAnswer(textToSend);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: localResult.answer,
        location: localResult.location,
        category: (localResult.category === 'general' ? null : localResult.category) as BarCategory,
        suggestedAction: localResult.suggestedAction,
        source: 'local_official_docs',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionText: string) => {
    if (actionText === 'Escribir mi consulta') {
      inputRef.current?.focus();
      return;
    }
    handleSendMessage(actionText);
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <>
      {/* VENTANA FLOTANTE DEL ASISTENTE */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[440px] max-h-[78vh] bg-stone-900/95 backdrop-blur-xl border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-5"
          role="dialog"
          aria-label="Asistente Operativo Klayman Ayuda"
        >
          {/* CABECERA CORPORATIVA KLAYMAN · AYUDA */}
          <div className="bg-stone-950/90 border-b border-stone-800/80 px-4 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-900/20">
                <span className="font-display text-sm font-black">K</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-sm tracking-wide text-stone-100">
                    KLAYMAN · AYUDA
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Oficial
                  </span>
                </div>
                <p className="text-[11px] font-sans text-stone-400">
                  Asistente Operativo de Turno
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                  title="Reiniciar consulta"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                title="Cerrar ventana de ayuda"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CUERPO DEL CHAT / ÁREA DE CONSULTA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[52vh] text-xs">
            {/* ESTADO INICIAL: BOTONES DE ACCIÓN RÁPIDA SOLICITADOS POR EL USUARIO */}
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-medium">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-stone-200">¿En qué puedo ayudarte?</span>
                  </div>
                  <p className="text-stone-400 leading-relaxed text-[11.5px]">
                    Consulta directa de procedimientos, recetas oficiales de coctelería, normas de caja, promociones y contactos de Klayman Diamond.
                  </p>
                </div>

                {/* LISTADO DE ACCIONES RÁPIDAS EXPLICADAS POR EL USUARIO */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-semibold px-1">
                    Consultas operativas frecuentes:
                  </span>

                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => handleQuickAction('🔎 Buscar información')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-amber-300 transition-colors group"
                    >
                      <Search className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">🔎 Buscar información</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('📋 ¿Qué procedimiento tengo que seguir?')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-sky-300 transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">📋 ¿Qué procedimiento tengo que seguir?</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('🧾 Tengo un ticket / justificante')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-purple-300 transition-colors group"
                    >
                      <Receipt className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">🧾 Tengo un ticket / justificante</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('💶 Tengo una diferencia de caja')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-emerald-300 transition-colors group"
                    >
                      <Coins className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">💶 Tengo una diferencia de caja</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('🍸 ¿Cómo preparo este producto?')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-amber-300 transition-colors group"
                    >
                      <Wine className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">🍸 ¿Cómo preparo este producto?</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('📅 ¿Hay alguna promoción activa?')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/50 hover:bg-stone-800/80 border border-stone-800/70 text-left flex items-center gap-2.5 text-stone-300 hover:text-rose-300 transition-colors group"
                    >
                      <Calendar className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">📅 ¿Hay alguna promoción activa?</span>
                    </button>

                    <button
                      onClick={() => handleQuickAction('Escribir mi consulta')}
                      className="w-full p-2.5 rounded-xl bg-stone-950/30 hover:bg-stone-800/60 border border-stone-850 text-left flex items-center gap-2.5 text-stone-400 hover:text-stone-200 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      <span>❓ Escribir mi consulta directa</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950/30 border border-stone-900 text-[11px] text-stone-500 font-mono">
                  💡 Regla operativa: Las respuestas provienen exclusivamente de la documentación oficial cargada en el portal.
                </div>
              </div>
            ) : (
              /* HISTORIAL DE MENSAJES */
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[92%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs ${
                        msg.sender === 'user' 
                          ? 'bg-amber-600 text-stone-950 font-medium rounded-br-sm shadow-md' 
                          : 'bg-stone-950/90 border border-stone-800 text-stone-200 rounded-bl-sm shadow-md'
                      }`}
                    >
                      {msg.text}

                      {/* UBICACIÓN EN EL PORTAL */}
                      {msg.location && (
                        <div className="mt-3 pt-2.5 border-t border-stone-800/80 space-y-2">
                          <div className="flex items-start gap-1.5 text-[11px] font-mono text-amber-300">
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-stone-400 block text-[10px]">Dónde encontrarlo:</span>
                              <span className="font-semibold">{msg.location}</span>
                            </div>
                          </div>

                          {/* BOTÓN INTERACTIVO DE NAVEGACIÓN A LA PESTAÑA */}
                          {onNavigateToTab && (() => {
                            const targetTab = inferTabFromLocation(msg.location, msg.category);
                            if (!targetTab) return null;
                            const actionLabel = msg.suggestedAction?.label || (
                              targetTab === 'cartas' ? 'Abrir 1. Cartas' :
                              targetTab === 'fichas' ? 'Abrir 2. Fichas Técnicas' :
                              targetTab === 'promociones' ? 'Abrir 3. Promociones' :
                              targetTab === 'procedimientos' ? 'Abrir 4. Procedimientos' :
                              'Abrir 5. Información del Puesto'
                            );
                            return (
                              <button
                                onClick={() => {
                                  onNavigateToTab(targetTab, msg.suggestedAction?.target);
                                }}
                                className="w-full mt-1.5 py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-[11px] font-mono font-medium flex items-center justify-between transition-colors shadow-sm"
                              >
                                <span className="truncate">{actionLabel}</span>
                                <span className="shrink-0 font-bold">Ver en pantalla →</span>
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-stone-600 px-2 mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-stone-400 bg-stone-950/80 border border-stone-850 p-3 rounded-2xl max-w-[85%]">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-mono">Consultando documentación oficial...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* FORMULARIO DE ENTRADA DIRECTA */}
          <div className="p-3 bg-stone-950 border-t border-stone-850">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu consulta (ej: ¿Cómo hago el cierre de caja?)..."
                disabled={isLoading}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 font-bold flex items-center justify-center transition-colors shrink-0 shadow-md"
                title="Enviar consulta"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE PERMANENTE EN LA ESQUINA INFERIOR DERECHA */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 pointer-events-auto">
        {/* PÍLDORA DISCRETA «● ¿Necesitas ayuda?» (Solo en pantallas medianas o mayores para no tapar contenido en móvil) */}
        {!isOpen && showPill && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex cursor-pointer group items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/95 hover:bg-stone-850 text-stone-200 hover:text-white border border-stone-800 shadow-xl backdrop-blur-md transition-all duration-200 select-none animate-in fade-in"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium font-sans tracking-wide">
              ¿Necesitas ayuda?
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPill(false);
              }}
              className="text-stone-500 hover:text-stone-300 p-0.5 rounded-full"
              title="Ocultar mensaje"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* BOTÓN CIRCULAR FLOTANTE PERMANENTE: ERGONÓMICO Y TÁCTIL */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
            isOpen 
              ? 'bg-stone-800 text-stone-200 hover:bg-stone-700 rotate-90' 
              : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-stone-950 hover:brightness-110 shadow-amber-950/40'
          }`}
          aria-label={isOpen ? 'Cerrar KLAYMAN · AYUDA' : 'Abrir KLAYMAN · AYUDA'}
          title="KLAYMAN · AYUDA (Asistente Operativo)"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter leading-none select-none">
                ?
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-950" />
            </div>
          )}
        </button>
      </div>
    </>
  );
}
