import { Search, Filter, Plus, Send, MoreVertical, QrCode, Phone, Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { WhatsAppQRModal } from "@/components/WhatsAppQRModal";
import { useState, useEffect } from "react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

const conversations = [
  {
    id: 1,
    name: "Maria Silva",
    lastMessage: "Obrigada pelas orientações nutricionais!",
    time: "12:44",
    unread: 2,
    tags: ["Conectada", "Novo", "Trabalha", "Civil", "Inválida", "VIP"],
    avatar: "MS",
    isOnline: true,
    phone: "+55 11 99999-9999"
  },
  {
    id: 2,
    name: "João Souza", 
    lastMessage: "Quando é minha próxima consulta?",
    time: "12:30",
    unread: 0,
    tags: ["Operacional", "Finalizado", "Tributário", "Cobrança"],
    avatar: "JS",
    isOnline: false,
    phone: "+55 11 88888-8888"
  },
  {
    id: 3,
    name: "Ana Paula",
    lastMessage: "Preciso ajustar minha dieta para o treino.",
    time: "12:15",
    unread: 5,
    tags: ["Comercial", "Em Análise", "Administrativo", "Urgente", "Novo Cliente"],
    avatar: "AP",
    isOnline: true,
    phone: "+55 11 77777-7777"
  },
  {
    id: 4,
    name: "Carlos Lima",
    lastMessage: "Posso substituir a proteína por outra opção?",
    time: "11:58",
    unread: 1,
    tags: ["Operacional", "Aguardando Resposta", "Penal", "Ambiental", "Recorrente"],
    avatar: "CL",
    isOnline: false,
    phone: "+55 11 66666-6666"
  },
  {
    id: 5,
    name: "Beatriz Gomes",
    lastMessage: "Muito obrigada pelas receitas saudáveis!",
    time: "11:30",
    unread: 0,
    tags: ["Conectada", "Finalizado", "Civil", "VIP"],
    avatar: "BG",
    isOnline: true,
    phone: "+55 11 55555-5555"
  }
];

const chatMessages = [
  {
    id: 1,
    sender: "patient",
    message: "Bom dia! Gostaria de saber se posso substituir o frango por peixe na dieta.",
    time: "12:40",
    read: true
  },
  {
    id: 2,
    sender: "nutritionist",
    message: "Bom dia! Claro, pode substituir sim. O salmão seria uma excelente opção. Tem a mesma quantidade de proteína e ainda oferece ômega-3.",
    time: "12:42",
    read: true
  },
  {
    id: 3,
    sender: "patient",
    message: "Perfeito! E sobre os carboidratos do jantar?",
    time: "12:44",
    read: false
  }
];

export default function Conversas() {
  const { isConnected, setIsConnected, resetUnreadCount } = useWhatsApp();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Simula verificação de conectividade
  useEffect(() => {
    const checkConnection = () => {
      // Aqui seria feita a verificação real da conexão WhatsApp
      console.log("Verificando conexão WhatsApp...");
    };

    const interval = setInterval(checkConnection, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppConnection = () => {
    setIsConnected(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Enviando mensagem:", newMessage);
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <Header title="Conversas" description="Gerencie suas conversas com pacientes via WhatsApp" />
      
      {/* WhatsApp Connection Status & QR */}
      {!isConnected && (
        <Card className="bg-gradient-to-r from-green-600 to-green-700 border-green-500">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-semibold">WhatsApp Desconectado</h3>
                <p className="text-green-100 text-sm">Conecte seu WhatsApp para gerenciar conversas</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowQRModal(true)}
              className="bg-white text-green-600 hover:bg-green-50"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Conectar WhatsApp
            </Button>
          </div>
        </Card>
      )}
      
      <div className="flex h-[calc(100vh-180px)] bg-gray-900 rounded-lg overflow-hidden shadow-xl">
        {/* Lista de Conversas */}
        <div className="w-96 border-r border-gray-700 bg-gray-800">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Conversas</h2>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Conversa
              </Button>
            </div>
            
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="todos" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-green-600">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="nao-lidos" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-green-600">
                  Não lidos
                </TabsTrigger>
                <TabsTrigger value="favoritos" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-green-600">
                  Favoritos
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar conversas..."
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </Tabs>
          </div>

          <div className="overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-600 text-white">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate">
                        {conversation.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {conversation.time}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {conversation.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {/* Header do Chat */}
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-green-600 text-white">
                      {selectedConversation.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-400">{selectedConversation.phone}</p>
                  <p className="text-sm text-green-500">
                    {selectedConversation.isOnline ? 'Online' : 'Última vez hoje às 12:30'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 bg-gray-900 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'nutritionist' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'nutritionist'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'nutritionist' ? 'text-green-100' : 'text-gray-400'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!isConnected}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!isConnected || !newMessage.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
            {!isConnected && (
              <p className="text-xs text-gray-400 mt-2">
                Conecte seu WhatsApp para enviar mensagens
              </p>
            )}
          </div>
        </div>
      </div>

      <WhatsAppQRModal
        open={showQRModal}
        onOpenChange={setShowQRModal}
        onConnectionSuccess={handleWhatsAppConnection}
      />
    </div>
  );
}
