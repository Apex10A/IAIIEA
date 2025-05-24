import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Main loading container */}
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Logo placeholder */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Primary spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-[#203A87] dark:border-gray-700 dark:border-t-[#203A87]" />
            {/* Secondary spinner */}
            <div className="absolute inset-0 rounded-full h-12 w-12 border-3 border-transparent border-r-gray-300 dark:border-r-gray-600 animate-pulse" />
          </div>
        </div>

        {/* Loading status */}
        <div className="space-y-4 text-center">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Preparing Your Dashboard
          </h2>

          {/* Loading indicators */}
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#203A87] dark:text-[#4267B2]" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading your data...
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#203A87] to-[#4267B2] animate-shimmer" />
          </div>

          {/* Loading steps */}
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2 h-2 rounded-full bg-[#203A87] animate-pulse" />
              <span>Fetching Data</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2 h-2 rounded-full bg-[#203A87] animate-pulse" style={{ animationDelay: '150ms' }} />
              <span>Processing</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-2 h-2 rounded-full bg-[#203A87] animate-pulse" style={{ animationDelay: '300ms' }} />
              <span>Preparing UI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingDashboard;