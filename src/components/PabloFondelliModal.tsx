import React from 'react';
import { 
  X, 
  User, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Phone, 
  Mail, 
  ExternalLink, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PabloFondelliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PabloFondelliModal: React.FC<PabloFondelliModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
      <div 
        className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="bg-[#022042] text-white p-4 sm:p-6 flex items-start justify-between gap-3 relative shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/grok_1793484133769_3447b05d.jpg"
              alt="PF · Pablo Fondelli"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-[#E8B849]/60 shrink-0 shadow-lg"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>Dirección del Proyecto & Arquitecto Responsable</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight text-white">
                Pablo Fondelli
              </h2>
              <div className="text-[11px] sm:text-xs text-cyan-100/90 font-medium leading-snug mt-0.5">
                Consultor en F&B Management · Arquitecto Operativo del Proyecto
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs sm:text-sm">
          {/* Ubicación y Resumen Ejecutivo */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Arona / Santa Cruz de Tenerife, Canarias, España</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px]">
              Más de <strong>25 años de experiencia</strong> en la industria de la restauración hotelera y más de <strong>15 años liderando equipos operativos</strong> en <em>Spring Hotels Group</em> como Jefe de Restaurante y Bar, Jefe de Bar y Jefe de Sector. Especializado en optimizar la calidad operativa, el rendimiento de equipos y la excelencia en la experiencia del huésped.
            </p>
          </div>

          {/* Formación y Certificaciones Destacadas */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Formación Académica y Cualificaciones de Dirección</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Tarjeta 1 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug text-xs">
                    Máster Internacional en Dirección de Empresas de Turismo y Ocio
                  </h4>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Instituto Canario de Turismo · 2022 - 2025
                  </div>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug text-xs">
                    Ciclo Superior en Dirección en Servicios de Restauración
                  </h4>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    I.E.S. Los Olivos · 2018 - 2020
                  </div>
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug text-xs">
                    Especialista en Sumillería & Servicios de Restaurante
                  </h4>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Certificado de Profesionalidad Nivel 2 en Restaurantes
                  </div>
                </div>
              </div>

              {/* Tarjeta 4 */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-snug text-xs">
                    Docente de Formación Ocupacional en Restauración
                  </h4>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Formador de Teleformadores y Capacitación Técnica
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vías de contacto directo full-width para móvil */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Contacto y Red Profesional:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="tel:+34637213794"
                className="w-full py-2.5 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar: 637 213 794</span>
              </a>

              <a
                href="mailto:pfondelli8@gmail.com"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>pfondelli8@gmail.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/pablo-fondelli-0a4a2788"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Perfil LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium truncate">
            Plataforma desarrollada para dirección de F&B y operaciones hoteleras.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
