import { useEffect, useState } from "react";
import { Eye, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "hn_visit_session";
const LOGGED_KEY = "hn_visit_logged_at";

const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const VisitorCounter = () => {
  const { lang } = useLanguage();
  const [stats, setStats] = useState<{ total: number; online: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    const log = async () => {
      // Throttle: log once per 5 min per session
      const last = Number(localStorage.getItem(LOGGED_KEY) || 0);
      if (Date.now() - last > 5 * 60 * 1000) {
        localStorage.setItem(LOGGED_KEY, String(Date.now()));
        await supabase.from("site_visits").insert({
          session_hash: getSessionId(),
          path: window.location.pathname,
        });
      }
    };

    const fetchStats = async () => {
      const { data } = await supabase.rpc("get_visitor_stats");
      if (mounted && data && data[0]) {
        setStats({ total: Number(data[0].total), online: Number(data[0].online) });
      }
    };

    log().then(fetchStats);
    const interval = setInterval(fetchStats, 30000); // refresh every 30s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50">
      <div className="flex items-center gap-1.5" title={lang === "ar" ? "متصلون الآن" : "En ligne maintenant"}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span className="text-xs font-display font-bold text-accent tabular-nums">{stats.online}</span>
      </div>
      <div className="w-px h-4 bg-border/60" />
      <div className="flex items-center gap-1.5" title={lang === "ar" ? "إجمالي الزوار" : "Visiteurs totaux"}>
        <Eye className="h-3.5 w-3.5 text-primary" />
        <AnimatePresence mode="wait">
          <motion.span
            key={stats.total}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-display font-bold text-primary tabular-nums"
          >
            {stats.total.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VisitorCounter;