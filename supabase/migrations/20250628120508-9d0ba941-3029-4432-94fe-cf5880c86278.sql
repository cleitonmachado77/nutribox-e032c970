
-- Criar tabela para armazenar histórico clínico
CREATE TABLE public.consultation_clinical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados do histórico clínico
  pre_existing_conditions TEXT,
  surgeries TEXT,
  medications TEXT,
  supplements TEXT,
  allergies TEXT,
  family_history TEXT,
  hereditary_diseases TEXT
);

-- Habilitar RLS
ALTER TABLE public.consultation_clinical_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultation_clinical_history
CREATE POLICY "Users can view their own clinical history" ON public.consultation_clinical_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own clinical history" ON public.consultation_clinical_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clinical history" ON public.consultation_clinical_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clinical history" ON public.consultation_clinical_history FOR DELETE USING (auth.uid() = user_id);
