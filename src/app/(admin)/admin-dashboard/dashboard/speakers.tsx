// components/DashboardSpeakers.jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { ChevronRight } from 'lucide-react';


const DashboardSpeakers = () => {
  interface Speaker {
    id: string;
    name: string;
    institution?: string;
    country?: string;
  }

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`,
            {
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                },
            }    

        );
        
        
        if (!response.ok) {
          throw new Error('Failed to fetch speakers');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setSpeakers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch speakers');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  // Show only first 4 speakers on dashboard
  const displaySpeakers = speakers.slice(0, 6);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Speakers</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Speakers</h2>
        <div className="p-4 text-red-500 bg-red-50 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Speakers</h2>
        <Link href="/admin/speakers" className="flex items-center text-blue-600 hover:text-blue-800">
          See All Speakers
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {displaySpeakers.length === 0 ? (
        <div className="text-gray-500 p-4 bg-gray-50 rounded text-center">
          No speakers available
        </div>
      ) : (
        <div className="space-y-4 min-h-[400px]">
          {displaySpeakers.map((speaker) => (
            <div key={speaker.id} className="flex items-center border-b pb-3 last:border-0">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                {speaker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{speaker.name}</h3>
                <p className="text-sm text-gray-500">
                  {speaker.institution || speaker.country || 'Speaker'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSpeakers;