import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Building2, TrendingUp, Shield, Users } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { mockProperties, cities } from '@/lib/data';

const Index = () => {
  const { t, lang } = useLanguage();
  const featuredProperties = mockProperties.filter((p) => p.isFeatured);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight animate-fade-in">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t.hero.subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-4xl mx-auto mt-10 bg-card rounded-xl p-4 shadow-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Select>
                <SelectTrigger className="text-card-foreground">
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
                <SelectTrigger className="text-card-foreground">
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

              <Input
                type="number"
                placeholder={t.search.priceMin}
                className="text-card-foreground"
              />
              <Input
                type="number"
                placeholder={t.search.priceMax}
                className="text-card-foreground"
              />

              <Link to="/properties">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  <Search className="h-4 w-4" />
                  {t.search.search}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Building2, value: '500+', label: lang === 'ar' ? 'عقار' : 'Biens' },
              { icon: Users, value: '200+', label: lang === 'ar' ? 'عميل' : 'Clients' },
              { icon: TrendingUp, value: '95%', label: lang === 'ar' ? 'رضا' : 'Satisfaction' },
              { icon: Shield, value: '10+', label: lang === 'ar' ? 'سنة خبرة' : 'Ans d\'expérience' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-accent" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {t.featured.title}
            </h2>
            <p className="text-muted-foreground mt-2">{t.featured.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="gap-2">
                {t.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent/10">
        <div className="container text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t.cta.title}
          </h2>
          <p className="text-muted-foreground mb-6">{t.cta.subtitle}</p>
          <Link to="/auth">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              {t.cta.button}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
