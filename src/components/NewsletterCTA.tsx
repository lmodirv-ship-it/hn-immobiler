import { useState } from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { motion } from "framer-motion";

const schema = z.object({ email: z.string().trim().email().max(255) });

const NewsletterCTA = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast({ title: isAr ? "بريد غير صالح" : "Email invalide", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email, lang });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast({ title: isAr ? "حدث خطأ" : "Une erreur est survenue", variant: "destructive" });
      return;
    }
    setDone(true);
    toast({
      title: isAr ? "تم الاشتراك! 🎉" : "Inscription réussie ! 🎉",
      description: isAr
        ? "ستصلك أحدث العقارات أسبوعياً"
        : "Vous recevrez les nouveaux biens chaque semaine",
    });
    setEmail("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container my-16"
    >
      <div className="glass-strong rounded-2xl p-8 md:p-12 glow-border relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-display tracking-widest uppercase text-primary">
                {isAr ? "نشرة حصرية" : "Newsletter exclusive"}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
              <span className="text-gradient-cyber">
                {isAr ? "كن أول من يعرف" : "Soyez les premiers informés"}
              </span>
            </h2>
            <p className="text-muted-foreground">
              {isAr
                ? "احصل على أحدث العقارات في المغرب مباشرة إلى بريدك. بدون رسائل مزعجة."
                : "Recevez les nouveaux biens au Maroc directement par email. Aucun spam."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={isAr ? "بريدك الإلكتروني" : "votre@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 h-12"
                disabled={loading || done}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading || done}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/80 glow-primary font-display tracking-wider"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : done ? (
                isAr ? "✓ مشترك" : "✓ Inscrit"
              ) : isAr ? (
                "اشترك الآن"
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsletterCTA;