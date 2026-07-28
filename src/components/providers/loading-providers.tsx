'use client'

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Spinner from '@/app/spinner';

const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {}
});

const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <Spinner />
  </div>
);

function LoadingProviderInner({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
};

export const useLoading = () => useContext(LoadingContext);