"use client"
import React, { useState, useEffect } from 'react';
import { SkeletonLoader } from './SkeletonLoader';
import { UserDataType } from '@/app/(members-dashboard)/members-dashboard/dash/types';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Calendar from "./calendar"

interface DashboardContentProps {
  user: UserDataType | null;
  error?: string | null;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ user, error }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate error for demonstration (remove in production)
      // setLocalError("Failed to load user data");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (error || localError) {
    return (
      <div className="p-6 bg-[#F9FAFF] min-h-[300px] flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error || localError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F9FAFF] space-y-6">
        {/* Header Skeleton */}
        <div className="bg-gray-100 rounded-lg px-5 py-4">
          <SkeletonLoader className="h-6 w-32 md:h-7 md:w-48" />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="space-y-4">
          <SkeletonLoader className="h-9 w-48 md:h-10 md:w-64" />
          <div className="space-y-3">
            <SkeletonLoader className="h-4 w-full md:w-3/4" />
            <SkeletonLoader className="h-4 w-full md:w-2/3" />
          </div>
        </div>
        
        {/* Status Section Skeleton */}
        <div className="mt-6 space-y-3">
          <SkeletonLoader className="h-5 w-36" />
          <SkeletonLoader className="h-5 w-40" />
          <SkeletonLoader className="h-5 w-36" />
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    return status.toLowerCase() === 'complete' ? (
      <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
    ) : (
      <Loader2 className="w-4 h-4 text-yellow-500 inline ml-1 animate-spin" />
    );
  };

  return (
    <div className="p-6 bg-[#F9FAFF]">
      {/* Header */}
      <div className="bg-gray-100 rounded-lg px-5 py-4 mb-6 shadow-sm">
        <h1 className="text-lg md:text-xl font-medium text-gray-800">Dashboard Overview</h1>
      </div>
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'} 👋
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Manage your membership, conferences, and seminars all in one place.
        </p>
      </div>
      
      {/* Status Section */}
      {user?.registration && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Status</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="font-medium w-36">Membership:</span>
              <span className="flex-1">
                {user.registration}
                {getStatusIcon(user.registration)}
              </span>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-36">Conference:</span>
              <span className="flex-1">
                Incomplete
                {getStatusIcon('incomplete')}
              </span>
            </li>
            <li className="flex items-center">
              <span className="font-medium w-36">Seminar:</span>
              <span className="flex-1">
                Incomplete
                {getStatusIcon('incomplete')}
              </span>
            </li>
          </ul>
        </div>
      )}
      
      {/* Quick Actions (optional) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Upcoming Events</h3>
          <p className="text-sm text-blue-600">No upcoming events scheduled</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800 mb-2">Recent Activity</h3>
          <p className="text-sm text-green-600">No recent activity</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800 mb-2">Notifications</h3>
          <p className="text-sm text-purple-600">You have no new notifications</p>
        </div>
      </div>

     <div className='pt-10'>
     <Calendar/>
     </div>
    </div>
  );
};