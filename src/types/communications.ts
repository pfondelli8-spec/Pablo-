export type AnnouncementCategory = 
  | 'urgente' 
  | 'operativa' 
  | 'turnos' 
  | 'mantenimiento' 
  | 'eventos' 
  | 'sanidad_rrhh';

export interface AnnouncementItem {
  id: string;
  hotelId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  category: AnnouncementCategory;
  isPinned: boolean;
  imageUrl?: string;
  readBy: string[]; // employee ids or names
  reactions: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

export interface ChatMessage {
  id: string;
  hotelId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
  imageCaption?: string;
  reactions?: {
    emoji: string;
    count: number;
  }[];
}

export interface SystemNotification {
  id: string;
  hotelId: string;
  type: 'anuncio' | 'chat_foto' | 'rrhh_cert' | 'caja_ticket';
  title: string;
  description: string;
  authorName: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: 'anuncios' | 'chat' | 'rrhh' | 'caja';
}
