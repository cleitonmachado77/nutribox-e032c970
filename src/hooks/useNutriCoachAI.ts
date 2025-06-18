
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CoachAIRequest {
  action: 'generate_questionnaire' | 'generate_motivational' | 'generate_reminder' | 'analyze_responses';
  patientName: string;
  patientPhone?: string;
  messageType?: string;
  patientData?: any;
  conversationHistory?: any[];
}

export const useNutriCoachAI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateMessage = async (request: CoachAIRequest): Promise<string | null> => {
    setLoading(true);
    try {
      console.log('Calling NutriCoach AI with:', request);

      const { data, error } = await supabase.functions.invoke('nutricoach-ai', {
        body: request
      });

      if (error) {
        console.error('NutriCoach AI error:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao gerar mensagem');
      }

      return data.message;
    } catch (error: any) {
      console.error('Error generating message:', error);
      toast({
        title: "Erro na IA",
        description: error.message || "Falha ao gerar mensagem do NutriCoach",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionnaire = async (patientName: string, patientPhone?: string) => {
    return await generateMessage({
      action: 'generate_questionnaire',
      patientName,
      patientPhone
    });
  };

  const generateMotivationalMessage = async (patientName: string, patientPhone?: string) => {
    return await generateMessage({
      action: 'generate_motivational',
      patientName,
      patientPhone
    });
  };

  const generateReminder = async (patientName: string, messageType: string, patientPhone?: string) => {
    return await generateMessage({
      action: 'generate_reminder',
      patientName,
      patientPhone,
      messageType
    });
  };

  const analyzeResponses = async (patientName: string, responses: any, patientPhone?: string) => {
    return await generateMessage({
      action: 'analyze_responses',
      patientName,
      patientPhone,
      patientData: responses
    });
  };

  return {
    loading,
    generateMessage,
    generateQuestionnaire,
    generateMotivationalMessage,
    generateReminder,
    analyzeResponses
  };
};
