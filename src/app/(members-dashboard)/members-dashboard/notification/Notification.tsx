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
      case 'job opportunity':
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
          options={['Announcement', 'job opportunity']}
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