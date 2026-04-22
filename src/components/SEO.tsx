import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  lang?: "fr" | "ar" | "en";
  jsonLd?: Record<string, any>;
  keywords?: string[];
}

const SITE = "https://hn-immobiler.lovable.app";
const DEFAULT_IMG = `${SITE}/og-default.jpg`;

const SEO = ({
  title,
  description,
  image = DEFAULT_IMG,
  url,
  type = "website",
  lang = "fr",
  jsonLd,
  keywords = [],
}: SEOProps) => {
  const fullUrl = url
    ? url.startsWith("http")
      ? url
      : `${SITE}${url}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE;
  const fullTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const fullDesc = description.length > 160 ? description.slice(0, 157) + "..." : description;
  const ogLocale = lang === "ar" ? "ar_MA" : lang === "en" ? "en_US" : "fr_MA";

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const setMeta = (selector: string, attr: string, key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement(selector.startsWith("link") ? "link" : "meta") as any;
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      if (selector.startsWith("link")) (el as HTMLLinkElement).href = value;
      else (el as HTMLMetaElement).content = value;
    };

    setMeta(`meta[name="description"]`, "name", "description", fullDesc);
    if (keywords.length) setMeta(`meta[name="keywords"]`, "name", "keywords", keywords.join(", "));
    setMeta(`link[rel="canonical"]`, "rel", "canonical", fullUrl);

    setMeta(`meta[property="og:type"]`, "property", "og:type", type);
    setMeta(`meta[property="og:title"]`, "property", "og:title", fullTitle);
    setMeta(`meta[property="og:description"]`, "property", "og:description", fullDesc);
    setMeta(`meta[property="og:image"]`, "property", "og:image", image);
    setMeta(`meta[property="og:url"]`, "property", "og:url", fullUrl);
    setMeta(`meta[property="og:locale"]`, "property", "og:locale", ogLocale);
    setMeta(`meta[property="og:site_name"]`, "property", "og:site_name", "HN Immobilier");

    setMeta(`meta[name="twitter:card"]`, "name", "twitter:card", "summary_large_image");
    setMeta(`meta[name="twitter:title"]`, "name", "twitter:title", fullTitle);
    setMeta(`meta[name="twitter:description"]`, "name", "twitter:description", fullDesc);
    setMeta(`meta[name="twitter:image"]`, "name", "twitter:image", image);

    // JSON-LD
    const existing = document.getElementById("seo-jsonld");
    if (existing) existing.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "seo-jsonld";
      s.text = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [fullTitle, fullDesc, fullUrl, image, type, lang, ogLocale, keywords.join(","), JSON.stringify(jsonLd)]);

  return null;
};

export default SEO;