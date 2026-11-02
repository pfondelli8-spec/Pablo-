/**
 * Motor de conocimiento operativo para el Asistente Operativo KLAYMAN
 * Basado estrictamente en la documentación oficial cargada en el portal.
 */
import { COCKTAILS_MASTER_TECHNICAL_SHEETS } from '../data/cocktailMasterTable';

export interface AssistantAnswer {
  answer: string;
  location?: string;
  category?: 'cartas' | 'fichas' | 'promociones' | 'procedimientos' | 'puesto' | 'general';
  suggestedAction?: {
    label: string;
    actionType: 'open_tab' | 'open_item' | 'info';
    target?: string;
  };
}

export const KLAYMAN_OFFICIAL_KNOWLEDGE_PROMPT = `
DOCUMENTACIÓN OFICIAL OPERATIVA DE KLAYMAN APARTHOTELS (KLAYMAN DIAMOND):

1. IDENTIFICACIÓN Y UBICACIÓN
- Hotel: Klayman Diamond Aparthotel (4 estrellas).
- Ubicación: Los Gigantes, Santiago del Teide (Tenerife). Calle El Pino, 3.
- Departamento operativo activo: F&B (Bar / Terraza Diamond).
- Otros departamentos (Recepción, Cocina, Pisos, Mantenimiento, Administración, Otros): Están en fase de estructuración documental; actualmente no disponen de procedimientos operativos específicos cargados.

2. CARTAS Y BEBIDAS DE TERRAZA (Pestaña: 1. CARTAS)
- Estructura: 32 cócteles oficiales estandarizados (29 con alcohol y 3 sin alcohol 0.0%) con precios de carta actualizados:
- Cócteles a 8,50 € (24 con alcohol): Sex on the Beach (8,50 €), Blue Diamond (8,50 €), Mojito Tradicional (8,50 €), Mojito Sabores (8,50 €), Daiquiris de Sabores (8,50 €), Margarita Tradicional (8,50 €), Margarita Sabores (8,50 €), Vodka Berry (8,50 €), Dreamland (8,50 €), Negroni (8,50 €), Fresa Colada (8,50 €), Old Fashioned (8,50 €), Bahama Mama (8,50 €), Blood and Sand (8,50 €), Kir Royal (8,50 €), Estrellas (8,50 €), Rossini (8,50 €), Piña Colada (8,50 €), Aperol Spritz (8,50 €), Woo Woo (8,50 €), Classic Martini (8,50 €), Espresso Martini (8,50 €), Passion Fruit Martini (8,50 €), Americano (8,50 €).
- Cócteles a 9,00 € (5 cócteles especiales): Long Island Ice Tea (9,00 €), Bloody Mary (9,00 €), Lady Marmalade (9,00 €), Perfect Continuous (9,00 €), Mai Thai (9,00 €).
- Cócteles Sin Alcohol a 6,50 € (3 mocktails): Virgin Mojito 0.0% (6,50 €), San Francisco 0.0% (6,50 €), Virgin Colada 0.0% (6,50 €).
- Cafetería de Especialidad: Barraquito Especial Diamond (3,80 € - técnica de 5 capas visibles), Bombón Canario (2,60 €), Leche y Leche (2,80 €), Café con Leche (2,20 €), Espresso (1,80 €), Cortado (2,00 €), Cappuccino (3,20 €), Tés e Infusiones (2,50 €).
- Cervezas frías: Dorada Especial de Barril (3,50 €), Dorada Tostada (3,80 €), Dorada Sin Gluten (3,80 €), Coronita / Stella (4,00 €), Cerveza 0.0% (3,50 €).
- Vinos de Tenerife: Viñátigo Blanco Listán (4,50 € / 22,00 €), Tajinaste Tinto Tradicional (5,00 € / 24,00 €), Brumas de Ayosa Rosado (4,50 € / 20,00 €), Cava Brut Nature Reserva (5,00 € / 26,00 €), Champagne Moët & Chandon (75,00 €).
- Snacks: Tabla de Quesos Artesanos de Tenerife (13,50 €), Sándwich Club Diamond (9,50 €), Focaccia de Jamón Ibérico (8,50 €), Tarta de Queso Fluida (6,50 €), Brownie con Helado (6,50 €).

3. TABLA MAESTRA · 29 FICHAS TÉCNICAS OFICIALES DE COCTELERÍA (Pestaña: 2. FICHAS TÉCNICAS)
Total: 26 con alcohol + 3 sin alcohol (29 cócteles estandarizados):
- FT CKT 01 (Sex on the Beach): Vodka 4 cl, Licor de melocotón 2 cl, Zumo fresco de naranja 2 cl, Zumo de arándanos 4 cl. Cubitos. Copa Hurricane de policarbonato. Media rodaja de naranja. Directo sobre hielo y remover suavemente. Punto crítico: No sobrediluir.
- FT CKT 02 (Blue Diamond): Ron blanco 4 cl, Blue Curaçao 2 cl, Licor de coco 2 cl, Zumo de piña 5 cl. Cubitos. Copa Hurricane de policarbonato. Naranja, hierbabuena y 2 pajitas negras. Agitar 10-12 s y colar sobre hielo fresco. Punto crítico: Usar hielo fresco.
- FT CKT 03 (Mojito Tradicional): Ron blanco 4,5 cl, Zumo fresco de lima 2 cl, Hierbabuena 6 ramitas, Azúcar blanco 2 cucharaditas, Soda para completar. Hielo Pilé. Vaso Diamond de policarbonato. Hierbabuena y rodaja de lima. Majado suave; añadir soda, hielo y ron; completar y remover. Punto crítico: No romper las hojas.
- FT CKT 04 (Mojito Sabores): Base Mojito Tradicional 1 receta, Puré de sabor 2,5 cl. Hielo Pilé. Vaso Diamond de policarbonato. Hierbabuena, lima y fruta del sabor. Punto crítico: Mantener uniformidad por sabor.
- FT CKT 05 (Daiquiris de Sabores): Ron blanco 6 cl, Zumo fresco de lima 2 cl, Azúcar superfino 2 cucharaditas, Puré de sabor. Textura Frozen. Copa Margarita de policarbonato. Fruta deshidratada del sabor. Batir con hielo y puré hasta textura frozen densa. Punto crítico: Sin separación de fases.
- FT CKT 06 (Margarita Tradicional): Tequila 100% agave 5 cl, Triple Sec 2 cl, Zumo fresco de lima 1,5 cl. Sin hielo en servicio. Copa Margarita de policarbonato escarchada. Medio borde de sal. Agitar con hielo y colar en copa fría. Punto crítico: No salar el interior.
- FT CKT 07 (Margarita Sabores): Base Margarita 1 receta, Puré de sabor 3 cl. Sin hielo en servicio. Copa Margarita de policarbonato. Medio borde de sal y fruta del sabor. Agitar con hielo y doble colado. Punto crítico: Doble colado obligatorio.
- FT CKT 08 (Vodka Berry / Elderflower): Vodka 4 cl, Licor de flor de saúco 2 cl, Zumo de limón 2 cl, Tónica Berry 15 cl, Concentrado de fresa 1 cl. Cubitos. Copa Hurricane de policarbonato. Naranja fina y 3 frutos rojos. Construir sobre hielo; tónica al final y remover suavemente. Punto crítico: Preservar carbonatación.
- FT CKT 09 (Dreamland): Amaretto 3 cl, Vodka 3 cl, Granadina 1 cl, Zumo de piña 9 cl. Cubitos. Copa Hurricane de policarbonato. Media luna de naranja y pajita negra. Granadina lentamente por la pared. Punto crítico: Controlar dulzor y efecto visual.
- FT CKT 10 (Negroni): Ginebra 3 cl, Campari 3 cl, Vermut rojo 3 cl. Proporción 1:1:1. Bloque grande de hielo. Vaso Rocks de policarbonato. Media rodaja de naranja. Refrescar sobre bloque grande. Punto crítico: Proporción 1:1:1.
- FT CKT 11 (Fresa Colada): Ron blanco 4 cl, Licor de coco 2 cl, Puré de fresa 2 cl, Zumo de piña 8 cl. Hielo triturado. Copa Hurricane de policarbonato. Naranja, fresa y 2 pajitas. Batir hasta textura cremosa. Punto crítico: Textura no acuosa.
- FT CKT 12 (Old Fashioned): Bourbon o Rye Whiskey 4,5 cl, Terrón de azúcar 1 ud., Angostura 3 golpes, Agua 1 splash. Bloque grande de hielo. Vaso Rocks de policarbonato. Piel de naranja y cereza de cóctel. Saturar azúcar, integrar, añadir whiskey y remover. Punto crítico: Dilución progresiva.
- FT CKT 13 (Kir Royal): Crème de Cassis 1 cl, Champagne 9 cl. Sin hielo. Copa Flauta de policarbonato. Sin garnish. Verter Cassis y completar con Champagne frío. Punto crítico: Conservar burbuja.
- FT CKT 14 (Estrellas): Cava Brut 12 cl, Amaretto 2 cl. Sin hielo. Copa Flauta de policarbonato. Sin garnish. Verter Amaretto y completar con cava frío. Punto crítico: Servicio muy frío.
- FT CKT 15 (Rossini): Cava Brut 12 cl, Puré de fresa 2,5 cl. Sin hielo. Copa Flauta de policarbonato. Fresa pequeña. Integrar puré y completar suavemente con cava. Punto crítico: Conservar burbuja.
- FT CKT 16 (Long Island Iced Tea): Vodka 1,5 cl, Tequila 1,5 cl, Ron blanco 1,5 cl, Ginebra 1,5 cl, Triple Sec 1,5 cl, Zumo de limón 2,5 cl, Jarabe simple 3 cl, Cola para completar. Cubitos. Copa Hurricane de policarbonato. Rodaja de limón. Jigger obligatorio para los 5 destilados. Punto crítico: Jigger obligatorio.
- FT CKT 17 (Bloody Mary): Vodka 4,5 cl, Zumo de tomate 9 cl, Zumo de limón 1,5 cl, Salsa Worcestershire 2 golpes, Tabasco 2 golpes, Sal de apio, Pimienta negra. Cubitos. Copa Hurricane de policarbonato. Apio y gajo de limón. Remover y servir sobre hielo fresco. Punto crítico: Estandarizar sal y pimienta.
- FT CKT 18 (Piña Colada): Ron blanco 5 cl, Crema de coco 3 cl, Zumo de piña 5 cl. Frozen. Copa Hurricane de policarbonato. Piña y cereza de cóctel. Batir en blender hasta textura cremosa. Punto crítico: Controlar proporción de hielo.
- FT CKT 19 (Lady Marmalade): Ginebra 4 cl, Licor de fresa 2 cl, Zumo de lima 1,5 cl, Tónica 10 cl. Cubitos. Copa Balón de policarbonato. Naranja y fresa. Agitar base; colar y completar con tónica. Punto crítico: No agitar la tónica.
- FT CKT 20 (Aperol Spritz): Prosecco 9 cl, Aperol 6 cl, Soda 3 cl (Regla 3:2:1). Cubitos. Copa Balón (Spritz) de policarbonato. Rodaja de naranja. Construir 3:2:1 y remover una vez. Punto crítico: Preservar carbonatación.
- FT CKT 21 (Woo Woo): Vodka 4 cl, Licor de melocotón 2 cl, Zumo de lima 1,5 cl, Zumo de arándanos 8 cl. Cubitos. Copa Hurricane de policarbonato. Limón y naranja. Agitar y colar sobre hielo fresco. Punto crítico: Usar hielo nuevo.
- FT CKT 22 (Classic Martini): Ginebra 6 cl, Vermut seco 1 cl. Sin hielo en servicio. Copa Martini de policarbonato. Piel de limón o aceituna verde (alternativo, no simultáneo). Refrescar con hielo y colar en copa fría. Punto crítico: No agitar.
- FT CKT 23 (Espresso Martini): Vodka 5 cl, Kahlúa 3 cl, Jarabe simple 1 cl, Espresso fuerte 1 ud. Sin hielo en servicio. Copa Martini de policarbonato. 3 granos de café. Hard shake y doble colado. Punto crítico: Crema densa y estable.
- FT CKT 24 (Porn Star Martini): Vodka vainilla 5 cl, Licor de maracuyá 2 cl, Puré de maracuyá 5 cl, Azúcar vainillada 2 cucharadas de bar, Champagne 5 cl aparte en shot. Copa Martini y shot de policarbonato. Media fruta de la pasión con azúcar. Agitar, doble colar y servir Champagne aparte. Punto crítico: Explicar ritual de servicio.
- FT CKT 25 (Americano): Campari 3 cl, Vermut rojo 3 cl, Soda 3 cl. Cubitos. Vaso Rocks de policarbonato. Media rodaja de naranja y piel de limón. Construir sobre hielo; soda al final y remover. Punto crítico: Mínima dilución.
- FT CKT 26 (Virgin Mojito - Sin alcohol 1): Soda 12 cl, Hierbabuena 6 ramitas, Azúcar blanco 10 g, Lima 1/2 ud. Hielo Pilé. Vaso Diamond de policarbonato. Hierbabuena y lima. Majado suave; añadir hielo, completar y mezclar. Punto crítico: No romper hojas.
- FT CKT 27 (San Francisco - Sin alcohol 2): Zumo de naranja 7 cl, Zumo de piña 7 cl, Zumo de limón 2 cl, Granadina 2 cl. Cubitos. Copa Hurricane de policarbonato. Naranja y cereza de cóctel. Agitar zumos; servir sobre hielo y añadir granadina por la pared. Punto crítico: Mantener efecto bifásico.
- FT CKT 28 (Virgin Colada - Sin alcohol 3): Crema de coco 4 cl, Zumo de piña 12 cl. Frozen. Copa Hurricane de policarbonato. Piña y naranja. Batir hasta textura densa. Punto crítico: Sin separación de fases.
- FT CKT 29 (Mai Tai - Con alcohol 26): Ron blanco 3 cl, Ron oscuro 3 cl, Orange Curaçao 1,5 cl, Orgeat (almendra) 1,5 cl, Zumo de lima 3 cl, Jarabe simple 0,75 cl. Hielo picado. Vaso Rocks de policarbonato. Piña, menta y piel de lima. Agitar y servir sobre hielo picado. Alérgenos: Frutos de cáscara (Almendra en Orgeat). Punto crítico: Advertencia previa obligatoria.
- CAF-01 (Barraquito Especial Diamond): 25 ml Leche condensada, 20 ml Licor 43, 25 ml Espresso caliente 100% arábica, 50 ml Leche entera emulsionada, Canela de Ceilán y corteza de limón. Vaso termorresistente de 180 ml. Técnica de vertido por capas: 5 capas visibles nítidas. Coste 0,73 €, PVP 3,80 €.

4. PROMOCIONES Y OFERTAS ACTIVAS (Pestaña: 3. PROMOCIONES Y OFERTAS)
- REGLAS INNEGOCIABLES: HAPPY HOUR DIARIO (Todos los días de 15:00 a 16:00 h):
  * Horario: 15:00 a 16:00 h (Todos los días).
  * Oferta: 2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €.
  * Política de servicio:
    - Bebidas idénticas (mismo cóctel o dos jarras de cerveza).
    - Prohibido vender 1 jarra suelta a 3 €.
    - Cero excepciones: ni combinaciones mixtas ni mitad de precio.
  * Cócteles incluidos (6 oficiales): Margarita, Mojito, Blue Diamond Sunset, Piña Colada, Aperol Spritz, Sex on the Beach.
  * TPV: Botones [HH 2 CÓCTELES 12.00€] y [HH 2 JARRAS 6.00€].

- CALENDARIO SEMANAL DE PROMOCIONES VIGENTES:
  1. "Lunes de Jarras de Cerveza 3 € (Mondays Pint Beer)":
     * Horario: Lunes, todo el día (08:00 h a 22:00 h).
     * Oferta: Jarra Dorada Especial (50 cl) = 3,00 € (Incluye frutos secos tostados canarios de cortesía).
     * TPV: Botón directo [PROMO LUNES JARRAS 3.00€].

  2. "Miércoles de Spritz a 6 € · Las 4 Variedades":
     * Horario: Miércoles exclusivamente, todo el día (08:00 h a 22:30 h).
     * Oferta: Spritz (Aperol, Campari, Limoncello, Hugo) = 6,00 € la copa.
     * TPV: Botón directo [PROMO SPRITZ 6.00€].

  3. "Viernes 2x1 en Cócteles Seleccionados":
     * Horario: Viernes de 10:00 h a 22:00 h.
     * Oferta: 2x1 en cócteles seleccionados de la carta.
     * TPV: Botón directo [PROMO VIERNES 2X1 CÓCTELES].

  4. "Domingos de Mojitos a 5 € · Solo Domingos":
     * Horario: Domingo exclusivamente, todo el día (08:00 h a 22:30 h).
     * Oferta: Mojitos (Tradicional, Fresa, Maracuyá, Virgin) = 5,00 €.
     * TPV: Botón directo [PROMO DOMINGO MOJITO 5.00€].

- PROMOCIONES ELIMINADAS (Desactivadas en TPV Back-office, cartelería de barra y sin rastro en portal):
  * Cócteles Sunset del viernes (ELIMINADA de la oferta).
  * Spritz del domingo (ELIMINADA de los domingos; Spritz es exclusivo de los miércoles).

5. PROCEDIMIENTOS OPERATIVOS DE BAR (Pestaña: 4. PROCEDIMIENTOS)
- BAR-SOP-01 (Apertura de Terraza y Operativa con Viento en Acantilados):
  * Responsable: Barman / Camarero de Turno.
  * Pasos:
    1. Inspección exterior a las 07:30 h (anemómetro o reporte de viento). Si ráfagas superan 35 km/h, no desplegar sombrillas grandes.
    2. Desbloqueo y anclaje de mobiliario de terraza.
    3. Mise en place de estación de cócteles: encender fabricador de hielo, cámaras y cafetera express a 9 bar y 92ºC.
    4. Registro de temperaturas APPCC en panel de barra (Cámaras: +2ºC a +4ºC; Congelador hielo: -18ºC).
  * Puntos críticos: Si el viento supera 45 km/h, replegar toldos de inmediato y reubicar clientes en el interior del Bar Diamond.

- BAR-SOP-02 (Gestión Segura de Alérgenos y APPCC en Estación de Coctelería):
  * Responsable: Todo el personal de barra.
  * Pasos:
    1. Limpieza de cocteleras y jiggers con agua corriente caliente tras cada uso para evitar contaminación cruzada.
    2. Identificación estricta de alérgenos: leche/lácteos (leche condensada, crema de coco), frutos de cáscara (almendra en Orgeat de Mai Tai, Amaretto), sulfitos (vinos, cavas, vermut, Champagne), apio/pescado (Bloody Mary).
    3. Preguntar siempre al cliente si tiene alguna intolerancia antes de servir preparaciones artesanales.
    4. En caso de comanda de alérgeno severo, usar coctelera y dosificador desinfectados exclusivos.

- BAR-SOP-03 (Cierre Nocturno, Limpieza y Cuadre de Barra):
  * Horario: 22:00 h a 23:00 h.
  * Pasos:
    1. Retirada de mesas exteriores y bloqueo de cierres.
    2. Purga y descalcificación de grupos de la cafetera express con filtro ciego.
    3. Desmontaje y lavado de esterillas de barra, jiggers y cocteleras en lavavajillas a 65ºC.
    4. Apagado de luces de terraza y activación de alarma nocturna.

6. INFORMACIÓN PARA EL PUESTO DE TRABAJO (Pestaña: 5. INFORMACIÓN PARA EL PUESTO)
- MANUAL DE CAJA Y TPV:
  * Fondo de cambio inicial: 200,00 € en cambio fraccionado obligatorio en el cajón portamonedas. Verificar conteo al iniciar turno.
  * Medios de Cobro (¡NO se carga a la habitación!): En Bar / Terraza Diamond NO se admiten cargos a cuenta de habitación bajo ninguna circunstancia. Todos los cobros se realizan exclusivamente mediante:
    1. Tarjeta bancaria (Visa, Mastercard, contactless o teléfono móvil mediante datáfono).
    2. Efectivo (contado en euros).
    3. Vouchers de descuento por compensaciones u otros motivos: Vales autorizados emitidos por Recepción o Dirección (por incidencias, atenciones comerciales o cortesías), registrándolos en TPV y archivando el resguardo físico original firmado.
  * Arqueo X y Cierre Z: A las 22:30 h se imprime el Arqueo X preliminar. Se realiza el cuadre de efectivo, datáfono y vouchers de compensación. Una vez cuadrado, se ejecuta el CIERRE Z definitivo.
  * Custodia del dinero: El efectivo de la recaudación (dejando siempre los 200 € de fondo de cambio) se introduce en un sobre de seguridad con la firma del empleado, los resguardos de tarjeta, los vouchers aplicados y el ticket de Cierre Z grapado, y se deposita en el buzón de seguridad de la caja fuerte de Recepción.
  * ¿QUÉ HACER ANTE UNA DIFERENCIA O DESCUADRE DE CAJA?:
    1. No cuadrar la caja artificialmente ni aportar dinero de propinas o bolsillo personal.
    2. Repetir el recuento físico ciego de monedas y billetes.
    3. Cotejar el lote del datáfono con los resguardos de tarjeta bancaria para verificar que no haya cobros duplicados o anulados.
    4. Cotejar los vouchers de descuento y compensaciones aplicados y comprobar que estén registrados en TPV.
    5. Si persiste diferencia (sobrante o faltante), anotar el importe exacto en la hoja de arqueo diario e informar de inmediato al supervisor de turno o a Recepción (Ext. 101).

- TELÉFONOS INTERNOS Y EXTENSIONES DIRECTAS:
  * Recepción 24h: Extensión 101.
  * F&B / Restaurante: Extensión 204.
  * Mantenimiento Urgente: Extensión 301.
  * Emergencias Canarias: 112.

- ALARMAS Y ACCESOS:
  * Alarma acústica: Mantener la calma de los clientes, avisar de inmediato a Recepción (Ext. 101). NO silenciar ni manipular el panel central.
  * Llaves y accesos a bodega/almacén: Custodiadas en el cajetín con clave de Recepción. Cada retiro o entrega debe anotarse con fecha, hora y firma del empleado responsable.
`;

/**
 * Normaliza cadenas para comparación de texto
 */
function normalizeStr(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca si la consulta hace referencia a alguno de los 29 cócteles oficiales
 */
function matchCocktail(query: string) {
  const q = normalizeStr(query);

  // Mapeos específicos de nombres clave o palabras clave
  const specificKeys: { keys: string[]; code: string }[] = [
    { keys: ['sex on the beach', 'beach'], code: 'FT CKT 01' },
    { keys: ['blue diamond', 'diamante azul', 'azul', 'blue'], code: 'FT CKT 02' },
    { keys: ['mojito tradicional', 'mojito clasico', 'mojito'], code: 'FT CKT 03' },
    { keys: ['mojito fresa'], code: 'FT CKT 34' },
    { keys: ['mojito maracuya', 'mojito fruta de la pasion', 'mojito pasion'], code: 'FT CKT 35' },
    { keys: ['mojito sabores', 'mojito mango'], code: 'FT CKT 04' },
    { keys: ['daiquiri', 'daiquiris'], code: 'FT CKT 26' },
    { keys: ['margarita tradicional', 'margarita clasica', 'margarita'], code: 'FT CKT 30' },
    { keys: ['margarita fresa'], code: 'FT CKT 31' },
    { keys: ['margarita mango'], code: 'FT CKT 32' },
    { keys: ['margarita sabores', 'margarita passion fruit'], code: 'FT CKT 33' },
    { keys: ['vodka berry', 'elderflower'], code: 'FT CKT 04' },
    { keys: ['dreamland'], code: 'FT CKT 05' },
    { keys: ['negroni'], code: 'FT CKT 06' },
    { keys: ['fresa colada'], code: 'FT CKT 07' },
    { keys: ['old fashioned'], code: 'FT CKT 08' },
    { keys: ['kir royal'], code: 'FT CKT 09' },
    { keys: ['estrellas', 'cava estrellas'], code: 'FT CKT 10' },
    { keys: ['rossini', 'cava rossini'], code: 'FT CKT 11' },
    { keys: ['long island', 'iced tea', 'long island iced tea'], code: 'FT CKT 12' },
    { keys: ['bloody mary', 'bloody'], code: 'FT CKT 13' },
    { keys: ['pina colada', 'piña colada', 'pina'], code: 'FT CKT 14' },
    { keys: ['lady marmalade'], code: 'FT CKT 15' },
    { keys: ['aperol spritz', 'aperol'], code: 'FT CKT 16' },
    { keys: ['campari spritz', 'campari'], code: 'FT CKT 38' },
    { keys: ['limoncello spritz', 'limoncello'], code: 'FT CKT 39' },
    { keys: ['hugo spritz', 'hugo', 'spritz de sauco'], code: 'FT CKT 45' },
    { keys: ['woo woo'], code: 'FT CKT 17' },
    { keys: ['classic martini', 'martini clasico', 'dry martini'], code: 'FT CKT 18' },
    { keys: ['espresso martini', 'martini espresso'], code: 'FT CKT 19' },
    { keys: ['porn star martini', 'pornstar martini', 'pornstar'], code: 'FT CKT 20' },
    { keys: ['americano'], code: 'FT CKT 21' },
    { keys: ['virgin mojito', 'mojito sin alcohol', 'mojito 0.0'], code: 'FT CKT 22' },
    { keys: ['san francisco', 'sanfrancisco'], code: 'FT CKT 23' },
    { keys: ['virgin colada', 'colada sin alcohol', 'colada 0.0', 'pina colada sin alcohol'], code: 'FT CKT 24' },
    { keys: ['mai tai', 'maitai'], code: 'FT CKT 25' },
  ];

  // 1. Probar concordancias de mayor prioridad (nombres compuestos o específicos)
  for (const item of specificKeys) {
    for (const key of item.keys) {
      if (q.includes(normalizeStr(key))) {
        return COCKTAILS_MASTER_TECHNICAL_SHEETS.find(s => s.code === item.code);
      }
    }
  }

  // 2. Probar por código directo (ej. "FT CKT 01", "CKT 01", "FT-CKT-01")
  for (const sheet of COCKTAILS_MASTER_TECHNICAL_SHEETS) {
    const codeNorm = normalizeStr(sheet.code);
    const codeNum = sheet.code.replace(/[^0-9]/g, '');
    if (q.includes(codeNorm) || (codeNum && q.includes(`ckt ${codeNum}`) || q.includes(`ckt-${codeNum}`))) {
      return sheet;
    }
  }

  // 3. Probar por título de ficha
  for (const sheet of COCKTAILS_MASTER_TECHNICAL_SHEETS) {
    const titleNorm = normalizeStr(sheet.title);
    if (q.includes(titleNorm)) {
      return sheet;
    }
  }

  return null;
}

/**
 * Motor heurístico de fallback: responde con exactitud si no hay conexión o API key.
 */
export function getLocalDeterministicAnswer(query: string): AssistantAnswer {
  const q = normalizeStr(query);

  // 0. Control Operativo, Checklists y Trazabilidad (FASE 11)
  if (
    q.includes('control operativo') || 
    q.includes('checklist') || 
    q.includes('checklists') || 
    (q.includes('apertura') && !q.includes('viento')) || 
    q.includes('appcc') || 
    q.includes('calibracion') || 
    q.includes('calibraciones') || 
    q.includes('trazabilidad')
  ) {
    return {
      answer: `El módulo oficial de **Control Operativo (FASE 11)** permite cumplimentar y registrar con trazabilidad digital interna:\n\n1. **Checklist de Apertura:** Verificación de limpieza, mise en place, hielo, cámaras, TPV, fondo de caja, cristalería, música y terraza.\n2. **Checklist de Cierre:** Limpieza, reposición, cámaras cerradas, caja, Ticket Z, incidencias, terraza recogida y basuras.\n3. **Auditorías APPCC:** Puntos críticos higiénico-sanitarios (< 4ºC frío, -18ºC congelación, rotación FIFO y > 65ºC en lavavasos).\n4. **Revisiones Higiénico-Sanitarias:** Uniformidad, dispensadores bactericidas, cubos con pedal e insectocutores.\n5. **Calibraciones de Frío:** Registro termométrico digital de cámaras, botelleros y fabricador de hielo.\n6. **Revisiones Operativas:** Inspección de sombrillas, cartas QR y mobiliario exterior.\n\n*Al guardar cada registro, se genera automáticamente un número de registro correlativo (ej. \`REG-20261001-001\`) y se ofrecen enlaces directos para enviar el resumen formateado por **WhatsApp** y por **Correo Electrónico** a Dirección.*`,
      location: 'Bar → Control Operativo (FASE 11)',
      category: 'procedimientos',
      suggestedAction: {
        label: 'Abrir Control Operativo',
        actionType: 'open_tab',
        target: 'control_operativo'
      }
    };
  }

  // 0b. Actualización de Recetas Oficiales y Recetario de Promociones
  if (
    q.includes('actualizar recetas') || 
    q.includes('recetas actualizadas') || 
    q.includes('novedades recetas') || 
    q.includes('recetario') ||
    q === 'recetas' ||
    q === 'receta'
  ) {
    return {
      answer: `🍹 **RECETARIO OFICIAL Y FICHAS TÉCNICAS ACTUALIZADAS 2026**\n\nTodas las recetas de barra han sido homologadas y sincronizadas con las promociones vigentes:\n\n1. **HAPPY HOUR DIARIO (15:00 a 16:00 h · 2 Cócteles x 12,00 € | Mismo cóctel obligatorio):**\n   • **Margarita Tradicional (FT CKT 30):** Tequila blanco 5 cl, Licor de naranja 2 cl, Zumo de lima 2 cl. Copa Coupe con medio borde de sal exterior.\n   • **Mojito Tradicional (FT CKT 03):** Ron blanco 4,5 cl, Zumo de lima 2 cl, Hierbabuena 6 ramitas, Azúcar blanco 2 cdta, Soda. Vaso Diamond con hielo pilé.\n   • **Blue Diamond (FT CKT 02):** Ron blanco 4 cl, Blue Curaçao 2 cl, Licor de coco 2 cl, Zumo de piña 5 cl. Copa Hurricane sobre cubitos frescos.\n   • **Piña Colada (FT CKT 14):** Ron blanco 5 cl, Crema de coco 3 cl, Zumo de piña 5 cl. Textura frozen en blender, copa Hurricane.\n   • **Aperol Spritz (FT CKT 16):** Prosecco 9 cl, Aperol 6 cl, Soda 3 cl (Regla 3:2:1). Copa Balón (Spritz) repleta de hielo y rodaja de naranja.\n   • **Sex on the Beach (FT CKT 01):** Vodka 4 cl, Licor de melocotón 2 cl, Zumo de naranja 2 cl, Zumo de arándanos 4 cl. Copa Hurricane con cubitos.\n\n2. **CERVEZA Y SNACK · JARRA DORADA ESPECIAL 50 cl (CERV-01):**\n   • **Servicio:** Tiraje a 45º, crema de 2 dedos a 90º en jarra helada (0ºC) a 3-4ºC. Acompañada obligatoriamente de cuenco de frutos secos tostados canarios.\n   • **Lunes (08:00 - 22:00 h):** 3,00 € con frutos secos.\n   • **Happy Hour Diario (15:00 - 16:00 h):** 2 jarras x 6,00 € (prohibido jarra suelta a 3€ de martes a domingo).\n\n3. **MIÉRCOLES DE SPRITZ (08:00 a 22:30 h · 6,00 € / copa · 4 Variedades en Copa Balón Spritz):**\n   • **Aperol Spritz (FT CKT 16):** 9 cl Prosecco, 6 cl Aperol, 3 cl Soda.\n   • **Campari Spritz (FT CKT 38):** 9 cl Prosecco, 6 cl Bitter Campari, 3 cl Soda.\n   • **Limoncello Spritz (FT CKT 39):** 9 cl Prosecco, 5 cl Limoncello helado de congelador, 3 cl Soda.\n   • **Hugo Spritz (FT CKT 45):** 9 cl Prosecco, 3 cl Licor de flor de saúco, 3 cl Soda, menta palmeada y lima.\n\n4. **DOMINGOS DE MOJITOS (08:00 a 22:30 h · 5,00 € / mojito · 4 Variedades en Vaso Diamond):**\n   • **Tradicional (FT CKT 03):** Ron blanco, lima, hierbabuena, azúcar, soda.\n   • **Fresa (FT CKT 34):** Ron blanco, 3 fresas maceradas, lima, azúcar, hierbabuena y soda.\n   • **Maracuyá (FT CKT 35):** Ron blanco, 5 cl puré de maracuyá, lima, hierbabuena y soda.\n   • **Virgin 0.0% (FT CKT 22):** Hierbabuena, lima, sirope de azúcar, soda (sin alcohol).\n\n5. **ESTANDARIZACIÓN DE CRISTALERÍA:**\n   • **Mojitos:** En **Vaso Diamond** exclusivo.\n   • **Spritz:** En **Copa Balón (Spritz)**.\n   • **Combinados y tragos largos que usaban vaso:** Servidos en **Copa Hurricane** (Long Island, Bloody Mary, Woo Woo, San Francisco, Tequila Sunrise, Tom Collins, Vodka Berry, Dreamland).\n\nPuedes consultar la ficha milimétrica con escandallo y foto pulsando en cualquier cóctel.`,
      location: 'Bar → Pestaña 2: Fichas técnicas',
      category: 'fichas',
      suggestedAction: {
        label: 'Ver Catálogo de Fichas',
        actionType: 'open_tab',
        target: 'fichas'
      }
    };
  }

  // 0b. Consulta específica de Cristalería Oficial (Mojitos en Vaso Diamond, Spritz en Copa Balón, Vaso en Hurricane)
  if (
    q.includes('cristaleria') ||
    q.includes('cristalería') ||
    q.includes('vaso diamond') ||
    q.includes('hurricane') ||
    q.includes('copa balon') ||
    q.includes('copa balón') ||
    q.includes('que copa') ||
    q.includes('que vaso') ||
    q.includes('vajilla') ||
    (q.includes('vaso') && (q.includes('mojito') || q.includes('spritz') || q.includes('usar') || q.includes('servir')))
  ) {
    return {
      answer: `💎 **NORMATIVA OFICIAL DE CRISTALERÍA Y SERVICIO 2026 · KLAYMAN DIAMOND**\n\nRegla de oro de servicio en barra y terraza:\n\n1. **LOS MOJITOS EN VASO DIAMOND:**\n   • **Mojito Tradicional (FT CKT 03)**\n   • **Mojito Fresa (FT CKT 34)**\n   • **Mojito Maracuyá (FT CKT 35)**\n   • **Virgin Mojito 0.0% (FT CKT 22)**\n   *Servicio:* Exclusivamente en el **Vaso Diamond** oficial con abundante hielo pilé y ramillete de hierbabuena palmeada.\n\n2. **LOS SPRITZ EN COPA BALÓN (SPRITZ):**\n   • **Aperol Spritz (FT CKT 16)**\n   • **Campari Spritz (FT CKT 38)**\n   • **Limoncello Spritz (FT CKT 39)**\n   • **Hugo Spritz (FT CKT 45)**\n   *Servicio:* En **Copa Balón (Spritz)** colmada de cubitos de hielo macizo, respetando la efervescencia con un solo giro suave.\n\n3. **LOS QUE USABAN VASO USAREMOS LA COPA HURRICANE:**\n   • **Long Island Iced Tea (FT CKT 12)**\n   • **Bloody Mary (FT CKT 13)**\n   • **Woo Woo (FT CKT 17)**\n   • **San Francisco Mocktail (FT CKT 23)**\n   • **Tequila Sunrise (FT CKT 41)**\n   • **Tom Collins (FT CKT 42)**\n   • **Vodka Berry / Elderflower (FT CKT 04)**\n   • **Dreamland (FT CKT 05)**\n   *(Junto a Sex on the Beach, Blue Diamond, Piña Colada, Fresa Colada, Virgin Colada y Bahama Mama)*.\n\n4. **TRAGOS CORTOS / ON THE ROCKS:**\n   • **Negroni, Old Fashioned, Americano:** Vaso Rocks / Old Fashioned con hielo de bloque.\n\n5. **CAFETERÍA:**\n   • **Barraquito Especial (CAF-01):** Vaso cilíndrico termorresistente de 180 ml (5 capas visibles).`,
      location: 'Bar → Pestaña 5: Información para el puesto → Cristalería Oficial',
      category: 'puesto',
      suggestedAction: {
        label: 'Ver Fichas Técnicas',
        actionType: 'open_tab',
        target: 'fichas'
      }
    };
  }

  // 0c. Consulta específica de las 4 Variedades de Spritz
  if (q.includes('spritz') && !q.includes('aperol') && !q.includes('campari') && !q.includes('limoncello') && !q.includes('hugo')) {
    return {
      answer: `🥂 **LAS 4 RECETAS OFICIALES DE SPRITZ · KLAYMAN DIAMOND**\n\nTodos servidos en **Copa Balón repleta de hielo macizo** (Promoción Miércoles a 6,00 € · Precio habitual 8,50 €):\n\n1. **Aperol Spritz (FT CKT 16):**\n   - 9 cl Prosecco DOC, 6 cl Aperol y 3 cl Soda.\n   - Decoración: Media rodaja de naranja fresca.\n\n2. **Campari Spritz (FT CKT 38):**\n   - 9 cl Prosecco DOC, 6 cl Bitter rojo Campari y 3 cl Soda.\n   - Perfil: Más amargo, estructurado y de tono rojo rubí.\n\n3. **Limoncello Spritz (FT CKT 39):**\n   - 9 cl Prosecco DOC, 5 cl Limoncello muy frío (de congelador) y 3 cl Soda.\n   - Decoración: Rodaja de limón y hojas de menta.\n\n4. **Hugo Spritz Floral (FT CKT 45):**\n   - 9 cl Prosecco DOC, 3 cl Licor de flor de saúco (Elderflower) y 3 cl Soda.\n   - Decoración: Ramillete de menta palmeada y rodaja de lima.\n\n⚠️ **Alérgenos:** Sulfitos en las 4 variedades (por el Prosecco).`,
      location: 'Bar → Pestaña 2: Fichas técnicas → Spritz',
      category: 'fichas',
      suggestedAction: {
        label: 'Ver Fichas Técnicas',
        actionType: 'open_tab',
        target: 'fichas'
      }
    };
  }

  // 0d. Consulta específica de Jarra Dorada Especial 50 cl con frutos secos
  if (q.includes('jarra') || q.includes('dorada especial') || q.includes('cerveza barril') || q.includes('cerv-01')) {
    return {
      answer: `🍺 **FICHA TÉCNICA Y PROTOCOLO: JARRA DORADA ESPECIAL 50 cl (CERV-01)**\n\n• **Producto:** Cerveza Dorada Especial de Barril (Compañía Cervecera de Canarias).\n• **Dosificación y volumen:** Jarra de cristal pesada de 50 cl.\n• **Cristalería:** Jarra refrigerada previamente en cámara/congelador a 0ºC.\n• **Temperatura de servicio:** 3ºC a 4ºC.\n• **Técnica de tiraje:**\n  1. Purgar grifo 1 segundo.\n  2. Inclinar la jarra a 45º sin tocar el grifo.\n  3. Llenar suavemente 3/4 partes por la pared.\n  4. Enderezar a 90º y accionar hacia atrás para coronar con **crema densa y compacta de 2 dedos**.\n• **Acompañamiento obligatorio:** Cuenco cerámico con **frutos secos tostados canarios de cortesía** sobre posavasos oficial.\n• **Promociones:**\n  - **Lunes (08:00 - 22:00 h):** 3,00 € la jarra individual con frutos secos.\n  - **Happy Hour Diario (15:00 - 16:00 h):** 2 jarras x 6,00 € (prohibido jarra suelta a 3€).\n• **Alérgenos:** Gluten (Cebada) y Frutos de Cáscara (snack de cortesía).`,
      location: 'Bar → Pestaña 2: Fichas técnicas → CERV-01',
      category: 'fichas'
    };
  }

  // 1. Total de cócteles / Carta de cócteles (45 cócteles en total)
  if (
    q.includes('cuantos cocteles') || 
    q.includes('cuantos hay') || 
    q.includes('cuantos son') || 
    q.includes('lista de cocteles') ||
    q.includes('carta de cocteles') ||
    q.includes('no estan todos') ||
    q.includes('todos los cocteles')
  ) {
    return {
      answer: `La **Carta de Cócteles Oficial de Terraza Diamond (Edición 2026)** cuenta con **32 cócteles estandarizados en total** con precios actualizados según la carta oficial:\n\n• **Cócteles a 8,50 € (24 con alcohol):**\n  1. Sex on the Beach (FT CKT 01)\n  2. Blue Diamond (FT CKT 02)\n  3. Mojito Tradicional (FT CKT 03)\n  4. Mojito Sabores (FT CKT 04)\n  5. Daiquiris de Sabores (FT CKT 05)\n  6. Margarita Tradicional (FT CKT 06)\n  7. Margarita Sabores (FT CKT 07)\n  8. Vodka Berry (FT CKT 08)\n  9. Dreamland (FT CKT 09)\n  10. Negroni (FT CKT 10)\n  11. Fresa Colada (FT CKT 11)\n  12. Old Fashioned (FT CKT 12)\n  13. Bahama Mama (FT CKT 30)\n  14. Blood and Sand (FT CKT 31)\n  15. Kir Royal (FT CKT 13)\n  16. Estrellas (FT CKT 14)\n  17. Rossini (FT CKT 15)\n  18. Piña Colada (FT CKT 18)\n  19. Aperol Spritz (FT CKT 20)\n  20. Woo Woo (FT CKT 21)\n  21. Classic Martini (FT CKT 22)\n  22. Espresso Martini (FT CKT 23)\n  23. Passion Fruit Martini (FT CKT 24)\n  24. Americano (FT CKT 25)\n\n• **Cócteles Especiales a 9,00 € (5 cócteles):**\n  25. Long Island Ice Tea (FT CKT 16)\n  26. Bloody Mary (FT CKT 17)\n  27. Lady Marmalade (FT CKT 19)\n  28. Perfect Continuous (FT CKT 32)\n  29. Mai Thai (FT CKT 29)\n\n• **3 Cócteles Sin Alcohol (Mocktails 0.0% · 6,50 €):**\n  30. Virgin Mojito (FT CKT 26)\n  31. San Francisco (FT CKT 27)\n  32. Virgin Colada (FT CKT 28)\n\nPuedes consultar los ingredientes, alérgenos y PVP en la Carta, o las recetas milimetradas en las Fichas Técnicas.`,
      location: 'Bar → Pestaña 1: Cartas y Pestaña 2: Fichas técnicas',
      category: 'cartas',
      suggestedAction: {
        label: 'Ver Fichas Técnicas',
        actionType: 'open_tab',
        target: 'fichas'
      }
    };
  }

  // 2. Consulta específica de Mocktails / Sin alcohol
  if (q.includes('sin alcohol') || q.includes('mocktail') || q.includes('mocktails') || q.includes('0.0')) {
    return {
      answer: `En Klayman Diamond disponemos de **3 cócteles oficiales sin alcohol (Mocktails 0.0%)**:\n\n1. **Virgin Mojito (FT CKT 26 / FT CKT 22)** (6,50 €):\n   - Ingredientes: Soda (12 cl), Hierbabuena (6 ramitas), Azúcar blanco (10 g) y 1/2 lima troceada.\n   - Vaso: Vaso Diamond de policarbonato con abundante hielo pilé.\n   - Punto crítico: Majado suave sin romper las hojas de hierbabuena.\n\n2. **San Francisco (FT CKT 27 / FT CKT 23)** (6,50 €):\n   - Ingredientes: Zumo de naranja (7 cl), zumo de piña (7 cl), zumo de limón (2 cl) y granadina (2 cl).\n   - Vaso: Copa Hurricane de policarbonato con cubitos.\n   - Punto crítico: Mantener efecto bifásico nítido (verter la granadina al final por la pared).\n\n3. **Virgin Colada (FT CKT 28 / FT CKT 24)** (6,50 €):\n   - Ingredientes: Crema de coco (4 cl) y zumo de piña (12 cl).\n   - Vaso: Copa Hurricane de policarbonato batido en blender (textura frozen).\n   - Punto crítico: Sin separación de fases entre líquido y hielo.`,
      location: 'Bar → Pestaña 2: Fichas técnicas → FT CKT 26, 27 y 28',
      category: 'fichas',
      suggestedAction: {
        label: 'Ver Fichas Técnicas',
        actionType: 'open_tab',
        target: 'fichas'
      }
    };
  }

  // 3. Ficha Técnica de Coctelería coincidente con la Tabla Maestra
  const matchedSheet = matchCocktail(q);
  if (matchedSheet) {
    const ingredientsList = matchedSheet.ingredients
      .map(i => `  • ${i.name}: **${i.quantity}**`)
      .join('\n');

    const allergensStr = matchedSheet.allergens.length > 0 
      ? matchedSheet.allergens.join(', ') 
      : 'Sin alérgenos de declaración obligatoria (verificar etiquetas)';

    return {
      answer: `Ficha Técnica Oficial de **${matchedSheet.title}** (**${matchedSheet.code}**):\n\n• **Ingredientes y dosificación oficial:**\n${ingredientsList}\n\n• **Cristalería:** ${matchedSheet.glassware}\n• **Hielo:** ${matchedSheet.ice}\n• **Garnish / Decoración:** ${matchedSheet.garnish}\n• **Elaboración resumida:** ${matchedSheet.technique}\n• **Punto crítico:** ${matchedSheet.criticalPoint || 'No sobrediluir y respetar dosificación con jigger.'}\n• **Decisión de normalización:** ${matchedSheet.normalizationDecision || 'Receta oficial estandarizada 2026'}\n• **Alérgenos:** ${allergensStr}\n• **PVP Carta:** ${matchedSheet.escandallo?.sellingPrice.toFixed(2)} € (Coste aprox: ${matchedSheet.escandallo?.rawCost.toFixed(2)} €)`,
      location: `Bar → Pestaña 2: Fichas técnicas → ${matchedSheet.code}: ${matchedSheet.name}`,
      category: 'fichas',
      suggestedAction: {
        label: `Ver Ficha de ${matchedSheet.name}`,
        actionType: 'open_item',
        target: matchedSheet.id
      }
    };
  }

  // 4. Barraquito Especial Diamond (Cafetería)
  if (q.includes('barraquito')) {
    return {
      answer: `Preparación oficial del **Barraquito Especial Diamond (CAF-01)**:\n\n• **Ingredientes y proporciones:**\n  1. 25 ml Leche condensada La Lechera (base inferior)\n  2. 20 ml Licor 43\n  3. 25 ml Espresso caliente 100% arábica recién tirado\n  4. 50 ml Leche entera emulsionada en microespuma sedosa\n  5. Canela molida de Ceilán y corteza fina de limón fresco\n• **Cristalería:** Vaso cilíndrico de cristal termorresistente de 180 ml.\n• **Técnica:** Vertido lento sobre reverso de cuchara de bar apoyada en la pared interior para mantener **5 capas nítidas visibles**.\n• **PVP Carta:** 3,80 € (Coste escandallo: 0,73 €).`,
      location: 'Bar → Pestaña 2: Fichas técnicas → CAF-01 Barraquito',
      category: 'fichas'
    };
  }

  // 5. Cierre de caja / arqueo / TPV
  if (q.includes('cierre') || q.includes('caja') || q.includes('arqueo') || q.includes('cierre z') || q.includes('cuadre')) {
    return {
      answer: `Para realizar y registrar el **Cierre de caja** de forma ágil:\n\n1. Entra en el módulo **Cierre de caja** en F&B.\n2. **Introduce los datos:**\n   • **Visa (€)**\n   • **Contado (€)**\n   • **Ventas totales (€)**\n3. Pulsa **«Subir foto del ticket»** para adjuntar la foto del ticket de caja (se mostrará grande y ampliable).\n4. Pulsa **«Guardar cierre»**.\n5. El sistema genera el **Resumen del cierre** y comprueba automáticamente que Visa + Contado coincide con las ventas.`,
      location: 'F&B → Cierre de caja',
      category: 'puesto',
      suggestedAction: {
        label: 'Ir a Cierre de caja',
        actionType: 'open_tab',
        target: 'cierres_caja'
      }
    };
  }

  // 6. Diferencia de caja / descuadre
  if (q.includes('diferencia') || q.includes('descuadre') || q.includes('sobra') || q.includes('falta dinero') || q.includes('dinero')) {
    return {
      answer: `Si detectas una diferencia o descuadre de caja (sobrante o faltante):\n\n1. **Nunca compenses la diferencia** con propinas ni con dinero propio.\n2. Vuelve a realizar el recuento físico ciego de billetes y monedas por duplicado.\n3. Coteja los resguardos del datáfono con el informe de tarjetas para descartar transacciones duplicadas o anuladas.\n4. Revisa los vouchers de descuento y compensaciones aplicados comprobando que estén registrados en TPV con su correspondiente justificante.\n5. Si el descuadre persiste, anota la diferencia exacta (positiva o negativa) en la hoja de arqueo diario e infórmalo de inmediato al supervisor de turno o a Recepción (Ext. 101).`,
      location: 'Bar → Pestaña 5: Información para el puesto → Manual de Caja',
      category: 'puesto'
    };
  }

  // 6b. Protocolo Back-Office TPV: Limpieza de reglas de precio y teclas de descuento
  if (q.includes('limpieza') || q.includes('regla de precio') || q.includes('reglas de precio') || q.includes('tecla de descuento') || q.includes('teclas de descuento') || q.includes('promociones antiguas') || q.includes('back-office') || q.includes('descuento obsoleto')) {
    return {
      answer: `🛠️ **PROTOCOLO BACK-OFFICE TPV: LIMPIEZA DE REGLAS Y TECLAS DE DESCUENTO**\n\nPara garantizar que el equipo de barra no encuentre registros de promociones antiguas ni aplique cobros erróneos:\n\n1. **Desactivar Reglas de Precio Automáticas:**\n   - En Ágora Back-Office: *Tarifas y Precios → Reglas de Precio Automáticas / Franjas Horarias*.\n   - Marcar como "Desactivada y Bloqueada" la regla \`[PR-RULE-SUNSET-FRI]\` (Sunset viernes 6,50€) y \`[PR-RULE-SPRITZ-SUN]\` (Spritz domingo 6,00€).\n\n2. **Modificar Teclados Táctiles:**\n   - En *Diseño de Teclados → Teclado Terraza → Promociones*:\n   - Retirar la asignación física de las teclas \`[SUNSET COCKTAIL 6.50€]\` y \`[SPRITZ DOMINGO 6.00€]\`.\n   - Mantener únicamente las teclas oficiales: \`[HH 2 CÓCTELES 12€]\`, \`[HH 2 JARRAS 6€]\`, \`[PROMO LUNES JARRAS 3€]\`, \`[PROMO SPRITZ 6€]\`, \`[PROMO VIERNES 2X1 CÓCTELES]\` y \`[PROMO DOMINGO MOJITO 5€]\`.\n\n3. **Limpiar Modificadores y Suplementos:**\n   - Eliminar modificadores residuales de descuento de cócteles.\n\n4. **Sincronización Forzada a Terminales de Barra:**\n   - Enviar "Push de Maestros" desde el servidor y en el terminal físico de barra pulsar *Recargar Maestros y Teclados*.\n\n5. **Test de Comanda Ciega:**\n   - Marcar Blue Diamond o Spritz fuera de su horario promocional para constatar que liquide tarifa completa de carta (8,50 €).`,
      location: 'Bar → Pestaña 5: Información para el puesto → Protocolo Back-Office TPV',
      category: 'puesto',
      suggestedAction: {
        label: 'Ver Guía de Limpieza TPV',
        actionType: 'open_tab',
        target: 'puesto'
      }
    };
  }

  // 7. Cobros / cargo a habitación / medios de pago / vouchers / tickets
  if (q.includes('ticket') || q.includes('justificante') || q.includes('cargo') || q.includes('habitacion') || q.includes('habitaci') || q.includes('cobro') || q.includes('pago') || q.includes('voucher') || q.includes('compensacion') || q.includes('descuento')) {
    return {
      answer: `**Norma oficial de cobros en Bar / Terraza Diamond:**\n\n🚫 **AQUÍ NO SE CARGAN CONSUMICIONES A LA HABITACIÓN.** Bajo ninguna circunstancia se traspasan cargos a cuenta de la habitación del huésped.\n\n**Todos los cobros son exclusivamente:**\n1. **Tarjeta bancaria (Datáfono):** Visa, Mastercard, contactless o teléfono móvil.\n2. **Efectivo (Contado):** Pago directo en metálico en euros en el TPV.\n3. **Vouchers de descuento por compensaciones u otros motivos:** Vales emitidos y autorizados por Recepción o Dirección (por compensación de incidencias, bonos o atenciones comerciales). Se registra el código en TPV y se adjunta el voucher físico original firmado al cierre Z.\n\n*Nota para el cliente:* Si un huésped solicita cargar a la habitación, indicarle con amabilidad que en la terraza los pagos se realizan directamente en tarjeta, efectivo o mediante bono/voucher autorizado.`,
      location: 'Bar → Pestaña 5: Información para el puesto → Manual TPV y Cobros (Punto 2)',
      category: 'puesto'
    };
  }

  // 8. Promociones / Happy Hour / Eventos eliminados
  if (q.includes('cena maridaje') || q.includes('maridaje')) {
    return {
      answer: `La **Cena Maridaje Atlántica Los Gigantes** ha sido **eliminada** de la programación oficial del hotel y ya no está vigente. La promoción activa en F&B es el **Happy Hour Diario** (15:00 a 16:00 h, 2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €, bebidas idénticas obligatorias todos los días).`,
      location: 'Bar → Pestaña 3: Promociones y ofertas',
      category: 'promociones',
      suggestedAction: {
        label: 'Ver Promociones y Ofertas',
        actionType: 'open_tab',
        target: 'promociones'
      }
    };
  }

  if (q.includes('musica') || q.includes('musical') || q.includes('concierto') || q.includes('en vivo')) {
    return {
      answer: `Las **Noches Musicales en Terraza Diamond** han sido **eliminadas** de la operativa regular del complejo. La terraza cuenta con hilo musical ambiental suave (máx. 65-70 dB). La promoción activa diaria es el **Happy Hour Diario** de 15:00 h a 16:00 h (2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €, bebidas idénticas obligatorias todos los días).`,
      location: 'Bar → Pestaña 3: Promociones y ofertas',
      category: 'promociones',
      suggestedAction: {
        label: 'Ver Promociones y Ofertas',
        actionType: 'open_tab',
        target: 'promociones'
      }
    };
  }

  if (q.includes('invierno') || q.includes('temporada sunset')) {
    return {
      answer: `La **Temporada Sunset de Invierno** ha sido **eliminada** de la oferta promocional. La promoción oficial y vigente en terraza es el **Happy Hour Diario** de 15:00 h a 16:00 h todos los días (2 Cócteles x 12,00 € | 2 Jarras Dorada x 6,00 €, bebidas idénticas obligatorias).`,
      location: 'Bar → Pestaña 3: Promociones y ofertas',
      category: 'promociones',
      suggestedAction: {
        label: 'Ver Promociones y Ofertas',
        actionType: 'open_tab',
        target: 'promociones'
      }
    };
  }

  if (q.includes('promocion') || q.includes('oferta') || q.includes('happy hour') || q.includes('sunset') || q.includes('mojito') || q.includes('spritz') || q.includes('cerveza') || q.includes('jarra') || q.includes('lunes') || q.includes('miercoles') || q.includes('domingo') || q.includes('viernes') || q.includes('productos incluidos') || q.includes('cheat sheet') || q.includes('tpv')) {
    return {
      answer: `📋 **REGLAS INNEGOCIABLES Y CALENDARIO SEMANAL · BAR / TERRAZA DIAMOND**\n\n**1. REGLAS INNEGOCIABLES: HAPPY HOUR DIARIO**\n• **Horario:** 15:00 a 16:00 h (Todos los días).\n• **Oferta:** **2 Cócteles x 12,00 €** | **2 Jarras Dorada x 6,00 €**.\n• **Política de servicio:**\n  - Bebidas idénticas (mismo cóctel o dos jarras).\n  - Prohibido vender 1 jarra suelta a 3 €.\n  - Cero excepciones: ni combinaciones mixtas ni mitad de precio.\n• **Cócteles incluidos (6 oficiales):** Margarita, Mojito, Blue Diamond Sunset, Piña Colada, Aperol Spritz, Sex on the Beach.\n• **TPV:** Teclas directas [HH 2 CÓCTELES 12.00€] y [HH 2 JARRAS 6.00€].\n\n**2. CALENDARIO SEMANAL DE PROMOCIONES**\n• **LUNES (08:00 - 22:00 h):** Jarra Dorada Especial (50 cl) = **3,00 €** *(Incluye frutos secos tostados canarios de cortesía)*.\n• **MIÉRCOLES (08:00 - 22:30 h):** Spritz (Aperol, Campari, Limoncello, Hugo) = **6,00 €** *(Las 4 variedades oficiales)*.\n• **VIERNES (10:00 - 22:00 h):** 2x1 en cócteles seleccionados.\n• **DOMINGO (08:00 - 22:30 h):** Mojitos (Tradicional, Fresa, Maracuyá, Virgin) = **5,00 €** *(Exclusivo domingos)*.\n\n⚠️ **AUDITORÍA DE SEGURIDAD TPV & CARTELERÍA:**\nSe han **eliminado de la cartelería física** y **desactivado en el back-office del TPV** las teclas y modificadores de:\n- ❌ **Cócteles Sunset del viernes** (desactivada en TPV).\n- ❌ **Spritz del domingo** (desactivada en TPV; Spritz es exclusivo de miércoles).\n*Esto elimina cualquier riesgo de aplicación manual de un descuento obsoleto.*`,
      location: 'Bar → Pestaña 3: Promociones y ofertas → Cheat Sheet Plastificada',
      category: 'promociones',
      suggestedAction: {
        label: 'Ver Promociones y Ofertas',
        actionType: 'open_tab',
        target: 'promociones'
      }
    };
  }

  // Notificaciones y alertas en el móvil
  if (q.includes('notific') || q.includes('alerta') || q.includes('aviso') || q.includes('tres menos cinco') || q.includes('14:55') || q.includes('10 de la mañana') || q.includes('movil')) {
    return {
      answer: `Sistema de **Notificaciones y Alertas en el Móvil para Promociones**:\n\n• **⏰ 14:55 h (Tres menos cinco):** Alerta automática 5 minutos antes del **Happy Hour Diario (15:00 a 16:00 h)**. Recordatorio: 2 Cócteles por 12 € o 2 Jarras por 6 € (bebidas idénticas en pareja, no 1 jarra suelta, sin mezclar bebidas ni mitades).\n• **⏰ 10:00 h de la Mañana:** Notificación con la **oferta temática activa hoy**:\n  - **Lunes (08:00 - 22:00 h):** Jarras de Cerveza a 3,00 € (Pint 50 cl con frutos secos)\n  - **Miércoles (08:00 - 22:30 h):** Las 4 variedades de Spritz a 6,00 € (Aperol, Campari, Limoncello, Hugo Spritz)\n  - **Viernes (10:00 - 22:00 h):** 2x1 en Cócteles Seleccionados\n  - **Domingos (08:00 - 22:30 h):** Mojitos a 5,00 € (¡solo los domingos!)\n\n*Nota:* Desactivadas en TPV las alertas de Cócteles Sunset y Spritz en domingo.`,
      location: 'Bar → Pestaña 3: Promociones → Panel de Notificaciones en Móvil',
      category: 'promociones',
      suggestedAction: {
        label: 'Activar / Probar Notificaciones',
        actionType: 'open_tab',
        target: 'promociones'
      }
    };
  }

  // 9. Procedimientos SOP (Viento, Alérgenos, Limpieza)
  if (q.includes('viento') || q.includes('sombrilla') || q.includes('terraza') || q.includes('apertura')) {
    return {
      answer: `Procedimiento **BAR-SOP-01 (Apertura de Terraza y Operativa con Viento)**:\n\n1. **Inspección exterior (07:30 h):** Consultar el viento. Si las ráfagas superan los 35 km/h, no abrir sombrillas de gran formato.\n2. **Alarma por viento:** Si el viento supera ráfagas de 45 km/h, recoger inmediatamente toldos y sombrillas y reubicar el servicio en el interior del Bar Diamond.\n3. **Mise en place:** Encender fabricador de hielo, cámaras y cafetera express (presión 9 bar, 92ºC).\n4. **Registro APPCC:** Comprobar temperaturas (+2ºC a +4ºC en cámaras de frío; -18ºC en congeladores).`,
      location: 'Bar → Pestaña 4: Procedimientos → BAR-SOP-01 Apertura de Terraza',
      category: 'procedimientos'
    };
  }

  if (q.includes('alergeno') || q.includes('alergia') || q.includes('celiaco') || q.includes('gluten') || q.includes('lactosa') || q.includes('appcc') || q.includes('almendra')) {
    return {
      answer: `Procedimiento **BAR-SOP-02 (Gestión Segura de Alérgenos y APPCC en Barra)**:\n\n1. Lavar cocteleras, cucharas y jiggers con agua caliente tras cada preparación para erradicar trazas cruzadas.\n2. Identificar productos sensibles: lácteos (leche condensada, crema de coco), frutos de cáscara (almendra en Orgeat del cóctel Mai Tai FT CKT 29, Amaretto en FT CKT 09 y 14), sulfitos (vinos, cavas, vermuts), gluten (cervezas ordinarias), apio/pescado (Bloody Mary FT CKT 17).\n3. Consultar activamente al comensal si padece alguna alergia antes de servir preparaciones artesanales.\n4. Si el cliente declara alergia severa, utilizar útiles exclusivos esterilizados.`,
      location: 'Bar → Pestaña 4: Procedimientos → BAR-SOP-02 Control de Alérgenos',
      category: 'procedimientos'
    };
  }

  // 10. Teléfonos y extensiones
  if (q.includes('telefono') || q.includes('extension') || q.includes('contacto') || q.includes('llamar')) {
    return {
      answer: `Directorio oficial de **Extensiones Telefónicas Corporativas Klayman**:\n\n**Klayman Diamond:**\n• **Recepción 24 horas:** Extensión **9000**\n• **Bar / Terraza:** Extensión **9002**\n• **Cocina Diamond:** Extensión **9003**\n• **Administración (Dirección / RRHH / Compras):** Extensión **9001**\n• **Gobernanta / Pisos:** Extensión **9004** (ant. 3325)\n• **Habitaciones Huéspedes:** Marcar **5 + Nº habitación**\n• **Emergencias Sanitarias / Policía / Bomberos:** **112**\n\n**Klayman Olivina:**\n• **Recepción:** Ext. **8000** | **Sol Bar:** Ext. **8002** | **F&B (Eugenia):** Ext. **8011** | **Apartamentos:** Marcar **4 + Nº apto.**`,
      location: 'Bar → Pestaña 5: Información para el puesto → Teléfonos Internos',
      category: 'puesto'
    };
  }

  // 11. Llaves o alarmas
  if (q.includes('llave') || q.includes('alarma') || q.includes('emergencia') || q.includes('bodega')) {
    return {
      answer: `Normativa oficial de **Alarmas y Llaves en Klayman Diamond**:\n\n• **Llaves de bar y almacén:** Solicitud obligatoria en Recepción con registro de firma, fecha y hora.\n• **Alarma acústica:** Mantener la serenidad en la sala, avisar de inmediato a Recepción (Ext. **9000**). No manipular ni silenciar el cuadro central sin autorización directa.`,
      location: 'Bar → Pestaña 5: Información para el puesto → Alarmas y Llaves',
      category: 'puesto'
    };
  }

  // 12. REGLA ESTRICTA DE FIDELIDAD DOCUMENTAL:
  // Si la consulta no está en los datos oficiales, responder con honestidad y no inventar.
  return {
    answer: `No dispongo de información suficiente en la documentación oficial cargada en el portal para responder a esta consulta con la debida precisión operativa.\n\nPor favor, consulta directamente con tu supervisor de turno o comunícate con Recepción (Ext. 9000 en Diamond / Ext. 8000 en Olivina) para recibir la instrucción oficial adecuada.`,
    location: 'Consulte a Jefatura de Sala o Recepción (Ext. 9000)'
  };
}
