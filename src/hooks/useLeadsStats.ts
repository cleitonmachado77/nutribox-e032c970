
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeadsStats } from '@/types/lead';

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
      } as LeadsStats;
    },
  });
};
