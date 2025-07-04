
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EVOLUTION_CONFIG, generateInstanceName, validateEvolutionConfig } from '@/config/evolutionApi';

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

  // Configuração usando arquivo de configuração central
  const API_URL = EVOLUTION_CONFIG.API_URL;
  const API_TOKEN = EVOLUTION_CONFIG.API_TOKEN;
  // Nome da instância único por usuário para multi-tenant
  const INSTANCE_NAME = user ? generateInstanceName(user.id) : 'nutribox-temp';

  const headers = EVOLUTION_CONFIG.getHeaders();

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

  // Conectar ou reconectar instância
  const createInstance = async () => {
    setLoading(true);
    try {
      // Primeiro, verifica se a instância já existe
      const statusResponse = await fetch(`${API_URL}/instance/connectionState/${INSTANCE_NAME}`, {
        headers
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('Status da instância existente:', statusData);
        
        // Se a instância existe mas não está conectada, busca o QR code
        if (statusData.instance && statusData.instance.state !== 'open') {
          const qrResponse = await fetch(`${API_URL}/instance/connect/${INSTANCE_NAME}`, {
            method: 'GET',
            headers
          });
          
          if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            console.log('QR Code obtido:', qrData);
            
            const sessionData: EvolutionSession = {
              id: INSTANCE_NAME,
              instanceName: INSTANCE_NAME,
              status: 'connecting',
              qrCode: qrData.base64 || qrData.qrcode?.base64
            };
            
            setSession(sessionData);
            await syncSessionWithSupabase(sessionData);
            
            toast({
              title: "QR Code atualizado",
              description: "Escaneie o QR Code para conectar"
            });
            return;
          }
        }
        
        // Se já está conectada
        if (statusData.instance && statusData.instance.state === 'open') {
          const sessionData: EvolutionSession = {
            id: INSTANCE_NAME,
            instanceName: INSTANCE_NAME,
            status: 'connected'
          };
          
          setSession(sessionData);
          await syncSessionWithSupabase(sessionData);
          
          toast({
            title: "WhatsApp conectado",
            description: "Sua instância já está ativa"
          });
          return;
        }
      }

      // Se não existe, cria nova instância
      const createResponse = await fetch(`${API_URL}/instance/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          instanceName: INSTANCE_NAME,
          token: API_TOKEN,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      if (createResponse.ok) {
        const data = await createResponse.json();
        console.log('Nova instância criada:', data);
        
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
      } else {
        const errorData = await createResponse.json();
        console.error('Erro ao criar instância:', errorData);
        
        // Se o erro for que a instância já existe (403), tenta buscar o QR code
        if (createResponse.status === 403 && errorData.response?.message?.[0]?.includes('already in use')) {
          toast({
            title: "Reconectando",
            description: "Instância já existe, buscando QR Code..."
          });
          // Chama recursivamente para buscar o QR code
          setTimeout(() => createInstance(), 1000);
        } else {
          throw new Error(`Erro ${createResponse.status}: ${errorData.message || 'Falha na criação'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao conectar instância:', error);
      toast({
        title: "Erro",
        description: "Falha ao conectar WhatsApp. Tente novamente.",
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
    if (!session || session.status !== 'connected') {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/chat/findContacts/${INSTANCE_NAME}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        
        const formattedContacts: EvolutionContact[] = data.map((contact: any) => ({
          id: contact.id || `unknown-${Date.now()}`,
          name: contact.pushName || contact.id?.split('@')[0] || 'Contato Desconhecido',
          phone: contact.id?.split('@')[0] || 'unknown',
          profilePicture: contact.profilePictureUrl || undefined,
          lastMessage: contact.lastMessage?.message || undefined,
          lastMessageTime: contact.lastMessage?.messageTimestamp ? 
            new Date(contact.lastMessage.messageTimestamp * 1000) : undefined,
          unreadCount: Number(contact.unreadCount) || 0
        }));
        
        setContacts(formattedContacts);
        await syncContactsWithSupabase(formattedContacts);
      } else {
        // Only log if it's not a 404 (which is expected when no contacts exist)
        if (response.status !== 404) {
          console.error('Erro na resposta:', response.status, response.statusText);
        }
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
    if (user && !session) {
      const loadSession = async () => {
        try {
          // Buscar todas as sessões do usuário, ordenadas pela mais recente
          const { data, error } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);

          if (data && data.length > 0 && !error) {
            const sessionData = data[0];
            setSession({
              id: sessionData.id || INSTANCE_NAME,
              instanceName: INSTANCE_NAME,
              status: sessionData.is_connected ? 'connected' : 'disconnected',
              phoneNumber: sessionData.phone_number || undefined,
              qrCode: sessionData.qr_code || undefined
            });
            
            // Verificar status real da instância na Evolution API
            setTimeout(() => {
              checkInstanceStatus();
            }, 1000);
          } else {
            // Se não há sessão no Supabase, verifica se existe instância na Evolution API
            setTimeout(() => {
              createInstance();
            }, 1000);
          }
        } catch (error) {
          console.error('Erro ao carregar sessão:', error);
        }
      };

      loadSession();
    }
  }, [user]); // Removido session das dependências para evitar loop

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
