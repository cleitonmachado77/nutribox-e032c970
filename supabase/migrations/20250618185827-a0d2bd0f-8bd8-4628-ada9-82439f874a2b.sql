
-- Criar tabela para armazenar interações do NutriCoach
CREATE TABLE public.whatsapp_coach_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_phone TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  generated_message TEXT NOT NULL,
  patient_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para segurança
ALTER TABLE public.whatsapp_coach_interactions ENABLE ROW LEVEL SECURITY;

-- Política para permitir visualização de todas as interações (para dashboards)
CREATE POLICY "Allow read access to coach interactions" 
  ON public.whatsapp_coach_interactions 
  FOR SELECT 
  USING (true);

-- Política para permitir inserção de novas interações
CREATE POLICY "Allow insert coach interactions" 
  ON public.whatsapp_coach_interactions 
  FOR INSERT 
  WITH CHECK (true);

-- Índices para melhorar performance
CREATE INDEX idx_coach_interactions_created_at ON public.whatsapp_coach_interactions(created_at DESC);
CREATE INDEX idx_coach_interactions_patient_phone ON public.whatsapp_coach_interactions(patient_phone);
CREATE INDEX idx_coach_interactions_action_type ON public.whatsapp_coach_interactions(action_type);
