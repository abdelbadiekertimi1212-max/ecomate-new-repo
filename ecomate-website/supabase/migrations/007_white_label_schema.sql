-- Migration 007: EcoMate White-Label AI Sync Schema
-- Objective: Multi-tenant Onboarding, Full CRM Financials, & Refined Order Tracking

-- 1. Expand Profiles (The "Client" model)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS meta_business_id text,
  ADD COLUMN IF NOT EXISTS telegram_bot_token text,
  ADD COLUMN IF NOT EXISTS onboarding_status text DEFAULT 'pending' 
    CHECK (onboarding_status IN ('pending', 'integrating', 'active', 'suspended'));

-- 2. Enhanced CRM Model
ALTER TABLE public.crm_customers
  ADD COLUMN IF NOT EXISTS total_spend int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_order_date timestamptz;

-- 3. Dedicated Products Model
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    price int NOT NULL DEFAULT 0, -- price in DZD (DA)
    image_url text,
    sizes jsonb DEFAULT '[]', -- Array: ["S", "M", "L", "XL"]
    colors jsonb DEFAULT '[]', -- Array: ["Black", "Nude", "Mint"]
    in_stock boolean DEFAULT true,
    category text,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Refined Orders Model
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS quantity int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'home' 
    CHECK (delivery_type IN ('home', 'stop_desk')),
  ADD COLUMN IF NOT EXISTS shipping_cost int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_amount int; -- Total including shipping

-- Security: RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients manage own products" ON public.products;
CREATE POLICY "clients manage own products" ON public.products FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins audit all products" ON public.products;
CREATE POLICY "admins audit all products" ON public.products FOR ALL USING (public.is_admin());

-- Refresh Search Paths & Permissions
GRANT ALL ON TABLE public.products TO postgres, service_role;
GRANT SELECT ON TABLE public.products TO authenticated;
