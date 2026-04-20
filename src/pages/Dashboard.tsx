import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Calendar, Building2, BarChart3, Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, isOwner } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  const cards = [
    { to: '/favorites', icon: Heart, label: t('Mes favoris', 'مفضلتي'), color: 'text-rose-400' },
    { to: '/messages', icon: MessageSquare, label: t('Messages', 'الرسائل'), color: 'text-cyan-400' },
    { to: '/viewings', icon: Calendar, label: t('Mes visites', 'زياراتي'), color: 'text-amber-400' },
    { to: '/compare', icon: BarChart3, label: t('Comparaison', 'مقارنة'), color: 'text-violet-400' },
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
              <c.icon className={`h-7 w-7 mb-2 ${c.color}`} />
              <div className="font-display text-sm tracking-wider">{c.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {isOwner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-strong rounded-2xl p-6 glow-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl"><span className="text-gradient-gold">{t('Mes biens', 'عقاراتي')}</span></h2>
            <Link to="/dashboard/properties/new">
              <Button className="gap-2 glow-primary"><Plus className="h-4 w-4" /> {t('Ajouter', 'إضافة')}</Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">{t('Gérez vos annonces, suivez les visites et messages.', 'أدر إعلاناتك وتابع الزيارات والرسائل.')}</p>
        </motion.div>
      )}

      {!isOwner && (
        <div className="glass rounded-2xl p-6 glow-border text-center">
          <Building2 className="h-10 w-10 text-primary mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">{t('Vous êtes propriétaire ou agence ? Activez le mode propriétaire pour publier vos biens.', 'هل أنت مالك أو وكالة؟ فعّل وضع المالك لنشر عقاراتك.')}</p>
          <Button variant="outline" className="glow-border">{t('Devenir propriétaire', 'كن مالكاً')}</Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;