import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar as CalIcon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Viewings = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();

  const { data: viewings, isLoading } = useQuery({
    queryKey: ['viewings', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('viewings')
        .select('*, properties(id, title, title_ar, city)')
        .or(`visitor_id.eq.${user!.id},owner_id.eq.${user!.id}`)
        .order('scheduled_at', { ascending: true });
      return data || [];
    },
  });

  const update = async (id: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    const { error } = await supabase.from('viewings').update({ status }).eq('id', id);
    if (error) toast({ title: t('Erreur', 'خطأ'), variant: 'destructive' });
    else { toast({ title: t('Mis à jour', 'تم التحديث') }); qc.invalidateQueries({ queryKey: ['viewings'] }); }
  };

  if (isLoading) return <div className="container py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-6">
        <span className="text-gradient-cyber">{t('Mes visites', 'زياراتي')}</span>
      </motion.h1>
      {!viewings?.length ? (
        <div className="glass rounded-xl p-10 text-center glow-border">
          <CalIcon className="h-12 w-12 mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">{t('Aucune visite planifiée.', 'لا توجد زيارات مجدولة.')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {viewings.map((v: any) => {
            const isOwner = v.owner_id === user?.id;
            const propTitle = (lang === 'ar' && v.properties?.title_ar) ? v.properties.title_ar : v.properties?.title;
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5 glow-border flex items-center justify-between flex-wrap gap-4">
                <div>
                  <Link to={`/properties/${v.property_id}`} className="font-semibold hover:text-primary">{propTitle || 'Propriété'}</Link>
                  <p className="text-sm text-muted-foreground">{v.properties?.city}</p>
                  <p className="text-sm mt-1 flex items-center gap-2">
                    <CalIcon className="h-4 w-4 text-primary" />
                    {new Date(v.scheduled_at).toLocaleString(lang === 'ar' ? 'ar-MA' : 'fr-FR')}
                  </p>
                  {v.notes && <p className="text-xs text-muted-foreground mt-1 italic">{v.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${v.status === 'confirmed' ? 'bg-primary/20 text-primary' : v.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'} border`}>
                    {t(v.status, v.status === 'pending' ? 'قيد الانتظار' : v.status === 'confirmed' ? 'مؤكدة' : v.status === 'cancelled' ? 'ملغاة' : 'مكتملة')}
                  </Badge>
                  {isOwner && v.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => update(v.id, 'confirmed')} className="gap-1 glow-primary"><Check className="h-3 w-3" />{t('Confirmer', 'تأكيد')}</Button>
                      <Button size="sm" variant="outline" onClick={() => update(v.id, 'cancelled')} className="gap-1"><X className="h-3 w-3" />{t('Refuser', 'رفض')}</Button>
                    </>
                  )}
                  {!isOwner && v.status !== 'cancelled' && v.status !== 'completed' && (
                    <Button size="sm" variant="outline" onClick={() => update(v.id, 'cancelled')}>{t('Annuler', 'إلغاء')}</Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Viewings;
