
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('user', 'owner', 'agent', 'agency', 'admin');
CREATE TYPE public.profile_type AS ENUM ('individual', 'agency', 'agent');
CREATE TYPE public.transaction_type AS ENUM ('sale', 'rent');
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'house', 'land', 'commercial', 'office', 'riad', 'studio');
CREATE TYPE public.property_status AS ENUM ('draft', 'pending', 'active', 'sold', 'rented', 'inactive');
CREATE TYPE public.property_condition AS ENUM ('new', 'good', 'renovated', 'to_renovate', 'under_construction');
CREATE TYPE public.viewing_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  type public.profile_type DEFAULT 'individual',
  agency_name TEXT,
  city TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================
-- USER ROLES (separate table — security)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- =========================================
-- PROPERTIES
-- =========================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  transaction_type public.transaction_type NOT NULL,
  property_type public.property_type NOT NULL,
  price NUMERIC(14,2) NOT NULL,
  currency TEXT DEFAULT 'MAD' NOT NULL,
  surface NUMERIC(10,2),
  land_surface NUMERIC(10,2),
  rooms INT,
  bathrooms INT,
  floors INT,
  floor_number INT,
  year_built INT,
  condition public.property_condition,
  city TEXT NOT NULL,
  district TEXT,
  address TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  orientation TEXT,
  view TEXT,
  finishing TEXT,
  status public.property_status DEFAULT 'draft' NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0 NOT NULL,
  hot_score NUMERIC DEFAULT 0 NOT NULL,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_transaction ON public.properties(transaction_type);
CREATE INDEX idx_properties_owner ON public.properties(owner_id);

-- =========================================
-- PROPERTY FEATURES (amenities)
-- =========================================
CREATE TABLE public.property_features (
  property_id UUID PRIMARY KEY REFERENCES public.properties(id) ON DELETE CASCADE,
  has_pool BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  parking_spots INT,
  has_balcony BOOLEAN DEFAULT FALSE,
  has_terrace BOOLEAN DEFAULT FALSE,
  has_ac BOOLEAN DEFAULT FALSE,
  has_heating BOOLEAN DEFAULT FALSE,
  has_security BOOLEAN DEFAULT FALSE,
  has_concierge BOOLEAN DEFAULT FALSE,
  has_gym BOOLEAN DEFAULT FALSE,
  furnished BOOLEAN DEFAULT FALSE,
  pets_allowed BOOLEAN DEFAULT FALSE,
  near_school BOOLEAN DEFAULT FALSE,
  near_mosque BOOLEAN DEFAULT FALSE,
  near_hospital BOOLEAN DEFAULT FALSE,
  near_transport BOOLEAN DEFAULT FALSE,
  near_beach BOOLEAN DEFAULT FALSE
);
ALTER TABLE public.property_features ENABLE ROW LEVEL SECURITY;

-- =========================================
-- PROPERTY IMAGES
-- =========================================
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_property_images_property ON public.property_images(property_id);

-- =========================================
-- FAVORITES
-- =========================================
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  list_name TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, property_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- =========================================
-- COMPARISONS
-- =========================================
CREATE TABLE public.comparisons (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, property_id)
);
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SAVED SEARCHES
-- =========================================
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  criteria JSONB NOT NULL,
  email_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- =========================================
-- VIEWINGS (property visits)
-- =========================================
CREATE TABLE public.viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status public.viewing_status DEFAULT 'pending' NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;

-- =========================================
-- MESSAGES
-- =========================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);

-- =========================================
-- REVIEWS (for agents/agencies)
-- =========================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (reviewer_id, reviewed_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- =========================================
-- PROPERTY VIEWS (analytics)
-- =========================================
CREATE TABLE public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_property_views_property ON public.property_views(property_id);

-- =========================================
-- CONTACT REQUESTS
-- =========================================
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- =========================================
-- TIMESTAMP TRIGGER
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_properties_updated BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- RLS POLICIES
-- =========================================

-- profiles: public read, own update
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles: user reads own, admin reads all, only admin writes
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- properties: public read active, owner full, admin full
CREATE POLICY "properties_select_active" ON public.properties FOR SELECT USING (status = 'active' OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_insert_own" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "properties_update_own" ON public.properties FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "properties_delete_own" ON public.properties FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- property_features: follow property visibility
CREATE POLICY "features_select" ON public.property_features FOR SELECT USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.status = 'active' OR p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "features_owner_write" ON public.property_features FOR ALL USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));

-- property_images
CREATE POLICY "images_select" ON public.property_images FOR SELECT USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND (p.status = 'active' OR p.owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "images_owner_write" ON public.property_images FOR ALL USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()));

-- favorites
CREATE POLICY "favorites_own" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- comparisons
CREATE POLICY "comparisons_own" ON public.comparisons FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- saved_searches
CREATE POLICY "saved_searches_own" ON public.saved_searches FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- viewings: visitor and owner can see
CREATE POLICY "viewings_participants_select" ON public.viewings FOR SELECT USING (auth.uid() = visitor_id OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "viewings_visitor_insert" ON public.viewings FOR INSERT WITH CHECK (auth.uid() = visitor_id);
CREATE POLICY "viewings_participants_update" ON public.viewings FOR UPDATE USING (auth.uid() = visitor_id OR auth.uid() = owner_id);

-- messages: sender and recipient
CREATE POLICY "messages_participants_select" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_sender_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_recipient_update" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);

-- reviews: public read, authenticated insert own, update own
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id OR public.has_role(auth.uid(), 'admin'));

-- property_views: anyone can insert (tracking), owners and admin can read
CREATE POLICY "views_insert_all" ON public.property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_owner_read" ON public.property_views FOR SELECT USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- contact_requests: anyone can insert; only related owner / admin can read
CREATE POLICY "contact_insert_all" ON public.contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_owner_read" ON public.contact_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'));

-- =========================================
-- STORAGE BUCKETS
-- =========================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('property-media', 'property-media', true),
  ('avatars', 'avatars', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- property-media: public read, authenticated write own folder (path = user_id/...)
CREATE POLICY "property_media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'property-media');
CREATE POLICY "property_media_user_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "property_media_user_update" ON storage.objects FOR UPDATE USING (bucket_id = 'property-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "property_media_user_delete" ON storage.objects FOR DELETE USING (bucket_id = 'property-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- avatars
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_user_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_user_update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_user_delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- documents (private)
CREATE POLICY "documents_user_read" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "documents_user_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "documents_user_update" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "documents_user_delete" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
