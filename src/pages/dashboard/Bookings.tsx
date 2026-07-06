import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarDays, Loader2, Users, Check, X, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const statusColor: Record<string, string> = {
  pending: 'text-yellow-500 border-yellow-500/30',
  confirmed: 'text-primary border-primary/30',
  completed: 'text-emerald-500 border-emerald-500/30',
  cancelled: 'text-muted-foreground',
  rejected: 'text-destructive border-destructive/30',
};

const BookingList = ({ userId, role, lang }: { userId: string; role: 'guest' | 'host'; lang: string }) => {
  const { data = [], isLoading } = useMyBookings(userId, role);
  const mut = useUpdateBookingStatus();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (data.length === 0) return <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucune réservation', 'لا توجد حجوزات')}</div>;

  return (
    <div className="space-y-3">
      {data.map((b: any) => (
        <div key={b.id} className="glass rounded-xl p-4 glow-border flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{b.properties?.title || '—'}</span>
              <Badge variant="outline" className={statusColor[b.status]}>{b.status}</Badge>
              <Badge variant="outline" className="text-xs">{b.payment_status}</Badge>
            </div>
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {b.check_in} → {b.check_out} ({b.nights} {t('nuits', 'ليلة')})</span>
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {b.guests}</span>
            </div>
            <div className="text-sm font-display mt-1 text-gradient-gold">{Number(b.total_price).toLocaleString()} {b.currency}</div>
          </div>
          {role === 'host' && b.status === 'pending' && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => mut.mutate({ id: b.id, status: 'confirmed' })} className="gap-1"><Check className="h-3.5 w-3.5" />{t('Confirmer', 'قبول')}</Button>
              <Button size="sm" variant="destructive" onClick={() => mut.mutate({ id: b.id, status: 'rejected' })} className="gap-1"><X className="h-3.5 w-3.5" />{t('Refuser', 'رفض')}</Button>
            </div>
          )}
          {role === 'guest' && ['pending', 'confirmed'].includes(b.status) && (
            <Button size="sm" variant="outline" onClick={() => mut.mutate({ id: b.id, status: 'cancelled' })}>{t('Annuler', 'إلغاء')}</Button>
          )}
          <Link to={`/bookings/${b.id}/chat`}>
            <Button size="sm" variant="outline" className="gap-1"><MessageSquare className="h-3.5 w-3.5" />{t('Chat', 'دردشة')}</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

const Bookings = () => {
  const { user, isOwner } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  if (!user) return null;

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-6">
        <span className="text-gradient-cyber">{t('Réservations', 'الحجوزات')}</span>
      </motion.h1>
      <Tabs defaultValue="guest" className="w-full">
        <TabsList>
          <TabsTrigger value="guest">{t('Mes séjours', 'إقاماتي')}</TabsTrigger>
          {isOwner && <TabsTrigger value="host">{t('Reçues', 'المستلمة')}</TabsTrigger>}
        </TabsList>
        <TabsContent value="guest" className="mt-4"><BookingList userId={user.id} role="guest" lang={lang} /></TabsContent>
        {isOwner && <TabsContent value="host" className="mt-4"><BookingList userId={user.id} role="host" lang={lang} /></TabsContent>}
      </Tabs>
    </div>
  );
};

export default Bookings;