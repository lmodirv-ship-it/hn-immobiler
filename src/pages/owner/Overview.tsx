import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOwnerStats, useOwnerRevenueSeries } from '@/hooks/useOwnerStats';
import { motion } from 'framer-motion';
import { DollarSign, CalendarCheck2, Percent, Star, Building2, MessageSquare, Loader2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const KpiCard = ({ icon: Icon, label, value, suffix = '', color = 'text-primary', to }: any) => (
  <Link to={to} className="glass rounded-xl p-5 glow-border hover:scale-[1.02] transition-transform block">
    <Icon className={`h-6 w-6 mb-2 ${color}`} />
    <div className="font-display text-2xl font-bold text-foreground">{value}{suffix}</div>
    <div className="text-xs text-muted-foreground mt-1 tracking-wider">{label}</div>
  </Link>
);

const Overview = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: stats, isLoading } = useOwnerStats(user?.id);
  const { data: series = [] } = useOwnerRevenueSeries(user?.id, 6);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const chartData = series.map((r: any) => ({
    month: new Date(r.month).toLocaleDateString(lang === 'ar' ? 'ar' : 'fr', { month: 'short' }),
    revenue: Number(r.revenue),
    bookings: Number(r.bookings),
  }));

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">
          <span className="text-gradient-cyber">{t('Vue d’ensemble', 'نظرة عامة')}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('Vos performances en temps réel', 'أداؤك في الوقت الفعلي')}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={DollarSign} color="text-gradient-gold" label={t('Revenus du mois (MAD)', 'إيرادات الشهر (درهم)')} value={Number(stats?.month_revenue || 0).toLocaleString()} to="/owner/analytics" />
        <KpiCard icon={CalendarCheck2} color="text-yellow-500" label={t('Réservations en attente', 'حجوزات معلقة')} value={stats?.pending_bookings || 0} to="/owner/bookings" />
        <KpiCard icon={Percent} color="text-primary" label={t('Taux d’occupation', 'معدل الإشغال')} value={Number(stats?.occupancy_rate || 0).toFixed(0)} suffix="%" to="/owner/calendar" />
        <KpiCard icon={Star} color="text-accent" label={t('Note moyenne', 'التقييم المتوسط')} value={Number(stats?.avg_rating || 0).toFixed(1)} suffix=" / 5" to="/owner/reviews" />
        <KpiCard icon={Building2} label={t('Biens actifs', 'العقارات النشطة')} value={stats?.total_properties || 0} to="/owner/properties" />
        <KpiCard icon={CalendarCheck2} color="text-emerald-500" label={t('Réservations confirmées', 'حجوزات مؤكدة')} value={stats?.confirmed_bookings || 0} to="/owner/bookings" />
        <KpiCard icon={MessageSquare} color="text-primary" label={t('Messages non lus', 'رسائل غير مقروءة')} value={stats?.unread_messages || 0} to="/owner/messages" />
        <KpiCard icon={Star} label={t('Total avis', 'إجمالي التقييمات')} value={stats?.total_reviews || 0} to="/owner/reviews" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display font-bold">{t('Revenus (6 mois)', 'الإيرادات (٦ أشهر)')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5 glow-border">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck2 className="h-5 w-5 text-accent" />
            <h2 className="font-display font-bold">{t('Réservations par mois', 'الحجوزات شهرياً')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;