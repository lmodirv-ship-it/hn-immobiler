import type { Database } from '@/integrations/supabase/types';

export type DbProperty = Database['public']['Tables']['properties']['Row'];
export type DbImage = Database['public']['Tables']['property_images']['Row'];

export type PropertyWithImages = DbProperty & {
  property_images: DbImage[];
};

export function formatPriceDb(price: number, transaction: 'sale' | 'rent', lang: 'fr' | 'ar'): string {
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA').format(price);
  const currency = lang === 'ar' ? 'درهم' : 'MAD';
  const suffix = transaction === 'rent' ? (lang === 'ar' ? '/شهر' : '/mois') : '';
  return `${formatted} ${currency}${suffix}`;
}

export function getPrimaryImage(p: PropertyWithImages): string {
  const primary = p.property_images?.find((i) => i.is_primary) || p.property_images?.[0];
  return primary?.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200';
}

export const PROPERTY_TYPES = ['apartment', 'villa', 'house', 'land', 'commercial', 'office', 'riad', 'studio'] as const;
export const TRANSACTION_TYPES = ['sale', 'rent'] as const;
export const MOROCCAN_CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Tétouan', 'Kénitra'];