
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Download,
  Calendar,
  Target,
  Brain,
  Activity,
  Clock,
  CheckCircle2
} from "lucide-react";

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

  const exportReport = () => {
    toast({
      title: "Relatório exportado",
      description: "O relatório foi exportado com sucesso"
    });
  };

  const overallStats = {
    totalPatients: engagementData.length,
    avgEngagement: Math.round(engagementData.reduce((acc, p) => acc + p.responseRate, 0) / engagementData.length),
    totalInteractions: engagementData.reduce((acc, p) => acc + p.totalInteractions, 0),
    activePatients: engagementData.filter(p => p.responseRate > 60).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Avançados</h2>
          <p className="text-gray-600">Análise detalhada do desempenho do NutriCoach</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Pacientes Ativos</p>
                <p className="text-2xl font-bold">{overallStats.totalPatients}</p>
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
                <p className="text-2xl font-bold">{overallStats.avgEngagement}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Interações Totais</p>
                <p className="text-2xl font-bold">{overallStats.totalInteractions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Alta Performance</p>
                <p className="text-2xl font-bold">{overallStats.activePatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Engajamento por Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engagementData.map((patient) => (
                  <div key={patient.patientId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{patient.patientName}</h4>
                        {getTrendIcon(patient.engagementTrend)}
                      </div>
                      <Badge className={`${getEngagementColor(patient.responseRate)} bg-transparent border`}>
                        {patient.responseRate}% de resposta
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={patient.responseRate} className="h-2" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{patient.totalInteractions} interações</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{patient.avgResponseTime}min resposta</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Prefere: {patient.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>Último: {new Date(patient.lastActivity).toLocaleDateString('pt-BR')}</span>
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
                Performance Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyReports.map((week, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{week.week}</h4>
                      <Badge variant="outline">
                        {week.avgEngagement}% engajamento médio
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{week.messagesSet}</p>
                        <p className="text-gray-600">Mensagens</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">{week.questionnairesAnswered}</p>
                        <p className="text-gray-600">Questionários</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">{week.motivationalSent}</p>
                        <p className="text-gray-600">Motivacionais</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <p className="text-2xl font-bold text-orange-600">{week.remindersSet}</p>
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
                Insights da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Padrão Identificado</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Pacientes respondem melhor às mensagens motivacionais enviadas entre 8h-10h, 
                    com taxa de resposta 23% maior que outros horários.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-900">Oportunidade de Melhoria</h4>
                  </div>
                  <p className="text-sm text-green-800">
                    3 pacientes apresentaram queda no engajamento. Recomenda-se envio de mensagens 
                    personalizadas para reativar a participação.
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Recomendação Estratégica</h4>
                  </div>
                  <p className="text-sm text-purple-800">
                    Implementar questionários semanais para pacientes com alta adesão pode 
                    aumentar a coleta de dados comportamentais em 40%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
