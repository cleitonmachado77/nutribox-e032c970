
-- Create policy for envios_programados table to allow anon access
CREATE POLICY "Allow anon full access to envios_programados" ON envios_programados
    FOR ALL TO anon USING (true) WITH CHECK (true);
