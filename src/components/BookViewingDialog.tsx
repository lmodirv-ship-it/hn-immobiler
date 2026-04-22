import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Calendar, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props { propertyId: string; ownerId: string; }

const BookViewingDialog = ({ propertyId, ownerId }: Props) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!date) { toast({ title: t('Choisissez une date', 'اختر تاريخا'), variant: 'destructive' }); return; }
    if (user.id === ownerId) { toast({ title: t('Vous êtes le propriétaire', 'أنت المالك'), variant: 'destructive' }); return; }
    setLoading(true);
    const scheduled_at = new Date(`${date}T${time}`).toISOString();
    const { error } = await supabase.from('viewings').insert({
      property_id: propertyId, owner_id: ownerId, visitor_id: user.id, scheduled_at, notes: notes || null,
    });
    setLoading(false);
    if (error) toast({ title: t('Erreur', 'خطأ'), description: error.message, variant: 'destructive' });
    else { toast({ title: t('Visite demandée !', 'تم طلب الزيارة!') }); setOpen(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 border-primary/40"><Calendar className="h-4 w-4" />{t('Réserver une visite', 'احجز زيارة')}</Button>
      </DialogTrigger>
      <DialogContent className="glass-strong glow-border">
        <DialogHeader><DialogTitle className="font-display"><span className="text-gradient-cyber">{t('Planifier une visite', 'جدولة زيارة')}</span></DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label>{t('Date', 'التاريخ')}</Label><Input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="bg-secondary/50" /></div>
          <div><Label>{t('Heure', 'الوقت')}</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-secondary/50" /></div>
          <div><Label>{t('Notes (optionnel)', 'ملاحظات (اختياري)')}</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="bg-secondary/50" /></div>
          <Button onClick={submit} disabled={loading} className="w-full glow-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Envoyer la demande', 'إرسال الطلب')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookViewingDialog;
