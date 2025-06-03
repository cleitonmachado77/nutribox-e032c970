
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ConsultaRealizada {
  id: string;
  paciente_id: string;
  consulta_id?: string;
  user_id: string;
  data_consulta: string;
  observacoes?: string;
  peso_atual?: string;
  altura_atual?: string;
  imc_atual?: string;
  notas_clinicas?: string;
  created_at: string;
  updated_at: string;
  arquivos?: ConsultaArquivo[];
}

export interface ConsultaArquivo {
  id: string;
  consulta_realizada_id: string;
  nome_arquivo: string;
  url_arquivo: string;
  tipo_arquivo: string;
  descricao?: string;
  created_at: string;
}

export const useConsultasRealizadas = (pacienteId?: string) => {
  return useQuery({
    queryKey: ['consultas-realizadas', pacienteId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('consultas_realizadas')
        .select(`
          *,
          arquivos:consulta_arquivos(*)
        `)
        .eq('user_id', user.id)
        .order('data_consulta', { ascending: false });

      if (pacienteId) {
        query = query.eq('paciente_id', pacienteId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching consultas realizadas:', error);
        throw error;
      }

      return data as ConsultaRealizada[];
    },
    enabled: !!pacienteId,
  });
};

export const useCreateConsultaRealizada = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (consultaData: Omit<ConsultaRealizada, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('consultas_realizadas')
        .insert([
          {
            ...consultaData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating consulta realizada:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas-realizadas'] });
    },
  });
};

export const useUploadConsultaArquivo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      consultaRealizadaId, 
      file, 
      descricao 
    }: { 
      consultaRealizadaId: string; 
      file: File; 
      descricao?: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload do arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${consultaRealizadaId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('consultas-arquivos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('consultas-arquivos')
        .getPublicUrl(uploadData.path);

      // Salvar registro no banco
      const { data, error } = await supabase
        .from('consulta_arquivos')
        .insert([
          {
            consulta_realizada_id: consultaRealizadaId,
            nome_arquivo: file.name,
            url_arquivo: publicUrl,
            tipo_arquivo: file.type.startsWith('image/') ? 'foto' : 'documento',
            descricao,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving arquivo record:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultas-realizadas'] });
    },
  });
};
