
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNutriCoachData } from "@/hooks/useNutriCoachData";
import { useNutriCoachAI } from "@/hooks/useNutriCoachAI";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bot,
  Send,
  Activity,
  Loader2
} from "lucide-react";

export const CoachDashboard = () => {
  const { stats, interactions, loading } = useNutriCoachData();
  const { conversations } = useWhatsAppAPI();
  const { 
    generateQuestionnaire, 
    generateMotivationalMessage, 
    generateReminder,
    loading: aiLoading 
  } = useNutriCoachAI();
  const { toast } = useToast();

  const getStatusIcon = (actionType: string) => {
    switch (actionType) {
      case "generate_questionnaire": return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "generate_motivational": return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "generate_reminder": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "analyze_responses": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Bot className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusColor = (actionType: string) => {
    switch (actionType) {
      case "generate_questionnaire": return "bg-blue-100 text-blue-800";
      case "generate_motivational": return "bg-green-100 text-green-800";
      case "generate_reminder": return "bg-yellow-100 text-yellow-800";
      case "analyze_responses": return "bg-green-100 text-green-800";
      default: return "bg-purple-100 text-purple-800";
    }
  };

  const sendBulkQuestionnaires = async () => {
    try {
      const activeConversations = conversations.slice(0, 5);
      let successCount = 0;

      for (const conv of activeConversations) {
        if (conv.contact_name) {
          const questionnaire = await generateQuestionnaire(conv.contact_name, conv.contact_phone);
          if (questionnaire) {
            successCount++;
          }
        }
      }

      toast({
        title: "Questionários enviados",
        description: `${successCount} questionários foram enviados com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar questionários em lote",
        variant: "destructive"
      });
    }
  };

  const sendBulkMotivational = async () => {
    try {
      const activeConversations = conversations.slice(0, 5);
      let successCount = 0;

      for (const conv of activeConversations) {
        if (conv.contact_name) {
          const message = await generateMotivationalMessage(conv.contact_name, conv.contact_phone);
          if (message) {
            successCount++;
          }
        }
      }

      toast({
        title: "Mensagens motivacionais enviadas",
        description: `${successCount} mensagens foram enviadas com sucesso`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagens motivacionais",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando dados do NutriCoach...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Conectados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pacientesConectados}</div>
            <p className="text-xs text-muted-foreground">
              no WhatsApp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mensagensEnviadas}</div>
            <p className="text-xs text-muted-foreground">
              enviadas pelo coach
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questionários</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionariosRespondidos}</div>
            <p className="text-xs text-muted-foreground">
              respondidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taxaResposta}%</div>
            <Progress value={stats.taxaResposta} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Ações Rápidas do NutriCoach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={sendBulkQuestionnaires}
              disabled={aiLoading || conversations.length === 0}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="font-medium">Enviar Questionários</span>
              </div>
              <span className="text-sm text-gray-600">
                Para {Math.min(conversations.length, 5)} pacientes
              </span>
            </Button>

            <Button 
              onClick={sendBulkMotivational}
              disabled={aiLoading || conversations.length === 0}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                <span className="font-medium">Mensagens Motivacionais</span>
              </div>
              <span className="text-sm text-gray-600">
                Personalizadas por IA
              </span>
            </Button>

            <Button 
              onClick={async () => {
                for (const conv of conversations.slice(0, 3)) {
                  if (conv.contact_name) {
                    await generateReminder(conv.contact_name, 'hidratação', conv.contact_phone);
                  }
                }
                toast({
                  title: "Lembretes enviados",
                  description: "Lembretes de hidratação enviados"
                });
              }}
              disabled={aiLoading || conversations.length === 0}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                <span className="font-medium">Lembretes</span>
              </div>
              <span className="text-sm text-gray-600">
                Hidratação e cuidados
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente Real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Atividade Recente do Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactions.length > 0 ? (
              interactions.slice(0, 10).map((interaction) => (
                <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(interaction.action_type)}
                    <div>
                      <p className="font-medium text-gray-900">{interaction.patient_name}</p>
                      <p className="text-sm text-gray-600">
                        {interaction.action_type === 'generate_questionnaire' && 'Questionário enviado'}
                        {interaction.action_type === 'generate_motivational' && 'Mensagem motivacional enviada'}
                        {interaction.action_type === 'generate_reminder' && 'Lembrete enviado'}
                        {interaction.action_type === 'analyze_responses' && 'Respostas analisadas'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(interaction.action_type)}>
                      {new Date(interaction.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma interação do coach ainda</p>
                <p className="text-sm">Use as ações rápidas para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance do Coach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Interações Totais</span>
              <Badge className="bg-blue-100 text-blue-800">{stats.interacoesTotais}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de Resposta</span>
              <Badge className={stats.taxaResposta > 70 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {stats.taxaResposta}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Questionários Pendentes</span>
              <Badge className="bg-orange-100 text-orange-800">{stats.lembretesPendentes}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">ChatGPT Conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">WhatsApp {conversations.length > 0 ? 'Conectado' : 'Desconectado'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">NutriCoach Ativo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
