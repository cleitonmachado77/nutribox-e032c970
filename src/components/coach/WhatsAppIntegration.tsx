
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useNutriCoachAI } from "@/hooks/useNutriCoachAI";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Clock, 
  Users,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";

export const WhatsAppIntegration = () => {
  const { conversations, sendMessage, loading } = useWhatsAppAPI();
  const { 
    loading: aiLoading, 
    generateQuestionnaire, 
    generateMotivationalMessage, 
    generateReminder 
  } = useNutriCoachAI();
  const { toast } = useToast();
  const [autoResponses, setAutoResponses] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [questionnaireSchedule, setQuestionnaireSchedule] = useState(true);

  // Mock data para demonstração do coach
  const coachStats = {
    pacientesConectados: conversations.length || 12,
    mensagensEnviadas: 45,
    questionariosRespondidos: 8,
    lembretesPendentes: 3
  };

  const handleSendCoachMessage = async (phone: string, message: string) => {
    try {
      // Encontrar a conversa pelo telefone
      const conversation = conversations.find(conv => conv.contact_phone === phone);
      if (conversation) {
        await sendMessage(conversation.id, phone, `🤖 *NutriCoach:* ${message}`);
        toast({
          title: "Mensagem enviada",
          description: "O coach virtual enviou a mensagem com sucesso"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem do coach",
        variant: "destructive"
      });
    }
  };

  const sendAIQuestionnaire = async (patientName: string, phone: string) => {
    try {
      const questionnaire = await generateQuestionnaire(patientName, phone);
      if (questionnaire) {
        await handleSendCoachMessage(phone, questionnaire);
      }
    } catch (error) {
      console.error('Error sending AI questionnaire:', error);
    }
  };

  const sendAIMotivationalMessage = async (patientName: string, phone: string) => {
    try {
      const motivationalMessage = await generateMotivationalMessage(patientName, phone);
      if (motivationalMessage) {
        await handleSendCoachMessage(phone, motivationalMessage);
      }
    } catch (error) {
      console.error('Error sending motivational message:', error);
    }
  };

  const sendAIReminder = async (patientName: string, phone: string, type: string) => {
    try {
      const reminder = await generateReminder(patientName, type, phone);
      if (reminder) {
        await handleSendCoachMessage(phone, reminder);
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status da Integração */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Conectados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachStats.pacientesConectados}</div>
            <p className="text-xs text-muted-foreground">no WhatsApp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachStats.mensagensEnviadas}</div>
            <p className="text-xs text-muted-foreground">enviadas pelo coach</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questionários</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachStats.questionariosRespondidos}</div>
            <p className="text-xs text-muted-foreground">respondidos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IA Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">ChatGPT Ativo</span>
            </div>
            <p className="text-xs text-muted-foreground">IA configurada</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurações do Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Configurações do Coach Virtual com IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Respostas Automáticas com IA</Label>
              <p className="text-sm text-gray-600">
                O coach responde automaticamente usando ChatGPT
              </p>
            </div>
            <Switch 
              checked={autoResponses} 
              onCheckedChange={setAutoResponses}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Lembretes Personalizados</Label>
              <p className="text-sm text-gray-600">
                Lembretes gerados por IA baseados no perfil do paciente
              </p>
            </div>
            <Switch 
              checked={dailyReminders} 
              onCheckedChange={setDailyReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Questionários Inteligentes</Label>
              <p className="text-sm text-gray-600">
                Questionários adaptativos gerados por IA
              </p>
            </div>
            <Switch 
              checked={questionnaireSchedule} 
              onCheckedChange={setQuestionnaireSchedule}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas do Coach com IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ações Inteligentes do NutriCoach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={async () => {
                for (const conv of conversations.slice(0, 3)) {
                  if (conv.contact_name) {
                    await sendAIQuestionnaire(conv.contact_name, conv.contact_phone);
                  }
                }
                toast({
                  title: "Questionários IA enviados",
                  description: `Enviados para ${Math.min(conversations.length, 3)} pacientes`
                });
              }}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="font-medium">Questionário IA</span>
              </div>
              <span className="text-sm text-gray-600">
                Gerado por ChatGPT
              </span>
            </Button>

            <Button 
              onClick={async () => {
                for (const conv of conversations.slice(0, 3)) {
                  if (conv.contact_name) {
                    await sendAIMotivationalMessage(conv.contact_name, conv.contact_phone);
                  }
                }
                toast({
                  title: "Mensagens motivacionais IA enviadas",
                  description: `Enviadas para ${Math.min(conversations.length, 3)} pacientes`
                });
              }}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                <span className="font-medium">Motivação IA</span>
              </div>
              <span className="text-sm text-gray-600">
                Personalizada por IA
              </span>
            </Button>

            <Button 
              onClick={async () => {
                for (const conv of conversations.slice(0, 3)) {
                  if (conv.contact_name) {
                    await sendAIReminder(conv.contact_name, conv.contact_phone, 'hidratação');
                  }
                }
                toast({
                  title: "Lembretes IA enviados",
                  description: `Enviados para ${Math.min(conversations.length, 3)} pacientes`
                });
              }}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                <span className="font-medium">Lembrete IA</span>
              </div>
              <span className="text-sm text-gray-600">
                Hidratação inteligente
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>Pacientes no WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversations.length > 0 ? (
              conversations.slice(0, 5).map((conv) => (
                <div key={conv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                      {(conv.contact_name || conv.contact_phone).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{conv.contact_name || conv.contact_phone}</p>
                      <p className="text-sm text-gray-600">{conv.contact_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      Conectado
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled={aiLoading}
                      onClick={() => {
                        if (conv.contact_name) {
                          sendAIQuestionnaire(conv.contact_name, conv.contact_phone);
                        }
                      }}
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                      IA Question.
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum paciente conectado no WhatsApp</p>
                <p className="text-sm">Conecte o WhatsApp para começar o acompanhamento</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
