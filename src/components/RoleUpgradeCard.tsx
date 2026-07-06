import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';

const RoleUpgradeCard = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const [role, setRole] = useState<'owner' | 'agent' | 'agency'>('owner');
  const [reason, setReason] = useState('');

  const { data: existing } = useQuery({
    queryKey: ['my-role-requests', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('role_requests').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(1);
      return data?.[0] || null;
    },
  });

  if (existing?.status === 'pending') {
    return (
      <div className="glass rounded-2xl p-6 glow-border">
        <p className="text-sm">{t('Votre demande', 'طلبك')} — <b>{existing.requested_role}</b> — {t('est en cours d’examen', 'قيد المراجعة')}.</p>
      </div>
    );
  }

  const submit = async () => {
    if (!user) return;
    const { error } = await supabase.from('role_requests').insert({ user_id: user.id, requested_role: role, reason });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: t('Demande envoyée', 'تم إرسال الطلب') });
    setReason('');
    qc.invalidateQueries({ queryKey: ['my-role-requests'] });
  };

  return (
    <div className="glass rounded-2xl p-6 glow-border space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-display font-bold">{t('Devenir propriétaire / agence', 'كن مالكاً / وكالة')}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{t('Demandez une élévation de rôle pour publier vos biens.', 'اطلب ترقية دورك لنشر عقاراتك.')}</p>
      <Select value={role} onValueChange={(v) => setRole(v as any)}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="owner">{t('Propriétaire', 'مالك')}</SelectItem>
          <SelectItem value="agent">{t('Agent', 'وكيل')}</SelectItem>
          <SelectItem value="agency">{t('Agence', 'وكالة')}</SelectItem>
        </SelectContent>
      </Select>
      <Textarea placeholder={t('Motif (optionnel)', 'السبب (اختياري)')} value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
      <Button onClick={submit} className="glow-primary">{t('Envoyer la demande', 'إرسال الطلب')}</Button>
    </div>
  );
};

export default RoleUpgradeCard;