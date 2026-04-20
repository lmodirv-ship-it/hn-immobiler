import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Building2, TrendingUp, Shield, Users, ArrowRight, Zap, Play, Sparkles, Cpu, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties, cities } from '@/lib/data';
import heroFuture from '@/assets/hero-future.jpg';
import showcaseVideo from '@/assets/showcase-video.mp4.asset.json';

const Index = () => {
  const { t, lang } = useLanguage();
  const featuredProperties = mockProperties.filter((p) => p.isFeatured);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={heroFuture}
            alt="Futuristic Moroccan villa"
            className="w-full h-full object-cover opacity-30"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] animate-glow-pulse" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass glow-border text-xs font-display tracking-widest text-primary mb-6">
                <Zap className="h-3 w-3" />
                {lang === 'ar' ? 'منصة العقارات المستقبلية' : 'PLATEFORME IMMOBILIÈRE DU FUTUR'}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
            >
              <span className="text-foreground">{lang === 'ar' ? 'اعثر على' : 'Trouvez votre'}</span>
              <br />
              <span className="text-gradient-cyber">{lang === 'ar' ? 'عقارك المثالي' : 'bien immobilier'}</span>
              <br />
              <span className="text-gradient-gold">{lang === 'ar' ? 'في المغرب' : 'idéal au Maroc'}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass rounded-2xl p-4 glow-border max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Select>
                  <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                    <SelectValue placeholder={t.search.allCities} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.fr} value={c.fr}>
                        {lang === 'ar' ? c.ar : c.fr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="bg-secondary/50 border-border/50 text-foreground">
                    <SelectValue placeholder={t.search.allTypes} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">{t.property.apartment}</SelectItem>
                    <SelectItem value="villa">{t.property.villa}</SelectItem>
                    <SelectItem value="house">{t.property.house}</SelectItem>
                    <SelectItem value="land">{t.property.land}</SelectItem>
                    <SelectItem value="commercial">{t.property.commercial}</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="number" placeholder={t.search.priceMin} className="bg-secondary/50 border-border/50" />
                <Input type="number" placeholder={t.search.priceMax} className="bg-secondary/50 border-border/50" />

                <Link to="/properties">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-primary gap-2 font-display text-xs tracking-wider">
                    <Search className="h-4 w-4" />
                    {t.search.search}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="neon-line mb-16" />
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, value: '500+', label: lang === 'ar' ? 'عقار' : 'Biens' },
              { icon: Users, value: '200+', label: lang === 'ar' ? 'عميل' : 'Clients' },
              { icon: TrendingUp, value: '95%', label: lang === 'ar' ? 'رضا' : 'Satisfaction' },
              { icon: Shield, value: '10+', label: lang === 'ar' ? 'سنة خبرة' : 'Ans d\'expérience' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center glass rounded-xl p-6 glow-border"
              >
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 font-display tracking-wider uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              <span className="text-gradient-cyber">{t.featured.title}</span>
            </h2>
            <p className="text-muted-foreground mt-3">{t.featured.subtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="glow-border hover:glow-primary gap-2 font-display text-xs tracking-wider">
                {t.hero.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="neon-line mb-16" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-10 md:p-16 text-center max-w-3xl mx-auto glow-border relative overflow-hidden"
          >
            <div className="absolute inset-0 particle-bg opacity-30" />
            <div className="relative z-10">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4 tracking-tight">
                {t.cta.title}
              </h2>
              <p className="text-muted-foreground mb-8">{t.cta.subtitle}</p>
              <Link to="/auth">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/80 glow-accent font-display text-xs tracking-widest">
                  {t.cta.button}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
