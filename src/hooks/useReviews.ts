import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type PropertyReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  booking_id: string | null;
  property_id: string | null;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
};

export const usePropertyReviews = (propertyId?: string) =>
  useQuery({
    queryKey: ['reviews', 'property', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, reviewer_id, booking_id, property_id, profiles:reviewer_id(full_name, avatar_url)')
        .eq('property_id', propertyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PropertyReview[];
    },
  });

export const usePropertyRatingSummary = (propertyId?: string) =>
  useQuery({
    queryKey: ['reviews', 'summary', propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('property_id', propertyId!);
      if (error) throw error;
      const rows = data ?? [];
      const count = rows.length;
      const avg = count ? rows.reduce((s, r: any) => s + Number(r.rating), 0) / count : 0;
      return { count, avg };
    },
  });

export const useMyReviewableBookings = (userId?: string) =>
  useQuery({
    queryKey: ['reviews', 'reviewable', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, property_id, check_out, properties(title, title_ar)')
        .eq('guest_id', userId!)
        .eq('status', 'completed');
      if (error) throw error;
      return data ?? [];
    },
  });

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { propertyId: string; bookingId?: string; reviewedId?: string; rating: number; comment: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const reviewer_id = userData.user?.id;
      if (!reviewer_id) throw new Error('Not authenticated');
      const { error } = await supabase.from('reviews').insert({
        reviewer_id,
        reviewed_id: input.reviewedId ?? reviewer_id,
        property_id: input.propertyId,
        booking_id: input.bookingId ?? null,
        rating: input.rating,
        comment: input.comment,
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast({ title: 'Merci pour votre avis / شكراً لتقييمك' });
      qc.invalidateQueries({ queryKey: ['reviews', 'property', v.propertyId] });
      qc.invalidateQueries({ queryKey: ['reviews', 'summary', v.propertyId] });
      qc.invalidateQueries({ queryKey: ['reviews', 'reviewable'] });
    },
    onError: (e: any) => toast({ title: e.message || 'Erreur', variant: 'destructive' }),
  });
};