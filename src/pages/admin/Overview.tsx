import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdminStats, useAdminRevenueSeries } from '@/hooks/useAdminStats';
import {
  Users, Building2, CalendarCheck2, Wrench, Receipt, TrendingUp, AlertTriangle, Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';

const Overview = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: s } = useAdminStats();
  const { data: series = [] } = useAdminRevenueSeries(12);

  const kpi = [
    { icon: Users, label: t('Utilisateurs', 'المستخدمون'), value: s?.total_users ?? 0, to: '/admin/users', color: 'text-primary' },
    { icon: Building2, label: t('Biens', 'العقارات'), value: s?.total_properties ?? 0, to: '/admin/properties', color: 'text-accent' },
    { icon: AlertTriangle, label: t('Biens en attente', 'عقارات معلقة'), value: s?.pending_properties ?? 0, to: '/admin/properties', color: 'text-yellow-500', alert: true },
    { icon: CalendarCheck2, label: t('Réservations aujourd’hui', 'حجوزات اليوم'), value: s?.bookings_today ?? 0, to: '/admin/bookings', color: 'text-emerald-500' },
    { icon: TrendingUp, label: t('Revenus du mois', 'إيرادات الشهر'), value: `${Number(s?.revenue_month ?? 0).toLocaleString()} MAD`, to: '/admin/analytics', color: 'text-gradient-gold' },
    { icon: Wrench, label: t('Maintenance ouverte', 'صيانة مفتوحة'), value: s?.open_maintenance ?? 0, to: '/admin/maintenance', color: 'text-orange-500', alert: (s?.open_maintenance ?? 0) > 0 },
    { icon: Receipt, label: t('Factures impayées', 'فواتير غير مدفوعة'), value: s?.unpaid_invoices ?? 0, to: '/admin/finance', color: 'text-destructive', alert: (s?.unpaid_invoices ?? 0) > 0 },
    { icon: Sparkles, label: t('Propriétaires', 'الملاك'), value: s?.total_owners ?? 0, to: '/admin/users', color: 'text-primary' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">
          <span className="text-gradient-cyber">{t('Centre de commande', 'مركز القيادة')}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('Vue temps réel de toute la plateforme HN Immobilier.', 'عرض لحظي لكامل منصة HN Immobilier.')}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpi.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={k.to} className="block glass rounded-xl p-4 glow-border hover:scale-[1.02] transition-transform relative overflow-hidden">
              <k.icon className={`h-6 w-6 mb-2 ${k.color}`} />
              <div className="font-display text-2xl font-bold">{k.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider mt-1">{k.label}</div>
              {k.alert && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-xl p-4 glow-border">
          <h3 className="font-display text-sm tracking-wider mb-3 text-primary/80">
            {t('Revenus – 12 derniers mois', 'الإيرادات — آخر 12 شهراً')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={series as any[]}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(0, 7)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-xl p-4 glow-border">
          <h3 className="font-display text-sm tracking-wider mb-3 text-primary/80">
            {t('Réservations – 12 derniers mois', 'الحجوزات — آخر 12 شهراً')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={series as any[]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(0, 7)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;