import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CoachResponse {
  id: string;
  patient_id?: string;
  patient_name: string;
  patient_phone: string;
  question_category: string;
  question_text: string;
  question_type: string;
  questionnaire_id?: string;
  response_date: string;
  response_score: number | null;
  response_text: string | null;
  created_at: string;
  user_id: string;
}

export function useCoachResponses(patientPhone?: string) {
  const [responses, setResponses] = useState<CoachResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResponses() {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('coach_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (patientPhone) {
        query = query.eq('patient_phone', patientPhone);
      }
      const { data, error } = await query;
      if (error) setError(error.message);
      setResponses(data || []);
      setLoading(false);
    }
    fetchResponses();
  }, [patientPhone]);

  return { responses, loading, error };
} 