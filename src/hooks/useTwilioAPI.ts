import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TwilioNumber {
  id: string;
  twilio_phone_number: string;
  twilio_phone_sid: string;
  consultorio_nome: string;
  cidade?: string;
  is_active: boolean;
}

export interface TwilioConversation {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  is_archived: boolean;
  user_id: string;
}

export interface TwilioMessage {
  id: string;
  conversation_id: string;
  message_id: string | null;
  sender_type: 'user' | 'contact';
  content: string | null;
  message_type: string;
  timestamp: string;
  is_read: boolean;
}

export const useTwilioAPI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userNumber, setUserNumber] = useState<TwilioNumber | null>(null);
  const [conversations, setConversations] = useState<TwilioConversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's Twilio number
  const loadUserNumber = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('twilio-phone-management', {
        body: { action: 'get_user_number' }
      });

      if (error) throw error;

      if (data.has_number) {
        setUserNumber(data.number_data);
      } else {
        setUserNumber(null);
      }
    } catch (error) {
      console.error('Error loading user number:', error);
    }
  };

  // Load conversations
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

  // Load messages from a conversation
  const loadMessages = async (conversationId: string): Promise<TwilioMessage[]> => {
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

  // Provision a new number
  const provisionNumber = async (consultorioNome: string, cidade?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-phone-management', {
        body: { 
          action: 'provision_number',
          consultorio_nome: consultorioNome,
          cidade: cidade 
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      await loadUserNumber(); // Reload user number
      
      toast({
        title: "Número provisionado!",
        description: `Seu número WhatsApp ${data.phone_number} foi configurado com sucesso.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error provisioning number:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao provisionar número",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (conversationId: string, to: string, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('twilio-whatsapp-send', {
        body: {
          conversation_id: conversationId,
          to,
          message
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Reload conversations to update last message
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

  // Mark messages as read
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

      // Update local state
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

  // Release number
  const releaseNumber = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('twilio-phone-management', {
        body: { action: 'release_number' }
      });

      if (error) throw error;

      setUserNumber(null);
      setConversations([]);
      
      toast({
        title: "Número liberado",
        description: "Seu número WhatsApp foi liberado com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error releasing number:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao liberar número",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadUserNumber();
      loadConversations();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('twilio-changes')
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
    userNumber,
    conversations,
    loading,
    provisionNumber,
    sendMessage,
    loadMessages,
    markAsRead,
    releaseNumber,
    loadConversations,
    loadUserNumber
  };
};