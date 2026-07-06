import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Calendar, Building2, Plus, LogOut, CreditCard, ShieldCheck, CalendarCheck2, BarChart3, Receipt, Wrench } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RoleUpgradeCard from '@/components/RoleUpgradeCard';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

const Dashboard = () => {
  const { user, signOut, isOwner, isAdmin } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { unread } = useUnreadMessages(user?.id);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [favs, msgs, props, views] = await Promise.all([
        supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user!.id),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', user!.id),
        supabase.from('viewings').select('*', { count: 'exact', head: true }).eq('visitor_id', user!.id),
      ]);
      return { favs: favs.count ?? 0, msgs: msgs.count ?? 0, props: props.count ?? 0, views: views.count ?? 0 };
    },
  });

  const sections: { title: string; cards: any[] }[] = [
    {
      title: t('Général', 'عام'),
      cards: [
        { to: '/favorites', icon: Heart, label: t('Mes favoris', 'مفضلتي'), value: stats?.favs ?? 0 },
        { to: '/dashboard/messages', icon: MessageSquare, label: t('Messages', 'الرسائل'), value: stats?.msgs ?? 0, badge: unread },
        { to: '/compare', icon: BarChart3, label: t('Comparer', 'مقارنة'), value: '' },
      ],
    },
    {
      title: t('Locataire / Séjours', 'كمستأجر'),
      cards: [
        { to: '/dashboard/bookings', icon: CalendarCheck2, label: t('Réservations', 'الحجوزات'), value: '' },
        { to: '/dashboard/viewings', icon: Calendar, label: t('Visites', 'الزيارات'), value: stats?.views ?? 0 },
        { to: '/dashboard/invoices', icon: Receipt, label: t('Factures', 'الفواتير'), value: '' },
      ],
    },
  ];
  if (isOwner) {
    sections.push({
      title: t('Propriétaire', 'كمالك'),
      cards: [
        { to: '/dashboard/properties', icon: Building2, label: t('Mes biens', 'عقاراتي'), value: stats?.props ?? 0 },
        { to: '/dashboard/analytics', icon: BarChart3, label: t('Analytique', 'التحليلات'), value: '' },
        { to: '/dashboard/maintenance', icon: Wrench, label: t('Maintenance', 'الصيانة'), value: '' },
      ],
    });
  }
  if (isAdmin) {
    sections.push({
      title: t('Administration', 'الإدارة'),
      cards: [
        { to: '/admin', icon: ShieldCheck, label: t('Panneau admin', 'لوحة الإدارة'), value: '' },
        { to: '/admin/role-requests', icon: ShieldCheck, label: t('Demandes de rôle', 'طلبات الأدوار'), value: '' },
        { to: '/admin/payments', icon: CreditCard, label: t('Paiements', 'المدفوعات'), value: '' },
      ],
    });
  }

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            <span className="text-gradient-cyber">{t('Tableau de bord', 'لوحة التحكم')}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{user?.email}</p>
        </div>
        <Button variant="ghost" onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" /> {t('Déconnexion', 'خروج')}
        </Button>
      </motion.div>

      <div className="space-y-8 mb-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xs tracking-widest uppercase text-primary/80 mb-3">{section.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.cards.map((c, i) => (
                <motion.div key={c.to} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={c.to} className="relative block glass rounded-xl p-5 glow-border hover:scale-[1.02] transition-transform">
                    <c.icon className="h-7 w-7 mb-2 text-primary" />
                    {c.badge ? (
                      <span className="absolute top-2 right-2 min-w-[22px] h-[22px] px-1.5 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center animate-pulse">
                        {c.badge}
                      </span>
                    ) : null}
                    <div className="font-display text-2xl font-bold text-foreground">{c.value}</div>
                    <div className="text-xs text-muted-foreground tracking-wider mt-1">{c.label}</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isOwner ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-strong rounded-2xl p-6 glow-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-xl"><span className="text-gradient-gold">{t('Mes biens', 'عقاراتي')}</span></h2>
            <div className="flex gap-2">
              <Link to="/dashboard/properties"><Button variant="outline">{t('Voir tout', 'عرض الكل')}</Button></Link>
              <Link to="/dashboard/properties/new">
                <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" /> {t('Ajouter', 'إضافة')}</Button>
              </Link>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{t('Gérez vos annonces, suivez les visites et messages.', 'أدر إعلاناتك وتابع الزيارات والرسائل.')}</p>
        </motion.div>
      ) : (
        <RoleUpgradeCard />
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Link to="/pricing" className="glass rounded-xl p-5 glow-border hover:scale-[1.01] transition-transform flex items-center gap-4">
          <CreditCard className="h-8 w-8 text-accent" />
          <div className="flex-1">
            <div className="font-display font-bold">{t('Abonnements & Tarifs', 'الاشتراكات والأسعار')}</div>
            <div className="text-xs text-muted-foreground">{t('Choisir ou changer de plan', 'اختر أو غيّر الباقة')}</div>
          </div>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="glass rounded-xl p-5 glow-border hover:scale-[1.01] transition-transform flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <div className="font-display font-bold">{t('Administration', 'لوحة الإدارة')}</div>
              <div className="text-xs text-muted-foreground">{t('Utilisateurs, biens, réservations…', 'المستخدمون والعقارات والحجوزات…')}</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;