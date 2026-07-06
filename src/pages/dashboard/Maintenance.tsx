import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMaintenance, useCreateMaintenance, useUpdateMaintenance } from '@/hooks/useMaintenance';
import { useMyProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Wrench } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

const ItemRow = ({ m, canManage, onStatus }: any) => (
  <div className="glass rounded-xl p-4 glow-border">
    <div className="flex items-start gap-3">
      <Wrench className="h-5 w-5 text-primary mt-1" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{m.title}</div>
        <div className="text-xs text-muted-foreground">{m.properties?.title} · {m.properties?.city}</div>
        {m.description && <p className="text-sm mt-2 text-muted-foreground">{m.description}</p>}
        <div className="mt-2 flex gap-2 items-center flex-wrap">
          <Badge>{m.priority}</Badge>
          {canManage ? (
            <Select value={m.status} onValueChange={(v) => onStatus(m.id, v)}>
              <SelectTrigger className="w-40 h-7 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          ) : <Badge variant="outline">{m.status}</Badge>}
        </div>
      </div>
    </div>
  </div>
);

const Maintenance = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: received = [], isLoading: l1 } = useMaintenance(user?.id, 'owner');
  const { data: mine = [], isLoading: l2 } = useMaintenance(user?.id, 'requester');
  const { data: props = [] } = useMyProperties(user?.id);
  const create = useCreateMaintenance();
  const update = useUpdateMaintenance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ property_id: '', title: '', description: '', priority: 'normal' });

  const submit = async () => {
    if (!form.property_id || !form.title) return toast({ title: 'Erreur', description: 'Champs requis', variant: 'destructive' });
    await create.mutateAsync({ ...form, requester_id: user!.id });
    toast({ title: t('Demande envoyée', 'تم إرسال الطلب') });
    setOpen(false);
    setForm({ property_id: '', title: '', description: '', priority: 'normal' });
  };

  const setStatus = (id: string, status: string) => update.mutate({ id, patch: { status, resolved_at: status === 'completed' ? new Date().toISOString() : null } });

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold"><span className="text-gradient-cyber">{t('Maintenance', 'الصيانة')}</span></h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" />{t('Nouvelle demande', 'طلب جديد')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t('Nouvelle demande', 'طلب جديد')}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                <SelectTrigger><SelectValue placeholder={t('Bien', 'العقار')} /></SelectTrigger>
                <SelectContent>{props.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder={t('Titre', 'العنوان')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder={t('Description', 'الوصف')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('Basse', 'منخفضة')}</SelectItem>
                  <SelectItem value="normal">{t('Normale', 'عادية')}</SelectItem>
                  <SelectItem value="high">{t('Haute', 'عالية')}</SelectItem>
                  <SelectItem value="urgent">{t('Urgente', 'عاجلة')}</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={submit} disabled={create.isPending} className="w-full">{create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Envoyer', 'إرسال')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">{t('Reçues', 'الواردة')}</TabsTrigger>
          <TabsTrigger value="sent">{t('Envoyées', 'المرسلة')}</TabsTrigger>
        </TabsList>
        <TabsContent value="received" className="space-y-2">
          {l1 ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> : received.length === 0 ? <p className="text-center text-muted-foreground py-8 glass rounded-xl">—</p> : received.map((m: any) => <ItemRow key={m.id} m={m} canManage onStatus={setStatus} />)}
        </TabsContent>
        <TabsContent value="sent" className="space-y-2">
          {l2 ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> : mine.length === 0 ? <p className="text-center text-muted-foreground py-8 glass rounded-xl">—</p> : mine.map((m: any) => <ItemRow key={m.id} m={m} canManage={false} onStatus={setStatus} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Maintenance;