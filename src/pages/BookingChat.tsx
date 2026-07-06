import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, ArrowLeft, CalendarCheck2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Msg {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  booking_id?: string | null;
}

const BookingChat = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  const [booking, setBooking] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookingId || !user) return;
    (async () => {
      const { data: b } = await supabase
        .from('bookings')
        .select('*, properties(id,title,city), guest:profiles!bookings_guest_id_fkey(id,full_name), host:profiles!bookings_host_id_fkey(id,full_name)')
        .eq('id', bookingId)
        .maybeSingle();
      setBooking(b);
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });
      setMessages((msgs || []) as Msg[]);
      setLoading(false);
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('booking_id', bookingId)
        .eq('recipient_id', user.id)
        .is('read_at', null);
    })();

    const channel = supabase
      .channel(`booking-chat-${bookingId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Msg]);
          const m = payload.new as Msg;
          if (m.recipient_id === user.id) {
            supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', m.id).then(() => {});
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [bookingId, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const otherId = booking && user ? (booking.guest_id === user.id ? booking.host_id : booking.guest_id) : null;
  const otherName = booking && user ? (booking.guest_id === user.id ? booking.host?.full_name : booking.guest?.full_name) : '';

  const send = async () => {
    if (!input.trim() || !user || !otherId || !bookingId) return;
    setSending(true);
    const content = input.trim();
    setInput('');
    await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id: otherId,
      content,
      booking_id: bookingId,
      property_id: booking?.property_id ?? null,
    });
    setSending(false);
  };

  if (loading) return <div className="container py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (!booking) return <div className="container py-20 text-center text-muted-foreground">{t('Réservation introuvable', 'الحجز غير موجود')}</div>;

  return (
    <div className="container py-6 max-w-3xl">
      <Link to="/dashboard/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-3">
        <ArrowLeft className="h-4 w-4" /> {t('Retour aux réservations', 'العودة إلى الحجوزات')}
      </Link>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 glow-border mb-3 flex items-center gap-3">
        <CalendarCheck2 className="h-6 w-6 text-primary" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{booking.properties?.title}</div>
          <div className="text-xs text-muted-foreground">{booking.check_in} → {booking.check_out} · {t('avec', 'مع')} {otherName || '—'}</div>
        </div>
        <Link to={`/properties/${booking.property_id}`}><Button size="sm" variant="outline">{t('Voir le bien', 'العقار')}</Button></Link>
      </motion.div>

      <div className="glass rounded-xl glow-border flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && <p className="text-center text-muted-foreground py-10">{t('Aucun message. Envoyez le premier !', 'لا رسائل بعد. أرسل الأولى!')}</p>}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                <p className="text-sm whitespace-pre-line">{m.content}</p>
                <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-border/30 p-3 flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !sending && send()}
            placeholder={t('Écrire un message...', 'اكتب رسالة...')} className="bg-secondary/50" />
          <Button onClick={send} disabled={!input.trim() || sending} className="glow-primary">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingChat;