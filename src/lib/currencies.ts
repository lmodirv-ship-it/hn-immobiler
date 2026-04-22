export type CurrencyCode = 'MAD' | 'EUR' | 'USD' | 'GBP' | 'AED' | 'SAR';

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  flag: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  MAD: { code: 'MAD', symbol: 'DH', name_fr: 'Dirham marocain', name_en: 'Moroccan Dirham', name_ar: 'درهم مغربي', flag: '🇲🇦', locale: 'fr-MA' },
  EUR: { code: 'EUR', symbol: '€',  name_fr: 'Euro',            name_en: 'Euro',             name_ar: 'يورو',         flag: '🇪🇺', locale: 'fr-FR' },
  USD: { code: 'USD', symbol: '$',  name_fr: 'Dollar US',       name_en: 'US Dollar',        name_ar: 'دولار أمريكي', flag: '🇺🇸', locale: 'en-US' },
  GBP: { code: 'GBP', symbol: '£',  name_fr: 'Livre sterling',  name_en: 'British Pound',    name_ar: 'جنيه إسترليني', flag: '🇬🇧', locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'د.إ', name_fr: 'Dirham EAU',      name_en: 'UAE Dirham',       name_ar: 'درهم إماراتي',   flag: '🇦🇪', locale: 'ar-AE' },
  SAR: { code: 'SAR', symbol: '﷼',  name_fr: 'Riyal saoudien',  name_en: 'Saudi Riyal',      name_ar: 'ريال سعودي',     flag: '🇸🇦', locale: 'ar-SA' },
};

// Country (ISO-2) → suggested currency
export const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  MA: 'MAD',
  FR: 'EUR', BE: 'EUR', LU: 'EUR', NL: 'EUR', DE: 'EUR', IT: 'EUR', ES: 'EUR', PT: 'EUR', AT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR',
  US: 'USD', CA: 'USD',
  GB: 'GBP',
  AE: 'AED', QA: 'AED', KW: 'AED', BH: 'AED', OM: 'AED',
  SA: 'SAR',
};

// Country → suggested language
export const COUNTRY_TO_LANG: Record<string, 'fr' | 'ar' | 'en' | 'es' | 'de'> = {
  MA: 'ar', DZ: 'ar', TN: 'ar', EG: 'ar', SA: 'ar', AE: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar',
  JO: 'ar', LB: 'ar', SY: 'ar', IQ: 'ar', YE: 'ar', PS: 'ar', LY: 'ar', SD: 'ar', MR: 'ar',
  FR: 'fr', BE: 'fr', LU: 'fr', CH: 'fr', CA: 'fr', SN: 'fr', CI: 'fr', ML: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', CL: 'es', VE: 'es',
  DE: 'de', AT: 'de',
  US: 'en', GB: 'en', IE: 'en', AU: 'en', NZ: 'en', IN: 'en', ZA: 'en', NG: 'en',
};
