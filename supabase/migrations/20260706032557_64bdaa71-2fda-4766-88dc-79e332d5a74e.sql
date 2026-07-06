
-- INVOICES
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL,
  tenant_id uuid,
  type text NOT NULL DEFAULT 'rent',
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'MAD',
  description text,
  due_date date NOT NULL,
  paid_at timestamptz,
  status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner and tenant can view invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = tenant_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner creates invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner updates invoices; tenant marks paid" ON public.invoices
  FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = tenant_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = owner_id OR auth.uid() = tenant_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner or admin deletes invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_invoices_owner ON public.invoices(owner_id);
CREATE INDEX idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX idx_invoices_property ON public.invoices(property_id);

-- MAINTENANCE REQUESTS
CREATE TABLE public.maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL,
  requester_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  photo_url text,
  priority text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'pending',
  cost numeric,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_requests TO authenticated;
GRANT ALL ON public.maintenance_requests TO service_role;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner and requester view maintenance" ON public.maintenance_requests
  FOR SELECT USING (auth.uid() = owner_id OR auth.uid() = requester_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Requester creates maintenance" ON public.maintenance_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Owner and requester update maintenance" ON public.maintenance_requests
  FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = requester_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = owner_id OR auth.uid() = requester_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner or admin deletes maintenance" ON public.maintenance_requests
  FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-fill owner_id from property when missing
CREATE OR REPLACE FUNCTION public.set_maintenance_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    SELECT owner_id INTO NEW.owner_id FROM public.properties WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_set_maintenance_owner BEFORE INSERT ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_maintenance_owner();

CREATE OR REPLACE FUNCTION public.set_invoice_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    SELECT owner_id INTO NEW.owner_id FROM public.properties WHERE id = NEW.property_id;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_set_invoice_owner BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_owner();
