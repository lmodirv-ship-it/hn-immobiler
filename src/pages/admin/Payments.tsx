import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, X, Clock, Filter, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getMethodMeta } from "@/lib/payment-methods";
import { Navigate } from "react-router-dom";

type Tx = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  reference: string | null;
  payer_name: string | null;
  payer_phone: string | null;
  agency_name: string | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  subscription_id: string | null;
  plan_id: string | null;
};

const AdminPayments = () => {
  const { isAdmin, loading } = useAuth();
  const { lang } = useLanguage();
  const t = (fr: string, ar: string) => (lang === "ar" ? ar : fr);
  const qc = useQueryClient();

  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("pending");
  const [selected, setSelected] = useState<Tx | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const { data: txs, isLoading } = useQuery({
    queryKey: ["admin-payments", filter],
    enabled: isAdmin,
    queryFn: async () => {
      let q = supabase.from("payment_transactions").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Tx[];
    },
  });

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const review = async (status: "confirmed" | "rejected") => {
    if (!selected) return;
    try {
      const { error } = await supabase
        .from("payment_transactions")
        .update({
          status,
          admin_notes: adminNote || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
      if (error) throw error;

      // Activate subscription if confirmed
      if (status === "confirmed" && selected.subscription_id) {
        const now = new Date();
        const ends = new Date(now);
        ends.setMonth(ends.getMonth() + 1);
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            starts_at: now.toISOString(),
            ends_at: ends.toISOString(),
          })
          .eq("id", selected.subscription_id);
      }

      toast.success(
        status === "confirmed"
          ? t("Paiement confirmé", "تم تأكيد الدفع")
          : t("Paiement rejeté", "تم رفض الدفع"),
      );
      setSelected(null);
      setAdminNote("");
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label_fr: string; label_ar: string; cls: string; icon: typeof Clock }> = {
      pending: { label_fr: "En attente", label_ar: "قيد الانتظار", cls: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: Clock },
      confirmed: { label_fr: "Confirmé", label_ar: "مؤكد", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: Check },
      rejected: { label_fr: "Rejeté", label_ar: "مرفوض", cls: "bg-rose-500/20 text-rose-300 border-rose-500/40", icon: X },
      refunded: { label_fr: "Remboursé", label_ar: "مُسترَد", cls: "bg-slate-500/20 text-slate-300 border-slate-500/40", icon: Clock },
    };
    const m = map[s] || map.pending;
    const Icon = m.icon;
    return (
      <Badge variant="outline" className={`gap-1 ${m.cls}`}>
        <Icon className="h-3 w-3" />
        {lang === "ar" ? m.label_ar : m.label_fr}
      </Badge>
    );
  };

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-3xl font-bold mb-1">
          <span className="text-gradient-cyber">{t("Gestion des paiements", "إدارة المدفوعات")}</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          {t(
            "Validez ou rejetez les paiements manuels reçus par virement, espèces ou agence.",
            "تحقق من المدفوعات اليدوية وأكد أو ارفض كل معاملة.",
          )}
        </p>
      </motion.div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground self-center" />
        {(["pending", "confirmed", "rejected", "all"] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
          >
            {s === "pending" && t("En attente", "قيد الانتظار")}
            {s === "confirmed" && t("Confirmés", "مؤكدة")}
            {s === "rejected" && t("Rejetés", "مرفوضة")}
            {s === "all" && t("Tous", "الكل")}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !txs || txs.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-muted-foreground">
          {t("Aucun paiement", "لا توجد مدفوعات")}
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-start p-3">{t("Date", "التاريخ")}</th>
                  <th className="text-start p-3">{t("Méthode", "الطريقة")}</th>
                  <th className="text-start p-3">{t("Payeur", "الدافع")}</th>
                  <th className="text-start p-3">{t("Montant", "المبلغ")}</th>
                  <th className="text-start p-3">{t("Référence", "المرجع")}</th>
                  <th className="text-start p-3">{t("Statut", "الحالة")}</th>
                  <th className="text-end p-3"></th>
                </tr>
              </thead>
              <tbody>
                {txs.map((tx) => {
                  const meta = getMethodMeta(tx.method);
                  return (
                    <tr key={tx.id} className="border-t border-border/40 hover:bg-secondary/20">
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleString(lang === "ar" ? "ar-MA" : "fr-FR")}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-lg">{meta?.emoji}</span>
                          <span className="font-display text-xs">
                            {lang === "ar" ? meta?.label_ar : meta?.label_fr}
                          </span>
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{tx.payer_name || "—"}</div>
                        {tx.payer_phone && (
                          <div className="text-xs text-muted-foreground">{tx.payer_phone}</div>
                        )}
                      </td>
                      <td className="p-3 font-display font-bold text-primary">
                        {Number(tx.amount).toLocaleString()} {tx.currency}
                      </td>
                      <td className="p-3 text-xs font-mono text-muted-foreground">
                        {tx.reference || "—"}
                      </td>
                      <td className="p-3">{statusBadge(tx.status)}</td>
                      <td className="p-3 text-end">
                        <Button size="sm" variant="ghost" onClick={() => { setSelected(tx); setAdminNote(tx.admin_notes || ""); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selected && getMethodMeta(selected.method)?.emoji}</span>
              {t("Détails du paiement", "تفاصيل الدفع")}
            </DialogTitle>
            <DialogDescription>
              {selected && new Date(selected.created_at).toLocaleString(lang === "ar" ? "ar-MA" : "fr-FR")}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{t("Montant", "المبلغ")}</div>
                  <div className="font-display font-bold text-primary text-lg">
                    {Number(selected.amount).toLocaleString()} {selected.currency}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("Statut", "الحالة")}</div>
                  {statusBadge(selected.status)}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("Payeur", "الدافع")}</div>
                  <div>{selected.payer_name || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("Téléphone", "الهاتف")}</div>
                  <div>{selected.payer_phone || "—"}</div>
                </div>
                {selected.agency_name && (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">{t("Agence", "الوكالة")}</div>
                    <div>{selected.agency_name}</div>
                  </div>
                )}
                {selected.reference && (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">{t("Référence", "المرجع")}</div>
                    <div className="font-mono">{selected.reference}</div>
                  </div>
                )}
                {selected.notes && (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">{t("Notes du client", "ملاحظات العميل")}</div>
                    <div className="bg-secondary/30 rounded p-2">{selected.notes}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">{t("Note admin", "ملاحظة الإدارة")}</div>
                <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={2} />
              </div>
              {selected.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => review("confirmed")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Check className="h-4 w-4" /> {t("Confirmer & activer", "تأكيد وتفعيل")}
                  </Button>
                  <Button onClick={() => review("rejected")} variant="destructive" className="flex-1">
                    <X className="h-4 w-4" /> {t("Rejeter", "رفض")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;