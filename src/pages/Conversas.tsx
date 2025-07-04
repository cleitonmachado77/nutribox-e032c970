import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { useEvolutionSupabase } from "@/hooks/useEvolutionSupabase";
import { WhatsAppConnection } from "@/components/WhatsAppConnection";
import { WhatsAppStatusIndicator } from "@/components/WhatsAppStatusIndicator";
import { EvolutionAPIErrorHandler } from "@/components/EvolutionAPIErrorHandler";
import { EvolutionAPIConfig } from "@/components/EvolutionApiConfig";
import { ConnectionDebugger } from "@/components/ConnectionDebugger";
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
  WifiOff,
  RefreshCw,
  Bot,
  User,
  Smartphone,
  Monitor,
  MessageCircle,
  MoreHorizontal,
  Bug
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EvolutionContact, EvolutionMessage, EvolutionSession } from "@/hooks/useEvolutionSupabase";

interface EvolutionAPIError {
  message: string;
  status?: number;
  details?: string;
  timestamp?: string;
}

export default function Conversas() {
  const { toast } = useToast();
  const [selectedContact, setSelectedContact] = useState<EvolutionContact | null>(null);
  const [messages, setMessages] = useState<EvolutionMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<EvolutionAPIError | null>(null);
  const [showErrorHandler, setShowErrorHandler] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    session,
    contacts,
    loading,
    createInstance,
    checkInstanceStatus,
    fetchContacts,
    fetchMessages,
    sendMessage
  } = useEvolutionSupabase();

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-check status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.status === 'connected') {
        checkInstanceStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [session?.status]);

  // Fetch contacts when connected
  useEffect(() => {
    if (session?.status === 'connected') {
      // Delay to ensure instance is fully ready and avoid multiple calls
      const timer = setTimeout(() => {
        console.log('Iniciando busca de contatos...');
        fetchContacts().catch((err) => {
          console.error('Erro ao buscar contatos:', err);
          setError({
            message: err.message || 'Erro ao buscar contatos',
            timestamp: new Date().toISOString()
          });
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [session?.status]);

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact => 
    contact && contact.name && contact.phone &&
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.phone.includes(searchTerm))
  );

  const handleSelectContact = async (contact: EvolutionContact) => {
    setSelectedContact(contact);
    setError(null); // Clear any previous errors
    
    try {
      // Load messages for this contact
      const contactMessages = await fetchMessages(contact.phone);
      setMessages(contactMessages);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError({
        message: err.message || 'Erro ao carregar mensagens',
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    try {
      setError(null); // Clear any previous errors
      const success = await sendMessage(selectedContact.phone, newMessage);
      
      if (success) {
        // Add message to local state immediately for better UX
        const newMsg: EvolutionMessage = {
          id: Date.now().toString(),
          conversationId: selectedContact.phone,
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
          try {
            const contactMessages = await fetchMessages(selectedContact.phone);
            setMessages(contactMessages);
          } catch (err) {
            console.error('Erro ao recarregar mensagens:', err);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError({
        message: err.message || 'Falha ao enviar mensagem',
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setShowErrorHandler(false);
    
    if (session?.status === 'connected') {
      fetchContacts().catch((err) => {
        setError({
          message: err.message || 'Erro ao buscar contatos',
          timestamp: new Date().toISOString()
        });
      });
    } else {
      createInstance();
    }
  };

  const handleConfigure = () => {
    // This could open a settings modal or navigate to settings page
    toast({
      title: "Configurações",
      description: "Verifique as configurações do Evolution API no painel do Supabase"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Show error handler if there's an error and user wants to see it
  if (error && showErrorHandler) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Header 
          title="Conversas WhatsApp - Evolution API" 
          description="Central de conversas integrada com Evolution API" 
        />
        
        <EvolutionAPIErrorHandler
          error={error}
          onRetry={handleRetry}
          onConfigure={handleConfigure}
        />
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setShowErrorHandler(false)}
            variant="outline"
          >
            Voltar para Conversas
          </Button>
        </div>
      </div>
    );
  }

  // Check if WhatsApp needs connection or is connecting
  if (!session || session.status === 'disconnected' || session.status === 'connecting') {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Header 
          title="Conversas WhatsApp - Evolution API" 
          description="Central de conversas integrada com Evolution API" 
        />
        
        <WhatsAppStatusIndicator
          session={session}
          onConnect={createInstance}
          onRefresh={checkInstanceStatus}
          loading={loading}
        />

        {session?.status === 'connecting' && session.qrCode && (
          <WhatsAppConnection
            instance={session}
            onConnect={createInstance}
            onRefresh={checkInstanceStatus}
            loading={loading}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                Multi-Tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Cada usuário possui sua própria instância isolada do WhatsApp
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-green-500" />
                Evolution API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Integração nativa com Evolution API para WhatsApp Business
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-500" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Autenticação individual via QR Code para cada usuário
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <EvolutionAPIErrorHandler 
            error={error}
            onRetry={handleRetry}
            onConfigure={handleConfigure}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <Header 
          title="Conversas WhatsApp - Evolution API" 
          description="Central de conversas integrada com Evolution API" 
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setShowDebug(!showDebug)}
            variant="outline"
            size="sm"
          >
            <Bug className="w-4 h-4 mr-2" />
            {showDebug ? 'Ocultar' : 'Debug'}
          </Button>
          <Button
            onClick={() => setShowConfig(!showConfig)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showConfig ? 'Ocultar' : 'Configuração'}
          </Button>
        </div>
      </div>
      
      {/* Debug Panel */}
      {showDebug && (
        <ConnectionDebugger />
      )}

      {/* Configuration Panel */}
      {showConfig && (
        <EvolutionAPIConfig />
      )}
      
      {/* Error Alert */}
      {error && !showErrorHandler && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error.message}</span>
              <Button 
                onClick={() => setShowErrorHandler(true)}
                variant="outline" 
                size="sm"
                className="ml-2"
              >
                Ver Detalhes
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Status do WhatsApp */}
      <WhatsAppStatusIndicator
        session={session}
        onConnect={createInstance}
        onRefresh={checkInstanceStatus}
        loading={loading}
      />

      {/* Aviso de Mixed Content - só mostra se for HTTPS tentando acessar HTTP */}
      {window.location.protocol === 'https:' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div>
              <p className="font-medium mb-1">⚠️ Aviso de Segurança (Mixed Content):</p>
              <p className="text-sm mb-2">
                Sua aplicação roda em HTTPS mas o servidor Evolution API está em HTTP. 
                Isso pode causar bloqueios de segurança no navegador.
              </p>
              <div className="text-xs space-y-1">
                <p><strong>Soluções:</strong></p>
                <p>• Configure HTTPS no servidor: <code>https://134.199.202.47</code></p>
                <p>• Use um proxy HTTPS (Cloudflare, Nginx)</p>
                <p>• Configure um domínio com certificado SSL</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Interface de Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Lista de Conversas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversas ({filteredContacts.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                  <p className="text-sm">
                    {session.status === 'connected' 
                      ? 'Aguardando mensagens...' 
                      : 'Conecte-se para ver conversas'
                    }
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
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
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{contact.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="lg:col-span-2">
          {selectedContact ? (
            <>
              {/* Header do Chat */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Bot className="w-3 h-3 mr-1" />
                      Evolution API
                    </Badge>
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
                          <div className="flex items-end gap-2 max-w-[80%]">
                            {!message.fromMe && (
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={selectedContact.profilePicture} />
                                <AvatarFallback className="text-xs">
                                  {selectedContact.name.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
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
                                  <CheckCircle2 className="w-3 h-3 text-blue-100" />
                                )}
                              </div>
                            </div>
                            {message.fromMe && (
                              <div className="flex items-center">
                                <User className="w-6 h-6 text-blue-500" />
                              </div>
                            )}
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
                      disabled={session.status !== 'connected'}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || session.status !== 'connected'}
                      size="icon"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {session.status !== 'connected' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Conecte-se ao WhatsApp para enviar mensagens
                    </p>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p>Escolha um contato da lista para começar a conversar</p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Conversas aparecem automaticamente quando você recebe mensagens
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}