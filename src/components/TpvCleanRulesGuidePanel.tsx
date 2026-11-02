import React, { useState } from 'react';
import {
  Monitor,
  Settings,
  Trash2,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sliders,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Clock,
  Wine,
  Beer,
  FileText
} from 'lucide-react';

interface TpvKeyRecord {
  id: string;
  label: string;
  category: string;
  status: 'ELIMINADA_BLOQUEADA' | 'ACTIVA_OFICIAL';
  path: string;
  reason: string;
  actionRequired: string;
}

const TPV_AUDIT_KEYS: TpvKeyRecord[] = [
  {
    id: 'tpv-del-01',
    label: '[SUNSET COCKTAIL 6.50€]',
    category: 'Promociones Viernes',
    status: 'ELIMINADA_BLOQUEADA',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Oferta extinguida. Sustituida por Viernes 2x1 en cócteles seleccionados (10:00 a 22:00 h).',
    actionRequired: 'Eliminar tecla del layout táctil y revocar la regla de precio PR-RULE-SUNSET-FRI en Back-Office.'
  },
  {
    id: 'tpv-del-02',
    label: '[SPRITZ DOMINGO 6.00€]',
    category: 'Promociones Domingo',
    status: 'ELIMINADA_BLOQUEADA',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Oferta extinguida. La promoción de Spritz a 6,00€ rige exclusivamente los miércoles (08:00 - 22:30 h).',
    actionRequired: 'Eliminar asignación de botón y anular regla horaria dominical PR-RULE-SPRITZ-SUN.'
  },
  {
    id: 'tpv-act-01',
    label: '[HH 2 CÓCTELES 12.00€]',
    category: 'Happy Hour Diario',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Happy Hour',
    reason: 'Regla innegociable diaria (15:00 a 16:00 h). 2 cócteles idénticos entre los 6 autorizados.',
    actionRequired: 'Verificar que sólo permita registrar el par idéntico de la lista oficial.'
  },
  {
    id: 'tpv-act-02',
    label: '[HH 2 JARRAS 6.00€]',
    category: 'Happy Hour Diario',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Happy Hour',
    reason: 'Regla innegociable diaria (15:00 a 16:00 h). Obligatorio par de jarras Dorada Especial. Prohibido jarra suelta a 3€.',
    actionRequired: 'Comprobar bloqueo de venta individual fraccionada a 3€ en franja de 15:00 a 16:00 h.'
  },
  {
    id: 'tpv-act-03',
    label: '[PROMO LUNES JARRAS 3.00€]',
    category: 'Promociones Semanales',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Lunes completo (08:00 a 22:00 h). Jarra Dorada 50cl a 3,00 € con frutos secos tostados canarios.',
    actionRequired: 'Activa únicamente los lunes con acompañamiento de platillo de frutos secos.'
  },
  {
    id: 'tpv-act-04',
    label: '[PROMO SPRITZ 6.00€]',
    category: 'Promociones Semanales',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Miércoles (08:00 a 22:30 h). Aplica a las 4 variedades oficiales de Spritz (Aperol, Campari, Limoncello, Hugo).',
    actionRequired: 'Verificar que despliegue el selector de las 4 variedades homologadas.'
  },
  {
    id: 'tpv-act-05',
    label: '[PROMO VIERNES 2X1 CÓCTELES]',
    category: 'Promociones Semanales',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Viernes (10:00 a 22:00 h). Tarifa 2x1 ininterrumpida en cócteles seleccionados.',
    actionRequired: 'Comprobar que aplique tarifa 2x1 al seleccionar 2 copas de cóctel.'
  },
  {
    id: 'tpv-act-06',
    label: '[PROMO DOMINGO MOJITO 5.00€]',
    category: 'Promociones Semanales',
    status: 'ACTIVA_OFICIAL',
    path: 'Diseño Teclados → Teclado Terraza → Promociones',
    reason: 'Domingos (08:00 a 22:30 h). Mojitos clásicos, sabores y virgin a 5,00 €.',
    actionRequired: 'Verificar activación exclusiva los domingos.'
  }
];

interface MaintenanceStep {
  number: string;
  title: string;
  shortDesc: string;
  systemPath: string;
  dangerAlert?: string;
  instructions: string[];
  verificationCriteria: string;
}

const MAINTENANCE_STEPS: MaintenanceStep[] = [
  {
    number: '01',
    title: 'Depuración de Reglas Automáticas de Precio y Franjas Horarias',
    shortDesc: 'Desactivar disparadores automáticos que podrían aplicar descuentos por horario sin intervención manual.',
    systemPath: 'Ágora ERP Back-Office → Tarifas y Precios → Reglas de Precio Automáticas / Franjas Horarias',
    dangerAlert: 'Si no se desactiva la regla horaria, el TPV seguirá descontando el importe al marcar las bebidas en viernes o domingo aunque se haya quitado el botón.',
    instructions: [
      'Iniciar sesión con credenciales de Administrador / Jefatura de F&B en el servidor Ágora.',
      'Ir a "Tarifas y Precios" > "Reglas de Precio y Promociones Automáticas".',
      'Localizar la regla PR-RULE-SUNSET-FRI ("Cócteles Sunset 6,50€ Viernes"). Abrir la ficha, desmarcar la casilla "Regla Activa" y pulsar "Guardar y Bloquear".',
      'Localizar la regla PR-RULE-SPRITZ-SUN ("Spritz 6,00€ Domingos"). Desmarcar la casilla "Regla Activa" y guardar cambios.',
      'Comprobar que la regla PR-RULE-SPRITZ-WED ("Miércoles Spritz 6,00€") mantenga vigencia exclusiva los miércoles (08:00 - 22:30 h).'
    ],
    verificationCriteria: 'La columna "Estado" de las reglas de Sunset viernes y Spritz domingo debe mostrar "INACTIVA / DESHABILITADA".'
  },
  {
    number: '02',
    title: 'Modificación de Teclados Táctiles y Retirada de Botoneras Obsoletas',
    shortDesc: 'Eliminar físicamente de la pantalla táctil cualquier tecla de descuento rápido antigua para que no exista rastro visual.',
    systemPath: 'Ágora Back-Office → Terminales y Venta → Diseño de Teclados → Bar / Terraza Diamond → Subteclado [Promociones]',
    dangerAlert: 'Evitar dejar teclas invisibles o botones "sin texto" con atajos activos. Debe eliminarse la asignación de la celda.',
    instructions: [
      'Acceder a "Diseño de Teclados" y abrir la plantilla de venta activa "Teclado Táctil Terraza Diamond".',
      'Navegar a la pestaña o subteclado "Promociones / Happy Hour".',
      'Hacer clic derecho sobre la tecla [SUNSET COCKTAIL 6.50€] y pulsar "Eliminar asignación de botón".',
      'Hacer clic derecho sobre la tecla [SPRITZ DOMINGO 6.00€] y pulsar "Eliminar asignación de botón".',
      'Reordenar las teclas oficiales vigentes para que el personal visualice solo las opciones autorizadas: [HH 2 CÓCTELES 12€], [HH 2 JARRAS 6€], [PROMO LUNES JARRAS 3€], [PROMO SPRITZ 6€ (Mié)], [PROMO VIERNES 2X1 CÓCTELES] y [PROMO DOMINGO MOJITO 5€].',
      'Pulsar "Guardar Plantilla de Teclado".'
    ],
    verificationCriteria: 'La cuadrícula táctil debe quedar limpia, sin teclas antiguas ni celdas fantasma.'
  },
  {
    number: '03',
    title: 'Limpieza de Modificadores Rápidos y Tarifas Secundarias Huérfanas',
    shortDesc: 'Revisar modificadores de suplemento/descuento asociados a cócteles para evitar descuentos manuales.',
    systemPath: 'Ágora Back-Office → Artículos y Familias → Modificadores Rápidos & Suplementos',
    instructions: [
      'Acceder al catálogo de "Modificadores Rápidos" y filtrar por la familia "Coctelería & Terraza".',
      'Revisar si existe el modificador "-2.00€ Descuento Sunset" o "Modificador Spritz Domingo". En caso afirmativo, pulsar "Eliminar / Inhabilitar para TPV".',
      'Comprobar en "Tarifas por Turno" que ningún terminal de barra tenga configurada una tarifa de turno especial no autorizada que altere los precios fuera de la Tarifa 1 (Carta Oficial).'
    ],
    verificationCriteria: 'No debe existir ningún modificador manual con descuentos para cócteles sunset ni spritz en domingo.'
  },
  {
    number: '04',
    title: 'Sincronización Forzada a Terminales de Barra (Push de Maestros)',
    shortDesc: 'Enviar la nueva configuración a las pantallas de barra y vaciar la memoria caché de los terminales físicos.',
    systemPath: 'Ágora Back-Office → Sistema → Enviar Cambios a Terminales TPV (Sync Masivo)',
    dangerAlert: 'Si el terminal de barra tiene una comanda abierta, no cargará los cambios. Asegurarse de cerrar mesas antes de sincronizar.',
    instructions: [
      'En el Back-Office central, pulsar el botón "Enviar cambios a todos los terminales (Push Inmediato)".',
      'Dirigirse físicamente al TPV de la Terraza Diamond.',
      'Cerrar la sesión del camarero en curso.',
      'En la pantalla de login del TPV, pulsar el icono de engranaje superior o combinación de servicio y seleccionar "Recargar Maestros y Teclados desde Servidor".',
      'Esperar a que el visor muestre: "Base de datos sincronizada: 100% OK".'
    ],
    verificationCriteria: 'El terminal se reinicia con la última versión de bases de datos y fecha/hora sincronizada.'
  },
  {
    number: '05',
    title: 'Auditoría en Vivo: Test de Comanda Ciega de Integridad',
    shortDesc: 'Realizar una prueba práctica en el terminal de barra para certificar que el personal no puede aplicar precios obsoletos.',
    systemPath: 'Terminal Físico Terraza Diamond → Modo Comanda de Prueba (Ticket Formación / Demo)',
    instructions: [
      'Test 1 (Viernes): Marcar 1 "Blue Diamond Sunset" sin promoción → Debe cobrar exactamente 8,50 € (tarifa carta). No debe aparecer ninguna tecla de 6,50 €.',
      'Test 2 (Domingo): Marcar 1 "Aperol Spritz" en domingo → Debe marcar exactamente 8,50 € (tarifa carta). No debe aplicarse ningún precio de 6,00 €.',
      'Test 3 (Happy Hour): En franja 15:00 a 16:00 h, intentar marcar 1 sola jarra → Debe marcar 4,50 € (tarifa carta). Para aplicar la oferta debe marcarse la tecla [HH 2 JARRAS 6.00€] (2 unidades obligatorias).',
      'Test 4 (Revisión visual): Comprobar que la botonera coincide al 100% con la Cheat Sheet plastificada colocada en la contrabarra.'
    ],
    verificationCriteria: 'Ninguna consumición fuera de las promociones vigentes puede liquidarse con descuento.'
  }
];

export const TpvCleanRulesGuidePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pasos' | 'auditoria' | 'simulador' | 'checklist'>('pasos');
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    chk1: true,
    chk2: true,
    chk3: true,
    chk4: true,
    chk5: true
  });

  // Simulador de comanda
  const [simProduct, setSimProduct] = useState<'blue_diamond' | 'aperol_spritz' | 'jarra_dorada' | 'mojito'>('blue_diamond');
  const [simDay, setSimDay] = useState<'lunes' | 'miercoles' | 'viernes' | 'domingo'>('viernes');
  const [simTime, setSimTime] = useState<'15:30' | '18:00' | '11:00'>('18:00');

  const handleCopyChecklist = () => {
    const text = `==========================================================
PROTOCOLO OFICIAL DE LIMPIEZA TPV ÁGORA · KLAYMAN DIAMOND
==========================================================
1. REGLAS DE PRECIO:
   - [PR-RULE-SUNSET-FRI] Cócteles Sunset 6,50€ Viernes → DESACTIVADA / BLOQUEADA.
   - [PR-RULE-SPRITZ-SUN] Spritz Domingos 6,00€ → DESACTIVADA / BLOQUEADA.
   - [PR-RULE-SPRITZ-WED] Spritz Miércoles 6,00€ → ACTIVA EXCLUSIVA MIÉRCOLES.

2. TECLADOS Y BOTONERAS:
   - Retirada tecla [SUNSET COCKTAIL 6.50€] de Teclado Terraza.
   - Retirada tecla [SPRITZ DOMINGO 6.00€] de Teclado Terraza.
   - Teclas vigentes: [HH 2 CÓCTELES 12€], [HH 2 JARRAS 6€], [PROMO LUNES JARRAS 3€],
     [PROMO SPRITZ 6€ (Mié)], [PROMO VIERNES 2X1 CÓCTELES], [PROMO DOMINGO MOJITO 5€].

3. MODIFICADORES & SUPLEMENTOS:
   - Verificado: 0 modificadores residuales de descuento.
   - Sin tarifas por turno divergentes.

4. SINCRONIZACIÓN:
   - Push de maestros enviado desde Back-Office.
   - Recarga forzada de base de datos en terminal físico de Terraza Diamond.

5. PRUEBA DE COMANDA:
   - Cóctel Blue Diamond en viernes fuera de 2x1 = 8,50 € (Carta).
   - Spritz en domingo = 8,50 € (Carta, sin descuento).
   - Happy Hour = Solo 2 unidades idénticas (prohibida 1 jarra suelta a 3€).
Riesgo de cobro obsoleto: 0% CONFIRMADO.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleCheck = (key: string) => {
    setChecklistState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Cálculo de simulación
  const getSimulationResult = () => {
    if (simProduct === 'blue_diamond') {
      if (simTime === '15:30') {
        return {
          status: 'Happy Hour Diario (15:00 - 16:00 h)',
          price: '2 unidades idénticas = 12,00 €',
          rule: 'Regla [HH 2 CÓCTELES 12.00€] activa. Si pide 1 sola copa rige tarifa carta 8,50 €.',
          color: 'text-amber-400',
          badge: 'HAPPY HOUR OFICIAL'
        };
      }
      if (simDay === 'viernes') {
        return {
          status: 'Viernes 2x1 Cócteles Seleccionados (10:00 - 22:00 h)',
          price: 'Tarifa 2x1 (8,50 € por pareja de cócteles)',
          rule: 'Se aplica [PROMO VIERNES 2X1 CÓCTELES]. La tecla antigua de Sunset a 6,50€ YA NO EXISTE en el TPV.',
          color: 'text-emerald-400',
          badge: 'PROMO 2X1 VIGENTE'
        };
      }
      return {
        status: 'Tarifa Ordinaria de Carta',
        price: '8,50 € / copa',
        rule: 'No aplica descuento promocional. Precio íntegro de carta sin modificadores.',
        color: 'text-stone-300',
        badge: 'CARTA REGULAR'
      };
    }

    if (simProduct === 'aperol_spritz') {
      if (simTime === '15:30') {
        return {
          status: 'Happy Hour Diario (15:00 - 16:00 h)',
          price: '2 unidades idénticas = 12,00 €',
          rule: 'Aperol Spritz incluido en la lista oficial de los 6 cócteles de Happy Hour (mismo cóctel).',
          color: 'text-amber-400',
          badge: 'HAPPY HOUR OFICIAL'
        };
      }
      if (simDay === 'miercoles') {
        return {
          status: 'Miércoles de Spritz a 6,00 € (08:00 - 22:30 h)',
          price: '6,00 € / copa (Aperol, Campari, Limoncello, Hugo)',
          rule: 'Se aplica tecla oficial [PROMO SPRITZ 6.00€]. Exclusivo miércoles.',
          color: 'text-emerald-400',
          badge: 'PROMO MIÉRCOLES'
        };
      }
      if (simDay === 'domingo') {
        return {
          status: 'Domingo: Tarifa Ordinaria (Oferta Spritz eliminada)',
          price: '8,50 € / copa (Precio carta íntegro)',
          rule: '⚠️ OFERTA ELIMINADA: La tecla [SPRITZ DOMINGO 6.00€] ha sido retirada y bloqueada en TPV. El domingo es exclusivo de Mojitos a 5€.',
          color: 'text-rose-400',
          badge: 'SIN DESCUENTO EN DOMINGO'
        };
      }
      return {
        status: 'Tarifa Ordinaria de Carta',
        price: '8,50 € / copa',
        rule: 'Precio oficial de carta en copa balón con hielo macizo.',
        color: 'text-stone-300',
        badge: 'CARTA REGULAR'
      };
    }

    if (simProduct === 'jarra_dorada') {
      if (simTime === '15:30') {
        return {
          status: 'Happy Hour Diario (15:00 - 16:00 h)',
          price: '2 Jarras = 6,00 € (Obligatorio par)',
          rule: 'REGLA ESTRICTA: Prohibido vender 1 jarra suelta a 3,00 €. Una sola jarra en Happy Hour cuesta tarifa regular 4,50 €.',
          color: 'text-amber-400',
          badge: 'HH 2 JARRAS 6€'
        };
      }
      if (simDay === 'lunes') {
        return {
          status: 'Lunes de Jarras a 3,00 € (08:00 - 22:00 h)',
          price: '3,00 € / jarra (Incluye frutos secos tostados canarios)',
          rule: 'Aplica tecla [PROMO LUNES JARRAS 3.00€]. Válido todo el lunes en unidades sueltas.',
          color: 'text-emerald-400',
          badge: 'PROMO LUNES'
        };
      }
      return {
        status: 'Tarifa Ordinaria de Carta',
        price: '4,50 € / jarra (50 cl)',
        rule: 'Precio regular de barril Dorada Especial fría a 2ºC.',
        color: 'text-stone-300',
        badge: 'CARTA REGULAR'
      };
    }

    // mojito
    if (simDay === 'domingo') {
      return {
        status: 'Domingos de Mojitos a 5,00 € (08:00 - 22:30 h)',
        price: '5,00 € / mojito (Tradicional, Fresa, Maracuyá, Virgin)',
        rule: 'Tecla directa [PROMO DOMINGO MOJITO 5.00€] activa durante toda la jornada dominical.',
        color: 'text-emerald-400',
        badge: 'PROMO DOMINGO'
      };
    }
    return {
      status: 'Tarifa Ordinaria de Carta',
      price: '8,50 € / copa (Virgin 6,50 €)',
      rule: 'Tarifa estándar de carta de lunes a sábado.',
      color: 'text-stone-300',
      badge: 'CARTA REGULAR'
    };
  };

  const simResult = getSimulationResult();

  return (
    <div className="rounded-2xl bg-stone-900/95 border border-purple-800/50 shadow-xl overflow-hidden animate-fadeIn">
      {/* CABECERA SUPERIOR */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/80 via-stone-900 to-stone-950 border-b border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-purple-900/90 text-purple-300 border border-purple-700/60 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Monitor className="w-3 h-3 text-purple-400" />
              <span>Back-Office TPV Ágora</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-mono text-[10px] font-bold flex items-center gap-1">
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Depuración de Promociones Antiguas</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Riesgo Residual: 0%</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-display font-bold text-stone-100 flex items-center gap-2">
            <span>Protocolo de Limpieza de Reglas de Precios y Modificación de Teclas en TPV</span>
          </h3>

          <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
            Procedimiento paso a paso para el Administrador / Jefatura de Sala: desactiva reglas automáticas de tarifas y retira teclas de descuento descontinuadas en el punto de venta (Cócteles Sunset viernes y Spritz domingo), asegurando que el equipo de barra no encuentre registros obsoletos ni aplique cobros erróneos.
          </p>
        </div>

        <button
          onClick={handleCopyChecklist}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-stone-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Protocolo Copiado' : 'Copiar Protocolo TPV'}</span>
        </button>
      </div>

      {/* NAVEGACIÓN POR PESTAÑAS */}
      <div className="flex border-b border-stone-800 bg-stone-950/60 p-1.5 gap-1 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('pasos')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'pasos'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-700/80 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>5 Pasos de Limpieza</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'auditoria'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-700/80 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Auditoría de Teclas (Eliminadas vs Vigentes)</span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'simulador'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-700/80 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Simulador de Comanda en Barra</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'checklist'
              ? 'bg-purple-900/60 text-purple-200 border border-purple-700/80 font-bold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Checklist de Verificación</span>
        </button>
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA */}
      <div className="p-4 sm:p-5">
        {/* PESTAÑA 1: 5 PASOS DETALLADOS */}
        {activeTab === 'pasos' && (
          <div className="space-y-4">
            {/* SELECTOR HORIZONTAL DE PASOS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {MAINTENANCE_STEPS.map((step, idx) => {
                const isSelected = selectedStep === idx;
                return (
                  <button
                    key={step.number}
                    onClick={() => setSelectedStep(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-500 text-stone-100 shadow-md ring-1 ring-purple-500/50'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className={isSelected ? 'text-purple-400' : 'text-stone-500'}>
                        PASO {step.number}
                      </span>
                      {isSelected && <Sparkles className="w-3 h-3 text-purple-400" />}
                    </div>
                    <div className="text-[11px] font-semibold line-clamp-2 mt-1 leading-snug">
                      {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DETALLE DEL PASO SELECCIONADO */}
            {(() => {
              const curStep = MAINTENANCE_STEPS[selectedStep];
              return (
                <div className="p-4 sm:p-5 rounded-xl bg-stone-950 border border-purple-900/40 space-y-3.5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                        Paso {curStep.number} de 05 · Ágora ERP Back-Office
                      </span>
                      <h4 className="text-base font-display font-bold text-stone-100">
                        {curStep.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px] bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800">
                      <Settings className="w-3.5 h-3.5 text-purple-400" />
                      <span>{curStep.systemPath}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {curStep.shortDesc}
                  </p>

                  {curStep.dangerAlert && (
                    <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-rose-300 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block uppercase tracking-wide text-[10.5px]">Advertencia Crítica:</strong>
                        <span>{curStep.dangerAlert}</span>
                      </div>
                    </div>
                  )}

                  {/* INSTRUCCIONES OPERATIVAS */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Acciones exactas en el Back-Office:</span>
                    </span>

                    <ol className="space-y-2 text-xs text-stone-300">
                      {curStep.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-2.5 bg-stone-900/60 p-2.5 rounded-lg border border-stone-850">
                          <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-800/70">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{inst}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* CRITERIO DE VERIFICACIÓN */}
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/50 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-stone-300">
                        <strong className="text-emerald-300">Criterio de éxito:</strong> {curStep.verificationCriteria}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                      100% Auditado
                    </span>
                  </div>

                  {/* NAVEGACIÓN ENTRE PASOS */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-850">
                    <button
                      disabled={selectedStep === 0}
                      onClick={() => setSelectedStep(prev => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-lg bg-stone-850 text-stone-300 hover:text-stone-100 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <span>← Paso Anterior</span>
                    </button>
                    <span className="text-[10.5px] font-mono text-stone-500">
                      {selectedStep + 1} / {MAINTENANCE_STEPS.length}
                    </span>
                    <button
                      disabled={selectedStep === MAINTENANCE_STEPS.length - 1}
                      onClick={() => setSelectedStep(prev => Math.min(MAINTENANCE_STEPS.length - 1, prev + 1))}
                      className="px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 disabled:opacity-30 disabled:pointer-events-none text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Siguiente Paso →</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* PESTAÑA 2: AUDITORÍA DE TECLAS (ELIMINADAS VS OFICIALES) */}
        {activeTab === 'auditoria' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-stone-300">
                Comparativa de teclas y modificadores en el TPV Ágora de <strong>Bar / Terraza Diamond</strong>:
              </span>
              <div className="flex items-center gap-2 font-mono text-[10.5px]">
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Eliminadas (2)</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Activas Oficiales (6)</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stone-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 text-[10.5px] uppercase">
                  <tr>
                    <th className="p-2.5 sm:p-3">Tecla / Modificador</th>
                    <th className="p-2.5 sm:p-3">Estado TPV</th>
                    <th className="p-2.5 sm:p-3">Ubicación en Ágora</th>
                    <th className="p-2.5 sm:p-3">Motivo / Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 bg-stone-900/60">
                  {TPV_AUDIT_KEYS.map(k => {
                    const isDeleted = k.status === 'ELIMINADA_BLOQUEADA';
                    return (
                      <tr key={k.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="p-2.5 sm:p-3">
                          <div className="font-bold text-stone-100 flex items-center gap-1.5">
                            {isDeleted ? (
                              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className={isDeleted ? 'text-rose-300 line-through opacity-85' : 'text-emerald-300'}>
                              {k.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {k.category}
                          </span>
                        </td>
                        <td className="p-2.5 sm:p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                              isDeleted
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            {isDeleted ? 'ELIMINADA & BLOQUEADA' : 'VIGENTE OFICIAL'}
                          </span>
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px] text-stone-300">
                          {k.path}
                        </td>
                        <td className="p-2.5 sm:p-3 text-[11px]">
                          <span className="text-stone-300 block">{k.reason}</span>
                          <span className="text-[10px] text-purple-400/90 block mt-0.5 italic">
                            Acción: {k.actionRequired}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: SIMULADOR DE COMANDA EN BARRA */}
        {activeTab === 'simulador' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-stone-300 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300 font-bold block mb-0.5">Validador de Integridad de Precios:</strong>
                <span>
                  Selecciona el producto, el día y la hora para comprobar la respuesta que el TPV debe dar al marcar la comanda en barra. Si no existe tecla promocional vigente, el sistema cobra estrictamente la tarifa de carta.
                </span>
              </div>
            </div>

            {/* CONTROLES DEL SIMULADOR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <label className="text-[10.5px] font-mono text-stone-400 uppercase tracking-wide block">
                  1. Bebida seleccionada:
                </label>
                <select
                  value={simProduct}
                  onChange={e => setSimProduct(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-750 text-stone-100 rounded-lg p-1.5 text-xs font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="blue_diamond">Blue Diamond Sunset (Cóctel Insignia)</option>
                  <option value="aperol_spritz">Aperol Spritz (Spritz Veneciano)</option>
                  <option value="jarra_dorada">Jarra Cerveza Dorada Especial (50 cl)</option>
                  <option value="mojito">Mojito Tradicional / Sabores</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <label className="text-[10.5px] font-mono text-stone-400 uppercase tracking-wide block">
                  2. Día de la semana:
                </label>
                <select
                  value={simDay}
                  onChange={e => setSimDay(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-750 text-stone-100 rounded-lg p-1.5 text-xs font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="lunes">Lunes (Lunes de Jarras)</option>
                  <option value="miercoles">Miércoles (Miércoles de Spritz)</option>
                  <option value="viernes">Viernes (Viernes 2x1 Cócteles)</option>
                  <option value="domingo">Domingo (Domingo de Mojitos)</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <label className="text-[10.5px] font-mono text-stone-400 uppercase tracking-wide block">
                  3. Franja horaria:
                </label>
                <select
                  value={simTime}
                  onChange={e => setSimTime(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-750 text-stone-100 rounded-lg p-1.5 text-xs font-mono focus:outline-none focus:border-purple-500"
                >
                  <option value="11:00">11:00 h (Mañana ordinaria)</option>
                  <option value="15:30">15:30 h (Franja Happy Hour Diario 15:00-16:00)</option>
                  <option value="18:00">18:00 h (Tarde / Puesta de Sol)</option>
                </select>
              </div>
            </div>

            {/* RESULTADO DE LA SIMULACIÓN EN TPV */}
            <div className="p-4 rounded-xl bg-stone-950 border border-purple-800/60 space-y-2">
              <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-stone-200">
                    Respuesta del TPV Ágora en Barra:
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${simResult.color} bg-stone-900 border-stone-700`}>
                  {simResult.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase block">Liquidación en Ticket TPV</span>
                  <div className={`text-base font-bold font-mono ${simResult.color}`}>
                    {simResult.price}
                  </div>
                  <span className="text-xs text-stone-300 font-semibold block mt-0.5">
                    {simResult.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-xs text-stone-300 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                    Regla de Negocio Aplicada:
                  </span>
                  <p className="text-[11.5px] leading-relaxed text-stone-300">
                    {simResult.rule}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: CHECKLIST DE VERIFICACIÓN */}
        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-stone-300">
                Checklist obligatorio de verificación para el Administrador de TPV:
              </span>
              <button
                onClick={() => setChecklistState({ chk1: true, chk2: true, chk3: true, chk4: true, chk5: true })}
                className="text-[10.5px] font-mono text-purple-400 hover:text-purple-300 underline"
              >
                Marcar todas
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'chk1',
                  label: 'Regla PR-RULE-SUNSET-FRI desactivada en Back-Office (Cócteles Sunset 6,50€ Viernes eliminada).'
                },
                {
                  id: 'chk2',
                  label: 'Regla PR-RULE-SPRITZ-SUN desactivada en Back-Office (Spritz en domingo bloqueado; exclusivo miércoles).'
                },
                {
                  id: 'chk3',
                  label: 'Teclas [SUNSET COCKTAIL 6.50€] y [SPRITZ DOMINGO 6.00€] eliminadas de la botonera táctil de terraza.'
                },
                {
                  id: 'chk4',
                  label: 'Sincronización forzada (Push) completada y recarga de base de datos ejecutada en el TPV físico de barra.'
                },
                {
                  id: 'chk5',
                  label: 'Comprobación visual: La pantalla del TPV coincide al 100% con la Cheat Sheet plastificada en barra.'
                }
              ].map(item => {
                const checked = checklistState[item.id];
                return (
                  <label
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      checked
                        ? 'bg-purple-950/30 border-purple-800/60 text-stone-200'
                        : 'bg-stone-950/60 border-stone-850 text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-purple-600 border-purple-500 text-stone-950'
                          : 'border-stone-700 bg-stone-900'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-mono leading-relaxed select-none">
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* ESTADO FINAL */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-emerald-300 block font-bold">Auditoría Superada: Riesgo 0 de descuento obsoleto</strong>
                  <span className="text-stone-300 text-[11px]">
                    El personal no podrá encontrar ni aplicar accidentalmente tarifas de promociones pasadas.
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyChecklist}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-[10.5px] transition-colors shrink-0"
              >
                {copied ? 'Copiado' : 'Copiar Acta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
