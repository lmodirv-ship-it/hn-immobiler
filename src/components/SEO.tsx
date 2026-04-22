import { Helmet } from "react-helmet-async";

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

  return (
    <Helmet>
      <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content="HN Immobilier" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={image} />

      {/* Alternate languages */}
      <link rel="alternate" hrefLang="fr" href={fullUrl} />
      <link rel="alternate" hrefLang="ar" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;