import React from 'react';
import { X } from 'lucide-react';
import { TeamCommunicationsView } from './TeamCommunicationsView';

interface TeamCommunicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId?: string;
  hotelName?: string;
  initialTab?: 'anuncios' | 'chat' | 'notificaciones';
}

export const TeamCommunicationsModal: React.FC<TeamCommunicationsModalProps> = ({
  isOpen,
  onClose,
  hotelId = 'klayman-diamond',
  hotelName = 'Klayman Diamond Aparthotel',
  initialTab = 'anuncios'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-950 border border-stone-800 rounded-3xl p-4 sm:p-6 my-auto shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-stone-800 sticky top-0 bg-stone-950/95 backdrop-blur-sm z-20">
          <div className="text-xs font-mono text-stone-400">
            KLAYMAN OPERATIONS HUB · <span className="text-sky-400 font-bold">MÓDULO DE COMUNICACIÓN & EQUIPO</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TeamCommunicationsView
          hotelId={hotelId}
          hotelName={hotelName}
          initialTab={initialTab}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
