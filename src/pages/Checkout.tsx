import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PAYMENT_METHODS, type PaymentMethodKey } from "@/lib/payment-methods";
import SEO from "@/components/SEO";

const Checkout = () => {
  const { planId } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);

  const [selected, setSelected] = useState<PaymentMethodKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: plan } = useQuery({
    queryKey: ["plan", planId],
    enabled: !!planId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: bankAccounts } = useQuery({
    queryKey: ["bank_accounts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("active", true)
        .order("display_order");
      return data ?? [];
    },
  });

  const handleSubmit = async () => {
    if (!selected || !user || !plan) return;
    setSubmitting(true);
    try {
      const { data: sub, error: subErr } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: "pending",
        })
        .select()
        .single();
      if (subErr) throw subErr;

      const { error: payErr } = await supabase.from("payment_transactions").insert({
        user_id: user.id,
        subscription_id: sub.id,
        plan_id: plan.id,
        amount: plan.price,
        currency: plan.currency,
        method: selected,
        status: "pending",
        reference: reference || null,
        payer_name: payerName || null,
        payer_phone: payerPhone || null,
        agency_name: agency || null,
        notes: notes || null,
      });
      if (payErr) throw payErr;

      setSuccess(true);
      toast.success(
        t("Paiement enregistré ! En attente de validation.", "تم تسجيل الدفع! في انتظار التحقق."),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!plan) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto glass-strong rounded-2xl p-8 text-center glow-primary"
        >
          <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2 text-gradient-gold">
            {t("Demande reçue !", "تم استلام الطلب!")}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {t(
              "Notre équipe vérifiera votre paiement et activera votre abonnement sous 24h.",
              "سيقوم فريقنا بالتحقق من الدفع وتفعيل اشتراكك خلال 24 ساعة.",
            )}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard"><Button variant="outline">{t("Mon espace", "لوحتي")}</Button></Link>
            <Link to="/"><Button>{t("Accueil", "الرئيسية")}</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedMeta = selected ? PAYMENT_METHODS.find((m) => m.key === selected) : null;
  const filteredAccounts = bankAccounts?.filter((b) => {
    if (selected === "bank_transfer") return b.account_type === "bank";
    if (selected === "agency_transfer")
      return ["wafacash", "cashplus", "barid"].includes(b.account_type);
    return false;
  });

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast.success(t("Copié !", "تم النسخ!"));
  };

  return (
    <>
      <SEO title={t("Paiement", "الدفع")} description={t("Choisir un mode de paiement", "اختيار طريقة الدفع")} />
      <div className="container py-10 max-w-4xl">
        <Button variant="ghost" onClick={() => nav(-1)} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> {t("Retour", "رجوع")}
        </Button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">
              <span className="text-gradient-cyber">{t("Mode de paiement", "طريقة الدفع")}</span>
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {t("Choisissez votre méthode préférée", "اختر طريقتك المفضلة")}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {PAYMENT_METHODS.map((m) => (
                <motion.button
                  key={m.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(m.key)}
                  className={`relative p-4 rounded-xl border-2 text-start transition-all ${
                    selected === m.key
                      ? `bg-gradient-to-br ${m.color} border-primary glow-primary`
                      : "border-border bg-secondary/20 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{m.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm">
                        {lang === "ar" ? m.label_ar : m.label_fr}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {lang === "ar" ? m.desc_ar : m.desc_fr}
                      </div>
                    </div>
                    {selected === m.key && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selected && (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-xl p-5 space-y-4 glow-border"
                >
                  <h3 className="font-display font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">{selectedMeta?.emoji}</span>
                    {lang === "ar" ? selectedMeta?.label_ar : selectedMeta?.label_fr}
                  </h3>

                  {(selected === "bank_transfer" || selected === "agency_transfer") &&
                    filteredAccounts && filteredAccounts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {t("Versez à l'un de ces comptes :", "حوّل إلى أحد هذه الحسابات:")}
                        </p>
                        {filteredAccounts.map((acc) => (
                          <div key={acc.id} className="bg-secondary/40 rounded-lg p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-display font-bold text-sm">{acc.bank_name}</span>
                              <span className="text-xs text-muted-foreground">{acc.account_holder}</span>
                            </div>
                            {acc.rib && (
                              <button
                                onClick={() => copy(acc.rib!)}
                                className="flex items-center gap-2 text-xs font-mono text-primary hover:text-primary/80"
                              >
                                {acc.rib} <Copy className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                  {(selected === "cmi" || selected === "payzone" || selected === "stripe" || selected === "paypal") && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
                      ⚠️ {t(
                        "Passerelle en cours d'intégration. Pour le moment, contactez-nous après envoi du paiement.",
                        "البوابة قيد التكامل. حالياً، تواصل معنا بعد إرسال الدفع.",
                      )}
                    </div>
                  )}

                  {selected === "wallet" && (
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "Envoyez le montant via Cash, Inwi Money ou Orange Money au 06 12 34 56 78.",
                        "أرسل المبلغ عبر Cash أو Inwi Money أو Orange Money إلى 06 12 34 56 78.",
                      )}
                    </p>
                  )}

                  {selected === "cash" && (
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "Passez à notre bureau pour régler en espèces. Une confirmation sera envoyée.",
                        "مر بمكتبنا للدفع نقداً. سيتم إرسال تأكيد.",
                      )}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <Label className="text-xs">{t("Votre nom", "اسمك")}</Label>
                      <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">{t("Téléphone", "الهاتف")}</Label>
                      <Input value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} className="mt-1" />
                    </div>
                  </div>

                  {selected === "agency_transfer" && (
                    <div>
                      <Label className="text-xs">{t("Agence utilisée", "الوكالة المستعملة")}</Label>
                      <Input
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        placeholder="Wafacash, CashPlus, Barid..."
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(selected === "bank_transfer" || selected === "agency_transfer" ||
                    selected === "wallet" || selected === "paypal") && (
                    <div>
                      <Label className="text-xs">
                        {t("Référence / Numéro de transaction", "مرجع المعاملة")}
                      </Label>
                      <Input
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="TX-12345..."
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-xs">{t("Notes (optionnel)", "ملاحظات (اختياري)")}</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full glow-primary"
                    size="lg"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t(
                      `Confirmer le paiement de ${plan.price} ${plan.currency}`,
                      `تأكيد دفع ${plan.price} ${plan.currency}`,
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass-strong rounded-2xl p-5 glow-border">
              <div className="text-xs text-muted-foreground tracking-wider mb-2">
                {t("RÉCAPITULATIF", "ملخص الطلب")}
              </div>
              <h3 className="font-display text-xl font-bold mb-1">
                {lang === "ar" && plan.name_ar ? plan.name_ar : plan.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {t("Abonnement mensuel", "اشتراك شهري")}
              </p>
              <div className="border-t border-border/50 pt-3 flex justify-between items-baseline">
                <span className="text-sm">{t("Total", "المجموع")}</span>
                <span className="font-display text-2xl font-bold text-gradient-cyber">
                  {Number(plan.price).toLocaleString()} {plan.currency}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;