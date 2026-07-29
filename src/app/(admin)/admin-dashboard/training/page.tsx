"use client"
import React, { Suspense, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import TrainingResourcesNew from './component/TrainingResourcesNew';
import Resources from '@/app/(admin)/admin-dashboard/training/component/resourcesPage'
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const TrainingResourcesFallback = () => (
  <div className="flex justify-center items-center min-h-[50vh] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Create Conference Events');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Create Conference Events':
        return (
          <div className="bg-white dark:bg-transparent">
            <Suspense fallback={<TrainingResourcesFallback />}>
              <TrainingResourcesNew />
            </Suspense>
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
