
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  objetivo?: string;
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
}

export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
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

      return {
        totalLeads,
        leadsQualificados,
        consultasAgendadas,
        consultasRealizadas,
        estadosData,
        objetivosData,
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
      // Invalidar as queries para refrescar os dados
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] });
    },
  });
};
