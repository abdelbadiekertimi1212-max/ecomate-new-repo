-- MASTER ADMIN LOCKDOWN: EcoMate Exclusive Access Protocol
-- Target: abdelbadie.kertimi1212@gmail.com

DO $$ 
DECLARE 
    target_user_id UUID;
BEGIN
    -- 1. Identify the master user
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'abdelbadie.kertimi1212@gmail.com';

    IF target_user_id IS NULL THEN
        RAISE NOTICE '❌ Master Admin account not found. Please register abdelbadie.kertimi1212@gmail.com first.';
    ELSE
        -- 2. PURGE all other admin roles for absolute exclusivity
        DELETE FROM public.admin_roles WHERE user_id != target_user_id;
        
        -- 3. ENSURE Master Admin has supreme roles
        INSERT INTO public.admin_roles (user_id, role, updated_at)
        VALUES (target_user_id, 'super_admin', now())
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin', updated_at = now();

        -- 4. ENSURE presence in admin_users (Audit log)
        INSERT INTO public.admin_users (user_id, email, role, created_at)
        VALUES (target_user_id, 'abdelbadie.kertimi1212@gmail.com', 'super_admin', now())
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

        RAISE NOTICE '✅ EcoMate Administrative Lockdown Successful for: abdelbadie.kertimi1212@gmail.com';
    END IF;
END $$;
