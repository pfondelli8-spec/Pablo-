/**
 * SERVICIO OFICIAL DE NOTIFICACIONES Y ALERTAS EN MÓVIL PARA PROMOCIONES KLAYMAN
 * Gestiona notificaciones del sistema (Web Notifications API / PWA Service Worker),
 * avisos programados (Happy Hour a las 14:55 h, ofertas de día a las 10:00 h),
 * alertas in-app flotantes con sonido y vibración en dispositivos móviles.
 */

export interface PromoNotificationConfig {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  happyHourReminderTime: string;   // '14:55' (5 minutos antes de las 15:00 h)
  morningAlertTime: string;        // '10:00' (10 de la mañana para promociones de día)
  cocktailsReminderTime: string;   // '15:55' (5 min antes de las 16:00 h)
}

export interface PromoAlertPayload {
  id: string;
  promoId: string;
  title: string;
  body: string;
  time: string;
  tag: string;
  badgeText: string;
  category: 'happy_hour' | 'dia_promo' | 'prep_aviso';
  iconType: 'beer' | 'cocktail' | 'spritz' | 'flame';
  actionUrl?: string;
  timestamp: number;
}

const CONFIG_KEY = 'klayman_promo_notif_config';
const SENT_LOG_KEY = 'klayman_promo_sent_alerts_log';

export const DEFAULT_CONFIG: PromoNotificationConfig = {
  enabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  happyHourReminderTime: '14:55',
  morningAlertTime: '10:00',
  cocktailsReminderTime: '15:55'
};

// Obtener configuración guardada
export function getPromoNotificationConfig(): PromoNotificationConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? { ...DEFAULT_CONFIG, ...JSON.parse(raw) } : DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// Guardar configuración
export function savePromoNotificationConfig(config: Partial<PromoNotificationConfig>): PromoNotificationConfig {
  const current = getPromoNotificationConfig();
  const updated = { ...current, ...config };
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('klayman_promo_config_updated', { detail: updated }));
  }
  return updated;
}

// Comprobar estado de permisos del navegador
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Solicitar permiso de notificaciones al usuario
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      savePromoNotificationConfig({ enabled: true });
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error al solicitar permiso de notificaciones:', err);
    return false;
  }
}

// Reproducir tono de campana hotelera con Web Audio API (sin dependencias de archivos externos)
export function playPromoChime(): void {
  if (typeof window === 'undefined') return;
  const config = getPromoNotificationConfig();
  if (!config.soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Tono 1 (Frecuencia 587.33 Hz - Re 5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.18, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.6);

    // Tono 2 (Frecuencia 880 Hz - La 5, armónico superior tras 120ms)
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, ctx.currentTime);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.9);
      } catch {}
    }, 120);

  } catch (err) {
    console.warn('AudioContext no disponible o bloqueado por interacción previa:', err);
  }
}

// Vibración para móviles
export function triggerPromoVibration(): void {
  if (typeof window === 'undefined') return;
  const config = getPromoNotificationConfig();
  if (!config.vibrationEnabled) return;

  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate([180, 100, 180, 100, 260]);
    } catch {}
  }
}

// Registrar en el historial persistente de notificaciones del hotel
function saveToInternalNotificationStore(payload: PromoAlertPayload): void {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = 'klayman_klayman-diamond_notifications';
    const raw = localStorage.getItem(storageKey);
    const existing = raw ? JSON.parse(raw) : [];

    const newNotif = {
      id: `promo-alert-${Date.now()}`,
      title: payload.title,
      message: payload.body,
      category: 'general' as const,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      priority: 'alta' as const,
      author: 'Sistema de Promociones AK Terraza',
      requiresAck: false,
      date: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem(storageKey, JSON.stringify([newNotif, ...existing.slice(0, 49)]));
    window.dispatchEvent(new Event('klayman_notifications_updated'));
  } catch (err) {
    console.error('Error al guardar en historial de notificaciones:', err);
  }
}

// Disparar una notificación completa (Sistema, In-App, Sonido, Vibración e Historial)
export function dispatchPromoNotification(payload: PromoAlertPayload): void {
  if (typeof window === 'undefined') return;
  const config = getPromoNotificationConfig();
  if (!config.enabled) return;

  // 1. Sonido
  playPromoChime();

  // 2. Vibración móvil
  triggerPromoVibration();

  // 3. Notificación nativa del sistema (Móvil / PWA / Escritorio)
  if (getNotificationPermissionStatus() === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          const options: NotificationOptions & { vibrate?: number[] } = {
            body: payload.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: payload.tag,
            vibrate: [200, 100, 200, 100, 300],
            data: { url: payload.actionUrl || '/' }
          };
          reg.showNotification(payload.title, options as NotificationOptions);
        }).catch(() => {
          new Notification(payload.title, {
            body: payload.body,
            tag: payload.tag
          });
        });
      } else {
        new Notification(payload.title, {
          body: payload.body,
          tag: payload.tag
        });
      }
    } catch (err) {
      console.warn('No se pudo enviar notificación nativa:', err);
    }
  }

  // 4. Disparar evento para Banner Flotante In-App
  window.dispatchEvent(new CustomEvent('klayman_promo_notification', { detail: payload }));

  // 5. Guardar en el centro de notificaciones general
  saveToInternalNotificationStore(payload);
}

// Verificar si una notificación ya se envió hoy
function hasAlertBeenSentToday(alertId: string, dateKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SENT_LOG_KEY);
    const log = raw ? JSON.parse(raw) : {};
    return log[dateKey]?.includes(alertId) || false;
  } catch {
    return false;
  }
}

// Marcar alerta como enviada hoy
function markAlertAsSentToday(alertId: string, dateKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(SENT_LOG_KEY);
    const log = raw ? JSON.parse(raw) : {};
    if (!log[dateKey]) {
      log[dateKey] = [];
    }
    log[dateKey].push(alertId);
    localStorage.setItem(SENT_LOG_KEY, JSON.stringify(log));
  } catch {}
}

/**
 * REVISOR AUTOMÁTICO DE HORARIOS DE PROMOCIONES
 * Comprueba las horas exactas solicitadas por el usuario:
 * 1. Happy Hour Diario a las 14:55 h (5 min antes de las 15:00 h).
 * 2. Promociones de un día a las 10:00 h de la mañana.
 * 3. Avisos previos de turnos (15:55 h Viernes Cócteles).
 */
export function checkScheduledPromotions(): void {
  if (typeof window === 'undefined') return;
  const config = getPromoNotificationConfig();
  if (!config.enabled) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  const dayOfWeek = now.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
  const dateKey = now.toISOString().split('T')[0];

  // --------------------------------------------------------------------------
  // CASO 1: HAPPY HOUR A LAS 14:55 h (Tres menos cinco para las 15:00 h)
  // --------------------------------------------------------------------------
  if (currentTime === config.happyHourReminderTime) {
    const alertId = 'happy_hour_1455';
    if (!hasAlertBeenSentToday(alertId, dateKey)) {
      markAlertAsSentToday(alertId, dateKey);
      dispatchPromoNotification({
        id: `hh-${Date.now()}`,
        promoId: 'dia-promo-01',
        title: '⏰ Happy Hour en 5 min (14:55 h)',
        body: '¡A las 15:00 h arranca el Happy Hour Diario (15:00 - 16:00 h)! Solo incluye: 2 cócteles por 12 € o 2 jarras por 6 €. NORMAS: Siempre la misma consumición en pareja (ej. 2 margaritas, 2 jarras). No se vende 1 sola jarra ni se admiten mitades.',
        time: currentTime,
        tag: 'promo-happy-hour-prep',
        badgeText: 'HH 2 CÓCTELES 12€ · 2 JARRAS 6€',
        category: 'happy_hour',
        iconType: 'flame',
        timestamp: Date.now()
      });
    }
  }

  // --------------------------------------------------------------------------
  // CASO 2: AVISO MATUTINO A LAS 10:00 h DE LA MAÑANA (Promociones del día)
  // --------------------------------------------------------------------------
  if (currentTime === config.morningAlertTime) {
    // Lunes: Jarras de cerveza 3,00 €
    if (dayOfWeek === 1) {
      const alertId = 'morning_lunes_beer';
      if (!hasAlertBeenSentToday(alertId, dateKey)) {
        markAlertAsSentToday(alertId, dateKey);
        dispatchPromoNotification({
          id: `lunes-beer-${Date.now()}`,
          promoId: 'dia-promo-lunes-beer',
          title: '🍺 Oferta de Hoy: Lunes de Jarras de Cerveza 3€ (10:00 h)',
          body: 'Hoy lunes: Jarras de cerveza Dorada Especial (50 cl) a solo 3,00 € todo el día en AK Terraza Diamond. Verifica barriles y jarras heladas a 2ºC con frutos secos.',
          time: currentTime,
          tag: 'promo-lunes-beer-morning',
          badgeText: 'LUNES · JARRAS 3€',
          category: 'dia_promo',
          iconType: 'beer',
          timestamp: Date.now()
        });
      }
    }

    // Miércoles: Las 4 variedades de Spritz a 6,00 € (08:00 - 22:30 h)
    if (dayOfWeek === 3) {
      const alertId = 'morning_spritz_oferta_miercoles';
      if (!hasAlertBeenSentToday(alertId, dateKey)) {
        markAlertAsSentToday(alertId, dateKey);
        dispatchPromoNotification({
          id: `spritz-dia-${Date.now()}`,
          promoId: 'dia-promo-spritz-oferta',
          title: '🍹 Oferta de Hoy: Miércoles de Spritz a 6,00 € · Las 4 Variedades',
          body: '¡Hoy miércoles activa la oferta de las 4 variedades oficiales de Spritz a 6,00 € la copa todo el día (08:00 a 22:30 h) en AK Terraza Diamond! (Aperol, Campari, Limoncello y Hugo Spritz).',
          time: currentTime,
          tag: 'promo-spritz-morning',
          badgeText: 'MIÉRCOLES: 4 SPRITZ 6€',
          category: 'dia_promo',
          iconType: 'spritz',
          timestamp: Date.now()
        });
      }
    }

    // Domingos: Mojitos a 5,00 € (08:00 - 22:30 h)
    if (dayOfWeek === 0) {
      const alertId = 'morning_domingos_mojitos_5';
      if (!hasAlertBeenSentToday(alertId, dateKey)) {
        markAlertAsSentToday(alertId, dateKey);
        dispatchPromoNotification({
          id: `mojitos-dia-${Date.now()}`,
          promoId: 'dia-promo-mojitos',
          title: '🍹 Oferta de Hoy: Domingos de Mojitos a 5,00 € · Solo Domingos',
          body: '¡Hoy domingo activa la oferta de Mojitos a 5,00 € en AK Terraza Diamond (08:00 a 22:30 h)! Mojito Tradicional, Mojito de Fresa, Mojito de Maracuyá y Virgin Mojito 0.0%.',
          time: currentTime,
          tag: 'promo-domingos-mojitos',
          badgeText: 'DOMINGOS: MOJITOS 5€',
          category: 'dia_promo',
          iconType: 'cocktail',
          timestamp: Date.now()
        });
      }
    }

    // Viernes: 2x1 en Cócteles Seleccionados (10:00 a 22:00 h)
    if (dayOfWeek === 5) {
      const alertId = 'morning_viernes_hh_allday';
      if (!hasAlertBeenSentToday(alertId, dateKey)) {
        markAlertAsSentToday(alertId, dateKey);
        dispatchPromoNotification({
          id: `viernes-hh-${Date.now()}`,
          promoId: 'dia-promo-viernes-hh-allday',
          title: '🍹 Oferta de Hoy: Viernes 2x1 en Cócteles Seleccionados (10:00 h)',
          body: '¡Hoy viernes activa el 2x1 en Cócteles Seleccionados de 10:00 h a 22:00 h en AK Terraza Diamond! (Mojitos, Margaritas, Piña Colada y más).',
          time: currentTime,
          tag: 'promo-viernes-morning',
          badgeText: 'VIERNES 2X1 CÓCTELES',
          category: 'dia_promo',
          iconType: 'flame',
          timestamp: Date.now()
        });
      }
    }
  }
}

/**
 * SIMULADOR Y MODO DE PRUEBAS
 * Permite al personal comprobar al instante cómo llega la notificación al móvil
 */
export function simulatePromoAlert(type: 'happy_hour' | 'lunes_beer' | 'spritz_days' | 'domingos_mojitos' | 'viernes_hh'): void {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  switch (type) {
    case 'happy_hour':
      dispatchPromoNotification({
        id: `sim-hh-${Date.now()}`,
        promoId: 'dia-promo-01',
        title: '⏰ Happy Hour en 5 min (14:55 h) [SIMULACIÓN]',
        body: '¡A las 15:00 h inicia el Happy Hour (15:00 - 16:00 h)! Solo 2 cócteles por 12 € ó 2 jarras por 6 €. NORMAS ESTRICTAS: Parejas idénticas obligatorias (mismo cóctel o misma jarra). No se puede pedir 1 jarra suelta ni hay mitad.',
        time: '14:55',
        tag: 'sim-happy-hour',
        badgeText: 'HH 2 CÓCTELES 12€ · 2 JARRAS 6€',
        category: 'happy_hour',
        iconType: 'flame',
        timestamp: Date.now()
      });
      break;

    case 'spritz_days':
      dispatchPromoNotification({
        id: `sim-spritz-${Date.now()}`,
        promoId: 'dia-promo-spritz-oferta',
        title: '🍹 Miércoles de Spritz a 6€ · Las 4 Variedades [SIMULACIÓN]',
        body: '¡Las 4 variedades oficiales de Spritz (Aperol, Campari, Limoncello y Hugo Spritz) a solo 6,00 € la copa exclusivamente los miércoles en AK Terraza Diamond!',
        time: '10:00',
        tag: 'sim-spritz-oferta',
        badgeText: 'MIÉRCOLES · SPRITZ 6€',
        category: 'dia_promo',
        iconType: 'spritz',
        timestamp: Date.now()
      });
      break;

    case 'lunes_beer':
      dispatchPromoNotification({
        id: `sim-lunes-${Date.now()}`,
        promoId: 'dia-promo-lunes-beer',
        title: '🍺 Oferta de Hoy: Lunes de Jarras de Cerveza 3€ (10:00 h) [SIMULACIÓN]',
        body: 'Hoy lunes activa la oferta de Jarras de Cerveza Dorada Especial a 3,00 € (08:00 - 22:00 h) en AK Terraza Diamond con frutos secos tostados canarios de cortesía.',
        time: '10:00',
        tag: 'sim-lunes-beer',
        badgeText: 'LUNES · JARRAS 3€',
        category: 'dia_promo',
        iconType: 'beer',
        timestamp: Date.now()
      });
      break;

    case 'domingos_mojitos':
      dispatchPromoNotification({
        id: `sim-mojitos-${Date.now()}`,
        promoId: 'dia-promo-mojitos',
        title: '🍹 Oferta de Hoy: Domingos de Mojitos a 5€ (10:00 h) [SIMULACIÓN]',
        body: 'Hoy domingo activa la oferta de Mojitos a 5,00 € en AK Terraza Diamond (08:00 - 22:30 h). Mojito Tradicional, Fresa, Maracuyá y Virgin Mojito.',
        time: '10:00',
        tag: 'sim-domingos-mojitos',
        badgeText: 'DOMINGOS · MOJITOS 5€',
        category: 'dia_promo',
        iconType: 'cocktail',
        timestamp: Date.now()
      });
      break;

    case 'viernes_hh':
      dispatchPromoNotification({
        id: `sim-viernes-hh-${Date.now()}`,
        promoId: 'dia-promo-viernes-hh-allday',
        title: '🍹 Oferta de Hoy: Viernes 2x1 en Cócteles Seleccionados [SIMULACIÓN]',
        body: 'Hoy viernes activa el 2x1 en Cócteles Seleccionados de 10:00 h a 22:00 h en AK Terraza Diamond.',
        time: '10:00',
        tag: 'sim-viernes-hh',
        badgeText: 'VIERNES 2X1 CÓCTELES',
        category: 'dia_promo',
        iconType: 'flame',
        timestamp: Date.now()
      });
      break;
  }
}

// Inicializar Service Worker y temporizador de comprobación en segundo plano
let checkIntervalId: NodeJS.Timeout | null = null;

export function initPromoNotificationService(): void {
  if (typeof window === 'undefined') return;

  // Registrar Service Worker para soporte de notificaciones push móviles si está disponible
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Registro de SW omitido o no compatible en este entorno:', err);
    });
  }

  // Ejecutar primera comprobación
  checkScheduledPromotions();

  // Iniciar ciclo de comprobación periódica cada 20 segundos
  if (!checkIntervalId) {
    checkIntervalId = setInterval(() => {
      checkScheduledPromotions();
    }, 20000);
  }
}
