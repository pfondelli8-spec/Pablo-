import {
  ManualArticle,
  ManualChapterId,
  ManualChapterMeta,
  UserRoleTarget
} from '../types/userManual';

export const MANUAL_CHAPTERS_META: ManualChapterMeta[] = [
  {
    id: 'capitulo_1_primeros_pasos',
    order: 1,
    numberRoman: 'I',
    title: 'Primeros pasos',
    shortDesc: 'Acceso, login, selección de hotel, departamentos, navegación y perfiles de usuario.',
    iconName: 'Compass',
    badge: 'Inducción Inicial'
  },
  {
    id: 'capitulo_2_gestion_menus',
    order: 2,
    numberRoman: 'II',
    title: 'Gestión de menús y ruedas de menú',
    shortDesc: 'Subida de archivos Excel/PDF, configuración de ciclos de 15 días, servicios y versionado.',
    iconName: 'Calendar',
    badge: 'Operativa Quincenal'
  },
  {
    id: 'capitulo_3_gestion_documentos',
    order: 3,
    numberRoman: 'III',
    title: 'Gestión de documentos',
    shortDesc: 'Biblioteca técnica, fichas técnicas de platos, alérgenos, sustitución y archivo acumulativo.',
    iconName: 'FolderArchive',
    badge: 'Control Documental'
  },
  {
    id: 'capitulo_4_gestion_operarios',
    order: 4,
    numberRoman: 'IV',
    title: 'Gestión de operarios',
    shortDesc: 'Altas, bajas, modificación de datos, asignación a partidas y gestión de roles activos.',
    iconName: 'Users',
    badge: 'Recursos Humanos'
  },
  {
    id: 'capitulo_5_categorias_departamentos_areas',
    order: 5,
    numberRoman: 'V',
    title: 'Categorías, departamentos y áreas',
    shortDesc: 'Estructuración de las 7 partidas canónicas de cocina, housekeeping, mantenimiento y bares.',
    iconName: 'Layers',
    badge: 'Arquitectura Operativa'
  },
  {
    id: 'capitulo_6_checklists_controles',
    order: 6,
    numberRoman: 'VI',
    title: 'Listas de comprobación y controles',
    shortDesc: 'Checklists M/N, registro de temperaturas críticas, plan L+D, caducidades y firmas sanitarias.',
    iconName: 'CheckSquare',
    badge: 'APPCC & Calidad'
  },
  {
    id: 'capitulo_7_configuracion_administracion',
    order: 7,
    numberRoman: 'VII',
    title: 'Configuración y administración',
    shortDesc: 'Gestión de PINs de acceso, edición de actividades, chefs titulares y aislamiento por hotel.',
    iconName: 'Settings',
    badge: 'Dirección Operativa'
  },
  {
    id: 'capitulo_8_problemas_frecuentes',
    order: 8,
    numberRoman: 'VIII',
    title: 'Problemas frecuentes (FAQ)',
    shortDesc: 'Resolución rápida de incidencias, errores de archivo, permisos y contingencias en cocina.',
    iconName: 'HelpCircle',
    badge: 'Soporte Inmediato'
  }
];

export const CANONICAL_MANUAL_ARTICLES: ManualArticle[] = [
  // =========================================================================
  // CAPÍTULO 1: PRIMEROS PASOS
  // =========================================================================
  {
    id: 'art-1-1-acceso-login',
    chapterId: 'capitulo_1_primeros_pasos',
    order: 1,
    title: 'Cómo acceder a la aplicación e iniciar sesión',
    subtitle: 'Navegación inicial, autenticación por PIN y modos de trabajo.',
    slug: 'acceso-login-iniciar-sesion',
    targetRoles: ['todos', 'operario', 'jefe', 'admin'],
    badge: 'Esencial',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['acceso', 'login', 'pin', 'modo jefe', 'portada'],
    sectionPath: 'Portada > Header Institucional > Candado de Seguridad',
    quickButtons: [
      { label: 'Portada Principal', hint: 'Toca la cubierta para entrar al portal' },
      { label: 'Candado de Seguridad', hint: 'Icono candado en barra superior' }
    ],
    paraQueSirve:
      'Permite ingresar a la plataforma de gestión operativa F&B desde cualquier tablet de partida, ordenador de oficina o móvil, estableciendo el nivel de permisos adecuado según el rol asignado en el turno.',
    quienPuedeHacerlo: {
      role: 'Todo el personal operativo y de supervisión',
      pinRequired: 'Empleado (1234), Jefe de Departamento (5678), Administrador Central (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Acceder a la URL del portal',
        instruction: 'Abra el navegador en la tablet o terminal de la partida. La pantalla inicial mostrará la cubierta oficial «Pablo Fondelli · Consultor en F&B Management».',
        screenLocation: 'Pantalla de Portada',
        highlightButton: 'Toca la cubierta para entrar'
      },
      {
        stepNumber: 2,
        title: 'Tocar la cubierta interactiva',
        instruction: 'Pulse sobre el sello central PF o el texto «Toca la cubierta para entrar» para avanzar a la pantalla de «Cocinas de Hotel Operativas».',
        screenLocation: 'Centro de pantalla',
        highlightButton: 'Cubierta PF'
      },
      {
        stepNumber: 3,
        title: 'Identificar el modo de trabajo activo',
        instruction: 'Por defecto, la aplicación inicia en «Modo Trabajador / Empleado», permitiendo rellenar checklists, registrar temperaturas y consultar recetas sin riesgo de borrar configuraciones.',
        screenLocation: 'Barra superior (Header)',
        tip: 'Si necesita editar o autorizar cambios, pulse el candado superior derecho para ingresar el PIN de Jefe (5678).'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'Un cocinero matinal llega a las 06:30 para el pase de desayunos en Cafetería. Enciende la tablet táctil de la pared.',
      resolution: 'Toca la cubierta, entra directamente a Cocina Bitácora en Modo Trabajador sin necesidad de contraseña compleja y comienza de inmediato su checklist de apertura.'
    },
    resultadoEsperado: {
      screenState: 'La pantalla muestra las tarjetas de Hotel Bitácora y Hotel Vulcano con sus respectivos chefs titulares.',
      systemEffect: 'Se establece la sesión local como operador de turno sin caducidad de sesión forzada.',
      auditRecord: 'Sesión operativa iniciada como operador del establecimiento.'
    },
    erroresEvitar: [
      {
        mistake: 'Compartir el PIN de Administrador (9999) con personal no autorizado.',
        consequence: 'Riesgo de alteración no controlada de tolerancias APPCC o borrado de partidas.',
        recommendation: 'El personal de partida solo debe utilizar el acceso estándar o el PIN 1234.'
      }
    ]
  },
  {
    id: 'art-1-2-seleccion-hotel-departamento',
    chapterId: 'capitulo_1_primeros_pasos',
    order: 2,
    title: 'Cómo seleccionar establecimiento y departamento operativo',
    subtitle: 'Navegación entre Hotel Bitácora y Hotel Vulcano, y selección de las áreas de servicio.',
    slug: 'seleccion-establecimiento-departamento',
    targetRoles: ['todos', 'operario', 'jefe'],
    badge: 'Navegación',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['hotel', 'bitacora', 'vulcano', 'departamentos', 'cocina'],
    sectionPath: 'Portada > Cocinas de Hotel Operativas > Departamentos',
    quickButtons: [
      { label: 'Acceder a Bitácora', hint: 'Botón turquesa en tarjeta izquierda' },
      { label: 'Acceder a Vulcano', hint: 'Botón esmeralda en tarjeta derecha' }
    ],
    paraQueSirve:
      'Garantiza que el usuario trabaje exclusivamente sobre los datos, chefs, checklists y recetas del establecimiento específico que tiene asignado en su jornada de trabajo.',
    quienPuedeHacerlo: {
      role: 'Cualquier usuario de la plataforma',
      pinRequired: 'No requiere PIN para navegar'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Elegir el hotel de trabajo',
        instruction: 'En la pantalla «Cocinas de Hotel Operativas», elija entre «Hotel Bitácora (Chef Antonio González)» o «Hotel Vulcano (Chef Giacomo Longo)».',
        screenLocation: 'Parrilla central de Hoteles',
        highlightButton: 'Acceder a Bitácora / Acceder a Vulcano'
      },
      {
        stepNumber: 2,
        title: 'Verificar la barra superior compacta del hotel',
        instruction: 'Al ingresar, observe que la cabecera muestra el nombre del hotel con su insignia 4★ Superior y la foto del Chef Ejecutivo responsable.',
        screenLocation: 'Barra superior del hotel'
      },
      {
        stepNumber: 3,
        title: 'Seleccionar el departamento operativo',
        instruction: 'En el selector de departamentos superior elija entre: Cocina & Gastronomía (7 partidas), Pisos & Housekeeping, Mantenimiento Técnico & SST, Bares & Restauración o Recepción & Front Office.',
        screenLocation: 'Pestañas de departamentos',
        highlightButton: 'Cocina & Gastronomía'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'El responsable de turno de Vulcano necesita revisar las tareas de limpieza de la partida fría.',
      resolution: 'Pulsa «Acceder a Vulcano», selecciona «Cocina & Gastronomía» y entra a la casilla «Partida Fría de Mañana» con los protocolos de Giacomo Longo.'
    },
    resultadoEsperado: {
      screenState: 'Se despliega la cuadrícula con las 7 casillas canónicas de trabajo del departamento elegido.',
      systemEffect: 'Se fija el hotelModelId activo en almacenamiento local.',
      auditRecord: 'Entorno operativo vinculado al hotel seleccionado.'
    },
    erroresEvitar: [
      {
        mistake: 'Registrar checklists de Bitácora estando físicamente en las instalaciones de Vulcano.',
        consequence: 'Inconsistencia en los registros de trazabilidad y auditorías sanitarias cruzadas.',
        recommendation: 'Comprobar siempre el logotipo y el nombre del Chef Ejecutivo en la esquina superior izquierda.'
      }
    ]
  },
  {
    id: 'art-1-3-perfiles-permisos-roles',
    chapterId: 'capitulo_1_primeros_pasos',
    order: 3,
    title: 'Diferencias entre perfiles: Operario, Responsable (Jefe) y Administrador',
    subtitle: 'Matriz de permisos, niveles de acceso y responsabilidades operativas.',
    slug: 'perfiles-permisos-roles',
    targetRoles: ['todos', 'jefe', 'admin'],
    badge: 'Normativa',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['roles', 'permisos', 'pin', 'jefe', 'administrador', 'seguridad'],
    sectionPath: 'Barra superior > Candado / Botón Jefe',
    paraQueSirve:
      'Define con claridad qué acciones puede ejecutar cada trabajador, protegiendo las fórmulas técnicas y normativas sanitarias contra modificaciones no supervisadas.',
    quienPuedeHacerlo: {
      role: 'Dirección de Operaciones F&B y Jefes de Partida',
      pinRequired: 'Visualización libre; desbloqueo con PIN de nivel'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Perfil Operario / Empleado (PIN 1234 o acceso directo)',
        instruction: 'Pensado para cocineros, marmitones y camareros. Permite marcar tareas realizadas, ingresar lecturas térmicas, registrar limpiezas y consultar fichas técnicas. No puede borrar partidas ni cambiar recetas.',
        screenLocation: 'Modo por defecto de la aplicación'
      },
      {
        stepNumber: 2,
        title: 'Perfil Responsable / Modo Jefe (PIN 5678)',
        instruction: 'Reservado a Jefes de Cocina, Segundos Chefs y Gobernantes. Permite modificar descripciones de tareas, editar tolerancias horarias, subir ruedas de menú y validar incidencias operativas.',
        screenLocation: 'Botón dorado «Jefe» en la cabecera'
      },
      {
        stepNumber: 3,
        title: 'Perfil Administrador Central (PIN 9999)',
        instruction: 'Acceso total para Dirección F&B y Consultoría Técnica (Pablo Fondelli). Permite crear nuevos hoteles, dar de alta categorías, restaurar copias de seguridad y modificar parámetros multi-tenant.',
        screenLocation: 'Panel de Administración Global'
      }
    ],
    ejemploPractico: {
      hotelContext: 'General',
      scenario: 'Un cocinero de partida caliente detecta que la freidora industrial no figura en su lista de equipos.',
      resolution: 'Acude al Jefe de Cocina (Antonio González / Giacomo Longo), quien activa el Modo Jefe con el PIN 5678 y edita la ficha del puesto al instante.'
    },
    resultadoEsperado: {
      screenState: 'La interfaz resalta los botones de edición solo cuando el perfil autorizado está activo.',
      systemEffect: 'Las firmas y certificados quedan etiquetados con el rol jerárquico del firmante.',
      auditRecord: 'Operación validada bajo nivel de seguridad correspondiente.'
    },
    erroresEvitar: [
      {
        mistake: 'Dejar el Modo Jefe activo en la tablet de uso compartido de la cocina tras terminar una edición.',
        consequence: 'Cualquier operario podría modificar accidentalmente actividades o eliminar registros.',
        recommendation: 'Pulsar siempre el icono de candado rojo para cerrar el Modo Jefe y volver al Modo Trabajador.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 2: GESTIÓN DE MENÚS Y RUEDAS DE MENÚ
  // =========================================================================
  {
    id: 'art-2-1-subir-rueda-menu',
    chapterId: 'capitulo_2_gestion_menus',
    order: 1,
    title: 'Cómo subir y cargar una rueda de menú de 15 días (Excel o PDF)',
    subtitle: 'Procedimiento de importación automática, estructura de columnas y validación.',
    slug: 'subir-rueda-menu-excel-pdf',
    targetRoles: ['jefe', 'admin'],
    badge: 'Ciclo 15 Días',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['rueda de menu', 'excel', 'pdf', '15 dias', 'desayuno', 'almuerzo', 'cena'],
    sectionPath: 'Hotel > Pestaña Ruedas & Recetas > Botón Subir Archivo',
    quickButtons: [
      { label: 'Ruedas & Recetas', hint: 'Pestaña central en cabecera del hotel' },
      { label: 'Subir Excel / PDF', hint: 'Zona de carga superior en el módulo' }
    ],
    paraQueSirve:
      'Permite cargar la planificación gastronómica quincenal completa del buffet o restaurante para que los cocineros y el personal de pase conozcan con antelación las preparaciones exactas de cada día.',
    quienPuedeHacerlo: {
      role: 'Chef Ejecutivo, Segundo de Cocina o Dirección F&B',
      pinRequired: 'PIN de Jefe (5678) o Administrador (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Acceder al módulo de Ruedas de Menú',
        instruction: 'Dentro del hotel (Bitácora o Vulcano), pulse en la pestaña superior «Ruedas & Recetas», o directamente en el botón exterior «Ruedas de Menú» de la tarjeta del hotel.',
        screenLocation: 'Cabecera de navegación del hotel',
        highlightButton: 'Ruedas & Recetas'
      },
      {
        stepNumber: 2,
        title: 'Seleccionar la rueda a cargar (Rueda 1 o Rueda 2)',
        instruction: 'Haga clic en la pestaña «Menú — Rueda 1» o «Menú — Rueda 2» según corresponda a la quincena de producción que va a configurar.',
        screenLocation: 'Sub-pestañas superiores del módulo'
      },
      {
        stepNumber: 3,
        title: 'Adjuntar el archivo de menú',
        instruction: 'Arrastre su archivo Excel (.xlsx, .xls) o PDF a la caja de carga, o pulse el botón «Seleccionar Archivo». El sistema procesará las celdas automáticamente.',
        screenLocation: 'Área de carga documental',
        highlightButton: 'Subir Menú (Excel / PDF)'
      },
      {
        stepNumber: 4,
        title: 'Verificar el visor interactivo',
        instruction: 'Revise que los 15 días (Día 1 al Día 15) muestren correctamente los platos en sus correspondientes servicios: Desayuno, Almuerzo y Cena.',
        screenLocation: 'Visor integrado de 15 días'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'El Chef Antonio González recibe la nueva rotación de platos de invierno para el buffet central en un archivo Excel «Rueda_Invierno_Bitacora_15D.xlsx».',
      resolution: 'Entra en Ruedas & Recetas, selecciona Rueda 1, arrastra el Excel y en 3 segundos los 15 días quedan publicados y legibles en todas las tablets del pase.'
    },
    resultadoEsperado: {
      screenState: 'La parrilla de 15 días se actualiza en verde con el número total de referencias detectadas y el botón para ver el Excel en línea.',
      systemEffect: 'Los datos se guardan en el almacenamiento local del hotel sin sobrescribir la Rueda 2.',
      auditRecord: 'Rueda de Menú actualizada con fecha, hora y firma del Chef titular.'
    },
    erroresEvitar: [
      {
        mistake: 'Subir un archivo Excel con columnas fusionadas o sin especificar si es Almuerzo o Cena.',
        consequence: 'El sistema puede no asignar los platos al servicio correcto en la parrilla quincenal.',
        recommendation: 'Utilizar la plantilla recomendada con columnas: Día, Servicio (Desayuno/Almuerzo/Cena), Nombre del Plato, Alérgenos.'
      }
    ]
  },
  {
    id: 'art-2-2-actualizar-sustituir-menus',
    chapterId: 'capitulo_2_gestion_menus',
    order: 2,
    title: 'Cómo actualizar o sustituir un menú sin perder la información anterior',
    subtitle: 'Control de versiones, histórico de archivos y reemplazo seguro.',
    slug: 'actualizar-sustituir-menus-sin-perder-datos',
    targetRoles: ['jefe', 'admin'],
    badge: 'Versionado',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['actualizar', 'sustituir', 'historico', 'versionado', 'repositorio'],
    sectionPath: 'Hotel > Ruedas & Recetas > Histórico de Menús',
    paraQueSirve:
      'Permite incorporar ajustes de temporada o correcciones de materias primas en una rueda quincenal archivando de forma inmutable la versión anterior para consultas posteriores.',
    quienPuedeHacerlo: {
      role: 'Chef Ejecutivo o Responsable de Partida',
      pinRequired: 'PIN de Jefe (5678)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Localizar la rueda activa',
        instruction: 'Abra «Ruedas & Recetas» en el hotel correspondiente y verifique la fecha de última actualización del menú en pantalla.',
        screenLocation: 'Cabecera de la rueda activa'
      },
      {
        stepNumber: 2,
        title: 'Cargar la nueva revisión',
        instruction: 'Pulse en «Sustituir Rueda». El sistema le solicitará confirmación e incrementará automáticamente el número de versión (ej. de v1.0 a v1.1).',
        screenLocation: 'Botonera lateral de la rueda',
        highlightButton: 'Sustituir Rueda'
      },
      {
        stepNumber: 3,
        title: 'Consultar versiones archivadas',
        instruction: 'Para revisar qué se sirvió en semanas anteriores, pulse la pestaña «Repositorio / Histórico». Todos los archivos subidos quedan accesibles para descarga.',
        screenLocation: 'Pestaña Historial de Versiones'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'El Chef Giacomo Longo debe reemplazar el pescado del Día 7 por ruptura de stock en el proveedor de lubina fresca.',
      resolution: 'Sube la versión revisada «Rueda_Vulcano_v1.2.xlsx». La anterior versión queda archivada en el repositorio y la pantalla muestra de inmediato el nuevo pescado a la brigada.'
    },
    resultadoEsperado: {
      screenState: 'La versión activa cambia a v1.2 y la versión v1.1 queda visible en la tabla inferior de archivo.',
      systemEffect: 'Trazabilidad completa asegurada para auditorías de costes y alérgenos.',
      auditRecord: 'Sustitución de Rueda de Menú registrada por Giacomo Longo.'
    },
    erroresEvitar: [
      {
        mistake: 'Eliminar el archivo antiguo antes de subir el nuevo.',
        consequence: 'Pérdida de la trazabilidad exigida en inspecciones sanitarias APPCC.',
        recommendation: 'Usar siempre el botón «Sustituir Rueda», que archiva el historial automáticamente.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 3: GESTIÓN DE DOCUMENTOS
  // =========================================================================
  {
    id: 'art-3-1-subir-actualizar-fichas-tecnicas',
    chapterId: 'capitulo_3_gestion_documentos',
    order: 1,
    title: 'Cómo subir, actualizar y gestionar fichas técnicas de cocina',
    subtitle: 'Escandallos, ingredientes, alérgenos 1169/2011 y método de elaboración.',
    slug: 'subir-actualizar-fichas-tecnicas',
    targetRoles: ['todos', 'jefe', 'admin'],
    badge: 'Técnico',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['fichas tecnicas', 'escandallos', 'alergenos', 'recetas', 'ingredientes'],
    sectionPath: 'Hotel > Ruedas & Recetas > Fichas Técnicas',
    quickButtons: [
      { label: 'Fichas Técnicas', hint: 'Sub-pestaña de fichas en el módulo' },
      { label: 'Nueva Ficha Técnica', hint: 'Botón con icono Plus' }
    ],
    paraQueSirve:
      'Estandariza los costes, gramajes exactos, alérgenos normativos y procedimientos paso a paso de cada plato para asegurar la misma calidad organoléptica en cualquier turno.',
    quienPuedeHacerlo: {
      role: 'Consulta libre para todo el equipo; edición reservada a Jefes y Dirección',
      pinRequired: 'Consulta: Sin PIN | Creación y Edición: PIN 5678'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Abrir el catálogo de Fichas Técnicas',
        instruction: 'En el menú del hotel, entre en «Ruedas & Recetas» y haga clic en la sub-pestaña «Fichas Técnicas».',
        screenLocation: 'Pestaña superior'
      },
      {
        stepNumber: 2,
        title: 'Localizar o crear una ficha',
        instruction: 'Utilice el buscador para encontrar un plato por su nombre o pulse el botón «+ Nueva Ficha Técnica» si va a incorporar una elaboración al recetario.',
        screenLocation: 'Buscador de fichas',
        highlightButton: '+ Nueva Ficha Técnica'
      },
      {
        stepNumber: 3,
        title: 'Completar los campos obligatorios',
        instruction: 'Rellene: Nombre del plato, Partida responsable (Frío, Caliente, Pastelería, etc.), Raciones, Coste unitario (€), Lista de ingredientes con gramajes y selección de Alérgenos obligatorios.',
        screenLocation: 'Modal de Edición de Ficha'
      },
      {
        stepNumber: 4,
        title: 'Guardar y certificar',
        instruction: 'Pulse «Guardar Ficha Técnica». La ficha quedará inmediatamente disponible para consulta en todas las pantallas de cocina.',
        screenLocation: 'Pie del modal',
        highlightButton: 'Guardar Ficha Técnica'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'El cocinero de partida caliente necesita consultar si el fondo oscuro de ternera contiene apio o sulfitos.',
      resolution: 'Abre la pestaña Fichas Técnicas en la tablet del pase, escribe «Fondo oscuro» y en 2 segundos visualiza la lista oficial de alérgenos y el método de cocción.'
    },
    resultadoEsperado: {
      screenState: 'La ficha aparece con su badge de alérgenos destacados y coste escandallado actualizado.',
      systemEffect: 'Se sincroniza en el repositorio central de fichas técnicas del hotel.',
      auditRecord: 'Ficha técnica guardada con sello de autor y versión 1.0.'
    },
    erroresEvitar: [
      {
        mistake: 'Omitir marcar un alérgeno presente en una salsa base elaborada por terceros.',
        consequence: 'Grave infracción del Reglamento (UE) 1169/2011 y riesgo severo para la salud del huésped.',
        recommendation: 'Revisar siempre la etiqueta técnica de origen antes de guardar la ficha.'
      }
    ]
  },
  {
    id: 'art-3-2-carpeta-documental-acumulativa',
    chapterId: 'capitulo_3_gestion_documentos',
    order: 2,
    title: 'Cómo consultar y organizar la Carpeta Documental Acumulativa',
    subtitle: 'Estructuración de expedientes por departamento, registros sanitarios y descargas.',
    slug: 'carpeta-documental-acumulativa',
    targetRoles: ['todos', 'jefe', 'admin'],
    badge: 'Auditoría',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['carpeta documental', 'dossier', 'sanidad', 'appcc', 'descarga'],
    sectionPath: 'Navegación > Carpeta Documental Acumulativa',
    paraQueSirve:
      'Agrupa en un único dossier digital clasificado todas las fichas de maquinaria, certificados de limpieza, contratos de control de plagas y registros de inspección sanitaria para presentar ante auditores.',
    quienPuedeHacerlo: {
      role: 'Todo el personal para lectura; Jefes y Administradores para carga y borrado',
      pinRequired: 'Acceso de lectura directo; gestión con PIN 5678 / 9999'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Abrir la Carpeta Documental',
        instruction: 'Pulse en «Carpeta Documental Acumulativa» desde la botonera superior o el panel de administración.',
        screenLocation: 'Barra de herramientas o menú lateral'
      },
      {
        stepNumber: 2,
        title: 'Filtrar por familia o departamento',
        instruction: 'Seleccione la carpeta deseada: Higiene y APPCC, Planes de Limpieza L+D, Maquinaria Crítica o Fichas Técnicas.',
        screenLocation: 'Panel lateral de categorías'
      },
      {
        stepNumber: 3,
        title: 'Previsualizar o descargar',
        instruction: 'Haga clic en el icono del ojo para previsualizar en pantalla completa, o en el icono de descarga para obtener una copia local en PDF o Excel.',
        screenLocation: 'Lista de documentos'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'Un inspector de Sanidad del Gobierno de Canarias solicita ver las fichas técnicas de los desinfectantes utilizados en el tren de lavado.',
      resolution: 'El responsable abre la Carpeta Documental, entra en «Planes de Limpieza L+D» y le muestra en pantalla la ficha de homologación del producto químico al instante.'
    },
    resultadoEsperado: {
      screenState: 'Visualización nítida y ordenada del documento sin esperas ni búsqueda en archivadores físicos.',
      systemEffect: 'Registro inmutable de consulta registrado en el log del sistema.',
      auditRecord: 'Inspección documental superada con éxito.'
    },
    erroresEvitar: [
      {
        mistake: 'Guardar documentos fuera de la categoría correspondiente.',
        consequence: 'Dificultad para localizar la documentación durante una inspección en hora punta.',
        recommendation: 'Asignar siempre la etiqueta técnica correcta al subir cualquier archivo.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 4: GESTIÓN DE OPERARIOS
  // =========================================================================
  {
    id: 'art-4-1-gestion-operarios-altas-bajas',
    chapterId: 'capitulo_4_gestion_operarios',
    order: 1,
    title: 'Cómo dar de alta, modificar y asignar operarios a departamentos',
    subtitle: 'Gestión de personal de cocina, turnos asignados y firmas de trazabilidad.',
    slug: 'gestion-operarios-altas-bajas-asignacion',
    targetRoles: ['jefe', 'admin'],
    badge: 'Equipo Humano',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['operarios', 'trabajadores', 'altas', 'bajas', 'turnos', 'partidas'],
    sectionPath: 'Barra superior > Modo Jefe > Panel de Administración > Gestión de Equipo',
    quickButtons: [
      { label: 'Modo Jefe', hint: 'Requiere PIN 5678' },
      { label: 'Gestión de Personal', hint: 'Dentro del panel de configuración' }
    ],
    paraQueSirve:
      'Permite mantener al día la plantilla de cocineros, ayudantes y supervisores de cada hotel, garantizando que cada registro de temperatura y checklist quede firmado por el profesional que realmente operó la partida.',
    quienPuedeHacerlo: {
      role: 'Jefe de Cocina, Gobernanta, Jefe de Mantenimiento y Dirección F&B',
      pinRequired: 'PIN de Jefe (5678) o Administrador (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Desbloquear el Modo Jefe',
        instruction: 'Pulse en el candado superior derecho, introduzca el PIN 5678 y pulse en «Abrir Panel Jefe».',
        screenLocation: 'Barra superior'
      },
      {
        stepNumber: 2,
        title: 'Entrar en Gestión de Operarios',
        instruction: 'Haga clic en la pestaña «Equipo Operativo y Turnos». Visualizará la lista de trabajadores activos con su puesto y departamento.',
        screenLocation: 'Panel de Administración'
      },
      {
        stepNumber: 3,
        title: 'Dar de alta un nuevo trabajador',
        instruction: 'Pulse «+ Nuevo Operario». Ingrese su Nombre y Apellidos, Departamento asignado (ej. Cocina), Puesto (ej. Cocinero de Partida Fría) y Turno habitual (Mañana / Noche).',
        screenLocation: 'Formulario de alta de operario'
      },
      {
        stepNumber: 4,
        title: 'Desactivar en caso de baja o fin de contrato',
        instruction: 'Para no perder el historial de firmas sanitarias pasadas, nunca borre físicamente un trabajador: cámbielo a estado «Inactivo». El sistema conservará todas sus firmas anteriores pero impedirá que firme en turnos futuros.',
        screenLocation: 'Fila del trabajador > Botón Desactivar'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'Se incorpora un nuevo cocinero de refuerzo para la Partida Caliente de Mañana.',
      resolution: 'El Chef Antonio González lo da de alta en el panel. A partir de las 07:00 AM, el cocinero aparece en el desplegable de operarios de la Partida Caliente y firma sus comprobaciones con su propio nombre.'
    },
    resultadoEsperado: {
      screenState: 'El nuevo operario figura en la lista activa y está disponible en las casillas correspondientes.',
      systemEffect: 'Se actualiza la lista en el almacenamiento multi-tenant del hotel.',
      auditRecord: 'Alta de operario registrada con identificador único de empleado.'
    },
    erroresEvitar: [
      {
        mistake: 'Firmar checklists con el nombre de un compañero que está de libranza.',
        consequence: 'Falseamiento de registros legales ante la autoridad sanitaria.',
        recommendation: 'Seleccionar siempre el nombre del operario que efectivamente ejecuta la tarea.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 5: CATEGORÍAS, DEPARTAMENTOS Y ÁREAS
  // =========================================================================
  {
    id: 'art-5-1-estructuracion-partidas-areas',
    chapterId: 'capitulo_5_categorias_departamentos_areas',
    order: 1,
    title: 'Cómo organizar las 7 partidas de cocina y áreas operativas',
    subtitle: 'Cafetería, Frío AM/PM, Caliente AM/PM, Pastelería y Plancha/Platería.',
    slug: 'organizacion-partidas-cocina-areas',
    targetRoles: ['todos', 'jefe', 'admin'],
    badge: 'Estructura',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['partidas', 'casillas', 'cafeteria', 'frio', 'caliente', 'pasteleria', 'plancha'],
    sectionPath: 'Hotel > Departamentos > Cocina & Gastronomía',
    paraQueSirve:
      'Estructura la brigada de cocina en sus 7 casillas canónicas de trabajo, cada una con su código, equipamiento asignado, tolerancias horarias y responsabilidades de servicio.',
    quienPuedeHacerlo: {
      role: 'Consulta para todo el equipo; configuración reservada a Jefes de Cocina',
      pinRequired: 'Configuración: PIN 5678'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Comprender la cuadrícula canónica de 7 partidas',
        instruction: 'En Cocina & Gastronomía, la aplicación se divide en 7 partidas fijas e idénticas en Bitácora y Vulcano: 01. Desayunos y Cafetería, 02. Frío Mañana, 03. Frío Noche, 04. Caliente Mañana, 05. Caliente Noche, 06. Pastelería y Repostería, 07. Plancha y Platería.',
        screenLocation: 'Cuadrícula de casillas operativas'
      },
      {
        stepNumber: 2,
        title: 'Acceder al panel de una partida',
        instruction: 'Haga clic en cualquiera de las 7 casillas para abrir el panel operativo de la partida correspondiente.',
        screenLocation: 'Casilla seleccionada',
        highlightButton: 'Acceder a Partida'
      },
      {
        stepNumber: 3,
        title: 'Editar responsabilidades o maquinaria',
        instruction: 'Con el Modo Jefe activo (PIN 5678), pulse el botón «Editar Actividades y Roles» en la cabecera para modificar tareas críticas de apertura, servicio o cierre.',
        screenLocation: 'Cabecera de la partida'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'La brigada de noche de Vulcano inicia su jornada a las 15:00 horas.',
      resolution: 'El responsable de partida caliente pulsa «Partida Caliente de Noche» y tiene en pantalla las tareas específicas del pase de cena, distintas de las del almuerzo.'
    },
    resultadoEsperado: {
      screenState: 'La vista de la partida carga sus checklists, sensores de temperatura de sus hornos y timbres específicos.',
      systemEffect: 'Las tareas se acotan estrictamente al ámbito físico del puesto de trabajo.',
      auditRecord: 'Acceso a partida registrado en el sistema.'
    },
    erroresEvitar: [
      {
        mistake: 'Mezclar tareas de la partida fría en la casilla de caliente.',
        consequence: 'Confusión operativa entre cocineros y registros térmicos cruzados.',
        recommendation: 'Mantener cada control en su partida canónica asignada.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 6: LISTAS DE COMPROBACIÓN Y CONTROLES
  // =========================================================================
  {
    id: 'art-6-1-checklists-operativas-firmas',
    chapterId: 'capitulo_6_checklists_controles',
    order: 1,
    title: 'Cómo consultar, realizar y certificar una checklist operativa',
    subtitle: 'Flujo de apertura, pase de servicio, cierre y firma inmutable.',
    slug: 'checklists-operativas-certificar-firmar',
    targetRoles: ['todos', 'operario', 'jefe'],
    badge: 'Diario',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['checklist', 'tareas', 'apertura', 'servicio', 'cierre', 'firma', 'operativo'],
    sectionPath: 'Partida > Pestaña Checklist (M/N)',
    quickButtons: [
      { label: 'Servicio Mañana', hint: 'Botón con icono Sol' },
      { label: 'Servicio Noche', hint: 'Botón con icono Luna' },
      { label: 'Certificar y Firmar', hint: 'Botón verde inferior' }
    ],
    paraQueSirve:
      'Garantiza que ningún punto crítico de higiene, puesta a punto o seguridad alimentaria quede en el olvido al inicio, durante o al final de cada turno de cocina.',
    quienPuedeHacerlo: {
      role: 'Cocinero de partida, ayudante, supervisor o jefe de turno',
      pinRequired: 'No requiere PIN para marcar tareas ni firmar el turno'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Elegir el servicio activo (Mañana o Noche)',
        instruction: 'En la parte superior de la checklist, pulse en «Servicio Mañana» o «Servicio Noche» según la franja horaria en la que se encuentre.',
        screenLocation: 'Selector superior de turno',
        highlightButton: 'Servicio Mañana / Servicio Noche'
      },
      {
        stepNumber: 2,
        title: 'Marcar las tareas completadas',
        instruction: 'A medida que ejecuta cada procedimiento físico (encendido de maquinaria, desinfección de superficies, montaje de línea), pulse sobre la casilla de verificación. La barra de progreso aumentará.',
        screenLocation: 'Lista de tareas numeradas'
      },
      {
        stepNumber: 3,
        title: 'Certificar y firmar el checklist',
        instruction: 'Una vez completadas todas las comprobaciones, pulse el botón verde «Certificar y Firmar Checklist». El sistema guardará el registro inmutable con fecha, hora exacta y el nombre del operador.',
        screenLocation: 'Pie del checklist',
        highlightButton: 'Certificar y Firmar Checklist'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'A las 07:15 AM en Cafetería, el operario ha purgado las cafeteras, verificado la leche a 3.5ºC y cortado la fruta de temporada.',
      resolution: 'Marca las 4 tareas, pulsa «Certificar y Firmar Checklist (Antonio González)» y la barra de cumplimiento se sitúa en el 100% verde conforme.'
    },
    resultadoEsperado: {
      screenState: 'La checklist muestra sello de certificado con hora y operador.',
      systemEffect: 'Se alimenta el panel de Métricas y el expediente sanitario mensual.',
      auditRecord: 'Certificación de servicio guardada inmutablemente.'
    },
    erroresEvitar: [
      {
        mistake: 'Firmar todo el checklist a primera hora sin haber ejecutado las tareas de cierre.',
        consequence: 'Falseamiento de auditoría detectable en caso de fallo técnico a mediodía.',
        recommendation: 'Marcar las comprobaciones en tiempo real conforme se van completando.'
      }
    ]
  },
  {
    id: 'art-6-2-temperaturas-tolerancias-correcciones',
    chapterId: 'capitulo_6_checklists_controles',
    order: 2,
    title: 'Cómo registrar temperaturas críticas y aplicar acciones correctoras',
    subtitle: 'Cámaras frigoríficas (<4ºC), congeladores (<-18ºC), buffet caliente (>65ºC) y desvíos.',
    slug: 'registro-temperaturas-tolerancias-acciones-correctoras',
    targetRoles: ['todos', 'operario', 'jefe', 'admin'],
    badge: 'Crítico APPCC',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['temperaturas', 'camaras', 'congelador', 'buffet', 'desviacion', 'accion correctora'],
    sectionPath: 'Partida > Pestaña Temperaturas',
    quickButtons: [
      { label: 'Temperaturas', hint: 'Icono termómetro en sub-pestañas' },
      { label: 'Guardar Temperatura', hint: 'Botón al pie del termómetro' }
    ],
    paraQueSirve:
      'Controla de forma continua la cadena de frío y calor según los límites críticos del APPCC para evitar la proliferación microbiana en alimentos perecederos.',
    quienPuedeHacerlo: {
      role: 'Todo cocinero de partida y responsable de turno',
      pinRequired: 'Acceso directo para registro rápido'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Acceder a la pestaña de Temperaturas',
        instruction: 'Dentro de la partida, haga clic en la pestaña «Temperaturas». Visualizará los equipos asignados a ese puesto (cámaras de frío, mesas frías, baño maría, hornos).',
        screenLocation: 'Sub-pestañas de la partida'
      },
      {
        stepNumber: 2,
        title: 'Introducir la lectura del termómetro',
        instruction: 'Lea el termómetro digital calibrado del equipo e introduzca el valor numérico en el campo correspondiente (ej. 3.2 ºC).',
        screenLocation: 'Tarjeta del equipo térmico'
      },
      {
        stepNumber: 3,
        title: 'Verificación automática de rango',
        instruction: 'Si el valor está dentro del rango legal, aparecerá en VERDE («Conforme»). Si supera el límite permitido, se pondrá en ROJO («Desviación crítica»).',
        screenLocation: 'Indicador visual de estado'
      },
      {
        stepNumber: 4,
        title: 'Aplicar Acción Correctora obligatoria si hay desvío',
        instruction: 'Si hay desviación (ej. cámara a 7.5ºC), el sistema exigirá seleccionar o redactar una Acción Correctora inmediata (ej. «Revisado cierre de puerta, avisado a Mantenimiento y trasladado producto a cámara auxiliar») antes de permitir guardar.',
        screenLocation: 'Campo de Acción Correctora emergente',
        highlightButton: 'Registrar Acción Correctora'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'En la Partida Fría de Mañana, la vitrina de ensaladas marca 6.8ºC (máximo permitido 4ºC).',
      resolution: 'El operario ingresa 6.8, el sistema alerta en rojo, selecciona la acción correctora «Compresor regulado y hielo añadido en cubas», y el sistema guarda el registro con la justificación técnica legal.'
    },
    resultadoEsperado: {
      screenState: 'El registro se archiva con etiqueta de desviación subsanada.',
      systemEffect: 'Se notifica al panel de Métricas y no se bloquea la auditoría gracias a la acción correctora.',
      auditRecord: 'Lectura térmica y acción correctora sellada en expediente APPCC.'
    },
    erroresEvitar: [
      {
        mistake: 'Inventar un valor dentro de rango sin mirar el termómetro físico.',
        consequence: 'Riesgo de servir comida en mal estado y sanción sanitaria grave en inspección.',
        recommendation: 'Registrar siempre la lectura real del termómetro homologado de la partida.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 7: CONFIGURACIÓN Y ADMINISTRACIÓN
  // =========================================================================
  {
    id: 'art-7-1-gestion-permisos-pin-tiers',
    chapterId: 'capitulo_7_configuracion_administracion',
    order: 1,
    title: 'Cómo gestionar permisos, roles y códigos PIN de acceso',
    subtitle: 'Aislamiento de seguridad, niveles Empleado, Jefe y Administrador Central.',
    slug: 'gestion-permisos-roles-pin-tiers',
    targetRoles: ['jefe', 'admin'],
    badge: 'Seguridad',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['pin', 'permisos', 'seguridad', 'jefe', 'admin', 'empleado'],
    sectionPath: 'Barra superior > Candado > Modo Jefe',
    paraQueSirve:
      'Establece las credenciales que impiden que personal no cualificado modifique recetas, checklists o parámetros de los hoteles.',
    quienPuedeHacerlo: {
      role: 'Responsables de departamento y Administrador General',
      pinRequired: 'Jefe (5678) | Administrador (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Abrir el modal de autenticación',
        instruction: 'Pulse en el candado situado en la esquina superior derecha del header institucional.',
        screenLocation: 'Barra superior derecha'
      },
      {
        stepNumber: 2,
        title: 'Introducir el código PIN correspondiente',
        instruction: 'Pulse los dígitos en el teclado numérico en pantalla. Pulse «1234» para Modo Empleado, «5678» para Modo Jefe o «9999» para Modo Administrador.',
        screenLocation: 'Teclado táctil PIN',
        highlightButton: 'Verificar PIN'
      },
      {
        stepNumber: 3,
        title: 'Comprobar el nuevo estado activo',
        instruction: 'Al validarse, la cabecera mostrará el distintivo dorado «Jefe» o «Admin». Tendrá acceso a la edición de procedimientos y ruedas.',
        screenLocation: 'Header institucional'
      }
    ],
    ejemploPractico: {
      hotelContext: 'General',
      scenario: 'El Chef Ejecutivo necesita autorizar la baja de una partida de repostería temporal.',
      resolution: 'Desbloquea con PIN 5678, realiza la configuración y vuelve a pulsar el candado para regresar a Modo Trabajador.'
    },
    resultadoEsperado: {
      screenState: 'La botonera administrativa queda habilitada.',
      systemEffect: 'Permisos de escritura activos en la sesión local.',
      auditRecord: 'Elevación de privilegios registrada en log de auditoría.'
    },
    erroresEvitar: [
      {
        mistake: 'Anotar el PIN con rotulador en la carcasa de la tablet de cocina.',
        consequence: 'Cualquier persona podría acceder a la administración.',
        recommendation: 'Memorizar el PIN y comunicarlo únicamente a los responsables de turno.'
      }
    ]
  },

  // =========================================================================
  // CAPÍTULO 8: PROBLEMAS FRECUENTES (FAQ & CONTINGENCIAS)
  // =========================================================================
  {
    id: 'art-8-1-problemas-subida-documentos-excel',
    chapterId: 'capitulo_8_problemas_frecuentes',
    order: 1,
    title: 'FAQ: No puedo subir un documento o el Excel no se visualiza correctamente',
    subtitle: 'Diagnóstico de formatos rechazados, columnas desalineadas y solución rápida.',
    slug: 'faq-error-subir-documento-excel',
    targetRoles: ['todos', 'jefe', 'admin'],
    badge: 'Soporte',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['faq', 'error', 'excel', 'subida', 'formato', 'pdf'],
    sectionPath: 'Soporte y Ayuda > Problemas Frecuentes',
    paraQueSirve:
      'Proporciona soluciones paso a paso inmediatas cuando un archivo no es admitido por la plataforma o sus datos aparecen incompletos en el visor de menús.',
    quienPuedeHacerlo: {
      role: 'Cualquier usuario que intente cargar archivos',
      pinRequired: 'Resolución técnica de usuario'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Verificar la extensión del archivo',
        instruction: 'Compruebe que el archivo tenga una extensión compatible: .xlsx, .xls, .pdf, .csv. Archivos comprimidos (.zip) o imágenes sin empaquetar no son procesados por el visor.',
        screenLocation: 'Explorador de archivos del dispositivo'
      },
      {
        stepNumber: 2,
        title: 'Comprobar el peso máximo admitido',
        instruction: 'El tamaño máximo recomendado por documento es de 15 MB para garantizar una carga fluida en las tablets de cocina.',
        screenLocation: 'Propiedades del archivo'
      },
      {
        stepNumber: 3,
        title: 'Verificar los nombres de las columnas en Excel',
        instruction: 'Asegúrese de que la primera fila del Excel contenga nombres claros como: «Día», «Servicio», «Plato» o «Descripción». Evite celdas combinadas en las primeras filas.',
        screenLocation: 'Hoja de cálculo original'
      },
      {
        stepNumber: 4,
        title: 'Probar con la plantilla estándar descargable',
        instruction: 'Si el problema persiste, descargue la plantilla Excel que ofrece el módulo de Ruedas de Menú, copie sus datos en ella y súbala de nuevo.',
        screenLocation: 'Botón «Descargar Plantilla Oficial»'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'Un supervisor intenta subir un archivo «Menu_Navidad.doc» en formato Word antiguo y la plataforma muestra un aviso de error.',
      resolution: 'Guarda el archivo como PDF desde Word («Exportar a PDF») y lo sube sin problema alguno en el módulo de Ruedas & Recetas.'
    },
    resultadoEsperado: {
      screenState: 'El archivo es aceptado y el visor muestra las celdas correctamente formateadas.',
      systemEffect: 'Generación de la vista previa interactiva sin bloqueos.',
      auditRecord: 'Validación de formato correcta.'
    },
    erroresEvitar: [
      {
        mistake: 'Subir Excels con fórmulas complejas que dependan de otros libros externos no disponibles.',
        consequence: 'Los platos dependientes de fórmulas saldrán como valores vacíos o errores #REF.',
        recommendation: 'Pegar los valores definitivos como texto antes de importar el menú.'
      }
    ]
  },
  {
    id: 'art-8-2-faq-permisos-bloqueados-recetas',
    chapterId: 'capitulo_8_problemas_frecuentes',
    order: 2,
    title: 'FAQ: Aparece «Acceso Restringido» o no puedo editar una ficha o procedimiento',
    subtitle: 'Qué hacer ante botones deshabilitados y cómo solicitar elevación de permisos.',
    slug: 'faq-acceso-restringido-permisos-bloqueados',
    targetRoles: ['todos', 'operario'],
    badge: 'Seguridad',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['faq', 'permisos', 'candado', 'bloqueado', 'restringido', 'pin'],
    sectionPath: 'Soporte y Ayuda > Problemas Frecuentes',
    paraQueSirve:
      'Explica el motivo por el cual ciertas funciones aparecen bloqueadas en la pantalla y cómo actuar para conseguir la autorización pertinente sin vulnerar la seguridad.',
    quienPuedeHacerlo: {
      role: 'Todo el personal operativo',
      pinRequired: 'Información general'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Identificar el motivo del bloqueo',
        instruction: 'La aplicación bloquea por diseño la eliminación de partidas, la alteración de recetas publicadas y la edición de checklists sanitarios para los usuarios sin PIN de Jefe o Administrador.',
        screenLocation: 'Mensaje emergente o botón en gris'
      },
      {
        stepNumber: 2,
        title: 'Contactar al Jefe de Cocina del hotel',
        instruction: 'En Hotel Bitácora contacte con Antonio González; en Hotel Vulcano contacte con Giacomo Longo o el segundo chef de turno.',
        screenLocation: 'Ficha del Chef en la cabecera'
      },
      {
        stepNumber: 3,
        title: 'Introducción del PIN de supervisión',
        instruction: 'El responsable acudirá al terminal, pulsará el candado, ingresará el PIN 5678 y aplicará la modificación requerida.',
        screenLocation: 'Teclado PIN'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'Un cocinero de pastelería quiere modificar el tiempo de horneado de una tarta en la ficha técnica oficial.',
      resolution: 'Llama al Chef Giacomo Longo, quien valida el cambio de 35 a 40 minutos con su PIN de Jefe y guarda la revisión 1.1.'
    },
    resultadoEsperado: {
      screenState: 'La ficha queda editada con la firma del chef que autorizó la variación técnica.',
      systemEffect: 'Se mantiene la cadena de custodia de las elaboraciones culinarias.',
      auditRecord: 'Modificación autorizada por responsable de departamento.'
    },
    erroresEvitar: [
      {
        mistake: 'Intentar adivinar códigos PIN de forma repetida.',
        consequence: 'El sistema puede bloquear temporalmente el acceso por seguridad.',
        recommendation: 'Solicitar siempre la presencia física del responsable de turno.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 2
  {
    id: 'art-2-3-consulta-menus-publicados',
    chapterId: 'capitulo_2_gestion_menus',
    order: 3,
    title: 'Cómo consultar los menús publicados en pantallas y tablets de pase',
    subtitle: 'Navegación quincenal por días (1 al 15), visor Excel integrado y filtros de alérgenos.',
    slug: 'consulta-menus-publicados-visor-excel',
    targetRoles: ['todos', 'operario', 'jefe'],
    badge: 'Pase de Servicio',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['consulta', 'menu', '15 dias', 'almuerzo', 'cena', 'visor excel'],
    sectionPath: 'Hotel > Ruedas & Recetas > Selector de Días',
    paraQueSirve:
      'Permite a cualquier cocinero, camarero de buffet o maître consultar en tiempo real qué preparaciones exactas corresponden al día y servicio actual, con su ficha técnica asociada y desglose de alérgenos.',
    quienPuedeHacerlo: {
      role: 'Todo el personal operativo del hotel',
      pinRequired: 'Acceso directo de lectura sin PIN'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Entrar a Ruedas & Recetas',
        instruction: 'Desde el panel del hotel, pulse en «Ruedas & Recetas» o en los botones directos de «Rueda 1» o «Rueda 2».',
        screenLocation: 'Cabecera de navegación'
      },
      {
        stepNumber: 2,
        title: 'Seleccionar el día del ciclo quincenal',
        instruction: 'Pulse en cualquiera de los botones numerados del 1 al 15 (ej. «Día 07»). La pantalla cargará al instante las elaboraciones de Desayuno, Almuerzo y Cena.',
        screenLocation: 'Barra horizontal de 15 días'
      },
      {
        stepNumber: 3,
        title: 'Abrir el Visor de Excel en línea',
        instruction: 'Si desea ver el documento original con sus tablas completas, pulse «Ver en Visor de Excel». Podrá navegar entre hojas sin salir de la app.',
        screenLocation: 'Botonera del menú',
        highlightButton: 'Ver en Visor de Excel'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'El jefe de partida fría llega al servicio del Día 12 y necesita saber cuántas ensaladas compuestas debe montar para el almuerzo.',
      resolution: 'Pulsa «Día 12» en la tablet de pase y comprueba al instante los 6 platos fríos correspondientes a ese mediodía.'
    },
    resultadoEsperado: {
      screenState: 'La lista de platos del Día 12 se muestra con iconos de alérgenos y enlace a ficha técnica.',
      systemEffect: 'No altera ningún dato de la base de datos.',
      auditRecord: 'Consulta de menú registrada en métricas de uso de la partida.'
    },
    erroresEvitar: [
      {
        mistake: 'Consultar una rueda que no corresponde al ciclo en vigor (ej. Rueda 2 en vez de Rueda 1).',
        consequence: 'Preparar platos equivocados que no coinciden con la cartelería del buffet.',
        recommendation: 'Comprobar siempre la fecha y la rueda activa señalada en la parte superior.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 3
  {
    id: 'art-3-3-sustituir-eliminar-documentos',
    chapterId: 'capitulo_3_gestion_documentos',
    order: 3,
    title: 'Cómo sustituir un documento existente o dar de baja documentos obsoletos',
    subtitle: 'Protocolo de actualización sin rotura de enlaces ni pérdida de histórico legal.',
    slug: 'sustituir-eliminar-documentos-baja-legal',
    targetRoles: ['jefe', 'admin'],
    badge: 'Mantenimiento',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['sustituir', 'eliminar', 'documentos', 'baja', 'archivo'],
    sectionPath: 'Hotel > Carpeta Documental > Gestión',
    paraQueSirve:
      'Garantiza que el personal siempre trabaje con la versión vigente de procedimientos, contratos de mantenimiento y protocolos sanitarios, archivando de forma controlada el material antiguo.',
    quienPuedeHacerlo: {
      role: 'Responsables de departamento y Dirección',
      pinRequired: 'PIN de Jefe (5678)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Localizar el documento a actualizar',
        instruction: 'En la Carpeta Documental o biblioteca de fichas, pulse en la opción «Opciones de Documento».',
        screenLocation: 'Fila del documento'
      },
      {
        stepNumber: 2,
        title: 'Seleccionar «Sustituir Documento»',
        instruction: 'Adjunte el nuevo archivo revisado. Indique el motivo del cambio (ej. «Nuevo proveedor de desinfectante»).',
        screenLocation: 'Modal de sustitución',
        highlightButton: 'Subir Nueva Versión'
      },
      {
        stepNumber: 3,
        title: 'Confirmación y archivo automático',
        instruction: 'El documento sustituido se archivará automáticamente en el historial con fecha y hora de baja.',
        screenLocation: 'Expediente histórico'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'Se renueva la homologación del desincrustante de lavavajillas.',
      resolution: 'El responsable sustituye la ficha de seguridad antigua por la nueva. Todos los enlaces de la app se redirigen al nuevo archivo sin errores 404.'
    },
    resultadoEsperado: {
      screenState: 'La versión v2.0 se muestra como activa y la v1.0 figura en el histórico.',
      systemEffect: 'Sustitución atómica sin caída de servicio.',
      auditRecord: 'Revisión documental validada con firma de supervisor.'
    },
    erroresEvitar: [
      {
        mistake: 'Eliminar un documento en lugar de sustituirlo cuando está enlazado a una checklist diaria.',
        consequence: 'El operario verá un botón roto cuando intente consultar la ficha de la máquina.',
        recommendation: 'Usar siempre «Sustituir Documento» para mantener intacto el ID interno.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 4
  {
    id: 'art-4-2-cambio-departamento-roles',
    chapterId: 'capitulo_4_gestion_operarios',
    order: 2,
    title: 'Cómo reasignar operarios entre departamentos y turnos de trabajo',
    subtitle: 'Movilidad interna entre cocina, buffet, bares y turnos Mañana/Noche.',
    slug: 'reasignar-operarios-departamentos-turnos',
    targetRoles: ['jefe', 'admin'],
    badge: 'Rotación',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['personal', 'turnos', 'reasignacion', 'rotacion', 'cocina'],
    sectionPath: 'Modo Jefe > Gestión de Personal > Modificar Operario',
    paraQueSirve:
      'Facilita la reasignación de cocineros cuando un trabajador rota de la partida de desayunos a la partida caliente o refuerza el servicio de cenas en otro departamento.',
    quienPuedeHacerlo: {
      role: 'Chef Ejecutivo o Segundo de Cocina',
      pinRequired: 'PIN de Jefe (5678)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Localizar la ficha del trabajador',
        instruction: 'Dentro del panel de gestión de equipo, localice al operario y pulse el botón «Editar».',
        screenLocation: 'Tabla de operarios activos'
      },
      {
        stepNumber: 2,
        title: 'Modificar el turno o departamento',
        instruction: 'Cambie el departamento asignado (ej. de «Cocina» a «Bares») o el turno predeterminado (de «Mañana» a «Noche»).',
        screenLocation: 'Formulario de edición'
      },
      {
        stepNumber: 3,
        title: 'Guardar y verificar en partida',
        instruction: 'Pulse «Guardar Cambios». Al abrir la partida receptora, el nombre del operario figurará en el desplegable de firmas.',
        screenLocation: 'Pie del modal'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'Un cocinero de partida fría pasa a cubrir vacaciones en la partida caliente durante 15 días.',
      resolution: 'El Chef modifica su asignación temporalmente en el panel. El operario firma a partir de ese momento las fichas de caliente sin crear un usuario duplicado.'
    },
    resultadoEsperado: {
      screenState: 'La lista de trabajadores refleja el nuevo puesto y turno.',
      systemEffect: 'Las listas desplegables de checklists se actualizan en tiempo real.',
      auditRecord: 'Modificación de adscripción de operario registrada.'
    },
    erroresEvitar: [
      {
        mistake: 'Crear un usuario nuevo cada vez que un cocinero cambia de partida.',
        consequence: 'Plantilla duplicada y reportes de auditoría divididos en dos historiales.',
        recommendation: 'Reasignar siempre la ficha de operario existente.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 5
  {
    id: 'art-5-2-crear-modificar-departamentos-areas',
    chapterId: 'capitulo_5_categorias_departamentos_areas',
    order: 2,
    title: 'Cómo configurar tolerancias, horarios y responsabilidades de cada área',
    subtitle: 'Edición de maquinaria crítica, rangos térmicos y actividades de turno.',
    slug: 'configurar-tolerancias-horarios-responsabilidades-area',
    targetRoles: ['jefe', 'admin'],
    badge: 'Operativa',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['tolerancias', 'horarios', 'maquinaria', 'partidas', 'responsabilidades'],
    sectionPath: 'Partida > Botón «Editar Actividades y Roles»',
    paraQueSirve:
      'Ajusta las especificaciones de una partida a la realidad del hotel (ej. hora límite de montaje del buffet de mañana a las 07:15 en vez de las 07:30).',
    quienPuedeHacerlo: {
      role: 'Chefs Ejecutivos (Antonio González / Giacomo Longo) y Consultoría F&B',
      pinRequired: 'PIN de Jefe (5678) o Admin (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Entrar a la partida que requiere ajustes',
        instruction: 'Seleccione el hotel y la casilla correspondiente (ej. Partida 04: Partida Caliente de Mañana).',
        screenLocation: 'Cuadrícula de casillas'
      },
      {
        stepNumber: 2,
        title: 'Abrir el modal de edición de actividades',
        instruction: 'Con el Modo Jefe activo, pulse el botón «Editar Actividades y Roles».',
        screenLocation: 'Cabecera de la partida',
        highlightButton: 'Editar Actividades y Roles'
      },
      {
        stepNumber: 3,
        title: 'Modificar horario o descripción',
        instruction: 'Edite la franja horaria del turno, las tareas obligatorias o el equipamiento crítico asignado.',
        screenLocation: 'Formulario de edición técnica'
      },
      {
        stepNumber: 4,
        title: 'Guardar y propagar',
        instruction: 'Pulse «Guardar Cambios». La checklist de la tablet se actualizará en el acto.',
        screenLocation: 'Pie del modal'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'Se instala un nuevo horno de convección Rational en la partida caliente.',
      resolution: 'El Chef Giacomo Longo añade el horno al listado de equipamiento crítico y define su temperatura de trabajo habitual en la checklist.'
    },
    resultadoEsperado: {
      screenState: 'La partida muestra el nuevo equipo con sus tolerancias técnicas.',
      systemEffect: 'Se crea el sensor lógico para registros térmicos en la pestaña de Temperaturas.',
      auditRecord: 'Equipamiento crítico y actividades actualizadas por Giacomo Longo.'
    },
    erroresEvitar: [
      {
        mistake: 'Fijar tolerancias térmicas menos restrictivas que las exigidas por el Real Decreto de APPCC.',
        consequence: 'Incumplimiento normativo sancionable por Sanidad.',
        recommendation: 'Consultar siempre los límites legales antes de modificar una tolerancia.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 6
  {
    id: 'art-6-3-registro-limpiezas-ld-caducidades',
    chapterId: 'capitulo_6_checklists_controles',
    order: 3,
    title: 'Cómo registrar el plan de limpieza L+D y control de caducidades secundarias',
    subtitle: 'Superficies de corte, trenes de lavado, descongelación y etiquetado secundario.',
    slug: 'registro-plan-limpieza-ld-caducidades-secundarias',
    targetRoles: ['todos', 'operario', 'jefe'],
    badge: 'Higiene & APPCC',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['limpieza', 'plan ld', 'desinfeccion', 'caducidad', 'etiquetado'],
    sectionPath: 'Partida > Pestañas «Limpieza L+D» y «Caducidades»',
    paraQueSirve:
      'Asegura la trazabilidad de desinfección química de las instalaciones y el control estricto de la fecha límite de consumo de productos abiertos o elaborados internamente.',
    quienPuedeHacerlo: {
      role: 'Todo cocinero de partida, marmitón y supervisor',
      pinRequired: 'Acceso directo de registro'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Registro de Limpieza L+D',
        instruction: 'Entre en la pestaña «Limpieza L+D». Seleccione la tarea ejecutada (ej. «Desinfección de tablas de corte») y pulse «Registrar Limpieza». El sistema firmará con el operario y hora.',
        screenLocation: 'Pestaña Limpieza L+D',
        highlightButton: 'Registrar Limpieza'
      },
      {
        stepNumber: 2,
        title: 'Registro de Caducidad Secundaria',
        instruction: 'En la pestaña «Caducidades», registre el producto abierto (ej. «Salsa tártara elaborada»), la fecha y hora de apertura y la cámara donde queda almacenado.',
        screenLocation: 'Pestaña Caducidades',
        highlightButton: 'Registrar Caducidad Secundaria'
      },
      {
        stepNumber: 3,
        title: 'Verificar alertas de caducidad',
        instruction: 'El sistema calculará automáticamente las horas de vida útil (máx. 48h o 72h según producto) y avisará en rojo si un lote ha caducado.',
        screenLocation: 'Semáforo de caducidades'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'Al cierre del turno de tarde, el cocinero guarda 4 litros de mayonesa casera pasteurizada.',
      resolution: 'Registra la caducidad secundaria en la app. La tablet le indica que la fecha límite es a las 48h y queda etiquetada digitalmente en la cámara 2.'
    },
    resultadoEsperado: {
      screenState: 'La tarea de limpieza se tiñe de verde con fecha y operador; el producto figura en la lista de lotes activos.',
      systemEffect: 'Alimentación automática del historial de auditoría de la partida.',
      auditRecord: 'Limpieza y lote sanitario sellado con firma digital.'
    },
    erroresEvitar: [
      {
        mistake: 'Guardar elaboraciones en cámaras sin registrar su caducidad secundaria.',
        consequence: 'Desecho preventivo obligatorio en inspección por falta de trazabilidad.',
        recommendation: 'Registrar la caducidad en la tablet al mismo tiempo que se coloca la etiqueta física.'
      }
    ]
  },
  {
    id: 'art-6-4-control-firma-mensual-epis',
    chapterId: 'capitulo_6_checklists_controles',
    order: 4,
    title: 'Cómo realizar la firma mensual de control de EPIs (Equipos de Protección Individual)',
    subtitle: 'Verificación de marcado CE, garantía en vigor y reposición periódica por cocina y departamento.',
    slug: 'control-firma-mensual-epis-garantia-reposicion',
    targetRoles: ['todos', 'operario', 'jefe', 'admin'],
    badge: 'PRL & APPCC',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['epis', 'seguridad', 'prl', 'appcc', 'firma mensual', 'garantia', 'reposicion', 'guantes malla', 'calzado'],
    sectionPath: 'Cocina > «Control EPIs (APPCC)» o Partida > Pestaña «Control EPIs (Mensual)»',
    quickButtons: [
      { label: 'Control EPIs (APPCC)', hint: 'Pestaña en la barra superior del hotel' },
      { label: 'Firmar Control Mensual', hint: 'Botón dorado para abrir el panel de firma y garantía' }
    ],
    paraQueSirve:
      'Cumple la exigencia legal y sanitaria de verificar todos los meses que los equipos de protección individual (guantes de malla de acero inoxidable, guantes térmicos de horno, calzado antideslizante con puntera, pantallas contra salpicaduras químicas y mallas capilares) están en periodo de garantía técnica del fabricante, en perfecto estado mecánico o si requieren reposición urgente a Compras.',
    quienPuedeHacerlo: {
      role: 'Chef Ejecutivo, Segundo de Cocina, Jefe de Partida o Auditor de Calidad/PRL',
      pinRequired: 'Acceso directo de consulta y firma para personal autorizado'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Acceder al módulo de Control de EPIs',
        instruction:
          'Desde la vista de Cocina del Hotel (Bitácora o Vulcano), pulse en la pestaña superior «Control EPIs (APPCC)», o entre en cualquier departamento operativo y seleccione la pestaña «Control EPIs (Mensual)».',
        tip: 'Cada cocina dispone de su propio libro oficial independiente de control mensual.'
      },
      {
        stepNumber: 2,
        title: 'Pulsar en «Firmar Control Mensual»',
        instruction:
          'Haga clic en el botón dorado «Firmar Control Mensual» para abrir el formulario oficial de certificación del mes en curso (ej. Noviembre 2026).',
        tip: 'El sistema permite actualizar la firma en cualquier momento si se incorporan nuevos equipos.'
      },
      {
        stepNumber: 3,
        title: 'Verificar cada EPI: En Garantía vs Requiere Reposición',
        instruction:
          'Revise la lista de las 8 familias de EPIs homologados. Marque el botón verde «En Garantía» si el equipo conserva su marcado CE y su integridad, o el botón rojo «Reponer» si presenta desgaste, roturas de malla o quemaduras.',
        tip: 'Si marca algún EPI como «Reponer», se activará automáticamente la casilla de solicitud a Compras.'
      },
      {
        stepNumber: 4,
        title: 'Cumplimentar observaciones y firmar digitalmente',
        instruction:
          'Indique la fecha de inspección y el nombre y cargo del auditor. Realice el trazo de firma en el recuadro digital con el dedo o ratón y confirme la operación.',
        tip: 'El registro quedará sellado con fecha, hora y firma inmutable en el Libro Oficial de EPIs.'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Vulcano',
      scenario: 'Durante la revisión de Noviembre en Cocina Central, Giacomo Longo detecta que los guantes térmicos del horno de repostería tienen quemaduras en la palma.',
      resolution: 'Giacomo marca el ítem como «Reponer», activa la casilla de solicitud a Compras por 2 pares nuevos con norma EN 407 y firma digitalmente el acta mensual.'
    },
    resultadoEsperado: {
      screenState: 'La cabecera muestra el distintivo verde «Firmado y Conforme» con el periodo actual y el acta queda archivada en el histórico inferior.',
      systemEffect: 'Se actualiza el parque de seguridad de la cocina y se deja constancia legal ante inspecciones de Sanidad y Trabajo.',
      auditRecord: 'Acta mensual de EPIs sellada inmutablemente con firma digital trazable.'
    },
    erroresEvitar: [
      {
        mistake: 'Firmar el mes como conforme teniendo guantes de malla o térmicos rotos sin solicitar recambio.',
        consequence: 'Riesgo grave de accidente laboral por corte o quemadura y responsabilidad legal directa.',
        recommendation: 'Marcar siempre «Reponer» y detallar las unidades a sustituir en el campo de observaciones técnicas.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 7
  {
    id: 'art-7-2-aislamiento-multi-tenant-establecimientos',
    chapterId: 'capitulo_7_configuracion_administracion',
    order: 2,
    title: 'Aislamiento multi-tenant: cómo hacer cambios sin afectar a otros hoteles',
    subtitle: 'Independencia total entre Hotel Bitácora, Hotel Vulcano y nuevas aperturas.',
    slug: 'aislamiento-multi-tenant-independencia-hoteles',
    targetRoles: ['jefe', 'admin'],
    badge: 'Arquitectura',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['multi-tenant', 'aislamiento', 'seguridad', 'bitacora', 'vulcano', 'hoteles'],
    sectionPath: 'Panel de Administración > Aislamiento de Modelos',
    paraQueSirve:
      'Garantiza que cualquier modificación en las recetas, checklists o personal de Hotel Bitácora nunca modifique, borre ni altere los datos de Hotel Vulcano.',
    quienPuedeHacerlo: {
      role: 'Dirección F&B y Administradores de Sistemas',
      pinRequired: 'PIN de Administrador (9999)'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Comprender el espacio de trabajo activo',
        instruction: 'Cada hotel cuenta con su propio identificador único (`model-bitacora`, `model-vulcano`). Los registros se guardan en particiones de datos independientes.',
        screenLocation: 'Identificador del hotel en barra superior'
      },
      {
        stepNumber: 2,
        title: 'Realizar cambios con seguridad',
        instruction: 'Puede cambiar un chef titular, subir una rueda de 15 días o crear una nueva partida en Bitácora con la certeza absoluta de que Vulcano mantiene su configuración intacta.',
        screenLocation: 'Cualquier pantalla de configuración'
      }
    ],
    ejemploPractico: {
      hotelContext: 'General',
      scenario: 'Hotel Vulcano introduce un nuevo menú degustación exclusivo para su restaurante gourmet.',
      resolution: 'Se sube en el panel de Vulcano. Hotel Bitácora sigue operando con su menú buffet tradicional sin verse afectado.'
    },
    resultadoEsperado: {
      screenState: 'Los cambios solo se reflejan en el hotel seleccionado.',
      systemEffect: 'Particionado estricto de claves de almacenamiento.',
      auditRecord: 'Registro de operación acotado al tenant del hotel.'
    },
    erroresEvitar: [
      {
        mistake: 'Olvidar comprobar qué hotel está activo antes de subir un menú quincenal.',
        consequence: 'Cargar la rueda de Vulcano en el perfil de Bitácora.',
        recommendation: 'Revisar siempre el nombre del hotel en la barra superior antes de pulsar guardar.'
      }
    ]
  },

  // ARTÍCULO COMPLEMENTARIO CAPÍTULO 8
  {
    id: 'art-8-3-faq-documento-equivocado-errores-pase',
    chapterId: 'capitulo_8_problemas_frecuentes',
    order: 3,
    title: 'FAQ: He subido un archivo equivocado o hay una incidencia urgente en el pase',
    subtitle: 'Protocolo de contingencia para corregir documentos erróneos y reportar paradas.',
    slug: 'faq-archivo-equivocado-incidencias-pase',
    targetRoles: ['todos', 'operario', 'jefe'],
    badge: 'Contingencia',
    published: true,
    updatedAt: '2026-11-01',
    author: 'Dirección Operativa F&B',
    tags: ['faq', 'incidencia', 'error', 'documento equivocado', 'parada de servicio'],
    sectionPath: 'Partida > Botón «Reportar Incidencia»',
    quickButtons: [
      { label: 'Reportar Incidencia', hint: 'Botón amarillo en cabecera de partida' }
    ],
    paraQueSirve:
      'Ofrece una vía de actuación inmediata cuando se comete un error en la carga documental o surge una avería crítica durante el servicio de comidas (ej. fallo de campana extractora).',
    quienPuedeHacerlo: {
      role: 'Todo el personal operativo puede reportar incidencias; Jefes pueden sustituir documentos',
      pinRequired: 'Reporte: Libre | Reemplazo documental: PIN 5678'
    },
    pasoAPaso: [
      {
        stepNumber: 1,
        title: 'Si subió un documento o rueda de menú equivocada',
        instruction: 'No intente borrar la base de datos: vuelva a la pantalla de Ruedas de Menú, pulse «Sustituir Rueda» y cargue el archivo correcto. La versión equivocada quedará sobreescrita en la vista activa.',
        screenLocation: 'Módulo de Ruedas de Menú',
        highlightButton: 'Sustituir Rueda'
      },
      {
        stepNumber: 2,
        title: 'Si ocurre una avería o parada urgente en cocina',
        instruction: 'Pulse el botón amarillo «Reportar Incidencia» en la parte superior de la partida. Indique el tipo de fallo (Maquinaria, Suministros, Alérgenos o Temperatura) y describa brevemente la urgencia.',
        screenLocation: 'Cabecera de la partida',
        highlightButton: 'Reportar Incidencia'
      },
      {
        stepNumber: 3,
        title: 'Seguimiento y cierre de la incidencia',
        instruction: 'La incidencia aparecerá destacada en el panel de control del Jefe de Cocina y de Mantenimiento hasta que se registre la acción correctora.',
        screenLocation: 'Pestaña Incidencias'
      }
    ],
    ejemploPractico: {
      hotelContext: 'Hotel Bitácora',
      scenario: 'A las 13:45 en pleno pase de almuerzo se bloquea la plancha principal de la Partida 07.',
      resolution: 'El cocinero pulsa «Reportar Incidencia», marca «Maquinaria» y describe «Disyuntor de plancha saltado». El aviso llega al instante a Mantenimiento y queda justificada la demora operativa.'
    },
    resultadoEsperado: {
      screenState: 'La partida muestra aviso de incidencia activa en amarillo.',
      systemEffect: 'Notificación registrada con hora y operador.',
      auditRecord: 'Parte de incidencia operativa legal registrado en el sistema.'
    },
    erroresEvitar: [
      {
        mistake: 'Silenciar una avería sin reportarla en la aplicación para «no molestar».',
        consequence: 'Sin trazabilidad, la dirección no puede justificar demoras ni reclamar al servicio técnico.',
        recommendation: 'Reportar cualquier incidencia que afecte a la fluidez o seguridad del servicio.'
      }
    ]
  }
];

const LOCAL_STORAGE_MANUAL_KEY = 'proa_user_manual_articles_v1';

export class UserManualService {
  private getStoredArticles(): ManualArticle[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_MANUAL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored user manual articles:', e);
    }
    return CANONICAL_MANUAL_ARTICLES;
  }

  private saveStoredArticles(articles: ManualArticle[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_MANUAL_KEY, JSON.stringify(articles));
      window.dispatchEvent(new CustomEvent('proa_manual_updated'));
    } catch (e) {
      console.error('Error saving user manual articles:', e);
    }
  }

  public getChapters(): ManualChapterMeta[] {
    return MANUAL_CHAPTERS_META;
  }

  public getArticles(): ManualArticle[] {
    return this.getStoredArticles();
  }

  public getArticlesByChapter(chapterId: ManualChapterId): ManualArticle[] {
    const all = this.getStoredArticles();
    return all
      .filter(a => a.chapterId === chapterId && a.published)
      .sort((a, b) => a.order - b.order);
  }

  public getArticleById(id: string): ManualArticle | null {
    const all = this.getStoredArticles();
    return all.find(a => a.id === id) || null;
  }

  public searchArticles(
    query: string,
    roleFilter: UserRoleTarget = 'todos',
    chapterFilter: ManualChapterId | 'todos' = 'todos'
  ): ManualArticle[] {
    const all = this.getStoredArticles();
    const cleanQuery = query.trim().toLowerCase();

    return all.filter(article => {
      if (!article.published) return false;

      // Filtro por capítulo
      if (chapterFilter !== 'todos' && article.chapterId !== chapterFilter) {
        return false;
      }

      // Filtro por rol
      if (roleFilter !== 'todos') {
        const matchesRole =
          article.targetRoles.includes('todos') ||
          article.targetRoles.includes(roleFilter);
        if (!matchesRole) return false;
      }

      // Si no hay texto de búsqueda, pasa el filtro
      if (!cleanQuery) return true;

      // Búsqueda en título, subtítulo, tags, para qué sirve, errores y pasos
      const titleMatch = article.title.toLowerCase().includes(cleanQuery);
      const subtitleMatch = article.subtitle.toLowerCase().includes(cleanQuery);
      const tagsMatch = article.tags.some(t => t.toLowerCase().includes(cleanQuery));
      const purposeMatch = article.paraQueSirve.toLowerCase().includes(cleanQuery);
      const stepsMatch = article.pasoAPaso.some(
        s => s.title.toLowerCase().includes(cleanQuery) || s.instruction.toLowerCase().includes(cleanQuery)
      );
      const mistakesMatch = article.erroresEvitar.some(
        e => e.mistake.toLowerCase().includes(cleanQuery) || e.recommendation.toLowerCase().includes(cleanQuery)
      );
      const exampleMatch =
        article.ejemploPractico.scenario.toLowerCase().includes(cleanQuery) ||
        article.ejemploPractico.resolution.toLowerCase().includes(cleanQuery);

      return (
        titleMatch ||
        subtitleMatch ||
        tagsMatch ||
        purposeMatch ||
        stepsMatch ||
        mistakesMatch ||
        exampleMatch
      );
    });
  }

  public saveArticle(article: ManualArticle): void {
    const articles = this.getStoredArticles();
    const existingIndex = articles.findIndex(a => a.id === article.id);

    if (existingIndex >= 0) {
      articles[existingIndex] = {
        ...article,
        updatedAt: new Date().toISOString().slice(0, 10),
        isUpdated: true
      };
    } else {
      articles.push({
        ...article,
        updatedAt: new Date().toISOString().slice(0, 10),
        isNew: true
      });
    }

    this.saveStoredArticles(articles);
  }

  public deleteArticle(id: string): void {
    const articles = this.getStoredArticles();
    const filtered = articles.filter(a => a.id !== id);
    this.saveStoredArticles(filtered);
  }

  public togglePublish(id: string): void {
    const articles = this.getStoredArticles();
    const item = articles.find(a => a.id === id);
    if (item) {
      item.published = !item.published;
      this.saveStoredArticles(articles);
    }
  }

  public resetToCanonical(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_MANUAL_KEY);
      window.dispatchEvent(new CustomEvent('proa_manual_updated'));
    } catch {}
  }
}

export const userManualService = new UserManualService();
