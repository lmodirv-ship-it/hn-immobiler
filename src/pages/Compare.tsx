import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPriceDb, getPrimaryImage, type PropertyWithImages } from '@/lib/property-helpers';

const Compare = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['comparisons', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from('comparisons')
        .select('property_id, properties(*, property_images(*), property_features(*))')
        .eq('user_id', user!.id);
      return (data || []).filter((r: any) => r.properties).map((r: any) => r.properties as PropertyWithImages & { property_features: any });
    },
  });

  const remove = async (pid: string) => {
    await supabase.from('comparisons').delete().eq('user_id', user!.id).eq('property_id', pid);
    qc.invalidateQueries({ queryKey: ['comparisons'] });
  };

  if (isLoading) return <div className="container py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  const rows: Array<[string, (p: any) => any]> = [
    [t('Prix', 'السعر'), (p) => formatPriceDb(Number(p.price), p.transaction_type, lang)],
    [t('Ville', 'المدينة'), (p) => p.city],
    [t('Type', 'النوع'), (p) => p.property_type],
    [t('Surface', 'المساحة'), (p) => p.surface ? `${Number(p.surface)} m²` : '—'],
    [t('Pièces', 'الغرف'), (p) => p.rooms ?? '—'],
    [t('Salles de bain', 'الحمامات'), (p) => p.bathrooms ?? '—'],
    [t('Piscine', 'مسبح'), (p) => p.property_features?.has_pool ? '✓' : '—'],
    [t('Parking', 'موقف'), (p) => p.property_features?.has_parking ? '✓' : '—'],
    [t('Ascenseur', 'مصعد'), (p) => p.property_features?.has_elevator ? '✓' : '—'],
    [t('Meublé', 'مفروش'), (p) => p.property_features?.furnished ? '✓' : '—'],
    [t('Jardin', 'حديقة'), (p) => p.property_features?.has_garden ? '✓' : '—'],
    [t('Climatisation', 'تكييف'), (p) => p.property_features?.has_ac ? '✓' : '—'],
  ];

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
        <GitCompare className="h-8 w-8 text-primary" />
        <span className="text-gradient-cyber">{t('Comparer', 'مقارنة')}</span>
      </motion.h1>
      {!items?.length ? (
        <div className="glass rounded-xl p-10 text-center glow-border">
          <p className="text-muted-foreground mb-4">{t('Aucun bien à comparer. Ajoutez-en depuis une fiche bien.', 'لا توجد عقارات للمقارنة. أضف عقارات من صفحة عقار.')}</p>
          <Link to="/properties"><Button variant="outline" className="glow-border">{t('Parcourir', 'تصفح')}</Button></Link>
        </div>
      ) : (
        <div className="overflow-x-auto glass rounded-xl glow-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-4 font-display text-xs uppercase tracking-wider text-muted-foreground">{t('Caractéristique', 'الميزة')}</th>
                {items.map((p) => (
                  <th key={p.id} className="p-4 min-w-[200px]">
                    <div className="relative">
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="absolute top-0 right-0 h-7 w-7"><X className="h-4 w-4" /></Button>
                      <Link to={`/properties/${p.id}`}>
                        <img src={getPrimaryImage(p as any)} alt={p.title} className="w-full aspect-[4/3] object-cover rounded-lg mb-2" />
                        <p className="font-semibold text-foreground hover:text-primary line-clamp-2">{lang === 'ar' && p.title_ar ? p.title_ar : p.title}</p>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-b border-border/20 hover:bg-secondary/20">
                  <td className="p-3 font-medium text-muted-foreground">{label}</td>
                  {items.map((p) => <td key={p.id} className="p-3 text-center">{fn(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
