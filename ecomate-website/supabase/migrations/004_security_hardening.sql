-- 004_security_hardening.sql
-- 1. Hardcode role to 'client' on registration to prevent role hijacking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, business_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'phone',
    'client' -- CRITICAL: All new users are clients by default. Promoting to admin MUST be manual.
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- 2. Create the admin_users table as the single source of truth for elite access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Turn on RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can see who else is an admin
CREATE POLICY "Admins can view admin list" ON public.admin_users
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- 3. Update the admin check logic to be more robust
-- Now we use the dedicated admin_users table instead of the profiles role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update existing RLS policies to use the new is_admin() function
-- Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Orders
DROP POLICY IF EXISTS "Admins see all orders" ON public.orders;
CREATE POLICY "Admins see all orders" ON public.orders FOR ALL USING (public.is_admin());

-- Subscriptions
DROP POLICY IF EXISTS "Admins see all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins see all subscriptions" ON public.subscriptions FOR ALL USING (public.is_admin());

-- Reviews
DROP POLICY IF EXISTS "Admins manage reviews" ON public.reviews;
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- Partners
DROP POLICY IF EXISTS "Admins manage partners" ON public.partners;
CREATE POLICY "Admins manage partners" ON public.partners FOR ALL USING (public.is_admin());

-- Services
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.is_admin());
