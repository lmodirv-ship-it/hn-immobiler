import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-gradient-cyber">{t.contact.title}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{t.contact.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass rounded-2xl p-6 glow-border space-y-4">
            <Input placeholder={t.contact.name} className="bg-secondary/50 border-border/50" />
            <Input type="email" placeholder={t.contact.email} className="bg-secondary/50 border-border/50" />
            <Input type="tel" placeholder={t.contact.phone} className="bg-secondary/50 border-border/50" />
            <Textarea placeholder={t.contact.message} rows={6} className="bg-secondary/50 border-border/50" />
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-primary font-display text-xs tracking-wider">
              {t.contact.send}
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
          {[
            { icon: MapPin, label: t.contact.address, value: t.contact.addressValue },
            { icon: Phone, label: t.contact.phone, value: t.contact.phoneValue },
            { icon: Mail, label: t.contact.email, value: t.contact.emailValue },
            { icon: Clock, label: lang === 'ar' ? 'ساعات العمل' : 'Horaires', value: lang === 'ar' ? 'الاثنين - السبت: 9:00 - 18:00' : 'Lun - Sam : 9h00 - 18h00' },
          ].map((item, i) => (
            <div key={i} className="glass rounded-xl p-4 glow-border flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{item.label}</div>
                <div className="text-muted-foreground text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
