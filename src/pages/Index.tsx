import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, Building2, TrendingUp, Shield, Users, ArrowRight, Zap, Sparkles, Cpu, Globe2,
  Home, Trees, Briefcase, MapPin, Star, ChevronRight, Bot, Calculator, Eye, Heart,
  BadgeCheck, Quote, PlayCircle, Layers,
} from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import DbPropertyCard from '@/components/DbPropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { cities } from '@/lib/data';
import heroFuture from '@/assets/hero-future.jpg';

const Index = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const { data: allProps = [] } = useProperties();
  const featuredProperties = allProps.filter((p) => p.featured).slice(0, 6);
  const [tab, setTab] = useState<'sale' | 'rent'>('sale');

  // Parallax mouse tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Scroll-driven hero
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);

  // Live counter
  const [liveCount, setLiveCount] = useState(847);
  useEffect(() => {
    const i = setInterval(() => setLiveCount((c) => c + Math.floor(Math.random() * 3)), 2500);
    return () => clearInterval(i);
  }, []);

  const propertyTypes = [
    { icon: Building2, fr: 'Appartement', ar: 'شقة', count: '2,340' },
    { icon: Home, fr: 'Villa', ar: 'فيلا', count: '892' },
    { icon: Home, fr: 'Maison', ar: 'منزل', count: '1,156' },
    { icon: Trees, fr: 'Terrain', ar: 'أرض', count: '478' },
    { icon: Briefcase, fr: 'Commercial', ar: 'تجاري', count: '321' },
    { icon: Layers, fr: 'Riad', ar: 'رياض', count: '167' },
  ];

  const moroccanCities = [
    { fr: 'Casablanca', ar: 'الدار البيضاء', img: 'https://images.unsplash.com/photo-1577147414-79d0fe9b6018?w=600&q=80', count: 1240 },
    { fr: 'Marrakech', ar: 'مراكش', img: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80', count: 980 },
    { fr: 'Tanger', ar: 'طنجة', img: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?w=600&q=80', count: 650 },
    { fr: 'Rabat', ar: 'الرباط', img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80', count: 720 },
    { fr: 'Fès', ar: 'فاس', img: 'https://images.unsplash.com/photo-1531230112057-1d9ed2935a3f?w=600&q=80', count: 430 },
    { fr: 'Agadir', ar: 'أكادير', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', count: 580 },
  ];

  const services = [
    { icon: Bot, fr: 'Assistant IA 24/7', ar: 'مساعد ذكي 24/7', desc_fr: 'Chatbot intelligent qui répond instantanément', desc_ar: 'روبوت محادثة يجيب فورًا' },
    { icon: Calculator, fr: 'Simulateur de Crédit', ar: 'محاكي القرض العقاري', desc_fr: 'Calcul précis avec banques marocaines', desc_ar: 'حساب دقيق مع البنوك المغربية' },
    { icon: Eye, fr: 'Visite Virtuelle 3D', ar: 'جولة افتراضية ثلاثية الأبعاد', desc_fr: 'Découvrez sans vous déplacer', desc_ar: 'اكتشف دون تنقل' },
    { icon: BadgeCheck, fr: 'Annonces Vérifiées', ar: 'إعلانات موثقة', desc_fr: 'Chaque bien contrôlé manuellement', desc_ar: 'كل عقار مفحوص يدوياً' },
    { icon: TrendingUp, fr: 'Estimation Auto', ar: 'تقدير تلقائي للسعر', desc_fr: 'Prix du marché en temps réel', desc_ar: 'سعر السوق في الوقت الفعلي' },
    { icon: MapPin, fr: 'Carte Interactive', ar: 'خريطة تفاعلية', desc_fr: 'Explorez par quartier', desc_ar: 'استكشف حسب الحي' },
  ];

  const testimonials = [
    { name: 'Yassine El Amrani', role_fr: 'Acquéreur, Casablanca', role_ar: 'مشتري، الدار البيضاء', text_fr: 'Plateforme exceptionnelle, j\'ai trouvé mon appartement en 3 jours.', text_ar: 'منصة استثنائية، وجدت شقتي في 3 أيام.', rating: 5 },
    { name: 'Fatima Zahra Bennani', role_fr: 'Propriétaire, Marrakech', role_ar: 'مالكة، مراكش', text_fr: 'Mon riad a été loué en 48h. Service premium.', text_ar: 'تم تأجير الرياض في 48 ساعة. خدمة ممتازة.', rating: 5 },
    { name: 'Karim Idrissi', role_fr: 'Investisseur, Rabat', role_ar: 'مستثمر، الرباط', text_fr: 'L\'IA m\'a recommandé exactement ce que je cherchais.', text_ar: 'الذكاء الاصطناعي اقترح علي بالضبط ما أبحث عنه.', rating: 5 },
  ];

  return (
    <div className="flex flex-col">
      {/* ============ HERO CINEMATIC ============ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
        style={{ perspective: 1200 }}
      >
        {/* Background layers */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img src={heroFuture} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </motion.div>

        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Floating orbs */}
        <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[25%] right-[18%] w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-glow-pulse" />
        </motion.div>

        {/* Orbiting dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          <div className="relative w-0 h-0">
            <div className="absolute orbit"><div className="w-2 h-2 rounded-full bg-primary glow-primary" /></div>
            <div className="absolute orbit" style={{ animationDelay: '-7s' }}><div className="w-1.5 h-1.5 rounded-full bg-accent glow-accent" /></div>
            <div className="absolute orbit" style={{ animationDelay: '-14s' }}><div className="w-1 h-1 rounded-full bg-primary" /></div>
          </div>
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass glow-border text-[10px] font-display tracking-[0.25em] text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {isAr ? 'الجيل القادم من العقارات' : 'NEXT-GEN REAL ESTATE'}
              </div>
              <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/30 text-[10px] font-display tracking-[0.25em] text-accent">
                <Eye className="h-3 w-3" />
                {liveCount.toLocaleString()} {isAr ? 'متصل الآن' : 'EN LIGNE'}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold leading-[0.95] tracking-tight"
            >
              <span className="block text-4xl md:text-6xl lg:text-7xl text-foreground">
                {isAr ? 'عقارك المثالي' : 'Votre futur'}
              </span>
              <span className="block text-5xl md:text-7xl lg:text-8xl text-gradient-cyber my-2">
                {isAr ? 'يبدأ هنا' : 'commence ici'}
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl text-gradient-gold mt-2">
                {isAr ? '— في قلب المغرب —' : '— au cœur du Maroc —'}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {isAr
                ? 'أكثر من 5,000 عقار، ذكاء اصطناعي متقدم، وخريطة تفاعلية لكل مدن المملكة.'
                : 'Plus de 5 000 biens, IA avancée et carte interactive pour toutes les villes du Royaume.'}
            </motion.p>

            {/* Mega search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              {/* Tabs */}
              <div className="flex justify-center gap-1 mb-3">
                {(['sale', 'rent'] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTab(k)}
                    className={`px-6 py-2 rounded-t-xl text-[11px] font-display tracking-[0.2em] transition-all ${
                      tab === k
                        ? 'glass glow-border text-primary border-b-0'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {k === 'sale' ? (isAr ? 'شراء' : 'ACHETER') : (isAr ? 'إيجار' : 'LOUER')}
                  </button>
                ))}
                <Link
                  to="/properties?new=1"
                  className="px-6 py-2 rounded-t-xl text-[11px] font-display tracking-[0.2em] text-accent hover:text-accent/80 transition-all flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {isAr ? 'جديد' : 'NEUF'}
                </Link>
              </div>

              <div className="glass-strong rounded-2xl p-3 glow-border shimmer">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-4 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
                    <Input
                      list="cities-list"
                      placeholder={isAr ? 'المدينة، الحي، أو الكود البريدي...' : 'Ville, quartier, ou code postal...'}
                      className="bg-secondary/50 border-border/50 pl-10 h-12 text-sm"
                    />
                    <datalist id="cities-list">
                      {cities.map((c) => <option key={c.fr} value={isAr ? c.ar : c.fr} />)}
                    </datalist>
                  </div>
                  <div className="md:col-span-3">
                    <select className="w-full h-12 rounded-md bg-secondary/50 border border-border/50 px-3 text-sm text-foreground">
                      <option>{isAr ? 'كل الأنواع' : 'Tous types'}</option>
                      <option>{isAr ? 'شقة' : 'Appartement'}</option>
                      <option>{isAr ? 'فيلا' : 'Villa'}</option>
                      <option>{isAr ? 'منزل' : 'Maison'}</option>
                      <option>{isAr ? 'أرض' : 'Terrain'}</option>
                    </select>
                  </div>
                  <Input type="number" placeholder={isAr ? 'الحد الأدنى' : 'Min DH'} className="md:col-span-2 bg-secondary/50 border-border/50 h-12" />
                  <Input type="number" placeholder={isAr ? 'الحد الأقصى' : 'Max DH'} className="md:col-span-2 bg-secondary/50 border-border/50 h-12" />
                  <Link to="/properties" className="md:col-span-1">
                    <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 glow-primary">
                      <Search className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 px-1">
                  <span className="text-[10px] font-display tracking-widest text-muted-foreground">
                    {isAr ? 'بحث سريع:' : 'RAPIDE :'}
                  </span>
                  {(isAr
                    ? ['فيلا بمراكش', 'شقة الدار البيضاء', 'رياض فاس', 'أرض طنجة']
                    : ['Villa Marrakech', 'Appart Casablanca', 'Riad Fès', 'Terrain Tanger']
                  ).map((q) => (
                    <Link key={q} to="/properties" className="text-[10px] px-2 py-1 rounded-full glass border border-primary/20 text-primary hover:glow-primary transition-all">
                      {q}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] font-display tracking-widest text-muted-foreground pt-4"
            >
              <span className="flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5 text-primary" />{isAr ? '100% موثق' : '100% VÉRIFIÉ'}</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" />{isAr ? 'دفع آمن' : 'PAIEMENT SÉCURISÉ'}</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent" />{isAr ? '4.9/5 تقييم' : '4.9/5 ÉTOILES'}</span>
              <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-primary" />FR · AR</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-display tracking-[0.3em] text-muted-foreground">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* ============ PROPERTY TYPES ============ */}
      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-[10px] font-display tracking-[0.3em] text-primary mb-2">
              {isAr ? '— استكشف —' : '— EXPLOREZ —'}
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
              <span className="text-foreground">{isAr ? 'كل أنواع' : 'Tous les types de'}</span>{' '}
              <span className="text-gradient-cyber">{isAr ? 'العقارات' : 'biens'}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyTypes.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <Link to="/properties" className="block group">
                  <div className="holo-card rounded-2xl p-5 text-center hover:glow-primary transition-all duration-500 hover:-translate-y-1">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <p.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="font-display text-xs tracking-wider text-foreground">
                      {isAr ? p.ar : p.fr}
                    </div>
                    <div className="text-[10px] text-accent font-display mt-1">{p.count}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MOROCCAN CITIES SHOWCASE ============ */}
      <section className="py-20 relative overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <div className="text-[10px] font-display tracking-[0.3em] text-accent mb-2">
                {isAr ? '— مدن المملكة —' : '— VILLES DU ROYAUME —'}
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                <span className="text-gradient-gold">{isAr ? 'المغرب' : 'Le Maroc'}</span>{' '}
                <span className="text-foreground">{isAr ? 'بأكمله بين يديك' : 'à portée de main'}</span>
              </h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="glow-border font-display text-[10px] tracking-widest gap-2">
                {isAr ? 'كل المدن' : 'TOUTES LES VILLES'}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {moroccanCities.map((c, i) => (
              <motion.div
                key={c.fr}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              >
                <Link to={`/properties?city=${c.fr}`} className="block group">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glow-border hover:glow-primary transition-all duration-500">
                    <img src={c.img} alt={c.fr} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <div className="font-display text-base font-bold text-foreground tracking-wide">
                        {isAr ? c.ar : c.fr}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-display tracking-wider text-primary">
                          {c.count} {isAr ? 'عقار' : 'BIENS'}
                        </span>
                        <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 glass px-2 py-0.5 rounded-full text-[9px] font-display tracking-widest text-accent border border-accent/30">
                      LIVE
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES / FEATURES ============ */}
      <section className="py-20 relative">
        <div className="neon-line mb-20" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <div className="text-[10px] font-display tracking-[0.3em] text-primary mb-2">
              {isAr ? '— خدماتنا —' : '— NOS SERVICES —'}
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-4">
              <span className="text-foreground">{isAr ? 'تكنولوجيا' : 'La technologie'}</span>{' '}
              <span className="text-gradient-cyber">{isAr ? 'في خدمتك' : 'à votre service'}</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'أدوات متقدمة لتجربة عقارية لا مثيل لها' : 'Des outils avancés pour une expérience immobilière inégalée'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="holo-card rounded-2xl p-6 corner-brackets group hover:glow-primary transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-wider text-foreground mb-2">{isAr ? s.ar : s.fr}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{isAr ? s.desc_ar : s.desc_fr}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS LIVE ============ */}
      <section className="py-16 relative">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, value: '5,000+', label: isAr ? 'عقار نشط' : 'Biens actifs' },
              { icon: Users, value: '12,500+', label: isAr ? 'عميل سعيد' : 'Clients satisfaits' },
              { icon: TrendingUp, value: '98%', label: isAr ? 'معدل النجاح' : 'Taux de réussite' },
              { icon: Heart, value: '4.9/5', label: isAr ? 'تقييم المستخدمين' : 'Note utilisateurs' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center holo-card rounded-2xl p-6 corner-brackets"
              >
                <s.icon className="h-7 w-7 mx-auto text-primary mb-3" />
                <div className="font-display text-2xl md:text-3xl font-bold text-glitch">{s.value}</div>
                <div className="text-[10px] text-muted-foreground mt-2 font-display tracking-widest uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROPERTIES ============ */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-end justify-between mb-12 flex-wrap gap-4"
          >
            <div>
              <div className="text-[10px] font-display tracking-[0.3em] text-accent mb-2">
                {isAr ? '— الأكثر تميزاً —' : '— TOP SÉLECTION —'}
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
                <span className="text-gradient-cyber">{t.featured.title}</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-2">{t.featured.subtitle}</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="glow-border font-display text-[10px] tracking-widest gap-2">
                {isAr ? 'كل العقارات' : 'TOUS LES BIENS'}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p, i) => (
              <DbPropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI HIGHLIGHT ============ */}
      <section className="py-20 relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <div className="text-[10px] font-display tracking-[0.3em] text-primary mb-3">
                {isAr ? '— ذكاء اصطناعي —' : '— ARTIFICIAL INTELLIGENCE —'}
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-5">
                <span className="text-foreground">{isAr ? 'مساعدك العقاري' : 'Votre assistant'}</span>
                <br />
                <span className="text-gradient-cyber">{isAr ? 'الذكي' : 'immobilier IA'}</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {isAr
                  ? 'يطرح عليك الأسئلة المناسبة، يحلل تفضيلاتك، ويقترح العقارات المثالية. متاح 24/7 بالعربية والفرنسية.'
                  : 'Il vous pose les bonnes questions, analyse vos préférences et suggère les biens parfaits. Disponible 24/7 en français et arabe.'}
              </p>
              <div className="space-y-3 mb-8">
                {[
                  isAr ? 'توصيات مخصصة بناءً على ذوقك' : 'Recommandations personnalisées',
                  isAr ? 'تقدير فوري لأسعار السوق' : 'Estimation instantanée du marché',
                  isAr ? 'مقارنة ذكية بين العقارات' : 'Comparaison intelligente',
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <BadgeCheck className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">{f}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/80 glow-primary font-display text-xs tracking-widest gap-2">
                <Bot className="h-4 w-4" />
                {isAr ? 'جرب المساعد الذكي' : 'ESSAYER L\'IA'}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative"
            >
              <div className="holo-card rounded-3xl p-6 scan-overlay glow-primary">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-display text-[10px] tracking-widest text-primary">HN.AI • {isAr ? 'متصل' : 'ONLINE'}</span>
                </div>
                <div className="space-y-3">
                  <div className="glass rounded-xl rounded-tl-none p-3 max-w-[85%]">
                    <p className="text-xs text-foreground">
                      {isAr ? 'مرحباً 👋 ما نوع العقار الذي تبحث عنه؟' : 'Bonjour 👋 Quel type de bien recherchez-vous ?'}
                    </p>
                  </div>
                  <div className="glass rounded-xl rounded-tr-none p-3 max-w-[85%] ml-auto bg-primary/10 border-primary/30">
                    <p className="text-xs text-foreground">
                      {isAr ? 'فيلا بمراكش، 4 غرف، حديقة' : 'Villa à Marrakech, 4 chambres, jardin'}
                    </p>
                  </div>
                  <div className="glass rounded-xl rounded-tl-none p-3 max-w-[90%]">
                    <p className="text-xs text-foreground mb-2">
                      {isAr ? 'ممتاز! لدي 23 عقاراً يطابق معاييرك. الميزانية؟' : 'Parfait ! 23 biens correspondent. Budget ?'}
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {['< 3M', '3-5M', '5-8M', '8M+'].map((b) => (
                        <span key={b} className="text-[10px] px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-display">
                          {b} DH
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                    <span className="text-[10px] text-muted-foreground ml-2 font-display">{isAr ? 'يكتب...' : 'écrit...'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="text-[10px] font-display tracking-[0.3em] text-accent mb-2">
              {isAr ? '— شهادات —' : '— TÉMOIGNAGES —'}
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
              <span className="text-foreground">{isAr ? 'يتحدثون' : 'Ils parlent'}</span>{' '}
              <span className="text-gradient-gold">{isAr ? 'عنا' : 'de nous'}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="holo-card rounded-2xl p-6 relative"
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">
                  "{isAr ? t.text_ar : t.text_fr}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-display text-sm font-bold text-background">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground font-display tracking-wider">
                      {isAr ? t.role_ar : t.role_fr}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 relative">
        <div className="neon-line mb-20" />
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="glass-strong rounded-3xl p-10 md:p-20 text-center max-w-4xl mx-auto glow-border relative overflow-hidden noise-overlay"
          >
            <div className="absolute inset-0 particle-bg opacity-30" />
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <Sparkles className="h-10 w-10 text-accent mx-auto mb-6 animate-glow-pulse" />
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {isAr ? 'هل أنت مالك أو وكيل؟' : 'Propriétaire ou agent ?'}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {isAr
                  ? 'انشر عقاراتك مجاناً وصل إلى آلاف المشترين والمستأجرين الجادين كل يوم.'
                  : 'Publiez vos biens gratuitement et touchez des milliers d\'acheteurs et locataires sérieux chaque jour.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/auth">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/80 glow-accent font-display text-xs tracking-[0.2em] gap-2">
                    <PlayCircle className="h-4 w-4" />
                    {isAr ? 'ابدأ مجاناً' : 'COMMENCER'}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="glow-border font-display text-xs tracking-[0.2em]">
                    {isAr ? 'تواصل معنا' : 'NOUS CONTACTER'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
