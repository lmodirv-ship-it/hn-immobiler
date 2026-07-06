import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRevenueSeries } from '@/hooks/useAdminStats';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';

const Analytics = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: series = [] } = useAdminRevenueSeries(12);

  const { data: topProps = [] } = useQuery({
    queryKey: ['admin-top-props'],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('id,title,city,views_count')
        .order('views_count', { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const { data: topCities = [] } = useQuery({
    queryKey: ['admin-top-cities'],
    queryFn: async () => {
      const { data } = await supabase.from('bookings').select('properties(city)').limit(2000);
      const map: Record<string, number> = {};
      (data ?? []).forEach((r: any) => {
        const c = r.properties?.city || '—';
        map[c] = (map[c] || 0) + 1;
      });
      return Object.entries(map).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8);
    },
  });

  return (
    <div className="p-6 space-y-6">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Analytique plateforme', 'تحليلات المنصة')}</span>
      </motion.h1>

      <div className="glass rounded-xl p-4 glow-border">
        <h3 className="font-display text-sm tracking-wider mb-3 text-primary/80">{t('Revenus mensuels', 'الإيرادات الشهرية')}</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={series as any[]}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(0, 7)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-4 glow-border">
          <h3 className="font-display text-sm tracking-wider mb-3 text-primary/80">{t('Villes les plus réservées', 'أكثر المدن حجزاً')}</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topCities as any[]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-xl p-4 glow-border">
          <h3 className="font-display text-sm tracking-wider mb-3 text-primary/80">{t('Top biens (vues)', 'أعلى العقارات مشاهدة')}</h3>
          <ol className="space-y-2 text-sm">
            {(topProps as any[]).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 py-1.5 border-b border-border/40 last:border-0">
                <span className="font-display text-primary w-6">{i + 1}</span>
                <span className="flex-1 truncate">{p.title}</span>
                <span className="text-xs text-muted-foreground">{p.city}</span>
                <span className="font-display text-accent">{p.views_count || 0}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Analytics;