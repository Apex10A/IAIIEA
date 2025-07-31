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
      <div className="container mx-auto pt-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Active Seminars
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover our upcoming and ongoing seminars designed to enhance your knowledge and skills in educational assessment
          </p>
          <div className="w-24 h-1 bg-[#D5B93C] mx-auto mt-8"></div>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {seminars?.map((seminar, index) => (
            <div 
              key={seminar.id}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
                         transform hover:-translate-y-1 cursor-pointer overflow-hidden
                         border border-gray-100 hover:border-[#D5B93C]/30"
                onClick={() => handleSeminarClick(seminar?.id)}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge 
                    className={`px-3 py-1 text-xs font-semibold ${
                      seminar?.status === 'Ongoing' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-[#D5B93C]/10 text-[#0B142F] border-[#D5B93C]/30'
                    }`}
                  >
                    {seminar?.status}
                  </Badge>
                </div>

                {/* Accent Line */}
                <div className="h-1 bg-gradient-to-r from-[#D5B93C] to-[#C4A93C] group-hover:h-2 transition-all duration-300"></div>
                
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-[#0B142F] mb-3 leading-tight group-hover:text-[#D5B93C] transition-colors">
                    {seminar?.title}
                  </h2>
                  
                  {/* Theme */}
                  <p className="text-[#0B142F]/70 mb-6 leading-relaxed line-clamp-3">
                    {seminar?.theme}
                  </p>
                  
                  {/* Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-[#0B142F]/60">
                      <div className="w-10 h-10 rounded-full bg-[#D5B93C]/10 flex items-center justify-center mr-3 group-hover:bg-[#D5B93C]/20 transition-colors">
                        <CalendarIcon className="w-5 h-5 text-[#D5B93C]" />
                      </div>
                      <span className="text-sm font-medium">{formatDate(seminar?.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-[#0B142F]/60">
                      <div className="w-10 h-10 rounded-full bg-[#D5B93C]/10 flex items-center justify-center mr-3 group-hover:bg-[#D5B93C]/20 transition-colors">
                        <MapPinIcon className="w-5 h-5 text-[#D5B93C]" />
                      </div>
                      <span className="text-sm font-medium">{seminar?.venue || 'Venue TBA'}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    className="w-full bg-[#D5B93C] text-white font-semibold py-3 px-6 rounded-lg
                             hover:bg-[#C4A93C] transition-all duration-200
                             flex items-center justify-center gap-2 group/btn
                             shadow-md hover:shadow-lg"
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
          ))}
        </div>

        {/* Empty State */}
        {seminars?.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 max-w-lg mx-auto border border-white/20">
              <div className="w-20 h-20 bg-[#D5B93C]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-[#D5B93C]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Active Seminars</h3>
              <p className="text-white/80 text-lg">Check back soon for upcoming seminars and educational events</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeminarListPage;