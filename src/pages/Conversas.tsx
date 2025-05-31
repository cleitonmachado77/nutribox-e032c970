
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ConversationsList } from "@/components/ConversationsList";
import { ChatWindow } from "@/components/ChatWindow";
import { WhatsAppConnection } from "@/components/WhatsAppConnection";
import { useEvolutionAPI, EvolutionContact } from "@/hooks/useEvolutionAPI";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { Button } from "@/components/ui/button";
import { Settings, Zap } from "lucide-react";

export default function Conversas() {
  const { resetUnreadCount } = useWhatsApp();
  const [selectedContact, setSelectedContact] = useState<EvolutionContact | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const {
    instance,
    contacts,
    messages,
    loading,
    createInstance,
    checkInstanceStatus,
    fetchContacts,
    fetchMessages,
    sendMessage
  } = useEvolutionAPI();

  // Reset unread count when entering conversations page
  useEffect(() => {
    resetUnreadCount();
  }, [resetUnreadCount]);

  // Check instance status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (instance) {
        checkInstanceStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [instance, checkInstanceStatus]);

  // Fetch contacts when connected
  useEffect(() => {
    if (instance?.status === 'connected') {
      fetchContacts();
    }
  }, [instance?.status]);

  const handleSelectContact = async (contact: EvolutionContact) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
    await fetchMessages(contact.phone);
  };

  const handleSendMessage = async (message: string) => {
    if (selectedContact) {
      const success = await sendMessage(selectedContact.phone, message);
      if (success) {
        // Refresh messages after sending
        await fetchMessages(selectedContact.phone);
      }
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedContact(null);
  };

  // Show connection screen if not connected
  if (!instance || instance.status !== 'connected') {
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
                <h3 className="text-white font-semibold">Evolution API - WhatsApp Business</h3>
                <p className="text-green-100 text-sm">
                  Gerencie todas as suas conversas WhatsApp em um só lugar
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="secondary" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <WhatsAppConnection
            instance={instance}
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
              <h3 className="text-white font-semibold">WhatsApp Conectado</h3>
              <p className="text-green-100 text-sm">
                {contacts.length} conversas encontradas
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={fetchContacts}
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
