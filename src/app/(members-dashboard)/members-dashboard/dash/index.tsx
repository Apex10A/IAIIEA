'use client';

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DashboardContent } from '../DashboardContent';

interface UserDataType {
  name: string;
  registration: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserDataType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUserData = localStorage.getItem('user_data');

    if (!token) {
      router.push('/login'); // Redirect to login if no token
    } else {
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          setUserData({
            name: parsedData.name || 'User',
            registration: parsedData.registration || '',
          });
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          router.push('/login'); // Redirect to login if parsing fails
        }
      } else {
        router.push('/login'); // Redirect if no user data found
      }
    }
  }, [router]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return <DashboardContent user={userData} />;
}
