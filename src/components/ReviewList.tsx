import { usePropertyReviews, usePropertyRatingSummary } from '@/hooks/useReviews';
import { Star, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Stars = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`h-4 w-4 ${i <= Math.round(value) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`} />
    ))}
  </div>
);

const ReviewList = ({ propertyId }: { propertyId: string }) => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data: reviews, isLoading } = usePropertyReviews(propertyId);
  const { data: summary } = usePropertyRatingSummary(propertyId);

  return (
    <div className="glass rounded-xl p-6 glow-border">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-display text-sm tracking-widest uppercase text-primary">
          {t('Avis des clients', 'آراء العملاء')}
        </h3>
        {summary && summary.count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={summary.avg} />
            <span className="font-semibold">{summary.avg.toFixed(1)}</span>
            <span className="text-muted-foreground">({summary.count})</span>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : !reviews || reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('Pas encore d\'avis pour ce bien.', 'لا توجد آراء بعد.')}</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-t border-border/40 pt-3 first:border-none first:pt-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{r.profiles?.full_name || t('Utilisateur', 'مستخدم')}</span>
                <Stars value={r.rating} />
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{r.comment}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">{new Date(r.created_at).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;