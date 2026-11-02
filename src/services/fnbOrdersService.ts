/**
 * SERVICIO: GESTIÓN ESTRUCTURAL DE PEDIDOS F&B A PROVEEDORES
 * Homogeneizado con diseño de la plataforma:
 * - Fondo: Gris Hielo (#F8F9FA)
 * - Tipografía: Carbón (#2C3E50)
 * - Color de Acento Oro Suave (#C5A880): EXCLUSIVAMENTE para botones de 'Confirmar Pedido' o 'Enviar a Proveedor'.
 */

export type OrderCategory = 
  | 'carnes'
  | 'pescados'
  | 'frutas_verduras'
  | 'lacteos'
  | 'economato_secos'
  | 'bebidas_bodega'
  | 'quimicos_limpieza';

export interface OrderLineItem {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'l' | 'ud' | 'caja' | 'manojo' | 'bolsa' | 'bote';
  estimatedUnitCost?: number;
  notes?: string;
}

export interface SupplierEntity {
  id: string;
  name: string;
  category: OrderCategory;
  categoryLabel: string;
  contactPerson: string;
  phone: string;
  email: string;
  deliveryDays: string;
  leadTimeHours: number;
  minOrderCost?: number;
}

export interface FnbOrder {
  id: string;
  orderNumber: string; // ej: "PED-2026-0812"
  hotelId: string;
  hotelName: string;
  stationKey: string;
  stationName: string;
  supplierId: string;
  supplierName: string;
  category: OrderCategory;
  categoryLabel: string;
  createdAt: string;
  requestedDeliveryDate: string;
  deliveryTimeWindow?: string;
  items: OrderLineItem[];
  status: 'borrador' | 'enviado' | 'confirmado' | 'recibido_conforme' | 'con_incidencia';
  authorName: string;
  authorRole: string;
  deliveryNotes?: string;
  totalEstimatedCost?: number;
  sentAt?: string;
  confirmedAt?: string;
}

export const SUPPLIERS_CATALOG: SupplierEntity[] = [
  {
    id: 'sup-carnicas',
    name: 'Cárnicas & Elaborados Guía de Isora S.L.',
    category: 'carnes',
    categoryLabel: 'Carnes, Aves e Ibéricos',
    contactPerson: 'Manuel Ramos',
    phone: '+34 922 860 120',
    email: 'pedidos@carnicasguia.es',
    deliveryDays: 'Diario (Lunes a Sábado)',
    leadTimeHours: 14,
    minOrderCost: 150
  },
  {
    id: 'sup-pescados',
    name: 'Pescados & Mariscos Atlántico Sur',
    category: 'pescados',
    categoryLabel: 'Pescados Frescos de Lonja & Mariscos',
    contactPerson: 'Elena Bethencourt',
    phone: '+34 922 790 415',
    email: 'lonja@pescadosatlanticosur.com',
    deliveryDays: 'Diario a primera hora (06:30)',
    leadTimeHours: 12,
    minOrderCost: 180
  },
  {
    id: 'sup-frutas',
    name: 'Frutas & Hortalizas El Rincón Insular',
    category: 'frutas_verduras',
    categoryLabel: 'Frutas, Verduras & Huerta Km0',
    contactPerson: 'Domingo Hernández',
    phone: '+34 922 712 334',
    email: 'pedidos@elrinconinsular.com',
    deliveryDays: 'Lunes a Sábado (Mañana y Tarde)',
    leadTimeHours: 10,
    minOrderCost: 90
  },
  {
    id: 'sup-lacteos',
    name: 'Distribuciones Lácteas & Quesos de Canarias',
    category: 'lacteos',
    categoryLabel: 'Lácteos, Mantequillas & Huevos Frescos',
    contactPerson: 'Carla Morales',
    phone: '+34 922 554 901',
    email: 'ventas@lacteoscanarias.es',
    deliveryDays: 'Lunes, Miércoles, Viernes',
    leadTimeHours: 24,
    minOrderCost: 100
  },
  {
    id: 'sup-economato',
    name: 'Makro / Central de Economato Mayorista',
    category: 'economato_secos',
    categoryLabel: 'Secos, Conservas, Harinas & Aceites',
    contactPerson: 'Javier Navarro',
    phone: '+34 922 680 000',
    email: 'hosteleria@makro-tenerife.es',
    deliveryDays: 'Martes y Jueves',
    leadTimeHours: 48,
    minOrderCost: 350
  },
  {
    id: 'sup-bodega',
    name: 'Bodegas & Vinos Insulares de Tenerife',
    category: 'bebidas_bodega',
    categoryLabel: 'Vinos D.O., Cavas, Cervezas & Licores',
    contactPerson: 'Sara Monje',
    phone: '+34 922 560 780',
    email: 'bodega@vinosinsulares.com',
    deliveryDays: 'Miércoles y Sábados',
    leadTimeHours: 36,
    minOrderCost: 200
  }
];

export const CATALOG_PRODUCTS_BY_CATEGORY: Record<OrderCategory, { name: string; unit: OrderLineItem['unit']; typicalCost: number }[]> = {
  carnes: [
    { name: 'Entrecot de Novillo Madurado (piezas 250g)', unit: 'kg', typicalCost: 18.5 },
    { name: 'Solomillo de Cerdo Ibérico entero', unit: 'kg', typicalCost: 12.8 },
    { name: 'Muslo de Pollo de Corral deshuesado', unit: 'kg', typicalCost: 6.4 },
    { name: 'Pechuga de Pavo limpia', unit: 'kg', typicalCost: 7.2 },
    { name: 'Carrilleras de Ternera seleccionadas', unit: 'kg', typicalCost: 11.9 },
    { name: 'Chuletillas de Cordero Lechal', unit: 'kg', typicalCost: 21.0 },
    { name: 'Secreto Ibérico Bellota', unit: 'kg', typicalCost: 16.5 },
    { name: 'Hamburguesa Vaca Madurada 180g', unit: 'caja', typicalCost: 48.0 },
    { name: 'Panceta Ibérica curada', unit: 'kg', typicalCost: 8.9 },
    { name: 'Chorizo Palmero fresco', unit: 'kg', typicalCost: 7.8 }
  ],
  pescados: [
    { name: 'Lubina de estero fresca 400-600g', unit: 'kg', typicalCost: 10.5 },
    { name: 'Dorada salvaje ración limpia', unit: 'kg', typicalCost: 11.2 },
    { name: 'Lomo de Salmón Noruego Superior sin espinas', unit: 'kg', typicalCost: 16.8 },
    { name: 'Cherne Negro Canario en rodajas', unit: 'kg', typicalCost: 22.0 },
    { name: 'Atún Rojo Atlántico (lomo limpio para tataki)', unit: 'kg', typicalCost: 28.5 },
    { name: 'Bacalao desalado lomos 180g', unit: 'kg', typicalCost: 19.5 },
    { name: 'Calamar Nacional fresco mediano', unit: 'kg', typicalCost: 14.5 },
    { name: 'Pulpo Cocido patas extra (bandeja)', unit: 'kg', typicalCost: 24.0 },
    { name: 'Langostino Tigre 20/30 congelado a bordo', unit: 'caja', typicalCost: 38.0 },
    { name: 'Mejillón de batea gallego limpio', unit: 'kg', typicalCost: 3.8 }
  ],
  frutas_verduras: [
    { name: 'Plátano de Canarias I.G.P. maduración media', unit: 'caja', typicalCost: 26.0 },
    { name: 'Aguacate Hass local de temporada', unit: 'kg', typicalCost: 5.8 },
    { name: 'Tomate Ensalada Canario maduro en rama', unit: 'caja', typicalCost: 18.0 },
    { name: 'Patata Monalisa saco 25kg', unit: 'caja', typicalCost: 22.5 },
    { name: 'Cebolla blanca dulce saco 15kg', unit: 'caja', typicalCost: 14.0 },
    { name: 'Calabacín fresco de huerta', unit: 'kg', typicalCost: 1.8 },
    { name: 'Zanahoria fresca limpia manojo', unit: 'kg', typicalCost: 1.4 },
    { name: 'Puerro blanco fresco', unit: 'kg', typicalCost: 2.3 },
    { name: 'Espinaca baby tierna lavada 1kg', unit: 'bolsa', typicalCost: 6.5 },
    { name: 'Champiñón Portobello entero', unit: 'caja', typicalCost: 12.0 },
    { name: 'Naranja de zumo para máquina', unit: 'caja', typicalCost: 24.0 },
    { name: 'Limón de mesa con hoja', unit: 'caja', typicalCost: 16.0 }
  ],
  lacteos: [
    { name: 'Leche entera pasteurizada 1L (caja 12)', unit: 'caja', typicalCost: 13.8 },
    { name: 'Leche semidesnatada 1L (caja 12)', unit: 'caja', typicalCost: 13.8 },
    { name: 'Leche sin lactosa 1L (caja 12)', unit: 'caja', typicalCost: 15.2 },
    { name: 'Nata culinaria 35% M.G. 1L', unit: 'l', typicalCost: 4.8 },
    { name: 'Mantequilla en bloque tradicional 1kg', unit: 'kg', typicalCost: 8.9 },
    { name: 'Queso majorero semicurado con pimentón', unit: 'kg', typicalCost: 16.5 },
    { name: 'Queso Parmigiano Reggiano D.O.P. 24m cuña', unit: 'kg', typicalCost: 24.0 },
    { name: 'Queso Mozzarella rallada especial gratinar 2kg', unit: 'bolsa', typicalCost: 14.5 },
    { name: 'Huevos de corral clase L (caja 30 docenas)', unit: 'caja', typicalCost: 52.0 },
    { name: 'Yogur natural cremoso cubo 5kg', unit: 'bote', typicalCost: 12.5 }
  ],
  economato_secos: [
    { name: 'Aceite de Oliva Virgen Extra garrafa 5L', unit: 'bote', typicalCost: 42.0 },
    { name: 'Aceite de Girasol alto oleico 25L para freidoras', unit: 'bote', typicalCost: 48.0 },
    { name: 'Arroz Bomba D.O. saco 5kg', unit: 'bolsa', typicalCost: 16.5 },
    { name: 'Pasta italiana De Cecco spaghetti saco 5kg', unit: 'bolsa', typicalCost: 12.0 },
    { name: 'Harina de trigo fuerza W300 saco 25kg', unit: 'caja', typicalCost: 28.0 },
    { name: 'Sal marina fina de Las Salinas saco 25kg', unit: 'caja', typicalCost: 8.5 },
    { name: 'Azúcar blanco refinado saco 25kg', unit: 'caja', typicalCost: 26.0 },
    { name: 'Café natural en grano arábica 100% 1kg', unit: 'bolsa', typicalCost: 18.5 },
    { name: 'Cacao en polvo alcalinizado puro 1kg', unit: 'bote', typicalCost: 11.2 }
  ],
  bebidas_bodega: [
    { name: 'Vino Tinto Listán Negro D.O. Tacoronte (caja 6)', unit: 'caja', typicalCost: 48.0 },
    { name: 'Vino Blanco Seco Malvasía Aromática (caja 6)', unit: 'caja', typicalCost: 54.0 },
    { name: 'Cava Brut Nature Reserva (caja 6)', unit: 'caja', typicalCost: 45.0 },
    { name: 'Cerveza barril 50L rubia especial', unit: 'bote', typicalCost: 110.0 },
    { name: 'Agua mineral natural sin gas 1.5L (caja 12)', unit: 'caja', typicalCost: 8.4 }
  ],
  quimicos_limpieza: [
    { name: 'Detergente Lavavajillas Automático 20L', unit: 'bote', typicalCost: 38.0 },
    { name: 'Abrillantador Máquina Túnel 10L', unit: 'bote', typicalCost: 26.0 },
    { name: 'Desengrasante Enérgico Hornos y Planchas 5L', unit: 'bote', typicalCost: 22.0 },
    { name: 'Desinfectante Clorado Superficies Alimentarias 5L', unit: 'bote', typicalCost: 14.5 }
  ]
};

export const INITIAL_ORDERS: FnbOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'PED-2026-0812',
    hotelId: 'model-bitacora',
    hotelName: 'Hotel Bitácora',
    stationKey: 'caliente',
    stationName: 'Cocina Caliente',
    supplierId: 'sup-carnicas',
    supplierName: 'Cárnicas & Elaborados Guía de Isora S.L.',
    category: 'carnes',
    categoryLabel: 'Carnes, Aves e Ibéricos',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    requestedDeliveryDate: new Date(Date.now() + 3600000 * 12).toISOString().slice(0, 10),
    deliveryTimeWindow: '07:30 - 09:00',
    status: 'enviado',
    authorName: 'Antonio González',
    authorRole: 'Chef Ejecutivo',
    deliveryNotes: 'Descarga en muelle de mercancías planta -1. Adjuntar albarán por duplicado.',
    totalEstimatedCost: 412.5,
    items: [
      { id: 'item-1', name: 'Entrecot de Novillo Madurado (piezas 250g)', quantity: 15, unit: 'kg', estimatedUnitCost: 18.5 },
      { id: 'item-2', name: 'Solomillo de Cerdo Ibérico entero', quantity: 8, unit: 'kg', estimatedUnitCost: 12.8 },
      { id: 'item-3', name: 'Muslo de Pollo de Corral deshuesado', quantity: 5, unit: 'kg', estimatedUnitCost: 6.4 }
    ]
  },
  {
    id: 'ord-002',
    orderNumber: 'PED-2026-0813',
    hotelId: 'model-bitacora',
    hotelName: 'Hotel Bitácora',
    stationKey: 'frio',
    stationName: 'Cuarto Frío & Ensaladas',
    supplierId: 'sup-frutas',
    supplierName: 'Frutas & Hortalizas El Rincón Insular',
    category: 'frutas_verduras',
    categoryLabel: 'Frutas, Verduras & Huerta Km0',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    requestedDeliveryDate: new Date(Date.now() + 3600000 * 14).toISOString().slice(0, 10),
    deliveryTimeWindow: '07:00 - 08:30',
    status: 'confirmado',
    authorName: 'Antonio González',
    authorRole: 'Chef Ejecutivo',
    deliveryNotes: 'Verdura de primera frescura para pase de almuerzo y show cooking.',
    totalEstimatedCost: 198.0,
    items: [
      { id: 'item-4', name: 'Tomate Ensalada Canario maduro en rama', quantity: 4, unit: 'caja', estimatedUnitCost: 18.0 },
      { id: 'item-5', name: 'Aguacate Hass local de temporada', quantity: 10, unit: 'kg', estimatedUnitCost: 5.8 },
      { id: 'item-6', name: 'Calabacín fresco de huerta', quantity: 12, unit: 'kg', estimatedUnitCost: 1.8 },
      { id: 'item-7', name: 'Espinaca baby tierna lavada 1kg', quantity: 7, unit: 'bolsa', estimatedUnitCost: 6.5 }
    ]
  },
  {
    id: 'ord-003',
    orderNumber: 'PED-2026-0814',
    hotelId: 'model-vulcano',
    hotelName: 'Hotel Vulcano',
    stationKey: 'cafeteria',
    stationName: 'Cafetería & Desayunos',
    supplierId: 'sup-lacteos',
    supplierName: 'Distribuciones Lácteas & Quesos de Canarias',
    category: 'lacteos',
    categoryLabel: 'Lácteos, Mantequillas & Huevos Frescos',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    requestedDeliveryDate: new Date(Date.now() + 3600000 * 24).toISOString().slice(0, 10),
    deliveryTimeWindow: '06:45 - 08:00',
    status: 'enviado',
    authorName: 'Giacomo Longo',
    authorRole: 'Chef Ejecutivo',
    deliveryNotes: 'Garantizar cadena de frío a recepción (<4°C en caja isotérmica).',
    totalEstimatedCost: 284.4,
    items: [
      { id: 'item-8', name: 'Leche entera pasteurizada 1L (caja 12)', quantity: 8, unit: 'caja', estimatedUnitCost: 13.8 },
      { id: 'item-9', name: 'Leche sin lactosa 1L (caja 12)', quantity: 4, unit: 'caja', estimatedUnitCost: 15.2 },
      { id: 'item-10', name: 'Huevos de corral clase L (caja 30 docenas)', quantity: 2, unit: 'caja', estimatedUnitCost: 52.0 }
    ]
  }
];

export const fnbOrdersService = {
  getOrdersForHotel(hotelId: string): FnbOrder[] {
    try {
      const storageKey = `proa_fnb_orders_${hotelId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading orders from storage:', e);
    }

    // Adaptar pedidos iniciales al hotel correspondiente
    const hotelOrders = INITIAL_ORDERS.filter(o => o.hotelId === hotelId || o.hotelId.includes(hotelId.replace('model-', '')));
    if (hotelOrders.length === 0) {
      const fallbackOrder = {
        ...INITIAL_ORDERS[0],
        id: `ord-${Date.now()}`,
        hotelId,
        hotelName: hotelId.includes('vulcano') ? 'Hotel Vulcano' : 'Hotel Bitácora',
        authorName: hotelId.includes('vulcano') ? 'Giacomo Longo' : 'Antonio González'
      };
      this.saveOrdersForHotel(hotelId, [fallbackOrder]);
      return [fallbackOrder];
    }

    this.saveOrdersForHotel(hotelId, hotelOrders);
    return hotelOrders;
  },

  saveOrdersForHotel(hotelId: string, orders: FnbOrder[]): void {
    try {
      const storageKey = `proa_fnb_orders_${hotelId}`;
      localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  },

  createOrder(hotelId: string, order: Omit<FnbOrder, 'id' | 'orderNumber' | 'createdAt'>): FnbOrder {
    const orders = this.getOrdersForHotel(hotelId);
    const orderSeq = Math.floor(1000 + Math.random() * 9000);
    const newOrder: FnbOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: `PED-2026-${orderSeq}`,
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.saveOrdersForHotel(hotelId, orders);
    return newOrder;
  },

  confirmAndSendOrder(hotelId: string, orderId: string, operatorName: string): FnbOrder | null {
    const orders = this.getOrdersForHotel(hotelId);
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index] = {
        ...orders[index],
        status: 'enviado',
        sentAt: new Date().toISOString(),
        authorName: operatorName
      };
      this.saveOrdersForHotel(hotelId, orders);
      return orders[index];
    }
    return null;
  },

  updateOrderStatus(hotelId: string, orderId: string, status: FnbOrder['status']): FnbOrder | null {
    const orders = this.getOrdersForHotel(hotelId);
    const index = orders.findIndex(o => o.id === orderId);
    if (index >= 0) {
      orders[index].status = status;
      this.saveOrdersForHotel(hotelId, orders);
      return orders[index];
    }
    return null;
  }
};
