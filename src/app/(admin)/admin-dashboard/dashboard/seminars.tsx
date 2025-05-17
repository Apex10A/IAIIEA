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
          className="relative w-8 h-8 border-2 border-white rounded-full overflow-hidden"
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
            <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs">
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
          className="relative w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
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
  status: 'Incoming' | 'Completed'; // Updated to match API response
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
          // Filter out completed seminars and map the remaining
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
          
          // Fetch members data for each seminar
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
      
      // Only fetch for the first 3 seminars to display (optimization)
      const seminarsToFetch = seminars.slice(0, 3);
      
      try {
        // Use Promise.all to fetch all member data concurrently
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
            // Initialize with empty data if fetching fails
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

  // Show only first 3 seminars on dashboard
  const displaySeminars = seminars.slice(0, 3);

  if (loading) {
    return (
      <div className="rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Seminars</h2>
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
        <h2 className="text-xl font-semibold mb-4">Upcoming Seminars</h2>
        <div className="p-4 text-red-500 bg-red-50 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl min-h-[300px]">
      {/* <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 mb-1" />
          <h2 className="text-xl font-semibold">Seminars</h2>
        </div>
        <Link href="/seminars" className="flex items-center bg-gray-200 px-3 py-1 text-sm rounded-lg">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <hr className='mb-4'/> */}

      {displaySeminars.length === 0 ? (
        <div className="text-gray-500 p-4 bg-gray-50 rounded text-center">
          No upcoming seminars available
        </div>
      ) : (
        <div className="space-y-4">
          {displaySeminars.map((seminar) => {
            const memberData = seminarMembersData[seminar.id] || { members: [], total: 0 };
            
            return (
                        <motion.div
                          key={seminar.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{seminar.title}</h3>
                              {seminar.theme && (
                                <p className="text-sm text-gray-800 mt-1">{seminar.theme}</p>
                              )}
                              
                              <div className="md:flex items-center mt-3 text-sm text-gray-500">
                              <div className='flex items-center'>
                                  <Calendar className="h-4 w-4 mr-1.5" />
                                <span className='flex'>{seminar.date}</span>
                              </div>
                                {seminar.venue && (
                                  <>
                                  <div className='flex items-center pt-2'>
                                      <span className="mx-2 hidden md:flex">•</span>
                                    <MapPin className="h-4 w-4 mr-1.5" />
                                    <span>{seminar.venue}</span>
                                  </div>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center mt-3">
                                <div className="flex items-center mr-4">
                                  <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                                  <span className="text-sm text-gray-600 flex">
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
                            
                            {/* <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              <span className="ml-1.5">{status.label}</span>
                            </div> */}
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