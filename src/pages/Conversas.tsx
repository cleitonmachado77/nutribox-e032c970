
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatWindow } from "@/components/ChatWindow";
import { WhatsAppConnection } from "@/components/WhatsAppConnection";
import { useEvolutionSupabase, EvolutionContact } from "@/hooks/useEvolutionSupabase";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { Button } from "@/components/ui/button";
import { Settings, Zap, Database } from "lucide-react";

export default function Conversas() {
  const { resetUnreadCount } = useWhatsApp();
  const [selectedContact, setSelectedContact] = useState<EvolutionContact | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

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

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Check instance status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (session) {
        checkInstanceStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [session, checkInstanceStatus]);

  // Fetch contacts when connected
  useEffect(() => {
    if (session?.status === 'connected') {
      fetchContacts();
    }
  }, [session?.status]);

  const handleSelectContact = async (contact: EvolutionContact) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
    const contactMessages = await fetchMessages(contact.phone);
    setMessages(contactMessages);
  };

  const handleSendMessage = async (message: string) => {
    if (selectedContact) {
      const success = await sendMessage(selectedContact.phone, message);
      if (success) {
        // Refresh messages after sending
        const contactMessages = await fetchMessages(selectedContact.phone);
        setMessages(contactMessages);
      }
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedContact(null);
  };

  // Show connection screen if not connected
  if (!session || session.status !== 'connected') {
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
                <h3 className="text-white font-semibold">Evolution API + Supabase</h3>
                <p className="text-green-100 text-sm">
                  WhatsApp Business integrado com banco de dados online
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
            instance={session}
            onConnect={createInstance}
            onRefresh={checkInstanceStatus}
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
                {contacts.length} conversas sincronizadas com banco online
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Database className="h-4 w-4 text-white" />
            <Button 
              variant="secondary" 
              size="sm"
              onClick={fetchContacts}
              disabled={loading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Sincronizar
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
