import React from 'react';

const ConferenceResourcesSkeleton = () => {
  return (
    <div className="p-4 animate-pulse">
      {/* Header */}
      <div className="bg-gray-200 px-5 py-3 mb-4">
        <div className="h-8 bg-gray-300 rounded w-64"></div>
      </div>

      {/* Grid of Conference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(null).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            
            {/* Date row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            
            {/* Venue row */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Button */}
            <div className="h-9 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Selected Conference View (initially hidden) */}
      <div className="hidden">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-96"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>

          {/* Resources List */}
          <div className="space-y-4">
            {Array(3).fill(null).map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceResourcesSkeleton;