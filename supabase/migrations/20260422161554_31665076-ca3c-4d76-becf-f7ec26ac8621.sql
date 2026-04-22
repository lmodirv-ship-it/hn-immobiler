
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  lang TEXT DEFAULT 'fr',
  city_interest TEXT,
  transaction_interest TEXT,
  confirmed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
