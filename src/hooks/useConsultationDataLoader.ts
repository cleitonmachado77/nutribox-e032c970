
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { 
  PhysicalAssessmentData,
  EmotionalAssessmentData,
  BehavioralAssessmentData,
  WellnessAssessmentData,
  NutritionalStructureData,
  NutritionalPersonalizationData,
  ClinicalHistoryData
} from './useConsultationData';

export const useConsultationDataLoader = (patientId: string, consultationId?: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadPhysicalAssessment = async (): Promise<PhysicalAssessmentData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_physical_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          objetivo_estetica: data.objetivo_estetica || false,
          objetivo_emagrecimento: data.objetivo_emagrecimento || false,
          objetivo_saude_longevidade: data.objetivo_saude_longevidade || false,
          objetivo_performance_esportiva: data.objetivo_performance_esportiva || false,
          peso_atual: data.peso_atual || '',
          altura: data.altura || '',
          imc: data.imc || '',
          gordura_corporal: data.gordura_corporal || '',
          circunferencia_cintura: data.circunferencia_cintura || '',
          circunferencia_quadril: data.circunferencia_quadril || '',
          circunferencia_braco: data.circunferencia_braco || '',
          circunferencia_coxa: data.circunferencia_coxa || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading physical assessment:', error);
      return null;
    }
  };

  const loadEmotionalAssessment = async (): Promise<EmotionalAssessmentData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_emotional_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          relationship_with_food: data.relationship_with_food || '',
          eating_triggers: data.eating_triggers || '',
          emotional_state: data.emotional_state || '',
          stress_level: data.stress_level || '',
          food_anxiety: data.food_anxiety || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading emotional assessment:', error);
      return null;
    }
  };

  const loadBehavioralAssessment = async (): Promise<BehavioralAssessmentData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_behavioral_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          plan_consistency: data.plan_consistency || '',
          meal_frequency: data.meal_frequency || '',
          meal_time: data.meal_time || '',
          vegetable_fruits: data.vegetable_fruits || '',
          fluid_intake: data.fluid_intake || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading behavioral assessment:', error);
      return null;
    }
  };

  const loadWellnessAssessment = async (): Promise<WellnessAssessmentData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_wellness_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          body_image: data.body_image || '',
          physical_energy: data.physical_energy || '',
          physical_activity: data.physical_activity || '',
          sleep: data.sleep || '',
          journey_confidence: data.journey_confidence || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading wellness assessment:', error);
      return null;
    }
  };

  const loadNutritionalStructure = async (): Promise<NutritionalStructureData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_nutritional_structure')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          daily_calories: data.daily_calories || '',
          carbs_percentage: data.carbs_percentage || '',
          carbs_grams: data.carbs_grams || '',
          proteins_percentage: data.proteins_percentage || '',
          proteins_grams: data.proteins_grams || '',
          fats_percentage: data.fats_percentage || '',
          fats_grams: data.fats_grams || '',
          selected_meals: data.selected_meals ? JSON.parse(data.selected_meals as string) : []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading nutritional structure:', error);
      return null;
    }
  };

  const loadNutritionalPersonalization = async (): Promise<NutritionalPersonalizationData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_nutritional_personalization')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          preferred_meals: data.preferred_meals || '',
          avoided_meals: data.avoided_meals || '',
          preferred_foods: data.preferred_foods || '',
          avoided_foods: data.avoided_foods || '',
          perfect_meals: data.perfect_meals || '',
          vegetables: data.vegetables || '',
          fruits: data.fruits || '',
          objects: data.objects || '',
          limitations: data.limitations || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading nutritional personalization:', error);
      return null;
    }
  };

  const loadClinicalHistory = async (): Promise<ClinicalHistoryData | null> => {
    if (!user || !consultationId) return null;
    
    try {
      const { data, error } = await supabase
        .from('consultation_clinical_history')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', consultationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        return {
          pre_existing_conditions: data.pre_existing_conditions || '',
          surgeries: data.surgeries || '',
          medications: data.medications || '',
          supplements: data.supplements || '',
          allergies: data.allergies || '',
          family_history: data.family_history || '',
          hereditary_diseases: data.hereditary_diseases || ''
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading clinical history:', error);
      return null;
    }
  };

  return {
    loadPhysicalAssessment,
    loadEmotionalAssessment,
    loadBehavioralAssessment,
    loadWellnessAssessment,
    loadNutritionalStructure,
    loadNutritionalPersonalization,
    loadClinicalHistory,
    loading
  };
};
