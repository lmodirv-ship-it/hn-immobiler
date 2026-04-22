-- 1. Subscription Plans
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  interval TEXT NOT NULL DEFAULT 'month',
  max_listings INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans are public" ON public.subscription_plans
  FOR SELECT USING (active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage plans" ON public.subscription_plans
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 2. Subscriptions
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'expired', 'cancelled');

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'pending',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins update subscriptions" ON public.subscriptions
  FOR UPDATE USING (has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE TRIGGER trg_subscriptions_updated
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Payment Transactions
CREATE TYPE payment_method AS ENUM (
  'cash', 'wallet', 'cmi', 'payzone', 'stripe',
  'bank_transfer', 'agency_transfer', 'paypal'
);

CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'rejected', 'refunded');

CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  reference TEXT,
  proof_url TEXT,
  agency_name TEXT,
  payer_name TEXT,
  payer_phone TEXT,
  notes TEXT,
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_user ON public.payment_transactions(user_id);
CREATE INDEX idx_payments_status ON public.payment_transactions(status);
CREATE INDEX idx_payments_method ON public.payment_transactions(method);
CREATE INDEX idx_payments_created ON public.payment_transactions(created_at DESC);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own payments" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own payments" ON public.payment_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage payments" ON public.payment_transactions
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_payments_updated
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Bank Accounts (displayed to users for bank transfer)
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  rib TEXT,
  iban TEXT,
  swift TEXT,
  account_type TEXT NOT NULL DEFAULT 'bank', -- bank, wafacash, cashplus, barid
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bank accounts are public" ON public.bank_accounts
  FOR SELECT USING (active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage bank accounts" ON public.bank_accounts
  FOR ALL USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Seed default plans
INSERT INTO public.subscription_plans (name, name_ar, slug, price, max_listings, features, featured, display_order) VALUES
  ('Basic', 'أساسي', 'basic', 99, 5,
   '["5 إعلانات نشطة","دعم بالبريد","إحصائيات أساسية"]'::jsonb, false, 1),
  ('Pro', 'احترافي', 'pro', 299, 25,
   '["25 إعلان نشط","إبراز إعلان واحد/شهر","شارة موثّق","دعم أولوية","إحصائيات متقدمة"]'::jsonb, true, 2),
  ('Premium', 'متميّز', 'premium', 799, NULL,
   '["إعلانات غير محدودة","إبراز 5 إعلانات/شهر","شارة موثّق ذهبية","دعم مخصص 24/7","إحصائيات كاملة","API للوكالات"]'::jsonb, false, 3);

-- Seed sample bank account placeholders (admin will update)
INSERT INTO public.bank_accounts (bank_name, account_holder, rib, account_type, display_order) VALUES
  ('Attijariwafa Bank', 'HN IMMOBILIER SARL', '007 XXX XXXXXXXXXXXXXXXXXX', 'bank', 1),
  ('Wafacash', 'HN IMMOBILIER', '0612-345-678', 'wafacash', 2),
  ('CashPlus', 'HN IMMOBILIER', '0698-765-432', 'cashplus', 3),
  ('Barid Bank', 'HN IMMOBILIER SARL', '350 XXX XXXXXXXXXXXXXXXXXX', 'barid', 4);