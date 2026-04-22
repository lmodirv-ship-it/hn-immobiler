
CREATE TABLE public.site_visits (
  id BIGSERIAL PRIMARY KEY,
  session_hash TEXT,
  country TEXT,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_visits_created ON public.site_visits(created_at DESC);
CREATE INDEX idx_site_visits_session ON public.site_visits(session_hash);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a visit"
  ON public.site_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Visit counts are public"
  ON public.site_visits FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.get_visitor_stats()
RETURNS TABLE(total BIGINT, today BIGINT, online BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.site_visits)::BIGINT AS total,
    (SELECT COUNT(*) FROM public.site_visits WHERE created_at >= CURRENT_DATE)::BIGINT AS today,
    (SELECT COUNT(DISTINCT session_hash) FROM public.site_visits WHERE created_at >= now() - interval '5 minutes')::BIGINT AS online;
$$;
