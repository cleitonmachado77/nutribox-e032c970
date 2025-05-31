
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WhatsAppConversation {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  is_archived: boolean;
}

export interface WhatsAppMessage {
  id: string;
  conversation_id: string;
  message_id: string | null;
  sender_type: 'user' | 'contact';
  content: string | null;
  message_type: string;
  timestamp: string;
  is_read: boolean;
}

export const useWhatsAppAPI = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar conversas
  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_time', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens de uma conversa
  const loadMessages = async (conversationId: string): Promise<WhatsAppMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Type assertion para garantir que sender_type seja do tipo correto
      return (data || []).map(message => ({
        ...message,
        sender_type: message.sender_type as 'user' | 'contact'
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  // Enviar mensagem
  const sendMessage = async (conversationId: string, to: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-send', {
        body: {
          conversation_id: conversationId,
          to,
          message
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Gerar QR Code
  const generateQRCode = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-session', {
        body: { action: 'generate_qr' }
      });

      if (error) throw error;
      return data.qr_code;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  // Verificar conexão
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-session', {
        body: { action: 'check_connection' }
      });

      if (error) throw error;
      return data.connected;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  };

  // Marcar mensagens como lidas
  const markAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from('whatsapp_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'contact')
        .eq('is_read', false);

      await supabase
        .from('whatsapp_conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);

      // Atualizar estado local
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // Configurar real-time para novas mensagens
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('whatsapp-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        () => {
          loadConversations(); // Recarregar conversas quando nova mensagem chegar
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whatsapp_conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    loadMessages,
    sendMessage,
    generateQRCode,
    checkConnection,
    markAsRead,
    loadConversations
  };
};
