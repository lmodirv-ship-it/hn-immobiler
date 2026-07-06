
-- Extend roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'tenant';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'visitor';

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  nights INTEGER GENERATED ALWAYS AS ((check_out - check_in)) STORED,
  price_per_night NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MAD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed','rejected')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded','partial')),
  special_requests TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (check_out > check_in),
  CHECK (guests > 0)
);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host ON public.bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = guest_id OR auth.uid() = host_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "bookings_insert_guest" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "bookings_update_involved" ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = guest_id OR auth.uid() = host_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = guest_id OR auth.uid() = host_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "bookings_delete_admin" ON public.bookings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-fill host_id from property owner
CREATE OR REPLACE FUNCTION public.set_booking_host()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.host_id IS NULL THEN
    SELECT owner_id INTO NEW.host_id FROM public.properties WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_bookings_set_host BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_host();

-- ============ PROPERTY AVAILABILITY ============
CREATE TABLE IF NOT EXISTS public.property_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  price_override NUMERIC(14,2),
  min_stay INTEGER DEFAULT 1,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, date)
);
CREATE INDEX IF NOT EXISTS idx_availability_property_date ON public.property_availability(property_id, date);

GRANT SELECT ON public.property_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_availability TO authenticated;
GRANT ALL ON public.property_availability TO service_role;
ALTER TABLE public.property_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability_select_all" ON public.property_availability FOR SELECT
  USING (true);
CREATE POLICY "availability_manage_owner" ON public.property_availability FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));

CREATE TRIGGER trg_availability_updated BEFORE UPDATE ON public.property_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ADMIN AUDIT LOG ============
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON public.admin_audit_log(entity_type, entity_id);

GRANT SELECT, INSERT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_admin_select" ON public.admin_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "audit_admin_insert" ON public.admin_audit_log FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') AND admin_id = auth.uid());

-- ============ ROLE REQUESTS ============
CREATE TABLE IF NOT EXISTS public.role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role app_role NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_role_requests_user ON public.role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON public.role_requests(status);

GRANT SELECT, INSERT, UPDATE ON public.role_requests TO authenticated;
GRANT ALL ON public.role_requests TO service_role;
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rr_select_own_or_admin" ON public.role_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "rr_insert_own" ON public.role_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "rr_update_admin" ON public.role_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_role_requests_updated BEFORE UPDATE ON public.role_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ FIX SUBSCRIPTIONS UPDATE POLICY ============
DROP POLICY IF EXISTS "Admins update subscriptions" ON public.subscriptions;
CREATE POLICY "subscriptions_update_admin" ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "subscriptions_cancel_own" ON public.subscriptions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'cancelled'
  );
