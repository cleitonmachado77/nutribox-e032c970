
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pacienteId: string) => {
      console.log('Attempting to delete paciente:', pacienteId);
      
      try {
        // PASSO 1: Deletar arquivos de consultas realizadas primeiro
        const { data: consultasRealizadas, error: fetchConsultasError } = await supabase
          .from('consultas_realizadas')
          .select('id')
          .eq('paciente_id', pacienteId);

        if (fetchConsultasError) {
          console.error('Error fetching consultas realizadas:', fetchConsultasError);
        } else if (consultasRealizadas && consultasRealizadas.length > 0) {
          for (const consulta of consultasRealizadas) {
            // Deletar arquivos da consulta
            const { error: deleteArquivosError } = await supabase
              .from('consulta_arquivos')
              .delete()
              .eq('consulta_realizada_id', consulta.id);

            if (deleteArquivosError) {
              console.error('Error deleting arquivos:', deleteArquivosError);
            }
          }

          // Deletar consultas realizadas
          const { error: deleteConsultasRealizadasError } = await supabase
            .from('consultas_realizadas')
            .delete()
            .eq('paciente_id', pacienteId);

          if (deleteConsultasRealizadasError) {
            console.error('Error deleting consultas realizadas:', deleteConsultasRealizadasError);
            throw new Error('Erro ao deletar consultas realizadas: ' + deleteConsultasRealizadasError.message);
          }
        }

        // PASSO 2: Deletar o paciente
        const { error: deletePacienteError } = await supabase
          .from('pacientes')
          .delete()
          .eq('id', pacienteId);

        if (deletePacienteError) {
          console.error('Error deleting paciente:', deletePacienteError);
          throw new Error('Erro ao deletar paciente: ' + deletePacienteError.message);
        }

        console.log('Paciente deleted successfully');
        return pacienteId;
      } catch (error) {
        console.error('Delete operation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-realizadas'] });
    },
  });
};
