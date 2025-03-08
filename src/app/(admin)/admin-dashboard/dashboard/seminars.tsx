import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import { useSession } from "next-auth/react";

// Avatar Group Component
const AvatarGroup = ({ members, totalMembers }: { members: any[], totalMembers: number }) => {
  // Limit displayed avatars to 5
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

interface Conference {
  id: string;
  title: string;
  date: string;
  location?: string;
  venue?: string;
  status: 'Incoming' | 'ongoing' | 'completed' | 'Completed';
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch conferences');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          // Map the API response to our interface
          const mappedConferences: Conference[] = data.data.map((conf: any) => ({
            id: conf.id.toString(),
            title: conf.title,
            date: conf.date,
            location: conf.venue,
            status: conf.status,
            theme: conf.theme
          }));
          
          setConferences(mappedConferences);
          
          // Fetch members data for each conference
          await fetchMembersForConferences(mappedConferences);
        } else {
          throw new Error(data.message || 'Failed to fetch conferences');
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

    const fetchMembersForConferences = async (confs: Conference[]) => {
      const membersData: ConferenceMembersData = {};
      
      // Only fetch for the first 3 conferences to display (optimization)
      const conferencesToFetch = confs.slice(0, 3);
      
      try {
        // Use Promise.all to fetch all member data concurrently
        await Promise.all(conferencesToFetch.map(async (conf) => {
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
            
            if (!response.ok) {
              throw new Error(`Failed to fetch members for conference ${conf.id}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
              membersData[conf.id] = {
                members: data.data || [],
                total: data.data?.length || 0
              };
            }
          } catch (error) {
            console.error(`Error fetching members for conference ${conf.id}:`, error);
            // Initialize with empty data if fetching fails
            membersData[conf.id] = {
              members: [],
              total: 0
            };
          }
        }));
        
        setConferenceMembersData(membersData);
      } catch (error) {
        console.error('Error fetching conference members:', error);
      }
    };

    if (bearerToken) {
      fetchConferences();
    }
  }, [bearerToken]);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    
    // Handle date ranges like "May 05 To July 05, 2025"
    if (dateString.toLowerCase().includes('to')) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Show only first 3 conferences on dashboard
  const displayConferences = conferences.slice(0, 3);

  if (loading) {
    return (
      <div className="rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Conferences</h2>
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
        <h2 className="text-xl font-semibold mb-4">Conferences</h2>
        <div className="p-4 text-red-500 bg-red-50 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 mb-1" />
          <h2 className="text-xl font-semibold">Seminars</h2>
        </div>
        <Link href="/conferences" className="flex items-center bg-gray-200 px-3 py-1 text-sm rounded-lg">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <hr className='mb-4'/>

      {displayConferences.length === 0 ? (
        <div className="text-gray-500 p-4 bg-gray-50 rounded text-center">
          No seminars available
        </div>
      ) : (
        <div className="space-y-4">
          {displayConferences.map((conference) => {
            const memberData = conferenceMembersData[conference.id] || { members: [], total: 0 };
            
            return (
              <div 
                key={conference.id} 
                className="flex items-center border-b pb-3 last:border-0"
              >
                <div className="mr-4 flex flex-col items-center">
                  {/* <span className="text-xs font-medium text-gray-500">
                    {formatDate(conference.date)}
                  </span> */}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{conference.title}</h3>
                  {conference.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {conference.location}
                    </div>
                  )}
                  {/* Members Avatar Group */}
                  <div className="flex items-center mt-2 space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {memberData.total} {memberData.total === 1 ? 'Participant' : 'Participants'}
                    </span>
                    {memberData.members.length > 0 && (
                      <AvatarGroup 
                        members={memberData.members} 
                        totalMembers={memberData.total} 
                      />
                    )}
                  </div>
                </div>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    conference.status === 'Incoming' 
                      ? 'bg-green-100 text-green-800'
                      : conference.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : conference.status === 'completed' || conference.status === 'Completed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {conference.status || 'Unknown'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardConferences;