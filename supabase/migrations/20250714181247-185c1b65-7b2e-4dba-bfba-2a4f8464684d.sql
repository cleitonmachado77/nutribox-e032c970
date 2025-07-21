
-- Remover a coluna user_id da tabela nutricoach_respostas_diarias
ALTER TABLE nutricoach_respostas_diarias DROP COLUMN IF EXISTS user_id;

-- Remover a coluna user_id da tabela nutricoach_respostas_semanais  
ALTER TABLE nutricoach_respostas_semanais DROP COLUMN IF EXISTS user_id;

-- Garantir que as foreign keys estão corretas
ALTER TABLE nutricoach_respostas_diarias 
DROP CONSTRAINT IF EXISTS nutricoach_respostas_diarias_patient_id_fkey;

ALTER TABLE nutricoach_respostas_diarias 
ADD CONSTRAINT nutricoach_respostas_diarias_patient_id_fkey 
FOREIGN KEY (patient_id) REFERENCES pacientes(id) ON DELETE CASCADE;

ALTER TABLE nutricoach_respostas_semanais 
DROP CONSTRAINT IF EXISTS nutricoach_respostas_semanais_patient_id_fkey;

ALTER TABLE nutricoach_respostas_semanais 
ADD CONSTRAINT nutricoach_respostas_semanais_patient_id_fkey 
FOREIGN KEY (patient_id) REFERENCES pacientes(id) ON DELETE CASCADE;
