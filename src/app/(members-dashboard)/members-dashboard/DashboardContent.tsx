"use client"
import React, { useState, useEffect } from 'react';
import { SkeletonLoader } from './SkeletonLoader'; // Adjust the import path based on your structure
import { UserDataType } from '@/app/(members-dashboard)/members-dashboard/dash/types';

interface DashboardContentProps {
  user: UserDataType | null; // Allow `null` for loading state
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay for demonstration
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F9FAFF]">
        <div className="bg-gray-200 px-5 py-3 mb-6">
          <SkeletonLoader className="h-6 w-32 md:h-8 md:w-48" />
        </div>
        <SkeletonLoader className="h-10 w-48 md:h-12 md:w-64 mb-4" />
        <SkeletonLoader className="h-5 w-full md:w-3/4 mb-2" />
        <SkeletonLoader className="h-5 w-full md:w-1/2" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F9FAFF]">
      <div className="bg-gray-200 px-5 py-3 mb-6">
        <h1 className="text-md md:text-xl text-black">Dashboard</h1>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-black">
        Hi, {user?.name} 👋
      </h1>
      <div className="mt-4">
        <p className="text-gray-600 text-[15px] md:text-lg">
          Welcome to your dashboard, here you can access your conference portal and other features
        </p>
        {user?.registration && (
          <p className="text-md text-gray-500 mt-2 opacity-[0.6]">
            Membership status: {user.registration}
            <p className="pt-2">Conference status: Incomplete</p>
            <p className="pt-2">Seminar Status: Incomplete</p>
          </p>
        )}
      </div>

    </div>
  );
};
