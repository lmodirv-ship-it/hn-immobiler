import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useOwnerStats(userId?: string) {
  const q = useQuery({
    queryKey: ['owner-stats', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_owner_stats', { _owner: userId! });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`owner-stats-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `host_id=eq.${userId}` }, () => q.refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return q;
}

export function useOwnerRevenueSeries(userId?: string, months = 6) {
  return useQuery({
    queryKey: ['owner-revenue', userId, months],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_owner_revenue_series', { _owner: userId!, _months: months });
      if (error) throw error;
      return data ?? [];
    },
  });
}