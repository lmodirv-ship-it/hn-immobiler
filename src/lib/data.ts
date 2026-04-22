export interface Property {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: 'sale' | 'rent';
  propertyType: 'apartment' | 'villa' | 'house' | 'land' | 'commercial';
  price: number;
  surface: number;
  rooms: number;
  city: string;
  cityAr: string;
  address: string;
  images: string[];
  isFeatured: boolean;
  isPremium: boolean;
  createdAt: string;
}

export const cities = [
  { fr: 'Casablanca', ar: 'الدار البيضاء' },
  { fr: 'Marrakech', ar: 'مراكش' },
  { fr: 'Tanger', ar: 'طنجة' },
  { fr: 'Rabat', ar: 'الرباط' },
  { fr: 'Fès', ar: 'فاس' },
  { fr: 'Agadir', ar: 'أكادير' },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Appartement moderne à Casablanca',
    titleAr: 'شقة عصرية في الدار البيضاء',
    description: 'Superbe appartement de 3 pièces situé au cœur de Casablanca, avec vue sur la mer. Cuisine équipée, salon lumineux, 2 chambres spacieuses. Parking inclus.',
    descriptionAr: 'شقة رائعة من 3 غرف في قلب الدار البيضاء، مع إطلالة على البحر. مطبخ مجهز، صالون مضيء، غرفتين واسعتين. موقف سيارات مشمول.',
    type: 'sale',
    propertyType: 'apartment',
    price: 1200000,
    surface: 120,
    rooms: 3,
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    address: 'Boulevard Anfa, Casablanca',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    isFeatured: true,
    isPremium: true,
    createdAt: '2026-03-15',
  },
  {
    id: '2',
    title: 'Villa avec piscine à Marrakech',
    titleAr: 'فيلا بمسبح في مراكش',
    description: 'Magnifique villa de 5 pièces avec piscine privée et jardin paysager. Architecture traditionnelle marocaine avec finitions haut de gamme.',
    descriptionAr: 'فيلا رائعة من 5 غرف مع مسبح خاص وحديقة. عمارة مغربية تقليدية بتشطيبات فاخرة.',
    type: 'sale',
    propertyType: 'villa',
    price: 3500000,
    surface: 350,
    rooms: 5,
    city: 'Marrakech',
    cityAr: 'مراكش',
    address: 'Route de l\'Ourika, Marrakech',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    isFeatured: true,
    isPremium: false,
    createdAt: '2026-03-10',
  },
  {
    id: '3',
    title: 'Appartement à louer à Rabat',
    titleAr: 'شقة للكراء في الرباط',
    description: 'Appartement meublé de 2 pièces, idéal pour jeune couple ou professionnel. Proche du tramway et des commodités.',
    descriptionAr: 'شقة مفروشة من غرفتين، مثالية لزوجين شابين أو محترف. قريبة من الترامواي والمرافق.',
    type: 'rent',
    propertyType: 'apartment',
    price: 5500,
    surface: 75,
    rooms: 2,
    city: 'Rabat',
    cityAr: 'الرباط',
    address: 'Agdal, Rabat',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    isFeatured: true,
    isPremium: false,
    createdAt: '2026-03-20',
  },
  {
    id: '4',
    title: 'Terrain constructible à Tanger',
    titleAr: 'أرض للبناء في طنجة',
    description: 'Terrain de 500m² dans un quartier résidentiel calme, idéal pour construction de villa. Titre foncier disponible.',
    descriptionAr: 'أرض بمساحة 500 م² في حي سكني هادئ، مثالية لبناء فيلا. الرسم العقاري متوفر.',
    type: 'sale',
    propertyType: 'land',
    price: 800000,
    surface: 500,
    rooms: 0,
    city: 'Tanger',
    cityAr: 'طنجة',
    address: 'Cap Spartel, Tanger',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    isFeatured: false,
    isPremium: false,
    createdAt: '2026-03-25',
  },
  {
    id: '5',
    title: 'Maison traditionnelle à Fès',
    titleAr: 'منزل تقليدي في فاس',
    description: 'Riad authentique dans la médina de Fès. 4 chambres avec salle de bain, patio central avec fontaine.',
    descriptionAr: 'رياض أصيل في مدينة فاس القديمة. 4 غرف مع حمام، فناء مركزي بنافورة.',
    type: 'sale',
    propertyType: 'house',
    price: 1800000,
    surface: 200,
    rooms: 4,
    city: 'Fès',
    cityAr: 'فاس',
    address: 'Médina, Fès',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    isFeatured: false,
    isPremium: true,
    createdAt: '2026-03-18',
  },
  {
    id: '6',
    title: 'Local commercial à Agadir',
    titleAr: 'محل تجاري في أكادير',
    description: 'Local commercial de 80m² sur avenue principale. Idéal pour commerce ou bureau. Bon état.',
    descriptionAr: 'محل تجاري 80 م² على الشارع الرئيسي. مثالي لتجارة أو مكتب. حالة جيدة.',
    type: 'rent',
    propertyType: 'commercial',
    price: 8000,
    surface: 80,
    rooms: 1,
    city: 'Agadir',
    cityAr: 'أكادير',
    address: 'Avenue Hassan II, Agadir',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    isFeatured: false,
    isPremium: false,
    createdAt: '2026-04-01',
  },
];

export function formatPrice(price: number, type: 'sale' | 'rent', lang: string): string {
  const localeMap: Record<string, string> = { ar: 'ar-MA', fr: 'fr-MA', en: 'en-US', es: 'es-ES', de: 'de-DE' };
  const suffixMap: Record<string, string> = { ar: '/شهر', fr: '/mois', en: '/month', es: '/mes', de: '/Monat' };
  const formatted = new Intl.NumberFormat(localeMap[lang] || 'fr-MA').format(price);
  const currency = lang === 'ar' ? 'درهم' : 'DH';
  const perMonth = type === 'rent' ? (suffixMap[lang] || '/mois') : '';
  return `${formatted} ${currency}${perMonth}`;
}
