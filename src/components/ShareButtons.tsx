import { Facebook, Twitter, Send, Link2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string;
  compact?: boolean;
}

const ShareButtons = ({ url, title, text = "", compact = false }: ShareButtonsProps) => {
  const { lang } = useLanguage();
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
  const enc = encodeURIComponent;
  const msg = `${title}${text ? " — " + text : ""}`;

  const links = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${enc(msg + " " + fullUrl)}`,
      color: "text-[#25D366]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(fullUrl)}`,
      color: "text-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${enc(msg)}&url=${enc(fullUrl)}`,
      color: "text-[#1DA1F2]",
    },
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${enc(fullUrl)}&text=${enc(msg)}`,
      color: "text-[#0088cc]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${enc(title)}&body=${enc(msg + "\n\n" + fullUrl)}`,
      color: "text-accent",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({ title: lang === "ar" ? "تم نسخ الرابط" : "Lien copié" });
    } catch {
      toast({ title: lang === "ar" ? "خطأ" : "Erreur", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {!compact && (
        <span className="text-xs text-muted-foreground font-display tracking-wider uppercase mr-1">
          {lang === "ar" ? "شارك" : "Partager"}
        </span>
      )}
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.name}
          className={`p-2 rounded-full bg-secondary/50 hover:bg-secondary glow-border transition-all ${l.color}`}
        >
          <l.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="p-2 rounded-full bg-secondary/50 hover:bg-secondary glow-border transition-all text-muted-foreground"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ShareButtons;