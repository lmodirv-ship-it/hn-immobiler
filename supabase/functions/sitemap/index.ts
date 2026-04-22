import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://hn-immobiler.lovable.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: properties } = await supabase
      .from("properties")
      .select("id, updated_at")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(5000);

    const staticRoutes = [
      "", "/properties", "/map", "/about", "/contact",
      "/simulator", "/blog", "/auth", "/pricing",
    ];
    const LANGS = ["fr", "ar", "en", "es", "de"];

    const now = new Date().toISOString();

    const buildAlternates = (path: string) =>
      LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${path}" />`,
      ).join("\n") +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path}" />`;

    const urls = [
      ...staticRoutes.map(
        (r) => `<url>
  <loc>${SITE}${r}</loc>
  <lastmod>${now}</lastmod>
  <changefreq>daily</changefreq>
  <priority>${r === "" ? "1.0" : "0.8"}</priority>
${buildAlternates(r)}
</url>`,
      ),
      ...(properties || []).map(
        (p: any) => `<url>
  <loc>${SITE}/properties/${p.id}</loc>
  <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
${buildAlternates(`/properties/${p.id}`)}
</url>`,
      ),
    ].join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new Response(xml, { headers: corsHeaders, status: 200 });
  } catch (e) {
    console.error("sitemap error", e);
    return new Response("Error generating sitemap", {
      headers: { "Content-Type": "text/plain" },
      status: 500,
    });
  }
});