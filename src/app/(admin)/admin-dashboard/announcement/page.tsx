"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import AnnouncementsPage from './Announcement';
import JobOpportunitiesPage from './Jobs';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Announcement');

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
    <div className='p-6 min-h-screen'>
      <div className='bg-gray-100  px-5 py-4 mb-6 rounded-lg border border-gray-200  shadow-sm'>
        <h1 className='text-xl md:text-2xl font-semibold text-gray-800 '>OPPORTUNITIES</h1>
        <p className="text-sm text-gray-500  mt-1">
          Manage announcements and job opportunities
        </p>
      </div>
      
      <div className="mb-6">
        <ButtonProp
          options={['Announcement', 'Job Opportunity']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      <div className='py-6'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;