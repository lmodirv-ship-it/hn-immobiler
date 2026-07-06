
-- Auto-grant 'owner' role to any user who creates a property
CREATE OR REPLACE FUNCTION public.grant_owner_role_on_property()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.owner_id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_owner_role_on_property() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_grant_owner_role ON public.properties;
CREATE TRIGGER trg_grant_owner_role
AFTER INSERT ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_role_on_property();

-- Backfill: any existing property owner gets the 'owner' role
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT owner_id, 'owner'::app_role
FROM public.properties
WHERE owner_id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;
