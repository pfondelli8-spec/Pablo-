export type ManualChapterId =
  | 'capitulo_1_primeros_pasos'
  | 'capitulo_2_gestion_menus'
  | 'capitulo_3_gestion_documentos'
  | 'capitulo_4_gestion_operarios'
  | 'capitulo_5_categorias_departamentos_areas'
  | 'capitulo_6_checklists_controles'
  | 'capitulo_7_configuracion_administracion'
  | 'capitulo_8_problemas_frecuentes';

export type UserRoleTarget = 'todos' | 'operario' | 'jefe' | 'admin';

export interface ManualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  screenLocation?: string;
  highlightButton?: string;
  tip?: string;
}

export interface ManualExample {
  hotelContext: 'Hotel Bitácora' | 'Hotel Vulcano' | 'General';
  scenario: string;
  resolution: string;
}

export interface ManualExpectedResult {
  screenState: string;
  systemEffect: string;
  auditRecord: string;
}

export interface ManualMistakeToAvoid {
  mistake: string;
  consequence: string;
  recommendation: string;
}

export interface ManualArticle {
  id: string;
  chapterId: ManualChapterId;
  order: number;
  title: string;
  subtitle: string;
  slug: string;
  targetRoles: UserRoleTarget[];
  badge?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  published: boolean;
  updatedAt: string;
  author: string;
  tags: string[];
  sectionPath?: string;
  quickButtons?: Array<{ label: string; actionId?: string; hint?: string }>;
  // Las 6 secciones obligatorias homogéneas
  paraQueSirve: string;
  quienPuedeHacerlo: {
    role: string;
    pinRequired?: string;
    notes?: string;
  };
  pasoAPaso: ManualStep[];
  ejemploPractico: ManualExample;
  resultadoEsperado: ManualExpectedResult;
  erroresEvitar: ManualMistakeToAvoid[];
  relatedArticleIds?: string[];
}

export interface ManualChapterMeta {
  id: ManualChapterId;
  order: number;
  numberRoman: string;
  title: string;
  shortDesc: string;
  iconName: string;
  badge: string;
}
