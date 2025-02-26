"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/modules/ui/badge';
import '@/app/index.css'
import { CalendarIcon, MapPinIcon } from 'lucide-react';

// Interface for individual seminar
interface Seminar {
    id: number;           // Changed from string to number based on API response
    title: string;
    theme: string;
    venue: string;
    date: string;
    status: 'Ongoing' | 'Incoming' | 'Completed';  // Using literal types for status
    resources: any[];     // Could be more specific if we know the resource structure
}

// Interface for API response
interface ApiResponse {
    status: string;
    message: string;
    data: Seminar[];
}

const SeminarListPage = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch seminars');
        }

        const { status, message, data }: ApiResponse = await response.json();
        
        if (status === "success") {
          // Filter for only Incoming and Ongoing seminars
          const activeSeminars = data.filter(seminar => 
            seminar.status === 'Incoming' || 
            seminar.status === 'Ongoing'
          );
          
          // Sort by date (newest first)
          const sortedSeminars = activeSeminars.sort((a, b) => {
            const dateA = new Date(a.date.split(' To ')[0]);
            const dateB = new Date(b.date.split(' To ')[0]);
            return dateB.getTime() - dateA.getTime();
          });
          
          setSeminars(sortedSeminars);
        } else {
          throw new Error(message || 'Failed to fetch seminars');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const handleSeminarClick = (id: number) => {
    router.push(`/seminars/${id}`);
  };

  const formatDate = (dateString: string) => {
    const [startDate, endDate] = dateString.split(' To ');
    return (
      <span>
        {startDate} <span className="text-gray-400">to</span> {endDate}
      </span>
    );
  };

  const getStatusVariant = (status: Seminar['status']) => {
    switch (status) {
      case 'Ongoing':
        return 'success';
      case 'Incoming':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading seminars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 conference-bg bg-gray-50 px-4 md:px-8 lg:px-16 w-full">
      <div className=" pt-32">
        <h1 className="text-3xl font-bold mb-8 text-white">Active Seminars</h1>
        
        <div className="grid gap-6 relative md:grid-cols-2 lg:grid-cols-3">
          {seminars.map((seminar) => (
           <div>
             <div className='absolute h-full w-5 z-10 bg-[#e0ce7e]'></div>
            <div 
              key={seminar.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4 relative z-20">
                <h2 className="text-xl font-semibold ">{seminar.title}</h2>
                <Badge variant={getStatusVariant(seminar.status)} className='px-2 py-1'>
                  {seminar.status}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">{seminar.theme}</p>
              
             <div className='flex items-center justify-between'>
             <div className="space-y-2">
                <div className="flex items-center text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formatDate(seminar.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{seminar.venue || 'Venue TBA'}</span>
                </div>
              </div>
              <div>
                <button className="bg-[#e0ce7e] px-4 sm:px-5 py-2 text-[#0E1A3D] rounded-md w-full md:w-auto" onClick={() => handleSeminarClick(seminar.id)}>View details</button>
              </div>
             </div>
            </div>
           </div>
          ))}
        </div>

        {seminars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No active seminars found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeminarListPage;