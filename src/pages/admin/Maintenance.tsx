import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Maintenance = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, properties(title,city)')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('maintenance_requests').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-maintenance'] }); toast.success(t('Mis à jour', 'تم التحديث')); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Maintenance (plateforme)', 'الصيانة (المنصة)')}</span>
      </motion.h1>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucune demande', 'لا طلبات')}</div>
      ) : (
        <div className="space-y-3">
          {(data as any[]).map((r) => (
            <div key={r.id} className="glass rounded-xl p-4 glow-border flex flex-wrap items-start gap-3">
              <Wrench className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1 min-w-[220px]">
                <div className="font-medium">{r.properties?.title || '—'} · <span className="text-xs text-muted-foreground">{r.properties?.city}</span></div>
                <div className="text-sm mt-1">{r.description}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <Badge variant="outline">{r.priority || 'normal'}</Badge>
              <Select value={r.status} onValueChange={(v) => setStatus.mutate({ id: r.id, status: v })}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('En attente', 'معلق')}</SelectItem>
                  <SelectItem value="in_progress">{t('En cours', 'قيد التنفيذ')}</SelectItem>
                  <SelectItem value="completed">{t('Terminé', 'مكتمل')}</SelectItem>
                  <SelectItem value="cancelled">{t('Annulé', 'ملغى')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Maintenance;