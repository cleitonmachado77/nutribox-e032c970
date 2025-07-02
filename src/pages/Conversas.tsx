import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useUserSettings } from "@/hooks/useUserSettings";
import { usePacientes } from "@/hooks/usePacientes";
import { WhatsAppQRModal } from "@/components/WhatsAppQRModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageSquare, 
  Search, 
  Phone,
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  UserPlus,
  QrCode,
  Wifi,
  WifiOff
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

interface Message {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  fromMe: boolean;
  messageType: 'text' | 'image' | 'audio' | 'video' | 'document';
  isRead: boolean;
}

export default function Conversas() {
  const { data: userSettings } = useUserSettings();
  const { data: pacientes = [] } = usePacientes();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("conversas");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPacientes, setSearchPacientes] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
    checkConnection,
    disconnect
  } = useWhatsAppAPI();

  // Check connection status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const connected = await checkConnection();
      setIsConnected(connected);
    };
    checkStatus();
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert conversations to contacts format
  const contacts: Contact[] = conversations
    .map(conv => ({
      id: conv.id,
      name: conv.contact_name || conv.contact_phone.replace(/\D/g, '').slice(-8),
      phone: conv.contact_phone,
      lastMessage: conv.last_message || undefined,
      lastMessageTime: conv.last_message_time ? new Date(conv.last_message_time) : undefined,
      unreadCount: conv.unread_count
    }))
    .filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    );

  // Filter pacientes for search
  const filteredPacientes = pacientes.filter(paciente => 
    paciente.lead?.nome?.toLowerCase().includes(searchPacientes.toLowerCase()) ||
    paciente.lead?.telefone?.includes(searchPacientes)
  );

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setActiveTab("conversas"); // Switch to conversations tab when selecting a contact
    
    // Mark as read
    await markAsRead(contact.id);
    
    // Load messages
    const contactMessages = await loadMessages(contact.id);
    const formattedMessages: Message[] = contactMessages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      from: msg.sender_type === 'contact' ? contact.phone : 'me',
      to: msg.sender_type === 'user' ? contact.phone : 'me',
      body: msg.content || '',
      timestamp: new Date(msg.timestamp),
      fromMe: msg.sender_type === 'user',
      messageType: 'text',
      isRead: msg.is_read || false
    }));
    setMessages(formattedMessages);
  };

  const handleSelectPaciente = async (paciente: any) => {
    if (!paciente.lead?.telefone) {
      toast({
        title: "Erro",
        description: "Este paciente não possui telefone cadastrado",
        variant: "destructive"
      });
      return;
    }

    // Try to find existing conversation or create a new contact
    const existingContact = contacts.find(c => c.phone === paciente.lead.telefone);
    
    if (existingContact) {
      await handleSelectContact(existingContact);
    } else {
      // Create new conversation
      const newContact: Contact = {
        id: `new-${Date.now()}`,
        name: paciente.lead.nome,
        phone: paciente.lead.telefone,
        lastMessage: undefined,
        lastMessageTime: undefined,
        unreadCount: 0
      };
      
      setSelectedContact(newContact);
      setMessages([]);
      setActiveTab("conversas");
      
      toast({
        title: "Nova conversa",
        description: `Conversa iniciada com ${paciente.lead.nome}`,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    try {
      await sendMessage(selectedContact.id, selectedContact.phone, newMessage);
      
      // Add message to local state immediately for better UX
      const newMsg: Message = {
        id: Date.now().toString(),
        conversationId: selectedContact.id,
        from: 'me',
        to: selectedContact.phone,
        body: newMessage,
        timestamp: new Date(),
        fromMe: true,
        messageType: 'text',
        isRead: true
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Reload messages after a short delay to get the actual message from server
      setTimeout(async () => {
        const contactMessages = await loadMessages(selectedContact.id);
        const formattedMessages: Message[] = contactMessages.map(msg => ({
          id: msg.id,
          conversationId: msg.conversation_id,
          from: msg.sender_type === 'contact' ? selectedContact.phone : 'me',
          to: msg.sender_type === 'user' ? selectedContact.phone : 'me',
          body: msg.content || '',
          timestamp: new Date(msg.timestamp),
          fromMe: msg.sender_type === 'user',
          messageType: 'text',
          isRead: msg.is_read || false
        }));
        setMessages(formattedMessages);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Check if WhatsApp is configured
  if (!userSettings?.whatsapp_business_number) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Header 
          title="Conversas WhatsApp" 
          description="Central de conversas com seus pacientes" 
        />
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span>
              Configure seu número do WhatsApp Business nas configurações para começar a usar as conversas.
            </span>
            <Button asChild size="sm">
              <Link to="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Header 
        title="Conversas WhatsApp" 
        description="Central de conversas com seus pacientes" 
      />
      
      {/* Status do WhatsApp */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium">
                  WhatsApp Business {isConnected ? 'Conectado' : 'Desconectado'}
                </p>
                <p className="text-sm text-gray-600">
                  Número: {userSettings.whatsapp_business_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={() => setShowQRModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Conectar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface de Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Painel Lateral */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="conversas" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Conversas ({contacts.length})
                </TabsTrigger>
                <TabsTrigger value="pacientes" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Pacientes ({pacientes.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="conversas" className="mt-0">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar conversas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <ScrollArea className="h-[400px]">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
                    </div>
                  ) : (
                    contacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => handleSelectContact(contact)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={contact.profilePicture} />
                            <AvatarFallback>
                              {contact.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{contact.name}</p>
                              {contact.lastMessageTime && (
                                <span className="text-xs text-gray-500">
                                  {formatTime(contact.lastMessageTime)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-600 truncate">
                                {contact.lastMessage || "Nenhuma mensagem"}
                              </p>
                              {contact.unreadCount && contact.unreadCount > 0 && (
                                <Badge className="bg-green-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                  {contact.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="pacientes" className="mt-0">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar pacientes..."
                      value={searchPacientes}
                      onChange={(e) => setSearchPacientes(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <ScrollArea className="h-[400px]">
                  {filteredPacientes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {searchPacientes ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
                      {!searchPacientes && (
                        <div className="mt-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to="/dashboard/pacientes">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Cadastrar Paciente
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    filteredPacientes.map((paciente) => (
                      <div
                        key={paciente.id}
                        onClick={() => handleSelectPaciente(paciente)}
                        className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={paciente.lead?.foto_perfil} />
                            <AvatarFallback>
                              {paciente.lead?.nome?.slice(0, 2).toUpperCase() || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{paciente.lead?.nome || 'Nome não informado'}</p>
                              <Badge variant={paciente.status_tratamento === 'ativo' ? 'default' : 'secondary'}>
                                {paciente.status_tratamento}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {paciente.lead?.telefone || 'Telefone não informado'}
                              </p>
                            </div>
                            {paciente.lead?.objetivo && (
                              <p className="text-xs text-gray-500 mt-1">
                                Objetivo: {paciente.lead.objetivo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="lg:col-span-2">
          {selectedContact ? (
            <>
              {/* Header do Chat */}
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedContact.profilePicture} />
                    <AvatarFallback>
                      {selectedContact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Mensagens */}
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Nenhuma mensagem ainda</p>
                        <p className="text-sm">Envie a primeira mensagem!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.fromMe
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.body}</p>
                            <div className={`flex items-center gap-1 mt-1 ${
                              message.fromMe ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className={`text-xs ${
                                message.fromMe ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </span>
                              {message.fromMe && (
                                <Clock className="w-3 h-3 text-blue-100" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input de Mensagem */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p>Escolha um contato da lista para começar a conversar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* WhatsApp QR Modal */}
      <WhatsAppQRModal 
        open={showQRModal} 
        onOpenChange={setShowQRModal} 
      />
    </div>
  );
}