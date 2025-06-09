
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pacienteId: string) => {
      console.log('Deletando paciente:', pacienteId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // PASSO 1: Buscar dados do paciente antes de deletar
      const { data: pacienteData, error: fetchPacienteError } = await supabase
        .from('pacientes')
        .select('lead_id')
        .eq('id', pacienteId)
        .eq('user_id', user.id)
        .single();

      if (fetchPacienteError) {
        console.error('Erro ao buscar dados do paciente:', fetchPacienteError);
        throw new Error('Paciente não encontrado: ' + fetchPacienteError.message);
      }

      // PASSO 2: Deletar arquivos de consultas realizadas
      const { data: consultasRealizadas, error: fetchConsultasError } = await supabase
        .from('consultas_realizadas')
        .select('id')
        .eq('paciente_id', pacienteId)
        .eq('user_id', user.id);

      if (fetchConsultasError) {
        console.error('Erro ao buscar consultas realizadas:', fetchConsultasError);
        throw new Error('Erro ao buscar consultas realizadas: ' + fetchConsultasError.message);
      }

      if (consultasRealizadas && consultasRealizadas.length > 0) {
        for (const consulta of consultasRealizadas) {
          const { error: deleteArquivosError } = await supabase
            .from('consulta_arquivos')
            .delete()
            .eq('consulta_realizada_id', consulta.id);

          if (deleteArquivosError) {
            console.error('Erro ao deletar arquivos da consulta:', deleteArquivosError);
            throw new Error('Erro ao deletar arquivos: ' + deleteArquivosError.message);
          }
        }

        const { error: deleteConsultasRealizadasError } = await supabase
          .from('consultas_realizadas')
          .delete()
          .eq('paciente_id', pacienteId)
          .eq('user_id', user.id);

        if (deleteConsultasRealizadasError) {
          console.error('Erro ao deletar consultas realizadas:', deleteConsultasRealizadasError);
          throw new Error('Erro ao deletar consultas realizadas: ' + deleteConsultasRealizadasError.message);
        }
      }

      // PASSO 3: Deletar consultas agendadas relacionadas ao lead
      if (pacienteData.lead_id) {
        const { error: deleteConsultasError } = await supabase
          .from('consultas')
          .delete()
          .eq('lead_id', pacienteData.lead_id)
          .eq('user_id', user.id);

        if (deleteConsultasError) {
          console.error('Erro ao deletar consultas agendadas:', deleteConsultasError);
          throw new Error('Erro ao deletar consultas agendadas: ' + deleteConsultasError.message);
        }
      }

      // PASSO 4: Deletar o paciente
      const { error: deletePacienteError } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', pacienteId)
        .eq('user_id', user.id);

      if (deletePacienteError) {
        console.error('Erro ao deletar paciente:', deletePacienteError);
        throw new Error('Erro ao deletar paciente: ' + deletePacienteError.message);
      }

      console.log('Paciente deletado com sucesso');
      return { pacienteId, leadId: pacienteData.lead_id };
    },
    onSuccess: () => {
      // Invalidar queries para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
    onError: (error) => {
      console.error('Erro na deleção:', error);
    }
  });
};
