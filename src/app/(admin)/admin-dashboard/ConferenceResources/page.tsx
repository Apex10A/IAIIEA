"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import Events from '@/app/(admin)/admin-dashboard/ConferenceResources/events'
import Resources from '@/app/(admin)/admin-dashboard/ConferenceResources/ResourcesPage'
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Create Conference Events');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Create Conference Events':
        return (
          <div>
            <Events/>
          </div>
        );
      case 'Create Conference Resources':
        return (
          <div>
            <Resources/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='p-6'>
      <div className='bg-gray-200 px-5 py-3 mb-6 '>
        <h1 className='text-xl md:text-2xl text-gray-700'>Conferences</h1>
      </div>
      <div>
        <ButtonProp
          options={['Create Conference Events', 'Create Conference Resources']}
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