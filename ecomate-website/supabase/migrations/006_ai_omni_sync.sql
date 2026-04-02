-- Migration 006: EcoMate AI Omni-Sync Engine
-- Objective: Synchronize Chatbot interactions (FB/IG/WA) with CRM and Analytics

-- 1. Table for Omni-Channel Chat Logs
CREATE TABLE IF NOT EXISTS public.chatbot_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES public.crm_customers(id),
    platform text CHECK (platform IN ('facebook', 'instagram', 'whatsapp', 'telegram')),
    external_id text, -- ID from the external platform
    sender_type text CHECK (sender_type IN ('customer', 'ai', 'human')),
    content text NOT NULL,
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 2. Table for AI Extracted Sales Data
CREATE TABLE IF NOT EXISTS public.ai_extractions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_id uuid REFERENCES public.chatbot_logs(id) ON DELETE CASCADE,
    intent text, -- 'order', 'pricing', 'complaint', 'lead'
    confidence float DEFAULT 0.0,
    extracted_data jsonb DEFAULT '{}', -- { "product": "Bag", "price": 5000, "name": "Ahmed", "wilaya": 16 }
    is_synced boolean DEFAULT false,
    synced_order_id uuid REFERENCES public.orders(id),
    created_at timestamptz DEFAULT now()
);

-- 3. Table for Social Performance Analytics
CREATE TABLE IF NOT EXISTS public.analytics_social (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    day date DEFAULT CURRENT_DATE,
    platform text,
    total_messages int DEFAULT 0,
    ai_handled_count int DEFAULT 0,
    converted_leads int DEFAULT 0,
    estimated_revenue int DEFAULT 0,
    UNIQUE(user_id, day, platform)
);

-- RLS Security
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients see own logs" ON public.chatbot_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins manage logs" ON public.chatbot_logs FOR ALL USING (public.is_admin());

ALTER TABLE public.ai_extractions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients see own extractions" ON public.ai_extractions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins manage extractions" ON public.ai_extractions FOR ALL USING (public.is_admin());

ALTER TABLE public.analytics_social ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients see own social stats" ON public.analytics_social FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admins manage social stats" ON public.analytics_social FOR ALL USING (public.is_admin());
