
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageSquare, 
  Bot,
  Clock,
  Users
} from "lucide-react";

export const CoachMessaging = () => {
  const { conversations, sendMessage } = useWhatsAppAPI();
  const { toast } = useToast();
  const [selectedPatients, setSelectedPatients] = useState<string>("all");
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("motivational");

  const messageTemplates = {
    motivational: [
      "💪 Você está indo muito bem! Continue assim, cada pequeno passo conta!",
      "🌟 Lembre-se: a jornada de transformação é feita de pequenas vitórias diárias!",
      "🎯 Foco no objetivo! Você tem tudo para alcançar seus resultados!",
      "💚 Seu comprometimento é inspirador! Continue firme nessa jornada!"
    ],
    reminder: [
      "💧 Hora de beber água! Seu corpo agradece pela hidratação!",
      "🥗 Lembre-se de fazer suas refeições com calma e atenção!",
      "🚶‍♀️ Que tal uma caminhada hoje? Movimento é vida!",
      "📝 Não esqueça de responder o questionário de hoje!"
    ],
    educational: [
      "📚 Dica do dia: Mastigar devagar ajuda na digestão e aumenta a saciedade!",
      "🍎 Frutas e vegetais são ricos em fibras e vitaminas essenciais para o seu bem-estar!",
      "⏰ Manter horários regulares para as refeições ajuda a regular o metabolismo!",
      "💤 Um bom sono é fundamental para o controle do peso e disposição!"
    ]
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem para enviar",
        variant: "destructive"
      });
      return;
    }

    try {
      let recipients = conversations;
      
      if (selectedPatients !== "all") {
        recipients = conversations.filter(conv => conv.id === selectedPatients);
      }

      for (const conv of recipients) {
        const coachMessage = `🤖 *NutriCoach:* ${messageText}`;
        await sendMessage(conv.id, conv.contact_phone, coachMessage);
      }

      toast({
        title: "Mensagens enviadas",
        description: `Enviado para ${recipients.length} paciente(s)`
      });

      setMessageText("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagens",
        variant: "destructive"
      });
    }
  };

  const useTemplate = (template: string) => {
    setMessageText(template);
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Enviar Mensagem do Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar Pacientes:</label>
            <Select value={selectedPatients} onValueChange={setSelectedPatients}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha os pacientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pacientes ({conversations.length})</SelectItem>
                {conversations.map((conv) => (
                  <SelectItem key={conv.id} value={conv.id}>
                    {conv.contact_name || conv.contact_phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Mensagem:</label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motivational">Motivacional</SelectItem>
                <SelectItem value="reminder">Lembrete</SelectItem>
                <SelectItem value="educational">Educativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem:</label>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSendMessage} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Enviar como NutriCoach
          </Button>
        </CardContent>
      </Card>

      {/* Templates de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Templates de Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messageTemplates[messageType as keyof typeof messageTemplates].map((template, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm flex-1">{template}</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => useTemplate(template)}
                  >
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Mensagens Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Mensagens Recentes do Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock data para demonstração */}
            {[
              { time: "14:30", message: "Questionário diário enviado", recipients: 12, type: "questionnaire" },
              { time: "12:00", message: "Lembrete de hidratação", recipients: 8, type: "reminder" },
              { time: "09:15", message: "Mensagem motivacional matinal", recipients: 15, type: "motivational" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{item.message}</p>
                    <p className="text-xs text-gray-500">{item.time} - {item.recipients} pacientes</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
