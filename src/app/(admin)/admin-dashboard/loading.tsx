"use client";

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Loading spinner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-[#203A87] dark:border-gray-700 dark:border-t-[#203A87]" />
            <div className="absolute inset-0 rounded-full h-12 w-12 border-3 border-transparent border-r-gray-300 dark:border-r-gray-600 animate-pulse" />
          </div>
        </motion.div>

        {/* Loading status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4"
        >
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Loading...
          </h2>

          {/* Loading indicators */}
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#203A87] dark:text-[#4267B2]" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Please wait
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#203A87] to-[#4267B2] animate-shimmer" />
          </div>
        </motion.div>
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
} 