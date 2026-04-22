import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PropertyWithImages } from '@/lib/property-helpers';

export interface PropertyFilters {
  transaction?: 'all' | 'sale' | 'rent';
  propertyType?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let q = supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false });

      if (filters.transaction && filters.transaction !== 'all') q = q.eq('transaction_type', filters.transaction);
      if (filters.propertyType && filters.propertyType !== 'all') q = q.eq('property_type', filters.propertyType as any);
      if (filters.city && filters.city !== 'all') q = q.eq('city', filters.city);
      if (filters.minPrice) q = q.gte('price', filters.minPrice);
      if (filters.maxPrice) q = q.lte('price', filters.maxPrice);
      if (filters.minRooms) q = q.gte('rooms', filters.minRooms);

      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as PropertyWithImages[];
    },
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ['property', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*), profiles!properties_owner_id_fkey(full_name, phone, avatar_url, verified)')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data as (PropertyWithImages & { profiles: any }) | null;
    },
  });
}

export function useMyProperties(userId: string | undefined) {
  return useQuery({
    queryKey: ['my-properties', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('owner_id', userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as PropertyWithImages[];
    },
  });
}

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ['favorites', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id, properties(*, property_images(*))')
        .eq('user_id', userId!);
      if (error) throw error;
      return (data || []).filter((r) => r.properties).map((r) => r.properties as PropertyWithImages);
    },
  });
}