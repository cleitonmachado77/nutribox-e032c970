
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useNutriCoachOperations } from '@/hooks/useNutriCoachOperations';
import { StatsCards } from '@/components/nutricoach/StatsCards';
import { PatientsTab } from '@/components/nutricoach/PatientsTab';
import { QuestionnairesTab } from '@/components/nutricoach/QuestionnairesTab';
import { ResponsesTab } from '@/components/nutricoach/ResponsesTab';
import { PlansTab } from '@/components/nutricoach/PlansTab';
import { PatientSelectionCard } from '@/components/nutricoach/PatientSelectionCard';

export default function NutriCoach() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [manualNote, setManualNote] = useState('');

  const {
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
  } = useNutriCoachOperations(user);

  useEffect(() => {
    if (user) {
      console.log('Carregando dados do NutriCoach para usuário:', user.id);
      loadPatients();
      loadResponses();
      loadScheduledSendings();
    }
  }, [user]);

  const handleSaveManualNote = async () => {
    await saveManualNote(selectedPatient, manualNote);
    setManualNote('');
  };

  const handleEnvioSuccess = () => {
    loadScheduledSendings();
  };

  // Converter dados dos pacientes para o formato esperado pelo PatientSelectionCard
  const patientsList = patients.map(p => ({
    id: p.id,
    name: p.nome,
    status: p.planStatus
  }));

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <Header 
        title="NutriCoach IA" 
        description="Acompanhamento nutricional inteligente de pacientes"
      />

      <StatsCards patients={patients} responses={responses} />

      {/* Nova seção de gerenciamento de acompanhamento */}
      <PatientSelectionCard 
        patients={patientsList}
        onSuccess={handleEnvioSuccess}
      />

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="questionnaires">Questionários</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientsTab
            patients={patients}
            filter={filter}
            setFilter={setFilter}
            togglePatientSelection={togglePatientSelection}
          />
        </TabsContent>

        <TabsContent value="questionnaires">
          <QuestionnairesTab
            patients={patients}
            loading={loading}
            sendQuestionnaire={sendQuestionnaire}
          />
        </TabsContent>

        <TabsContent value="responses">
          <ResponsesTab responses={responses} />
        </TabsContent>

        <TabsContent value="plans">
          <PlansTab
            patients={patients}
            responses={responses}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            manualNote={manualNote}
            setManualNote={setManualNote}
            saveManualNote={handleSaveManualNote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
