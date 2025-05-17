'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from 'next/navigation';
import "@/app/index.css"
import Sidebar from '@/app/(admin)/admin-dashboard/sidebarTwo/sidebar'
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="pt-3 font-medium text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
<ThemeProvider>
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow h-full">
        {/* Mobile Sidebar Toggle */}
        <button
          className="fixed left-4 top-20 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform pt-5 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30 md:z-0 w-64`}
        >
          <Sidebar 
            currentPath={pathname}
            onNavigate={(path) => router.push(path)}
            hasPaid={true}
          />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        <div className="flex-grow pt-20 md:pt-24 w-full overflow-y-auto bg-[#feffff] dark:bg-gray-800 lg:px-6 px-3">
          <div className="mx-auto">{children}</div>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
}