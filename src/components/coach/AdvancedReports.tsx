import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  Target,
  Brain,
  Activity,
  Clock,
  CheckCircle2,
  RefreshCw,
  Eye,
  Send
} from "lucide-react";
import { ReportsCharts } from "./ReportsCharts";
import { ReportsExport } from "./ReportsExport";
import { ReportsFilters } from "./ReportsFilters";

interface PatientEngagement {
  patientId: string;
  patientName: string;
  responseRate: number;
  lastActivity: string;
  totalInteractions: number;
  engagementTrend: 'up' | 'down' | 'stable';
  preferredTime: string;
  avgResponseTime: number;
}

interface WeeklyReport {
  week: string;
  messagesSet: number;
  questionnairesAnswered: number;
  motivationalSent: number;
  remindersSet: number;
  avgEngagement: number;
}

export const AdvancedReports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days');
  const [filters, setFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const engagementData: PatientEngagement[] = [
    {
      patientId: 'p1',
      patientName: 'Maria Silva',
      responseRate: 85,
      lastActivity: '2024-01-14',
      totalInteractions: 45,
      engagementTrend: 'up',
      preferredTime: '08:00-10:00',
      avgResponseTime: 15
    },
    {
      patientId: 'p2',
      patientName: 'João Santos',
      responseRate: 72,
      lastActivity: '2024-01-13',
      totalInteractions: 38,
      engagementTrend: 'stable',
      preferredTime: '19:00-21:00',
      avgResponseTime: 25
    },
    {
      patientId: 'p3',
      patientName: 'Ana Costa',
      responseRate: 45,
      lastActivity: '2024-01-10',
      totalInteractions: 22,
      engagementTrend: 'down',
      preferredTime: '12:00-14:00',
      avgResponseTime: 45
    }
  ];

  const weeklyReports: WeeklyReport[] = [
    {
      week: 'Semana 1',
      messagesSet: 125,
      questionnairesAnswered: 89,
      motivationalSent: 67,
      remindersSet: 45,
      avgEngagement: 78
    },
    {
      week: 'Semana 2',
      messagesSet: 140,
      questionnairesAnswered: 98,
      motivationalSent: 72,
      remindersSet: 52,
      avgEngagement: 82
    },
    {
      week: 'Semana 3',
      messagesSet: 135,
      questionnairesAnswered: 92,
      motivationalSent: 68,
      remindersSet: 48,
      avgEngagement: 75
    },
    {
      week: 'Semana 4',
      messagesSet: 158,
      questionnairesAnswered: 112,
      motivationalSent: 78,
      remindersSet: 58,
      avgEngagement: 85
    }
  ];

  const refreshData = async () => {
    setIsRefreshing(true);
    toast({
      title: "Atualizando dados",
      description: "Carregando os dados mais recentes..."
    });
    
    // Simular carregamento
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "Os relatórios foram atualizados com sucesso"
      });
    }, 2000);
  };

  const previewReport = () => {
    toast({
      title: "Visualização do relatório",
      description: "Abrindo pré-visualização em nova janela..."
    });
  };

  const sendReport = () => {
    toast({
      title: "Enviar relatório",
      description: "Funcionalidade de envio por email será implementada em breve"
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <div className="w-4 h-4 bg-yellow-500 rounded-full" />;
    }
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallStats = {
    totalPatients: engagementData.length,
    avgEngagement: Math.round(engagementData.reduce((acc, p) => acc + p.responseRate, 0) / engagementData.length),
    totalInteractions: engagementData.reduce((acc, p) => acc + p.totalInteractions, 0),
    activePatients: engagementData.filter(p => p.responseRate > 60).length
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Avançados</h2>
          <p className="text-gray-600">Análise detalhada do desempenho do NutriCoach</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={previewReport}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button variant="outline" onClick={sendReport}>
            <Send className="w-4 h-4 mr-2" />
            Enviar
          </Button>
          <ReportsExport />
        </div>
      </div>

      {/* Filtros Avançados */}
      <ReportsFilters 
        onFiltersChange={setFilters}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Pacientes Ativos</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+3 este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Engajamento Médio</p>
                <p className="text-2xl font-bold">76%</p>
                <p className="text-xs text-green-600">+8% vs mês anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Mensagens Enviadas</p>
                <p className="text-2xl font-bold">1.247</p>
                <p className="text-xs text-blue-600">Este período</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Metas Alcançadas</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-green-600">74% de sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <ReportsCharts selectedPeriod={selectedPeriod} />

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="engagement">Engajamento Detalhado</TabsTrigger>
          <TabsTrigger value="performance">Performance Semanal</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Análise Detalhada de Engajamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Maria Silva', engagement: 89, trend: 'up', interactions: 67, lastActive: '2024-01-15' },
                  { name: 'João Santos', engagement: 72, trend: 'stable', interactions: 45, lastActive: '2024-01-14' },
                  { name: 'Ana Costa', engagement: 56, trend: 'down', interactions: 23, lastActive: '2024-01-12' },
                ].map((patient, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{patient.name}</h4>
                        <TrendingUp className={`w-4 h-4 ${
                          patient.trend === 'up' ? 'text-green-600' : 
                          patient.trend === 'down' ? 'text-red-600 rotate-180' : 'text-yellow-600'
                        }`} />
                      </div>
                      <Badge className={`${
                        patient.engagement >= 80 ? 'text-green-600' : 
                        patient.engagement >= 60 ? 'text-yellow-600' : 'text-red-600'
                      } bg-transparent border`}>
                        {patient.engagement}% engajamento
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={patient.engagement} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{patient.interactions} interações</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Último: {new Date(patient.lastActive).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>Média: 15min resposta</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Semanal Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { week: 'Semana Atual', messages: 158, questionnaires: 112, motivational: 78, reminders: 58, engagement: 85 },
                  { week: 'Semana Passada', messages: 142, questionnaires: 98, motivational: 65, reminders: 48, engagement: 79 },
                  { week: 'Há 2 Semanas', messages: 135, questionnaires: 89, motivational: 72, reminders: 52, engagement: 82 },
                ].map((week, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{week.week}</h4>
                      <Badge variant="outline">
                        {week.engagement}% engajamento médio
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{week.messages}</p>
                        <p className="text-gray-600">Mensagens</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">{week.questionnaires}</p>
                        <p className="text-gray-600">Questionários</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">{week.motivational}</p>
                        <p className="text-gray-600">Motivacionais</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <p className="text-2xl font-bold text-orange-600">{week.reminders}</p>
                        <p className="text-gray-600">Lembretes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Insights Avançados da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Padrão de Comportamento Identificado</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    Pacientes respondem 34% melhor às mensagens motivacionais enviadas entre 8h-10h.
                  </p>
                  <Badge className="text-xs bg-blue-200 text-blue-800">Alta Confiança</Badge>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-900">Oportunidade de Melhoria</h4>
                  </div>
                  <p className="text-sm text-green-800 mb-2">
                    Implementar lembretes personalizados pode aumentar a adesão em até 28%.
                  </p>
                  <Badge className="text-xs bg-green-200 text-green-800">Recomendação Prioritária</Badge>
                </div>

                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Estratégia Sugerida</h4>
                  </div>
                  <p className="text-sm text-purple-800 mb-2">
                    Segmentar pacientes por perfil comportamental pode otimizar as interações.
                  </p>
                  <Badge className="text-xs bg-purple-200 text-purple-800">Implementação Sugerida</Badge>
                </div>

                <div className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <h4 className="font-medium text-orange-900">Análise Preditiva</h4>
                  </div>
                  <p className="text-sm text-orange-800 mb-2">
                    3 pacientes mostram sinais de possível abandono do tratamento.
                  </p>
                  <Badge className="text-xs bg-orange-200 text-orange-800">Ação Preventiva</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
