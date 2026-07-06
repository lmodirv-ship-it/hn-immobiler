
REVOKE ALL ON FUNCTION public.get_owner_stats(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_owner_revenue_series(UUID, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_owner_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_owner_revenue_series(UUID, INT) TO authenticated;

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
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> _owner THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
  SELECT
    COALESCE((SELECT SUM(total_price) FROM public.bookings b WHERE b.host_id = _owner AND b.status IN ('confirmed','completed') AND b.check_in >= date_trunc('month', now())), 0)::NUMERIC,
    (SELECT COUNT(*) FROM public.bookings WHERE host_id = _owner AND status = 'pending')::BIGINT,
    (SELECT COUNT(*) FROM public.bookings WHERE host_id = _owner AND status = 'confirmed')::BIGINT,
    COALESCE((
      SELECT (SUM(LEAST(check_out, (date_trunc('month', now()) + interval '1 month')::date) - GREATEST(check_in, date_trunc('month', now())::date))::NUMERIC
        / NULLIF((EXTRACT(DAY FROM (date_trunc('month', now()) + interval '1 month' - interval '1 day')) * GREATEST((SELECT COUNT(*) FROM public.properties WHERE owner_id = _owner), 1)), 0)) * 100
      FROM public.bookings
      WHERE host_id = _owner AND status IN ('confirmed','completed')
        AND check_out >= date_trunc('month', now()) AND check_in < date_trunc('month', now()) + interval '1 month'
    ), 0)::NUMERIC,
    COALESCE((SELECT AVG(r.rating) FROM public.reviews r JOIN public.properties p ON p.id = r.property_id WHERE p.owner_id = _owner), 0)::NUMERIC,
    (SELECT COUNT(*) FROM public.reviews r JOIN public.properties p ON p.id = r.property_id WHERE p.owner_id = _owner)::BIGINT,
    (SELECT COUNT(*) FROM public.properties WHERE owner_id = _owner)::BIGINT,
    (SELECT COUNT(*) FROM public.messages WHERE recipient_id = _owner AND read_at IS NULL)::BIGINT;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_owner_revenue_series(_owner UUID, _months INT DEFAULT 6)
RETURNS TABLE(month DATE, revenue NUMERIC, bookings BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> _owner THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
  SELECT date_trunc('month', gs)::DATE,
    COALESCE(SUM(b.total_price), 0)::NUMERIC,
    COUNT(b.id)::BIGINT
  FROM generate_series(date_trunc('month', now()) - ((_months - 1) || ' months')::interval, date_trunc('month', now()), '1 month') AS gs
  LEFT JOIN public.bookings b
    ON b.host_id = _owner
    AND date_trunc('month', b.check_in) = date_trunc('month', gs)
    AND b.status IN ('confirmed','completed')
  GROUP BY gs
  ORDER BY gs;
END;
$$;

REVOKE ALL ON FUNCTION public.get_owner_stats(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_owner_revenue_series(UUID, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_owner_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_owner_revenue_series(UUID, INT) TO authenticated;
