import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from './useLeads';
import { getLeadProgressByStatus } from './useLeadProgress';

export interface Paciente {
  id: string;
  lead_id: string;
  user_id: string;
  data_primeira_consulta?: string;
  status_tratamento: string;
  created_at: string;
  updated_at: string;
  lead: Lead;
}

export const usePacientes = () => {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('pacientes')
        .select(`
          *,
          lead:leads(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pacientes:', error);
        throw error;
      }

      return data as Paciente[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

export const useCreatePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Primeiro criar o paciente
      const { data: paciente, error: pacienteError } = await supabase
        .from('pacientes')
        .insert([
          {
            lead_id: leadId,
            user_id: user.id,
            data_primeira_consulta: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (pacienteError) {
        console.error('Error creating paciente:', pacienteError);
        throw pacienteError;
      }

      // Depois atualizar o status do lead para "em_acompanhamento" com progresso de 100%
      const { error: leadError } = await supabase
        .from('leads')
        .update({ 
          status: 'em_acompanhamento',
          progresso: getLeadProgressByStatus('em_acompanhamento'),
          ultima_consulta: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) {
        console.error('Error updating lead status:', leadError);
        throw leadError;
      }

      return paciente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};
