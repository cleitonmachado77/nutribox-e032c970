
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WhatsAppContextType {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
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
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Simula mensagens não lidas iniciais

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  // Simula recebimento de novas mensagens quando conectado
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simula chegada de nova mensagem ocasionalmente
        if (Math.random() < 0.1) { // 10% de chance a cada 5 segundos
          incrementUnreadCount();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return (
    <WhatsAppContext.Provider
      value={{
        isConnected,
        setIsConnected,
        unreadCount,
        setUnreadCount,
        incrementUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};
