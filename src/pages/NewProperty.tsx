import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { MOROCCAN_CITIES, PROPERTY_TYPES } from '@/lib/property-helpers';

const schema = z.object({
  title: z.string().trim().min(5).max(200),
  title_ar: z.string().trim().max(200).optional(),
  description: z.string().trim().min(20).max(3000),
  description_ar: z.string().trim().max(3000).optional(),
  transaction_type: z.enum(['sale', 'rent']),
  property_type: z.enum(['apartment','villa','house','land','commercial','office','riad','studio']),
  price: z.number().positive(),
  surface: z.number().positive().optional(),
  rooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  city: z.string().min(2),
  district: z.string().max(120).optional(),
  address: z.string().max(300).optional(),
});

const NewProperty = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);

  const [form, setForm] = useState({
    title: '', title_ar: '', description: '', description_ar: '',
    transaction_type: 'sale' as 'sale' | 'rent',
    property_type: 'apartment' as any,
    price: '', surface: '', rooms: '', bathrooms: '',
    city: 'Casablanca', district: '', address: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, 10 - files.length);
    const newPreviews = arr.map((f) => URL.createObjectURL(f));
    setFiles([...files, ...arr]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (i: number) => {
    setFiles(files.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({
      ...form,
      price: Number(form.price),
      surface: form.surface ? Number(form.surface) : undefined,
      rooms: form.rooms ? Number(form.rooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      title_ar: form.title_ar || undefined,
      description_ar: form.description_ar || undefined,
      district: form.district || undefined,
      address: form.address || undefined,
    });
    if (!parsed.success) {
      toast({ title: t('Champs invalides', 'حقول غير صحيحة'), description: parsed.error.errors[0]?.message, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const insertData = {
        owner_id: user.id,
        title: parsed.data.title,
        title_ar: parsed.data.title_ar ?? null,
        description: parsed.data.description,
        description_ar: parsed.data.description_ar ?? null,
        transaction_type: parsed.data.transaction_type,
        property_type: parsed.data.property_type,
        price: parsed.data.price,
        surface: parsed.data.surface ?? null,
        rooms: parsed.data.rooms ?? null,
        bathrooms: parsed.data.bathrooms ?? null,
        city: parsed.data.city,
        district: parsed.data.district ?? null,
        address: parsed.data.address ?? null,
        status: 'active' as const,
        published_at: new Date().toISOString(),
      };
      const { data: created, error } = await supabase.from('properties').insert(insertData).select().single();
      if (error) throw error;

      // Upload images
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const path = `${user.id}/${created.id}/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const { error: upErr } = await supabase.storage.from('property-media').upload(path, f);
        if (upErr) { console.error(upErr); continue; }
        const { data: pub } = supabase.storage.from('property-media').getPublicUrl(path);
        await supabase.from('property_images').insert({
          property_id: created.id, image_url: pub.publicUrl, is_primary: i === 0, display_order: i,
        });
      }

      toast({ title: t('Bien publié !', 'تم النشر!') });
      navigate(`/properties/${created.id}`);
    } catch (e: any) {
      toast({ title: t('Erreur', 'خطأ'), description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-10 max-w-3xl">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl md:text-3xl font-bold mb-8">
        <span className="text-gradient-cyber">{t('Nouveau bien', 'عقار جديد')}</span>
      </motion.h1>

      <div className="space-y-6 glass rounded-2xl p-6 glow-border">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('Titre (FR)', 'العنوان (FR)')}</Label>
            <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="bg-secondary/50" />
          </div>
          <div>
            <Label>{t('Titre (AR)', 'العنوان (AR)')}</Label>
            <Input value={form.title_ar} onChange={(e) => setForm({...form, title_ar: e.target.value})} className="bg-secondary/50" dir="rtl" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('Description (FR)', 'الوصف (FR)')}</Label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="bg-secondary/50" />
          </div>
          <div>
            <Label>{t('Description (AR)', 'الوصف (AR)')}</Label>
            <Textarea rows={4} value={form.description_ar} onChange={(e) => setForm({...form, description_ar: e.target.value})} className="bg-secondary/50" dir="rtl" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t('Transaction', 'العملية')}</Label>
            <Select value={form.transaction_type} onValueChange={(v: any) => setForm({...form, transaction_type: v})}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">{t('Vente', 'بيع')}</SelectItem>
                <SelectItem value="rent">{t('Location', 'كراء')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('Type de bien', 'نوع العقار')}</Label>
            <Select value={form.property_type} onValueChange={(v) => setForm({...form, property_type: v as any})}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((pt) => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('Prix (MAD)', 'السعر (درهم)')}</Label>
            <Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="bg-secondary/50" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t('Surface (m²)', 'المساحة')}</Label>
            <Input type="number" value={form.surface} onChange={(e) => setForm({...form, surface: e.target.value})} className="bg-secondary/50" />
          </div>
          <div>
            <Label>{t('Pièces', 'الغرف')}</Label>
            <Input type="number" value={form.rooms} onChange={(e) => setForm({...form, rooms: e.target.value})} className="bg-secondary/50" />
          </div>
          <div>
            <Label>{t('Salles de bain', 'الحمامات')}</Label>
            <Input type="number" value={form.bathrooms} onChange={(e) => setForm({...form, bathrooms: e.target.value})} className="bg-secondary/50" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t('Ville', 'المدينة')}</Label>
            <Select value={form.city} onValueChange={(v) => setForm({...form, city: v})}>
              <SelectTrigger className="bg-secondary/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOROCCAN_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('Quartier', 'الحي')}</Label>
            <Input value={form.district} onChange={(e) => setForm({...form, district: e.target.value})} className="bg-secondary/50" />
          </div>
          <div>
            <Label>{t('Adresse', 'العنوان')}</Label>
            <Input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="bg-secondary/50" />
          </div>
        </div>

        <div>
          <Label>{t('Photos (jusqu\'à 10)', 'الصور (حتى 10)')}</Label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden glow-border">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1">
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 rounded">{t('Principale', 'رئيسية')}</span>}
              </div>
            ))}
            {files.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <Plus className="h-6 w-6" />
                <span className="text-xs">{t('Ajouter', 'إضافة')}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              </label>
            )}
          </div>
        </div>

        <Button onClick={submit} disabled={submitting} className="w-full glow-primary gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {t('Publier le bien', 'نشر العقار')}
        </Button>
      </div>
    </div>
  );
};

export default NewProperty;