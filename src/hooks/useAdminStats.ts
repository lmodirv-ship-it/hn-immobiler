import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStats() {
  const q = useQuery({
    queryKey: ['admin-stats-v2'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel('admin-stats-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => q.refetch())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => q.refetch())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_requests' }, () => q.refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return q;
}

export function useAdminRevenueSeries(months = 12) {
  return useQuery({
    queryKey: ['admin-revenue', months],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_revenue_series', { _months: months });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAdminAuditLog(limit = 100) {
  return useQuery({
    queryKey: ['admin-audit', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}