import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface NutriCoachStats {
  totalPacientes: number;
  questionariosHoje: number;
  engajamentoMedio: number;
  pacientesAtivos: number;
}

export const useNutriCoachStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<NutriCoachStats>({
    totalPacientes: 0,
    questionariosHoje: 0,
    engajamentoMedio: 0,
    pacientesAtivos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      // Total de pacientes
      const { data: pacientes } = await supabase
        .from('pacientes')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      // Questionários enviados hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: questionariosHoje } = await supabase
        .from('coach_responses')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', today);

      // Pacientes ativos (com respostas nos últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: respostasRecentes } = await supabase
        .from('coach_responses')
        .select('patient_phone')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      const pacientesAtivos = new Set(respostasRecentes?.map(r => r.patient_phone) || []).size;

      // Engajamento médio (baseado nas pontuações das respostas)
      const { data: todasRespostas } = await supabase
        .from('coach_responses')
        .select('response_score')
        .eq('user_id', user.id)
        .not('response_score', 'is', null);

      let engajamentoMedio = 0;
      if (todasRespostas && todasRespostas.length > 0) {
        const somaScores = todasRespostas.reduce((sum, r) => sum + (r.response_score || 0), 0);
        engajamentoMedio = Math.round((somaScores / todasRespostas.length) * 50); // Convert to percentage
      }

      setStats({
        totalPacientes: pacientes?.length || 0,
        questionariosHoje: questionariosHoje?.length || 0,
        engajamentoMedio,
        pacientesAtivos
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refreshStats: loadStats };
};