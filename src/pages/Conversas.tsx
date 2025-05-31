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
import { useWhatsAppAPI, WhatsAppMessage } from "@/hooks/useWhatsAppAPI";

export default function Conversas() {
  const { isConnected, setIsConnected, resetUnreadCount, checkConnectionStatus } = useWhatsApp();
  const { conversations, loading, loadMessages, sendMessage, markAsRead } = useWhatsAppAPI();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Update selected conversation when conversations load
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id).then(setMessages);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const handleWhatsAppConnection = () => {
    // A conexão será gerenciada pelo modal
    console.log('WhatsApp connection successful');
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        await sendMessage(selectedConversation.id, selectedConversation.contact_phone, newMessage);
        setNewMessage("");
        // Recarregar mensagens
        const updatedMessages = await loadMessages(selectedConversation.id);
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.contact_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    conv.contact_phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <Header title="Conversas" description="Carregando conversas..." />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando...</div>
        </div>
      </div>
    );
  }

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
                  selectedConversation?.id === conversation.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-green-600 text-white">
                        {conversation.contact_name?.slice(0, 2) || conversation.contact_phone.slice(-2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate">
                        {conversation.contact_name || conversation.contact_phone}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {conversation.last_message_time 
                            ? new Date(conversation.last_message_time).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : ''
                          }
                        </span>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-green-600 hover:bg-green-700">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 truncate mb-2">
                      {conversation.last_message || 'Nenhuma mensagem'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300"
                      >
                        {conversation.contact_phone}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredConversations.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                {conversations.length === 0 ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa corresponde à busca'}
              </div>
            )}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header do Chat */}
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-green-600 text-white">
                          {selectedConversation.contact_name?.slice(0, 2) || selectedConversation.contact_phone.slice(-2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {selectedConversation.contact_name || selectedConversation.contact_phone}
                      </h3>
                      <p className="text-sm text-gray-400">{selectedConversation.contact_phone}</p>
                      <p className="text-sm text-green-500">WhatsApp</p>
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
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_type === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_type === 'user' ? 'text-green-100' : 'text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Selecione uma conversa</h3>
                <p>Escolha uma conversa da lista para começar a conversar</p>
              </div>
            </div>
          )}
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
