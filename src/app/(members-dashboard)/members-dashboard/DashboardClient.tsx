'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import "@/app/index.css"
import { redirect } from 'next/navigation';

// Components
import Sidebar from '@/components/layout/sidebar/page';
import DashboardHeader from '@/components/layout/header/DashboardHeader';
import LoadingDashboard from '@/app/(admin)/admin-dashboard/LoadingDashboard'

// Pages
import Dashboard from "@/app/(members-dashboard)/members-dashboard/dash/index";
import Announcement from '@/app/(members-dashboard)/members-dashboard/notification/Notification';
// import ConferencePortal from '@/app/(members-dashboard)/members-dashboard/conference/page';
import SeminarsWebinars from "@/app/(members-dashboard)/members-dashboard/seminars/page";
import MembersDirectory from '@/app/(members-dashboard)/members-dashboard/membersdirectory/page';
import IAIIEAResources from '@/app/(members-dashboard)/members-dashboard/resources/page';
import Forum from "@/app/(members-dashboard)/members-dashboard/forum/page";
import Payment from "@/app/(members-dashboard)/members-dashboard/payment/Payment";
import Settings from '@/app/(members-dashboard)/members-dashboard/settings/page';
import Resources from "@/app/(members-dashboard)/conference/resources/page"
import Participants from "@/app/(members-dashboard)/conference/participants/page"
import Conferences from "@/app/(members-dashboard)/members-dashboard/conference/page"
import SeminarResources from "@/app/(members-dashboard)/members-dashboard/training/resources/page"
import SeminarDirectory from "@/app/(members-dashboard)/members-dashboard/training/participants/page"
import ConfAnnouncement from "@/app/(members-dashboard)/members-dashboard/confAnnouncement/page"
import SeminarParticipants from "@/app/(members-dashboard)/members-dashboard/training/participants/page"
import SeminarAnnouncements from "@/app/(members-dashboard)/members-dashboard/training/announcements/page"

// TypeScript interfaces
interface ComponentMap {
  [key: string]: JSX.Element;
}

export default function DashboardClient() {
  const [activeComponent, setActiveComponent] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = (): JSX.Element => {
    const components: ComponentMap = {
      Dashboard: <Dashboard />,
      Announcement: <Announcement />,
      Payment: <Payment />,
      'Seminar Directory': <SeminarDirectory/>,
      'Conference Announcements': <ConfAnnouncement />,
      'Seminar Resources': <SeminarResources/>,
      'Seminar Participants': <SeminarParticipants/>,
      'Seminar Announcements': <SeminarAnnouncements />,
      'Participants': <Participants/>,
      'Resources': <Resources/>,
      'Conferences': <Conferences/>,
      // 'Conference Portal': <ConferencePortal />,
      'Seminars / Webinars': <SeminarsWebinars />,
      'Directory': <MembersDirectory />,
      'IAIIEA Resources': <IAIIEAResources />,
      Forum: <Forum />,
      Settings: <Settings />,
    };
  
    // Ensure Dashboard is rendered if activeComponent is not in the map or is undefined
    return components[activeComponent] || components['Dashboard'];
  };
  // Loading state while checking session
  if (status === 'loading') {
    return (
      <LoadingDashboard/>
    );
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
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      <div className="flex flex-grow h-full">
        {/* <button
          className="fixed left-4 top-20 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
          onClick={toggleSidebar}
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
        </button> */}

        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0`}
        >
          <Sidebar 
            setActiveComponent={setActiveComponent} 
            isMobileOpen={isSidebarOpen} 
            onMobileToggle={toggleSidebar} 
          />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="flex-grow pt-40 md:pt-44 md:pl-10 overflow-y-auto bg-[#F9FAFF]">
          <div className="max-w-7xl mx-auto">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
}