/**
 * FASE 7 – ENTIDAD INDEPENDIENTE DE PROMOCIONES Y HAPPY HOUR
 * Klayman Hospitality Management (Diamond & Olivina)
 * 
 * Centraliza la definición de promociones con:
 * - Nombre
 * - Hotel
 * - Centro de venta
 * - Fecha inicio y Fecha fin
 * - Hora inicio y Hora fin
 * - Productos incluidos (con precios normales y promocionales)
 * - Precio promocional
 * - Estado dinámico: Activa | Programada | Finalizada
 * 
 * Funcionalidades automáticas:
 * - Promociones activas en tiempo real
 * - Próxima promoción con cuenta atrás
 * - Promociones del día
 * - Filtros por hotel y centro de venta
 * - Relación bidireccional con productos del catálogo
 * - Alertas de Happy Hour (30 min antes, activa, finalizada)
 */

import { AGORA_MASTER_PRODUCTS } from './agoraPricesMaster';

export type PromotionStatus = 'Activa' | 'Programada' | 'Finalizada';

export interface PromotionProductLink {
  id: string;                  // ID único del producto en el catálogo maestro
  nombre: string;              // Nombre oficial del producto
  precioNormal: number;        // Tarifa ordinaria
  precioPromocional: number;   // Tarifa con descuento / Happy Hour
  precioHH?: number | null;    // Precio específico Happy Hour si aplica
  descuentoPorcentaje?: number;// Descuento calculado
  categoria?: string;          // Categoría del producto
  imageUrl?: string | null;    // Fotografía del producto
}

export interface PromotionEntityMaster {
  id: string;
  nombre: string;
  hotel: 'Klayman Diamond' | 'Klayman Olivina' | 'Ambos Establecimientos';
  hotelId: 'klayman-diamond' | 'klayman-olivina' | 'todos';
  centroVenta: string;         // 'Bar / Terraza Diamond', 'Sol Bar Olivina', etc.
  outletId: string;            // 'diamond-bar-terraza', 'olivina-bar-sol'
  fechaInicio: string;         // 'YYYY-MM-DD'
  fechaFin: string;            // 'YYYY-MM-DD'
  horaInicio: string;          // 'HH:mm'
  horaFin: string;             // 'HH:mm'
  diasSemana: number[];        // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  diasTexto: string;           // 'Diario', 'Lunes', 'Miércoles', 'Viernes', etc.
  productosIncluidos: PromotionProductLink[];
  precioPromocionalTexto: string; // '2x1', '3,00 € / Jarra', '6,00 € / Spritz', etc.
  precioPromocionalValor?: number;
  precioNormalTexto?: string;
  tipo: 'happy_hour' | 'dia_tematico' | 'oferta_especial';
  badge: string;               // 'OFERTA LUNES', 'HAPPY HOUR 2X1', etc.
  imageUrl?: string;
  descripcion: string;
  condiciones: string[];
  procedimientoTPV: string[];
  estadoManual?: PromotionStatus; // Por si se desea forzar estado
}

/**
 * MATRIZ OFICIAL DE PARÁMETROS OPERATIVOS KLAYMAN DIAMOND
 * Representación tabular exacta y exportable a CSV según directrices F&B
 */
export interface OperationalPromotionRow {
  dia: string;
  horaInicio: string;
  horaFin: string;
  tipo: 'Happy Hour' | 'Promoción';
  producto: string;
  precio: string;
  condicionesOperativas: string;
}

export const KLAYMAN_DIAMOND_OPERATIONAL_MATRIX: OperationalPromotionRow[] = [
  {
    dia: 'Lunes a Domingo',
    horaInicio: '15:00',
    horaFin: '16:00',
    tipo: 'Happy Hour',
    producto: '2 Cócteles (Margarita, Mojito, Blue, Piña, Aperol, Sex on the Beach)',
    precio: '12,00 €',
    condicionesOperativas: 'Mismo cóctel. Cero combinaciones mixtas.'
  },
  {
    dia: 'Lunes a Domingo',
    horaInicio: '15:00',
    horaFin: '16:00',
    tipo: 'Happy Hour',
    producto: '2 Jarras Dorada Especial',
    precio: '6,00 €',
    condicionesOperativas: 'Obligatorio par. Prohibido jarra suelta a 3€.'
  },
  {
    dia: 'Lunes',
    horaInicio: '08:00',
    horaFin: '22:00',
    tipo: 'Promoción',
    producto: 'Jarra Dorada Especial (50 cl)',
    precio: '3,00 €',
    condicionesOperativas: 'Incluye frutos secos tostados.'
  },
  {
    dia: 'Miércoles',
    horaInicio: '08:00',
    horaFin: '22:30',
    tipo: 'Promoción',
    producto: 'Spritz (Aperol, Campari, Limoncello, Hugo)',
    precio: '6,00 €',
    condicionesOperativas: '-'
  },
  {
    dia: 'Viernes',
    horaInicio: '10:00',
    horaFin: '22:00',
    tipo: 'Promoción',
    producto: 'Cócteles seleccionados (2x1)',
    precio: '-',
    condicionesOperativas: 'Tarifa 2x1 ininterrumpida.'
  },
  {
    dia: 'Domingo',
    horaInicio: '08:00',
    horaFin: '22:30',
    tipo: 'Promoción',
    producto: 'Mojitos (Tradicional, Fresa, Maracuyá, Virgin)',
    precio: '5,00 €',
    condicionesOperativas: '-'
  }
];

export const KLAYMAN_DIAMOND_CSV_RAW = `Día,Hora Inicio,Hora Fin,Tipo,Producto,Precio,Condiciones Operativas
Lunes a Domingo,15:00,16:00,Happy Hour,"2 Cócteles (Margarita, Mojito, Blue, Piña, Aperol, Sex on the Beach)","12,00 €",Mismo cóctel. Cero combinaciones mixtas.
Lunes a Domingo,15:00,16:00,Happy Hour,2 Jarras Dorada Especial,"6,00 €",Obligatorio par. Prohibido jarra suelta a 3€.
Lunes,08:00,22:00,Promoción,Jarra Dorada Especial (50 cl),"3,00 €",Incluye frutos secos tostados.
Miércoles,08:00,22:30,Promoción,"Spritz (Aperol, Campari, Limoncello, Hugo)","6,00 €",-
Viernes,10:00,22:00,Promoción,Cócteles seleccionados (2x1),-,Tarifa 2x1 ininterrumpida.
Domingo,08:00,22:30,Promoción,"Mojitos (Tradicional, Fresa, Maracuyá, Virgin)","5,00 €",-`;

/**
 * Catálogo Maestro Oficial de Promociones Independientes
 */
export const PROMOTIONS_DATABASE: PromotionEntityMaster[] = [
  // 1. Happy Hour Diario: 2 Cócteles 12€ o 2 Jarras 6€ (Klayman Diamond)
  {
    id: 'promo-dia-hh-sunset',
    nombre: 'Happy Hour Diario (15:00 a 16:00 h) · 2 Cócteles 12€ ó 2 Jarras 6€',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '15:00',
    horaFin: '16:00',
    diasSemana: [0, 1, 2, 3, 4, 5, 6], // Todos los días (de 15 a 16 h)
    diasTexto: 'Todos los días (15:00 a 16:00 h)',
    tipo: 'happy_hour',
    precioPromocionalTexto: '2 Cócteles 12,00 € ó 2 Jarras 6,00 €',
    precioNormalTexto: 'Cóctel 8,50-9,50 € (x2=17-19€) / Jarra 4,50 € (x2=9€)',
    badge: 'HAPPY HOUR 15:00 - 16:00',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Promoción oficial de Happy Hour todos los días de 15:00 a 16:00 h. Incluye ÚNICAMENTE dos cócteles por 12 € o dos jarras por 6 €. NORMAS ESTRICTAS: No se puede pedir una sola jarra suelta, no se pueden pedir distintas bebidas ni distintos cócteles (Margarita en Happy Hour son dos margaritas idénticas; Jarra son dos jarras de cerveza idénticas). No hay mitad de precio ni combinaciones mixtas.',
    condiciones: [
      'Horario estricto de Happy Hour: todos los días exclusivamente de 15:00 h a 16:00 h (de 15 a 16 h).',
      'SOLO INCLUYE DOS OPCIONES: Dos cócteles por 12,00 € ó Dos jarras por 6,00 €.',
      'REGLA ESTRICTA 1: NO SE PUEDE PEDIR UNA SOLA JARRA. En Happy Hour no existe jarra suelta a 3 €, la oferta es obligatoriamente el pack de dos jarras por 6 €.',
      'REGLA ESTRICTA 2: NO SE PUEDEN PEDIR DISTINTAS BEBIDAS NI DISTINTOS CÓCTELES. Margarita son dos margaritas idénticas; Jarra son dos jarras idénticas de cerveza.',
      'REGLA ESTRICTA 3: NO HAY MITAD, NO HAY NADA. Prohibido aplicar mitad de precio a una consumición individual o mezclar bebidas diferentes (ej. no combinar un mojito con una margarita).',
      'Aplica en Bar / Terraza Diamond. No acumulable con otras promociones del día.'
    ],
    procedimientoTPV: [
      'Verificar que el reloj del TPV marque estrictamente entre las 15:00 h y las 16:00 h.',
      'JARRAS: Seleccionar 2 unidades de la misma cerveza y pulsar [HH 2 JARRAS 6.00€]. Prohibido registrar una sola jarra suelta con esta tarifa.',
      'CÓCTELES: Seleccionar 2 unidades del MISMO cóctel (ej. 2 Margaritas o 2 Mojitos) y pulsar [HH 2 CÓCTELES 12.00€]. Prohibido registrar dos cócteles diferentes dentro de la oferta de 12 €.',
      'No está permitido fraccionar consumiciones ni aplicar descuentos individuales a la mitad.',
      'Cobro en tarjeta, efectivo o vouchers autorizados.'
    ],
    productosIncluidos: [
      {
        id: 'item-dorada-especial-jarra',
        nombre: 'Dos Jarras de Cerveza Dorada Especial (2 x 50 cl)',
        precioNormal: 9.00,
        precioPromocional: 6.00,
        precioHH: 6.00,
        descuentoPorcentaje: 33.3,
        categoria: 'cervezas_bebidas'
      },
      {
        id: 'item-ckt-06-margarita-tradicional',
        nombre: 'Dos Margaritas Clásicas (Mismo Cóctel)',
        precioNormal: 17.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-03-mojito-tradicional',
        nombre: 'Dos Mojitos Tradicionales (Mismo Cóctel)',
        precioNormal: 17.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-02-blue-diamond',
        nombre: 'Dos Blue Diamond Sunset (Mismo Cóctel)',
        precioNormal: 19.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 36.8,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-18-pina-colada',
        nombre: 'Dos Piñas Coladas Clásicas (Mismo Cóctel)',
        precioNormal: 17.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-20-aperol-spritz',
        nombre: 'Dos Aperol Spritz (Mismo Cóctel)',
        precioNormal: 17.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-01-sex-on-the-beach',
        nombre: 'Dos Sex on the Beach (Mismo Cóctel)',
        precioNormal: 17.00,
        precioPromocional: 12.00,
        precioHH: 12.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      }
    ]
  },

  // 2. Lunes: Jarra Dorada Especial (50 cl) = 3,00 € (Klayman Diamond)
  {
    id: 'promo-dia-lunes-beer',
    nombre: 'Lunes de Jarras de Cerveza 3€ · Jarra Dorada Especial (50 cl)',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '08:00',
    horaFin: '22:00',
    diasSemana: [1], // Lunes
    diasTexto: 'Lunes (08:00 - 22:00 h)',
    tipo: 'dia_tematico',
    precioPromocionalTexto: '3,00 € / Jarra 50 cl',
    precioPromocionalValor: 3.00,
    precioNormalTexto: '4,50 €',
    badge: 'LUNES · JARRAS 3€',
    imageUrl: 'https://images.unsplash.com/photo-1608270195587-c1042b78b056?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'El lunes: Jarra Dorada Especial (50 cl) a solo 3,00 € durante toda la jornada de 08:00 a 22:00 h. Incluye frutos secos tostados canarios de cortesía.',
    condiciones: [
      'Válido exclusivamente los LUNES durante todo el horario de servicio (08:00 h a 22:00 h).',
      'Precio especial cerrado a 3,00 € por jarra de 50 cl (PVP habitual 4,50 €).',
      'Aplica en Bar / Terraza Diamond y mesas de solárium.',
      'Incluye frutos secos tostados canarios de cortesía por consumición.'
    ],
    procedimientoTPV: [
      'Pulsar la tecla directa [PROMO LUNES JARRAS 3.00€] en TPV.',
      'Servir en jarra helada a 2ºC con dos dedos de espuma cremosa y platillo de frutos secos.'
    ],
    productosIncluidos: [
      {
        id: 'item-dorada-especial-jarra-lunes',
        nombre: 'Jarra Dorada Especial (50 cl)',
        precioNormal: 4.50,
        precioPromocional: 3.00,
        descuentoPorcentaje: 33.3,
        categoria: 'cervezas_bebidas'
      },
      {
        id: 'item-mix-frutos-secos',
        nombre: 'Mix Frutos Secos Tostados (Aperitivo Cortesía)',
        precioNormal: 2.50,
        precioPromocional: 0.00,
        categoria: 'snacks_terraza'
      }
    ]
  },

  // 3. Miércoles: Spritz (Aperol, Campari, Limoncello, Hugo) = 6,00 € (Klayman Diamond)
  {
    id: 'promo-dia-spritz-oferta',
    nombre: 'Miércoles de Spritz a 6€ · Spritz (Aperol, Campari, Limoncello, Hugo)',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '08:00',
    horaFin: '22:30',
    diasSemana: [3], // 3 = Miércoles exclusivamente
    diasTexto: 'Miércoles (08:00 - 22:30 h)',
    tipo: 'dia_tematico',
    precioPromocionalTexto: '6,00 € / Copa (4 Variedades)',
    precioPromocionalValor: 6.00,
    precioNormalTexto: '8,50 €',
    badge: 'MIÉRCOLES · SPRITZ 6€',
    imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Miércoles de Spritz: Aperol, Campari, Limoncello y Hugo a solo 6,00 € la copa en Bar / Terraza Diamond de 08:00 h a 22:30 h.',
    condiciones: [
      'Válido exclusivamente los MIÉRCOLES de 08:00 h a 22:30 h.',
      'Aplica a las 4 variedades de Spritz: Aperol Spritz, Campari Spritz, Limoncello Spritz y Hugo Spritz.',
      'Servicio en copa balón con hielo macizo cristalino y golpe de soda.'
    ],
    procedimientoTPV: [
      'Pulsar la tecla directa [PROMO SPRITZ 6.00€] en Promociones de Terraza.',
      'Indicar la variedad elegida (Aperol, Campari, Limoncello o Hugo) y servir con posavasos oficial.'
    ],
    productosIncluidos: [
      {
        id: 'item-ckt-16-aperol-spritz',
        nombre: 'Aperol Spritz (FT CKT 16)',
        precioNormal: 8.50,
        precioPromocional: 6.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-38-campari-spritz',
        nombre: 'Campari Spritz (FT CKT 38)',
        precioNormal: 8.50,
        precioPromocional: 6.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-39-limoncello-spritz',
        nombre: 'Limoncello Spritz (FT CKT 39)',
        precioNormal: 8.50,
        precioPromocional: 6.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-hugo-spritz',
        nombre: 'Hugo Spritz Floral',
        precioNormal: 8.50,
        precioPromocional: 6.00,
        descuentoPorcentaje: 29.4,
        categoria: 'cocteles'
      }
    ]
  },

  // 4. Viernes: Cócteles seleccionados (2x1) · Tarifa 2x1 ininterrumpida (Klayman Diamond)
  {
    id: 'promo-dia-hh-viernes-allday',
    nombre: 'Viernes de Cócteles Seleccionados (2x1) · Tarifa 2x1 Ininterrumpida',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '10:00',
    horaFin: '22:00',
    diasSemana: [5], // Viernes
    diasTexto: 'Viernes (10:00 - 22:00 h)',
    tipo: 'happy_hour',
    precioPromocionalTexto: '2x1 Cócteles Seleccionados',
    precioNormalTexto: '8,50 € / cóctel',
    badge: 'VIERNES 2X1 CÓCTELES',
    imageUrl: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Viernes: Cócteles seleccionados (2x1) de 10:00 h a 22:00 h. Tarifa 2x1 ininterrumpida durante toda la jornada.',
    condiciones: [
      'Válido exclusivamente los VIERNES de 10:00 h a 22:00 h.',
      'Tarifa 2x1 ininterrumpida en cócteles seleccionados de la carta oficial.',
      'Segunda copa de igual o menor importe.'
    ],
    procedimientoTPV: [
      'Pulsar [PROMO VIERNES 2X1 CÓCTELES] en TPV.',
      'La promoción cubre de 10:00 h a 22:00 h.'
    ],
    productosIncluidos: [
      {
        id: 'item-ckt-03-mojito-tradicional',
        nombre: 'Mojito Tradicional',
        precioNormal: 8.50,
        precioPromocional: 4.25,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-04-mojito-sabores',
        nombre: 'Mojito Sabores (Fresa / Maracuyá)',
        precioNormal: 8.50,
        precioPromocional: 4.25,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-06-margarita-tradicional',
        nombre: 'Margarita Tradicional',
        precioNormal: 8.50,
        precioPromocional: 4.25,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-18-pina-colada',
        nombre: 'Piña Colada',
        precioNormal: 8.50,
        precioPromocional: 4.25,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-26-virgin-mojito',
        nombre: 'Virgin Mojito 0.0%',
        precioNormal: 6.50,
        precioPromocional: 3.25,
        categoria: 'cocteles'
      }
    ]
  },

  // 5. Domingo: Mojitos (Tradicional, Fresa, Maracuyá, Virgin) = 5,00 € (Klayman Diamond)
  {
    id: 'promo-dia-mojitos-5',
    nombre: 'Domingos de Mojitos a 5 € · Mojitos (Tradicional, Fresa, Maracuyá, Virgin)',
    hotel: 'Klayman Diamond',
    hotelId: 'klayman-diamond',
    centroVenta: 'Bar / Terraza Diamond',
    outletId: 'diamond-bar-terraza',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '08:00',
    horaFin: '22:30',
    diasSemana: [0], // 0 = Domingo exclusivamente
    diasTexto: 'Domingo (08:00 - 22:30 h)',
    tipo: 'dia_tematico',
    precioPromocionalTexto: '5,00 € / Mojito',
    precioPromocionalValor: 5.00,
    precioNormalTexto: '8,50 €',
    badge: 'DOMINGO · MOJITOS 5€',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Domingos: Mojitos (Tradicional, Fresa, Maracuyá, Virgin) a solo 5,00 € en Bar / Terraza Diamond de 08:00 h a 22:30 h.',
    condiciones: [
      'Válido exclusivamente los DOMINGOS de 08:00 h a 22:30 h.',
      'Precio cerrado a 5,00 € por mojito (Tradicional, Fresa, Maracuyá y Virgin 0.0%).',
      'De lunes a sábado aplica tarifa regular de carta.'
    ],
    procedimientoTPV: [
      'Pulsar en TPV el botón directo [PROMO DOMINGO MOJITO 5.00€].',
      'Seleccionar el sabor solicitado (Tradicional, Fresa o Maracuyá).'
    ],
    productosIncluidos: [
      {
        id: 'item-ckt-03-mojito-tradicional',
        nombre: 'Mojito Tradicional Canario',
        precioNormal: 8.50,
        precioPromocional: 5.00,
        descuentoPorcentaje: 41,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-04-mojito-sabores',
        nombre: 'Mojito de Sabores (Fresa / Maracuyá)',
        precioNormal: 8.50,
        precioPromocional: 5.00,
        descuentoPorcentaje: 41,
        categoria: 'cocteles'
      },
      {
        id: 'item-ckt-26-virgin-mojito',
        nombre: 'Virgin Mojito Sin Alcohol 0.0%',
        precioNormal: 6.50,
        precioPromocional: 5.00,
        descuentoPorcentaje: 23,
        categoria: 'cocteles'
      }
    ]
  },

  // 6. Happy Hour Sol Bar Olivina (Klayman Olivina)
  {
    id: 'promo-oli-hh-solbar',
    nombre: 'Happy Hour Rooftop Sol Bar Olivina',
    hotel: 'Klayman Olivina',
    hotelId: 'klayman-olivina',
    centroVenta: 'Sol Bar Olivina',
    outletId: 'olivina-bar-sol',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '16:00',
    horaFin: '18:00',
    diasSemana: [0, 1, 2, 3, 4, 5, 6], // Diario
    diasTexto: 'Diario (Lunes a Domingo)',
    tipo: 'happy_hour',
    precioPromocionalTexto: 'Cócteles 6,00 € · Caña 2,20 €',
    precioNormalTexto: '7,50 € / 3,00 €',
    badge: 'HAPPY HOUR SOL BAR',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Disfruta de la mejor puesta de sol en la azotea de Klayman Olivina con cócteles y cañas a precio Happy Hour.',
    condiciones: [
      'Válido todos los días de 16:00 h a 18:00 h en Sol Bar Olivina.',
      'Cócteles oficiales a 6,00 € (PVP habitual 7,50 €).',
      'Caña de cerveza Dorada a 2,20 € (PVP habitual 3,00 €).'
    ],
    procedimientoTPV: [
      'Pulsar la tecla [HAPPY HOUR SOL BAR] en el TPV Ágora de Olivina.',
      'Cobros en tarjeta o efectivo. No se carga a habitación.'
    ],
    productosIncluidos: [
      {
        id: 'bs-coc-01',
        nombre: 'Mojito Cubano Sol Bar',
        precioNormal: 7.50,
        precioPromocional: 6.00,
        precioHH: 6.00,
        categoria: 'cocteles'
      },
      {
        id: 'bs-coc-02',
        nombre: 'Mojito Canario de Maracuyá',
        precioNormal: 7.50,
        precioPromocional: 6.00,
        precioHH: 6.00,
        categoria: 'cocteles'
      },
      {
        id: 'bs-coc-03',
        nombre: 'Piña Colada Tradicional',
        precioNormal: 7.50,
        precioPromocional: 6.00,
        precioHH: 6.00,
        categoria: 'cocteles'
      },
      {
        id: 'bs-coc-04',
        nombre: 'Aperol Spritz Clásico',
        precioNormal: 7.50,
        precioPromocional: 6.00,
        precioHH: 6.00,
        categoria: 'cocteles'
      },
      {
        id: 'bs-cer-01',
        nombre: 'Cerveza Dorada Especial Barril (Caña)',
        precioNormal: 3.00,
        precioPromocional: 2.20,
        precioHH: 2.20,
        categoria: 'cervezas_bebidas'
      },
      {
        id: 'bs-cer-02',
        nombre: 'Cerveza Sin Alcohol (Botellín 33 cl)',
        precioNormal: 2.80,
        precioPromocional: 2.00,
        precioHH: 2.00,
        categoria: 'cervezas_bebidas'
      }
    ]
  },

  // 7. Tardeo Canario Papas & Caña Olivina (Klayman Olivina)
  {
    id: 'promo-oli-tardeo-papas',
    nombre: 'Tardeo Canario: Papas Arrugadas + Caña',
    hotel: 'Klayman Olivina',
    hotelId: 'klayman-olivina',
    centroVenta: 'Sol Bar Olivina',
    outletId: 'olivina-bar-sol',
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    horaInicio: '13:00',
    horaFin: '17:00',
    diasSemana: [0, 6], // Sábados y Domingos
    diasTexto: 'Sábados y Domingos',
    tipo: 'oferta_especial',
    precioPromocionalTexto: '5,50 € Combo Tardeo',
    precioPromocionalValor: 5.50,
    precioNormalTexto: '7,50 €',
    badge: 'COMBO TARDEO 5,50€',
    imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=80',
    descripcion: 'Papas arrugadas canarias con mojo rojo y verde acompañadas de caña helada de Dorada Especial.',
    condiciones: [
      'Válido sábados y domingos de 13:00 h a 17:00 h.',
      'Incluye ración completa de papas arrugadas con dos mojos y caña de 33 cl.'
    ],
    procedimientoTPV: [
      'Pulsar [COMBO TARDEO PAPAS+CAÑA 5.50€] en TPV.'
    ],
    productosIncluidos: [
      {
        id: 'bs-tap-02',
        nombre: 'Papas Arrugadas con Dúo de Mojos Canarios',
        precioNormal: 5.00,
        precioPromocional: 3.50,
        categoria: 'restauracion_sol'
      },
      {
        id: 'bs-cer-01',
        nombre: 'Cerveza Dorada Especial Barril (Caña)',
        precioNormal: 3.00,
        precioPromocional: 2.00,
        categoria: 'cervezas_bebidas'
      }
    ]
  }
];

// ============================================================================
// FUNCIONES Y UTILIDADES DINÁMICAS DE GESTIÓN DE PROMOCIONES Y HAPPY HOUR
// ============================================================================

/**
 * Convierte 'HH:mm' a minutos transcurridos desde las 00:00 h
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Evalúa dinámicamente el estado de una promoción según fecha y hora actual
 * Estados posibles: 'Activa' | 'Programada' | 'Finalizada'
 */
export function calcularEstadoPromocion(promo: PromotionEntityMaster, now: Date = new Date()): PromotionStatus {
  if (promo.estadoManual) return promo.estadoManual;

  const todayStr = now.toISOString().split('T')[0];
  const currentDayOfWeek = now.getDay(); // 0 a 6
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 1. Verificación de vigencia por fecha
  if (todayStr < promo.fechaInicio) return 'Programada';
  if (todayStr > promo.fechaFin) return 'Finalizada';

  // 2. Verificación del día de la semana
  const appliesToday = promo.diasSemana.includes(currentDayOfWeek);
  const startMinutes = timeToMinutes(promo.horaInicio);
  const endMinutes = timeToMinutes(promo.horaFin);

  if (appliesToday) {
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return 'Activa';
    } else if (currentMinutes < startMinutes) {
      return 'Programada';
    } else {
      // Finalizada para el día de hoy
      return 'Finalizada';
    }
  }

  // Si hoy no aplica pero está en fecha de vigencia, está programada para su próximo día
  return 'Programada';
}

/**
 * 1. Mostrar promociones activas
 */
export function getPromocionesActivas(hotelId?: string, centroVenta?: string, now: Date = new Date()): PromotionEntityMaster[] {
  return PROMOTIONS_DATABASE.filter(promo => {
    if (hotelId && hotelId !== 'todos' && promo.hotelId !== 'todos' && promo.hotelId !== hotelId) return false;
    if (centroVenta && centroVenta !== 'todos' && promo.centroVenta !== centroVenta && promo.outletId !== centroVenta) return false;
    return calcularEstadoPromocion(promo, now) === 'Activa';
  });
}

/**
 * 2. Mostrar promociones del día (que aplican hoy según el día de la semana)
 */
export function getPromocionesDelDia(hotelId?: string, centroVenta?: string, now: Date = new Date()): PromotionEntityMaster[] {
  const currentDayOfWeek = now.getDay();
  const todayStr = now.toISOString().split('T')[0];

  return PROMOTIONS_DATABASE.filter(promo => {
    if (hotelId && hotelId !== 'todos' && promo.hotelId !== 'todos' && promo.hotelId !== hotelId) return false;
    if (centroVenta && centroVenta !== 'todos' && promo.centroVenta !== centroVenta && promo.outletId !== centroVenta) return false;
    
    // Vigencia en fecha y día
    const inDateRange = todayStr >= promo.fechaInicio && todayStr <= promo.fechaFin;
    return inDateRange && promo.diasSemana.includes(currentDayOfWeek);
  });
}

/**
 * 3. Mostrar próxima promoción que se activará
 */
export function getProximaPromocion(hotelId?: string, centroVenta?: string, now: Date = new Date()): {
  promocion: PromotionEntityMaster | null;
  minutosParaInicio: number | null;
  mensaje: string;
} {
  const currentDayOfWeek = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Buscar promociones programadas para hoy que empiezan más tarde
  const promosDelDia = getPromocionesDelDia(hotelId, centroVenta, now);
  const futurasHoy = promosDelDia
    .filter(p => timeToMinutes(p.horaInicio) > currentMinutes)
    .sort((a, b) => timeToMinutes(a.horaInicio) - timeToMinutes(b.horaInicio));

  if (futurasHoy.length > 0) {
    const prox = futurasHoy[0];
    const diff = timeToMinutes(prox.horaInicio) - currentMinutes;
    return {
      promocion: prox,
      minutosParaInicio: diff,
      mensaje: `Comienza hoy a las ${prox.horaInicio} h (en ${diff} minutos)`
    };
  }

  // Si no hay más hoy, buscar la primera de los próximos días
  const candidatas = PROMOTIONS_DATABASE.filter(promo => {
    if (hotelId && hotelId !== 'todos' && promo.hotelId !== 'todos' && promo.hotelId !== hotelId) return false;
    if (centroVenta && centroVenta !== 'todos' && promo.centroVenta !== centroVenta && promo.outletId !== centroVenta) return false;
    return true;
  });

  if (candidatas.length > 0) {
    return {
      promocion: candidatas[0],
      minutosParaInicio: null,
      mensaje: `Próxima sesión: ${candidatas[0].diasTexto} a las ${candidatas[0].horaInicio} h`
    };
  }

  return {
    promocion: null,
    minutosParaInicio: null,
    mensaje: 'No hay promociones programadas'
  };
}

/**
 * 4. Filtrar por hotel
 */
export function filtrarPorHotel(promociones: PromotionEntityMaster[], hotelId: string): PromotionEntityMaster[] {
  if (!hotelId || hotelId === 'todos') return promociones;
  return promociones.filter(p => p.hotelId === hotelId || p.hotelId === 'todos');
}

/**
 * 5. Filtrar por centro de venta
 */
export function filtrarPorCentroVenta(promociones: PromotionEntityMaster[], centroVenta: string): PromotionEntityMaster[] {
  if (!centroVenta || centroVenta === 'todos') return promociones;
  return promociones.filter(p => p.centroVenta === centroVenta || p.outletId === centroVenta);
}

/**
 * 6. Relacionar promociones con productos
 * Devuelve todas las promociones que contienen un producto dado
 */
export function getPromocionesDeProducto(productId: string): PromotionEntityMaster[] {
  return PROMOTIONS_DATABASE.filter(promo => 
    promo.productosIncluidos.some(prod => prod.id === productId)
  );
}

/**
 * Obtener estado de Happy Hour en tiempo real para un hotel
 */
export interface HappyHourLiveStatus {
  isActivo: boolean;
  promoActiva: PromotionEntityMaster | null;
  horario: string;
  minutosRestantesActivo: number | null;
  minutosParaComienzo: number | null;
  alertaEstado: 'comienza_en_30_min' | 'activa' | 'finalizada' | 'inactiva';
  mensajeAlerta: string;
  // Campos normalizados de compatibilidad
  status: 'activa' | 'proxima' | 'finalizada' | 'inactiva';
  activePromo: PromotionEntityMaster | null;
  minutosHastaInicio: number | null;
}

export function getHappyHourLiveStatus(hotelId: 'klayman-diamond' | 'klayman-olivina' = 'klayman-diamond', now: Date = new Date()): HappyHourLiveStatus {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDayOfWeek = now.getDay();

  // Buscar promociones tipo 'happy_hour' de este hotel
  const hhPromos = PROMOTIONS_DATABASE.filter(p => 
    p.tipo === 'happy_hour' && (p.hotelId === hotelId || p.hotelId === 'todos') && p.diasSemana.includes(currentDayOfWeek)
  );

  // 1. Comprobar si hay una Happy Hour activa ahora
  const activa = hhPromos.find(p => {
    const start = timeToMinutes(p.horaInicio);
    const end = timeToMinutes(p.horaFin);
    return currentMinutes >= start && currentMinutes <= end;
  });

  if (activa) {
    const end = timeToMinutes(activa.horaFin);
    const restantes = end - currentMinutes;
    return {
      isActivo: true,
      promoActiva: activa,
      status: 'activa',
      activePromo: activa,
      horario: `${activa.horaInicio} h a ${activa.horaFin} h`,
      minutosRestantesActivo: restantes,
      minutosParaComienzo: null,
      minutosHastaInicio: null,
      alertaEstado: 'activa',
      mensajeAlerta: `¡Happy Hour activa! Finaliza a las ${activa.horaFin} h (${restantes} min restantes)`
    };
  }

  // 2. Comprobar si comenzará en 45 minutos o menos
  const proximaHoy = hhPromos.find(p => {
    const start = timeToMinutes(p.horaInicio);
    return currentMinutes < start;
  });

  if (proximaHoy) {
    const start = timeToMinutes(proximaHoy.horaInicio);
    const paraInicio = start - currentMinutes;
    return {
      isActivo: false,
      promoActiva: proximaHoy,
      status: 'proxima',
      activePromo: proximaHoy,
      horario: `${proximaHoy.horaInicio} h a ${proximaHoy.horaFin} h`,
      minutosRestantesActivo: null,
      minutosParaComienzo: paraInicio,
      minutosHastaInicio: paraInicio,
      alertaEstado: paraInicio <= 30 ? 'comienza_en_30_min' : 'inactiva',
      mensajeAlerta: `Happy Hour comienza en ${paraInicio} minutos (a las ${proximaHoy.horaInicio} h)`
    };
  }

  // 3. Comprobar si finalizó hace poco (últimos 30 minutos)
  const finalizadaReciente = hhPromos.find(p => {
    const end = timeToMinutes(p.horaFin);
    return currentMinutes > end && (currentMinutes - end) <= 30;
  });

  if (finalizadaReciente) {
    return {
      isActivo: false,
      promoActiva: finalizadaReciente,
      status: 'finalizada',
      activePromo: finalizadaReciente,
      horario: `${finalizadaReciente.horaInicio} h a ${finalizadaReciente.horaFin} h`,
      minutosRestantesActivo: null,
      minutosParaComienzo: null,
      minutosHastaInicio: null,
      alertaEstado: 'finalizada',
      mensajeAlerta: `Happy Hour finalizada a las ${finalizadaReciente.horaFin} h. Próxima sesión mañana.`
    };
  }

  // En otro caso, inactiva
  const promoBase = hhPromos[0] || PROMOTIONS_DATABASE.find(p => p.tipo === 'happy_hour') || null;
  const horarioTexto = promoBase 
    ? `${promoBase.horaInicio} h a ${promoBase.horaFin} h`
    : '15:00 h a 16:00 h';

  return {
    isActivo: false,
    promoActiva: promoBase,
    status: 'inactiva',
    activePromo: promoBase,
    horario: horarioTexto,
    minutosRestantesActivo: null,
    minutosParaComienzo: null,
    minutosHastaInicio: null,
    alertaEstado: 'inactiva',
    mensajeAlerta: `Happy Hour inactiva. Horario habitual: ${horarioTexto}`
  };
}
