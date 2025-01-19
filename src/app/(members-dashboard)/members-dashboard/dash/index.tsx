'use client';

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { DashboardContent } from '../DashboardContent';

interface UserDataType {
  name: string;
  registration: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    }
  });

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no session, return null (though this should be handled by onUnauthenticated)
  if (!session?.user) {
    return null;
  }

  // Prepare user data
  const userData: UserDataType = {
    name: session.user.name || 'User',
    registration: (session.user as any).registration || '', // Adjust based on your session user type
  };

  return <DashboardContent user={userData} />;
}