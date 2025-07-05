
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/Header';
import { 
  Users, 
  Send, 
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Target,
  Filter,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Simplified type definitions to avoid deep instantiation
type PlanStatus = 'active' | 'inactive';
type QuestionnaireType = 'daily' | 'weekly';
type ResponseStatus = 'alert' | 'warning' | 'success';

interface PatientData {
  id: string;
  nome: string;
  telefone: string;
  planStatus: PlanStatus;
  lastDailyMessage?: string;
  lastWeeklyMessage?: string;
  isSelected: boolean;
}

interface QuestionnaireResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  type: QuestionnaireType;
  responses: string[];
  score: number;
  feedback: string;
  status: ResponseStatus;
  created_at: string;
}

interface ScheduledSending {
  id: string;
  patient_id: string;
  type: QuestionnaireType;
  is_active: boolean;
  last_sent?: string;
}

export default function NutriCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [scheduledSendings, setScheduledSendings] = useState<ScheduledSending[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualNote, setManualNote] = useState('');

  // Fixed questionnaire content
  const DAILY_QUESTIONNAIRE = `🌟 Olá! Como foi seu dia nutricional hoje?

1. Como você avalia sua alimentação hoje?
❌ Não segui o plano
⚠️ Segui parcialmente
✅ Segui completamente

2. Como está se sentindo em relação aos seus objetivos?
❌ Desmotivado(a)
⚠️ Neutro
✅ Motivado(a)

3. Consumiu a quantidade de água recomendada?
❌ Menos que o necessário
⚠️ Quase o suficiente
✅ Quantidade ideal

Responda com os números e suas escolhas. Ex: "1-✅, 2-✅, 3-⚠️"`;

  const WEEKLY_QUESTIONNAIRE = `📊 Avaliação Semanal - Como foi sua semana?

1. No geral, como avalia sua semana nutricional?
❌ Muito difícil, não consegui seguir
⚠️ Alguns dias bons, outros difíceis
✅ Consegui manter o foco na maioria dos dias

2. Seu nível de energia durante a semana:
❌ Muito baixo
⚠️ Variável
✅ Consistentemente bom

3. Como está sua motivação para continuar?
❌ Preciso de mais apoio
⚠️ Algumas dúvidas
✅ Confiante e motivado(a)

4. Algum desafio específico esta semana?
(Responda livremente)

Responda com os números e suas escolhas + sua resposta da pergunta 4.`;

  useEffect(() => {
    if (user) {
      loadPatients();
      loadResponses();
      loadScheduledSendings();
    }
  }, [user]);

  const loadPatients = async () => {
    try {
      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, nome, telefone, status')
        .eq('user_id', user?.id);

      if (leadsData) {
        const patientsData: PatientData[] = [];
        
        for (const lead of leadsData) {
          const status: PlanStatus = lead.status === 'convertido' ? 'active' : 'inactive';
          const patient: PatientData = {
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
        const formattedResponses: QuestionnaireResponse[] = [];
        
        for (const response of data) {
          const responseType: QuestionnaireType = response.question_category === 'bem_estar' ? 'weekly' : 'daily';
          const score = response.response_score || 0;
          const responseStatus: ResponseStatus = score > 0.7 ? 'success' : score > 0.4 ? 'warning' : 'alert';
          
          const formattedResponse: QuestionnaireResponse = {
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
        const scheduled: ScheduledSending[] = [];
        
        for (const interaction of data) {
          const scheduledItem: ScheduledSending = {
            id: interaction.id,
            patient_id: interaction.patient_phone,
            type: 'daily',
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

  const togglePatientSelection = (patientId: string) => {
    setPatients(prev => prev.map(patient =>
      patient.id === patientId
        ? { ...patient, isSelected: !patient.isSelected }
        : patient
    ));
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
      const message = type === 'daily' ? DAILY_QUESTIONNAIRE : WEEKLY_QUESTIONNAIRE;
      
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
            generated_message: message,
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

  const saveManualNote = async () => {
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

      setManualNote('');
    } catch (error) {
      console.error('Error saving manual note:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar observação",
        variant: "destructive"
      });
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(filter.toLowerCase()) ||
    patient.telefone.includes(filter)
  );

  const getPatientResponses = (patientId: string) => {
    return responses.filter(r => r.patient_id.includes(patientId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach IA" 
        description="Acompanhamento nutricional inteligente de pacientes"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pacientes</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Planos Ativos</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.planStatus === 'active').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Respostas Hoje</p>
                <p className="text-2xl font-bold">
                  {responses.filter(r => {
                    const today = new Date().toDateString();
                    const responseDate = new Date(r.created_at).toDateString();
                    return today === responseDate;
                  }).length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selecionados</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.isSelected).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="questionnaires">Questionários</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seleção de Pacientes
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className={`cursor-pointer transition-colors ${
                    patient.isSelected ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={patient.isSelected}
                          onCheckedChange={() => togglePatientSelection(patient.id)}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{patient.nome}</h4>
                          <p className="text-sm text-muted-foreground">{patient.telefone}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={patient.planStatus === 'active' ? 'default' : 'secondary'}>
                              {patient.planStatus === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaires" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Questionário Diário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{DAILY_QUESTIONNAIRE}</pre>
                </div>
                <Button 
                  onClick={() => sendQuestionnaire('daily')} 
                  disabled={loading || patients.filter(p => p.isSelected).length === 0}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Questionário Diário
                </Button>
                <p className="text-xs text-muted-foreground">
                  Enviado automaticamente em dias úteis para pacientes selecionados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Questionário Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{WEEKLY_QUESTIONNAIRE}</pre>
                </div>
                <Button 
                  onClick={() => sendQuestionnaire('weekly')} 
                  disabled={loading || patients.filter(p => p.isSelected).length === 0}
                  className="w-full"
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Questionário Semanal
                </Button>
                <p className="text-xs text-muted-foreground">
                  Enviado semanalmente (segundas-feiras) para pacientes selecionados
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Histórico de Respostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma resposta registrada ainda
                  </p>
                ) : (
                  responses.map((response) => (
                    <Card key={response.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{response.patient_name}</h4>
                              <Badge variant="outline">
                                {response.type === 'daily' ? 'Diário' : 'Semanal'}
                              </Badge>
                              {getStatusIcon(response.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(response.created_at).toLocaleDateString('pt-BR')}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm">{response.responses.join(', ')}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Score: {Math.round(response.score * 100)}%
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Brain className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">IA</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
