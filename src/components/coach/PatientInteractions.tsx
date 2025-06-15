
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Search,
  Filter,
  Bot,
  User
} from "lucide-react";

export const PatientInteractions = () => {
  const conversas = [
    {
      paciente: {
        nome: "Maria Silva",
        foto: null,
        id: "1"
      },
      ultimaMensagem: "Completei o questionário de hoje! 💪",
      horario: "14:30",
      naoLidas: 2,
      tipo: "paciente"
    },
    {
      paciente: {
        nome: "João Santos",
        foto: null,
        id: "2"
      },
      ultimaMensagem: "Coach: Como está se sentindo hoje?",
      horario: "13:45",
      naoLidas: 0,
      tipo: "coach"
    },
    {
      paciente: {
        nome: "Ana Costa",
        foto: null,
        id: "3"
      },
      ultimaMensagem: "Esqueci de tomar água hoje 😅",
      horario: "12:20",
      naoLidas: 1,
      tipo: "paciente"
    }
  ];

  const mensagens = [
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
      conteudo: "Ótimo trabalho, Maria! Vi que você alcançou 85% da meta de hidratação ontem. Como está se sentindo hoje?",
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
      conteudo: "Excelente! Lembre-se de que pequenos progressos diários levam a grandes transformações. Hoje temos como meta manter a consistência. Você consegue! 🌟",
      horario: "09:30",
      tipo: "texto"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Interações com Pacientes</h2>
          <p className="text-gray-600">Acompanhe as conversas e interações do coach virtual</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Lista de Conversas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversas Ativas
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input placeholder="Buscar paciente..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversas.map((conversa, index) => (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Maria Silva</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mensagens.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className={`flex ${mensagem.remetente === 'coach' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {mensagem.remetente === 'paciente' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>MS</AvatarFallback>
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
              ))}
            </div>

            {/* Input de mensagem */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Digite uma mensagem..." className="flex-1" />
                <Button size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">Coach virtual está ativo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
