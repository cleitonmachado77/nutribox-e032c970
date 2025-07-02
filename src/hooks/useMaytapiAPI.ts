import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MaytapiSession {
  id: string;
  isConnected: boolean;
  qrCode?: string;
  phoneId: string;
  screen: string;
}

export interface MaytapiConversation {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  is_archived: boolean;
}

export interface MaytapiMessage {
  id: string;
  conversation_id: string;
  message_id: string | null;
  sender_type: 'user' | 'contact';
  content: string | null;
  message_type: string;
  timestamp: string;
  is_read: boolean;
}

export const useMaytapiAPI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<MaytapiSession | null>(null);
  const [conversations, setConversations] = useState<MaytapiConversation[]>([]);
  const [loading, setLoading] = useState(false);

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
    }
  };

  // Carregar mensagens de uma conversa
  const loadMessages = async (conversationId: string): Promise<MaytapiMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(message => ({
        ...message,
        sender_type: message.sender_type as 'user' | 'contact'
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  // Obter QR Code
  const getQRCode = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('maytapi-session', {
        body: { action: 'get_qr' }
      });

      if (error) {
        console.error('Error from function:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSession({
        id: 'maytapi-session',
        isConnected: data.is_connected || false,
        qrCode: data.qr_code,
        phoneId: '98308',
        screen: data.screen || 'unknown'
      });

      if (!data.is_connected && data.qr_code) {
        toast({
          title: "QR Code gerado",
          description: "Escaneie o QR code no seu WhatsApp para conectar"
        });
      } else if (data.is_connected) {
        toast({
          title: "WhatsApp conectado",
          description: "Sua conta já está conectada!"
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error getting QR code:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao obter QR code",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Verificar conexão
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('maytapi-session', {
        body: { action: 'check_connection' }
      });

      if (error) {
        console.error('Connection check error:', error);
        return false;
      }

      const isConnected = data?.connected || false;
      
      setSession(prev => prev ? {
        ...prev,
        isConnected,
        screen: data?.screen || 'unknown'
      } : null);

      return isConnected;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  };

  // Desconectar
  const disconnect = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('maytapi-session', {
        body: { action: 'disconnect' }
      });

      if (error) throw error;

      setSession(null);
      toast({
        title: "Desconectado",
        description: "WhatsApp foi desconectado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erro",
        description: "Falha ao desconectar WhatsApp",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Enviar mensagem
  const sendMessage = async (conversationId: string, to: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('maytapi-send', {
        body: {
          conversation_id: conversationId,
          to,
          message
        }
      });

      if (error) {
        console.error('Error from function:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Recarregar conversas para atualizar última mensagem
      await loadConversations();

      return data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar mensagem",
        variant: "destructive"
      });
      throw error;
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

  // Carregar sessão existente
  useEffect(() => {
    if (user) {
      const loadSession = async () => {
        try {
          const { data } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (data) {
            const sessionData = data.session_data as any;
            setSession({
              id: data.id,
              isConnected: data.is_connected || false,
              qrCode: data.qr_code || undefined,
              phoneId: '98308',
              screen: sessionData?.screen || 'unknown'
            });
          }
        } catch (error) {
          console.log('No session found');
        }
      };

      loadSession();
      loadConversations();
    }
  }, [user]);

  // Configurar real-time para novas mensagens
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('maytapi-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages'
        },
        () => {
          loadConversations();
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
    session,
    conversations,
    loading,
    getQRCode,
    checkConnection,
    disconnect,
    sendMessage,
    loadMessages,
    markAsRead,
    loadConversations
  };
};