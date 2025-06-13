"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import AnnouncementsPage from './Announcement';
import JobOpportunitiesPage from './Jobs';
import PortalAccessWrapper from '@/components/ProtectedRoute';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [selectedSection, setSelectedSection] = useState<SectionType>('Announcement');

  // Show warning and hide content if registration is incomplete
  if (session?.user?.userData?.registration === "incomplete") {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Your registration is incomplete. Please complete your registration to access all features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedSection) {
      case 'Announcement':
        return (
          <div>
            <AnnouncementsPage />
          </div>
        );
      case 'Job Opportunity':
        return (
          <div>
            <JobOpportunitiesPage />
          </div>
        );
      default:
        return null;
    }
  };

  return (

    <div className='p-6'>
      <div className='bg-gray-200 px-5 py-3 mb-6 '>
        <h1 className="text-lg md:text-2xl text-black">OPPORTUNITIES</h1>
      </div>
      <div>
        <ButtonProp
          options={['Announcement', 'Job Opportunity']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      <div className='py-10'>
        {/* Render the content based on the selected section */}
        {renderContent()}
      </div>
    </div>

  );
};

export default Page;