import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Msg {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  property_id: string | null;
}
interface Thread {
  otherId: string;
  otherName: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

const Messages = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === 'ar' ? ar : fr);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadThreads();
    const channel = supabase.channel('messages-' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new as Msg;
        if (m.sender_id === user.id || m.recipient_id === user.id) {
          loadThreads();
          if (active && (m.sender_id === active || m.recipient_id === active)) {
            setMessages((prev) => [...prev, m]);
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, active]);

  useEffect(() => {
    if (active && user) loadConversation(active);
  }, [active, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadThreads = async () => {
    if (!user) return;
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    if (!msgs) { setLoading(false); return; }
    const map = new Map<string, Thread>();
    for (const m of msgs as Msg[]) {
      const other = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      if (!map.has(other)) {
        map.set(other, {
          otherId: other, otherName: '...', lastMessage: m.content,
          lastAt: m.created_at,
          unread: m.recipient_id === user.id && !((m as any).read_at) ? 1 : 0,
        });
      } else if (m.recipient_id === user.id && !((m as any).read_at)) {
        map.get(other)!.unread += 1;
      }
    }
    const otherIds = Array.from(map.keys());
    if (otherIds.length) {
      const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', otherIds);
      profs?.forEach((p) => { const th = map.get(p.id); if (th) th.otherName = p.full_name || 'Utilisateur'; });
    }
    setThreads(Array.from(map.values()));
    setLoading(false);
  };

  const loadConversation = async (otherId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherId}),and(sender_id.eq.${otherId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });
    setMessages((data || []) as Msg[]);
    // mark as read
    await supabase.from('messages').update({ read_at: new Date().toISOString() })
      .eq('recipient_id', user.id).eq('sender_id', otherId).is('read_at', null);
  };

  const send = async () => {
    if (!input.trim() || !user || !active) return;
    const content = input.trim();
    setInput('');
    await supabase.from('messages').insert({ sender_id: user.id, recipient_id: active, content });
  };

  if (loading) return <div className="container py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="container py-10">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold mb-6">
        <span className="text-gradient-cyber">{t('Messages', 'الرسائل')}</span>
      </motion.h1>
      {threads.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center glow-border">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground mb-4">{t('Aucune conversation pour le moment.', 'لا توجد محادثات بعد.')}</p>
          <Link to="/properties"><Button variant="outline" className="glow-border">{t('Parcourir les biens', 'تصفح العقارات')}</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
          <div className="glass rounded-xl glow-border overflow-y-auto">
            {threads.map((th) => (
              <button key={th.otherId} onClick={() => setActive(th.otherId)}
                className={`w-full text-left p-4 border-b border-border/30 hover:bg-secondary/40 transition-colors ${active === th.otherId ? 'bg-primary/10' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{th.otherName}</span>
                  {th.unread > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{th.unread}</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{th.lastMessage}</p>
              </button>
            ))}
          </div>
          <div className="md:col-span-2 glass rounded-xl glow-border flex flex-col">
            {!active ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {t('Sélectionnez une conversation', 'اختر محادثة')}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                        <p className="text-sm whitespace-pre-line">{m.content}</p>
                        <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString(lang === 'ar' ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
                <div className="border-t border-border/30 p-3 flex gap-2">
                  <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder={t('Écrire un message...', 'اكتب رسالة...')} className="bg-secondary/50" />
                  <Button onClick={send} disabled={!input.trim()} className="glow-primary"><Send className="h-4 w-4" /></Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
