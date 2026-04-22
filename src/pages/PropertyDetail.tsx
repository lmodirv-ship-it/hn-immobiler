import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Maximize2, BedDouble, Star, Phone, Mail, Heart, MessageCircle, Loader2, ShieldCheck, GitCompare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatPriceDb } from '@/lib/property-helpers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import BookViewingDialog from '@/components/BookViewingDialog';
import SEO from '@/components/SEO';
import ShareButtons from '@/components/ShareButtons';

const contactSchema = z.object({
  sender_name: z.string().trim().min(2).max(100),
  sender_email: z.string().trim().email().max(255),
  sender_phone: z.string().trim().max(40),
  message: z.string().trim().min(5).max(1000),
});

const PropertyDetail = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: property, isLoading } = useProperty(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [isCmp, setIsCmp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ sender_name: '', sender_email: '', sender_phone: '', message: '' });

  useEffect(() => {
    if (property) {
      setForm((f) => ({
        ...f,
        message: lang === 'ar'
          ? `مرحباً، أنا مهتم بهذا العقار: ${property.title_ar || property.title}`
          : `Bonjour, je suis intéressé par ce bien : ${property.title}`,
      }));
    }
  }, [property, lang]);

  useEffect(() => {
    if (!user || !id) return;
    supabase.from('favorites').select('property_id').eq('user_id', user.id).eq('property_id', id).maybeSingle()
      .then(({ data }) => setIsFav(!!data));
    supabase.from('comparisons').select('property_id').eq('user_id', user.id).eq('property_id', id).maybeSingle()
      .then(({ data }) => setIsCmp(!!data));
  }, [user, id]);

  if (isLoading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <p className="text-xl text-muted-foreground">{lang === 'ar' ? 'العقار غير موجود' : 'Bien introuvable'}</p>
        <Link to="/properties"><Button variant="outline" className="mt-4 glow-border">{t.nav.properties}</Button></Link>
      </div>
    );
  }

  const title = (lang === 'ar' && property.title_ar) ? property.title_ar : property.title;
  const description = (lang === 'ar' && property.description_ar) ? property.description_ar : (property.description || '');
  const images = property.property_images?.length ? property.property_images.map((i) => i.image_url) : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'];
  const ownerName = property.profiles?.full_name || 'HN Immobilier';
  const ownerPhone = property.profiles?.phone || '+212600000000';

  const toggleFav = async () => {
    if (!user) { navigate('/auth'); return; }
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', property.id);
      setIsFav(false);
      toast({ title: lang === 'ar' ? 'أُزيل من المفضلة' : 'Retiré des favoris' });
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, property_id: property.id });
      setIsFav(true);
      toast({ title: lang === 'ar' ? 'أُضيف للمفضلة' : 'Ajouté aux favoris' });
    }
  };

  const sendContact = async () => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: lang === 'ar' ? 'يرجى ملء جميع الحقول بشكل صحيح' : 'Merci de remplir tous les champs correctement', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const payload = {
      sender_name: parsed.data.sender_name,
      sender_email: parsed.data.sender_email,
      sender_phone: parsed.data.sender_phone || null,
      message: parsed.data.message,
      property_id: property.id,
    };
    const { error } = await supabase.from('contact_requests').insert(payload);
    setSubmitting(false);
    if (error) {
      toast({ title: lang === 'ar' ? 'حدث خطأ' : 'Erreur lors de l\'envoi', variant: 'destructive' });
    } else {
      toast({ title: lang === 'ar' ? 'تم الإرسال!' : 'Message envoyé !' });
      setForm({ sender_name: '', sender_email: '', sender_phone: '', message: '' });
    }
  };

  const waLink = `https://wa.me/${ownerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(form.message || title)}`;

  const toggleCmp = async () => {
    if (!user) { navigate('/auth'); return; }
    if (isCmp) {
      await supabase.from('comparisons').delete().eq('user_id', user.id).eq('property_id', property.id);
      setIsCmp(false);
      toast({ title: lang === 'ar' ? 'أُزيل من المقارنة' : 'Retiré de la comparaison' });
    } else {
      await supabase.from('comparisons').insert({ user_id: user.id, property_id: property.id });
      setIsCmp(true);
      toast({ title: lang === 'ar' ? 'أُضيف للمقارنة' : 'Ajouté à la comparaison' });
    }
  };

  const sendInternalMessage = async () => {
    if (!user) { navigate('/auth'); return; }
    if (user.id === property.owner_id) { toast({ title: lang === 'ar' ? 'أنت المالك' : 'Vous êtes le propriétaire', variant: 'destructive' }); return; }
    const content = form.message || title;
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id, recipient_id: property.owner_id, content, property_id: property.id,
    });
    if (error) toast({ title: lang === 'ar' ? 'حدث خطأ' : 'Erreur', variant: 'destructive' });
    else { toast({ title: lang === 'ar' ? 'تم إرسال الرسالة' : 'Message envoyé' }); navigate('/dashboard/messages'); }
  };

  return (
    <div className="container py-10">
      <SEO
        title={`${title} — ${property.city} | HN Immobilier`}
        description={(description || `${property.property_type} ${property.transaction_type === 'sale' ? 'à vendre' : 'à louer'} à ${property.city}, Maroc. ${property.surface ? property.surface + 'm². ' : ''}${property.rooms ? property.rooms + ' pièces. ' : ''}`).slice(0, 160)}
        image={images[0]}
        url={`/properties/${property.id}`}
        type="product"
        lang={lang as 'fr' | 'ar'}
        keywords={[
          property.city, property.property_type,
          property.transaction_type === 'sale' ? 'achat immobilier Maroc' : 'location Maroc',
          'HN Immobilier', `immobilier ${property.city}`,
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": property.transaction_type === 'sale' ? "Product" : "Accommodation",
          name: title,
          description,
          image: images,
          offers: {
            "@type": "Offer",
            price: Number(property.price),
            priceCurrency: property.currency || "MAD",
            availability: "https://schema.org/InStock",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: property.city,
            addressCountry: "MA",
            streetAddress: property.address || undefined,
          },
          ...(property.surface && {
            floorSize: { "@type": "QuantitativeValue", value: property.surface, unitCode: "MTK" },
          }),
          ...(property.rooms && { numberOfRooms: property.rooms }),
        }}
      />
      <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> {t.nav.properties}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden glow-border">
              <img src={images[selectedImage]} alt={title} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-primary glow-primary' : 'border-border opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{property.city}{property.address ? ` — ${property.address}` : ''}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={`${property.transaction_type === 'sale' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20'} border`}>
                {property.transaction_type === 'sale' ? t.property.sale : t.property.rent}
              </Badge>
              {property.featured && (
                <Badge className="bg-accent/10 text-accent border border-accent/20 gap-1">
                  <Star className="h-3 w-3" /> {t.property.premium}
                </Badge>
              )}
              {property.verified && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 gap-1">
                  <ShieldCheck className="h-3 w-3" /> {lang === 'ar' ? 'موثّق' : 'Vérifié'}
                </Badge>
              )}
            </div>
          </div>

          <div className="font-display text-3xl font-bold text-gradient-gold">
            {formatPriceDb(Number(property.price), property.transaction_type, lang)}
          </div>

          <div className="glass rounded-xl p-6 glow-border">
            <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-4">{t.property.characteristics}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.surface && (
                <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                  <Maximize2 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'المساحة' : 'Surface'}</div>
                    <div className="font-semibold">{Number(property.surface)} {t.property.surface}</div>
                  </div>
                </div>
              )}
              {(property.rooms ?? 0) > 0 && (
                <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">{t.property.rooms}</div>
                    <div className="font-semibold">{property.rooms}</div>
                  </div>
                </div>
              )}
              {(property.bathrooms ?? 0) > 0 && (
                <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">{lang === 'ar' ? 'الحمامات' : 'Salles de bain'}</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-xl p-6 glow-border">
            <h3 className="font-display text-sm tracking-widest uppercase text-primary mb-4">{t.property.description}</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
          </div>

          <div className="glass rounded-xl p-6 glow-border">
            <ShareButtons
              url={`/properties/${property.id}`}
              title={title}
              text={`${property.city} — ${formatPriceDb(Number(property.price), property.transaction_type, lang)}`}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="sticky top-20 glass rounded-xl p-6 glow-border space-y-4">
            <div className="flex gap-2">
              <Button onClick={toggleFav} variant={isFav ? 'default' : 'outline'} className="flex-1 gap-2">
                <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                {isFav ? (lang === 'ar' ? 'محفوظ' : 'Sauvegardé') : (lang === 'ar' ? 'حفظ' : 'Sauver')}
              </Button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full gap-2 border-accent/50 text-accent hover:bg-accent/10">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </a>
            </div>

            <div className="flex gap-2">
              <Button onClick={toggleCmp} variant={isCmp ? 'default' : 'outline'} className="flex-1 gap-2">
                <GitCompare className="h-4 w-4" />
                {isCmp ? (lang === 'ar' ? 'في المقارنة' : 'À comparer') : (lang === 'ar' ? 'مقارنة' : 'Comparer')}
              </Button>
              <Button onClick={sendInternalMessage} variant="outline" className="flex-1 gap-2 border-primary/40">
                <Send className="h-4 w-4" /> {lang === 'ar' ? 'رسالة خاصة' : 'Message privé'}
              </Button>
            </div>

            <BookViewingDialog propertyId={property.id} ownerId={property.owner_id} />

            <div className="border-t border-border/50 pt-4">
              <p className="text-xs text-muted-foreground mb-1">{lang === 'ar' ? 'العارض' : 'Annonceur'}</p>
              <p className="font-semibold flex items-center gap-1">{ownerName}{property.profiles?.verified && <ShieldCheck className="h-4 w-4 text-primary" />}</p>
            </div>

            <h3 className="font-display text-sm tracking-widest uppercase text-primary pt-2">{t.property.contactOwner}</h3>
            <Input placeholder={t.contact.name} value={form.sender_name} onChange={(e) => setForm({...form, sender_name: e.target.value})} className="bg-secondary/50 border-border/50" />
            <Input type="email" placeholder={t.contact.email} value={form.sender_email} onChange={(e) => setForm({...form, sender_email: e.target.value})} className="bg-secondary/50 border-border/50" />
            <Input type="tel" placeholder={t.contact.phone} value={form.sender_phone} onChange={(e) => setForm({...form, sender_phone: e.target.value})} className="bg-secondary/50 border-border/50" />
            <Textarea placeholder={t.contact.message} rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="bg-secondary/50 border-border/50" />
            <Button onClick={sendContact} disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/80 glow-primary font-display text-xs tracking-wider">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t.contact.send}
            </Button>
            <div className="text-center text-sm text-muted-foreground pt-2 space-y-1">
              <div className="flex items-center justify-center gap-1"><Phone className="h-3.5 w-3.5 text-accent" />{ownerPhone}</div>
              <div className="flex items-center justify-center gap-1"><Mail className="h-3.5 w-3.5 text-accent" />{t.contact.emailValue}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;