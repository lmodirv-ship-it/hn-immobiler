export interface BlogPost {
  id: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  content: string;
  contentAr: string;
  author: string;
  category: string;
  categoryAr: string;
  image: string;
  date: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'guide-achat-maroc-2026',
    title: 'Guide complet : Acheter un bien immobilier au Maroc en 2026',
    titleAr: 'دليل شامل: شراء عقار في المغرب 2026',
    excerpt: 'Tout ce que vous devez savoir avant d\'investir dans l\'immobilier marocain. Procédures, fiscalité, et conseils pratiques.',
    excerptAr: 'كل ما تحتاج معرفته قبل الاستثمار في العقارات المغربية. الإجراءات والضرائب والنصائح العملية.',
    content: `L'immobilier au Maroc reste l'un des investissements les plus sûrs en 2026. Voici un guide détaillé pour réussir votre achat.\n\n## 1. Choisir la bonne ville\nCasablanca, Marrakech, Tanger et Rabat restent les marchés les plus dynamiques. Chaque ville a ses spécificités :\n- **Casablanca** : Centre économique, prix élevés mais forte demande locative\n- **Marrakech** : Tourisme et investissement locatif saisonnier\n- **Tanger** : Ville en pleine expansion avec le port Tanger Med\n- **Rabat** : Capitale administrative, marché stable\n\n## 2. Vérifier le titre foncier\nExigez toujours un titre foncier (TF). C'est la seule garantie légale de propriété au Maroc.\n\n## 3. Financement\nLes banques marocaines offrent des crédits immobiliers avec des taux entre 4% et 6%. Préparez un apport d'au moins 20%.\n\n## 4. Frais annexes\nPrévoyez environ 7% du prix d'achat pour les frais :\n- Droits d'enregistrement : 4%\n- Conservation foncière : 1.5%\n- Notaire : 1-1.5%\n- Timbres fiscaux`,
    contentAr: `يبقى العقار في المغرب من أكثر الاستثمارات أماناً في 2026. إليك دليل مفصل لنجاح عملية الشراء.\n\n## 1. اختيار المدينة المناسبة\nالدار البيضاء ومراكش وطنجة والرباط تبقى الأسواق الأكثر نشاطاً.\n\n## 2. التحقق من الرسم العقاري\nاطلب دائماً الرسم العقاري. إنه الضمان القانوني الوحيد للملكية في المغرب.\n\n## 3. التمويل\nالبنوك المغربية تقدم قروضاً عقارية بنسب فائدة بين 4% و6%. جهز مساهمة لا تقل عن 20%.\n\n## 4. الرسوم الإضافية\nتوقع حوالي 7% من ثمن الشراء للرسوم.`,
    author: 'HN Immobilier',
    category: 'Guide',
    categoryAr: 'دليل',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    date: '2026-03-28',
    readTime: 8,
  },
  {
    id: 'tendances-immobilieres-2026',
    title: 'Les 5 tendances immobilières au Maroc en 2026',
    titleAr: 'أهم 5 اتجاهات عقارية في المغرب لعام 2026',
    excerpt: 'Smart buildings, éco-quartiers, digitalisation... Découvrez les tendances qui transforment le marché immobilier marocain.',
    excerptAr: 'المباني الذكية، الأحياء البيئية، الرقمنة... اكتشف الاتجاهات التي تحول سوق العقارات المغربي.',
    content: `Le marché immobilier marocain évolue rapidement. Voici les 5 tendances majeures.\n\n## 1. Smart Buildings\nLes promoteurs intègrent désormais la domotique : gestion énergétique, sécurité connectée, parkings intelligents.\n\n## 2. Éco-quartiers\nLes projets durables se multiplient avec des certifications HQE et des espaces verts intégrés.\n\n## 3. Digitalisation\nDes visites virtuelles aux signatures électroniques, la tech transforme l'expérience d'achat.\n\n## 4. Co-living\nUn nouveau modèle d'habitat partagé émerge dans les grandes villes.\n\n## 5. Investissement locatif digitalisé\nLes plateformes facilitent la gestion locative à distance.`,
    contentAr: `يتطور سوق العقارات المغربي بسرعة. إليك أهم 5 اتجاهات.\n\n## 1. المباني الذكية\nيدمج المطورون الآن أنظمة التشغيل الآلي للمنازل.\n\n## 2. الأحياء البيئية\nتتكاثر المشاريع المستدامة مع شهادات الجودة البيئية.\n\n## 3. الرقمنة\nمن الزيارات الافتراضية إلى التوقيعات الإلكترونية.\n\n## 4. السكن المشترك\nنموذج سكني جديد يظهر في المدن الكبرى.\n\n## 5. الاستثمار الإيجاري الرقمي\nالمنصات تسهل إدارة الإيجار عن بعد.`,
    author: 'HN Immobilier',
    category: 'Tendances',
    categoryAr: 'اتجاهات',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    date: '2026-03-20',
    readTime: 5,
  },
  {
    id: 'louer-appartement-casablanca',
    title: 'Comment louer un appartement à Casablanca : Guide pratique',
    titleAr: 'كيف تستأجر شقة في الدار البيضاء: دليل عملي',
    excerpt: 'Les meilleurs quartiers, les prix moyens, et les pièges à éviter pour réussir votre location à Casablanca.',
    excerptAr: 'أفضل الأحياء، الأسعار المتوسطة، والأخطاء التي يجب تجنبها لنجاح إيجارك في الدار البيضاء.',
    content: `Casablanca est la ville la plus demandée pour la location au Maroc.\n\n## Quartiers populaires\n- **Maarif / Gauthier** : Centre-ville, 5000-8000 DH/mois pour un F3\n- **Anfa** : Haut standing, 10000-15000 DH/mois\n- **Ain Diab** : Vue mer, 8000-12000 DH/mois\n- **Hay Hassani** : Plus abordable, 3000-5000 DH/mois\n\n## Documents nécessaires\n- CIN ou passeport\n- Attestation de travail\n- 3 derniers bulletins de salaire\n- Caution (généralement 2 mois)\n\n## Conseils\n1. Visitez plusieurs appartements avant de décider\n2. Vérifiez l'état de la plomberie et électricité\n3. Négociez le prix, surtout en basse saison\n4. Exigez un contrat de bail légalisé`,
    contentAr: `الدار البيضاء هي المدينة الأكثر طلباً للإيجار في المغرب.\n\n## الأحياء الشهيرة\n- **المعاريف** : وسط المدينة\n- **أنفا** : سكن فاخر\n- **عين الذئاب** : إطلالة بحرية\n\n## الوثائق المطلوبة\n- بطاقة التعريف أو جواز السفر\n- شهادة العمل\n- آخر 3 كشوف رواتب`,
    author: 'HN Immobilier',
    category: 'Location',
    categoryAr: 'إيجار',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    date: '2026-03-15',
    readTime: 6,
  },
  {
    id: 'investir-tanger-2026',
    title: 'Pourquoi investir à Tanger en 2026 ?',
    titleAr: 'لماذا الاستثمار في طنجة في 2026؟',
    excerpt: 'Tanger connaît un boom immobilier sans précédent grâce aux grands projets d\'infrastructure et sa position stratégique.',
    excerptAr: 'تشهد طنجة طفرة عقارية غير مسبوقة بفضل مشاريع البنية التحتية الكبرى وموقعها الاستراتيجي.',
    content: `Tanger est devenue l'une des villes les plus attractives pour l'investissement immobilier.\n\n## Pourquoi Tanger ?\n1. **Tanger Med** : Le plus grand port d'Afrique\n2. **TGV** : Connexion rapide avec Casablanca et Rabat\n3. **Zone franche** : Attracts international businesses\n4. **Tourisme** : Croissance continue\n\n## Prix moyens\n- Appartements : 8000-15000 DH/m²\n- Villas : 15000-25000 DH/m²\n- Terrains : 2000-8000 DH/m²\n\n## Rendement locatif\nLe rendement moyen est de 5-7% par an, parmi les meilleurs du pays.`,
    contentAr: `أصبحت طنجة واحدة من أكثر المدن جذباً للاستثمار العقاري.\n\n## لماذا طنجة؟\n1. ميناء طنجة المتوسط: أكبر ميناء في أفريقيا\n2. القطار فائق السرعة: ربط سريع مع الدار البيضاء\n3. المنطقة الحرة: تجذب الشركات الدولية`,
    author: 'HN Immobilier',
    category: 'Investissement',
    categoryAr: 'استثمار',
    image: 'https://images.unsplash.com/photo-1582407947092-545c6a381263?w=800',
    date: '2026-03-10',
    readTime: 5,
  },
];
