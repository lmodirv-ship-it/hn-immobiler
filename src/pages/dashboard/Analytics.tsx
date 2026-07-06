import { useAuth } from '@/hooks/useAuth';
import { useMyProperties } from '@/hooks/useProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageSquare, TrendingUp, Loader2, CalendarCheck2, DollarSign } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: props = [] } = useMyProperties(user?.id);

  const { data: stats } = useQuery({
    queryKey: ['owner-analytics', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const ids = props.map((p) => p.id);
      const [favs, msgs, bookings] = await Promise.all([
        ids.length ? supabase.from('favorites').select('*', { count: 'exact', head: true }).in('property_id', ids) : { count: 0 },
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user!.id),
        supabase.from('bookings').select('total_price,status,currency').eq('host_id', user!.id),
      ]);
      const revenue = (bookings.data || []).filter((b: any) => ['confirmed', 'completed'].includes(b.status)).reduce((s: number, b: any) => s + Number(b.total_price), 0);
      const confirmed = (bookings.data || []).filter((b: any) => ['confirmed', 'completed'].includes(b.status)).length;
      return { favs: favs.count ?? 0, msgs: msgs.count ?? 0, bookings: bookings.data?.length ?? 0, confirmed, revenue };
    },
  });

  const totalViews = props.reduce((s, p) => s + (p.views_count || 0), 0);

  const cards = [
    { icon: Eye, label: t('Vues totales', 'إجمالي المشاهدات'), value: totalViews, color: 'text-primary' },
    { icon: Heart, label: t('Favoris', 'المفضلة'), value: stats?.favs ?? 0, color: 'text-destructive' },
    { icon: MessageSquare, label: t('Messages', 'الرسائل'), value: stats?.msgs ?? 0, color: 'text-accent' },
    { icon: CalendarCheck2, label: t('Réservations', 'الحجوزات'), value: stats?.bookings ?? 0, color: 'text-emerald-500' },
    { icon: TrendingUp, label: t('Confirmées', 'المؤكدة'), value: stats?.confirmed ?? 0, color: 'text-yellow-500' },
    { icon: DollarSign, label: t('Revenus (MAD)', 'الإيرادات (درهم)'), value: (stats?.revenue ?? 0).toLocaleString(), color: 'text-gradient-gold' },
  ];

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-8">
        <span className="text-gradient-cyber">{t('Analytique', 'التحليلات')}</span>
      </motion.h1>

      {!stats ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 glow-border">
              <c.icon className={`h-6 w-6 mb-2 ${c.color}`} />
              <div className={`font-display text-2xl font-bold ${c.color.includes('gradient') ? c.color : 'text-foreground'}`}>{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="glass-strong rounded-2xl p-6 glow-border">
        <h2 className="font-display text-xl mb-4"><span className="text-gradient-gold">{t('Performance par bien', 'الأداء لكل عقار')}</span></h2>
        <div className="space-y-2">
          {props.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40">
              <div className="min-w-0 flex-1">
                <div className="font-medium line-clamp-1">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.city}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views_count || 0}</span>
                <span className="text-xs text-muted-foreground">{p.status}</span>
              </div>
            </div>
          ))}
          {props.length === 0 && <p className="text-muted-foreground text-center py-4">{t('Aucun bien publié', 'لا توجد عقارات')}</p>}
        </div>
      </div>
    </div>
  );
};

export default Analytics;