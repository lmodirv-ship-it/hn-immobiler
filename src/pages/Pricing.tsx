import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";

const planIcons: Record<string, typeof Sparkles> = {
  basic: Sparkles,
  pro: Zap,
  premium: Crown,
};

const Pricing = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription_plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <SEO
        title={t("Tarifs - HN Immobilier", "الأسعار - HN عقارات")}
        description={t(
          "Choisissez votre plan d'abonnement pour publier vos annonces immobilières au Maroc.",
          "اختر خطة اشتراكك لنشر إعلاناتك العقارية في المغرب.",
        )}
      />
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient-cyber">{t("Tarifs", "الأسعار")}</span>{" "}
            <span className="text-gradient-gold">{t("transparents", "شفافة")}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {t(
              "Choisissez l'abonnement adapté à vos besoins. Annulable à tout moment.",
              "اختر الاشتراك المناسب لاحتياجاتك. يمكن الإلغاء في أي وقت.",
            )}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans?.map((plan, i) => {
              const Icon = planIcons[plan.slug] || Sparkles;
              const features = (plan.features as string[]) || [];
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative glass-strong rounded-2xl p-7 ${
                    plan.featured
                      ? "glow-primary border-2 border-primary/50 scale-105"
                      : "glow-border"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-display font-bold tracking-wider">
                      {t("POPULAIRE", "الأكثر شعبية")}
                    </div>
                  )}
                  <Icon className={`h-10 w-10 mb-4 ${plan.featured ? "text-primary" : "text-accent"}`} />
                  <h3 className="font-display text-2xl font-bold mb-1">
                    {lang === "ar" && plan.name_ar ? plan.name_ar : plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display text-4xl font-bold text-gradient-cyber">
                      {Number(plan.price).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.currency} / {t("mois", "شهر")}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-7">
                    {features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={user ? `/checkout/${plan.id}` : "/auth"}>
                    <Button
                      className={`w-full ${
                        plan.featured
                          ? "glow-primary"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {user ? t("S'abonner", "اشترك الآن") : t("Se connecter", "تسجيل الدخول")}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Pricing;