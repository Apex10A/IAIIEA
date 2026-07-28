"use client"
import React, { Suspense, useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import Events from '@/app/(admin)/admin-dashboard/conferences/component/events'
import ConferenceResources from './component/ConferenceResources';
import Resources from '@/app/(admin)/admin-dashboard/conferences/component/ResourcesPage'
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';
import { Loader2 } from 'lucide-react';

const ConferenceResourcesFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Create Conference Events');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Create Conference Events':
        return (
          <div>
            <Suspense fallback={<ConferenceResourcesFallback />}>
              <ConferenceResources/>
            </Suspense>
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
    <div className=''>
      {/* <div className=' px-5 py-3 mb-6 '>
        <h1 className='text-xl md:text-2xl text-gray-700 dark:text-gray-300'>Conferences</h1>
      </div> */}
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