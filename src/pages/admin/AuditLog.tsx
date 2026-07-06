import { useAdminAuditLog } from '@/hooks/useAdminStats';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Loader2, ScrollText } from 'lucide-react';

const AuditLog = () => {
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const { data = [], isLoading } = useAdminAuditLog(200);

  return (
    <div className="p-6 space-y-4">
      <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold flex items-center gap-3">
        <ScrollText className="h-7 w-7 text-primary" />
        <span className="text-gradient-cyber">{t('Journal d’audit', 'سجل التدقيق')}</span>
      </motion.h1>
      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-14 text-muted-foreground glass rounded-xl">{t('Aucune action enregistrée', 'لا توجد إجراءات مسجّلة')}</div>
      ) : (
        <div className="glass rounded-xl divide-y divide-border/40 overflow-hidden">
          {(data as any[]).map((r) => (
            <div key={r.id} className="p-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              <span className="font-medium text-primary">{r.action}</span>
              {r.entity_type && <span className="text-xs text-muted-foreground">{r.entity_type}#{String(r.entity_id || '').slice(0, 8)}</span>}
              <span className="text-xs text-muted-foreground ml-auto font-mono">admin: {String(r.admin_id).slice(0, 8)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLog;