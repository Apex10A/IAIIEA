"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  Mic, 
  Calendar, 
  BookOpen, 
  Activity,
  Clock,
  FileText,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCard {
  id: number;
  name: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface ActivityItem {
  id: string;
  type: 'member' | 'conference' | 'seminar';
  title: string;
  description: string;
  color: string;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<StatCard[]>([
    { 
      id: 1, 
      name: 'Total Members', 
      value: '0', 
      icon: Users, 
      description: 'Registered members'
    },
    { 
      id: 2, 
      name: 'Total Speakers', 
      value: '0', 
      icon: Mic, 
      description: 'Active speakers'
    },
    { 
      id: 3, 
      name: 'Total Conferences', 
      value: '0', 
      icon: Calendar, 
      description: 'Listed conferences'
    },
    { 
      id: 4, 
      name: 'Total Seminars', 
      value: '0', 
      icon: BookOpen, 
      description: 'Training seminars'
    },
    { 
      id: 5, 
      name: 'Conference Participants', 
      value: '0', 
      icon: Users, 
      description: 'Conference attendees'
    },
    { 
      id: 6, 
      name: 'Seminar Participants', 
      value: '0', 
      icon: Users, 
      description: 'Seminar attendees'
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, membersRes, conferencesRes, seminarsRes, confParticipantsRes, seminarParticipantsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/speaker`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/conference_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/seminar_member`, {
            headers: {
              'Authorization': `Bearer ${session?.user?.token}`
            }
          })
        ]);

        const [speakersData, membersData, conferencesData, seminarsData, confParticipantsData, seminarParticipantsData] = await Promise.all([
          speakersRes.json(),
          membersRes.json(),
          conferencesRes.json(),
          seminarsRes.json(),
          confParticipantsRes.json(),
          seminarParticipantsRes.json()
        ]);

        const activities: ActivityItem[] = [];
        
        if (membersData.data?.length > 0) {
          const recentMembers = membersData.data.slice(0, 2);
          recentMembers.forEach((member: { name?: string; user_id?: string }, index: number) => {
            activities.push({
              id: `member-${member.user_id ?? index}`,
              type: 'member',
              title: 'Member in directory',
              description: `${member.name || 'Member'} is registered on the platform`,
              color: 'bg-green-500'
            });
          });
        }
        if (conferencesData.data?.length > 0) {
          const recentConferences = conferencesData.data.slice(0, 1);
          recentConferences.forEach((conference: { title?: string; id?: number }, index: number) => {
            activities.push({
              id: `conference-${conference.id ?? index}`,
              type: 'conference',
              title: 'Conference listed',
              description: `${conference.title || 'Conference'} is on the platform`,
              color: 'bg-blue-500'
            });
          });
        }

        if (seminarsData.data?.length > 0) {
          const recentSeminars = seminarsData.data.slice(0, 1);
          recentSeminars.forEach((seminar: { title?: string; id?: number }, index: number) => {
            activities.push({
              id: `seminar-${seminar.id ?? index}`,
              type: 'seminar',
              title: 'Seminar listed',
              description: `${seminar.title || 'Seminar'} is on the platform`,
              color: 'bg-yellow-500'
            });
          });
        }

        setRecentActivity(activities.slice(0, 5));

        setStats([
          { 
            id: 1, 
            name: 'Total Members', 
            value: membersData?.data?.length.toString() || '0', 
            icon: Users, 
            description: 'Registered members'
          },
          { 
            id: 2, 
            name: 'Total Speakers', 
            value: speakersData?.data?.length.toString() || '0', 
            icon: Mic, 
            description: 'Active speakers'
          },
          { 
            id: 3, 
            name: 'Total Conferences', 
            value: conferencesData?.data?.length.toString() || '0', 
            icon: Calendar, 
            description: 'Listed conferences'
          },
          { 
            id: 4, 
            name: 'Total Seminars', 
            value: seminarsData?.data?.length.toString() || '0', 
            icon: BookOpen, 
            description: 'Training seminars'
          },
          { 
            id: 5, 
            name: 'Conference Participants', 
            value: confParticipantsData?.data?.length.toString() || '0', 
            icon: Users, 
            description: 'Conference attendees'
          },
          { 
            id: 6, 
            name: 'Seminar Participants', 
            value: seminarParticipantsData?.data?.length.toString() || '0', 
            icon: Users, 
            description: 'Seminar attendees'
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (session?.user?.token) {
      fetchData();
    }
  }, [session]);

  const StatCard = ({ stat }: { stat: StatCard }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {stat.name}
        </CardTitle>
        <stat.icon className="h-4 w-4 text-[#0E1A3D]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#0E1A3D]">
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            stat.value
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {stat.description}
        </p>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href }: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }) => (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => router.push(href)}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#0E1A3D]/10 rounded-lg group-hover:bg-[#0E1A3D]/20 transition-colors">
            <Icon className="h-6 w-6 text-[#0E1A3D]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#0E1A3D]">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0E1A3D]">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session?.user?.userData?.name || 'Admin'} 👋
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Counts below are live totals from the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.id * 0.1 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#0E1A3D] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add Member"
            description="Register a new member"
            icon={Users}
            href="/admin-dashboard/membership/directory"
          />
          <QuickActionCard
            title="Create Conference"
            description="Schedule a new conference"
            icon={Calendar}
            href="/admin-dashboard/conferences"
          />
          <QuickActionCard
            title="Post Announcement"
            description="Send an announcement"
            icon={Bell}
            href="/admin-dashboard/announcement"
          />
          <QuickActionCard
            title="Upload Resources"
            description="Add new resources"
            icon={FileText}
            href="/admin-dashboard/membership/members-resources"
          />
          <QuickActionCard
            title="Manage Schedule"
            description="Update conference schedule"
            icon={Clock}
            href="/admin-dashboard/conferences/conference-schedule"
          />
          <QuickActionCard
            title="View Payments"
            description="Check payment status"
            icon={Activity}
            href="/admin-dashboard/payment"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#0E1A3D] mb-1">Latest listings</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sample entries from current directories — not a real-time activity feed.
        </p>
        <Card>
          <CardContent className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No listings to show yet</p>
                <p className="text-sm text-gray-400">Members, conferences, and seminars will appear here once added</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 