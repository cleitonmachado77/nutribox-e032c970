
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PatientCurrentData {
  // Dados físicos atuais
  peso_atual?: string;
  altura?: string;
  imc?: string;
  gordura_corporal?: string;
  circunferencia_cintura?: string;
  circunferencia_quadril?: string;
  circunferencia_braco?: string;
  circunferencia_coxa?: string;
  
  // Dados comportamentais atuais
  plan_consistency?: string;
  meal_frequency?: string;
  meal_time?: string;
  vegetable_fruits?: string;
  fluid_intake?: string;
  
  // Dados de bem-estar atuais
  body_image?: string;
  physical_energy?: string;
  physical_activity?: string;
  sleep?: string;
  journey_confidence?: string;
}

export const usePatientCurrentData = (patientId: string) => {
  const { user } = useAuth();
  const [currentData, setCurrentData] = useState<PatientCurrentData>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadCurrentData = async () => {
    if (!user || !patientId) return;
    
    setIsLoading(true);
    try {
      // Buscar a consulta mais recente
      const { data: latestConsultation } = await supabase
        .from('consultations')
        .select('id')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!latestConsultation) {
        setCurrentData({});
        return;
      }

      // Buscar dados físicos mais recentes
      const { data: physicalData } = await supabase
        .from('consultation_physical_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', latestConsultation.id)
        .maybeSingle();

      // Buscar dados comportamentais mais recentes
      const { data: behavioralData } = await supabase
        .from('consultation_behavioral_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', latestConsultation.id)
        .maybeSingle();

      // Buscar dados de bem-estar mais recentes
      const { data: wellnessData } = await supabase
        .from('consultation_wellness_assessment')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .eq('consultation_id', latestConsultation.id)
        .maybeSingle();

      // Combinar todos os dados
      const combinedData: PatientCurrentData = {
        // Dados físicos
        peso_atual: physicalData?.peso_atual,
        altura: physicalData?.altura,
        imc: physicalData?.imc,
        gordura_corporal: physicalData?.gordura_corporal,
        circunferencia_cintura: physicalData?.circunferencia_cintura,
        circunferencia_quadril: physicalData?.circunferencia_quadril,
        circunferencia_braco: physicalData?.circunferencia_braco,
        circunferencia_coxa: physicalData?.circunferencia_coxa,
        
        // Dados comportamentais
        plan_consistency: behavioralData?.plan_consistency,
        meal_frequency: behavioralData?.meal_frequency,
        meal_time: behavioralData?.meal_time,
        vegetable_fruits: behavioralData?.vegetable_fruits,
        fluid_intake: behavioralData?.fluid_intake,
        
        // Dados de bem-estar
        body_image: wellnessData?.body_image,
        physical_energy: wellnessData?.physical_energy,
        physical_activity: wellnessData?.physical_activity,
        sleep: wellnessData?.sleep,
        journey_confidence: wellnessData?.journey_confidence,
      };

      setCurrentData(combinedData);
    } catch (error) {
      console.error('Error loading current patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (patientId && user) {
      loadCurrentData();
    }
  }, [patientId, user]);

  return {
    currentData,
    isLoading,
    refetch: loadCurrentData
  };
};
