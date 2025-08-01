"use client";

import React from 'react';
import { Seminar } from './types';
import { SeminarCard } from './SeminarCard';

interface SeminarListProps {
  seminars: Seminar[];
  onViewDetails: (seminar: Seminar) => void;
  selectedSeminar: Seminar | null;
}

const SeminarList: React.FC<SeminarListProps> = ({ 
  seminars, 
  onViewDetails,
  selectedSeminar 
}) => {
  // Filter out the currently selected seminar from the list
  const otherSeminars = seminars.filter(
    seminar => !selectedSeminar || seminar.id !== selectedSeminar.id
  );

  if (otherSeminars.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          Past Seminars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherSeminars.map((seminar) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeminarList;