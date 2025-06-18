
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CoachInteraction {
  id: string;
  patient_phone: string;
  patient_name: string;
  action_type: string;
  generated_message: string;
  patient_data?: any;
  created_at: string;
}

export interface CoachStats {
  pacientesConectados: number;
  mensagensEnviadas: number;
  questionariosRespondidos: number;
  lembretesPendentes: number;
  interacoesTotais: number;
  taxaResposta: number;
}

export const useNutriCoachData = () => {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<CoachInteraction[]>([]);
  const [stats, setStats] = useState<CoachStats>({
    pacientesConectados: 0,
    mensagensEnviadas: 0,
    questionariosRespondidos: 0,
    lembretesPendentes: 0,
    interacoesTotais: 0,
    taxaResposta: 0
  });
  const [loading, setLoading] = useState(true);

  const loadCoachInteractions = async () => {
    if (!user) return;

    try {
      // Buscar interações do coach
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('whatsapp_coach_interactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (interactionsError) throw interactionsError;

      // Buscar conversas ativas no WhatsApp
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('user_id', user.id);

      if (conversationsError) throw conversationsError;

      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const todayInteractions = interactionsData?.filter(interaction => 
        interaction.created_at.startsWith(today)
      ) || [];

      const questionarios = interactionsData?.filter(interaction => 
        interaction.action_type === 'generate_questionnaire'
      ) || [];

      const responses = interactionsData?.filter(interaction => 
        interaction.action_type === 'analyze_responses'
      ) || [];

      const taxaResposta = questionarios.length > 0 
        ? Math.round((responses.length / questionarios.length) * 100)
        : 0;

      setInteractions(interactionsData || []);
      setStats({
        pacientesConectados: conversationsData?.length || 0,
        mensagensEnviadas: todayInteractions.length,
        questionariosRespondidos: responses.length,
        lembretesPendentes: Math.max(0, questionarios.length - responses.length),
        interacoesTotais: interactionsData?.length || 0,
        taxaResposta
      });
    } catch (error) {
      console.error('Error loading coach data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoachInteractions();
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('coach-interactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_coach_interactions'
        },
        () => {
          loadCoachInteractions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    interactions,
    stats,
    loading,
    reloadData: loadCoachInteractions
  };
};
