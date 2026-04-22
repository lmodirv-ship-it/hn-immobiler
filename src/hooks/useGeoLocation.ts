import { useEffect, useState } from "react";

export interface GeoInfo {
  country: string; // ISO 3166-1 alpha-2 (e.g. "MA", "FR")
  countryName: string;
  flag: string; // emoji
  city?: string;
  suggestedLang: "fr" | "ar" | "en" | "es" | "de";
}

const CACHE_KEY = "hn_geo_v1";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

// Country → suggested UI language
const LANG_BY_COUNTRY: Record<string, "ar" | "fr" | "en" | "es" | "de"> = {
  MA: "ar", DZ: "ar", TN: "ar", EG: "ar", SA: "ar", AE: "ar", QA: "ar", KW: "ar", BH: "ar", OM: "ar",
  JO: "ar", LB: "ar", SY: "ar", IQ: "ar", YE: "ar", PS: "ar", LY: "ar", SD: "ar", MR: "ar", DJ: "ar", SO: "ar", KM: "ar",
  FR: "fr", BE: "fr", LU: "fr", CH: "fr", CA: "fr", SN: "fr", CI: "fr", ML: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", CL: "es", VE: "es",
  DE: "de", AT: "de",
  US: "en", GB: "en", IE: "en", AU: "en", NZ: "en", IN: "en", ZA: "en", NG: "en",
};
const suggestLang = (code: string): "ar" | "fr" | "en" | "es" | "de" => LANG_BY_COUNTRY[code] || "en";

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
      const code = browserLang.includes("-") ? browserLang.split("-")[1].toUpperCase() : "MA";
      const sl = suggestLang(code);
      return {
        country: code,
        countryName: countryName(code, sl),
        flag: flagEmoji(code),
        suggestedLang: sl,
      };
    };

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
        if (!res.ok) throw new Error("geo failed");
        const data = await res.json();
        const code: string = (data.country_code || "MA").toUpperCase();
        const sl = suggestLang(code);
        const info: GeoInfo = {
          country: code,
          countryName: countryName(code, sl),
          flag: flagEmoji(code),
          city: data.city,
          suggestedLang: sl,
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