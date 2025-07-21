
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, FileText } from 'lucide-react';
import { PatientData, QuestionnaireResponse } from '@/hooks/useNutriCoachOperations';

interface PlansTabProps {
  patients: PatientData[];
  responses: QuestionnaireResponse[];
  selectedPatient: string;
  setSelectedPatient: (patientId: string) => void;
  manualNote: string;
  setManualNote: (note: string) => void;
  saveManualNote: () => Promise<void>;
}

export function PlansTab({ 
  patients, 
  responses, 
  selectedPatient, 
  setSelectedPatient, 
  manualNote, 
  setManualNote, 
  saveManualNote 
}: PlansTabProps) {
  const getPatientResponses = (patientId: string) => {
    return responses.filter(r => r.patient_id.includes(patientId));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Análise de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {patients.find(p => p.id === selectedPatient)?.nome}
                  </h4>
                  {getPatientResponses(selectedPatient).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm">
                        Score médio mensal: {Math.round(
                          getPatientResponses(selectedPatient)
                            .reduce((acc, r) => acc + r.score, 0) / 
                          getPatientResponses(selectedPatient).length * 100
                        )}%
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'success').length}
                          </div>
                          <div className="text-xs text-green-600">Sucessos</div>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded">
                          <div className="text-lg font-bold text-yellow-600">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'warning').length}
                          </div>
                          <div className="text-xs text-yellow-600">Atenção</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <div className="text-lg font-bold text-red-600">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'alert').length}
                          </div>
                          <div className="text-xs text-red-600">Alerta</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma resposta ainda registrada
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Selecione um paciente na lista ao lado para ver a análise
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Observações do Nutricionista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selecionar Paciente:</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Selecione um paciente...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Observação Manual:</label>
              <Textarea
                placeholder="Digite suas observações e recomendações para o paciente..."
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={saveManualNote}
              disabled={!selectedPatient || !manualNote.trim()}
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Salvar Observação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
