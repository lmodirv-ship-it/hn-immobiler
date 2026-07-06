import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useInvoices(userId?: string, role: 'owner' | 'tenant' = 'owner') {
  return useQuery({
    queryKey: ['invoices', role, userId],
    enabled: !!userId,
    queryFn: async () => {
      const col = role === 'owner' ? 'owner_id' : 'tenant_id';
      const { data, error } = await supabase
        .from('invoices')
        .select('*, properties(title,city)')
        .eq(col, userId!)
        .order('due_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      property_id: string;
      tenant_id?: string | null;
      type: string;
      amount: number;
      currency?: string;
      description?: string;
      due_date: string;
      owner_id: string;
    }) => {
      const { error } = await supabase.from('invoices').insert(p);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from('invoices').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}