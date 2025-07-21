
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, leadData }: { id: string; leadData: any }) => {
      console.log('Updating lead:', id, 'with data:', leadData);
      // Atualiza o lead
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...leadData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      // Atualiza também o paciente correspondente
      const { error: pacienteError } = await supabase
        .from('pacientes')
        .update({
          // Sincronize os campos desejados
          nome: leadData.nome,
          telefone: leadData.telefone,
          peso: leadData.peso,
          altura: leadData.altura,
          foto_perfil: leadData.foto_perfil,
          status_tratamento: leadData.status,
        })
        .eq('lead_id', id);

      if (pacienteError) {
        console.error('Error updating paciente:', pacienteError);
        // Não lança erro para não travar a UI, mas loga
      }

      console.log('Lead and paciente updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
    onError: (error) => {
      console.error('Error in update lead mutation:', error);
    }
  });
};
