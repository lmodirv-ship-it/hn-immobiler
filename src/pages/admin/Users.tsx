import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Loader2, ShieldPlus, ShieldMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const ROLES = ['user', 'owner', 'agent', 'agency', 'tenant', 'admin'] as const;
type Role = typeof ROLES[number];

const UserRow = ({ u, addRole, removeRole, lang }: any) => {
  const [pick, setPick] = useState<Role>('owner');
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{u.full_name || '—'}</div>
        <div className="text-xs text-muted-foreground">{u.city || ''}</div>
      </TableCell>
      <TableCell>{u.phone || '—'}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {u.roles.length === 0 && <Badge variant="outline">user</Badge>}
          {u.roles.map((r: string) => (
            <Badge key={r} variant="outline" className="gap-1 cursor-pointer" onClick={() => removeRole(u.id, r)}>
              {r}<ShieldMinus className="h-3 w-3" />
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Select value={pick} onValueChange={(v) => setPick(v as Role)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
          <Button size="sm" onClick={() => addRole(u.id, pick)} className="gap-1"><ShieldPlus className="h-3.5 w-3.5" />{t('Ajouter', 'إضافة')}</Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AdminUsers = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const qc = useQueryClient();
  const [q, setQ] = useState('');

  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(500);
      const { data: roles } = await supabase.from('user_roles').select('user_id, role');
      const roleMap = new Map<string, string[]>();
      (roles || []).forEach((r) => {
        const arr = roleMap.get(r.user_id) || [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });
      return (profiles || []).map((p) => ({ ...p, roles: roleMap.get(p.id) || [] }));
    },
  });

  const addRole = async (uid: string, role: Role) => {
    const { error } = await supabase.from('user_roles').insert({ user_id: uid, role });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: t('Rôle ajouté', 'تمت الإضافة') });
    qc.invalidateQueries({ queryKey: ['admin-users'] });
  };
  const removeRole = async (uid: string, role: string) => {
    const { error } = await supabase.from('user_roles').delete().eq('user_id', uid).eq('role', role as any);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: t('Rôle retiré', 'تمت الإزالة') });
    qc.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const filtered = data.filter((u: any) =>
    !q || (u.full_name || '').toLowerCase().includes(q.toLowerCase()) || (u.phone || '').includes(q),
  );

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-6"><span className="text-gradient-cyber">{t('Utilisateurs', 'المستخدمون')}</span></h1>
      <Input placeholder={t('Rechercher…', 'ابحث…')} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm mb-4" />
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : (
        <div className="glass rounded-xl glow-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Nom', 'الاسم')}</TableHead>
                <TableHead>{t('Téléphone', 'الهاتف')}</TableHead>
                <TableHead>{t('Rôles', 'الأدوار')}</TableHead>
                <TableHead>{t('Actions', 'إجراءات')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u: any) => (
                <UserRow key={u.id} u={u} addRole={addRole} removeRole={removeRole} lang={lang} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;