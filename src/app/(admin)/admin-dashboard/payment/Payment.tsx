import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/ui/table';
import PaymentHistory from './PaymentHistory'
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import DuesSettings from './DuesSettings';

// You might want to update this type in your buttonTs file
type SectionType = 'Payment History' | 'Dues Settings';

interface PaymentDetails {
  id: number;
  name: string;
  type: string;
  email: string;
  date: string;
  amount: number;
}
const truncateText = (text: string, maxLength: number = 20) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const Payment = () => {
  const [selectedSection, setSelectedSection] = useState<SectionType>('Payment History');
  
  const handleSectionChange = (section: SectionType) => {
    setSelectedSection(section);
  };

  return (
    <div className='p-6'>
       <div className='bg-gray-200 px-5 py-3 mb-6 mt-10'>
        <h1 className='text-2xl'>Payment History</h1>
      </div>
      <div>
        <ButtonProp 
          options={['Payment History', 'Dues Settings']} 
          selectedSection={selectedSection} 
          setSelectedSection={setSelectedSection} 
        />
      </div>
      {selectedSection === 'Payment History' ? (
        <div className='mt-10'>
          {/* Add PaymentHistory component or content here */}
          <PaymentHistory />
        </div>
      ) : (
        <div className='mt-10'>
          <DuesSettings/>
        </div>
      )}
    </div>
  )
}

export default Payment