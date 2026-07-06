
-- Extend reviews for property + booking linkage
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS reviews_one_per_booking ON public.reviews(booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reviews_property_idx ON public.reviews(property_id);

-- Ensure only guests of completed bookings can review that booking
DROP POLICY IF EXISTS reviews_insert_own ON public.reviews;
CREATE POLICY reviews_insert_own ON public.reviews
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = reviewer_id
  AND (
    booking_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id
        AND b.guest_id = auth.uid()
        AND b.status = 'completed'
    )
  )
);

-- Seasonal pricing on properties (JSONB: [{from,to,price}])
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS seasonal_pricing JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Prevent overlapping confirmed/pending bookings for the same property
CREATE OR REPLACE FUNCTION public.prevent_booking_overlap()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('cancelled','rejected') THEN
    RETURN NEW;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.property_id = NEW.property_id
      AND b.id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND b.status IN ('pending','confirmed','completed')
      AND daterange(b.check_in, b.check_out, '[)') && daterange(NEW.check_in, NEW.check_out, '[)')
  ) THEN
    RAISE EXCEPTION 'Booking dates overlap an existing reservation for this property';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_prevent_overlap ON public.bookings;
CREATE TRIGGER bookings_prevent_overlap
BEFORE INSERT OR UPDATE OF check_in, check_out, status ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.prevent_booking_overlap();

-- updated_at trigger for reviews
DROP TRIGGER IF EXISTS reviews_updated_at ON public.reviews;
CREATE TRIGGER reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
