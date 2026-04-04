import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockProperties, formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Maximize2, BedDouble, Star, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const PropertyDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const property = mockProperties.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <p className="text-xl text-muted-foreground">
          {lang === 'ar' ? 'العقار غير موجود' : 'Bien introuvable'}
        </p>
        <Link to="/properties">
          <Button variant="outline" className="mt-4">{t.nav.properties}</Button>
        </Link>
      </div>
    );
  }

  const title = lang === 'ar' ? property.titleAr : property.title;
  const description = lang === 'ar' ? property.descriptionAr : property.description;
  const city = lang === 'ar' ? property.cityAr : property.city;

  return (
    <div className="container py-8">
      <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t.nav.properties}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              <img
                src={property.images[selectedImage]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{city} — {property.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={property.type === 'sale' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                  {property.type === 'sale' ? t.property.sale : t.property.rent}
                </Badge>
                {property.isPremium && (
                  <Badge className="bg-accent text-accent-foreground gap-1">
                    <Star className="h-3 w-3" /> {t.property.premium}
                  </Badge>
                )}
              </div>
            </div>

            <div className="font-display text-3xl font-bold text-accent mb-6">
              {formatPrice(property.price, property.type, lang)}
            </div>

            {/* Characteristics */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{t.property.characteristics}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">{lang === 'ar' ? 'المساحة' : 'Surface'}</div>
                      <div className="font-semibold">{property.surface} {t.property.surface}</div>
                    </div>
                  </div>
                  {property.rooms > 0 && (
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-5 w-5 text-accent" />
                      <div>
                        <div className="text-sm text-muted-foreground">{t.property.rooms}</div>
                        <div className="font-semibold">{property.rooms}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.property.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Contact form */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">{t.property.contactOwner}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder={t.contact.name} />
              <Input type="email" placeholder={t.contact.email} />
              <Input type="tel" placeholder={t.contact.phone} />
              <Textarea
                placeholder={t.contact.message}
                rows={4}
                defaultValue={lang === 'ar'
                  ? `مرحباً، أنا مهتم بهذا العقار: ${property.titleAr}`
                  : `Bonjour, je suis intéressé par ce bien : ${property.title}`
                }
              />
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {t.contact.send}
              </Button>
              <div className="text-center text-sm text-muted-foreground pt-2 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {t.contact.phoneValue}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {t.contact.emailValue}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
