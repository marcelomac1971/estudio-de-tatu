DO $$
BEGIN
  -- Loosen RLS policies on agendamentos to ensure chat flow doesn't block on insert
  DROP POLICY IF EXISTS "agendamentos_insert" ON public.agendamentos;
  CREATE POLICY "agendamentos_insert" ON public.agendamentos
    FOR INSERT TO authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "agendamentos_select" ON public.agendamentos;
  CREATE POLICY "agendamentos_select" ON public.agendamentos
    FOR SELECT TO authenticated USING (true);
    
  DROP POLICY IF EXISTS "agendamentos_update" ON public.agendamentos;
  CREATE POLICY "agendamentos_update" ON public.agendamentos
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "agendamentos_delete" ON public.agendamentos;
  CREATE POLICY "agendamentos_delete" ON public.agendamentos
    FOR DELETE TO authenticated USING (true);
END $$;
