import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import DbPropertyCard from '@/components/DbPropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const Favorites = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { data = [], isLoading } = useFavorites(user?.id);
  const qc = useQueryClient();

  const remove = async (propertyId: string) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', propertyId);
    qc.invalidateQueries({ queryKey: ['favorites', user.id] });
    toast({ title: lang === 'ar' ? 'أُزيل من المفضلة' : 'Retiré des favoris' });
  };

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl md:text-3xl font-bold mb-8">
        <span className="text-gradient-cyber">{lang === 'ar' ? 'مفضلتي' : 'Mes favoris'}</span>
      </motion.h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl glow-border">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">{lang === 'ar' ? 'لم تُضف أي عقار للمفضلة بعد' : 'Aucun bien favori pour le moment'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p, i) => (
            <DbPropertyCard key={p.id} property={p} index={i} onRemove={() => remove(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;