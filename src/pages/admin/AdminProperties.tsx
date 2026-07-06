import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, Star, CheckCircle2, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminProperties = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data } = await supabase.from('properties').select('id,title,city,price,currency,status,verified,featured,views_count,created_at').order('created_at', { ascending: false }).limit(500);
      return data || [];
    },
  });

  const patch = async (id: string, values: any, msg: string) => {
    const { error } = await supabase.from('properties').update(values).eq('id', id);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: msg });
    qc.invalidateQueries({ queryKey: ['admin-properties'] });
  };
  const remove = async (id: string) => {
    if (!confirm(t('Supprimer ce bien ?', 'حذف هذا العقار؟'))) return;
    await supabase.from('properties').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['admin-properties'] });
  };

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-6"><span className="text-gradient-cyber">{t('Modération des biens', 'إدارة العقارات')}</span></h1>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : (
        <div className="glass rounded-xl glow-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Titre', 'العنوان')}</TableHead>
                <TableHead>{t('Ville', 'المدينة')}</TableHead>
                <TableHead>{t('Prix', 'السعر')}</TableHead>
                <TableHead>{t('Statut', 'الحالة')}</TableHead>
                <TableHead>{t('Actions', 'إجراءات')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <Link to={`/properties/${p.id}`} className="line-clamp-1 hover:text-primary"><ExternalLink className="h-3.5 w-3.5 inline mr-1" />{p.title}</Link>
                      {p.featured && <Badge className="text-xs">★</Badge>}
                      {p.verified && <Badge variant="outline" className="text-xs text-primary">✓</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.views_count} vues</div>
                  </TableCell>
                  <TableCell>{p.city}</TableCell>
                  <TableCell className="font-display text-gradient-gold">{Number(p.price).toLocaleString()} {p.currency}</TableCell>
                  <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      <Button size="icon" variant="outline" title="Feature" onClick={() => patch(p.id, { featured: !p.featured }, t('Mis à jour', 'تم التحديث'))}><Star className={`h-3.5 w-3.5 ${p.featured ? 'fill-yellow-500 text-yellow-500' : ''}`} /></Button>
                      <Button size="icon" variant="outline" title="Verify" onClick={() => patch(p.id, { verified: !p.verified }, t('Mis à jour', 'تم التحديث'))}><CheckCircle2 className={`h-3.5 w-3.5 ${p.verified ? 'text-primary' : ''}`} /></Button>
                      <Button size="icon" variant="outline" title="Suspend" onClick={() => patch(p.id, { status: p.status === 'active' ? 'inactive' : 'active' }, t('Mis à jour', 'تم التحديث'))}><XCircle className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="destructive" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;