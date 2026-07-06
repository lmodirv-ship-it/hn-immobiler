import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMyBookings(userId: string | undefined, role: 'guest' | 'host' = 'guest') {
  return useQuery({
    queryKey: ['bookings', role, userId],
    enabled: !!userId,
    queryFn: async () => {
      const col = role === 'guest' ? 'guest_id' : 'host_id';
      const { data, error } = await supabase
        .from('bookings')
        .select('*, properties(id,title,city,currency,property_images(url,is_primary))')
        .eq(col, userId!)
        .order('check_in', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, properties(title,city)')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, payment_status }: { id: string; status?: string; payment_status?: string }) => {
      const patch: any = {};
      if (status) patch.status = status;
      if (payment_status) patch.payment_status = payment_status;
      const { error } = await supabase.from('bookings').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      property_id: string;
      guest_id: string;
      check_in: string;
      check_out: string;
      guests: number;
      price_per_night: number;
      total_price: number;
      currency?: string;
      special_requests?: string;
    }) => {
      const { data, error } = await supabase.from('bookings').insert(payload).select().maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}