import React from 'react';

const LoadingDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="relative">
        {/* Main spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500" />
        
        {/* Subtle secondary spinner */}
        <div 
          className="absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-transparent border-r-gray-300"
          style={{ 
            animation: 'spin 2s linear infinite'
          }} 
        />
      </div>

      {/* Loading text with shimmer effect */}
      <div className="mt-8 space-y-2 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Preparing Dashboard
        </h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" />
          <div 
            className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Loading your data...
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{
            animation: 'progress 2s ease-in-out infinite',
            width: '100%'
          }}
        />
      </div>

      {/* Inline styles for the progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingDashboard;