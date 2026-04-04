import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockProperties, formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Maximize2, BedDouble, Star, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const property = mockProperties.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <p className="text-xl text-muted-foreground">{lang === 'ar' ? 'العقار غير موجود' : 'Bien introuvable'}</p>
        <Link to="/properties"><Button variant="outline" className="mt-4 glow-border">{t.nav.properties}</Button></Link>
      </div>
    );
  }

  const title = lang === 'ar' ? property.titleAr : property.title;
  const description = lang === 'ar' ? property.descriptionAr : property.description;
  const city = lang === 'ar' ? property.cityAr : property.city;

  return (
    <div className="container py-10">
      <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t.nav.properties}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden glow-border">
              <img src={property.images[selectedImage]} alt={title} className="w-full h-full object-cover" />
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-primary glow-primary' : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{city} — {property.address}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`${property.type === 'sale' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20'} border`}>
                {property.type === 'sale' ? t.property.sale : t.property.rent}
              </Badge>
              {property.isPremium && (
                <Badge className="bg-accent/10 text-accent border border-accent/20 gap-1">
                  <Star className="h-3 w-3" /> {t.property.premium}
                </Badge>
              )}
            </div>
          </div>

          <div className="font-display text-3xl font-bold text-gradient-gold">
            {formatPrice(property.price, property.type, lang)}
          </div>

          {/* Characteristics */}
          <div className="glass rounded-xl p-6 glow-border">
            <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-4">{t.property.characteristics}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                <Maximize2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'المساحة' : 'Surface'}</div>
                  <div className="font-semibold text-foreground">{property.surface} {t.property.surface}</div>
                </div>
              </div>
              {property.rooms > 0 && (
                <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">{t.property.rooms}</div>
                    <div className="font-semibold text-foreground">{property.rooms}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-xl p-6 glow-border">
            <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-4">{t.property.description}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="sticky top-20 glass rounded-xl p-6 glow-border">
            <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-6">{t.property.contactOwner}</h3>
            <div className="space-y-4">
              <Input placeholder={t.contact.name} className="bg-secondary/50 border-border/50" />
              <Input type="email" placeholder={t.contact.email} className="bg-secondary/50 border-border/50" />
              <Input type="tel" placeholder={t.contact.phone} className="bg-secondary/50 border-border/50" />
              <Textarea
                placeholder={t.contact.message}
                rows={4}
                className="bg-secondary/50 border-border/50"
                defaultValue={lang === 'ar'
                  ? `مرحباً، أنا مهتم بهذا العقار: ${property.titleAr}`
                  : `Bonjour, je suis intéressé par ce bien : ${property.title}`
                }
              />
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-primary font-display text-xs tracking-wider">
                {t.contact.send}
              </Button>
              <div className="text-center text-sm text-muted-foreground pt-2 space-y-1">
                <div className="flex items-center justify-center gap-1"><Phone className="h-3.5 w-3.5 text-accent" />{t.contact.phoneValue}</div>
                <div className="flex items-center justify-center gap-1"><Mail className="h-3.5 w-3.5 text-accent" />{t.contact.emailValue}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;
