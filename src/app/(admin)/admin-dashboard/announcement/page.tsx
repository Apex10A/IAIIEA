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
    <div className='p-4 md:p-6 space-y-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white px-5 py-4 rounded-lg border border-gray-200 shadow-sm'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-gray-900'>OPPORTUNITIES</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage announcements and job opportunities
          </p>
        </div>
        <ButtonProp
          options={['Announcement', 'Job Opportunity']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      <div className='min-h-[400px]'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;