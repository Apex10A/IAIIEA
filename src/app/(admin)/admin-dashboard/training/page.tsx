"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import Events from '@/app/(admin)/admin-dashboard/conferences/component/events'
import TrainingResources from './component/TrainingResources';
import Resources from '@/app/(admin)/admin-dashboard/training/component/resourcesPage'
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Create Conference Events');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Create Conference Events':
        return (
          <div className="bg-white dark:bg-transparent">
            <TrainingResources/>
          </div>
        );
      case 'Create Conference Resources':
        return (
          <div className="bg-white dark:bg-transparent">
            <Resources/>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='bg-gray-50 dark:bg-transparent min-h-screen'>
      
      {/* <div>
        <ButtonProp
          options={['Create Conference Events', 'Create Conference Resources']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div> */}

      <div className=''>
        {/* Render the content based on the selected section */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;