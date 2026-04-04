import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Property, formatPrice } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Maximize2, BedDouble, Star } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { t, lang } = useLanguage();

  const title = lang === 'ar' ? property.titleAr : property.title;
  const city = lang === 'ar' ? property.cityAr : property.city;
  const typeLabel = property.type === 'sale' ? t.property.sale : t.property.rent;

  return (
    <Link to={`/properties/${property.id}`}>
      <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={property.type === 'sale' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
              {typeLabel}
            </Badge>
            {property.isPremium && (
              <Badge className="bg-accent text-accent-foreground gap-1">
                <Star className="h-3 w-3" />
                {t.property.premium}
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{city}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-accent">
              {formatPrice(property.price, property.type, lang)}
            </span>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {property.rooms > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  {property.rooms}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5" />
                {property.surface} {t.property.surface}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
