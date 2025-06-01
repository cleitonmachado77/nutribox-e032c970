
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatWindow } from "@/components/ChatWindow";
import { WhatsAppConnection } from "@/components/WhatsAppConnection";
import { useWhatsAppAPI } from "@/hooks/useWhatsAppAPI";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { Button } from "@/components/ui/button";
import { Settings, Zap, Database } from "lucide-react";

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
  const { resetUnreadCount } = useWhatsApp();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const {
    conversations,
    loading,
    loadMessages,
    sendMessage,
    generateQRCode,
    checkConnection,
    disconnect,
    markAsRead
  } = useWhatsAppAPI();

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Check connection status on mount
  useEffect(() => {
    const checkStatus = async () => {
      const connected = await checkConnection();
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    };
    checkStatus();
  }, [checkConnection]);

  // Convert conversations to contacts format
  const contacts: Contact[] = conversations.map(conv => ({
    id: conv.id,
    name: conv.contact_name || conv.contact_phone,
    phone: conv.contact_phone,
    lastMessage: conv.last_message || undefined,
    lastMessageTime: conv.last_message_time ? new Date(conv.last_message_time) : undefined,
    unreadCount: conv.unread_count
  }));

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    try {
      const result = await generateQRCode();
      if (result.qr_code) {
        setQrCode(result.qr_code);
        // Simulate connection after QR scan
        setTimeout(() => {
          setConnectionStatus('connected');
          setQrCode(null);
        }, 15000);
      }
    } catch (error) {
      console.error('Erro ao gerar QR:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleRefresh = async () => {
    const connected = await checkConnection();
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  };

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
    
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

  const handleSendMessage = async (message: string) => {
    if (selectedContact) {
      try {
        await sendMessage(selectedContact.id, selectedContact.phone, message);
        // Reload messages after sending
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
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedContact(null);
  };

  // Show connection screen if not connected
  if (connectionStatus !== 'connected') {
    return (
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <Header 
          title="Conversas WhatsApp" 
          description="Conecte sua conta do WhatsApp para gerenciar conversas" 
        />
        
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-white font-semibold">WhatsApp via Supabase</h3>
                <p className="text-green-100 text-sm">
                  Sistema integrado com banco de dados online
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Database className="h-5 w-5 text-white" />
              <span className="text-white text-sm">Supabase Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <WhatsAppConnection
            instance={{
              instanceName: 'supabase-instance',
              status: connectionStatus,
              qrCode
            }}
            onConnect={handleConnect}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <Header 
        title="Conversas WhatsApp" 
        description="Gerencie todas as suas conversas do WhatsApp" 
      />
      
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold">WhatsApp + Supabase Conectado</h3>
              <p className="text-green-100 text-sm">
                {contacts.length} conversas sincronizadas via Supabase
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Database className="h-4 w-4 text-white" />
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-280px)]">
        <div className="flex h-full">
          {/* Mobile Layout */}
          <div className="md:hidden w-full">
            {!showMobileChat ? (
              <ConversationsList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={handleSelectContact}
                loading={loading}
              />
            ) : (
              <ChatWindow
                contact={selectedContact}
                messages={messages}
                onSendMessage={handleSendMessage}
                onBack={handleBackToList}
                loading={loading}
              />
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex w-full">
            <ConversationsList
              contacts={contacts}
              selectedContact={selectedContact}
              onSelectContact={handleSelectContact}
              loading={loading}
            />
            <ChatWindow
              contact={selectedContact}
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
