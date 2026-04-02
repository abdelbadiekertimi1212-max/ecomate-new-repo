-- Migration 008: Algerian Manual Billing & Payment Sync
-- Objective: Manage manual CCP/Baridimob payment requests for B2B clients.

CREATE TABLE IF NOT EXISTS public.billing_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name text NOT NULL, -- 'Starter', 'Growth', 'Business'
    amount int NOT NULL, -- Amount in DZD
    payment_method text NOT NULL, -- 'CCP', 'Baridimob'
    receipt_url text, -- S3/Supabase Storage link to the bon de virement
    status text DEFAULT 'pending' 
      CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Security: RLS for Billing Orders
ALTER TABLE public.billing_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients view own billing" ON public.billing_orders;
CREATE POLICY "clients view own billing" ON public.billing_orders FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "clients create billing request" ON public.billing_orders;
CREATE POLICY "clients create billing request" ON public.billing_orders FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "admins manage all billing" ON public.billing_orders;
CREATE POLICY "admins manage all billing" ON public.billing_orders FOR ALL USING (public.is_admin());

-- Storage Bucket for Receipts
-- (Note: Create 'receipts' bucket in the dashboard with public or restricted access)
