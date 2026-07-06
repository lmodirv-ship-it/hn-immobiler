import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Send, Loader2, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Notifications = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [kind, setKind] = useState('info');
  const [link, setLink] = useState('');
  const [target, setTarget] = useState('all');

  const send = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('broadcast_notification', {
        _title: title, _body: body, _kind: kind,
        _link: link || null,
        _target_role: target === 'all' ? null : (target as any),
      });
      if (error) throw error;
      await supabase.from('admin_audit_log').insert({
        admin_id: user!.id, action: 'broadcast_notification',
        metadata: { title, body, kind, target, recipients: data } as any,
      });
      return data;
    },
    onSuccess: (count) => {
      toast.success(t(`Envoyée à ${count} utilisateur·rice·s`, `أُرسلت إلى ${count} مستخدم`));
      setTitle(''); setBody(''); setLink('');
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold flex items-center gap-3">
        <Megaphone className="h-7 w-7 text-primary" />
        <span className="text-gradient-cyber">{t('Diffusion d’annonces', 'بث الإعلانات')}</span>
      </motion.h1>
      <p className="text-sm text-muted-foreground">
        {t('Envoyer une notification en temps réel à tous les utilisateurs ou à un rôle précis.',
          'إرسال إشعار فوري إلى جميع المستخدمين أو دور محدد.')}
      </p>

      <div className="glass rounded-xl p-6 glow-border space-y-4">
        <div>
          <Label>{t('Cible', 'الفئة المستهدفة')}</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Tous les utilisateurs', 'كل المستخدمين')}</SelectItem>
              <SelectItem value="user">{t('Locataires (rôle user)', 'المستأجرون')}</SelectItem>
              <SelectItem value="owner">{t('Propriétaires', 'الملاك')}</SelectItem>
              <SelectItem value="agent">{t('Agents', 'الوكلاء')}</SelectItem>
              <SelectItem value="admin">{t('Administrateurs', 'المشرفون')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t('Type', 'النوع')}</Label>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="promo">Promo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>{t('Titre', 'العنوان')}</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></div>
        <div><Label>{t('Message', 'الرسالة')}</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} maxLength={500} /></div>
        <div><Label>{t('Lien (facultatif)', 'رابط (اختياري)')}</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/properties" /></div>

        <Button
          onClick={() => send.mutate()}
          disabled={send.isPending || !title.trim()}
          className="glow-primary gap-2"
        >
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {t('Envoyer', 'إرسال')}
        </Button>
      </div>
    </div>
  );
};

export default Notifications;