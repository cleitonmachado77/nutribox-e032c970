
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface EvolutionSession {
  id: string;
  instanceName: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrCode?: string;
  phoneNumber?: string;
}

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
  conversationId: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  fromMe: boolean;
  messageType: 'text' | 'image' | 'audio' | 'video' | 'document';
  isRead: boolean;
}

export const useEvolutionSupabase = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<EvolutionSession | null>(null);
  const [contacts, setContacts] = useState<EvolutionContact[]>([]);
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

  // Sincronizar sessão com Supabase
  const syncSessionWithSupabase = async (sessionData: Partial<EvolutionSession>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('whatsapp_sessions')
        .upsert({
          user_id: user.id,
          phone_number: sessionData.phoneNumber || null,
          is_connected: sessionData.status === 'connected',
          qr_code: sessionData.qrCode || null,
          session_data: sessionData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao sincronizar sessão:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar sessão no Supabase:', error);
    }
  };

  // Sincronizar contatos com Supabase
  const syncContactsWithSupabase = async (contactsData: EvolutionContact[]) => {
    if (!user) return;

    try {
      for (const contact of contactsData) {
        // Verificar se já existe conversa
        const { data: existingConversation } = await supabase
          .from('whatsapp_conversations')
          .select('id')
          .eq('user_id', user.id)
          .eq('contact_phone', contact.phone)
          .single();

        if (!existingConversation) {
          // Criar nova conversa
          await supabase
            .from('whatsapp_conversations')
            .insert({
              user_id: user.id,
              contact_phone: contact.phone,
              contact_name: contact.name,
              last_message: contact.lastMessage || null,
              last_message_time: contact.lastMessageTime?.toISOString() || null,
              unread_count: contact.unreadCount || 0
            });
        } else {
          // Atualizar conversa existente
          await supabase
            .from('whatsapp_conversations')
            .update({
              contact_name: contact.name,
              last_message: contact.lastMessage || null,
              last_message_time: contact.lastMessageTime?.toISOString() || null,
              unread_count: contact.unreadCount || 0
            })
            .eq('id', existingConversation.id);
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar contatos:', error);
    }
  };

  // Criar instância Evolution
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
        const newSession: EvolutionSession = {
          id: INSTANCE_NAME,
          instanceName: INSTANCE_NAME,
          status: 'connecting',
          qrCode: data.qrcode?.base64
        };
        
        setSession(newSession);
        await syncSessionWithSupabase(newSession);
        
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
        const isConnected = data.instance?.state === 'open';
        
        const updatedSession = session ? {
          ...session,
          status: isConnected ? 'connected' as const : 'disconnected' as const
        } : null;
        
        setSession(updatedSession);
        
        if (updatedSession) {
          await syncSessionWithSupabase(updatedSession);
        }
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
        await syncContactsWithSupabase(formattedContacts);
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
  };

  // Buscar mensagens de um contato
  const fetchMessages = async (contactPhone: string): Promise<EvolutionMessage[]> => {
    try {
      const response = await fetch(
        `${API_URL}/chat/findMessages/${INSTANCE_NAME}?where[key.remoteJid]=${contactPhone}@s.whatsapp.net`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.map((msg: any) => ({
          id: msg.key.id,
          conversationId: contactPhone,
          from: msg.key.remoteJid,
          to: msg.key.remoteJid,
          body: msg.message?.conversation || msg.message?.extendedTextMessage?.text || '',
          timestamp: new Date(msg.messageTimestamp * 1000),
          fromMe: msg.key.fromMe,
          messageType: 'text' as const,
          isRead: true
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
    return [];
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

  // Carregar sessão do Supabase ao inicializar
  useEffect(() => {
    if (user) {
      const loadSession = async () => {
        try {
          const { data } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_connected', true)
            .single();

          if (data) {
            setSession({
              id: data.id,
              instanceName: INSTANCE_NAME,
              status: data.is_connected ? 'connected' : 'disconnected',
              phoneNumber: data.phone_number || undefined,
              qrCode: data.qr_code || undefined
            });
          }
        } catch (error) {
          console.log('Nenhuma sessão ativa encontrada');
        }
      };

      loadSession();
    }
  }, [user]);

  return {
    session,
    contacts,
    loading,
    createInstance,
    checkInstanceStatus,
    fetchContacts,
    fetchMessages,
    sendMessage
  };
};
