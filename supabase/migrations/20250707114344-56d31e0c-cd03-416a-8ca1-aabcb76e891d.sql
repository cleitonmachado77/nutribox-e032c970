
-- Remove a policy de INSERT existente para a role anon
DROP POLICY IF EXISTS "Permitir inserção" ON envios_programados;

-- Cria nova policy de INSERT com configurações específicas
CREATE POLICY "Permitir inserção livre" ON envios_programados
    FOR INSERT TO anon 
    USING (true) 
    WITH CHECK (true);

-- Garante que RLS está ativada na tabela
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;
