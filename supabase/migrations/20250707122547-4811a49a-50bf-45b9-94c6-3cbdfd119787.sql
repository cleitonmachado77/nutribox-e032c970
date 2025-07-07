-- Verificar e ajustar todas as policies para envios_programados

-- Remove todas as policies existentes
DROP POLICY IF EXISTS "Permitir inserção livre" ON envios_programados;
DROP POLICY IF EXISTS "Permitir leitura" ON envios_programados;
DROP POLICY IF EXISTS "Permitir atualização" ON envios_programados;

-- Cria policies mais permissivas para role anon
CREATE POLICY "Allow anon full access to envios_programados" ON envios_programados
    FOR ALL TO anon 
    USING (true) 
    WITH CHECK (true);

-- Garante que RLS está ativada
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;