'use client';

import React, { useState, useEffect } from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
// import { Lock } from 'lucide-react';

// Components
import Sidebar from '@/components/layout/sidebar/page';
import DashboardHeader from '@/components/layout/header/DashboardHeader';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';

// Pages
import Dashboard from "@/app/(members-dashboard)/members-dashboard/dash/index";
import Announcement from '@/app/(members-dashboard)/members-dashboard/notification/Notification';
import ConferencePortal from '@/app/(members-dashboard)/members-dashboard/conference/page';
import SeminarsWebinars from "@/app/(members-dashboard)/members-dashboard/seminars/page";
import MembersDirectory from "@/app/(members-dashboard)/members-dashboard/membersdirectory/page";
import IAIIEAResources from '@/app/(members-dashboard)/members-dashboard/resources/page';
import Gallery from '@/app/(members-dashboard)/members-dashboard/gallery/page';
import Forum from "@/app/(members-dashboard)/members-dashboard/forum/page";

// TypeScript interfaces
interface UserData {
  status: string;
  message: string;
  data: {
    token: string;
    user_data: {
      f_name: string;
      l_name: string;
      m_name: string;
      phone: string;
      email: string;
      registration: string;
      membership_due_date: string;
    };
    pending_payments: any[];
  };
}

interface ComponentMap {
  [key: string]: JSX.Element;
}

const DashboardLayout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('Dashboard');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // RedirectToSignIn();
      } else {
        setUserData({
          status: "success",
          message: "User data retrieved",
          data: {
            token: "",
            user_data: {
              f_name: user.firstName || '',
              l_name: user.lastName || '',
              m_name: "",
              phone: user.primaryPhoneNumber?.phoneNumber || '',  // Fixed here
              email: user.primaryEmailAddress?.emailAddress || '', // Also fixed email for consistency
              registration: "complete",
              membership_due_date: ""
            },
            pending_payments: []
          }
        });
      }
    }
  }, [user, isLoaded]);

  // Rest of the component remains the same
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = (): JSX.Element => {
    const components: ComponentMap = {
      Dashboard: <Dashboard />,
      Announcement: <Announcement />,
      'Conference Portal': <ConferencePortal />,
      'Seminars/Webinars': <SeminarsWebinars />,
      'Members Directory': <MembersDirectory />,
      Resources: <IAIIEAResources />,
      Gallery: <Gallery />,
      Forum: <Forum />
    };

    return components[activeComponent] || <Dashboard />;
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="pt-3 font-medium text-gray-600">Preparing dashboard...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#f9faff] overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <DashboardHeader />
      </div>

      <div className="flex flex-grow h-full">
        <button
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
        </button>

        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0`}
        >
          <Sidebar
            setActiveComponent={setActiveComponent}
          />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="flex-grow pt-32 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;