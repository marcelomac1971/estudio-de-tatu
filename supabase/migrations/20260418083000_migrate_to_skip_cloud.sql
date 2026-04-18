DO $$
BEGIN
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS contact_email TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS address TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS location TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS mrr NUMERIC;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS tattoo_styles JSONB;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS bot_first_message TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS recovery_message TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS deposit_percentage NUMERIC;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS availability_search_margin INTEGER;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS tattoo_style_configs JSONB;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS zapi_instance_id TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS zapi_token TEXT;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS google_calendar_connected BOOLEAN DEFAULT false;
  ALTER TABLE public.estudios ADD COLUMN IF NOT EXISTS billing_cycle_end TEXT;

  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS avatar TEXT;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS health_data_consent BOOLEAN DEFAULT false;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS image_rights BOOLEAN DEFAULT false;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS consent_timestamp TEXT;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS consent_ip TEXT;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS reference_type TEXT;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS reference_image TEXT;
  ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS history JSONB;

  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS duration NUMERIC;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS total_value NUMERIC;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS financial_status TEXT;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS reschedule_link TEXT;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS date TEXT;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS time TEXT;
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
  ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
END $$;

DROP POLICY IF EXISTS "clientes_insert" ON public.clientes;
CREATE POLICY "clientes_insert" ON public.clientes FOR INSERT TO authenticated WITH CHECK (estudio_id = auth.uid());
DROP POLICY IF EXISTS "clientes_update" ON public.clientes;
CREATE POLICY "clientes_update" ON public.clientes FOR UPDATE TO authenticated USING (estudio_id = auth.uid());
DROP POLICY IF EXISTS "clientes_delete" ON public.clientes;
CREATE POLICY "clientes_delete" ON public.clientes FOR DELETE TO authenticated USING (estudio_id = auth.uid());
DROP POLICY IF EXISTS "clientes_select" ON public.clientes;
CREATE POLICY "clientes_select" ON public.clientes FOR SELECT TO authenticated USING (estudio_id = auth.uid());

DROP POLICY IF EXISTS "agendamentos_delete" ON public.agendamentos;
CREATE POLICY "agendamentos_delete" ON public.agendamentos FOR DELETE TO authenticated USING (estudio_id = auth.uid());
DROP POLICY IF EXISTS "agendamentos_insert" ON public.agendamentos;
CREATE POLICY "agendamentos_insert" ON public.agendamentos FOR INSERT TO authenticated WITH CHECK (estudio_id = auth.uid());
DROP POLICY IF EXISTS "agendamentos_select" ON public.agendamentos;
CREATE POLICY "agendamentos_select" ON public.agendamentos FOR SELECT TO authenticated USING (estudio_id = auth.uid());
DROP POLICY IF EXISTS "agendamentos_update" ON public.agendamentos;
CREATE POLICY "agendamentos_update" ON public.agendamentos FOR UPDATE TO authenticated USING (estudio_id = auth.uid());

DO $$
DECLARE
  v_user_id UUID;
  v_client_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'marcelomacbook@me.com') THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'marcelomacbook@me.com',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Marcelo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.estudios (
      id, nome, status_assinatura, contact_email, bot_first_message,
      tattoo_style_configs, deposit_percentage, mrr, user_id
    ) VALUES (
      v_user_id, 'Modern Noir SaaS', 'active', 'marcelomacbook@me.com',
      'Olá! Bem-vindo ao atendimento do nosso estúdio.',
      '[{"name":"Realismo","enabled":true,"basePrice":500,"referenceSize":10,"referenceLocation":"Antebraço","sizeSurcharge":50,"complexLocations":["Costela","Pescoço"],"locationSurcharge":150}]',
      20, 299, v_user_id
    ) ON CONFLICT (id) DO NOTHING;

    v_client_id := gen_random_uuid();
    INSERT INTO public.clientes (
      id, estudio_id, nome, telefone, avatar, total_spent, health_data_consent,
      image_rights, alergias
    ) VALUES (
      v_client_id, v_user_id, 'Cliente Teste', '+55 11 99999-9999',
      'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
      800, true, true, 'Látex'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.agendamentos (
      id, estudio_id, cliente_id, data_hora, valor_sinal, status_pagamento,
      duration, description, total_value, date, time, status, payment_status
    ) VALUES (
      gen_random_uuid(), v_user_id, v_client_id, NOW(), 100, 'approved',
      2, 'Tattoo Realismo', 500, to_char(NOW(), 'YYYY-MM-DD'), '14:00', 'confirmed', 'approved'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
