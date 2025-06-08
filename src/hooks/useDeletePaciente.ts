
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pacienteId: string) => {
      console.log('=== INICIANDO DELEÇÃO DO PACIENTE ===');
      console.log('Paciente ID:', pacienteId);
      
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

      console.log('Dados do paciente encontrados:', pacienteData);

      // PASSO 2: Deletar arquivos de consultas realizadas
      console.log('Deletando arquivos de consultas realizadas...');
      const { data: consultasRealizadas, error: fetchConsultasError } = await supabase
        .from('consultas_realizadas')
        .select('id')
        .eq('paciente_id', pacienteId)
        .eq('user_id', user.id);

      if (fetchConsultasError) {
        console.error('Erro ao buscar consultas realizadas:', fetchConsultasError);
        throw new Error('Erro ao buscar consultas realizadas: ' + fetchConsultasError.message);
      }

      console.log('Consultas realizadas encontradas:', consultasRealizadas?.length || 0);

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
        
        console.log('Consultas realizadas deletadas com sucesso');
      }

      // PASSO 3: Deletar consultas agendadas relacionadas ao lead
      if (pacienteData.lead_id) {
        console.log('Deletando consultas agendadas do lead:', pacienteData.lead_id);
        const { error: deleteConsultasError } = await supabase
          .from('consultas')
          .delete()
          .eq('lead_id', pacienteData.lead_id)
          .eq('user_id', user.id);

        if (deleteConsultasError) {
          console.error('Erro ao deletar consultas agendadas:', deleteConsultasError);
          throw new Error('Erro ao deletar consultas agendadas: ' + deleteConsultasError.message);
        }
        
        console.log('Consultas agendadas deletadas com sucesso');
      }

      // PASSO 4: Deletar o paciente
      console.log('Deletando paciente...');
      const { data: deletedData, error: deletePacienteError } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', pacienteId)
        .eq('user_id', user.id)
        .select(); // Adicionar select para verificar o que foi deletado

      if (deletePacienteError) {
        console.error('Erro ao deletar paciente:', deletePacienteError);
        throw new Error('Erro ao deletar paciente: ' + deletePacienteError.message);
      }

      console.log('Dados deletados do paciente:', deletedData);
      console.log('Quantidade de registros deletados:', deletedData?.length || 0);

      // PASSO 5: Verificar se a deleção realmente aconteceu
      console.log('Verificando se o paciente foi realmente deletado...');
      const { data: verificacao, error: verificacaoError } = await supabase
        .from('pacientes')
        .select('id')
        .eq('id', pacienteId)
        .eq('user_id', user.id);

      if (verificacaoError) {
        console.error('Erro na verificação:', verificacaoError);
      } else {
        console.log('Verificação pós-deleção - pacientes encontrados:', verificacao?.length || 0);
        if (verificacao && verificacao.length > 0) {
          console.error('ERRO CRÍTICO: Paciente ainda existe no banco após deleção!');
          throw new Error('Falha na deleção: paciente ainda existe no banco de dados');
        }
      }

      console.log('=== PACIENTE DELETADO COM SUCESSO ===');
      return { pacienteId, leadId: pacienteData.lead_id };
    },
    onSuccess: (result) => {
      console.log('=== MUTATION SUCCESS ===');
      console.log('Resultado:', result);
      
      // Invalidar queries imediatamente
      console.log('Invalidando queries imediatamente...');
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
      
      // Forçar um refetch após um delay pequeno
      setTimeout(() => {
        console.log('Forçando refetch após delay...');
        queryClient.refetchQueries({ queryKey: ['pacientes'] });
      }, 500);
    },
    onError: (error) => {
      console.error('=== MUTATION ERROR ===');
      console.error('Erro completo:', error);
    }
  });
};
