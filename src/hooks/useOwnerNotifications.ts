import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Subscribes to realtime events relevant to a property owner and surfaces
 * toasts for: new bookings, booking status changes, and payout-related
 * payment status updates. Invalidates related queries so the dashboard
 * KPIs and lists refresh instantly.
 */
export function useOwnerNotifications(ownerId?: string) {
  const qc = useQueryClient();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  useEffect(() => {
    if (!ownerId) return;

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['owner-stats'] });
      qc.invalidateQueries({ queryKey: ['owner-revenue'] });
    };

    const channel = supabase
      .channel(`owner-notif-${ownerId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings', filter: `host_id=eq.${ownerId}` },
        async (payload) => {
          const b: any = payload.new;
          let propTitle = '';
          if (b.property_id) {
            const { data } = await supabase
              .from('properties')
              .select('title')
              .eq('id', b.property_id)
              .maybeSingle();
            propTitle = data?.title || '';
          }
          toast.success(t('🆕 Nouvelle réservation', '🆕 حجز جديد'), {
            description: `${propTitle} · ${b.check_in} → ${b.check_out} · ${Number(b.total_price).toLocaleString()} ${b.currency || 'MAD'}`,
            duration: 8000,
          });
          invalidate();
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `host_id=eq.${ownerId}` },
        (payload) => {
          const oldRow: any = payload.old;
          const b: any = payload.new;

          if (oldRow.status !== b.status) {
            const map: Record<string, string> = {
              confirmed: t('✅ Réservation confirmée', '✅ تم تأكيد الحجز'),
              cancelled: t('❌ Réservation annulée', '❌ تم إلغاء الحجز'),
              rejected: t('⛔ Réservation refusée', '⛔ تم رفض الحجز'),
              completed: t('🏁 Séjour terminé', '🏁 انتهت الإقامة'),
            };
            const title = map[b.status];
            if (title) toast(title, { description: `${b.check_in} → ${b.check_out}` });
          }

          if (oldRow.payment_status !== b.payment_status) {
            if (b.payment_status === 'paid') {
              toast.success(t('💰 Paiement reçu', '💰 تم استلام الدفع'), {
                description: `${Number(b.total_price).toLocaleString()} ${b.currency || 'MAD'}`,
                duration: 8000,
              });
            } else if (b.payment_status === 'pending') {
              toast(t('⏳ Versement en attente', '⏳ تحويل قيد الانتظار'), {
                description: `${Number(b.total_price).toLocaleString()} ${b.currency || 'MAD'}`,
              });
            } else if (b.payment_status === 'refunded') {
              toast(t('↩️ Remboursement effectué', '↩️ تم استرداد المبلغ'));
            }
          }

          invalidate();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);
}