import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Building2, CalendarCheck2, CreditCard, ShieldCheck, UserPlus } from 'lucide-react';

const AdminHome = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [users, props, bookings, requests, payments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('role_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('payment_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      return {
        users: users.count ?? 0,
        props: props.count ?? 0,
        bookings: bookings.count ?? 0,
        requests: requests.count ?? 0,
        payments: payments.count ?? 0,
      };
    },
  });

  const tiles = [
    { to: '/admin/users', icon: Users, label: t('Utilisateurs', 'المستخدمون'), value: stats?.users ?? 0 },
    { to: '/admin/properties', icon: Building2, label: t('Biens', 'العقارات'), value: stats?.props ?? 0 },
    { to: '/admin/bookings', icon: CalendarCheck2, label: t('Réservations', 'الحجوزات'), value: stats?.bookings ?? 0 },
    { to: '/admin/role-requests', icon: UserPlus, label: t('Demandes de rôle', 'طلبات الأدوار'), value: stats?.requests ?? 0 },
    { to: '/admin/payments', icon: CreditCard, label: t('Paiements', 'المدفوعات'), value: stats?.payments ?? 0 },
  ];

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="font-display text-3xl font-bold"><span className="text-gradient-cyber">{t('Administration', 'لوحة الإدارة')}</span></h1>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((c, i) => (
          <motion.div key={c.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={c.to} className="block glass rounded-xl p-5 glow-border hover:scale-[1.02] transition-transform">
              <c.icon className="h-7 w-7 mb-2 text-primary" />
              <div className="font-display text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider mt-1">{c.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;