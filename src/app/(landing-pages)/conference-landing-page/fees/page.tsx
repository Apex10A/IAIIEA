import React, { useState } from 'react';
import { Check, Globe, Monitor } from 'lucide-react';

const ConferenceFeesPage: React.FC<{ payments: any }> = ({ payments }) => {
  const [attendanceType, setAttendanceType] = useState<'virtual' | 'physical'>('physical');

  const renderPriceCard = (tier: 'basic' | 'standard' | 'premium') => {
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
          {tierData.package.map((item: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
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