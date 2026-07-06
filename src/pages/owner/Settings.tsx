import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const [form, setForm] = useState({ full_name: '', phone: '', bio: '', avatar_url: '' });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (data) setForm({ full_name: data.full_name || '', phone: data.phone || '', bio: data.bio || '', avatar_url: data.avatar_url || '' });
  }, [data]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update(form).eq('id', user!.id);
    setSaving(false);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: t('Enregistré', 'تم الحفظ') });
    qc.invalidateQueries({ queryKey: ['profile'] });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Paramètres', 'الإعدادات')}</span>
      </motion.h1>
      <div className="glass rounded-2xl p-6 glow-border space-y-4">
        <div>
          <Label>{t('Nom complet', 'الاسم الكامل')}</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </div>
        <div>
          <Label>{t('Téléphone', 'الهاتف')}</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <Label>{t('Photo (URL)', 'الصورة (رابط)')}</Label>
          <Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
        </div>
        <div>
          <Label>{t('Bio', 'نبذة')}</Label>
          <Textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <Button onClick={save} disabled={saving} className="glow-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Enregistrer', 'حفظ')}
        </Button>
      </div>
    </div>
  );
};

export default Settings;