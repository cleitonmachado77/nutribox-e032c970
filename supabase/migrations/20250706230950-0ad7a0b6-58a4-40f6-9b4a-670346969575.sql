
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anon full access to envios_programados" ON envios_programados;

-- Create specific policies for envios_programados table

-- Policy for SELECT
CREATE POLICY "Permitir leitura" ON envios_programados
    FOR SELECT TO anon USING (true);

-- Policy for INSERT  
CREATE POLICY "Permitir inserção" ON envios_programados
    FOR INSERT TO anon WITH CHECK (true);

-- Policy for UPDATE
CREATE POLICY "Permitir atualização" ON envios_programados
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Ensure RLS is enabled on the table
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;
