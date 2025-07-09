
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PacienteData {
  id: string;
  nome: string;
  telefone: string;
  objetivo: string;
  peso: string;
  altura: string;
  imc: string;
  status: string;
  foto_perfil?: string;
  data_primeira_consulta?: string;
}

export const usePacientesList = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<PacienteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPacientes();
    }
  }, [user]);

  const loadPacientes = async () => {
    if (!user) return;

    try {
      // Buscar pacientes com seus dados dos leads
      const { data: pacientesData } = await supabase
        .from('pacientes')
        .select(`
          id,
          data_primeira_consulta,
          status_tratamento,
          lead:leads!inner(
            id,
            nome,
            telefone,
            objetivo,
            peso,
            altura,
            imc,
            status,
            foto_perfil
          )
        `)
        .eq('user_id', user.id);

      if (pacientesData) {
        const formattedPacientes = pacientesData.map((p: any) => ({
          id: p.id,
          nome: p.lead.nome,
          telefone: p.lead.telefone,
          objetivo: p.lead.objetivo,
          peso: p.lead.peso,
          altura: p.lead.altura,
          imc: p.lead.imc,
          status: p.status_tratamento || p.lead.status,
          foto_perfil: p.lead.foto_perfil,
          data_primeira_consulta: p.data_primeira_consulta
        }));
        setPacientes(formattedPacientes);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  return { pacientes, loading, refreshPacientes: loadPacientes };
};
