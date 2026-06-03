
-- 1. BANK ACCOUNTS
DROP POLICY IF EXISTS "Bank accounts are public" ON public.bank_accounts;
CREATE POLICY "Bank accounts visible to authenticated"
  ON public.bank_accounts FOR SELECT
  TO authenticated
  USING (active = true OR has_role(auth.uid(), 'admin'::app_role));

-- 2. PROFILES
DROP POLICY IF EXISTS profiles_select_all ON public.profiles;
CREATE POLICY profiles_select_authenticated
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.profiles FROM anon;

-- 3. USER_ROLES
CREATE POLICY user_roles_insert_admin_only
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY user_roles_update_admin_only
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY user_roles_delete_admin_only
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. SITE_VISITS
DROP POLICY IF EXISTS "Visit counts are public" ON public.site_visits;
CREATE POLICY "Admins can read visits"
  ON public.site_visits FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can log a visit" ON public.site_visits;
CREATE POLICY "Anyone can log a visit"
  ON public.site_visits FOR INSERT
  WITH CHECK (path IS NULL OR length(path) <= 2048);

-- 5. NEWSLETTER_SUBSCRIBERS
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (
    length(trim(email)) > 3
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  );

-- 6. SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
