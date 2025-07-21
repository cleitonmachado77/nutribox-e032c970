
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/lead';

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Creating lead with data:', leadData);

      // Criar o lead
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            ...leadData,
            user_id: user.id,
            status: 'ativo'
          }
        ])
        .select()
        .single();

      if (leadError) {
        console.error('Error creating lead:', leadError);
        throw leadError;
      }

      console.log('Lead created successfully:', lead);

      // Automaticamente criar o paciente
      const { data: paciente, error: pacienteError } = await supabase
        .from('pacientes')
        .insert([
          {
            lead_id: lead.id,
            user_id: user.id,
            data_primeira_consulta: new Date().toISOString(),
            status_tratamento: 'ativo'
          }
        ])
        .select()
        .single();

      if (pacienteError) {
        console.error('Error creating paciente:', pacienteError);
        // Se falhar na criação do paciente, vamos reverter o lead
        await supabase.from('leads').delete().eq('id', lead.id);
        throw pacienteError;
      }

      console.log('Paciente created successfully:', paciente);

      return { lead, paciente };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
    onError: (error) => {
      console.error('Error in create lead mutation:', error);
    }
  });
};
