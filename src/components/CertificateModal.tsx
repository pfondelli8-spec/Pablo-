import React, { useState } from 'react';
import { Award, CheckCircle, Download, Printer, ShieldCheck, X } from 'lucide-react';
import { CertificationRecord } from '../types/clima';

interface CertificateModalProps {
  certificate: CertificationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudentName: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onUpdateStudentName
}) => {
  if (!isOpen || !certificate) return null;

  const [nameInput, setNameInput] = useState(certificate.studentName || 'Participante');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSaveName = () => {
    onUpdateStudentName(nameInput);
    setIsEditingName(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col text-stone-100 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header no imprimible */}
        <div className="px-6 py-3.5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Award className="w-4 h-4" />
            <span>Acreditación Oficial · Grupo Clima</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificado con marco formal de diploma */}
        <div className="p-8 sm:p-12 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 relative overflow-hidden print:bg-white print:p-8">
          <div className="border-4 border-double border-emerald-900/60 p-8 sm:p-12 rounded-xl text-center space-y-6 relative print:border-stone-800">
            
            {/* Sello de agua sutil de fondo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <ShieldCheck className="w-72 h-72 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase print:text-emerald-800">
                Diploma de Aprovechamiento Formativo
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 print:text-stone-900">
                Grupo Clima · Alimentación de la Vida
              </h2>
              <p className="text-xs text-stone-400 print:text-stone-600">
                Cátedra de Climatología Agraria y Nutrición Planetaria
              </p>
            </div>

            <div className="text-xs text-stone-400 print:text-stone-700">
              Certifica que
            </div>

            {/* Nombre del Estudiante (Editable con un clic) */}
            <div>
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-stone-950 border border-emerald-500 text-stone-100 font-display text-xl sm:text-2xl font-bold text-center px-4 py-1.5 rounded-lg max-w-sm focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1.5 bg-emerald-500 text-stone-950 text-xs font-semibold rounded-lg"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="group inline-flex items-center gap-2 text-stone-100 hover:text-emerald-300 font-display text-2xl sm:text-3xl font-bold border-b border-dashed border-stone-600 pb-1 print:border-none print:text-stone-900"
                  title="Haz clic para personalizar tu nombre"
                >
                  <span>{nameInput}</span>
                  <span className="text-[10px] font-sans font-normal text-stone-500 group-hover:text-emerald-400 print:hidden">
                    (editar)
                  </span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed print:text-stone-800">
              Ha superado satisfactoriamente los contenidos teóricos y la evaluación práctica del programa:
            </p>

            <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-xl max-w-lg mx-auto print:bg-stone-100 print:border-stone-300">
              <div className="text-xs font-mono text-emerald-400 font-semibold print:text-emerald-800">
                {certificate.moduleId}
              </div>
              <div className="font-display text-lg font-bold text-stone-100 print:text-stone-900 mt-0.5">
                {certificate.moduleTitle}
              </div>
              <div className="text-xs text-stone-400 mt-1 print:text-stone-600">
                Calificación obtenida: <strong className="text-emerald-400 font-mono print:text-emerald-800">{certificate.scorePercentage}%</strong>
              </div>
            </div>

            {/* Firmas y sellos formales */}
            <div className="pt-8 border-t border-stone-800/80 grid grid-cols-2 gap-8 text-xs print:border-stone-400">
              <div className="text-center space-y-1">
                <div className="font-serif italic text-stone-400 text-base print:text-stone-800">
                  Comité Científico
                </div>
                <div className="text-stone-500 print:text-stone-600">Área de Climatología y Biomas</div>
              </div>
              <div className="text-center space-y-1">
                <div className="font-mono text-stone-300 font-semibold print:text-stone-800">
                  ID: {certificate.certificateId}
                </div>
                <div className="text-stone-500 print:text-stone-600">Expedido el {certificate.dateCompleted}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer no imprimible */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between print:hidden">
          <span className="text-xs text-stone-400">
            Documento digital verificable
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
