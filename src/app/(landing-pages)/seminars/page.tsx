"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/modules/ui/badge';
import '@/app/index.css'
import { CalendarIcon, MapPinIcon, ArrowRightIcon, Loader2 } from 'lucide-react';

interface Seminar {
    id: number;
    title: string;
    theme: string;
    venue: string;
    date: string;
    status: 'Ongoing' | 'Incoming' | 'Completed';  
    resources: any[];   
}

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
  
          const activeSeminars = data.filter(seminar => 
            seminar?.status === 'Incoming' || 
            seminar?.status === 'Ongoing'
          );

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
      <div className="conference-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#e0ce7e] mx-auto mb-4" />
          <p className="text-lg text-white">Loading seminars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conference-bg min-h-screen flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <p className="text-lg text-red-400 mb-2">Error loading seminars</p>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conference-bg min-h-screen pt-16 md:pt-24 px-4 md:px-8 lg:px-16 w-full pb-16">
      <div className="pt-32">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Active Seminars
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover our upcoming and ongoing seminars designed to enhance your knowledge and skills
          </p>
          <div className="w-24 h-1 bg-[#e0ce7e] mx-auto mt-6"></div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {seminars?.map((seminar, index) => (
            <div 
              key={seminar.id}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Accent Border */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#e0ce7e] to-[#d4c26a] z-10 group-hover:w-2 transition-all duration-300"></div>
              
              {/* Card */}
              <div 
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 cursor-pointer 
                         hover:shadow-2xl hover:bg-white transition-all duration-300 
                         transform hover:-translate-y-2 border border-white/20
                         group-hover:border-[#e0ce7e]/30"
                onClick={() => handleSeminarClick(seminar?.id)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#0E1A3D] transition-colors line-clamp-2">
                      {seminar?.title}
                    </h2>
                  </div>
                  <Badge 
                    variant={getStatusVariant(seminar?.status)} 
                    className={`px-3 py-1 text-xs font-semibold shrink-0 ${
                      seminar?.status === 'Ongoing' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {seminar?.status}
                  </Badge>
                </div>
                
                {/* Theme */}
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {seminar?.theme}
                </p>
                
                {/* Details and Action */}
                <div className="space-y-4">
                  {/* Date and Venue */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-500">
                      <div className="w-8 h-8 rounded-full bg-[#e0ce7e]/10 flex items-center justify-center mr-3">
                        <CalendarIcon className="w-4 h-4 text-[#e0ce7e]" />
                      </div>
                      <span className="text-sm font-medium">{formatDate(seminar?.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <div className="w-8 h-8 rounded-full bg-[#e0ce7e]/10 flex items-center justify-center mr-3">
                        <MapPinIcon className="w-4 h-4 text-[#e0ce7e]" />
                      </div>
                      <span className="text-sm font-medium">{seminar?.venue || 'Venue TBA'}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    <button 
                      className="w-full bg-gradient-to-r from-[#e0ce7e] to-[#d4c26a] 
                               text-[#0E1A3D] font-semibold py-3 px-6 rounded-lg
                               hover:from-[#d4c26a] hover:to-[#c8b65e] 
                               transform hover:scale-[1.02] transition-all duration-200
                               flex items-center justify-center gap-2 group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeminarClick(seminar?.id);
                      }}
                    >
                      View Details
                      <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {seminars?.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#e0ce7e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-[#e0ce7e]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Active Seminars</h3>
              <p className="text-white/70">Check back soon for upcoming seminars and events</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeminarListPage;