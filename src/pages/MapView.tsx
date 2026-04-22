import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProperties } from '@/hooks/useProperties';
import PropertyMap from '@/components/PropertyMap';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Map as MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOROCCAN_CITIES } from '@/lib/property-helpers';

const MapView = () => {
  const { lang, t } = useLanguage();
  const [transaction, setTransaction] = useState<'all' | 'sale' | 'rent'>('all');
  const [city, setCity] = useState<string>('all');
  const { data: properties = [], isLoading } = useProperties({ transaction, city });

  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 flex-wrap">
        <MapIcon className="h-7 w-7 text-primary" />
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight flex-1">
          <span className="text-gradient-cyber">{lang === 'ar' ? 'الخريطة' : 'Carte interactive'}</span>
        </h1>
        <div className="text-sm text-muted-foreground">
          {withCoords.length} {lang === 'ar' ? 'عقار على الخريطة' : 'biens géolocalisés'}
        </div>
      </motion.div>

      <div className="glass rounded-xl p-4 glow-border mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select value={transaction} onValueChange={(v: any) => setTransaction(v)}>
          <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === 'ar' ? 'بيع وكراء' : 'Vente & Location'}</SelectItem>
            <SelectItem value="sale">{t.property.sale}</SelectItem>
            <SelectItem value="rent">{t.property.rent}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.search.allCities}</SelectItem>
            {MOROCCAN_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : (
        <PropertyMap properties={withCoords} />
      )}
    </div>
  );
};

export default MapView;