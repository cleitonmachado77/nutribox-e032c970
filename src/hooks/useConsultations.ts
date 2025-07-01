
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Consultation {
  id: string;
  patient_id: string;
  user_id: string;
  consultation_number: number;
  status: 'em_andamento' | 'concluida' | 'cancelada';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  notes?: string;
}

export const useConsultations = (patientId: string) => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConsultations = async () => {
    if (!user || !patientId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .eq('user_id', user.id)
        .order('consultation_number', { ascending: false });

      if (error) throw error;
      
      // Type assertion para garantir que o status seja do tipo correto
      const typedData = (data || []).map(consultation => ({
        ...consultation,
        status: consultation.status as 'em_andamento' | 'concluida' | 'cancelada'
      }));
      
      setConsultations(typedData);
      
      // Definir consulta atual (em andamento ou mais recente)
      const currentInProgress = typedData?.find(c => c.status === 'em_andamento');
      if (currentInProgress) {
        setCurrentConsultation(currentInProgress);
      } else if (typedData && typedData.length > 0) {
        setCurrentConsultation(typedData[0]);
      }
    } catch (err: any) {
      console.error('Error loading consultations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConsultation = async () => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      // Obter próximo número de consulta
      const { data: nextNumberData, error: nextNumberError } = await supabase
        .rpc('get_next_consultation_number', {
          p_patient_id: patientId,
          p_user_id: user.id
        });

      if (nextNumberError) throw nextNumberError;

      const consultationNumber = nextNumberData;

      // Criar nova consulta
      const { data, error } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          user_id: user.id,
          consultation_number: consultationNumber,
          status: 'em_andamento'
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'em_andamento' | 'concluida' | 'cancelada'
      };

      setCurrentConsultation(typedData);
      await loadConsultations();
      
      return typedData;
    } catch (err: any) {
      console.error('Error creating new consultation:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeConsultation = async (consultationId: string, notes?: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { error } = await supabase
        .from('consultations')
        .update({
          status: 'concluida',
          completed_at: new Date().toISOString(),
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await loadConsultations();
    } catch (err: any) {
      console.error('Error completing consultation:', err);
      setError(err.message);
      throw err;
    }
  };

  const deleteConsultation = async (consultationId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', consultationId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Se a consulta deletada era a atual, limpar currentConsultation
      if (currentConsultation?.id === consultationId) {
        setCurrentConsultation(null);
      }
      
      await loadConsultations();
    } catch (err: any) {
      console.error('Error deleting consultation:', err);
      setError(err.message);
      throw err;
    }
  };

  const setActiveConsultation = (consultation: Consultation) => {
    setCurrentConsultation(consultation);
  };

  useEffect(() => {
    if (patientId && user) {
      loadConsultations();
    }
  }, [patientId, user]);

  return {
    consultations,
    currentConsultation,
    isLoading,
    error,
    createNewConsultation,
    completeConsultation,
    deleteConsultation,
    setActiveConsultation,
    loadConsultations,
    totalConsultations: consultations.length
  };
};
