import { useEffect, useRef } from "react";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

interface GeoBadgeProps {
  compact?: boolean;
}

const GeoBadge = ({ compact = false }: GeoBadgeProps) => {
  const { geo, loading } = useGeoLocation();
  const { lang, setLang } = useLanguage();
  const autoSetRef = useRef(false);

  // Auto-switch language to suggested one — only once per session, only if user
  // hasn't manually picked a language already.
  useEffect(() => {
    if (!geo || autoSetRef.current) return;
    autoSetRef.current = true;
    const userPicked = localStorage.getItem("hn_lang_picked");
    if (!userPicked && geo.suggestedLang !== lang) {
      setLang(geo.suggestedLang);
    }
  }, [geo, lang, setLang]);

  if (loading || !geo) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-muted-foreground">
        <Globe className="h-4 w-4 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 border border-border/50 glow-border"
      title={`${geo.countryName}${geo.city ? " — " + geo.city : ""}`}
    >
      <span className="text-base leading-none" aria-label={geo.countryName}>
        {geo.flag}
      </span>
      {!compact && (
        <span className="text-xs font-display tracking-wider text-muted-foreground uppercase">
          {geo.country}
        </span>
      )}
    </div>
  );
};

export default GeoBadge;