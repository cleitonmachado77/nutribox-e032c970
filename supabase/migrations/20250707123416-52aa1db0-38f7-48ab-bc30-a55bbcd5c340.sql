-- Remove policy existente
DROP POLICY IF EXISTS "Allow anon full access to envios_programados" ON envios_programados;

-- Cria policy para roles anon e authenticated
CREATE POLICY "Allow all access to envios_programados" ON envios_programados
    FOR ALL TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- Garante que RLS está ativada
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;