import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EvolutionAPIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  instanceName?: string;
}

export const useSecureEvolutionAPI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const makeSecureRequest = async (request: EvolutionAPIRequest) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('evolution-api-proxy', {
        body: request
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Secure Evolution API request failed:', error);
      toast({
        title: "Erro de Segurança",
        description: "Falha na comunicação segura com WhatsApp API",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Secure wrapper methods
  const checkInstanceStatus = async (instanceName: string) => {
    return makeSecureRequest({
      endpoint: `/instance/connectionState/${instanceName}`,
      method: 'GET',
      instanceName
    });
  };

  const fetchContacts = async (instanceName: string) => {
    return makeSecureRequest({
      endpoint: `/instance/fetchContacts/${instanceName}`,
      method: 'GET',
      instanceName
    });
  };

  const fetchChats = async (instanceName: string) => {
    return makeSecureRequest({
      endpoint: `/chat/fetchChats/${instanceName}`,
      method: 'GET',
      instanceName
    });
  };

  const sendMessage = async (instanceName: string, phoneNumber: string, message: string) => {
    return makeSecureRequest({
      endpoint: `/message/sendText/${instanceName}`,
      method: 'POST',
      body: {
        number: phoneNumber,
        text: message
      },
      instanceName
    });
  };

  const createInstance = async (instanceName: string) => {
    return makeSecureRequest({
      endpoint: '/instance/create',
      method: 'POST',
      body: {
        instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      },
      instanceName
    });
  };

  return {
    loading,
    checkInstanceStatus,
    fetchContacts,
    fetchChats,
    sendMessage,
    createInstance,
    makeSecureRequest
  };
};