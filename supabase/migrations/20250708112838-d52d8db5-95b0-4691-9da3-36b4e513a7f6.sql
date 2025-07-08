-- Remove policies existentes que podem conflitar
DROP POLICY IF EXISTS "Allow all access to envios_programados" ON envios_programados;
DROP POLICY IF EXISTS "Allow anon full access to envios_programados" ON envios_programados;
DROP POLICY IF EXISTS "Permitir inserção livre" ON envios_programados;
DROP POLICY IF EXISTS "Permitir inserção" ON envios_programados;

-- Cria nova policy específica para INSERT
CREATE POLICY "Permitir inserção geral" ON envios_programados
    FOR INSERT TO anon 
    WITH CHECK (true);

-- Mantém policies para SELECT e UPDATE se necessário
CREATE POLICY "Permitir leitura geral" ON envios_programados
    FOR SELECT TO anon, authenticated 
    USING (true);

CREATE POLICY "Permitir atualização geral" ON envios_programados
    FOR UPDATE TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- Garante que RLS está ativada
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;