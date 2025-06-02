
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  objetivo?: string;
  objetivo_tag_id?: string;
  cidade?: string;
  estado?: string;
  status: string;
  foto_perfil?: string;
  data_conversao?: string;
  ultima_consulta?: string;
  proxima_consulta?: string;
  peso?: string;
  altura?: string;
  imc?: string;
  plano_alimentar?: string;
  anotacoes?: string;
  progresso: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  objetivo_tag?: {
    id: string;
    nome: string;
    cor: string;
  };
}

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          objetivo_tag:objetivo_tags(id, nome, cor)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      return data as Lead[];
    },
  });
};

export const useLeadsStats = () => {
  return useQuery({
    queryKey: ['leads-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error('Error fetching leads for stats:', error);
        throw error;
      }

      // Calcular estatísticas
      const totalLeads = leads.length;
      const leadsQualificados = leads.filter(lead => lead.status !== 'novo').length;
      const consultasAgendadas = leads.filter(lead => lead.proxima_consulta).length;
      const consultasRealizadas = leads.filter(lead => lead.ultima_consulta).length;

      // Estatísticas por estado
      const estadosCount = leads.reduce((acc, lead) => {
        if (lead.estado) {
          acc[lead.estado] = (acc[lead.estado] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const estadosData = Object.entries(estadosCount)
        .map(([estado, count]) => ({ 
          estado, 
          pacientes: count,
          name: estado
        }))
        .sort((a, b) => b.pacientes - a.pacientes);

      // Estatísticas por objetivo
      const objetivosCount = leads.reduce((acc, lead) => {
        if (lead.objetivo) {
          acc[lead.objetivo] = (acc[lead.objetivo] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const objetivosData = Object.entries(objetivosCount).map(([name, value]) => ({
        name,
        value,
        color: name === 'Perda de Peso' ? '#FF6B6B' :
               name === 'Ganho de Massa' ? '#4ECDC4' :
               name === 'Manutenção' ? '#45B7D1' : '#FFA07A'
      }));

      // Estatísticas mensais (últimos 6 meses)
      const now = new Date();
      const monthlyData = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthLeads = leads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate >= monthStart && leadDate <= monthEnd;
        });

        const monthConsultas = leads.filter(lead => {
          if (!lead.ultima_consulta) return false;
          const consultaDate = new Date(lead.ultima_consulta);
          return consultaDate >= monthStart && consultaDate <= monthEnd;
        });

        monthlyData.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          leads: monthLeads.length,
          consultas: monthConsultas.length
        });
      }

      return {
        totalLeads,
        leadsQualificados,
        consultasAgendadas,
        consultasRealizadas,
        estadosData,
        objetivosData,
        monthlyData,
        leads
      };
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            ...leadData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, leadData }: { id: string; leadData: Partial<Lead> }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...leadData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (leadId: string) => {
      console.log('Attempting to delete lead:', leadId);
      
      try {
        // Primeiro, deletar pacientes vinculados usando uma consulta SQL direta
        const { error: deletePacientesError } = await supabase.rpc('delete_lead_cascade', {
          lead_id: leadId
        });

        if (deletePacientesError) {
          console.error('Error in delete_lead_cascade:', deletePacientesError);
          
          // Fallback: tentar deletar manualmente se a função não existir
          console.log('Trying manual deletion as fallback...');
          
          // Deletar pacientes relacionados
          const { error: manualDeletePacientesError } = await supabase
            .from('pacientes')
            .delete()
            .eq('lead_id', leadId);

          if (manualDeletePacientesError) {
            console.error('Error deleting pacientes manually:', manualDeletePacientesError);
            throw new Error('Erro ao deletar pacientes vinculados');
          }

          // Deletar o lead
          const { error: manualDeleteLeadError } = await supabase
            .from('leads')
            .delete()
            .eq('id', leadId);

          if (manualDeleteLeadError) {
            console.error('Error deleting lead manually:', manualDeleteLeadError);
            throw new Error('Erro ao deletar lead');
          }
        }

        console.log('Lead and related data deleted successfully');
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
    },
  });
};
