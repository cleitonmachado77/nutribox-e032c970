import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { generateInstanceName } from '@/config/evolutionApi';

export interface EvolutionSession {
  id: string;
  instanceName: string;
  status: 'connected' | 'disconnected' | 'connecting';
  qrCode?: string;
  phoneNumber?: string;
  lastChecked?: Date;
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
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Nome da instância único por usuário para multi-tenant
  const INSTANCE_NAME = user ? generateInstanceName(user.id) : 'nutribox-temp';

  // Função para chamar a Evolution API via Supabase Edge Function
  const callEvolutionAPI = useCallback(async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) => {
    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      
      if (!authSession) {
        throw new Error('Usuário não autenticado');
      }

      console.log(`🔄 Chamando Evolution API: ${method} ${endpoint}`);

      const response = await supabase.functions.invoke('evolution-api-proxy', {
        body: {
          endpoint,
          method,
          body,
          instanceName: INSTANCE_NAME
        }
      });

      if (response.error) {
        console.error('❌ Erro na Edge Function:', response.error);
        throw new Error(response.error.message || 'Erro na chamada da API');
      }

      console.log(`✅ Resposta da Evolution API:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao chamar Evolution API:', error);
      throw error;
    }
  }, [INSTANCE_NAME]);

  // Sincronizar sessão com Supabase
  const syncSessionWithSupabase = useCallback(async (sessionData: Partial<EvolutionSession>) => {
    if (!user) return;

    try {
      // Preparar dados para Supabase (remover lastChecked que é um Date)
      const { lastChecked, ...sessionDataForSupabase } = sessionData;
      
      const { error } = await supabase
        .from('whatsapp_sessions')
        .upsert({
          user_id: user.id,
          phone_number: sessionData.phoneNumber || null,
          is_connected: sessionData.status === 'connected',
          qr_code: sessionData.qrCode || null,
          session_data: sessionDataForSupabase,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Erro ao sincronizar sessão:', error);
      } else {
        console.log('✅ Sessão sincronizada com Supabase');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar sessão no Supabase:', error);
    }
  }, [user]);

  // Verificar status real da instância na Evolution API
  const checkRealInstanceStatus = useCallback(async (): Promise<'connected' | 'disconnected' | 'connecting'> => {
    try {
      console.log('🔍 Verificando status real da instância...');
      
      const data = await callEvolutionAPI(`/instance/connectionState/${INSTANCE_NAME}`);
      
      if (!data || !data.instance) {
        console.log('❌ Instância não encontrada na Evolution API');
        return 'disconnected';
      }

      const state = data.instance.state;
      console.log(`📊 Estado da instância: ${state}`);

      if (state === 'open') {
        return 'connected';
      } else if (state === 'connecting' || state === 'pairing') {
        return 'connecting';
      } else {
        return 'disconnected';
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status real:', error);
      return 'disconnected';
    }
  }, [callEvolutionAPI, INSTANCE_NAME]);

  // Atualizar status da sessão
  const updateSessionStatus = useCallback(async (newStatus: 'connected' | 'disconnected' | 'connecting', qrCode?: string, phoneNumber?: string) => {
    const updatedSession: EvolutionSession = {
      id: INSTANCE_NAME,
      instanceName: INSTANCE_NAME,
      status: newStatus,
      qrCode,
      phoneNumber,
      lastChecked: new Date()
    };

    console.log(`🔄 Atualizando status da sessão para: ${newStatus}`);
    setSession(updatedSession);
    await syncSessionWithSupabase(updatedSession);
  }, [INSTANCE_NAME, syncSessionWithSupabase]);

  // Verificar status da instância
  const checkInstanceStatus = useCallback(async () => {
    try {
      const realStatus = await checkRealInstanceStatus();
      await updateSessionStatus(realStatus);
      
      // Se o status mudou, mostrar notificação
      if (session && session.status !== realStatus) {
        if (realStatus === 'connected') {
          toast({
            title: "WhatsApp Conectado",
            description: "Sua conta foi conectada com sucesso!"
          });
        } else if (realStatus === 'disconnected') {
          toast({
            title: "WhatsApp Desconectado",
            description: "Sua conta foi desconectada",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      // Se não conseguir verificar, marcar como desconectado
      await updateSessionStatus('disconnected');
    }
  }, [checkRealInstanceStatus, updateSessionStatus, session, toast]);

  // Conectar ou reconectar instância
  const createInstance = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Iniciando processo de conexão...');
      console.log('👤 Usuário ID:', user?.id);
      console.log('🏷️ Nome da instância:', INSTANCE_NAME);
      
      // Primeiro, tenta verificar se a instância existe
      let instanceExists = false;
      let existingState = null;
      let statusData = null;
      
      try {
        statusData = await callEvolutionAPI(`/instance/connectionState/${INSTANCE_NAME}`);
        console.log('📊 Status da instância existente:', statusData);
        
        if (statusData.instance) {
          instanceExists = true;
          existingState = statusData.instance.state;
        }
      } catch (statusError) {
        console.log('❌ Instância não encontrada ou erro ao verificar:', statusError);
        // Se der erro 404 ou similar, significa que a instância não existe
        instanceExists = false;
      }
      
      if (instanceExists && existingState) {
        if (existingState === 'open') {
          // Já está conectada
          console.log('✅ Instância já está conectada');
          await updateSessionStatus('connected', undefined, statusData?.instance?.phoneNumber);
          toast({
            title: "WhatsApp conectado",
            description: "Sua instância já está ativa"
          });
          return;
        } else if (existingState === 'connecting' || existingState === 'pairing') {
          // Está conectando, buscar QR code
          console.log('🔗 Instância está conectando, buscando QR code...');
          try {
            const qrData = await callEvolutionAPI(`/instance/connect/${INSTANCE_NAME}`);
            console.log('📱 QR Code obtido:', qrData);
            
            await updateSessionStatus('connecting', qrData.base64 || qrData.qrcode?.base64);
            toast({
              title: "QR Code atualizado",
              description: "Escaneie o QR Code para conectar"
            });
            return;
          } catch (qrError) {
            console.log('❌ Erro ao buscar QR code, deletando instância:', qrError);
            // Se não conseguir buscar QR code, deleta e recria
            try {
              await callEvolutionAPI(`/instance/delete/${INSTANCE_NAME}`, 'DELETE');
              console.log('🗑️ Instância deletada com sucesso');
            } catch (deleteError) {
              console.log('⚠️ Erro ao deletar instância:', deleteError);
            }
          }
        } else {
          // Instância existe mas está desconectada, deletar e recriar
          console.log('🗑️ Instância desconectada, deletando...');
          try {
            await callEvolutionAPI(`/instance/delete/${INSTANCE_NAME}`, 'DELETE');
            console.log('🗑️ Instância deletada com sucesso');
          } catch (deleteError) {
            console.log('⚠️ Erro ao deletar instância:', deleteError);
          }
        }
      }

      // Criar nova instância
      console.log('🆕 Criando nova instância...');
      console.log('📝 Dados da instância:', {
        instanceName: INSTANCE_NAME,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      });
      
      const data = await callEvolutionAPI('/instance/create', 'POST', {
        instanceName: INSTANCE_NAME,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      });

      console.log('✅ Nova instância criada:', data);
      
      // Verificar se o QR code foi gerado
      if (data.qrcode?.base64) {
        await updateSessionStatus('connecting', data.qrcode.base64);
        toast({
          title: "Instância criada",
          description: "Escaneie o QR Code para conectar"
        });
      } else {
        console.log('⚠️ QR code não encontrado na resposta, tentando buscar...');
        try {
          const qrData = await callEvolutionAPI(`/instance/connect/${INSTANCE_NAME}`);
          await updateSessionStatus('connecting', qrData.base64 || qrData.qrcode?.base64);
          toast({
            title: "QR Code obtido",
            description: "Escaneie o QR Code para conectar"
          });
        } catch (qrError) {
          console.error('❌ Erro ao buscar QR code após criação:', qrError);
          await updateSessionStatus('connecting');
          toast({
            title: "Instância criada",
            description: "Aguardando QR Code...",
            variant: "destructive"
          });
        }
      }

    } catch (error) {
      console.error('❌ Erro ao conectar instância:', error);
      
      // Se o erro for que a instância já existe, tenta buscar o QR code
      if (error instanceof Error && (error.message.includes('already in use') || error.message.includes('already exists'))) {
        console.log('🔄 Instância já existe, buscando QR Code...');
        toast({
          title: "Reconectando",
          description: "Instância já existe, buscando QR Code..."
        });
        
        try {
          const qrData = await callEvolutionAPI(`/instance/connect/${INSTANCE_NAME}`);
          await updateSessionStatus('connecting', qrData.base64 || qrData.qrcode?.base64);
          toast({
            title: "QR Code obtido",
            description: "Escaneie o QR Code para conectar"
          });
        } catch (qrError) {
          console.error('❌ Erro ao buscar QR code:', qrError);
          await updateSessionStatus('disconnected');
          toast({
            title: "Erro",
            description: "Falha ao obter QR Code. Tente novamente.",
            variant: "destructive"
          });
        }
      } else {
        await updateSessionStatus('disconnected');
        toast({
          title: "Erro",
          description: `Falha ao conectar WhatsApp: ${error.message}`,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [callEvolutionAPI, INSTANCE_NAME, updateSessionStatus, toast, user?.id]);

  // Buscar contatos
  const fetchContacts = useCallback(async () => {
    if (!session || session.status !== 'connected') {
      console.log('❌ Sessão não está conectada, não é possível buscar contatos');
      return;
    }
    
    try {
      console.log('🔍 Buscando contatos...');
      
      // Endpoints corretos da Evolution API v2.2.3
      const endpoints = [
        `/instance/fetchContacts/${INSTANCE_NAME}`,
        `/chat/fetchChats/${INSTANCE_NAME}`
      ];

      let data = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Tentando endpoint: ${endpoint}`);
          
          data = await callEvolutionAPI(endpoint);
          console.log(`✅ Dados encontrados usando ${endpoint}:`, data);
          break;
        } catch (error) {
          console.log(`💥 Erro no endpoint ${endpoint}:`, error);
          continue;
        }
      }

      if (data) {
        console.log('📊 Dados recebidos da API:', data);
        
        // Processar dados da Evolution API v2.2.3
        let contacts = Array.isArray(data) ? data : [];

        if (!Array.isArray(contacts)) {
          console.log('❌ Resposta não é um array:', typeof data);
          setContacts([]);
          return;
        }

        const formattedContacts: EvolutionContact[] = contacts
          .filter((contact: any) => {
            // Validar se o contato tem os campos necessários
            return contact && (contact.id || contact.number);
          })
          .map((contact: any) => {
            // Formato esperado do /instance/fetchContacts
            const phoneNumber = contact.number || contact.id?.split('@')[0] || '';
            
            return {
              id: contact.id || `${phoneNumber}@s.whatsapp.net`,
              name: contact.name || contact.pushName || phoneNumber || 'Contato Desconhecido',
              phone: phoneNumber,
              profilePicture: contact.profilePic || contact.profilePicture || undefined,
              lastMessage: undefined, // Será preenchido pelo /chat/fetchChats se necessário
              lastMessageTime: undefined,
              unreadCount: 0
            };
          });
        
        console.log(`📱 Contatos formatados: ${formattedContacts.length} encontrados`, formattedContacts);
        setContacts(formattedContacts);
      } else {
        console.log('❌ Nenhum endpoint de contatos funcional encontrado');
        setContacts([]);
      }
    } catch (error) {
      console.error('💥 Erro geral ao buscar contatos:', error);
      setContacts([]);
    }
  }, [session, callEvolutionAPI, INSTANCE_NAME]);

  // Buscar mensagens de um contato
  const fetchMessages = useCallback(async (contactPhone: string): Promise<EvolutionMessage[]> => {
    try {
      console.log(`📨 Buscando mensagens para: ${contactPhone}`);
      
      // Tentar diferentes formatos de endpoints para mensagens
      const endpoints = [
        `/chat/findMessages/${INSTANCE_NAME}?where[key.remoteJid]=${contactPhone}@s.whatsapp.net`,
        `/chat/messages/${INSTANCE_NAME}/${contactPhone}@s.whatsapp.net`,
        `/messages/${INSTANCE_NAME}/${contactPhone}`,
        `/chat/findMessages/${INSTANCE_NAME}/${contactPhone}`
      ];

      for (const endpoint of endpoints) {
        try {
          const data = await callEvolutionAPI(endpoint);
          console.log(`✅ Mensagens encontradas usando endpoint: ${endpoint}`, data);
          
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
        } catch (error) {
          console.log(`❌ Erro ao tentar endpoint de mensagens ${endpoint}:`, error);
          continue;
        }
      }
      
      console.log('❌ Nenhum endpoint de mensagens funcional encontrado');
      return [];
    } catch (error) {
      console.error('❌ Erro ao buscar mensagens:', error);
      return [];
    }
  }, [callEvolutionAPI, INSTANCE_NAME]);

  // Enviar mensagem
  const sendMessage = useCallback(async (to: string, message: string) => {
    try {
      console.log(`📤 Enviando mensagem para: ${to}`);
      
      // Garantir que o número tenha o formato correto
      const phoneNumber = to.includes('@') ? to.split('@')[0] : to;
      
      const data = await callEvolutionAPI(`/message/sendText/${INSTANCE_NAME}`, 'POST', {
        number: phoneNumber,
        text: message
      });

      console.log('✅ Mensagem enviada com sucesso:', data);
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso"
      });
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive"
      });
      return false;
    }
  }, [callEvolutionAPI, INSTANCE_NAME, toast]);

  // Inicializar sessão
  useEffect(() => {
    if (user && !session) {
      const initializeSession = async () => {
        try {
          console.log('🔄 Inicializando sessão...');
          
          // Buscar sessão do Supabase
          const { data, error } = await supabase
            .from('whatsapp_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);

          if (data && data.length > 0 && !error) {
            const sessionData = data[0];
            console.log('📊 Sessão encontrada no Supabase:', sessionData);
            
            // Carregar sessão do Supabase
            const loadedSession: EvolutionSession = {
              id: sessionData.id || INSTANCE_NAME,
              instanceName: INSTANCE_NAME,
              status: sessionData.is_connected ? 'connected' : 'disconnected',
              phoneNumber: sessionData.phone_number || undefined,
              qrCode: sessionData.qr_code || undefined,
              lastChecked: new Date(sessionData.updated_at)
            };
            
            setSession(loadedSession);
            
            // Verificar status real da instância na Evolution API
            setTimeout(() => {
              checkInstanceStatus();
            }, 1000);
          } else {
            console.log('❌ Nenhuma sessão encontrada no Supabase, criando nova...');
            // Se não há sessão no Supabase, verifica se existe instância na Evolution API
            setTimeout(() => {
              createInstance();
            }, 1000);
          }
        } catch (error) {
          console.error('❌ Erro ao inicializar sessão:', error);
          // Em caso de erro, criar nova instância
          setTimeout(() => {
            createInstance();
          }, 1000);
        }
      };

      initializeSession();
    }
  }, [user, session, INSTANCE_NAME, checkInstanceStatus, createInstance]);

  // Configurar verificação periódica de status
  useEffect(() => {
    if (session) {
      // Limpar intervalo anterior
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }

      // Configurar novo intervalo
      const interval = setInterval(() => {
        checkInstanceStatus();
      }, 10000); // Verificar a cada 10 segundos

      setStatusCheckInterval(interval);

      // Limpar intervalo quando componente for desmontado
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [session, checkInstanceStatus]);

  // Buscar contatos quando conectar
  useEffect(() => {
    if (session?.status === 'connected') {
      // Delay para garantir que a instância está pronta
      const timer = setTimeout(() => {
        fetchContacts();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [session?.status, fetchContacts]);

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