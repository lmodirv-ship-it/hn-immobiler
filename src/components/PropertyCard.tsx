import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Property, formatPrice } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize2, BedDouble, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const { t, lang } = useLanguage();

  const title = lang === 'ar' ? property.titleAr : property.title;
  const city = lang === 'ar' ? property.cityAr : property.city;
  const typeLabel = property.type === 'sale' ? t.property.sale : t.property.rent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/properties/${property.id}`}>
        <div className="group relative rounded-xl overflow-hidden glass glow-border hover:glow-primary transition-all duration-500">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.images[0]}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={`backdrop-blur-md ${property.type === 'sale' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-accent/20 text-accent border border-accent/30'}`}>
                {typeLabel}
              </Badge>
              {property.isPremium && (
                <Badge className="bg-accent/20 text-accent border border-accent/30 backdrop-blur-md gap-1">
                  <Star className="h-3 w-3" />
                  {t.property.premium}
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <span className="font-display text-lg font-bold text-accent">
                {formatPrice(property.price, property.type, lang)}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{city}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {property.rooms > 0 && (
                <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                  <BedDouble className="h-3 w-3 text-primary" />
                  {property.rooms} {t.property.rooms}
                </span>
              )}
              <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                <Maximize2 className="h-3 w-3 text-primary" />
                {property.surface} {t.property.surface}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
