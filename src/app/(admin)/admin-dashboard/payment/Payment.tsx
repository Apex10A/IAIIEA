
"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import PaymentHistory from './PaymentHistory'
import DuesSettings from './DuesSettings';
import   PortalAccessWrapper   from '@/components/ProtectedRoute';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Payment History');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Payment History':
        return (
          <div>
            <PaymentHistory />
          </div>
        );
      case 'Dues Settings':
        return (
          <div>
            <DuesSettings />
          </div>
        );
      default:
        return null;
    }
  };

  return (
   
    <div className='p-6'>
       <div className='bg-gray-200 px-5 py-3 mb-6 mt-10'>
        <h1 className='text-xl md:text-2xl text-gray-700'>Payment History</h1>
      </div>
      <div>
        <ButtonProp
          options={['Payment History', 'Dues Settings']}
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