/**
 * GESTOR DE FOTOGRAFÍAS OFICIALES Y PERSONALIZADAS DE ARTÍCULOS Y CARTAS KLAYMAN
 * Permite renderizar imágenes de alta calidad para cada cóctel y producto de la carta,
 * además de permitir a los usuarios subir sus propios archivos de fotos con persistencia en localStorage.
 */

const STORAGE_KEY = 'klayman_diamond_custom_photos';

// Catálogo fotográfico predeterminado oficial
export const DEFAULT_ITEM_PHOTOS: Record<string, string> = {
  // Cócteles oficiales Klayman Diamond (FT CKT 01 a FT CKT 44)
  'ft-dia-ckt-01': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  'item-ckt-01-sex-on-the-beach': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-02': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  'item-ckt-02-blue-diamond': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-03': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'item-ckt-03-mojito-tradicional': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-04': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
  'item-ckt-04-vodka-berry-elderflower': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-05': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  'item-ckt-05-dreamland': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-06': 'https://images.unsplash.com/photo-1551751299-1b51cbd999b6?auto=format&fit=crop&w=800&q=80',
  'item-ckt-06-negroni': 'https://images.unsplash.com/photo-1551751299-1b51cbd999b6?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-07': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
  'item-ckt-07-fresa-colada': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-08': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-08-old-fashioned': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-09': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  'item-ckt-09-kir-royal': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-10': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'item-ckt-10-cava-estrellas': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'item-ckt-10-estrellas': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-11': 'https://images.unsplash.com/photo-1587223081156-6107a64f037c?auto=format&fit=crop&w=800&q=80',
  'item-ckt-11-cava-rossini': 'https://images.unsplash.com/photo-1587223081156-6107a64f037c?auto=format&fit=crop&w=800&q=80',
  'item-ckt-11-rossini': 'https://images.unsplash.com/photo-1587223081156-6107a64f037c?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-12': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  'item-ckt-12-long-island-iced-tea': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-13': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  'item-ckt-13-bloody-mary': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-14': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  'item-ckt-14-pina-colada': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-15': 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80',
  'item-ckt-15-lady-marmalade': 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-16': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  'item-ckt-16-aperol-spritz': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-17': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-17-woo-woo': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-18': 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80',
  'item-ckt-18-classic-martini': 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-19': 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80',
  'item-ckt-19-espresso-martini': 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-20': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-20-porn-star-martini': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-21': 'https://images.unsplash.com/photo-1551751299-1b51cbd999b6?auto=format&fit=crop&w=800&q=80',
  'item-ckt-21-americano': 'https://images.unsplash.com/photo-1551751299-1b51cbd999b6?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-22': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'item-ckt-22-virgin-mojito': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-23': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
  'item-ckt-23-san-francisco': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-24': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  'item-ckt-24-virgin-colada': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-25': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  'item-ckt-25-mai-tai': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-26': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  'item-ckt-26-daiquiri': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-27': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  'item-ckt-27-daiquiri-fresa': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-28': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  'item-ckt-28-daiquiri-mango': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-29': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-29-daiquiri-passion-fruit': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-30': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  'item-ckt-30-margarita-tradicional': 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-31': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  'item-ckt-31-margarita-fresa': 'https://images.unsplash.com/photo-1579619564365-036ef16a6662?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-32': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  'item-ckt-32-margarita-mango': 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-33': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-33-margarita-passion-fruit': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-34': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
  'item-ckt-34-mojito-fresa': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-35': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-35-mojito-fruta-pasion': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-36': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'item-ckt-36-green-olivina': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-37': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  'item-ckt-37-bahama-mama': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-38': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  'item-ckt-38-campari-spritz': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-39': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'item-ckt-39-limoncello-spritz': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'item-ckt-hugo-spritz': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'ft-dia-ckt-45': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-40': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  'item-ckt-40-perfect-continuous': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-41': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  'item-ckt-41-tequila-sunrise': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-42': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  'item-ckt-42-tom-collins': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  
  'ft-dia-ckt-43': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
  'item-ckt-43-strawberry-shortcake': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',

  'ft-dia-ckt-44': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'item-ckt-44-barraquito-especial-canario': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',

  // Cafetería & Barraquitos
  'ft-dia-barraquito': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'item-barraquito-especial': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'item-cafe-bombon': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
  'item-cafe-leche-leche': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  'item-cafe-con-leche': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
  'item-cafe-solo': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
  'item-cafe-cortado': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  'item-cappuccino-diamond': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
  'item-infusiones-premium': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',

  // Cervezas & Refrescos
  'ft-dia-cerv-dorada-50cl': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
  'item-dorada-especial': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
  'item-dorada-tostada': 'https://images.unsplash.com/photo-1608270195509-0d34fa9b068c?auto=format&fit=crop&w=800&q=80',
  'item-dorada-sin-gluten': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
  'item-coronita': 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=800&q=80',
  'item-cerveza-sin-alcohol': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
  'item-refrescos-varios': 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?auto=format&fit=crop&w=800&q=80',
  'item-agua-fuentealta': 'https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=800&q=80',
  'item-zumo-naranja-natural': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',

  // Vinos & Cavas
  'item-vino-blanco': 'https://images.unsplash.com/photo-1566993215286-9a2c3a506456?auto=format&fit=crop&w=800&q=80',
  'item-vino-tinto': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'item-vino-rosado': 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=800&q=80',
  'item-cava-brut': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
  'item-champagne-moet': 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80',

  // Confitería & Tartas
  'item-tarta-queso': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  'item-brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  'item-tarta-zanahoria': 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',

  // Snacks & Salados
  'ft-dia-cheese-board': 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=800&q=80',
  'item-tabla-quesos-bar': 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=800&q=80',
  'item-sandwich-club': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  'item-focaccia-iberica': 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
  'item-mix-frutos-secos': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',

  // Promociones Oficiales AK Terraza Diamond
  'dia-promo-lunes-beer': 'https://images.unsplash.com/photo-1608270195587-c1042b78b056?auto=format&fit=crop&w=1200&q=80',
  'dia-promo-spritz-oferta': 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=80',
  'dia-promo-mojitos': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
  'dia-promo-viernes-hh-allday': 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
  'dia-promo-01': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80'
};

// Carga las fotos personalizadas del usuario almacenadas localmente
export function getCustomPhotosMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error al leer fotos personalizadas de localStorage:', err);
    return {};
  }
}

// Resuelve la foto de un artículo o ficha técnica (prioriza foto subida por usuario, luego default, luego fallback)
export function resolveItemPhoto(
  itemId?: string, 
  technicalSheetId?: string, 
  explicitPhoto?: string
): string | undefined {
  if (explicitPhoto && explicitPhoto.trim().length > 0) return explicitPhoto;

  const customMap = getCustomPhotosMap();

  // 1. Verificar si hay foto personalizada por itemId
  if (itemId && customMap[itemId]) return customMap[itemId];

  // 2. Verificar si hay foto personalizada por technicalSheetId
  if (technicalSheetId && customMap[technicalSheetId]) return customMap[technicalSheetId];

  // 3. Verificar si hay foto en catálogo default por itemId
  if (itemId && DEFAULT_ITEM_PHOTOS[itemId]) return DEFAULT_ITEM_PHOTOS[itemId];

  // 4. Verificar si hay foto en catálogo default por technicalSheetId
  if (technicalSheetId && DEFAULT_ITEM_PHOTOS[technicalSheetId]) return DEFAULT_ITEM_PHOTOS[technicalSheetId];

  return undefined;
}

// Guarda una foto personalizada (DataURL o URL web) para un artículo o ficha
export function saveCustomItemPhoto(key: string, photoUrl: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomPhotosMap();
    current[key] = photoUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    // Disparar evento para que todos los componentes reactivos se sincronicen al instante
    window.dispatchEvent(new Event('klayman_photos_updated'));
  } catch (err) {
    console.error('Error al guardar foto personalizada:', err);
  }
}

// Restablece la foto de un artículo a su valor por defecto
export function resetCustomItemPhoto(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getCustomPhotosMap();
    delete current[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('klayman_photos_updated'));
  } catch (err) {
    console.error('Error al restablecer foto:', err);
  }
}
