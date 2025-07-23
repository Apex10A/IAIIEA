'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { ThemeProvider } from '@/components/theme-provider';
import { redirect } from 'next/navigation';
import "@/app/index.css"
import { motion, AnimatePresence } from 'framer-motion';
// Pages
import Dashboard from "@/app/(members-dashboard)/members-dashboard/dash/index";
import Announcement from '@/app/(members-dashboard)/members-dashboard/notification/Notification';
// import ConferencePortal from '@/app/(members-dashboard)/members-dashboard/conference/page';
import SeminarsWebinars from "@/app/(members-dashboard)/members-dashboard/seminars/page";
import MembersDirectory from '@/app/(members-dashboard)/members-dashboard/membersdirectory/page';
import IAIIEAResources from '@/app/(members-dashboard)/members-dashboard/resources/page';
import Forum from "@/app/(members-dashboard)/members-dashboard/forum/page";
import Payment from "@/app/(members-dashboard)/members-dashboard/payment/page";
import Settings from '@/app/(members-dashboard)/members-dashboard/settings/page';
import Resources from "@/app/(members-dashboard)/conference/resources/page"
import Participants from "@/app/(members-dashboard)/conference/participants/page"
import Conferences from "@/app/(members-dashboard)/conference/resources/page"
import SeminarResources from "@/app/(members-dashboard)/members-dashboard/resources/page"
import SeminarDirectory from "@/app/(members-dashboard)/members-dashboard/training/participants/page"
import ConfAnnouncement from "@/app/(members-dashboard)/members-dashboard/confAnnouncement/page"
import SeminarParticipants from "@/app/(members-dashboard)/members-dashboard/training/participants/page"
import SeminarAnnouncements from "@/app/(members-dashboard)/members-dashboard/training/announcements/page"
// Components
import Sidebar from '@/components/layout/sidebar/page';
import DashboardHeader from '@/components/layout/header/DashboardHeader';
import LoadingDashboard from '@/app/(admin)/admin-dashboard/LoadingDashboard'
import MembersCertificate from "@/app/(members-dashboard)/members-dashboard/certificates/page"


type ComponentKey = 
  | 'Dashboard' | 'Announcement' | 'Payment' 
  | 'Seminar Directory' | 'Conference Announcements' 
  | 'Seminars' | 'Seminar Participants' 
  | 'Seminar Announcements' | 'Participants' 
  | 'Certification'
  | 'Conferences' | 'Seminars'
  | 'Seminars / Webinars' | 'Directory' 
  | 'IAIIEA Resources' | 'Forum' | 'Settings';

interface ComponentMap {
  [key: string]: JSX.Element;
}

export default function DashboardClient() {
  const [activeComponent, setActiveComponent] = useState<ComponentKey>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderComponent = (): JSX.Element => {
    const components: ComponentMap = {
      Dashboard: <Dashboard />,
      Announcement: <Announcement />,
      Payment: <Payment />,
      'Seminar Directory': <SeminarDirectory />,
      'Conference Announcements': <ConfAnnouncement />,
      // 'Seminars': <SeminarResources />,
      'Seminar Participants': <SeminarParticipants />,
      'Seminar Announcements': <SeminarAnnouncements />,
      'Participants': <Participants />,
      'Seminars': <SeminarsWebinars />,
      'Conferences': <Conferences />,
      'Certification': <MembersCertificate />,
      'Seminars / Webinars': <SeminarsWebinars />,
      'Directory': <MembersDirectory />,
      'IAIIEA Resources': <IAIIEAResources />,
      Forum: <Forum />,
      Settings: <Settings />,
    };

    return components[activeComponent] || components['Dashboard'];
  };

  if (status === 'loading') {
    return <LoadingDashboard />;
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
    <div className="h-screen flex flex-col bg-[#F9FAFF] overflow-hidden">
      <DashboardHeader 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      <div className="flex flex-1 overflow-hidden pt-16"> 
        <AnimatePresence>
          {isSidebarOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              onClick={closeSidebar}
            />
          )}
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={isMobile ? 
              { x: isSidebarOpen ? 0 : -300 } : 
              { x: 0 }
            }
            exit={isMobile ? { x: -300 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed md:relative inset-y-0 left-0 z-30 md:z-0 w-64 flex-shrink-0`}
          >
            <Sidebar 
               setActiveComponent={setActiveComponent} 
              isMobileOpen={isSidebarOpen} 
              onMobileToggle={toggleSidebar} 
            />
          </motion.div>
        </AnimatePresence>
        <main className="flex-1 overflow-y-auto bg-[#F9FAFF]">
          <div className="p-4 md:p-6 max-w-8xl mx-auto">
            {renderComponent()}
          </div>
        </main>
      </div>
    </div>
    </ThemeProvider>
  );
}