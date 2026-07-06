import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const RoleRequests = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-role-requests'],
    queryFn: async () => {
      const { data } = await supabase
        .from('role_requests')
        .select('*, profiles!role_requests_user_id_fkey(full_name, phone)')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const decide = async (r: any, approve: boolean) => {
    if (approve) {
      const { error: e1 } = await supabase.from('user_roles').insert({ user_id: r.user_id, role: r.requested_role });
      if (e1 && !e1.message.includes('duplicate')) return toast({ title: 'Erreur', description: e1.message, variant: 'destructive' });
    }
    await supabase.from('role_requests').update({ status: approve ? 'approved' : 'rejected', reviewed_by: user!.id, reviewed_at: new Date().toISOString() }).eq('id', r.id);
    await supabase.from('admin_audit_log').insert({ admin_id: user!.id, action: approve ? 'approve_role_request' : 'reject_role_request', entity_type: 'role_request', entity_id: r.id, metadata: { role: r.requested_role, user_id: r.user_id } });
    toast({ title: approve ? t('Approuvé', 'موافق عليه') : t('Rejeté', 'مرفوض') });
    qc.invalidateQueries({ queryKey: ['admin-role-requests'] });
  };

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-6"><span className="text-gradient-cyber">{t('Demandes de rôle', 'طلبات الأدوار')}</span></h1>
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : (
        <div className="space-y-3">
          {data.length === 0 && <p className="text-center text-muted-foreground py-10 glass rounded-xl">{t('Aucune demande', 'لا توجد طلبات')}</p>}
          {data.map((r: any) => (
            <div key={r.id} className="glass rounded-xl p-4 glow-border flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="font-semibold">{r.profiles?.full_name || r.user_id.slice(0, 8)}</div>
                <div className="text-sm text-muted-foreground">{r.profiles?.phone || ''}</div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge>{r.requested_role}</Badge>
                  <Badge variant="outline">{r.status}</Badge>
                </div>
                {r.reason && <p className="text-sm mt-2 text-muted-foreground">{r.reason}</p>}
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => decide(r, true)} className="gap-1"><Check className="h-3.5 w-3.5" />{t('Approuver', 'موافقة')}</Button>
                  <Button size="sm" variant="destructive" onClick={() => decide(r, false)} className="gap-1"><X className="h-3.5 w-3.5" />{t('Rejeter', 'رفض')}</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleRequests;