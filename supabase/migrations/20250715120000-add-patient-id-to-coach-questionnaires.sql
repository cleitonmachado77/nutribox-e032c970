ALTER TABLE public.coach_questionnaires ADD COLUMN patient_id UUID;
CREATE INDEX IF NOT EXISTS idx_coach_questionnaires_patient_id ON public.coach_questionnaires(patient_id); 