import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { ChevronRight, User, Mic, Globe, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Speaker {
  id: string;
  name: string;
  institution?: string;
  country?: string;
  profile_picture?: string;
  expertise?: string;
}

const DashboardSpeakers = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch speakers');
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setSpeakers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch speakers');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (bearerToken) fetchSpeakers();
  }, [bearerToken]);

  // Display first 6 speakers
  const displaySpeakers = speakers.slice(0, 6);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Mic className="h-6 w-6 text-[#0E1A3D] dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Speakers</h2>
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 border dark:border-gray-700 rounded-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Mic className="h-6 w-6 text-[#0E1A3D] dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Speakers</h2>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-200 p-4 rounded-lg">
          <p className="font-medium">Error loading speakers</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl min-h-[400px]"
    >
      <div className="flex justify-between items-center">
      
        {/* {speakers.length > 6 && (
          <Link 
            href="/admin/speakers" 
            className="flex items-center bg-[#0E1A3D]/10 dark:bg-gray-700 hover:bg-[#0E1A3D]/20 dark:hover:bg-gray-600 px-3 py-2 text-sm rounded-lg transition-colors text-[#0E1A3D] dark:text-gray-300"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )} */}
      </div>

      {displaySpeakers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <Mic className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg">No speakers available</p>
          <p className="text-sm mt-1">Add speakers to see them listed here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {displaySpeakers.map((speaker, index) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-700/30 transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {speaker.profile_picture ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#0E1A3D]/10 dark:border-gray-600">
                    <Image 
                      src={speaker.profile_picture} 
                      alt={speaker.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-[#0E1A3D] dark:bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {speaker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm dark:text-white text-gray-800 truncate">{speaker.name}</h3>
                  
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {speaker.institution && (
                      <>
                        <GraduationCap className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{speaker.institution}</span>
                      </>
                    )}
                  </div>
                  
                  {speaker.country && (
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <Globe className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{speaker.country}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {speaker.expertise && (
                <div className="mt-3">
                  <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                    {speaker.expertise}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSpeakers;