import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockProperties, cities } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

const PropertyList = () => {
  const { t, lang } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockProperties.filter((p) => {
      if (typeFilter !== 'all' && p.propertyType !== typeFilter) return false;
      if (cityFilter !== 'all' && p.city !== cityFilter) return false;
      if (transactionFilter !== 'all' && p.type !== transactionFilter) return false;
      return true;
    });
  }, [typeFilter, cityFilter, transactionFilter]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {t.nav.properties}
        </h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} {lang === 'ar' ? 'عقار متوفر' : 'biens disponibles'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Button
          variant="outline"
          className="md:hidden mb-4 gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 ${showFilters ? '' : 'hidden md:grid'}`}>
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'ar' ? 'بيع وكراء' : 'Vente & Location'}</SelectItem>
              <SelectItem value="sale">{t.property.sale}</SelectItem>
              <SelectItem value="rent">{t.property.rent}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allTypes}</SelectItem>
              <SelectItem value="apartment">{t.property.apartment}</SelectItem>
              <SelectItem value="villa">{t.property.villa}</SelectItem>
              <SelectItem value="house">{t.property.house}</SelectItem>
              <SelectItem value="land">{t.property.land}</SelectItem>
              <SelectItem value="commercial">{t.property.commercial}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allCities}</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.fr} value={c.fr}>
                  {lang === 'ar' ? c.ar : c.fr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={() => {
              setTypeFilter('all');
              setCityFilter('all');
              setTransactionFilter('all');
            }}
          >
            {lang === 'ar' ? 'إعادة تعيين' : 'Réinitialiser'}
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
