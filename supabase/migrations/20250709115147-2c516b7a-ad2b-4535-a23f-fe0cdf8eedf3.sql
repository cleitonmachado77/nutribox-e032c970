
-- Primeiro, remover a foreign key existente da tabela envios_programados
ALTER TABLE public.envios_programados 
DROP CONSTRAINT IF EXISTS envios_programados_paciente_id_fkey;

-- Adicionar a nova foreign key apontando para a tabela pacientes
ALTER TABLE public.envios_programados 
ADD CONSTRAINT envios_programados_paciente_id_fkey 
FOREIGN KEY (paciente_id) REFERENCES public.pacientes(id) ON DELETE CASCADE;

-- Verificar se existe algum dado órfão na tabela envios_programados
-- e removê-lo para evitar violações de integridade
DELETE FROM public.envios_programados 
WHERE paciente_id NOT IN (SELECT id FROM public.pacientes);

-- Adicionar índice para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_envios_programados_paciente_id 
ON public.envios_programados(paciente_id);
