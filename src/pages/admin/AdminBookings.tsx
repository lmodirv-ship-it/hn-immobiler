import { useLanguage } from '@/contexts/LanguageContext';
import { useAllBookings } from '@/hooks/useBookings';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const AdminBookings = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data = [], isLoading } = useAllBookings();
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-6"><span className="text-gradient-cyber">{t('Toutes les réservations', 'كل الحجوزات')}</span></h1>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : (
        <div className="glass rounded-xl glow-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Bien', 'العقار')}</TableHead>
                <TableHead>{t('Dates', 'التواريخ')}</TableHead>
                <TableHead>{t('Nuits', 'الليالي')}</TableHead>
                <TableHead>{t('Total', 'الإجمالي')}</TableHead>
                <TableHead>{t('Statut', 'الحالة')}</TableHead>
                <TableHead>{t('Paiement', 'الدفع')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="max-w-xs line-clamp-1">{b.properties?.title || '—'}<div className="text-xs text-muted-foreground">{b.properties?.city}</div></TableCell>
                  <TableCell className="text-sm">{b.check_in} → {b.check_out}</TableCell>
                  <TableCell>{b.nights}</TableCell>
                  <TableCell className="font-display text-gradient-gold">{Number(b.total_price).toLocaleString()} {b.currency}</TableCell>
                  <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{b.payment_status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;