import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  FileDown, 
  Mail, 
  Copy, 
  Check, 
  Printer, 
  Building2, 
  Clock, 
  User, 
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface ShareDetailItem {
  label: string;
  value: string;
}

export interface UniversalSharePayload {
  title: string;
  moduleName?: string;
  module?: string;
  hotelName?: string;
  hotel?: string;
  areaName?: string;
  area?: string;
  responsible?: string;
  date?: string;
  time?: string;
  summaryText: string;
  details?: ShareDetailItem[];
  whatsappText?: string;
  emailSubject?: string;
  emailBody?: string;
}

interface UniversalShareModalProps {
  isOpen?: boolean;
  onClose: () => void;
  payload: UniversalSharePayload;
}

export const UniversalShareModal: React.FC<UniversalShareModalProps> = ({
  isOpen = true,
  onClose,
  payload
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const moduleDisplay = payload.moduleName || payload.module || 'Operaciones F&B';
  const hotel = payload.hotelName || payload.hotel || 'Klayman Diamond Aparthotel ★★★★';
  const area = payload.areaName || payload.area || 'Bar / Terraza Diamond';
  const dateStr = payload.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = payload.time || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const resp = payload.responsible || 'Personal de Turno';

  // 1. Formateo de texto para WhatsApp
  const generateWhatsAppMessage = () => {
    if (payload.whatsappText) return payload.whatsappText;

    let msg = `🏨 *${hotel.toUpperCase()}*\n`;
    msg += `📍 ${area} · ${moduleDisplay.toUpperCase()}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📋 *${payload.title.toUpperCase()}*\n`;
    msg += `📅 ${dateStr} · 🕒 ${timeStr} h\n`;
    msg += `👤 Responsable: ${resp}\n\n`;
    msg += `📝 *Resumen:*\n${payload.summaryText}\n\n`;

    if (payload.details && payload.details.length > 0) {
      msg += `🔍 *Detalles clave:*\n`;
      payload.details.forEach(d => {
        msg += `• ${d.label}: *${d.value}*\n`;
      });
      msg += `\n`;
    }

    msg += `✅ _Klayman Operations Hub · Registro Oficial_`;
    return msg;
  };

  const handleWhatsAppShare = () => {
    const text = generateWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // 2. Formateo para Correo Electrónico
  const handleEmailShare = () => {
    const subject = payload.emailSubject || `[KLAYMAN F&B] ${payload.moduleName} - ${payload.title} (${dateStr})`;
    let body = payload.emailBody || '';
    if (!body) {
      body = `${hotel}\n${area} - ${payload.moduleName}\n\n`;
      body += `INFORME: ${payload.title}\n`;
      body += `Fecha: ${dateStr} - ${timeStr} h\n`;
      body += `Responsable: ${resp}\n\n`;
      body += `RESUMEN:\n${payload.summaryText}\n\n`;
      if (payload.details && payload.details.length > 0) {
        body += `DETALLES:\n`;
        payload.details.forEach(d => {
          body += `- ${d.label}: ${d.value}\n`;
        });
      }
      body += `\n---\nGenerado automáticamente desde Klayman Operations Hub.`;
    }
    const mailtoUrl = `mailto:direccionfb@klaymanhotels.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // 3. Copiar al Portapapeles
  const handleCopy = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 4. Descargar PDF / Imprimir informe formal
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* CABECERA MODAL */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  {payload.moduleName}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-[10px] font-mono text-stone-400">
                  {hotel.split(' ')[0]} {hotel.split(' ')[1]}
                </span>
              </div>
              <h2 className="text-base font-display font-bold text-stone-100 leading-tight">
                Compartir Información Oficial
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* VISTA PREVIA DEL DOCUMENTO COMPARTIBLE */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-850 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2.5">
              <div>
                <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                  KLAYMAN HOSPITALITY
                </span>
                <h3 className="font-display font-bold text-sm text-stone-100 mt-0.5">
                  {payload.title}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-stone-400">
                {payload.moduleName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-400">
              <div>
                <span className="text-stone-500 block text-[10px]">FECHA Y HORA</span>
                <span className="text-stone-200">{dateStr} · {timeStr} h</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">RESPONSABLE</span>
                <span className="text-stone-200 truncate block">{resp}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-850">
              <span className="text-[10px] font-mono text-stone-500 uppercase block mb-1">
                Resumen Ejecutivo
              </span>
              <p className="text-xs text-stone-300 font-sans leading-relaxed whitespace-pre-line">
                {payload.summaryText}
              </p>
            </div>

            {payload.details && payload.details.length > 0 && (
              <div className="pt-2 border-t border-stone-850">
                <span className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5">
                  Indicadores / Parámetros Clave
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  {payload.details.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-stone-900/60 border border-stone-850 flex items-center justify-between">
                      <span className="text-stone-400 truncate pr-1">{item.label}:</span>
                      <span className="text-amber-400 font-bold shrink-0">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* OPCIONES DE ACCIÓN RÁPIDA (4 BOTONES PRINCIPALES) */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-semibold block">
              Selecciona canal de envío:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold flex items-center gap-2.5 transition-all shadow-md active:scale-98"
              >
                <MessageCircle className="w-5 h-5 shrink-0 fill-stone-950" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-display">WhatsApp</div>
                  <div className="text-[10px] opacity-80 font-mono font-normal">Envío inmediato</div>
                </div>
              </button>

              {/* PDF / Imprimir */}
              <button
                onClick={handlePrintPDF}
                className="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-100 font-bold flex items-center gap-2.5 transition-all shadow-md active:scale-98"
              >
                <FileDown className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-display">Descargar PDF</div>
                  <div className="text-[10px] text-stone-400 font-mono font-normal">Formato formal A4</div>
                </div>
              </button>

              {/* Correo Electrónico */}
              <button
                onClick={handleEmailShare}
                className="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-100 font-bold flex items-center gap-2.5 transition-all shadow-md active:scale-98"
              >
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-left leading-tight">
                  <div className="text-xs font-display">Correo F&B</div>
                  <div className="text-[10px] text-stone-400 font-mono font-normal">A Dirección</div>
                </div>
              </button>

              {/* Copiar Resumen */}
              <button
                onClick={handleCopy}
                className="p-3.5 rounded-2xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-100 font-bold flex items-center gap-2.5 transition-all shadow-md active:scale-98"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-400 shrink-0" />
                )}
                <div className="text-left leading-tight">
                  <div className="text-xs font-display">
                    {copied ? '¡Copiado!' : 'Copiar Texto'}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono font-normal">
                    {copied ? 'Listo para pegar' : 'Portapapeles'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/70 flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>Klayman Operations Hub</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
