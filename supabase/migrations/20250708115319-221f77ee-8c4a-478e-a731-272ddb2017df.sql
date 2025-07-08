
-- Remove todas as policies existentes da tabela envios_programados
DROP POLICY IF EXISTS "Permitir inserção geral" ON public.envios_programados;
DROP POLICY IF EXISTS "Permitir leitura geral" ON public.envios_programados;
DROP POLICY IF EXISTS "Permitir atualização geral" ON public.envios_programados;
DROP POLICY IF EXISTS "Allow all access to envios_programados" ON public.envios_programados;
DROP POLICY IF EXISTS "Allow anon full access to envios_programados" ON public.envios_programados;
DROP POLICY IF EXISTS "Permitir inserção livre" ON public.envios_programados;
DROP POLICY IF EXISTS "Permitir inserção" ON public.envios_programados;

-- Cria as novas policies para as roles anon e authenticated
CREATE POLICY "Permitir inserção geral" ON public.envios_programados
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Permitir leitura geral" ON public.envios_programados
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir atualização geral" ON public.envios_programados
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Garante que RLS está ativada
ALTER TABLE public.envios_programados ENABLE ROW LEVEL SECURITY;
