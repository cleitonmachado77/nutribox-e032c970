
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
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutricoach_patients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const patientsData: PatientData[] = (data || []).map(patient => ({
        id: patient.id,
        nome: patient.name,
        telefone: patient.telephone,
        planStatus: patient.plan_active ? 'active' : 'inactive',
        isSelected: false
      }));

      setPatients(patientsData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pacientes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const loadResponses = useCallback(async () => {
    if (!user) return;

    try {
      // Load daily responses
      const { data: dailyData, error: dailyError } = await supabase
        .from('nutricoach_respostas_diarias')
        .select(`
          *,
          nutricoach_patients!inner(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (dailyError) throw dailyError;

      // Load weekly responses
      const { data: weeklyData, error: weeklyError } = await supabase
        .from('nutricoach_respostas_semanais')
        .select(`
          *,
          nutricoach_patients!inner(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (weeklyError) throw weeklyError;

      const dailyResponses: QuestionnaireResponse[] = (dailyData || []).map(response => {
        const scores = [
          response.energia || 0,
          response.atividade || 0,
          response.sono || 0,
          response.consistencia || 0,
          response.refeicoes || 0,
          response.horario_refeicao || 0,
          response.vegetais_frutas || 0,
          response.liquido || 0
        ];
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length / 3; // Normalize to 0-1
        
        return {
          id: response.id,
          patient_id: response.patient_id,
          patient_name: (response as any).nutricoach_patients.name,
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
          patient_name: (response as any).nutricoach_patients.name,
          type: 'weekly' as const,
          responses: scores.map(s => s.toString()),
          score: avgScore,
          status: avgScore > 0.7 ? 'success' : avgScore > 0.4 ? 'warning' : 'alert',
          created_at: response.created_at
        };
      });

      setResponses([...dailyResponses, ...weeklyResponses]);
    } catch (error: any) {
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
      const { data, error } = await supabase
        .from('nutricoach_programmed_shipping')
        .select(`
          *,
          nutricoach_patients!inner(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const scheduledData: ScheduledSending[] = (data || []).map(schedule => ({
        id: schedule.id,
        patient_id: schedule.patient_id,
        patient_name: (schedule as any).nutricoach_patients.name,
        shipping_diario: schedule.shipping_diario,
        shipping_semanal: schedule.shipping_semanal,
        active: schedule.active
      }));

      setScheduledSendings(scheduledData);
    } catch (error: any) {
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
