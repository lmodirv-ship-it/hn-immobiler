import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CURRENCIES, COUNTRY_TO_CURRENCY, type CurrencyCode } from '@/lib/currencies';
import { useGeoLocation } from '@/hooks/useGeoLocation';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<string, number>; // base = MAD
  ratesReady: boolean;
  convert: (amountMad: number, to?: CurrencyCode) => number;
  format: (amountMad: number, opts?: { to?: CurrencyCode; locale?: string }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
const STORAGE_KEY = 'hn_currency';
const RATES_KEY = 'hn_rates_v1';
const RATES_TTL = 12 * 60 * 60 * 1000; // 12h

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { geo } = useGeoLocation();
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    return (saved && CURRENCIES[saved]) ? saved : 'MAD';
  });
  const [rates, setRates] = useState<Record<string, number>>({ MAD: 1 });
  const [ratesReady, setRatesReady] = useState(false);
  const userPickedRef = React.useRef(!!localStorage.getItem(STORAGE_KEY + '_picked'));

  // Auto-pick currency from geo (once)
  useEffect(() => {
    if (!geo || userPickedRef.current) return;
    const suggested = COUNTRY_TO_CURRENCY[geo.country];
    if (suggested && suggested !== currency) {
      setCurrencyState(suggested);
    }
  }, [geo, currency]);

  // Fetch FX rates (base MAD)
  useEffect(() => {
    const cached = localStorage.getItem(RATES_KEY);
    if (cached) {
      try {
        const p = JSON.parse(cached);
        if (Date.now() - p.t < RATES_TTL) {
          setRates(p.rates);
          setRatesReady(true);
          return;
        }
      } catch {}
    }
    (async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=MAD&to=EUR,USD,GBP,AED,SAR', {
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        const r: Record<string, number> = { MAD: 1, ...data.rates };
        localStorage.setItem(RATES_KEY, JSON.stringify({ t: Date.now(), rates: r }));
        setRates(r);
      } catch {
        // Fallback approx rates
        setRates({ MAD: 1, EUR: 0.092, USD: 0.10, GBP: 0.079, AED: 0.37, SAR: 0.38 });
      } finally {
        setRatesReady(true);
      }
    })();
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
    localStorage.setItem(STORAGE_KEY + '_picked', '1');
    userPickedRef.current = true;
  }, []);

  const convert = useCallback(
    (amountMad: number, to?: CurrencyCode) => {
      const target = to || currency;
      const rate = rates[target] ?? 1;
      return amountMad * rate;
    },
    [rates, currency],
  );

  const format = useCallback(
    (amountMad: number, opts?: { to?: CurrencyCode; locale?: string }) => {
      const target = opts?.to || currency;
      const meta = CURRENCIES[target];
      const value = convert(amountMad, target);
      try {
        return new Intl.NumberFormat(opts?.locale || meta.locale, {
          style: 'currency',
          currency: target,
          maximumFractionDigits: target === 'MAD' ? 0 : value < 100 ? 2 : 0,
        }).format(value);
      } catch {
        return `${Math.round(value).toLocaleString()} ${meta.symbol}`;
      }
    },
    [currency, convert],
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, ratesReady, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
