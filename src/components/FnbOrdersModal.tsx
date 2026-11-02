import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  Calendar,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Check
} from 'lucide-react';
import {
  FnbOrder,
  OrderLineItem,
  OrderCategory,
  SUPPLIERS_CATALOG,
  CATALOG_PRODUCTS_BY_CATEGORY,
  fnbOrdersService,
  SupplierEntity
} from '../services/fnbOrdersService';

interface FnbOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  hotelName: string;
  authorName?: string;
}

export const FnbOrdersModal: React.FC<FnbOrdersModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  hotelName,
  authorName = 'Antonio González'
}) => {
  // Pestaña activa: 'nuevo' | 'historial' | 'proveedores'
  const [activeTab, setActiveTab] = useState<'nuevo' | 'historial' | 'proveedores'>('nuevo');

  // Pedidos cargados desde el servicio
  const [orders, setOrders] = useState<FnbOrder[]>(() => {
    return fnbOrdersService.getOrdersForHotel(hotelId);
  });

  // Notificación de éxito
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulario de nuevo pedido
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(SUPPLIERS_CATALOG[0].id);
  const [selectedStationKey, setSelectedStationKey] = useState<string>('caliente');
  const [deliveryDate, setDeliveryDate] = useState<string>(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [deliveryNotes, setDeliveryNotes] = useState<string>('Entrega en muelle central de cocina. Albarán con lote y fecha.');
  const [lineItems, setLineItems] = useState<OrderLineItem[]>([
    { id: 'l-1', name: 'Entrecot de Novillo Madurado (piezas 250g)', quantity: 12, unit: 'kg', estimatedUnitCost: 18.5, notes: 'Envasado al vacío por piezas' },
    { id: 'l-2', name: 'Solomillo de Cerdo Ibérico entero', quantity: 6, unit: 'kg', estimatedUnitCost: 12.8, notes: 'Fresco de primera calidad' }
  ]);

  // Selección rápida de producto del catálogo
  const [quickProductName, setQuickProductName] = useState('');
  const [quickProductQty, setQuickProductQty] = useState('5');
  const [quickProductUnit, setQuickProductUnit] = useState<OrderLineItem['unit']>('kg');

  // Filtros en historial
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<string>('todos');

  // Proveedor seleccionado
  const currentSupplier = useMemo(() => {
    return SUPPLIERS_CATALOG.find(s => s.id === selectedSupplierId) || SUPPLIERS_CATALOG[0];
  }, [selectedSupplierId]);

  // Productos sugeridos para este proveedor
  const suggestedProducts = useMemo(() => {
    return CATALOG_PRODUCTS_BY_CATEGORY[currentSupplier.category] || [];
  }, [currentSupplier]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Añadir línea rápida
  const handleAddLineItem = () => {
    if (!quickProductName.trim()) return;
    const qty = parseFloat(quickProductQty) || 1;
    const catalogMatch = suggestedProducts.find(p => p.name === quickProductName);

    const newLine: OrderLineItem = {
      id: `l-${Date.now()}`,
      name: quickProductName.trim(),
      quantity: qty,
      unit: quickProductUnit,
      estimatedUnitCost: catalogMatch?.typicalCost || 0
    };

    setLineItems(prev => [...prev, newLine]);
    setQuickProductName('');
    setQuickProductQty('5');
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  // Calcular coste total estimado
  const totalEstimated = lineItems.reduce((acc, curr) => {
    return acc + (curr.quantity * (curr.estimatedUnitCost || 0));
  }, 0);

  // Crear y confirmar / enviar pedido
  const handleConfirmAndSend = (isDirectSend: boolean) => {
    if (lineItems.length === 0) {
      alert('Debe añadir al menos un artículo al pedido.');
      return;
    }

    const stationNamesMap: Record<string, string> = {
      cafeteria: 'Cafetería & Desayunos',
      frio: 'Cuarto Frío & Ensaladas',
      caliente: 'Cocina Caliente',
      manana: 'Partida Mañana',
      tarde: 'Partida Tarde',
      barmitonio: 'Barmitonio & Limpieza',
      general: 'Cocina General'
    };

    const newOrder = fnbOrdersService.createOrder(hotelId, {
      hotelId,
      hotelName,
      stationKey: selectedStationKey,
      stationName: stationNamesMap[selectedStationKey] || 'Cocina Central',
      supplierId: currentSupplier.id,
      supplierName: currentSupplier.name,
      category: currentSupplier.category,
      categoryLabel: currentSupplier.categoryLabel,
      requestedDeliveryDate: deliveryDate,
      items: lineItems,
      status: isDirectSend ? 'enviado' : 'confirmado',
      authorName,
      authorRole: 'Chef de Cocina',
      deliveryNotes,
      totalEstimatedCost: totalEstimated,
      sentAt: isDirectSend ? new Date().toISOString() : undefined,
      confirmedAt: new Date().toISOString()
    });

    const updated = fnbOrdersService.getOrdersForHotel(hotelId);
    setOrders(updated);
    setActiveTab('historial');
    showNotification(
      isDirectSend
        ? `Pedido ${newOrder.orderNumber} enviado a ${currentSupplier.name} por ${authorName}.`
        : `Pedido ${newOrder.orderNumber} confirmado correctamente en almacén.`
    );

    // Resetear formulario para el siguiente
    setLineItems([]);
  };

  // Cambiar estado en historial
  const handleMarkDelivered = (orderId: string) => {
    fnbOrdersService.updateOrderStatus(hotelId, orderId, 'recibido_conforme');
    setOrders(fnbOrdersService.getOrdersForHotel(hotelId));
    showNotification('Pedido recepcionado conforme en muelle de cocina.');
  };

  // Filtrado de historial
  const filteredHistory = orders.filter(ord => {
    if (historyFilterStatus !== 'todos' && ord.status !== historyFilterStatus) return false;
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return ord.orderNumber.toLowerCase().includes(q) ||
      ord.supplierName.toLowerCase().includes(q) ||
      ord.stationName.toLowerCase().includes(q) ||
      ord.items.some(i => i.name.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-6xl bg-[#F8F9FA] text-[#2C3E50] rounded-3xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Cabecera Institucional (#1A2530) */}
        <div className="bg-[#1A2530] text-white px-6 py-4 flex items-center justify-between border-b border-[#2C3E50] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                  MÓDULO DE PEDIDOS F&B
                </span>
                <span className="text-xs text-white/70">{hotelName}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Gestión de Pedidos & Aprovisionamiento a Proveedores
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación Toast flotante si existe */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Selector de Pestañas Estandarizado (Fondo Gris Hielo #F8F9FA, Tipografía Carbón #2C3E50) */}
        <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('nuevo')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'nuevo'
                  ? 'bg-[#1A2530] text-white shadow-xs'
                  : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-slate-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Confeccionar Nuevo Pedido</span>
            </button>

            <button
              onClick={() => setActiveTab('historial')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'historial'
                  ? 'bg-[#1A2530] text-white shadow-xs'
                  : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Historial & Albaranes ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('proveedores')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'proveedores'
                  ? 'bg-[#1A2530] text-white shadow-xs'
                  : 'bg-white text-[#2C3E50] border border-[#E2E8F0] hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Directorio Proveedores Homologados</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#2C3E50]/70 font-medium">
            <span>Operador:</span>
            <span className="font-bold text-[#2C3E50] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
              {authorName}
            </span>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: FONDO GRIS HIELO (#F8F9FA), TIPOGRAFÍA CARBÓN (#2C3E50) */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F8F9FA] text-[#2C3E50]">
          
          {/* ===================================================================
              PESTAÑA 1: CONFECCIONAR NUEVO PEDIDO
              =================================================================== */}
          {activeTab === 'nuevo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Columna Izquierda: Parámetros del Pedido */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Datos del Pedido</span>
                  </h3>

                  {/* Selector de Proveedor */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] mb-1">
                      Proveedor Homologado:
                    </label>
                    <select
                      value={selectedSupplierId}
                      onChange={e => setSelectedSupplierId(e.target.value)}
                      className="w-full text-xs font-medium bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      {SUPPLIERS_CATALOG.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.categoryLabel})
                        </option>
                      ))}
                    </select>
                    <div className="mt-1.5 p-2 rounded-lg bg-[#F8F9FA] border border-[#E2E8F0] text-[11px] text-[#2C3E50]/80 space-y-0.5">
                      <div><strong>Contacto:</strong> {currentSupplier.contactPerson} · {currentSupplier.phone}</div>
                      <div><strong>Reparto:</strong> {currentSupplier.deliveryDays}</div>
                    </div>
                  </div>

                  {/* Partida / Casilla Receptora */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] mb-1">
                      Partida de Cocina Destino:
                    </label>
                    <select
                      value={selectedStationKey}
                      onChange={e => setSelectedStationKey(e.target.value)}
                      className="w-full text-xs font-medium bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="cafeteria">1. Cafetería</option>
                      <option value="frio">2. Frío</option>
                      <option value="caliente">3. Caliente</option>
                      <option value="manana">4. Mañana</option>
                      <option value="tarde">5. Tarde</option>
                      <option value="barmitonio">6. Barmitonio</option>
                      <option value="general">Cocina General / Economato</option>
                    </select>
                  </div>

                  {/* Fecha de Entrega Requerida */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] mb-1">
                      Fecha de Entrega Requerida:
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={e => setDeliveryDate(e.target.value)}
                      className="w-full text-xs font-medium bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  {/* Notas de Entrega */}
                  <div>
                    <label className="block text-xs font-bold text-[#2C3E50] mb-1">
                      Instrucciones de Descarga / Muelle:
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={e => setDeliveryNotes(e.target.value)}
                      className="w-full text-xs font-medium bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                </div>

                {/* Catálogo Rápido del Proveedor */}
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-[#2C3E50] uppercase tracking-wider">
                    Sugerencias Frecuentes ({currentSupplier.categoryLabel}):
                  </h4>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                    {suggestedProducts.map(p => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setQuickProductName(p.name);
                          setQuickProductUnit(p.unit);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#F8F9FA] hover:bg-slate-200 border border-[#E2E8F0] text-[11px] text-[#2C3E50] text-left transition-colors"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Líneas de Pedido y Botón ORO SUAVE */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                    <h3 className="text-sm font-bold text-[#2C3E50] uppercase tracking-wider flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-slate-500" />
                      <span>Artículos del Pedido ({lineItems.length})</span>
                    </h3>
                    <span className="text-xs text-[#2C3E50]/70 font-medium">
                      Total Estimado: <strong className="text-[#2C3E50] font-mono text-sm">{totalEstimated.toFixed(2)} €</strong>
                    </span>
                  </div>

                  {/* Fila para Añadir Artículo */}
                  <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E2E8F0] grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-12 sm:col-span-6">
                      <label className="block text-[11px] font-bold text-[#2C3E50] mb-1">
                        Producto / Descripción:
                      </label>
                      <input
                        type="text"
                        value={quickProductName}
                        onChange={e => setQuickProductName(e.target.value)}
                        placeholder="Ej. Solomillo de novillo limpio..."
                        className="w-full text-xs font-medium bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#2C3E50] focus:outline-none"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#2C3E50] mb-1">
                        Cantidad:
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={quickProductQty}
                        onChange={e => setQuickProductQty(e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#2C3E50] focus:outline-none"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#2C3E50] mb-1">
                        Unidad:
                      </label>
                      <select
                        value={quickProductUnit}
                        onChange={e => setQuickProductUnit(e.target.value as any)}
                        className="w-full text-xs font-medium bg-white border border-[#E2E8F0] rounded-lg px-2 py-1.5 text-[#2C3E50] focus:outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="l">litros</option>
                        <option value="caja">caja</option>
                        <option value="ud">unidades</option>
                        <option value="bolsa">bolsa</option>
                        <option value="bote">bote</option>
                      </select>
                    </div>

                    <div className="col-span-12 sm:col-span-2">
                      <button
                        onClick={handleAddLineItem}
                        className="w-full py-1.5 rounded-lg bg-[#1A2530] text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabla de Artículos Añadidos */}
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F8F9FA] text-[#2C3E50] font-bold border-b border-[#E2E8F0]">
                          <th className="py-2.5 px-3">Artículo</th>
                          <th className="py-2.5 px-3 w-24 text-center">Cantidad</th>
                          <th className="py-2.5 px-3 w-24 text-right">Coste Est.</th>
                          <th className="py-2.5 px-3 w-28 text-right">Subtotal</th>
                          <th className="py-2.5 px-3 w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {lineItems.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[#2C3E50]/60">
                              No hay artículos en la comanda. Seleccione o escriba productos arriba.
                            </td>
                          </tr>
                        ) : (
                          lineItems.map(item => {
                            const subtotal = item.quantity * (item.estimatedUnitCost || 0);
                            return (
                              <tr key={item.id} className="hover:bg-slate-50/80">
                                <td className="py-2.5 px-3">
                                  <div className="font-semibold text-[#2C3E50]">{item.name}</div>
                                  {item.notes && (
                                    <div className="text-[10px] text-slate-500">{item.notes}</div>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                                  {item.estimatedUnitCost ? `${item.estimatedUnitCost.toFixed(2)} €` : '—'}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2C3E50]">
                                  {subtotal ? `${subtotal.toFixed(2)} €` : '—'}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => handleRemoveLineItem(item.id)}
                                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Quitar artículo"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Resumen Final y BOTONES ORO SUAVE (#C5A880) EXCLUSIVOS */}
                  <div className="bg-[#F8F9FA] p-4 rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs space-y-0.5 text-[#2C3E50]">
                      <div>Proveedor: <strong>{currentSupplier.name}</strong></div>
                      <div>Entrega: <strong>{deliveryDate}</strong> · Partida: <strong>{selectedStationKey.toUpperCase()}</strong></div>
                    </div>

                    {/* BOTONES CON ACENTO ORO SUAVE (#C5A880) EXCLUSIVO SEGÚN DIRECTRIZ */}
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleConfirmAndSend(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#C5A880] hover:brightness-105 active:scale-98 text-[#1A2530] font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all"
                        title="Guardar y confirmar pedido internamente"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#1A2530]" />
                        <span>Confirmar Pedido</span>
                      </button>

                      <button
                        onClick={() => handleConfirmAndSend(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#C5A880] hover:brightness-105 active:scale-98 text-[#1A2530] font-extrabold text-xs flex items-center gap-2 shadow-md transition-all border border-[#1A2530]/20"
                        title="Enviar formalmente el pedido por correo al proveedor"
                      >
                        <Send className="w-4 h-4 text-[#1A2530]" />
                        <span>Enviar a Proveedor</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              PESTAÑA 2: HISTORIAL DE PEDIDOS & ALBARANES
              =================================================================== */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              {/* Filtros de Historial */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2C3E50]">Estado:</span>
                  <select
                    value={historyFilterStatus}
                    onChange={e => setHistoryFilterStatus(e.target.value)}
                    className="text-xs bg-[#F8F9FA] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[#2C3E50] focus:outline-none"
                  >
                    <option value="todos">Todos los pedidos</option>
                    <option value="enviado">Enviados</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="recibido_conforme">Recibidos Conforme</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={historySearch}
                    onChange={e => setHistorySearch(e.target.value)}
                    placeholder="Buscar por albarán, proveedor..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8F9FA] text-[#2C3E50] w-60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Listado de Pedidos */}
              <div className="space-y-3">
                {filteredHistory.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E8F0] text-slate-500">
                    No se encontraron pedidos registrados con los filtros actuales.
                  </div>
                ) : (
                  filteredHistory.map(ord => (
                    <div
                      key={ord.id}
                      className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs bg-[#1A2530] text-white px-2 py-0.5 rounded">
                            {ord.orderNumber}
                          </span>
                          <span className="font-bold text-sm text-[#2C3E50]">
                            {ord.supplierName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ({ord.categoryLabel})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            ord.status === 'recibido_conforme'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.status === 'enviado'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {ord.status === 'recibido_conforme'
                              ? 'RECIBIDO CONFORME'
                              : ord.status === 'enviado'
                              ? 'ENVIADO A PROVEEDOR'
                              : 'CONFIRMADO'}
                          </span>

                          {ord.status !== 'recibido_conforme' && (
                            <button
                              onClick={() => handleMarkDelivered(ord.id)}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors"
                            >
                              Recepcionar
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Detalles del Pedido */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#2C3E50]/80">
                        <div><strong>Partida:</strong> {ord.stationName}</div>
                        <div><strong>Fecha Entrega:</strong> {ord.requestedDeliveryDate}</div>
                        <div><strong>Autor:</strong> {ord.authorName} ({new Date(ord.createdAt).toLocaleDateString()})</div>
                      </div>

                      {/* Líneas resumidas */}
                      <div className="bg-[#F8F9FA] p-3 rounded-xl border border-[#E2E8F0]">
                        <div className="text-[11px] font-bold text-[#2C3E50] mb-1">
                          Artículos solicitados ({ord.items.length}):
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {ord.items.map(it => (
                            <span key={it.id} className="bg-white px-2 py-1 rounded border border-[#E2E8F0] text-[#2C3E50]">
                              <strong>{it.quantity} {it.unit}</strong> {it.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {ord.deliveryNotes && (
                        <div className="text-[11px] text-slate-500 italic">
                          Instrucciones: {ord.deliveryNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===================================================================
              PESTAÑA 3: DIRECTORIO DE PROVEEDORES HOMOLOGADOS
              =================================================================== */}
          {activeTab === 'proveedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUPPLIERS_CATALOG.map(sup => (
                <div
                  key={sup.id}
                  className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#2C3E50]">
                      {sup.categoryLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Lead: {sup.leadTimeHours}h
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#2C3E50]">
                      {sup.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Contacto: <strong>{sup.contactPerson}</strong>
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-[#2C3E50]/80 pt-2 border-t border-[#E2E8F0]">
                    <div>📞 {sup.phone}</div>
                    <div>✉️ {sup.email}</div>
                    <div>🚚 <strong>Días de reparto:</strong> {sup.deliveryDays}</div>
                    {sup.minOrderCost && (
                      <div>💶 Pedido mínimo: {sup.minOrderCost} €</div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSupplierId(sup.id);
                      setActiveTab('nuevo');
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#1A2530] text-white hover:bg-slate-800 text-xs font-bold transition-colors"
                  >
                    Hacer Pedido a este Proveedor
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
