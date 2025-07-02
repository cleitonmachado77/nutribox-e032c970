import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface QuestionnaireResponse {
  questionnaire_id: string;
  question_type: string;
  question_category: string;
  question_text: string;
  response_text: string;
  response_score: number;
}

export interface CustomQuestionnaire {
  title: string;
  question_text: string;
  options: string[];
  frequency: 'diario' | 'semanal' | 'mensal';
}

export const useNutriCoachQuestionnaire = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendDailyQuestionnaire = async (patientName: string, patientPhone: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nutricoach-questionnaire', {
        body: {
          action: 'send_daily_questionnaire',
          patientName,
          patientPhone,
          userId
        }
      });

      if (error) throw error;

      toast({
        title: "Questionário enviado",
        description: `Questionário ${data.questionnaire_type} enviado para ${patientName}`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar questionário",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processResponses = async (
    patientName: string, 
    patientPhone: string, 
    userId: string, 
    responses: QuestionnaireResponse[]
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nutricoach-questionnaire', {
        body: {
          action: 'process_responses',
          patientName,
          patientPhone,
          userId,
          responses
        }
      });

      if (error) throw error;

      toast({
        title: "Respostas processadas",
        description: `Análise enviada para ${patientName}`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao processar respostas",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCustomQuestionnaire = async (userId: string, questionnaires: CustomQuestionnaire[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nutricoach-questionnaire', {
        body: {
          action: 'create_custom_questionnaire',
          userId,
          questionnaires
        }
      });

      if (error) throw error;

      toast({
        title: "Questionários criados",
        description: `${data.questionnaires_created} questionários personalizados criados`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar questionários",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getPatientInsights = async (patientPhone: string, userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nutricoach-questionnaire', {
        body: {
          action: 'get_patient_insights',
          patientPhone,
          userId
        }
      });

      if (error) throw error;
      return data.insights;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao obter insights",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendDailyQuestionnaire,
    processResponses,
    createCustomQuestionnaire,
    getPatientInsights
  };
};