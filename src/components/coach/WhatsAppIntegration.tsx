
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Clock, 
  Users,
  Zap,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export const WhatsAppIntegration = () => {
  const { conversations, sendMessage, loading } = useWhatsAppAPI();
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

  const sendDailyQuestionnaire = async (patientName: string, phone: string) => {
    const questionnaireMessage = `Olá ${patientName}! 👋

Hora do seu questionário diário! 📋

*Questões de hoje:*

1️⃣ Você conseguiu seguir pelo menos 90% do Plano hoje?
• Sim ✅
• Não ❌

2️⃣ Quantas refeições você fez hoje?
• 2-3 refeições
• 4 refeições  
• 5-6 refeições

3️⃣ Como está sua energia hoje?
• Baixa
• Moderada
• Boa

4️⃣ Você fez atividade física hoje?
• Sim ✅
• Não ❌

Responda com números (ex: 1,3,2,1) para registrar suas respostas! 💪`;

    await handleSendCoachMessage(phone, questionnaireMessage);
  };

  const sendMotivationalMessage = async (patientName: string, phone: string) => {
    const messages = [
      `${patientName}, lembre-se: pequenos progressos diários levam a grandes transformações! 💪`,
      `Hora de beber água, ${patientName}! Seu corpo agradece! 💧`,
      `${patientName}, como foi sua refeição hoje? Lembre-se de comer com calma! 🥗`,
      `Parabéns ${patientName}! Você está no caminho certo! Continue assim! 🌟`,
      `${patientName}, que tal uma caminhada hoje? Seu corpo e mente vão adorar! 🚶‍♀️`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    await handleSendCoachMessage(phone, randomMessage);
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
            <CardTitle className="text-sm font-medium">Lembretes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coachStats.lembretesPendentes}</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurações do Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Configurações do Coach Virtual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Respostas Automáticas</Label>
              <p className="text-sm text-gray-600">
                O coach responde automaticamente às mensagens dos pacientes
              </p>
            </div>
            <Switch 
              checked={autoResponses} 
              onCheckedChange={setAutoResponses}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Lembretes Diários</Label>
              <p className="text-sm text-gray-600">
                Enviar lembretes sobre hidratação, refeições e exercícios
              </p>
            </div>
            <Switch 
              checked={dailyReminders} 
              onCheckedChange={setDailyReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Questionários Programados</Label>
              <p className="text-sm text-gray-600">
                Enviar questionários comportamentais automaticamente
              </p>
            </div>
            <Switch 
              checked={questionnaireSchedule} 
              onCheckedChange={setQuestionnaireSchedule}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas do Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Ações Rápidas do Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                // Enviar questionário para todos os pacientes conectados
                conversations.forEach(conv => {
                  if (conv.contact_name) {
                    sendDailyQuestionnaire(conv.contact_name, conv.contact_phone);
                  }
                });
                toast({
                  title: "Questionários enviados",
                  description: `Enviados para ${conversations.length} pacientes`
                });
              }}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4" />
                <span className="font-medium">Enviar Questionário Diário</span>
              </div>
              <span className="text-sm text-gray-600">
                Para todos os pacientes conectados
              </span>
            </Button>

            <Button 
              onClick={() => {
                // Enviar mensagem motivacional
                conversations.forEach(conv => {
                  if (conv.contact_name) {
                    sendMotivationalMessage(conv.contact_name, conv.contact_phone);
                  }
                });
                toast({
                  title: "Mensagens motivacionais enviadas",
                  description: `Enviadas para ${conversations.length} pacientes`
                });
              }}
              className="h-auto p-4 flex flex-col items-start"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4" />
                <span className="font-medium">Mensagem Motivacional</span>
              </div>
              <span className="text-sm text-gray-600">
                Enviar incentivo personalizado
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
                      onClick={() => {
                        if (conv.contact_name) {
                          sendDailyQuestionnaire(conv.contact_name, conv.contact_phone);
                        }
                      }}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Questionário
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
