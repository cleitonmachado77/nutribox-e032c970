
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Search,
  Filter,
  Bot,
  User,
  Phone
} from "lucide-react";

export const PatientInteractions = () => {
  const { conversations, sendMessage } = useWhatsAppAPI();
  const { toast } = useToast();

  // Simular conversas com dados do WhatsApp real
  const conversasComCoach = conversations.map((conv, index) => ({
    paciente: {
      nome: conv.contact_name || `Paciente ${index + 1}`,
      foto: null,
      id: conv.id,
      telefone: conv.contact_phone
    },
    ultimaMensagem: conv.last_message || "Sem mensagens",
    horario: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : "00:00",
    naoLidas: conv.unread_count || 0,
    tipo: conv.last_message?.includes("🤖") ? "coach" : "paciente"
  }));

  const handleSendCoachResponse = async (patientId: string, phone: string, message: string) => {
    try {
      const coachMessage = `🤖 *NutriCoach:* ${message}`;
      await sendMessage(patientId, phone, coachMessage);
      toast({
        title: "Resposta enviada",
        description: "O coach virtual respondeu ao paciente"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar resposta do coach",
        variant: "destructive"
      });
    }
  };

  const mensagensExemplo = [
    {
      id: 1,
      remetente: "paciente",
      conteudo: "Bom dia! Completei o questionário de hoje",
      horario: "09:15",
      tipo: "texto"
    },
    {
      id: 2,
      remetente: "coach",
      conteudo: "🤖 Ótimo trabalho! Vi que você alcançou 85% da meta de hidratação ontem. Como está se sentindo hoje?",
      horario: "09:18",
      tipo: "texto"
    },
    {
      id: 3,
      remetente: "paciente",
      conteudo: "Me sentindo bem mais disposta! Estou conseguindo seguir o plano alimentar melhor também",
      horario: "09:25",
      tipo: "texto"
    },
    {
      id: 4,
      remetente: "coach",
      conteudo: "🤖 Excelente! Lembre-se: pequenos progressos diários levam a grandes transformações. Hoje temos como meta manter a consistência. Você consegue! 🌟",
      horario: "09:30",
      tipo: "texto"
    }
  ];

  const respostasRapidas = [
    "Parabéns pelo progresso! Continue assim! 💪",
    "Lembre-se de beber água ao longo do dia! 💧",
    "Que tal uma caminhada hoje? 🚶‍♀️",
    "Respondeu o questionário de hoje? 📝",
    "Como está se sentindo hoje? 😊"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Interações WhatsApp - Coach Virtual</h2>
          <p className="text-gray-600">Acompanhe e gerencie as conversas do coach com os pacientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de Conversas WhatsApp */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversas WhatsApp ({conversasComCoach.length})
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input placeholder="Buscar paciente..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversasComCoach.length > 0 ? (
                conversasComCoach.map((conversa, index) => (
                  <div
                    key={index}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${
                      index === 0 ? "border-l-blue-500 bg-blue-50" : "border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversa.paciente.foto} />
                        <AvatarFallback>
                          {conversa.paciente.nome.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{conversa.paciente.nome}</h4>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">{conversa.horario}</span>
                            {conversa.naoLidas > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                                {conversa.naoLidas}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {conversa.tipo === "coach" && <Bot className="w-3 h-3 text-blue-500" />}
                          <p className="text-sm text-gray-600 truncate">{conversa.ultimaMensagem}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{conversa.paciente.telefone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma conversa ativa</p>
                  <p className="text-sm">Conecte o WhatsApp para ver as conversas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {conversasComCoach[0]?.paciente.nome.split(' ').map(n => n[0]).join('') || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {conversasComCoach[0]?.paciente.nome || "Selecione uma conversa"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">WhatsApp conectado</span>
                  {conversasComCoach[0] && (
                    <span className="text-xs text-gray-500">
                      {conversasComCoach[0].paciente.telefone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversasComCoach.length > 0 ? (
                mensagensExemplo.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${mensagem.remetente === 'coach' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {mensagem.remetente === 'paciente' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {conversasComCoach[0]?.paciente.nome.split(' ').map(n => n[0]).join('') || 'P'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          mensagem.remetente === 'coach'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{mensagem.conteudo}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-70">{mensagem.horario}</span>
                        </div>
                      </div>
                      {mensagem.remetente === 'coach' && (
                        <div className="flex items-center">
                          <Bot className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma conversa para ver as mensagens</p>
                  </div>
                </div>
              )}
            </div>

            {/* Respostas Rápidas do Coach */}
            {conversasComCoach.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium">Respostas Rápidas do Coach:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {respostasRapidas.map((resposta, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (conversasComCoach[0]) {
                            handleSendCoachResponse(
                              conversasComCoach[0].paciente.id,
                              conversasComCoach[0].paciente.telefone,
                              resposta
                            );
                          }
                        }}
                        className="text-xs"
                      >
                        {resposta}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Bot className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Coach virtual conectado via WhatsApp</span>
                  <Badge variant="outline" className="text-xs">
                    {conversasComCoach.length} conversas ativas
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
