import { useAuth } from '@/hooks/useAuth';
import { useMyProperties } from '@/hooks/useProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const OwnerCalendar = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: props = [] } = useMyProperties(user?.id);
  const [month, setMonth] = useState<Date>(new Date());

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['owner-cal', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('bookings')
        .select('id,property_id,check_in,check_out,status,properties(title)')
        .eq('host_id', user!.id)
        .in('status', ['pending', 'confirmed', 'completed']);
      return data || [];
    },
  });

  const bookedDates = useMemo(() => {
    const dates: Date[] = [];
    bookings.forEach((b: any) => {
      const start = new Date(b.check_in);
      const end = new Date(b.check_out);
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) dates.push(new Date(d));
    });
    return dates;
  }, [bookings]);

  const upcomingByProp: Record<string, any[]> = {};
  bookings.forEach((b: any) => {
    const k = b.properties?.title || b.property_id;
    (upcomingByProp[k] ||= []).push(b);
  });

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Calendrier global', 'التقويم الشامل')}</span>
      </motion.h1>
      <p className="text-sm text-muted-foreground">{t('Toutes les réservations de vos biens', 'كل حجوزات عقاراتك')}</p>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid lg:grid-cols-[auto_1fr] gap-6">
          <div className="glass rounded-2xl p-4 glow-border">
            <Calendar
              mode="multiple"
              selected={bookedDates}
              month={month}
              onMonthChange={setMonth}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{ booked: 'bg-primary/20 text-primary font-semibold' }}
            />
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded bg-primary/20 border border-primary/40" />
              {t('Réservé', 'محجوز')}
            </div>
          </div>

          <div className="space-y-3 min-w-0">
            <h2 className="font-display font-bold">{t('À venir', 'القادمة')} · {props.length} {t('biens', 'عقارات')}</h2>
            {Object.keys(upcomingByProp).length === 0 && (
              <div className="text-center py-10 text-muted-foreground glass rounded-xl">{t('Aucune réservation', 'لا توجد حجوزات')}</div>
            )}
            {Object.entries(upcomingByProp).map(([title, list]) => (
              <div key={title} className="glass rounded-xl p-4 glow-border">
                <div className="font-semibold mb-2">{title}</div>
                <div className="space-y-1.5">
                  {list.map((b) => (
                    <div key={b.id} className="flex items-center justify-between text-sm">
                      <span>{b.check_in} → {b.check_out}</span>
                      <Badge variant="outline">{b.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCalendar;