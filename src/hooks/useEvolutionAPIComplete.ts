
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces para todos os tipos da Evolution API
export interface EvolutionContact {
  id: string;
  name: string;
  phone: string;
  profilePicture?: string;
  isGroup?: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export interface EvolutionGroup {
  id: string;
  name: string;
  description?: string;
  participants: Array<{
    id: string;
    name: string;
    isAdmin?: boolean;
  }>;
  profilePicture?: string;
  createdAt?: Date;
}

export interface EvolutionInstance {
  name: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'qrcode';
  qrCode?: string;
  phone?: string;
  profilePicture?: string;
  battery?: number;
  connected?: boolean;
}

export interface EvolutionMessage {
  id: string;
  key: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
  };
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    imageMessage?: {
      url: string;
      caption?: string;
    };
    videoMessage?: {
      url: string;
      caption?: string;
    };
    documentMessage?: {
      url: string;
      fileName?: string;
    };
  };
  messageTimestamp: number;
  pushName?: string;
}

export const useEvolutionAPIComplete = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados principais
  const [instances, setInstances] = useState<EvolutionInstance[]>([]);
  const [contacts, setContacts] = useState<EvolutionContact[]>([]);
  const [groups, setGroups] = useState<EvolutionGroup[]>([]);
  const [messages, setMessages] = useState<EvolutionMessage[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Configuração da API
  const API_URL = import.meta.env.DEV ? '/api/evolution' : 'http://134.199.202.47:8080';
  const API_TOKEN = '429683C4C977415CAAFCCE10F7D57E11';
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': API_TOKEN
  };

  // Função auxiliar para fazer requisições
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);
      throw error;
    }
  };

  // 1. Gestão de Instâncias
  const fetchInstances = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/instance/fetchInstances');
      
      const formattedInstances: EvolutionInstance[] = data.map((instance: any) => ({
        name: instance.instance?.instanceName || instance.name,
        status: instance.instance?.state || 'disconnected',
        phone: instance.instance?.wuid?.split('@')[0],
        profilePicture: instance.instance?.profilePictureUrl,
        connected: instance.instance?.state === 'open'
      }));
      
      setInstances(formattedInstances);
      
      // Selecionar primeira instância se nenhuma estiver selecionada
      if (!selectedInstance && formattedInstances.length > 0) {
        setSelectedInstance(formattedInstances[0].name);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar instâncias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedInstance, toast]);

  const createInstance = async (instanceName: string) => {
    try {
      setLoading(true);
      const data = await apiRequest('/instance/create', {
        method: 'POST',
        body: JSON.stringify({
          instanceName,
          token: API_TOKEN,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      toast({
        title: "Instância criada",
        description: "Nova instância criada com sucesso"
      });

      await fetchInstances();
      return data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar instância",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInstance = async (instanceName: string) => {
    try {
      await apiRequest(`/instance/delete/${instanceName}`, {
        method: 'DELETE'
      });

      toast({
        title: "Instância deletada",
        description: "Instância removida com sucesso"
      });

      await fetchInstances();
    } catch (error) {
      toast({
        title: "Erro", 
        description: "Falha ao deletar instância",
        variant: "destructive"
      });
    }
  };

  const restartInstance = async (instanceName: string) => {
    try {
      await apiRequest(`/instance/restart/${instanceName}`, {
        method: 'PUT'
      });

      toast({
        title: "Instância reiniciada",
        description: "Instância reiniciada com sucesso"
      });

      await fetchInstances();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao reiniciar instância",
        variant: "destructive"
      });
    }
  };

  // 2. Gestão de Contatos
  const fetchContacts = useCallback(async (instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      setLoading(true);
      const data = await apiRequest(`/contact/${instance}/fetchContacts`);
      
      const formattedContacts: EvolutionContact[] = data.map((contact: any) => ({
        id: contact.id,
        name: contact.pushName || contact.id.split('@')[0],
        phone: contact.id.split('@')[0],
        profilePicture: contact.profilePictureUrl,
        isGroup: contact.id.includes('@g.us')
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar contatos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedInstance, toast]);

  // 3. Gestão de Grupos
  const fetchGroups = useCallback(async (instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      setLoading(true);
      const data = await apiRequest(`/group/${instance}/fetchGroups`);
      
      const formattedGroups: EvolutionGroup[] = data.map((group: any) => ({
        id: group.id,
        name: group.subject,
        description: group.desc,
        participants: group.participants?.map((p: any) => ({
          id: p.id,
          name: p.pushName || p.id.split('@')[0],
          isAdmin: p.admin !== null
        })) || [],
        profilePicture: group.profilePictureUrl,
        createdAt: group.creation ? new Date(group.creation * 1000) : undefined
      }));
      
      setGroups(formattedGroups);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar grupos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedInstance, toast]);

  const createGroup = async (groupName: string, participants: string[]) => {
    if (!selectedInstance) return;
    
    try {
      const data = await apiRequest(`/group/${selectedInstance}/create`, {
        method: 'POST',
        body: JSON.stringify({
          subject: groupName,
          participants
        })
      });

      toast({
        title: "Grupo criado",
        description: "Grupo criado com sucesso"
      });

      await fetchGroups();
      return data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar grupo",
        variant: "destructive"
      });
    }
  };

  // 4. Gestão de Mensagens
  const fetchMessages = useCallback(async (contactId: string, instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      const data = await apiRequest(`/chat/${instance}/findMessages?where[key.remoteJid]=${contactId}`);
      
      setMessages(data || []);
      
      // Salvar mensagens no Supabase
      if (user && data.length > 0) {
        await saveMessagesToSupabase(data, instance);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  }, [selectedInstance, user]);

  const sendTextMessage = async (to: string, text: string, instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      const data = await apiRequest(`/message/sendText/${instance}`, {
        method: 'POST',
        body: JSON.stringify({
          number: to.replace('@s.whatsapp.net', '').replace('@g.us', ''),
          text
        })
      });

      toast({
        title: "Mensagem enviada",
        description: "Mensagem enviada com sucesso"
      });

      // Salvar mensagem enviada no Supabase
      if (user) {
        await saveMessageToSupabase({
          from: 'me',
          to,
          text,
          timestamp: Date.now(),
          fromMe: true,
          instance
        });
      }

      return data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  const sendMediaMessage = async (to: string, mediaUrl: string, caption?: string, instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      const data = await apiRequest(`/message/sendMedia/${instance}`, {
        method: 'POST',
        body: JSON.stringify({
          number: to.replace('@s.whatsapp.net', '').replace('@g.us', ''),
          mediaUrl,
          caption
        })
      });

      toast({
        title: "Mídia enviada",
        description: "Mídia enviada com sucesso"
      });

      return data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mídia",
        variant: "destructive"
      });
      throw error;
    }
  };

  // 5. Integração com Supabase
  const saveMessageToSupabase = async (messageData: any) => {
    try {
      await supabase.from('messages').insert({
        user_id: user?.id,
        from_jid: messageData.from,
        to_jid: messageData.to,
        message_text: messageData.text,
        message_timestamp: new Date(messageData.timestamp),
        from_me: messageData.fromMe,
        instance_name: messageData.instance
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem no Supabase:', error);
    }
  };

  const saveMessagesToSupabase = async (messages: EvolutionMessage[], instance: string) => {
    try {
      const messagesToInsert = messages.map(msg => ({
        user_id: user?.id,
        from_jid: msg.key.remoteJid,
        to_jid: msg.key.remoteJid,
        message_text: msg.message?.conversation || msg.message?.extendedTextMessage?.text || '',
        message_timestamp: new Date(msg.messageTimestamp * 1000),
        from_me: msg.key.fromMe,
        instance_name: instance,
        message_id: msg.key.id
      }));

      await supabase.from('messages').upsert(messagesToInsert, {
        onConflict: 'message_id'
      });
    } catch (error) {
      console.error('Erro ao salvar mensagens no Supabase:', error);
    }
  };

  // 6. Configuração de Webhooks
  const setWebhook = async (webhookUrl: string, instanceName?: string) => {
    if (!instanceName && !selectedInstance) return;
    
    const instance = instanceName || selectedInstance;
    
    try {
      const data = await apiRequest(`/webhook/${instance}`, {
        method: 'POST',
        body: JSON.stringify({
          url: webhookUrl,
          events: ['message.upsert', 'message.update', 'connection.update']
        })
      });

      toast({
        title: "Webhook configurado",
        description: "Webhook configurado com sucesso"
      });

      return data;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao configurar webhook",
        variant: "destructive"
      });
    }
  };

  // Efeitos para carregar dados iniciais
  useEffect(() => {
    if (user) {
      fetchInstances();
    }
  }, [user, fetchInstances]);

  useEffect(() => {
    if (selectedInstance) {
      fetchContacts();
      fetchGroups();
    }
  }, [selectedInstance, fetchContacts, fetchGroups]);

  return {
    // Estados
    instances,
    contacts,
    groups,
    messages,
    selectedInstance,
    loading,
    
    // Setters
    setSelectedInstance,
    
    // Funções de instância
    fetchInstances,
    createInstance,
    deleteInstance,
    restartInstance,
    
    // Funções de contatos
    fetchContacts,
    
    // Funções de grupos
    fetchGroups,
    createGroup,
    
    // Funções de mensagens
    fetchMessages,
    sendTextMessage,
    sendMediaMessage,
    
    // Configurações
    setWebhook
  };
};
