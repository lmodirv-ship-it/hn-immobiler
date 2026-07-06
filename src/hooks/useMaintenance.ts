import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMaintenance(userId?: string, role: 'owner' | 'requester' = 'owner') {
  return useQuery({
    queryKey: ['maintenance', role, userId],
    enabled: !!userId,
    queryFn: async () => {
      const col = role === 'owner' ? 'owner_id' : 'requester_id';
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, properties(title,city)')
        .eq(col, userId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      property_id: string;
      requester_id: string;
      title: string;
      description?: string;
      photo_url?: string;
      priority?: string;
    }) => {
      const { error } = await supabase.from('maintenance_requests').insert(p);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });
}

export function useUpdateMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from('maintenance_requests').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });
}