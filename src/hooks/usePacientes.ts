
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from './useLeads';

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
    staleTime: 0, // Sempre buscar dados frescos
    refetchOnWindowFocus: false,
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

      console.log('Creating paciente for lead:', leadId);

      // Verificar se já existe um paciente para este lead
      const { data: existingPaciente } = await supabase
        .from('pacientes')
        .select('id')
        .eq('lead_id', leadId)
        .eq('user_id', user.id)
        .single();

      if (existingPaciente) {
        console.log('Paciente already exists for this lead');
        return existingPaciente;
      }

      // Criar o paciente
      const { data: paciente, error: pacienteError } = await supabase
        .from('pacientes')
        .insert([
          {
            lead_id: leadId,
            user_id: user.id,
            data_primeira_consulta: new Date().toISOString(),
            status_tratamento: 'ativo'
          }
        ])
        .select()
        .single();

      if (pacienteError) {
        console.error('Error creating paciente:', pacienteError);
        throw pacienteError;
      }

      console.log('Paciente created successfully:', paciente);
      return paciente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};
