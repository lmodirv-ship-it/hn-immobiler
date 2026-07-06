
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS owner_reply TEXT,
  ADD COLUMN IF NOT EXISTS owner_reply_at TIMESTAMPTZ;

-- Allow owners to update owner_reply on their properties' reviews
DROP POLICY IF EXISTS "Owners can reply to reviews on their properties" ON public.reviews;
CREATE POLICY "Owners can reply to reviews on their properties"
ON public.reviews FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = reviews.property_id AND p.owner_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = reviews.property_id AND p.owner_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.get_owner_stats(_owner UUID)
RETURNS TABLE(
  month_revenue NUMERIC,
  pending_bookings BIGINT,
  confirmed_bookings BIGINT,
  occupancy_rate NUMERIC,
  avg_rating NUMERIC,
  total_reviews BIGINT,
  total_properties BIGINT,
  unread_messages BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    COALESCE((
      SELECT SUM(total_price) FROM public.bookings b
      WHERE b.host_id = _owner
        AND b.status IN ('confirmed','completed')
        AND b.check_in >= date_trunc('month', now())
    ), 0)::NUMERIC AS month_revenue,
    (SELECT COUNT(*) FROM public.bookings WHERE host_id = _owner AND status = 'pending')::BIGINT AS pending_bookings,
    (SELECT COUNT(*) FROM public.bookings WHERE host_id = _owner AND status = 'confirmed')::BIGINT AS confirmed_bookings,
    COALESCE((
      SELECT
        (SUM(LEAST(check_out, (date_trunc('month', now()) + interval '1 month')::date) - GREATEST(check_in, date_trunc('month', now())::date))::NUMERIC
         / NULLIF((EXTRACT(DAY FROM (date_trunc('month', now()) + interval '1 month' - interval '1 day')) * GREATEST((SELECT COUNT(*) FROM public.properties WHERE owner_id = _owner), 1)), 0)) * 100
      FROM public.bookings
      WHERE host_id = _owner
        AND status IN ('confirmed','completed')
        AND check_out >= date_trunc('month', now())
        AND check_in < date_trunc('month', now()) + interval '1 month'
    ), 0)::NUMERIC AS occupancy_rate,
    COALESCE((
      SELECT AVG(r.rating) FROM public.reviews r
      JOIN public.properties p ON p.id = r.property_id
      WHERE p.owner_id = _owner
    ), 0)::NUMERIC AS avg_rating,
    (SELECT COUNT(*) FROM public.reviews r
      JOIN public.properties p ON p.id = r.property_id
      WHERE p.owner_id = _owner)::BIGINT AS total_reviews,
    (SELECT COUNT(*) FROM public.properties WHERE owner_id = _owner)::BIGINT AS total_properties,
    (SELECT COUNT(*) FROM public.messages WHERE recipient_id = _owner AND read_at IS NULL)::BIGINT AS unread_messages;
$$;

CREATE OR REPLACE FUNCTION public.get_owner_revenue_series(_owner UUID, _months INT DEFAULT 6)
RETURNS TABLE(month DATE, revenue NUMERIC, bookings BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    date_trunc('month', gs)::DATE AS month,
    COALESCE(SUM(b.total_price), 0)::NUMERIC AS revenue,
    COUNT(b.id)::BIGINT AS bookings
  FROM generate_series(date_trunc('month', now()) - ((_months - 1) || ' months')::interval, date_trunc('month', now()), '1 month') AS gs
  LEFT JOIN public.bookings b
    ON b.host_id = _owner
    AND date_trunc('month', b.check_in) = date_trunc('month', gs)
    AND b.status IN ('confirmed','completed')
  GROUP BY gs
  ORDER BY gs;
$$;

-- Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
