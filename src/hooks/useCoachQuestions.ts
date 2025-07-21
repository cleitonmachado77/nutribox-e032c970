import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type CoachQuestion = Tables<'coach_questionnaires'>;
export type CoachQuestionInsert =
  Omit<CoachQuestion, 'id' | 'created_at' | 'updated_at' | 'user_id'> &
  {
    id?: string;
    patient_id: string | null;
    envio_horario?: string | null;
    envio_frequencia?: string | null;
    envio_dia_semana?: string | null;
    envio_dia_mes?: number | null;
  };

export function useCoachQuestions(patientId?: string) {
  const [questions, setQuestions] = useState<CoachQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('coach_questionnaires')
      .select('*')
      // .eq('is_active', true) // <-- Removido: agora busca todos os questionários
      .order('created_at', { ascending: false });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }
    const { data, error } = await query;
    if (error) setError(error.message);
    setQuestions(data || []);
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Novo: aceitar array de patient_ids
  const addQuestion = async (question: Partial<CoachQuestionInsert>, patientIds: string[]) => {
    setLoading(true);
    setError(null);
    if (!patientIds || patientIds.length === 0) {
      setError('Selecione ao menos um paciente');
      setLoading(false);
      return;
    }
    // Buscar o user_id autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    // Cria uma pergunta para cada paciente
    const payloads = patientIds.map(pid => ({
      title: question.title || '',
      category: question.category || 'comportamental',
      question_text: question.question_text || '',
      options: question.options || [],
      frequency: question.frequency || 'diario',
      is_active: question.is_active ?? true,
      patient_id: pid,
      user_id: user.id,
    }));
    const { error } = await supabase
      .from('coach_questionnaires')
      .insert(payloads);
    if (error) setError(error.message);
    await fetchQuestions();
    setLoading(false);
  };

  const updateQuestion = async (id: string, updates: Partial<CoachQuestion>) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('coach_questionnaires')
      .update(updates)
      .eq('id', id);
    if (error) setError(error.message);
    await fetchQuestions();
    setLoading(false);
  };

  const deleteQuestion = async (id: string) => {
    setLoading(true);
    setError(null);
    // Lógica de soft-delete: em vez de apagar, marca como inativo
    const { error } = await supabase
      .from('coach_questionnaires')
      .update({ is_active: false })
      .eq('id', id);
    if (error) setError(error.message);
    await fetchQuestions(); // Recarrega a lista, que agora não mostrará o item "excluído"
    setLoading(false);
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
} 