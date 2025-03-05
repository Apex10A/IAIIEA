// components/DashboardConferences.jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useSession } from "next-auth/react";

interface Conference {
    id: string;
    title: string;
    date: string;
    location?: string;
    status: 'Incoming' | 'ongoing' | 'completed';
  }

const DashboardConferences = () => {


  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const { data: session } = useSession();
const bearerToken = session?.user?.token || session?.user?.userData?.token;
    

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
          }
          
        });

        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setConferences(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch conferences');
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

    fetchConferences();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Show only first 3 conferences on dashboard
  const displayConferences = conferences.slice(0, 3);

  if (loading) {
    return (
      <div className=" rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Conferences</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 pb-3 border-b last:border-0">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <h2 className="text-xl font-semibold mb-4">Conferences</h2>
        <div className="p-4 text-red-500 bg-red-50 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
      <Calendar className="h-6 w-6 mb-1" />
      <h2 className="text-xl font-semibold">Conferences</h2>
      </div>
        <Link href="/conferences" className="flex items-center bg-gray-200 px-3 py-1 text-sm rounded-lg">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <hr className='mb-4'/>

      {displayConferences.length === 0 ? (
        <div className="text-gray-500 p-4 bg-gray-50 rounded text-center">
          No conferences available
        </div>
      ) : (
        <div className="space-y-4">
          {displayConferences.map((conference) => (
            <div 
              key={conference.id} 
              className="flex items-center border-b pb-3 last:border-0"
            >
              <div className="mr-4 flex flex-col items-center">
                {/* <Calendar className="h-6 w-6 text-blue-500 mb-1" /> */}
                <span className="text-xs font-medium text-gray-500">
                  {conference.date}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">{conference.title}</h3>
                {conference.location && (
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {conference.location}
                  </div>
                )}
              </div>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  conference.status === 'Incoming' 
                    ? 'bg-green-100 text-green-800'
                    : conference.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800'
                     : conference.status === 'completed'
                     ? 'bg-red-100 text-red-800'
                     : 'bg-red-100 text-red-800'
                }`}
              >
                {conference.status || 'Unknown'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardConferences;