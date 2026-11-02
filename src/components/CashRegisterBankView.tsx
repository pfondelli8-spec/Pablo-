import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, 
  Camera, 
  Upload, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Tag, 
  Gift, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  FileText,
  AlertCircle,
  Download,
  Share2,
  TrendingUp,
  Maximize2,
  Copy,
  Check
} from 'lucide-react';
import { CashRegisterClosing } from '../types/hotelPortal';
import { INITIAL_CASH_CLOSINGS } from '../data/hotelOperationsData';

interface CashRegisterBankViewProps {
  hotelId: string;
  hotelName: string;
  defaultOutletName?: string;
}

const LOCAL_STORAGE_KEY = 'operations_cash_closings_data';

export const CashRegisterBankView: React.FC<CashRegisterBankViewProps> = ({
  hotelId,
  hotelName,
  defaultOutletName = 'Bar / Servicio Principal F&B'
}) => {
  // Estado de los cierres persistido en localStorage
  const [closings, setClosings] = useState<CashRegisterClosing[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cash closings from localStorage', e);
    }
    return INITIAL_CASH_CLOSINGS;
  });

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState<string>('todos');

  // Modal para registrar nuevo cierre
  const [isNewClosingOpen, setIsNewClosingOpen] = useState(false);

  // Campos del formulario de cierre
  const [outletName, setOutletName] = useState(defaultOutletName);
  const [closingDate, setClosingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [closingTime, setClosingTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [shift, setShift] = useState<'cierre_noche' | 'cierre_tarde' | 'cierre_completo' | 'cierre_mediodia'>('cierre_noche');
  const [cashierName, setCashierName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('TPV 1 Terraza');
  const [ticketZNumber, setTicketZNumber] = useState('');
  
  // Importes numéricos
  const [totalGross, setTotalGross] = useState<string>('');
  const [totalCash, setTotalCash] = useState<string>('');
  const [totalCreditCard, setTotalCreditCard] = useState<string>('');
  const [totalDiscounts, setTotalDiscounts] = useState<string>('0');
  const [discountReason, setDiscountReason] = useState<string>('');
  const [totalInvitations, setTotalInvitations] = useState<string>('0');
  const [invitationDetails, setInvitationDetails] = useState<string>('');
  const [tips, setTips] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');

  // Foto del ticket de caja (Z)
  const [ticketPhotoUrl, setTicketPhotoUrl] = useState<string>('');
  const [ticketPhotoName, setTicketPhotoName] = useState<string>('');

  // Modal de visor ampliado del ticket
  const [viewingClosing, setViewingClosing] = useState<CashRegisterClosing | null>(null);

  // Estado para feedback de copia de reporte
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyReport = (c: CashRegisterClosing) => {
    const summary = `📊 ${hotelName.toUpperCase()} - REPORTE DE CIERRE DE CAJA
📅 Fecha: ${c.date} (${c.time} h) · Turno: ${c.shift === 'cierre_noche' ? 'Noche' : 'Tarde'}
📍 P.O.S.: ${c.outletName} (${c.registerNumber})
👤 Responsable de Caja: ${c.cashierName}
🧾 Cierre Z: ${c.ticketZNumber}
────────────────────────────────
💰 Total Facturado: ${c.totalGross.toFixed(2)} €
💳 Cobro Tarjeta: ${c.totalCreditCard.toFixed(2)} €
💵 Cobro Efectivo: ${c.totalCash.toFixed(2)} €
🏷️ Total Descuentos: -${c.totalDiscounts.toFixed(2)} € ${c.discountReason ? `[Motivo: ${c.discountReason}]` : ''}
🎁 Total Invitaciones: ${c.totalInvitations.toFixed(2)} € ${c.invitationDetails ? `[Detalle: ${c.invitationDetails}]` : ''}
${c.tips ? `🪙 Propinas: ${c.tips.toFixed(2)} €\n` : ''}${c.notes ? `📝 Observaciones: ${c.notes}\n` : ''}📸 Fotografía Ticket Z: Archivada en Banco de Datos Digital`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
    }
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Sincronizar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(closings));
    } catch (e) {
      console.error('Error saving cash closings to localStorage', e);
    }
  }, [closings]);

  // Manejo de subida de foto de ticket
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTicketPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTicketPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Autocalcular total si se ingresa efectivo y tarjeta
  const numGross = parseFloat(totalGross) || 0;
  const numCash = parseFloat(totalCash) || 0;
  const numCard = parseFloat(totalCreditCard) || 0;
  const sumPayments = numCash + numCard;
  const discrepancy = numGross > 0 && sumPayments > 0 ? sumPayments - numGross : 0;

  // Enviar nuevo cierre de caja
  const handleSaveClosing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierName.trim() || !totalGross) return;

    const newClosing: CashRegisterClosing = {
      id: `close-dia-${Date.now()}`,
      hotelId,
      outletId: 'bar-servicio-principal',
      outletName,
      date: closingDate,
      time: closingTime,
      shift,
      cashierName: cashierName.trim(),
      registerNumber,
      ticketZNumber: ticketZNumber.trim() || `Z-${Math.floor(1000 + Math.random() * 9000)}`,
      totalGross: parseFloat(totalGross) || 0,
      totalCash: parseFloat(totalCash) || 0,
      totalCreditCard: parseFloat(totalCreditCard) || 0,
      totalDiscounts: parseFloat(totalDiscounts) || 0,
      discountReason: discountReason.trim() || undefined,
      totalInvitations: parseFloat(totalInvitations) || 0,
      invitationDetails: invitationDetails.trim() || undefined,
      tips: parseFloat(tips) || 0,
      discrepancy: discrepancy,
      ticketPhotoUrl: ticketPhotoUrl || undefined,
      ticketPhotoName: ticketPhotoName || undefined,
      notes: notes.trim() || undefined,
      verified: true,
      createdAt: new Date().toISOString()
    };

    setClosings(prev => [newClosing, ...prev]);
    setIsNewClosingOpen(false);

    // Resetear formulario
    setTotalGross('');
    setTotalCash('');
    setTotalCreditCard('');
    setTotalDiscounts('0');
    setDiscountReason('');
    setTotalInvitations('0');
    setInvitationDetails('');
    setTips('0');
    setNotes('');
    setTicketPhotoUrl('');
    setTicketPhotoName('');
    setTicketZNumber('');
  };

  // Métricas acumuladas del banco de datos
  const totalFacturadoHistorico = useMemo(() => {
    return closings.reduce((acc, c) => acc + (c.totalGross || 0), 0);
  }, [closings]);

  const totalTarjetaHistorico = useMemo(() => {
    return closings.reduce((acc, c) => acc + (c.totalCreditCard || 0), 0);
  }, [closings]);

  const totalEfectivoHistorico = useMemo(() => {
    return closings.reduce((acc, c) => acc + (c.totalCash || 0), 0);
  }, [closings]);

  const totalDescuentosHistorico = useMemo(() => {
    return closings.reduce((acc, c) => acc + (c.totalDiscounts || 0), 0);
  }, [closings]);

  const totalInvitacionesHistorico = useMemo(() => {
    return closings.reduce((acc, c) => acc + (c.totalInvitations || 0), 0);
  }, [closings]);

  // Filtrado de cierres
  const filteredClosings = useMemo(() => {
    return closings.filter(c => {
      const matchesSearch = 
        c.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ticketZNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.outletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.notes && c.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (dateFilter && c.date !== dateFilter) return false;

      if (shiftFilter !== 'todos' && c.shift !== shiftFilter) return false;

      return true;
    });
  }, [closings, searchTerm, dateFilter, shiftFilter]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-[#2C3E50]">
      {/* CABECERA PRINCIPAL */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-[#C5A880]">
                <Receipt className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880] font-bold">
                F&B OPERATIONS · CONTROL DE CAJA
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">
              Banco de Tickets de Caja
            </h2>
            <p className="text-xs sm:text-sm text-[#2C3E50]/80 max-w-3xl font-sans">
              Módulo oficial de archivo y consulta de cierres diarios de caja. Permite registrar la fotografía del ticket Z de cada jornada, asentar los totales recaudados (efectivo y tarjeta) y documentar los comentarios y justificaciones sobre descuentos e invitaciones.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsNewClosingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#b5976f] text-[#1A2530] font-bold text-xs font-mono transition-colors flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>+ Subir Foto de Ticket de Caja (Cierre Z)</span>
            </button>
          </div>
        </div>

        {/* TARJETAS RESUMEN DE TOTALES AUDITADOS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Total Facturado</span>
            </span>
            <div className="text-2xl font-bold text-[#1A2530]">
              {totalFacturadoHistorico.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/50 block">
              {closings.length} cierres registrados
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Tarjeta / Datáfono</span>
            </span>
            <div className="text-xl font-bold text-[#2C3E50]">
              {totalTarjetaHistorico.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/60 block">
              {Math.round((totalTarjetaHistorico / (totalFacturadoHistorico || 1)) * 100)}% de cobro digital
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Efectivo en Caja</span>
            </span>
            <div className="text-xl font-bold text-[#2C3E50]">
              {totalEfectivoHistorico.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/60 block">
              {Math.round((totalEfectivoHistorico / (totalFacturadoHistorico || 1)) * 100)}% en metálico
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>Descuentos</span>
            </span>
            <div className="text-xl font-bold text-rose-600">
              -{totalDescuentosHistorico.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/50 block">Promociones aplicadas</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-mono text-[#2C3E50]/70 uppercase flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Invitaciones</span>
            </span>
            <div className="text-xl font-bold text-[#2C3E50]">
              {totalInvitacionesHistorico.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <span className="text-[10px] font-mono text-[#2C3E50]/50 block">Cortesías autorizadas</span>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS & BÚSQUEDA */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0]">
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por responsable, ticket Z..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50] placeholder:text-[#2C3E50]/40 focus:outline-none focus:border-[#C5A880] font-mono"
            />
          </div>

          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs text-[#2C3E50] font-mono focus:border-[#C5A880] focus:outline-none"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="p-2 text-[#2C3E50]/50 hover:text-[#2C3E50]"
                title="Limpiar fecha"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] text-xs font-mono">
          <button
            onClick={() => setShiftFilter('todos')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              shiftFilter === 'todos' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
            }`}
          >
            Todos ({closings.length})
          </button>
          <button
            onClick={() => setShiftFilter('cierre_noche')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              shiftFilter === 'cierre_noche' ? 'bg-[#1A2530] text-white font-bold' : 'text-[#2C3E50]/70 hover:text-[#2C3E50]'
            }`}
          >
            Cierres Noche
          </button>
        </div>
      </div>

      {/* BANCO DE DATOS: LISTA DE TICKETS Y CIERRES */}
      <div className="space-y-4">
        {filteredClosings.map(closing => {
          return (
            <div 
              key={closing.id}
              className="p-5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#C5A880] transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0] flex items-center justify-center text-[#1A2530] shrink-0 font-mono font-bold text-sm">
                    {closing.ticketZNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-[#2C3E50]">
                        {closing.outletName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F9FA] text-[#2C3E50] border border-[#E2E8F0]">
                        {closing.shift === 'cierre_noche' ? '🌙 Cierre Noche' : '☀️ Cierre Tarde'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A880]/15 text-[#1A2530] border border-[#C5A880]/40 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#C5A880]" />
                        <span>Verificado</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-[#2C3E50]/70 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[#2C3E50]">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                        {closing.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#2C3E50]">
                        <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                        {closing.time} h
                      </span>
                      <span>·</span>
                      <span>Responsable: <strong className="text-[#1A2530]">{closing.cashierName}</strong></span>
                      <span>·</span>
                      <span className="text-[#2C3E50]/50">{closing.registerNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Importe Total y Botones de Acción */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-stone-500 uppercase block">Facturación Z</span>
                    <span className="text-2xl font-display font-bold text-emerald-400">
                      {closing.totalGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyReport(closing)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                        copiedId === closing.id
                          ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                          : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-700'
                      }`}
                      title="Copiar resumen del cierre para WhatsApp o Dirección"
                    >
                      {copiedId === closing.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setViewingClosing(closing)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ver Foto & Auditoría</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DESGLOSE EN 4 PILARES: EFECTIVO, TARJETA, DESCUENTOS, INVITACIONES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-sky-400" />
                    <span>Tarjeta / Datáfono:</span>
                  </span>
                  <div className="text-sm font-bold font-mono text-sky-300">
                    {closing.totalCreditCard.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-850 space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
                    <Banknote className="w-3 h-3 text-amber-400" />
                    <span>Efectivo:</span>
                  </span>
                  <div className="text-sm font-bold font-mono text-amber-300">
                    {closing.totalCash.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950/70 border border-rose-950/30 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Descuentos:</span>
                  </span>
                  <div className="text-sm font-bold font-mono text-rose-300">
                    -{closing.totalDiscounts.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-950/70 border border-amber-950/30 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>Invitaciones:</span>
                  </span>
                  <div className="text-sm font-bold font-mono text-amber-300">
                    {closing.totalInvitations.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </div>
                </div>
              </div>

              {/* COMENTARIOS SOBRE DESCUENTOS O INVITACIONES (SI EXISTEN) */}
              {(closing.discountReason || closing.totalDiscounts > 0 || closing.invitationDetails || closing.totalInvitations > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {(closing.discountReason || closing.totalDiscounts > 0) && (
                    <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-300 font-bold uppercase text-[10px]">
                        <Tag className="w-3 h-3 text-rose-400" />
                        <span>Comentarios sobre Descuentos (-{closing.totalDiscounts.toFixed(2)} €):</span>
                      </div>
                      <p className="text-stone-300 text-xs font-sans pl-4">
                        {closing.discountReason || 'Sin motivo especificado'}
                      </p>
                    </div>
                  )}

                  {(closing.invitationDetails || closing.totalInvitations > 0) && (
                    <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase text-[10px]">
                        <Gift className="w-3 h-3 text-amber-400" />
                        <span>Comentarios sobre Invitaciones ({closing.totalInvitations.toFixed(2)} €):</span>
                      </div>
                      <p className="text-stone-300 text-xs font-sans pl-4">
                        {closing.invitationDetails || 'Sin detalle de invitación especificado'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* NOTAS Y PROPINAS */}
              {(closing.notes || closing.tips > 0) && (
                <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-stone-400 gap-2 border-t border-stone-850">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>Observaciones: <em className="text-stone-300 font-sans">{closing.notes || 'Sin incidencias.'}</em></span>
                  </div>

                  {closing.tips > 0 && (
                    <div className="text-stone-300">
                      Propinas declaradas: <strong className="text-emerald-400">{closing.tips} €</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredClosings.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4 max-w-xl mx-auto">
            <Receipt className="w-10 h-10 text-stone-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-lg font-display font-bold text-stone-300">
                No hay cierres de caja registrados
              </h4>
              <p className="text-xs text-stone-500 font-mono">
                El histórico de arqueos diarios está limpio. Registre el primer cierre Z con desglose fiscal y comprobante fotográfico.
              </p>
            </div>
            <button
              onClick={() => setIsNewClosingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs font-mono transition-colors inline-flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Registrar Primer Cierre Z</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE NUEVO CIERRE DE CAJA (FORMULARIO CON SUBIDA DE FOTO DE TICKET) */}
      {isNewClosingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Canal Oficial de Operaciones {hotelName}
                </span>
                <h3 className="text-xl font-display font-bold text-stone-100">
                  Registrar Cierre de Caja Diario (Informe Z)
                </h3>
              </div>
              <button
                onClick={() => setIsNewClosingOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClosing} className="space-y-4">
              {/* DATOS DEL TURNO Y RESPONSABLE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Punto de Venta (P.O.S.): *
                  </label>
                  <input
                    type="text"
                    required
                    value={outletName}
                    onChange={(e) => setOutletName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Responsable de Caja: *
                  </label>
                  <input
                    type="text"
                    required
                    value={cashierName}
                    onChange={(e) => setCashierName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Nº Ticket / Cierre Z:
                  </label>
                  <input
                    type="text"
                    value={ticketZNumber}
                    onChange={(e) => setTicketZNumber(e.target.value)}
                    placeholder="Ej. Z-1085"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Fecha del Cierre:
                  </label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Hora del Cierre:
                  </label>
                  <input
                    type="time"
                    required
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">
                    Turno:
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="cierre_noche">Cierre Noche (Fin de Servicio)</option>
                    <option value="cierre_tarde">Cierre Tarde</option>
                    <option value="cierre_mediodia">Cierre Mediodía</option>
                    <option value="cierre_completo">Cierre Jornada Completa</option>
                  </select>
                </div>
              </div>

              {/* IMPORTES ECONÓMICOS: TOTAL, EFECTIVO, TARJETA */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <span className="text-xs font-mono uppercase font-bold text-stone-300 block">
                  Desglose de Facturación y Medios de Cobro (€):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                      Total Facturado Z (€): *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={totalGross}
                      onChange={(e) => setTotalGross(e.target.value)}
                      placeholder="Ej. 1485.50"
                      className="w-full bg-stone-900 border border-emerald-600 rounded-xl px-3 py-2 text-sm text-stone-100 font-mono font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-amber-400 uppercase">
                      Efectivo en Caja (€):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalCash}
                      onChange={(e) => setTotalCash(e.target.value)}
                      placeholder="Ej. 320.00"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-sky-400 uppercase">
                      Tarjeta / Datáfono (€):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalCreditCard}
                      onChange={(e) => setTotalCreditCard(e.target.value)}
                      placeholder="Ej. 1165.50"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 font-mono focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Comprobación de cuadre */}
                {numGross > 0 && sumPayments > 0 && (
                  <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                    Math.abs(discrepancy) < 0.01
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                      : 'bg-amber-950/60 border-amber-700 text-amber-300'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {Math.abs(discrepancy) < 0.01 ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Caja Cuadrada: Efectivo + Tarjeta coincide con el total.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Diferencia detectada: {discrepancy > 0 ? `+${discrepancy.toFixed(2)} € (Sobrante)` : `${discrepancy.toFixed(2)} € (Faltante)`}</span>
                        </>
                      )}
                    </div>
                    <span className="font-bold">{sumPayments.toFixed(2)} € cobrado</span>
                  </div>
                )}
              </div>

              {/* DESCUENTOS E INVITACIONES Y SUS COMENTARIOS OBLIGATORIOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                <div className="space-y-2 p-3 rounded-xl bg-stone-900/60 border border-rose-950/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-rose-400 uppercase font-bold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Total Descuentos del Día (€):</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalDiscounts}
                      onChange={(e) => setTotalDiscounts(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-stone-950 border border-rose-900/80 rounded-xl px-3 py-2 text-sm text-rose-300 font-mono font-bold focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                      Comentarios y Justificación sobre Descuentos:
                    </label>
                    <textarea
                      rows={2}
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      placeholder="Ej. Promoción Happy Hour 2x1 cócteles, descuento a huéspedes Platinum o tarifa empleado..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-200 font-mono focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-3 rounded-xl bg-stone-900/60 border border-amber-950/60">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Total Invitaciones / Cortesías (€):</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={totalInvitations}
                      onChange={(e) => setTotalInvitations(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-stone-950 border border-amber-900/80 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-stone-400 uppercase font-semibold">
                      Comentarios y Motivo de Invitaciones:
                    </label>
                    <textarea
                      rows={2}
                      value={invitationDetails}
                      onChange={(e) => setInvitationDetails(e.target.value)}
                      placeholder="Ej. Copa de bienvenida autorizada por Dirección para cliente repetidor VIP habitación 304..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-200 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SUBIDA DE FOTO DEL TICKET DE CAJA (Z) */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase font-bold text-stone-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Fotografía del Ticket de Caja / Cierre Z: *</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Sustituye la foto de WhatsApp
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-28 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
                    {ticketPhotoUrl ? (
                      <img src={ticketPhotoUrl} alt="Foto Ticket" className="w-full h-full object-cover" />
                    ) : (
                      <Receipt className="w-8 h-8 text-stone-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs font-mono cursor-pointer transition-colors flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        <span>Hacer Foto o Subir Archivo...</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>

                      {ticketPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setTicketPhotoUrl('');
                            setTicketPhotoName('');
                          }}
                          className="text-xs font-mono text-rose-400 hover:underline px-2 py-1"
                        >
                          Quitar foto
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] font-mono text-stone-400">
                      {ticketPhotoName 
                        ? `✓ Archivo cargado: ${ticketPhotoName}` 
                        : 'Pulsa para tomar la foto con la cámara del teléfono o seleccionar imagen de la galería.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-stone-400 uppercase">
                  Observaciones / Incidencias del turno:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Noche concurrida por espectáculo en terraza. Todo en orden..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsNewClosingOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-mono text-xs hover:bg-stone-750"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs transition-colors shadow-lg"
                >
                  Guardar Cierre en Banco de Datos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISOR DETALLADO DEL TICKET Z AUDITADO */}
      {viewingClosing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-3xl p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                  Auditoría Digital de Caja
                </span>
                <h3 className="text-xl font-display font-bold text-stone-100">
                  {viewingClosing.outletName} · {viewingClosing.ticketZNumber}
                </h3>
                <p className="text-xs font-mono text-stone-400">
                  Fecha: {viewingClosing.date} {viewingClosing.time} h · Responsable: {viewingClosing.cashierName}
                </p>
              </div>
              <button
                onClick={() => setViewingClosing(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IMAGEN DEL TICKET Z */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-stone-400 font-semibold block">
                  Comprobante Físico / Foto del Ticket:
                </span>
                <div className="rounded-2xl bg-stone-950 p-2 border border-stone-800 flex items-center justify-center overflow-hidden min-h-[300px]">
                  {viewingClosing.ticketPhotoUrl ? (
                    <img 
                      src={viewingClosing.ticketPhotoUrl} 
                      alt="Ticket de caja" 
                      className="max-h-[460px] w-auto object-contain rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="text-center p-8 space-y-2 text-stone-500 font-mono text-xs">
                      <Receipt className="w-12 h-12 mx-auto text-stone-600" />
                      <span>Sin imagen física adjunta.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DESGLOSE AUDITADO */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase text-stone-400 font-semibold block">
                  Datos Auditados en Sistema:
                </span>

                <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-900/60 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Facturación Total Declarada</span>
                  <div className="text-3xl font-display font-bold text-emerald-400">
                    {viewingClosing.totalGross.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-400">Tarjeta / Datáfono:</span>
                    <strong className="text-sky-300 font-bold">{viewingClosing.totalCreditCard.toFixed(2)} €</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-400">Efectivo Metálico:</span>
                    <strong className="text-amber-300 font-bold">{viewingClosing.totalCash.toFixed(2)} €</strong>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-400">Descuentos Aplicados:</span>
                    <strong className="text-rose-400 font-bold">-{viewingClosing.totalDiscounts.toFixed(2)} €</strong>
                  </div>
                  {viewingClosing.discountReason && (
                    <div className="text-[11px] text-stone-400 pl-2">
                      ↳ Motivo: {viewingClosing.discountReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-400">Invitaciones / Cortesías:</span>
                    <strong className="text-amber-400 font-bold">{viewingClosing.totalInvitations.toFixed(2)} €</strong>
                  </div>
                  {viewingClosing.invitationDetails && (
                    <div className="text-[11px] text-stone-400 pl-2">
                      ↳ Detalle: {viewingClosing.invitationDetails}
                    </div>
                  )}

                  {viewingClosing.tips > 0 && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                      <span className="text-stone-400">Propinas Declaradas:</span>
                      <strong className="text-emerald-400 font-bold">{viewingClosing.tips.toFixed(2)} €</strong>
                    </div>
                  )}
                </div>

                {viewingClosing.notes && (
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300 space-y-1">
                    <span className="text-stone-500 text-[10px] uppercase block">Notas del Turno:</span>
                    <p>{viewingClosing.notes}</p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cierre validado en el Banco de Datos de Operations Hub.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={() => handleCopyReport(viewingClosing)}
                className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                  copiedId === viewingClosing.id
                    ? 'bg-emerald-950 border-emerald-600 text-emerald-300 font-bold'
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-700'
                }`}
              >
                {copiedId === viewingClosing.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>✓ Resumen Copiado al Portapapeles</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-400" />
                    <span>Copiar Reporte para Dirección / WhatsApp</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setViewingClosing(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 text-stone-300 font-mono text-xs hover:bg-stone-750"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
