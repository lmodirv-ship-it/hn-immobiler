import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProperties } from '@/hooks/useProperties';
import DbPropertyCard from '@/components/DbPropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, Loader2, Map as MapIcon, Waves, ParkingCircle, Building, Sofa, Trees, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOROCCAN_CITIES, PROPERTY_TYPES } from '@/lib/property-helpers';

const PropertyList = () => {
  const { t, lang } = useLanguage();
  const [transaction, setTransaction] = useState<'all' | 'sale' | 'rent'>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [city, setCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRooms, setMinRooms] = useState<number>(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: properties = [], isLoading } = useProperties({
    transaction,
    propertyType,
    city,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined,
    minRooms: minRooms || undefined,
    amenities: amenities.length > 0 ? amenities : undefined,
  });

  const reset = () => {
    setTransaction('all'); setPropertyType('all'); setCity('all');
    setPriceRange([0, 10000000]); setMinRooms(0); setAmenities([]);
  };

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const amenityList: { key: string; icon: any; label: { fr: string; ar: string } }[] = [
    { key: 'has_pool', icon: Waves, label: { fr: 'Piscine', ar: 'مسبح' } },
    { key: 'has_elevator', icon: Building, label: { fr: 'Ascenseur', ar: 'مصعد' } },
    { key: 'has_parking', icon: ParkingCircle, label: { fr: 'Parking', ar: 'موقف' } },
    { key: 'furnished', icon: Sofa, label: { fr: 'Meublé', ar: 'مفروش' } },
    { key: 'has_garden', icon: Trees, label: { fr: 'Jardin', ar: 'حديقة' } },
    { key: 'has_gym', icon: Dumbbell, label: { fr: 'Gym', ar: 'صالة رياضية' } },
  ];

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-gradient-cyber">{t.nav.properties}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {properties.length} {lang === 'ar' ? 'عقار متوفر' : 'biens disponibles'}
          </p>
        </div>
        <Link to="/map">
          <Button variant="outline" className="gap-2 glow-border">
            <MapIcon className="h-4 w-4" /> {lang === 'ar' ? 'عرض على الخريطة' : 'Voir sur la carte'}
          </Button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <Button variant="outline" className="md:hidden mb-4 gap-2 glow-border" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" /> {lang === 'ar' ? 'الفلاتر' : 'Filtres'}
        </Button>

        <div className={`glass rounded-xl p-4 glow-border ${showFilters ? '' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <Select value={transaction} onValueChange={(v: any) => setTransaction(v)}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{lang === 'ar' ? 'بيع وكراء' : 'Vente & Location'}</SelectItem>
                <SelectItem value="sale">{t.property.sale}</SelectItem>
                <SelectItem value="rent">{t.property.rent}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.search.allTypes}</SelectItem>
                {PROPERTY_TYPES.map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {(t.property as any)[pt] ?? pt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.search.allCities}</SelectItem>
                {MOROCCAN_CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={String(minRooms)} onValueChange={(v) => setMinRooms(Number(v))}>
              <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{lang === 'ar' ? 'كل الغرف' : 'Toutes pièces'}</SelectItem>
                {[1,2,3,4,5].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}+ {t.property.rooms}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="px-2 py-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>{lang === 'ar' ? 'السعر' : 'Prix'}: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} MAD</span>
              <button onClick={reset} className="text-primary hover:underline">{lang === 'ar' ? 'إعادة تعيين' : 'Réinitialiser'}</button>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              min={0}
              max={10000000}
              step={50000}
              className="mt-2"
            />
          </div>

          <div className="px-2 pt-2 border-t border-border/40">
            <div className="text-xs text-muted-foreground mb-2">{lang === 'ar' ? 'مرافق' : 'Équipements'}</div>
            <div className="flex flex-wrap gap-2">
              {amenityList.map(({ key, icon: Icon, label }) => {
                const active = amenities.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAmenity(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${
                      active
                        ? 'bg-primary/20 border-primary text-primary glow-primary'
                        : 'bg-secondary/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p, i) => <DbPropertyCard key={p.id} property={p} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl glow-border">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            {lang === 'ar' ? 'لا توجد عقارات مطابقة' : 'Aucun bien ne correspond à vos critères'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyList;