import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Calendar, Building2, Plus, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, signOut, isOwner } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

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

  const cards = [
    { to: '/favorites', icon: Heart, label: t('Mes favoris', 'مفضلتي'), value: stats?.favs ?? 0 },
    { to: '/dashboard/properties', icon: Building2, label: t('Mes biens', 'عقاراتي'), value: stats?.props ?? 0 },
    { to: '/dashboard/messages', icon: MessageSquare, label: t('Messages', 'الرسائل'), value: stats?.msgs ?? 0 },
    { to: '/dashboard/viewings', icon: Calendar, label: t('Visites', 'الزيارات'), value: stats?.views ?? 0 },
  ];

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c, i) => (
          <motion.div key={c.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={c.to} className="block glass rounded-xl p-5 glow-border hover:scale-[1.02] transition-transform">
              <c.icon className="h-7 w-7 mb-2 text-primary" />
              <div className="font-display text-2xl font-bold text-foreground">{c.value}</div>
              <div className="text-xs text-muted-foreground tracking-wider mt-1">{c.label}</div>
            </Link>
          </motion.div>
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
        <div className="glass rounded-2xl p-6 glow-border text-center">
          <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">{t('Vous êtes propriétaire ou agence ? Activez le mode propriétaire pour publier vos biens.', 'هل أنت مالك أو وكالة؟ فعّل وضع المالك لنشر عقاراتك.')}</p>
          <Link to="/dashboard/properties/new"><Button variant="outline" className="glow-border">{t('Publier un bien', 'نشر عقار')}</Button></Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;