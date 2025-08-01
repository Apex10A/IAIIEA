"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { Seminar } from './types';

export interface SeminarCardProps {
  seminar: Seminar;
  onViewDetails: (seminar: Seminar) => void;
}

export const SeminarCard: React.FC<SeminarCardProps> = ({ seminar, onViewDetails }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 group transform hover:-translate-y-1">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-gray-900 dark:text-white text-lg font-semibold line-clamp-2">
          {seminar.title}
        </h2>
        <span
          className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
            seminar?.status === "Completed"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {seminar?.status}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {seminar.theme}
      </p>
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-6">
        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{seminar.date}</p>
      </div>
    </div>
    <div className="px-6 pb-6">
      <button
        onClick={() => onViewDetails(seminar)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        View Details
      </button>
    </div>
  </div>
);