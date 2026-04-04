import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, HeartHandshake } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Shield, title: t.about.trust, desc: t.about.trustText },
    { icon: Award, title: t.about.quality, desc: t.about.qualityText },
    { icon: HeartHandshake, title: t.about.service, desc: t.about.serviceText },
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {t.about.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.about.subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">{t.about.mission}</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{t.about.missionText}</p>
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground text-center mb-8">
          {t.about.values}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {values.map((v, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
