import { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { differenceInCalendarDays, eachDayOfInterval, format, isWithinInterval, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarCheck2, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type SeasonalRule = { from: string; to: string; price: number };

type Props = {
  propertyId: string;
  ownerId: string;
  basePrice: number;
  currency: string;
  seasonalPricing?: SeasonalRule[] | null;
};

const AvailabilityCalendar = ({ propertyId, ownerId, basePrice, currency, seasonalPricing }: Props) => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { data: bookedDates = [], isLoading } = useQuery({
    queryKey: ['availability', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out, status')
        .eq('property_id', propertyId)
        .in('status', ['pending', 'confirmed', 'completed']);
      if (error) throw error;
      const days: Date[] = [];
      (data ?? []).forEach((b: any) => {
        const from = parseISO(b.check_in);
        const to = parseISO(b.check_out);
        eachDayOfInterval({ start: from, end: to }).slice(0, -1).forEach((d) => days.push(d));
      });
      return days;
    },
  });

  const priceForDay = (d: Date): number => {
    const rule = (seasonalPricing ?? []).find((r) =>
      isWithinInterval(d, { start: parseISO(r.from), end: parseISO(r.to) })
    );
    return rule ? Number(rule.price) : Number(basePrice);
  };

  const nights = range?.from && range?.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const total = useMemo(() => {
    if (!range?.from || !range?.to || nights <= 0) return 0;
    return eachDayOfInterval({ start: range.from, end: range.to }).slice(0, -1).reduce((s, d) => s + priceForDay(d), 0);
  }, [range, seasonalPricing, basePrice, nights]);

  const submit = async () => {
    if (!user) return navigate('/auth');
    if (!range?.from || !range?.to || nights < 1) {
      toast({ title: t('Sélectionnez des dates', 'اختر التواريخ'), variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('bookings').insert({
      property_id: propertyId,
      guest_id: user.id,
      host_id: ownerId,
      check_in: format(range.from, 'yyyy-MM-dd'),
      check_out: format(range.to, 'yyyy-MM-dd'),
      nights,
      guests,
      price_per_night: Math.round(total / nights),
      total_price: total,
      currency,
      status: 'pending',
      payment_status: 'unpaid',
    });
    setSubmitting(false);
    if (error) {
      toast({ title: t('Ces dates sont indisponibles', 'هذه التواريخ غير متاحة'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('Demande de réservation envoyée', 'تم إرسال طلب الحجز') });
      setRange(undefined);
      navigate('/dashboard/bookings');
    }
  };

  return (
    <div className="glass rounded-xl p-6 glow-border space-y-4">
      <h3 className="font-display text-sm tracking-widest uppercase text-primary">{t('Disponibilité & Réservation', 'التوفر والحجز')}</h3>
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          disabled={[{ before: new Date() }, ...bookedDates]}
          modifiers={{ booked: bookedDates }}
          modifiersClassNames={{ booked: 'line-through opacity-50' }}
          className="rounded-md border border-border/50 pointer-events-auto"
        />
      )}
      <div className="flex items-center gap-2 text-sm">
        <label className="text-muted-foreground">{t('Invités', 'الضيوف')}</label>
        <input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))} className="w-16 bg-secondary/50 border border-border/50 rounded px-2 py-1" />
      </div>
      {nights > 0 && (
        <div className="flex items-center justify-between text-sm border-t border-border/40 pt-3">
          <span className="text-muted-foreground">{nights} {t('nuit(s)', 'ليلة')}</span>
          <span className="font-display text-lg text-gradient-gold">{total.toLocaleString()} {currency}</span>
        </div>
      )}
      <Button onClick={submit} disabled={submitting || nights < 1} className="w-full glow-primary gap-2">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CalendarCheck2 className="h-4 w-4" /> {t('Réserver', 'احجز الآن')}</>}
      </Button>
    </div>
  );
};

export default AvailabilityCalendar;