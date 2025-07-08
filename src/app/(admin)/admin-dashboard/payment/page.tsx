"use client"
import React, { useState } from 'react';
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import PaymentHistory from './PaymentHistory'
import DuesSettings from './DuesSettings';
import PortalAccessWrapper from '@/components/ProtectedRoute';
import { SectionType } from '@/app/(members-dashboard)/members-dashboard/notification/buttonTs';

const Page = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Payment History');

  const renderContent = () => {
    switch (selectedSection) {
      case 'Payment History':
        return <PaymentHistory />;
      case 'Dues Settings':
        return <DuesSettings />;
      default:
        return null;
    }
  };

  return (
    <div className='p-4 md:p-6 lg:p-8 min-h-screen'>
      <div className='px-4 py-3 mb-6 mt-6 md:mt-10 shadow-sm rounded-lg bg-white/80 dark:bg-gray-900/80 border-l-8 border-primary'>
        <h1 className='text-xl md:text-2xl font-semibold text-primary dark:text-pink-300 drop-shadow'>
          {selectedSection}
        </h1>
      </div>
      
      <div className="mb-6">
        <ButtonProp
          options={['Payment History', 'Dues Settings']}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      <div className='py-6 md:py-10'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;