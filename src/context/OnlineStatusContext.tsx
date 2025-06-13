"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/components/ui/use-toast';

interface OnlineStatusContextType {
  isOnline: boolean;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export const OnlineStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const [lastStatus, setLastStatus] = useState(isOnline);
  const { toast } = useToast();

  useEffect(() => {
    if (lastStatus !== isOnline) {
      toast({
        title: isOnline ? "You're back online!" : "You're offline",
        description: isOnline ? "Your connection has been restored." : "Please check your internet connection.",
        variant: isOnline ? "default" : "destructive",
      });
      setLastStatus(isOnline);
    }
  }, [isOnline, lastStatus, toast]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatusContext = () => {
  const context = useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error('useOnlineStatusContext must be used within an OnlineStatusProvider');
  }
  return context;
}; 