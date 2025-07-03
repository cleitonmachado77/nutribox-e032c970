
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { QuestionnaireManager } from '@/components/coach/QuestionnaireManager';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Brain, 
  TrendingUp,
  ChartBar,
  Settings2,
  UserCheck,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNutriCoachQuestionnaire } from '@/hooks/useNutriCoachQuestionnaire';
import { useNutriCoachStats } from '@/hooks/useNutriCoachStats';
import { usePacientesList } from '@/hooks/usePacientesList';
import { useTwilioAPI } from '@/hooks/useTwilioAPI';

export default function NutriCoach() {
  const { user } = useAuth();
  const { loading, sendDailyQuestionnaire, getPatientInsights } = useNutriCoachQuestionnaire();
  const { stats, loading: statsLoading } = useNutriCoachStats();
  const { pacientes, loading: pacientesLoading } = usePacientesList();
  const { 
    userSubaccount, 
    loading: twilioLoading, 
    createSubaccount, 
    provisionWhatsAppNumber,
    sendNutriCoachMessage
  } = useTwilioAPI();
  
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [consultorioNome, setConsultorioNome] = useState('');
  const [cidade, setCidade] = useState('');

  const handleSendQuestionnaire = async () => {
    if (!selectedPatient || !user || !userSubaccount) return;
    
    const paciente = pacientes.find(p => p.id === selectedPatient);
    if (!paciente) return;
    
    // Send via Twilio WhatsApp with ChatGPT integration
    await sendNutriCoachMessage(
      paciente.telefone, 
      paciente.nome, 
      'questionnaire',
      { objetivo: paciente.objetivo, status: paciente.status }
    );
  };

  const handleSendMotivationalMessage = async () => {
    if (!selectedPatient || !user || !userSubaccount) return;
    
    const paciente = pacientes.find(p => p.id === selectedPatient);
    if (!paciente) return;
    
    await sendNutriCoachMessage(
      paciente.telefone, 
      paciente.nome, 
      'motivational',
      { objetivo: paciente.objetivo, peso: paciente.peso, altura: paciente.altura }
    );
  };

  const handleGetInsights = async () => {
    if (!selectedPatient || !user) return;
    
    const paciente = pacientes.find(p => p.id === selectedPatient);
    if (!paciente) return;
    
    setLoadingInsights(true);
    try {
      const result = await getPatientInsights(paciente.telefone, user.id);
      setInsights(result);
    } catch (error) {
      console.error('Erro ao obter insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleCreateSubaccount = async () => {
    if (!consultorioNome.trim()) return;
    await createSubaccount(consultorioNome, cidade);
  };

  const handleProvisionWhatsApp = async () => {
    await provisionWhatsAppNumber();
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Header 
        title="NutriCoach IA" 
        description="Sistema inteligente de coaching nutricional via WhatsApp"
      />

      {/* Twilio WhatsApp Setup */}
      {!userSubaccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Configuração WhatsApp Business
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure uma subconta Twilio para enviar mensagens do NutriCoach via WhatsApp Business.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Consultório *</label>
                <Input
                  value={consultorioNome}
                  onChange={(e) => setConsultorioNome(e.target.value)}
                  placeholder="Ex: Clínica NutriSaúde"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade</label>
                <Input
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo"
                />
              </div>
            </div>

            <Button 
              onClick={handleCreateSubaccount}
              disabled={twilioLoading || !consultorioNome.trim()}
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              {twilioLoading ? 'Criando subconta...' : 'Criar Subconta WhatsApp'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Number Setup */}
      {userSubaccount && !userSubaccount.user_twilio_numbers?.[0] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Subconta Criada - Provisionar Número WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{userSubaccount.friendly_name}</Badge>
              <span>Subconta ID: {userSubaccount.subaccount_sid}</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Agora você precisa provisionar um número WhatsApp Business para enviar mensagens.
            </p>

            <Button 
              onClick={handleProvisionWhatsApp}
              disabled={twilioLoading}
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              {twilioLoading ? 'Provisionando número...' : 'Provisionar Número WhatsApp'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Ready Status */}
      {userSubaccount?.user_twilio_numbers?.[0] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              WhatsApp Business Configurado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{userSubaccount.friendly_name}</p>
                <p className="text-sm text-muted-foreground">
                  Número: {userSubaccount.user_twilio_numbers[0].twilio_phone_number}
                </p>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pacientes</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats.totalPacientes}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats.pacientesAtivos}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Questionários Hoje</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats.questionariosHoje}
                </p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engajamento</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : `${stats.engajamentoMedio}%`}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="enviar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enviar">Enviar Questionários</TabsTrigger>
          <TabsTrigger value="questionarios">Gerenciar Questionários</TabsTrigger>
          <TabsTrigger value="insights">Insights dos Pacientes</TabsTrigger>
        </TabsList>

        <TabsContent value="enviar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Enviar Questionário para Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome} - {paciente.telefone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleSendQuestionnaire}
                  disabled={loading || !selectedPatient || pacientesLoading || !userSubaccount?.user_twilio_numbers?.[0]}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Enviando...' : 'Enviar Questionário do Dia'}
                </Button>

                <Button 
                  onClick={handleSendMotivationalMessage}
                  disabled={loading || !selectedPatient || pacientesLoading || !userSubaccount?.user_twilio_numbers?.[0]}
                  variant="outline"
                  className="w-full"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {loading ? 'Enviando...' : 'Enviar Mensagem Motivacional'}
                </Button>
              </div>

              {!userSubaccount?.user_twilio_numbers?.[0] && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Configure uma subconta WhatsApp Business acima para enviar mensagens via NutriCoach IA.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>Pacientes Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              {pacientesLoading ? (
                <p>Carregando pacientes...</p>
              ) : pacientes.length === 0 ? (
                <p className="text-muted-foreground">Nenhum paciente encontrado. Cadastre pacientes primeiro.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pacientes.map((paciente) => (
                    <Card key={paciente.id} className="relative">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{paciente.nome}</h4>
                          <p className="text-sm text-muted-foreground">{paciente.telefone}</p>
                          <Badge variant="outline">{paciente.objetivo || 'Sem objetivo'}</Badge>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedPatient(paciente.id)}
                            variant={selectedPatient === paciente.id ? "default" : "outline"}
                            className="w-full"
                          >
                            {selectedPatient === paciente.id ? 'Selecionado' : 'Selecionar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionarios">
          <QuestionnaireManager />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-primary" />
                Insights do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente para ver insights" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome} - {paciente.telefone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleGetInsights}
                disabled={loadingInsights || !selectedPatient}
                className="w-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                {loadingInsights ? 'Analisando...' : 'Gerar Insights'}
              </Button>

              {insights && (
                <Card>
                  <CardHeader>
                    <CardTitle>Relatório de Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{insights.total_responses}</p>
                        <p className="text-sm text-muted-foreground">Total Respostas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{Math.round(insights.avg_score * 50)}%</p>
                        <p className="text-sm text-muted-foreground">Score Médio</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{Object.keys(insights.categories).length}</p>
                        <p className="text-sm text-muted-foreground">Categorias</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {insights.total_responses > 0 ? 'Ativo' : 'Inativo'}
                        </p>
                        <p className="text-sm text-muted-foreground">Status</p>
                      </div>
                    </div>

                    {Object.keys(insights.categories).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Desempenho por Categoria:</h4>
                        <div className="space-y-2">
                          {Object.entries(insights.categories).map(([category, data]: [string, any]) => (
                            <div key={category} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="capitalize">{category}</span>
                              <div className="text-right">
                                <span className="font-medium">{Math.round(data.avg_score * 50)}%</span>
                                <span className="text-sm text-muted-foreground ml-2">({data.count} respostas)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
