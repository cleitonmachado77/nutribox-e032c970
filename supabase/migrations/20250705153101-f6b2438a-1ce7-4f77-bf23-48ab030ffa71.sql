
-- 1. Table: Patients
CREATE TABLE nutricoach_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    telephone TEXT NOT NULL,
    plan_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table: Programmed Shipping
CREATE TABLE nutricoach_programmed_shipping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES nutricoach_patients(id) ON DELETE CASCADE NOT NULL,
    shipping_diario BOOLEAN DEFAULT false,
    shipping_semanal BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table: Daily Answers
CREATE TABLE nutricoach_respostas_diarias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES nutricoach_patients(id) ON DELETE CASCADE NOT NULL,
    data_resposta DATE NOT NULL,
    energia INTEGER CHECK (energia >= 1 AND energia <= 3),
    atividade INTEGER CHECK (atividade >= 1 AND atividade <= 2),
    sono INTEGER CHECK (sono >= 1 AND sono <= 3),
    consistencia INTEGER CHECK (consistencia >= 1 AND consistencia <= 2),
    refeicoes INTEGER CHECK (refeicoes >= 1 AND refeicoes <= 3),
    horario_refeicao INTEGER CHECK (horario_refeicao >= 1 AND horario_refeicao <= 3),
    vegetais_frutas INTEGER CHECK (vegetais_frutas >= 1 AND vegetais_frutas <= 3),
    liquido INTEGER CHECK (liquido >= 1 AND liquido <= 3),
    feedback_gpt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table: Weekly Answers
CREATE TABLE nutricoach_respostas_semanais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES nutricoach_patients(id) ON DELETE CASCADE NOT NULL,
    data_resposta DATE NOT NULL,
    confianca INTEGER CHECK (confianca >= 1 AND confianca <= 3),
    satisfacao INTEGER CHECK (satisfacao >= 1 AND satisfacao <= 3),
    feedback_gpt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table: Personalized Plans
CREATE TABLE nutricoach_planos_personalizados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES nutricoach_patients(id) ON DELETE CASCADE NOT NULL,
    mes TEXT NOT NULL,
    score_medio DECIMAL(5,2),
    recomendacao_gpt TEXT,
    nota_nutricionista TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE nutricoach_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutricoach_programmed_shipping ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutricoach_respostas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutricoach_respostas_semanais ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutricoach_planos_personalizados ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Patients
CREATE POLICY "Users can view their own nutricoach patients" ON nutricoach_patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own nutricoach patients" ON nutricoach_patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutricoach patients" ON nutricoach_patients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutricoach patients" ON nutricoach_patients
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Programmed Shipping
CREATE POLICY "Users can view their own shipping settings" ON nutricoach_programmed_shipping
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shipping settings" ON nutricoach_programmed_shipping
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shipping settings" ON nutricoach_programmed_shipping
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shipping settings" ON nutricoach_programmed_shipping
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Daily Answers
CREATE POLICY "Users can view their patients' daily answers" ON nutricoach_respostas_diarias
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert daily answers for their patients" ON nutricoach_respostas_diarias
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update daily answers for their patients" ON nutricoach_respostas_diarias
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete daily answers for their patients" ON nutricoach_respostas_diarias
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Weekly Answers
CREATE POLICY "Users can view their patients' weekly answers" ON nutricoach_respostas_semanais
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert weekly answers for their patients" ON nutricoach_respostas_semanais
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update weekly answers for their patients" ON nutricoach_respostas_semanais
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete weekly answers for their patients" ON nutricoach_respostas_semanais
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Personalized Plans
CREATE POLICY "Users can view their patients' personalized plans" ON nutricoach_planos_personalizados
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert personalized plans for their patients" ON nutricoach_planos_personalizados
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update personalized plans for their patients" ON nutricoach_planos_personalizados
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete personalized plans for their patients" ON nutricoach_planos_personalizados
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_nutricoach_patients_user_id ON nutricoach_patients(user_id);
CREATE INDEX idx_nutricoach_patients_telephone ON nutricoach_patients(telephone);
CREATE INDEX idx_nutricoach_programmed_shipping_patient_id ON nutricoach_programmed_shipping(patient_id);
CREATE INDEX idx_nutricoach_programmed_shipping_user_id ON nutricoach_programmed_shipping(user_id);
CREATE INDEX idx_nutricoach_respostas_diarias_patient_id ON nutricoach_respostas_diarias(patient_id);
CREATE INDEX idx_nutricoach_respostas_diarias_data ON nutricoach_respostas_diarias(data_resposta);
CREATE INDEX idx_nutricoach_respostas_diarias_user_id ON nutricoach_respostas_diarias(user_id);
CREATE INDEX idx_nutricoach_respostas_semanais_patient_id ON nutricoach_respostas_semanais(patient_id);
CREATE INDEX idx_nutricoach_respostas_semanais_data ON nutricoach_respostas_semanais(data_resposta);
CREATE INDEX idx_nutricoach_respostas_semanais_user_id ON nutricoach_respostas_semanais(user_id);
CREATE INDEX idx_nutricoach_planos_personalizados_patient_id ON nutricoach_planos_personalizados(patient_id);
CREATE INDEX idx_nutricoach_planos_personalizados_mes ON nutricoach_planos_personalizados(mes);
CREATE INDEX idx_nutricoach_planos_personalizados_user_id ON nutricoach_planos_personalizados(user_id);
