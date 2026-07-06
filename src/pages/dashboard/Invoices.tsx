import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInvoices, useCreateInvoice, useUpdateInvoice } from '@/hooks/useInvoices';
import { useMyProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Check, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportCSV } from '@/lib/export-csv';

const InvoiceList = ({ items, canMarkPaid, onPay }: any) => (
  <div className="space-y-2">
    {items.length === 0 && <p className="text-center text-muted-foreground py-8 glass rounded-xl">—</p>}
    {items.map((inv: any) => (
      <div key={inv.id} className="glass rounded-xl p-4 glow-border flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold">{inv.properties?.title || inv.property_id.slice(0, 8)}</div>
          <div className="text-xs text-muted-foreground">{inv.description || inv.type}</div>
          <div className="mt-1 flex gap-2 items-center">
            <Badge variant="outline">{inv.type}</Badge>
            <Badge variant={inv.status === 'paid' ? 'default' : 'destructive'}>{inv.status}</Badge>
            <span className="text-xs text-muted-foreground">{inv.due_date}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-bold text-gradient-gold">{Number(inv.amount).toLocaleString()} {inv.currency}</div>
          {canMarkPaid && inv.status !== 'paid' && (
            <Button size="sm" className="mt-2 gap-1" onClick={() => onPay(inv.id)}><Check className="h-3.5 w-3.5" />Marquer payé</Button>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Invoices = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: owned = [], isLoading: l1 } = useInvoices(user?.id, 'owner');
  const { data: mine = [], isLoading: l2 } = useInvoices(user?.id, 'tenant');
  const { data: props = [] } = useMyProperties(user?.id);
  const create = useCreateInvoice();
  const update = useUpdateInvoice();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ property_id: '', tenant_id: '', type: 'rent', amount: '', due_date: '', description: '' });

  const submit = async () => {
    if (!form.property_id || !form.amount || !form.due_date) return toast({ title: 'Erreur', description: 'Champs requis', variant: 'destructive' });
    await create.mutateAsync({
      property_id: form.property_id,
      tenant_id: form.tenant_id || null,
      type: form.type,
      amount: Number(form.amount),
      due_date: form.due_date,
      description: form.description,
      owner_id: user!.id,
    });
    toast({ title: t('Facture créée', 'تم إنشاء الفاتورة') });
    setOpen(false);
    setForm({ property_id: '', tenant_id: '', type: 'rent', amount: '', due_date: '', description: '' });
  };

  const markPaid = (id: string) => update.mutate({ id, patch: { status: 'paid', paid_at: new Date().toISOString() } });

  const exportAll = () =>
    exportCSV(`invoices-${Date.now()}.csv`, owned.map((i: any) => ({
      id: i.id, property: i.properties?.title, type: i.type, amount: i.amount,
      currency: i.currency, due_date: i.due_date, status: i.status, paid_at: i.paid_at,
    })));

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold"><span className="text-gradient-cyber">{t('Factures', 'الفواتير')}</span></h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAll} className="gap-2"><Download className="h-4 w-4" />CSV</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" />{t('Nouvelle facture', 'فاتورة جديدة')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{t('Nouvelle facture', 'فاتورة جديدة')}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder={t('Bien', 'العقار')} /></SelectTrigger>
                  <SelectContent>{props.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">{t('Loyer', 'إيجار')}</SelectItem>
                    <SelectItem value="water">{t('Eau', 'الماء')}</SelectItem>
                    <SelectItem value="electricity">{t('Électricité', 'الكهرباء')}</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="other">{t('Autre', 'أخرى')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder={t('Montant', 'المبلغ')} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                <Input placeholder={t('ID locataire (optionnel)', 'معرف المستأجر (اختياري)')} value={form.tenant_id} onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} />
                <Textarea placeholder={t('Description', 'الوصف')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Button onClick={submit} disabled={create.isPending} className="w-full">{create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Créer', 'إنشاء')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="owner">
        <TabsList>
          <TabsTrigger value="owner">{t('Émises', 'الصادرة')}</TabsTrigger>
          <TabsTrigger value="tenant">{t('À payer', 'المستحقة')}</TabsTrigger>
        </TabsList>
        <TabsContent value="owner">
          {l1 ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> : <InvoiceList items={owned} canMarkPaid onPay={markPaid} />}
        </TabsContent>
        <TabsContent value="tenant">
          {l2 ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> : <InvoiceList items={mine} canMarkPaid onPay={markPaid} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoices;