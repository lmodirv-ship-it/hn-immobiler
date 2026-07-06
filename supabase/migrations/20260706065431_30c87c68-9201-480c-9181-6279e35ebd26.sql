
-- Platform-wide configuration (single row edited by super admin)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  platform_name TEXT NOT NULL DEFAULT 'HN Immobilier',
  base_currency TEXT NOT NULL DEFAULT 'MAD',
  default_commission_pct NUMERIC(5,2) NOT NULL DEFAULT 8.00,
  vat_pct NUMERIC(5,2) NOT NULL DEFAULT 20.00,
  contact_email TEXT DEFAULT 'contact@hn-immo.com',
  support_phone TEXT,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);
GRANT SELECT ON public.platform_settings TO anon, authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_settings_read_all" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "platform_settings_admin_write" ON public.platform_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.platform_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

-- Per-owner commission override (nullable = use platform default)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS commission_pct NUMERIC(5,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN NOT NULL DEFAULT false;

-- Unified in-app notifications (per-user, with broadcast support)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_read_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "notif_admin_insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "notif_admin_delete" ON public.notifications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Broadcast helper: insert one notification per matching user
CREATE OR REPLACE FUNCTION public.broadcast_notification(
  _title TEXT, _body TEXT, _kind TEXT DEFAULT 'info', _link TEXT DEFAULT NULL, _target_role app_role DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _count INTEGER := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _target_role IS NULL THEN
    INSERT INTO public.notifications (user_id, title, body, kind, link, created_by)
    SELECT id, _title, _body, _kind, _link, auth.uid() FROM auth.users;
  ELSE
    INSERT INTO public.notifications (user_id, title, body, kind, link, created_by)
    SELECT ur.user_id, _title, _body, _kind, _link, auth.uid()
    FROM public.user_roles ur WHERE ur.role = _target_role;
  END IF;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END; $$;

-- Platform-wide admin KPIs (single-row result)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_users BIGINT, total_owners BIGINT, total_properties BIGINT,
  pending_properties BIGINT, bookings_today BIGINT, pending_bookings BIGINT,
  revenue_month NUMERIC, open_maintenance BIGINT, unpaid_invoices BIGINT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.profiles)::BIGINT,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_roles WHERE role = 'owner')::BIGINT,
    (SELECT COUNT(*) FROM public.properties)::BIGINT,
    (SELECT COUNT(*) FROM public.properties WHERE status = 'pending')::BIGINT,
    (SELECT COUNT(*) FROM public.bookings WHERE created_at >= CURRENT_DATE)::BIGINT,
    (SELECT COUNT(*) FROM public.bookings WHERE status = 'pending')::BIGINT,
    COALESCE((SELECT SUM(total_price) FROM public.bookings WHERE status IN ('confirmed','completed') AND check_in >= date_trunc('month', now())), 0)::NUMERIC,
    (SELECT COUNT(*) FROM public.maintenance_requests WHERE status IN ('pending','in_progress'))::BIGINT,
    (SELECT COUNT(*) FROM public.invoices WHERE status = 'unpaid')::BIGINT;
END; $$;

-- Platform revenue series (last N months)
CREATE OR REPLACE FUNCTION public.get_admin_revenue_series(_months INTEGER DEFAULT 12)
RETURNS TABLE(month DATE, revenue NUMERIC, bookings BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
  SELECT date_trunc('month', gs)::DATE,
    COALESCE(SUM(b.total_price), 0)::NUMERIC,
    COUNT(b.id)::BIGINT
  FROM generate_series(date_trunc('month', now()) - ((_months - 1) || ' months')::interval, date_trunc('month', now()), '1 month') AS gs
  LEFT JOIN public.bookings b ON date_trunc('month', b.check_in) = date_trunc('month', gs) AND b.status IN ('confirmed','completed')
  GROUP BY gs ORDER BY gs;
END; $$;

-- Admin visibility on core tables (idempotent)
DROP POLICY IF EXISTS "admin_all_properties" ON public.properties;
CREATE POLICY "admin_all_properties" ON public.properties FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin_all_bookings" ON public.bookings;
CREATE POLICY "admin_all_bookings" ON public.bookings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin_all_invoices" ON public.invoices;
CREATE POLICY "admin_all_invoices" ON public.invoices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin_all_maintenance" ON public.maintenance_requests;
CREATE POLICY "admin_all_maintenance" ON public.maintenance_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin_read_audit" ON public.admin_audit_log;
CREATE POLICY "admin_read_audit" ON public.admin_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
