
-- Create table: envios_programados
CREATE TABLE envios_programados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    paciente_id UUID NOT NULL REFERENCES nutricoach_patients(id) ON DELETE CASCADE,
    envio_diario BOOLEAN DEFAULT false,
    envio_semanal BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE envios_programados ENABLE ROW LEVEL SECURITY;

-- Create policies for anon role
CREATE POLICY "Allow anon to select envios_programados" ON envios_programados
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon to insert envios_programados" ON envios_programados
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon to update envios_programados" ON envios_programados
    FOR UPDATE TO anon USING (true);

-- Create index for better performance
CREATE INDEX idx_envios_programados_paciente_id ON envios_programados(paciente_id);
