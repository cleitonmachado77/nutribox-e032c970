import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface EvolutionContact {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface EvolutionMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  fromMe: boolean;
  messageType: 'text' | 'image' | 'audio' | 'video' | 'document';
}

export interface EvolutionInstance {
  instanceName: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrCode?: string;
}

export const useEvolutionAPI = () => {
  const [instance, setInstance] = useState<EvolutionInstance | null>(null);
  const [contacts, setContacts] = useState<EvolutionContact[]>([]);
  const [messages, setMessages] = useState<EvolutionMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Configuração da Evolution API Local
  const API_URL = 'http://localhost:8080';
  const API_TOKEN = 'nutribox-evolution-key-2024';
  const INSTANCE_NAME = 'nutribox-instance';

  const headers = {
    'Content-Type': 'application/json',
    'apikey': API_TOKEN
  };

  // Criar instância
  const createInstance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/instance/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          token: API_TOKEN,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInstance({
          instanceName: INSTANCE_NAME,
          status: 'connecting',
          qrCode: data.qrcode?.base64
        });
        toast({
          title: "Instância criada",
          description: "Escaneie o QR Code para conectar"
        });
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar instância WhatsApp",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar status da instância
  const checkInstanceStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/instance/connectionState/${INSTANCE_NAME}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setInstance(prev => prev ? {
          ...prev,
          status: data.instance?.state === 'open' ? 'connected' : 'disconnected'
        } : null);
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  // Buscar contatos
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/chat/findContacts/${INSTANCE_NAME}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        const formattedContacts: EvolutionContact[] = data.map((contact: any) => ({
          id: contact.id,
          name: contact.pushName || contact.id.split('@')[0],
          phone: contact.id.split('@')[0],
          profilePicture: contact.profilePictureUrl,
          lastMessage: contact.lastMessage?.message,
          lastMessageTime: contact.lastMessage?.messageTimestamp ? 
            new Date(contact.lastMessage.messageTimestamp * 1000) : undefined,
          unreadCount: contact.unreadCount || 0
        }));
        
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  };

  // Buscar mensagens de um contato
  const fetchMessages = async (contactPhone: string) => {
    try {
      const response = await fetch(
        `${API_URL}/chat/findMessages/${INSTANCE_NAME}?where[key.remoteJid]=${contactPhone}@s.whatsapp.net`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedMessages: EvolutionMessage[] = data.map((msg: any) => ({
          id: msg.key.id,
          from: msg.key.remoteJid,
          to: msg.key.remoteJid,
          body: msg.message?.conversation || msg.message?.extendedTextMessage?.text || '',
          timestamp: new Date(msg.messageTimestamp * 1000),
          fromMe: msg.key.fromMe,
          messageType: 'text'
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  // Enviar mensagem
  const sendMessage = async (to: string, message: string) => {
    try {
      const response = await fetch(`${API_URL}/message/sendText/${INSTANCE_NAME}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          number: to,
          text: message
        })
      });

      if (response.ok) {
        toast({
          title: "Mensagem enviada",
          description: "Sua mensagem foi enviada com sucesso"
        });
        return true;
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive"
      });
    }
    return false;
  };

  useEffect(() => {
    if (instance?.status === 'connected') {
      fetchContacts();
    }
  }, [instance?.status]);

  return {
    instance,
    contacts,
    messages,
    loading,
    createInstance,
    checkInstanceStatus,
    fetchContacts,
    fetchMessages,
    sendMessage
  };
};
