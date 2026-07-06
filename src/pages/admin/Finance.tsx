import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Receipt, Download, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { exportCSV } from '@/lib/export-csv';
import { toast } from 'sonner';

const Finance = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, properties(title,city)')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-invoices'] }); toast.success(t('Facture marquée payée', 'تم وضع علامة مدفوعة')); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => (data as any[]).filter((r) => {
    if (status !== 'all' && r.status !== status) return false;
    if (q && !(r.properties?.title || '').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [data, q, status]);

  const totals = useMemo(() => filtered.reduce((acc, r: any) => {
    acc.total += Number(r.amount || 0);
    if (r.status === 'paid') acc.paid += Number(r.amount || 0);
    else acc.unpaid += Number(r.amount || 0);
    return acc;
  }, { total: 0, paid: 0, unpaid: 0 }), [filtered]);

  const download = () => exportCSV(`admin-invoices-${Date.now()}.csv`, filtered.map((r: any) => ({
    id: r.id, property: r.properties?.title, city: r.properties?.city,
    amount: r.amount, currency: r.currency, status: r.status, due_date: r.due_date, paid_at: r.paid_at,
  })));

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Finance & factures', 'المالية والفواتير')}</span>
      </motion.h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 glow-border"><div className="text-xs text-muted-foreground">{t('Total facturé', 'إجمالي الفواتير')}</div><div className="font-display text-xl">{totals.total.toLocaleString()} MAD</div></div>
        <div className="glass rounded-xl p-4 glow-border"><div className="text-xs text-muted-foreground">{t('Encaissé', 'محصّل')}</div><div className="font-display text-xl text-emerald-500">{totals.paid.toLocaleString()} MAD</div></div>
        <div className="glass rounded-xl p-4 glow-border"><div className="text-xs text-muted-foreground">{t('Impayé', 'غير مدفوع')}</div><div className="font-display text-xl text-destructive">{totals.unpaid.toLocaleString()} MAD</div></div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Input placeholder={t('Rechercher un bien…', 'ابحث عن عقار…')} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('Toutes', 'الكل')}</SelectItem>
            <SelectItem value="unpaid">{t('Impayées', 'غير مدفوعة')}</SelectItem>
            <SelectItem value="paid">{t('Payées', 'مدفوعة')}</SelectItem>
            <SelectItem value="overdue">{t('En retard', 'متأخرة')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={download} className="gap-2 ml-auto"><Download className="h-4 w-4" />CSV</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucune facture', 'لا فواتير')}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r: any) => (
            <div key={r.id} className="glass rounded-xl p-3 glow-border flex flex-wrap items-center gap-3">
              <Receipt className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-[200px]">
                <div className="font-medium">{r.properties?.title || '—'} <span className="text-xs text-muted-foreground">· {r.properties?.city || ''}</span></div>
                <div className="text-xs text-muted-foreground">{r.due_date} · #{String(r.id).slice(0, 8)}</div>
              </div>
              <div className="font-display">{Number(r.amount).toLocaleString()} {r.currency || 'MAD'}</div>
              <Badge variant="outline" className={r.status === 'paid' ? 'text-emerald-500 border-emerald-500/30' : 'text-destructive border-destructive/30'}>{r.status}</Badge>
              {r.status !== 'paid' && (
                <Button size="sm" variant="outline" className="gap-1" onClick={() => markPaid.mutate(r.id)}>
                  <Check className="h-3.5 w-3.5" />{t('Marquer payée', 'وضع مدفوعة')}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Finance;