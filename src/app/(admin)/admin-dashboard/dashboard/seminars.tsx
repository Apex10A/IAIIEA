import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import { useSession } from "next-auth/react";

// Avatar Group Component
const AvatarGroup = ({ members, totalMembers }: { members: any[], totalMembers: number }) => {
  const displayedMembers = members.slice(0, 5);
  const remainingMembers = Math.max(0, totalMembers - displayedMembers.length);

  return (
    <div className="flex items-center -space-x-3">
      {displayedMembers.map((member, index) => (
        <div 
          key={member.id || index} 
          className="relative w-8 h-8 border-2 border-white dark:border-gray-800 rounded-full overflow-hidden"
          style={{ 
            zIndex: 5 - index,
            transform: `translateX(${index * 15}px)` 
          }}
        >
          {member.profile_picture ? (
            <Image 
              src={member.profile_picture} 
              alt={member.name || `Member ${index + 1}`} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-xs">
              {(member.name || 'M')
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>
      ))}
      
      {remainingMembers > 0 && (
        <div 
          className="relative w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800"
          style={{ 
            zIndex: 0,
            transform: `translateX(${displayedMembers.length * 15}px)`
          }}
        >
          +{remainingMembers}
        </div>
      )}
    </div>
  );
};

interface Seminar {
  id: string;
  title: string;
  date: string;
  location?: string;
  venue?: string;
  status: 'Incoming' | 'Completed';
  members?: any[];
  total_members?: number;
  theme?: string;
}

interface SeminarMembersData {
  [seminarId: string]: {
    members: any[];
    total: number;
  }
}

const DashboardSeminars = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [seminarMembersData, setSeminarMembersData] = useState<SeminarMembersData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch seminars');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          const mappedSeminars: Seminar[] = data.data
            .filter((seminar: any) => seminar.status !== 'Completed')
            .map((seminar: any) => ({
              id: seminar.id.toString(),
              title: seminar.title,
              date: seminar.date,
              location: seminar.venue,
              status: seminar.status as 'Incoming' | 'Completed',
              theme: seminar.theme
            }));
          
          setSeminars(mappedSeminars);
          await fetchMembersForSeminars(mappedSeminars);
        } else {
          throw new Error(data.message || 'Failed to fetch seminars');
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

    const fetchMembersForSeminars = async (seminars: Seminar[]) => {
      const membersData: SeminarMembersData = {};
      const seminarsToFetch = seminars.slice(0, 3);
      
      try {
        await Promise.all(seminarsToFetch.map(async (seminar) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/seminar_member/${seminar.id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${bearerToken}`
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`Failed to fetch members for seminar ${seminar.id}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
              membersData[seminar.id] = {
                members: data.data || [],
                total: data.data?.length || 0
              };
            }
          } catch (error) {
            console.error(`Error fetching members for seminar ${seminar.id}:`, error);
            membersData[seminar.id] = {
              members: [],
              total: 0
            };
          }
        }));
        
        setSeminarMembersData(membersData);
      } catch (error) {
        console.error('Error fetching seminar members:', error);
      }
    };

    if (bearerToken) {
      fetchSeminars();
    }
  }, [bearerToken]);

  const displaySeminars = seminars.slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Upcoming Seminars</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 pb-3 border-b dark:border-gray-700 last:border-0">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Upcoming Seminars</h2>
        <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl min-h-[300px] ">
      {displaySeminars.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/30 rounded text-center">
          No upcoming seminars available
        </div>
      ) : (
        <div className="space-y-4 ">
          {displaySeminars.map((seminar) => {
            const memberData = seminarMembersData[seminar.id] || { members: [], total: 0 };
            
            return (
              <motion.div
                key={seminar.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-700/30 transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{seminar.title}</h3>
                    {seminar.theme && (
                      <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">{seminar.theme}</p>
                    )}
                    
                    <div className="md:flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className='flex items-center'>
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span className='flex'>{seminar.date}</span>
                      </div>
                      {seminar.venue && (
                        <>
                          <div className='flex items-center pt-2 md:pt-0'>
                            <span className="mx-2 hidden md:flex">•</span>
                            <MapPin className="h-4 w-4 mr-1.5" />
                            <span>{seminar.venue}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex items-center mr-4">
                        <Users className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300 flex">
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
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardSeminars;