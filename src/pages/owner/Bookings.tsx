import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Loader2, Users, Check, X, MessageSquare, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { exportCSV } from '@/lib/export-csv';

const statusColor: Record<string, string> = {
  pending: 'text-yellow-500 border-yellow-500/30',
  confirmed: 'text-primary border-primary/30',
  completed: 'text-emerald-500 border-emerald-500/30',
  cancelled: 'text-muted-foreground',
  rejected: 'text-destructive border-destructive/30',
};

const Bookings = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data = [], isLoading } = useMyBookings(user?.id, 'host');
  const mut = useUpdateBookingStatus();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return data.filter((b: any) => {
      if (status !== 'all' && b.status !== status) return false;
      if (q && !(b.properties?.title || '').toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [data, q, status]);

  const download = () => exportCSV(`bookings-${Date.now()}.csv`, filtered.map((b: any) => ({
    id: b.id, property: b.properties?.title, city: b.properties?.city,
    check_in: b.check_in, check_out: b.check_out, nights: b.nights, guests: b.guests,
    total: b.total_price, currency: b.currency, status: b.status, payment: b.payment_status,
  })));

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold">
        <span className="text-gradient-cyber">{t('Réservations reçues', 'الحجوزات المستلمة')}</span>
      </motion.h1>

      <div className="flex flex-wrap gap-2 items-center">
        <Input placeholder={t('Rechercher un bien…', 'ابحث عن عقار…')} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('Tous les statuts', 'كل الحالات')}</SelectItem>
            <SelectItem value="pending">{t('En attente', 'معلقة')}</SelectItem>
            <SelectItem value="confirmed">{t('Confirmées', 'مؤكدة')}</SelectItem>
            <SelectItem value="completed">{t('Terminées', 'مكتملة')}</SelectItem>
            <SelectItem value="cancelled">{t('Annulées', 'ملغاة')}</SelectItem>
            <SelectItem value="rejected">{t('Refusées', 'مرفوضة')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={download} className="gap-2 ml-auto"><Download className="h-4 w-4" />CSV</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucune réservation', 'لا توجد حجوزات')}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b: any) => (
            <div key={b.id} className="glass rounded-xl p-4 glow-border flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
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
              {b.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => mut.mutate({ id: b.id, status: 'confirmed' })} className="gap-1"><Check className="h-3.5 w-3.5" />{t('Confirmer', 'قبول')}</Button>
                  <Button size="sm" variant="destructive" onClick={() => mut.mutate({ id: b.id, status: 'rejected' })} className="gap-1"><X className="h-3.5 w-3.5" />{t('Refuser', 'رفض')}</Button>
                </div>
              )}
              <Link to={`/bookings/${b.id}/chat`}>
                <Button size="sm" variant="outline" className="gap-1"><MessageSquare className="h-3.5 w-3.5" />{t('Chat', 'دردشة')}</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;