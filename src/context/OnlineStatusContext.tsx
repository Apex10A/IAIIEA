"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/components/ui/use-toast';
import { Wifi, WifiOff } from 'lucide-react';

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
        title: isOnline ? "Connection Restored" : "Connection Lost",
        description: isOnline 
          ? "Your internet connection has been restored. You can continue using the application normally."
          : "Please check your internet connection. Some features may be limited until you're back online.",
        variant: isOnline ? "default" : "destructive",
        className: isOnline 
          ? "bg-white dark:bg-gray-800 border-green-500 text-green-700 dark:text-green-400 shadow-lg"
          : "bg-white dark:bg-gray-800 border-red-500 text-red-700 dark:text-red-400 shadow-lg",
        duration: 5000,
        action: (
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
          </div>
        ),
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