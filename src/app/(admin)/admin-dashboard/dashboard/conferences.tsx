import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

interface Conference {
  id: string;
  title: string;
  date: string;
  venue?: string;
  status: 'Incoming' | 'Completed';
  theme?: string;
}

interface ConferenceMembersData {
  [conferenceId: string]: {
    members: any[];
    total: number;
  }
}

const statusConfig = {
  Incoming: {
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    icon: <Clock className="h-4 w-4" />,
    label: 'Upcoming'
  },
  Completed: {
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
    label: 'Completed'
  }
};

const AvatarGroup = ({ members, totalMembers }: { members: any[], totalMembers: number }) => {
  const displayedMembers = members.slice(0, 5);
  const remainingMembers = Math.max(0, totalMembers - displayedMembers.length);

  return (
    <div className="flex items-center -space-x-3">
      {displayedMembers.map((member, index) => (
        <motion.div 
          key={member.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative w-8 h-8 border-2 border-white dark:border-gray-800 rounded-full overflow-hidden shadow-sm"
          style={{ zIndex: 5 - index }}
        >
          {member.profile_picture ? (
            <Image 
              src={member.profile_picture} 
              alt={member.name || `Member ${index + 1}`} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0E1A3D] dark:bg-gray-600 flex items-center justify-center text-white text-xs">
              {(member.name || 'M')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>
          )}
        </motion.div>
      ))}
      
      {remainingMembers > 0 && (
        <div className="relative w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800 shadow-sm">
          +{remainingMembers}
        </div>
      )}
    </div>
  );
};

const DashboardConferences = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [conferenceMembersData, setConferenceMembersData] = useState<ConferenceMembersData>({});
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

        if (!response.ok) throw new Error('Failed to fetch conferences');

        const data = await response.json();
        
        if (data.status === 'success') {
          const mappedConferences: Conference[] = data.data
            .filter((conf: any) => conf.status !== 'Completed')
            .map((conf: any) => ({
              id: conf.id.toString(),
              title: conf.title,
              date: conf.date,
              venue: conf.venue,
              status: conf.status as 'Incoming' | 'Completed',
              theme: conf.theme
            }));
          
          setConferences(mappedConferences);
          await fetchMembersForConferences(mappedConferences);
        } else {
          throw new Error(data.message || 'Failed to fetch conferences');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchMembersForConferences = async (confs: Conference[]) => {
      const membersData: ConferenceMembersData = {};
      
      try {
        await Promise.all(confs.slice(0, 3).map(async (conf) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/conference_member/${conf.id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${bearerToken}`
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.status === 'success') {
                membersData[conf.id] = {
                  members: data.data || [],
                  total: data.data?.length || 0
                };
              }
            }
          } catch (error) {
            console.error(`Error fetching members for conference ${conf.id}:`, error);
            membersData[conf.id] = { members: [], total: 0 };
          }
        }));
        
        setConferenceMembersData(membersData);
      } catch (error) {
        console.error('Error fetching conference members:', error);
      }
    };

    if (bearerToken) fetchConferences();
  }, [bearerToken]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#0E1A3D] dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Conferences</h2>
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center p-4 border dark:border-gray-700 rounded-lg animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700 min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#0E1A3D] dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Conferences</h2>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-200 p-4 rounded-lg">
          <p className="font-medium">Error loading conferences</p>
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

  const activeConferences = conferences.filter(conf => conf.status !== 'Completed');
  const displayConferences = activeConferences.slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl min-h-[300px] cursor-pointer dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        {activeConferences.length > 2 && (
          <Link href="/conferences" className="text-sm font-medium text-[#0E1A3D] dark:text-gray-300 hover:underline flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      {displayConferences.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 p-6">
          <Calendar className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg">No upcoming conferences</p>
          <p className="text-sm mt-1">Check back later for upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4 pb-6 ">
          {displayConferences.map((conference) => {
            const memberData = conferenceMembersData[conference.id] || { members: [], total: 0 };
            const status = statusConfig[conference.status] || statusConfig.Incoming;
            
            return (
              <motion.div
                key={conference.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-700/30 transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{conference.title}</h3>
                    {conference.theme && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{conference.theme}</p>
                    )}
                    
                    <div className="md:flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className='flex items-center'>
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span className='flex'>{conference.date}</span>
                      </div>
                      {conference.venue && (
                        <>
                          <div className='flex items-center pt-2 md:pt-0'>
                            <span className="mx-2 hidden md:flex">•</span>
                            <MapPin className="h-4 w-4 mr-1.5" />
                            <span>{conference.venue}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex items-center mr-4">
                        <Users className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 flex">
                          {memberData.total} {memberData.total === 1 ? 'Participant' : 'Participants'}
                        </span>
                      </div>
                      {memberData.members.length > 0 && (
                        <AvatarGroup 
                          members={memberData.members} 
                          totalMembers={memberData.total} 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.icon}
                    <span className="ml-1.5">{status.label}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardConferences;