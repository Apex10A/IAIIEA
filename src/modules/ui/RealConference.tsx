import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiBookOpen, FiClock } from 'react-icons/fi';
import { Skeleton } from '@radix-ui/themes';
interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: any[];
  imageUrl?: string;
}

const ConferenceCards = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-sm">
              <Skeleton className="h-[250px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          // Add placeholder images if none provided
          const conferencesWithImages = data.data.map((conf: Conference, index: number) => ({
            ...conf,
            imageUrl: conf.imageUrl || getDefaultImage(index)
          }));
          setConferences(conferencesWithImages);
        } else {
          throw new Error(data.message || 'Failed to fetch conferences');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferences();
  }, []);

  const getDefaultImage = (index: number) => {
    const images = [
      '/conference-1.jpg',
      '/conference-2.jpg',
      '/conference-3.jpg',
      '/conference-4.jpg'
    ];
    return images[index % images.length];
  };

  const handleReadConference = (conferenceId: number) => {
    router.push(`/conference-landing-page?id=${conferenceId}`);
  };

  const formatDate = (dateString: string) => {
    const [datePart] = dateString.split('To').map(part => part.trim());
    const date = new Date(datePart);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-200' };
      case 'upcoming':
        return { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' };
      case 'ongoing':
        return { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', hover: 'hover:bg-gray-200' };
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-sm">
              <Skeleton className="h-[250px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-bold text-lg mb-2">Error Loading Conferences</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (conferences.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-8 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-bold text-xl mb-2">No Conferences Available</h3>
          <p className="mb-4">There are currently no conferences scheduled. Please check back later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0B142F] mb-12 text-center">
        Our Conferences
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {conferences.map((conference, index) => (
          <motion.div
            key={conference.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <Image
                src={conference.imageUrl || '/Meeting.png'}
                alt={conference.title}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className={`${getStatusColor(conference.status).bg} ${
                  getStatusColor(conference.status).text
                } text-xs font-semibold px-3 py-1 rounded-full`}>
                  {conference.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#0B142F] line-clamp-2">
                  {conference.title}
                </h3>
                <span className="bg-[#203A87]/10 text-[#203A87] text-sm font-semibold px-2 py-1 rounded">
                  {conference.title.split(' ')[1]}
                </span>
              </div>

              <p className="text-[#0B142F]/90 mb-5 line-clamp-2">
                {conference.theme}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2 text-[#203A87]" />
                  <span>{formatDate(conference.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2 text-[#203A87]" />
                  <span className="line-clamp-1">{conference.venue}</span>
                </div>
              </div>

              <button 
                onClick={() => handleReadConference(conference.id)}
                className="w-full bg-[#203A87] hover:bg-[#152a61] text-white font-medium py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <FiBookOpen className="mr-2" />
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ConferenceCards;