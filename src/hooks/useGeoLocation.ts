import { useEffect, useState } from "react";

export interface GeoInfo {
  country: string; // ISO 3166-1 alpha-2 (e.g. "MA", "FR")
  countryName: string;
  flag: string; // emoji
  city?: string;
  suggestedLang: "fr" | "ar";
}

const CACHE_KEY = "hn_geo_v1";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

// Countries where Arabic is the suggested default
const ARABIC_COUNTRIES = new Set([
  "MA", "DZ", "TN", "EG", "SA", "AE", "QA", "KW", "BH", "OM",
  "JO", "LB", "SY", "IQ", "YE", "PS", "LY", "SD", "MR", "DJ", "SO", "KM",
]);

const flagEmoji = (code: string) =>
  code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");

const countryName = (code: string, lang: string) => {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
};

export const useGeoLocation = () => {
  const [geo, setGeo] = useState<GeoInfo | null>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.t < CACHE_TTL) return parsed.data;
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(!geo);

  useEffect(() => {
    if (geo) return;
    let cancelled = false;

    const fallback = (): GeoInfo => {
      const browserLang = navigator.language?.toLowerCase() || "fr";
      const isAr = browserLang.startsWith("ar");
      const code = isAr ? "MA" : browserLang.includes("-") ? browserLang.split("-")[1].toUpperCase() : "MA";
      return {
        country: code,
        countryName: countryName(code, isAr ? "ar" : "fr"),
        flag: flagEmoji(code),
        suggestedLang: isAr ? "ar" : "fr",
      };
    };

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
        if (!res.ok) throw new Error("geo failed");
        const data = await res.json();
        const code: string = (data.country_code || "MA").toUpperCase();
        const info: GeoInfo = {
          country: code,
          countryName: countryName(code, ARABIC_COUNTRIES.has(code) ? "ar" : "fr"),
          flag: flagEmoji(code),
          city: data.city,
          suggestedLang: ARABIC_COUNTRIES.has(code) ? "ar" : "fr",
        };
        if (cancelled) return;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: info }));
        setGeo(info);
      } catch {
        if (!cancelled) setGeo(fallback());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [geo]);

  return { geo, loading };
};