-- ═══════════════════════════════════════════════════════════════
-- ECOMATE — MASTER FIX MIGRATION
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- FIX 1: Ensure admin_roles table exists (used by middleware + layout)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin', -- admin, super_admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_check_own" ON public.admin_roles;
CREATE POLICY "admin_check_own" ON public.admin_roles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_all_service_role" ON public.admin_roles;
CREATE POLICY "admin_all_service_role" ON public.admin_roles FOR ALL USING (true);

-- ─────────────────────────────────────────────────────────────
-- FIX 2: Grant yourself admin access (run only once after signing up)
-- Uncomment the lines below to make abdelbadie.kertimi1212@gmail.com an admin:
-- ─────────────────────────────────────────────────────────────
-- INSERT INTO public.admin_roles (user_id, email, role)
-- SELECT id, email, 'super_admin' FROM auth.users
-- WHERE email = 'abdelbadie.kertimi1212@gmail.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- ─────────────────────────────────────────────────────────────
-- FIX 3: reviews — add is_approved if missing (schema.sql used 'approved')
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Migrate old 'approved' column data to 'is_approved' if both exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'reviews' AND column_name = 'approved'
  ) THEN
    UPDATE public.reviews SET is_approved = approved WHERE is_approved IS NULL OR is_approved = false;
  END IF;
END $$;

-- Fix reviews policy to use is_approved
DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
DROP POLICY IF EXISTS "reviews_approved_read" ON public.reviews;
CREATE POLICY "reviews_approved_read" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- FIX 4: services table — create with correct columns
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '⚙️',
  tag TEXT DEFAULT '',
  tag_color TEXT DEFAULT '#2563eb',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if the table existed with old schema
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT '';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tag_color TEXT DEFAULT '#2563eb';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services_read" ON public.services;
CREATE POLICY "services_read" ON public.services FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "services_admin" ON public.services;
CREATE POLICY "services_admin" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = auth.uid())
);

-- Seed default services (safe: won't duplicate)
INSERT INTO public.services (name, description, icon, tag, tag_color, is_active, sort_order)
VALUES
  ('AI Sales Chatbot',        'Automated responses across social platforms 24/7',    '🤖', 'Most Popular', '#10b981', true, 1),
  ('Order & COD Management',  'Track every order from placement to delivery',         '📦', 'Core',         '#2563eb', true, 2),
  ('Product Catalog',         'Manage products synced across all channels',            '🛍️', 'Core',         '#2563eb', true, 3),
  ('CRM — Customers',         'Full customer history, behavior & lifetime value',     '👥', 'Growth',       '#8b5cf6', true, 4),
  ('AI Growth Agent',         'Automated B2B lead discovery, scoring & outreach',     '🎯', 'Growth',       '#8b5cf6', true, 5),
  ('Analytics Dashboard',     'Revenue, orders, conversion rates & trends',           '📊', 'Growth',       '#8b5cf6', true, 6),
  ('Delivery Integration',    'Auto-sync with all Algerian delivery companies',       '🚚', 'Growth',       '#8b5cf6', true, 7)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- FIX 5: plans table — add missing columns
-- ─────────────────────────────────────────────────────────────
-- Create plans with full schema if not exists
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '0',
  period TEXT DEFAULT 'month',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  cta_text TEXT DEFAULT 'Get Started',
  color TEXT DEFAULT '#2563eb',
  is_popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to plans if it existed with old schema
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS period TEXT DEFAULT 'month';
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT 'Get Started';
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#2563eb';
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_read" ON public.plans;
DROP POLICY IF EXISTS "Allow public read-only access to plans" ON public.plans;
CREATE POLICY "plans_read" ON public.plans FOR SELECT USING (active = true);

-- Seed default plans
INSERT INTO public.plans (name, price, period, description, features, cta_text, color, is_popular, active, sort_order)
VALUES
  ('Trial',    '0',    'month', 'Start free, no credit card needed',
   '["AI Chatbot (limited)", "Up to 30 orders/month", "1 social channel", "10 products max", "Community support"]',
   'Start Free', '#64748b', false, true, 1),
  ('Starter',  '2900', 'month', 'For growing Algerian businesses',
   '["AI Sales Chatbot", "300 orders/month", "2 social channels", "100 products", "Basic analytics", "Email support"]',
   'Start Now', '#2563eb', false, true, 2),
  ('Growth',   '5900', 'month', 'Scale with AI-powered automation',
   '["Full AI Sales System", "Unlimited orders", "All social platforms", "Unlimited products", "Delivery auto-tracking", "CRM & customer database", "AI Growth Agent", "Advanced analytics"]',
   'Get Growth', '#10b981', true, true, 3),
  ('Business', '9900', 'month', 'Enterprise-grade for serious operators',
   '["Everything in Growth", "Advanced AI Growth Agent", "Custom lead targeting", "Priority deliverability", "Dedicated account manager", "Custom Yalidine integration", "White-label option"]',
   'Go Business', '#8b5cf6', false, true, 4)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- FIX 6: profiles — ensure email column exists (needed by page.tsx)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- ─────────────────────────────────────────────────────────────
-- FIX 7: Auto-populate profile email from auth.users on signup
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, business_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- Create 14-day trial subscription
  INSERT INTO public.subscriptions (user_id, plan, status, expires_at, payment_confirmed)
  VALUES (NEW.id, 'trial', 'active', NOW() + INTERVAL '14 days', true)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- AFTER RUNNING THIS SQL — DO THE FOLLOWING:
-- 
-- Step 1: Sign up on your site with: abdelbadie.kertimi1212@gmail.com
-- Step 2: Then run this one-liner to make yourself admin:
-- 
--   INSERT INTO public.admin_roles (user_id, email, role)
--   SELECT id, email, 'super_admin' FROM auth.users
--   WHERE email = 'abdelbadie.kertimi1212@gmail.com'
--   ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
-- 
-- Step 3: Set your env vars in Vercel Dashboard.
-- ═══════════════════════════════════════════════════════════════
