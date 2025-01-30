"use client"
import React, { useState } from 'react';
import { Check, Globe, Monitor } from 'lucide-react';
import { PaymentsStructure } from './fees';

// Define a type for the payment structure
// interface PaymentTier {
//   virtual: {
//     usd: string;
//     naira: string;
//   };
//   physical: {
//     usd: string;
//     naira: string;
//   };
//   package: string[];
// }

// interface PaymentsStructure {
//   basic: PaymentTier;
//   standard: PaymentTier;
//   premium: PaymentTier;
// }

interface ConferenceFeesPageProps {
  payments: PaymentsStructure;
  children?: React.ReactNode;
}

const ConferenceFeesPage = ({ payments }: { payments: PaymentsStructure }) => {
  const [attendanceType, setAttendanceType] = useState<'virtual' | 'physical'>('physical');

  // Type guard to check if payments is a valid PaymentsStructure
  const isValidPaymentsStructure = (data: unknown): data is PaymentsStructure => {
    if (typeof data !== 'object' || data === null) return false;

    const requiredTiers = ['basic', 'standard', 'premium'];
    return requiredTiers.every(tier => 
      (data as any)[tier]?.virtual?.usd !== undefined &&
      (data as any)[tier]?.physical?.naira !== undefined &&
      Array.isArray((data as any)[tier]?.package)
    );
  };

  // Render empty state if payments is invalid
  if (!isValidPaymentsStructure(payments)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>No payment information available</p>
      </div>
    );
  }

  const renderPriceCard = (tier: keyof PaymentsStructure) => {
    const tierData = payments[tier];
    const price = tierData[attendanceType];

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
        <h3 className="text-2xl font-bold capitalize mb-4 text-[#1A2A5C]">{tier} Access</h3>
       
        <div className="flex justify-center items-center mb-4">
          <span className="text-4xl font-bold text-[#D5B93C]">
            ${price.usd} / ₦{price.naira}
          </span>
        </div>
       
        <ul className="space-y-3 mb-6">
          {tierData.package.map((item, index) => (
            <li key={index} className="flex items-center">
              <Check className="text-green-500 mr-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
       
        <button className="w-full bg-[#1A2A5C] text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Register Now
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#1A2A5C]">Conference Fees</h2>
     
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-2 flex items-center space-x-4 shadow-md">
          <button
            onClick={() => setAttendanceType('physical')}
            className={`flex items-center px-4 py-2 rounded-full ${attendanceType === 'physical' ? 'bg-[#D5B93C] text-black' : 'text-gray-600'}`}
          >
            <Monitor className="mr-2" /> Physical
          </button>
          <button
            onClick={() => setAttendanceType('virtual')}
            className={`flex items-center px-4 py-2 rounded-full ${attendanceType === 'virtual' ? 'bg-[#D5B93C] text-black' : 'text-gray-600'}`}
          >
            <Globe className="mr-2" /> Virtual
          </button>
        </div>
      </div>
     
      <div className="grid md:grid-cols-3 gap-8">
        {renderPriceCard('basic')}
        {renderPriceCard('standard')}
        {renderPriceCard('premium')}
      </div>
    </div>
  );
};

export default ConferenceFeesPage;

