import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useUnreadMessages(userId?: string) {
  const [count, setCount] = useState(0);

  const refresh = async () => {
    if (!userId) return;
    const { count: c } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .is('read_at', null);
    setCount(c ?? 0);
  };

  useEffect(() => {
    if (!userId) return;
    refresh();
    const channel = supabase
      .channel(`unread-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `recipient_id=eq.${userId}` },
        async (payload) => {
          const m: any = payload.new;
          setCount((c) => c + 1);
          let name = '';
          if (m.sender_id) {
            const { data } = await supabase.from('profiles').select('full_name').eq('id', m.sender_id).maybeSingle();
            name = data?.full_name || '';
          }
          toast({
            title: name ? `💬 ${name}` : '💬 Nouveau message',
            description: (m.content || '').slice(0, 120),
          });
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages', filter: `recipient_id=eq.${userId}` },
        () => refresh(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { unread: count, refresh };
}