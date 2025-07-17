-- Create coach questionnaires table for custom questions
CREATE TABLE public.coach_questionnaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('comportamental', 'bem_estar', 'personalizada')),
  question_text TEXT NOT NULL,
  options JSONB, -- Para opções de múltipla escolha
  frequency TEXT NOT NULL CHECK (frequency IN ('diario', 'semanal', 'mensal')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coach_questionnaires ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own questionnaires" 
ON public.coach_questionnaires 
FOR ALL 
USING (auth.uid() = user_id);

-- Create coach responses table
CREATE TABLE public.coach_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_phone TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  questionnaire_id UUID REFERENCES public.coach_questionnaires(id),
  question_type TEXT NOT NULL, -- 'default' ou 'custom'
  question_category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  response_text TEXT,
  response_score INTEGER, -- 0, 1, 2 para ❌, ⚠️, ✅
  response_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL -- nutricionista responsável
);

-- Enable RLS
ALTER TABLE public.coach_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage responses from their patients" 
ON public.coach_responses 
FOR ALL 
USING (auth.uid() = user_id);

-- Create coach schedules table for managing when to send questions
CREATE TABLE public.coach_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('comportamental', 'bem_estar', 'personalizada')),
  questionnaire_id UUID REFERENCES public.coach_questionnaires(id),
  frequency TEXT NOT NULL,
  next_send_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coach_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own schedules" 
ON public.coach_schedules 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_coach_questionnaires_updated_at
BEFORE UPDATE ON public.coach_questionnaires
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_schedules_updated_at
BEFORE UPDATE ON public.coach_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default questionnaires comportamentais
INSERT INTO public.coach_questionnaires (user_id, title, category, question_text, options, frequency) VALUES
(gen_random_uuid(), 'Consistência do Plano', 'comportamental', 'Como você avalia sua consistência em seguir o plano alimentar hoje?', 
 '["❌ Não segui o plano", "⚠️ Segui parcialmente", "✅ Segui completamente"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Frequência das Refeições', 'comportamental', 'Você conseguiu fazer as refeições nos horários recomendados hoje?', 
 '["❌ Não consegui", "⚠️ Consegui algumas", "✅ Consegui todas"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Consumo de Vegetais e Frutas', 'comportamental', 'Como foi seu consumo de vegetais e frutas hoje?', 
 '["❌ Abaixo do recomendado", "⚠️ Adequado parcialmente", "✅ Atingi a meta"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Hidratação', 'comportamental', 'Você conseguiu beber a quantidade adequada de líquidos hoje?', 
 '["❌ Bem abaixo", "⚠️ Quase suficiente", "✅ Meta atingida"]'::jsonb, 'diario');

-- Insert default questionnaires bem-estar  
INSERT INTO public.coach_questionnaires (user_id, title, category, question_text, options, frequency) VALUES
(gen_random_uuid(), 'Energia Física', 'bem_estar', 'Como está seu nível de energia física hoje?', 
 '["❌ Muito baixa", "⚠️ Moderada", "✅ Excelente"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Atividade Física', 'bem_estar', 'Como foi sua atividade física hoje?', 
 '["❌ Não pratiquei", "⚠️ Atividade leve", "✅ Meta atingida"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Qualidade do Sono', 'bem_estar', 'Como você avalia a qualidade do seu sono ontem?', 
 '["❌ Péssima", "⚠️ Regular", "✅ Excelente"]'::jsonb, 'diario'),
(gen_random_uuid(), 'Confiança na Jornada', 'bem_estar', 'Como você se sente em relação ao progresso da sua jornada nutricional?', 
 '["❌ Desanimado(a)", "⚠️ Neutro", "✅ Confiante"]'::jsonb, 'semanal'),
(gen_random_uuid(), 'Satisfação com o Corpo', 'bem_estar', 'Como você se sente em relação ao seu corpo atualmente?', 
 '["❌ Insatisfeito(a)", "⚠️ Neutro", "✅ Satisfeito(a)"]'::jsonb, 'semanal');