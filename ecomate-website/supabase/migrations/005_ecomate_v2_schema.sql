-- Migration 005: EcoMate V2 Schema (Fulfillment, Creative, Web, Payments)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure admin logic is present for RLS
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS services_purchased jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS drive_folder_url text,
  ADD COLUMN IF NOT EXISTS whatsapp_phone text,
  ADD COLUMN IF NOT EXISTS instagram_page_id text,
  ADD COLUMN IF NOT EXISTS instagram_access_token text,
  ADD COLUMN IF NOT EXISTS chatbot_status text DEFAULT 'disconnected';

CREATE TABLE IF NOT EXISTS public.plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price int DEFAULT 0,
  period text DEFAULT '/ month',
  description text,
  features jsonb DEFAULT '[]',
  cta_text text DEFAULT 'Contact Us',
  color text DEFAULT '#10B981',
  is_popular boolean DEFAULT false,
  active boolean DEFAULT true,
  sort_order int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  customer_name text,
  customer_phone text,
  wilaya text,
  total_da int,
  status text DEFAULT 'pending',
  items jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone text NOT NULL,
  full_name text,
  wilaya text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(phone, user_id)
);

CREATE TABLE IF NOT EXISTS public.delivery_pricing (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company text NOT NULL,
  wilaya_id int NOT NULL CHECK (wilaya_id BETWEEN 1 AND 58),
  wilaya_name text NOT NULL,
  stop_desk_price int DEFAULT 0,
  home_price int DEFAULT 0,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  sku text,
  product_name text NOT NULL,
  quantity int DEFAULT 0,
  reserved_qty int DEFAULT 0,
  image_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fulfillment_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id),
  status text DEFAULT 'pending' 
    CHECK (status IN ('pending','packing','handed_to_carrier',
                      'in_transit','delivered','returned')),
  tracking_code text,
  carrier text,
  assigned_to text,
  packed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.creative_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'in_production'
    CHECK (status IN ('in_production','in_review','delivered','revision')),
  drive_link text,
  pack_type text CHECK (pack_type IN ('starter_4','growth_8','pro_12','one_time')),
  delivery_date date,
  revision_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.web_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_type text NOT NULL
    CHECK (project_type IN ('landing_page','ecommerce','portfolio')),
  status text DEFAULT 'kickoff'
    CHECK (status IN ('kickoff','design','development','review',
                      'client_approval','launched')),
  preview_url text,
  live_url text,
  revision_count int DEFAULT 0,
  brand_kit_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  gateway text DEFAULT 'chargily',
  transaction_id text,
  amount int,
  currency text DEFAULT 'DZD',
  status text CHECK (status IN ('pending','paid','failed','refunded')),
  customer_name text,
  payment_method text CHECK (payment_method IN ('cib','edahabia')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own inventory" ON public.inventory;
CREATE POLICY "clients see own inventory" ON public.inventory FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins manage inventory" ON public.inventory;
CREATE POLICY "admins manage inventory" ON public.inventory FOR ALL USING (public.is_admin());

ALTER TABLE public.fulfillment_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own fulfillment" ON public.fulfillment_orders;
CREATE POLICY "clients see own fulfillment" ON public.fulfillment_orders FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins manage fulfillment" ON public.fulfillment_orders;
CREATE POLICY "admins manage fulfillment" ON public.fulfillment_orders FOR ALL USING (public.is_admin());

ALTER TABLE public.creative_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own creative" ON public.creative_projects;
CREATE POLICY "clients see own creative" ON public.creative_projects FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins manage creative" ON public.creative_projects;
CREATE POLICY "admins manage creative" ON public.creative_projects FOR ALL USING (public.is_admin());

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own orders" ON public.orders;
CREATE POLICY "clients see own orders" ON public.orders FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins manage orders" ON public.orders;
CREATE POLICY "admins manage orders" ON public.orders FOR ALL USING (public.is_admin());

ALTER TABLE public.crm_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own crm" ON public.crm_customers;
CREATE POLICY "clients see own crm" ON public.crm_customers FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins manage crm" ON public.crm_customers;
CREATE POLICY "admins manage crm" ON public.crm_customers FOR ALL USING (public.is_admin());

ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own web project" ON public.web_projects;
CREATE POLICY "clients see own web project" ON public.web_projects FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins manage web project" ON public.web_projects;
CREATE POLICY "admins manage web project" ON public.web_projects FOR ALL USING (public.is_admin());

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "clients see own payments" ON public.payment_logs;
CREATE POLICY "clients see own payments" ON public.payment_logs FOR ALL USING (auth.uid() = client_id);
DROP POLICY IF EXISTS "admins manage payments" ON public.payment_logs;
CREATE POLICY "admins manage payments" ON public.payment_logs FOR ALL USING (public.is_admin());

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can view plans" ON public.plans;
CREATE POLICY "anyone can view plans" ON public.plans FOR SELECT USING (true);
DROP POLICY IF EXISTS "admins manage plans" ON public.plans;
CREATE POLICY "admins manage plans" ON public.plans FOR ALL USING (public.is_admin());
