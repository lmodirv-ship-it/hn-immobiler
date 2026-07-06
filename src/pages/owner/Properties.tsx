import { useAuth } from '@/hooks/useAuth';
import { useMyProperties } from '@/hooks/useProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2, Trash2, Eye, EyeOff, Building2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { formatPriceDb, getPrimaryImage } from '@/lib/property-helpers';
import { useState, useMemo } from 'react';

const OwnerProperties = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data = [], isLoading } = useMyProperties(user?.id);
  const qc = useQueryClient();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => data.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()) || (p.city || '').toLowerCase().includes(q.toLowerCase())), [data, q]);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    await supabase.from('properties').update({ status: next as any }).eq('id', id);
    qc.invalidateQueries({ queryKey: ['my-properties', user?.id] });
    qc.invalidateQueries({ queryKey: ['properties'] });
    toast({ title: t('Mis à jour', 'تم التحديث') });
  };

  const remove = async (id: string) => {
    if (!confirm(t('Confirmer la suppression ?', 'هل أنت متأكد من الحذف؟'))) return;
    await supabase.from('properties').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['my-properties', user?.id] });
    toast({ title: t('Supprimé', 'حُذف') });
  };

  return (
    <div className="p-6 space-y-4">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold"><span className="text-gradient-cyber">{t('Mes biens', 'عقاراتي')}</span></h1>
        <Link to="/owner/properties/new">
          <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" /> {t('Nouveau bien', 'عقار جديد')}</Button>
        </Link>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Rechercher…', 'ابحث…')} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl glow-border">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">{t('Aucun bien', 'لا توجد عقارات')}</p>
          <Link to="/owner/properties/new"><Button className="gap-2"><Plus className="h-4 w-4" /> {t('Créer', 'إنشاء')}</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="glass rounded-xl p-4 glow-border flex items-center gap-4 flex-wrap">
              <img src={getPrimaryImage(p)} alt="" className="w-24 h-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Link to={`/properties/${p.id}`} className="font-semibold hover:text-primary line-clamp-1">{p.title}</Link>
                  <Badge variant="outline" className={p.status === 'active' ? 'text-primary border-primary/30' : 'text-muted-foreground'}>{p.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{p.city} — {formatPriceDb(Number(p.price), p.transaction_type, lang)}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.views_count} {t('vues', 'مشاهدة')}</div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => toggleStatus(p.id, p.status)}>
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

export default OwnerProperties;