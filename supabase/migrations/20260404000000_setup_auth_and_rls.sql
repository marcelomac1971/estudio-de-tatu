-- Set up RLS policies for critical tables
DROP POLICY IF EXISTS "agendamentos_select" ON public.agendamentos;
CREATE POLICY "agendamentos_select" ON public.agendamentos FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "agendamentos_insert" ON public.agendamentos;
CREATE POLICY "agendamentos_insert" ON public.agendamentos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "agendamentos_update" ON public.agendamentos;
CREATE POLICY "agendamentos_update" ON public.agendamentos FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "agendamentos_delete" ON public.agendamentos;
CREATE POLICY "agendamentos_delete" ON public.agendamentos FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "estudios_select" ON public.estudios;
CREATE POLICY "estudios_select" ON public.estudios FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "estudios_insert" ON public.estudios;
CREATE POLICY "estudios_insert" ON public.estudios FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "estudios_update" ON public.estudios;
CREATE POLICY "estudios_update" ON public.estudios FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "termos_lgpd_select" ON public.termos_lgpd;
CREATE POLICY "termos_lgpd_select" ON public.termos_lgpd FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "termos_lgpd_insert" ON public.termos_lgpd;
CREATE POLICY "termos_lgpd_insert" ON public.termos_lgpd FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "termos_lgpd_update" ON public.termos_lgpd;
CREATE POLICY "termos_lgpd_update" ON public.termos_lgpd FOR UPDATE TO authenticated USING (true);

-- Seed a default user and studio to link agendamentos correctly
DO $$
DECLARE
  new_user_id uuid;
  new_studio_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marcelomacbook@me.com') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'marcelomacbook@me.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Marcelo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
  END IF;

  INSERT INTO public.estudios (id, nome) VALUES (new_studio_id, 'Modern Noir Studio') ON CONFLICT (id) DO NOTHING;
END $$;
