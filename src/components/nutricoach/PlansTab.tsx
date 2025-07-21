
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
        <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="bg-emerald-500/20 p-2 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              Análise de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-white">
                    {patients.find(p => p.id === selectedPatient)?.nome}
                  </h4>
                  {getPatientResponses(selectedPatient).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300">
                        Score médio mensal: {Math.round(
                          getPatientResponses(selectedPatient)
                            .reduce((acc, r) => acc + r.score, 0) / 
                          getPatientResponses(selectedPatient).length * 100
                        )}%
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                          <div className="text-lg font-bold text-emerald-400">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'success').length}
                          </div>
                          <div className="text-xs text-emerald-300">Sucessos</div>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                          <div className="text-lg font-bold text-yellow-400">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'warning').length}
                          </div>
                          <div className="text-xs text-yellow-300">Atenção</div>
                        </div>
                        <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
                          <div className="text-lg font-bold text-red-400">
                            {getPatientResponses(selectedPatient).filter(r => r.status === 'alert').length}
                          </div>
                          <div className="text-xs text-red-300">Alerta</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      Nenhuma resposta ainda registrada
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-300">
                Selecione um paciente na lista ao lado para ver a análise
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              Observações do Nutricionista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Selecionar Paciente:</label>
              <select
                className="w-full p-3 border border-slate-600/50 rounded-xl bg-slate-800/50 text-white"
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
              <label className="text-sm font-medium text-slate-300">Observação Manual:</label>
              <Textarea
                placeholder="Digite suas observações e recomendações para o paciente..."
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                rows={4}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400"
              />
            </div>
            
            <Button 
              onClick={saveManualNote}
              disabled={!selectedPatient || !manualNote.trim()}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
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
