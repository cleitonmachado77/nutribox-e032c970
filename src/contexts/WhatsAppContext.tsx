
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWhatsAppAPI } from '@/hooks/useWhatsAppAPI';
import { useAuth } from '@/contexts/AuthContext';

interface WhatsAppContextType {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  checkConnectionStatus: () => Promise<void>;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (context === undefined) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};

interface WhatsAppProviderProps {
  children: ReactNode;
}

export const WhatsAppProvider = ({ children }: WhatsAppProviderProps) => {
  const { user } = useAuth();
  const { conversations, checkConnection } = useWhatsAppAPI();
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  const checkConnectionStatus = async () => {
    if (!user) return;
    
    try {
      const connected = await checkConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  // Calcular total de mensagens não lidas
  useEffect(() => {
    const totalUnread = conversations.reduce((total, conv) => total + conv.unread_count, 0);
    setUnreadCount(totalUnread);
  }, [conversations]);

  // Verificar status da conexão periodicamente
  useEffect(() => {
    if (!user) return;

    checkConnectionStatus();
    const interval = setInterval(checkConnectionStatus, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  return (
    <WhatsAppContext.Provider
      value={{
        isConnected,
        setIsConnected,
        unreadCount,
        setUnreadCount,
        incrementUnreadCount,
        resetUnreadCount,
        checkConnectionStatus,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};
