"use client";

import React from 'react';
import { Seminar } from './types';
import { SeminarCard } from './SeminarCard';

interface SeminarListProps {
  seminars: Seminar[];
  onViewDetails: (seminar: Seminar) => void;
}

const SeminarList: React.FC<SeminarListProps> = ({
  seminars,
  onViewDetails,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        All Seminars
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({seminars.length})
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seminars.map((seminar) => (
          <SeminarCard
            key={seminar.id}
            seminar={seminar}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default SeminarList;
