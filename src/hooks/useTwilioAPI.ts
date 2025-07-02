import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TwilioSubaccount {
  id: string;
  subaccount_sid: string;
  subaccount_token: string;
  friendly_name: string;
  consultorio_nome: string;
  cidade?: string;
  is_active: boolean;
  user_twilio_numbers?: TwilioNumber[];
}

export interface TwilioNumber {
  id: string;
  subaccount_sid?: string;
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
  const [userSubaccount, setUserSubaccount] = useState<TwilioSubaccount | null>(null);
  const [conversations, setConversations] = useState<TwilioConversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load user's Twilio subaccount
  const loadUserSubaccount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('twilio-subaccount-management', {
        body: { action: 'get_user_subaccount' }
      });

      if (error) throw error;

      if (data.has_subaccount) {
        setUserSubaccount(data.subaccount_data);
      } else {
        setUserSubaccount(null);
      }
    } catch (error) {
      console.error('Error loading user subaccount:', error);
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

  // Create subaccount
  const createSubaccount = async (consultorioNome: string, cidade?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-subaccount-management', {
        body: { 
          action: 'create_subaccount',
          consultorio_nome: consultorioNome,
          cidade: cidade 
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      await loadUserSubaccount(); // Reload user subaccount
      
      toast({
        title: "Subconta criada!",
        description: `Sua subconta "${consultorioNome}" foi criada com sucesso.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating subaccount:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar subconta",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provision WhatsApp number
  const provisionWhatsAppNumber = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-subaccount-management', {
        body: { action: 'provision_whatsapp_number' }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      await loadUserSubaccount(); // Reload user subaccount
      
      toast({
        title: "Número WhatsApp provisionado!",
        description: `Seu número WhatsApp ${data.phone_number} foi configurado com sucesso.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error provisioning WhatsApp number:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao provisionar número WhatsApp",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Send message using subaccount
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

  // Send automated message via NutriCoach AI
  const sendNutriCoachMessage = async (patientPhone: string, patientName: string, messageType: 'questionnaire' | 'motivational' | 'reminder', patientData?: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('nutricoach-ai', {
        body: {
          action: messageType === 'questionnaire' ? 'generate_questionnaire' : 
                  messageType === 'motivational' ? 'generate_motivational' : 'generate_reminder',
          patientName,
          patientPhone,
          messageType,
          patientData
        }
      });

      if (error) throw error;

      toast({
        title: "Mensagem NutriCoach enviada",
        description: `Mensagem ${messageType} enviada para ${patientName} via WhatsApp`,
      });

      return data;
    } catch (error: any) {
      console.error('Error sending NutriCoach message:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar mensagem do NutriCoach",
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

  // Release subaccount
  const releaseSubaccount = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('twilio-subaccount-management', {
        body: { action: 'release_subaccount' }
      });

      if (error) throw error;

      setUserSubaccount(null);
      setConversations([]);
      
      toast({
        title: "Subconta liberada",
        description: "Sua subconta Twilio foi liberada com sucesso"
      });

      return data;
    } catch (error: any) {
      console.error('Error releasing subaccount:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao liberar subconta",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadUserSubaccount();
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
    userSubaccount,
    userNumber: userSubaccount?.user_twilio_numbers?.[0] || null, // Backward compatibility
    conversations,
    loading,
    createSubaccount,
    provisionNumber: createSubaccount, // Backward compatibility
    provisionWhatsAppNumber,
    sendMessage,
    sendNutriCoachMessage,
    loadMessages,
    markAsRead,
    releaseSubaccount,
    releaseNumber: releaseSubaccount, // Backward compatibility
    loadConversations,
    loadUserSubaccount,
    loadUserNumber: loadUserSubaccount // Backward compatibility
  };
};