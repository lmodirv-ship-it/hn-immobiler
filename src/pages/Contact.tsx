import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const { t, lang } = useLanguage();

  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {t.contact.title}
        </h1>
        <p className="text-muted-foreground mt-2">{t.contact.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Form */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input placeholder={t.contact.name} />
            <Input type="email" placeholder={t.contact.email} />
            <Input type="tel" placeholder={t.contact.phone} />
            <Textarea placeholder={t.contact.message} rows={6} />
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {t.contact.send}
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: MapPin, label: t.contact.address, value: t.contact.addressValue },
            { icon: Phone, label: t.contact.phone, value: t.contact.phoneValue },
            { icon: Mail, label: t.contact.email, value: t.contact.emailValue },
            { icon: Clock, label: lang === 'ar' ? 'ساعات العمل' : 'Horaires', value: lang === 'ar' ? 'الاثنين - السبت: 9:00 - 18:00' : 'Lun - Sam : 9h00 - 18h00' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <item.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{item.label}</div>
                <div className="text-muted-foreground">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
