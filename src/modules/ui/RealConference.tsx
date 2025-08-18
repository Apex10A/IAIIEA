"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiBookOpen } from 'react-icons/fi';
import { Skeleton } from '@radix-ui/themes';

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  resources: any[];
  imageUrl?: string;
}

const SeminarCards = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch seminars');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          const seminarsWithImages = data.data.map((seminar: Seminar, index: number) => ({
            ...seminar,
            imageUrl: seminar.imageUrl || getDefaultImage(index)
          }));
          setSeminars(seminarsWithImages);
        } else {
          throw new Error(data.message || 'Failed to fetch seminars');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  const getDefaultImage = (index: number) => {
    const images = [
      '/Meeting.png',
    ];
    return images[index % images.length];
  };

  const handleReadSeminar = (conferenceId: number) => {
    // Navigate to the conference details page with the conference ID
    router.push(`/conference?id=${conferenceId}`);
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
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B142F] mb-12 text-center">
          Our Conferences 
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
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
          <h3 className="font-bold text-lg mb-2">Error Loading Seminars</h3>
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

  if (seminars.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-8 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-bold text-xl mb-2">No Conferences Available</h3>
          <p className="mb-4">There are currently no seminars scheduled. Please check back later.</p>
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
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-xl md:text-3xl font-bold text-[#0B142F]">
          Our Conferences
        </h2>
        {seminars.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#203A87] hover:text-[#152a61] font-medium flex items-center gap-2 text-sm transition-colors"
          >
            {showAll ? 'Show Less' : 'See All'}
            <FiBookOpen className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(showAll ? seminars : seminars.slice(0, 3)).map((seminar, index) => (
          <motion.div
            key={seminar.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <Image
                src={seminar.imageUrl || '/Meeting.png'}
                alt={seminar.title}
                width={600}
                height={400}
                className="w-full h-[250px] object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className={`${getStatusColor(seminar.status).bg} ${
                  getStatusColor(seminar.status).text
                } text-xs font-semibold px-3 py-1 rounded-full`}>
                  {seminar.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#0B142F] line-clamp-2">
                  {seminar.title}
                </h3>
              </div>

              <p className="text-[#0B142F] mb-5 line-clamp-2">
                {seminar.theme}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2 text-[#203A87]" />
                  <span>{formatDate(seminar.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2 text-[#203A87]" />
                  <span className="line-clamp-1">{seminar.venue}</span>
                </div>
              </div>

              <button 
                onClick={() => handleReadSeminar(seminar.id)}
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

export default SeminarCards;