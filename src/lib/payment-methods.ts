import { Banknote, Wallet, CreditCard, Building, Globe, Send, Store, Smartphone } from "lucide-react";

export type PaymentMethodKey =
  | "cash" | "wallet" | "cmi" | "payzone" | "stripe"
  | "bank_transfer" | "agency_transfer" | "paypal";

export interface PaymentMethodMeta {
  key: PaymentMethodKey;
  label_fr: string;
  label_ar: string;
  desc_fr: string;
  desc_ar: string;
  icon: typeof Banknote;
  emoji: string;
  color: string;
  manual: boolean; // true = needs admin approval
  available: boolean;
}

export const PAYMENT_METHODS: PaymentMethodMeta[] = [
  {
    key: "cash",
    label_fr: "Espèces",
    label_ar: "نقداً",
    desc_fr: "Paiement en espèces au bureau",
    desc_ar: "الدفع نقداً في المكتب",
    icon: Banknote,
    emoji: "💵",
    color: "from-emerald-500/20 to-emerald-700/20 border-emerald-500/30",
    manual: true,
    available: true,
  },
  {
    key: "wallet",
    label_fr: "Portefeuille mobile",
    label_ar: "محفظة إلكترونية",
    desc_fr: "Cash, Inwi Money, Orange Money",
    desc_ar: "Cash, Inwi Money, Orange Money",
    icon: Smartphone,
    emoji: "📱",
    color: "from-orange-500/20 to-orange-700/20 border-orange-500/30",
    manual: true,
    available: true,
  },
  {
    key: "cmi",
    label_fr: "CMI 🇲🇦",
    label_ar: "CMI 🇲🇦",
    desc_fr: "Carte bancaire marocaine",
    desc_ar: "بطاقة بنكية مغربية",
    icon: CreditCard,
    emoji: "🇲🇦",
    color: "from-red-500/20 to-red-700/20 border-red-500/30",
    manual: true, // becomes false when merchant credentials added
    available: true,
  },
  {
    key: "payzone",
    label_fr: "PayZone 💠",
    label_ar: "PayZone 💠",
    desc_fr: "Passerelle marocaine",
    desc_ar: "بوابة مغربية",
    icon: Globe,
    emoji: "💠",
    color: "from-cyan-500/20 to-cyan-700/20 border-cyan-500/30",
    manual: true,
    available: true,
  },
  {
    key: "stripe",
    label_fr: "Carte internationale",
    label_ar: "بطاقة دولية",
    desc_fr: "Visa, Mastercard via Stripe",
    desc_ar: "Visa, Mastercard عبر Stripe",
    icon: CreditCard,
    emoji: "💳",
    color: "from-indigo-500/20 to-indigo-700/20 border-indigo-500/30",
    manual: true,
    available: true,
  },
  {
    key: "bank_transfer",
    label_fr: "Virement bancaire",
    label_ar: "تحويل بنكي",
    desc_fr: "Attijariwafa, Barid, BMCE...",
    desc_ar: "تحويل عبر البنك",
    icon: Building,
    emoji: "🏦",
    color: "from-blue-500/20 to-blue-700/20 border-blue-500/30",
    manual: true,
    available: true,
  },
  {
    key: "agency_transfer",
    label_fr: "Agence (Wafacash, CashPlus, Barid)",
    label_ar: "وكالة (Wafacash, CashPlus, Barid)",
    desc_fr: "Transfert via agence physique",
    desc_ar: "تحويل عبر وكالة",
    icon: Store,
    emoji: "🏪",
    color: "from-purple-500/20 to-purple-700/20 border-purple-500/30",
    manual: true,
    available: true,
  },
  {
    key: "paypal",
    label_fr: "PayPal",
    label_ar: "PayPal",
    desc_fr: "Paiement international PayPal",
    desc_ar: "دفع دولي PayPal",
    icon: Send,
    emoji: "🅿️",
    color: "from-sky-500/20 to-sky-700/20 border-sky-500/30",
    manual: true,
    available: true,
  },
];

export const getMethodMeta = (key: string): PaymentMethodMeta | undefined =>
  PAYMENT_METHODS.find((m) => m.key === key);