
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PatientData, QuestionnaireResponse, ScheduledSending, QuestionnaireType } from '@/types/nutricoach';

export const useNutriCoachOperations = (user: any) => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [scheduledSendings, setScheduledSendings] = useState<ScheduledSending[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPatients = async () => {
    try {
      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, nome, telefone, status')
        .eq('user_id', user?.id);

      if (leadsData) {
        const patientsData = [];
        
        for (const lead of leadsData) {
          const status = lead.status === 'convertido' ? 'active' : 'inactive';
          const patient = {
            id: lead.id,
            nome: lead.nome,
            telefone: lead.telefone,
            planStatus: status,
            isSelected: false
          };
          patientsData.push(patient);
        }
        
        setPatients(patientsData);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar pacientes",
        variant: "destructive"
      });
    }
  };

  const loadResponses = async () => {
    try {
      const { data } = await supabase
        .from('coach_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) {
        const formattedResponses = [];
        
        for (const response of data) {
          const responseType = response.question_category === 'bem_estar' ? 'weekly' : 'daily';
          const score = response.response_score || 0;
          const responseStatus = score > 0.7 ? 'success' : score > 0.4 ? 'warning' : 'alert';
          
          const formattedResponse = {
            id: response.id,
            patient_id: response.patient_phone,
            patient_name: response.patient_name,
            type: responseType,
            responses: [response.response_text],
            score: score,
            feedback: 'Feedback gerado automaticamente baseado nas respostas',
            status: responseStatus,
            created_at: response.created_at
          };
          
          formattedResponses.push(formattedResponse);
        }
        
        setResponses(formattedResponses);
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const loadScheduledSendings = async () => {
    try {
      const { data } = await supabase
        .from('whatsapp_coach_interactions')
        .select('*')
        .eq('user_id', user?.id);

      if (data) {
        const scheduled = [];
        
        for (const interaction of data) {
          const scheduledItem = {
            id: interaction.id,
            patient_id: interaction.patient_phone,
            type: 'daily' as const,
            is_active: true,
            last_sent: interaction.created_at
          };
          scheduled.push(scheduledItem);
        }
        
        setScheduledSendings(scheduled);
      }
    } catch (error) {
      console.error('Error loading scheduled sendings:', error);
    }
  };

  const sendQuestionnaire = async (type: QuestionnaireType) => {
    const selectedPatients = patients.filter(p => p.isSelected);
    
    if (selectedPatients.length === 0) {
      toast({
        title: "Nenhum paciente selecionado",
        description: "Selecione pelo menos um paciente para enviar o questionário",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      for (const patient of selectedPatients) {
        await supabase.functions.invoke('nutricoach-questionnaire', {
          body: {
            action: 'send_daily_questionnaire',
            patientName: patient.nome,
            patientPhone: patient.telefone,
            userId: user?.id
          }
        });

        await supabase
          .from('whatsapp_coach_interactions')
          .insert({
            patient_phone: patient.telefone,
            patient_name: patient.nome,
            action_type: `send_${type}_questionnaire`,
            generated_message: type === 'daily' ? 'Daily questionnaire' : 'Weekly questionnaire',
            user_id: user?.id,
            patient_data: { questionnaire_type: type }
          });
      }

      toast({
        title: "Questionários enviados",
        description: `${type === 'daily' ? 'Questionário diário' : 'Questionário semanal'} enviado para ${selectedPatients.length} paciente(s)`,
      });

      loadScheduledSendings();
    } catch (error) {
      console.error('Error sending questionnaire:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar questionários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveManualNote = async (selectedPatient: string, manualNote: string) => {
    if (!selectedPatient || !manualNote.trim()) return;

    try {
      await supabase
        .from('whatsapp_coach_interactions')
        .insert({
          patient_phone: selectedPatient,
          patient_name: patients.find(p => p.id === selectedPatient)?.nome || '',
          action_type: 'manual_note',
          generated_message: manualNote,
          user_id: user?.id,
          patient_data: { type: 'nutritionist_observation' }
        });

      toast({
        title: "Observação salva",
        description: "Observação manual do nutricionista foi registrada",
      });
    } catch (error) {
      console.error('Error saving manual note:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar observação",
        variant: "destructive"
      });
    }
  };

  const togglePatientSelection = (patientId: string) => {
    setPatients(prev => prev.map(patient =>
      patient.id === patientId
        ? { ...patient, isSelected: !patient.isSelected }
        : patient
    ));
  };

  return {
    patients,
    responses,
    scheduledSendings,
    loading,
    setPatients,
    loadPatients,
    loadResponses,
    loadScheduledSendings,
    sendQuestionnaire,
    saveManualNote,
    togglePatientSelection
  };
};
