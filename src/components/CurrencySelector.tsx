import { Check, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CURRENCIES, type CurrencyCode } from '@/lib/currencies';
import { useLanguage } from '@/contexts/LanguageContext';

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const { lang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
          <DollarSign className="h-4 w-4" />
          <span className="text-xs font-display tracking-wider">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
          const m = CURRENCIES[code];
          const name = lang === 'ar' ? m.name_ar : lang === 'en' ? m.name_en : m.name_fr;
          return (
            <DropdownMenuItem key={code} onClick={() => setCurrency(code)} className="gap-2">
              <span>{m.flag}</span>
              <span className="font-display text-xs tracking-wider">{code}</span>
              <span className="text-muted-foreground text-xs truncate">— {name}</span>
              {currency === code && <Check className="h-3.5 w-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
