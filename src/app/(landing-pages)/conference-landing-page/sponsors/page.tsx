import React from 'react';
import { Users } from 'lucide-react';

type PageProps = Record<string, unknown> & {
  sponsors?: string[];
};

type Diff<T, U, K extends string = 'default'> = 
  Omit<T, K> & 
  Partial<Omit<U, keyof T>> & 
  Record<string, unknown>;
  
const SponsorsPage: React.FC<{ sponsors: string[] }> = ({ sponsors }) => {
  if (!sponsors || sponsors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Users className="w-24 h-24 mb-4" />
        <h2 className="text-2xl font-semibold">No Sponsors Yet</h2>
        <p className="text-gray-400">Sponsorship details will be updated soon</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
      {sponsors.map((sponsorLogo, index) => (
        <div 
          key={index} 
          className="flex items-center justify-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
        >
          <img 
            src={sponsorLogo} 
            alt={`Sponsor ${index + 1}`} 
            className="max-h-20 max-w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default SponsorsPage;