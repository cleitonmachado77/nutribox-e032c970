
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Filter } from 'lucide-react';
import { PatientData } from '@/hooks/useNutriCoachOperations';
import { PatientDetailPanel } from './PatientDetailPanel';
import { useNutriCoachOperations } from '@/hooks/useNutriCoachOperations';
import { useCoachQuestions } from '@/hooks/useCoachQuestions';
import { useCoachResponses } from '@/hooks/useCoachResponses';

interface PatientsTabProps {
  patients: PatientData[];
  filter: string;
  setFilter: (filter: string) => void;
  togglePatientSelection: (patientId: string) => void;
  questions: import('@/hooks/useCoachQuestions').CoachQuestion[];
}

export function PatientsTab({ patients, filter, setFilter, togglePatientSelection, questions }: PatientsTabProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Hooks para dados reais
  const { responses } = useNutriCoachOperations(null as any); // O user já está no contexto global
  const { questions: fetchedQuestions } = useCoachQuestions();

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(filter.toLowerCase()) ||
    patient.telefone.includes(filter)
  );

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;
  const { responses: coachResponses } = useCoachResponses(selectedPatient ? selectedPatient.telefone : undefined);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Coluna esquerda: lista de pacientes */}
      <div className="md:w-1/3 w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pacientes em acompanhamento
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <Input
                placeholder="Filtrar por nome ou telefone..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`cursor-pointer transition-colors px-2 py-2 ${
                    selectedPatientId === patient.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedPatientId(patient.id)}
                >
                  <CardContent className="p-2 flex items-center gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{patient.nome}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={patient.planStatus === 'active' ? 'default' : 'secondary'}>
                          {patient.planStatus === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Coluna direita: painel detalhado do paciente */}
      <div className="md:w-2/3 w-full">
        {selectedPatient ? (
          questions.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">Carregando questionários...</div>
          ) : (
            <PatientDetailPanel patient={selectedPatient} responses={coachResponses} questions={questions} />
          )
        ) : (
          <div className="text-muted-foreground text-center mt-10">Selecione um paciente para ver os detalhes.</div>
        )}
      </div>
    </div>
  );
}
