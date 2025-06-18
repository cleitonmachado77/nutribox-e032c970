
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PatientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  goals?: string[];
  preferences?: any;
  behavioral_data?: any;
  engagement_score?: number;
  last_interaction?: string;
  response_pattern?: any;
  progress_data?: any;
}

export interface PatientInsight {
  patient_id: string;
  interaction_frequency: number;
  response_rate: number;
  preferred_time: string;
  engagement_level: 'high' | 'medium' | 'low';
  behavioral_patterns: any;
  prediction_score: number;
  recommendations: string[];
}

export const usePatientData = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [insights, setInsights] = useState<PatientInsight[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatientData = async () => {
    if (!user) return;

    try {
      // Carregar dados dos pacientes dos leads convertidos
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'convertido');

      // Carregar conversas do WhatsApp
      const { data: conversationsData } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('user_id', user.id);

      // Carregar interações do coach
      const { data: interactionsData } = await supabase
        .from('whatsapp_coach_interactions' as any)
        .select('*')
        .order('created_at', { ascending: false });

      // Combinar dados para criar perfis completos
      const patientProfiles: PatientProfile[] = (leadsData || []).map(lead => {
        const conversation = conversationsData?.find(conv => conv.contact_phone === lead.telefone);
        const patientInteractions = interactionsData?.filter((interaction: any) => 
          interaction.patient_phone === lead.telefone
        ) || [];

        // Calcular score de engajamento
        const engagementScore = calculateEngagementScore(patientInteractions);

        return {
          id: lead.id,
          name: lead.nome,
          phone: lead.telefone,
          email: lead.email,
          weight: parseFloat(lead.peso) || undefined,
          height: parseFloat(lead.altura) || undefined,
          goals: lead.objetivo ? [lead.objetivo] : [],
          behavioral_data: extractBehavioralData(patientInteractions),
          engagement_score: engagementScore,
          last_interaction: conversation?.last_message_time,
          response_pattern: analyzeResponsePattern(patientInteractions),
          progress_data: extractProgressData(patientInteractions)
        };
      });

      // Gerar insights baseados nos dados
      const patientInsights: PatientInsight[] = patientProfiles.map(patient => 
        generatePatientInsights(patient, interactionsData || [])
      );

      setPatients(patientProfiles);
      setInsights(patientInsights);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEngagementScore = (interactions: any[]): number => {
    if (!interactions.length) return 0;

    const responsiveInteractions = interactions.filter(i => 
      i.action_type === 'analyze_responses'
    ).length;

    const totalInteractions = interactions.length;
    const recentInteractions = interactions.filter(i => {
      const daysDiff = (Date.now() - new Date(i.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;

    // Score baseado em responsividade e atividade recente
    const responseRate = responsiveInteractions / Math.max(totalInteractions, 1);
    const activityScore = Math.min(recentInteractions / 7, 1);

    return Math.round((responseRate * 0.6 + activityScore * 0.4) * 100);
  };

  const extractBehavioralData = (interactions: any[]) => {
    const behaviors = {
      consistent_responses: 0,
      positive_feedback: 0,
      goal_oriented: 0,
      time_preferences: {} as any
    };

    interactions.forEach(interaction => {
      if (interaction.patient_data) {
        // Analisar dados comportamentais das respostas
        const data = interaction.patient_data;
        if (data.consistencia_plano === 'sim') behaviors.consistent_responses++;
        if (data.energia_fisica >= 2) behaviors.positive_feedback++;
        if (data.confianca_jornada >= 2) behaviors.goal_oriented++;

        // Analisar preferências de horário
        const hour = new Date(interaction.created_at).getHours();
        const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
        behaviors.time_preferences[timeSlot] = (behaviors.time_preferences[timeSlot] || 0) + 1;
      }
    });

    return behaviors;
  };

  const analyzeResponsePattern = (interactions: any[]) => {
    const pattern = {
      average_response_time: 0,
      preferred_interaction_type: '',
      consistency_score: 0
    };

    // Analisar padrões de resposta
    const responseTypes = interactions.reduce((acc: any, interaction) => {
      acc[interaction.action_type] = (acc[interaction.action_type] || 0) + 1;
      return acc;
    }, {});

    pattern.preferred_interaction_type = Object.keys(responseTypes).reduce((a, b) => 
      responseTypes[a] > responseTypes[b] ? a : b, ''
    );

    pattern.consistency_score = interactions.length > 0 ? 
      Math.min(interactions.length / 30, 1) * 100 : 0;

    return pattern;
  };

  const extractProgressData = (interactions: any[]) => {
    return {
      total_interactions: interactions.length,
      questionnaires_completed: interactions.filter(i => i.action_type === 'analyze_responses').length,
      motivational_messages_received: interactions.filter(i => i.action_type === 'generate_motivational').length,
      reminders_received: interactions.filter(i => i.action_type === 'generate_reminder').length,
      improvement_trend: calculateImprovementTrend(interactions)
    };
  };

  const calculateImprovementTrend = (interactions: any[]): 'improving' | 'stable' | 'declining' => {
    if (interactions.length < 3) return 'stable';

    const recentInteractions = interactions.slice(0, Math.floor(interactions.length / 2));
    const olderInteractions = interactions.slice(Math.floor(interactions.length / 2));

    const recentEngagement = recentInteractions.filter(i => i.action_type === 'analyze_responses').length;
    const olderEngagement = olderInteractions.filter(i => i.action_type === 'analyze_responses').length;

    if (recentEngagement > olderEngagement) return 'improving';
    if (recentEngagement < olderEngagement) return 'declining';
    return 'stable';
  };

  const generatePatientInsights = (patient: PatientProfile, allInteractions: any[]): PatientInsight => {
    const patientInteractions = allInteractions.filter((i: any) => 
      i.patient_phone === patient.phone
    );

    const interactionFrequency = patientInteractions.length;
    const responseRate = patient.engagement_score || 0;
    
    // Determinar horário preferido
    const timePrefs = patient.behavioral_data?.time_preferences || {};
    const preferredTime = Object.keys(timePrefs).reduce((a, b) => 
      timePrefs[a] > timePrefs[b] ? a : b, 'morning'
    );

    // Determinar nível de engajamento
    let engagementLevel: 'high' | 'medium' | 'low' = 'low';
    if (responseRate >= 70) engagementLevel = 'high';
    else if (responseRate >= 40) engagementLevel = 'medium';

    // Gerar recomendações personalizadas
    const recommendations = generateRecommendations(patient, engagementLevel);

    return {
      patient_id: patient.id,
      interaction_frequency: interactionFrequency,
      response_rate: responseRate,
      preferred_time: preferredTime,
      engagement_level: engagementLevel,
      behavioral_patterns: patient.behavioral_data,
      prediction_score: Math.min(responseRate + interactionFrequency * 2, 100),
      recommendations
    };
  };

  const generateRecommendations = (patient: PatientProfile, engagementLevel: string): string[] => {
    const recommendations: string[] = [];

    if (engagementLevel === 'low') {
      recommendations.push('Enviar mensagens motivacionais mais frequentes');
      recommendations.push('Usar linguagem mais casual e amigável');
      recommendations.push('Reduzir frequência de questionários');
    } else if (engagementLevel === 'medium') {
      recommendations.push('Manter consistência nas interações');
      recommendations.push('Introduzir desafios pequenos');
      recommendations.push('Celebrar progresso alcançado');
    } else {
      recommendations.push('Oferecer conteúdo avançado');
      recommendations.push('Enviar questionários detalhados');
      recommendations.push('Propor metas mais desafiadoras');
    }

    // Recomendações baseadas em dados comportamentais
    if (patient.behavioral_data?.consistent_responses > 5) {
      recommendations.push('Reconhecer consistência no plano');
    }

    if (patient.progress_data?.improvement_trend === 'declining') {
      recommendations.push('Investigar barreiras e dificuldades');
      recommendations.push('Oferecer suporte adicional');
    }

    return recommendations;
  };

  useEffect(() => {
    loadPatientData();
  }, [user]);

  return {
    patients,
    insights,
    loading,
    reloadData: loadPatientData
  };
};
