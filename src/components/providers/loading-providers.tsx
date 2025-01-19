// Create a new file: src/providers/LoadingProvider.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Spinner from '@/app/spinner';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);