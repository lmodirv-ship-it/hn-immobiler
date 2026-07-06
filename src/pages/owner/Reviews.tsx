import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Star, Loader2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const OwnerReviews = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const [replies, setReplies] = useState<Record<string, string>>({});

  const { data = [], isLoading } = useQuery({
    queryKey: ['owner-reviews', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: props } = await supabase.from('properties').select('id,title').eq('owner_id', user!.id);
      const ids = (props || []).map((p) => p.id);
      if (!ids.length) return [];
      const { data } = await supabase.from('reviews').select('*').in('property_id', ids).order('created_at', { ascending: false });
      return (data || []).map((r) => ({ ...r, propertyTitle: props?.find((p) => p.id === r.property_id)?.title }));
    },
  });

  const sendReply = async (id: string) => {
    const reply = (replies[id] || '').trim();
    if (!reply) return;
    const { error } = await supabase.from('reviews').update({ owner_reply: reply, owner_reply_at: new Date().toISOString() }).eq('id', id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: t('Réponse publiée', 'تم نشر الرد') });
    setReplies((r) => ({ ...r, [id]: '' }));
    qc.invalidateQueries({ queryKey: ['owner-reviews'] });
  };

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Avis clients', 'تقييمات العملاء')}</span>
      </motion.h1>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucun avis pour le moment', 'لا توجد تقييمات بعد')}</div>
      ) : (
        <div className="space-y-3">
          {data.map((r: any) => (
            <div key={r.id} className="glass rounded-xl p-4 glow-border">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="font-semibold">{r.propertyTitle || '—'}</div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= r.rating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground mb-2">{r.comment}</p>}
              {r.owner_reply ? (
                <div className="glass rounded-lg p-3 border-l-2 border-primary mt-2">
                  <div className="text-xs text-primary mb-1 font-semibold">{t('Votre réponse', 'ردك')}</div>
                  <p className="text-sm">{r.owner_reply}</p>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Textarea rows={2} placeholder={t('Répondre publiquement…', 'رد علنياً…')} value={replies[r.id] || ''} onChange={(e) => setReplies({ ...replies, [r.id]: e.target.value })} />
                  <Button size="sm" onClick={() => sendReply(r.id)} className="gap-1 self-end"><Reply className="h-3.5 w-3.5" />{t('Envoyer', 'إرسال')}</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerReviews;