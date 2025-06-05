
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadId: string) => {
      console.log('Attempting to delete lead:', leadId);
      
      try {
        // PASSO 1: Buscar pacientes relacionados ao lead PRIMEIRO
        const { data: pacientesRelacionados, error: fetchPacientesError } = await supabase
          .from('pacientes')
          .select('id')
          .eq('lead_id', leadId);

        if (fetchPacientesError) {
          console.error('Error fetching related pacientes:', fetchPacientesError);
          throw new Error('Erro ao verificar pacientes vinculados');
        }

        console.log('Found related pacientes:', pacientesRelacionados?.length || 0);

        // PASSO 2: Se existem pacientes, deletar TODA a hierarquia de dados dos pacientes
        if (pacientesRelacionados && pacientesRelacionados.length > 0) {
          for (const paciente of pacientesRelacionados) {
            console.log('Processing paciente:', paciente.id);

            // 2.1: Deletar arquivos de consultas realizadas primeiro
            const { data: consultasRealizadas, error: fetchConsultasError } = await supabase
              .from('consultas_realizadas')
              .select('id')
              .eq('paciente_id', paciente.id);

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
                .eq('paciente_id', paciente.id);

              if (deleteConsultasRealizadasError) {
                console.error('Error deleting consultas realizadas:', deleteConsultasRealizadasError);
              }
            }

            // 2.2: Deletar consultas agendadas do paciente
            const { error: deleteConsultasPacienteError } = await supabase
              .from('consultas')
              .delete()
              .eq('lead_id', leadId);

            if (deleteConsultasPacienteError) {
              console.error('Error deleting consultas do paciente:', deleteConsultasPacienteError);
            }
          }

          // 2.3: Agora deletar os pacientes
          const { error: deletePacientesError } = await supabase
            .from('pacientes')
            .delete()
            .eq('lead_id', leadId);

          if (deletePacientesError) {
            console.error('Error deleting pacientes:', deletePacientesError);
            throw new Error('Erro ao deletar pacientes vinculados: ' + deletePacientesError.message);
          }
          console.log('Successfully deleted pacientes');
        } else {
          // PASSO 3: Se não há pacientes, apenas deletar consultas agendadas diretamente vinculadas ao lead
          const { error: deleteConsultasError } = await supabase
            .from('consultas')
            .delete()
            .eq('lead_id', leadId);

          if (deleteConsultasError) {
            console.error('Error deleting consultas agendadas:', deleteConsultasError);
            throw new Error('Erro ao deletar consultas agendadas: ' + deleteConsultasError.message);
          }
          console.log('Successfully deleted consultas agendadas');
        }

        // PASSO 4: Finalmente deletar o lead
        const { error: deleteLeadError } = await supabase
          .from('leads')
          .delete()
          .eq('id', leadId);

        if (deleteLeadError) {
          console.error('Error deleting lead:', deleteLeadError);
          throw new Error('Erro ao deletar lead: ' + deleteLeadError.message);
        }

        console.log('Lead deleted successfully');
        return leadId;
      } catch (error) {
        console.error('Delete operation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-realizadas'] });
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
    },
  });
};
