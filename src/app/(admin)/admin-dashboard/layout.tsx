'use client';

import React, { useState, useCallback, memo, Suspense } from 'react';
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from 'next/navigation';
import "@/app/index.css"
import Sidebar from '@/app/(admin)/admin-dashboard/components/Sidebar'
import DashboardHeader from '@/components/layout/header/DashboardHeader';
import LoadingDashboard from './LoadingDashboard';
import { ThemeProvider } from '@/components/theme-provider';

const PageContentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#203A87]"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

const DashboardLayout = memo(({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin-login');
    },
  });

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarCollapse = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  if (status === 'loading') {
    return <LoadingDashboard/>;
  }

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
          onClose={handleSidebarClose}
          currentPath={pathname}
          onNavigate={handleNavigate}
          onCollapse={handleSidebarCollapse}
        />

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'
        }`}>
          {/* Header */}
          <DashboardHeader 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Suspense fallback={<PageContentLoader />}>
                {children}
              </Suspense>
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={handleSidebarClose}
          />
        )}
      </div>
    </ThemeProvider>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;