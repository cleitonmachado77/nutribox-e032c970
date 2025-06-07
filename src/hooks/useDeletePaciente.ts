
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pacienteId: string) => {
      console.log('Attempting to delete paciente:', pacienteId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // PASSO 1: Deletar arquivos de consultas realizadas primeiro
      const { data: consultasRealizadas, error: fetchConsultasError } = await supabase
        .from('consultas_realizadas')
        .select('id')
        .eq('paciente_id', pacienteId)
        .eq('user_id', user.id);

      if (fetchConsultasError) {
        console.error('Error fetching consultas realizadas:', fetchConsultasError);
        throw new Error('Erro ao buscar consultas realizadas: ' + fetchConsultasError.message);
      }

      if (consultasRealizadas && consultasRealizadas.length > 0) {
        for (const consulta of consultasRealizadas) {
          // Deletar arquivos da consulta
          const { error: deleteArquivosError } = await supabase
            .from('consulta_arquivos')
            .delete()
            .eq('consulta_realizada_id', consulta.id);

          if (deleteArquivosError) {
            console.error('Error deleting arquivos:', deleteArquivosError);
            throw new Error('Erro ao deletar arquivos: ' + deleteArquivosError.message);
          }
        }

        // Deletar consultas realizadas
        const { error: deleteConsultasRealizadasError } = await supabase
          .from('consultas_realizadas')
          .delete()
          .eq('paciente_id', pacienteId)
          .eq('user_id', user.id);

        if (deleteConsultasRealizadasError) {
          console.error('Error deleting consultas realizadas:', deleteConsultasRealizadasError);
          throw new Error('Erro ao deletar consultas realizadas: ' + deleteConsultasRealizadasError.message);
        }
      }

      // PASSO 2: Deletar consultas agendadas relacionadas ao paciente
      const { data: pacienteData, error: fetchPacienteError } = await supabase
        .from('pacientes')
        .select('lead_id')
        .eq('id', pacienteId)
        .eq('user_id', user.id)
        .single();

      if (fetchPacienteError) {
        console.error('Error fetching paciente data:', fetchPacienteError);
        throw new Error('Erro ao buscar dados do paciente: ' + fetchPacienteError.message);
      }

      if (pacienteData?.lead_id) {
        const { error: deleteConsultasError } = await supabase
          .from('consultas')
          .delete()
          .eq('lead_id', pacienteData.lead_id)
          .eq('user_id', user.id);

        if (deleteConsultasError) {
          console.error('Error deleting consultas:', deleteConsultasError);
          throw new Error('Erro ao deletar consultas: ' + deleteConsultasError.message);
        }
      }

      // PASSO 3: Deletar o paciente
      const { error: deletePacienteError } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', pacienteId)
        .eq('user_id', user.id);

      if (deletePacienteError) {
        console.error('Error deleting paciente:', deletePacienteError);
        throw new Error('Erro ao deletar paciente: ' + deletePacienteError.message);
      }

      console.log('Paciente deleted successfully');
      return pacienteId;
    },
    onSuccess: (deletedPacienteId) => {
      console.log('Mutation successful, invalidating queries for paciente:', deletedPacienteId);
      
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
      queryClient.invalidateQueries({ queryKey: ['consultas-realizadas'] });
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      
      // Forçar um refetch imediato
      queryClient.refetchQueries({ queryKey: ['pacientes'] });
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    }
  });
};
