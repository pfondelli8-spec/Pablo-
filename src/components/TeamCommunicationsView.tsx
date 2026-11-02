import React, { useState, useEffect, useRef } from 'react';
import { 
  Megaphone, 
  MessageSquare, 
  Bell, 
  Send, 
  Image as ImageIcon, 
  Pin, 
  Check, 
  CheckCheck, 
  Clock, 
  Plus, 
  X, 
  Sparkles, 
  Camera, 
  Search, 
  Filter, 
  AlertTriangle, 
  Layers, 
  UserCheck, 
  Flame, 
  Maximize2,
  Trash2,
  ThumbsUp,
  Heart
} from 'lucide-react';
import { 
  AnnouncementItem, 
  ChatMessage, 
  SystemNotification, 
  AnnouncementCategory 
} from '../types/communications';
import { 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  TEAM_MEMBERS_PRESETS 
} from '../data/communicationsData';

interface TeamCommunicationsViewProps {
  hotelId: string;
  hotelName: string;
  initialTab?: 'anuncios' | 'chat' | 'notificaciones';
  onClose?: () => void;
}

export const TeamCommunicationsView: React.FC<TeamCommunicationsViewProps> = ({
  hotelId,
  hotelName,
  initialTab = 'anuncios',
  onClose
}) => {
  // Pestaña Activa: Anuncios Oficiales | Chat General | Centro de Notificaciones
  const [activeTab, setActiveTab] = useState<'anuncios' | 'chat' | 'notificaciones'>(initialTab);

  // Identidad del Usuario Actual (para simular a Juanito, Carlos Mendoza o Dirección)
  const [currentAuthorId, setCurrentAuthorId] = useState<string>('juanito');
  const currentMember = TEAM_MEMBERS_PRESETS.find(m => m.id === currentAuthorId) || TEAM_MEMBERS_PRESETS[0];

  // ==========================================
  // ESTADOS CON PERSISTENCIA LOCAL STORAGE
  // ==========================================
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem(`klayman_${hotelId}_announcements`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ANNOUNCEMENTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`klayman_${hotelId}_chat_messages`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`klayman_${hotelId}_notifications`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`klayman_${hotelId}_announcements`, JSON.stringify(announcements));
    } catch {}
  }, [announcements, hotelId]);

  useEffect(() => {
    try {
      localStorage.setItem(`klayman_${hotelId}_chat_messages`, JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages, hotelId]);

  useEffect(() => {
    try {
      localStorage.setItem(`klayman_${hotelId}_notifications`, JSON.stringify(notifications));
    } catch {}
  }, [notifications, hotelId]);

  // Toast / Alerta de Notificación en vivo
  const [liveToast, setLiveToast] = useState<{ title: string; message: string } | null>(null);
  const showNotificationToast = (title: string, message: string) => {
    setLiveToast({ title, message });
    setTimeout(() => {
      setLiveToast(null);
    }, 4500);
  };

  // Visor de Foto Ampliada (Lightbox)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  // ==========================================
  // ESTADO MODAL NUEVO ANUNCIO
  // ==========================================
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('operativa');
  const [annContent, setAnnContent] = useState('');
  const [annIsPinned, setAnnIsPinned] = useState(false);
  const [annImageUrl, setAnnImageUrl] = useState('');

  // ==========================================
  // ESTADO CHAT GENERAL & FOTOS
  // ==========================================
  const [chatInputText, setChatInputText] = useState('');
  const [chatAttachedImage, setChatAttachedImage] = useState<string | null>(null);
  const [chatImageCaption, setChatImageCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat cuando entra un nuevo mensaje
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Contadores
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // ==========================================
  // MANEJADORES DE ANUNCIOS
  // ==========================================
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      hotelId,
      title: annTitle.trim(),
      content: annContent.trim(),
      authorName: currentMember.name,
      authorRole: currentMember.role,
      authorAvatar: currentMember.avatar,
      createdAt: 'Justo ahora',
      category: annCategory,
      isPinned: annIsPinned,
      imageUrl: annImageUrl.trim() || undefined,
      readBy: [currentMember.name],
      reactions: [
        { emoji: '👍', count: 1, users: [currentMember.name] }
      ]
    };

    // Añadir al tablón (arriba si es pinned)
    setAnnouncements(prev => [newAnn, ...prev]);

    // Crear notificación activa para todo el personal
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      hotelId,
      type: 'anuncio',
      title: `📢 Nuevo Anuncio de ${currentMember.name}`,
      description: `${currentMember.name} ha publicado: "${annTitle.trim()}"`,
      authorName: currentMember.name,
      timestamp: 'Ahora mismo',
      isRead: false,
      linkTab: 'anuncios'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Notificación en pantalla
    showNotificationToast(
      `📢 Comunicado publicado por ${currentMember.name}`,
      `Se ha notificado a toda la plantilla de ${hotelName}: "${annTitle.trim()}"`
    );

    // Resetear formulario
    setAnnTitle('');
    setAnnContent('');
    setAnnImageUrl('');
    setAnnIsPinned(false);
    setShowNewAnnouncementModal(false);
  };

  const handleToggleReadAnnouncement = (annId: string) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id !== annId) return ann;
      const alreadyRead = ann.readBy.includes(currentMember.name);
      return {
        ...ann,
        readBy: alreadyRead 
          ? ann.readBy.filter(name => name !== currentMember.name)
          : [...ann.readBy, currentMember.name]
      };
    }));
  };

  const handleAddReactionToAnnouncement = (annId: string, emoji: string) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id !== annId) return ann;
      const existingReaction = ann.reactions.find(r => r.emoji === emoji);
      let updatedReactions;
      if (existingReaction) {
        if (existingReaction.users.includes(currentMember.name)) {
          // Quitar reacción
          updatedReactions = ann.reactions.map(r => r.emoji === emoji ? {
            ...r,
            count: Math.max(0, r.count - 1),
            users: r.users.filter(u => u !== currentMember.name)
          } : r).filter(r => r.count > 0);
        } else {
          // Sumar reacción
          updatedReactions = ann.reactions.map(r => r.emoji === emoji ? {
            ...r,
            count: r.count + 1,
            users: [...r.users, currentMember.name]
          } : r);
        }
      } else {
        updatedReactions = [...ann.reactions, { emoji, count: 1, users: [currentMember.name] }];
      }
      return { ...ann, reactions: updatedReactions };
    }));
  };

  // ==========================================
  // MANEJADORES DE CHAT GENERAL & FOTOS
  // ==========================================
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChatAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim() && !chatAttachedImage) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      hotelId,
      senderName: currentMember.name,
      senderRole: currentMember.role,
      senderAvatar: currentMember.avatar,
      content: chatInputText.trim() || (chatAttachedImage ? '📸 Ha compartido una foto de trabajo' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: chatAttachedImage || undefined,
      imageCaption: chatImageCaption.trim() || undefined,
      reactions: []
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Si incluía foto o es un aviso relevante, generar notificación
    if (chatAttachedImage) {
      const photoNotif: SystemNotification = {
        id: `notif-${Date.now()}`,
        hotelId,
        type: 'chat_foto',
        title: `📸 Foto en el Chat General`,
        description: `${currentMember.name} subió una foto: "${chatImageCaption.trim() || chatInputText.trim() || 'Incidencia de trabajo'}"`,
        authorName: currentMember.name,
        timestamp: 'Ahora mismo',
        isRead: false,
        linkTab: 'chat'
      };
      setNotifications(prev => [photoNotif, ...prev]);

      showNotificationToast(
        `📸 Foto compartida por ${currentMember.name}`,
        chatImageCaption || chatInputText || 'Nueva imagen subida al Chat de Operaciones'
      );
    }

    // Resetear inputs
    setChatInputText('');
    setChatAttachedImage(null);
    setChatImageCaption('');
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const categoryBadges: Record<AnnouncementCategory, { label: string; bg: string; text: string; border: string }> = {
    urgente: { label: 'URGENTE', bg: 'bg-rose-950', text: 'text-rose-300', border: 'border-rose-800' },
    operativa: { label: 'OPERATIVA', bg: 'bg-blue-950', text: 'text-blue-300', border: 'border-blue-800' },
    turnos: { label: 'TURNOS & HORARIOS', bg: 'bg-amber-950', text: 'text-amber-300', border: 'border-amber-800' },
    mantenimiento: { label: 'MANTENIMIENTO', bg: 'bg-orange-950', text: 'text-orange-300', border: 'border-orange-800' },
    eventos: { label: 'EVENTOS & RESERVAS', bg: 'bg-emerald-950', text: 'text-emerald-300', border: 'border-emerald-800' },
    sanidad_rrhh: { label: 'SANIDAD & RRHH', bg: 'bg-purple-950', text: 'text-purple-300', border: 'border-purple-800' }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ============================================================== */}
      {/* TOAST / ALERTA DE NOTIFICACIÓN FLOTANTE */}
      {/* ============================================================== */}
      {liveToast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-stone-900 border border-emerald-500/80 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start gap-3 animate-slideIn">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-xs font-mono font-bold text-emerald-400">
              {liveToast.title}
            </h4>
            <p className="text-xs text-stone-200 font-sans leading-snug">
              {liveToast.message}
            </p>
          </div>
          <button 
            onClick={() => setLiveToast(null)}
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* HEADER PRINCIPAL: TABLÓN, CHAT Y PANEL DE NOTIFICACIONES */}
      {/* ============================================================== */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-blue-950/40 border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-sky-400" />
                <span>COMUNICACIÓN OPERATIVA & EQUIPO</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-850 text-stone-300 border border-stone-700">
                {hotelName}
              </span>
              {unreadNotificationsCount > 0 && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500 text-stone-950 font-bold animate-pulse">
                  {unreadNotificationsCount} nueva{unreadNotificationsCount > 1 ? 's' : ''} alerta{unreadNotificationsCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-100">
              Tablón de Anuncios, Notificaciones & Chat de Trabajo
            </h1>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-sans max-w-3xl">
              Canal interno para sustituir WhatsApp: publica comunicados oficiales para la plantilla, recibe avisos automáticos cuando un compañero publique algo e interactúa en el <strong>Chat General con subida directa de fotos de incidencias y operativa</strong>.
            </p>
          </div>

          {/* Selector de Identidad del Emisor (Simular a Juanito, Carlos o Dirección) */}
          <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 flex items-center gap-3 shrink-0">
            <div className="relative">
              <img 
                src={currentMember.avatar} 
                alt={currentMember.name} 
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/60"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-950" />
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-stone-400 uppercase block">
                Publicando / Escribiendo como:
              </span>
              <select
                value={currentAuthorId}
                onChange={(e) => setCurrentAuthorId(e.target.value)}
                className="bg-stone-900 border border-stone-700 text-xs font-mono font-bold text-emerald-300 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {TEAM_MEMBERS_PRESETS.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role.split('&')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN ENTRE PESTAÑAS */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-800/80 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('anuncios')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeTab === 'anuncios'
                  ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-950/50'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>📢 Tablón de Anuncios ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                activeTab === 'chat'
                  ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-950/50'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>💬 Chat General & Fotos ({chatMessages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notificaciones')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'notificaciones'
                  ? 'bg-purple-500 text-stone-950 shadow-md shadow-purple-950/50'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>🔔 Centro de Alertas</span>
              {unreadNotificationsCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'notificaciones' ? 'bg-stone-950 text-purple-300' : 'bg-rose-500 text-stone-950'
                }`}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'anuncios' && (
            <button
              onClick={() => setShowNewAnnouncementModal(true)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nuevo Anuncio</span>
            </button>
          )}

          {activeTab === 'notificaciones' && unreadNotificationsCount > 0 && (
            <button
              onClick={handleMarkAllNotificationsAsRead}
              className="px-3.5 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-300 font-mono text-xs flex items-center gap-1.5 border border-stone-700"
            >
              <CheckCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Marcar todas como leídas</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PESTAÑA 1: TABLÓN DE ANUNCIOS & COMUNICADOS OFICIALES */}
      {/* ============================================================== */}
      {activeTab === 'anuncios' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Mostrando comunicados de {hotelName}</span>
            <span className="text-[11px] text-stone-500">
              Los anuncios fijados con chincheta (📌) se muestran primero
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {announcements.map((ann) => {
              const badge = categoryBadges[ann.category] || categoryBadges.operativa;
              const hasRead = ann.readBy.includes(currentMember.name);

              return (
                <article
                  key={ann.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                    ann.isPinned
                      ? 'bg-stone-900/90 border-sky-600/80 shadow-lg shadow-sky-950/20'
                      : 'bg-stone-900/70 border-stone-800'
                  }`}
                >
                  {/* Encabezado del Anuncio */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {ann.authorAvatar ? (
                        <img 
                          src={ann.authorAvatar} 
                          alt={ann.authorName} 
                          className="w-10 h-10 rounded-2xl object-cover border border-stone-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center font-bold font-mono text-stone-200">
                          {ann.authorName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-display font-bold text-stone-100">
                            {ann.authorName}
                          </h4>
                          {ann.isPinned && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1 font-bold">
                              <Pin className="w-3 h-3 text-sky-400" />
                              <span>Fijado</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-stone-400">
                          {ann.authorRole} · <span className="text-stone-500">{ann.createdAt}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-xl border self-start sm:self-auto font-bold tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Título y Contenido */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-display font-bold text-stone-100 leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed whitespace-pre-line">
                      {ann.content}
                    </p>
                  </div>

                  {/* Imagen adjunta en el anuncio si existe */}
                  {ann.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-stone-800 group max-h-80 bg-stone-950">
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                        onClick={() => setLightboxImage({ url: ann.imageUrl!, caption: ann.title })}
                      />
                      <button
                        onClick={() => setLightboxImage({ url: ann.imageUrl!, caption: ann.title })}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-stone-950/80 hover:bg-stone-900 text-stone-200 text-xs font-mono flex items-center gap-1.5 backdrop-blur-sm border border-stone-700 opacity-90 hover:opacity-100"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ver foto completa</span>
                      </button>
                    </div>
                  )}

                  {/* Pie del Anuncio: Reacciones, Confirmación de Lectura y Estado */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-800 text-xs font-mono">
                    {/* Botones de Reacción Rápida */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.reactions.map((react, idx) => {
                        const isMyReaction = react.users.includes(currentMember.name);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAddReactionToAnnouncement(ann.id, react.emoji)}
                            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                              isMyReaction
                                ? 'bg-sky-950 border-sky-700 text-sky-300 font-bold'
                                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            <span>{react.emoji}</span>
                            <span>{react.count}</span>
                          </button>
                        );
                      })}

                      {/* Botón para añadir emoji */}
                      <button
                        onClick={() => handleAddReactionToAnnouncement(ann.id, '👍')}
                        className="px-2 py-1 rounded-xl bg-stone-950 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                        title="Reaccionar con pulgar arriba"
                      >
                        +👍
                      </button>
                      <button
                        onClick={() => handleAddReactionToAnnouncement(ann.id, '🔥')}
                        className="px-2 py-1 rounded-xl bg-stone-950 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors"
                        title="Reaccionar con fuego"
                      >
                        +🔥
                      </button>
                    </div>

                    {/* Confirmación de Lectura */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-stone-500">
                        Leído por {ann.readBy.length} persona{ann.readBy.length !== 1 ? 's' : ''}
                      </span>

                      <button
                        onClick={() => handleToggleReadAnnouncement(ann.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          hasRead
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-stone-800 hover:bg-emerald-600 hover:text-stone-950 text-stone-300 border-stone-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{hasRead ? 'Leído ✓' : 'Marcar como Leído'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 2: CHAT GENERAL DE OPERACIONES & SUBIDA DE FOTOS */}
      {/* ============================================================== */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-stone-900/80 border border-stone-800 overflow-hidden flex flex-col h-[650px] shadow-2xl animate-fadeIn">
          {/* Header del Chat */}
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="font-display font-bold text-sm text-stone-100 flex items-center gap-2">
                  <span>Chat General de Operaciones · {hotelName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    En Directo
                  </span>
                </h3>
                <p className="text-[11px] font-mono text-stone-400">
                  Canal para comunicar incidencias, roturas, preparación de turnos y subir fotos de trabajo.
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-stone-400 hidden sm:block">
              Identidad: <strong className="text-emerald-400">{currentMember.name}</strong>
            </div>
          </div>

          {/* Mensajes del Chat */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-950/40">
            {chatMessages.map((msg) => {
              const isMe = msg.senderName === currentMember.name;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  {msg.senderAvatar ? (
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName} 
                      className="w-9 h-9 rounded-xl object-cover border border-stone-700 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}

                  {/* Burbuja del Mensaje */}
                  <div className={`space-y-1.5 ${isMe ? 'items-end' : ''}`}>
                    <div className={`flex items-center gap-2 text-[11px] font-mono ${isMe ? 'justify-end' : ''}`}>
                      <span className={`font-bold ${isMe ? 'text-emerald-400' : 'text-stone-300'}`}>
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {msg.senderRole} · {msg.timestamp}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm font-sans space-y-2 leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-emerald-950/60 border border-emerald-700/80 text-emerald-100 rounded-tr-none'
                          : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none'
                      }`}
                    >
                      {/* Texto del mensaje */}
                      <p>{msg.content}</p>

                      {/* Foto adjunta si existe */}
                      {msg.imageUrl && (
                        <div className="space-y-1 pt-1">
                          <div 
                            className="rounded-xl overflow-hidden border border-stone-700 cursor-pointer group relative max-w-sm bg-black"
                            onClick={() => setLightboxImage({ url: msg.imageUrl!, caption: msg.imageCaption || msg.content })}
                          >
                            <img 
                              src={msg.imageUrl} 
                              alt="Foto adjunta en chat" 
                              className="w-full max-h-60 object-cover group-hover:scale-102 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1">
                              <Maximize2 className="w-4 h-4" />
                              <span>Ampliar foto</span>
                            </div>
                          </div>
                          {msg.imageCaption && (
                            <p className="text-[11px] font-mono text-stone-400 italic">
                              "{msg.imageCaption}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Vista previa de foto antes de enviar si se ha seleccionado una */}
          {chatAttachedImage && (
            <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3 animate-slideIn">
              <div className="flex items-center gap-3">
                <img 
                  src={chatAttachedImage} 
                  alt="Vista previa" 
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
                />
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                    Foto lista para compartir:
                  </span>
                  <input
                    type="text"
                    value={chatImageCaption}
                    onChange={(e) => setChatImageCaption(e.target.value)}
                    placeholder="Escribe un pie de foto (opcional)... ej: 'Sombrilla de terraza dañada'"
                    className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-200 w-64 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChatAttachedImage(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                title="Quitar foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Formulario de Envío de Mensaje */}
          <form 
            onSubmit={handleSendChatMessage} 
            className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
          >
            {/* Input invisible para fotos */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Botón Subir Foto desde Cámara / Dispositivo */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-emerald-400 border border-stone-700 transition-colors flex items-center gap-1.5 shrink-0"
              title="Subir foto de incidencia o trabajo"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono hidden sm:inline">Subir Foto</span>
            </button>

            {/* Fotos rápidas preset de hostelería si está probando en PC sin archivo */}
            <button
              type="button"
              onClick={() => {
                setChatAttachedImage('https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80');
                setChatImageCaption('Revisión de copas y cristalería para el atardecer');
              }}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-400 hover:text-stone-200 border border-stone-800 text-[11px] font-mono hidden md:inline shrink-0"
              title="Insertar foto de ejemplo de terraza/cóctel"
            >
              + Foto Ejemplo
            </button>

            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder={`Escribir como ${currentMember.name}... (ej: roturas, pedidos, turnos)`}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500 font-mono"
            />

            <button
              type="submit"
              disabled={!chatInputText.trim() && !chatAttachedImage}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* PESTAÑA 3: CENTRO DE NOTIFICACIONES ACTIVAS */}
      {/* ============================================================== */}
      {activeTab === 'notificaciones' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Registro de alertas y actividad reciente de la plantilla</span>
            <span className="text-[11px] text-purple-400 font-bold">
              {unreadNotificationsCount} sin leer
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {notifications.map((notif) => {
              const isUnread = !notif.isRead;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.linkTab === 'anuncios') setActiveTab('anuncios');
                    if (notif.linkTab === 'chat') setActiveTab('chat');
                    // Marcar como leída
                    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isUnread
                      ? 'bg-purple-950/30 border-purple-700/80 shadow-md shadow-purple-950/30'
                      : 'bg-stone-900/60 border-stone-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      notif.type === 'anuncio'
                        ? 'bg-sky-950 text-sky-400 border border-sky-800'
                        : notif.type === 'chat_foto'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : notif.type === 'rrhh_cert'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {notif.type === 'anuncio' && <Megaphone className="w-4 h-4" />}
                      {notif.type === 'chat_foto' && <Camera className="w-4 h-4" />}
                      {notif.type === 'rrhh_cert' && <UserCheck className="w-4 h-4" />}
                      {notif.type === 'caja_ticket' && <Clock className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-mono font-bold ${isUnread ? 'text-stone-100' : 'text-stone-300'}`}>
                          {notif.title}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-purple-400" />
                        )}
                      </div>
                      <p className="text-xs text-stone-300 font-sans leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="text-[10px] font-mono text-stone-500">
                        {notif.authorName} · {notif.timestamp}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-purple-400 self-center shrink-0 hover:underline">
                    Ver detalle →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: REDACTAR Y PUBLICAR NUEVO ANUNCIO */}
      {/* ============================================================== */}
      {showNewAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-950 border border-sky-800 text-sky-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                    COMUNICADO OFICIAL · {hotelName}
                  </span>
                  <h3 className="text-lg font-display font-bold text-stone-100">
                    Publicar Anuncio en el Tablón de Equipo
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowNewAnnouncementModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs font-mono">
              {/* Autor */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Publicando como:</span>
                <span className="font-bold text-emerald-400">
                  {currentMember.name} ({currentMember.role})
                </span>
              </div>

              {/* Título */}
              <div className="space-y-1">
                <label className="text-stone-300 block font-bold">
                  Título del Anuncio: *
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Ej: Evento especial en Terraza Los Gigantes a las 18:00 h"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-sky-500 font-sans text-sm"
                />
              </div>

              {/* Categoría y Fijar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300 block font-bold">
                    Categoría del Comunicado:
                  </label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-stone-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="operativa">Operativa de Servicio</option>
                    <option value="urgente">Urgente / Prioritario</option>
                    <option value="eventos">Eventos & Reservas VIP</option>
                    <option value="turnos">Turnos & Horarios</option>
                    <option value="mantenimiento">Mantenimiento & Técnico</option>
                    <option value="sanidad_rrhh">Sanidad & RRHH</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300 block font-bold">
                    Destacar en la Cabecera:
                  </label>
                  <button
                    type="button"
                    onClick={() => setAnnIsPinned(!annIsPinned)}
                    className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                      annIsPinned
                        ? 'bg-sky-950 text-sky-300 border-sky-600'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-850'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                    <span>{annIsPinned ? 'Fijado al principio (📌)' : 'Posición estándar'}</span>
                  </button>
                </div>
              </div>

              {/* Mensaje */}
              <div className="space-y-1">
                <label className="text-stone-300 block font-bold">
                  Contenido del Comunicado: *
                </label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Detalla las instrucciones para el equipo, horarios, qué preparar o precauciones a tener en cuenta..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-sky-500 font-sans text-sm"
                />
              </div>

              {/* URL de Imagen opcional */}
              <div className="space-y-1">
                <label className="text-stone-300 block">
                  Foto o Imagen de Soporte (URL opcional):
                </label>
                <input
                  type="text"
                  value={annImageUrl}
                  onChange={(e) => setAnnImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto-evento.jpg"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Banner informativo de notificación */}
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-300 text-[11px] leading-relaxed">
                🔔 <strong>Aviso automático:</strong> Al publicar este anuncio, saltará una notificación instantánea a toda la plantilla del hotel indicando: <em>"{currentMember.name} ha publicado: [Título]"</em>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowNewAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold font-mono text-xs flex items-center gap-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Publicar & Notificar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VISOR DE FOTO EN PANTALLA COMPLETA (LIGHTBOX) */}
      {/* ============================================================== */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative space-y-2 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-mono text-stone-300 font-bold">
                {lightboxImage.caption || 'Foto de Operaciones · Klayman Diamond'}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[80vh] flex items-center justify-center bg-black rounded-2xl overflow-hidden">
              <img 
                src={lightboxImage.url} 
                alt="Foto ampliada" 
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
