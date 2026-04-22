import { useAuth } from '@/hooks/useAuth';
import { useMyProperties } from '@/hooks/useProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2, Trash2, Eye, EyeOff, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { formatPriceDb, getPrimaryImage } from '@/lib/property-helpers';

const MyProperties = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { data = [], isLoading } = useMyProperties(user?.id);
  const qc = useQueryClient();

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    await supabase.from('properties').update({ status: next as any }).eq('id', id);
    qc.invalidateQueries({ queryKey: ['my-properties', user?.id] });
    qc.invalidateQueries({ queryKey: ['properties'] });
    toast({ title: lang === 'ar' ? 'تم التحديث' : 'Mis à jour' });
  };

  const remove = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Confirmer la suppression ?')) return;
    await supabase.from('properties').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['my-properties', user?.id] });
    toast({ title: lang === 'ar' ? 'حُذف' : 'Supprimé' });
  };

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-gradient-cyber">{lang === 'ar' ? 'عقاراتي' : 'Mes biens'}</span>
        </h1>
        <Link to="/dashboard/properties/new">
          <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" /> {lang === 'ar' ? 'إضافة عقار' : 'Nouveau bien'}</Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl glow-border">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">{lang === 'ar' ? 'ليس لديك عقارات بعد' : 'Aucun bien publié'}</p>
          <Link to="/dashboard/properties/new"><Button className="gap-2"><Plus className="h-4 w-4" /> {lang === 'ar' ? 'أضف الأول' : 'Créer le premier'}</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id} className="glass rounded-xl p-4 glow-border flex items-center gap-4 flex-wrap">
              <img src={getPrimaryImage(p)} alt="" className="w-24 h-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/properties/${p.id}`} className="font-semibold hover:text-primary line-clamp-1">{p.title}</Link>
                  <Badge variant="outline" className={p.status === 'active' ? 'text-primary border-primary/30' : 'text-muted-foreground'}>
                    {p.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{p.city} — {formatPriceDb(Number(p.price), p.transaction_type, lang)}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.views_count} {lang === 'ar' ? 'مشاهدة' : 'vues'}</div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => toggleStatus(p.id, p.status)} title="Toggle">
                  {p.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="destructive" onClick={() => remove(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;