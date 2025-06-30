import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PhysicalAssessmentData {
  objetivo_estetica: boolean;
  objetivo_emagrecimento: boolean;
  objetivo_saude_longevidade: boolean;
  objetivo_performance_esportiva: boolean;
  peso_atual: string;
  altura: string;
  imc: string;
  gordura_corporal: string;
  circunferencia_cintura: string;
  circunferencia_quadril: string;
  circunferencia_braco: string;
  circunferencia_coxa: string;
}

export interface EmotionalAssessmentData {
  relationship_with_food: string;
  eating_triggers: string;
  emotional_state: string;
  stress_level: string;
  food_anxiety: string;
}

export interface BehavioralAssessmentData {
  plan_consistency: string;
  meal_frequency: string;
  meal_time: string;
  vegetable_fruits: string;
  fluid_intake: string;
}

export interface WellnessAssessmentData {
  body_image: string;
  physical_energy: string;
  physical_activity: string;
  sleep: string;
  journey_confidence: string;
}

export interface NutritionalStructureData {
  daily_calories: string;
  carbs_percentage: string;
  carbs_grams: string;
  proteins_percentage: string;
  proteins_grams: string;
  fats_percentage: string;
  fats_grams: string;
  selected_meals: string[];
}

export interface NutritionalPersonalizationData {
  preferred_meals: string;
  avoided_meals: string;
  preferred_foods: string;
  avoided_foods: string;
  perfect_meals: string;
  vegetables: string;
  fruits: string;
  objects: string;
  limitations: string;
}

export interface ClinicalHistoryData {
  pre_existing_conditions: string;
  surgeries: string;
  medications: string;
  supplements: string;
  allergies: string;
  family_history: string;
  hereditary_diseases: string;
}

export const useConsultationData = (patientId: string, consultationId?: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePhysicalAssessment = async (data: PhysicalAssessmentData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_physical_assessment')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Physical assessment saved successfully');
    } catch (err: any) {
      console.error('Error saving physical assessment:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmotionalAssessment = async (data: EmotionalAssessmentData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_emotional_assessment')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Emotional assessment saved successfully');
    } catch (err: any) {
      console.error('Error saving emotional assessment:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveBehavioralAssessment = async (data: BehavioralAssessmentData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_behavioral_assessment')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Behavioral assessment saved successfully');
    } catch (err: any) {
      console.error('Error saving behavioral assessment:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveWellnessAssessment = async (data: WellnessAssessmentData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_wellness_assessment')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Wellness assessment saved successfully');
    } catch (err: any) {
      console.error('Error saving wellness assessment:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveNutritionalStructure = async (data: NutritionalStructureData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_nutritional_structure')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data,
          selected_meals: JSON.stringify(data.selected_meals)
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Nutritional structure saved successfully');
    } catch (err: any) {
      console.error('Error saving nutritional structure:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveNutritionalPersonalization = async (data: NutritionalPersonalizationData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_nutritional_personalization')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Nutritional personalization saved successfully');
    } catch (err: any) {
      console.error('Error saving nutritional personalization:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const saveClinicalHistory = async (data: ClinicalHistoryData) => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('consultation_clinical_history')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          ...data
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      console.log('Clinical history saved successfully');
    } catch (err: any) {
      console.error('Error saving clinical history:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedClinicalHistory = async () => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_clinical_history')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err: any) {
      console.error('Error getting saved clinical history:', err);
      return null;
    }
  };

  const generateNutritionalPlan = async () => {
    if (!user) throw new Error('User not authenticated');
    if (!consultationId) throw new Error('Consultation ID is required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar todos os dados salvos incluindo histórico clínico
      const [physicalData, emotionalData, behavioralData, wellnessData, structureData, personalizationData, clinicalData] = await Promise.all([
        supabase.from('consultation_physical_assessment').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_emotional_assessment').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_behavioral_assessment').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_wellness_assessment').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_nutritional_structure').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_nutritional_personalization').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single(),
        supabase.from('consultation_clinical_history').select('*').eq('patient_id', patientId).eq('user_id', user.id).eq('consultation_id', consultationId).single()
      ]);

      // Compilar dados para geração do plano
      const compiledData = {
        physical: physicalData.data,
        emotional: emotionalData.data,
        behavioral: behavioralData.data,
        wellness: wellnessData.data,
        structure: structureData.data,
        personalization: personalizationData.data,
        clinical: clinicalData.data
      };

      // Gerar plano baseado nos dados
      const generatedPlan = generatePlanContent(compiledData);

      // Salvar o plano gerado
      const { error } = await supabase
        .from('consultation_nutritional_plans')
        .upsert({
          patient_id: patientId,
          user_id: user.id,
          consultation_id: consultationId,
          plan_content: generatedPlan,
          generation_data: compiledData,
          is_active: true
        }, {
          onConflict: 'patient_id,user_id,consultation_id'
        });

      if (error) throw error;
      
      console.log('Nutritional plan generated and saved successfully');
      return generatedPlan;
    } catch (err: any) {
      console.error('Error generating nutritional plan:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSavedNutritionalPlan = async () => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_nutritional_plans')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.plan_content || null;
    } catch (err: any) {
      console.error('Error getting saved nutritional plan:', err);
      return null;
    }
  };

  return {
    savePhysicalAssessment,
    saveEmotionalAssessment,
    saveBehavioralAssessment,
    saveWellnessAssessment,
    saveNutritionalStructure,
    saveNutritionalPersonalization,
    saveClinicalHistory,
    generateNutritionalPlan,
    getSavedNutritionalPlan,
    getSavedClinicalHistory,
    isLoading,
    error
  };
};

// Função para gerar o conteúdo do plano alimentar
const generatePlanContent = (data: any): string => {
  const { physical, structure, personalization, behavioral, wellness, clinical } = data;
  
  // Determinar objetivo principal
  let mainObjective = 'Melhoria da saúde geral';
  if (physical?.objetivo_emagrecimento) mainObjective = 'Emagrecimento';
  else if (physical?.objetivo_estetica) mainObjective = 'Melhoria estética';
  else if (physical?.objetivo_performance_esportiva) mainObjective = 'Performance esportiva';
  else if (physical?.objetivo_saude_longevidade) mainObjective = 'Saúde e longevidade';

  // Calcular necessidades calóricas
  const dailyCalories = structure?.daily_calories || '2000';
  const selectedMeals = structure?.selected_meals ? JSON.parse(structure.selected_meals) : [];
  
  // Alimentos preferidos e evitados
  const preferredFoods = personalization?.preferred_foods || '';
  const avoidedFoods = personalization?.avoided_foods || '';
  const vegetables = personalization?.vegetables || '';
  const fruits = personalization?.fruits || '';

  let planContent = `PLANO ALIMENTAR PERSONALIZADO

OBJETIVO: ${mainObjective}
META CALÓRICA DIÁRIA: ${dailyCalories} kcal

DISTRIBUIÇÃO DE MACRONUTRIENTES:
- Carboidratos: ${structure?.carbs_percentage || '50'}% (${structure?.carbs_grams || 'N/A'}g)
- Proteínas: ${structure?.proteins_percentage || '25'}% (${structure?.proteins_grams || 'N/A'}g)
- Gorduras: ${structure?.fats_percentage || '25'}% (${structure?.fats_grams || 'N/A'}g)

REFEIÇÕES SELECIONADAS: ${selectedMeals.join(', ') || 'Não especificado'}

`;

  // Gerar sugestões de refeições baseadas nas preferências
  if (selectedMeals.includes('Café da Manhã')) {
    planContent += `CAFÉ DA MANHÃ (7h00):
- Opção 1: Aveia com frutas vermelhas e castanhas
- Opção 2: Ovos mexidos com pão integral
- Opção 3: Vitamina com frutas e proteína
${preferredFoods && `(Incluindo: ${preferredFoods.split(',').slice(0, 2).join(', ')})`}

`;
  }

  if (selectedMeals.includes('Lanche da Manhã')) {
    planContent += `LANCHE DA MANHÃ (10h00):
- Opção 1: Iogurte natural com granola
- Opção 2: Frutas com oleaginosas
- Opção 3: Smoothie verde
${fruits && `(Frutas preferidas: ${fruits.split(',').slice(0, 2).join(', ')})`}

`;
  }

  if (selectedMeals.includes('Almoço')) {
    planContent += `ALMOÇO (12h30):
- Proteína: Frango, peixe ou carne magra (150-200g)
- Carboidrato: Arroz integral, quinoa ou batata doce
- Vegetais: Salada variada e legumes refogados
- Gordura saudável: Azeite extra virgem
${vegetables && `(Vegetais preferidos: ${vegetables.split(',').slice(0, 2).join(', ')})`}

`;
  }

  if (selectedMeals.includes('Lanche da Tarde')) {
    planContent += `LANCHE DA TARDE (15h30):
- Opção 1: Mix de oleaginosas
- Opção 2: Frutas com pasta de amendoim
- Opção 3: Iogurte com chia

`;
  }

  if (selectedMeals.includes('Jantar')) {
    planContent += `JANTAR (19h00):
- Proteína magra (120-150g)
- Vegetais no vapor ou grelhados
- Salada verde com azeite
- Carboidrato de baixo índice glicêmico (opcional)

`;
  }

  if (selectedMeals.includes('Ceia')) {
    planContent += `CEIA (21h30):
- Opção 1: Chá de camomila com castanhas
- Opção 2: Iogurte natural
- Opção 3: Leite vegetal morno

`;
  }

  // Adicionar recomendações especiais baseadas no histórico clínico
  planContent += `RECOMENDAÇÕES ESPECIAIS:

`;

  // Recomendações baseadas no histórico clínico
  if (clinical?.allergies) {
    planContent += `- ALERGIAS/INTOLERÂNCIAS: Evitar completamente: ${clinical.allergies}
`;
  }

  if (clinical?.medications) {
    planContent += `- INTERAÇÕES MEDICAMENTOSAS: Considerar horários de medicação: ${clinical.medications}
`;
  }

  if (clinical?.pre_existing_conditions) {
    planContent += `- CONDIÇÕES PRÉ-EXISTENTES: Adaptações devido a: ${clinical.pre_existing_conditions}
`;
  }

  if (clinical?.supplements) {
    planContent += `- SUPLEMENTAÇÃO ATUAL: ${clinical.supplements}
`;
  }

  if (avoidedFoods) {
    planContent += `- EVITAR: ${avoidedFoods}
`;
  }

  if (behavioral?.fluid_intake === 'menos-1.8') {
    planContent += `- HIDRATAÇÃO: Aumentar consumo de água para pelo menos 2L por dia
`;
  }

  if (wellness?.physical_activity === 'nao') {
    planContent += `- ATIVIDADE FÍSICA: Iniciar com caminhadas leves de 20-30 minutos
`;
  }

  if (wellness?.sleep === 'menos-6') {
    planContent += `- SONO: Melhorar qualidade do sono para 7-8 horas por noite
`;
  }

  planContent += `
OBSERVAÇÕES CLÍNICAS:
`;

  if (clinical?.family_history) {
    planContent += `- Histórico Familiar: ${clinical.family_history}
`;
  }

  if (clinical?.hereditary_diseases) {
    planContent += `- Doenças Hereditárias: ${clinical.hereditary_diseases}
`;
  }

  planContent += `
OBSERVAÇÕES GERAIS:
- Adapte as porções conforme sua fome e saciedade
- Mantenha horários regulares de alimentação
- Pratique o comer consciente
- Acompanhe sua evolução semanalmente
- Em caso de dúvidas sobre interações medicamentosas, consulte seu médico

Este plano foi personalizado com base nas suas preferências, necessidades individuais e histórico clínico.`;

  return planContent;
};
