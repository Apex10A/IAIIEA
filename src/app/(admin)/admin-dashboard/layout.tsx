'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from 'next/navigation';
import "@/app/index.css"
import Sidebar from '@/app/(admin)/admin-dashboard/components/Sidebar'
import DashboardHeader from '@/components/layout/header/DashboardHeader';
import LoadingDashboard from './LoadingDashboard';
import { ThemeProvider } from '@/components/theme-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin-login');
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Loading state while checking session
  if (status === 'loading') {
    return <LoadingDashboard/>;
  }

  // Render loading screen or redirect if session is unavailable
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#203A87]"></div>
        <p className="pt-4 font-medium text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPath={pathname}
          onNavigate={(path) => router.push(path)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}