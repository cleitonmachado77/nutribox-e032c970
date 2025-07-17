
-- Adicionar constraints únicas para permitir upsert nas tabelas de consulta
ALTER TABLE public.consultation_physical_assessment 
ADD CONSTRAINT consultation_physical_assessment_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_emotional_assessment 
ADD CONSTRAINT consultation_emotional_assessment_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_behavioral_assessment 
ADD CONSTRAINT consultation_behavioral_assessment_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_wellness_assessment 
ADD CONSTRAINT consultation_wellness_assessment_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_nutritional_structure 
ADD CONSTRAINT consultation_nutritional_structure_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_nutritional_personalization 
ADD CONSTRAINT consultation_nutritional_personalization_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_clinical_history 
ADD CONSTRAINT consultation_clinical_history_patient_user_unique 
UNIQUE (patient_id, user_id);

ALTER TABLE public.consultation_nutritional_plans 
ADD CONSTRAINT consultation_nutritional_plans_patient_user_unique 
UNIQUE (patient_id, user_id);
