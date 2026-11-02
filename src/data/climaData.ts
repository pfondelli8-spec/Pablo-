import { CourseModule, FoodItem, MonthPhenology, GlossaryTerm } from '../types/clima';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    code: 'MOD-01',
    title: 'Climatología y Ciclos Vitales de la Alimentación',
    subtitle: 'La radiación solar, la atmósfera y el ciclo hidrológico en la génesis del alimento',
    level: 'Introductorio',
    estimatedHours: 4,
    description: 'Comprende cómo los elementos climáticos fundamentales (radiación fotosintéticamente activa, temperatura, régimen pluviométrico y humedad relativa) determinan la biosíntesis de carbohidratos, proteínas y fitoquímicos que sustentan la vida en el planeta.',
    iconName: 'Sun',
    badgeName: 'Especialista en Climatología de los Alimentos',
    lessons: [
      {
        id: 'les-1-1',
        title: 'La Radiación Solar y la Fotosíntesis como Motor Vital',
        durationMinutes: 12,
        readingSnippet: 'Toda la energía que ingresa en la cadena trófica proviene de la conversión de fotones solares en enlaces químicos mediante los pigmentos vegetales.',
        sections: [
          {
            heading: 'La Fracción RFA (Radiación Fotosintéticamente Activa)',
            body: 'Las plantas absorben fotones principalmente en las longitudes de onda del azul (430-450 nm) y del rojo (640-660 nm). Esta energía lumínica hidroliza moléculas de agua liberando oxígeno a la atmósfera y fijando dióxido de carbono atmosférico en glucosa y polisacáridos complejos.',
            keyTakeaway: 'Sin el gradiente de radiación solar estacional, no existirían los picos de acumulación de azúcares y antioxidantes que modulan el valor biológico de los frutos.'
          },
          {
            heading: 'El Albedo Terrestre y la Cobertura Vegetal',
            body: 'Un suelo cubierto de cultivos perennes y policultivos refleja entre un 18% y un 25% de la radiación incidente (albedo moderado), reduciendo la temperatura del suelo y evitando la evaporación catastrófica del agua subterránea. Los monocultivos secos o suelos desnudos absorben calor excesivo, alterando el microclima local.',
            keyTakeaway: 'La alimentación basada en agricultura con cobertura viva protege el ciclo térmico de la tierra.'
          }
        ],
        practicalTip: 'Consume alimentos de maduración solar directa y cultivo al aire libre: concentran hasta un 40% más de polifenoles protectores que los cultivados con luz forzada en sustrato inerte.'
      },
      {
        id: 'les-1-2',
        title: 'El Ciclo del Agua: Agua Verde, Azul y Gris en la Mesa',
        durationMinutes: 15,
        readingSnippet: 'El agua no solo riega la tierra: forma parte intrínseca de la biomasa y de la resiliencia climática de cada región.',
        sections: [
          {
            heading: 'Diferenciación Científica de las Huellas Hídricas',
            body: 'El profesor Arjen Hoekstra clasificó el agua consumida en tres flujos: Agua Verde (lluvia natural almacenada en el suelo y transpirada por los cultivos), Agua Azul (aguas superficiales y subterráneas extraídas para riego artificial) y Agua Gris (volumen de agua pura necesario para diluir los contaminantes generados en el proceso agrícola).',
            keyTakeaway: 'Los cultivos de secano y leguminosas adaptadas al clima local consumen casi un 90% de agua verde, protegiendo los acuíferos subterráneos.'
          },
          {
            heading: 'Impacto en la Disponibilidad Hídrica Global',
            body: 'La agricultura consume el 70% del agua dulce extraída en el mundo. Alimentos de ganadería intensiva estabulada demandan hasta 15.000 litros de agua por kilogramo de carne, mientras que legumbres como las lentejas o los garbanzos requieren apenas 3.000 a 4.000 litros, en su inmensa mayoría agua verde de lluvia.',
            keyTakeaway: 'Elegir proteínas vegetales de secano alivia directamente el estrés hídrico de las cuencas fluviales.'
          }
        ],
        practicalTip: 'Verifica la procedencia de tus legumbres y cereales: prioriza los procedentes de secano tradicional o regadío deficitario controlado.'
      },
      {
        id: 'les-1-3',
        title: 'El Ciclo del Carbono y el Suelo Vivo',
        durationMinutes: 14,
        readingSnippet: 'El suelo agrícola fértil es el mayor sumidero terrestre de carbono orgánico; la alimentación regenerativa devuelve el carbono al suelo.',
        sections: [
          {
            heading: 'La Materia Orgánica y la Red Trófica del Suelo',
            body: 'Por cada 1% de aumento de materia orgánica en la capa arable, el suelo puede retener más de 150.000 litros de agua por hectárea. Hongos micorrícicos y bacterias fijadoras transportan minerales hacia la planta a cambio de azúcares fotosintetizados, enriqueciendo los alimentos en magnesio, zinc y hierro.',
            keyTakeaway: 'Un alimento de suelo vivo es más denso nutricionalmente y ha capturado CO2 atmosférico durante su crecimiento.'
          }
        ],
        practicalTip: 'Elige alimentos con certificación agroecológica o de fincas con manejo del suelo sin volteo agresivo.'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: '¿Qué tipo de agua representa la precipitación pluvial almacenada en el suelo y transpirada naturalmente por las plantas?',
        options: ['Agua Azul', 'Agua Verde', 'Agua Gris', 'Agua Fósil'],
        correctOptionIndex: 1,
        explanation: 'El Agua Verde es el volumen de agua de lluvia almacenada en la humedad del suelo que es absorbida por la vegetación sin requerir bombeo ni canalización.'
      },
      {
        id: 'q1-2',
        question: '¿Cuál es la longitud de onda principal que las plantas absorben preferentemente para la fotosíntesis?',
        options: ['Rayos X y gamma', 'Espectro verde puro (520-560 nm)', 'Bandas azul (430-450 nm) y roja (640-660 nm)', 'Infrarrojo lejano'],
        correctOptionIndex: 2,
        explanation: 'Las clorofilas a y b absorben con máxima eficiencia en las bandas azul y roja, reflejando gran parte del espectro verde.'
      },
      {
        id: 'q1-3',
        question: '¿Por qué un incremento de materia orgánica en el suelo beneficia tanto al clima como a la alimentación?',
        options: [
          'Porque destruye las bacterias y permite usar más pesticidas',
          'Porque secuestra carbono atmosférico en el humus y multiplica la retención de agua y micronutrientes',
          'Porque hace que los cultivos crezcan sin necesidad de luz solar',
          'Porque convierte el suelo en arena de drenaje ultra rápido'
        ],
        correctOptionIndex: 1,
        explanation: 'La materia orgánica secuestra carbono de forma estable en el suelo e incrementa drásticamente la capacidad de campo para retener agua y minerales biodisponibles.'
      }
    ]
  },
  {
    id: 'mod-2',
    code: 'MOD-02',
    title: 'Zonas Bioclimáticas y la Despensa Terrestre',
    subtitle: 'Qué produce cada clima en el planeta y cómo optimizar la dieta bioclimática',
    level: 'Intermedio',
    estimatedHours: 5,
    description: 'Explora las principales franjas bioclimáticas de la Tierra: el ecosistema mediterráneo, los climas templado-oceánicos, las zonas subtropicales y las áreas áridas. Aprende qué alimentos evolucionaron naturalmente en cada contexto para ofrecer máxima vitalidad.',
    iconName: 'Globe',
    badgeName: 'Auditor de Despensas Bioclimáticas',
    lessons: [
      {
        id: 'les-2-1',
        title: 'El Bioma Mediterráneo: Olivo, Vid, Legumbres y Granos',
        durationMinutes: 16,
        readingSnippet: 'Veranos cálidos y secos con inviernos suaves y lluvias moderadas moldearon una de las dietas más saludables y resilientes de la historia humana.',
        sections: [
          {
            heading: 'La Tríada Mediterránea y sus Adaptaciones Xerófilas',
            body: 'El olivo (Olea europaea) desarrolla hojas coriáceas con estomas protegidos que toleran meses de estrés hídrico mientras sintetizan ácido oleico y polifenoles como el hidroxitirosol. El trigo duro ancestral (Triticum durum) y las legumbres fijadoras (garbanzos, habas) aprovechan las lluvias de primavera para madurar granos densos en proteína vegetal.',
            keyTakeaway: 'Los alimentos nativos mediterráneos han evolucionado durante milenios para no depender de riegos masivos artificiales.'
          }
        ],
        practicalTip: 'Basa tu despensa en grasas monoinsaturadas vírgenes de proximidad, cereales integrales de secano y leguminosas autóctonas.'
      },
      {
        id: 'les-2-2',
        title: 'Zonas Templadas y Continentales: Raíces, Coles y Bayas',
        durationMinutes: 14,
        readingSnippet: 'En climas con inviernos rigurosos, las plantas desarrollan mecanismos de resistencia a heladas acumulando azúcares crioprotectores y fitoquímicos azufrados.',
        sections: [
          {
            heading: 'La Familia Brassicaceae y los Tubérculos de Reserva',
            body: 'Coles, rábanos, nabos y zanahorias transforman las bajas temperaturas en dulzor natural: ante el frío, hidrolizan almidones en azúcares simples que bajan el punto de congelación celular. Al mismo tiempo, concentran glucosinolatos protectores con potente acción antioxidante para el ser humano en época invernal.',
            keyTakeaway: 'El frío invernal potencia el sabor y la densidad inmunomoduladora de las crucíferas y raíces de temporada.'
          }
        ],
        practicalTip: 'Durante los meses fríos, incorpora a diario crucíferas al vapor o fermentadas (chucrut) para apoyar las defensas de temporada.'
      },
      {
        id: 'les-2-3',
        title: 'Zonas Áridas y Subtropicales: Resiliencia del Mijo, Sorgo y Nopal',
        durationMinutes: 15,
        readingSnippet: 'Las plantas C4 y CAM han desarrollado rutas metabólicas que fijan carbono con una fracción mínima de consumo de agua.',
        sections: [
          {
            heading: 'Metabolismo Fotosintético Avanzado (C4 y CAM)',
            body: 'El mijo, el sorgo y el amaranto utilizan fotosíntesis C4, que evita la fotorrespiración en climas cálidos y maximiza la producción de biomasa con un tercio del agua requerida por el arroz convencional o el maíz industrial. Cactáceas como el nopal abren sus estomas de noche (fotosíntesis CAM), perdiendo cero humedad durante el día.',
            keyTakeaway: 'Los granos C4 son la clave de la soberanía alimentaria frente a olas de calor y sequías recurrentes.'
          }
        ],
        practicalTip: 'Introduce mijo dorado y sorgo en sopas y guisos: aportan hierro, silicio y una huella hídrica hasta un 65% inferior al arroz.'
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: '¿Por qué las coles y crucíferas resultan más dulces y nutritivas tras las primeras heladas invernales en zonas templadas?',
        options: [
          'Porque se les inyecta azúcar artificialmente',
          'Porque la planta convierte almidones en azúcares libres para actuar como anticongelante celular natural',
          'Porque la falta de luz destruye todas sus vitaminas',
          'Porque las heladas impiden la respiración celular'
        ],
        correctOptionIndex: 1,
        explanation: 'Es una adaptación biológica: los azúcares solubles disminuyen el punto de congelación del agua en las células de la planta, aumentando su dulzor y riqueza nutricional.'
      },
      {
        id: 'q2-2',
        question: '¿Qué ventaja climática fundamental presentan cereales ancestrales como el mijo y el sorgo frente al trigo y arroz convencionales?',
        options: [
          'Poseen fotosíntesis C4, que fija carbono eficientemente con una mínima transpiración de agua en climas secos',
          'Crecen mejor en el fondo del mar',
          'Tienen cero carbohidratos',
          'No requieren tierra fértil ni sol'
        ],
        correctOptionIndex: 0,
        explanation: 'La vía fotosintética C4 concentra CO2 alrededor de la enzima RuBisCO, permitiendo mantener los estomas cerrados y ahorrar grandes cantidades de agua.'
      }
    ]
  },
  {
    id: 'mod-3',
    code: 'MOD-03',
    title: 'Huella Bioclimática de los Grupos de Alimentos',
    subtitle: 'Midiendo carbono, agua, nitrógeno y suelo de la tierra a la mesa',
    level: 'Avanzado',
    estimatedHours: 6,
    description: 'Aprende la metodología del Análisis de Ciclo de Vida (ACV) aplicada al sistema alimentario según las directrices del IPCC y la comisión EAT-Lancet. Evalúa la huella de cada grupo nutricional y las estrategias de sustitución regenerativa.',
    iconName: 'BarChart3',
    badgeName: 'Certificado en Análisis de Huella Agroalimentaria',
    lessons: [
      {
        id: 'les-3-1',
        title: 'Metodología del Análisis de Ciclo de Vida (ACV)',
        durationMinutes: 18,
        readingSnippet: 'El impacto ambiental no se mide solo en el transporte: más del 70% de las emisiones de los alimentos ocurren en la fase de cultivo y crianza.',
        sections: [
          {
            heading: 'Límites del Sistema: De la Cuna al Plato',
            body: 'El ACV computa emisiones directas de metano entérico (CH4), óxido nitroso (N2O) derivado de fertilizantes químicos sintéticos, dióxido de carbono por mecanización y deforestación, y uso acumulado de suelo por cada kilogramo de proteína útil producida.',
            keyTakeaway: 'Un kilo de carne de vacuno de pasto intensivo estabulado genera hasta 60-99 kg CO2e, mientras que 1 kg de legumbres genera menos de 1-2 kg CO2e.'
          }
        ],
        practicalTip: 'El mayor factor de mitigación climática en tu dieta diaria es el reemplazo de proteína de rumiante estabulado por leguminosas y frutos secos locales.'
      },
      {
        id: 'les-3-2',
        title: 'El Papel Regenerativo de las Leguminosas',
        durationMinutes: 15,
        readingSnippet: 'Las legumbres son la única familia vegetal capaz de enriquecer el suelo con nitrógeno atmosférico sin necesidad de abonos petroquímicos.',
        sections: [
          {
            heading: 'Simbiosis con Bacterias del Género Rhizobium',
            body: 'En los nódulos radiculares de garbanzos, lentejas, habas y judías, las bacterias fijan el N2 del aire atmosférico y lo transforman en iones amonio biológicamente asimilables. Esto reduce a cero la necesidad de fertilizantes de síntesis de la industria Haber-Bosch (altamente intensivos en gas natural y emisores de N2O, un gas con un potencial de calentamiento 273 veces superior al CO2).',
            keyTakeaway: 'Comer legumbres regenera activamente la fertilidad química del suelo agrícola.'
          }
        ],
        practicalTip: 'Consume legumbres entre 4 y 6 veces por semana: es la piedra angular de la dieta de salud planetaria.'
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: '¿Por qué la fijación biológica de nitrógeno en leguminosas es crucial para combatir el cambio climático?',
        options: [
          'Porque evita la necesidad de fertilizantes nitrogenados sintéticos procedentes de gas natural que emiten óxido nitroso (N2O)',
          'Porque las legumbres producen oxígeno líquido subterráneo',
          'Porque elimina por completo el uso de agua en la tierra',
          'Porque las bacterias queman metano en el suelo'
        ],
        correctOptionIndex: 0,
        explanation: 'La síntesis industrial de fertilizantes mediante el proceso Haber-Bosch consume enormes volúmenes de combustibles fósiles, y su exceso en el suelo genera N2O, un gas de efecto invernadero 273 veces más potente que el CO2.'
      },
      {
        id: 'q3-2',
        question: 'Según los datos de EAT-Lancet y Poore & Nemecek, ¿dónde se concentran la inmensa mayoría de las emisiones de gases de efecto invernadero de los alimentos?',
        options: [
          'En el empaquetado de plástico en el supermercado (85%)',
          'En la fase de producción agrícola y ganadera en la granja (más del 70%)',
          'En el transporte en camión refrigerado final (90%)',
          'En la cocción en el hogar del consumidor (60%)'
        ],
        correctOptionIndex: 1,
        explanation: 'La fase de granja (manejo del suelo, fermentación entérica y deforestación para piensos) representa más del 70% de las emisiones globales del sistema alimentario.'
      }
    ]
  },
  {
    id: 'mod-4',
    code: 'MOD-04',
    title: 'Nutrición Bioclimática y Salud en las Etapas Vitales',
    subtitle: 'Sincronización metabólica humana con los ritmos estacionales del planeta',
    level: 'Intermedio',
    estimatedHours: 5,
    description: 'Cómo el organismo humano ajusta su gasto energético basal, hidratación y requerimientos de micronutrientes según las estaciones. Pautas para infancia, adultez activa y personas mayores integrando alimentos estacionales.',
    iconName: 'HeartPulse',
    badgeName: 'Consultor en Nutrición Bioclimática y Vital',
    lessons: [
      {
        id: 'les-4-1',
        title: 'Crononutrición y Termorregulación Estacional',
        durationMinutes: 16,
        readingSnippet: 'El cuerpo humano no demanda los mismos sustratos energéticos bajo 35°C de canícula estival que con heladas a -2°C en invierno.',
        sections: [
          {
            heading: 'Hidratación y Electrolitos en Estío',
            body: 'En verano, las frutas ricas en agua estructurada (melón, sandía, tomate, higos) aportan agua junto a potasio, magnesio y licopeno que protegen el endotelio y la dermis del daño por radiación ultravioleta. En invierno, tubérculos y platos de cuchara con legumbres y crucíferas aportan almidones resistentes y azufre orgánico para la termogénesis y el soporte pulmonar.',
            keyTakeaway: 'La naturaleza provee en cada estación exactamente los metabolitos secundarios que el cuerpo requiere para termorregularse.'
          }
        ],
        practicalTip: 'En verano, prioriza alimentos crudos hidratantes y fermentos ligeros; en invierno, caldos de raíces, legumbres cocidas a fuego lento y fermentos maduros.'
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: '¿Qué ventaja biológica ofrece consumir frutas y hortalizas de temporada de verano ricas en licopeno y betacarotenos durante la canícula?',
        options: [
          'Ayudan a proteger la piel y las células del estrés oxidativo inducido por la alta radiación ultravioleta y facilitan la hidratación celular',
          'Hacen que el cuerpo absorba el 100% de la sal marina',
          'Detienen el metabolismo para que no tengamos calor',
          'Aumentan la grasa corporal para aislarnos del frío'
        ],
        correctOptionIndex: 0,
        explanation: 'Los carotenoides como el licopeno y betacaroteno actúan como antioxidantes que protegen los tejidos del daño por radiación ultravioleta.'
      }
    ]
  },
  {
    id: 'mod-5',
    code: 'MOD-05',
    title: 'Adaptación, Semillas Ancestrales y Resiliencia Climática',
    subtitle: 'Estrategias agroecológicas para garantizar la soberanía de la vida en escenarios de crisis climática',
    level: 'Avanzado',
    estimatedHours: 5,
    description: 'Descubre los bancos comunitarios de semillas tradicionales, los sistemas agrosilvopastoriles, la captura de agua de niebla y los cultivos del futuro que aseguran la alimentación nutritiva en situaciones de sequía y temperaturas extremas.',
    iconName: 'ShieldCheck',
    badgeName: 'Especialista en Resiliencia Agroalimentaria',
    lessons: [
      {
        id: 'les-5-1',
        title: 'Variedades Locales frente a Híbridos Comerciales',
        durationMinutes: 15,
        readingSnippet: 'Las semillas tradicionales atesoran miles de años de adaptación genética a la escasez hídrica y suelos pobres.',
        sections: [
          {
            heading: 'Plasticidad Fenotípica y Resistencia Genética',
            body: 'Los maíces de secano, las lentejas pardinas de páramo o las papas antiguas de montaña cuentan con una diversidad genética que les permite emitir raíces más profundas para alcanzar humedad subterránea en años secos. Los monocultivos híbridos comerciales, por contra, colapsan rápidamente sin riego masivo y agroquímicos externos.',
            keyTakeaway: 'Preservar las variedades tradicionales de semillas es el mayor seguro de vida de la humanidad ante el cambio climático.'
          }
        ],
        practicalTip: 'Apoya a cooperativas de productores locales que recuperan variedades autóctonas de tu comarca o región.'
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: '¿Cuál es la principal ventaja de las variedades locales tradicionales de semillas ante episodios extremos de sequía?',
        options: [
          'Su plasticidad genética desarrollada a lo largo de siglos, que les permite explorar horizontes de suelo más profundos y resistir estrés sin colapsar',
          'Que son estériles y no se pueden reproducir',
          'Que necesitan abonos químicos importados de otros continentes',
          'Que crecen en 24 horas'
        ],
        correctOptionIndex: 0,
        explanation: 'La amplia variabilidad genética acumulada en las semillas tradicionales les confiere plasticidad adaptativa para responder a condiciones meteorológicas adversas.'
      }
    ]
  }
];

export const FOOD_DATABASE: FoodItem[] = [
  {
    id: 'garbanzo-pedrosillano',
    name: 'Garbanzo Castellano / Pedrosillano',
    scientificName: 'Cicer arietinum',
    category: 'leguminosas_fijadoras',
    categoryLabel: 'Leguminosas Fijadoras',
    primaryClimate: 'mediterraneo',
    climateZoneLabel: 'Mediterráneo y Secano Templado',
    bestSeasons: ['otono', 'invierno', 'primavera'],
    carbonFootprintKgCO2e: 1.1,
    waterFootprintLiters: 3200,
    nutrientDensityScore: 92,
    keyNutrients: ['Proteína vegetal completa con cereales', 'Hierro no hemo biodisponible', 'Folatos', 'Fibra prebiótica'],
    climateBenefit: 'Fija hasta 80 kg de nitrógeno puro por hectárea en el suelo, suprimiendo la necesidad de fertilizantes sintéticos.',
    vitalRole: 'Nutrición muscular limpia y mantenimiento de la microbiota intestinal sana.',
    traditionalConservation: 'Secado tradicional en era de trilla y almacenamiento en sacos de cáñamo transpirables durante más de 2 años sin merma.',
    recommendedIntake: '150 - 200g cocido, 2-3 veces por semana.',
    imageAlt: 'Garbanzos autóctonos secos sobre cuenco de barro tradicional'
  },
  {
    id: 'lenteja-pardina',
    name: 'Lenteja Pardina de Secano',
    scientificName: 'Lens culinaris',
    category: 'leguminosas_fijadoras',
    categoryLabel: 'Leguminosas Fijadoras',
    primaryClimate: 'mediterraneo',
    climateZoneLabel: 'Mediterráneo y Continental',
    bestSeasons: ['otono', 'invierno'],
    carbonFootprintKgCO2e: 0.9,
    waterFootprintLiters: 2800,
    nutrientDensityScore: 94,
    keyNutrients: ['Hierro', 'Zinc', 'Magnesio', 'Polifenoles antioxidantes'],
    climateBenefit: 'Bajísimo consumo de agua, excelente en rotación de cultivos para romper ciclos de plagas.',
    vitalRole: 'Prevención de anemias y regulación del índice glucémico sanguíneo.',
    traditionalConservation: 'Conservación en grano seco en recipientes herméticos de barro con hojas de laurel.',
    recommendedIntake: '150g cocido, 2 veces por semana.',
    imageAlt: 'Lentejas pardinas ecológicas en cuchara de madera de olivo'
  },
  {
    id: 'aceite-oliva-virgen-extra',
    name: 'Aceite de Oliva Virgen Extra de Secano',
    scientificName: 'Olea europaea',
    category: 'frutos_secos_semillas',
    categoryLabel: 'Grasas y Semillas Nobles',
    primaryClimate: 'mediterraneo',
    climateZoneLabel: 'Mediterráneo',
    bestSeasons: ['otono', 'invierno', 'primavera', 'verano'],
    carbonFootprintKgCO2e: 3.2,
    waterFootprintLiters: 4800,
    nutrientDensityScore: 96,
    keyNutrients: ['Ácido oleico (omega-9)', 'Oleocantal', 'Hidroxitirosol', 'Vitamina E'],
    climateBenefit: 'El olivar tradicional de secano actúa como un potente sumidero neto de carbono: 1 litro de AOVE secuestra hasta 10 kg de CO2 en el árbol y suelo.',
    vitalRole: 'Protección cardiovascular, antiinflamatorio celular de primer orden y salud cerebral.',
    traditionalConservation: 'Extracción en frío (<27°C) y conservación en tanques de acero inoxidable o botellas opacas lejos de la luz.',
    recommendedIntake: '25 - 40 ml al día en crudo.',
    imageAlt: 'Aceite de oliva virgen extra de tonalidad dorada y esmeralda'
  },
  {
    id: 'mijo-dorado',
    name: 'Mijo Dorado Ancestral',
    scientificName: 'Panicum miliaceum',
    category: 'cereales_ancestrales',
    categoryLabel: 'Cereales y Pseudocereales',
    primaryClimate: 'arido',
    climateZoneLabel: 'Árido y Semiárido',
    bestSeasons: ['verano', 'otono'],
    carbonFootprintKgCO2e: 0.8,
    waterFootprintLiters: 1600,
    nutrientDensityScore: 88,
    keyNutrients: ['Silicio biodisponible', 'Magnesio', 'Fósforo', 'Sin gluten'],
    climateBenefit: 'Fotosíntesis C4 de máxima eficiencia: requiere un 70% menos de agua que el arroz blanco y madura en apenas 60-70 días.',
    vitalRole: 'Fortalecimiento de huesos, uñas, cabello y vitalidad digestiva para personas con digestiones sensibles.',
    traditionalConservation: 'Grano descascarillado protegido de la humedad.',
    recommendedIntake: '80g crudo (pesado antes de cocer) 2 veces por semana.',
    imageAlt: 'Granos dorados de mijo ecológico en lienzo natural'
  },
  {
    id: 'centeno-integral',
    name: 'Centeno Integral Tradicional',
    scientificName: 'Secale cereale',
    category: 'cereales_ancestrales',
    categoryLabel: 'Cereales y Pseudocereales',
    primaryClimate: 'templado',
    climateZoneLabel: 'Templado Frío y Montaña',
    bestSeasons: ['invierno', 'primavera'],
    carbonFootprintKgCO2e: 1.0,
    waterFootprintLiters: 1900,
    nutrientDensityScore: 90,
    keyNutrients: ['Arabinoxilanos (fibra soluble)', 'Vitaminas grupo B', 'Manganeso'],
    climateBenefit: 'Raíces vigorosas que exploran hasta 2 metros de profundidad, previniendo la erosión de laderas en inviernos lluviosos.',
    vitalRole: 'Regulación del colesterol LDL y saciedad prolongada de bajo impacto glucémico.',
    traditionalConservation: 'Fermentación en masa madre viva y panes densos de conservación semanal.',
    recommendedIntake: '60 - 80g de pan de centeno 100% integral al día.',
    imageAlt: 'Hogaza de pan denso de centeno con masa madre tradicional'
  },
  {
    id: 'almendra-marcona',
    name: 'Almendra Marcona de Secano',
    scientificName: 'Prunus dulcis',
    category: 'frutos_secos_semillas',
    categoryLabel: 'Frutos Secos y Semillas',
    primaryClimate: 'mediterraneo',
    climateZoneLabel: 'Mediterráneo de Secano',
    bestSeasons: ['otono', 'invierno', 'primavera', 'verano'],
    carbonFootprintKgCO2e: 2.1,
    waterFootprintLiters: 3900,
    nutrientDensityScore: 95,
    keyNutrients: ['Calcio vegetal biodisponible', 'Vitamina E', 'Magnesio', 'Proteínas'],
    climateBenefit: 'El almendro de secano fija el suelo en pendientes calcáreas y florece tempranamente proveyendo polen vital a las abejas.',
    vitalRole: 'Densidad mineral ósea y protección antioxidante celular.',
    traditionalConservation: 'En cáscara dura natural o tostado suave sin sal refinada añadida.',
    recommendedIntake: '25 - 30g al día (un puñado generoso).',
    imageAlt: 'Almendras marconas ecológicas recién recolectadas'
  },
  {
    id: 'espinaca-invierno',
    name: 'Espinaca de Invierno y Hoja Oscura',
    scientificName: 'Spinacia oleracea',
    category: 'hortalizas_raiz_hoja',
    categoryLabel: 'Hortalizas de Hoja y Raíz',
    primaryClimate: 'templado',
    climateZoneLabel: 'Templado y Mediterráneo Fresco',
    bestSeasons: ['otono', 'invierno', 'primavera'],
    carbonFootprintKgCO2e: 0.6,
    waterFootprintLiters: 550,
    nutrientDensityScore: 97,
    keyNutrients: ['Clorofila', 'Luteína y Zeaxantina', 'Folatos', 'Vitamina K'],
    climateBenefit: 'Cultivo de invierno que no compite por agua de riego estival y capta CO2 en periodos de baja insolación.',
    vitalRole: 'Protección ocular frente a luz azul, síntesis de coagulación sanguínea y oxigenación.',
    traditionalConservation: 'Escaldado breve de 1 minuto y congelación en porciones o consumo fresco de proximidad.',
    recommendedIntake: '150 - 200g fresco 3 veces por semana.',
    imageAlt: 'Hojas verdes oscuras de espinacas frescas con rocío matutino'
  },
  {
    id: 'zanahoria-morada',
    name: 'Zanahoria Morada / Raíces Antiguas',
    scientificName: 'Daucus carota subsp. sativus',
    category: 'hortalizas_raiz_hoja',
    categoryLabel: 'Hortalizas de Hoja y Raíz',
    primaryClimate: 'templado',
    climateZoneLabel: 'Templado y Continental',
    bestSeasons: ['otono', 'invierno'],
    carbonFootprintKgCO2e: 0.5,
    waterFootprintLiters: 480,
    nutrientDensityScore: 91,
    keyNutrients: ['Antocianinas moradas', 'Betacarotenos', 'Fibra soluble pectina'],
    climateBenefit: 'Descompacta la estructura del suelo con su raíz pivotante profunda, facilitando la infiltración del agua de lluvia.',
    vitalRole: 'Protección capilar, salud dérmica y regeneración celular nocturna.',
    traditionalConservation: 'Almacenamiento en arena húmeda fresca o encurtido lactofermentado.',
    recommendedIntake: '120g cruda o asada al dente.',
    imageAlt: 'Zanahorias moradas con tonos violetas y anaranjados'
  },
  {
    id: 'granada-mollar',
    name: 'Granada Mollar de Elche',
    scientificName: 'Punica granatum',
    category: 'frutas_polinizacion',
    categoryLabel: 'Frutas y Bayas Bioclimáticas',
    primaryClimate: 'arido',
    climateZoneLabel: 'Mediterráneo Árido y Subtropical',
    bestSeasons: ['otono'],
    carbonFootprintKgCO2e: 0.7,
    waterFootprintLiters: 1100,
    nutrientDensityScore: 93,
    keyNutrients: ['Punicalaginas', 'Ácido elágico', 'Vitamina C'],
    climateBenefit: 'Árbol extremadamente rústico resistente a suelos salinos y sequías severas con mínimas necesidades fitosanitarias.',
    vitalRole: 'Potentísimo protector vascular y modulador de la tensión arterial.',
    traditionalConservation: 'Piel gruesa natural que preserva los arilos durante meses en bodega fresca.',
    recommendedIntake: '1 pieza (unos 150g de arilos) en su temporada de otoño.',
    imageAlt: 'Granada abierta mostrando arilos de color rubí brillante'
  },
  {
    id: 'higo-cuello-dama',
    name: 'Higo Cuello de Dama',
    scientificName: 'Ficus carica',
    category: 'frutas_polinizacion',
    categoryLabel: 'Frutas y Bayas Bioclimáticas',
    primaryClimate: 'mediterraneo',
    climateZoneLabel: 'Mediterráneo y Templado Cálido',
    bestSeasons: ['verano', 'otono'],
    carbonFootprintKgCO2e: 0.8,
    waterFootprintLiters: 1250,
    nutrientDensityScore: 89,
    keyNutrients: ['Potasio', 'Calcio', 'Fibra mucilaginosa', 'Fructosa natural equilibrada'],
    climateBenefit: 'La higuera es pionera en la colonización de suelos pedregosos sin necesidad de regadío ni tratamientos de síntesis.',
    vitalRole: 'Energía limpia para el esfuerzo muscular y salud del tránsito intestinal.',
    traditionalConservation: 'Secado solar al aire sobre cañizos tradicionales (pasas de higo con harina de centeno).',
    recommendedIntake: '3-4 higos frescos al día en temporada.',
    imageAlt: 'Higos maduros con piel morada y pulpa rosada en cesta de mimbre'
  },
  {
    id: 'mejillon-atlantico',
    name: 'Mejillón Atlántico de Batea Regenerativa',
    scientificName: 'Mytilus galloprovincialis',
    category: 'acuicultura_regenerativa',
    categoryLabel: 'Proteínas Acuáticas de Impacto Cero',
    primaryClimate: 'templado',
    climateZoneLabel: 'Costero Templado / Atlántico',
    bestSeasons: ['otono', 'invierno', 'primavera'],
    carbonFootprintKgCO2e: 1.4,
    waterFootprintLiters: 0, // Cero agua dulce terrestre
    nutrientDensityScore: 98,
    keyNutrients: ['Vitamina B12 ultra densa', 'Omega-3 EPA y DHA', 'Hierro bioasimilable', 'Yodo'],
    climateBenefit: 'No requiere pienso ni agua dulce. Filtra y limpia el agua marina fijando carbonato de calcio en su concha marina (captura de carbono mineral).',
    vitalRole: 'Soporte neuronal, síntesis de glóbulos rojos y salud tiroidea.',
    traditionalConservation: 'Cocido al vapor en su propio jugo con hoja de laurel o en escabeche de vinagre de manzana y pimentón.',
    recommendedIntake: '150 - 200g (carne neta) 1-2 veces por semana.',
    imageAlt: 'Mejillones al vapor servidos en cazuela de hierro con limón'
  },
  {
    id: 'alga-wakame-atlantica',
    name: 'Alga Wakame Atlántica Ecológica',
    scientificName: 'Undaria pinnatifida',
    category: 'acuicultura_regenerativa',
    categoryLabel: 'Proteínas Acuáticas de Impacto Cero',
    primaryClimate: 'templado',
    climateZoneLabel: 'Costero Templado Frío',
    bestSeasons: ['primavera', 'verano'],
    carbonFootprintKgCO2e: 0.3,
    waterFootprintLiters: 0,
    nutrientDensityScore: 95,
    keyNutrients: ['Yodo orgánico', 'Fucoxantina', 'Calcio marino', 'Alginatos desintoxicantes'],
    climateBenefit: 'Crece a un ritmo de hasta 10 cm al día en el mar sin fertilizantes ni suelo terrestre, absorbiendo grandes cantidades de nitrógeno oceánico.',
    vitalRole: 'Regulación del metabolismo energético basal y quelación de metales pesados en el intestino.',
    traditionalConservation: 'Deshidratación a baja temperatura en oscuridad y rehidratación en 10 minutos.',
    recommendedIntake: '5g seca rehidratada en sopas o ensaladas, 3 veces por semana.',
    imageAlt: 'Algas wakame verdes rehidratadas con semillas de sésamo'
  }
];

export const MONTH_PHENOLOGY: MonthPhenology[] = [
  {
    monthIndex: 0,
    name: 'Enero',
    season: 'invierno',
    solarCharacteristics: 'Insolación mínima del año, fotoperiodo corto de 9-10 horas.',
    soilCondition: 'Suelo frío en reposo vegetativo profundo. Infiltración de lluvias invernales en acuíferos.',
    peakHarvestFoods: ['Espinaca de invierno', 'Puerro', 'Col kale', 'Naranja amarga', 'Zanahoria morada', 'Mejillón atlántico'],
    metabolicNeed: 'Alimentos calóricos de absorción lenta y crucíferas ricas en azufre para reforzar el sistema inmunológico.',
    conservationTask: 'Preparar encurtidos y consumir legumbres de la cosecha de otoño precedente.'
  },
  {
    monthIndex: 1,
    name: 'Febrero',
    season: 'invierno',
    solarCharacteristics: 'Incremento perceptible de la radiación luminosa diaria (+3 min/día).',
    soilCondition: 'Despertar de las yemas florales en almendros de zonas templadas y mediterráneas.',
    peakHarvestFoods: ['Alcachofa', 'Cardo', 'Brócoli', 'Limón', 'Mandarina', 'Acelga'],
    metabolicNeed: 'Flavonoides cítricos y cinarina de alcachofa para estimular el drenaje hepático invernal.',
    conservationTask: 'Maceración de cítricos y conservación de alcachofas en aceite de oliva virgen extra.'
  },
  {
    monthIndex: 2,
    name: 'Marzo',
    season: 'primavera',
    solarCharacteristics: 'Equinoccio de primavera: 12 horas exactas de luz y sombra. Aumento térmico.',
    soilCondition: 'Rápido calentamiento de la capa superficial del suelo. Máxima actividad micorrícica.',
    peakHarvestFoods: ['Espárrago silvestre', 'Guisante lágrima', 'Haba tierna', 'Fresón de secano', 'Rábano'],
    metabolicNeed: 'Verduras amargas y brotes clorofílicos para depuración metabólica y revitalización celular.',
    conservationTask: 'Escaldado y congelación de legumbres tiernas primaverales.'
  },
  {
    monthIndex: 3,
    name: 'Abril',
    season: 'primavera',
    solarCharacteristics: 'Fotoperiodo en clara expansión, radiación ultravioleta moderada.',
    soilCondition: 'Floración masiva de frutales y máxima polinización entomófila.',
    peakHarvestFoods: ['Cerezas tempranas', 'Zanahoria tierna', 'Cebolleta', 'Haba de mayo', 'Espinaca'],
    metabolicNeed: 'Carotenoides y agua vegetal viva para adaptar la dermis a la mayor insolación.',
    conservationTask: 'Secado de hierbas aromáticas silvestres (romero, tomillo, salvia).'
  },
  {
    monthIndex: 4,
    name: 'Mayo',
    season: 'primavera',
    solarCharacteristics: 'Radiación intensa con días templados; inicio de evapotranspiración alta.',
    soilCondition: 'Engrosamiento de espigas en cereales de invierno (trigo, centeno, cebada).',
    peakHarvestFoods: ['Cereza', 'Níspero', 'Albaricoque', 'Judía verde plana', 'Calabacín temprano'],
    metabolicNeed: 'Antocianinas de drupas rojas para elasticidad vascular ante temperaturas crecientes.',
    conservationTask: 'Elaboración de compotas artesanales sin azúcar refinado añadido.'
  },
  {
    monthIndex: 5,
    name: 'Junio',
    season: 'verano',
    solarCharacteristics: 'Solsticio de verano: máxima radiación solar del hemisferio norte (hasta 15 horas de luz).',
    soilCondition: 'Secado del horizonte superficial del suelo; maduración dorada de granos de secano.',
    peakHarvestFoods: ['Tomate de huerta', 'Pepino', 'Melocotón', 'Ciruela', 'Pimiento temprano'],
    metabolicNeed: 'Licopeno, potasio y agua biológica estructurada para prevenir deshidratación y estrés térmico.',
    conservationTask: 'Conservas de tomate embotellado al baño maría para todo el año.'
  },
  {
    monthIndex: 6,
    name: 'Julio',
    season: 'verano',
    solarCharacteristics: 'Canícula: radiación ultravioleta máxima combinada con olas de calor térmico.',
    soilCondition: 'Estrés hídrico vegetal; plantas cierran estomas en horas centrales para frenar transpiración.',
    peakHarvestFoods: ['Sandía', 'Melón piel de sapo', 'Berenjena', 'Higo breva', 'Albahaca'],
    metabolicNeed: 'Líquidos electrolíticos naturales, sales de magnesio y antioxidantes liposolubles.',
    conservationTask: 'Deshidratación solar de tomates y pimientos al sol estival.'
  },
  {
    monthIndex: 7,
    name: 'Agosto',
    season: 'verano',
    solarCharacteristics: 'Días largos con noches todavía cálidas; alta acumulación de grados-día.',
    soilCondition: 'Cosecha de legumbres de grano seco (garbanzo, lenteja) y vendimia temprana.',
    peakHarvestFoods: ['Higo cuello de dama', 'Uva de mesa', 'Mora silvestre', 'Pimiento de asar', 'Almendra tierna'],
    metabolicNeed: 'Azúcares naturales de fruta densa para sostener la energía en días de calor continuo.',
    conservationTask: 'Secado tradicional de higos en cañizos y tostado suave de almendras recién recogidas.'
  },
  {
    monthIndex: 8,
    name: 'Septiembre',
    season: 'otono',
    solarCharacteristics: 'Equinoccio de otoño: descenso gradual de horas de luz e intensidad solar.',
    soilCondition: 'Lluvias otoñales que reactivan la vida microbiana tras la sequía veraniega.',
    peakHarvestFoods: ['Granada mollar', 'Uva tinta', 'Membrillo', 'Calabaza cacahuete', 'Manzana reineta'],
    metabolicNeed: 'Polifenoles densos (ácido elágico, resveratrol) para preparar el sistema inmune para el otoño.',
    conservationTask: 'Fermentación de mosto natural y elaboración de dulce de membrillo ancestral.'
  },
  {
    monthIndex: 9,
    name: 'Octubre',
    season: 'otono',
    solarCharacteristics: 'Descenso térmico marcado; noches frías y formación de rocío denso matinal.',
    soilCondition: 'Siembra tradicional de cereal de invierno y recogida de castañas y nueces.',
    peakHarvestFoods: ['Castaña', 'Nuez', 'Caqui', 'Boniato', 'Setas silvestres micorrícicas'],
    metabolicNeed: 'Ácidos grasos esenciales omega-3 y almidones complejos para afrontar el descenso de temperatura.',
    conservationTask: 'Curado de castañas y nueces en ambiente seco y aireado.'
  },
  {
    monthIndex: 10,
    name: 'Noviembre',
    season: 'otono',
    solarCharacteristics: 'Fotoperiodo menguante; radiación oblicua y días frecuentemente cubiertos.',
    soilCondition: 'Campaña de recolección de aceituna para extracción en frío del primer aceite virgen extra.',
    peakHarvestFoods: ['Aceituna de molino', 'Chirimoya', 'Kiwi', 'Coliflor', 'Nabo'],
    metabolicNeed: 'Vitamina C cítrica y polifenoles del aceite recién exprimido para blindaje respiratorio.',
    conservationTask: 'Prensado de aceituna fresca y almacenamiento del aceite en recipientes opacos protegidos.'
  },
  {
    monthIndex: 11,
    name: 'Diciembre',
    season: 'invierno',
    solarCharacteristics: 'Solsticio de invierno: día más corto y noche más prolongada del ciclo anual.',
    soilCondition: 'Heladas matutinas que concentran los azúcares protectores en hortalizas de invierno.',
    peakHarvestFoods: ['Lombarda', 'Escarola', 'Cardo', 'Naranja', 'Puerro', 'Mejillón'],
    metabolicNeed: 'Platos calientes cocinados a fuego lento, caldos remineralizantes y alimentos fermentados.',
    conservationTask: 'Lactofermentación de coles (chucrut casero) y guisados de legumbres de larga duración.'
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 't-1',
    term: 'Radiación Fotosintéticamente Activa (RFA)',
    category: 'Climatología',
    definition: 'Fracción del espectro solar comprendida entre 400 y 700 nanómetros que los cloroplastos vegetales utilizan para hidrolizar agua y transformar CO2 atmosférico en biomasa comestible.',
    contextExample: 'En agricultura bioclimática, optimizar la captura de RFA mediante cubiertas escalonadas maximiza la síntesis de nutrientes sin fertilizantes externos.'
  },
  {
    id: 't-2',
    term: 'Agua Verde (Green Water)',
    category: 'Sostenibilidad',
    definition: 'Volumen de agua procedente directamente de la precipitación pluvial que se almacena en la zona radicular del suelo y es transpirada o incorporada por los cultivos sin necesidad de bombeo o extracción de acuíferos.',
    contextExample: 'Las legumbres de secano mediterráneo tienen una huella de agua verde superior al 85%, siendo climáticamente inocuas para los acuíferos.'
  },
  {
    id: 't-3',
    term: 'Fijación Biológica de Nitrógeno',
    category: 'Agroecología',
    definition: 'Proceso metabólico simbiótico en el cual bacterias como Rhizobium habitan en los nódulos radiculares de las leguminosas, convirtiendo el nitrógeno inerte del aire (N2) en amonio biodisponible para la planta.',
    contextExample: 'Incorporar lentejas y garbanzos en la rotación agrícola suprime las emisiones de N2O ligadas a abonos sintéticos derivados de hidrocarburos.'
  },
  {
    id: 't-4',
    term: 'Fotosíntesis C4',
    category: 'Climatología',
    definition: 'Vía fotosintética evolucionada en climas áridos y cálidos que concentra el CO2 en células de la vaina vascular antes de la fijación, reduciendo drásticamente la fotorrespiración y el consumo hídrico.',
    contextExample: 'El mijo y el sorgo son cereales C4 que producen grano nutritivo en olas de calor con la mitad de agua que el maíz o el trigo blando.'
  },
  {
    id: 't-5',
    term: 'Dieta de Salud Planetaria (EAT-Lancet)',
    category: 'Nutrición',
    definition: 'Marco científico de referencia global que define una pauta dietética capaz de nutrir a 10.000 millones de personas en 2050 respetando los límites biofísicos de la Tierra (emisiones CO2, agua dulce, biodiversidad y nitrógeno).',
    contextExample: 'Establece como pauta un plato compuesto al 50% por hortalizas y frutas, un 25% por cereales integrales y un 25% por proteínas mayoritariamente vegetales.'
  },
  {
    id: 't-6',
    term: 'Agroforestería Regenerativa',
    category: 'Agroecología',
    definition: 'Integración intencionada de árboles y arbustos leñosos con cultivos herbáceos y/o animales en la misma parcela para crear un microclima amortiguado, secuestrar carbono y regenerar el ciclo del agua.',
    contextExample: 'El cultivo de almendros y olivos con pastoreo rotativo genera un suelo rico en hongos micorrícicos y reduce la temperatura del suelo en verano.'
  },
  {
    id: 't-7',
    term: 'Fenología Agraria',
    category: 'Climatología',
    definition: 'Estudio de los eventos biológicos periódicos de las plantas (brotación, floración, cuajado, maduración de frutos y caída de hojas) y su estrecha correlación con las variables meteorológicas y climáticas.',
    contextExample: 'La fenología estacional nos indica el momento exacto en que un alimento alcanza su densidad óptima de fitoquímicos y menor coste energético de cosecha.'
  },
  {
    id: 't-8',
    term: 'Análisis de Ciclo de Vida (ACV)',
    category: 'Sostenibilidad',
    definition: 'Herramienta estandarizada (ISO 14040/44) que cuantifica las cargas ambientales de un producto o alimento a lo largo de todas sus fases: extracción de insumos, cultivo, procesamiento, transporte, envasado y consumo.',
    contextExample: 'El ACV demuestra que cambiar la fuente de proteína diaria de vacuno a legumbres locales disminuye la huella de carbono personal en un 70%.'
  }
];
