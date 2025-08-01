"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import TrainingResourcesNew from './component/TrainingResourcesNew';
import Resources from '@/app/(admin)/admin-dashboard/training/component/resourcesPage'
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Create Conference Events');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Create Conference Events':
        return (
          <div className="bg-white dark:bg-transparent">
            <TrainingResourcesNew />
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
      {/* Uncomment this if you want to use the section selector */}
      {/* <div>
        <ButtonProp
          options={['Create Conference Events', 'Create Conference Resources']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div> */}

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;