import React from 'react';

const TableSkeletonLoader = () => {
  return (
    <div className="p-6 animate-pulse">
      {/* Header Section */}
      <div className="md:flex items-center justify-between mb-4">
        <div className="bg-gray-200 px-5 py-3 mb-6 w-64">
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-64 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="mt-6 w-full overflow-x-auto">
        <div className="min-w-[1200px] border rounded-lg">
          {/* Table Header */}
          <div className="bg-gray-50 border-b">
            <div className="grid grid-cols-7 gap-4 px-4 py-3">
              {Array(7).fill(null).map((_, index) => (
                <div key={`header-${index}`} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          {Array(8).fill(null).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="border-b">
              <div className="grid grid-cols-7 gap-4 px-4 py-4">
                {Array(7).fill(null).map((_, colIndex) => (
                  <div key={`cell-${rowIndex}-${colIndex}`} className="flex items-center">
                    {colIndex === 2 ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    ) : (
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="w-24 h-10 bg-gray-200 rounded"></div>
          {Array(3).fill(null).map((_, index) => (
            <div key={`page-${index}`} className="w-10 h-10 bg-gray-200 rounded"></div>
          ))}
          <div className="w-24 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeletonLoader;