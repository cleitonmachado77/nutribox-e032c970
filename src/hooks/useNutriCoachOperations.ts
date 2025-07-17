
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export interface PatientData {
  id: string;
  nome: string;
  telefone: string;
  planStatus: 'active' | 'inactive';
  isSelected: boolean;
}

export interface QuestionnaireResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  type: 'daily' | 'weekly';
  responses: string[];
  score: number;
  status: 'success' | 'warning' | 'alert';
  created_at: string;
}

export interface ScheduledSending {
  id: string;
  patient_id: string;
  patient_name: string;
  shipping_diario: boolean;
  shipping_semanal: boolean;
  active: boolean;
}

export type QuestionnaireType = 'daily' | 'weekly';

export const useNutriCoachOperations = (user: User | null) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [scheduledSendings, setScheduledSendings] = useState<ScheduledSending[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadPatients = useCallback(async () => {
    if (!user) {
      console.log('Usuário não autenticado, cancelando carregamento de pacientes');
      return;
    }

    try {
      setLoading(true);
      console.log('=== INICIANDO CARREGAMENTO DE PACIENTES ===');
      console.log('User ID:', user.id);

      // Buscar pacientes com seus dados dos leads
      const { data: pacientesData, error: pacientesError } = await supabase
        .from('pacientes')
        .select(`
          id,
          data_primeira_consulta,
          status_tratamento,
          lead:leads!inner(
            id,
            nome,
            telefone,
            email
          )
        `)
        .eq('user_id', user.id);

      console.log('Resultado pacientes + leads:', { data: pacientesData, error: pacientesError });

      if (pacientesError) {
        console.error('Erro ao buscar pacientes:', pacientesError);
        throw pacientesError;
      }

      if (pacientesData && pacientesData.length > 0) {
        const formattedPatients: PatientData[] = pacientesData.map((p: any) => ({
          id: p.id,
          nome: p.lead.nome,
          telefone: p.lead.telefone,
          planStatus: p.status_tratamento === 'ativo' ? 'active' : 'inactive',
          isSelected: false
        }));
        
        console.log('✅ Pacientes carregados:', formattedPatients);
        setPatients(formattedPatients);
        return;
      }

      // Se nenhum paciente encontrado
      console.log('⚠️ Nenhum paciente encontrado');
      setPatients([]);

    } catch (error: any) {
      console.error('❌ Erro ao carregar pacientes:', error);
      toast({
        title: "Erro ao carregar pacientes",
        description: error.message,
        variant: "destructive"
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const loadResponses = useCallback(async () => {
    if (!user) return;

    try {
      console.log('=== CARREGANDO RESPOSTAS ===');
      
      // Load daily responses with nested JOINs
      const { data: dailyData, error: dailyError } = await supabase
        .from('nutricoach_respostas_diarias')
        .select(`
          *,
          pacientes!inner(id, lead_id, leads!inner(nome))
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Resultado respostas diárias:', { data: dailyData, error: dailyError });

      if (dailyError) {
        console.error('Erro ao buscar respostas diárias:', dailyError);
        throw dailyError;
      }

      // Load weekly responses with nested JOINs
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('nutricoach_respostas_semanais')
        .select(`
          *,
          pacientes!inner(id, lead_id, leads!inner(nome))
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('Resultado respostas semanais:', { data: weeklyData, error: weeklyError });

      if (weeklyError) {
        console.error('Erro ao buscar respostas semanais:', weeklyError);
        throw weeklyError;
      }

      const dailyResponses: QuestionnaireResponse[] = (dailyData || []).map(response => {
        // Usar apenas as colunas que existem na tabela: energia, atividade, sono
        const scores = [
          response.energia || 0,
          response.atividade || 0,
          response.sono || 0
        ];
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length / 3; // Normalize to 0-1
        
        return {
          id: response.id,
          patient_id: response.patient_id,
          patient_name: (response as any).pacientes?.leads?.nome || 'Nome não encontrado',
          type: 'daily' as const,
          responses: scores.map(s => s.toString()),
          score: avgScore,
          status: avgScore > 0.7 ? 'success' : avgScore > 0.4 ? 'warning' : 'alert',
          created_at: response.created_at
        };
      });

      const weeklyResponses: QuestionnaireResponse[] = (weeklyData || []).map(response => {
        const scores = [response.confianca || 0, response.satisfacao || 0];
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length / 3; // Normalize to 0-1
        
        return {
          id: response.id,
          patient_id: response.patient_id,
          patient_name: (response as any).pacientes?.leads?.nome || 'Nome não encontrado',
          type: 'weekly' as const,
          responses: scores.map(s => s.toString()),
          score: avgScore,
          status: avgScore > 0.7 ? 'success' : avgScore > 0.4 ? 'warning' : 'alert',
          created_at: response.created_at
        };
      });

      setResponses([...dailyResponses, ...weeklyResponses]);
      console.log('✅ Respostas carregadas:', [...dailyResponses, ...weeklyResponses]);
    } catch (error: any) {
      console.error('❌ Erro ao carregar respostas:', error);
      toast({
        title: "Erro ao carregar respostas",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const loadScheduledSendings = useCallback(async () => {
    if (!user) return;

    try {
      console.log('=== CARREGANDO ENVIOS PROGRAMADOS ===');
      
      // Buscar da tabela envios_programados com JOIN para pacientes
      const { data, error } = await supabase
        .from('envios_programados')
        .select(`
          *,
          pacientes!inner(
            id,
            leads!inner(nome)
          )
        `)
        .eq('ativo', true);

      console.log('Resultado envios_programados:', { data, error });

      if (error) {
        console.error('Erro ao buscar envios programados:', error);
        return;
      }

      const scheduledData: ScheduledSending[] = (data || []).map(schedule => ({
        id: schedule.id,
        patient_id: schedule.paciente_id,
        patient_name: (schedule as any).pacientes?.leads?.nome || 'Paciente não encontrado',
        shipping_diario: schedule.envio_diario || false,
        shipping_semanal: schedule.envio_semanal || false,
        active: schedule.ativo || false
      }));

      console.log('✅ Envios programados carregados:', scheduledData);
      setScheduledSendings(scheduledData);
    } catch (error: any) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [user, toast]);

  const sendQuestionnaire = useCallback(async (type: QuestionnaireType) => {
    if (!user) return;

    const selectedPatients = patients.filter(p => p.isSelected);
    if (selectedPatients.length === 0) {
      toast({
        title: "Nenhum paciente selecionado",
        description: "Selecione pelo menos um paciente para enviar o questionário",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Here you would integrate with your WhatsApp sending logic
      // For now, we'll simulate the sending
      for (const patient of selectedPatients) {
        // Call your WhatsApp API or edge function here
        console.log(`Sending ${type} questionnaire to ${patient.nome} (${patient.telefone})`);
      }

      toast({
        title: "Questionários enviados",
        description: `Questionário ${type === 'daily' ? 'diário' : 'semanal'} enviado para ${selectedPatients.length} paciente(s)`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar questionários",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, patients, toast]);

  const togglePatientSelection = useCallback((patientId: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, isSelected: !patient.isSelected }
        : patient
    ));
  }, []);

  const saveManualNote = useCallback(async (patientId: string, note: string) => {
    if (!user || !patientId || !note.trim()) return;

    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

      const { error } = await supabase
        .from('nutricoach_planos_personalizados')
        .upsert({
          user_id: user.id,
          patient_id: patientId,
          mes: currentMonth,
          nota_nutricionista: note.trim()
        }, {
          onConflict: 'user_id,patient_id,mes'
        });

      if (error) throw error;

      toast({
        title: "Observação salva",
        description: "A observação foi salva com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar observação",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  return {
    patients,
    responses,
    scheduledSendings,
    loading,
    loadPatients,
    loadResponses,
    loadScheduledSendings,
    sendQuestionnaire,
    saveManualNote,
    togglePatientSelection
  };
};
