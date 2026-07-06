import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitReview } from '@/hooks/useReviews';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = { propertyId: string; bookingId?: string; reviewedId?: string; onDone?: () => void };

const ReviewForm = ({ propertyId, bookingId, reviewedId, onDone }: Props) => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const mut = useSubmitReview();

  const submit = async () => {
    await mut.mutateAsync({ propertyId, bookingId, reviewedId, rating, comment });
    setComment(''); setRating(5); onDone?.();
  };

  return (
    <div className="glass rounded-xl p-4 glow-border space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
            <Star className={`h-6 w-6 transition ${i <= (hover || rating) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`} />
          </button>
        ))}
        <span className="ms-2 text-sm text-muted-foreground">{rating}/5</span>
      </div>
      <Textarea rows={3} placeholder={t('Partagez votre expérience…', 'شارك تجربتك…')} value={comment} onChange={(e) => setComment(e.target.value)} className="bg-secondary/50 border-border/50" />
      <Button onClick={submit} disabled={mut.isPending} className="w-full glow-primary">
        {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Publier l\'avis', 'نشر التقييم')}
      </Button>
    </div>
  );
};

export default ReviewForm;