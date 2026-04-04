import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Shield, title: t.about.trust, desc: t.about.trustText },
    { icon: Award, title: t.about.quality, desc: t.about.qualityText },
    { icon: HeartHandshake, title: t.about.service, desc: t.about.serviceText },
  ];

  return (
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-gradient-cyber">{t.about.title}</span>
        </h1>
        <p className="text-muted-foreground mt-2">{t.about.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-8 md:p-12 glow-border max-w-3xl mx-auto mb-16"
      >
        <h2 className="font-display text-lg font-bold text-primary mb-4 tracking-tight">{t.about.mission}</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{t.about.missionText}</p>
      </motion.div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground text-center mb-8 tracking-tight">
          <span className="text-gradient-gold">{t.about.values}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-xl p-6 text-center glow-border hover:glow-primary transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
