import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, MapPin, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

interface Conference {
  id: string;
  title: string;
  date: string;
  location?: string;
  venue?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  members?: any[];
  total_members?: number;
  theme?: string;
}

interface ConferenceMembersData {
  [conferenceId: string]: {
    members: any[];
    total: number;
  }
}

const statusConfig = {
  upcoming: {
    color: 'bg-amber-100 text-amber-800',
    icon: <Clock className="h-4 w-4" />,
    label: 'Upcoming'
  },
  ongoing: {
    color: 'bg-blue-100 text-blue-800',
    icon: <AlertCircle className="h-4 w-4" />,
    label: 'Ongoing'
  },
  completed: {
    color: 'bg-green-100 text-green-800',
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
          className="relative w-8 h-8 border-2 border-white rounded-full overflow-hidden shadow-sm"
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
            <div className="w-full h-full bg-[#0E1A3D] flex items-center justify-center text-white text-xs">
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
        <div className="relative w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white shadow-sm">
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
          const mappedConferences: Conference[] = data.data.map((conf: any) => ({
            id: conf.id.toString(),
            title: conf.title,
            date: conf.date,
            location: conf.venue,
            status: conf.status.toLowerCase() as 'upcoming' | 'ongoing' | 'completed',
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    
    if (dateString.toLowerCase().includes('to')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#0E1A3D]" />
            <h2 className="text-xl font-semibold text-gray-800">Conferences</h2>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center p-4 border rounded-lg animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#0E1A3D]" />
            <h2 className="text-xl font-semibold text-gray-800">Conferences</h2>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
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

  const displayConferences = conferences.slice(0, 2);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl min-h-[400px]"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-[#0E1A3D]" />
          <h2 className="text-xl font-semibold text-gray-800">Conferences</h2>
        </div>
        <Link 
          href="/admin-dashboard/conferences" 
          className="flex items-center bg-[#0E1A3D]/10 hover:bg-[#0E1A3D]/20 px-3 py-2 text-sm rounded-lg transition-colors"
        >
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {displayConferences.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Calendar className="h-12 w-12 mb-4 text-gray-300" />
          <p className="text-lg">No conferences scheduled</p>
          <p className="text-sm mt-1">Check back later for upcoming events</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayConferences.map((conference) => {
            const memberData = conferenceMembersData[conference.id] || { members: [], total: 0 };
            const status = statusConfig[conference.status] || statusConfig.upcoming;
            
            return (
              <motion.div
                key={conference.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{conference.title}</h3>
                    {conference.theme && (
                      <p className="text-sm text-gray-600 mt-1">{conference.theme}</p>
                    )}
                    
                    <div className="md:flex items-center mt-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      <span className='flex pb-3 md:pb-0'>{formatDate(conference.date)}</span>
                      {conference.location && (
                        <>
                          <span className="mx-2 hidden md:flex">•</span>
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span>{conference.location}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex items-center mr-4">
                        <Users className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span className="text-sm text-gray-600">
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