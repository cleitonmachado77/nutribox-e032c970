
-- Criar tabela para gerenciar consultas individuais
CREATE TABLE public.consultations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL,
  user_id uuid NOT NULL,
  consultation_number integer NOT NULL,
  status text DEFAULT 'em_andamento'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  notes text,
  UNIQUE(patient_id, user_id, consultation_number)
);

-- Adicionar RLS policies
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consultations" 
  ON public.consultations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultations" 
  ON public.consultations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations" 
  ON public.consultations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consultations" 
  ON public.consultations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar coluna consultation_id nas tabelas existentes para referenciar consultas específicas
ALTER TABLE public.consultation_physical_assessment 
DROP CONSTRAINT IF EXISTS consultation_physical_assessment_patient_user_unique;

ALTER TABLE public.consultation_emotional_assessment 
DROP CONSTRAINT IF EXISTS consultation_emotional_assessment_patient_user_unique;

ALTER TABLE public.consultation_behavioral_assessment 
DROP CONSTRAINT IF EXISTS consultation_behavioral_assessment_patient_user_unique;

ALTER TABLE public.consultation_wellness_assessment 
DROP CONSTRAINT IF EXISTS consultation_wellness_assessment_patient_user_unique;

ALTER TABLE public.consultation_nutritional_structure 
DROP CONSTRAINT IF EXISTS consultation_nutritional_structure_patient_user_unique;

ALTER TABLE public.consultation_nutritional_personalization 
DROP CONSTRAINT IF EXISTS consultation_nutritional_personalization_patient_user_unique;

ALTER TABLE public.consultation_clinical_history 
DROP CONSTRAINT IF EXISTS consultation_clinical_history_patient_user_unique;

ALTER TABLE public.consultation_nutritional_plans 
DROP CONSTRAINT IF EXISTS consultation_nutritional_plans_patient_user_unique;

-- Adicionar novas constraints únicas incluindo consultation_id
ALTER TABLE public.consultation_physical_assessment 
ADD CONSTRAINT consultation_physical_assessment_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_emotional_assessment 
ADD CONSTRAINT consultation_emotional_assessment_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_behavioral_assessment 
ADD CONSTRAINT consultation_behavioral_assessment_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_wellness_assessment 
ADD CONSTRAINT consultation_wellness_assessment_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_nutritional_structure 
ADD CONSTRAINT consultation_nutritional_structure_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_nutritional_personalization 
ADD CONSTRAINT consultation_nutritional_personalization_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_clinical_history 
ADD CONSTRAINT consultation_clinical_history_unique 
UNIQUE (patient_id, user_id, consultation_id);

ALTER TABLE public.consultation_nutritional_plans 
ADD CONSTRAINT consultation_nutritional_plans_unique 
UNIQUE (patient_id, user_id, consultation_id);

-- Função para obter próximo número de consulta
CREATE OR REPLACE FUNCTION get_next_consultation_number(p_patient_id uuid, p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    next_number integer;
BEGIN
    SELECT COALESCE(MAX(consultation_number), 0) + 1
    INTO next_number
    FROM consultations
    WHERE patient_id = p_patient_id AND user_id = p_user_id;
    
    RETURN next_number;
END;
$$;
