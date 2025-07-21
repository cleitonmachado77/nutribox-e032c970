
-- Criar tabela para armazenar dados da avaliação física
CREATE TABLE public.consultation_physical_assessment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Objetivos do paciente
  objetivo_estetica BOOLEAN DEFAULT false,
  objetivo_emagrecimento BOOLEAN DEFAULT false,
  objetivo_saude_longevidade BOOLEAN DEFAULT false,
  objetivo_performance_esportiva BOOLEAN DEFAULT false,
  
  -- Dados antropométricos
  peso_atual TEXT,
  altura TEXT,
  imc TEXT,
  gordura_corporal TEXT,
  circunferencia_cintura TEXT,
  circunferencia_quadril TEXT,
  circunferencia_braco TEXT,
  circunferencia_coxa TEXT
);

-- Criar tabela para armazenar dados da avaliação emocional
CREATE TABLE public.consultation_emotional_assessment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  relationship_with_food TEXT,
  eating_triggers TEXT,
  emotional_state TEXT,
  stress_level TEXT,
  food_anxiety TEXT
);

-- Criar tabela para armazenar dados da avaliação comportamental
CREATE TABLE public.consultation_behavioral_assessment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  plan_consistency TEXT,
  meal_frequency TEXT,
  meal_time TEXT,
  vegetable_fruits TEXT,
  fluid_intake TEXT
);

-- Criar tabela para armazenar dados da avaliação de bem-estar
CREATE TABLE public.consultation_wellness_assessment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  body_image TEXT,
  physical_energy TEXT,
  physical_activity TEXT,
  sleep TEXT,
  journey_confidence TEXT
);

-- Criar tabela para armazenar estrutura do plano alimentar
CREATE TABLE public.consultation_nutritional_structure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  daily_calories TEXT,
  carbs_percentage TEXT,
  carbs_grams TEXT,
  proteins_percentage TEXT,
  proteins_grams TEXT,
  fats_percentage TEXT,
  fats_grams TEXT,
  selected_meals JSONB DEFAULT '[]'::jsonb
);

-- Criar tabela para armazenar personalização do plano alimentar
CREATE TABLE public.consultation_nutritional_personalization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  preferred_meals TEXT,
  avoided_meals TEXT,
  preferred_foods TEXT,
  avoided_foods TEXT,
  perfect_meals TEXT,
  vegetables TEXT,
  fruits TEXT,
  objects TEXT,
  limitations TEXT
);

-- Criar tabela para armazenar planos alimentares gerados
CREATE TABLE public.consultation_nutritional_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  plan_content TEXT,
  generation_data JSONB,
  is_active BOOLEAN DEFAULT true
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.consultation_physical_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_emotional_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_behavioral_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_wellness_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_nutritional_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_nutritional_personalization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_nutritional_plans ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para consultation_physical_assessment
CREATE POLICY "Users can view their own physical assessments" ON public.consultation_physical_assessment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own physical assessments" ON public.consultation_physical_assessment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own physical assessments" ON public.consultation_physical_assessment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own physical assessments" ON public.consultation_physical_assessment FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_emotional_assessment
CREATE POLICY "Users can view their own emotional assessments" ON public.consultation_emotional_assessment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own emotional assessments" ON public.consultation_emotional_assessment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own emotional assessments" ON public.consultation_emotional_assessment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own emotional assessments" ON public.consultation_emotional_assessment FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_behavioral_assessment
CREATE POLICY "Users can view their own behavioral assessments" ON public.consultation_behavioral_assessment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own behavioral assessments" ON public.consultation_behavioral_assessment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own behavioral assessments" ON public.consultation_behavioral_assessment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own behavioral assessments" ON public.consultation_behavioral_assessment FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_wellness_assessment
CREATE POLICY "Users can view their own wellness assessments" ON public.consultation_wellness_assessment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own wellness assessments" ON public.consultation_wellness_assessment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own wellness assessments" ON public.consultation_wellness_assessment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wellness assessments" ON public.consultation_wellness_assessment FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_nutritional_structure
CREATE POLICY "Users can view their own nutritional structures" ON public.consultation_nutritional_structure FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutritional structures" ON public.consultation_nutritional_structure FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutritional structures" ON public.consultation_nutritional_structure FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutritional structures" ON public.consultation_nutritional_structure FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_nutritional_personalization
CREATE POLICY "Users can view their own nutritional personalizations" ON public.consultation_nutritional_personalization FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutritional personalizations" ON public.consultation_nutritional_personalization FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutritional personalizations" ON public.consultation_nutritional_personalization FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutritional personalizations" ON public.consultation_nutritional_personalization FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para consultation_nutritional_plans
CREATE POLICY "Users can view their own nutritional plans" ON public.consultation_nutritional_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutritional plans" ON public.consultation_nutritional_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutritional plans" ON public.consultation_nutritional_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutritional plans" ON public.consultation_nutritional_plans FOR DELETE USING (auth.uid() = user_id);
