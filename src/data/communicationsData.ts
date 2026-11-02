import { AnnouncementItem, ChatMessage, SystemNotification } from '../types/communications';

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    hotelId: 'klayman-diamond',
    title: '⚠️ Aviso Urgente: Evento Privado y Sunset Cóctel en Terraza Superior',
    content: 'Hoy a partir de las 18:00 h se celebrará una reserva VIP para 35 personas en la zona alta de la terraza con vistas a Los Gigantes. Queda reservada la barra principal. Rogamos al equipo de servicio de F&B y cocina tener preparados los lotes de Blue Diamond y bandejas de canapés fríos antes de las 17:30 h.',
    authorName: 'Juanito Suárez',
    authorRole: 'Jefe de Sala & Coordinador de Barra',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: 'Hoy a las 11:45',
    category: 'urgente',
    isPinned: true,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    readBy: ['Carlos Mendoza', 'Laura Betancor', 'Alejandro Morales', 'Elena Navarro', 'Raquel Santana'],
    reactions: [
      { emoji: '👍', count: 12, users: ['Carlos Mendoza', 'Elena Navarro'] },
      { emoji: '🚀', count: 6, users: ['Laura Betancor'] },
      { emoji: '🍸', count: 8, users: ['Raquel Santana'] }
    ]
  },
  {
    id: 'ann-2',
    hotelId: 'klayman-diamond',
    title: '📋 Actualización Sanitaria: Renovación de Carnets de Manipulador de Alimentos',
    content: 'Recordatorio de Dirección y RRHH: La próxima semana tendremos la auditoría higiénico-sanitaria y control de APPCC de la Consejería de Sanidad. Todos los empleados que tengan el carnet pendiente o próximo a caducar deben subir el resguardo o diploma a su portal de empleado privado antes del viernes.',
    authorName: 'Dirección RRHH Diamond',
    authorRole: 'Recursos Humanos & Calidad',
    createdAt: 'Ayer a las 16:30',
    category: 'sanidad_rrhh',
    isPinned: false,
    readBy: ['Juanito Suárez', 'Carlos Mendoza', 'Laura Betancor', 'Marcos Toledo'],
    reactions: [
      { emoji: '✅', count: 14, users: ['Juanito Suárez', 'Carlos Mendoza'] }
    ]
  },
  {
    id: 'ann-3',
    hotelId: 'klayman-diamond',
    title: '🚚 Llegada de Pedido Extra de Vinos Canarios y Cristalería',
    content: 'Se ha descargado en el almacén de planta -1 el pedido de Bodegas Monje (Listán Negro) y la nueva cristalería Schott Zwiesel para el servicio de cócteles. Por favor, los compañeros del turno de tarde revisad que las cajas no presenten roturas.',
    authorName: 'Laura Betancor',
    authorRole: 'F&B Manager Diamond',
    createdAt: 'Hace 2 días',
    category: 'operativa',
    isPinned: false,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    readBy: ['Juanito Suárez', 'Carlos Mendoza', 'Elena Navarro'],
    reactions: [
      { emoji: '🍷', count: 9, users: ['Carlos Mendoza'] }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    hotelId: 'klayman-diamond',
    senderName: 'Juanito Suárez',
    senderRole: 'Jefe de Sala',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: '¡Buenos días equipo! Dejo aviso por aquí: el viento de anoche aflojó el anclaje de la sombrilla en la mesa 14 de la terraza. Ya avisé a Mantenimiento, pero mientras tanto la hemos dejado plegada con el seguro puesto.',
    timestamp: '09:15',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Foto de la sombrilla asegurada en la mesa 14',
    reactions: [{ emoji: '👀', count: 4 }, { emoji: '👍', count: 7 }]
  },
  {
    id: 'msg-2',
    hotelId: 'klayman-diamond',
    senderName: 'Carlos Mendoza',
    senderRole: 'Bartender Diamond',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Recibido Juanito. En barra tenemos los limones, limas recién exprimidas y la menta fresca para los Mojitos Canarios listos para el servicio del almuerzo.',
    timestamp: '09:28',
    reactions: [{ emoji: '🍋', count: 5 }]
  },
  {
    id: 'msg-3',
    hotelId: 'klayman-diamond',
    senderName: 'Laura Betancor',
    senderRole: 'F&B Manager',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    content: 'Perfecto chicos. Recordad registrar el ticket del Cierre de Caja en el nuevo módulo de F&B en cuanto acabe el turno de mediodía.',
    timestamp: '10:04',
    reactions: [{ emoji: '✅', count: 6 }]
  },
  {
    id: 'msg-4',
    hotelId: 'klayman-diamond',
    senderName: 'Juanito Suárez',
    senderRole: 'Jefe de Sala',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    content: 'Os comparto foto de la puesta a punto de la cristalería para el cóctel Blue Diamond de esta tarde, todo montado según la ficha técnica oficial.',
    timestamp: '11:10',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Montaje de cristalería tallada para Blue Diamond',
    reactions: [{ emoji: '💎', count: 9 }, { emoji: '🔥', count: 4 }]
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    hotelId: 'klayman-diamond',
    type: 'anuncio',
    title: '📢 Nuevo Anuncio de Juanito Suárez',
    description: 'Juanito ha publicado: "⚠️ Evento Privado y Sunset Cóctel en Terraza Superior (18:00 h)".',
    authorName: 'Juanito Suárez',
    timestamp: 'Hoy a las 11:45',
    isRead: false,
    linkTab: 'anuncios'
  },
  {
    id: 'notif-2',
    hotelId: 'klayman-diamond',
    type: 'chat_foto',
    title: '📸 Juanito ha subido una foto al Chat',
    description: 'Juanito compartió: "Montaje de cristalería tallada para Blue Diamond".',
    authorName: 'Juanito Suárez',
    timestamp: 'Hoy a las 11:10',
    isRead: false,
    linkTab: 'chat'
  },
  {
    id: 'notif-3',
    hotelId: 'klayman-diamond',
    type: 'rrhh_cert',
    title: '🔒 Actualización de RRHH / Sanidad',
    description: 'Aviso sobre comprobación de carnets de manipulador de alimentos para la auditoría higiénica.',
    authorName: 'Dirección RRHH',
    timestamp: 'Ayer a las 16:30',
    isRead: true,
    linkTab: 'anuncios'
  },
  {
    id: 'notif-4',
    hotelId: 'klayman-diamond',
    type: 'caja_ticket',
    title: '🧾 Cierre de Caja Registrado',
    description: 'Carlos Mendoza ha registrado el Cierre Z de la barra con su foto adjunta.',
    authorName: 'Carlos Mendoza',
    timestamp: 'Ayer a las 22:30',
    isRead: true,
    linkTab: 'caja'
  }
];

export const TEAM_MEMBERS_PRESETS = [
  { id: 'juanito', name: 'Juanito Suárez', role: 'Jefe de Sala & Coordinador de Barra', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'carlos', name: 'Carlos Mendoza', role: 'Bartender & Coctelería Diamond', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'laura', name: 'Laura Betancor', role: 'F&B Manager Diamond', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { id: 'direccion', name: 'Dirección Klayman Diamond', role: 'Dirección General & Gerencia', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80' },
  { id: 'mantenimiento', name: 'Mantenimiento & Técnico', role: 'Servicios Técnicos Hotel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
];
