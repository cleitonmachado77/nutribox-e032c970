
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export interface NutriCoachPatient {
  id: string;
  user_id: string;
  name: string;
  telephone: string;
  plan_active: boolean;
  created_at: string;
}

export interface DailyResponse {
  id: string;
  patient_id: string;
  data_resposta: string;
  energia?: number;
  atividade?: number;
  sono?: number;
  consistencia?: number;
  refeicoes?: number;
  horario_refeicao?: number;
  vegetais_frutas?: number;
  liquido?: number;
  feedback_gpt?: string;
}

export interface WeeklyResponse {
  id: string;
  patient_id: string;
  data_resposta: string;
  confianca?: number;
  satisfacao?: number;
  feedback_gpt?: string;
}

export interface PersonalizedPlan {
  id: string;
  patient_id: string;
  mes: string;
  score_medio?: number;
  recomendacao_gpt?: string;
  nota_nutricionista?: string;
}

export const useNutriCoachNewTables = (user: User | null) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Patient operations
  const createPatient = useCallback(async (name: string, telephone: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutricoach_patients')
        .insert({
          user_id: user.id,
          name,
          telephone,
          plan_active: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Paciente criado",
        description: `${name} foi adicionado com sucesso`
      });

      return data as NutriCoachPatient;
    } catch (error: any) {
      toast({
        title: "Erro ao criar paciente",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updatePatientPlanStatus = useCallback(async (patientId: string, planActive: boolean) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('nutricoach_patients')
        .update({ plan_active: planActive })
        .eq('id', patientId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Plano ${planActive ? 'ativado' : 'desativado'} com sucesso`
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Programmed shipping operations
  const updateShippingSettings = useCallback(async (
    patientId: string, 
    shippingDiario: boolean, 
    shippingSemanal: boolean
  ) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('nutricoach_programmed_shipping')
        .upsert({
          user_id: user.id,
          patient_id: patientId,
          shipping_diario: shippingDiario,
          shipping_semanal: shippingSemanal,
          active: true
        }, {
          onConflict: 'user_id,patient_id'
        });

      if (error) throw error;

      toast({
        title: "Configurações atualizadas",
        description: "Configurações de envio foram salvas"
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Response operations
  const saveDailyResponse = useCallback(async (response: Omit<DailyResponse, 'id'>) => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutricoach_respostas_diarias')
        .insert({
          user_id: user.id,
          ...response
        })
        .select()
        .single();

      if (error) throw error;

      return data as DailyResponse;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar resposta",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const saveWeeklyResponse = useCallback(async (response: Omit<WeeklyResponse, 'id'>) => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutricoach_respostas_semanais')
        .insert({
          user_id: user.id,
          ...response
        })
        .select()
        .single();

      if (error) throw error;

      return data as WeeklyResponse;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar resposta",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Plan operations
  const savePersonalizedPlan = useCallback(async (plan: Omit<PersonalizedPlan, 'id'>) => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutricoach_planos_personalizados')
        .upsert({
          user_id: user.id,
          ...plan
        }, {
          onConflict: 'user_id,patient_id,mes'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plano salvo",
        description: "Plano personalizado foi salvo com sucesso"
      });

      return data as PersonalizedPlan;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar plano",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Data fetching operations
  const getPatientsByUser = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('nutricoach_patients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NutriCoachPatient[];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar pacientes",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  }, [user, toast]);

  const getDailyResponsesByPatient = useCallback(async (patientId: string, limit = 30) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('nutricoach_respostas_diarias')
        .select('*')
        .eq('user_id', user.id)
        .eq('patient_id', patientId)
        .order('data_resposta', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as DailyResponse[];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar respostas diárias",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  }, [user, toast]);

  const getWeeklyResponsesByPatient = useCallback(async (patientId: string, limit = 12) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('nutricoach_respostas_semanais')
        .select('*')
        .eq('user_id', user.id)
        .eq('patient_id', patientId)
        .order('data_resposta', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as WeeklyResponse[];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar respostas semanais",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  }, [user, toast]);

  const getPersonalizedPlansByPatient = useCallback(async (patientId: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('nutricoach_planos_personalizados')
        .select('*')
        .eq('user_id', user.id)
        .eq('patient_id', patientId)
        .order('mes', { ascending: false });

      if (error) throw error;
      return data as PersonalizedPlan[];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar planos",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  }, [user, toast]);

  return {
    loading,
    createPatient,
    updatePatientPlanStatus,
    updateShippingSettings,
    saveDailyResponse,
    saveWeeklyResponse,
    savePersonalizedPlan,
    getPatientsByUser,
    getDailyResponsesByPatient,
    getWeeklyResponsesByPatient,
    getPersonalizedPlansByPatient
  };
};
