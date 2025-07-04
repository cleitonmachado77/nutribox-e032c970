
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
      console.log('🔍 Buscando contatos usando POST /chat/findChats...');
      
      // Usar POST conforme a API Evolution requer
      const response = await fetch(`${API_URL}/chat/findChats`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          instanceName: INSTANCE_NAME
        })
      });

      let data = null;

      if (response.ok) {
        data = await response.json();
        console.log('✅ Contatos encontrados usando POST /chat/findChats:', data);
      } else {
        console.log(`❌ POST /chat/findChats retornou ${response.status}: ${response.statusText}`);
        
        // Se POST não funcionar, tentar alguns endpoints GET como fallback
        const getEndpoints = [
          `${API_URL}/chat/findChats/${INSTANCE_NAME}`,
          `${API_URL}/chats/${INSTANCE_NAME}`,
          `${API_URL}/instance/fetchChats/${INSTANCE_NAME}`
        ];

        for (const endpoint of getEndpoints) {
          try {
            console.log(`Tentando fallback GET: ${endpoint}`);
            const getResponse = await fetch(endpoint, { headers });
            
            if (getResponse.ok) {
              data = await getResponse.json();
              console.log(`✅ Contatos encontrados usando GET: ${endpoint}`, data);
              break;
            }
          } catch (error) {
            console.log(`💥 Erro no fallback GET ${endpoint}:`, error);
            continue;
          }
        }
      }

      if (data) {
        console.log('📊 Dados recebidos da API:', data);
        
        // Verificar se data é um array ou tem uma propriedade que contém os chats
        let chats = Array.isArray(data) ? data : 
                   data.chats || data.conversations || data.contacts || data.data || [];

        if (!Array.isArray(chats) && typeof chats === 'object') {
          chats = Object.values(chats);
        }

        if (!Array.isArray(chats)) {
          console.log('❌ Formato de dados não reconhecido:', typeof chats);
          setContacts([]);
          return;
        }

        const formattedContacts: EvolutionContact[] = chats
          .filter((chat: any) => {
            // Melhor validação de dados
            if (!chat || typeof chat !== 'object') return false;
            const hasId = chat.id || chat.remoteJid || chat.jid;
            return hasId;
          })
          .map((chat: any) => {
            // Extrair informações do chat de forma mais robusta
            const chatId = chat.id || chat.remoteJid || chat.jid || '';
            const phoneNumber = chatId.includes('@') ? chatId.split('@')[0] : chatId;
            
            return {
              id: chatId || `unknown-${Date.now()}-${Math.random()}`,
              name: chat.name || 
                    chat.pushName || 
                    chat.verifiedName || 
                    chat.contact?.name ||
                    chat.notify ||
                    phoneNumber ||
                    'Contato Desconhecido',
              phone: phoneNumber || 'unknown',
              profilePicture: chat.profilePictureUrl || 
                            chat.contact?.profilePictureUrl || 
                            chat.profilePicture ||
                            undefined,
              lastMessage: chat.lastMessage?.message || 
                          chat.lastMessage?.text ||
                          chat.lastMessage?.conversation ||
                          chat.lastMessage?.body ||
                          undefined,
              lastMessageTime: chat.lastMessage?.messageTimestamp ? 
                new Date(Number(chat.lastMessage.messageTimestamp) * 1000) : 
                chat.lastMessage?.timestamp ?
                new Date(Number(chat.lastMessage.timestamp)) :
                chat.lastMessageTime ? 
                new Date(chat.lastMessageTime) :
                undefined,
              unreadCount: Number(chat.unreadCount) || Number(chat.count) || 0
            };
          });
        
        console.log(`📱 Contatos formatados: ${formattedContacts.length} encontrados`, formattedContacts);
        setContacts(formattedContacts);
        
        if (formattedContacts.length > 0) {
          await syncContactsWithSupabase(formattedContacts);
        }
      } else {
        console.log('❌ Nenhum endpoint de contatos funcional encontrado');
        
        // Criar contatos de teste para verificar se a interface está funcionando
        const testContacts: EvolutionContact[] = [
          {
            id: 'test-1',
            name: 'Teste 1',
            phone: '5511999999999',
            lastMessage: 'Mensagem de teste',
            lastMessageTime: new Date(),
            unreadCount: 1
          },
          {
            id: 'test-2', 
            name: 'Teste 2',
            phone: '5511888888888',
            lastMessage: 'Outra mensagem de teste',
            lastMessageTime: new Date(),
            unreadCount: 0
          }
        ];
        
        console.log('🧪 Adicionando contatos de teste para verificar interface');
        setContacts(testContacts);
      }
    } catch (error) {
      console.error('💥 Erro geral ao buscar contatos:', error);
      setContacts([]);
    }
  };

  // Buscar mensagens de um contato
  const fetchMessages = async (contactPhone: string): Promise<EvolutionMessage[]> => {
    try {
      // Tentar diferentes formatos de endpoints para mensagens
      const endpoints = [
        `${API_URL}/chat/findMessages/${INSTANCE_NAME}?where[key.remoteJid]=${contactPhone}@s.whatsapp.net`,
        `${API_URL}/chat/messages/${INSTANCE_NAME}/${contactPhone}@s.whatsapp.net`,
        `${API_URL}/messages/${INSTANCE_NAME}/${contactPhone}`,
        `${API_URL}/chat/findMessages/${INSTANCE_NAME}/${contactPhone}`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { headers });

          if (response.ok) {
            const data = await response.json();
            console.log(`Mensagens encontradas usando endpoint: ${endpoint}`, data);
            
            let messages = Array.isArray(data) ? data : data.messages || [];
            
            return messages.map((msg: any) => ({
              id: msg.key?.id || msg.id || `msg-${Date.now()}-${Math.random()}`,
              conversationId: contactPhone,
              from: msg.key?.remoteJid || msg.from || contactPhone,
              to: msg.key?.remoteJid || msg.to || contactPhone,
              body: msg.message?.conversation || 
                    msg.message?.extendedTextMessage?.text || 
                    msg.text || 
                    msg.body || 
                    '',
              timestamp: msg.messageTimestamp ? 
                new Date(Number(msg.messageTimestamp) * 1000) : 
                msg.timestamp ?
                new Date(Number(msg.timestamp)) :
                new Date(),
              fromMe: Boolean(msg.key?.fromMe || msg.fromMe),
              messageType: 'text' as const,
              isRead: Boolean(msg.isRead !== false) // Default to true unless explicitly false
            }));
          } else if (response.status === 404) {
            console.log(`Endpoint de mensagens ${endpoint} não encontrado (404)`);
            continue;
          }
        } catch (error) {
          console.log(`Erro ao tentar endpoint de mensagens ${endpoint}:`, error);
          continue;
        }
      }
      
      console.log('Nenhum endpoint de mensagens funcional encontrado');
      return [];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  };

  // Enviar mensagem
  const sendMessage = async (to: string, message: string) => {
    try {
      // Garantir que o número tenha o formato correto
      const phoneNumber = to.includes('@') ? to.split('@')[0] : to;
      
      const response = await fetch(`${API_URL}/message/sendText/${INSTANCE_NAME}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          number: phoneNumber,
          text: message
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Mensagem enviada com sucesso:', data);
        toast({
          title: "Mensagem enviada",
          description: "Sua mensagem foi enviada com sucesso"
        });
        return true;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao enviar mensagem:', response.status, errorData);
        toast({
          title: "Erro",
          description: `Falha ao enviar mensagem: ${errorData.message || response.statusText}`,
          variant: "destructive"
        });
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
