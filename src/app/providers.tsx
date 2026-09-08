'use client'

import React from 'react'
import { SessionProvider } from "next-auth/react";
import { Toaster as Sonner } from '@/components/ui/sonnertoart'
import { Toaster } from '@/components/ui/toaster'
import { AuthContextProvider } from '@/context/AuthContext'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <AuthContextProvider>
        {children}
        <Toaster />
        <Sonner richColors expand={true} position="top-right" />
      </AuthContextProvider>
    </SessionProvider>
  )
}

export default Providers