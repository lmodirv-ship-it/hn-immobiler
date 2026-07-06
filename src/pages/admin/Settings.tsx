import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('platform_settings').select('*').maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const patch = {
        platform_name: form.platform_name,
        base_currency: form.base_currency,
        default_commission_pct: Number(form.default_commission_pct),
        vat_pct: Number(form.vat_pct),
        contact_email: form.contact_email,
        support_phone: form.support_phone,
        maintenance_mode: !!form.maintenance_mode,
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('platform_settings').update(patch).eq('id', true);
      if (error) throw error;
      await supabase.from('admin_audit_log').insert({
        admin_id: user!.id, action: 'update_platform_settings', entity_type: 'platform_settings', metadata: patch as any,
      });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['platform-settings'] }); toast.success(t('Paramètres enregistrés', 'تم حفظ الإعدادات')); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-6 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Paramètres de la plateforme', 'إعدادات المنصة')}</span>
      </motion.h1>

      <div className="glass rounded-xl p-6 glow-border space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>{t('Nom', 'الاسم')}</Label><Input value={form.platform_name || ''} onChange={(e) => setForm({ ...form, platform_name: e.target.value })} /></div>
          <div><Label>{t('Devise', 'العملة')}</Label><Input value={form.base_currency || ''} onChange={(e) => setForm({ ...form, base_currency: e.target.value })} /></div>
          <div><Label>{t('Commission par défaut (%)', 'العمولة الافتراضية (%)')}</Label><Input type="number" step="0.1" value={form.default_commission_pct ?? ''} onChange={(e) => setForm({ ...form, default_commission_pct: e.target.value })} /></div>
          <div><Label>{t('TVA (%)', 'ضريبة القيمة المضافة (%)')}</Label><Input type="number" step="0.1" value={form.vat_pct ?? ''} onChange={(e) => setForm({ ...form, vat_pct: e.target.value })} /></div>
          <div><Label>{t('Email de contact', 'بريد التواصل')}</Label><Input value={form.contact_email || ''} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></div>
          <div><Label>{t('Téléphone support', 'هاتف الدعم')}</Label><Input value={form.support_phone || ''} onChange={(e) => setForm({ ...form, support_phone: e.target.value })} /></div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border/40">
          <div>
            <Label className="text-base">{t('Mode maintenance', 'وضع الصيانة')}</Label>
            <p className="text-xs text-muted-foreground">{t('Affiche une bannière sur toute la plateforme.', 'يعرض شعاراً في كل الموقع.')}</p>
          </div>
          <Switch checked={!!form.maintenance_mode} onCheckedChange={(v) => setForm({ ...form, maintenance_mode: v })} />
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending} className="glow-primary gap-2">
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {t('Enregistrer', 'حفظ')}
        </Button>
      </div>
    </div>
  );
};

export default Settings;