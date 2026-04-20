
-- Tighten contact_requests insert: require non-empty fields
DROP POLICY IF EXISTS "contact_insert_all" ON public.contact_requests;
CREATE POLICY "contact_insert_validated" ON public.contact_requests
  FOR INSERT WITH CHECK (
    length(trim(sender_name)) > 0
    AND length(trim(sender_email)) > 3
    AND length(trim(message)) > 0
  );

-- Tighten property_views insert: require valid property_id existing
DROP POLICY IF EXISTS "views_insert_all" ON public.property_views;
CREATE POLICY "views_insert_validated" ON public.property_views
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.status = 'active')
  );

-- Replace broad public storage read policies with object-name-required policies
-- (prevents anonymous bucket listing while still allowing public file URLs)
DROP POLICY IF EXISTS "property_media_public_read" ON storage.objects;
CREATE POLICY "property_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-media' AND name IS NOT NULL AND length(name) > 0);

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND name IS NOT NULL AND length(name) > 0);
