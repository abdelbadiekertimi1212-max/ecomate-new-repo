-- ─────────────────────────────────────────────────────────────
-- 1. PLANS TABLE (Dynamic Storefront Management)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY, -- 'trial', 'starter', 'growth', 'business'
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    period TEXT DEFAULT '/month',
    description TEXT,
    features JSONB DEFAULT '[]',
    cta_text TEXT DEFAULT 'Start Growing →',
    color TEXT DEFAULT '#10B981',
    is_popular BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial plans (matching existing UI)
INSERT INTO public.plans (id, name, price, period, description, features, cta_text, color, is_popular)
VALUES 
('trial', '14-Day Free Trial', 0, 'No credit card', 'Experience the full power of EcoMate risk-free.', '["Full AI Sales System", "Sync with FB/IG/WA", "Up to 50 active products", "Basic delivery tracking"]', 'Start Free Trial →', '#ffffff', false),
('growth', 'Growth Plan', 4900, '/month', 'Full AI system for serious sellers looking to scale.', '["Full AI Sales System", "Unlimited orders & products", "All social platforms (FB, IG, WA)", "Delivery auto-tracking (58 wilayas)", "CRM & customer database", "AI Growth Agent (lead outreach)", "Analytics dashboard", "Priority support"]', 'Get Growth Now →', '#10B981', true),
('business', 'Business / Entreprise', 0, 'Custom', 'For large operations requiring custom AI training and scale.', '["Everything in Growth", "Advanced AI Growth Agent", "Custom lead targeting rules", "Priority email deliverability", "Dedicated account manager", "Custom integrations", "SLA guarantee"]', 'Contact Sales →', '#2563eb', false)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 2. SUBSCRIPTIONS TABLE FIXES
-- ─────────────────────────────────────────────────────────────
-- Ensure column names match current app attempts or simplify
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS plan_slug TEXT,
ADD COLUMN IF NOT EXISTS checkout_completed BOOLEAN DEFAULT FALSE;

-- ─────────────────────────────────────────────────────────────
-- 3. STORAGE BUCKET PERMISSIONS (Supabase Storage)
-- ─────────────────────────────────────────────────────────────
-- Note: You should create the 'media' bucket in Supabase Dashboard first.
-- These policies ensure public read and admin write.

DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('media', 'media', true)
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Public Read Access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Admin Write Access (founder only)
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'media' AND 
    (auth.jwt()->>'email' = 'abdelbadie.kertimi1212@gmail.com')
);

-- ─────────────────────────────────────────────────────────────
-- 4. RLS FOR PLANS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Plans" ON public.plans FOR SELECT USING (active = true);
CREATE POLICY "Admin Manage Plans" ON public.plans FOR ALL 
USING (auth.jwt()->>'email' = 'abdelbadie.kertimi1212@gmail.com');
