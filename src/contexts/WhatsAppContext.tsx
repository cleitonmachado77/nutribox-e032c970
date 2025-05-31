
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  // Simplificado - sem verificações de API já que usamos iframe
  const [isConnected, setIsConnected] = useState(true); // Assumimos sempre conectado
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnreadCount = () => {
    setUnreadCount(prev => prev + 1);
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

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
