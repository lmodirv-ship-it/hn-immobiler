import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CreditCard, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Payouts = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Paiements & versements', 'المدفوعات والتحويلات')}</span>
      </motion.h1>
      <div className="glass rounded-2xl p-6 glow-border space-y-3">
        <CreditCard className="h-8 w-8 text-primary" />
        <p className="text-sm">{t(
          'Les versements sont effectués via l’équipe HN Immobilier après chaque séjour confirmé. Contactez-nous pour ajouter votre RIB / IBAN.',
          'تتم التحويلات عبر فريق HN بعد كل إقامة مؤكدة. اتصل بنا لإضافة RIB / IBAN الخاص بك.'
        )}</p>
        <Link to="/contact"><Button className="glow-primary">{t('Nous contacter', 'اتصل بنا')}</Button></Link>
      </div>
      <div className="glass rounded-xl p-4 glow-border flex gap-3 items-start">
        <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{t(
          'Frais de service : 8% par réservation. Aucun frais fixe mensuel.',
          'رسوم الخدمة: ٨٪ لكل حجز. لا رسوم شهرية ثابتة.'
        )}</p>
      </div>
    </div>
  );
};

export default Payouts;